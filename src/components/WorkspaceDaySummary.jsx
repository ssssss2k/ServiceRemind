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
  onOpenScheduled,
  onOpenCompleted,
}) {
  return (
    <section className="workspace-day-summary" aria-label={workCopy.todaySummary}>
      <div className="workspace-day-summary-date">
        <strong>{formatWorkspaceDate(todayKey, locale)}</strong>
      </div>
      <div className="workspace-day-summary-metrics">
        <button type="button" className="workspace-day-metric clickable" onClick={onOpenScheduled}>
          <span>{workCopy.scheduledTodayShort || workCopy.scheduledToday}</span>
          <strong>{scheduledCount}</strong>
        </button>
        <button type="button" className="workspace-day-metric clickable" onClick={onOpenCompleted}>
          <span>{workCopy.completedTodayShort || workCopy.completedToday}</span>
          <strong>{completedCount}</strong>
        </button>
      </div>
    </section>
  );
}
