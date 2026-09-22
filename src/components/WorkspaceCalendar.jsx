import { useMemo, useState } from 'react';
import { getVehicleLabel } from '../utils/workUtils';
import { BackIcon, ChevronRightIcon } from './WorkspaceIcons';

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
}

function buildMonthDays(cursor) {
  const first = monthStart(cursor);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function WorkspaceCalendar({
  bookings,
  locale,
  todayKey,
  workCopy,
  mechanics = [],
  allowMechanicFilter = false,
  initialMechanicId = '',
  onCreateBooking,
  onOpenBooking,
}) {
  const today = new Date(`${todayKey}T12:00:00`);
  const [cursor, setCursor] = useState(monthStart(today));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [mechanicId, setMechanicId] = useState(initialMechanicId);

  const visibleBookings = useMemo(() => {
    if (!allowMechanicFilter || !mechanicId) return bookings;
    return bookings.filter((booking) => booking.assignedUserId === mechanicId || booking.assignedMechanicId === mechanicId);
  }, [allowMechanicFilter, bookings, mechanicId]);

  const bookingsByDate = useMemo(() => {
    return visibleBookings.reduce((acc, booking) => {
      if (!booking.date) return acc;
      if (!acc[booking.date]) acc[booking.date] = [];
      acc[booking.date].push(booking);
      acc[booking.date].sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
      return acc;
    }, {});
  }, [visibleBookings]);

  const monthDays = useMemo(() => buildMonthDays(cursor), [cursor]);
  const selectedBookings = bookingsByDate[selectedDate] || [];
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(cursor);
  const weekdayLabels = useMemo(() => {
    const monday = new Date(2024, 0, 1, 12);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + index);
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day);
    });
  }, [locale]);

  const moveMonth = (amount) => {
    const next = addMonths(cursor, amount);
    setCursor(next);
    const nextMonthFirst = dateKey(next);
    setSelectedDate(nextMonthFirst);
  };

  return (
    <section className="dashboard-panel workspace-calendar-panel">
      <div className="workspace-calendar-head">
        <div>
          <h2>{workCopy.calendar}</h2>
          <p>{workCopy.calendarDesc}</p>
        </div>
        {allowMechanicFilter && mechanics.length > 0 && (
          <label className="calendar-mechanic-filter">
            <span>{workCopy.mechanicFilter}</span>
            <select value={mechanicId} onChange={(event) => setMechanicId(event.target.value)}>
              <option value="">{workCopy.allMechanics}</option>
              {mechanics.map((mechanic) => (
                <option key={mechanic.id} value={mechanic.id}>{mechanic.name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="calendar-toolbar">
        <button type="button" className="calendar-nav-btn" onClick={() => moveMonth(-1)} aria-label={workCopy.previousMonth}><BackIcon size={17} /></button>
        <strong>{monthLabel}</strong>
        <button type="button" className="calendar-nav-btn" onClick={() => moveMonth(1)} aria-label={workCopy.nextMonth}><ChevronRightIcon size={17} /></button>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
      </div>

      <div className="calendar-grid calendar-days">
        {monthDays.map((day) => {
          const key = dateKey(day);
          const dayBookings = bookingsByDate[key] || [];
          const isCurrentMonth = day.getMonth() === cursor.getMonth();
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          return (
            <button
              key={key}
              type="button"
              className={[
                'calendar-day',
                !isCurrentMonth ? 'muted' : '',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedDate(key)}
            >
              <span className="calendar-day-number">{day.getDate()}</span>
              {dayBookings.length > 0 && (
                <div className="calendar-day-events">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <span key={booking.id}>{booking.time || '-'} {booking.clientName}</span>
                  ))}
                  {dayBookings.length > 2 && <small>+{dayBookings.length - 2}</small>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="calendar-agenda">
        <div className="calendar-agenda-head">
          <div>
            <span>{workCopy.selectedDay}</span>
            <strong>{new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${selectedDate}T12:00:00`))}</strong>
          </div>
          {onCreateBooking && (
            <button type="button" className="workspace-link-btn" onClick={() => onCreateBooking(selectedDate)}>
              + {workCopy.addBookingForDay}
            </button>
          )}
        </div>

        {selectedBookings.length === 0 ? (
          <p className="dashboard-compact-empty">{workCopy.noBookingsForDay}</p>
        ) : (
          <div className="calendar-agenda-list">
            {selectedBookings.map((booking) => (
              <button type="button" className="calendar-agenda-item" key={booking.id} onClick={() => onOpenBooking?.(booking)}>
                <time>{booking.time || '-'}</time>
                <div>
                  <strong>{booking.clientName}</strong>
                  <span>{[getVehicleLabel(booking), booking.plate].filter(Boolean).join(' · ')}</span>
                  <p>{booking.service}</p>
                </div>
                {booking.assignedMechanicName && <small>{booking.assignedMechanicName}</small>}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
