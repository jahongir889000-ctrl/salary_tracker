import React from "react";

/**
 * Форматирование суммы для карточки баланса
 * @param {number} amount - сумма
 * @returns {string} отформатированная строка (например, "150 000 сўм")
 */
function formatAmount(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 сўм";
  }

  // Форматируем число с пробелами как разделителями тысяч
  return (
    Math.abs(amount).toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " сўм"
  );
}

function BalanceCard({ title, amount, color }) {
  return (
    <div
      className="card group relative overflow-hidden border-l-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
      style={{ borderLeftColor: color }}
    >
      {/* Мягкое свечение цвета карточки */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-center gap-2 text-sm font-medium text-secondary">
        {title}
      </div>

      <div
        className="relative mt-2 text-2xl font-bold tracking-tight tabular-nums transition-transform duration-300 group-hover:scale-[1.03] sm:text-3xl"
        style={{ color }}
      >
        {formatAmount(amount)}
      </div>
    </div>
  );
}

export default BalanceCard;
