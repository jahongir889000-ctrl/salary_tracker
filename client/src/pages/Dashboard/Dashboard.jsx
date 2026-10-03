import React, { useState, useEffect } from "react";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import TransactionList from "../../components/TransactionList/TransactionList";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import Modal from "../../components/Modal/Modal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import {
  getBalance,
  getIncomes,
  getExpenses,
  createIncome,
  createExpense,
  deleteIncome,
  deleteExpense,
} from "../../services/transactionService";

function Dashboard() {
  const [balance, setBalance] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [balanceData, incomesData, expensesData] = await Promise.all([
        getBalance(),
        getIncomes({ limit: 5 }),
        getExpenses({ limit: 5 }),
      ]);

      setBalance(balanceData);

      // Объединяем доходы и расходы, сортируем по дате
      const allTransactions = [
        ...(incomesData.data || []),
        ...(expensesData.data || []),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentTransactions(allTransactions.slice(0, 5));
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      alert("Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Обработка добавления/редактирования
  const handleSubmit = async (data) => {
    try {
      if (editingTransaction) {
        // Редактирование (пока не реализовано в этом упрощённом варианте)
        alert("Редактирование пока не поддерживается на главной странице");
        return;
      }

      if (data.type === "income") {
        await createIncome(data);
      } else {
        await createExpense(data);
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
      await loadData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert(error.message || "Не удалось сохранить операцию");
    }
  };

  // Обработка удаления
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "income") {
        await deleteIncome(deleteConfirm.id);
      } else {
        await deleteExpense(deleteConfirm.id);
      }

      setDeleteConfirm(null);
      await loadData();
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Не удалось удалить операцию");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-secondary">
        <span className="size-9 animate-spin rounded-full border-[3px] border-border border-t-primary" />
        <p className="animate-shimmer text-sm">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="page-title">Главная</h1>

      {/* Карточки баланса */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BalanceCard
          title="Доходы"
          amount={balance.totalIncome}
          color="var(--success)"
        />
        <BalanceCard
          title="Расходы"
          amount={balance.totalExpense}
          color="var(--danger)"
        />
        <BalanceCard
          title="Баланс"
          amount={balance.balance}
          color="var(--primary)"
        />
      </div>

      {/* Последние операции */}
      <section className="card animate-rise p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight text-text">
            Последние операции
          </h2>

          <button
            type="button"
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary hidden px-3.5 py-2 text-sm sm:inline-flex"
          >
            + Добавить
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <TransactionList
            transactions={recentTransactions}
            onDelete={(transaction) => setDeleteConfirm(transaction)}
            onEdit={(transaction) => {
              setEditingTransaction(transaction);
              setIsFormOpen(true);
            }}
          />
        ) : (
          <div className="animate-fade-in rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
            <p className="mb-1 font-medium text-secondary">
              Операций пока нет
            </p>
            <p className="text-sm text-secondary/70">
              Нажмите кнопку «+», чтобы добавить первую операцию
            </p>
          </div>
        )}
      </section>

      {/* Кнопка добавления (FAB) */}
      <button
        type="button"
        onClick={() => {
          setEditingTransaction(null);
          setIsFormOpen(true);
        }}
        title="Добавить операцию"
        aria-label="Добавить операцию"
        className="fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-primary text-3xl font-light text-on-primary shadow-pop transition-all duration-300 hover:scale-110 hover:bg-primary-hover active:scale-95 sm:size-15"
      >
        +
      </button>

      {/* Модальное окно формы */}
      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTransaction(null);
            }}
            editData={editingTransaction}
          />
        </Modal>
      )}

      {/* Диалог подтверждения удаления */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Удалить операцию?"
          message="Вы уверены, что хотите удалить эту операцию? Это действие нельзя отменить."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
