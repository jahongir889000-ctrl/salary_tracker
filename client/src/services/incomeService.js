import { get, post, put, del } from './api.js';

// Базовый путь для эндпоинтов доходов
const BASE_PATH = '/api/v1/incomes';

/**
 * Получить все доходы с фильтрами
 * @param {Object} filters - параметры фильтрации
 * @param {number} filters.page - номер страницы
 * @param {number} filters.limit - количество записей
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - дата до (YYYY-MM-DD)
 * @returns {Promise<Array>} массив доходов
 */
export const getIncomes = async (filters = {}) => {
  try {
    const response = await get(BASE_PATH, filters);
    // Бэкенд возвращает { data: [...], total, page, limit }
    return response.data || [];
  } catch (error) {
    console.error('Ошибка получения доходов:', error);
    return [];
  }
};

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<Object|null>} объект дохода или null
 */
export const getIncomeById = async (id) => {
  if (!id) return null;
  
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Ошибка получения дохода ${id}:`, error);
    return null;
  }
};

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода (category, amount, date, comment)
 * @returns {Promise<Object|null>} созданный доход или null
 */
export const addIncome = async (incomeData) => {
  if (!incomeData) {
    console.error('addIncome: данные не переданы');
    return null;
  }

  try {
    const response = await post(BASE_PATH, incomeData);
    return response;
  } catch (error) {
    console.error('Ошибка добавления дохода:', error);
    return null;
  }
};

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} incomeData - новые данные дохода
 * @returns {Promise<Object|null>} обновлённый доход или null
 */
export const updateIncome = async (id, incomeData) => {
  if (!id || !incomeData) {
    console.error('updateIncome: id или данные не переданы');
    return null;
  }

  try {
    const response = await put(`${BASE_PATH}/${id}`, incomeData);
    return response;
  } catch (error) {
    console.error(`Ошибка обновления дохода ${id}:`, error);
    return null;
  }
};

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export const deleteIncome = async (id) => {
  if (!id) {
    console.error('deleteIncome: id не передан');
    return false;
  }

  try {
    await del(`${BASE_PATH}/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления дохода ${id}:`, error);
    return false;
  }
};