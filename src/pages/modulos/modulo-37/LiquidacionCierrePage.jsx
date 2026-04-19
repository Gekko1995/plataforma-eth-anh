import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#6D28D9';
const META  = modulos.find(m => m.id === 37);

const MODULOS_CHECKLIST = Array.from({length:39},(_,i)=>i+1).map(id => ({
  id,
  nombre: [
    'Diagnóstico Territorial','Mapeo SIG','Actores Clave','Consulta Previa','Iniciativas Productivas',
    'Lineamientos Ambientales','Inversión Social','Prevención y Diálogo','Marco Lógico','Campus Beneficiarios',
    'Campus Comunidades','Campus Personal','Aceleradora Exportadora','Gestión Beneficiarios','Directorio Actores',
    'Consulta Previa CIPRUNNA','Reclutamiento','Gestión Personal','Gestión Alianzas','Seguridad y Accesos',
    'Monitoreo Operativo','Gestión Financiera','Cuentas de Cobro','Secretaría Técnica','Adquisiciones',
    'Matriz Riesgos','Revisión Informes','Compiladores ANH','Gestión Conocimiento','Agenda Territorial',
    'Logística','Visibilidad y Prensa','HSE','Gestión Documental','Control Inventarios',
    'Pólizas y Garantías','Liquidación y Cierre','Mesa de Ayuda','Infraestructura TI'
  ][id-1],
  completado: id <= 28,
  paz_salvo: id <= 26,
}));

const PAZ_SALVOS = [
  { entidad:'ANH (contratante)',      estado:'Aprobado',  fecha:'2025-05-10' },
  { entidad:'DIAN',                   estado:'Aprobado',  fecha:'2025-04-28' },
  { entidad:'Seguridad Social',       estado:'Pendiente', fecha:null },
  { entidad:'Proveedores (contratos)',estado:'Pendiente', fecha:null },
  { entidad:'Empleados OPS',          estado:'Pendiente', fecha:null },
  { entidad:'Interventoría',          estado:'Aprobado',  fecha:'2025-05-08' },
];

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

function TabChecklist({ showToast }) {
  const completados = MODULOS_CHECKLIST.filter(m=>m.completado).length;
  const pct = Math.round((completados/39)*100);
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h3 style={{ margin:0, fontSize:15, fontWeight:800 }}>Avance global cierre — 39 módulos</h3>
          <span style={{ fontSize:28, fontWeight:900, color:pct>=80?'#15803d':COLOR }}>{pct}%</span>
        </div>
        <div style={{ height:14, background:'#e2e8f0', borderRadius:99, marginBottom:8 }}>
          <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:pct>=80?'#10b981':COLOR, transition:'width .4s' }}/>
        </div>
        <div style={{ fontSize:12, color:'#64748b' }}>{completados} de 39 módulos con entregables completos</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8 }}>
        {MODULOS_CHECKLIST.map(m => (
          <div key={m.id} style={{ background:'#fff', border:`1px solid ${m.completado?'#bbf7d0':'#e2e8f0'}`, borderRadius:8, padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:m.completado?'#dcfce7':'#f1f5f9', color:m.completado?'#15803d':'#94a3b8', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {m.completado ? '✓' : m.id}
            </div>
            <div>
              <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>M{m.id}</div>
              <div style={{ fontSize:11, color:m.completado?'#1e293b':'#94a3b8', fontWeight:m.completado?600:400, lineHeight:1.2 }}>{m.nombre}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>showToast('Certificado de cierre generado (demo)')} style={{ marginTop:20, padding:'8px 16px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:13, fontWeight:700, cursor:'pointer' }}>
        Generar certificado de cierre →
      </button>
    </div>
  );
}

function TabPazSalvos({ showToast }) {
  const aprobados = PAZ_SALVOS.filter(p=>p.estado==='Aprobado').length;
  const listo = aprobados === PAZ_SALVOS.length;
  return (
    <div>
      {!listo && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#92400e' }}>
          ⚠ {PAZ_SALVOS.length - aprobados} paz y salvo(s) pendiente(s) — no se puede liquidar el contrato
        </div>
      )}
      <div className="table-wrapper" style={{ marginBottom:20 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Entidad','Estado','Fecha','Acción'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {PAZ_SALVOS.map((p,i) => (
              <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{p.entidad}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:p.estado==='Aprobado'?'#dcfce7':'#fef9c3', color:p.estado==='Aprobado'?'#15803d':'#b45309', borderRadius:6, padding:'2px 8px' }}>{p.estado}</span></td>
                <td style={TD}>{p.fecha || '—'}</td>
                <td style={TD}>
                  {p.estado === 'Pendiente' && (
                    <button onClick={()=>showToast(`Paz y salvo ${p.entidad} gestionado (demo)`)} style={{ padding:'3px 9px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      Gestionar →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={()=>showToast(listo?'Acta de liquidación firmada (demo)':'Faltan paz y salvos para liquidar', listo)} disabled={!listo} style={{ padding:'8px 16px', borderRadius:8, background:listo?COLOR:'#94a3b8', color:'#fff', border:'none', fontSize:13, fontWeight:700, cursor:listo?'pointer':'not-allowed' }}>
        Firmar acta de liquidación →
      </button>
    </div>
  );
}

const TABS = ['Checklist 39 Módulos','Paz y Salvos'];

export default function LiquidacionCierrePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Checklist 39 Módulos');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Liquidación y Cierre</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Checklist 39 Módulos' && <TabChecklist showToast={showToast} />}
      {tab === 'Paz y Salvos'          && <TabPazSalvos showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
