import { dateFromKey } from '../utils/dateUtils';

function formatWorkspaceDate(key, locale) {
  const date = dateFromKey(key);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const dateLabel = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
  const normalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${normalizedWeekday} · ${dateLabel}`;
}

export default function WorkspaceDaySummary({
  todayKey,
  locale,
  workCopy,
  scheduledCount,
  completedCount,
  onNewBooking,
  onStartService,
  onOpenScheduled,
  onOpenCompleted,
}) {
  return (
    <section className="workspace-day-summary workspace-day-summary-actions" aria-label={workCopy.todaySummary}>
      <div className="workspace-day-summary-date">
        <strong>{formatWorkspaceDate(todayKey, locale)}</strong>
        <div className="workspace-day-summary-stats">
          <button type="button" className="workspace-inline-stat" onClick={onOpenScheduled}>
            <span>{workCopy.scheduledTodayShort || workCopy.scheduledToday}</span>
            <b>{scheduledCount}</b>
          </button>
          <button type="button" className="workspace-inline-stat" onClick={onOpenCompleted}>
            <span>{workCopy.completedTodayShort || workCopy.completedToday}</span>
            <b>{completedCount}</b>
          </button>
        </div>
      </div>
      <div className="workspace-day-summary-metrics workspace-day-summary-cta">
        <button type="button" className="workspace-day-action workspace-day-action-secondary" onClick={onNewBooking}>
          + {workCopy.newBooking}
        </button>
        <button type="button" className="workspace-day-action workspace-day-action-primary" onClick={onStartService}>
          {workCopy.startService}
        </button>
      </div>
    </section>
  );
}
