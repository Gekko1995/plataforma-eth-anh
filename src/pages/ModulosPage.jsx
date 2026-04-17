import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';
import { modulos as MODULOS_DATA } from '../data/modulos';
import ModuloModal from '../components/ModuloModal';
import { addLog } from '../utils/auth';

const moduloMap = Object.fromEntries(MODULOS_DATA.map(m => [m.id, m]));

/* ── Iconos SVG temáticos por grupo ─────────────────────────────────── */
const GROUP_ICONS = {
  A: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  B: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.92)" stroke="none"/>
    </svg>
  ),
  C: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  D: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  E: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  F: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <rect x="2" y="20" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)" stroke="none"/>
    </svg>
  ),
  G: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  H: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  I: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2.5"/>
      <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2.5"/>
      <line x1="10" y1="6" x2="18" y2="6"/>
      <line x1="10" y1="18" x2="18" y2="18"/>
    </svg>
  ),
};

function ModuleCardHeader({ grupoId, grupoColor }) {
  const Icon = GROUP_ICONS[grupoId] || (() => null);
  return (
    <div style={{
      width: 'calc(100% + 2.5rem)',
      margin: '-1.1rem -1.25rem 1rem',
      height: '100px',
      borderRadius: '14px 14px 0 0',
      background: `linear-gradient(150deg, ${grupoColor}e6 0%, ${grupoColor}99 55%, ${grupoColor}18 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Shine superior */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Marca de agua — letra del grupo */}
      <span style={{
        position: 'absolute',
        fontSize: '96px',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.08)',
        lineHeight: 1,
        userSelect: 'none',
        bottom: '-14px',
        right: '10px',
        fontFamily: 'var(--font)',
        letterSpacing: '-2px',
      }}>
        {grupoId}
      </span>
      {/* Ícono temático */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))',
      }}>
        <Icon />
      </div>
    </div>
  );
}

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

          {/* Tarjetas */}
          <div className="modules-grid">
            {g.modulos.map(m => (
              <div key={m.id} className={`module-card group-${g.id.toLowerCase()}`}>
                <ModuleCardHeader grupoId={g.id} grupoColor={g.color} />

                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--content-text-hint)', fontWeight: 500 }}>
                    #{m.id}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--content-text)', lineHeight: 1.35 }}>
                  {m.name}
                </div>
                <div style={{
                  fontSize: '12px', color: 'var(--content-text-muted)',
                  marginBottom: '14px', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  flex: 1,
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
                    marginTop: 'auto',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = g.color + '22'}
                  onMouseLeave={e => e.currentTarget.style.background = g.color + '12'}
                >
                  Abrir módulo →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedModulo && (
        <ModuloModal
          modulo={selectedModulo}
          onClose={() => setSelectedModulo(null)}
        />
      )}
    </div>
  );
}
