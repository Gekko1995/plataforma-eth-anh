import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#0891B2';
const META  = modulos.find(m => m.id === 29);

const RECURSOS = [
  { id:'RC-001', titulo:'Manual de campo — recolección de datos',  tipo:'Manual',    autor:'Prof. Agrónomo',   fecha:'2024-10-15', categoria:'Técnico',     votos:12, descargas:47 },
  { id:'RC-002', titulo:'Protocolo consulta previa CIPRUNNA',       tipo:'Protocolo', autor:'Dir. Social',      fecha:'2024-09-20', categoria:'Social',       votos:9,  descargas:31 },
  { id:'RC-003', titulo:'Guía cartografía SIG básica',              tipo:'Guía',      autor:'Coord. TI',        fecha:'2024-11-01', categoria:'Técnico',      votos:15, descargas:62 },
  { id:'RC-004', titulo:'Plantillas informes mensuales',            tipo:'Plantilla', autor:'Coord. Técnico',   fecha:'2024-08-12', categoria:'Administrativo',votos:22, descargas:89 },
  { id:'RC-005', titulo:'Marco legal territorio étnico',            tipo:'Jurídico',  autor:'Asesor Legal',     fecha:'2024-07-05', categoria:'Jurídico',      votos:7,  descargas:28 },
  { id:'RC-006', titulo:'Catálogo de especies nativas cuenca',      tipo:'Catálogo',  autor:'Prof. Ambiental',  fecha:'2024-11-22', categoria:'Ambiental',     votos:18, descargas:55 },
];

const LECCIONES = [
  { id:'LL-001', titulo:'Ajuste metodología beneficiarios rurales', categoria:'Mejora proceso', impacto:'Alto', aplicado:true },
  { id:'LL-002', titulo:'Uso GPS offline en zonas sin señal',       categoria:'Técnico',         impacto:'Medio',aplicado:true },
  { id:'LL-003', titulo:'Protocolo lluvia épocas críticas',         categoria:'Operativo',       impacto:'Alto', aplicado:false },
];

const TIPO_COLOR = { 'Manual':'#1d4ed8', 'Protocolo':'#7c3aed', 'Guía':'#0891b2', 'Plantilla':'#059669', 'Jurídico':'#b45309', 'Catálogo':'#dc2626' };
const CAT_COLOR  = { 'Técnico':'#1d4ed8', 'Social':'#7c3aed', 'Administrativo':'#059669', 'Jurídico':'#b45309', 'Ambiental':'#15803d' };

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

function TabRepositorio({ showToast }) {
  const [buscar, setBuscar] = useState('');
  const filtrados = RECURSOS.filter(r => r.titulo.toLowerCase().includes(buscar.toLowerCase()) || r.categoria.toLowerCase().includes(buscar.toLowerCase()));
  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input value={buscar} onChange={e=>setBuscar(e.target.value)} placeholder="Buscar recurso..." className="form-input" style={{ flex:1, maxWidth:320 }} />
        <button onClick={()=>showToast('Recurso subido (demo)')} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Subir recurso
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
        {filtrados.map(r => {
          const tc = TIPO_COLOR[r.tipo] || '#475569';
          const cc = CAT_COLOR[r.categoria] || '#475569';
          return (
            <div key={r.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
              <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, background:tc+'18', color:tc, borderRadius:5, padding:'2px 7px' }}>{r.tipo}</span>
                <span style={{ fontSize:11, fontWeight:700, background:cc+'18', color:cc, borderRadius:5, padding:'2px 7px' }}>{r.categoria}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'#1e293b', marginBottom:8, lineHeight:1.35 }}>{r.titulo}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginBottom:10 }}>{r.autor} · {r.fecha}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:12, fontSize:12, color:'#64748b' }}>
                  <span>▲ {r.votos}</span>
                  <span>↓ {r.descargas}</span>
                </div>
                <button onClick={()=>showToast(`${r.titulo} descargado (demo)`)} style={{ padding:'4px 10px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Descargar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabLecciones({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Lección aprendida registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar lección
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {LECCIONES.map(l => (
          <div key={l.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontFamily:'monospace', fontSize:11, color:COLOR, fontWeight:700 }}>{l.id}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{l.titulo}</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span style={{ fontSize:11, fontWeight:700, background:l.impacto==='Alto'?'#fee2e2':'#fef9c3', color:l.impacto==='Alto'?'#dc2626':'#b45309', borderRadius:6, padding:'2px 7px' }}>{l.impacto}</span>
                <span style={{ fontSize:11, fontWeight:700, background:l.aplicado?'#dcfce7':'#f1f5f9', color:l.aplicado?'#15803d':'#94a3b8', borderRadius:6, padding:'2px 7px' }}>{l.aplicado?'Aplicado':'Pendiente'}</span>
              </div>
            </div>
            <span style={{ fontSize:11, background:'#f1f5f9', color:'#475569', borderRadius:5, padding:'2px 7px' }}>{l.categoria}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:24, background:'#ecfeff', border:'1px solid #a5f3fc', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 10px', fontSize:14, fontWeight:700, color:'#164e63' }}>Integración Moodle LMS</h3>
        <p style={{ margin:'0 0 12px', fontSize:13, color:'#0e7490' }}>Los recursos del repositorio se sincronizan automáticamente con el Campus Virtual (Módulos 10–12) para uso en capacitaciones.</p>
        <button onClick={()=>showToast('Sincronización Moodle iniciada (demo)')} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Sincronizar con Moodle →
        </button>
      </div>
    </div>
  );
}

const TABS = ['Repositorio de Conocimiento','Lecciones Aprendidas'];

export default function GestionConocimientoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Repositorio de Conocimiento');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Gestión del Conocimiento</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Repositorio de Conocimiento' && <TabRepositorio showToast={showToast} />}
      {tab === 'Lecciones Aprendidas'         && <TabLecciones showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
