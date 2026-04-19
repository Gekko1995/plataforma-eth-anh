/* ── EmptyState — estado vacío con ícono, mensaje y CTA opcional ─────── */

const ICONS = {
  search: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11" strokeDasharray="2 1.5"/>
    </svg>
  ),
  lock: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  history: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  ),
  inbox: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  users: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,        // { label, onClick }
  compact = false,
}) {
  return (
    <div
      role="status"
      aria-label={title}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '32px 24px' : '64px 24px',
        gap: '12px',
        color: 'var(--content-text-muted)',
      }}
    >
      <div style={{
        width: compact ? '56px' : '72px',
        height: compact ? '56px' : '72px',
        borderRadius: '50%',
        background: 'var(--content-bg)',
        border: '1px solid var(--content-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--content-text-hint)',
        marginBottom: '4px',
      }}>
        {ICONS[icon] || ICONS.inbox}
      </div>

      <p style={{
        fontSize: compact ? 'var(--fs-sm)' : 'var(--fs-md)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--content-text)',
        margin: 0,
      }}>
        {title}
      </p>

      {description && (
        <p style={{
          fontSize: 'var(--fs-sm)',
          color: 'var(--content-text-muted)',
          margin: 0,
          maxWidth: '320px',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      )}

      {action && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={action.onClick}
          style={{ marginTop: '4px' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
