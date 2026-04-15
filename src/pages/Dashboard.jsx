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

      {/* Botones neumórficos por grupo */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Grupos de módulos
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        {GROUPS.map(g => (
          <button
            key={g.id}
            className={`neu-btn neu-${g.id.toLowerCase()}`}
            title={g.name}
            onClick={() => navigate('/modulos')}
          >
            {g.id}
            <span className="neu-tooltip">{g.name}</span>
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
