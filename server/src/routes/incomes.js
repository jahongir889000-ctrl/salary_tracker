import { Router } from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { validateTransactionMiddleware } from '../middleware/validate.js';

const router = Router();

/**
 * GET /api/v1/incomes
 * Получить все доходы с пагинацией и фильтрами
 */
router.get('/', incomeController.getAllIncomes);

/**
 * GET /api/v1/incomes/:id
 * Получить доход по ID
 */
router.get('/:id', incomeController.getIncomeById);

/**
 * POST /api/v1/incomes
 * Создать новый доход
 */
router.post(
  '/',
  validateTransactionMiddleware('income'),
  incomeController.createIncome
);

/**
 * PUT /api/v1/incomes/:id
 * Обновить существующий доход
 */
router.put(
  '/:id',
  validateTransactionMiddleware('income'),
  incomeController.updateIncome
);

/**
 * DELETE /api/v1/incomes/:id
 * Удалить доход по ID
 */
router.delete('/:id', incomeController.deleteIncome);

export default router;