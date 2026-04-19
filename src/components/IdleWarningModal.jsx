export default function IdleWarningModal({ secondsLeft, onStay, onLogout }) {
  const pct   = (secondsLeft / 60) * 100;
  const color = secondsLeft > 30 ? '#b45309' : '#dc2626';
  const r     = 28;
  const circ  = 2 * Math.PI * r;
  const dash  = circ * (1 - pct / 100);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="idle-title" style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(7,26,42,.7)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '32px 36px',
        maxWidth: 400, width: '90%', textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,.3)',
        border: '1px solid #e2e8f0',
      }}>
        {/* Círculo de cuenta regresiva */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
            <circle
              cx="36" cy="36" r={r} fill="none"
              stroke={color} strokeWidth="5"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dashoffset .9s linear, stroke .3s' }}
            />
            <text x="36" y="41" textAnchor="middle"
              style={{ fontSize: 20, fontWeight: 800, fill: color, fontFamily: 'inherit' }}>
              {secondsLeft}
            </text>
          </svg>
        </div>

        <h2 id="idle-title" style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
          ¿Sigues ahí?
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Tu sesión se cerrará en <strong style={{ color }}>{secondsLeft} segundos</strong> por inactividad.
          <br />Haz clic en <em>Seguir conectado</em> para continuar.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onStay}
            autoFocus
            style={{
              padding: '10px 22px', borderRadius: 8, border: 'none',
              background: '#074A6A', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Seguir conectado
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 22px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f8fafc',
              color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
