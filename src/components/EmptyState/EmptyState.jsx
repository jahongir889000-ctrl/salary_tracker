import React from "react";
import styles from "./EmptyState.module.css";

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "📊",
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>

      {title && <h3 className={styles.title}>{title}</h3>}

      {description && <p className={styles.description}>{description}</p>}

      {actionLabel && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
