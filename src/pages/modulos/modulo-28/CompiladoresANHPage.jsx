import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#0891B2';
const META  = modulos.find(m => m.id === 28);

const DESEMBOLSOS = [
  { id:'D1', nombre:'Plan de trabajo', fecha_limite:'2024-01-31', estado:'Entregado', version:'v3', modulos_req:['M01','M02','M03'] },
  { id:'D2', nombre:'35% ejecución',   fecha_limite:'2024-06-30', estado:'Entregado', version:'v2', modulos_req:['M01','M02','M03','M07','M14','M21','M22'] },
  { id:'D3', nombre:'70% ejecución',   fecha_limite:'2024-12-31', estado:'En elaboración', version:'v1_borrador', modulos_req:['M01','M02','M03','M07','M14','M21','M22','M27','M28'] },
  { id:'D4', nombre:'Cierre final',    fecha_limite:'2025-06-30', estado:'Pendiente',version:'—', modulos_req:['todos'] },
];

const DOCUMENTOS = [
  { id:'DOC-001', nombre:'Informe narrativo D3',    desembolso:'D3', version:'v1_borrador', autor:'Coord. Técnico', fecha:'2024-12-01', estado:'Borrador',  paginas:42 },
  { id:'DOC-002', nombre:'Matrices de indicadores', desembolso:'D3', version:'v1_borrador', autor:'Coord. M&E',     fecha:'2024-12-02', estado:'Borrador',  paginas:18 },
  { id:'DOC-003', nombre:'Ejecución financiera D3', desembolso:'D3', version:'v1_borrador', autor:'Dir. Financiero',fecha:'2024-12-03', estado:'Revisión',  paginas:12 },
  { id:'DOC-004', nombre:'Informe narrativo D2',    desembolso:'D2', version:'v2',           autor:'Coord. Técnico', fecha:'2024-07-10', estado:'Aprobado',  paginas:38 },
  { id:'DOC-005', nombre:'Soportes fotográficos D2',desembolso:'D2', version:'v2',           autor:'Varios',         fecha:'2024-07-08', estado:'Aprobado',  paginas:95 },
];

const INDICADORES = [
  { id:'IND-01', nombre:'Beneficiarios con acceso a agua potable', meta:500,  avance:342, unidad:'personas' },
  { id:'IND-02', nombre:'Hectáreas con manejo sostenible',         meta:1200, avance:845, unidad:'Ha' },
  { id:'IND-03', nombre:'Organizaciones fortalecidas',             meta:12,   avance:9,   unidad:'orgs' },
  { id:'IND-04', nombre:'Personal capacitado',                     meta:80,   avance:68,  unidad:'personas' },
  { id:'IND-05', nombre:'Planes comunitarios formulados',          meta:8,    avance:6,   unidad:'planes' },
];

const ESTADO_CFG = {
  'Aprobado':       { bg:'#dcfce7', c:'#15803d' },
  'Entregado':      { bg:'#dcfce7', c:'#15803d' },
  'Revisión':       { bg:'#fef9c3', c:'#b45309' },
  'En elaboración': { bg:'#dbeafe', c:'#1d4ed8' },
  'Borrador':       { bg:'#f1f5f9', c:'#64748b' },
  'Pendiente':      { bg:'#f1f5f9', c:'#94a3b8' },
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

function TabDesembolsos({ showToast }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {DESEMBOLSOS.map(d => {
          const cfg = ESTADO_CFG[d.estado] || ESTADO_CFG['Pendiente'];
          return (
            <div key={d.id} style={{ background:'#fff', border:`1px solid ${cfg.c}44`, borderRadius:12, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:COLOR, marginBottom:4 }}>{d.id}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginBottom:8 }}>{d.nombre}</div>
              <span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:6, padding:'2px 8px' }}>{d.estado}</span>
              <div style={{ fontSize:11, color:'#64748b', marginTop:8 }}>Versión: <span style={{ fontFamily:'monospace', fontWeight:600 }}>{d.version}</span></div>
              <div style={{ fontSize:10, color:'#94a3b8', marginTop:4 }}>Límite: {d.fecha_limite}</div>
              <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:4 }}>
                {d.modulos_req.slice(0,3).map(m => <span key={m} style={{ fontSize:10, background:'#f1f5f9', color:'#475569', borderRadius:4, padding:'1px 5px', fontFamily:'monospace' }}>{m}</span>)}
                {d.modulos_req.length > 3 && <span style={{ fontSize:10, color:'#94a3b8' }}>+{d.modulos_req.length-3}</span>}
              </div>
              {d.estado === 'En elaboración' && (
                <button onClick={()=>showToast(`${d.id} subido a revisión (demo)`)} style={{ marginTop:10, width:'100%', padding:'5px 0', borderRadius:6, background:COLOR, color:'#fff', border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Subir borrador →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabDocumentos({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Documento subido (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Subir documento
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Nombre','Desembolso','Versión','Autor','Fecha','Páginas','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {DOCUMENTOS.map(d => {
              const cfg = ESTADO_CFG[d.estado] || ESTADO_CFG['Borrador'];
              return (
                <tr key={d.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{d.id}</td>
                  <td style={{...TD, fontWeight:500, color:'#1e293b'}}>{d.nombre}</td>
                  <td style={TD}><span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR }}>{d.desembolso}</span></td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{d.version}</td>
                  <td style={TD}>{d.autor}</td>
                  <td style={TD}>{d.fecha}</td>
                  <td style={{...TD, textAlign:'center'}}>{d.paginas}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:6, padding:'2px 8px' }}>{d.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabIndicadores() {
  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {INDICADORES.map(ind => {
          const pct = Math.round((ind.avance/ind.meta)*100);
          const c = pct>=80?'#15803d':pct>=50?COLOR:'#dc2626';
          return (
            <div key={ind.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div>
                  <span style={{ fontFamily:'monospace', fontSize:11, color:COLOR, fontWeight:700 }}>{ind.id}</span>
                  <span style={{ marginLeft:10, fontSize:13, fontWeight:600, color:'#1e293b' }}>{ind.nombre}</span>
                </div>
                <span style={{ fontSize:22, fontWeight:900, color:c }}>{pct}%</span>
              </div>
              <div style={{ height:10, background:'#e2e8f0', borderRadius:99, marginBottom:8 }}>
                <div style={{ width:`${Math.min(pct,100)}%`, height:'100%', borderRadius:99, background:c }}/>
              </div>
              <div style={{ display:'flex', gap:16, fontSize:12 }}>
                <span style={{ color:'#64748b' }}>Meta: <span style={{ fontWeight:700, color:'#1e293b' }}>{ind.meta.toLocaleString('es-CO')} {ind.unidad}</span></span>
                <span style={{ color:'#64748b' }}>Avance: <span style={{ fontWeight:700, color:c }}>{ind.avance.toLocaleString('es-CO')} {ind.unidad}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ['Desembolsos ANH','Documentos','Indicadores'];

export default function CompiladoresANHPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Desembolsos ANH');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Compiladores ANH</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Desembolsos ANH' && <TabDesembolsos showToast={showToast} />}
      {tab === 'Documentos'      && <TabDocumentos showToast={showToast} />}
      {tab === 'Indicadores'     && <TabIndicadores />}
      <Toast {...toast} />
    </div>
  );
}
