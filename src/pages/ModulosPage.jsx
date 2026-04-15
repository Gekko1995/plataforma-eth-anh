import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { STATUS_STYLES, GROUPS } from '../data/constants';

export default function ModulosPage() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading, error } = useModulosVisibles(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const filtroGrupo = searchParams.get('grupo') || '';
  const setFiltroGrupo = (val) => {
    if (val) setSearchParams({ grupo: val });
    else setSearchParams({});
  };

  if (loading) {
    return <p style={{ color: 'var(--text-secondary)' }}>Cargando módulos…</p>;
  }

  if (error) {
    return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  }

  const modulosFiltrados = modulosVisibles.filter(m => {
    const coincideGrupo = !filtroGrupo || m.grupoId === filtroGrupo;
    const coincideBusqueda = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return coincideGrupo && coincideBusqueda;
  });

  // Agrupar los módulos visibles por grupo para mostrar el encabezado de grupo
  const gruposConModulos = GROUPS
    .map(g => ({
      ...g,
      modulos: modulosFiltrados.filter(m => m.grupoId === g.id),
    }))
    .filter(g => g.modulos.length > 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
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
          {GROUPS.map(g => (
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
        <p style={{ color: 'var(--text-secondary)' }}>No se encontraron módulos.</p>
      )}

      {gruposConModulos.map(g => (
        <div key={g.id} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: g.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px', flexShrink: 0,
              }}
            >
              {g.id}
            </span>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
              {g.name}
            </span>
            <span className="badge" style={{ background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
              {g.modulos.length}
            </span>
          </div>

          <div className="modules-grid">
            {g.modulos.map(m => {
              const st = STATUS_STYLES[m.status] || {};
              return (
                <div key={m.id} className={`module-card group-${g.id.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      #{m.id}
                    </span>
                    <span
                      className="badge"
                      style={{ background: st.bg, color: st.c, fontSize: '11px' }}
                    >
                      {st.l}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
                    {m.desc}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {m.stack}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
