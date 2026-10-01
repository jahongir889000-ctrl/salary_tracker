import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionList from '../../components/TransactionList/TransactionList';
import { getBalance, getAllTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const [balanceData, setBalanceData] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const balance = await getBalance();
      setBalanceData(balance);

      const transactions = await getAllTransactions(5);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Ошибка загрузки данных Dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        // Режим редактирования
        if (data.type === 'income') {
          await updateIncome(editingTransaction.id, data);
        } else {
          await updateExpense(editingTransaction.id, data);
        }
      } else {
        // Режим создания
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

  if (isLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>
      
      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={balanceData.totalIncome}
          color="#39ff14"
          icon="💰"
        />
        <BalanceCard
          title="Расходы"
          amount={balanceData.totalExpense}
          color="#ff2a6d"
          icon="💸"
        />
        <BalanceCard
          title="Баланс"
          amount={balanceData.balance}
          color="#00f0ff"
          icon="💎"
        />
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
        </div>
        
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      <button className={styles.addButton} onClick={handleOpenAddModal} title="Добавить операцию">
        +
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingTransaction ? 'Редактировать операцию' : 'Новая операция'}
      >
        <TransactionForm 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;