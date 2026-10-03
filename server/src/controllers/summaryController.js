import * as summaryService from '../services/summaryService.js';

/**
 * Получить общий баланс текущего пользователя
 * GET /api/v1/summary/balance
 */
export async function getBalance(req, res, next) {
  try {
    const userId = req.user.id;
    const balance = await summaryService.getBalance(userId);
    res.json(balance);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить сумму по категориям для текущего пользователя
 * GET /api/v1/summary/by-category
 */
export async function getByCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await summaryService.getByCategory(userId, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить помесячную статистику для текущего пользователя
 * GET /api/v1/summary/by-month
 */
export async function getMonthlySummary(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await summaryService.getMonthlySummary(userId, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}