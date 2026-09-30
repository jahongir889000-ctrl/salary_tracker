import * as incomeService from '../services/incomeService.js';

/**
 * Получить все доходы с пагинацией и фильтрами
 * GET /api/v1/incomes
 */
export async function getAllIncomes(req, res, next) {
  try {
    const { page, limit, category, dateFrom, dateTo } = req.query;

    const result = await incomeService.getAllIncomes({
      page: Number(page),
      limit: Number(limit),
      category,
      dateFrom,
      dateTo,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить доход по ID
 * GET /api/v1/incomes/:id
 */
export async function getIncomeById(req, res, next) {
  try {
    const { id } = req.params;

    const income = await incomeService.getIncomeById(id);

    if (!income) {
      const error = new Error(`Доход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json(income);
  } catch (error) {
    next(error);
  }
}

/**
 * Создать новый доход
 * POST /api/v1/incomes
 */
export async function createIncome(req, res, next) {
  try {
    const { amount, date, category, comment } = req.body;

    const newIncome = await incomeService.createIncome({
      amount,
      date,
      category,
      comment,
    });

    res.status(201).json(newIncome);
  } catch (error) {
    next(error);
  }
}

/**
 * Обновить существующий доход
 * PUT /api/v1/incomes/:id
 */
export async function updateIncome(req, res, next) {
  try {
    const { id } = req.params;
    const { amount, date, category, comment } = req.body;

    const updatedIncome = await incomeService.updateIncome(id, {
      amount,
      date,
      category,
      comment,
    });

    if (!updatedIncome) {
      const error = new Error(`Доход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json(updatedIncome);
  } catch (error) {
    next(error);
  }
}

/**
 * Удалить доход по ID
 * DELETE /api/v1/incomes/:id
 */
export async function deleteIncome(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await incomeService.deleteIncome(id);

    if (!deleted) {
      const error = new Error(`Доход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}