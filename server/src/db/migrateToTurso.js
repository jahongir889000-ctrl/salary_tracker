import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@libsql/client';
import { DB_PATH, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '../config/index.js';

/**
 * Скрипт миграции существующих данных из локальной SQLite в облачную базу Turso (LibSQL)
 * Запуск: npm run migrate:turso
 */
async function migrateToTurso() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN || TURSO_AUTH_TOKEN;

  if (!tursoUrl) {
    console.error('❌ Ошибка: переменная TURSO_DATABASE_URL не задана!');
    console.log('💡 Задайте переменные окружения TURSO_DATABASE_URL и TURSO_AUTH_TOKEN:');
    console.log('   Windows PowerShell:');
    console.log('     $env:TURSO_DATABASE_URL="libsql://your-db-org.turso.io"');
    console.log('     $env:TURSO_AUTH_TOKEN="your-token"');
    console.log('     npm run migrate:turso\n');
    process.exit(1);
  }

  console.log('🚀 Начало миграции данных в Turso...');
  console.log(`📡 URL базы Turso: ${tursoUrl}`);

  let localDb;
  let tursoClient;

  try {
    // 1. Подключаемся к локальной SQLite
    console.log(`📁 Чтение локальной базы данных: ${DB_PATH}`);
    localDb = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    // 2. Подключаемся к Turso
    tursoClient = createClient({
      url: tursoUrl,
      authToken: tursoToken || undefined,
    });

    // 3. Создаем схему таблиц в Turso
    console.log('⚙️ Проверка и создание схемы таблиц в Turso...');
    await tursoClient.execute('PRAGMA foreign_keys = ON;');
    await tursoClient.executeMultiple(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        comment TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        comment TEXT,
        is_recurring INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

    // 4. Миграция пользователей
    const users = await localDb.all('SELECT * FROM users');
    console.log(`👤 Найдено пользователей в локальной БД: ${users.length}`);
    let migratedUsers = 0;
    for (const u of users) {
      const res = await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [u.id, u.email, u.name, u.password_hash, u.created_at, u.updated_at],
      });
      if (res.rowsAffected > 0) migratedUsers++;
    }
    console.log(`✅ Пользователей перенесено: ${migratedUsers} из ${users.length}`);

    // 5. Миграция доходов
    const incomes = await localDb.all('SELECT * FROM incomes');
    console.log(`📈 Найдено записей доходов в локальной БД: ${incomes.length}`);
    let migratedIncomes = 0;
    for (const inc of incomes) {
      const res = await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO incomes (id, user_id, amount, date, category, comment, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [inc.id, inc.user_id, inc.amount, inc.date, inc.category, inc.comment, inc.created_at, inc.updated_at],
      });
      if (res.rowsAffected > 0) migratedIncomes++;
    }
    console.log(`✅ Доходов перенесено: ${migratedIncomes} из ${incomes.length}`);

    // 6. Миграция расходов
    const expenses = await localDb.all('SELECT * FROM expenses');
    console.log(`📉 Найдено записей расходов в локальной БД: ${expenses.length}`);
    let migratedExpenses = 0;
    for (const exp of expenses) {
      const res = await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO expenses (id, user_id, amount, date, category, comment, is_recurring, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          exp.id,
          exp.user_id,
          exp.amount,
          exp.date,
          exp.category,
          exp.comment,
          exp.is_recurring ?? 0,
          exp.created_at,
          exp.updated_at,
        ],
      });
      if (res.rowsAffected > 0) migratedExpenses++;
    }
    console.log(`✅ Расходов перенесено: ${migratedExpenses} из ${expenses.length}`);

    console.log('\n🎉 Миграция данных в Turso успешно завершена!');
  } catch (error) {
    console.error('❌ Ошибка во время миграции:', error);
    process.exit(1);
  } finally {
    if (localDb) await localDb.close();
    if (tursoClient) tursoClient.close();
  }
}

migrateToTurso();
