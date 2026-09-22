import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AccountMenu from '../components/AccountMenu';
import BookingDetailModal from '../components/BookingDetailModal';
import ClientDetailModal from '../components/ClientDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import DestructiveActionDialog from '../components/DestructiveActionDialog';
import EmployeeModal from '../components/EmployeeModal';
import Header from '../components/Header';
import MechanicWorkspace from '../components/MechanicWorkspace';
import OwnerMechanicView from '../components/OwnerMechanicView';
import OwnerWorkspace from '../components/OwnerWorkspace';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import ResourceLinkModal from '../components/ResourceLinkModal';
import ServiceFlowModal from '../components/ServiceFlowModal';
import WorkActionModal from '../components/WorkActionModal';
import WorkspaceFeedbackModal from '../components/WorkspaceFeedbackModal';
import WorkspaceFooter from '../components/WorkspaceFooter';
import { useAuth } from '../auth/AuthContext';
import { useWorkData } from '../hooks/useWorkData';
import { VEHICLE_CHECK_URL, WORKSPACE_NAME } from '../config/appConfig';
import { getWorkTranslations } from '../data/workTranslations';
import { localDateKey } from '../utils/dateUtils';

const localeByLanguage = { est: 'et-EE', eng: 'en-GB', rus: 'ru-RU' };
const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function cleanObject(input) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
}

function jobToForm(job) {
  return {
    ...job,
    jobId: job.id,
    clientId: job.clientId,
    name: job.clientName,
    workItems: Array.isArray(job.workItems) && job.workItems.length ? job.workItems : [job.service || ''],
  };
}

function bookingToForm(booking) {
  return {
    ...booking,
    bookingId: booking.id,
    clientId: booking.clientId,
    name: booking.clientName,
    assignedUserId: booking.assignedUserId || booking.assignedMechanicId || '',
  };
}

export default function DashboardPage({ t, language, onLanguageChange, onToast }) {
  const {
    user,
    accounts,
    organization,
    organizationAccounts,
    logout,
    updateSelf,
    addMechanic,
    removeMechanic,
  } = useAuth();
  const {
    data,
    saveClient,
    deleteClient,
    saveBooking,
    completeBooking,
    saveCompletedJob,
    saveResourceLink,
    deleteResourceLink,
    moveResourceLink,
    addActivityEntry,
  } = useWorkData(user?.organizationId, organizationAccounts);
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [serviceFlow, setServiceFlow] = useState({ open: false, booking: null });
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [resourceLinkModal, setResourceLinkModal] = useState({ open: false, link: null });
  const [resourceLinkToDelete, setResourceLinkToDelete] = useState(null);
  const [mechanicToDelete, setMechanicToDelete] = useState(null);

  const workCopy = getWorkTranslations(language);
  const locale = localeByLanguage[language] || 'en-GB';
  const todayKey = localDateKey();
  const workspaceRole = user?.role === 'mechanic' ? workCopy.mechanicWorkspace : workCopy.ownerWorkspace;
  const mechanics = useMemo(() => organizationAccounts.filter((account) => account.role === 'mechanic'), [organizationAccounts]);
  const bookingAssignees = useMemo(() => organizationAccounts.filter((account) => ['owner', 'mechanic'].includes(account.role)), [organizationAccounts]);
  const organizationAllAccounts = useMemo(() => accounts.filter((account) => account.organizationId === user?.organizationId && ['owner', 'mechanic'].includes(account.role)), [accounts, user?.organizationId]);
  const personalLinks = useMemo(() => data.resourceLinks
    .filter((link) => link.userId === user?.id)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || ''))), [data.resourceLinks, user?.id]);

  const activeBookings = useMemo(() => data.bookings.filter((booking) => booking.status !== 'completed'), [data.bookings]);
  const todayServiceBookings = useMemo(() => [...activeBookings]
    .filter((booking) => booking.date === todayKey)
    .filter((booking) => user?.role === 'owner' || booking.assignedUserId === user?.id || booking.assignedMechanicId === user?.id)
    .sort((a, b) => String(a.time || '').localeCompare(String(b.time || ''))), [activeBookings, todayKey, user?.id, user?.role]);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
  };

  const recordActivity = (action, targetType, targetId, targetLabel, details = '') => {
    if (!user) return;
    addActivityEntry({
      actorUserId: user.id,
      actorEmail: user.email,
      actorName: user.name,
      actorRole: user.role,
      action,
      targetType,
      targetId: targetId || '',
      targetLabel: targetLabel || '',
      details,
      createdAt: new Date().toISOString(),
    });
  };

  const openAction = (mode, initialData = null) => setActiveModal({ mode, initialData });
  const startService = (booking = null) => {
    setSelectedBooking(null);
    setServiceFlow({ open: true, booking });
  };

  const resolveClient = (form) => {
    const existing = form.clientId ? data.clients.find((client) => client.id === form.clientId) : null;
    if (existing && user.role === 'mechanic') return existing;
    return saveClient({
      id: form.clientId || undefined,
      name: form.name,
      phone: form.phone,
      carMake: form.carMake,
      carModel: form.carModel,
      variant: form.variant,
      plate: form.plate,
      addedByUserId: user.id,
      addedByEmail: user.email,
      addedByRole: user.role,
    });
  };

  const canEditJob = (job) => {
    if (!job || !user) return false;
    if (user.role === 'owner') return true;
    const createdAt = new Date(job.createdAt || 0).getTime();
    const age = Date.now() - createdAt;
    return job.mechanicId === user.id && createdAt > 0 && age >= 0 && age <= EDIT_WINDOW_MS;
  };

  const handleEditClient = (client) => {
    if (user?.role !== 'owner') return;
    setSelectedClient(null);
    openAction('client', { ...client, clientId: client.id });
  };

  const handleEditBooking = (booking) => {
    const allowed = user?.role === 'owner' || booking.assignedUserId === user?.id || booking.assignedMechanicId === user?.id;
    if (!allowed || booking.status === 'completed') return;
    setSelectedBooking(null);
    openAction('booking', bookingToForm(booking));
  };

  const handleEditJob = (job) => {
    if (!canEditJob(job)) return;
    setSelectedClient(null);
    openAction('job', jobToForm(job));
  };

  const handleWorkSubmit = (mode, rawForm) => {
    const form = cleanObject(rawForm);

    if (mode === 'client') {
      const isEditing = Boolean(form.id || form.clientId);
      if (user.role === 'mechanic' && isEditing) return;
      const client = saveClient({
        id: form.id || form.clientId || undefined,
        name: form.name,
        phone: form.phone,
        carMake: form.carMake,
        carModel: form.carModel,
        variant: form.variant,
        plate: form.plate,
        addedByUserId: form.addedByUserId || user.id,
        addedByEmail: form.addedByEmail || user.email,
        addedByRole: form.addedByRole || user.role,
      });
      recordActivity(isEditing ? 'client_updated' : 'client_created', 'client', client.id, client.name, client.plate || client.phone);
      onToast?.(isEditing ? workCopy.clientUpdated : t.workClientSaved);
    }

    if (mode === 'booking') {
      const isEditing = Boolean(form.id || form.bookingId);
      const client = resolveClient(form);
      let assignedUserId = form.assignedUserId || '';
      if (user.role === 'mechanic') assignedUserId = user.id;
      const assignee = bookingAssignees.find((account) => account.id === assignedUserId);

      const booking = saveBooking({
        id: form.id || form.bookingId || undefined,
        clientId: client.id,
        clientName: client.name,
        phone: client.phone,
        carMake: client.carMake,
        carModel: client.carModel,
        variant: client.variant,
        plate: client.plate,
        service: form.service,
        date: form.date,
        time: form.time,
        notes: form.notes,
        assignedUserId,
        assignedMechanicName: assignee?.name || '',
        createdByUserId: form.createdByUserId || user.id,
        createdByEmail: form.createdByEmail || user.email,
        status: form.status || 'scheduled',
      });

      recordActivity(isEditing ? 'booking_updated' : 'booking_created', 'booking', booking.id, `${booking.clientName} · ${booking.date} ${booking.time}`, booking.assignedMechanicName || '');
      onToast?.(isEditing ? workCopy.bookingUpdated : t.workBookingSaved);
    }

    if (mode === 'job') {
      const existing = data.completedJobs.find((job) => job.id === (form.id || form.jobId));
      if (existing && !canEditJob(existing)) return;
      const activeClient = existing?.clientId ? data.clients.find((client) => client.id === existing.clientId) : null;
      const client = existing
        ? (activeClient || {
            id: existing.clientId || form.clientId || '',
            name: existing.clientName || form.name,
            phone: existing.phone || form.phone,
            carMake: existing.carMake || form.carMake,
            carModel: existing.carModel || form.carModel,
            variant: existing.variant || form.variant,
            plate: existing.plate || form.plate,
          })
        : resolveClient(form);
      const job = saveCompletedJob({
        ...form,
        id: form.id || form.jobId,
        clientId: client.id,
        clientName: client.name,
        phone: client.phone,
        carMake: client.carMake,
        carModel: client.carModel,
        variant: client.variant,
        plate: client.plate,
        workItems: form.workItems,
        service: Array.isArray(form.workItems) ? form.workItems.join(', ') : form.service || '',
        mechanicId: existing?.mechanicId || form.mechanicId || user.id,
        mechanicEmail: existing?.mechanicEmail || form.mechanicEmail || user.email,
        mechanicName: existing?.mechanicName || form.mechanicName || user.name,
      });
      recordActivity('service_updated', 'service', job.id, `${job.clientName} · ${job.plate || ''}`, job.service);
      onToast?.(workCopy.serviceRecordUpdated);
    }

    setActiveModal(null);
  };

  const handleServiceSubmit = (rawForm) => {
    const form = cleanObject(rawForm);
    const client = resolveClient(form);
    const job = saveCompletedJob({
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      carMake: client.carMake,
      carModel: client.carModel,
      variant: client.variant,
      plate: client.plate,
      workItems: form.workItems,
      service: Array.isArray(form.workItems) ? form.workItems.join(', ') : '',
      materials: form.materials,
      mileage: form.mileage,
      notes: form.notes,
      date: form.date,
      nextServiceMonths: form.nextServiceMonths,
      nextServiceNote: form.nextServiceNote,
      mechanicId: user.id,
      mechanicEmail: user.email,
      mechanicName: user.name,
      sourceBookingId: form.sourceBookingId || '',
    });

    if (form.sourceBookingId) completeBooking(form.sourceBookingId);
    recordActivity('service_completed', 'service', job.id, `${job.clientName} · ${job.plate || ''}`, job.service);
    setServiceFlow({ open: false, booking: null });
    onToast?.(workCopy.jobSaved);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete || user?.role !== 'owner') return;
    deleteClient(clientToDelete.id);
    recordActivity('client_deleted', 'client', clientToDelete.id, clientToDelete.name, clientToDelete.plate || clientToDelete.phone);
    setClientToDelete(null);
    onToast?.(workCopy.clientDeleted);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const handleSaveProfile = (payload) => {
    const before = { name: user?.name, email: user?.email };
    const result = updateSelf(payload);
    if (!result.ok) return result;
    const changes = [];
    if (result.account.name !== before.name) changes.push(`${before.name} → ${result.account.name}`);
    if (result.account.email !== before.email) changes.push(`${before.email} → ${result.account.email}`);
    if (payload.newPassword) changes.push(workCopy.changePassword);
    recordActivity('profile_updated', 'profile', user?.id, result.account.name, changes.join(' · '));
    onToast?.(workCopy.profileUpdated);
    return result;
  };

  const handleAddMechanic = (payload) => {
    const result = addMechanic(payload);
    if (!result.ok) return result;
    recordActivity('mechanic_created', 'employee', result.account.id, result.account.name, result.account.email);
    setEmployeeModalOpen(false);
    onToast?.(workCopy.mechanicCreated);
    return result;
  };

  const confirmRemoveMechanic = (password) => {
    if (!mechanicToDelete) return { ok: false, code: 'account_missing' };
    const result = removeMechanic({ mechanicId: mechanicToDelete.id, password });
    if (!result.ok) return result;
    recordActivity('mechanic_removed', 'employee', mechanicToDelete.id, mechanicToDelete.name, mechanicToDelete.email);
    if (selectedMechanic?.id === mechanicToDelete.id) setSelectedMechanic(null);
    setMechanicToDelete(null);
    onToast?.(workCopy.mechanicRemoved);
    return result;
  };

  const handleMoveResourceLink = (link, direction) => {
    if (!link || link.userId !== user?.id) return;
    moveResourceLink(link.id, direction, user.id);
    recordActivity('link_updated', 'link', link.id, link.title, direction < 0 ? 'moved up' : 'moved down');
  };

  const handleSaveResourceLink = (link) => {
    const existing = link.id ? data.resourceLinks.find((item) => item.id === link.id) : null;
    if (existing && existing.userId !== user?.id) return;
    const savedLink = saveResourceLink({ ...link, userId: user.id, userEmail: user.email });
    recordActivity(existing ? 'link_updated' : 'link_created', 'link', savedLink.id, savedLink.title, savedLink.url);
    setResourceLinkModal({ open: false, link: null });
    onToast?.(workCopy.linkSaved);
  };

  const confirmDeleteResourceLink = () => {
    if (!resourceLinkToDelete || resourceLinkToDelete.userId !== user?.id) return;
    deleteResourceLink(resourceLinkToDelete.id);
    recordActivity('link_deleted', 'link', resourceLinkToDelete.id, resourceLinkToDelete.title, resourceLinkToDelete.url);
    setResourceLinkToDelete(null);
    onToast?.(workCopy.linkDeleted);
  };

  const selectedMechanicBookings = selectedMechanic
    ? data.bookings.filter((booking) => booking.assignedUserId === selectedMechanic.id || booking.assignedMechanicId === selectedMechanic.id)
    : [];
  const selectedMechanicJobs = selectedMechanic
    ? data.completedJobs.filter((job) => job.mechanicId === selectedMechanic.id)
    : [];

  const accountMenu = (
    <AccountMenu user={user} workCopy={workCopy} onSettings={() => setProfileSettingsOpen(true)} onLogout={() => setLogoutConfirmOpen(true)} />
  );

  const bookingCanStart = Boolean(selectedBooking && selectedBooking.status !== 'completed' && (user?.role === 'owner' || selectedBooking.assignedUserId === user?.id || selectedBooking.assignedMechanicId === user?.id));
  const bookingCanEdit = bookingCanStart;

  return (
    <div className="dashboard-shell">
      <Header t={t} language={language} onLanguageChange={onLanguageChange} variant="portal" showLogin={false} rightAction={accountMenu} />

      <main className="dashboard-main">
        <div className="workspace-context-title">{WORKSPACE_NAME} <span>·</span> {workspaceRole}</div>

        {user?.role === 'mechanic' ? (
          <MechanicWorkspace
            workCopy={workCopy}
            data={data}
            user={user}
            todayKey={todayKey}
            formatDate={formatDate}
            locale={locale}
            vehicleCheckUrl={VEHICLE_CHECK_URL}
            resourceLinks={personalLinks}
            onAction={openAction}
            onStartService={startService}
            onOpenClient={setSelectedClient}
            onOpenBooking={setSelectedBooking}
            onEditJob={handleEditJob}
            onAddLink={() => setResourceLinkModal({ open: true, link: null })}
            onEditLink={(link) => setResourceLinkModal({ open: true, link })}
            onDeleteLink={setResourceLinkToDelete}
            onMoveLink={handleMoveResourceLink}
          />
        ) : selectedMechanic ? (
          <OwnerMechanicView
            mechanic={selectedMechanic}
            bookings={selectedMechanicBookings}
            jobs={selectedMechanicJobs}
            todayKey={todayKey}
            locale={locale}
            formatDate={formatDate}
            workCopy={workCopy}
            onBack={() => setSelectedMechanic(null)}
            onCreateBooking={(mechanic, date = '') => openAction('booking', { assignedUserId: mechanic.id, ...(date ? { date } : {}) })}
            onOpenBooking={setSelectedBooking}
            onEditJob={handleEditJob}
          />
        ) : (
          <OwnerWorkspace
            workCopy={workCopy}
            data={data}
            user={user}
            mechanics={mechanics}
            accounts={bookingAssignees}
            activityAccounts={organizationAllAccounts}
            todayKey={todayKey}
            formatDate={formatDate}
            locale={locale}
            vehicleCheckUrl={VEHICLE_CHECK_URL}
            resourceLinks={personalLinks}
            onOpenMechanic={setSelectedMechanic}
            onAddMechanic={() => setEmployeeModalOpen(true)}
            onRequestRemoveMechanic={setMechanicToDelete}
            onAction={openAction}
            onStartService={startService}
            onEditClient={handleEditClient}
            onDeleteClient={setClientToDelete}
            onOpenClient={setSelectedClient}
            onOpenBooking={setSelectedBooking}
            onEditJob={handleEditJob}
            onAddLink={() => setResourceLinkModal({ open: true, link: null })}
            onEditLink={(link) => setResourceLinkModal({ open: true, link })}
            onDeleteLink={setResourceLinkToDelete}
            onMoveLink={handleMoveResourceLink}
          />
        )}
      </main>

      <WorkspaceFooter workCopy={workCopy} onFeedback={() => setFeedbackOpen(true)} />

      <WorkActionModal
        mode={activeModal?.mode || null}
        initialData={activeModal?.initialData || null}
        clients={data.clients}
        mechanics={bookingAssignees}
        currentUser={user}
        t={t}
        workCopy={workCopy}
        onClose={() => setActiveModal(null)}
        onSubmit={handleWorkSubmit}
      />

      <ServiceFlowModal
        open={serviceFlow.open}
        initialBooking={serviceFlow.booking}
        todayBookings={todayServiceBookings}
        clients={data.clients}
        currentUser={user}
        t={t}
        workCopy={workCopy}
        onClose={() => setServiceFlow({ open: false, booking: null })}
        onSubmit={handleServiceSubmit}
      />

      <BookingDetailModal booking={selectedBooking} workCopy={workCopy} formatDate={formatDate} canStart={bookingCanStart} canEdit={bookingCanEdit} onStart={startService} onEdit={handleEditBooking} onClose={() => setSelectedBooking(null)} />

      <ClientDetailModal
        client={selectedClient}
        jobs={data.completedJobs}
        workCopy={workCopy}
        formatDate={formatDate}
        onEdit={user?.role === 'owner' ? handleEditClient : null}
        onEditJob={handleEditJob}
        canEditJob={canEditJob}
        onClose={() => setSelectedClient(null)}
      />

      <ProfileSettingsModal open={profileSettingsOpen} user={user} organization={organization} workCopy={workCopy} onSaveProfile={handleSaveProfile} onClose={() => setProfileSettingsOpen(false)} />
      <EmployeeModal open={employeeModalOpen} workCopy={workCopy} onClose={() => setEmployeeModalOpen(false)} onSave={handleAddMechanic} />

      <ResourceLinkModal open={resourceLinkModal.open} initialLink={resourceLinkModal.link} workCopy={workCopy} onClose={() => setResourceLinkModal({ open: false, link: null })} onSave={handleSaveResourceLink} />
      <WorkspaceFeedbackModal open={feedbackOpen} user={user} workCopy={workCopy} onClose={() => setFeedbackOpen(false)} onToast={onToast} />

      <ConfirmDialog open={Boolean(clientToDelete)} title={workCopy.deleteClientTitle} description={clientToDelete ? `${workCopy.deleteClientDescription}\n\n${clientToDelete.name} · ${clientToDelete.phone || clientToDelete.plate || ''}` : ''} cancelLabel={t.workCancel} confirmLabel={workCopy.deletePermanently} onCancel={() => setClientToDelete(null)} onConfirm={confirmDeleteClient} />
      <ConfirmDialog open={Boolean(resourceLinkToDelete)} title={workCopy.deleteLinkTitle} description={resourceLinkToDelete ? `${workCopy.deleteLinkDescription}\n\n${resourceLinkToDelete.title}` : ''} cancelLabel={t.workCancel} confirmLabel={workCopy.deleteLink} onCancel={() => setResourceLinkToDelete(null)} onConfirm={confirmDeleteResourceLink} />
      <DestructiveActionDialog
        open={Boolean(mechanicToDelete)}
        title={workCopy.removeMechanicTitle}
        description={mechanicToDelete ? `${workCopy.removeMechanicDescription}\n\n${mechanicToDelete.name} · ${mechanicToDelete.email}` : ''}
        subject={mechanicToDelete?.name || ''}
        continueLabel={workCopy.removeMechanicContinue}
        passwordLabel={workCopy.removeMechanicPasswordTitle}
        passwordPlaceholder={workCopy.deletePasswordPlaceholder}
        cancelLabel={workCopy.cancel}
        confirmLabel={workCopy.removeMechanicConfirm}
        wrongPasswordLabel={workCopy.wrongDeletePassword}
        onCancel={() => setMechanicToDelete(null)}
        onConfirm={confirmRemoveMechanic}
      />
      <ConfirmDialog open={logoutConfirmOpen} title={t.logoutConfirmTitle} description={t.logoutConfirmDescription} cancelLabel={t.workCancel} confirmLabel={t.logout} onCancel={() => setLogoutConfirmOpen(false)} onConfirm={confirmLogout} />
    </div>
  );
}
