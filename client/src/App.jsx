import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";
import Analytics from "./pages/Analytics/Analytics";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

/**
 * Экран загрузки (пока восстанавливается сессия)
 */
function LoadingScreen({ text = "Загрузка..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-secondary">
      <span className="size-10 animate-spin rounded-full border-[3px] border-border border-t-primary transition-colors duration-500" />
      <p className="animate-shimmer text-sm">{text}</p>
    </div>
  );
}

/**
 * Компонент для защиты роутов от неавторизованных пользователей
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Компонент для защиты публичных роутов (login/register)
 */
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Общий макет защищённых страниц: шапка + контент с анимацией смены страницы
 */
function AppShell({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* key по пути перезапускает анимацию при переходе между страницами */}
        <div key={location.pathname} className="animate-rise">
          {children}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-6 text-center text-xs text-secondary sm:px-6 lg:px-8">
        Salary Tracker — учёт личных финансов
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Публичные роуты */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Защищённые роуты с общей структурой макета */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppShell>
              <History />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppShell>
              <Analytics />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Все остальные маршруты — перенаправление на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
