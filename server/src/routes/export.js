import { Router } from 'express';
import * as exportController from '../controllers/exportController.js';

const router = Router();

/**
 * GET /api/v1/export/csv
 * Экспортировать все операции в CSV-файл
 */
router.get('/csv', exportController.exportCsv);

export default router;