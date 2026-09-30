import React from 'react';
import styles from './TransactionList.module.css';
import EmptyState from '../EmptyState/EmptyState';
import { getCategoryLabel, getCategoryIcon } from '../../utils/constants';

function TransactionList({ transactions, onEdit, onDelete }) {
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
        // Теперь type корректно приходит с бэкенда
        const type = transaction?.type || 'expense';
        const categoryId = transaction?.category || 'other';
        
        // Получаем человекочитаемое название и иконку
        const categoryLabel = getCategoryLabel(categoryId, type);
        const categoryIcon = getCategoryIcon(categoryId, type);
        
        const amount = transaction?.amount ?? 0;
        const date = transaction?.date || new Date().toISOString().split('T')[0];
        const comment = transaction?.comment || '';
        const id = transaction?.id;

        const formattedAmount = type === 'income' 
          ? `+${amount.toLocaleString('ru-RU')} ₽`
          : `-${amount.toLocaleString('ru-RU')} ₽`;

        const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        return (
          <div key={id} className={`${styles.item} ${styles[type]}`}>
            <div className={styles.categoryIcon}>
              {categoryIcon}
            </div>

            <div className={styles.info}>
              <div className={styles.topRow}>
                {/* Отображаем название категории, а не её ID */}
                <div className={styles.category}>{categoryLabel}</div>
                <div className={`${styles.amount} ${styles[`amount${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
                  {formattedAmount}
                </div>
              </div>
              
              <div className={styles.bottomRow}>
                <div className={styles.date}>{formattedDate}</div>
                {comment && (
                  <div className={styles.comment}>{comment}</div>
                )}
              </div>
            </div>

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