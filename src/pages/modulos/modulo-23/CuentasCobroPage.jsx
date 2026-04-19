import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 23);

const HOY = new Date('2024-12-05');
const DIAS_HABILES = [1,2,3,4,5];
function addDiasHabiles(fecha, n) {
  let d = new Date(fecha); let count = 0;
  while (count < n) { d.setDate(d.getDate()+1); if (DIAS_HABILES.includes(d.getDay())) count++; }
  return d;
}
function diasHabilesRestantes(limite) {
  let d = new Date(HOY); let count = 0;
  while (d < limite) { d.setDate(d.getDate()+1); if (DIAS_HABILES.includes(d.getDay())) count++; }
  return count;
}

const CUENTAS = [
  { id:'CC-001', mes:'Noviembre 2024', contratista:'Carlos Pérez', cargo:'Coordinador', valor:8500000, radicado:'2024-12-02', estado:'aprobada',   eps:true,  pension:true,  arl:true,  m27_aprobado:true  },
  { id:'CC-002', mes:'Noviembre 2024', contratista:'Ana Gómez',    cargo:'Profesional ambiental', valor:5200000, radicado:'2024-12-03', estado:'revision', eps:true, pension:true, arl:true, m27_aprobado:true },
  { id:'CC-003', mes:'Noviembre 2024', contratista:'Luis Torres',  cargo:'Técnico campo', valor:3800000, radicado:'2024-12-04', estado:'pendiente', eps:true, pension:false, arl:true, m27_aprobado:true },
  { id:'CC-004', mes:'Noviembre 2024', contratista:'María Ruiz',   cargo:'Profesional social', valor:5200000, radicado:null, estado:'bloqueada', eps:false, pension:false, arl:false, m27_aprobado:false },
  { id:'CC-005', mes:'Noviembre 2024', contratista:'Pedro Soto',   cargo:'Auxiliar admin', valor:2800000, radicado:'2024-12-01', estado:'aprobada', eps:true, pension:true, arl:true, m27_aprobado:true },
];

const ESTADO_CFG = {
  aprobada: { label:'Aprobada', bg:'#dcfce7', c:'#15803d' },
  revision: { label:'En revisión', bg:'#fef9c3', c:'#b45309' },
  pendiente:{ label:'SS incompleto', bg:'#fee2e2', c:'#dc2626' },
  bloqueada:{ label:'Bloqueada (M27)', bg:'#f1f5f9', c:'#94a3b8' },
};

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function Countdown({ radicado }) {
  if (!radicado) return <span style={{ fontSize:11, color:'#94a3b8' }}>Sin radicar</span>;
  const limite = addDiasHabiles(new Date(radicado), 5);
  const restantes = diasHabilesRestantes(limite);
  const c = restantes <= 1 ? '#dc2626' : restantes <= 2 ? '#b45309' : '#15803d';
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:20, fontWeight:900, color:c, lineHeight:1 }}>{restantes}</div>
      <div style={{ fontSize:10, color:c, fontWeight:600 }}>días háb.</div>
    </div>
  );
}

function TabCuentas({ showToast }) {
  const bloqueadas = CUENTAS.filter(c => !c.m27_aprobado).length;
  const ssIncompleto = CUENTAS.filter(c => c.m27_aprobado && (!c.eps || !c.pension || !c.arl)).length;
  return (
    <div>
      {bloqueadas > 0 && (
        <div style={{ background:'#f1f5f9', border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 16px', marginBottom:10, fontSize:13, fontWeight:700, color:'#475569' }}>
          🔒 {bloqueadas} cuenta(s) bloqueada(s): informe M27 pendiente de aprobación
        </div>
      )}
      {ssIncompleto > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ {ssIncompleto} cuenta(s) con seguridad social incompleta — no pueden aprobarse
        </div>
      )}
      <button onClick={()=>showToast('Cuenta de cobro radicada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Radicar cuenta de cobro
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{['ID','Mes','Contratista','Cargo','Valor','EPS','Pensión','ARL','Countdown','Estado','Acción'].map(h=><th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {CUENTAS.map(c => {
              const cfg = ESTADO_CFG[c.estado];
              return (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{c.id}</td>
                  <td style={TD}>{c.mes}</td>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{c.contratista}</td>
                  <td style={TD}>{c.cargo}</td>
                  <td style={{...TD, fontWeight:700}}>{fmt(c.valor)}</td>
                  {[c.eps, c.pension, c.arl].map((v,i) => (
                    <td key={i} style={{...TD, textAlign:'center'}}>{v ? <span style={{color:'#15803d',fontWeight:700}}>✓</span> : <span style={{color:'#dc2626',fontWeight:700}}>✗</span>}</td>
                  ))}
                  <td style={TD}><Countdown radicado={c.radicado} /></td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:6, padding:'2px 8px' }}>{cfg.label}</span></td>
                  <td style={TD}>
                    {c.estado === 'revision' && (
                      <button onClick={()=>showToast(`${c.id} aprobada (demo)`)} style={{ padding:'3px 9px', borderRadius:6, background:'#dcfce7', color:'#15803d', border:'1px solid #86efac', fontSize:11, fontWeight:700, cursor:'pointer' }}>Aprobar</button>
                    )}
                    {c.estado === 'bloqueada' && <span style={{fontSize:11,color:'#94a3b8'}}>Pendiente M27</span>}
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

function TabResumen() {
  const total = CUENTAS.reduce((s,c)=>s+c.valor,0);
  const aprobadas = CUENTAS.filter(c=>c.estado==='aprobada');
  const totalAprobado = aprobadas.reduce((s,c)=>s+c.valor,0);
  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {[
          { label:'Total cuentas mes', val:CUENTAS.length, c:'#475569' },
          { label:'Aprobadas', val:aprobadas.length, c:'#15803d' },
          { label:'Valor total mes', val:fmt(total), c:COLOR },
          { label:'Valor aprobado', val:fmt(totalAprobado), c:'#15803d' },
        ].map(k => <div key={k.label} className="kpi-card"><div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div><div style={{ fontSize:20, fontWeight:800, color:k.c }}>{k.val}</div></div>)}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Checklist de aprobación — cuenta CC-002</h3>
        {[
          { label:'Informe M27 aprobado', ok:true },
          { label:'EPS al día', ok:true },
          { label:'Pensión al día', ok:true },
          { label:'ARL al día', ok:true },
          { label:'Dentro de los 5 días hábiles', ok:true },
          { label:'Firma supervisor', ok:false },
        ].map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ width:20, height:20, borderRadius:'50%', background:item.ok?'#dcfce7':'#fee2e2', color:item.ok?'#15803d':'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{item.ok?'✓':'✗'}</span>
            <span style={{ fontSize:13, color:'#1e293b' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Cuentas de Cobro','Resumen Mensual'];

export default function CuentasCobroPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Cuentas de Cobro');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Cuentas de Cobro</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Cuentas de Cobro' && <TabCuentas showToast={showToast} />}
      {tab === 'Resumen Mensual'  && <TabResumen />}
      <Toast {...toast} />
    </div>
  );
}
