import app from '../src/app.js';
import { initDb } from '../src/db/connection.js';

let isDbInitialized = false;

/**
 * Serverless-обработчик для Vercel при деплое из папки server
 */
export default async function handler(req, res) {
  if (!isDbInitialized) {
    await initDb();
    isDbInitialized = true;
  }
  return app(req, res);
}
