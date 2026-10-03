import React, { useEffect } from "react";

// isOpen по умолчанию true — чтобы работал вызов <Modal onClose={...}> без пропов,
// как на странице Dashboard. На History окно управляется через isOpen.
function Modal({ isOpen = true, onClose, title, children }) {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Блокируем прокрутку фона

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Закрыто — ничего не рендерим
  if (!isOpen) return null;

  // Закрытие по клику на свободное место (overlay)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-colors duration-300"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="animate-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-pop transition-colors duration-500"
      >
        {title && (
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-text">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="grid size-9 shrink-0 place-items-center rounded-xl text-xl leading-none text-secondary transition-all duration-200 hover:rotate-90 hover:bg-surface-muted hover:text-text active:scale-90"
            >
              ×
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
