import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#475569';
const META  = modulos.find(m => m.id === 39);

const SERVICIOS = [
  { id:'svc-01', nombre:'App Web (React)',       tipo:'Frontend', estado:'Operativo', uptime:'99.8%', latencia:'120ms', version:'v2.4.1' },
  { id:'svc-02', nombre:'API Backend (Supabase)',tipo:'Backend',  estado:'Operativo', uptime:'99.9%', latencia:'45ms',  version:'v2.4.1' },
  { id:'svc-03', nombre:'Base de datos PostgreSQL',tipo:'DB',     estado:'Operativo', uptime:'99.9%', latencia:'8ms',   version:'PG 15.2' },
  { id:'svc-04', nombre:'Almacenamiento archivos',tipo:'Storage', estado:'Operativo', uptime:'100%',  latencia:'—',     version:'Supabase Storage' },
  { id:'svc-05', nombre:'Autenticación (Auth)',   tipo:'Auth',    estado:'Operativo', uptime:'99.9%', latencia:'32ms',  version:'Supabase Auth' },
  { id:'svc-06', nombre:'CDN (Cloudflare)',        tipo:'CDN',     estado:'Operativo', uptime:'100%',  latencia:'18ms',  version:'CF Pro' },
];

const BACKUPS = [
  { id:'BKP-001', fecha:'2024-12-05 02:00', tipo:'Automático', tamaño:'2.4 GB', estado:'Exitoso',  destino:'S3 Colombia' },
  { id:'BKP-002', fecha:'2024-12-04 02:00', tipo:'Automático', tamaño:'2.3 GB', estado:'Exitoso',  destino:'S3 Colombia' },
  { id:'BKP-003', fecha:'2024-12-03 02:00', tipo:'Automático', tamaño:'2.3 GB', estado:'Exitoso',  destino:'S3 Colombia' },
  { id:'BKP-004', fecha:'2024-12-02 02:00', tipo:'Automático', tamaño:'2.2 GB', estado:'Fallido',  destino:'S3 Colombia' },
  { id:'BKP-005', fecha:'2024-12-01 14:30', tipo:'Manual',     tamaño:'2.2 GB', estado:'Exitoso',  destino:'S3 Colombia + Local' },
];

const METRICAS_INFRA = [
  { label:'CPU promedio', val:'34%', c:'#15803d', desc:'Últimas 24h' },
  { label:'RAM utilizada', val:'62%', c:'#b45309', desc:'de 8 GB' },
  { label:'Disco',         val:'41%', c:'#15803d', desc:'de 500 GB' },
  { label:'Requests/hora', val:'1.240', c:'#0891b2', desc:'pico: 3.800' },
  { label:'Uptime global', val:'99.8%', c:'#15803d', desc:'últimos 30 días' },
  { label:'Backups OK',    val:'6/7',  c:'#b45309', desc:'últimos 7 días' },
];

const TIPO_COLOR = { 'Frontend':'#7c3aed','Backend':'#0891b2','DB':'#1d4ed8','Storage':'#059669','Auth':'#b45309','CDN':'#475569' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabDashboard({ showToast }) {
  const operativos = SERVICIOS.filter(s=>s.estado==='Operativo').length;
  return (
    <div>
      <div style={{ background:operativos===SERVICIOS.length?'#f0fdf4':'#fef9c3', border:`1px solid ${operativos===SERVICIOS.length?'#bbf7d0':'#fde68a'}`, borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ width:12, height:12, borderRadius:'50%', background:operativos===SERVICIOS.length?'#15803d':'#b45309', flexShrink:0, display:'inline-block' }}/>
        <span style={{ fontSize:13, fontWeight:700, color:operativos===SERVICIOS.length?'#14532d':'#92400e' }}>
          {operativos}/{SERVICIOS.length} servicios operativos — Sistema {operativos===SERVICIOS.length?'OK':'en mantenimiento'}
        </span>
      </div>
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {METRICAS_INFRA.map(m => (
          <div key={m.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{m.label}</div>
            <div style={{ fontSize:22, fontWeight:900, color:m.c }}>{m.val}</div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Estado de servicios</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {SERVICIOS.map(s => {
            const tc = TIPO_COLOR[s.tipo] || '#475569';
            return (
              <div key={s.id} style={{ display:'grid', gridTemplateColumns:'120px 140px 1fr 80px 80px 80px', gap:10, alignItems:'center', padding:'8px 12px', borderRadius:8, background:'#f8fafc' }}>
                <span style={{ fontSize:11, fontWeight:700, background:tc+'18', color:tc, borderRadius:5, padding:'2px 7px', textAlign:'center' }}>{s.tipo}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'#1e293b' }}>{s.nombre}</span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#15803d', display:'inline-block' }}/>
                  <span style={{ fontSize:12, color:'#15803d', fontWeight:700 }}>{s.estado}</span>
                </div>
                <span style={{ fontSize:11, color:'#64748b', textAlign:'right' }}>↑ {s.uptime}</span>
                <span style={{ fontSize:11, color:'#64748b', textAlign:'right' }}>{s.latencia}</span>
                <span style={{ fontSize:10, fontFamily:'monospace', color:'#94a3b8', textAlign:'right' }}>{s.version}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TabBackups({ showToast }) {
  const fallidos = BACKUPS.filter(b=>b.estado==='Fallido').length;
  return (
    <div>
      {fallidos > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#92400e' }}>
          ⚠ {fallidos} backup(s) fallido(s) en los últimos 7 días — verificar configuración S3
        </div>
      )}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <button onClick={()=>showToast('Backup manual iniciado (demo)')} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Backup manual ahora
        </button>
        <button onClick={()=>showToast('Restauración iniciada (demo)', false)} style={{ padding:'7px 14px', borderRadius:8, background:'#fee2e2', color:'#dc2626', border:'1px solid #fca5a5', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Restaurar backup
        </button>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Fecha','Tipo','Tamaño','Destino','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {BACKUPS.map(b => (
              <tr key={b.id} style={{ borderBottom:'1px solid #f1f5f9', background:b.estado==='Fallido'?'#fff5f5':'transparent' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{b.id}</td>
                <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{b.fecha}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:b.tipo==='Manual'?'#dbeafe':'#f1f5f9', color:b.tipo==='Manual'?'#1d4ed8':'#64748b', borderRadius:5, padding:'2px 7px' }}>{b.tipo}</span></td>
                <td style={TD}>{b.tamaño}</td>
                <td style={TD}>{b.destino}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:b.estado==='Exitoso'?'#dcfce7':'#fee2e2', color:b.estado==='Exitoso'?'#15803d':'#dc2626', borderRadius:6, padding:'2px 7px' }}>{b.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Dashboard Infraestructura','Backups'];

export default function InfraestructuraPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard Infraestructura');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Infraestructura TI</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Dashboard Infraestructura' && <TabDashboard showToast={showToast} />}
      {tab === 'Backups'                   && <TabBackups showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
