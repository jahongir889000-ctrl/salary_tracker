import { getIncomeCategoryIds, getExpenseCategoryIds } from '../utils/categories.js';

/**
 * Валидация данных операции (доход или расход)
 * @param {Object} data - данные для валидации
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {Object} объект с результатом { valid: boolean, errors: Array<string> }
 */
export function validateTransaction(data, type = 'expense') {
  const errors = [];

  // Проверка amount
  if (data.amount === undefined || data.amount === null) {
    errors.push('Поле amount обязательно');
  } else if (typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('Поле amount должно быть положительным числом');
  }

  // Проверка date
  if (!data.date) {
    errors.push('Поле date обязательно');
  } else if (!isValidDate(data.date)) {
    errors.push('Поле date должно быть в формате YYYY-MM-DD');
  }

  // Проверка category
  if (!data.category) {
    errors.push('Поле category обязательно');
  } else {
    const validCategories = type === 'income'
      ? getIncomeCategoryIds()
      : getExpenseCategoryIds();

    if (!validCategories.includes(data.category)) {
      errors.push(`Недопустимая категория: ${data.category}`);
    }
  }

  // Проверка comment (необязательное поле, но если есть - должно быть строкой)
  if (data.comment !== undefined && data.comment !== null && typeof data.comment !== 'string') {
    errors.push('Поле comment должно быть строкой');
  }

  // Проверка is_recurring (только для расходов)
  if (type === 'expense' && data.is_recurring !== undefined) {
    if (typeof data.is_recurring !== 'boolean' && data.is_recurring !== 0 && data.is_recurring !== 1) {
      errors.push('Поле is_recurring должно быть boolean или 0/1');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

/**
 * Проверка корректности даты в формате YYYY-MM-DD
 * @param {string} dateString - строка даты
 * @returns {boolean} true, если дата корректна
 */
function isValidDate(dateString) {
  // Регулярное выражение для формата YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  // Проверяем, что дата реально существует
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Middleware для валидации тела запроса
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {Function} Express middleware
 */
export function validateTransactionMiddleware(type = 'expense') {
  return (req, res, next) => {
    const validation = validateTransaction(req.body, type);

    if (!validation.valid) {
      const error = new Error('Ошибка валидации: ' + validation.errors.join(', '));
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    next();
  };
}