import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './config/index.js';

// Импорт роутов
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';

// Импорт middleware для обработки ошибок
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Создаём экземпляр Express-приложения
const app = express();

// Подключаем CORS для разрешения запросов с фронтенда
app.use(cors(CORS_OPTIONS));

// Подключаем middleware для парсинга JSON-тела запросов
app.use(express.json());

// Простой health-check эндпоинт для проверки работоспособности сервера
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Регистрируем роуты API под префиксом /api/v1/
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Обработчик для несуществующих маршрутов (404)
app.use(notFoundHandler);

// Централизованный обработчик ошибок (должен быть последним)
app.use(errorHandler);

export default app;