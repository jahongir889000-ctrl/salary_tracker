import app from './src/app.js';
import { initDb } from './src/db/connection.js';
import { PORT } from './src/config/index.js';

/**
 * Точка входа в приложение
 * Асинхронно инициализирует БД, затем запускает сервер
 */
async function startServer() {
  try {
    // 1. Сначала инициализируем базу данных и создаём таблицы
    await initDb();
    console.log('✅ База данных успешно инициализирована');

    // 2. Только после этого запускаем Express-сервер
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📡 API доступен по адресу: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Критическая ошибка при запуске сервера:', error);
    process.exit(1); // Завершаем процесс с кодом ошибки
  }
}

startServer();