import { useOutletContext, useNavigate } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';

const total = GROUPS.reduce((a, g) => a + g.modules.length, 0);
const countSt = s => GROUPS.reduce((a, g) => a + g.modules.filter(m => m.status === s).length, 0);

export default function Dashboard() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading } = useModulosVisibles(user);
  const navigate = useNavigate();

  const kpis = [
    { label: 'Módulos totales', value: total, delta: null },
    { label: 'Nuevos', value: countSt('nuevo'), delta: null },
    { label: 'Adaptar', value: countSt('adaptar'), delta: null },
    { label: 'Reutilizar', value: countSt('reutilizar'), delta: null },
    { label: 'Visibles para ti', value: loading ? '…' : modulosVisibles.length, delta: null },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Bienvenido, {user?.nombre?.split(' ')[0] || 'Usuario'}
      </h1>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '32px' }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tarjetas de grupos */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Grupos de módulos
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '32px',
      }}>
        {GROUPS.map(g => (
          <button
            key={g.id}
            onClick={() => navigate(`/modulos?grupo=${g.id}`)}
            style={{
              background: '#fff',
              border: `2px solid ${g.color}33`,
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'box-shadow .18s, border-color .18s',
              boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = g.color;
              e.currentTarget.style.boxShadow = `0 4px 16px ${g.color}33`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${g.color}33`;
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: g.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '14px', flexShrink: 0,
              }}>
                {g.id}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                {g.name}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {g.modules.length} módulo{g.modules.length !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>

      {/* Accesos rápidos */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Accesos rápidos
      </h2>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => navigate('/modulos')}>
          Ver módulos
        </button>
        {user?.rol === 'admin' && (
          <>
            <button className="btn btn-secondary" onClick={() => navigate('/usuarios')}>
              Gestionar usuarios
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/permisos')}>
              Gestionar permisos
            </button>
          </>
        )}
      </div>
    </div>
  );
}
