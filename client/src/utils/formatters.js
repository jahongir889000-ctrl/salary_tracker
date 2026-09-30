/**
 * Форматирует дату из ISO строки в локализованный формат
 * @param {string} dateString - ISO строка даты (например, '2024-01-15')
 * @param {object} options - опции форматирования (day, month, year)
 * @returns {string} отформатированная дата (например, '15.01.2024')
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';

  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  };

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', defaultOptions);
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return dateString;
  }
};

/**
 * Форматирует дату с названием месяца
 * @param {string} dateString - ISO строка даты
 * @returns {string} отформатированная дата (например, '15 января 2024')
 */
export const formatDateWithMonth = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return dateString;
  }
};

/**
 * Форматирует валюту (число в строку с символом рубля)
 * @param {number} amount - сумма
 * @param {boolean} showSign - показывать знак +/- (по умолчанию false)
 * @returns {string} отформатированная сумма (например, '1 234 ₽' или '+1 234 ₽')
 */
export const formatCurrency = (amount, showSign = false) => {
  if (amount === null || amount === undefined) return '0 ₽';

  const numAmount = Number(amount);
  if (isNaN(numAmount)) return '0 ₽';

  const formatted = numAmount.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (showSign) {
    const sign = numAmount > 0 ? '+' : numAmount < 0 ? '' : '';
    return `${sign}${formatted} ₽`;
  }

  return `${formatted} ₽`;
};

/**
 * Форматирует сумму с учётом типа операции (доход/расход)
 * @param {number} amount - сумма
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} отформатированная сумма с знаком (например, '+1 234 ₽' или '-1 234 ₽')
 */
export const formatTransactionAmount = (amount, type) => {
  if (amount === null || amount === undefined) return '0 ₽';

  const numAmount = Math.abs(Number(amount));
  if (isNaN(numAmount)) return '0 ₽';

  const formatted = numAmount.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (type === 'income') {
    return `+${formatted} ₽`;
  } else if (type === 'expense') {
    return `-${formatted} ₽`;
  }

  return `${formatted} ₽`;
};

/**
 * Получает начало дня (00:00:00)
 * @param {Date|string} date - дата
 * @returns {Date} начало дня
 */
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Получает конец дня (23:59:59)
 * @param {Date|string} date - дата
 * @returns {Date} конец дня
 */
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Получает начало месяца
 * @param {Date|string} date - дата
 * @returns {Date} начало месяца
 */
export const getStartOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Получает конец месяца
 * @param {Date|string} date - дата
 * @returns {Date} конец месяца
 */
export const getEndOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Проверяет, находится ли дата в пределах периода
 * @param {string} dateString - ISO строка даты
 * @param {string} period - период ('today', 'week', 'month', 'year', 'all')
 * @returns {boolean} true, если дата в периоде
 */
export const isDateInPeriod = (dateString, period) => {
  if (!dateString || period === 'all') return true;

  const date = new Date(dateString);
  const now = new Date();

  switch (period) {
    case 'today':
      return date.toDateString() === now.toDateString();

    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }

    case 'month': {
      const startOfMonth = getStartOfMonth(now);
      const endOfMonth = getEndOfMonth(now);
      return date >= startOfMonth && date <= endOfMonth;
    }

    case 'year':
      return date.getFullYear() === now.getFullYear();

    default:
      return true;
  }
};

/**
 * Получает название месяца
 * @param {number} monthIndex - индекс месяца (0-11)
 * @returns {string} название месяца (например, 'Январь')
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[monthIndex] || '';
};

/**
 * Получает короткое название месяца
 * @param {number} monthIndex - индекс месяца (0-11)
 * @returns {string} короткое название месяца (например, 'Янв')
 */
export const getMonthNameShort = (monthIndex) => {
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];
  return months[monthIndex] || '';
};