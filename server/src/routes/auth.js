import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Регистрация нового пользователя
 */
router.post('/register', authController.register);

/**
 * POST /api/v1/auth/login
 * Авторизация пользователя
 */
router.post('/login', authController.login);

export default router;