import * as summaryService from '../services/summaryService.js';

/**
 * Получить общий баланс
 * GET /api/v1/summary/balance
 */
export async function getBalance(req, res, next) {
  try {
    const balance = await summaryService.getBalance();
    res.json(balance);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить сумму по категориям
 * GET /api/v1/summary/by-category
 */
export async function getByCategory(req, res, next) {
  try {
    const { type = 'expense', dateFrom, dateTo } = req.query;

    // Валидация типа
    if (type !== 'income' && type !== 'expense') {
      const error = new Error('Параметр type должен быть "income" или "expense"');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const result = await summaryService.getByCategory(type, {
      dateFrom,
      dateTo,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить помесячную статистику
 * GET /api/v1/summary/by-month
 */
export async function getByMonth(req, res, next) {
  try {
    const { months } = req.query;

    const result = await summaryService.getByMonth({
      months: Number(months),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}