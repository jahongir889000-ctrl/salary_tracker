import path from 'path';
import { fileURLToPath } from 'url';

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Порт сервера
export const PORT = process.env.PORT || 3001;

// Путь к файлу базы данных SQLite
export const DB_PATH = path.join(__dirname, '../../salary_tracker.db');

// Секретный ключ для JWT-токенов
// В production используйте переменную окружения JWT_SECRET
export const SECRET_KEY = process.env.JWT_SECRET || 'salary-tracker-secret-key-2026-change-in-production';

// Настройки CORS
export const CORS_OPTIONS = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};