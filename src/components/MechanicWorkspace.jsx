import { useMemo, useState } from 'react';
import { useWorkspaceGreeting } from '../hooks/useWorkspaceGreeting';
import ClientDirectory from './ClientDirectory';
import DailySchedule from './DailySchedule';
import WorkspaceCalendar from './WorkspaceCalendar';
import WorkspaceDaySummary from './WorkspaceDaySummary';
import WorkspaceLinks from './WorkspaceLinks';
import WorkspaceTabs from './WorkspaceTabs';
import WorkHistory from './WorkHistory';


export default function MechanicWorkspace({
  workCopy,
  data,
  user,
  todayKey,
  formatDate,
  locale,
  vehicleCheckUrl,
  resourceLinks,
  onAction,
  onStartService,
  onOpenClient,
  onOpenBooking,
  onEditJob,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onMoveLink,
}) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [historyDate, setHistoryDate] = useState('');
  const greeting = useWorkspaceGreeting(user, workCopy, workCopy.mechanicSubtitle);

  const assignedBookings = useMemo(() => [...data.bookings]
    .filter((booking) => (booking.assignedUserId === user.id || booking.assignedMechanicId === user.id) && booking.status !== 'completed')
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)), [data.bookings, user.id]);

  const todayBookings = assignedBookings.filter((booking) => booking.date === todayKey);
  const myJobs = useMemo(() => [...data.completedJobs]
    .filter((job) => job.mechanicId === user.id)
    .sort((a, b) => `${b.date}T${b.createdAt}`.localeCompare(`${a.date}T${a.createdAt}`)), [data.completedJobs, user.id]);
  const completedToday = myJobs.filter((job) => job.date === todayKey);

  const leftTabs = [
    { id: 'schedule', label: workCopy.schedule },
    { id: 'calendar', label: workCopy.calendar },
    { id: 'clients', label: workCopy.clients },
  ];
  const rightTabs = [{ id: 'history', label: workCopy.history }];

  const changeTab = (tabId) => {
    if (tabId === 'history') setHistoryDate('');
    setActiveTab(tabId);
  };

  const openScheduledToday = () => {
    setActiveTab('schedule');
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

      {activeTab === 'schedule' && (
        <div className="workspace-tab-content">
          <section className="dashboard-grid workspace-overview-grid">
            <DailySchedule
              bookings={assignedBookings}
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
            bookings={assignedBookings}
            locale={locale}
            todayKey={todayKey}
            workCopy={workCopy}
            onCreateBooking={(date) => onAction('booking', { date })}
            onOpenBooking={onOpenBooking}
          />
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="workspace-tab-content">
          <ClientDirectory
            clients={data.clients}
            workCopy={{ ...workCopy, clientsDirectoryDesc: workCopy.clientsDirectoryReadOnlyDesc }}
            canEdit={false}
            canDelete={false}
            onAdd={() => onAction('client')}
            onOpen={onOpenClient}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="workspace-tab-content">
          <WorkHistory
            jobs={myJobs}
            workCopy={workCopy}
            formatDate={formatDate}
            initialDate={historyDate}
            todayKey={todayKey}
            onEditJob={onEditJob}
            canEditJob={(job) => {
              const age = Date.now() - new Date(job.createdAt || 0).getTime();
              return job.mechanicId === user.id && age >= 0 && age <= 24 * 60 * 60 * 1000;
            }}
          />
        </div>
      )}
    </>
  );
}
