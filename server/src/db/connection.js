import { createClient } from '@libsql/client';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { DB_PATH, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '../config/index.js';

let db = null;

/**
 * Обертка над @libsql/client для обеспечения совместимости
 * с интерфейсом sqlite (get, all, run, exec, close)
 */
class LibsqlDbWrapper {
  constructor(client) {
    this.client = client;
  }

  async exec(sql) {
    await this.client.executeMultiple(sql);
  }

  async get(sql, params = []) {
    const rs = await this.client.execute({ sql, args: params });
    return rs.rows[0];
  }

  async all(sql, params = []) {
    const rs = await this.client.execute({ sql, args: params });
    return Array.from(rs.rows);
  }

  async run(sql, params = []) {
    const rs = await this.client.execute({ sql, args: params });
    return {
      lastID: rs.lastInsertRowid !== undefined ? Number(rs.lastInsertRowid) : undefined,
      changes: rs.rowsAffected,
    };
  }

  async close() {
    this.client.close();
  }
}

/**
 * Инициализация подключения к базе данных и создание таблиц
 */
export async function initDb() {
  try {
    if (TURSO_DATABASE_URL) {
      // Подключение к Turso (LibSQL)
      const client = createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN || undefined,
      });
      db = new LibsqlDbWrapper(client);
      console.log('🌐 Подключение к Turso успешно установлено');
    } else {
      // Открываем локальное соединение с SQLite
      db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database,
      });
      console.log('📁 Используется локальная база данных SQLite');
    }

    // Включаем поддержку внешних ключей
    await db.exec('PRAGMA foreign_keys = ON;');

    // Создаём таблицу пользователей
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Создаём таблицу доходов (с user_id для привязки к пользователю)
    await db.exec(`
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
    `);

    // Создаём таблицу расходов (с user_id для привязки к пользователю)
    await db.exec(`
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

    console.log('✅ База данных успешно инициализирована (включая таблицу users)');
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
}

/**
 * Получить экземпляр базы данных
 * @returns {Object} Экземпляр базы данных sqlite
 */
export function getDb() {
  if (!db) {
    throw new Error('База данных ещё не инициализирована. Вызовите initDb() перед использованием.');
  }
  return db;
}