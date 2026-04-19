import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#475569';
const META  = modulos.find(m => m.id === 38);

const HOY = new Date('2024-12-05 15:00');
const horasDesde = (ts) => Math.floor((HOY - new Date(ts)) / 3600000);

const TICKETS = [
  { id:'TKT-001', titulo:'No puedo acceder al módulo financiero', usuario:'prof.ambiental@fundwrts.org', prioridad:'Alta',  categoria:'Acceso',    creado:'2024-12-05 09:30', estado:'Resuelto',  sla:4,  asignado:'Coord. TI' },
  { id:'TKT-002', titulo:'Error al exportar reporte PDF',          usuario:'coordinador@fundwrts.org',   prioridad:'Media', categoria:'Bug',       creado:'2024-12-05 10:45', estado:'En proceso', sla:8,  asignado:'Coord. TI' },
  { id:'TKT-003', titulo:'Capacitación uso módulo beneficiarios',  usuario:'prof.social@fundwrts.org',   prioridad:'Baja',  categoria:'Capacitación',creado:'2024-12-04 14:00',estado:'Abierto',   sla:24, asignado:'Sin asignar' },
  { id:'TKT-004', titulo:'Contraseña olvidada — acceso urgente',   usuario:'financiero2@fundwrts.org',   prioridad:'Alta',  categoria:'Acceso',    creado:'2024-12-05 13:00', estado:'En proceso', sla:4,  asignado:'Coord. TI' },
  { id:'TKT-005', titulo:'Solicitud creación nuevo usuario',       usuario:'admin@fundwrts.org',          prioridad:'Media', categoria:'Usuarios',  creado:'2024-12-03 08:00', estado:'Cerrado',   sla:8,  asignado:'Admin' },
];

const FAQ = [
  { id:'f1', pregunta:'¿Cómo restablecer mi contraseña?',           respuesta:'Ve a la pantalla de login y haz clic en "Olvidé mi contraseña". Recibirás un correo con instrucciones.' },
  { id:'f2', pregunta:'¿Cómo exportar un reporte en PDF?',          respuesta:'En la vista del módulo, busca el botón "Exportar PDF" en la parte inferior. Asegúrate de tener los permisos de exportación.' },
  { id:'f3', pregunta:'¿Qué hago si no veo el módulo asignado?',    respuesta:'Contacta a tu administrador. Es posible que el módulo no esté en tu grupo de acceso.' },
  { id:'f4', pregunta:'¿Cómo registrar un nuevo beneficiario?',     respuesta:'Accede al Módulo 14 (Gestión de Beneficiarios), pestaña "Padrón Maestro" y usa el botón "+ Nuevo beneficiario".' },
  { id:'f5', pregunta:'¿Cada cuánto se hacen backups del sistema?', respuesta:'Se realizan backups automáticos cada 24 horas. Puedes consultar el estado en el Módulo 39 (Infraestructura TI).' },
];

const PRIOR_CFG = { 'Alta':{ bg:'#fee2e2', c:'#dc2626' }, 'Media':{ bg:'#fef9c3', c:'#b45309' }, 'Baja':{ bg:'#dcfce7', c:'#15803d' } };
const EST_CFG   = { 'Abierto':{ bg:'#dbeafe', c:'#1d4ed8' }, 'En proceso':{ bg:'#fef9c3', c:'#b45309' }, 'Resuelto':{ bg:'#dcfce7', c:'#15803d' }, 'Cerrado':{ bg:'#f1f5f9', c:'#94a3b8' } };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#f1f5f9', color:'#475569', border:'1px solid #e2e8f0', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#1e293b' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#475569', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#f1f5f9', color:'#475569', border:'1px solid #e2e8f0', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabTickets({ showToast }) {
  const vencidos = TICKETS.filter(t => { const h = horasDesde(t.creado); return t.estado!=='Resuelto' && t.estado!=='Cerrado' && h > t.sla; });
  return (
    <div>
      {vencidos.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ {vencidos.length} ticket(s) con SLA vencido — atención inmediata requerida
        </div>
      )}
      <button onClick={()=>showToast('Ticket creado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Nuevo ticket
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Título','Usuario','Prioridad','Categoría','Horas','SLA','Asignado','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {TICKETS.map(t => {
              const h = horasDesde(t.creado);
              const slaOk = t.estado==='Resuelto'||t.estado==='Cerrado'||h<=t.sla;
              const pc = PRIOR_CFG[t.prioridad];
              const ec = EST_CFG[t.estado];
              return (
                <tr key={t.id} style={{ borderBottom:'1px solid #f1f5f9', background:!slaOk?'#fff5f5':'transparent' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{t.id}</td>
                  <td style={{...TD, fontWeight:500, color:'#1e293b', maxWidth:200}}>{t.titulo}</td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{t.usuario}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:pc.bg, color:pc.c, borderRadius:6, padding:'2px 7px' }}>{t.prioridad}</span></td>
                  <td style={TD}>{t.categoria}</td>
                  <td style={{...TD, fontWeight:700, color:slaOk?'#475569':'#dc2626'}}>{h}h</td>
                  <td style={{...TD, fontWeight:700, color:'#64748b'}}>SLA {t.sla}h {!slaOk&&<span style={{color:'#dc2626'}}>⚠</span>}</td>
                  <td style={TD}>{t.asignado}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:ec.bg, color:ec.c, borderRadius:6, padding:'2px 7px' }}>{t.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabFAQ() {
  const [abierto, setAbierto] = useState(null);
  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {FAQ.map(f => (
          <div key={f.id} style={{ background:'#fff', border:`1px solid ${abierto===f.id?COLOR:'#e2e8f0'}`, borderRadius:10, overflow:'hidden' }}>
            <button onClick={()=>setAbierto(abierto===f.id?null:f.id)} style={{ width:'100%', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{f.pregunta}</span>
              <span style={{ fontSize:16, color:COLOR, fontWeight:700 }}>{abierto===f.id?'−':'+'}</span>
            </button>
            {abierto===f.id && (
              <div style={{ padding:'0 16px 14px', fontSize:13, color:'#475569', lineHeight:1.6 }}>{f.respuesta}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Tickets de Soporte','Base de Conocimiento (FAQ)'];

export default function MesaAyudaPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Tickets de Soporte');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Mesa de Ayuda</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Tickets de Soporte'          && <TabTickets showToast={showToast} />}
      {tab === 'Base de Conocimiento (FAQ)'  && <TabFAQ />}
      <Toast {...toast} />
    </div>
  );
}
