import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';

const router = Router();

/**
 * GET /api/v1/summary/balance
 * Получить общий баланс текущего пользователя
 */
router.get('/balance', summaryController.getBalance);

/**
 * GET /api/v1/summary/by-category
 * Получить сумму по категориям для текущего пользователя
 */
router.get('/by-category', summaryController.getByCategory);

/**
 * GET /api/v1/summary/by-month
 * Получить помесячную статистику для текущего пользователя
 */
router.get('/by-month', summaryController.getMonthlySummary);

export default router;