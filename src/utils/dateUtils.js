export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateFromKey(key) {
  return new Date(`${key}T12:00:00`);
}

export function dateKeyFromDate(date) {
  return localDateKey(date);
}

export function addDaysToKey(key, amount) {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + amount);
  return dateKeyFromDate(date);
}

export function compareDateKeys(a, b) {
  return String(a || '').localeCompare(String(b || ''));
}

export function formatDayLabel(key, locale, todayKey, todayWord) {
  const date = dateFromKey(key);
  const isToday = key === todayKey;
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const dateLabel = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
  const normalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  if (isToday) return `${todayWord}, ${weekday} · ${dateLabel}`;
  return `${normalizedWeekday}, ${dateLabel}`;
}
