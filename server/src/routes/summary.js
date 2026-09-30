import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';

const router = Router();

/**
 * GET /api/v1/summary/balance
 * Получить общий баланс (сумма доходов, расходов и разницу)
 */
router.get('/balance', summaryController.getBalance);

/**
 * GET /api/v1/summary/by-category
 * Получить сумму по категориям (для круговой диаграммы)
 * Query params: type (income|expense), dateFrom, dateTo
 */
router.get('/by-category', summaryController.getByCategory);

/**
 * GET /api/v1/summary/by-month
 * Получить помесячную статистику (для столбчатого графика)
 * Query params: months (количество последних месяцев)
 */
router.get('/by-month', summaryController.getByMonth);

export default router;