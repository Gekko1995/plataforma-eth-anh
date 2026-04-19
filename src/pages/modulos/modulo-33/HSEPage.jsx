import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#059669';
const META  = modulos.find(m => m.id === 33);

const INCIDENTES = [
  { id:'INC-001', fecha:'2024-11-14', tipo:'Casi-accidente', descripcion:'Caída menor en terreno pantanoso', persona:'Luis Torres', gravedad:'Leve', estado:'Cerrado',    accion:'Actualización protocolo botas campo' },
  { id:'INC-002', fecha:'2024-10-22', tipo:'Incidente',      descripcion:'Corte con herramienta de campo',   persona:'Ana Gómez',   gravedad:'Leve', estado:'Cerrado',    accion:'Capacitación uso herramientas' },
  { id:'INC-003', fecha:'2024-12-02', tipo:'Peligro',        descripcion:'Nido de avispas en área trabajo',   persona:'—',           gravedad:'Medio',estado:'En trámite', accion:'Fumigación área pendiente' },
];

const EPP = [
  { id:'E01', nombre:'Casco de seguridad',    cantidad:12, estado:'Bueno',    vigencia:'2025-06-30', asignado:'Personal campo' },
  { id:'E02', nombre:'Botas punta acero',     cantidad:8,  estado:'Bueno',    vigencia:'2025-03-15', asignado:'Personal campo' },
  { id:'E03', nombre:'Chaleco reflectivo',    cantidad:15, estado:'Bueno',    vigencia:'2025-12-31', asignado:'Todo el personal' },
  { id:'E04', nombre:'Guantes de nitrilo',    cantidad:200,estado:'Bueno',    vigencia:'2024-12-31', asignado:'Laboratorio' },
  { id:'E05', nombre:'Gafas de seguridad',    cantidad:10, estado:'Regular',  vigencia:'2024-10-01', asignado:'Personal campo' },
  { id:'E06', nombre:'Mascarilla N95',        cantidad:50, estado:'Bueno',    vigencia:'2025-06-30', asignado:'Laboratorio' },
];

const INSPECCIONES = [
  { id:'INS-001', area:'Sede principal',     fecha:'2024-11-28', inspector:'Coord. HSE', resultado:'Conforme',     hallazgos:1 },
  { id:'INS-002', area:'Vehículo F-150',     fecha:'2024-11-25', inspector:'Coord. HSE', resultado:'No conforme', hallazgos:3 },
  { id:'INS-003', area:'Bodega insumos',     fecha:'2024-12-01', inspector:'Coord. HSE', resultado:'Conforme',     hallazgos:0 },
];

const HOY = new Date('2024-12-05');
const diasParaVencer = (f) => Math.floor((new Date(f) - HOY) / 86400000);

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

function TabIncidentes({ showToast }) {
  const [paso, setPaso] = useState(0);
  const PASOS = ['1. Datos básicos','2. Descripción','3. Acción correctiva'];
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Reportar incidente — {PASOS[paso]}</h3>
        <div style={{ display:'flex', gap:0, marginBottom:16 }}>
          {PASOS.map((p,i) => (
            <div key={i} style={{ flex:1, display:'flex', alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:i<=paso?COLOR:'#e2e8f0', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1, height:2, background:i<paso?COLOR:'#e2e8f0' }}/>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {paso > 0 && <button onClick={()=>setPaso(p=>p-1)} style={{ padding:'7px 14px', borderRadius:8, background:'#f1f5f9', color:'#475569', border:'none', fontSize:12, fontWeight:600, cursor:'pointer' }}>← Atrás</button>}
          <button onClick={()=>{ if (paso < 2) setPaso(p=>p+1); else showToast('Incidente reportado — notificando ARL (demo)'); }} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            {paso < 2 ? 'Siguiente →' : 'Enviar reporte'}
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Fecha','Tipo','Descripción','Persona','Gravedad','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {INCIDENTES.map(inc => {
              const gc = inc.gravedad==='Leve'?'#15803d':inc.gravedad==='Medio'?'#b45309':'#dc2626';
              return (
                <tr key={inc.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{inc.id}</td>
                  <td style={TD}>{inc.fecha}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:'#f1f5f9', color:'#64748b', borderRadius:5, padding:'2px 7px' }}>{inc.tipo}</span></td>
                  <td style={{...TD, fontSize:12}}>{inc.descripcion}</td>
                  <td style={TD}>{inc.persona}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:gc }}>{inc.gravedad}</span></td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:inc.estado==='Cerrado'?'#dcfce7':'#fef9c3', color:inc.estado==='Cerrado'?'#15803d':'#b45309', borderRadius:6, padding:'2px 7px' }}>{inc.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabEPP({ showToast }) {
  const vencidos = EPP.filter(e => diasParaVencer(e.vigencia) < 0);
  const porVencer = EPP.filter(e => diasParaVencer(e.vigencia) >= 0 && diasParaVencer(e.vigencia) <= 30);
  return (
    <div>
      {vencidos.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:10, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ {vencidos.length} EPP vencido(s) — requiere reposición inmediata
        </div>
      )}
      {porVencer.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#92400e' }}>
          {porVencer.length} EPP por vencer en ≤30 días
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
        {EPP.map(e => {
          const dias = diasParaVencer(e.vigencia);
          const alerta = dias < 0 ? 'rojo' : dias <= 30 ? 'amarillo' : 'verde';
          const cfg = alerta==='rojo'?{bg:'#fee2e2',c:'#dc2626'}:alerta==='amarillo'?{bg:'#fef9c3',c:'#b45309'}:{bg:'#dcfce7',c:'#15803d'};
          return (
            <div key={e.id} style={{ background:'#fff', border:`1px solid ${cfg.c}44`, borderRadius:12, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{e.nombre}</span>
                <span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.c, borderRadius:5, padding:'2px 7px' }}>{alerta==='rojo'?'Vencido':alerta==='amarillo'?'Por vencer':'Vigente'}</span>
              </div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Cantidad: <span style={{ fontWeight:700 }}>{e.cantidad}</span> · Estado: <span style={{ fontWeight:700 }}>{e.estado}</span></div>
              <div style={{ fontSize:11, color:cfg.c, fontWeight:600 }}>Vigencia: {e.vigencia} {dias < 0 ? `(${Math.abs(dias)}d vencido)` : `(${dias}d restantes)`}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{e.asignado}</div>
              {alerta !== 'verde' && (
                <button onClick={()=>showToast(`${e.nombre} repuesto (demo)`)} style={{ marginTop:10, width:'100%', padding:'5px 0', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Reponer →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabInspecciones({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Inspección registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar inspección
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Área','Fecha','Inspector','Resultado','Hallazgos'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {INSPECCIONES.map(ins => (
              <tr key={ins.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{ins.id}</td>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{ins.area}</td>
                <td style={TD}>{ins.fecha}</td>
                <td style={TD}>{ins.inspector}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:ins.resultado==='Conforme'?'#dcfce7':'#fee2e2', color:ins.resultado==='Conforme'?'#15803d':'#dc2626', borderRadius:6, padding:'2px 8px' }}>{ins.resultado}</span></td>
                <td style={{...TD, textAlign:'center', fontWeight:700, color:ins.hallazgos>0?'#b45309':'#15803d'}}>{ins.hallazgos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Reporte Incidentes','EPP Tracker','Inspecciones'];

export default function HSEPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Reporte Incidentes');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>HSE — Seguridad y Salud</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Reporte Incidentes' && <TabIncidentes showToast={showToast} />}
      {tab === 'EPP Tracker'        && <TabEPP showToast={showToast} />}
      {tab === 'Inspecciones'       && <TabInspecciones showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
