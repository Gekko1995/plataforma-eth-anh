import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#7C3AED';
const META  = modulos.find(m => m.id === 13);

// Fases 4–9 del pipeline FWRTS
const FASES_PIPELINE = [
  { id:'f4', num:4, nombre:'Diagnóstico Exportador',      desc:'Evaluación de capacidad y potencial' },
  { id:'f5', num:5, nombre:'Plan de Mejora',              desc:'Acciones concretas para brechas detectadas' },
  { id:'f6', num:6, nombre:'Certificación y Calidad',     desc:'Obtención de sellos y certificaciones' },
  { id:'f7', num:7, nombre:'Inteligencia de Mercados',    desc:'Análisis demanda internacional' },
  { id:'f8', num:8, nombre:'Conexión Comercial',          desc:'Ruedas de negocios y ferias' },
  { id:'f9', num:9, nombre:'Exportación Efectiva',        desc:'Primera exportación verificada' },
];

const FASE_COLOR = { f4:'#94a3b8', f5:'#3b82f6', f6:'#8b5cf6', f7:'#f59e0b', f8:COLOR, f9:'#10b981' };

const BENEFICIARIOS = [
  { id:'b01', nombre:'Asociación Cacaoteros del Meta',    producto:'Cacao fino',        municipio:'Villavicencio', fase:'f8', puntaje:88, mercado_objetivo:'Bélgica / Francia',   ventas_usd:0,      socios:32 },
  { id:'b02', nombre:'Cooperativa Cafés Especiales',      producto:'Café arábica',      municipio:'Huila',         fase:'f9', puntaje:95, mercado_objetivo:'Japón / Corea del Sur',ventas_usd:45000,  socios:58 },
  { id:'b03', nombre:'Artesanas Wayúu Manaure',           producto:'Mochilas artesanales',municipio:'Manaure',     fase:'f7', puntaje:72, mercado_objetivo:'España / EEUU',        ventas_usd:0,      socios:24 },
  { id:'b04', nombre:'Apicultores Orinoquia',             producto:'Miel certificada',  municipio:'Yopal',         fase:'f6', puntaje:65, mercado_objetivo:'Alemania',             ventas_usd:0,      socios:18 },
  { id:'b05', nombre:'Palma Sostenible Casanare',         producto:'Aceite de palma',   municipio:'Aguazul',       fase:'f8', puntaje:81, mercado_objetivo:'India / China',        ventas_usd:0,      socios:45 },
  { id:'b06', nombre:'Frutas Exóticas Amazonia',          producto:'Frutas tropicales', municipio:'Florencia',     fase:'f5', puntaje:58, mercado_objetivo:'EEUU / Canadá',        ventas_usd:0,      socios:21 },
  { id:'b07', nombre:'Ganaderos Córdoba Premium',         producto:'Carne bovina',      municipio:'Montería',      fase:'f9', puntaje:90, mercado_objetivo:'México / Venezuela',   ventas_usd:120000, socios:67 },
  { id:'b08', nombre:'Quinua Andina Boyacá',              producto:'Quinua orgánica',   municipio:'Sogamoso',      fase:'f7', puntaje:76, mercado_objetivo:'Europa',               ventas_usd:0,      socios:29 },
  { id:'b09', nombre:'Panela Artesanal Santander',        producto:'Panela orgánica',   municipio:'Vélez',         fase:'f4', puntaje:42, mercado_objetivo:'Por definir',          ventas_usd:0,      socios:14 },
  { id:'b10', nombre:'Caucho Natural Orinoquía',          producto:'Látex certificado', municipio:'Arauca',        fase:'f6', puntaje:63, mercado_objetivo:'Europa Oriental',      ventas_usd:0,      socios:38 },
];

const FERIAS = [
  { id:'fe1', nombre:'Anuga — Colonia', pais:'Alemania',   fecha:'2025-10-05', tipo:'Alimentos', estado:'Postulación abierta', cupos:3  },
  { id:'fe2', nombre:'SIAL Paris',     pais:'Francia',     fecha:'2026-10-18', tipo:'Alimentos', estado:'Pendiente',           cupos:2  },
  { id:'fe3', nombre:'World of Coffee',pais:'Dinamarca',   fecha:'2025-06-12', tipo:'Café',      estado:'Cerrada',             cupos:0  },
  { id:'fe4', nombre:'Biofach',        pais:'Alemania',    fecha:'2025-02-11', tipo:'Orgánico',  estado:'Postulación abierta', cupos:4  },
  { id:'fe5', nombre:'Expo Milán',     pais:'Italia',      fecha:'2025-04-01', tipo:'General',   estado:'Pendiente',           cupos:2  },
];

const puntajeColor = (p) => p >= 80 ? '#15803d' : p >= 65 ? '#b45309' : '#dc2626';
const puntajeBg    = (p) => p >= 80 ? '#dcfce7' : p >= 65 ? '#fef9c3' : '#fee2e2';

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconStar = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

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

// ── Tab Pipeline ───────────────────────────────────────────────────────
function TabPipeline({ onVerFicha }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:8 }}>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${FASES_PIPELINE.length}, minmax(170px,1fr))`, gap:12, minWidth:1020 }}>
        {FASES_PIPELINE.map(fase => {
          const items = BENEFICIARIOS.filter(b => b.fase === fase.id);
          const c = FASE_COLOR[fase.id];
          return (
            <div key={fase.id} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:11, fontWeight:800, color:c }}>Fase {fase.num}</span>
                  <span style={{ fontSize:11, background:c+'22', color:c, borderRadius:999, padding:'1px 7px', fontWeight:700 }}>{items.length}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'#1e293b', lineHeight:1.3 }}>{fase.nombre}</div>
                <div style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>{fase.desc}</div>
              </div>
              {items.map(b => (
                <div key={b.id} onClick={() => onVerFicha(b)} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:9, padding:'10px 12px', marginBottom:8, cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.1)'}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#1e293b', marginBottom:3, lineHeight:1.3 }}>{b.nombre}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>{b.producto}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, fontWeight:800, color:puntajeColor(b.puntaje), background:puntajeBg(b.puntaje), borderRadius:6, padding:'1px 7px' }}>{b.puntaje} pts</span>
                    <span style={{ fontSize:10, color:'#94a3b8' }}>{b.socios} socios</span>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div style={{ fontSize:12, color:'#cbd5e1', textAlign:'center', padding:'20px 0' }}>Sin beneficiarios</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Ranking ────────────────────────────────────────────────────────
function TabRanking({ onVerFicha }) {
  const sorted = [...BENEFICIARIOS].sort((a,b) => b.puntaje - a.puntaje);
  const medals = ['🥇','🥈','🥉'];

  return (
    <div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Puntaje de elegibilidad exportadora (escala 0–100). Umbral mínimo recomendado: 65 pts.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sorted.map((b, idx) => {
          const pc = puntajeColor(b.puntaje);
          const w  = b.puntaje;
          const faseObj = FASES_PIPELINE.find(f => f.id === b.fase);
          const fc = FASE_COLOR[b.fase];
          return (
            <div key={b.id} onClick={() => onVerFicha(b)} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
              <div style={{ width:28, textAlign:'center', fontSize:18 }}>{medals[idx] || `#${idx+1}`}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{b.nombre}</div>
                <div style={{ fontSize:11, color:'#64748b', marginBottom:5 }}>{b.producto} · {b.municipio} · {b.socios} socios</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:8, background:'#e2e8f0', borderRadius:99 }}>
                    <div style={{ width:`${w}%`, height:'100%', borderRadius:99, background:pc, transition:'width .4s' }}/>
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:pc, minWidth:36, textAlign:'right' }}>{b.puntaje}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize:11, fontWeight:700, color:fc, background:fc+'18', border:`1px solid ${fc}44`, borderRadius:6, padding:'2px 8px' }}>Fase {faseObj?.num}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Ferias ─────────────────────────────────────────────────────────
function TabFerias({ showToast }) {
  return (
    <div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Feria','País','Fecha','Tipo','Cupos','Estado','Acción'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {FERIAS.map(f => {
              const abierta = f.estado === 'Postulación abierta';
              const cerrada = f.estado === 'Cerrada';
              return (
                <tr key={f.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD,fontWeight:700,color:'#1e293b'}}>{f.nombre}</td>
                  <td style={TD}>{f.pais}</td>
                  <td style={TD}>{f.fecha}</td>
                  <td style={TD}>{f.tipo}</td>
                  <td style={TD}>{f.cupos > 0 ? f.cupos : <span style={{ color:'#dc2626', fontWeight:600 }}>Cupos agotados</span>}</td>
                  <td style={TD}>
                    <span style={{ padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:600, background:abierta?'#dcfce7':cerrada?'#f1f5f9':'#fef9c3', color:abierta?'#15803d':cerrada?'#94a3b8':'#b45309' }}>
                      {f.estado}
                    </span>
                  </td>
                  <td style={TD}>
                    {abierta && f.cupos > 0 && (
                      <button onClick={() => showToast(`Postulación a "${f.nombre}" enviada (demo)`)} style={{ padding:'4px 10px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                        Postular
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Ficha de puntaje ───────────────────────────────────────────────────
const CRITERIOS = [
  { nombre:'Capacidad productiva',      peso:20 },
  { nombre:'Calidad y certificaciones', peso:25 },
  { nombre:'Gestión empresarial',       peso:20 },
  { nombre:'Acceso a financiamiento',   peso:15 },
  { nombre:'Inteligencia de mercados',  peso:20 },
];

function ModalFicha({ b, onClose }) {
  const faseObj = FASES_PIPELINE.find(f => f.id === b.fase);
  const criteriosConPts = CRITERIOS.map((c, i) => {
    const pts = Math.round((b.puntaje / 100) * c.peso * (0.8 + Math.random() * 0.4));
    return { ...c, pts: Math.min(pts, c.peso) };
  });

  return (
    <Modal title="Ficha de Elegibilidad Exportadora" onClose={onClose} wide>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:'#1e293b' }}>{b.nombre}</div>
          <div style={{ fontSize:13, color:'#64748b' }}>{b.producto} · {b.municipio} · {b.socios} socios</div>
        </div>
        <div style={{ textAlign:'center', background:puntajeBg(b.puntaje), borderRadius:12, padding:'10px 18px', border:`1px solid ${puntajeColor(b.puntaje)}44` }}>
          <div style={{ fontSize:32, fontWeight:900, color:puntajeColor(b.puntaje), lineHeight:1 }}>{b.puntaje}</div>
          <div style={{ fontSize:10, color:puntajeColor(b.puntaje), fontWeight:700 }}>/ 100 pts</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {[
          ['Mercado objetivo', b.mercado_objetivo],
          ['Fase actual', `Fase ${faseObj?.num} — ${faseObj?.nombre}`],
          ['Ventas exportadas', b.ventas_usd > 0 ? `USD ${b.ventas_usd.toLocaleString()}` : 'Sin exportaciones aún'],
        ].map(([l,v]) => (
          <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
            <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
          </div>
        ))}
      </div>

      <h4 style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Desglose por criterio</h4>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {criteriosConPts.map(c => (
          <div key={c.nombre}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#475569', marginBottom:3 }}>
              <span>{c.nombre}</span>
              <span style={{ fontWeight:700 }}>{c.pts}/{c.peso}</span>
            </div>
            <div style={{ height:7, background:'#e2e8f0', borderRadius:99 }}>
              <div style={{ width:`${Math.round((c.pts/c.peso)*100)}%`, height:'100%', borderRadius:99, background:COLOR }}/>
            </div>
          </div>
        ))}
      </div>

      {b.puntaje >= 65 && (
        <div style={{ marginTop:16, background:'#f0fdf4', border:'1px solid #86efac', borderRadius:9, padding:'10px 14px', fontSize:12, color:'#15803d', fontWeight:600 }}>
          ✓ Elegible para participar en ferias internacionales
        </div>
      )}
      {b.puntaje < 65 && (
        <div style={{ marginTop:16, background:'#fef9c3', border:'1px solid #fde68a', borderRadius:9, padding:'10px 14px', fontSize:12, color:'#92400e', fontWeight:600 }}>
          ⚠ Requiere plan de mejora antes de postular a ferias
        </div>
      )}
    </Modal>
  );
}

const TABS = ['Pipeline FWRTS','Ranking','Ferias Internacionales'];

export default function AceleradoraExportadoraPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pipeline FWRTS');
  const [ficha, setFicha] = useState(null);
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Aceleradora Exportadora</span>
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

      {tab === 'Pipeline FWRTS'        && <TabPipeline onVerFicha={setFicha} />}
      {tab === 'Ranking'               && <TabRanking onVerFicha={setFicha} />}
      {tab === 'Ferias Internacionales' && <TabFerias showToast={showToast} />}

      {ficha && <ModalFicha b={ficha} onClose={() => setFicha(null)} />}
      <Toast {...toast} />
    </div>
  );
}
