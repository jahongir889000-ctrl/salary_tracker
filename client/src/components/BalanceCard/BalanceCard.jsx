import React from 'react';
import styles from './BalanceCard.module.css';
import { formatCurrency } from '../../utils/formatters';

function BalanceCard({ title, amount, color = '#00f0ff', icon = '💎' }) {
  return (
    <div 
      className={styles.card}
      style={{ '--card-color': color }}
    >
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.icon}>{icon}</div>
      </div>
      
      <div className={styles.amount}>
        {formatCurrency(amount)}
      </div>
      
      <div className={styles.decoration}></div>
    </div>
  );
}

export default BalanceCard;