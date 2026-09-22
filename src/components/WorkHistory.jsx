import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { getVehicleLabel, jobMatches } from '../utils/workUtils';
import { useIncrementalList } from '../hooks/useIncrementalList';
import { EditIcon } from './WorkspaceIcons';

export default function WorkHistory({
  jobs,
  workCopy,
  formatDate,
  showMechanic = false,
  initialDate = '',
  todayKey = '',
  onEditJob,
  canEditJob,
}) {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(initialDate || '');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setDateFilter(initialDate || '');
  }, [initialDate]);

  const filteredJobs = useMemo(() => [...jobs]
    .filter((job) => jobMatches(job, deferredQuery))
    .filter((job) => !dateFilter || job.date === dateFilter)
    .sort((a, b) => `${b.date || ''}T${b.createdAt || ''}`.localeCompare(`${a.date || ''}T${a.createdAt || ''}`)), [jobs, deferredQuery, dateFilter]);
  const { visibleItems, sentinelRef, hasMore } = useIncrementalList(filteredJobs, 50);

  return (
    <section className="dashboard-panel work-history-panel">
      <div className="workspace-section-head">
        <div>
          <h2>{dateFilter === todayKey && todayKey ? workCopy.completedTodaySection : dateFilter ? workCopy.completedForSelectedDay : workCopy.completedHistory}</h2>
          <p>{workCopy.historyDesc}</p>
        </div>
      </div>

      <div className="workspace-search-row history-search-row">
        <label className="workspace-search-field">
          <span className="sr-only">{workCopy.searchHistory}</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={workCopy.searchHistory} />
        </label>
        <label className="workspace-date-filter">
          <span className="sr-only">{workCopy.date}</span>
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
        </label>
        <span className="workspace-result-count">{workCopy.found}: {filteredJobs.length}</span>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="workspace-empty-box">
          <strong>{workCopy.noCompletedJobs}</strong>
          <span>{query || dateFilter ? workCopy.tryAnotherSearch : workCopy.historyEmptyHint}</span>
        </div>
      ) : (
        <div className="work-history-scroll">
          {visibleItems.map((job) => {
            const vehicle = getVehicleLabel(job);
            const items = Array.isArray(job.workItems) && job.workItems.length ? job.workItems : [job.service].filter(Boolean);
            const editable = Boolean(onEditJob && (!canEditJob || canEditJob(job)));

            return (
              <article className="work-history-card" key={job.id}>
                <div className="work-history-card-head">
                  <div>
                    <strong>{job.clientName}</strong>
                    <span>{[vehicle, job.plate, job.phone].filter(Boolean).join(' · ')}</span>
                  </div>
                  <div className="work-history-meta">
                    {showMechanic && job.mechanicName && <small>{job.mechanicName}</small>}
                    <time dateTime={job.date}>{formatDate(job.date)}</time>
                    {editable && (
                      <button type="button" className="work-history-edit" aria-label={workCopy.editServiceRecord} onClick={() => onEditJob(job)}>
                        <EditIcon size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="work-items-list">
                  {items.map((item, index) => <span key={`${job.id}-work-${index}`}>{item}</span>)}
                </div>

                {(job.materials || job.mileage || job.notes || job.nextServiceDueDate) && (
                  <div className="work-history-details">
                    {job.mileage && <span><b>{workCopy.mileage}:</b> {job.mileage}</span>}
                    {job.materials && <span><b>{workCopy.materials}:</b> {job.materials}</span>}
                    {job.notes && <span><b>{workCopy.notes}:</b> {job.notes}</span>}
                    {job.nextServiceDueDate && <span><b>{workCopy.nextService}:</b> {formatDate(job.nextServiceDueDate)}</span>}
                  </div>
                )}
              </article>
            );
          })}
          {hasMore && <div ref={sentinelRef} className="workspace-list-sentinel" aria-hidden="true" />}
        </div>
      )}
    </section>
  );
}
