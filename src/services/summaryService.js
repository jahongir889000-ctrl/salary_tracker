import { getIncomes } from './incomeService';
import { getExpenses } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { isDateInPeriod, getMonthNameShort } from '../utils/formatters';

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Object} { totalIncome, totalExpense, balance }
 */
export const getBalance = () => {
  const incomes = getIncomes() || [];
  const expenses = getExpenses() || [];

  const totalIncome = incomes.reduce((sum, income) => sum + (Number(income?.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + (Number(expense?.amount) || 0), 0);
  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

/**
 * Получить все операции (доходы + расходы), отсортированные по дате (новые сначала)
 * @param {number} limit - максимальное количество операций (по умолчанию без ограничений)
 * @returns {Array} массив операций
 */
export const getAllTransactions = (limit = null) => {
  const incomes = getIncomes() || [];
  const expenses = getExpenses() || [];

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
};

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} period - период ('all', 'today', 'week', 'month', 'year')
 * @returns {Array} массив объектов { name, value } для recharts
 */
export const getByCategory = (type = 'expense', period = 'all') => {
  const transactions = type === 'income' ? getIncomes() : getExpenses();
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Фильтрация по периоду
  const filtered = (transactions || []).filter((t) => isDateInPeriod(t?.date, period));

  // Группировка по категориям
  const grouped = {};
  (filtered || []).forEach((transaction) => {
    const categoryId = transaction?.category || 'other';
    const amount = Number(transaction?.amount) || 0;
    grouped[categoryId] = (grouped[categoryId] || 0) + amount;
  });

  // Преобразование в формат для recharts
  const result = Object.entries(grouped)
    .map(([categoryId, value]) => {
      const category = (categories || []).find((c) => c.id === categoryId);
      return {
        name: category?.label || 'Прочее',
        value,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return result;
};

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {number} monthsCount - количество последних месяцев (по умолчанию 6)
 * @returns {Array} массив объектов { month, income, expense } для recharts
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const incomes = getIncomes() || [];
  const expenses = getExpenses() || [];
  const now = new Date();

  // Генерируем список последних N месяцев
  const months = [];
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: getMonthNameShort(date.getMonth()),
    });
  }

  // Инициализируем статистику по каждому месяцу
  const summary = months.map((m) => ({
    month: m.label,
    income: 0,
    expense: 0,
  }));

  // Суммируем доходы по месяцам
  (incomes || []).forEach((income) => {
    const date = new Date(income?.date || income?.createdAt);
    const monthIndex = months.findIndex(
      (m) => m.year === date.getFullYear() && m.month === date.getMonth()
    );
    if (monthIndex !== -1) {
      summary[monthIndex].income += Number(income?.amount) || 0;
    }
  });

  // Суммируем расходы по месяцам
  (expenses || []).forEach((expense) => {
    const date = new Date(expense?.date || expense?.createdAt);
    const monthIndex = months.findIndex(
      (m) => m.year === date.getFullYear() && m.month === date.getMonth()
    );
    if (monthIndex !== -1) {
      summary[monthIndex].expense += Number(expense?.amount) || 0;
    }
  });

  return summary;
};

/**
 * Получить операцию по ID (из доходов или расходов)
 * @param {string} id - идентификатор операции
 * @returns {Object|null} объект операции или null
 */
export const getTransactionById = (id) => {
  if (!id) return null;

  const incomes = getIncomes() || [];
  const expenses = getExpenses() || [];

  const foundIncome = incomes.find((i) => i?.id === id);
  if (foundIncome) return foundIncome;

  const foundExpense = expenses.find((e) => e?.id === id);
  if (foundExpense) return foundExpense;

  return null;
};