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

// Вспомогательные функции для работы с категориями

/**
 * Получить список ID всех категорий доходов
 * @returns {Array<string>} массив ID категорий
 */
export function getIncomeCategoryIds() {
  return INCOME_CATEGORIES.map(cat => cat.id);
}

/**
 * Получить список ID всех категорий расходов
 * @returns {Array<string>} массив ID категорий
 */
export function getExpenseCategoryIds() {
  return EXPENSE_CATEGORIES.map(cat => cat.id);
}

/**
 * Получить label категории по ID
 * @param {string} categoryId - ID категории
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} label категории или 'Прочее', если не найдена
 */
export function getCategoryLabel(categoryId, type = 'expense') {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find(cat => cat.id === categoryId);
  return category?.label || 'Прочее';
}