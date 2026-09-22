function IconBase({ children, className = '', size = 18, strokeWidth = 2 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>;
}

export function ChevronDownIcon(props) {
  return <IconBase {...props}><path d="m6 9 6 6 6-6" /></IconBase>;
}

export function BackIcon(props) {
  return <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>;
}

export function ExternalIcon(props) {
  return <IconBase {...props}><path d="M15 5h4v4" /><path d="M10 14 19 5" /><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></IconBase>;
}

export function EditIcon(props) {
  return <IconBase {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></IconBase>;
}

export function TrashIcon(props) {
  return <IconBase {...props}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></IconBase>;
}

export function MoreIcon(props) {
  return <IconBase {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></IconBase>;
}

export function PlusIcon(props) {
  return <IconBase {...props}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase>;
}

export function MinusIcon(props) {
  return <IconBase {...props}><path d="M5 12h14" /></IconBase>;
}

export function ArrowUpIcon(props) {
  return <IconBase {...props}><path d="m6 15 6-6 6 6" /></IconBase>;
}

export function ArrowDownIcon(props) {
  return <IconBase {...props}><path d="m6 9 6 6 6-6" /></IconBase>;
}

export function UserIcon(props) {
  return <IconBase {...props}><circle cx="12" cy="8" r="4" /><path d="M4.5 20c.9-4 3.4-6 7.5-6s6.6 2 7.5 6" /></IconBase>;
}

export function EyeIcon(props) {
  return <IconBase {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></IconBase>;
}

export function EyeOffIcon(props) {
  return <IconBase {...props}><path d="m3 3 18 18" /><path d="M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.1 2.8" /><path d="M6.1 6.2C3.8 7.8 2.5 12 2.5 12S6 18 12 18a9 9 0 0 0 3.3-.6" /><path d="M10.2 10.2a2.5 2.5 0 0 0 3.6 3.6" /></IconBase>;
}

export function DragHandleIcon(props) {
  return <IconBase {...props}><circle cx="9" cy="7" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none" /></IconBase>;
}

export function PlayIcon(props) {
  return <IconBase {...props}><path d="m9 7 8 5-8 5Z" /></IconBase>;
}

export function PauseIcon(props) {
  return <IconBase {...props}><path d="M9 7v10" /><path d="M15 7v10" /></IconBase>;
}
