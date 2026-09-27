import { getFromStorage, setToStorage, generateUUID, STORAGE_KEYS } from './storage';

/**
 * Получить все доходы
 * @returns {Array} массив доходов
 */
export const getIncomes = () => {
  return getFromStorage(STORAGE_KEYS.INCOMES, []);
};

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Object|null} объект дохода или null
 */
export const getIncomeById = (id) => {
  if (!id) return null;

  const incomes = getIncomes();
  return incomes.find((income) => income?.id === id) || null;
};

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода (category, amount, date, comment)
 * @returns {Object} созданный доход с id и createdAt
 */
export const addIncome = (incomeData) => {
  if (!incomeData) {
    console.error('addIncome: данные не переданы');
    return null;
  }

  const incomes = getIncomes();

  const newIncome = {
    id: generateUUID(),
    type: 'income',
    category: incomeData.category || 'other',
    amount: Number(incomeData.amount) || 0,
    date: incomeData.date || new Date().toISOString().split('T')[0],
    comment: incomeData.comment || '',
    createdAt: new Date().toISOString(),
  };

  incomes.push(newIncome);
  setToStorage(STORAGE_KEYS.INCOMES, incomes);

  return newIncome;
};

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} incomeData - новые данные дохода
 * @returns {Object|null} обновлённый доход или null, если не найден
 */
export const updateIncome = (id, incomeData) => {
  if (!id || !incomeData) {
    console.error('updateIncome: id или данные не переданы');
    return null;
  }

  const incomes = getIncomes();
  const index = incomes.findIndex((income) => income?.id === id);

  if (index === -1) {
    console.error(`updateIncome: доход с id=${id} не найден`);
    return null;
  }

  const updatedIncome = {
    ...incomes[index],
    category: incomeData.category ?? incomes[index].category,
    amount: incomeData.amount !== undefined ? Number(incomeData.amount) : incomes[index].amount,
    date: incomeData.date ?? incomes[index].date,
    comment: incomeData.comment ?? incomes[index].comment,
    updatedAt: new Date().toISOString(),
  };

  incomes[index] = updatedIncome;
  setToStorage(STORAGE_KEYS.INCOMES, incomes);

  return updatedIncome;
};

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteIncome = (id) => {
  if (!id) {
    console.error('deleteIncome: id не передан');
    return false;
  }

  const incomes = getIncomes();
  const filteredIncomes = incomes.filter((income) => income?.id !== id);

  if (filteredIncomes.length === incomes.length) {
    console.error(`deleteIncome: доход с id=${id} не найден`);
    return false;
  }

  setToStorage(STORAGE_KEYS.INCOMES, filteredIncomes);
  return true;
};