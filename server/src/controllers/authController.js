import * as userService from '../services/userService.js';

/**
 * Регистрация нового пользователя
 * POST /api/v1/auth/register
 */
export async function register(req, res, next) {
  try {
    const { email, name, password } = req.body;

    // Простая валидация входных данных
    if (!email || !name || !password) {
      const error = new Error('Все поля обязательны: email, name, password');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Пароль должен содержать минимум 6 символов');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Простая проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Некорректный формат email');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Регистрируем пользователя
    const result = await userService.registerUser({ email, name, password });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Авторизация пользователя
 * POST /api/v1/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Простая валидация входных данных
    if (!email || !password) {
      const error = new Error('Все поля обязательны: email, password');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Авторизуем пользователя
    const result = await userService.loginUser({ email, password });

    res.json(result);
  } catch (error) {
    next(error);
  }
}