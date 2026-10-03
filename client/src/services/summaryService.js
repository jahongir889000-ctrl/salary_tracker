import { get } from './api.js';
import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';

/**
 * Преобразует период ('today', 'week', 'month', 'year', 'all') в dateFrom и dateTo
 * @param {string} period - период
 * @returns {Object} { dateFrom, dateTo } — ISO-строки дат или undefined
 */
function periodToDates(period) {
  if (!period || period === 'all') {
    return {};
  }

  const now = new Date();
  let dateFrom;

  switch (period) {
    case 'today':
      dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case 'month':
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      dateFrom = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return {};
  }

  return {
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: now.toISOString().split('T')[0],
  };
}

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export async function getBalance() {
  const data = await get('/summary/balance');
  return {
    totalIncome: data.totalIncome || 0,
    totalExpense: data.totalExpense || 0,
    balance: data.balance || 0,
  };
}

/**
 * Получить все операции (доходы + расходы), отсортированные по дате (новые сначала)
 * @param {number} limit - максимальное количество операций (по умолчанию без ограничений)
 * @returns {Promise<Array>} массив операций
 */
export async function getAllTransactions(limit = null) {
  // Параметры запроса: если есть limit — запрашиваем с запасом, чтобы после объединения получить достаточно
  const fetchLimit = limit ? limit * 2 : 100;

  // Параллельно запрашиваем доходы и расходы
  const [incomesResponse, expensesResponse] = await Promise.all([
    getIncomes({ limit: fetchLimit }),
    getExpenses({ limit: fetchLimit }),
  ]);

  const incomes = incomesResponse.data || [];
  const expenses = expensesResponse.data || [];

  // Объединяем и сортируем по дате (новые сначала)
  const allTransactions = [...incomes, ...expenses].sort((a, b) => {
    const dateA = new Date(a?.date || a?.createdAt || 0);
    const dateB = new Date(b?.date || b?.createdAt || 0);
    return dateB - dateA;
  });

  if (limit && limit > 0) {
    return allTransactions.slice(0, limit);
  }

  return allTransactions;
}

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} period - период ('all', 'today', 'week', 'month', 'year')
 * @returns {Promise<Array>} массив объектов { name, value } для recharts
 */
export async function getByCategory(type = 'expense', period = 'all') {
  const dates = periodToDates(period);
  const data = await get('/summary/by-category', { type, ...dates });

  // Преобразуем ответ backend в формат, ожидаемый PieChart: { name, value }
  return (data || [])
    .filter((item) => item.total > 0)
    .map((item) => ({
      name: item.label || 'Прочее',
      value: item.total,
    }));
}

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {number} monthsCount - количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} массив объектов { month, income, expense } для recharts
 */
export async function getMonthlySummary(monthsCount = 6) {
  const data = await get('/summary/by-month', { months: monthsCount });

  // Преобразуем формат месяца из 'YYYY-MM' в короткое название (например, 'Сен')
  const monthNamesShort = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];

  return (data || []).map((item) => {
    // Извлекаем номер месяца из формата 'YYYY-MM'
    const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
    return {
      month: monthNamesShort[monthIndex] || item.month,
      income: item.income || 0,
      expense: item.expense || 0,
    };
  });
}

/**
 * Получить операцию по ID (из доходов или расходов)
 * @param {string} id - идентификатор операции
 * @returns {Promise<Object|null>} объект операции или null
 */
export async function getTransactionById(id) {
  if (!id) return null;

  try {
    // Параллельно ищем в доходах и расходах
    const [income, expense] = await Promise.allSettled([
      get(`/incomes/${id}`),
      get(`/expenses/${id}`),
    ]);

    if (income.status === 'fulfilled' && income.value) {
      return income.value;
    }
    if (expense.status === 'fulfilled' && expense.value) {
      return expense.value;
    }

    return null;
  } catch (error) {
    console.error('Ошибка получения операции по ID:', error);
    return null;
  }
}