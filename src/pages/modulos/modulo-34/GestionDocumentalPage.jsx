import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#6D28D9';
const META  = modulos.find(m => m.id === 34);

const CARPETAS = [
  { id:'c1', nombre:'01. Contrato y Adendas',    padre:null, archivos:12, nivel:0 },
  { id:'c2', nombre:'02. Informes Institucionales', padre:null, archivos:8,  nivel:0 },
  { id:'c3', nombre:'03. Financiero',             padre:null, archivos:34, nivel:0 },
  { id:'c4', nombre:'04. Personal',               padre:null, archivos:22, nivel:0 },
  { id:'c5', nombre:'05. Técnico-Operativo',      padre:null, archivos:56, nivel:0 },
  { id:'c6', nombre:'06. Legal y Jurídico',       padre:null, archivos:15, nivel:0 },
  { id:'c7', nombre:'07. Comunicaciones',         padre:null, archivos:30, nivel:0 },
  { id:'c8', nombre:'08. Cierre y Liquidación',   padre:null, archivos:4,  nivel:0 },
];

const DOCUMENTOS = [
  { id:'DOC-001', nombre:'PGV-INF-001-v2-2024-11.pdf',     carpeta:'02. Informes Institucionales', fecha:'2024-11-10', autor:'Ana Gómez', tamano:'4.2 MB', estado:'Aprobado' },
  { id:'DOC-002', nombre:'PGV-FIN-CC-001-2024-12.pdf',     carpeta:'03. Financiero',   fecha:'2024-12-02', autor:'Dir. Financiero', tamano:'1.1 MB', estado:'Pendiente' },
  { id:'DOC-003', nombre:'PGV-TEC-MAP-001-2024-10.shp',    carpeta:'05. Técnico-Operativo',fecha:'2024-10-18',autor:'Coord. TI', tamano:'28.4 MB', estado:'Aprobado' },
  { id:'DOC-004', nombre:'PGV-PER-HOJ-018-2024-09.pdf',    carpeta:'04. Personal',     fecha:'2024-09-01', autor:'RRHH', tamano:'0.8 MB', estado:'Aprobado' },
  { id:'DOC-005', nombre:'PGV-LEG-CPRN-016-2024-08.pdf',   carpeta:'06. Legal y Jurídico',fecha:'2024-08-20',autor:'Asesor Legal', tamano:'2.3 MB', estado:'Aprobado' },
];

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconFolder = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabArbol({ showToast }) {
  const [sel, setSel] = useState(null);
  const totalArchivos = CARPETAS.reduce((s,c)=>s+c.archivos,0);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20 }}>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#64748b', marginBottom:12, textTransform:'uppercase', letterSpacing:'.04em' }}>Estructura de carpetas</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {CARPETAS.map(c => (
            <div key={c.id} onClick={() => setSel(c.id===sel?null:c.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, cursor:'pointer', background:c.id===sel?COLOR+'18':'transparent' }}>
              <span style={{ color:c.id===sel?COLOR:'#f59e0b' }}><IconFolder /></span>
              <span style={{ fontSize:12, fontWeight:c.id===sel?700:400, color:c.id===sel?COLOR:'#1e293b', flex:1 }}>{c.nombre}</span>
              <span style={{ fontSize:10, color:'#94a3b8' }}>{c.archivos}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #f1f5f9', fontSize:11, color:'#94a3b8' }}>Total: {totalArchivos} archivos</div>
      </div>
      <div>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:16 }}>
          <h3 style={{ margin:'0 0 10px', fontSize:14, fontWeight:700 }}>Nomenclatura de archivos</h3>
          <div style={{ fontFamily:'monospace', fontSize:12, background:'#f8fafc', borderRadius:8, padding:12, color:'#475569', lineHeight:2 }}>
            <div><span style={{ color:COLOR, fontWeight:700 }}>PGV</span> — <span style={{ color:'#0891b2' }}>ÁREA</span> — <span style={{ color:'#059669' }}>TIPO</span> — <span style={{ color:'#b45309' }}>SEQ</span> — <span style={{ color:'#dc2626' }}>AÑO-MES</span></div>
            <div style={{ color:'#94a3b8', fontSize:11, marginTop:4 }}>Ej: PGV-FIN-CC-001-2024-12.pdf</div>
          </div>
        </div>
        <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:12, padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ fontSize:20 }}>🤖</span>
            <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:'#3b0764' }}>Asistente IA (Gemini mock)</h3>
          </div>
          <p style={{ fontSize:12, color:'#6d28d9', margin:'0 0 12px' }}>Sugiero renombrar los archivos de la carpeta "04. Personal" que no siguen la nomenclatura estándar. Detecté 3 archivos sin formato correcto.</p>
          <button onClick={()=>showToast('Corrección automática aplicada (demo)')} style={{ padding:'6px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Aplicar corrección automática →
          </button>
        </div>
      </div>
    </div>
  );
}

function TabDocumentos({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Documento subido (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Subir documento
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Nombre (nomenclatura)','Carpeta','Fecha','Autor','Tamaño','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {DOCUMENTOS.map(d => (
              <tr key={d.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{d.id}</td>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{d.nombre}</td>
                <td style={TD}>{d.carpeta}</td>
                <td style={TD}>{d.fecha}</td>
                <td style={TD}>{d.autor}</td>
                <td style={TD}>{d.tamano}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:d.estado==='Aprobado'?'#ede9fe':'#fef9c3', color:d.estado==='Aprobado'?COLOR:'#b45309', borderRadius:6, padding:'2px 8px' }}>{d.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Árbol de Carpetas','Documentos'];

export default function GestionDocumentalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Árbol de Carpetas');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Gestión Documental</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Árbol de Carpetas' && <TabArbol showToast={showToast} />}
      {tab === 'Documentos'        && <TabDocumentos showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
