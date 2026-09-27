/**
 * Безопасное получение данных из localStorage
 * @param {string} key - ключ хранилища
 * @param {any} defaultValue - значение по умолчанию, если ключ не найден
 * @returns {any} распарсенные данные или defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Безопасная запись данных в localStorage
 * @param {string} key - ключ хранилища
 * @param {any} value - данные для сохранения
 * @returns {boolean} true, если запись успешна
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка записи в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - ключ хранилища
 * @returns {boolean} true, если удаление успешно
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Генерация уникального идентификатора (UUID)
 * @returns {string} уникальный ID
 */
export const generateUUID = () => {
  // Используем crypto.randomUUID(), если доступен
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: генерация UUID v4 вручную
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Очистка всего localStorage
 * @returns {boolean} true, если очистка успешна
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка очистки localStorage:', error);
    return false;
  }
};

// Ключи хранилища (константы)
export const STORAGE_KEYS = {
  INCOMES: 'incomes',
  EXPENSES: 'expenses',
};