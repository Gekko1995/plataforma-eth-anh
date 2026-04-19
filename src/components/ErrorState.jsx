/* ── ErrorState — estado de error con ícono, mensaje y retry ────────── */

export default function ErrorState({ message, onRetry, compact = false }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '24px 16px' : '56px 24px',
        gap: '12px',
      }}
    >
      {/* Ícono de alerta — color + forma + texto (no solo color) */}
      <div style={{
        width: compact ? '52px' : '68px',
        height: compact ? '52px' : '68px',
        borderRadius: '50%',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e11d48',
        marginBottom: '4px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/>
        </svg>
      </div>

      <p style={{
        fontSize: compact ? 'var(--fs-sm)' : 'var(--fs-md)',
        fontWeight: 'var(--fw-semibold)',
        color: '#9f1239',
        margin: 0,
      }}>
        {/* Texto + ícono: nunca solo color */}
        ⚠ Algo salió mal
      </p>

      <p style={{
        fontSize: 'var(--fs-sm)',
        color: 'var(--content-text-muted)',
        margin: 0,
        maxWidth: '340px',
        lineHeight: 1.6,
      }}>
        {message || 'No se pudieron cargar los datos. Verifica tu conexión e intenta de nuevo.'}
      </p>

      {onRetry && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
          style={{ marginTop: '4px' }}
        >
          ↺ Intentar de nuevo
        </button>
      )}
    </div>
  );
}
