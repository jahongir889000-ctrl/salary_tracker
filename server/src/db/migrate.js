import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { DB_PATH } from '../config/index.js';

/**
 * Скрипт миграции базы данных
 * Проверяет, есть ли колонка user_id в таблицах incomes и expenses.
 * Если нет — пересоздаёт таблицы с новой схемой.
 * 
 * Запуск: node src/db/migrate.js
 */
async function migrate() {
  console.log('🔄 Запуск миграции базы данных...');

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    // Проверяем, существует ли таблица incomes
    const incomesTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='incomes'"
    );

    if (incomesTable) {
      // Проверяем, есть ли колонка user_id
      const columns = await db.all('PRAGMA table_info(incomes)');
      const hasUserId = columns.some((col) => col.name === 'user_id');

      if (!hasUserId) {
        console.log('⚠️  Таблица incomes не содержит колонку user_id. Пересоздаём...');
        await db.exec('DROP TABLE IF EXISTS incomes');
        await db.exec(`
          CREATE TABLE incomes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            comment TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
          )
        `);
        console.log('✅ Таблица incomes пересоздана с колонкой user_id');
      } else {
        console.log('✅ Таблица incomes уже содержит колонку user_id');
      }
    } else {
      console.log('ℹ️  Таблица incomes не существует (будет создана при старте сервера)');
    }

    // Проверяем, существует ли таблица expenses
    const expensesTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='expenses'"
    );

    if (expensesTable) {
      // Проверяем, есть ли колонка user_id
      const columns = await db.all('PRAGMA table_info(expenses)');
      const hasUserId = columns.some((col) => col.name === 'user_id');

      if (!hasUserId) {
        console.log('⚠️  Таблица expenses не содержит колонку user_id. Пересоздаём...');
        await db.exec('DROP TABLE IF EXISTS expenses');
        await db.exec(`
          CREATE TABLE expenses (
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
          )
        `);
        console.log('✅ Таблица expenses пересоздана с колонкой user_id');
      } else {
        console.log('✅ Таблица expenses уже содержит колонку user_id');
      }
    } else {
      console.log('ℹ️  Таблица expenses не существует (будет создана при старте сервера)');
    }

    console.log('🎉 Миграция завершена успешно!');
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await db.close();
  }
}

migrate();