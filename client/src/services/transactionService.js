import { get, post, del } from './api';

/**
 * Получить баланс текущего пользователя
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export function getBalance() {
  return get('/summary/balance');
}

/**
 * Получить доходы текущего пользователя
 * @param {Object} params - параметры запроса (page, limit, category, dateFrom, dateTo)
 * @returns {Promise<Object>} { data: Array, total, page, limit }
 */
export function getIncomes(params = {}) {
  return get('/incomes', params);
}

/**
 * Получить расходы текущего пользователя
 * @param {Object} params - параметры запроса (page, limit, category, dateFrom, dateTo, isRecurring)
 * @returns {Promise<Object>} { data: Array, total, page, limit }
 */
export function getExpenses(params = {}) {
  return get('/expenses', params);
}

/**
 * Создать новый доход
 * @param {Object} data - { amount, date, category, comment }
 * @returns {Promise<Object>} созданный доход
 */
export function createIncome(data) {
  return post('/incomes', data);
}

/**
 * Создать новый расход
 * @param {Object} data - { amount, date, category, comment, isRecurring }
 * @returns {Promise<Object>} созданный расход
 */
export function createExpense(data) {
  return post('/expenses', data);
}

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<void>}
 */
export function deleteIncome(id) {
  return del(`/incomes/${id}`);
}

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<void>}
 */
export function deleteExpense(id) {
  return del(`/expenses/${id}`);
}