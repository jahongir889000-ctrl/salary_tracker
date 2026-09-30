import { get, post, put, del } from './api.js';

// Базовый путь для эндпоинтов расходов
const BASE_PATH = '/api/v1/expenses';

/**
 * Получить все расходы с фильтрами
 * @param {Object} filters - параметры фильтрации
 * @param {number} filters.page - номер страницы
 * @param {number} filters.limit - количество записей
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - дата до (YYYY-MM-DD)
 * @param {boolean} filters.isRecurring - фильтр по признаку регулярности
 * @returns {Promise<Array>} массив расходов
 */
export const getExpenses = async (filters = {}) => {
  try {
    const response = await get(BASE_PATH, filters);
    // Бэкенд возвращает { data: [...], total, page, limit }
    return response.data || [];
  } catch (error) {
    console.error('Ошибка получения расходов:', error);
    return [];
  }
};

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object|null>} объект расхода или null
 */
export const getExpenseById = async (id) => {
  if (!id) return null;
  
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Ошибка получения расхода ${id}:`, error);
    return null;
  }
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода (category, amount, date, comment, isRecurring)
 * @returns {Promise<Object|null>} созданный расход или null
 */
export const addExpense = async (expenseData) => {
  if (!expenseData) {
    console.error('addExpense: данные не переданы');
    return null;
  }

  try {
    const response = await post(BASE_PATH, expenseData);
    return response;
  } catch (error) {
    console.error('Ошибка добавления расхода:', error);
    return null;
  }
};

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} expenseData - новые данные расхода
 * @returns {Promise<Object|null>} обновлённый расход или null
 */
export const updateExpense = async (id, expenseData) => {
  if (!id || !expenseData) {
    console.error('updateExpense: id или данные не переданы');
    return null;
  }

  try {
    const response = await put(`${BASE_PATH}/${id}`, expenseData);
    return response;
  } catch (error) {
    console.error(`Ошибка обновления расхода ${id}:`, error);
    return null;
  }
};

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export const deleteExpense = async (id) => {
  if (!id) {
    console.error('deleteExpense: id не передан');
    return false;
  }

  try {
    await del(`${BASE_PATH}/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления расхода ${id}:`, error);
    return false;
  }
};