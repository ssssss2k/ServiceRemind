import { useDeferredValue, useMemo, useState } from 'react';
import { clientMatches, getVehicleLabel } from '../utils/workUtils';
import { useIncrementalList } from '../hooks/useIncrementalList';
import { ChevronRightIcon, EditIcon, MoreIcon, TrashIcon } from './WorkspaceIcons';

export default function ClientDirectory({
  clients,
  workCopy,
  canEdit = true,
  canDelete = false,
  onAdd,
  onEdit,
  onDelete,
  onOpen,
}) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const deferredQuery = useDeferredValue(query);

  const filteredClients = useMemo(() => [...clients]
    .filter((client) => clientMatches(client, deferredQuery))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))), [clients, deferredQuery]);
  const { visibleItems, sentinelRef, hasMore } = useIncrementalList(filteredClients, 70);
  const hasActions = canEdit || canDelete;

  return (
    <section className="dashboard-panel client-directory-panel">
      <div className="workspace-section-head">
        <div><h2>{workCopy.clientsDirectory}</h2><p>{workCopy.clientsDirectoryDesc}</p></div>
        {onAdd && <button type="button" className="workspace-link-btn" onClick={onAdd}>+ {workCopy.addClient}</button>}
      </div>

      <div className="workspace-search-row">
        <label className="workspace-search-field">
          <span className="sr-only">{workCopy.searchClients}</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={workCopy.searchClients} />
        </label>
        <span className="workspace-result-count">{query ? `${workCopy.found}: ${filteredClients.length}` : `${workCopy.totalLabel}: ${clients.length}`}</span>
      </div>

      {filteredClients.length === 0 ? (
        <div className="workspace-empty-box"><strong>{workCopy.noClientsFound}</strong><span>{query ? workCopy.tryAnotherSearch : workCopy.noClientsYet}</span></div>
      ) : (
        <div className="client-list">
          {visibleItems.map((client) => {
            const vehicle = getVehicleLabel(client);
            const isOpen = menuOpen === client.id;
            return (
              <article className="client-row" key={client.id}>
                <button type="button" className="client-row-main" onClick={() => onOpen?.(client)}>
                  <div className="client-row-primary"><strong>{client.name}</strong><span>{client.phone || '-'}</span></div>
                  <div className="client-row-vehicle"><strong>{vehicle || workCopy.vehicleNotAdded}</strong><span>{client.plate || '-'}</span></div>
                  <span className="client-row-open-arrow"><ChevronRightIcon size={18} /></span>
                </button>
                {hasActions && (
                  <div className="client-row-actions">
                    <button type="button" className="client-more-btn" aria-label={workCopy.clientActions} aria-expanded={isOpen} onClick={() => setMenuOpen(isOpen ? null : client.id)}><MoreIcon size={19} /></button>
                    {isOpen && (
                      <div className="client-actions-menu">
                        {canEdit && onEdit && <button type="button" onClick={() => { setMenuOpen(null); onEdit(client); }}><EditIcon size={15} />{workCopy.editClient}</button>}
                        {canDelete && onDelete && <button type="button" className="danger" onClick={() => { setMenuOpen(null); onDelete(client); }}><TrashIcon size={15} />{workCopy.deleteClient}</button>}
                      </div>
                    )}
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
