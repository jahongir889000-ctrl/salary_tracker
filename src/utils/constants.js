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