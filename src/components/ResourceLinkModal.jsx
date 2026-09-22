import { useEffect, useState } from 'react';

function normalizeUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function ResourceLinkModal({ open, initialLink, workCopy, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setTitle(initialLink?.title || '');
    setUrl(initialLink?.url || '');
    const key = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, initialLink, onClose]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const normalizedUrl = normalizeUrl(url);
    if (!title.trim() || !normalizedUrl) return;
    onSave({ id: initialLink?.id, title: title.trim(), url: normalizedUrl });
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal resource-link-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">ServiceRemind Workspace</div>
        <h2>{initialLink ? workCopy.editLink : workCopy.addLink}</h2>
        <form className="work-form" onSubmit={submit}>
          <label><span>{workCopy.linkName}</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Trodo" required autoFocus /></label>
          <label><span>{workCopy.linkUrl}</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." required /></label>
          <div className="work-form-actions">
            <button type="button" className="work-secondary-btn" onClick={onClose}>{workCopy.cancel}</button>
            <button type="submit" className="work-primary-btn">{workCopy.saveLink}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
