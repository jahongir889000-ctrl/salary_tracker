import * as incomeService from '../services/incomeService.js';

/**
 * Получить все доходы текущего пользователя
 * GET /api/v1/incomes
 */
export async function getAllIncomes(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await incomeService.getAllIncomes(userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить доход по ID (только если он принадлежит текущему пользователю)
 * GET /api/v1/incomes/:id
 */
export async function getIncomeById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const income = await incomeService.getIncomeById(userId, id);

    if (!income) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json({ data: income });
  } catch (error) {
    next(error);
  }
}

/**
 * Создать новый доход для текущего пользователя
 * POST /api/v1/incomes
 */
export async function createIncome(req, res, next) {
  try {
    const userId = req.user.id;
    const income = await incomeService.createIncome(userId, req.body);

    res.status(201).json({ data: income });
  } catch (error) {
    next(error);
  }
}

/**
 * Обновить существующий доход (только если он принадлежит текущему пользователю)
 * PUT /api/v1/incomes/:id
 */
export async function updateIncome(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const income = await incomeService.updateIncome(userId, id, req.body);

    if (!income) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json({ data: income });
  } catch (error) {
    next(error);
  }
}

/**
 * Удалить доход (только если он принадлежит текущему пользователю)
 * DELETE /api/v1/incomes/:id
 */
export async function deleteIncome(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const success = await incomeService.deleteIncome(userId, id);

    if (!success) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}