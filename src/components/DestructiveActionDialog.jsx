import { useEffect, useState } from 'react';

export default function DestructiveActionDialog({
  open,
  title,
  description,
  subject,
  continueLabel,
  passwordLabel,
  passwordPlaceholder,
  cancelLabel,
  confirmLabel,
  wrongPasswordLabel,
  onCancel,
  onConfirm,
}) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setStep(1);
    setPassword('');
    setError('');
    const handleKeyDown = (event) => event.key === 'Escape' && onCancel?.();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const submitPassword = (event) => {
    event.preventDefault();
    const result = onConfirm?.(password);
    if (result?.ok) return;
    setError(wrongPasswordLabel);
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="confirm-dialog destructive-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close destructive-close" aria-label={cancelLabel} onClick={onCancel}>×</button>

        <div className="destructive-dialog-kicker">{subject}</div>
        {step === 1 ? (
          <>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="confirm-dialog-actions destructive-dialog-actions">
              <button type="button" className="confirm-secondary" onClick={onCancel}>{cancelLabel}</button>
              <button type="button" className="confirm-primary danger" onClick={() => setStep(2)}>{continueLabel}</button>
            </div>
          </>
        ) : (
          <form onSubmit={submitPassword} className="destructive-password-form">
            <h2>{passwordLabel}</h2>
            <p className="destructive-password-copy">{description}</p>
            <label className="destructive-password-field">
              <span>{passwordPlaceholder}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(''); }}
                placeholder="••••••••"
                autoFocus
                autoComplete="current-password"
                required
              />
            </label>
            {error && <div className="destructive-form-error" role="alert">{error}</div>}
            <div className="confirm-dialog-actions destructive-dialog-actions">
              <button type="button" className="confirm-secondary" onClick={() => { setStep(1); setError(''); setPassword(''); }}>{cancelLabel}</button>
              <button type="submit" className="confirm-primary danger">{confirmLabel}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
