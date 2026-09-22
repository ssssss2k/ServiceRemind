import { useMemo, useState } from 'react';
import { addDaysToKey, formatDayLabel } from '../utils/dateUtils';
import { BackIcon, ChevronRightIcon } from './WorkspaceIcons';
import { getVehicleLabel } from '../utils/workUtils';

export default function DailySchedule({
  bookings,
  todayKey,
  locale,
  workCopy,
  onOpenBooking,
  onCreateBooking,
  maxFutureDays = 14,
  title,
  description,
}) {
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const maxDate = useMemo(() => addDaysToKey(todayKey, maxFutureDays), [todayKey, maxFutureDays]);

  const selectedBookings = useMemo(() => [...bookings]
    .filter((booking) => booking.status !== 'completed' && booking.date === selectedDate)
    .sort((a, b) => String(a.time || '').localeCompare(String(b.time || ''))), [bookings, selectedDate]);

  const moveDay = (amount) => {
    const next = addDaysToKey(selectedDate, amount);
    if (next < todayKey || next > maxDate) return;
    setSelectedDate(next);
  };

  const dayLabel = formatDayLabel(selectedDate, locale, todayKey, workCopy.today);
  const canGoBack = selectedDate > todayKey;
  const canGoForward = selectedDate < maxDate;

  return (
    <article className="dashboard-panel daily-schedule-panel" id="workspace-schedule-panel">
      <div className="daily-schedule-head">
        <div>
          <h2>{title || workCopy.todaysSchedule}</h2>
          <p>{description || workCopy.openBookingHint}</p>
        </div>
        <div className="daily-schedule-nav" aria-label={workCopy.browseSchedule}>
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => moveDay(-1)}
            disabled={!canGoBack}
            aria-label={workCopy.previousDay}
          >
            <BackIcon size={18} />
          </button>
          <div className="daily-schedule-date">
            <strong>{dayLabel}</strong>
            {selectedDate !== todayKey && (
              <button type="button" onClick={() => setSelectedDate(todayKey)}>{workCopy.backToToday}</button>
            )}
          </div>
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => moveDay(1)}
            disabled={!canGoForward}
            aria-label={workCopy.nextDay}
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      {selectedBookings.length === 0 ? (
        <div className="workspace-empty-box daily-schedule-empty">
          <strong>{workCopy.noBookingsForDay}</strong>
          <span>{workCopy.browseNextMonthHint}</span>
        </div>
      ) : (
        <div className="daily-schedule-list">
          {selectedBookings.map((booking) => (
            <button type="button" className="daily-schedule-item" key={booking.id} onClick={() => onOpenBooking?.(booking)}>
              <time>{booking.time || '-'}</time>
              <div>
                <strong>{booking.clientName}</strong>
                <span>{[getVehicleLabel(booking), booking.plate, booking.assignedMechanicName].filter(Boolean).join(' · ')}</span>
                <p>{booking.service}</p>
              </div>
              <ChevronRightIcon size={18} />
            </button>
          ))}
        </div>
      )}

      {onCreateBooking && (
        <div className="daily-schedule-footer">
          <button type="button" className="workspace-link-btn" onClick={() => onCreateBooking(selectedDate)}>
            + {workCopy.addBookingForDay}
          </button>
        </div>
      )}
    </article>
  );
}
