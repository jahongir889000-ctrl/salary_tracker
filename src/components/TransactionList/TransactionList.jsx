import React from "react";
import styles from "./TransactionList.module.css";
import EmptyState from "../EmptyState/EmptyState";

function TransactionList({ transactions, onEdit, onDelete }) {
  // Если список операций пуст — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="Нет операций"
        description="Добавьте первую операцию, чтобы увидеть историю"
        icon="📋"
      />
    );
  }

  return (
    <div className={styles.list}>
      {(transactions || []).map((transaction) => {
        // Fallback для полей операции
        const type = transaction?.type || "expense";
        const category = transaction?.category || "Прочее";
        const amount = transaction?.amount ?? 0;
        const date =
          transaction?.date || new Date().toISOString().split("T")[0];
        const comment = transaction?.comment || "";
        const id = transaction?.id;

        // Форматирование суммы с учётом типа операции
        const formattedAmount =
          type === "income"
            ? `+${amount.toLocaleString("ru-RU")} ₽`
            : `-${amount.toLocaleString("ru-RU")} ₽`;

        // Форматирование даты
        const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        // Иконка категории (временно — эмодзи, позже будет из constants)
        const categoryIcon = type === "income" ? "💰" : "💸";

        return (
          <div key={id} className={`${styles.item} ${styles[type]}`}>
            {/* Иконка категории */}
            <div className={styles.categoryIcon}>{categoryIcon}</div>

            {/* Основная информация */}
            <div className={styles.info}>
              <div className={styles.topRow}>
                <div className={styles.category}>{category}</div>
                <div
                  className={`${styles.amount} ${styles[`amount${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}
                >
                  {formattedAmount}
                </div>
              </div>

              <div className={styles.bottomRow}>
                <div className={styles.date}>{formattedDate}</div>
                {comment && <div className={styles.comment}>{comment}</div>}
              </div>
            </div>

            {/* Кнопки действий */}
            <div className={styles.actions}>
              {onEdit && (
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(transaction)}
                  title="Редактировать"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(transaction)}
                  title="Удалить"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
