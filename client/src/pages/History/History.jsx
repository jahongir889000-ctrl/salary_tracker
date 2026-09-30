import React, { useState, useEffect } from 'react';
import styles from './History.module.css';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getAllTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { isDateInPeriod } from '../../utils/formatters';

function History() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const transactions = await getAllTransactions();
      setAllTransactions(transactions);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoriesForFilter = () => {
    if (typeFilter === 'income') return INCOME_CATEGORIES;
    if (typeFilter === 'expense') return EXPENSE_CATEGORIES;
    
    // Объединяем и удаляем дубликаты по id (например, 'other' есть в обоих списках)
    const allCats = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    return Array.from(new Map(allCats.map(item => [item.id, item])).values());
  };
  
  
  const filteredTransactions = (allTransactions || []).filter((transaction) => {
    if (typeFilter !== 'all' && transaction?.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && transaction?.category !== categoryFilter) return false;
    if (!isDateInPeriod(transaction?.date, periodFilter)) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTransaction?.id) {
        if (data.type === 'income') {
          await updateIncome(editingTransaction.id, data);
        } else {
          await updateExpense(editingTransaction.id, data);
        }
      } else {
        if (data.type === 'income') {
          await addIncome(data);
        } else {
          await addExpense(data);
        }
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка при сохранении операции:', error);
      alert('Не удалось сохранить операцию. Проверьте консоль.');
    }
  };

  const handleDelete = async (transaction) => {
    if (!transaction?.id) return;
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту операцию?');
    if (!confirmed) return;

    try {
      if (transaction.type === 'income') {
        await deleteIncome(transaction.id);
      } else {
        await deleteExpense(transaction.id);
      }
      await loadData();
    } catch (error) {
      console.error('Ошибка при удалении операции:', error);
      alert('Не удалось удалить операцию.');
    }
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setPeriodFilter('all');
  };

  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setCategoryFilter('all');
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка истории...</div>;
  }

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select className={styles.filterInput} value={typeFilter} onChange={(e) => handleTypeFilterChange(e.target.value)}>
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select className={styles.filterInput} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Все категории</option>
            {getCategoriesForFilter().map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select className={styles.filterInput} value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>Сбросить фильтры</button>
      </div>

      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTransaction ? 'Редактировать операцию' : 'Новая операция'}>
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCloseModal} editData={editingTransaction} />
      </Modal>
    </div>
  );
}

export default History;