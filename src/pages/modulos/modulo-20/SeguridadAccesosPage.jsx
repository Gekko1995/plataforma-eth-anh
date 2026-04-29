import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 20);

const ROLES = [
  { id:'r1', nombre:'super_root',    desc:'Acceso total al sistema',            mfa:true,  usuarios:1  },
  { id:'r2', nombre:'admin',         desc:'Gestión de usuarios y módulos',       mfa:true,  usuarios:2  },
  { id:'r3', nombre:'financiero',    desc:'Módulos E y reportes financieros',    mfa:true,  usuarios:3  },
  { id:'r4', nombre:'coordinador',   desc:'Informes, personal y seguimiento',    mfa:false, usuarios:4  },
  { id:'r5', nombre:'profesional',   desc:'Módulos propios según asignación',    mfa:false, usuarios:12 },
  { id:'r6', nombre:'consulta',      desc:'Solo lectura en módulos autorizados', mfa:false, usuarios:5  },
];

const LOGS = [
  { id:'l001', usuario:'admin@fundwrts.org',        modulo:'Usuarios',     accion:'CREAR_USUARIO',   ts:'2024-12-05 14:32:11', ip:'192.168.1.45' },
  { id:'l002', usuario:'financiero1@fundwrts.org',  modulo:'Gest. Financiera',accion:'VER_EGRESO',   ts:'2024-12-05 14:18:03', ip:'192.168.1.22' },
  { id:'l003', usuario:'coordinador@fundwrts.org',  modulo:'Informes',     accion:'APROBAR_INFORME', ts:'2024-12-05 13:55:47', ip:'10.0.0.5' },
  { id:'l004', usuario:'prof.ambiental@fundwrts.org',modulo:'M6 Ambiental',accion:'EDITAR_CAR',     ts:'2024-12-05 13:40:22', ip:'192.168.1.10' },
  { id:'l005', usuario:'admin@fundwrts.org',        modulo:'Permisos',     accion:'EDITAR_PERMISOS', ts:'2024-12-05 12:55:00', ip:'192.168.1.45' },
  { id:'l006', usuario:'desconocido',               modulo:'Login',        accion:'LOGIN_FALLIDO×5', ts:'2024-12-05 11:22:33', ip:'45.67.89.100' },
  { id:'l007', usuario:'financiero2@fundwrts.org',  modulo:'Cuentas Cobro',accion:'APROBAR_CUENTA',  ts:'2024-12-05 10:50:15', ip:'192.168.1.30' },
  { id:'l008', usuario:'prof.social@fundwrts.org',  modulo:'M15 Directorio',accion:'VER_ACTOR',     ts:'2024-12-05 10:30:08', ip:'10.0.0.8' },
];

const MODULOS_PERMISOS = [
  { mod:'Diagnóstico',  ver:true,  editar:true,  aprobar:false, exportar:true  },
  { mod:'Gestión Financiera', ver:true, editar:true, aprobar:true, exportar:true },
  { mod:'Beneficiarios',ver:true,  editar:false, aprobar:false, exportar:false },
  { mod:'Personal',     ver:true,  editar:true,  aprobar:true,  exportar:true  },
  { mod:'Informes institucionales', ver:true, editar:false, aprobar:true, exportar:true },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabRoles({ showToast }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
        {ROLES.map(r => (
          <div key={r.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:800, color:'#1e293b' }}>{r.nombre}</span>
              {r.mfa && <span style={{ fontSize:10, fontWeight:700, background:'#dcfce7', color:'#15803d', border:'1px solid #86efac', borderRadius:6, padding:'2px 7px' }}>MFA</span>}
            </div>
            <p style={{ fontSize:12, color:'#64748b', margin:'0 0 10px', lineHeight:1.4 }}>{r.desc}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, color:'#94a3b8' }}>{r.usuarios} usuario(s)</span>
              <button onClick={()=>showToast(`Permisos de "${r.nombre}" editados (demo)`)} style={{ padding:'3px 9px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>Editar</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Matriz módulo × permiso (rol: financiero)</h3>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th style={TH}>Módulo</th>{['Ver','Editar','Aprobar','Exportar'].map(h=><th key={h} style={{...TH, textAlign:'center'}}>{h}</th>)}</tr></thead>
          <tbody>
            {MODULOS_PERMISOS.map(m => (
              <tr key={m.mod} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{m.mod}</td>
                {[m.ver, m.editar, m.aprobar, m.exportar].map((v,i) => (
                  <td key={i} style={{...TD, textAlign:'center'}}>{v ? <span style={{ color:'#15803d', fontWeight:700 }}>✓</span> : <span style={{ color:'#e2e8f0' }}>—</span>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabLogs() {
  const anomalia = LOGS.find(l => l.accion.includes('FALLIDO'));
  return (
    <div>
      {anomalia && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ Anomalía detectada: {anomalia.accion} desde {anomalia.ip} — usuario bloqueado automáticamente
        </div>
      )}
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Usuario','Módulo','Acción','Timestamp','IP'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {LOGS.map(l => {
              const anom = l.accion.includes('FALLIDO');
              return (
                <tr key={l.id} style={{ borderBottom:'1px solid #f1f5f9', background:anom?'#fff5f5':'transparent' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, color:anom?'#dc2626':'#475569', fontWeight:anom?700:400}}>{l.usuario}</td>
                  <td style={TD}>{l.modulo}</td>
                  <td style={TD}><span style={{ fontSize:11, background:anom?'#fee2e2':'#f1f5f9', color:anom?'#dc2626':'#475569', borderRadius:5, padding:'2px 7px', fontWeight:600, fontFamily:'monospace' }}>{l.accion}</span></td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{l.ts}</td>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{l.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Roles y Permisos','Log de Auditoría'];

export default function SeguridadAccesosPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Roles y Permisos');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Seguridad y Accesos</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Roles y Permisos'  && <TabRoles showToast={showToast} />}
      {tab === 'Log de Auditoría'  && <TabLogs />}
      <Toast {...toast} />
    </div>
  );
}
