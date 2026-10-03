import React from "react";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_ICONS,
} from "../../utils/constants";
import { formatTransactionAmount, formatDate } from "../../utils/formatters";

/**
 * Получить русское название категории по ID и типу операции
 * @param {string} categoryId - ID категории (например, 'salary')
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} русское название (например, 'Зарплата')
 */
function getCategoryLabel(categoryId, type) {
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = (categories || []).find((cat) => cat.id === categoryId);
  return category?.label || "Прочее";
}

/**
 * Получить иконку для категории
 * @param {string} categoryId - ID категории
 * @returns {string} эмодзи-иконка
 */
function getCategoryIcon(categoryId) {
  return CATEGORY_ICONS[categoryId] || "📦";
}

function TransactionList({ transactions, onEdit, onDelete }) {
  // Если операций нет — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <div className="animate-fade-in py-10 text-center text-secondary">
        Операций пока нет
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {(transactions || []).map((transaction, index) => {
        const isIncome = transaction?.type === "income";
        const categoryLabel = getCategoryLabel(
          transaction?.category,
          transaction?.type,
        );
        const categoryIcon = getCategoryIcon(transaction?.category);
        const formattedAmount = formatTransactionAmount(
          transaction?.amount,
          transaction?.type,
        );
        const formattedDate = formatDate(transaction?.date);

        return (
          <li
            key={transaction?.id}
            style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            className="animate-rise group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card sm:p-4"
          >
            {/* Левая часть: иконка + название категории + дата */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-110 sm:size-11 ${
                  isIncome ? "bg-success-soft" : "bg-danger-soft"
                }`}
              >
                {categoryIcon}
              </span>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-text sm:text-[0.95rem]">
                  {categoryLabel}
                </span>
                <span className="text-xs text-secondary sm:text-sm">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Правая часть: сумма + кнопки действий */}
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`text-sm font-bold tabular-nums transition-transform duration-300 group-hover:scale-105 sm:text-base ${
                  isIncome ? "text-success" : "text-danger"
                }`}
              >
                {formattedAmount}
              </span>

              <div className="flex gap-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    title="Редактировать"
                    aria-label="Редактировать операцию"
                    className="grid size-8 place-items-center rounded-lg text-sm transition-all duration-200 hover:scale-110 hover:bg-surface-muted active:scale-95"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(transaction)}
                    title="Удалить"
                    aria-label="Удалить операцию"
                    className="grid size-8 place-items-center rounded-lg text-sm transition-all duration-200 hover:scale-110 hover:bg-danger-soft active:scale-95"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TransactionList;
