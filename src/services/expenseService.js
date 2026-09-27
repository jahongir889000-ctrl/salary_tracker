import { getFromStorage, setToStorage, generateUUID, STORAGE_KEYS } from './storage';

/**
 * Получить все расходы
 * @returns {Array} массив расходов
 */
export const getExpenses = () => {
  return getFromStorage(STORAGE_KEYS.EXPENSES, []);
};

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Object|null} объект расхода или null
 */
export const getExpenseById = (id) => {
  if (!id) return null;

  const expenses = getExpenses();
  return expenses.find((expense) => expense?.id === id) || null;
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода (category, amount, date, comment)
 * @returns {Object} созданный расход с id и createdAt
 */
export const addExpense = (expenseData) => {
  if (!expenseData) {
    console.error('addExpense: данные не переданы');
    return null;
  }

  const expenses = getExpenses();

  const newExpense = {
    id: generateUUID(),
    type: 'expense',
    category: expenseData.category || 'other',
    amount: Number(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    comment: expenseData.comment || '',
    createdAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  setToStorage(STORAGE_KEYS.EXPENSES, expenses);

  return newExpense;
};

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} expenseData - новые данные расхода
 * @returns {Object|null} обновлённый расход или null, если не найден
 */
export const updateExpense = (id, expenseData) => {
  if (!id || !expenseData) {
    console.error('updateExpense: id или данные не переданы');
    return null;
  }

  const expenses = getExpenses();
  const index = expenses.findIndex((expense) => expense?.id === id);

  if (index === -1) {
    console.error(`updateExpense: расход с id=${id} не найден`);
    return null;
  }

  const updatedExpense = {
    ...expenses[index],
    category: expenseData.category ?? expenses[index].category,
    amount: expenseData.amount !== undefined ? Number(expenseData.amount) : expenses[index].amount,
    date: expenseData.date ?? expenses[index].date,
    comment: expenseData.comment ?? expenses[index].comment,
    updatedAt: new Date().toISOString(),
  };

  expenses[index] = updatedExpense;
  setToStorage(STORAGE_KEYS.EXPENSES, expenses);

  return updatedExpense;
};

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteExpense = (id) => {
  if (!id) {
    console.error('deleteExpense: id не передан');
    return false;
  }

  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense?.id !== id);

  if (filteredExpenses.length === expenses.length) {
    console.error(`deleteExpense: расход с id=${id} не найден`);
    return false;
  }

  setToStorage(STORAGE_KEYS.EXPENSES, filteredExpenses);
  return true;
};