import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env для локальной разработки (без внешних зависимостей)
for (const p of [path.join(__dirname, '../../.env'), path.join(__dirname, '../.env'), path.join(__dirname, '../../server/.env')]) {
  try {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      });
    }
  } catch {
    // Игнорируем ошибки чтения .env
  }
}

// Порт сервера
export const PORT = process.env.PORT || 3001;

// Путь к файлу базы данных SQLite
export const DB_PATH = path.join(__dirname, '../../salary_tracker.db');

// Настройки Turso (LibSQL)
export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || '';
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

// Секретный ключ для JWT-токенов
// В production используйте переменную окружения JWT_SECRET
export const SECRET_KEY = process.env.JWT_SECRET || 'salary-tracker-secret-key-2026-change-in-production';

// Настройки CORS
export const CORS_OPTIONS = {
  origin: process.env.CLIENT_URL
    ? (process.env.CLIENT_URL.includes(',')
      ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
      : (process.env.CLIENT_URL === '*' ? true : process.env.CLIENT_URL))
    : true,
  credentials: true,
};