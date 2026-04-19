import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 26);

const PROB_LABELS = ['Raro','Improbable','Posible','Probable','Casi Seguro'];
const IMP_LABELS  = ['Insignificante','Menor','Moderado','Mayor','Catastrófico'];

const RIESGOS = [
  { id:'R01', categoria:'Financiero',    descripcion:'Retraso en desembolso ANH',       prob:3, imp:4, mitigacion:'Reserva liquidez 15%', responsable:'Dir. Financiero', plan:'Gestión anticipada comunicación ANH', estado:'Activo' },
  { id:'R02', categoria:'Financiero',    descripcion:'Variación cambiaria insumos',      prob:2, imp:3, mitigacion:'Contratos precio fijo',  responsable:'Dir. Financiero', plan:'Cláusula precio fijo en contratos', estado:'Mitigado' },
  { id:'R03', categoria:'Operativo',     descripcion:'Accidente personal de campo',      prob:2, imp:5, mitigacion:'HSE + ARL activo',        responsable:'Coord. HSE',      plan:'Protocolo emergencias activo', estado:'Activo' },
  { id:'R04', categoria:'Operativo',     descripcion:'Pérdida información digital',      prob:2, imp:4, mitigacion:'Backup diario nube',       responsable:'Coord. TI',       plan:'Política backup verificada', estado:'Mitigado' },
  { id:'R05', categoria:'Social',        descripcion:'Conflicto con comunidades',        prob:2, imp:5, mitigacion:'CIPRUNNA activa M16',      responsable:'Dir. Social',     plan:'Protocolo CIPRUNNA vigente', estado:'Activo' },
  { id:'R06', categoria:'Social',        descripcion:'Captura de proceso por actores',   prob:1, imp:5, mitigacion:'Transparencia + UARIV',    responsable:'Dir. General',    plan:'Auditorías externas semestrales', estado:'Activo' },
  { id:'R07', categoria:'Ambiental',     descripcion:'Daño ecosistemas por intervención',prob:2, imp:4, mitigacion:'Licencia ambiental CAR',   responsable:'Prof. Ambiental', plan:'Monitoreo CAR mensual', estado:'Activo' },
  { id:'R08', categoria:'Institucional', descripcion:'Cambio normativo ANH',             prob:2, imp:3, mitigacion:'Asesoría jurídica permanente',responsable:'Asesor Legal', plan:'Monitoreo regulatorio', estado:'Activo' },
];

const CAT_COLOR = { 'Financiero':'#DC2626', 'Operativo':'#B45309', 'Social':'#7C3AED', 'Ambiental':'#059669', 'Institucional':'#0369A1' };

function nivelRiesgo(p, i) {
  const v = p * i;
  if (v >= 15) return { label:'Extremo', c:'#dc2626', bg:'#fee2e2' };
  if (v >= 8)  return { label:'Alto',    c:'#b45309', bg:'#fef9c3' };
  if (v >= 4)  return { label:'Medio',   c:'#0369a1', bg:'#dbeafe' };
  return         { label:'Bajo',    c:'#15803d', bg:'#dcfce7' };
}

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function MapaCalor() {
  const GRID = 5;
  const cellColor = (p, i) => {
    const v = (p+1)*(i+1);
    if (v >= 15) return '#fee2e2';
    if (v >= 8)  return '#fef9c3';
    if (v >= 4)  return '#dbeafe';
    return '#dcfce7';
  };
  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:24 }}>
      <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:700 }}>Mapa de calor — Probabilidad × Impacto (CONPES 3714)</h3>
      <div style={{ display:'flex', gap:16 }}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:`60px repeat(${GRID},52px)`, gap:3 }}>
            <div/>
            {IMP_LABELS.map((l,i) => <div key={i} style={{ fontSize:9, color:'#94a3b8', textAlign:'center', fontWeight:600 }}>{l.slice(0,6)}</div>)}
            {PROB_LABELS.map((pl,pi) => (
              <>
                <div key={`p${pi}`} style={{ fontSize:9, color:'#94a3b8', display:'flex', alignItems:'center', fontWeight:600 }}>{pl.slice(0,8)}</div>
                {IMP_LABELS.map((_,ii) => {
                  const bg = cellColor(pi,ii);
                  const rqs = RIESGOS.filter(r => r.prob===pi+1 && r.imp===ii+1);
                  return (
                    <div key={`c${pi}${ii}`} style={{ width:52, height:36, background:bg, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#1e293b', border:'1px solid rgba(0,0,0,.06)' }}>
                      {rqs.length > 0 ? rqs.length : ''}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, justifyContent:'center' }}>
          {[['Extremo','#fee2e2','#dc2626'],['Alto','#fef9c3','#b45309'],['Medio','#dbeafe','#0369a1'],['Bajo','#dcfce7','#15803d']].map(([l,bg,c])=>(
            <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:14, height:14, borderRadius:3, background:bg, border:`1px solid ${c}44` }}/>
              <span style={{ fontSize:11, color:c, fontWeight:600 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabMatriz({ showToast }) {
  const [filtro, setFiltro] = useState('Todos');
  const categorias = ['Todos',...new Set(RIESGOS.map(r=>r.categoria))];
  const filtered = filtro==='Todos' ? RIESGOS : RIESGOS.filter(r=>r.categoria===filtro);
  const extremos = RIESGOS.filter(r => r.prob*r.imp >= 15).length;
  return (
    <div>
      {extremos > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ {extremos} riesgo(s) de nivel EXTREMO — requieren plan de mitigación inmediata
        </div>
      )}
      <MapaCalor />
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {categorias.map(c => (
          <button key={c} onClick={()=>setFiltro(c)} style={{ padding:'5px 12px', borderRadius:7, fontSize:12, fontWeight:600, border:`1px solid ${filtro===c?COLOR:'#e2e8f0'}`, background:filtro===c?COLOR+'18':'#fff', color:filtro===c?COLOR:'#475569', cursor:'pointer' }}>{c}</button>
        ))}
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Categoría','Riesgo','Prob.','Imp.','Nivel','Mitigación','Responsable','Estado'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(r => {
              const niv = nivelRiesgo(r.prob, r.imp);
              const cc = CAT_COLOR[r.categoria] || '#475569';
              return (
                <tr key={r.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{r.id}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:cc+'18', color:cc, borderRadius:6, padding:'2px 7px' }}>{r.categoria}</span></td>
                  <td style={{...TD, fontWeight:500, color:'#1e293b', maxWidth:200}}>{r.descripcion}</td>
                  <td style={{...TD, textAlign:'center', fontWeight:700}}>{r.prob}</td>
                  <td style={{...TD, textAlign:'center', fontWeight:700}}>{r.imp}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:niv.bg, color:niv.c, borderRadius:6, padding:'2px 8px' }}>{niv.label}</span></td>
                  <td style={{ ...TD, fontSize:12 }}>{r.mitigacion}</td>
                  <td style={TD}>{r.responsable}</td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:r.estado==='Mitigado'?'#15803d':COLOR }}>{r.estado}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={()=>showToast('Riesgo registrado (demo)')} style={{ marginTop:14, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar riesgo
      </button>
    </div>
  );
}

function TabPlanes() {
  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {RIESGOS.filter(r=>r.prob*r.imp>=8).map(r => {
          const niv = nivelRiesgo(r.prob, r.imp);
          return (
            <div key={r.id} style={{ background:'#fff', border:`1px solid ${niv.c}44`, borderRadius:12, padding:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:800, color:COLOR }}>{r.id}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{r.descripcion}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, background:niv.bg, color:niv.c, borderRadius:6, padding:'2px 8px' }}>{niv.label}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div style={{ background:'#f8fafc', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, marginBottom:4 }}>MITIGACIÓN</div>
                  <div style={{ fontSize:12, color:'#1e293b' }}>{r.mitigacion}</div>
                </div>
                <div style={{ background:'#f8fafc', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, marginBottom:4 }}>PLAN DE ACCIÓN</div>
                  <div style={{ fontSize:12, color:'#1e293b' }}>{r.plan}</div>
                </div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:'#64748b' }}>Responsable: <span style={{ fontWeight:600, color:'#1e293b' }}>{r.responsable}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ['Matriz de Riesgos','Planes de Mitigación'];

export default function MatrizRiesgosPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Matriz de Riesgos');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Matriz de Riesgos</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Matriz de Riesgos'      && <TabMatriz showToast={showToast} />}
      {tab === 'Planes de Mitigación'   && <TabPlanes />}
      <Toast {...toast} />
    </div>
  );
}
