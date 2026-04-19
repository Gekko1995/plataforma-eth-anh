import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 25);

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const ESTADOS = ['Necesidad','Cotización','Comité','Contratado','Ejecución','Liquidado'];

const ADQUISICIONES = [
  { id:'ADQ-001', descripcion:'Equipos GPS campo',          responsable:'Coord. Técnico', valor:18500000, estado:'Liquidado',  tipo:'Bien',    proveedor:'TecnoGIS S.A.S.',    fecha:'2024-03-10' },
  { id:'ADQ-002', descripcion:'Laboratorio análisis suelos',responsable:'Prof. Ambiental',valor:38000000, estado:'Ejecución', tipo:'Servicio',proveedor:'AgroLab S.A.S.',     fecha:'2024-07-15' },
  { id:'ADQ-003', descripcion:'Vehículo doble cabina',      responsable:'Dir. Administrativo',valor:95000000,estado:'Contratado',tipo:'Bien', proveedor:'Mazda Colombia',      fecha:'2024-10-01' },
  { id:'ADQ-004', descripcion:'Software SIG empresarial',   responsable:'Coord. TI',       valor:12000000, estado:'Comité',   tipo:'Servicio',proveedor:'En evaluación',      fecha:'2024-11-20' },
  { id:'ADQ-005', descripcion:'Insumos agrícolas Q1 2025',  responsable:'Prof. Agrónomo',  valor:24000000, estado:'Cotización',tipo:'Bien',   proveedor:'ICA certified',       fecha:'2024-12-01' },
  { id:'ADQ-006', descripcion:'Servicio transporte fluvial',responsable:'Coord. Territorial',valor:8500000,estado:'Necesidad', tipo:'Servicio',proveedor:'Por definir',        fecha:'2024-12-04' },
];

const TIPO_CFG = { 'Bien':{ bg:'#dbeafe', c:'#1d4ed8' }, 'Servicio':{ bg:'#ede9fe', c:'#7c3aed' } };

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

function TabKanban({ showToast }) {
  const cols = ESTADOS.map(e => ({ estado:e, items: ADQUISICIONES.filter(a=>a.estado===e) }));
  const colColors = { 'Necesidad':'#f1f5f9', 'Cotización':'#fef9c3', 'Comité':'#dbeafe', 'Contratado':'#ede9fe', 'Ejecución':'#fef3c7', 'Liquidado':'#dcfce7' };
  const colText   = { 'Necesidad':'#475569', 'Cotización':'#b45309', 'Comité':'#1d4ed8', 'Contratado':'#7c3aed', 'Ejecución':'#d97706', 'Liquidado':'#15803d' };
  return (
    <div>
      <button onClick={()=>showToast('Necesidad registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Nueva necesidad
      </button>
      <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8 }}>
        {cols.map(col => (
          <div key={col.estado} style={{ minWidth:200, flex:'0 0 200px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:colText[col.estado], background:colColors[col.estado], borderRadius:'8px 8px 0 0', padding:'6px 12px', textTransform:'uppercase', letterSpacing:'.04em', display:'flex', justifyContent:'space-between' }}>
              <span>{col.estado}</span>
              <span style={{ background:'rgba(0,0,0,.08)', borderRadius:10, padding:'1px 7px' }}>{col.items.length}</span>
            </div>
            <div style={{ background:'#f8fafc', borderRadius:'0 0 8px 8px', minHeight:120, padding:8, display:'flex', flexDirection:'column', gap:8 }}>
              {col.items.map(a => {
                const tc = TIPO_CFG[a.tipo];
                return (
                  <div key={a.id} onClick={()=>showToast(`${a.id} — avanzar etapa (demo)`)} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:9, padding:10, cursor:'pointer' }}>
                    <div style={{ fontSize:11, fontFamily:'monospace', color:COLOR, fontWeight:700, marginBottom:4 }}>{a.id}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e293b', marginBottom:6, lineHeight:1.3 }}>{a.descripcion}</div>
                    <span style={{ fontSize:10, fontWeight:700, background:tc.bg, color:tc.c, borderRadius:5, padding:'1px 6px' }}>{a.tipo}</span>
                    <div style={{ fontSize:11, fontWeight:700, color:'#1e293b', marginTop:6 }}>{fmt(a.valor)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabLista({ showToast }) {
  return (
    <div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Descripción','Tipo','Responsable','Proveedor','Valor','Fecha','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {ADQUISICIONES.map(a => {
              const tc = TIPO_CFG[a.tipo];
              const estIdx = ESTADOS.indexOf(a.estado);
              const estColor = ['#94a3b8','#b45309','#1d4ed8','#7c3aed','#d97706','#15803d'][estIdx] || '#94a3b8';
              return (
                <tr key={a.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{a.id}</td>
                  <td style={{...TD, fontWeight:500, color:'#1e293b'}}>{a.descripcion}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:tc.bg, color:tc.c, borderRadius:5, padding:'2px 7px' }}>{a.tipo}</span></td>
                  <td style={TD}>{a.responsable}</td>
                  <td style={TD}>{a.proveedor}</td>
                  <td style={{...TD, fontWeight:700}}>{fmt(a.valor)}</td>
                  <td style={TD}>{a.fecha}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:estColor }}>{a.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:20, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700 }}>Minuta tipo — contrato de servicios</h3>
        <div style={{ fontSize:12, color:'#64748b', lineHeight:2 }}>
          {['Partes contratantes','Objeto del contrato','Valor y forma de pago','Duración','Obligaciones del contratista','Supervisión','Cláusula de garantías','Solución de controversias'].map((c,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'4px 0', borderBottom:'1px solid #f8fafc' }}>
              <span style={{ width:20, height:20, borderRadius:'50%', background:'#f1f5f9', color:'#475569', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = ['Pipeline Kanban','Lista de Adquisiciones'];

export default function AdquisicionesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pipeline Kanban');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Adquisiciones y Contratación</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Pipeline Kanban'        && <TabKanban showToast={showToast} />}
      {tab === 'Lista de Adquisiciones' && <TabLista showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
