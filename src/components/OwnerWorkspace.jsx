import { useMemo, useState } from 'react';
import { useWorkspaceGreeting } from '../hooks/useWorkspaceGreeting';
import ActivityLog from './ActivityLog';
import ClientDirectory from './ClientDirectory';
import DailySchedule from './DailySchedule';
import WorkspaceCalendar from './WorkspaceCalendar';
import WorkspaceDaySummary from './WorkspaceDaySummary';
import WorkspaceLinks from './WorkspaceLinks';
import WorkspaceTabs from './WorkspaceTabs';
import WorkHistory from './WorkHistory';
import MechanicsDirectory from './MechanicsDirectory';


export default function OwnerWorkspace({
  workCopy,
  data,
  user,
  mechanics,
  accounts,
  activityAccounts,
  todayKey,
  formatDate,
  locale,
  vehicleCheckUrl,
  resourceLinks,
  onOpenMechanic,
  onAddMechanic,
  onRequestRemoveMechanic,
  onAction,
  onStartService,
  onEditClient,
  onDeleteClient,
  onOpenClient,
  onOpenBooking,
  onEditJob,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onMoveLink,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [historyDate, setHistoryDate] = useState('');
  const [removeMode, setRemoveMode] = useState(false);
  const greeting = useWorkspaceGreeting(user, workCopy, workCopy.ownerSubtitle);

  const activeBookings = useMemo(() => data.bookings.filter((booking) => booking.status !== 'completed'), [data.bookings]);
  const todayBookings = useMemo(() => [...activeBookings]
    .filter((booking) => booking.date === todayKey)
    .sort((a, b) => String(a.time || '').localeCompare(String(b.time || ''))), [activeBookings, todayKey]);
  const completedToday = useMemo(() => data.completedJobs.filter((job) => job.date === todayKey), [data.completedJobs, todayKey]);

  const leftTabs = [
    { id: 'overview', label: workCopy.overview },
    { id: 'calendar', label: workCopy.calendar },
    { id: 'mechanics', label: workCopy.mechanics },
    { id: 'clients', label: workCopy.clients },
  ];
  const rightTabs = [
    { id: 'history', label: workCopy.history },
    { id: 'activity', label: workCopy.activity },
  ];

  const changeTab = (tabId) => {
    if (tabId === 'history') setHistoryDate('');
    if (tabId !== 'mechanics') setRemoveMode(false);
    setActiveTab(tabId);
  };

  const openScheduledToday = () => {
    setActiveTab('overview');
  };

  const openCompletedToday = () => {
    setHistoryDate(todayKey);
    setActiveTab('history');
  };

  return (
    <>
      <div className="dashboard-heading-row workspace-heading-row workspace-heading-clean">
        <div><h1>{greeting.title}</h1><p>{greeting.subtitle}</p></div>
      </div>

      <WorkspaceDaySummary
        todayKey={todayKey}
        locale={locale}
        workCopy={workCopy}
        scheduledCount={todayBookings.length}
        completedCount={completedToday.length}
        onNewBooking={() => onAction('booking')}
        onStartService={() => onStartService()}
        onOpenScheduled={openScheduledToday}
        onOpenCompleted={openCompletedToday}
      />

      <WorkspaceTabs leftTabs={leftTabs} rightTabs={rightTabs} activeTab={activeTab} onChange={changeTab} />

      {activeTab === 'overview' && (
        <div className="workspace-tab-content">
          <section className="dashboard-grid workspace-overview-grid owner-overview-grid-v07">
            <DailySchedule
              bookings={activeBookings}
              todayKey={todayKey}
              locale={locale}
              workCopy={workCopy}
              onOpenBooking={onOpenBooking}
              onCreateBooking={(date) => onAction('booking', { date })}
              maxFutureDays={14}
            />
            <WorkspaceLinks
              links={resourceLinks}
              vehicleCheckUrl={vehicleCheckUrl}
              workCopy={workCopy}
              canManage
              onAdd={onAddLink}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
              onMove={onMoveLink}
            />
          </section>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="workspace-tab-content">
          <WorkspaceCalendar
            bookings={activeBookings}
            locale={locale}
            todayKey={todayKey}
            workCopy={workCopy}
            mechanics={accounts}
            allowMechanicFilter
            onCreateBooking={(date) => onAction('booking', { date })}
            onOpenBooking={onOpenBooking}
          />
        </div>
      )}

      {activeTab === 'mechanics' && (
        <div className="workspace-tab-content">
          <MechanicsDirectory
            mechanics={mechanics}
            activeBookings={activeBookings}
            todayKey={todayKey}
            workCopy={workCopy}
            removeMode={removeMode}
            onAdd={onAddMechanic}
            onToggleRemove={() => setRemoveMode((value) => !value)}
            onOpen={onOpenMechanic}
            onRemove={onRequestRemoveMechanic}
          />
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="workspace-tab-content">
          <ClientDirectory clients={data.clients} workCopy={workCopy} canDelete onAdd={() => onAction('client')} onEdit={onEditClient} onDelete={onDeleteClient} onOpen={onOpenClient} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="workspace-tab-content">
          <WorkHistory jobs={data.completedJobs} workCopy={workCopy} formatDate={formatDate} showMechanic initialDate={historyDate} todayKey={todayKey} onEditJob={onEditJob} />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="workspace-tab-content">
          <ActivityLog entries={data.activityLog} accounts={activityAccounts || accounts} locale={locale} workCopy={workCopy} />
        </div>
      )}
    </>
  );
}
