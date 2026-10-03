import { get, post, put, del } from './api.js';

/**
 * Получить все расходы с опциональными фильтрами
 * @param {Object} filters - параметры фильтрации (page, limit, category, dateFrom, dateTo, isRecurring)
 * @returns {Promise<Object>} { data: Array, pagination: { total, page, limit } }
 */
export async function getExpenses(filters = {}) {
  const response = await get('/expenses', filters);
  
  // Адаптируем ответ backend под ожидаемый формат
  return {
    data: response.data || [],
    pagination: {
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
    },
  };
}

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object>} объект расхода
 */
export async function getExpenseById(id) {
  return await get(`/expenses/${id}`);
}

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода { amount, date, category, comment, isRecurring }
 * @returns {Promise<Object>} созданный расход
 */
export async function addExpense(expenseData) {
  return await post('/expenses', expenseData);
}

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} expenseData - новые данные расхода
 * @returns {Promise<Object>} обновлённый расход
 */
export async function updateExpense(id, expenseData) {
  return await put(`/expenses/${id}`, expenseData);
}

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<void>}
 */
export async function deleteExpense(id) {
  await del(`/expenses/${id}`);
}