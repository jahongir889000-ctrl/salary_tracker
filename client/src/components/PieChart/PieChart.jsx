import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { ChartPlaceholder, ChartTooltip } from "../ChartShared/ChartShared";

// Цвета для секторов диаграммы
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

function PieChart({ data }) {
  const { isDark } = useTheme();
  const textColor = isDark ? "#94a3b8" : "#64748b";

  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <ChartPlaceholder icon="📊" text="Данные для графика отсутствуют" />
    );
  }

  return (
    // key по теме перерисовывает график с анимацией при смене темы
    <ResponsiveContainer
      width="100%"
      height={320}
      key={isDark ? "dark" : "light"}
    >
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => (
            <text
              fill={textColor}
              fontSize={12}
              fontWeight={500}
              textAnchor="middle"
            >
              {`${name}: ${(percent * 100).toFixed(0)}%`}
            </text>
          )}
          outerRadius={110}
          innerRadius={55}
          paddingAngle={2}
          stroke="none"
          dataKey="value"
          animationDuration={800}
          animationEasing="ease-out"
        >
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={44}
          iconType="circle"
          formatter={(value) => (
            <span style={{ color: textColor, fontSize: 13 }}>{value}</span>
          )}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export default PieChart;
