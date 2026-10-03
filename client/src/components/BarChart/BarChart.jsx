import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { ChartPlaceholder, ChartTooltip } from "../ChartShared/ChartShared";

// Форматирование Y-оси
function formatYAxis(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
}

function BarChart({ data }) {
  const { isDark } = useTheme();
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#24334d" : "#e6ebf3";

  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <ChartPlaceholder icon="📈" text="Данные для графика отсутствуют" />
    );
  }

  return (
    // key по теме перерисовывает график с анимацией при смене темы
    <ResponsiveContainer
      width="100%"
      height={320}
      key={isDark ? "dark" : "light"}
    >
      <RechartsBarChart
        data={data}
        margin={{ top: 16, right: 12, left: 4, bottom: 4 }}
      >
        <CartesianGrid
          strokeDasharray="4 6"
          stroke={gridColor}
          vertical={false}
        />

        <XAxis
          dataKey="month"
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={formatYAxis}
        />

        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: isDark ? "#17233b" : "#eef2f8", radius: 8 }}
        />

        <Legend
          verticalAlign="top"
          height={40}
          iconType="circle"
          formatter={(value) => (
            <span style={{ color: textColor, fontSize: 13 }}>{value}</span>
          )}
        />

        <Bar
          dataKey="income"
          name="Доходы"
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          maxBarSize={34}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="expense"
          name="Расходы"
          fill="#ef4444"
          radius={[8, 8, 0, 0]}
          maxBarSize={34}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
