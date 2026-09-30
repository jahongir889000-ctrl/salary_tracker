// Базовый URL API из переменных окружения
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Универсальная функция для выполнения HTTP-запросов
 * @param {string} path - путь эндпоинта (например, '/api/v1/incomes')
 * @param {Object} options - опции запроса
 * @param {string} options.method - HTTP-метод (GET, POST, PUT, DELETE)
 * @param {Object} options.body - тело запроса (будет преобразовано в JSON)
 * @param {Object} options.params - query-параметры (будут добавлены к URL)
 * @returns {Promise<any>} данные из ответа
 */
async function request(path, options = {}) {
  // Формируем полный URL
  const url = new URL(path, BASE_URL);
  
  // Добавляем query-параметры, если есть
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  // Формируем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    // Выполняем запрос
    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Для ответов без содержимого (204 No Content) возвращаем null
    if (response.status === 204) {
      return null;
    }

    // Парсим ответ
    const data = await response.json();

    // Проверяем, есть ли ошибка в ответе
    if (data.error) {
      const error = new Error(data.error.message || 'Произошла ошибка');
      error.code = data.error.code || 'UNKNOWN_ERROR';
      error.status = response.status;
      throw error;
    }

    // Проверяем HTTP-статус
    if (!response.ok) {
      const error = new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    // Возвращаем данные (если есть поле data, возвращаем его, иначе весь ответ)
    return data.data !== undefined ? data : data;
  } catch (error) {
    // Обработка ошибок сети
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Не удалось подключиться к серверу. Проверьте, запущен ли backend.');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    
    // Пробрасываем остальные ошибки
    throw error;
  }
}

/**
 * GET-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} params - query-параметры
 * @returns {Promise<any>} данные из ответа
 */
export function get(path, params = {}) {
  return request(path, { method: 'GET', params });
}

/**
 * POST-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function post(path, body) {
  return request(path, { method: 'POST', body });
}

/**
 * PUT-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function put(path, body) {
  return request(path, { method: 'PUT', body });
}

/**
 * DELETE-запрос
 * @param {string} path - путь эндпоинта
 * @returns {Promise<any>} данные из ответа
 */
export function del(path) {
  return request(path, { method: 'DELETE' });
}

// Экспортируем базовый URL для использования в других местах (если понадобится)
export { BASE_URL };