import { useEffect, useMemo } from 'react';
import { getVehicleLabel } from '../utils/workUtils';
import { EditIcon } from './WorkspaceIcons';

export default function ClientDetailModal({ client, jobs, workCopy, formatDate, onEdit, onEditJob, canEditJob, onClose }) {
  useEffect(() => {
    if (!client) return undefined;
    const key = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [client, onClose]);

  const clientJobs = useMemo(() => {
    if (!client) return [];
    const normalizedPhone = String(client.phone || '').replace(/\s/g, '');
    const normalizedPlate = String(client.plate || '').replace(/\s/g, '').toLowerCase();
    return [...jobs]
      .filter((job) => job.clientId === client.id
        || (normalizedPhone && String(job.phone || '').replace(/\s/g, '') === normalizedPhone)
        || (normalizedPlate && String(job.plate || '').replace(/\s/g, '').toLowerCase() === normalizedPlate))
      .sort((a, b) => `${b.date || ''}T${b.createdAt || ''}`.localeCompare(`${a.date || ''}T${a.createdAt || ''}`));
  }, [client, jobs]);

  if (!client) return null;

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal client-detail-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">Workspace</div>
        <div className="client-detail-head">
          <div>
            <h2>{client.name}</h2>
            <p>{[client.phone, getVehicleLabel(client), client.plate].filter(Boolean).join(' · ')}</p>
          </div>
          {onEdit && (
            <button type="button" className="workspace-secondary-action icon-text-action" onClick={() => onEdit(client)}>
              <EditIcon size={15} /> {workCopy.editClient}
            </button>
          )}
        </div>
        <div className="client-detail-history-head">
          <h3>{workCopy.clientServiceHistory}</h3>
          <span>{clientJobs.length}</span>
        </div>
        {clientJobs.length === 0 ? (
          <div className="workspace-empty-box"><strong>{workCopy.noClientHistory}</strong><span>{workCopy.noClientHistoryHint}</span></div>
        ) : (
          <div className="client-detail-history-scroll">
            {clientJobs.map((job) => {
              const items = Array.isArray(job.workItems) && job.workItems.length ? job.workItems : [job.service].filter(Boolean);
              const editable = Boolean(onEditJob && (!canEditJob || canEditJob(job)));
              return (
                <article className="client-service-record" key={job.id}>
                  <div>
                    <div className="client-service-date"><strong>{formatDate(job.date)}</strong><span>{job.mechanicName || '-'}</span></div>
                    {editable && (
                      <button type="button" className="client-service-edit" aria-label={workCopy.editServiceRecord} onClick={() => onEditJob(job)}>
                        <EditIcon size={15} />
                      </button>
                    )}
                  </div>
                  <ul>{items.map((item, index) => <li key={`${job.id}-${index}`}>{item}</li>)}</ul>
                  {(job.mileage || job.materials || job.notes || job.nextServiceDueDate) && (
                    <p>{[job.mileage, job.materials, job.notes, job.nextServiceDueDate ? `${workCopy.nextService}: ${formatDate(job.nextServiceDueDate)}` : ''].filter(Boolean).join(' · ')}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
