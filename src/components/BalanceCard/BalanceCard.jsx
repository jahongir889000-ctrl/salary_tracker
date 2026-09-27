import React from "react";
import styles from "./BalanceCard.module.css";

function BalanceCard({ title, amount, color }) {
  // Fallback для суммы — если amount не передан или null/undefined, показываем 0
  const displayAmount = amount ?? 0;

  // Fallback для цвета — если color не передан, используем основной цвет
  const borderColor = color || "var(--color-primary)";

  return (
    <div className={styles.card} style={{ borderLeftColor: borderColor }}>
      <div className={styles.label}>{title || "Баланс"}</div>
      <div className={styles.amount}>
        {displayAmount.toLocaleString("ru-RU")} ₽
      </div>
    </div>
  );
}

export default BalanceCard;
