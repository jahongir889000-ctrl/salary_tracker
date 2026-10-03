// Базовый URL API
export const API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * Получить токен из localStorage
 * @returns {string|null} JWT-токен или null
 */
function getToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Обработка ошибки авторизации (401)
 * Очищает токен и перенаправляет на страницу входа
 */
function handleUnauthorized() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');

  // Перенаправляем на страницу входа, если ещё не там
  if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = '/login';
  }
}

/**
 * Универсальная функция для выполнения HTTP-запросов
 * @param {string} endpoint - путь API (например, '/incomes')
 * @param {Object} options - настройки запроса (method, body, headers)
 * @returns {Promise<any>} данные ответа
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Получаем токен из localStorage
  const token = getToken();

  // Формируем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Если есть токен — добавляем его в заголовок Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Формируем конфигурацию запроса
  const config = {
    method: options.method || 'GET',
    headers,
  };

  // Если есть тело запроса — добавляем его
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Если ответ 204 No Content — возвращаем null
    if (response.status === 204) {
      return null;
    }

    // Парсим JSON-ответ
    const data = await response.json();

    // Если статус не успешный (не 2xx) — выбрасываем ошибку
    if (!response.ok) {
      // Если 401 Unauthorized — очищаем токен и перенаправляем на вход
      if (response.status === 401) {
        handleUnauthorized();
      }

      const errorMessage = data.message || data.error || 'Произошла ошибка';
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.code = data.code;
      throw error;
    }

    return data;
  } catch (error) {
    // Если это уже наша ошибка — пробрасываем дальше
    if (error.statusCode) {
      throw error;
    }

    // Иначе — это сетевая ошибка
    const networkError = new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
    networkError.statusCode = 0;
    throw networkError;
  }
}

/**
 * GET-запрос
 * @param {string} endpoint - путь API
 * @param {Object} params - query-параметры
 * @returns {Promise<any>} данные ответа
 */
export function get(endpoint, params = {}) {
  // Формируем query-строку из параметров
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return request(url, { method: 'GET' });
}

/**
 * POST-запрос
 * @param {string} endpoint - путь API
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные ответа
 */
export function post(endpoint, body) {
  return request(endpoint, { method: 'POST', body });
}

/**
 * PUT-запрос
 * @param {string} endpoint - путь API
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные ответа
 */
export function put(endpoint, body) {
  return request(endpoint, { method: 'PUT', body });
}

/**
 * DELETE-запрос
 * @param {string} endpoint - путь API
 * @returns {Promise<any>} данные ответа
 */
export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}