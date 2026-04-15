import { useOutletContext, useNavigate } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';

const total = GROUPS.reduce((a, g) => a + g.modules.length, 0);
const countSt = s => GROUPS.reduce((a, g) => a + g.modules.filter(m => m.status === s).length, 0);

// ── Iconos SVG inline ──────────────────────────────────────────
const IconGrid = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconStar = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconRefresh = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconRecycle = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

const IconEye = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconUsers = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconLock = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function Dashboard() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading } = useModulosVisibles(user);
  const navigate = useNavigate();

  const kpis = [
    { label: 'Módulos totales',  value: total,                              color: '#4f8ef7', bg: '#eff6ff', icon: <IconGrid    size={18} color="#4f8ef7" /> },
    { label: 'Nuevos',           value: countSt('nuevo'),                   color: '#7C3AED', bg: '#f5f3ff', icon: <IconStar    size={18} color="#7C3AED" /> },
    { label: 'Adaptar',          value: countSt('adaptar'),                 color: '#B45309', bg: '#fffbeb', icon: <IconRefresh size={18} color="#B45309" /> },
    { label: 'Reutilizar',       value: countSt('reutilizar'),              color: '#059669', bg: '#ecfdf5', icon: <IconRecycle size={18} color="#059669" /> },
    { label: 'Visibles para ti', value: loading ? '…' : modulosVisibles.length, color: '#0369A1', bg: '#f0f9ff', icon: <IconEye size={18} color="#0369A1" /> },
  ];

  return (
    <div>
      {/* Bienvenida */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--content-text)', lineHeight: 1.2 }}>
          Bienvenido, {user?.nombre?.split(' ')[0] || 'Usuario'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--content-text-muted)', marginTop: '5px' }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}Plataforma ETH-ANH 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '32px' }}>
        {kpis.map(k => (
          <div
            key={k.label}
            className="kpi-card"
            style={{ borderTop: `3px solid ${k.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="kpi-label">{k.label}</span>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: k.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {k.icon}
              </div>
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tarjetas de grupos */}
      <p className="section-label" style={{ marginBottom: '14px' }}>Grupos de módulos</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '32px',
      }}>
        {GROUPS.filter(g => modulosVisibles.some(m => m.grupoId === g.id)).map(g => {
          const count = modulosVisibles.filter(m => m.grupoId === g.id).length;
          return (
            <button
              key={g.id}
              onClick={() => navigate(`/modulos?grupo=${g.id}`)}
              className="group-card-btn"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = g.color;
                e.currentTarget.style.boxShadow = `0 6px 20px ${g.color}28`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--content-border)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Barra de color superior */}
              <div style={{ height: '3px', background: g.color }} />
              <div style={{ padding: '14px 15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '7px',
                    background: g.color + '18', color: g.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '13px', flexShrink: 0,
                  }}>
                    {g.id}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3, textAlign: 'left' }}>
                    {g.name}
                  </span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: g.color + '14', borderRadius: '20px',
                  padding: '3px 9px', fontSize: '11px', fontWeight: 600, color: g.color,
                }}>
                  <IconGrid size={10} color={g.color} />
                  {count} módulo{count !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Accesos rápidos */}
      <p className="section-label" style={{ marginBottom: '14px' }}>Accesos rápidos</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => navigate('/modulos')}>
          <IconGrid size={14} color="#fff" />
          Ver módulos
        </button>
        {user?.rol === 'admin' && (
          <>
            <button className="btn btn-secondary" onClick={() => navigate('/usuarios')}>
              <IconUsers size={14} />
              Gestionar usuarios
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/permisos')}>
              <IconLock size={14} />
              Gestionar permisos
            </button>
          </>
        )}
      </div>
    </div>
  );
}
