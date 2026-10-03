import { get, post, put, del } from './api.js';

/**
 * Получить все доходы с опциональными фильтрами
 * @param {Object} filters - параметры фильтрации (page, limit, category, dateFrom, dateTo)
 * @returns {Promise<Object>} { data: Array, pagination: { total, page, limit } }
 */
export async function getIncomes(filters = {}) {
  const response = await get('/incomes', filters);
  
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
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<Object>} объект дохода
 */
export async function getIncomeById(id) {
  return await get(`/incomes/${id}`);
}

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода { amount, date, category, comment }
 * @returns {Promise<Object>} созданный доход
 */
export async function addIncome(incomeData) {
  return await post('/incomes', incomeData);
}

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} incomeData - новые данные дохода
 * @returns {Promise<Object>} обновлённый доход
 */
export async function updateIncome(id, incomeData) {
  return await put(`/incomes/${id}`, incomeData);
}

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<void>}
 */
export async function deleteIncome(id) {
  await del(`/incomes/${id}`);
}