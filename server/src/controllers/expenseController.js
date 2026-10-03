import * as expenseService from '../services/expenseService.js';

/**
 * Получить все расходы текущего пользователя
 * GET /api/v1/expenses
 */
export async function getAllExpenses(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await expenseService.getAllExpenses(userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить расход по ID (только если он принадлежит текущему пользователю)
 * GET /api/v1/expenses/:id
 */
export async function getExpenseById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const expense = await expenseService.getExpenseById(userId, id);

    if (!expense) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json({ data: expense });
  } catch (error) {
    next(error);
  }
}

/**
 * Создать новый расход для текущего пользователя
 * POST /api/v1/expenses
 */
export async function createExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const expense = await expenseService.createExpense(userId, req.body);

    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

/**
 * Обновить существующий расход (только если он принадлежит текущему пользователю)
 * PUT /api/v1/expenses/:id
 */
export async function updateExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const expense = await expenseService.updateExpense(userId, id, req.body);

    if (!expense) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json({ data: expense });
  } catch (error) {
    next(error);
  }
}

/**
 * Удалить расход (только если он принадлежит текущему пользователю)
 * DELETE /api/v1/expenses/:id
 */
export async function deleteExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const success = await expenseService.deleteExpense(userId, id);

    if (!success) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}