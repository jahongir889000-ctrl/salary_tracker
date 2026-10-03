import React from "react";

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "📊",
}) {
  return (
    <div className="animate-pop flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="animate-float text-5xl">{icon}</span>

      {title && (
        <h3 className="text-lg font-semibold text-text">{title}</h3>
      )}

      {description && (
        <p className="max-w-sm text-sm text-secondary">{description}</p>
      )}

      {actionLabel && (
        <button type="button" className="btn btn-primary mt-1" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
