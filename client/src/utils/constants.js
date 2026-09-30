// Категории доходов
export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

// Категории расходов
export const EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

// Типы операций
export const TRANSACTION_TYPES = [
  { id: 'income', label: 'Доход' },
  { id: 'expense', label: 'Расход' },
];

// Иконки для категорий (можно расширить позже)
export const CATEGORY_ICONS = {
  // Доходы
  salary: '💼',
  freelance: '💻',
  bonus: '🎁',
  debt_return: '🔄',
  deposit_interest: '🏦',
  gift: '🎀',

  // Расходы
  groceries: '🛒',
  utilities: '💡',
  rent: '🏠',
  subscriptions: '📱',
  transport: '🚗',
  health: '💊',
  clothing: '👕',
  entertainment: '🎬',
  communication: '📞',

  // Прочее
  other: '📦',
};

// ... (в конце файла, после экспорта CATEGORY_ICONS)

/**
 * Получить текстовое название категории по её ID
 * @param {string} categoryId - ID категории
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} название категории
 */
export const getCategoryLabel = (categoryId, type = 'expense') => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find(cat => cat.id === categoryId);
  return category?.label || 'Прочее';
};

/**
 * Получить иконку категории по её ID
 * @param {string} categoryId - ID категории
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} эмодзи-иконка
 */
export const getCategoryIcon = (categoryId, type = 'expense') => {
  if (CATEGORY_ICONS[categoryId]) {
    return CATEGORY_ICONS[categoryId];
  }
  return type === 'income' ? '💰' : '💸';
};