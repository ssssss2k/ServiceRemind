import { useEffect, useRef, useState } from 'react';
import { DragHandleIcon, EditIcon, ExternalIcon, MinusIcon, MoreIcon, PlusIcon } from './WorkspaceIcons';

export default function WorkspaceLinks({
  links,
  vehicleCheckUrl,
  workCopy,
  canManage = false,
  onAdd,
  onEdit,
  onDelete,
  onMove,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!menuOpen && !manageMode) return undefined;

    const close = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      setMenuOpen(false);
      setManageMode(false);
      setDraggedId(null);
      setDragOverId(null);
    };

    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [menuOpen, manageMode]);

  useEffect(() => {
    if (links.length === 0) {
      setMenuOpen(false);
      setManageMode(false);
    }
  }, [links.length]);

  const finishDrop = (targetLink) => {
    if (!draggedId || draggedId === targetLink.id) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const sourceIndex = links.findIndex((link) => link.id === draggedId);
    const targetIndex = links.findIndex((link) => link.id === targetLink.id);
    const sourceLink = links[sourceIndex];

    if (sourceLink && sourceIndex >= 0 && targetIndex >= 0) {
      onMove?.(sourceLink, targetIndex - sourceIndex);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <article ref={panelRef} className="dashboard-panel workspace-links-panel">
      <div className="workspace-links-head">
        <h2>{workCopy.workspaceLinks || workCopy.usefulLinks}</h2>
        {canManage && (
          <div className="workspace-links-toolbar">
            {links.length === 0 ? (
              <button type="button" className="workspace-icon-action" aria-label={workCopy.addNewLink || workCopy.addLink} onClick={onAdd}>
                <PlusIcon size={18} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="workspace-icon-action"
                  aria-label={workCopy.manageLinks}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((value) => !value)}
                >
                  <MoreIcon size={19} />
                </button>
                {menuOpen && (
                  <div className="workspace-links-menu">
                    <button type="button" onClick={() => { setMenuOpen(false); onAdd?.(); }}>
                      <PlusIcon size={15} />{workCopy.addNewLink || workCopy.addLink}
                    </button>
                    <button type="button" onClick={() => { setManageMode((value) => !value); setMenuOpen(false); }}>
                      <EditIcon size={15} />{manageMode ? workCopy.doneManagingLinks : workCopy.manageLinks}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="workspace-links-list">
        <a href={vehicleCheckUrl} target="_blank" rel="noreferrer" className="workspace-resource-link workspace-system-link">
          <div><strong>{workCopy.vehicleCheck}</strong><span>Transpordiamet</span></div>
          <ExternalIcon size={18} />
        </a>

        {links.map((link) => (
          <div
            className={`workspace-resource-row${manageMode ? ' is-managing' : ''}${dragOverId === link.id ? ' is-drag-over' : ''}`}
            key={link.id}
            draggable={canManage && manageMode}
            onDragStart={(event) => {
              setDraggedId(link.id);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', link.id);
            }}
            onDragEnter={(event) => {
              if (!manageMode || draggedId === link.id) return;
              event.preventDefault();
              setDragOverId(link.id);
            }}
            onDragOver={(event) => {
              if (!manageMode) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(event) => {
              event.preventDefault();
              finishDrop(link);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDragOverId(null);
            }}
          >
            {canManage && manageMode && (
              <button type="button" className="workspace-drag-handle" aria-label={workCopy.moveLink || workCopy.manageLinks} tabIndex={-1}>
                <DragHandleIcon size={18} />
              </button>
            )}

            <a href={link.url} target="_blank" rel="noreferrer" className="workspace-resource-link">
              <div><strong>{link.title}</strong><span>{link.url.replace(/^https?:\/\//, '')}</span></div>
              <ExternalIcon size={18} />
            </a>

            {canManage && manageMode && (
              <div className="workspace-resource-actions workspace-resource-actions-manage">
                <button type="button" aria-label={workCopy.editLink} onClick={() => onEdit?.(link)}><EditIcon size={15} /></button>
                <button type="button" className="danger" aria-label={workCopy.deleteLink} onClick={() => onDelete?.(link)}><MinusIcon size={15} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
