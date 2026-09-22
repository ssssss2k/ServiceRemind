import { useDeferredValue, useMemo, useState } from 'react';
import { useIncrementalList } from '../hooks/useIncrementalList';
import { localDateKey } from '../utils/dateUtils';

export default function ActivityLog({ entries, accounts, locale, workCopy }) {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const deferredEmployeeId = useDeferredValue(employeeId);

  const filteredEntries = useMemo(() => [...entries]
    .filter((entry) => !deferredEmployeeId || entry.actorUserId === deferredEmployeeId)
    .filter((entry) => !date || (entry.createdAt && localDateKey(new Date(entry.createdAt)) === date))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))), [entries, deferredEmployeeId, date]);
  const { visibleItems, sentinelRef, hasMore } = useIncrementalList(filteredEntries, 80);

  const actionLabels = {
    client_created: workCopy.auditClientCreated,
    client_updated: workCopy.auditClientUpdated,
    client_deleted: workCopy.auditClientDeleted,
    booking_created: workCopy.auditBookingCreated,
    booking_updated: workCopy.auditBookingUpdated,
    service_completed: workCopy.auditServiceCompleted,
    service_updated: workCopy.auditServiceUpdated,
    profile_updated: workCopy.auditProfileUpdated,
    link_created: workCopy.auditLinkCreated,
    link_updated: workCopy.auditLinkUpdated,
    link_deleted: workCopy.auditLinkDeleted,
    mechanic_created: workCopy.auditMechanicCreated,
    mechanic_removed: workCopy.auditMechanicRemoved,
  };

  const formatTimestamp = (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(value));
  };

  return (
    <section className="dashboard-panel activity-log-panel">
      <div className="workspace-section-head"><div><h2>{workCopy.activityLog}</h2><p>{workCopy.activityLogDesc}</p></div></div>

      <div className="activity-log-filters">
        <label>
          <span>{workCopy.employee}</span>
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            <option value="">{workCopy.allEmployees}</option>
            {accounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
          </select>
        </label>
        <label><span>{workCopy.date}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        {(employeeId || date) && (
          <button type="button" className="workspace-link-btn activity-clear-filter" onClick={() => { setEmployeeId(''); setDate(''); }}>{workCopy.clearFilters}</button>
        )}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="workspace-empty-box"><strong>{workCopy.noActivity}</strong><span>{workCopy.noActivityHint}</span></div>
      ) : (
        <div className="activity-log-scroll">
          {visibleItems.map((entry) => (
            <article className="activity-log-row" key={entry.id}>
              <div className="activity-log-identity"><strong>{entry.actorName || entry.actorEmail}</strong><span>{entry.actorRole === 'owner' ? workCopy.ownerWorkspace : workCopy.mechanicWorkspace}</span></div>
              <div className="activity-log-action"><strong>{entry.actionLabel || actionLabels[entry.action] || entry.action}</strong><span>{[entry.targetLabel, entry.details].filter(Boolean).join(' · ')}</span></div>
              <time>{formatTimestamp(entry.createdAt)}</time>
            </article>
          ))}
          {hasMore && <div ref={sentinelRef} className="workspace-list-sentinel" aria-hidden="true" />}
        </div>
      )}
    </section>
  );
}
