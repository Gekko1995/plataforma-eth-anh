import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#B45309';
const META  = modulos.find(m => m.id === 8);

const SLA_CONFIG = { L1:{ horas:2, label:'Crítico', bg:'#fee2e2', c:'#dc2626', border:'#fca5a5' }, L2:{ horas:8, label:'Alto', bg:'#fef9c3', c:'#b45309', border:'#fde68a' }, L3:{ horas:24, label:'Medio', bg:'#dbeafe', c:'#1d4ed8', border:'#bfdbfe' } };

const now = new Date('2024-12-05T14:00:00');
const horasDesde = (d) => Math.round((now - new Date(d)) / 3600000);

const CASOS = [
  { id:'a01', titulo:'Bloqueo vía acceso campo El Tigre', municipio:'Puerto Rico', nivel:'L1', estado:'Abierto',   apertura:'2024-12-05T10:30:00', responsable:'Ing. Laura Castillo',  tipo:'Bloqueo', dialogos:1, acuerdos:0 },
  { id:'a02', titulo:'Inconformidad con contratación local', municipio:'Yopal',      nivel:'L2', estado:'En gestión',apertura:'2024-12-04T16:00:00', responsable:'Ing. Pedro Salinas',   tipo:'Laboral', dialogos:2, acuerdos:1 },
  { id:'a03', titulo:'Reclamación terrenos servidumbre',     municipio:'Arauca',     nivel:'L2', estado:'En gestión',apertura:'2024-12-04T09:00:00', responsable:'Ing. Clara Moreno',    tipo:'Tierra',  dialogos:3, acuerdos:0 },
  { id:'a04', titulo:'Demanda ambiental vertimiento río',    municipio:'Florencia',  nivel:'L1', estado:'Abierto',   apertura:'2024-12-05T12:00:00', responsable:'Ing. Roberto Pinto',   tipo:'Ambiental',dialogos:0, acuerdos:0 },
  { id:'a05', titulo:'Protesta comunidad indígena pago',     municipio:'Inírida',    nivel:'L3', estado:'Cerrado',   apertura:'2024-12-01T08:00:00', responsable:'Ing. Sandra Vargas',   tipo:'Comunitario',dialogos:4, acuerdos:2 },
  { id:'a06', titulo:'Desacuerdo plan de compensación',      municipio:'Mocoa',      nivel:'L2', estado:'En gestión',apertura:'2024-12-03T11:00:00', responsable:'Ing. Luis Herrera',    tipo:'Compensación',dialogos:2, acuerdos:1 },
  { id:'a07', titulo:'Denuncia daños cultivos',              municipio:'Sogamoso',   nivel:'L3', estado:'Cerrado',   apertura:'2024-11-28T15:00:00', responsable:'Ing. Nelly Torres',    tipo:'Ambiental',dialogos:3, acuerdos:3 },
  { id:'a08', titulo:'Conflicto uso agua',                   municipio:'Bucaramanga',nivel:'L3', estado:'Abierto',   apertura:'2024-12-04T13:00:00', responsable:'Ing. Carlos Mendoza',  tipo:'Hídrico', dialogos:1, acuerdos:0 },
  { id:'a09', titulo:'Restricción transporte noctorno',      municipio:'Montería',   nivel:'L2', estado:'En gestión',apertura:'2024-12-02T07:00:00', responsable:'Ing. Fabio Guerrero',  tipo:'Laboral', dialogos:2, acuerdos:0 },
  { id:'a10', titulo:'Reclamo comunitario obras viales',     municipio:'Villavicencio',nivel:'L3',estado:'Cerrado',  apertura:'2024-11-25T10:00:00', responsable:'Ing. Patricia Ríos',   tipo:'Infraestructura',dialogos:5, acuerdos:4 },
];

const ACUERDOS_DEMO = [
  { id:'ac1', caso:'a02', texto:'Contratación mínima 30% mano obra local', fecha:'2024-12-05', cumplido:false },
  { id:'ac2', caso:'a05', texto:'Mesa técnica de seguimiento mensual', fecha:'2024-12-03', cumplido:true },
  { id:'ac3', caso:'a05', texto:'Pago compensaciones pendientes en 15 días', fecha:'2024-12-03', cumplido:false },
  { id:'ac4', caso:'a06', texto:'Revisión plan compensación por comité', fecha:'2024-12-04', cumplido:true },
  { id:'ac5', caso:'a07', texto:'Evaluación técnica de daños por agrónomo', fecha:'2024-11-30', cumplido:true },
  { id:'ac6', caso:'a07', texto:'Pago daños cultivos en 5 días', fecha:'2024-11-30', cumplido:true },
  { id:'ac7', caso:'a07', texto:'Reunión mensual comité veedores', fecha:'2024-11-30', cumplido:false },
  { id:'ac8', caso:'a10', texto:'Cronograma obras publicado en alcaldía', fecha:'2024-11-26', cumplido:true },
];

const TIPOS = ['Todos','Abierto','En gestión','Cerrado'];
const NIVELES = ['Todos','L1','L2','L3'];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconBell = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function NivelBadge({ nivel }) {
  const s = SLA_CONFIG[nivel];
  const shape = nivel==='L1' ? <span style={{width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderBottom:`8px solid ${s.c}`,display:'inline-block'}}/> : nivel==='L2' ? <span style={{width:8,height:8,borderRadius:1,background:s.c,display:'inline-block'}}/> : <span style={{width:8,height:8,borderRadius:'50%',background:s.c,display:'inline-block'}}/>;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:s.bg, color:s.c, border:`1px solid ${s.border}` }}>{shape} {nivel} – {s.label}</span>;
}

function EstadoBadge({ estado }) {
  const map = { 'Abierto':{ bg:'#fee2e2', c:'#dc2626' }, 'En gestión':{ bg:'#fef9c3', c:'#b45309' }, 'Cerrado':{ bg:'#dcfce7', c:'#15803d' } };
  const s = map[estado] || map['Abierto'];
  return <span style={{ padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:600, background:s.bg, color:s.c }}>{estado}</span>;
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

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#dcfce7':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}


function isVencido(caso) {
  if (caso.estado === 'Cerrado') return false;
  const horas = horasDesde(caso.apertura);
  return horas > SLA_CONFIG[caso.nivel].horas;
}

// ── Tab Alertas ────────────────────────────────────────────────────────
function TabAlertas({ casos, onVerDetalle }) {
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroNivel, setFiltroNivel]   = useState('Todos');

  const filtrados = casos.filter(c =>
    (filtroEstado === 'Todos' || c.estado === filtroEstado) &&
    (filtroNivel  === 'Todos' || c.nivel  === filtroNivel)
  );

  const vencidos = casos.filter(isVencido);

  return (
    <div>
      {vencidos.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <IconBell />
          <span style={{ fontSize:13, fontWeight:700, color:'#dc2626' }}>{vencidos.length} caso(s) con SLA vencido — requieren atención inmediata</span>
        </div>
      )}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <select className="form-select" style={{ maxWidth:160 }} value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}>
          {TIPOS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth:140 }} value={filtroNivel} onChange={e=>setFiltroNivel(e.target.value)}>
          {NIVELES.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Caso','Municipio','Tipo','Nivel SLA','Horas','Estado','Responsable'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.map(c => {
              const horas = horasDesde(c.apertura);
              const venc = isVencido(c);
              return (
                <tr key={c.id} onClick={() => onVerDetalle(c)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', background:venc?'#fff5f5':'transparent' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e=>e.currentTarget.style.background=venc?'#fff5f5':'transparent'}>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{c.titulo}</td>
                  <td style={TD}>{c.municipio}</td>
                  <td style={TD}>{c.tipo}</td>
                  <td style={TD}><NivelBadge nivel={c.nivel}/></td>
                  <td style={{...TD, color:venc?'#dc2626':'#475569', fontWeight:venc?700:400}}>
                    {c.estado==='Cerrado'?'—':`${horas}h / ${SLA_CONFIG[c.nivel].horas}h`}
                    {venc && ' ⚠'}
                  </td>
                  <td style={TD}><EstadoBadge estado={c.estado}/></td>
                  <td style={TD}>{c.responsable.replace('Ing. ','')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab Mapa Calor ─────────────────────────────────────────────────────
function TabMapaCalor({ casos }) {
  const municipios = [...new Set(casos.map(c => c.municipio))];
  const byMuni = municipios.map(m => {
    const cs = casos.filter(c => c.municipio === m);
    const score = cs.reduce((s,c) => s + (c.nivel==='L1'?3:c.nivel==='L2'?2:1), 0);
    return { municipio:m, total:cs.length, abiertos:cs.filter(c=>c.estado!=='Cerrado').length, score };
  }).sort((a,b) => b.score - a.score);
  const maxScore = Math.max(...byMuni.map(m => m.score), 1);

  return (
    <div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Intensidad de conflictividad por municipio (L1=3pts, L2=2pts, L3=1pt). Mayor puntuación = mayor riesgo.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {byMuni.map(({ municipio, total, abiertos, score }) => {
          const w = Math.round((score/maxScore)*100);
          const color = score/maxScore > 0.7 ? '#dc2626' : score/maxScore > 0.4 ? '#b45309' : '#15803d';
          return (
            <div key={municipio} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div>
                  <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{municipio}</span>
                  <span style={{ marginLeft:10, fontSize:12, color:'#64748b' }}>{total} caso(s) — {abiertos} abierto(s)</span>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color }}>{score} pts</span>
              </div>
              <div style={{ height:8, background:'#e2e8f0', borderRadius:99 }}>
                <div style={{ height:'100%', borderRadius:99, background:color, width:`${w}%`, transition:'width .4s' }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Acuerdos ───────────────────────────────────────────────────────
function TabAcuerdos({ acuerdos, setAcuerdos, showToast }) {
  const pendientes = acuerdos.filter(a => !a.cumplido);
  const cumplidos  = acuerdos.filter(a => a.cumplido);

  function marcarCumplido(id) {
    setAcuerdos(prev => prev.map(a => a.id===id ? {...a, cumplido:true} : a));
    showToast('Acuerdo marcado como cumplido (demo)');
  }

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[['Acuerdos totales', acuerdos.length, '#475569'],['Pendientes',pendientes.length,'#b45309'],['Cumplidos',cumplidos.length,'#15803d']].map(([l,v,c]) => (
          <div key={l} className="kpi-card" style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {acuerdos.map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${a.cumplido?'#15803d':'#94a3b8'}`, background:a.cumplido?'#15803d':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {a.cumplido && <span style={{ color:'#fff', fontSize:11 }}>✓</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{a.texto}</div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>Caso {a.caso} · {a.fecha}</div>
            </div>
            {!a.cumplido && (
              <button onClick={() => marcarCumplido(a.id)} style={{ padding:'4px 10px', borderRadius:6, background:'#f0fdf4', color:'#15803d', border:'1px solid #86efac', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                Marcar ✓
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Alertas SLA','Mapa de Calor','Acuerdos'];

export default function PrevencionDialogoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Alertas SLA');
  const [casos] = useState(CASOS);
  const [acuerdos, setAcuerdos] = useState(ACUERDOS_DEMO);
  const [detalle, setDetalle] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });

  function showToast(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 3500);
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4, padding:'6px 8px', borderRadius:7, fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <IconBack /> Módulos
        </button>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Prevención y Diálogo Social</span>
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

      {tab === 'Alertas SLA'    && <TabAlertas casos={casos} onVerDetalle={setDetalle} />}
      {tab === 'Mapa de Calor'  && <TabMapaCalor casos={casos} />}
      {tab === 'Acuerdos'       && <TabAcuerdos acuerdos={acuerdos} setAcuerdos={setAcuerdos} showToast={showToast} />}

      {detalle && (
        <Modal title={detalle.titulo} onClose={() => setDetalle(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {[['Municipio',detalle.municipio],['Tipo',detalle.tipo],['Nivel',<NivelBadge key="n" nivel={detalle.nivel}/>],['Estado',<EstadoBadge key="e" estado={detalle.estado}/>],['Responsable',detalle.responsable],['Apertura',detalle.apertura.replace('T',' ')]].map(([l,v]) => (
              <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#92400e' }}>SLA: {SLA_CONFIG[detalle.nivel].horas}h — Nivel {detalle.nivel} ({SLA_CONFIG[detalle.nivel].label})</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ flex:1, textAlign:'center', background:'#f8fafc', borderRadius:8, padding:'10px 0' }}>
              <div style={{ fontSize:22, fontWeight:800, color:COLOR }}>{detalle.dialogos}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>Diálogos</div>
            </div>
            <div style={{ flex:1, textAlign:'center', background:'#f8fafc', borderRadius:8, padding:'10px 0' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'#15803d' }}>{detalle.acuerdos}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>Acuerdos</div>
            </div>
          </div>
        </Modal>
      )}

      <Toast {...toast} />
    </div>
  );
}
