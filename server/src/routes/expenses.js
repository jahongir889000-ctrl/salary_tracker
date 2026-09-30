import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateTransactionMiddleware } from '../middleware/validate.js';

const router = Router();

/**
 * GET /api/v1/expenses
 * Получить все расходы с пагинацией и фильтрами
 */
router.get('/', expenseController.getAllExpenses);

/**
 * GET /api/v1/expenses/:id
 * Получить расход по ID
 */
router.get('/:id', expenseController.getExpenseById);

/**
 * POST /api/v1/expenses
 * Создать новый расход
 */
router.post(
  '/',
  validateTransactionMiddleware('expense'),
  expenseController.createExpense
);

/**
 * PUT /api/v1/expenses/:id
 * Обновить существующий расход
 */
router.put(
  '/:id',
  validateTransactionMiddleware('expense'),
  expenseController.updateExpense
);

/**
 * DELETE /api/v1/expenses/:id
 * Удалить расход по ID
 */
router.delete('/:id', expenseController.deleteExpense);

export default router;