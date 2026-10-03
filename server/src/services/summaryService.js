import { getDb } from '../db/connection.js';

/**
 * Получить общий баланс (сумма доходов, расходов и разницу) для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export async function getBalance(userId) {
  const db = getDb();

  // Сумма всех доходов пользователя
  const incomeRow = await db.get(
    'SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE user_id = ?',
    [userId]
  );

  // Сумма всех расходов пользователя
  const expenseRow = await db.get(
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ?',
    [userId]
  );

  const totalIncome = incomeRow?.total || 0;
  const totalExpense = expenseRow?.total || 0;
  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
}

/**
 * Получить сумму по категориям для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {Object} options - параметры фильтрации (type, dateFrom, dateTo)
 * @returns {Promise<Array>} массив объектов { category, total, count }
 */
export async function getByCategory(userId, options = {}) {
  const db = getDb();
  const type = options.type === 'income' ? 'income' : 'expense';
  const table = type === 'income' ? 'incomes' : 'expenses';

  // Формируем условия WHERE
  const conditions = ['user_id = ?'];
  const params = [userId];

  if (options.dateFrom) {
    conditions.push('date >= ?');
    params.push(options.dateFrom);
  }
  if (options.dateTo) {
    conditions.push('date <= ?');
    params.push(options.dateTo);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Группируем по категории и считаем сумму и количество
  const rows = await db.all(
    `SELECT category, SUM(amount) as total, COUNT(*) as count 
     FROM ${table} 
     ${whereClause} 
     GROUP BY category 
     ORDER BY total DESC`,
    params
  );

  return rows || [];
}

/**
 * Получить помесячную статистику для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {Object} options - параметры (months - количество месяцев)
 * @returns {Promise<Array>} массив объектов { month, income, expense }
 */
export async function getMonthlySummary(userId, options = {}) {
  const db = getDb();
  const months = Math.max(1, Math.min(24, Number(options.months) || 6));

  // Получаем доходы по месяцам
  const incomesByMonth = await db.all(
    `SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
     FROM incomes
     WHERE user_id = ?
     GROUP BY month
     ORDER BY month DESC
     LIMIT ?`,
    [userId, months]
  );

  // Получаем расходы по месяцам
  const expensesByMonth = await db.all(
    `SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
     FROM expenses
     WHERE user_id = ?
     GROUP BY month
     ORDER BY month DESC
     LIMIT ?`,
    [userId, months]
  );

  // Формируем список всех месяцев за указанный период
  const now = new Date();
  const allMonths = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    allMonths.push(monthStr);
  }

  // Объединяем данные
  const result = allMonths.map((month) => {
    const incomeRow = incomesByMonth?.find((row) => row.month === month);
    const expenseRow = expensesByMonth?.find((row) => row.month === month);

    return {
      month,
      income: incomeRow?.total || 0,
      expense: expenseRow?.total || 0,
    };
  });

  return result;
}