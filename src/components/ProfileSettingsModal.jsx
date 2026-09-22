import { useEffect, useState } from 'react';
import { EditIcon } from './WorkspaceIcons';

export default function ProfileSettingsModal({ open, user, organization, workCopy, onSaveProfile, onClose }) {
  const [section, setSection] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
    setSection('');
    setError('');
    const key = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, user?.email, user?.name, onClose]);

  if (!open) return null;
  const role = user?.role === 'mechanic' ? workCopy.mechanicWorkspace : workCopy.ownerWorkspace;

  const errorText = (code) => ({
    wrong_password: workCopy.wrongCurrentPassword,
    email_exists: workCopy.emailAlreadyUsed,
    password_short: workCopy.passwordTooShort,
    required: workCopy.employeeRequired,
  }[code] || workCopy.employeeSaveError);

  const resetEditor = () => {
    setSection('');
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
    setError('');
  };

  const saveName = (event) => {
    event.preventDefault();
    const result = onSaveProfile?.({ name });
    if (!result?.ok) return setError(errorText(result?.code));
    resetEditor();
  };

  const saveEmail = (event) => {
    event.preventDefault();
    const result = onSaveProfile?.({ name: user?.name, email, currentPassword });
    if (!result?.ok) return setError(errorText(result?.code));
    resetEditor();
  };

  const savePassword = (event) => {
    event.preventDefault();
    if (newPassword !== repeatPassword) return setError(workCopy.passwordsDoNotMatch);
    const result = onSaveProfile?.({ name: user?.name, email: user?.email, currentPassword, newPassword });
    if (!result?.ok) return setError(errorText(result?.code));
    resetEditor();
  };

  const openEditor = (nextSection) => {
    setSection(nextSection);
    setError('');
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
    if (nextSection === 'name') setName(user?.name || '');
    if (nextSection === 'email') setEmail(user?.email || '');
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal profile-settings-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">Workspace</div>
        <h2>{workCopy.profileSettings}</h2>

        <div className="profile-settings-list">
          <div className="profile-setting-row">
            <span>{workCopy.profileName}</span>
            <div className="profile-setting-value">
              <strong>{user?.name}</strong>
              <button type="button" className="profile-edit-icon" aria-label={workCopy.editName} onClick={() => openEditor('name')}><EditIcon size={16} /></button>
            </div>
          </div>
          <div className="profile-setting-row">
            <span>Email</span>
            <div className="profile-setting-value">
              <strong>{user?.email}</strong>
              <button type="button" className="profile-edit-icon" aria-label={workCopy.changeEmail} onClick={() => openEditor('email')}><EditIcon size={16} /></button>
            </div>
          </div>
          <div className="profile-setting-row">
            <span>{workCopy.changePassword}</span>
            <div className="profile-setting-value">
              <strong>••••••••</strong>
              <button type="button" className="profile-edit-icon" aria-label={workCopy.changePassword} onClick={() => openEditor('password')}><EditIcon size={16} /></button>
            </div>
          </div>
          <div className="profile-setting-row"><span>{workCopy.profileRole}</span><strong>{role}</strong></div>
          {organization && <div className="profile-setting-row"><span>{workCopy.organizationLabel}</span><strong>{organization.name}</strong></div>}
          <div className="profile-setting-row"><span>{workCopy.accountId}</span><strong>{user?.id}</strong></div>
        </div>

        {section === 'name' && (
          <form className="profile-editor-card" onSubmit={saveName}>
            <div className="profile-editor-head"><strong>{workCopy.editName}</strong><button type="button" onClick={resetEditor}>×</button></div>
            <label><span>{workCopy.profileName}</span><input value={name} onChange={(event) => setName(event.target.value)} autoFocus maxLength={60} required /></label>
            <div className="profile-editor-actions"><button type="button" className="work-secondary-btn" onClick={resetEditor}>{workCopy.cancel}</button><button type="submit" className="work-primary-btn">{workCopy.saveChanges}</button></div>
          </form>
        )}

        {section === 'email' && (
          <form className="profile-editor-card" onSubmit={saveEmail}>
            <div className="profile-editor-head"><strong>{workCopy.profileEmailEditorTitle}</strong><button type="button" onClick={resetEditor}>×</button></div>
            <div className="profile-editor-grid">
              <label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus required /></label>
              <label><span>{workCopy.currentPassword}</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /></label>
            </div>
            <div className="profile-editor-actions"><button type="button" className="work-secondary-btn" onClick={resetEditor}>{workCopy.cancel}</button><button type="submit" className="work-primary-btn">{workCopy.saveChanges}</button></div>
          </form>
        )}

        {section === 'password' && (
          <form className="profile-editor-card" onSubmit={savePassword}>
            <div className="profile-editor-head"><strong>{workCopy.profilePasswordEditorTitle}</strong><button type="button" onClick={resetEditor}>×</button></div>
            <label><span>{workCopy.currentPassword}</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" autoFocus required /></label>
            <div className="profile-editor-grid">
              <label><span>{workCopy.newPassword}</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={4} required /></label>
              <label><span>{workCopy.passwordAgain}</span><input type="password" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} autoComplete="new-password" minLength={4} required /></label>
            </div>
            <div className="profile-editor-actions"><button type="button" className="work-secondary-btn" onClick={resetEditor}>{workCopy.cancel}</button><button type="submit" className="work-primary-btn">{workCopy.saveChanges}</button></div>
          </form>
        )}

        {error && <p className="auth-error profile-settings-error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
