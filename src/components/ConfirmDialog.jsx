import { useEffect } from 'react';

export default function ConfirmDialog({ open, title, description, cancelLabel, confirmLabel, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="logout-confirm-title">{title}</h2>
        <p>{description}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="confirm-primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
