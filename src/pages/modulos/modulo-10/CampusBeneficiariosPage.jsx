import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#7C3AED';
const META  = modulos.find(m => m.id === 10);

const PERFILES = ['Caficultor','Cacaotero','Palma de aceite','Ganadero','Apicultor'];

const CURSOS = [
  { id:'cu1', perfil:'Caficultor',      nombre:'Caficultura Sostenible y Certificación UTZ',       duracion:'16h', modulos:4, categoria:'BPA', nivel:'Básico' },
  { id:'cu2', perfil:'Caficultor',      nombre:'Poscosecha y Beneficio del Café',                  duracion:'8h',  modulos:2, categoria:'Calidad', nivel:'Intermedio' },
  { id:'cu3', perfil:'Cacaotero',       nombre:'Cacao Fino de Aroma — Manejo Agronómico',          duracion:'12h', modulos:3, categoria:'BPA', nivel:'Básico' },
  { id:'cu4', perfil:'Cacaotero',       nombre:'Fermentación y Secado del Cacao',                  duracion:'6h',  modulos:2, categoria:'Calidad', nivel:'Intermedio' },
  { id:'cu5', perfil:'Palma de aceite', nombre:'Manejo Integrado de Plagas en Palma',              duracion:'10h', modulos:3, categoria:'BPA', nivel:'Básico' },
  { id:'cu6', perfil:'Ganadero',        nombre:'Ganadería Sostenible y Bienestar Animal',          duracion:'14h', modulos:4, categoria:'BPA', nivel:'Básico' },
  { id:'cu7', perfil:'Ganadero',        nombre:'Procesamiento Artesanal Lácteos',                  duracion:'8h',  modulos:2, categoria:'Transformación', nivel:'Intermedio' },
  { id:'cu8', perfil:'Apicultor',       nombre:'Apicultura Racional y Manejo de Colmenas',         duracion:'10h', modulos:3, categoria:'BPA', nivel:'Básico' },
  { id:'cu9', perfil:'Todos',           nombre:'Acceso a Mercados y Comercio Justo',               duracion:'6h',  modulos:2, categoria:'Mercados', nivel:'Avanzado' },
  { id:'cu10',perfil:'Todos',           nombre:'Gestión Financiera para Pequeños Productores',     duracion:'8h',  modulos:2, categoria:'Gestión', nivel:'Básico' },
];

const BENEFICIARIOS = [
  { id:'b01', nombre:'Juan Carlos Peña',     municipio:'Yopal',       perfil:'Caficultor',      cursos_asignados:['cu1','cu2','cu9','cu10'], progreso:[100,75,50,0],  certificado:false },
  { id:'b02', nombre:'María Luz Torres',     municipio:'Florencia',   perfil:'Cacaotero',       cursos_asignados:['cu3','cu4','cu9'],        progreso:[100,100,80],    certificado:true  },
  { id:'b03', nombre:'Pedro Salinas Roa',    municipio:'Arauca',      perfil:'Ganadero',        cursos_asignados:['cu6','cu7','cu10'],       progreso:[80,40,0],       certificado:false },
  { id:'b04', nombre:'Claudia Vargas',       municipio:'Mocoa',       perfil:'Cacaotero',       cursos_asignados:['cu3','cu9'],              progreso:[100,100],       certificado:true  },
  { id:'b05', nombre:'Luis Herrera Pinto',   municipio:'Inírida',     perfil:'Apicultor',       cursos_asignados:['cu8','cu9','cu10'],       progreso:[60,30,0],       certificado:false },
  { id:'b06', nombre:'Sandra Moreno',        municipio:'Sogamoso',    perfil:'Caficultor',      cursos_asignados:['cu1','cu9'],              progreso:[100,100],       certificado:true  },
  { id:'b07', nombre:'Roberto Quintero',     municipio:'Villavicencio',perfil:'Palma de aceite', cursos_asignados:['cu5','cu10'],             progreso:[45,0],          certificado:false },
  { id:'b08', nombre:'Elena Castillo',       municipio:'Montería',    perfil:'Ganadero',        cursos_asignados:['cu6','cu7','cu9','cu10'], progreso:[100,100,100,60], certificado:false },
  { id:'b09', nombre:'Carlos Mendoza',       municipio:'Bucaramanga', perfil:'Caficultor',      cursos_asignados:['cu1','cu2','cu9'],        progreso:[100,100,100],   certificado:true  },
  { id:'b10', nombre:'Patricia Ríos',        municipio:'Puerto Rico', perfil:'Cacaotero',       cursos_asignados:['cu3','cu4','cu9'],        progreso:[20,0,0],        certificado:false },
];

const avgProgreso = (b) => b.progreso.length > 0 ? Math.round(b.progreso.reduce((s,p)=>s+p,0)/b.progreso.length) : 0;
const NIVEL_COLOR = { Básico:'#3b82f6', Intermedio:COLOR, Avanzado:'#dc2626' };
const CAT_COLOR   = { BPA:'#10b981', Calidad:'#f59e0b', Transformación:'#8b5cf6', Mercados:'#0ea5e9', Gestión:'#64748b' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconCert = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?680:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

// Certificado mock
function CertificadoModal({ ben, onClose }) {
  return (
    <Modal title="Certificado de Formación" onClose={onClose} wide>
      <div style={{ border:'3px solid #7c3aed', borderRadius:16, padding:32, textAlign:'center', background:'linear-gradient(135deg,#f5f3ff,#fff)' }}>
        <div style={{ fontSize:13, color:'#7c3aed', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8 }}>Fundación WR Tejido Social · SINAPSIS 3D</div>
        <div style={{ fontSize:11, color:'#94a3b8', marginBottom:20 }}>Certifica que:</div>
        <div style={{ fontSize:22, fontWeight:800, color:'#1e293b', marginBottom:4 }}>{ben.nombre}</div>
        <div style={{ fontSize:13, color:'#64748b', marginBottom:20 }}>Productora(or) — Perfil: <strong>{ben.perfil}</strong></div>
        <div style={{ fontSize:14, color:'#4c1d95', fontWeight:600, marginBottom:20 }}>Ha completado satisfactoriamente el programa de formación técnica<br/>correspondiente a su perfil productivo dentro del convenio.</div>
        <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:24 }}>
          <div style={{ background:'#7c3aed', color:'#fff', borderRadius:8, padding:'6px 14px', fontSize:11, fontWeight:700 }}>QR: {ben.id.toUpperCase()}-CERT-2024</div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-around', borderTop:'1px solid #e2e8f0', paddingTop:16 }}>
          <div style={{ textAlign:'center' }}><div style={{ borderTop:'1px solid #1e293b', width:140, margin:'0 auto 6px' }}/><div style={{ fontSize:11, color:'#64748b' }}>Coordinador Formación</div></div>
          <div style={{ textAlign:'center' }}><div style={{ borderTop:'1px solid #1e293b', width:140, margin:'0 auto 6px' }}/><div style={{ fontSize:11, color:'#64748b' }}>Dirección del proyecto</div></div>
        </div>
        <div style={{ marginTop:16, fontSize:11, color:'#94a3b8' }}>* Documento demostrativo — no tiene validez jurídica</div>
      </div>
    </Modal>
  );
}

// ── Tab LMS ────────────────────────────────────────────────────────────
function TabLMS({ showToast }) {
  const [filtroPerfil, setFiltroPerfil] = useState('Todos');
  const cursosFiltrados = CURSOS.filter(c => filtroPerfil === 'Todos' || c.perfil === filtroPerfil || c.perfil === 'Todos');

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {['Todos',...PERFILES].map(p => (
          <button key={p} onClick={()=>setFiltroPerfil(p)} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${filtroPerfil===p?COLOR:'#e2e8f0'}`, background:filtroPerfil===p?COLOR:'transparent', color:filtroPerfil===p?'#fff':'#475569', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            {p}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {cursosFiltrados.map(c => {
          const nc = NIVEL_COLOR[c.nivel] || '#64748b';
          const cc = CAT_COLOR[c.categoria] || '#64748b';
          return (
            <div key={c.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, background:cc+'18', color:cc, border:`1px solid ${cc}44`, borderRadius:6, padding:'2px 7px' }}>{c.categoria}</span>
                <span style={{ fontSize:11, fontWeight:700, background:nc+'18', color:nc, border:`1px solid ${nc}44`, borderRadius:6, padding:'2px 7px' }}>{c.nivel}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginBottom:6, lineHeight:1.35 }}>{c.nombre}</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>{c.perfil} · {c.duracion} · {c.modulos} módulos</div>
              <button onClick={() => showToast(`Curso "${c.nombre}" abierto (demo)`)} style={{ width:'100%', padding:'7px 0', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                Iniciar curso →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Progreso ───────────────────────────────────────────────────────
function TabProgreso({ showToast }) {
  const [certModal, setCertModal] = useState(null);
  const total = BENEFICIARIOS.length;
  const certificados = BENEFICIARIOS.filter(b => b.certificado).length;
  const enCurso = BENEFICIARIOS.filter(b => !b.certificado && avgProgreso(b) > 0).length;

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Beneficiarios', val:total, c:COLOR },
          { label:'Con certificado', val:certificados, c:'#15803d' },
          { label:'En curso', val:enCurso, c:'#b45309' },
          { label:'Sin iniciar', val:total-certificados-enCurso, c:'#94a3b8' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Beneficiario','Municipio','Perfil','Avance global','Cursos','Certificado'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {BENEFICIARIOS.map(b => {
              const avg = avgProgreso(b);
              return (
                <tr key={b.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD,fontWeight:600,color:'#1e293b'}}>{b.nombre}</td>
                  <td style={TD}>{b.municipio}</td>
                  <td style={TD}><span style={{ fontSize:11, background:COLOR+'18', color:COLOR, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{b.perfil}</span></td>
                  <td style={TD}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:100, height:7, background:'#e2e8f0', borderRadius:99 }}>
                        <div style={{ width:`${avg}%`, height:'100%', borderRadius:99, background:avg>=80?'#10b981':avg>=40?COLOR:'#94a3b8' }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#475569' }}>{avg}%</span>
                    </div>
                  </td>
                  <td style={TD}>{b.cursos_asignados.length}</td>
                  <td style={TD}>
                    {b.certificado
                      ? <button onClick={() => setCertModal(b)} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:6, background:'#f0fdf4', color:'#15803d', border:'1px solid #86efac', fontSize:11, fontWeight:700, cursor:'pointer' }}><IconCert /> Ver cert.</button>
                      : <span style={{ fontSize:11, color:'#94a3b8' }}>Pendiente</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {certModal && <CertificadoModal ben={certModal} onClose={() => setCertModal(null)} />}
    </div>
  );
}

const TABS = ['Catálogo LMS','Progreso'];

export default function CampusBeneficiariosPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Catálogo LMS');
  const [toast, setToast] = useState({ msg:'', ok:true });

  function showToast(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 3500);
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4, padding:'6px 8px', borderRadius:7, fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <IconBack /> Módulos
        </button>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Campus Virtual Beneficiarios</span>
      </div>

      <ModuloInfoBanner meta={META} color={COLOR} />

      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Catálogo LMS' && <TabLMS showToast={showToast} />}
      {tab === 'Progreso'     && <TabProgreso showToast={showToast} />}

      <Toast {...toast} />
    </div>
  );
}
