import { getDb } from '../db/connection.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export async function getBalance() {
  const db = getDb();

  const incomeRow = await db.get('SELECT COALESCE(SUM(amount), 0) as total FROM incomes');
  const expenseRow = await db.get('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');

  const totalIncome = incomeRow.total;
  const totalExpense = expenseRow.total;
  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
}

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {Object} options - параметры фильтрации
 * @param {string} options.dateFrom - дата от (YYYY-MM-DD)
 * @param {string} options.dateTo - дата до (YYYY-MM-DD)
 * @returns {Promise<Array>} массив объектов { category, label, total }
 */
export async function getByCategory(type = 'expense', options = {}) {
  const db = getDb();
  const table = type === 'income' ? 'incomes' : 'expenses';
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Формируем условия WHERE
  const conditions = [];
  const params = [];

  if (options.dateFrom) {
    conditions.push('date >= ?');
    params.push(options.dateFrom);
  }
  if (options.dateTo) {
    conditions.push('date <= ?');
    params.push(options.dateTo);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Группируем по категориям
  const rows = await db.all(
    `SELECT category, SUM(amount) as total 
     FROM ${table} ${whereClause} 
     GROUP BY category 
     ORDER BY total DESC`,
    params
  );

  // Добавляем label для каждой категории
  return rows.map(row => {
    const categoryInfo = categories.find(cat => cat.id === row.category);
    return {
      category: row.category,
      label: categoryInfo?.label || 'Прочее',
      total: row.total,
    };
  });
}

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {Object} options - параметры фильтрации
 * @param {number} options.months - количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} массив объектов { month, income, expense }
 */
export async function getByMonth(options = {}) {
  const db = getDb();
  const months = Math.max(1, Math.min(24, Number(options.months) || 6));

  // Получаем доходы по месяцам
  const incomeRows = await db.all(
    `SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
     FROM incomes
     GROUP BY month
     ORDER BY month DESC
     LIMIT ?`,
    [months]
  );

  // Получаем расходы по месяцам
  const expenseRows = await db.all(
    `SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
     FROM expenses
     GROUP BY month
     ORDER BY month DESC
     LIMIT ?`,
    [months]
  );

  // Формируем словарь для быстрого доступа
  const incomeMap = {};
  incomeRows.forEach(row => {
    incomeMap[row.month] = row.total;
  });

  const expenseMap = {};
  expenseRows.forEach(row => {
    expenseMap[row.month] = row.total;
  });

  // Собираем все уникальные месяцы
  const allMonths = new Set([
    ...Object.keys(incomeMap),
    ...Object.keys(expenseMap),
  ]);

  // Сортируем месяцы и берём последние N
  const sortedMonths = Array.from(allMonths)
    .sort()
    .reverse()
    .slice(0, months)
    .reverse();

  // Формируем результат
  return sortedMonths.map(month => ({
    month,
    income: incomeMap[month] || 0,
    expense: expenseMap[month] || 0,
  }));
}