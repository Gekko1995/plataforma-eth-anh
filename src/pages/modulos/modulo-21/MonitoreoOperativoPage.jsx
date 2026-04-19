import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 21);

const DESEMBOLSOS = [
  { id:'D1', nombre:'Plan de trabajo', pct_requerido:0,  pct_avance:100, fecha_limite:'2024-01-31', estado:'Completado', monto_miles:320 },
  { id:'D2', nombre:'35% ejecución',   pct_requerido:35, pct_avance:68,  fecha_limite:'2024-06-30', estado:'Completado', monto_miles:1120 },
  { id:'D3', nombre:'70% ejecución',   pct_requerido:70, pct_avance:62,  fecha_limite:'2024-12-31', estado:'En curso',   monto_miles:1120 },
  { id:'D4', nombre:'Cierre final',    pct_requerido:100,pct_avance:0,   fecha_limite:'2025-06-30', estado:'Pendiente',  monto_miles:480 },
];

const GRUPOS_AVANCE = [
  { grupo:'A', nombre:'Diagnóstico y Territorio',   modulos:5, completados:4, pct:80, color:'#1B6B4A' },
  { grupo:'B', nombre:'Núcleo Estratégico ANH',      modulos:4, completados:3, pct:75, color:'#B45309' },
  { grupo:'C', nombre:'Formación y Capacitación',    modulos:4, completados:3, pct:75, color:'#7C3AED' },
  { grupo:'D', nombre:'Actores y Talento Humano',    modulos:6, completados:3, pct:50, color:'#0369A1' },
  { grupo:'E', nombre:'Financiero y Gobernanza',     modulos:7, completados:2, pct:29, color:COLOR },
  { grupo:'F', nombre:'Informes y Rendición',        modulos:3, completados:1, pct:33, color:'#0891B2' },
  { grupo:'G', nombre:'Operación Territorial',       modulos:4, completados:1, pct:25, color:'#059669' },
  { grupo:'H', nombre:'Documentación y Cierre',      modulos:4, completados:0, pct:0,  color:'#6D28D9' },
  { grupo:'I', nombre:'Infraestructura TI',          modulos:2, completados:1, pct:50, color:'#475569' },
];

const KPI_DATA = [
  { label:'Avance global', val:'62%', c:COLOR, desc:'Módulos completados vs total' },
  { label:'Beneficiarios registrados', val:'4.287', c:'#0369A1', desc:'Meta: 10.000' },
  { label:'Iniciativas activas', val:'10', c:'#B45309', desc:'4 en ejecución' },
  { label:'Consultas previas activas', val:'6', c:'#7C3AED', desc:'1 con alerta' },
  { label:'Personal vinculado', val:'10', c:'#059669', desc:'2 contratos por vencer' },
  { label:'Ejecución financiera', val:'68%', c:'#DC2626', desc:'D3 en curso' },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#7f1d1d' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#991b1b', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabDashboard() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {KPI_DATA.map(k => (
          <div key={k.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:28, fontWeight:900, color:k.c, marginBottom:2, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>{k.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:700 }}>Avance por grupo de módulos</h3>
        {GRUPOS_AVANCE.map(g => (
          <div key={g.grupo} style={{ display:'grid', gridTemplateColumns:'180px 1fr 60px 60px', gap:10, alignItems:'center', marginBottom:10 }}>
            <div>
              <span style={{ display:'inline-block', width:20, height:20, borderRadius:'50%', background:g.color, color:'#fff', fontSize:11, fontWeight:800, textAlign:'center', lineHeight:'20px', marginRight:6 }}>{g.grupo}</span>
              <span style={{ fontSize:12, color:'#1e293b', fontWeight:600 }}>{g.nombre}</span>
            </div>
            <div style={{ height:10, background:'#e2e8f0', borderRadius:99 }}>
              <div style={{ width:`${g.pct}%`, height:'100%', borderRadius:99, background:g.pct>=70?'#10b981':g.pct>=40?g.color:'#94a3b8', transition:'width .4s' }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:g.pct>=70?'#15803d':g.pct>=40?g.color:'#94a3b8', textAlign:'right' }}>{g.pct}%</span>
            <span style={{ fontSize:11, color:'#94a3b8', textAlign:'right' }}>{g.completados}/{g.modulos}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabDesembolsos({ showToast }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {DESEMBOLSOS.map(d => {
          const c = d.estado==='Completado'?'#15803d':d.estado==='En curso'?COLOR:'#94a3b8';
          const bg = d.estado==='Completado'?'#dcfce7':d.estado==='En curso'?'#fee2e2':'#f8fafc';
          return (
            <div key={d.id} style={{ background:bg, border:`1px solid ${c}44`, borderRadius:12, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:c, marginBottom:4 }}>{d.id}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginBottom:8 }}>{d.nombre}</div>
              <div style={{ fontSize:22, fontWeight:900, color:c, marginBottom:4 }}>{d.pct_avance}%</div>
              <div style={{ height:7, background:'rgba(0,0,0,.1)', borderRadius:99, marginBottom:8 }}>
                <div style={{ width:`${d.pct_avance}%`, height:'100%', borderRadius:99, background:c }}/>
              </div>
              <div style={{ fontSize:11, color:c }}>{d.estado} · COP {d.monto_miles}M</div>
              <div style={{ fontSize:10, color:c, marginTop:2 }}>Límite: {d.fecha_limite}</div>
            </div>
          );
        })}
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Desembolso','Descripción','% Requerido','% Avance actual','Fecha límite','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {DESEMBOLSOS.map(d => {
              const ok = d.pct_avance >= d.pct_requerido;
              return (
                <tr key={d.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontWeight:800, color:COLOR}}>{d.id}</td>
                  <td style={TD}>{d.nombre}</td>
                  <td style={TD}>{d.pct_requerido}%</td>
                  <td style={TD}><span style={{ fontWeight:700, color:ok?'#15803d':COLOR }}>{d.pct_avance}% {ok?'✓':'⚠'}</span></td>
                  <td style={TD}>{d.fecha_limite}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:d.estado==='Completado'?'#15803d':d.estado==='En curso'?COLOR:'#94a3b8' }}>{d.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={()=>showToast('Informe mensual exportado en PDF (demo)')} style={{ marginTop:16, padding:'8px 16px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:13, fontWeight:700, cursor:'pointer' }}>
        Exportar informe mensual PDF
      </button>
    </div>
  );
}

const TABS = ['Dashboard Ejecutivo','Línea de Desembolsos'];

export default function MonitoreoOperativoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard Ejecutivo');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Monitoreo Plan Operativo</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Dashboard Ejecutivo'    && <TabDashboard />}
      {tab === 'Línea de Desembolsos'   && <TabDesembolsos showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
