import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_PATH } from '../config/index.js';

// Получаем директорию текущего файла
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу схемы
const SCHEMA_PATH = path.resolve(__dirname, 'schema.sql');

// Объект базы данных (будет инициализирован ниже)
let db = null;

/**
 * Инициализация подключения к базе данных
 * Создаёт файл БД (если не существует) и выполняет схему
 */
async function initializeDatabase() {
  try {
    // Открываем соединение с базой данных
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Читаем SQL-схему из файла
    const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');

    // Выполняем схему (создаёт таблицы, если их нет)
    await db.exec(schema);

    console.log('✅ База данных успешно инициализирована');
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    process.exit(1);
  }
}

// Инициализируем БД при первом импорте модуля
initializeDatabase();

/**
 * Получение объекта базы данных
 * @returns {Object} объект базы данных sqlite
 */
export function getDb() {
  if (!db) {
    throw new Error('База данных ещё не инициализирована');
  }
  return db;
}

export default { getDb };