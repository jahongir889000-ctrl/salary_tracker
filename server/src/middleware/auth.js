import { verifyToken } from '../services/userService.js';

/**
 * Middleware для проверки JWT-токена
 * Извлекает токен из заголовка Authorization: Bearer <token>
 * При успешной проверке добавляет req.user с данными пользователя
 */
export function authenticate(req, res, next) {
  // Получаем заголовок Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('Отсутствует токен авторизации');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }

  // Проверяем формат заголовка: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    const error = new Error('Некорректный формат токена авторизации');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }

  const token = parts[1];

  // Проверяем и декодируем токен
  const decoded = verifyToken(token);

  if (!decoded) {
    const error = new Error('Недействительный или просроченный токен');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }

  // Добавляем данные пользователя в запрос
  req.user = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
  };

  next();
}