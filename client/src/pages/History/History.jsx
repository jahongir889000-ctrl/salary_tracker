import React, { useState, useEffect } from "react";
import TransactionList from "../../components/TransactionList/TransactionList";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import { getAllTransactions } from "../../services/summaryService";
import { addIncome, updateIncome, deleteIncome } from "../../services/incomeService";
import { addExpense, updateExpense, deleteExpense } from "../../services/expenseService";
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
  const [isLoading, setIsLoading] = useState(true);

  // Состояние для модалки подтверждения удаления
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Функция загрузки данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      const transactions = await getAllTransactions();
      setAllTransactions(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
      alert("Не удалось загрузить историю операций. Проверьте, запущен ли сервер.");
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Получаем категории для текущего фильтра типа
  const getCategoriesForFilter = () => {
    if (typeFilter === "income") {
      return INCOME_CATEGORIES;
    } else if (typeFilter === "expense") {
      return EXPENSE_CATEGORIES;
    } else {
      return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    }
  };

  // Фильтрация операций
  const filteredTransactions = (allTransactions || []).filter((transaction) => {
    if (typeFilter !== "all" && transaction?.type !== typeFilter) return false;
    if (categoryFilter !== "all" && transaction?.category !== categoryFilter)
      return false;
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
  const handleSubmit = async (data) => {
    try {
      if (editingTransaction?.id) {
        // Редактирование существующей операции
        if (data.type === "income") {
          await updateIncome(editingTransaction.id, data);
        } else {
          await updateExpense(editingTransaction.id, data);
        }
      } else {
        // Добавление новой операции
        if (data.type === "income") {
          await addIncome(data);
        } else {
          await addExpense(data);
        }
      }

      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка сохранения операции:", error);
      alert(`Ошибка: ${error.message}`);
    }
  };

  // Открытие модалки подтверждения удаления
  const handleDelete = (transaction) => {
    if (!transaction?.id) return;
    setTransactionToDelete(transaction);
    setIsConfirmModalOpen(true);
  };

  // Подтверждение удаления
  const handleConfirmDelete = async () => {
    if (!transactionToDelete?.id) return;

    try {
      if (transactionToDelete.type === "income") {
        await deleteIncome(transactionToDelete.id);
      } else {
        await deleteExpense(transactionToDelete.id);
      }
      await loadData();
    } catch (error) {
      console.error("Ошибка удаления операции:", error);
      alert("Не удалось удалить операцию");
    } finally {
      setTransactionToDelete(null);
    }
  };

  // Закрытие модалки подтверждения
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTransactionToDelete(null);
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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-secondary">
        <span className="size-9 animate-spin rounded-full border-[3px] border-border border-t-primary" />
        <p className="animate-shimmer text-sm">
          Загрузка истории операций...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">История операций</h1>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn btn-primary px-4 py-2 text-sm"
        >
          + Добавить операцию
        </button>
      </div>

      {/* Панель фильтров */}
      <div className="card animate-rise grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-secondary" htmlFor="typeFilter">
            Тип операции
          </label>
          <select
            id="typeFilter"
            className="field cursor-pointer"
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-secondary" htmlFor="categoryFilter">
            Категория
          </label>
          <select
            id="categoryFilter"
            className="field cursor-pointer"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-secondary" htmlFor="periodFilter">
            Период
          </label>
          <select
            id="periodFilter"
            className="field cursor-pointer"
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

        <div className="flex items-end">
          <button
            type="button"
            className="btn btn-ghost w-full bg-surface-muted"
            onClick={handleResetFilters}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Список операций */}
      <div className="card animate-rise p-5 sm:p-6" style={{ animationDelay: "80ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-text">
            Операции
          </h2>
          <span className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium tabular-nums text-secondary transition-colors duration-500">
            {filteredTransactions.length}
          </span>
        </div>

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

      {/* Модальное окно подтверждения удаления */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Удалить операцию?"
        message="Вы уверены, что хотите удалить эту операцию? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
}

export default History;
