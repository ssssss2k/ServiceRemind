import { useMemo, useState } from 'react';
import DailySchedule from './DailySchedule';
import WorkspaceCalendar from './WorkspaceCalendar';
import WorkspaceDaySummary from './WorkspaceDaySummary';
import WorkspaceTabs from './WorkspaceTabs';
import WorkHistory from './WorkHistory';
import { BackIcon } from './WorkspaceIcons';


export default function OwnerMechanicView({
  mechanic,
  bookings,
  jobs,
  todayKey,
  locale,
  formatDate,
  workCopy,
  onBack,
  onCreateBooking,
  onOpenBooking,
  onEditJob,
}) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [historyDate, setHistoryDate] = useState('');

  const activeBookings = useMemo(() => [...bookings]
    .filter((booking) => booking.status !== 'completed')
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)), [bookings]);
  const todayBookings = activeBookings.filter((booking) => booking.date === todayKey);
  const completedToday = jobs.filter((job) => job.date === todayKey);

  const leftTabs = [
    { id: 'schedule', label: workCopy.schedule },
    { id: 'calendar', label: workCopy.calendar },
  ];
  const rightTabs = [{ id: 'history', label: workCopy.history }];

  const changeTab = (tabId) => {
    if (tabId === 'history') setHistoryDate('');
    setActiveTab(tabId);
  };

  return (
    <div className="owner-mechanic-view">
      <button type="button" className="owner-mechanic-back" aria-label={workCopy.backToMechanics} onClick={onBack}>
        <BackIcon size={20} strokeWidth={2.2} />
      </button>

      <div className="dashboard-heading-row workspace-heading-row owner-mechanic-heading workspace-heading-clean">
        <div><h1>{mechanic.name}</h1><p>{mechanic.email}</p></div>
        <button type="button" className="dashboard-primary-action workspace-heading-action" onClick={() => onCreateBooking(mechanic)}>
          + {workCopy.bookingForMechanic}
        </button>
      </div>

      <WorkspaceDaySummary
        todayKey={todayKey}
        locale={locale}
        workCopy={workCopy}
        scheduledCount={todayBookings.length}
        completedCount={completedToday.length}
        onOpenScheduled={() => setActiveTab('schedule')}
        onOpenCompleted={() => { setHistoryDate(todayKey); setActiveTab('history'); }}
      />

      <WorkspaceTabs leftTabs={leftTabs} rightTabs={rightTabs} activeTab={activeTab} onChange={changeTab} />

      {activeTab === 'schedule' && (
        <DailySchedule
          bookings={activeBookings}
          todayKey={todayKey}
          locale={locale}
          workCopy={workCopy}
          onOpenBooking={onOpenBooking}
          onCreateBooking={(date) => onCreateBooking(mechanic, date)}
          maxFutureDays={14}
        />
      )}

      {activeTab === 'calendar' && (
        <WorkspaceCalendar
          bookings={activeBookings}
          locale={locale}
          todayKey={todayKey}
          workCopy={workCopy}
          initialMechanicId={mechanic.id}
          onCreateBooking={(date) => onCreateBooking(mechanic, date)}
          onOpenBooking={onOpenBooking}
        />
      )}

      {activeTab === 'history' && (
        <WorkHistory jobs={jobs} workCopy={workCopy} formatDate={formatDate} initialDate={historyDate} todayKey={todayKey} onEditJob={onEditJob} />
      )}
    </div>
  );
}
