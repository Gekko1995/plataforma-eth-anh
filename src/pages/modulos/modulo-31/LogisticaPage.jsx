import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#059669';
const META  = modulos.find(m => m.id === 31);

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const VIAJES = [
  { id:'VJ-001', destino:'Puerto Gaitán → Inírida', fecha:'2024-12-10', personas:4, transporte:'Aéreo', km:620, costo_est:3200000, estado:'Aprobado' },
  { id:'VJ-002', destino:'Bogotá → Mapiripán',      fecha:'2024-12-15', personas:2, transporte:'Fluvial+Terrestre', km:380, costo_est:1800000, estado:'Pendiente' },
  { id:'VJ-003', destino:'Villavicencio → Vichada', fecha:'2024-12-18', personas:3, transporte:'Terrestre', km:450, costo_est:900000, estado:'Aprobado' },
];

const CHECKLIST_LOGISTICA = [
  { id:'cl1', item:'Pasaporte / cédula vigente',       obligatorio:true,  checked:true },
  { id:'cl2', item:'Permiso ingreso resguardo',         obligatorio:true,  checked:true },
  { id:'cl3', item:'Botiquín primeros auxilios',        obligatorio:true,  checked:true },
  { id:'cl4', item:'GPS cargado y calibrado',           obligatorio:true,  checked:false },
  { id:'cl5', item:'Formularios campo impresos',        obligatorio:false, checked:true },
  { id:'cl6', item:'Comunicación satelital (Spot)',     obligatorio:true,  checked:false },
  { id:'cl7', item:'Seguro SOAT vehículo activo',       obligatorio:true,  checked:true },
  { id:'cl8', item:'Protocolo HSE firmado',             obligatorio:true,  checked:true },
];

const COTIZACIONES = [
  { id:'COT-001', proveedor:'Aerovías del Oriente', servicio:'Vuelo Bogotá-Inírida', valor:1600000, estado:'Seleccionado' },
  { id:'COT-002', proveedor:'Aerolínea SATENA',     servicio:'Vuelo Bogotá-Inírida', valor:1450000, estado:'Revisión' },
  { id:'COT-003', proveedor:'Flota Ganadera',       servicio:'Transporte fluvial río Guaviare', valor:520000, estado:'Seleccionado' },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#14532d' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#15803d', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabViajes({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Comisión registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Nueva comisión
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Destino','Fecha','Personas','Transporte','Distancia','Costo est.','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {VIAJES.map(v => (
              <tr key={v.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{v.id}</td>
                <td style={{...TD, fontWeight:500, color:'#1e293b'}}>{v.destino}</td>
                <td style={TD}>{v.fecha}</td>
                <td style={{...TD, textAlign:'center'}}>{v.personas}</td>
                <td style={TD}>{v.transporte}</td>
                <td style={TD}>{v.km} km</td>
                <td style={{...TD, fontWeight:700}}>{fmt(v.costo_est)}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:v.estado==='Aprobado'?'#dcfce7':'#fef9c3', color:v.estado==='Aprobado'?'#15803d':'#b45309', borderRadius:6, padding:'2px 8px' }}>{v.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:20, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Calculadora de viáticos</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[['Viático diario','$178.000 / día'],['Transporte urbano','$40.000 / día'],['Alojamiento zona remota','$250.000 / noche']].map(([l,v])=>(
            <div key={l} style={{ background:'#f0fdf4', borderRadius:8, padding:'10px 14px' }}>
              <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:14, fontWeight:800, color:COLOR }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabChecklist({ showToast }) {
  const [items, setItems] = useState(CHECKLIST_LOGISTICA);
  const toggle = (id) => setItems(prev => prev.map(it => it.id===id ? {...it, checked:!it.checked} : it));
  const completados = items.filter(i=>i.checked).length;
  const obligatoriosOk = items.filter(i=>i.obligatorio && !i.checked).length === 0;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#1e293b' }}>Checklist comisión VJ-001</div>
        <span style={{ fontSize:13, fontWeight:700, color:obligatoriosOk?'#15803d':'#dc2626' }}>{completados}/{items.length} ítems {obligatoriosOk?'✓ Listo para salida':'⚠ Obligatorios pendientes'}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {items.map(it => (
          <div key={it.id} onClick={()=>toggle(it.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#fff', border:`1px solid ${it.checked?'#bbf7d0':'#e2e8f0'}`, borderRadius:9, cursor:'pointer' }}>
            <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${it.checked?COLOR:'#cbd5e1'}`, background:it.checked?COLOR:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
              {it.checked && <span style={{ color:'#fff', fontSize:12, fontWeight:900 }}>✓</span>}
            </div>
            <span style={{ fontSize:13, color:it.checked?'#1e293b':'#64748b', fontWeight:it.checked?500:400, flex:1 }}>{it.item}</span>
            {it.obligatorio && <span style={{ fontSize:10, fontWeight:700, color:'#dc2626', background:'#fee2e2', borderRadius:4, padding:'1px 6px' }}>Obligatorio</span>}
          </div>
        ))}
      </div>
      <button onClick={()=>showToast('Checklist confirmado — salida autorizada (demo)')} disabled={!obligatoriosOk} style={{ padding:'8px 16px', borderRadius:8, background:obligatoriosOk?COLOR:'#94a3b8', color:'#fff', border:'none', fontSize:13, fontWeight:700, cursor:obligatoriosOk?'pointer':'not-allowed' }}>
        Confirmar salida →
      </button>
    </div>
  );
}

function TabCotizaciones({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Cotización registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar cotización
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Proveedor','Servicio','Valor','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {COTIZACIONES.map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{c.id}</td>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{c.proveedor}</td>
                <td style={TD}>{c.servicio}</td>
                <td style={{...TD, fontWeight:700}}>{fmt(c.valor)}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:c.estado==='Seleccionado'?'#dcfce7':'#fef9c3', color:c.estado==='Seleccionado'?'#15803d':'#b45309', borderRadius:6, padding:'2px 8px' }}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Comisiones','Checklist de Campo','Cotizaciones'];

export default function LogisticaPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Comisiones');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Logística y Movilización</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Comisiones'          && <TabViajes showToast={showToast} />}
      {tab === 'Checklist de Campo'  && <TabChecklist showToast={showToast} />}
      {tab === 'Cotizaciones'        && <TabCotizaciones showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
