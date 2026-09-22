import { useEffect, useState } from 'react';

const INITIAL = { name: '', email: '', password: '1111' };

export default function EmployeeModal({ open, workCopy, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setForm(INITIAL);
    setError('');
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const result = onSave?.(form);
    if (result?.ok) return;
    const messages = {
      required: workCopy.employeeRequired,
      email_exists: workCopy.employeeEmailExists,
    };
    setError(messages[result?.code] || workCopy.employeeSaveError);
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal employee-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">Workspace</div>
        <h2>{workCopy.addMechanic}</h2>
        <p className="work-modal-intro">{workCopy.addMechanicDesc}</p>

        <form className="work-form" onSubmit={submit}>
          <label><span>{workCopy.profileName}</span><input value={form.name} onChange={update('name')} required autoFocus /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={update('email')} required /></label>
          <label><span>{workCopy.temporaryPassword}</span><input value={form.password} onChange={update('password')} minLength={4} required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="work-form-actions">
            <button type="button" className="work-secondary-btn" onClick={onClose}>{workCopy.cancel}</button>
            <button type="submit" className="work-primary-btn">{workCopy.createMechanic}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
