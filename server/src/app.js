import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './config/index.js';

// Импорт роутов
import authRouter from './routes/auth.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';
import exportRouter from './routes/export.js';

// Импорт middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { setUtf8Encoding } from './middleware/encoding.js';
import { authenticate } from './middleware/auth.js';

// Создаём экземпляр Express-приложения
const app = express();

// Подключаем CORS для разрешения запросов с фронтенда
app.use(cors(CORS_OPTIONS));

// Подключаем middleware для установки кодировки UTF-8
app.use(setUtf8Encoding);

// Подключаем middleware для парсинга JSON-тела запросов
app.use(express.json());

// Простой health-check эндпоинт для проверки работоспособности сервера (публичный)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Регистрируем роуты API под префиксом /api/v1/
// Публичные роуты аутентификации (без защиты)
app.use('/api/v1/auth', authRouter);

// Защищённые роуты (требуют JWT-токен)
app.use('/api/v1/incomes', authenticate, incomesRouter);
app.use('/api/v1/expenses', authenticate, expensesRouter);
app.use('/api/v1/summary', authenticate, summaryRouter);
app.use('/api/v1/export', authenticate, exportRouter);

// Обработчик для несуществующих маршрутов (404)
app.use(notFoundHandler);

// Централизованный обработчик ошибок (должен быть последним)
app.use(errorHandler);

export default app;