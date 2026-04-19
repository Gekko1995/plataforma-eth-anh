import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 15);

const TIPOS = ['Operadora','Comunidad','Autoridad','Gremio','Entidad pública','ONG'];
const TIPO_COLOR = { 'Operadora':'#7c3aed','Comunidad':'#10b981','Autoridad':'#1d4ed8','Gremio':'#b45309','Entidad pública':COLOR,'ONG':'#db2777' };

const ACTORES = [
  { id:'ac01', nombre:'Ecopetrol S.A.',                   tipo:'Operadora',       municipio:'Yopal',       estado:'verde',   prioridad:true,  contacto:'Ing. Pedro Sánchez',  interacciones:12, ultima:'2024-12-01' },
  { id:'ac02', nombre:'Resguardo El Vigía',               tipo:'Comunidad',        municipio:'Arauca',      estado:'amarillo',prioridad:true,  contacto:'Cacique Luis Toro',   interacciones:8,  ultima:'2024-11-15' },
  { id:'ac03', nombre:'Corporinoquia',                    tipo:'Autoridad',        municipio:'Yopal',       estado:'verde',   prioridad:false, contacto:'Dir. Elena Vargas',   interacciones:6,  ultima:'2024-11-28' },
  { id:'ac04', nombre:'SAC — Sociedad de Agricultores',   tipo:'Gremio',           municipio:'Bogotá',      estado:'verde',   prioridad:false, contacto:'Dr. Marco Ruiz',      interacciones:4,  ultima:'2024-10-30' },
  { id:'ac05', nombre:'Alcaldía de Florencia',            tipo:'Entidad pública',  municipio:'Florencia',   estado:'rojo',    prioridad:true,  contacto:'Secretario Dpto.',    interacciones:3,  ultima:'2024-09-15' },
  { id:'ac06', nombre:'ACNUR Colombia',                   tipo:'ONG',              municipio:'Bogotá',      estado:'verde',   prioridad:false, contacto:'Coord. Valentina R.', interacciones:5,  ultima:'2024-11-20' },
  { id:'ac07', nombre:'Comunidad Ranchería Los Wayúu',    tipo:'Comunidad',        municipio:'Manaure',     estado:'amarillo',prioridad:true,  contacto:'Líder Fermín Ipuana', interacciones:9,  ultima:'2024-10-20' },
  { id:'ac08', nombre:'Fenalce',                          tipo:'Gremio',           municipio:'Bogotá',      estado:'verde',   prioridad:false, contacto:'Ing. Carlos Leal',    interacciones:2,  ultima:'2024-11-05' },
  { id:'ac09', nombre:'Gobernación del Meta',             tipo:'Entidad pública',  municipio:'Villavicencio',estado:'verde',  prioridad:false, contacto:'Dir. Planeación',     interacciones:7,  ultima:'2024-12-02' },
  { id:'ac10', nombre:'Pacific Rubiales Energy',          tipo:'Operadora',        municipio:'Puerto Gaitán',estado:'rojo',   prioridad:true,  contacto:'Rel. Comunitarias',   interacciones:11, ultima:'2024-09-01' },
];

const INTERACCIONES_MAP = {
  'ac01':[ {f:'2024-12-01',canal:'Reunión presencial',resumen:'Mesa técnica ambiental Q4'}, {f:'2024-11-10',canal:'Correo',resumen:'Envío informe mensual'} ],
  'ac02':[ {f:'2024-11-15',canal:'Visita campo',resumen:'Reunión con cabildo sobre consulta previa'}, {f:'2024-10-08',canal:'WhatsApp',resumen:'Confirmación taller BPA'} ],
  'ac05':[ {f:'2024-09-15',canal:'Oficio',resumen:'Respuesta negativa a solicitud de espacio'} ],
  'ac10':[ {f:'2024-09-01',canal:'Correo',resumen:'Última comunicación — sin respuesta posterior'} ],
};

const ESTADO_CFG = { verde:{ label:'Activo', bg:'#dcfce7', c:'#15803d' }, amarillo:{ label:'En riesgo', bg:'#fef9c3', c:'#b45309' }, rojo:{ label:'Critico', bg:'#fee2e2', c:'#dc2626' } };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconStar = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?680:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const s = ESTADO_CFG[estado] || ESTADO_CFG.verde;
  const shape = estado==='verde' ? <span style={{width:8,height:8,borderRadius:'50%',background:s.c,display:'inline-block'}}/> : estado==='amarillo' ? <span style={{width:8,height:8,borderRadius:1,background:s.c,display:'inline-block'}}/> : <span style={{width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderBottom:`8px solid ${s.c}`,display:'inline-block'}}/>;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:s.bg, color:s.c }}>{shape} {s.label}</span>;
}

function TabDirectorio({ actores, onVerFicha, showToast }) {
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [buscar, setBuscar] = useState('');

  const filtrados = actores.filter(a =>
    (filtroTipo==='Todos' || a.tipo===filtroTipo) &&
    (!buscar || a.nombre.toLowerCase().includes(buscar.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <input className="form-input" style={{ maxWidth:220 }} placeholder="Buscar actor…" value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <select className="form-select" style={{ maxWidth:180 }} value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}>
          <option value="Todos">Todos los tipos</option>
          {TIPOS.map(t=><option key={t}>{t}</option>)}
        </select>
        <button onClick={()=>showToast('Nuevo actor agregado (demo)')} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>+ Agregar</button>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Actor','Tipo','Municipio','Estado','Prioridad','Interacciones','Última'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filtrados.map(a => {
              const tc = TIPO_COLOR[a.tipo]||COLOR;
              return (
                <tr key={a.id} onClick={()=>onVerFicha(a)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>
                    {a.prioridad && <span style={{ color:'#f59e0b', marginRight:4 }}><IconStar /></span>}{a.nombre}
                  </td>
                  <td style={TD}><span style={{ fontSize:11, background:tc+'18', color:tc, border:`1px solid ${tc}44`, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{a.tipo}</span></td>
                  <td style={TD}>{a.municipio}</td>
                  <td style={TD}><EstadoBadge estado={a.estado} /></td>
                  <td style={TD}>{a.prioridad ? <span style={{ color:'#f59e0b', fontWeight:700 }}>Alta</span> : 'Normal'}</td>
                  <td style={TD}>{a.interacciones}</td>
                  <td style={TD}>{a.ultima}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabSemaforo({ actores }) {
  const byEstado = { verde: actores.filter(a=>a.estado==='verde'), amarillo: actores.filter(a=>a.estado==='amarillo'), rojo: actores.filter(a=>a.estado==='rojo') };
  return (
    <div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Semáforo de relacionamiento: verde = activo y productivo, amarillo = en riesgo (sin contacto reciente), rojo = relación crítica.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
        {[['verde','Activos','#15803d','#dcfce7','#86efac'],['amarillo','En riesgo','#b45309','#fef9c3','#fde68a'],['rojo','Críticos','#dc2626','#fee2e2','#fca5a5']].map(([e,label,c,bg,border]) => (
          <div key={e} style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:c, marginBottom:10 }}>{label} ({byEstado[e].length})</div>
            {byEstado[e].map(a => (
              <div key={a.id} style={{ padding:'8px 10px', background:'rgba(255,255,255,.7)', borderRadius:8, marginBottom:6 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#1e293b' }}>{a.nombre}</div>
                <div style={{ fontSize:11, color:'#64748b' }}>{a.tipo} · Última: {a.ultima}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Directorio','Semáforo'];

export default function DirectorioActoresPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Directorio');
  const [ficha, setFicha] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });

  function showToast(msg, ok=true) { setToast({ msg, ok }); setTimeout(() => setToast({ msg:'', ok:true }), 3500); }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4, padding:'6px 8px', borderRadius:7, fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <IconBack /> Módulos
        </button>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>CRM de Actores</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Directorio' && <TabDirectorio actores={ACTORES} onVerFicha={setFicha} showToast={showToast} />}
      {tab === 'Semáforo'   && <TabSemaforo actores={ACTORES} />}
      {ficha && (
        <Modal title={ficha.nombre} onClose={() => setFicha(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['Tipo',ficha.tipo],['Municipio',ficha.municipio],['Contacto',ficha.contacto],['Estado',<EstadoBadge key="e" estado={ficha.estado}/>],['Prioridad',ficha.prioridad?'Alta':'Normal'],['Total interacciones',ficha.interacciones]].map(([l,v]) => (
              <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Timeline de interacciones</h4>
          {(INTERACCIONES_MAP[ficha.id] || []).map((int, i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
              <div style={{ width:80, fontSize:11, color:'#94a3b8', flexShrink:0 }}>{int.f}</div>
              <div><span style={{ fontSize:11, fontWeight:600, color:COLOR }}>{int.canal}</span><div style={{ fontSize:12, color:'#475569' }}>{int.resumen}</div></div>
            </div>
          ))}
          {(!INTERACCIONES_MAP[ficha.id] || INTERACCIONES_MAP[ficha.id].length===0) && <p style={{ color:'#94a3b8', fontSize:13 }}>Sin interacciones registradas (demo)</p>}
          <button onClick={() => showToast('Interacción registrada (demo)')} style={{ marginTop:14, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            + Registrar interacción
          </button>
        </Modal>
      )}
      <Toast {...toast} />
    </div>
  );
}
