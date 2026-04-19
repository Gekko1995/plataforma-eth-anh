import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 17);

const FASES = ['Postulado','Evaluado','Entrevista','Aprobado','Rechazado'];
const FASE_COLOR = { Postulado:'#94a3b8', Evaluado:'#3b82f6', Entrevista:'#f59e0b', Aprobado:'#10b981', Rechazado:'#ef4444' };

const CRITERIOS = [
  { id:'c1', nombre:'Formación académica',  peso:25 },
  { id:'c2', nombre:'Experiencia relevante', peso:30 },
  { id:'c3', nombre:'Competencias técnicas', peso:25 },
  { id:'c4', nombre:'Habilidades blandas',   peso:20 },
];

const CANDIDATOS = [
  { id:'can01', nombre:'Ana María López',      cargo:'Ing. Ambiental',      convocatoria:'CON-2024-01', fase:'Aprobado',    puntaje:88, entrevista:92, notas:'Excelente perfil territorial' },
  { id:'can02', nombre:'Carlos Hernández',     cargo:'Ing. Ambiental',      convocatoria:'CON-2024-01', fase:'Rechazado',   puntaje:52, entrevista:48, notas:'No cumple experiencia mínima' },
  { id:'can03', nombre:'Laura Jiménez',        cargo:'Trab. Social',        convocatoria:'CON-2024-02', fase:'Entrevista',  puntaje:76, entrevista:null, notas:'Pendiente entrevista' },
  { id:'can04', nombre:'Pedro Gómez',          cargo:'Trab. Social',        convocatoria:'CON-2024-02', fase:'Evaluado',    puntaje:81, entrevista:null, notas:'Puntaje alto en BPA' },
  { id:'can05', nombre:'Marcela Torres',       cargo:'Coord. Proyecto',     convocatoria:'CON-2024-03', fase:'Aprobado',    puntaje:94, entrevista:96, notas:'Candidata destacada' },
  { id:'can06', nombre:'Roberto Salinas',      cargo:'Técnico GIS',         convocatoria:'CON-2024-04', fase:'Postulado',   puntaje:null, entrevista:null, notas:'En evaluación' },
  { id:'can07', nombre:'Elena Vargas',         cargo:'Técnico GIS',         convocatoria:'CON-2024-04', fase:'Evaluado',    puntaje:71, entrevista:null, notas:'Buen manejo QGIS' },
  { id:'can08', nombre:'Luis Moreno',          cargo:'Prof. Financiero',    convocatoria:'CON-2024-05', fase:'Entrevista',  puntaje:83, entrevista:null, notas:'CPA certificado' },
];

const CONVOCATORIAS = [
  { id:'CON-2024-01', cargo:'Ingeniero(a) Ambiental',    region:'Orinoquía', abierta:false, candidatos:2 },
  { id:'CON-2024-02', cargo:'Trabajador(a) Social',      region:'Amazonia',  abierta:true,  candidatos:2 },
  { id:'CON-2024-03', cargo:'Coordinador(a) Proyecto',   region:'Nacional',  abierta:false, candidatos:1 },
  { id:'CON-2024-04', cargo:'Técnico(a) GIS',            region:'Meta',      abierta:true,  candidatos:2 },
  { id:'CON-2024-05', cargo:'Profesional Financiero(a)', region:'Nacional',  abierta:true,  candidatos:1 },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function FaseBadge({ fase }) {
  const c = FASE_COLOR[fase]||'#64748b';
  return <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:c+'22', color:c, border:`1px solid ${c}44` }}>{fase}</span>;
}

// ── Tab Kanban ─────────────────────────────────────────────────────────
function TabKanban({ candidatos, showToast }) {
  const fasesMostrar = FASES.filter(f=>f!=='Rechazado');
  return (
    <div style={{ overflowX:'auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${fasesMostrar.length},minmax(180px,1fr))`, gap:12, minWidth:800 }}>
        {fasesMostrar.map(fase => {
          const items = candidatos.filter(c => c.fase===fase);
          const c = FASE_COLOR[fase];
          return (
            <div key={fase} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:c }}>{fase}</span>
                <span style={{ fontSize:11, background:c+'22', color:c, borderRadius:999, padding:'1px 7px', fontWeight:700 }}>{items.length}</span>
              </div>
              {items.map(can => (
                <div key={can.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:9, padding:'10px 12px', marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#1e293b', marginBottom:2 }}>{can.nombre}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>{can.cargo}</div>
                  {can.puntaje && <div style={{ fontSize:11, fontWeight:700, color:can.puntaje>=80?'#15803d':can.puntaje>=65?COLOR:'#dc2626' }}>Score: {can.puntaje}/100</div>}
                  <button onClick={()=>showToast(`${can.nombre} avanzado a siguiente fase (demo)`)} style={{ marginTop:6, width:'100%', padding:'3px 0', borderRadius:5, background:c+'18', color:c, border:'none', fontSize:10, fontWeight:700, cursor:'pointer' }}>Avanzar →</button>
                </div>
              ))}
              {items.length===0 && <div style={{ fontSize:12, color:'#cbd5e1', textAlign:'center', padding:'16px 0' }}>Sin candidatos</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Scoring ────────────────────────────────────────────────────────
function TabScoring() {
  const aprobados = CANDIDATOS.filter(c => c.puntaje !== null).sort((a,b) => b.puntaje - a.puntaje);
  return (
    <div>
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:COLOR, marginBottom:6 }}>Criterios de evaluación y pesos</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CRITERIOS.map(c => (
            <span key={c.id} style={{ fontSize:11, background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:6, padding:'2px 8px' }}>{c.nombre}: {c.peso}%</span>
          ))}
        </div>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Candidato','Cargo','Convocatoria','Puntaje CV','Puntaje entrevista','Fase','Nota'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {aprobados.map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{c.nombre}</td>
                <td style={TD}>{c.cargo}</td>
                <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{c.convocatoria}</td>
                <td style={TD}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:60, height:6, background:'#e2e8f0', borderRadius:99 }}>
                      <div style={{ width:`${c.puntaje}%`, height:'100%', borderRadius:99, background:c.puntaje>=80?'#10b981':c.puntaje>=65?COLOR:'#ef4444' }}/>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700 }}>{c.puntaje}</span>
                  </div>
                </td>
                <td style={TD}>{c.entrevista ?? '—'}</td>
                <td style={TD}><FaseBadge fase={c.fase} /></td>
                <td style={{...TD, fontSize:11, color:'#64748b'}}>{c.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Pipeline','Scoring'];

export default function ReclutamientoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pipeline');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Reclutamiento y Selección</span>
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
      {tab === 'Pipeline' && <TabKanban candidatos={CANDIDATOS} showToast={showToast} />}
      {tab === 'Scoring'  && <TabScoring />}
      <Toast {...toast} />
    </div>
  );
}
