import React from "react";

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  // Закрытие по Escape
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  // Закрытие по клику на свободное место (overlay)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="animate-pop w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-pop transition-colors duration-500"
      >
        <div className="mb-3 text-5xl">🗑️</div>

        <h3 className="mb-2 text-lg font-bold text-text">{title}</h3>

        <p className="mb-6 text-sm leading-relaxed text-secondary">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-ghost flex-1 bg-surface-muted"
            onClick={onCancel}
          >
            Отмена
          </button>

          <button
            type="button"
            className="btn btn-danger flex-1"
            onClick={onConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
