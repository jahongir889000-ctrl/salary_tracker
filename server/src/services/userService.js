import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/connection.js';
import { SECRET_KEY } from '../config/index.js';

// Количество раундов для хеширования паролей
const SALT_ROUNDS = 10;

/**
 * Преобразует строку базы данных (snake_case) в объект (camelCase)
 * @param {Object} row - строка из БД
 * @returns {Object} объект пользователя без пароля
 */
function mapRowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Регистрация нового пользователя
 * @param {Object} data - { email, name, password }
 * @returns {Promise<Object>} { user, token }
 */
export async function registerUser(data) {
  const db = getDb();
  const { email, name, password } = data;

  // Проверяем, существует ли пользователь с таким email
  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser) {
    const error = new Error('Пользователь с таким email уже существует');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  // Хешируем пароль
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Создаём пользователя
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, email.toLowerCase().trim(), name.trim(), passwordHash, now, now]
  );

  // Получаем созданного пользователя
  const userRow = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  const user = mapRowToUser(userRow);

  // Генерируем JWT-токен
  const token = generateToken(user);

  return { user, token };
}

/**
 * Авторизация пользователя
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} { user, token }
 */
export async function loginUser(data) {
  const db = getDb();
  const { email, password } = data;

  // Ищем пользователя по email
  const userRow = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

  if (!userRow) {
    const error = new Error('Неверный email или пароль');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Проверяем пароль
  const isValidPassword = await bcrypt.compare(password, userRow.password_hash);

  if (!isValidPassword) {
    const error = new Error('Неверный email или пароль');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const user = mapRowToUser(userRow);
  const token = generateToken(user);

  return { user, token };
}

/**
 * Найти пользователя по ID
 * @param {string} id - идентификатор пользователя
 * @returns {Promise<Object|null>} объект пользователя или null
 */
export async function findUserById(id) {
  const db = getDb();
  const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  return mapRowToUser(row);
}

/**
 * Генерация JWT-токена
 * @param {Object} user - объект пользователя { id, email, name }
 * @returns {string} JWT-токен
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    SECRET_KEY,
    { expiresIn: '7d' } // Токен действителен 7 дней
  );
}

/**
 * Проверка и декодирование JWT-токена
 * @param {string} token - JWT-токен
 * @returns {Object|null} декодированные данные или null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}