import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';
import { modulos as MODULOS_DATA } from '../data/modulos';
import ModuloModal from '../components/ModuloModal';
import { addLog } from '../utils/auth';

// Lookup rápido id → datos ricos del módulo
const moduloMap = Object.fromEntries(MODULOS_DATA.map(m => [m.id, m]));

export default function ModulosPage() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading, error } = useModulosVisibles(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedModulo, setSelectedModulo] = useState(null);

  const filtroGrupo = searchParams.get('grupo') || '';
  const setFiltroGrupo = (val) => {
    if (val) setSearchParams({ grupo: val });
    else setSearchParams({});
  };

  function abrirModal(m, g) {
    const richData = moduloMap[m.id];
    if (!richData) return;
    setSelectedModulo({ ...richData, grupoColor: g.color, grupoNombre: g.name });
    addLog(user, 'ABRIR_MODULO', `#${m.id} — ${m.name}`);
  }

  if (loading) {
    return <p style={{ color: 'var(--content-text-muted)' }}>Cargando módulos…</p>;
  }

  if (error) {
    return <p style={{ color: 'var(--status-danger)' }}>{error}</p>;
  }

  const modulosFiltrados = modulosVisibles.filter(m => {
    const coincideGrupo = !filtroGrupo || m.grupoId === filtroGrupo;
    const coincideBusqueda = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return coincideGrupo && coincideBusqueda;
  });

  // Grupos que el usuario tiene acceso (para el dropdown)
  const gruposAccesibles = GROUPS.filter(g =>
    modulosVisibles.some(m => m.grupoId === g.id)
  );

  const gruposConModulos = gruposAccesibles
    .map(g => ({
      ...g,
      modulos: modulosFiltrados.filter(m => m.grupoId === g.id),
    }))
    .filter(g => g.modulos.length > 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--content-text)' }}>
        Módulos
      </h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          className="form-input"
          style={{ maxWidth: '240px' }}
          placeholder="Buscar módulo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={filtroGrupo}
          onChange={e => setFiltroGrupo(e.target.value)}
        >
          <option value="">Todos los grupos</option>
          {gruposAccesibles.map(g => (
            <option key={g.id} value={g.id}>{g.id} — {g.name}</option>
          ))}
        </select>
        {(filtroGrupo || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFiltroGrupo(''); setSearch(''); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {gruposConModulos.length === 0 && (
        <p style={{ color: 'var(--content-text-muted)' }}>No se encontraron módulos.</p>
      )}

      {gruposConModulos.map(g => (
        <div key={g.id} style={{ marginBottom: '32px' }}>
          {/* Encabezado de grupo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: g.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', flexShrink: 0,
            }}>
              {g.id}
            </span>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--content-text)' }}>
              {g.name}
            </span>
            <span className="badge" style={{ background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
              {g.modulos.length}
            </span>
          </div>

          {/* Tarjetas de módulos */}
          <div className="modules-grid">
            {g.modulos.map(m => {
              const richData = moduloMap[m.id];
              return (
              <div key={m.id} className={`module-card group-${g.id.toLowerCase()}`}>
                {richData?.imagen && (
                  <img
                    src={richData.imagen}
                    alt=""
                    className="module-card-image"
                    loading="lazy"
                  />
                )}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--content-text-hint)', fontWeight: 500 }}>
                    {m.id}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--content-text)', lineHeight: 1.35 }}>
                  {m.name}
                </div>
                <div style={{
                  fontSize: '12px', color: 'var(--content-text-muted)',
                  marginBottom: '14px', lineHeight: 1.45,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {m.desc}
                </div>
                <button
                  onClick={() => abrirModal(m, g)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', fontWeight: 600,
                    color: g.color, background: g.color + '12',
                    border: 'none', borderRadius: '6px',
                    padding: '5px 11px', cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = g.color + '22'}
                  onMouseLeave={e => e.currentTarget.style.background = g.color + '12'}
                >
                  Abrir módulo →
                </button>
              </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Modal de detalle */}
      {selectedModulo && (
        <ModuloModal
          modulo={selectedModulo}
          onClose={() => setSelectedModulo(null)}
        />
      )}
    </div>
  );
}
