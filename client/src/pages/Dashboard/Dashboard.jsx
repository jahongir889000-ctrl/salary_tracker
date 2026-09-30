import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionList from '../../components/TransactionList/TransactionList';
import { getBalance, getAllTransactions } from '../../services/summaryService';
import { addIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, deleteExpense } from '../../services/expenseService';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (data) => {
    try {
      if (data.type === 'income') {
        await addIncome(data);
      } else {
        await addExpense(data);
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка при добавлении операции:', error);
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

  const handleEdit = (transaction) => {
    console.log('Редактировать операцию:', transaction);
    alert('Редактирование будет подключено позже');
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <button className={styles.addButton} onClick={handleOpenModal} title="Добавить операцию">
        +
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Новая операция">
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default Dashboard;