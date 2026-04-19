import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR  = '#1B6B4A';
const META   = modulos.find(m => m.id === 2);

// ── Catálogo de indicadores (cadena de valor DNP) ────────────────────
const CADENA = ['Insumo','Producto','Resultado','Impacto'];

const DEMO_INDICADORES = [
  { id:'i01', cadena:'Insumo',    nombre:'Recursos financieros ejecutados',       unidad:'%',       t0:12,    t1:45,    t2:78,    meta:90,   fuente:'SIIF Nación',        tiene_fuente:true },
  { id:'i02', cadena:'Insumo',    nombre:'Personal técnico vinculado',             unidad:'#',       t0:8,     t1:18,    t2:24,    meta:25,   fuente:'Nómina ETH',         tiene_fuente:true },
  { id:'i03', cadena:'Insumo',    nombre:'Municipios con presencia institucional', unidad:'#',       t0:5,     t1:12,    t2:18,    meta:20,   fuente:'Actas de visita',    tiene_fuente:true },
  { id:'i04', cadena:'Producto',  nombre:'Productores beneficiados',               unidad:'#',       t0:0,     t1:280,   t2:620,   meta:750,  fuente:'Listas asistencia',  tiene_fuente:true },
  { id:'i05', cadena:'Producto',  nombre:'Capacitaciones realizadas',              unidad:'#',       t0:2,     t1:15,    t2:32,    meta:40,   fuente:'Actas capacitación', tiene_fuente:true },
  { id:'i06', cadena:'Producto',  nombre:'Planes de negocio formulados',           unidad:'#',       t0:0,     t1:12,    t2:28,    meta:35,   fuente:'Planes aprobados',   tiene_fuente:true },
  { id:'i07', cadena:'Producto',  nombre:'Alianzas comerciales formalizadas',      unidad:'#',       t0:0,     t1:3,     t2:8,     meta:10,   fuente:'Contratos firmados', tiene_fuente:true },
  { id:'i08', cadena:'Producto',  nombre:'Toneladas de producción asistida',       unidad:'ton',     t0:0,     t1:480,   t2:1240,  meta:1500, fuente:'Reportes CAD',       tiene_fuente:true },
  { id:'i09', cadena:'Resultado', nombre:'Ingreso promedio del productor',         unidad:'M COP',   t0:1.2,   t1:1.8,   t2:2.4,   meta:2.8,  fuente:'Encuesta hogares',   tiene_fuente:true },
  { id:'i10', cadena:'Resultado', nombre:'Productores con acceso a crédito',       unidad:'%',       t0:8,     t1:18,    t2:31,    meta:45,   fuente:'',                   tiene_fuente:false },
  { id:'i11', cadena:'Resultado', nombre:'Productores con certificaciones ICA',    unidad:'%',       t0:0,     t1:5,     t2:14,    meta:25,   fuente:'Certificados ICA',   tiene_fuente:true },
  { id:'i12', cadena:'Resultado', nombre:'Exportaciones directas',                 unidad:'USD K',   t0:0,     t1:12,    t2:45,    meta:80,   fuente:'DIAN',               tiene_fuente:true },
  { id:'i13', cadena:'Resultado', nombre:'Empleos formales generados',             unidad:'#',       t0:0,     t1:145,   t2:380,   meta:500,  fuente:'',                   tiene_fuente:false },
  { id:'i14', cadena:'Resultado', nombre:'Mujeres beneficiadas',                   unidad:'%',       t0:28,    t1:35,    t2:42,    meta:40,   fuente:'Registro benefic.',  tiene_fuente:true },
  { id:'i15', cadena:'Resultado', nombre:'Jóvenes beneficiados (18–35 años)',      unidad:'%',       t0:15,    t1:22,    t2:31,    meta:35,   fuente:'',                   tiene_fuente:false },
  { id:'i16', cadena:'Impacto',   nombre:'Reducción informalidad laboral',         unidad:'pts',     t0:0,     t1:2.1,   t2:4.8,   meta:6,    fuente:'DANE',               tiene_fuente:true },
  { id:'i17', cadena:'Impacto',   nombre:'Diversificación productiva',             unidad:'%',       t0:15,    t1:22,    t2:35,    meta:45,   fuente:'Encuesta FWRTS',     tiene_fuente:true },
  { id:'i18', cadena:'Impacto',   nombre:'Hogares con seguridad alimentaria',      unidad:'%',       t0:45,    t1:52,    t2:61,    meta:70,   fuente:'FAO / ICBF',         tiene_fuente:true },
  { id:'i19', cadena:'Impacto',   nombre:'Reducción NBI municipal',                unidad:'pts',     t0:0,     t1:0.8,   t2:1.9,   meta:3,    fuente:'DANE',               tiene_fuente:true },
  { id:'i20', cadena:'Impacto',   nombre:'Índice de gobernanza territorial',       unidad:'0–100',   t0:32,    t1:41,    t2:54,    meta:65,   fuente:'ETH-ANH',            tiene_fuente:true },
];

// ── Helpers ───────────────────────────────────────────────────────────
function pctCumplimiento(ind) {
  if (!ind.meta || ind.meta === 0) return 0;
  return Math.min(Math.round((ind.t2 / ind.meta) * 100), 999);
}

function semaforo(ind) {
  const pct = pctCumplimiento(ind);
  if (pct >= 90) return { label:'Cumplido',    bg:'#dcfce7', color:'#15803d', shape:'circle' };
  if (pct >= 60) return { label:'En riesgo',   bg:'#fef9c3', color:'#854d0e', shape:'square' };
  return              { label:'Incumplido',  bg:'#fee2e2', color:'#dc2626', shape:'triangle' };
}

function Shape({ shape, color, size = 8 }) {
  if (shape === 'circle')   return <span style={{ width:size, height:size, borderRadius:'50%', background:color, flexShrink:0, display:'inline-block' }} />;
  if (shape === 'square')   return <span style={{ width:size, height:size, borderRadius:1, background:color, flexShrink:0, display:'inline-block' }} />;
  return <span style={{ width:0, height:0, flexShrink:0, borderLeft:`${size*.6}px solid transparent`, borderRight:`${size*.6}px solid transparent`, borderBottom:`${size}px solid ${color}`, display:'inline-block' }} />;
}

function SemaforoBadge({ ind }) {
  const s = semaforo(ind);
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:12, fontWeight:600, background:s.bg, color:s.color }}>
      <Shape shape={s.shape} color={s.color} />
      {s.label}
    </span>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────
const IconBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconGrid   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconEdit   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconChart  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconExport = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconWarn   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth: wide ? 640 : 480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1e293b' }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

const INPUT = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:14, fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background: ok ? '#dcfce7' : '#fee2e2', color: ok ? '#15803d' : '#dc2626', border:`1px solid ${ok ? '#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

// ─────────────────────────────────────────────────────────────────────
// TAB 1 — PANEL DE INDICADORES (semáforo)
// ─────────────────────────────────────────────────────────────────────
function TabPanel({ indicadores, setIndicadores }) {
  const [filtroCadena, setFiltroCadena] = useState('');
  const [filtroSemaf,  setFiltroSemaf]  = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [form, setForm] = useState({});

  function showToast(msg, ok=true) { setToast({ msg, ok }); setTimeout(()=>setToast({msg:'',ok:true}),3500); }

  const filtrados = indicadores
    .filter(i => !filtroCadena || i.cadena === filtroCadena)
    .filter(i => {
      if (!filtroSemaf) return true;
      return semaforo(i).label.toLowerCase().replace(' ','_') === filtroSemaf;
    });

  const conteo = { cumplido:0, en_riesgo:0, incumplido:0 };
  indicadores.forEach(i => {
    const s = semaforo(i);
    if (s.label === 'Cumplido') conteo.cumplido++;
    else if (s.label === 'En riesgo') conteo.en_riesgo++;
    else conteo.incumplido++;
  });

  function openEdit(ind) {
    setForm({ fuente: ind.fuente, meta: ind.meta, t0: ind.t0, t1: ind.t1, t2: ind.t2 });
    setModal(ind);
  }

  function handleSave() {
    setIndicadores(prev => prev.map(i => i.id === modal.id ? {
      ...i,
      fuente: form.fuente,
      tiene_fuente: Boolean(form.fuente?.trim()),
      meta: parseFloat(form.meta) || 0,
      t0: parseFloat(form.t0) || 0,
      t1: parseFloat(form.t1) || 0,
      t2: parseFloat(form.t2) || 0,
    } : i));
    showToast('Indicador actualizado (demo).');
    setModal(null);
  }

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />

      {/* Resumen semáforo */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        {[
          { key:'cumplido',    label:'Cumplidos',    bg:'#dcfce7', c:'#15803d', shape:'circle' },
          { key:'en_riesgo',   label:'En riesgo',    bg:'#fef9c3', c:'#854d0e', shape:'square' },
          { key:'incumplido',  label:'Incumplidos',  bg:'#fee2e2', c:'#dc2626', shape:'triangle' },
        ].map(s => (
          <button key={s.key} onClick={() => setFiltroSemaf(filtroSemaf === s.key ? '' : s.key)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:10, border:`2px solid ${filtroSemaf === s.key ? s.c : 'transparent'}`, background: s.bg, cursor:'pointer' }}>
            <Shape shape={s.shape} color={s.c} size={10} />
            <span style={{ fontSize:13, fontWeight:700, color:s.c }}>{conteo[s.key]}</span>
            <span style={{ fontSize:12, color:s.c }}>{s.label}</span>
          </button>
        ))}
        <select className="form-select" style={{ maxWidth:180, marginLeft:'auto' }} value={filtroCadena} onChange={e=>setFiltroCadena(e.target.value)}>
          <option value="">Toda la cadena DNP</option>
          {CADENA.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['#','Cadena DNP','Indicador','Unidad','Meta','t2 actual','% cumpl.','Semáforo','Fuente',''].map(h => <th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.map((ind, i) => {
              const pct = pctCumplimiento(ind);
              return (
                <tr key={ind.id} style={{ background: i%2===0?'#fff':'#f8fafc' }}>
                  <td style={{...TD, color:'#94a3b8', fontFamily:'var(--font-mono)'}}>{ind.id}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:600, background:'#f1f5f9', color:'#475569', padding:'1px 7px', borderRadius:999 }}>{ind.cadena}</span></td>
                  <td style={{ ...TD, fontWeight:500, color:'#1e293b', maxWidth:240 }}>
                    {ind.nombre}
                    {!ind.tiene_fuente && <span title="Sin fuente verificable" style={{ marginLeft:6, color:'#f59e0b' }}><IconWarn /></span>}
                  </td>
                  <td style={TD}>{ind.unidad}</td>
                  <td style={{ ...TD, fontWeight:600, color:'#1e293b' }}>{ind.meta}</td>
                  <td style={{ ...TD, fontWeight:700, color: COLOR }}>{ind.t2}</td>
                  <td style={TD}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ flex:1, height:6, background:'#f1f5f9', borderRadius:4, minWidth:60, overflow:'hidden' }}>
                        <div style={{ width:`${Math.min(pct,100)}%`, height:'100%', background: pct>=90?'#16a34a':pct>=60?'#ca8a04':'#dc2626', borderRadius:4, transition:'width .5s' }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#475569', minWidth:36, textAlign:'right' }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={TD}><SemaforoBadge ind={ind} /></td>
                  <td style={{ ...TD, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {ind.tiene_fuente ? ind.fuente : <span style={{ color:'#ef4444', fontSize:12 }}>⚠ Sin fuente</span>}
                  </td>
                  <td style={TD}>
                    <button onClick={()=>openEdit(ind)} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:4 }}><IconEdit /> Editar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={`Editar — ${modal.nombre}`} onClose={()=>setModal(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
            {['t0','t1','t2','meta'].map(k => (
              <div key={k} style={{ display:'flex', flexDirection:'column', gap:5 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#475569' }}>{k === 'meta' ? 'Meta' : `Valor ${k}`}</label>
                <input type="number" className="form-input" style={INPUT} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              </div>
            ))}
            <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569' }}>Fuente verificable <span style={{ color:'#dc2626' }}>*</span></label>
              <input className="form-input" style={INPUT} value={form.fuente} onChange={e=>setForm(f=>({...f,fuente:e.target.value}))} placeholder="Ej: SIIF Nación, actas de visita…" />
              {!form.fuente?.trim() && <span style={{ fontSize:11, color:'#f59e0b', display:'flex', alignItems:'center', gap:4 }}><IconWarn /> El indicador no podrá marcarse como verificado sin fuente.</span>}
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Guardar cambios</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB 2 — COMPARATIVO t0 / t1 / t2
// ─────────────────────────────────────────────────────────────────────
function TabComparativo({ indicadores }) {
  const [filtroCadena, setFiltroCadena] = useState('');
  const filtrados = indicadores.filter(i => !filtroCadena || i.cadena === filtroCadena);

  const fechas = { t0:'Ene 2024 (línea base)', t1:'Jun 2024 (corte medio)', t2:'Dic 2024 (cierre)' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:12 }}>
          {Object.entries(fechas).map(([k,v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background: k==='t0'?'#94a3b8':k==='t1'?'#f59e0b':COLOR, flexShrink:0 }} />
              <span style={{ fontSize:11, color:'#64748b' }}><strong>{k}</strong> — {v}</span>
            </div>
          ))}
        </div>
        <select className="form-select" style={{ maxWidth:180 }} value={filtroCadena} onChange={e=>setFiltroCadena(e.target.value)}>
          <option value="">Toda la cadena</option>
          {CADENA.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Indicador','Unidad','t0','t1','t2','Meta','Δ (t2−t0)','Δ relativo','% Meta'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.map((ind,i) => {
              const delta    = Math.round((ind.t2 - ind.t0) * 100) / 100;
              const deltaRel = ind.t0 ? Math.round(((ind.t2 - ind.t0) / Math.abs(ind.t0)) * 1000) / 10 : '—';
              const pct      = pctCumplimiento(ind);
              const pctColor = pct>=90?'#16a34a':pct>=60?'#ca8a04':'#dc2626';
              return (
                <tr key={ind.id} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
                  <td style={{ ...TD, fontWeight:500, color:'#1e293b', maxWidth:200 }}>{ind.nombre}</td>
                  <td style={TD}>{ind.unidad}</td>
                  <td style={{ ...TD, color:'#94a3b8', fontWeight:500 }}>{ind.t0}</td>
                  <td style={{ ...TD, color:'#ca8a04', fontWeight:500 }}>{ind.t1}</td>
                  <td style={{ ...TD, color:COLOR, fontWeight:700 }}>{ind.t2}</td>
                  <td style={{ ...TD, color:'#64748b' }}>{ind.meta}</td>
                  <td style={{ ...TD, fontWeight:700, color: delta >= 0 ? '#16a34a' : '#dc2626' }}>
                    {delta >= 0 ? '+' : ''}{delta}
                  </td>
                  <td style={{ ...TD, color: typeof deltaRel === 'number' ? (deltaRel>=0?'#16a34a':'#dc2626') : '#94a3b8', fontWeight:600 }}>
                    {typeof deltaRel === 'number' ? `${deltaRel>0?'+':''}${deltaRel}%` : '—'}
                  </td>
                  <td style={TD}>
                    <span style={{ fontWeight:700, color:pctColor }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB 3 — EVOLUCIÓN (mini sparklines)
// ─────────────────────────────────────────────────────────────────────
function Sparkline({ ind }) {
  const max  = Math.max(ind.t0, ind.t1, ind.t2, ind.meta);
  const pts  = [ind.t0, ind.t1, ind.t2];
  const w = 100, h = 36, pad = 4;
  const x = (i) => pad + (i / 2) * (w - pad * 2);
  const y = (v) => h - pad - ((v / max) * (h - pad * 2));
  const path = pts.map((v,i) => `${i===0?'M':'L'}${x(i)},${y(v)}`).join(' ');
  const metaY = y(ind.meta);
  return (
    <svg width={w} height={h} style={{ overflow:'visible' }}>
      <line x1={pad} y1={metaY} x2={w-pad} y2={metaY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
      <path d={path} fill="none" stroke={COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v,i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={i===2?COLOR:'#fff'} stroke={COLOR} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function TabEvolucion({ indicadores }) {
  const [filtroCadena, setFiltroCadena] = useState('');
  const filtrados = indicadores.filter(i => !filtroCadena || i.cadena === filtroCadena);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <select className="form-select" style={{ maxWidth:180 }} value={filtroCadena} onChange={e=>setFiltroCadena(e.target.value)}>
          <option value="">Toda la cadena</option>
          {CADENA.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14 }}>
        {filtrados.map(ind => {
          const pct = pctCumplimiento(ind);
          const s = semaforo(ind);
          return (
            <div key={ind.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:3 }}>{ind.cadena}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1e293b', lineHeight:1.3 }}>{ind.nombre}</div>
                </div>
                <SemaforoBadge ind={ind} />
              </div>
              <Sparkline ind={ind} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                <div style={{ display:'flex', gap:12 }}>
                  {[{k:'t0',c:'#94a3b8'},{k:'t1',c:'#f59e0b'},{k:'t2',c:COLOR}].map(({k,c})=>(
                    <span key={k} style={{ fontSize:11, color:c, fontWeight:600 }}>{k}: {ind[k]}</span>
                  ))}
                </div>
                <span style={{ fontSize:11, fontWeight:700, color: s.color }}>{pct}%</span>
              </div>
              {!ind.tiene_fuente && (
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:6, fontSize:11, color:'#f59e0b' }}>
                  <IconWarn /> Sin fuente verificable
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB 4 — EXPORTADOR
// ─────────────────────────────────────────────────────────────────────
function TabExportador({ indicadores }) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const sinFuente = indicadores.filter(i => !i.tiene_fuente);
  const resumen = CADENA.map(c => {
    const sub = indicadores.filter(i => i.cadena === c);
    return { cadena: c, total: sub.length, cumplidos: sub.filter(i => pctCumplimiento(i) >= 90).length };
  });

  function handleExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); setTimeout(()=>setDone(false), 4000); }, 2200);
  }

  return (
    <div>
      {done && <div style={{ padding:'12px 16px', borderRadius:8, background:'#dcfce7', color:'#15803d', border:'1px solid #86efac', marginBottom:16, fontSize:13 }}>✓ Informe de impacto generado (demo). En producción se generaría un PDF ANH.</div>}

      {sinFuente.length > 0 && (
        <div style={{ padding:'12px 16px', borderRadius:8, background:'#fef9c3', color:'#854d0e', border:'1px solid #fde68a', marginBottom:16, fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
          <IconWarn />
          <span><strong>{sinFuente.length} indicador{sinFuente.length>1?'es':''}</strong> sin fuente verificable — no se incluirán en el informe ANH: {sinFuente.map(i=>i.id).join(', ')}</span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:14, marginBottom:24 }}>
        {resumen.map(r => (
          <div key={r.cadena} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', margin:'0 0 10px' }}>{r.cadena}</p>
            <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
              <span style={{ fontSize:28, fontWeight:800, color:COLOR }}>{r.cumplidos}</span>
              <span style={{ fontSize:13, color:'#94a3b8' }}>/ {r.total} cumplidos</span>
            </div>
            <div style={{ height:5, background:'#f1f5f9', borderRadius:3, marginTop:8, overflow:'hidden' }}>
              <div style={{ width:`${r.total ? (r.cumplidos/r.total)*100 : 0}%`, height:'100%', background:COLOR, borderRadius:3 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:20 }}>
        <h3 style={{ margin:'0 0 8px', fontSize:15, fontWeight:700, color:'#1e293b' }}>Exportar informe ANH</h3>
        <p style={{ margin:'0 0 16px', fontSize:13, color:'#64748b', lineHeight:1.6 }}>
          Genera un PDF estructurado por componente de cadena de valor DNP con semáforos, tablas comparativas t0/t1/t2 y cálculo de brechas. Solo se incluyen indicadores con fuente verificable registrada.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:8 }}>
            <IconExport /> {exporting ? 'Generando PDF…' : 'Exportar informe de impacto PDF'}
          </button>
          <button className="btn btn-ghost" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <IconExport /> Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'panel',      label:'Semáforo de indicadores', icon:<IconGrid /> },
  { id:'comparativo',label:'Comparativo t0/t1/t2',    icon:<IconChart /> },
  { id:'evolucion',  label:'Evolución por indicador', icon:<IconChart /> },
  { id:'exportador', label:'Exportador ANH',          icon:<IconExport /> },
];

export default function EvaluacionImpactoPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('panel');
  const [indicadores, setIndicadores] = useState(DEMO_INDICADORES);

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}>
          <IconBack /> Módulos
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, flexShrink:0 }}>A</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#2 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Evaluación de Impacto y Líneas Base</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>DEMO</span>
      </div>

      {/* Banner informativo */}
      <ModuloInfoBanner meta={META} color={COLOR} />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e2e8f0', marginBottom:20, overflowX:'auto' }} role="tablist">
        {TABS.map(t=>(
          <button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:13, fontWeight:tab===t.id?700:500, color:tab===t.id?COLOR:'#64748b', borderBottom:tab===t.id?`2px solid ${COLOR}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap', transition:'color .15s' }}>
            <span style={{ opacity:tab===t.id?1:0.6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab==='panel'       && <TabPanel       indicadores={indicadores} setIndicadores={setIndicadores} />}
      {tab==='comparativo' && <TabComparativo indicadores={indicadores} />}
      {tab==='evolucion'   && <TabEvolucion   indicadores={indicadores} />}
      {tab==='exportador'  && <TabExportador  indicadores={indicadores} />}
    </div>
  );
}
