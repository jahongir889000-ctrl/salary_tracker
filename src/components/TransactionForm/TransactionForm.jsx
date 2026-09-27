import React, { useState, useEffect } from "react";
import styles from "./TransactionForm.module.css";

// Fallback-категории на случай, если constants.js ещё не импортирован
const FALLBACK_INCOME_CATEGORIES = [
  { id: "salary", label: "Зарплата" },
  { id: "freelance", label: "Подработка" },
  { id: "other", label: "Прочее" },
];

const FALLBACK_EXPENSE_CATEGORIES = [
  { id: "groceries", label: "Продукты" },
  { id: "utilities", label: "Коммуналка" },
  { id: "transport", label: "Транспорт" },
  { id: "other", label: "Прочее" },
];

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Состояние формы
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [comment, setComment] = useState("");

  // Если переданы данные для редактирования — заполняем форму
  useEffect(() => {
    if (editData) {
      setType(editData?.type || "expense");
      setCategory(editData?.category || "");
      setAmount(editData?.amount?.toString() || "");
      setDate(editData?.date || new Date().toISOString().split("T")[0]);
      setComment(editData?.comment || "");
    }
  }, [editData]);

  // Получаем категории для текущего типа операции (fallback)
  const categories =
    type === "income"
      ? FALLBACK_INCOME_CATEGORIES
      : FALLBACK_EXPENSE_CATEGORIES;

  // При смене типа сбрасываем категорию
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory("");
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация
    if (!category || !amount || !date) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const transactionData = {
      type,
      category,
      amount: parseFloat(amount),
      date,
      comment: comment.trim(),
    };

    // Если редактируем — передаём id
    if (editData?.id) {
      transactionData.id = editData.id;
    }

    onSubmit?.(transactionData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Тип операции</label>
        <div className={styles.typeSwitcher}>
          <button
            type="button"
            className={`${styles.typeButton} ${styles.typeButtonIncome} ${type === "income" ? styles.typeButtonActive : ""}`}
            onClick={() => handleTypeChange("income")}
          >
            Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${styles.typeButtonExpense} ${type === "expense" ? styles.typeButtonActive : ""}`}
            onClick={() => handleTypeChange("expense")}
          >
            Расход
          </button>
        </div>
      </div>

      {/* Категория */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Категория <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          {(categories || []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Сумма и дата в сетке */}
      <div className={styles.grid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Сумма (₽) <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Дата <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          placeholder="Необязательное поле"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      {/* Кнопки действий */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          {editData?.id ? "Сохранить" : "Добавить"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
