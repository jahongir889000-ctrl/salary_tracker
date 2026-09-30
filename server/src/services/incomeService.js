import crypto from 'crypto';
import { getDb } from '../db/connection.js';

/**
 * Преобразует строку базы данных (snake_case) в объект (camelCase)
 * @param {Object} row - строка из БД
 * @returns {Object} объект в camelCase
 */
function mapRowToIncome(row) {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Получить все доходы с пагинацией и фильтрами
 * @param {Object} options - параметры запроса
 * @param {number} options.page - номер страницы (по умолчанию 1)
 * @param {number} options.limit - количество записей на странице (по умолчанию 20)
 * @param {string} options.category - фильтр по категории
 * @param {string} options.dateFrom - фильтр: дата от (YYYY-MM-DD)
 * @param {string} options.dateTo - фильтр: дата до (YYYY-MM-DD)
 * @returns {Promise<Object>} { data: Array, total: number, page: number, limit: number }
 */
export async function getAllIncomes(options = {}) {
  const db = getDb();
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const offset = (page - 1) * limit;

  // Формируем условия WHERE
  const conditions = [];
  const params = [];

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

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей
  const countRow = await db.get(`SELECT COUNT(*) as total FROM incomes ${whereClause}`, params);
  const total = countRow.total;

  // Получаем данные с пагинацией
  const rows = await db.all(
    `SELECT * FROM incomes ${whereClause} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows.map(mapRowToIncome),
    total,
    page,
    limit,
  };
}

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<Object|null>} объект дохода или null
 */
export async function getIncomeById(id) {
  const db = getDb();
  const row = await db.get('SELECT * FROM incomes WHERE id = ?', [id]);
  return mapRowToIncome(row);
}

/**
 * Создать новый доход
 * @param {Object} data - данные дохода { amount, date, category, comment }
 * @returns {Promise<Object>} созданный доход
 */
export async function createIncome(data) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO incomes (id, amount, date, category, comment, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      Number(data.amount),
      data.date,
      data.category,
      data.comment || '',
      now,
      now,
    ]
  );

  return getIncomeById(id);
}

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} data - новые данные { amount, date, category, comment }
 * @returns {Promise<Object|null>} обновлённый доход или null, если не найден
 */
export async function updateIncome(id, data) {
  const db = getDb();

  // Проверяем, существует ли запись
  const existing = await getIncomeById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  await db.run(
    `UPDATE incomes
     SET amount = ?, date = ?, category = ?, comment = ?, updated_at = ?
     WHERE id = ?`,
    [
      Number(data.amount ?? existing.amount),
      data.date ?? existing.date,
      data.category ?? existing.category,
      data.comment ?? existing.comment,
      now,
      id,
    ]
  );

  return getIncomeById(id);
}

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export async function deleteIncome(id) {
  const db = getDb();
  const result = await db.run('DELETE FROM incomes WHERE id = ?', [id]);
  return result.changes > 0;
}