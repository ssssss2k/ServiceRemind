import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import DestructiveActionDialog from '../components/DestructiveActionDialog';
import Header from '../components/Header';
import { ChevronRightIcon, PlusIcon, TrashIcon, UserIcon } from '../components/WorkspaceIcons';
import { useAuth } from '../auth/AuthContext';


const ADMIN_COPY = {
  eng: {
    services: 'Services', subtitle: 'Organizations, owners and staff in one place.', newService: 'New service',
    createTitle: 'Create service', createHint: 'Creates a separate organization and its first owner.',
    orgName: 'Service name', ownerName: 'Owner name', ownerEmail: 'Owner email', tempPassword: 'Temporary password',
    cancel: 'Cancel', create: 'Create service', organizations: 'Organizations', active: 'active', noOwner: 'No owner assigned',
    employees: 'employees', noServices: 'No services yet.', deleteAria: 'Delete', mechanicNote: 'The owner adds mechanics from the service Workspace. Admin manages organizations, not daily workshop operations.',
    choose: 'Choose a service', chooseHint: 'Its owner and mechanics will appear here.', deleteTitle: 'Delete service?',
    deleteDescription: 'The service and employee accounts will be disabled. Demo history remains stored locally.', continueLabel: 'Continue', passwordLabel: 'Confirm with the admin password', passwordPlaceholder: 'Current password', confirmDelete: 'Delete service', wrongPassword: 'The password is incorrect. Check it and try again.', emailExists: 'This email is already in use.', fillAll: 'Fill in all fields.', created: 'Created', disabled: 'Disabled',
  },
  rus: {
    services: 'Сервисы', subtitle: 'Организации, владельцы и сотрудники в одном месте.', newService: 'Новый сервис',
    createTitle: 'Создать сервис', createHint: 'Создается отдельная организация и первый владелец.',
    orgName: 'Название сервиса', ownerName: 'Имя владельца', ownerEmail: 'Email владельца', tempPassword: 'Временный пароль',
    cancel: 'Отмена', create: 'Создать сервис', organizations: 'Организации', active: 'активных', noOwner: 'Владелец не назначен',
    employees: 'сотрудников', noServices: 'Сервисов пока нет.', deleteAria: 'Удалить', mechanicNote: 'Механиков добавляет владелец из Workspace. Admin управляет организациями, а не ежедневной работой сервиса.',
    choose: 'Выберите сервис', chooseHint: 'Здесь появятся владелец и механики.', deleteTitle: 'Удалить сервис?',
    deleteDescription: 'Сервис и аккаунты сотрудников будут отключены. Demo-история останется в локальном хранилище.', continueLabel: 'Продолжить', passwordLabel: 'Подтвердите паролем администратора', passwordPlaceholder: 'Текущий пароль', confirmDelete: 'Удалить сервис', wrongPassword: 'Пароль не подходит. Проверьте и попробуйте еще раз.', emailExists: 'Этот email уже используется.', fillAll: 'Заполните все поля.', created: 'Создан', disabled: 'Отключен',
  },
  est: {
    services: 'Teenindused', subtitle: 'Organisatsioonid, omanikud ja töötajad ühes kohas.', newService: 'Uus teenindus',
    createTitle: 'Loo teenindus', createHint: 'Luuakse eraldi organisatsioon ja selle esimene omanik.',
    orgName: 'Teeninduse nimi', ownerName: 'Omaniku nimi', ownerEmail: 'Omaniku e-post', tempPassword: 'Ajutine parool',
    cancel: 'Tühista', create: 'Loo teenindus', organizations: 'Organisatsioonid', active: 'aktiivset', noOwner: 'Omanik määramata',
    employees: 'töötajat', noServices: 'Teenindusi veel pole.', deleteAria: 'Kustuta', mechanicNote: 'Mehaanikuid lisab omanik teeninduse Workspace’is. Admin haldab organisatsioone, mitte igapäevatööd.',
    choose: 'Vali teenindus', chooseHint: 'Siin kuvatakse omanik ja mehaanikud.', deleteTitle: 'Kustuta teenindus?',
    deleteDescription: 'Teenindus ja töötajate kontod deaktiveeritakse. Demo-ajalugu jääb kohalikku salvestusse.', continueLabel: 'Jätka', passwordLabel: 'Kinnita administraatori parooliga', passwordPlaceholder: 'Praegune parool', confirmDelete: 'Kustuta teenindus', wrongPassword: 'Parool ei sobi. Kontrolli ja proovi uuesti.', emailExists: 'See e-post on juba kasutusel.', fillAll: 'Täida kõik väljad.', created: 'Loodud', disabled: 'Deaktiveeritud',
  },
};

const EMPTY_FORM = { organizationName: '', ownerName: '', ownerEmail: '', ownerPassword: '1111' };

function roleLabel(role) {
  if (role === 'owner') return 'Owner';
  if (role === 'mechanic') return 'Mechanic';
  return role;
}

export default function AdminPage({ t, language, onLanguageChange }) {
  const { user, organizations, accounts, createOrganization, deleteOrganization, logout } = useAuth();
  const copy = ADMIN_COPY[language] || ADMIN_COPY.eng;
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const navigate = useNavigate();

  const organizationRows = useMemo(() => organizations.map((organization) => {
    const staff = accounts
      .filter((account) => account.organizationId === organization.id && account.active !== false)
      .sort((a, b) => (a.role === 'owner' ? -1 : b.role === 'owner' ? 1 : String(a.name).localeCompare(String(b.name))));
    const owner = staff.find((account) => account.role === 'owner');
    return { ...organization, owner, staff };
  }), [accounts, organizations]);

  useEffect(() => {
    if (!organizationRows.length) {
      setSelectedOrganizationId('');
      return;
    }
    if (!organizationRows.some((organization) => organization.id === selectedOrganizationId)) {
      setSelectedOrganizationId(organizationRows[0].id);
    }
  }, [organizationRows, selectedOrganizationId]);

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const selectedOrganization = organizationRows.find((organization) => organization.id === selectedOrganizationId) || null;
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const result = createOrganization(form);
    if (!result.ok) {
      setMessage(result.code === 'email_exists' ? copy.emailExists : copy.fillAll);
      return;
    }
    setMessage(`${copy.created}: ${result.organization.name}.`);
    setForm(EMPTY_FORM);
    setCreateOpen(false);
    setSelectedOrganizationId(result.organization.id);
  };

  const confirmDeleteOrganization = (password) => {
    if (!organizationToDelete) return { ok: false, code: 'organization_missing' };
    const result = deleteOrganization({ organizationId: organizationToDelete.id, password });
    if (!result.ok) return result;
    setMessage(`${copy.disabled}: ${organizationToDelete.name}.`);
    setOrganizationToDelete(null);
    return result;
  };

  const doLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-shell admin-shell">
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        variant="portal"
        showLogin={false}
        rightAction={(
          <button type="button" className="account-menu-trigger" onClick={() => setLogoutOpen(true)}>
            <span className="account-entry-icon"><UserIcon size={16} /></span>
            <span>{user.name}</span>
          </button>
        )}
      />

      <main className="dashboard-main admin-main admin-console">
        <div className="admin-console-head">
          <div>
            <span className="workspace-context-title">ServiceRemind Admin</span>
            <h1>{copy.services}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <button type="button" className="dashboard-primary-action admin-new-service-btn" onClick={() => setCreateOpen((value) => !value)}>
            <PlusIcon size={17} /> {copy.newService}
          </button>
        </div>

        {createOpen && (
          <section className="dashboard-panel admin-create-panel admin-create-inline">
            <div className="workspace-section-head"><div><h2>{copy.createTitle}</h2><p>{copy.createHint}</p></div></div>
            <form className="work-form" onSubmit={submit}>
              <div className="work-form-grid admin-create-grid">
                <label><span>{copy.orgName}</span><input value={form.organizationName} onChange={update('organizationName')} placeholder="Baltic Auto OÜ" required /></label>
                <label><span>{copy.ownerName}</span><input value={form.ownerName} onChange={update('ownerName')} placeholder="Andres Saar" required /></label>
                <label><span>{copy.ownerEmail}</span><input type="email" value={form.ownerEmail} onChange={update('ownerEmail')} placeholder="owner@garage.ee" required /></label>
                <label><span>{copy.tempPassword}</span><input value={form.ownerPassword} onChange={update('ownerPassword')} minLength={4} required /></label>
              </div>
              <div className="work-form-actions admin-create-actions">
                <button type="button" className="work-secondary-btn" onClick={() => setCreateOpen(false)}>{copy.cancel}</button>
                <button type="submit" className="work-primary-btn">{copy.create}</button>
              </div>
            </form>
          </section>
        )}

        {message && <div className="admin-status-message" role="status">{message}</div>}

        <div className="admin-console-grid">
          <section className="dashboard-panel admin-service-list-panel">
            <div className="workspace-section-head"><div><h2>{copy.organizations}</h2><p>{organizationRows.length} {copy.active}</p></div></div>
            <div className="admin-service-list">
              {organizationRows.map((organization) => (
                <button
                  key={organization.id}
                  type="button"
                  className={organization.id === selectedOrganizationId ? 'admin-service-row selected' : 'admin-service-row'}
                  onClick={() => setSelectedOrganizationId(organization.id)}
                >
                  <div>
                    <strong>{organization.name}</strong>
                    <span>{organization.owner?.name || copy.noOwner}</span>
                  </div>
                  <span className="admin-staff-count">{organization.staff.length}</span>
                  <ChevronRightIcon size={17} />
                </button>
              ))}
              {organizationRows.length === 0 && <p className="dashboard-compact-empty">{copy.noServices}</p>}
            </div>
          </section>

          <section className="dashboard-panel admin-organization-detail">
            {selectedOrganization ? (
              <>
                <div className="admin-organization-head">
                  <div>
                    <span>{selectedOrganization.id}</span>
                    <h2>{selectedOrganization.name}</h2>
                    <p>{selectedOrganization.staff.length} {copy.employees}</p>
                  </div>
                  <button
                    type="button"
                    className="workspace-icon-action danger"
                    aria-label={`${copy.deleteAria} ${selectedOrganization.name}`}
                    onClick={() => setOrganizationToDelete(selectedOrganization)}
                  >
                    <TrashIcon size={17} />
                  </button>
                </div>

                <div className="admin-staff-list">
                  {selectedOrganization.staff.map((account) => (
                    <article className="admin-staff-row" key={account.id}>
                      <span className="admin-staff-avatar"><UserIcon size={18} /></span>
                      <div>
                        <strong>{account.name}</strong>
                        <span>{account.email}</span>
                      </div>
                      <div className="admin-staff-meta">
                        <b>{roleLabel(account.role)}</b>
                        <small>{account.id}</small>
                      </div>
                    </article>
                  ))}
                </div>

                <p className="admin-detail-note">{copy.mechanicNote}</p>
              </>
            ) : (
              <div className="admin-detail-empty"><strong>{copy.choose}</strong><span>{copy.chooseHint}</span></div>
            )}
          </section>
        </div>
      </main>

      <DestructiveActionDialog
        open={Boolean(organizationToDelete)}
        title={copy.deleteTitle}
        description={organizationToDelete ? `${organizationToDelete.name}. ${copy.deleteDescription}` : ''}
        subject={organizationToDelete?.name || ''}
        continueLabel={copy.continueLabel}
        passwordLabel={copy.passwordLabel}
        passwordPlaceholder={copy.passwordPlaceholder}
        cancelLabel={copy.cancel}
        confirmLabel={copy.confirmDelete}
        wrongPasswordLabel={copy.wrongPassword}
        onCancel={() => setOrganizationToDelete(null)}
        onConfirm={confirmDeleteOrganization}
      />

      <ConfirmDialog open={logoutOpen} title={t.logoutConfirmTitle} description={t.logoutConfirmDescription} cancelLabel={t.workCancel} confirmLabel={t.logout} onCancel={() => setLogoutOpen(false)} onConfirm={doLogout} />
    </div>
  );
}
