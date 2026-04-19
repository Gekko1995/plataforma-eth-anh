import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#1B6B4A';
const META  = modulos.find(m => m.id === 3);

// Bounding box Colombia (simplificado): lat 0–8, lng -78 a -67
const LAT_MIN = -0.5, LAT_MAX = 8.5, LNG_MIN = -78, LNG_MAX = -66.5;
function toXY(lat, lng) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = 100 - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: Math.max(2, Math.min(96, x)), y: Math.max(2, Math.min(96, y)) };
}

const TIPOS_PUNTO = ['Productivo','Institucional','Extractivo','Comercial','Comunitario'];
const CAPAS_DEMO = [
  { id:'pdet',      label:'PDET',            color:'#1B6B4A', activa:true,  descripcion:'Municipios PDET activos del área de intervención' },
  { id:'municipios',label:'Municipios',       color:'#0369A1', activa:true,  descripcion:'División político-administrativa municipal' },
  { id:'ben',       label:'Beneficiarios',   color:'#7C3AED', activa:true,  descripcion:'Densidad de beneficiarios directos por municipio' },
  { id:'ep',        label:'Zonas E&P',        color:'#B45309', activa:false, descripcion:'Bloques exploratorios y de producción ANH' },
  { id:'cars',      label:'CARs',             color:'#0891B2', activa:false, descripcion:'Jurisdicción de corporaciones autónomas regionales' },
  { id:'zomac',     label:'ZOMAC',            color:'#DC2626', activa:false, descripcion:'Zonas más afectadas por el conflicto armado' },
];

const DEMO_PUNTOS = [
  { id:'p01', municipio:'Aguazul',        depto:'Casanare',  lat:5.17,  lng:-72.55, tipo:'Productivo',    beneficiarios:145, en_pdet:true },
  { id:'p02', municipio:'Yopal',          depto:'Casanare',  lat:5.34,  lng:-72.40, tipo:'Institucional', beneficiarios:0,   en_pdet:false },
  { id:'p03', municipio:'Tauramena',      depto:'Casanare',  lat:4.98,  lng:-72.86, tipo:'Productivo',    beneficiarios:89,  en_pdet:true },
  { id:'p04', municipio:'Saravena',       depto:'Arauca',    lat:6.95,  lng:-71.87, tipo:'Productivo',    beneficiarios:234, en_pdet:true },
  { id:'p05', municipio:'Puerto Gaitán',  depto:'Meta',      lat:4.31,  lng:-72.08, tipo:'Extractivo',    beneficiarios:112, en_pdet:true },
  { id:'p06', municipio:'Villavicencio',  depto:'Meta',      lat:4.14,  lng:-73.63, tipo:'Institucional', beneficiarios:0,   en_pdet:false },
  { id:'p07', municipio:'Mocoa',          depto:'Putumayo',  lat:1.15,  lng:-76.65, tipo:'Productivo',    beneficiarios:156, en_pdet:true },
  { id:'p08', municipio:'Puerto Asís',    depto:'Putumayo',  lat:0.51,  lng:-76.50, tipo:'Productivo',    beneficiarios:98,  en_pdet:true },
  { id:'p09', municipio:'Florencia',      depto:'Caquetá',   lat:1.61,  lng:-75.61, tipo:'Institucional', beneficiarios:0,   en_pdet:false },
  { id:'p10', municipio:'Sn José Guaviare',depto:'Guaviare', lat:2.57,  lng:-72.64, tipo:'Productivo',    beneficiarios:67,  en_pdet:true },
  { id:'p11', municipio:'Arauca',         depto:'Arauca',    lat:7.08,  lng:-70.76, tipo:'Institucional', beneficiarios:0,   en_pdet:false },
  { id:'p12', municipio:'San Martín',     depto:'Meta',      lat:3.70,  lng:-73.70, tipo:'Productivo',    beneficiarios:78,  en_pdet:true },
  { id:'p13', municipio:'Paz de Ariporo', depto:'Casanare',  lat:5.89,  lng:-71.89, tipo:'Productivo',    beneficiarios:43,  en_pdet:false },
  { id:'p14', municipio:'La Dorada',      depto:'Caldas',    lat:5.45,  lng:-74.67, tipo:'Comercial',     beneficiarios:0,   en_pdet:false },
  { id:'p15', municipio:'Barrancabermeja',depto:'Santander', lat:7.07,  lng:-73.86, tipo:'Extractivo',    beneficiarios:0,   en_pdet:false },
];

// ── Icons ─────────────────────────────────────────────────────────────
const IconBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconMap    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const IconLayers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const IconTable  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>;
const IconAlert  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const TIPO_COLORS = { Productivo:'#16a34a', Institucional:'#0369A1', Extractivo:'#B45309', Comercial:'#7C3AED', Comunitario:'#0891B2' };

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function Modal({ title, onClose, children }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

// ── TAB 1: Mapa ───────────────────────────────────────────────────────
function TabMapa({ puntos, capas, setCapas }) {
  const [selected, setSelected] = useState(null);
  const [buscar, setBuscar] = useState('');

  const capasActivas = new Set(capas.filter(c=>c.activa).map(c=>c.id));
  const ptoFiltrado = buscar
    ? puntos.filter(p => p.municipio.toLowerCase().includes(buscar.toLowerCase()) || p.depto.toLowerCase().includes(buscar.toLowerCase()))
    : puntos;

  const puntosFiltrados = ptoFiltrado.filter(p => {
    if (capasActivas.has('pdet') && !p.en_pdet) return true; // shows all if pdet layer active
    return true;
  });

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:16, alignItems:'start' }}>
      {/* Mapa */}
      <div>
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          <input className="form-input" style={{ flex:1 }} placeholder="🔍 Buscar municipio o departamento…" value={buscar} onChange={e=>setBuscar(e.target.value)} />
        </div>
        <div style={{ position:'relative', background:'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)', borderRadius:12, border:'1px solid #bbf7d0', overflow:'hidden', height:460 }}>
          {/* Etiqueta de referencia */}
          <div style={{ position:'absolute', top:10, left:10, fontSize:11, color:'#2e7d32', fontWeight:600, background:'rgba(255,255,255,.7)', padding:'3px 8px', borderRadius:6, backdropFilter:'blur(4px)' }}>
            Visor Territorial — Colombia (demo)
          </div>

          {/* Puntos en el mapa */}
          {puntosFiltrados.map(p => {
            const { x, y } = toXY(p.lat, p.lng);
            const c = TIPO_COLORS[p.tipo] || '#666';
            return (
              <button
                key={p.id}
                onClick={()=>setSelected(selected?.id===p.id ? null : p)}
                title={`${p.municipio} — ${p.tipo}`}
                style={{
                  position:'absolute', left:`${x}%`, top:`${y}%`,
                  transform:'translate(-50%,-100%)',
                  background:'none', border:'none', cursor:'pointer', padding:0,
                  zIndex: selected?.id===p.id ? 10 : 2,
                }}
              >
                <svg width="22" height="28" viewBox="0 0 22 28">
                  <path d="M11 0C5 0 0 5 0 11c0 8 11 17 11 17S22 19 22 11C22 5 17 0 11 0z" fill={c} stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="11" cy="11" r="4" fill="#fff" opacity=".8"/>
                </svg>
              </button>
            );
          })}

          {/* Ficha del punto seleccionado */}
          {selected && (
            <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', background:'#fff', borderRadius:10, padding:'12px 16px', boxShadow:'0 4px 20px rgba(0,0,0,.18)', minWidth:240, maxWidth:280, zIndex:20, border:`2px solid ${TIPO_COLORS[selected.tipo]}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{selected.municipio}</div>
                  <div style={{ fontSize:12, color:'#64748b' }}>{selected.depto}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:2 }}><IconX /></button>
              </div>
              <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#64748b' }}>Tipo</span>
                  <span style={{ fontWeight:600, color: TIPO_COLORS[selected.tipo] }}>{selected.tipo}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#64748b' }}>Beneficiarios</span>
                  <span style={{ fontWeight:600, color:'#1e293b' }}>{selected.beneficiarios || '—'}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#64748b' }}>Zona PDET</span>
                  <span style={{ fontWeight:600, color: selected.en_pdet ? '#16a34a' : '#dc2626' }}>{selected.en_pdet ? 'Sí' : 'No'}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#64748b' }}>Coordenadas</span>
                  <span style={{ fontWeight:500, fontFamily:'monospace', color:'#475569' }}>{selected.lat}, {selected.lng}</span>
                </div>
              </div>
            </div>
          )}

          {/* Leyenda */}
          <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(255,255,255,.88)', borderRadius:8, padding:'8px 12px', backdropFilter:'blur(4px)', fontSize:11 }}>
            {Object.entries(TIPO_COLORS).map(([tipo, c]) => (
              <div key={tipo} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:c, flexShrink:0 }} />
                <span style={{ color:'#475569' }}>{tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de capas */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
        <p style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 12px' }}>Capas activas</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {capas.map(c => (
            <label key={c.id} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
              <input type="checkbox" checked={c.activa} onChange={()=>setCapas(prev=>prev.map(x=>x.id===c.id?{...x,activa:!x.activa}:x))} style={{ marginTop:2, accentColor:c.color }} />
              <div>
                <div style={{ fontSize:13, fontWeight:600, color: c.activa ? '#1e293b' : '#94a3b8', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:10, height:10, borderRadius:2, background:c.color, flexShrink:0, opacity:c.activa?1:.4 }} />
                  {c.label}
                </div>
                <div style={{ fontSize:11, color:'#94a3b8', lineHeight:1.4, marginTop:1 }}>{c.descripcion}</div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ borderTop:'1px solid #e2e8f0', marginTop:14, paddingTop:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 8px' }}>Resumen</p>
          <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:12, color:'#475569' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Total puntos</span><strong>{puntos.length}</strong>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>En zona PDET</span><strong style={{ color:COLOR }}>{puntos.filter(p=>p.en_pdet).length}</strong>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Fuera de PDET</span><strong style={{ color:'#dc2626' }}>{puntos.filter(p=>!p.en_pdet).length}</strong>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Total beneficiarios</span><strong>{puntos.reduce((a,p)=>a+p.beneficiarios,0).toLocaleString('es-CO')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: Puntos registrados ─────────────────────────────────────────
function TabPuntos({ puntos, setPuntos }) {
  const [modal, setModal]   = useState(false);
  const [toast, setToast]   = useState({ msg:'', ok:true });
  const EMPTY = { municipio:'', depto:'', lat:'', lng:'', tipo:'Productivo', beneficiarios:'', en_pdet:false };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg,ok=true){setToast({msg,ok});setTimeout(()=>setToast({msg:'',ok:true}),3500);}

  function handleSave() {
    if (!form.municipio || !form.lat || !form.lng) { showToast('Municipio y coordenadas son obligatorios.',false); return; }
    const lat = parseFloat(form.lat), lng = parseFloat(form.lng);
    if (lat < -5 || lat > 14 || lng < -82 || lng > -65) { showToast('⚠ Coordenadas fuera del territorio colombiano.',false); return; }
    setPuntos(prev=>[{ id:'p'+Date.now(), ...form, lat, lng, beneficiarios: parseInt(form.beneficiarios)||0 }, ...prev]);
    showToast('Punto registrado (demo).');
    setModal(false); setForm(EMPTY);
  }

  function handleDelete(p) {
    if (!window.confirm(`¿Eliminar el punto de ${p.municipio}?`)) return;
    setPuntos(prev=>prev.filter(x=>x.id!==p.id));
    showToast('Punto eliminado (demo).');
  }

  const INPUT = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:14, fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

  return (
    <div>
      {toast.msg && <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:toast.ok?'#dcfce7':'#fee2e2', color:toast.ok?'#15803d':'#dc2626', border:`1px solid ${toast.ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{toast.ok?'✓ ':'✗ '}{toast.msg}</div>}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button className="btn btn-primary btn-sm" onClick={()=>{setForm(EMPTY);setModal(true);}} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
          <IconPlus /> Registrar punto
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Municipio','Departamento','Tipo','Lat','Lng','Beneficiarios','PDET',''].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {puntos.map((p,i)=>(
              <tr key={p.id} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
                <td style={{ ...TD, fontWeight:600, color:'#1e293b' }}>{p.municipio}</td>
                <td style={TD}>{p.depto}</td>
                <td style={TD}><span style={{ fontSize:12, fontWeight:600, background:TIPO_COLORS[p.tipo]+'18', color:TIPO_COLORS[p.tipo], padding:'2px 8px', borderRadius:999 }}>{p.tipo}</span></td>
                <td style={{ ...TD, fontFamily:'monospace' }}>{p.lat}</td>
                <td style={{ ...TD, fontFamily:'monospace' }}>{p.lng}</td>
                <td style={TD}>{p.beneficiarios || '—'}</td>
                <td style={TD}><span style={{ fontSize:12, fontWeight:600, color:p.en_pdet?'#16a34a':'#dc2626' }}>{p.en_pdet?'Sí':'No'}</span></td>
                <td style={TD}>
                  <button onClick={()=>handleDelete(p)} className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar punto territorial" onClose={()=>setModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['municipio','Municipio *','text','Ej: Aguazul'],['depto','Departamento','text','Ej: Casanare'],['lat','Latitud *','number','5.17'],['lng','Longitud *','number','-72.55'],['beneficiarios','Beneficiarios directos','number','0']].map(([k,l,t,ph])=>(
              <div key={k}>
                <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>{l}</label>
                <input type={t} className="form-input" style={INPUT} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Tipo de punto</label>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}>
                {TIPOS_PUNTO.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
              <input type="checkbox" checked={form.en_pdet} onChange={e=>setForm(f=>({...f,en_pdet:e.target.checked}))} style={{ accentColor:COLOR }} />
              Punto dentro de zona PDET
            </label>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Registrar punto</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── TAB 3: Alertas ────────────────────────────────────────────────────
function TabAlertas({ puntos }) {
  const fueraPDET = puntos.filter(p => !p.en_pdet && (p.tipo === 'Productivo' || p.beneficiarios > 0));
  const sinBen    = puntos.filter(p => p.tipo === 'Productivo' && p.beneficiarios === 0);

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          { label:'Puntos fuera de PDET', count:fueraPDET.length, color:'#dc2626', bg:'#fee2e2', desc:'Puntos productivos o con beneficiarios fuera de zona PDET activa' },
          { label:'Sin beneficiarios',    count:sinBen.length,    color:'#f59e0b', bg:'#fef9c3', desc:'Puntos productivos sin beneficiarios directos registrados' },
          { label:'Dentro de PDET',       count:puntos.filter(p=>p.en_pdet).length, color:COLOR, bg:'#f0fdf6', desc:'Puntos correctamente ubicados en zonas PDET activas' },
        ].map(a=>(
          <div key={a.label} style={{ flex:'1 1 180px', background:a.bg, borderRadius:10, padding:'14px 16px', border:`1px solid ${a.color}33` }}>
            <div style={{ fontSize:24, fontWeight:800, color:a.color }}>{a.count}</div>
            <div style={{ fontSize:13, fontWeight:600, color:a.color, marginBottom:4 }}>{a.label}</div>
            <div style={{ fontSize:11, color:a.color, opacity:.8 }}>{a.desc}</div>
          </div>
        ))}
      </div>

      {fueraPDET.length > 0 && (
        <>
          <p style={{ fontSize:12, fontWeight:700, color:'#dc2626', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8 }}>⚠ Puntos fuera de zona PDET</p>
          <div className="table-wrapper" style={{ marginBottom:20 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Municipio','Departamento','Tipo','Beneficiarios','Acción recomendada'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {fueraPDET.map((p,i)=>(
                  <tr key={p.id} style={{ background:i%2===0?'#fff':'#fff5f5' }}>
                    <td style={{ ...TD, fontWeight:600, color:'#1e293b' }}>{p.municipio}</td>
                    <td style={TD}>{p.depto}</td>
                    <td style={TD}>{p.tipo}</td>
                    <td style={TD}>{p.beneficiarios || '—'}</td>
                    <td style={{ ...TD, color:'#dc2626', fontSize:12 }}>Verificar elegibilidad territorial con ANH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'mapa',   label:'Mapa territorial',   icon:<IconMap /> },
  { id:'puntos', label:'Puntos registrados', icon:<IconTable /> },
  { id:'alertas',label:'Alertas',            icon:<IconAlert /> },
  { id:'capas',  label:'Gestión de capas',   icon:<IconLayers /> },
];

export default function GeoreferenciaPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab,    setTab]    = useState('mapa');
  const [puntos, setPuntos] = useState(DEMO_PUNTOS);
  const [capas,  setCapas]  = useState(CAPAS_DEMO);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}><IconBack /> Módulos</button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>A</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#3 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Georeferenciación y Visor Territorial</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>DEMO</span>
      </div>

      <ModuloInfoBanner meta={META} color={COLOR} />
    </div>
  );
}
