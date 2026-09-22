import { ChevronRightIcon, MinusIcon, PlusIcon } from './WorkspaceIcons';

export default function MechanicsDirectory({
  mechanics,
  activeBookings,
  todayKey,
  workCopy,
  removeMode,
  onAdd,
  onToggleRemove,
  onOpen,
  onRemove,
}) {
  return (
    <section className={`dashboard-panel owner-mechanics-panel compact-owner-mechanics ${removeMode ? 'mechanic-remove-mode' : ''}`}>
      <div className="dashboard-panel-head owner-panel-heading owner-mechanics-heading-row">
        <div>
          <h2>{workCopy.mechanics}</h2>
          <p>{removeMode ? workCopy.removeMechanicMode : workCopy.mechanicsDescCompact}</p>
        </div>
        <div className="owner-mechanic-controls">
          <button type="button" className="workspace-icon-action" aria-label={workCopy.addMechanic} onClick={onAdd}><PlusIcon size={18} /></button>
          <button
            type="button"
            className={`workspace-icon-action ${removeMode ? 'danger active' : ''}`}
            aria-label={workCopy.removeMechanic}
            onClick={onToggleRemove}
            disabled={mechanics.length === 0}
          ><MinusIcon size={18} /></button>
        </div>
      </div>

      <div className="mechanic-card-grid compact-mechanic-list">
        {mechanics.map((mechanic) => {
          const mechanicBookings = activeBookings.filter((booking) => booking.assignedUserId === mechanic.id || booking.assignedMechanicId === mechanic.id);
          const todayForMechanic = mechanicBookings.filter((booking) => booking.date === todayKey).sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
          const nextBooking = todayForMechanic[0] || [...mechanicBookings]
            .filter((booking) => booking.date >= todayKey)
            .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];

          return (
            <button
              type="button"
              className={`mechanic-card mechanic-card-compact ${removeMode ? 'removable' : ''}`}
              key={mechanic.id}
              onClick={() => removeMode ? onRemove(mechanic) : onOpen(mechanic)}
            >
              <div className="mechanic-card-identity"><strong>{mechanic.name}</strong><span>{workCopy.mechanicWorkspace}</span></div>
              <div className="mechanic-card-brief">
                <span>{workCopy.todayJobs}: <b>{todayForMechanic.length}</b></span>
                <small>{nextBooking ? `${nextBooking.time || ''} ${nextBooking.clientName}`.trim() : workCopy.noMechanicBookings}</small>
              </div>
              {removeMode ? <MinusIcon size={18} /> : <ChevronRightIcon size={18} />}
            </button>
          );
        })}
        {mechanics.length === 0 && <p className="mechanics-empty-line">{workCopy.noMechanicsYet || workCopy.noMechanicBookings}</p>}
      </div>
    </section>
  );
}
