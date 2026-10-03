import React, { useEffect } from "react";

/**
 * Модальное окно подтверждения действия
 * @param {Object} props
 * @param {boolean} props.isOpen - открыто ли окно
 * @param {Function} props.onClose - функция закрытия
 * @param {Function} props.onConfirm - функция подтверждения
 * @param {string} props.title - заголовок окна
 * @param {string} props.message - текст сообщения
 * @param {string} props.confirmText - текст кнопки подтверждения (по умолчанию 'Удалить')
 * @param {string} props.cancelText - текст кнопки отмены (по умолчанию 'Отмена')
 * @param {string} props.variant - вариант кнопки ('danger' для удаления, 'primary' для других действий)
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение",
  message = "Вы уверены?",
  confirmText = "Удалить",
  cancelText = "Отмена",
  variant = "danger",
}) {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Если окно закрыто — ничего не рендерим
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Закрываем при клике на фон (но не на само окно)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="animate-pop w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-pop transition-colors duration-500"
      >
        <div className="mb-3 text-5xl">❓</div>

        <h3 className="mb-2 text-lg font-bold text-text">{title}</h3>

        <p className="mb-6 text-sm leading-relaxed text-secondary">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-ghost flex-1 bg-surface-muted"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`btn flex-1 ${
              variant === "danger" ? "btn-danger" : "btn-primary"
            }`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
