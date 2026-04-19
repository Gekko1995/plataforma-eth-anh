import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { addLog } from '../../../utils/auth';

// ── Colores del módulo (Grupo A) ──────────────────────────────────────
const COLOR   = '#1B6B4A';
const COLOR_L = '#1B6B4A22';
const COLOR_B = '#1B6B4A44';

// ── Niveles de conflictividad ─────────────────────────────────────────
const NIVELES = {
  bajo:    { label: 'Bajo',    bg: '#dcfce7', color: '#15803d', shape: 'circle' },
  medio:   { label: 'Medio',   bg: '#fef9c3', color: '#854d0e', shape: 'square' },
  alto:    { label: 'Alto',    bg: '#ffedd5', color: '#c2410c', shape: 'triangle' },
  critico: { label: 'Crítico', bg: '#fee2e2', color: '#dc2626', shape: 'triangle' },
};

const TIPOS_ACTOR = ['institucional','comunitario','privado','internacional','otro'];
const CATS_CONFLICTO = ['Ambiental','Social','Económico','Político','Territorial','Étnico','Otro'];

// ── Icono de nivel (color + forma, sin depender solo del color) ───────
function NivelBadge({ nivel }) {
  if (!nivel) return <span style={{ color: '#94a3b8' }}>—</span>;
  const n = NIVELES[nivel] || { label: nivel, bg: '#f1f5f9', color: '#475569', shape: 'circle' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '2px 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: 600,
      background: n.bg, color: n.color,
    }}>
      <NivelShape shape={n.shape} color={n.color} />
      {n.label}
    </span>
  );
}

function NivelShape({ shape, color }) {
  if (shape === 'circle')   return <span style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />;
  if (shape === 'square')   return <span style={{ width:8, height:8, borderRadius:1, background:color, flexShrink:0 }} />;
  return (
    <span style={{
      width:0, height:0, flexShrink:0,
      borderLeft:'5px solid transparent', borderRight:'5px solid transparent',
      borderBottom:`8px solid ${color}`,
      display:'inline-block',
    }} />
  );
}

// ── Estrellas de influencia ───────────────────────────────────────────
function InfluenciaStars({ value }) {
  return (
    <span style={{ display:'inline-flex', gap:'1px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:'13px', color: i <= value ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

// ── Modal genérico ────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '14px',
        width: '100%', maxWidth: wide ? '640px' : '480px',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,.22)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display:'flex', padding:'4px' }}
          >
            <IconX />
          </button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── Campo de formulario ───────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────
function Toast({ msg, ok }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 1200,
      padding: '12px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
      background: ok ? '#dcfce7' : '#fee2e2',
      color: ok ? '#15803d' : '#dc2626',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      boxShadow: '0 4px 16px rgba(0,0,0,.12)',
      animation: 'fadeInUp .2s ease',
    }}>
      {ok ? '✓ ' : '✗ '}{msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────────

// ── TAB 1: Resumen ────────────────────────────────────────────────────
function TabResumen({ fichas, actores, conflictos, loading }) {
  const nivelCounts = ['bajo','medio','alto','critico'].map(n => ({
    nivel: n,
    count: fichas.filter(f => f.nivel_conflictividad === n).length,
  }));

  const tiposCount = TIPOS_ACTOR.map(t => ({
    tipo: t,
    count: actores.filter(a => a.tipo === t).length,
  })).filter(t => t.count > 0);

  const kpis = [
    { label: 'Fichas territoriales', value: fichas.length, color: COLOR, bg: '#f0fdf6' },
    { label: 'Actores mapeados',      value: actores.length, color: '#0369A1', bg: '#f0f9ff' },
    { label: 'Variables de conflicto', value: conflictos.length, color: '#c2410c', bg: '#fff7ed' },
    { label: 'Municipios cubiertos',  value: new Set(fichas.map(f => f.municipio)).size, color: '#7C3AED', bg: '#faf5ff' },
  ];

  if (loading) return (
    <div className="kpi-grid" style={{ marginBottom: '24px' }}>
      {kpis.map((_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ height: '12px', width: '60%' }} className="skeleton" />
          <div style={{ height: '32px', width: '40%', marginTop: '8px' }} className="skeleton" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTop: `3px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
              <span className="kpi-label">{k.label}</span>
              <div style={{ width:30, height:30, borderRadius:7, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'14px', fontWeight:700, color:k.color }}>#</span>
              </div>
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Distribución niveles */}
      {fichas.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' }}>
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 14px' }}>
              Niveles de conflictividad
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {nivelCounts.map(({ nivel, count }) => {
                const n = NIVELES[nivel];
                const pct = fichas.length ? (count / fichas.length) * 100 : 0;
                return (
                  <div key={nivel}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                      <NivelBadge nivel={nivel} />
                      <span style={{ fontSize:'12px', color:'#64748b' }}>{count}</span>
                    </div>
                    <div style={{ height:6, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:n.color, borderRadius:4, transition:'width .5s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 14px' }}>
              Tipos de actores
            </p>
            {tiposCount.length === 0 ? (
              <p style={{ fontSize:'13px', color:'#94a3b8' }}>Sin actores registrados</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {tiposCount.map(({ tipo, count }) => (
                  <div key={tipo} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'13px', color:'#475569', textTransform:'capitalize' }}>{tipo}</span>
                    <span style={{ fontSize:'12px', fontWeight:600, background:COLOR_L, color:COLOR, padding:'1px 8px', borderRadius:999 }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {fichas.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 24px', color:'#94a3b8' }}>
          <IconMap />
          <p style={{ fontSize:'14px', fontWeight:600, marginTop:'12px', color:'#64748b' }}>Sin fichas territoriales aún</p>
          <p style={{ fontSize:'13px' }}>Crea la primera ficha en la pestaña "Fichas Territoriales".</p>
        </div>
      )}
    </div>
  );
}

// ── TAB 2: Fichas Territoriales ───────────────────────────────────────
function TabFichas({ fichas, loading, onRefresh, user }) {
  const [modal, setModal] = useState(null); // null | 'new' | fichaObj
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ msg: '', ok: true });

  const EMPTY_FORM = {
    municipio: '', departamento: '', region: '',
    poblacion_total: '', actividad_economica: '',
    presencia_institucional: '',
    nivel_conflictividad: '', observaciones: '',
  };
  const [form, setForm] = useState(EMPTY_FORM);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 4000);
  }

  function openNew() {
    setForm(EMPTY_FORM);
    setModal('new');
  }

  function openEdit(ficha) {
    setForm({
      municipio: ficha.municipio || '',
      departamento: ficha.departamento || '',
      region: ficha.region || '',
      poblacion_total: ficha.poblacion_total ?? '',
      actividad_economica: ficha.actividad_economica || '',
      presencia_institucional: (ficha.presencia_institucional || []).join(', '),
      nivel_conflictividad: ficha.nivel_conflictividad || '',
      observaciones: ficha.observaciones || '',
    });
    setModal(ficha);
  }

  async function handleSave() {
    if (!form.municipio.trim() || !form.departamento.trim()) {
      showToast('Municipio y Departamento son requeridos.', false); return;
    }
    if (!supabase) { showToast('Sin conexión a base de datos.', false); return; }
    setSaving(true);

    const payload = {
      municipio: form.municipio.trim(),
      departamento: form.departamento.trim(),
      region: form.region.trim() || null,
      poblacion_total: form.poblacion_total ? parseInt(form.poblacion_total, 10) : null,
      actividad_economica: form.actividad_economica.trim() || null,
      presencia_institucional: form.presencia_institucional
        ? form.presencia_institucional.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      nivel_conflictividad: form.nivel_conflictividad || null,
      observaciones: form.observaciones.trim() || null,
    };

    let error;
    if (modal === 'new') {
      ({ error } = await supabase.from('diagnostico_fichas').insert({ ...payload, created_by: user?.id }));
    } else {
      ({ error } = await supabase.from('diagnostico_fichas').update(payload).eq('id', modal.id));
    }

    setSaving(false);
    if (error) { showToast('Error: ' + error.message, false); return; }
    showToast(modal === 'new' ? 'Ficha creada.' : 'Ficha actualizada.');
    addLog(user, 'ACCION_MODULO', `Módulo 1 — ${modal === 'new' ? 'Nueva ficha' : 'Editar ficha'}: ${form.municipio}`);
    setModal(null);
    onRefresh();
  }

  async function handleDelete(ficha) {
    if (!window.confirm(`¿Eliminar la ficha de ${ficha.municipio}? Se eliminarán también sus actores y variables de conflictividad.`)) return;
    setDeleting(ficha.id);
    const { error } = await supabase.from('diagnostico_fichas').delete().eq('id', ficha.id);
    setDeleting(null);
    if (error) { showToast('Error al eliminar: ' + error.message, false); return; }
    showToast('Ficha eliminada.');
    onRefresh();
  }

  const inputStyle = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:'14px', fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };
  const selectStyle = { ...inputStyle, background:'#fff', cursor:'pointer' };

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <p style={{ fontSize:'13px', color:'var(--content-text-muted)', margin:0 }}>
          {fichas.length} ficha{fichas.length !== 1 ? 's' : ''} registrada{fichas.length !== 1 ? 's' : ''}
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={openNew}
          style={{ background: COLOR, borderColor: COLOR, display:'flex', alignItems:'center', gap:'6px' }}
        >
          <IconPlus /> Nueva ficha
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {[1,2,3].map(i => <div key={i} style={{ height:'56px', borderRadius:8 }} className="skeleton" />)}
        </div>
      ) : fichas.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#94a3b8' }}>
          <IconMap />
          <p style={{ fontSize:'14px', fontWeight:600, color:'#64748b', marginTop:'10px' }}>Sin fichas aún</p>
          <p style={{ fontSize:'13px' }}>Agrega la primera ficha territorial para comenzar el diagnóstico.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Municipio','Departamento','Región','Población','Nivel de conflicto','Acciones'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:'12px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fichas.map((f, i) => (
                <tr key={f.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding:'10px 12px', fontWeight:600, fontSize:'14px', color:'#1e293b' }}>{f.municipio}</td>
                  <td style={{ padding:'10px 12px', fontSize:'13px', color:'#475569' }}>{f.departamento}</td>
                  <td style={{ padding:'10px 12px', fontSize:'13px', color:'#475569' }}>{f.region || '—'}</td>
                  <td style={{ padding:'10px 12px', fontSize:'13px', color:'#475569' }}>{f.poblacion_total?.toLocaleString('es-CO') || '—'}</td>
                  <td style={{ padding:'10px 12px' }}><NivelBadge nivel={f.nivel_conflictividad} /></td>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button
                        onClick={() => openEdit(f)}
                        className="btn btn-ghost btn-sm"
                        style={{ display:'flex', alignItems:'center', gap:'4px' }}
                        title="Editar ficha"
                      >
                        <IconEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        disabled={deleting === f.id}
                        className="btn btn-danger btn-sm"
                        style={{ display:'flex', alignItems:'center', gap:'4px' }}
                        title="Eliminar ficha"
                      >
                        <IconTrash /> {deleting === f.id ? '…' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Nueva ficha territorial' : `Editar — ${modal.municipio}`} onClose={() => setModal(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <Field label="Municipio" required>
              <input className="form-input" style={inputStyle} value={form.municipio} onChange={e => setForm(f => ({...f, municipio:e.target.value}))} placeholder="Ej: Aguazul" />
            </Field>
            <Field label="Departamento" required>
              <input className="form-input" style={inputStyle} value={form.departamento} onChange={e => setForm(f => ({...f, departamento:e.target.value}))} placeholder="Ej: Casanare" />
            </Field>
            <Field label="Región">
              <input className="form-input" style={inputStyle} value={form.region} onChange={e => setForm(f => ({...f, region:e.target.value}))} placeholder="Ej: Orinoquía" />
            </Field>
            <Field label="Población total">
              <input type="number" className="form-input" style={inputStyle} value={form.poblacion_total} onChange={e => setForm(f => ({...f, poblacion_total:e.target.value}))} placeholder="0" min="0" />
            </Field>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Actividad económica principal">
                <input className="form-input" style={inputStyle} value={form.actividad_economica} onChange={e => setForm(f => ({...f, actividad_economica:e.target.value}))} placeholder="Ej: Agricultura, ganadería, petróleo" />
              </Field>
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Presencia institucional (separada por comas)">
                <input className="form-input" style={inputStyle} value={form.presencia_institucional} onChange={e => setForm(f => ({...f, presencia_institucional:e.target.value}))} placeholder="Ej: Alcaldía, Gobernación, ANLA" />
              </Field>
            </div>
            <Field label="Nivel de conflictividad">
              <select className="form-select" style={selectStyle} value={form.nivel_conflictividad} onChange={e => setForm(f => ({...f, nivel_conflictividad:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {Object.entries(NIVELES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Observaciones">
                <textarea className="form-input" style={{ ...inputStyle, resize:'vertical', minHeight:'72px' }} value={form.observaciones} onChange={e => setForm(f => ({...f, observaciones:e.target.value}))} placeholder="Contexto relevante del territorio…" />
              </Field>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ background: COLOR, borderColor: COLOR }}
            >
              {saving ? 'Guardando…' : modal === 'new' ? 'Crear ficha' : 'Guardar cambios'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── TAB 3: Mapa de Actores ────────────────────────────────────────────
function TabActores({ actores, fichas, loading, onRefresh, user }) {
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroFicha, setFiltroFicha] = useState('');

  const EMPTY = { ficha_id:'', nombre:'', tipo:'', nivel_influencia:'3', municipio:'', contacto:'', notas:'' };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 4000);
  }

  async function handleSave() {
    if (!form.nombre.trim()) { showToast('El nombre es requerido.', false); return; }
    if (!supabase) { showToast('Sin conexión.', false); return; }
    setSaving(true);
    const payload = {
      ficha_id: form.ficha_id || null,
      nombre: form.nombre.trim(),
      tipo: form.tipo || null,
      nivel_influencia: parseInt(form.nivel_influencia, 10),
      municipio: form.municipio.trim() || null,
      contacto: form.contacto.trim() || null,
      notas: form.notas.trim() || null,
    };
    const { error } = await supabase.from('diagnostico_actores').insert(payload);
    setSaving(false);
    if (error) { showToast('Error: ' + error.message, false); return; }
    showToast('Actor registrado.');
    addLog(user, 'ACCION_MODULO', `Módulo 1 — Nuevo actor: ${form.nombre}`);
    setModal(false);
    setForm(EMPTY);
    onRefresh();
  }

  async function handleDelete(actor) {
    if (!window.confirm(`¿Eliminar al actor "${actor.nombre}"?`)) return;
    setDeleting(actor.id);
    const { error } = await supabase.from('diagnostico_actores').delete().eq('id', actor.id);
    setDeleting(null);
    if (error) { showToast('Error: ' + error.message, false); return; }
    showToast('Actor eliminado.');
    onRefresh();
  }

  const actoresFiltrados = filtroFicha ? actores.filter(a => a.ficha_id === filtroFicha) : actores;
  const inputStyle = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:'14px', fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', flexWrap:'wrap', gap:'10px' }}>
        <select
          className="form-select"
          style={{ maxWidth:'240px' }}
          value={filtroFicha}
          onChange={e => setFiltroFicha(e.target.value)}
        >
          <option value="">Todos los municipios</option>
          {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setForm(EMPTY); setModal(true); }}
          style={{ background: COLOR, borderColor: COLOR, display:'flex', alignItems:'center', gap:'6px' }}
        >
          <IconPlus /> Registrar actor
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {[1,2,3].map(i => <div key={i} style={{ height:'56px', borderRadius:8 }} className="skeleton" />)}
        </div>
      ) : actoresFiltrados.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#94a3b8' }}>
          <IconUsers />
          <p style={{ fontSize:'14px', fontWeight:600, color:'#64748b', marginTop:'10px' }}>Sin actores registrados</p>
          <p style={{ fontSize:'13px' }}>Mapea los actores clave del territorio para el análisis estratégico.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Actor','Tipo','Municipio','Influencia','Contacto',''].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:'12px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actoresFiltrados.map((a, i) => {
                const ficha = fichas.find(f => f.id === a.ficha_id);
                return (
                  <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding:'10px 12px' }}>
                      <div style={{ fontWeight:600, fontSize:'14px', color:'#1e293b' }}>{a.nombre}</div>
                      {ficha && <div style={{ fontSize:'12px', color:'#64748b' }}>{ficha.municipio}</div>}
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:'12px', fontWeight:500, background:COLOR_L, color:COLOR, padding:'2px 8px', borderRadius:999, textTransform:'capitalize' }}>
                        {a.tipo || '—'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color:'#475569' }}>{a.municipio || '—'}</td>
                    <td style={{ padding:'10px 12px' }}><InfluenciaStars value={a.nivel_influencia} /></td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color:'#475569' }}>{a.contacto || '—'}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <button
                        onClick={() => handleDelete(a)}
                        disabled={deleting === a.id}
                        className="btn btn-danger btn-sm"
                        style={{ display:'flex', alignItems:'center', gap:'4px' }}
                      >
                        <IconTrash /> {deleting === a.id ? '…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title="Registrar actor" onClose={() => setModal(false)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Nombre del actor" required>
                <input className="form-input" style={inputStyle} value={form.nombre} onChange={e => setForm(f => ({...f, nombre:e.target.value}))} placeholder="Nombre o entidad" />
              </Field>
            </div>
            <Field label="Tipo">
              <select className="form-select" style={{ ...inputStyle, background:'#fff' }} value={form.tipo} onChange={e => setForm(f => ({...f, tipo:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {TIPOS_ACTOR.map(t => <option key={t} value={t} style={{ textTransform:'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Ficha territorial">
              <select className="form-select" style={{ ...inputStyle, background:'#fff' }} value={form.ficha_id} onChange={e => setForm(f => ({...f, ficha_id:e.target.value}))}>
                <option value="">— Sin ficha asociada —</option>
                {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio} — {f.departamento}</option>)}
              </select>
            </Field>
            <Field label="Municipio">
              <input className="form-input" style={inputStyle} value={form.municipio} onChange={e => setForm(f => ({...f, municipio:e.target.value}))} placeholder="Municipio del actor" />
            </Field>
            <Field label="Nivel de influencia (1–5)">
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <input type="range" min="1" max="5" value={form.nivel_influencia} onChange={e => setForm(f => ({...f, nivel_influencia:e.target.value}))} style={{ flex:1 }} />
                <InfluenciaStars value={parseInt(form.nivel_influencia, 10)} />
              </div>
            </Field>
            <Field label="Contacto">
              <input className="form-input" style={inputStyle} value={form.contacto} onChange={e => setForm(f => ({...f, contacto:e.target.value}))} placeholder="Email o teléfono" />
            </Field>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Notas">
                <textarea className="form-input" style={{ ...inputStyle, resize:'vertical', minHeight:'64px' }} value={form.notas} onChange={e => setForm(f => ({...f, notas:e.target.value}))} placeholder="Rol, intereses, posición frente al proyecto…" />
              </Field>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ background:COLOR, borderColor:COLOR }}
            >
              {saving ? 'Guardando…' : 'Registrar actor'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── TAB 4: Conflictividad ─────────────────────────────────────────────
function TabConflictividad({ conflictos, fichas, loading, onRefresh, user }) {
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroFicha, setFiltroFicha] = useState('');
  const [filtroCat, setFiltroCat] = useState('');

  const EMPTY = { ficha_id:'', categoria:'', variable:'', nivel:'', descripcion:'' };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 4000);
  }

  async function handleSave() {
    if (!form.categoria || !form.variable.trim()) {
      showToast('Categoría y variable son requeridas.', false); return;
    }
    if (!supabase) { showToast('Sin conexión.', false); return; }
    setSaving(true);
    const { error } = await supabase.from('diagnostico_conflictividad').insert({
      ficha_id: form.ficha_id || null,
      categoria: form.categoria,
      variable: form.variable.trim(),
      nivel: form.nivel || null,
      descripcion: form.descripcion.trim() || null,
    });
    setSaving(false);
    if (error) { showToast('Error: ' + error.message, false); return; }
    showToast('Variable registrada.');
    addLog(user, 'ACCION_MODULO', `Módulo 1 — Nueva variable conflicto: ${form.variable}`);
    setModal(false);
    setForm(EMPTY);
    onRefresh();
  }

  async function handleDelete(c) {
    if (!window.confirm(`¿Eliminar la variable "${c.variable}"?`)) return;
    setDeleting(c.id);
    const { error } = await supabase.from('diagnostico_conflictividad').delete().eq('id', c.id);
    setDeleting(null);
    if (error) { showToast('Error: ' + error.message, false); return; }
    showToast('Variable eliminada.');
    onRefresh();
  }

  const filtrados = conflictos
    .filter(c => !filtroFicha || c.ficha_id === filtroFicha)
    .filter(c => !filtroCat || c.categoria === filtroCat);

  const inputStyle = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:'14px', fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', flexWrap:'wrap', gap:'10px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <select className="form-select" style={{ maxWidth:'220px' }} value={filtroFicha} onChange={e => setFiltroFicha(e.target.value)}>
            <option value="">Todos los municipios</option>
            {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth:'160px' }} value={filtroCat} onChange={e => setFiltroCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATS_CONFLICTO.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setForm(EMPTY); setModal(true); }}
          style={{ background: COLOR, borderColor: COLOR, display:'flex', alignItems:'center', gap:'6px' }}
        >
          <IconPlus /> Nueva variable
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {[1,2,3].map(i => <div key={i} style={{ height:'56px', borderRadius:8 }} className="skeleton" />)}
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#94a3b8' }}>
          <IconAlert />
          <p style={{ fontSize:'14px', fontWeight:600, color:'#64748b', marginTop:'10px' }}>Sin variables de conflictividad</p>
          <p style={{ fontSize:'13px' }}>Registra las variables críticas para el análisis de riesgos territoriales.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Categoría','Variable','Municipio','Nivel','Descripción',''].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:'12px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => {
                const ficha = fichas.find(f => f.id === c.ficha_id);
                return (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:'12px', fontWeight:600, background:'#f1f5f9', color:'#475569', padding:'2px 8px', borderRadius:999 }}>
                        {c.categoria}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px', fontWeight:500, fontSize:'14px', color:'#1e293b' }}>{c.variable}</td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color:'#64748b' }}>{ficha?.municipio || '—'}</td>
                    <td style={{ padding:'10px 12px' }}><NivelBadge nivel={c.nivel} /></td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color:'#64748b', maxWidth:'240px' }}>
                      <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {c.descripcion || '—'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deleting === c.id}
                        className="btn btn-danger btn-sm"
                        style={{ display:'flex', alignItems:'center', gap:'4px' }}
                      >
                        <IconTrash /> {deleting === c.id ? '…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title="Nueva variable de conflictividad" onClose={() => setModal(false)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <Field label="Categoría" required>
              <select className="form-select" style={{ ...inputStyle, background:'#fff' }} value={form.categoria} onChange={e => setForm(f => ({...f, categoria:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {CATS_CONFLICTO.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Ficha territorial">
              <select className="form-select" style={{ ...inputStyle, background:'#fff' }} value={form.ficha_id} onChange={e => setForm(f => ({...f, ficha_id:e.target.value}))}>
                <option value="">— Sin ficha —</option>
                {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Variable" required>
                <input className="form-input" style={inputStyle} value={form.variable} onChange={e => setForm(f => ({...f, variable:e.target.value}))} placeholder="Ej: Conflicto por uso del suelo" />
              </Field>
            </div>
            <Field label="Nivel de conflicto">
              <select className="form-select" style={{ ...inputStyle, background:'#fff' }} value={form.nivel} onChange={e => setForm(f => ({...f, nivel:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {Object.entries(NIVELES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Descripción">
                <textarea className="form-input" style={{ ...inputStyle, resize:'vertical', minHeight:'72px' }} value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion:e.target.value}))} placeholder="Describe la variable, sus causas y efectos…" />
              </Field>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ background:COLOR, borderColor:COLOR }}
            >
              {saving ? 'Guardando…' : 'Registrar variable'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'resumen',        label: 'Resumen',               icon: <IconGrid /> },
  { id: 'fichas',         label: 'Fichas Territoriales',  icon: <IconMap /> },
  { id: 'actores',        label: 'Mapa de Actores',       icon: <IconUsers /> },
  { id: 'conflictividad', label: 'Conflictividad',        icon: <IconAlert /> },
];

export default function LineaDiagnosticaPage() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('resumen');

  const [fichas,      setFichas]      = useState([]);
  const [actores,     setActores]     = useState([]);
  const [conflictos,  setConflictos]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const fetchAll = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const [resF, resA, resC] = await Promise.all([
      supabase.from('diagnostico_fichas').select('*').order('created_at', { ascending: false }),
      supabase.from('diagnostico_actores').select('*').order('created_at', { ascending: false }),
      supabase.from('diagnostico_conflictividad').select('*').order('created_at', { ascending: false }),
    ]);
    if (resF.error || resA.error || resC.error) {
      setError((resF.error || resA.error || resC.error).message);
    } else {
      setFichas(resF.data || []);
      setActores(resA.data || []);
      setConflictos(resC.data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    addLog(user, 'ACCION_MODULO', 'Módulo 1 — Línea Diagnóstica Territorial');
  }, [fetchAll, user]);

  return (
    <div>
      {/* Cabecera del módulo */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
        <button
          onClick={() => navigate('/modulos')}
          className="btn btn-ghost btn-sm"
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 10px' }}
        >
          <IconBack /> Módulos
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{
            width:32, height:32, borderRadius:8,
            background: COLOR + '18', color: COLOR,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'13px', flexShrink:0,
          }}>A</span>
          <div>
            <div style={{ fontSize:'11px', color:'var(--content-text-hint)', fontWeight:500 }}>#1 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:'18px', fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>
              Línea Diagnóstica Territorial
            </h1>
          </div>
        </div>
      </div>

      {/* Error global */}
      {error && !loading && (
        <div role="alert" style={{
          padding:'14px 16px', borderRadius:8, marginBottom:'16px',
          background:'#fee2e2', color:'#dc2626', border:'1px solid #fca5a5',
          display:'flex', alignItems:'center', gap:'10px', fontSize:'14px',
        }}>
          ⚠ Error al cargar datos: {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchAll} style={{ marginLeft:'auto' }}>↺ Reintentar</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display:'flex', gap:'4px', borderBottom:'2px solid #e2e8f0',
        marginBottom:'20px', overflowX:'auto',
      }} role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            style={{
              display:'inline-flex', alignItems:'center', gap:'7px',
              padding:'8px 14px', border:'none', background:'none',
              cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px',
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? COLOR : '#64748b',
              borderBottom: tab === t.id ? `2px solid ${COLOR}` : '2px solid transparent',
              marginBottom:'-2px', whiteSpace:'nowrap',
              transition:'color .15s',
            }}
          >
            <span style={{ opacity: tab === t.id ? 1 : 0.6 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      {tab === 'resumen' && (
        <TabResumen fichas={fichas} actores={actores} conflictos={conflictos} loading={loading} />
      )}
      {tab === 'fichas' && (
        <TabFichas fichas={fichas} loading={loading} onRefresh={fetchAll} user={user} />
      )}
      {tab === 'actores' && (
        <TabActores actores={actores} fichas={fichas} loading={loading} onRefresh={fetchAll} user={user} />
      )}
      {tab === 'conflictividad' && (
        <TabConflictividad conflictos={conflictos} fichas={fichas} loading={loading} onRefresh={fetchAll} user={user} />
      )}
    </div>
  );
}
