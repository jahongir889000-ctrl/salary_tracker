import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

// Ключ хранения выбранной темы
const THEME_KEY = "theme";

const ThemeContext = createContext(null);

/**
 * Определяет начальную тему: сохранённый выбор, иначе системная настройка
 * @returns {'light'|'dark'}
 */
function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Провайдер темы оформления
 * Управляет классом .dark на <html> и синхронизирует выбор с localStorage
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Применяем тему к документу
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  // Если пользователь не выбирал тему вручную — реагируем на смену системной
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      if (localStorage.getItem(THEME_KEY)) return;
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme: (next) => {
      localStorage.setItem(THEME_KEY, next);
      setTheme(next);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Хук для доступа к теме
 * @returns {Object} { theme, isDark, toggleTheme, setTheme }
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme должен использоваться внутри ThemeProvider");
  }
  return context;
}

export default ThemeContext;
