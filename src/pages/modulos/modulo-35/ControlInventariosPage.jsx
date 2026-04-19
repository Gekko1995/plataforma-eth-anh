import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#6D28D9';
const META  = modulos.find(m => m.id === 35);

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const INVENTARIO = [
  { id:'INV-001', nombre:'GPS Garmin eTrex 32x',       categoria:'Equipos',    cantidad:4, disponibles:3, valor_unit:890000,  codigo_qr:'QR-INV-001', asignado_a:'Luis Torres',    estado:'Bueno' },
  { id:'INV-002', nombre:'Computador portátil Dell',    categoria:'TI',         cantidad:6, disponibles:4, valor_unit:3200000, codigo_qr:'QR-INV-002', asignado_a:'Varios',         estado:'Bueno' },
  { id:'INV-003', nombre:'Vehículo Ford F-150',         categoria:'Vehículos',  cantidad:1, disponibles:0, valor_unit:95000000,codigo_qr:'QR-INV-003', asignado_a:'Coord. Logística',estado:'Bueno' },
  { id:'INV-004', nombre:'Drone DJI Mini 3',            categoria:'Equipos',    cantidad:1, disponibles:1, valor_unit:4800000, codigo_qr:'QR-INV-004', asignado_a:'—',              estado:'Bueno' },
  { id:'INV-005', nombre:'Cámara Sony HX400V',          categoria:'Equipos',    cantidad:2, disponibles:1, valor_unit:1200000, codigo_qr:'QR-INV-005', asignado_a:'Ana Gómez',      estado:'Regular' },
  { id:'INV-006', nombre:'Kit botiquín campo',          categoria:'HSE',        cantidad:5, disponibles:3, valor_unit:180000,  codigo_qr:'QR-INV-006', asignado_a:'Varios',         estado:'Bueno' },
  { id:'INV-007', nombre:'Equipo comunicación satelital',categoria:'Comunicaciones',cantidad:2,disponibles:2,valor_unit:3500000,codigo_qr:'QR-INV-007',asignado_a:'—',             estado:'Bueno' },
];

const ACTAS = [
  { id:'ACTA-001', tipo:'Entrega', fecha:'2024-11-05', responsable:'Luis Torres',     items:['INV-001','INV-005'], firmada:true },
  { id:'ACTA-002', tipo:'Entrega', fecha:'2024-10-15', responsable:'Coord. Logística',items:['INV-003'],           firmada:true },
  { id:'ACTA-003', tipo:'Devolución',fecha:'2024-12-01',responsable:'Ana Gómez',      items:['INV-002'],           firmada:true },
];

const CAT_COLOR = { 'Equipos':'#7c3aed','TI':'#0891b2','Vehículos':'#b45309','HSE':'#059669','Comunicaciones':'#0369a1' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#ede9fe', color:'#6d28d9', border:'1px solid #ddd6fe', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#3b0764' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#6d28d9', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#ede9fe', color:'#6d28d9', border:'1px solid #ddd6fe', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabInventario({ showToast }) {
  const totalValor = INVENTARIO.reduce((s,i)=>s+i.valor_unit*i.cantidad,0);
  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Ítems registrados', val:INVENTARIO.length, c:COLOR },
          { label:'Valor total inventario', val:fmt(totalValor), c:'#1e293b' },
          { label:'Disponibles', val:INVENTARIO.reduce((s,i)=>s+i.disponibles,0), c:'#15803d' },
          { label:'Asignados', val:INVENTARIO.reduce((s,i)=>s+(i.cantidad-i.disponibles),0), c:'#b45309' },
        ].map(k => <div key={k.label} className="kpi-card"><div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div><div style={{ fontSize:18, fontWeight:800, color:k.c }}>{k.val}</div></div>)}
      </div>
      <button onClick={()=>showToast('Ítem registrado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar ítem
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Nombre','Categoría','Total','Disp.','Valor unit.','QR','Asignado','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {INVENTARIO.map(it => {
              const cc = CAT_COLOR[it.categoria] || '#475569';
              return (
                <tr key={it.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{it.id}</td>
                  <td style={{...TD, fontWeight:500, color:'#1e293b'}}>{it.nombre}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cc+'18', color:cc, borderRadius:5, padding:'2px 7px' }}>{it.categoria}</span></td>
                  <td style={{...TD, textAlign:'center'}}>{it.cantidad}</td>
                  <td style={{...TD, textAlign:'center', fontWeight:700, color:it.disponibles>0?'#15803d':'#dc2626'}}>{it.disponibles}</td>
                  <td style={{...TD, fontSize:12}}>{fmt(it.valor_unit)}</td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:10}}>
                    <button onClick={()=>showToast(`QR ${it.codigo_qr} generado (demo)`)} style={{ padding:'2px 7px', borderRadius:5, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:10, fontWeight:700, cursor:'pointer' }}>▣ {it.codigo_qr}</button>
                  </td>
                  <td style={{...TD, fontSize:12}}>{it.asignado_a}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:it.estado==='Bueno'?'#15803d':'#b45309' }}>{it.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabActas({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Acta de entrega generada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Nueva acta
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {ACTAS.map(a => (
          <div key={a.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:800, color:COLOR }}>{a.id}</span>
                <span style={{ fontSize:11, fontWeight:700, background:a.tipo==='Entrega'?'#ede9fe':'#fef9c3', color:a.tipo==='Entrega'?COLOR:'#b45309', borderRadius:5, padding:'2px 7px' }}>{a.tipo}</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, background:a.firmada?'#dcfce7':'#fee2e2', color:a.firmada?'#15803d':'#dc2626', borderRadius:6, padding:'2px 8px' }}>{a.firmada?'Firmada':'Sin firmar'}</span>
            </div>
            <div style={{ display:'flex', gap:16, fontSize:12, color:'#64748b', marginBottom:8 }}>
              <span>📅 {a.fecha}</span>
              <span>👤 {a.responsable}</span>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {a.items.map(i => <span key={i} style={{ fontSize:11, fontFamily:'monospace', background:'#f5f3ff', color:COLOR, borderRadius:5, padding:'2px 7px' }}>{i}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Inventario','Actas de Entrega'];

export default function ControlInventariosPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Inventario');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Control de Inventarios</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Inventario'       && <TabInventario showToast={showToast} />}
      {tab === 'Actas de Entrega' && <TabActas showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
