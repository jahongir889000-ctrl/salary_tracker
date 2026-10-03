import React from "react";

/**
 * Заглушка для графиков без данных
 * @param {string} icon - эмодзи-иконка
 * @param {string} text - текст-подсказка
 */
export function ChartPlaceholder({ icon, text }) {
  return (
    <div className="animate-fade-in flex h-[300px] flex-col items-center justify-center gap-3 text-secondary">
      <span className="animate-float text-5xl">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}

/**
 * Всплывающая подсказка диаграммы
 * @param {Object} props - стандартные пропы Recharts (active, payload, label)
 */
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="animate-pop rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-pop backdrop-blur">
      {label && <p className="mb-1 text-sm font-semibold text-text">{label}</p>}

      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span className="text-secondary">{entry.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-text">
            {Number(entry.value).toLocaleString("ru-RU")} сўм
          </span>
        </div>
      ))}
    </div>
  );
}

export default ChartTooltip;
