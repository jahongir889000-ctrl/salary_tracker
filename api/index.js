import app from '../server/src/app.js';
import { initDb } from '../server/src/db/connection.js';

let isDbInitialized = false;

/**
 * Serverless-обработчик для Vercel
 */
export default async function handler(req, res) {
  if (!isDbInitialized) {
    await initDb();
    isDbInitialized = true;
  }
  return app(req, res);
}
