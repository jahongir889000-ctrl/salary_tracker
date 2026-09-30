import { get } from './api.js';
import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';

// Базовый путь для эндпоинтов сводки
const BASE_PATH = '/api/v1/summary';

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export const getBalance = async () => {
  try {
    const response = await get(`${BASE_PATH}/balance`);
    return {
      totalIncome: response.totalIncome || 0,
      totalExpense: response.totalExpense || 0,
      balance: response.balance || 0,
    };
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};

/**
 * Получить все операции (доходы + расходы), отсортированные по дате (новые сначала)
 * @param {number} limit - максимальное количество операций (по умолчанию без ограничений)
 * @returns {Promise<Array>} массив операций
 */
export const getAllTransactions = async (limit = null) => {
  try {
    // Получаем все доходы и расходы параллельно
    const [incomes, expenses] = await Promise.all([
      getIncomes({ limit: limit || 1000 }),
      getExpenses({ limit: limit || 1000 }),
    ]);

    // Объединяем в один массив
    const allTransactions = [...incomes, ...expenses];

    // Сортировка по дате (новые сначала), затем по createdAt
    allTransactions.sort((a, b) => {
      const dateA = new Date(a?.date || a?.createdAt || 0);
      const dateB = new Date(b?.date || b?.createdAt || 0);
      return dateB - dateA;
    });

    if (limit && limit > 0) {
      return allTransactions.slice(0, limit);
    }

    return allTransactions;
  } catch (error) {
    console.error('Ошибка получения всех операций:', error);
    return [];
  }
};

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} period - период ('all', 'today', 'week', 'month', 'year')
 * @returns {Promise<Array>} массив объектов { name, value } для recharts
 */
export const getByCategory = async (type = 'expense', period = 'all') => {
  try {
    // Формируем параметры запроса
    const params = { type };
    
    // Преобразуем период в даты (если не 'all')
    if (period !== 'all') {
      const { dateFrom, dateTo } = getPeriodDates(period);
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
    }

    const response = await get(`${BASE_PATH}/by-category`, params);
    
    // Преобразуем формат бэкенда в формат для recharts
    // Бэкенд: [{ category, label, total }]
    // Recharts: [{ name, value }]
    return (response || []).map(item => ({
      name: item.label || 'Прочее',
      value: item.total || 0,
    }));
  } catch (error) {
    console.error('Ошибка получения данных по категориям:', error);
    return [];
  }
};

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {number} monthsCount - количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} массив объектов { month, income, expense } для recharts
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  try {
    const response = await get(`${BASE_PATH}/by-month`, { months: monthsCount });
    
    // Бэкенд возвращает [{ month, income, expense }]
    // month в формате YYYY-MM, нужно преобразовать в короткое название месяца
    return (response || []).map(item => ({
      month: formatMonth(item.month),
      income: item.income || 0,
      expense: item.expense || 0,
    }));
  } catch (error) {
    console.error('Ошибка получения помесячной статистики:', error);
    return [];
  }
};

/**
 * Получить операцию по ID (из доходов или расходов)
 * @param {string} id - идентификатор операции
 * @returns {Promise<Object|null>} объект операции или null
 */
export const getTransactionById = async (id) => {
  if (!id) return null;

  try {
    // Пытаемся найти в доходах
    const income = await getIncomes({ limit: 1000 });
    const foundIncome = income.find(i => i?.id === id);
    if (foundIncome) return foundIncome;

    // Пытаемся найти в расходах
    const expenses = await getExpenses({ limit: 1000 });
    const foundExpense = expenses.find(e => e?.id === id);
    if (foundExpense) return foundExpense;

    return null;
  } catch (error) {
    console.error(`Ошибка получения операции ${id}:`, error);
    return null;
  }
};

/**
 * Вспомогательная функция: преобразование периода в даты
 * @param {string} period - период ('today', 'week', 'month', 'year')
 * @returns {Object} { dateFrom, dateTo } в формате YYYY-MM-DD
 */
function getPeriodDates(period) {
  const now = new Date();
  let dateFrom = null;
  let dateTo = null;

  switch (period) {
    case 'today':
      dateFrom = now.toISOString().split('T')[0];
      dateTo = dateFrom;
      break;
    
    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFrom = weekAgo.toISOString().split('T')[0];
      dateTo = now.toISOString().split('T')[0];
      break;
    }
    
    case 'month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFrom = startOfMonth.toISOString().split('T')[0];
      dateTo = now.toISOString().split('T')[0];
      break;
    }
    
    case 'year': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFrom = startOfYear.toISOString().split('T')[0];
      dateTo = now.toISOString().split('T')[0];
      break;
    }
    
    default:
      break;
  }

  return { dateFrom, dateTo };
}

/**
 * Вспомогательная функция: форматирование месяца из YYYY-MM в короткое название
 * @param {string} monthStr - строка в формате YYYY-MM
 * @returns {string} короткое название месяца (например, 'Янв')
 */
function formatMonth(monthStr) {
  if (!monthStr) return '';
  
  const [year, month] = monthStr.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];
  
  return months[monthIndex] || monthStr;
}