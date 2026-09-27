import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Modal from "../../components/Modal/Modal";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import { getBalance, getAllTransactions } from "../../services/summaryService";
import { addIncome, deleteIncome } from "../../services/incomeService";
import { addExpense, deleteExpense } from "../../services/expenseService";

function Dashboard() {
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние данных
  const [balanceData, setBalanceData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = () => {
    const balance = getBalance();
    setBalanceData(balance);

    const transactions = getAllTransactions(5); // Последние 5 операций
    setRecentTransactions(transactions);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработка добавления операции
  const handleSubmit = (data) => {
    if (data.type === "income") {
      addIncome(data);
    } else {
      addExpense(data);
    }

    // Перезагружаем данные после добавления
    loadData();
    handleCloseModal();
  };

  // Обработка удаления операции
  const handleDelete = (transaction) => {
    if (!transaction?.id) return;

    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту операцию?",
    );
    if (!confirmed) return;

    if (transaction.type === "income") {
      deleteIncome(transaction.id);
    } else {
      deleteExpense(transaction.id);
    }

    // Перезагружаем данные после удаления
    loadData();
  };

  // Обработка редактирования (пока заглушка — будет реализовано позже)
  const handleEdit = (transaction) => {
    console.log("Редактировать операцию:", transaction);
    alert("Редактирование будет подключено позже");
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>

      {/* Карточки баланса */}
      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={balanceData.totalIncome}
          color="#10b981"
        />
        <BalanceCard
          title="Расходы"
          amount={balanceData.totalExpense}
          color="#ef4444"
        />
        <BalanceCard
          title="Баланс"
          amount={balanceData.balance}
          color="#2563eb"
        />
      </div>

      {/* Секция последних операций */}
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

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        onClick={handleOpenModal}
        title="Добавить операцию"
      >
        +
      </button>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Новая операция"
      >
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default Dashboard;
