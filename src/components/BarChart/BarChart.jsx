import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./BarChart.module.css";

function BarChart({ data, title }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div className={styles.placeholder}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📈</div>
        <p>Данные для графика отсутствуют</p>
      </div>
    );
  }

  // Форматирование tooltip
  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {(payload || []).map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <div
                className={styles.tooltipDot}
                style={{ backgroundColor: entry.color }}
              />
              <span className={styles.tooltipValue}>
                {entry.name}: {entry.value.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Форматирование Y-оси
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatYAxis} />
          <Tooltip content={renderTooltip} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: "#1f2937", fontSize: "14px" }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="income"
            name="Доходы"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Расходы"
            fill="#ef4444"
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
