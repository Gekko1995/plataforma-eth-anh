import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 24);

const SESIONES = [
  { id:'S-001', numero:'Sesión 01-2024', fecha:'2024-02-15', tipo:'Ordinaria', quorum:true,  estado:'Aprobada', acta:'ACTA-001-2024', compromisos:5, cumplidos:5 },
  { id:'S-002', numero:'Sesión 02-2024', fecha:'2024-04-10', tipo:'Ordinaria', quorum:true,  estado:'Aprobada', acta:'ACTA-002-2024', compromisos:7, cumplidos:6 },
  { id:'S-003', numero:'Sesión 03-2024', fecha:'2024-06-20', tipo:'Ordinaria', quorum:true,  estado:'Aprobada', acta:'ACTA-003-2024', compromisos:4, cumplidos:4 },
  { id:'S-004', numero:'Sesión 04-2024', fecha:'2024-08-14', tipo:'Ordinaria', quorum:false, estado:'Aplazada', acta:null,             compromisos:0, cumplidos:0 },
  { id:'S-005', numero:'Sesión 05-2024', fecha:'2024-10-09', tipo:'Ordinaria', quorum:true,  estado:'Aprobada', acta:'ACTA-005-2024', compromisos:6, cumplidos:5 },
  { id:'S-006', numero:'Sesión EXT-2024',fecha:'2024-11-22', tipo:'Extraordinaria', quorum:true, estado:'En revisión', acta:'ACTA-EXT-2024', compromisos:3, cumplidos:0 },
];

const COMPROMISOS = [
  { id:'C01', sesion:'S-001', responsable:'Dir. Financiero', descripcion:'Presentar informe ejecución Q1', fecha_limite:'2024-03-31', estado:'Cumplido' },
  { id:'C02', sesion:'S-002', responsable:'Coord. Técnico',  descripcion:'Actualizar matriz riesgos',      fecha_limite:'2024-05-15', estado:'Cumplido' },
  { id:'C03', sesion:'S-003', responsable:'Dir. Social',     descripcion:'Registrar nuevos beneficiarios', fecha_limite:'2024-07-31', estado:'Cumplido' },
  { id:'C04', sesion:'S-005', responsable:'Dir. Financiero', descripcion:'Preparar proyección cierre año', fecha_limite:'2024-11-30', estado:'Cumplido' },
  { id:'C05', sesion:'S-005', responsable:'Coord. TI',       descripcion:'Migrar plataforma a producción',  fecha_limite:'2024-12-15', estado:'En curso' },
  { id:'C06', sesion:'S-006', responsable:'Dir. Técnico',    descripcion:'Subcontratos laboratorio ambiental', fecha_limite:'2024-12-20', estado:'Pendiente' },
];

const SUBCONTRATOS = [
  { id:'SC-01', descripcion:'Laboratorio análisis suelos', proveedor:'AgroLab S.A.S.', valor:38000000, estado:'Aprobado', acta_sesion:'S-003' },
  { id:'SC-02', descripcion:'Servicios cartografía SIG',   proveedor:'GeoMap Ltda.',   valor:22000000, estado:'Aprobado', acta_sesion:'S-005' },
  { id:'SC-03', descripcion:'Análisis calidad agua',       proveedor:'HidroTec S.A.',  valor:15000000, estado:'En aprobación', acta_sesion:'S-006' },
];

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

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

function TabSesiones({ showToast }) {
  const [selected, setSelected] = useState(null);
  const s = selected ? SESIONES.find(s=>s.id===selected) : null;
  return (
    <div style={{ display:'grid', gridTemplateColumns: s ? '1fr 320px' : '1fr', gap:20 }}>
      <div>
        <button onClick={()=>showToast('Sesión convocada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Convocar sesión
        </button>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {SESIONES.map(s => {
            const pct = s.compromisos > 0 ? Math.round((s.cumplidos/s.compromisos)*100) : 0;
            return (
              <div key={s.id} onClick={() => setSelected(s.id===selected?null:s.id)} style={{ background:'#fff', border:`2px solid ${s.id===selected?COLOR:'#e2e8f0'}`, borderRadius:12, padding:16, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div>
                    <span style={{ fontSize:14, fontWeight:800, color:'#1e293b' }}>{s.numero}</span>
                    <span style={{ marginLeft:8, fontSize:11, background:s.tipo==='Extraordinaria'?'#fef9c3':'#f1f5f9', color:s.tipo==='Extraordinaria'?'#b45309':'#64748b', borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{s.tipo}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, background:s.estado==='Aprobada'?'#dcfce7':s.estado==='En revisión'?'#fef9c3':'#f1f5f9', color:s.estado==='Aprobada'?'#15803d':s.estado==='En revisión'?'#b45309':'#94a3b8', borderRadius:6, padding:'2px 8px' }}>{s.estado}</span>
                </div>
                <div style={{ display:'flex', gap:16, fontSize:12, color:'#64748b' }}>
                  <span>📅 {s.fecha}</span>
                  <span>Quórum: {s.quorum?<span style={{color:'#15803d',fontWeight:700}}>✓</span>:<span style={{color:'#dc2626',fontWeight:700}}>✗</span>}</span>
                  {s.acta && <span style={{ fontFamily:'monospace', fontSize:11 }}>{s.acta}</span>}
                </div>
                {s.compromisos > 0 && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:3 }}>
                      <span>Compromisos {s.cumplidos}/{s.compromisos}</span><span style={{ fontWeight:700, color:pct>=80?'#15803d':COLOR }}>{pct}%</span>
                    </div>
                    <div style={{ height:5, background:'#e2e8f0', borderRadius:99 }}>
                      <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:pct>=80?'#10b981':COLOR }}/>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {s && (
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, alignSelf:'start' }}>
          <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>{s.numero}</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
            {[['Fecha',s.fecha],['Tipo',s.tipo],['Estado',s.estado],['Acta',s.acta||'—']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                <span style={{ color:'#94a3b8', fontWeight:600 }}>{k}</span>
                <span style={{ color:'#1e293b', fontWeight:500, fontFamily:k==='Acta'?'monospace':'inherit', fontSize:k==='Acta'?11:12 }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>showToast(`Acta ${s.acta||s.numero} descargada (demo)`)} style={{ width:'100%', padding:'8px 0', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Descargar acta PDF
          </button>
        </div>
      )}
    </div>
  );
}

function TabCompromisos() {
  const ESTADO_C = { 'Cumplido':{ bg:'#dcfce7', c:'#15803d' }, 'En curso':{ bg:'#fef9c3', c:'#b45309' }, 'Pendiente':{ bg:'#fee2e2', c:'#dc2626' } };
  return (
    <div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Sesión','Responsable','Descripción','Fecha límite','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {COMPROMISOS.map(c => {
              const cfg = ESTADO_C[c.estado];
              return (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{c.id}</td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{c.sesion}</td>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{c.responsable}</td>
                  <td style={TD}>{c.descripcion}</td>
                  <td style={TD}>{c.fecha_limite}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:6, padding:'2px 8px' }}>{c.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabSubcontratos({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Subcontrato sometido a aprobación (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Someter subcontrato
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {SUBCONTRATOS.map(sc => (
          <div key={sc.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:800, color:COLOR }}>{sc.id}</span>
              <span style={{ fontSize:11, fontWeight:700, background:sc.estado==='Aprobado'?'#dcfce7':'#fef9c3', color:sc.estado==='Aprobado'?'#15803d':'#b45309', borderRadius:6, padding:'2px 8px' }}>{sc.estado}</span>
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:'#1e293b', marginBottom:4 }}>{sc.descripcion}</div>
            <div style={{ display:'flex', gap:16, fontSize:12, color:'#64748b' }}>
              <span>Proveedor: {sc.proveedor}</span>
              <span style={{ fontWeight:700, color:'#1e293b' }}>{fmt(sc.valor)}</span>
              <span>Sesión: {sc.acta_sesion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Sesiones','Compromisos','Subcontratos'];

export default function SecretariaComitePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Sesiones');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Secretaría Técnica y Comité</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Sesiones'       && <TabSesiones showToast={showToast} />}
      {tab === 'Compromisos'    && <TabCompromisos />}
      {tab === 'Subcontratos'   && <TabSubcontratos showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
