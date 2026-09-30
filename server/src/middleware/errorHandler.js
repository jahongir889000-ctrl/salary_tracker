/**
 * Централизованный обработчик ошибок Express
 * Перехватывает все ошибки и возвращает ответ в едином формате
 * @param {Error} err - объект ошибки
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} next - функция next() Express
 */
export function errorHandler(err, req, res, next) {
  // Логируем ошибку в консоль для отладки
  console.error('❌ Ошибка:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Определяем HTTP-статус (по умолчанию 500 - внутренняя ошибка сервера)
  const statusCode = err.statusCode || err.status || 500;

  // Определяем код ошибки (для клиентской логики)
  const errorCode = err.code || 'INTERNAL_ERROR';

  // Формируем сообщение ошибки
  const message = err.message || 'Произошла внутренняя ошибка сервера';

  // Отправляем ответ в едином формате
  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
    },
  });
}

/**
 * Обработчик для несуществующих маршрутов (404)
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} next - функция next() Express
 */
export function notFoundHandler(req, res, next) {
  const error = new Error(`Маршрут не найден: ${req.method} ${req.path}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
}