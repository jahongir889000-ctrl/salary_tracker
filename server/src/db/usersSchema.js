import { getDb } from './connection.js';

/**
 * Инициализация таблицы пользователей
 * Создаёт таблицу users, если она ещё не существует
 */
export async function initUsersTable() {
  const db = getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  console.log('✅ Таблица users инициализирована');
}