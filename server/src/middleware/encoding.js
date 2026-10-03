/**
 * Middleware для установки кодировки UTF-8 в заголовках ответов
 * Гарантирует корректное отображение кириллицы и других символов
 */
export function setUtf8Encoding(req, res, next) {
  // Устанавливаем заголовок Content-Type с явным указанием charset
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
}