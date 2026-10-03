import crypto from 'crypto';
import { getDb } from '../db/connection.js';

/**
 * Преобразует строку базы данных (snake_case) в объект (camelCase)
 * @param {Object} row - строка из БД
 * @returns {Object} объект в camelCase
 */
function mapRowToExpense(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: 'expense',
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Получить все расходы с пагинацией и фильтрами для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {Object} options - параметры запроса (page, limit, category, dateFrom, dateTo, isRecurring)
 * @returns {Promise<Object>} { data: Array, total: number, page: number, limit: number }
 */
export async function getAllExpenses(userId, options = {}) {
  const db = getDb();
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const offset = (page - 1) * limit;

  // Обязательно фильтруем по user_id
  const conditions = ['user_id = ?'];
  const params = [userId];

  if (options.category) {
    conditions.push('category = ?');
    params.push(options.category);
  }
  if (options.dateFrom) {
    conditions.push('date >= ?');
    params.push(options.dateFrom);
  }
  if (options.dateTo) {
    conditions.push('date <= ?');
    params.push(options.dateTo);
  }
  if (options.isRecurring !== undefined) {
    conditions.push('is_recurring = ?');
    params.push(options.isRecurring ? 1 : 0);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Получаем общее количество записей пользователя
  const countRow = await db.get(`SELECT COUNT(*) as total FROM expenses ${whereClause}`, params);
  const total = countRow.total;

  // Получаем данные с пагинацией
  const rows = await db.all(
    `SELECT * FROM expenses ${whereClause} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows.map(mapRowToExpense),
    total,
    page,
    limit,
  };
}

/**
 * Получить расход по ID для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object|null>} объект расхода или null
 */
export async function getExpenseById(userId, id) {
  const db = getDb();
  const row = await db.get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  return mapRowToExpense(row);
}

/**
 * Создать новый расход для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {Object} data - данные расхода { amount, date, category, comment, isRecurring }
 * @returns {Promise<Object>} созданный расход
 */
export async function createExpense(userId, data) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const isRecurring = data.isRecurring ? 1 : 0;

  await db.run(
    `INSERT INTO expenses (id, user_id, amount, date, category, comment, is_recurring, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      userId,
      Number(data.amount),
      data.date,
      data.category,
      data.comment || '',
      isRecurring,
      now,
      now,
    ]
  );

  return getExpenseById(userId, id);
}

/**
 * Обновить существующий расход для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {string} id - идентификатор расхода
 * @param {Object} data - новые данные { amount, date, category, comment, isRecurring }
 * @returns {Promise<Object|null>} обновлённый расход или null, если не найден
 */
export async function updateExpense(userId, id, data) {
  const db = getDb();

  // Проверяем, существует ли запись и принадлежит ли она пользователю
  const existing = await getExpenseById(userId, id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const isRecurring = data.isRecurring !== undefined
    ? (data.isRecurring ? 1 : 0)
    : (existing.isRecurring ? 1 : 0);

  await db.run(
    `UPDATE expenses
     SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      Number(data.amount ?? existing.amount),
      data.date ?? existing.date,
      data.category ?? existing.category,
      data.comment ?? existing.comment,
      isRecurring,
      now,
      id,
      userId,
    ]
  );

  return getExpenseById(userId, id);
}

/**
 * Удалить расход по ID для конкретного пользователя
 * @param {string} userId - идентификатор пользователя
 * @param {string} id - идентификатор расхода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export async function deleteExpense(userId, id) {
  const db = getDb();
  const result = await db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  return result.changes > 0;
}