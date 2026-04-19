import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#0891B2';
const META  = modulos.find(m => m.id === 27);

const INFORMES = [
  { id:'INF-001', periodo:'Octubre 2024',    tipo:'Mensual',   radicado:'2024-11-05', revisor:'Coord. Técnico', estado:'Aprobado',   version:2, m23_desbloqueada:true },
  { id:'INF-002', periodo:'Noviembre 2024',  tipo:'Mensual',   radicado:'2024-12-03', revisor:'Coord. Técnico', estado:'En revisión',version:1, m23_desbloqueada:false },
  { id:'INF-003', periodo:'Q3 2024',         tipo:'Trimestral',radicado:'2024-10-15', revisor:'Supervisor ANH', estado:'Aprobado',   version:3, m23_desbloqueada:true },
  { id:'INF-004', periodo:'Diciembre 2024',  tipo:'Mensual',   radicado:null,         revisor:'—',              estado:'Pendiente',  version:0, m23_desbloqueada:false },
];

const VERSIONES = [
  { informe:'INF-002', version:1, fecha:'2024-12-03', autor:'Ana Gómez',    cambios:'Primera entrega', estado:'actual' },
  { informe:'INF-001', version:2, fecha:'2024-11-10', autor:'Ana Gómez',    cambios:'Ajustes indicadores financieros', estado:'archivada' },
  { informe:'INF-001', version:1, fecha:'2024-11-05', autor:'Ana Gómez',    cambios:'Entrega inicial', estado:'archivada' },
];

const CHECKLIST = [
  'Introducción y contexto del período',
  'Avance de indicadores de producto',
  'Ejecución financiera del período',
  'Actividades realizadas por componente',
  'Problemas encontrados y soluciones',
  'Fotografías y evidencias de campo',
  'Cronograma actualizado',
  'Conclusiones y plan próximo período',
];

const ESTADO_CFG = {
  'Aprobado':     { bg:'#dcfce7', c:'#15803d' },
  'En revisión':  { bg:'#fef9c3', c:'#b45309' },
  'Pendiente':    { bg:'#f1f5f9', c:'#94a3b8' },
  'Rechazado':    { bg:'#fee2e2', c:'#dc2626' },
};

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#ecfeff', border:'1px solid #a5f3fc', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#cffafe', color:'#0e7490', border:'1px solid #a5f3fc', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#164e63' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#0e7490', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#cffafe', color:'#0e7490', border:'1px solid #a5f3fc', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabInformes({ showToast }) {
  const pendientesM27 = INFORMES.filter(i => !i.m23_desbloqueada).length;
  return (
    <div>
      {pendientesM27 > 0 && (
        <div style={{ background:'#f1f5f9', border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, color:'#475569', fontWeight:600 }}>
          🔒 {pendientesM27} informe(s) pendiente(s) de aprobación — M23 (Cuentas de Cobro) permanece bloqueado hasta aprobación
        </div>
      )}
      <button onClick={()=>showToast('Informe radicado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Radicar informe
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Período','Tipo','Radicado','Revisor','Versión','Estado','M23','Acción'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {INFORMES.map(inf => {
              const cfg = ESTADO_CFG[inf.estado] || ESTADO_CFG['Pendiente'];
              return (
                <tr key={inf.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{inf.id}</td>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{inf.periodo}</td>
                  <td style={TD}>{inf.tipo}</td>
                  <td style={TD}>{inf.radicado || '—'}</td>
                  <td style={TD}>{inf.revisor}</td>
                  <td style={{...TD, textAlign:'center', fontWeight:700}}>v{inf.version}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:6, padding:'2px 8px' }}>{inf.estado}</span></td>
                  <td style={{...TD, textAlign:'center'}}>{inf.m23_desbloqueada ? <span style={{color:'#15803d',fontWeight:700}}>✓</span> : <span style={{color:'#dc2626',fontWeight:700}}>🔒</span>}</td>
                  <td style={TD}>
                    {inf.estado === 'En revisión' && (
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>showToast(`${inf.id} aprobado (demo)`)} style={{ padding:'3px 9px', borderRadius:6, background:'#dcfce7', color:'#15803d', border:'1px solid #86efac', fontSize:11, fontWeight:700, cursor:'pointer' }}>Aprobar</button>
                        <button onClick={()=>showToast(`${inf.id} devuelto (demo)`, false)} style={{ padding:'3px 9px', borderRadius:6, background:'#fee2e2', color:'#dc2626', border:'1px solid #fca5a5', fontSize:11, fontWeight:700, cursor:'pointer' }}>Devolver</button>
                      </div>
                    )}
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

function TabVersiones() {
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Control de versiones</h3>
        <div className="table-wrapper">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Informe','Versión','Fecha','Autor','Cambios','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {VERSIONES.map((v,i) => (
                <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{v.informe}</td>
                  <td style={{...TD, textAlign:'center', fontWeight:700}}>v{v.version}</td>
                  <td style={TD}>{v.fecha}</td>
                  <td style={TD}>{v.autor}</td>
                  <td style={TD}>{v.cambios}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:v.estado==='actual'?'#dcfce7':'#f1f5f9', color:v.estado==='actual'?'#15803d':'#94a3b8', borderRadius:6, padding:'2px 7px' }}>{v.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Checklist estructura de informe</h3>
        {CHECKLIST.map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid #f8fafc' }}>
            <span style={{ width:20, height:20, borderRadius:'50%', background:'#dcfce7', color:'#15803d', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✓</span>
            <span style={{ fontSize:13, color:'#1e293b' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Gestión de Informes','Versiones y Checklist'];

export default function RevisionInformesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Gestión de Informes');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Revisión de Informes</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Gestión de Informes'    && <TabInformes showToast={showToast} />}
      {tab === 'Versiones y Checklist'  && <TabVersiones />}
      <Toast {...toast} />
    </div>
  );
}
