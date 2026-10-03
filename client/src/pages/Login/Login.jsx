import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Поля формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если пользователь уже авторизован — перенаправляем на главную
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Простая валидация
    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email, password });
      // После успешного входа AuthContext обновит состояние,
      // и useEffect выше перенаправит на главную
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Неверный email или пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Пока идёт восстановление сессии — показываем загрузку
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-secondary transition-colors duration-500">
        <span className="size-9 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[image:var(--auth-gradient)] p-4 transition-[background-image] duration-700">
      {/* Декоративные светящиеся пятна */}
      <span
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -left-16 top-10 size-72 rounded-full bg-primary/25 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-success/20 blur-3xl [animation-delay:1.2s]"
      />

      {/* Переключатель темы */}
      <ThemeToggle className="absolute right-5 top-5 z-10" />

      {/* Карточка формы */}
      <div className="animate-pop relative w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-pop transition-colors duration-500 sm:p-10">
        <div className="animate-float mb-6 text-center text-4xl">💰</div>

        <h1 className="mb-1.5 text-center text-2xl font-bold tracking-tight text-text">
          Вход в систему
        </h1>
        <p className="mb-6 text-center text-sm text-secondary">
          Войдите, чтобы управлять своими финансами
        </p>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="animate-pop mb-5 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-center text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Поле email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Поле пароля */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            className="btn btn-primary mt-1 w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>

        {/* Ссылка на регистрацию */}
        <div className="mt-6 text-center text-sm text-secondary">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary transition-all duration-200 hover:text-primary-hover hover:underline"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
