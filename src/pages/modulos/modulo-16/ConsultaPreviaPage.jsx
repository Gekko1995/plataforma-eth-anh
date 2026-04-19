import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 16);

const ETAPAS = ['Apertura','Pre-consulta','Convocatoria','Deliberación','Acuerdo preliminar','Protocolización','Seguimiento'];
const ETAPA_COLOR = { 'Apertura':'#94a3b8','Pre-consulta':'#3b82f6','Convocatoria':'#8b5cf6','Deliberación':'#f59e0b','Acuerdo preliminar':COLOR,'Protocolización':'#10b981','Seguimiento':'#15803d' };

const HOY = new Date('2024-12-05');
const diasEn = (inicio, diasLimite) => {
  const d = Math.floor((HOY - new Date(inicio)) / 86400000);
  return { transcurridos: d, vencido: d > diasLimite };
};

const PROCESOS = [
  { id:'cp01', resguardo:'Resguardo El Vigía',          etnia:'Sikuani',  municipio:'Arauca',   etapa:'Deliberación',      inicio:'2024-08-01', diasLimite:120, responsable:'Ing. Laura Castillo',  acuerdos:2, documentos:8 },
  { id:'cp02', resguardo:'Ranchería Los Wayúu',          etnia:'Wayúu',    municipio:'Manaure',  etapa:'Acuerdo preliminar',inicio:'2024-06-15', diasLimite:150, responsable:'Ing. Pedro Salinas',   acuerdos:3, documentos:12 },
  { id:'cp03', resguardo:'Cabildo Río Baudó',            etnia:'Emberá',   municipio:'Alto Baudó',etapa:'Convocatoria',    inicio:'2024-10-01', diasLimite:90,  responsable:'Ing. Clara Moreno',    acuerdos:0, documentos:3 },
  { id:'cp04', resguardo:'Resguardo Caño Mochuelo',      etnia:'Sikuani',  municipio:'Paz de Ariporo',etapa:'Pre-consulta',inicio:'2024-11-01',diasLimite:90,  responsable:'Ing. Roberto Pinto',   acuerdos:0, documentos:2 },
  { id:'cp05', resguardo:'Comunidad Awá Nariño',         etnia:'Awá',      municipio:'Barbacoas',etapa:'Protocolización',  inicio:'2024-03-10', diasLimite:180, responsable:'Ing. Sandra Vargas',   acuerdos:5, documentos:18 },
  { id:'cp06', resguardo:'Consejo Mayor Embera Chocó',   etnia:'Emberá',   municipio:'Quibdó',   etapa:'Apertura',          inicio:'2024-12-01', diasLimite:90, responsable:'Ing. Nelly Torres',    acuerdos:0, documentos:1 },
];

const ACUERDOS_DEMO = [
  { id:'a1', proceso:'cp01', texto:'Mesa de seguimiento ambiental mensual', fecha:'2024-10-15', estado:'Vigente' },
  { id:'a2', proceso:'cp01', texto:'Compensación por servidumbre — 50 SMLV', fecha:'2024-11-01', estado:'Pendiente pago' },
  { id:'a3', proceso:'cp02', texto:'Contratación mano de obra local mín. 30%', fecha:'2024-09-20', estado:'Vigente' },
  { id:'a4', proceso:'cp05', texto:'Fondo comunitario ambiental USD 40.000', fecha:'2024-07-05', estado:'Ejecutado' },
  { id:'a5', proceso:'cp05', texto:'Plan de manejo arqueológico', fecha:'2024-07-05', estado:'Vigente' },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconWarn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;

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

function TabProcesos({ procesos, onVerDetalle, showToast }) {
  const vencidos = procesos.filter(p => diasEn(p.inicio, p.diasLimite).vencido && p.etapa !== 'Seguimiento');
  return (
    <div>
      {vencidos.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#7f1d1d' }}>{vencidos.length} proceso(s) con etapa vencida — se ha convocado al comité de coordinación</span>
        </div>
      )}
      <button onClick={()=>showToast('Nuevo proceso de consulta previa iniciado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Iniciar proceso
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Resguardo/Cabildo','Etnia','Municipio','Etapa actual','Días transcurridos','Documentos','Acuerdos'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {procesos.map(p => {
              const { transcurridos, vencido } = diasEn(p.inicio, p.diasLimite);
              const ec = ETAPA_COLOR[p.etapa]||'#64748b';
              return (
                <tr key={p.id} onClick={()=>onVerDetalle(p)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', background:vencido?'#fff5f5':'transparent' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=vencido?'#fff5f5':'transparent'}>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{p.resguardo}</td>
                  <td style={TD}><span style={{ fontSize:11, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{p.etnia}</span></td>
                  <td style={TD}>{p.municipio}</td>
                  <td style={TD}><span style={{ fontSize:11, background:ec+'18', color:ec, border:`1px solid ${ec}44`, borderRadius:6, padding:'2px 7px', fontWeight:700 }}>{p.etapa}</span></td>
                  <td style={{...TD, color:vencido?'#dc2626':'#475569', fontWeight:vencido?700:400}}>{transcurridos}d / {p.diasLimite}d {vencido&&'⚠'}</td>
                  <td style={TD}>{p.documentos}</td>
                  <td style={TD}>{p.acuerdos}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabAcuerdos({ acuerdos }) {
  const stats = { Vigente: acuerdos.filter(a=>a.estado==='Vigente').length, 'Pendiente pago': acuerdos.filter(a=>a.estado==='Pendiente pago').length, Ejecutado: acuerdos.filter(a=>a.estado==='Ejecutado').length };
  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[['Total',acuerdos.length,'#475569'],['Vigentes',stats.Vigente,'#15803d'],['Pendiente pago',stats['Pendiente pago'],'#b45309'],['Ejecutados',stats.Ejecutado,COLOR]].map(([l,v,c]) => (
          <div key={l} className="kpi-card" style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {acuerdos.map(a => {
          const sc = a.estado==='Vigente'?'#15803d':a.estado==='Ejecutado'?COLOR:'#b45309';
          const sbg = a.estado==='Vigente'?'#dcfce7':a.estado==='Ejecutado'?'#dbeafe':'#fef9c3';
          return (
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{a.texto}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Proceso {a.proceso} · {a.fecha}</div>
              </div>
              <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:sbg, color:sc }}>{a.estado}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ['Procesos Activos','Repositorio Acuerdos'];

export default function ConsultaPreviaPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Procesos Activos');
  const [detalle, setDetalle] = useState(null);
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Consulta Previa</span>
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
      {tab === 'Procesos Activos'    && <TabProcesos procesos={PROCESOS} onVerDetalle={setDetalle} showToast={showToast} />}
      {tab === 'Repositorio Acuerdos' && <TabAcuerdos acuerdos={ACUERDOS_DEMO} />}
      {detalle && (
        <Modal title={detalle.resguardo} onClose={() => setDetalle(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['Etnia',detalle.etnia],['Municipio',detalle.municipio],['Etapa',detalle.etapa],['Responsable',detalle.responsable],['Inicio',detalle.inicio],['Días límite',`${detalle.diasLimite}d`],['Documentos',detalle.documentos],['Acuerdos registrados',detalle.acuerdos]].map(([l,v]) => (
              <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            {ETAPAS.map((e, i) => {
              const idx = ETAPAS.indexOf(detalle.etapa);
              const done = i <= idx;
              const active = i === idx;
              const c = ETAPA_COLOR[e];
              return (
                <div key={e} style={{ flex:1, textAlign:'center' }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:done?c:'#e2e8f0', margin:'0 auto 3px', display:'flex', alignItems:'center', justifyContent:'center', border:active?`2px solid ${c}`:'none' }}>
                    {done && <span style={{ color:'#fff', fontSize:10, fontWeight:700 }}>✓</span>}
                  </div>
                  <div style={{ fontSize:9, color:done?c:'#94a3b8', fontWeight:600, lineHeight:1.2 }}>{e}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => { showToast(`Etapa avanzada (demo)`); setDetalle(null); }} style={{ marginTop:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Avanzar etapa →
          </button>
        </Modal>
      )}
      <Toast {...toast} />
    </div>
  );
}
