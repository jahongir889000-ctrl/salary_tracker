import React, { useState, useEffect } from "react";
import styles from "./History.module.css";
import TransactionList from "../../components/TransactionList/TransactionList";
import Modal from "../../components/Modal/Modal";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import { getAllTransactions } from "../../services/summaryService";
import {
  addIncome,
  updateIncome,
  deleteIncome,
} from "../../services/incomeService";
import {
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../utils/constants";
import { isDateInPeriod } from "../../utils/formatters";

function History() {
  // Состояние фильтров
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Состояние данных
  const [allTransactions, setAllTransactions] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = () => {
    const transactions = getAllTransactions();
    setAllTransactions(transactions);
  };

  // Получаем категории для текущего фильтра типа
  const getCategoriesForFilter = () => {
    if (typeFilter === "income") {
      return INCOME_CATEGORIES;
    } else if (typeFilter === "expense") {
      return EXPENSE_CATEGORIES;
    } else {
      // Все категории (доходы + расходы)
      return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    }
  };

  // Фильтрация операций
  const filteredTransactions = (allTransactions || []).filter((transaction) => {
    // Фильтр по типу
    if (typeFilter !== "all" && transaction?.type !== typeFilter) return false;

    // Фильтр по категории
    if (categoryFilter !== "all" && transaction?.category !== categoryFilter)
      return false;

    // Фильтр по периоду
    if (!isDateInPeriod(transaction?.date, periodFilter)) return false;

    return true;
  });

  // Открытие модалки для добавления
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Обработка отправки формы (добавление или редактирование)
  const handleSubmit = (data) => {
    if (editingTransaction?.id) {
      // Редактирование существующей операции
      if (data.type === "income") {
        updateIncome(editingTransaction.id, data);
      } else {
        updateExpense(editingTransaction.id, data);
      }
    } else {
      // Добавление новой операции
      if (data.type === "income") {
        addIncome(data);
      } else {
        addExpense(data);
      }
    }

    // Перезагружаем данные
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

    // Перезагружаем данные
    loadData();
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setPeriodFilter("all");
  };

  // Смена типа фильтра — сбрасываем фильтр по категории
  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setCategoryFilter("all");
  };

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterInput}
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterInput}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {(getCategoriesForFilter() || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select
            className={styles.filterInput}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Сбросить фильтры
        </button>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Редактировать операцию" : "Новая операция"}
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

export default History;
