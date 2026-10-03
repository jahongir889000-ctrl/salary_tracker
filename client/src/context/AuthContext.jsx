import React, { createContext, useContext, useState, useEffect } from "react";
import { post } from "../services/api";

// Создаём контекст
const AuthContext = createContext(null);

// Ключ для хранения токена в localStorage
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Провайдер аутентификации
 * Оборачивает всё приложение и предоставляет данные о пользователе
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // При монтировании восстанавливаем сессию из localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Ошибка восстановления сессии:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  /**
   * Регистрация нового пользователя
   * @param {Object} data - { email, name, password }
   * @returns {Promise<Object>} данные пользователя
   */
  const register = async (data) => {
    const response = await post("/auth/register", data);

    // Сохраняем токен и данные пользователя
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);

    return response.user;
  };

  /**
   * Авторизация пользователя
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} данные пользователя
   */
  const login = async (data) => {
    const response = await post("/auth/login", data);

    // Сохраняем токен и данные пользователя
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);

    return response.user;
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // Значение контекста
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Хук для использования контекста аутентификации
 * @returns {Object} { user, token, isLoading, isAuthenticated, login, register, logout }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
}

export default AuthContext;
