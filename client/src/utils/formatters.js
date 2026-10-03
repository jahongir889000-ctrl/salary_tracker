/**
 * Форматирование суммы для отображения
 * @param {number} amount - сумма
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} отформатированная строка (например, "+150 000 сўм" или "-5 000 сўм")
 */
export function formatTransactionAmount(amount, type) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 сўм';
  }

  // Форматируем число с пробелами как разделителями тысяч
  const formattedNumber = Math.abs(amount).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Добавляем знак + для доходов и - для расходов
  const sign = type === 'income' ? '+' : '-';

  return `${sign}${formattedNumber} сўм`;
}

/**
 * Форматирование даты из ISO-формата в читаемый вид
 * @param {string} dateString - дата в формате YYYY-MM-DD или ISO-строка
 * @returns {string} отформатированная дата (например, "01.09.2026")
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

/**
 * Форматирование даты и времени
 * @param {string} dateString - ISO-строка даты и времени
 * @returns {string} отформатированная дата и время (например, "01.09.2026 14:30")
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Проверка, попадает ли дата в указанный период
 * @param {string} dateString - дата в формате YYYY-MM-DD
 * @param {string} period - период ('today', 'week', 'month', 'year', 'all')
 * @returns {boolean} true, если дата в периоде
 */
export function isDateInPeriod(dateString, period) {
  if (!period || period === 'all') return true;
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  switch (period) {
    case 'today': {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return date >= today && date < tomorrow;
    }

    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }

    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return date >= monthStart;
    }

    case 'year': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return date >= yearStart;
    }

    default:
      return true;
  }
}

/**
 * Форматирование большой суммы с сокращениями (K, M)
 * @param {number} amount - сумма
 * @returns {string} отформатированная строка (например, "150K сўм" или "1.5M сўм")
 */
export function formatCompactAmount(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 сўм';
  }

  const absAmount = Math.abs(amount);

  if (absAmount >= 1000000) {
    const millions = (absAmount / 1000000).toFixed(1);
    return `${millions}M сўм`;
  }

  if (absAmount >= 1000) {
    const thousands = (absAmount / 1000).toFixed(0);
    return `${thousands}K сўм`;
  }

  return `${absAmount} сўм`;
}