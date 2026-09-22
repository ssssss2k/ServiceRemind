import { useEffect } from 'react';
import { getVehicleLabel } from '../utils/workUtils';
import { EditIcon } from './WorkspaceIcons';

export default function BookingDetailModal({ booking, workCopy, formatDate, canStart = false, canEdit = false, onStart, onEdit, onClose }) {
  useEffect(() => {
    if (!booking) return undefined;
    const key = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [booking, onClose]);

  if (!booking) return null;

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal booking-detail-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <div className="work-modal-brand">Workspace</div>
        <div className="booking-detail-time">{formatDate(booking.date)} · {booking.time || '-'}</div>
        <h2>{booking.clientName}</h2>
        <p className="booking-detail-vehicle">{[getVehicleLabel(booking), booking.plate].filter(Boolean).join(' · ')}</p>

        <div className="booking-detail-grid">
          <div><span>{workCopy.phoneLabel}</span><strong>{booking.phone || '-'}</strong></div>
          <div><span>{workCopy.assignedMechanic}</span><strong>{booking.assignedMechanicName || workCopy.unassigned}</strong></div>
        </div>
        <div className="booking-detail-work">
          <span>{workCopy.plannedWork}</span>
          <strong>{booking.service || '-'}</strong>
          {booking.notes && <p>{booking.notes}</p>}
        </div>

        {(canEdit || canStart) && (
          <div className="booking-detail-actions">
            {canEdit && (
              <button type="button" className="work-secondary-btn icon-text-action" onClick={() => onEdit(booking)}>
                <EditIcon size={15} /> {workCopy.editBooking}
              </button>
            )}
            {canStart && (
              <button type="button" className="work-primary-btn" onClick={() => onStart(booking)}>
                {workCopy.startService}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
