import { getDb } from '../db/connection.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

/**
 * Получить label категории по ID
 */
function getCategoryLabel(categoryId, type) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.label || 'Прочее';
}

/**
 * Экспортировать все операции текущего пользователя в CSV
 * GET /api/v1/export/csv
 */
export async function exportCsv(req, res, next) {
  try {
    const userId = req.user.id;
    const db = getDb();

    // Получаем только доходы и расходы текущего пользователя
    const incomes = await db.all(
      'SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    const expenses = await db.all(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );

    // Формируем CSV-строку
    const lines = [];

    // Заголовок (BOM для корректного отображения кириллицы в Excel)
    const BOM = '\uFEFF';
    lines.push('Тип,Дата,Категория,Сумма,Комментарий');

    // Добавляем доходы
    incomes.forEach((row) => {
      const label = getCategoryLabel(row.category, 'income');
      const comment = (row.comment || '').replace(/"/g, '""');
      lines.push(`Доход,${row.date},"${label}",${row.amount},"${comment}"`);
    });

    // Добавляем расходы
    expenses.forEach((row) => {
      const label = getCategoryLabel(row.category, 'expense');
      const comment = (row.comment || '').replace(/"/g, '""');
      lines.push(`Расход,${row.date},"${label}",${row.amount},"${comment}"`);
    });

    // Собираем CSV
    const csvContent = BOM + lines.join('\n');

    // Устанавливаем заголовки для скачивания файла
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="salary_tracker_export.csv"');

    res.send(csvContent);
  } catch (error) {
    next(error);
  }
}