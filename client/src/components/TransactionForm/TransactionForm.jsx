import React, { useState, useEffect } from "react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../utils/constants";

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Тип операции: income или expense
  const [type, setType] = useState(editData?.type || "expense");

  // Поля формы
  const [amount, setAmount] = useState(editData?.amount || "");
  const [date, setDate] = useState(
    editData?.date || new Date().toISOString().split("T")[0],
  );
  const [category, setCategory] = useState(editData?.category || "");
  const [comment, setComment] = useState(editData?.comment || "");
  const [isRecurring, setIsRecurring] = useState(
    editData?.isRecurring || false,
  );

  // При смене типа операции сбрасываем категорию на первую из списка
  useEffect(() => {
    const categories =
      type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!category || !categories.find((c) => c.id === category)) {
      setCategory(categories[0]?.id || "");
    }
  }, [type]);

  // Получаем список категорий для текущего типа
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Простая валидация
    if (!amount || Number(amount) <= 0) {
      alert("Введите корректную сумму");
      return;
    }

    if (!date) {
      alert("Выберите дату");
      return;
    }

    if (!category) {
      alert("Выберите категорию");
      return;
    }

    // Формируем объект данных
    const data = {
      type,
      amount: Number(amount),
      date,
      category,
      comment: comment.trim(),
    };

    // Для расходов добавляем признак регулярности
    if (type === "expense") {
      data.isRecurring = isRecurring;
    }

    onSubmit(data);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:text-base ${
            type === "income"
              ? "bg-success text-white shadow-card"
              : "text-secondary hover:bg-surface/60 hover:text-text"
          }`}
        >
          💰 Доход
        </button>

        <button
          type="button"
          onClick={() => setType("expense")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:text-base ${
            type === "expense"
              ? "bg-danger text-white shadow-card"
              : "text-secondary hover:bg-surface/60 hover:text-text"
          }`}
        >
          💸 Расход
        </button>
      </div>

      {/* Сумма и дата */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text" htmlFor="amount">
            Сумма
          </label>
          <input
            id="amount"
            type="number"
            className="field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например, 150 000"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text" htmlFor="date">
            Дата
          </label>
          <input
            id="date"
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Категория */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text" htmlFor="category">
          Категория
        </label>
        <select
          id="category"
          className="field cursor-pointer"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Комментарий */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text" htmlFor="comment">
          Комментарий
        </label>
        <textarea
          id="comment"
          className="field min-h-[70px] resize-y"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательное поле"
          rows="2"
        />
      </div>

      {/* Чекбокс регулярного расхода (только для расходов) */}
      {type === "expense" && (
        <label
          htmlFor="isRecurring"
          className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface-muted px-4 py-3 transition-colors duration-300 hover:bg-surface-hover"
        >
          <input
            id="isRecurring"
            type="checkbox"
            className="size-5 cursor-pointer accent-primary"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span className="text-sm text-text">Регулярный расход</span>
        </label>
      )}

      {/* Кнопки действий */}
      <div className="mt-1 flex gap-3">
        <button
          type="button"
          className="btn btn-ghost flex-1 bg-surface-muted"
          onClick={onCancel}
        >
          Отмена
        </button>

        <button
          type="submit"
          className={`btn flex-1 text-white ${
            type === "income" ? "bg-success hover:bg-success-hover" : "bg-danger hover:bg-danger-hover"
          }`}
        >
          {editData ? "Сохранить" : "Добавить"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
