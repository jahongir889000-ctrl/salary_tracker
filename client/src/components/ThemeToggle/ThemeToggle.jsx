import React from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Переключатель темы (светлая ↔ тёмная) с анимацией смены иконок
 */
function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface text-lg transition-all duration-300 hover:border-border-strong hover:bg-surface-hover hover:shadow-card active:scale-95 ${className}`}
      title={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {/* Солнце — видно в светлой теме, плавно уезжает вверх */}
      <span
        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark
            ? "-translate-y-10 rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        }`}
      >
        ☀️
      </span>

      {/* Луна — выезжает снизу в тёмной теме */}
      <span
        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark
            ? "translate-y-0 rotate-0 opacity-100"
            : "translate-y-10 -rotate-90 opacity-0"
        }`}
      >
        🌙
      </span>
    </button>
  );
}

export default ThemeToggle;
