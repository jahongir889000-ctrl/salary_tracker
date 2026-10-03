import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { API_BASE_URL } from "../../services/api";

/**
 * Экспорт операций в CSV с передачей токена в заголовке
 * Использует fetch для получения данных, затем скачивает файл через Blob
 */
function useExportCsv() {
  const handleExport = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      alert("Не удалось экспортировать данные. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/export/csv`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не удалось экспортировать данные");
      }

      // Получаем данные как Blob
      const blob = await response.blob();

      // Создаём временную ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "salary_tracker_export.csv";
      document.body.appendChild(link);
      link.click();

      // Очищаем временные объекты
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      alert(error.message || "Не удалось экспортировать данные");
    }
  };

  return handleExport;
}

function Header() {
  const { user, logout } = useAuth();
  const handleExport = useExportCsv();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl transition-colors duration-500">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Логотип */}
        <NavLink
          to="/"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight text-primary"
        >
          <span className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            💰
          </span>
          <span className="transition-opacity duration-200 group-hover:opacity-70">
            Salary Tracker
          </span>
        </NavLink>

        {/* Навигация */}
        <nav className="order-3 flex w-full gap-1 rounded-xl bg-surface-muted/70 p-1 md:order-none md:w-auto md:flex-1 md:justify-center">
          {[
            { to: "/", label: "Главная" },
            { to: "/history", label: "История" },
            { to: "/analytics", label: "Аналитика" },
          ].map((item) => {
            const isActive = item.to === location.pathname;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-300 md:flex-none ${
                  isActive
                    ? "bg-surface text-text shadow-card"
                    : "text-secondary hover:bg-surface/60 hover:text-text"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Действия пользователя */}
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <span className="hidden max-w-[12rem] truncate rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-secondary transition-colors duration-500 sm:block">
            👤 {user?.name || "Пользователь"}
          </span>

          <button
            type="button"
            onClick={handleExport}
            title="Экспорт в CSV"
            className="btn bg-success px-3.5 py-2 text-sm text-white hover:bg-success-hover hover:shadow-card"
          >
            <span className="hidden sm:inline">Экспорт</span>
            <span>📥</span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={logout}
            title="Выйти из системы"
            className="btn btn-ghost px-3 py-2 text-sm hover:text-danger"
          >
            <span className="hidden sm:inline">Выйти</span>
            <span>🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
