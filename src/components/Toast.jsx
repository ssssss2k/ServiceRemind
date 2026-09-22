export default function Toast({ toast }) {
  const className = [
    'toast',
    toast.visible ? 'show' : '',
    toast.isError ? 'error' : '',
  ].filter(Boolean).join(' ');

  return <div className={className}>{toast.message}</div>;
}
