import { useEffect, useState } from 'react';

const FORM_ENDPOINT = 'https://formspree.io/f/mnpazjve';

export default function WorkspaceFeedbackModal({ open, user, workCopy, onClose, onToast }) {
  const [category, setCategory] = useState('problem');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setCategory('problem');
    setMessage('');
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append('Type', category);
    formData.append('Message', message.trim());
    formData.append('Account', `${user?.name || ''} · ${user?.email || ''} · ${user?.id || ''}`);
    formData.append('Role', user?.role || '');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Feedback request failed');
      onClose();
      onToast?.(workCopy.feedbackSent);
    } catch {
      onToast?.(workCopy.feedbackError, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal workspace-feedback-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">ServiceRemind Workspace</div>
        <h2>{workCopy.feedbackTitle}</h2>
        <p className="workspace-feedback-intro">{workCopy.feedbackDescription}</p>

        <form className="work-form" onSubmit={submit}>
          <label>
            <span>{workCopy.feedbackType}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="problem">{workCopy.feedbackProblem}</option>
              <option value="idea">{workCopy.feedbackIdea}</option>
              <option value="other">{workCopy.feedbackOther}</option>
            </select>
          </label>
          <label>
            <span>{workCopy.feedbackMessage}</span>
            <textarea rows="6" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={workCopy.feedbackPlaceholder} required />
          </label>
          <div className="work-form-actions">
            <button type="button" className="work-secondary-btn" onClick={onClose}>{workCopy.cancel}</button>
            <button type="submit" className="work-primary-btn" disabled={submitting}>{submitting ? '…' : workCopy.sendFeedback}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
