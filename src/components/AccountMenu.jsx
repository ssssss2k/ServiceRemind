import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from './WorkspaceIcons';

export default function AccountMenu({ user, workCopy, onSettings, onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const role = user?.role === 'mechanic' ? workCopy.mechanicWorkspace : workCopy.ownerWorkspace;

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className={open ? 'account-menu-trigger active' : 'account-menu-trigger'}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{user?.name}</span>
        <ChevronDownIcon size={16} />
      </button>
      {open && (
        <div className="account-menu-popover">
          <div className="account-menu-profile">
            <strong>{user?.name}</strong>
            <span>{role}</span>
            <small>{user?.email}</small>
          </div>
          <button type="button" onClick={() => { setOpen(false); onSettings(); }}>
            {workCopy.profileSettings}<ChevronRightIcon size={17} />
          </button>
          <button type="button" className="account-menu-logout" onClick={() => { setOpen(false); onLogout(); }}>
            {workCopy.signOut}<ChevronRightIcon size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
