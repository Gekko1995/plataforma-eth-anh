import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#B45309';
const META  = modulos.find(m => m.id === 7);

const FASES = ['Formulada','Validada','Aprobada','En Ejecución','Ejecutada','Verificada'];
const FASE_COLOR = { 'Formulada':'#94a3b8','Validada':'#3b82f6','Aprobada':'#8b5cf6','En Ejecución':'#f59e0b','Ejecutada':'#10b981','Verificada':'#15803d' };

const INICIATIVAS = [
  { id:'i01', nombre:'Construcción Acueducto Veredal', municipio:'Arauca', car:'Corporinoquia', fase:'Verificada',  presupuesto:480000000, ejecutado:480000000, responsable:'Ing. Laura Castillo',   fecha_inicio:'2024-01-15', compromisos:8, evidencias:12 },
  { id:'i02', nombre:'Huertos Familiares PDET Casanare', municipio:'Yopal', car:'Corporinoquia', fase:'En Ejecución', presupuesto:320000000, ejecutado:210000000, responsable:'Ing. Pedro Salinas',  fecha_inicio:'2024-03-01', compromisos:5, evidencias:7 },
  { id:'i03', nombre:'Capacitación Agropecuaria Meta',  municipio:'Villavicencio', car:'Cormacarena', fase:'Aprobada',  presupuesto:150000000, ejecutado:0,         responsable:'Ing. Clara Moreno',    fecha_inicio:'2024-06-01', compromisos:3, evidencias:2 },
  { id:'i04', nombre:'Mejoramiento Vial Vereda El Tigre',municipio:'Puerto Rico',  car:'Cormacarena', fase:'Validada',   presupuesto:620000000, ejecutado:0,         responsable:'Ing. Roberto Pinto',   fecha_inicio:'2024-07-10', compromisos:6, evidencias:1 },
  { id:'i05', nombre:'Proyecto Pisci-Cultura Amazonia', municipio:'Florencia',     car:'Corpoamazonia',fase:'Ejecutada',  presupuesto:280000000, ejecutado:275000000, responsable:'Ing. Sandra Vargas',   fecha_inicio:'2023-11-01', compromisos:4, evidencias:9 },
  { id:'i06', nombre:'Centro Acopio Cacao Putumayo',    municipio:'Mocoa',         car:'Corpoamazonia',fase:'En Ejecución',presupuesto:410000000,ejecutado:180000000, responsable:'Ing. Luis Herrera',    fecha_inicio:'2024-04-15', compromisos:7, evidencias:6 },
  { id:'i07', nombre:'Biodigestores Comunidades Guainía',municipio:'Inírida',      car:'CDA',         fase:'Formulada',  presupuesto:95000000,  ejecutado:0,         responsable:'Ing. Patricia Ríos',   fecha_inicio:'2024-09-01', compromisos:2, evidencias:0 },
  { id:'i08', nombre:'Escuela Rural Digital Boyacá',    municipio:'Sogamoso',      car:'Corpoboyacá', fase:'En Ejecución',presupuesto:200000000,ejecutado:90000000,  responsable:'Ing. Carlos Mendoza',  fecha_inicio:'2024-05-01', compromisos:5, evidencias:5 },
  { id:'i09', nombre:'Vivero Comunitario Santander',    municipio:'Bucaramanga',   car:'CDMB',        fase:'Verificada',  presupuesto:75000000,  ejecutado:75000000,  responsable:'Ing. Nelly Torres',    fecha_inicio:'2023-10-01', compromisos:3, evidencias:8 },
  { id:'i10', nombre:'Microempresas Artesanales Córdoba',municipio:'Montería',     car:'CVS',         fase:'Aprobada',   presupuesto:130000000, ejecutado:0,         responsable:'Ing. Fabio Guerrero',  fecha_inicio:'2024-08-01', compromisos:4, evidencias:1 },
];

const EVIDENCIAS_MAP = {
  'i01':[ {id:'e1',tipo:'Foto',desc:'Inauguración acueducto veredal'},{id:'e2',tipo:'Acta',desc:'Acta de entrega comunitaria'},{id:'e3',tipo:'Video',desc:'Recorrido instalaciones'} ],
  'i02':[ {id:'e4',tipo:'Foto',desc:'Taller agrícola fase 1'},{id:'e5',tipo:'Informe',desc:'Avance Q1 2024'} ],
  'i06':[ {id:'e6',tipo:'Foto',desc:'Construcción bodega acopio'},{id:'e7',tipo:'Contrato',desc:'Contrato proveedor equipos'} ],
};

const COMPROMISOS_MAP = {
  'i01':[ {id:'c1',texto:'Capacitar 80 familias en uso adecuado',cumplido:true},{id:'c2',texto:'Comité de mantenimiento conformado',cumplido:true},{id:'c3',texto:'Plan tarifario aprobado en asamblea',cumplido:true} ],
  'i02':[ {id:'c4',texto:'Entregar insumos a 50 familias',cumplido:false},{id:'c5',texto:'Elaborar manual de buenas prácticas',cumplido:true} ],
  'i06':[ {id:'c6',texto:'Formalizar 3 asociaciones cacaoteras',cumplido:false},{id:'c7',texto:'Conectar centro a red vial departamental',cumplido:false} ],
};

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);
const pct = (ini) => ini.presupuesto > 0 ? Math.round((ini.ejecutado / ini.presupuesto)*100) : 0;

const IconBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconImg    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function FaseBadge({ fase }) {
  const c = FASE_COLOR[fase] || '#64748b';
  return <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:c+'22', color:c, border:`1px solid ${c}44` }}>{fase}</span>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?740:500, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
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
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#dcfce7':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#fef9c3', color:'#854d0e', border:'1px solid #fde68a', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#92400e' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#78350f', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Kanban ─────────────────────────────────────────────────────────────
function TabKanban({ iniciativas, onVerDetalle }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:8 }}>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${FASES.length}, minmax(180px,1fr))`, gap:12, minWidth:1100 }}>
        {FASES.map(fase => {
          const items = iniciativas.filter(i => i.fase === fase);
          const c = FASE_COLOR[fase];
          return (
            <div key={fase} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:c }}>{fase}</span>
                <span style={{ fontSize:11, background:c+'22', color:c, borderRadius:999, padding:'1px 7px', fontWeight:700 }}>{items.length}</span>
              </div>
              {items.map(ini => (
                <div key={ini.id} onClick={() => onVerDetalle(ini)} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:9, padding:'10px 12px', marginBottom:8, cursor:'pointer', transition:'box-shadow .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.1)'}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#1e293b', marginBottom:4, lineHeight:1.35 }}>{ini.nombre}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>{ini.municipio}</div>
                  <div style={{ height:4, background:'#e2e8f0', borderRadius:99 }}>
                    <div style={{ height:'100%', borderRadius:99, background:c, width:`${pct(ini)}%`, transition:'width .4s' }} />
                  </div>
                  <div style={{ fontSize:10, color:'#94a3b8', marginTop:3 }}>{pct(ini)}% ejecutado</div>
                </div>
              ))}
              {items.length === 0 && <div style={{ fontSize:12, color:'#cbd5e1', textAlign:'center', padding:'20px 0' }}>Sin iniciativas</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────
function TabDashboard({ iniciativas }) {
  const total = iniciativas.length;
  const totalPres = iniciativas.reduce((s,i) => s+i.presupuesto, 0);
  const totalEjec = iniciativas.reduce((s,i) => s+i.ejecutado, 0);
  const pctGlobal = totalPres > 0 ? Math.round((totalEjec/totalPres)*100) : 0;
  const porFase = FASES.map(f => ({ fase:f, count:iniciativas.filter(i=>i.fase===f).length }));

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {[
          { label:'Iniciativas totales', val:total, color:COLOR },
          { label:'Presupuesto total', val:fmt(totalPres), color:'#0ea5e9' },
          { label:'Ejecutado', val:fmt(totalEjec), color:'#10b981' },
          { label:'% Ejecución global', val:`${pctGlobal}%`, color:pctGlobal>=80?'#15803d':pctGlobal>=50?'#b45309':'#dc2626' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.color }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:20, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:700 }}>Distribución por fase</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {porFase.map(({ fase, count }) => {
            const c = FASE_COLOR[fase];
            const w = total > 0 ? Math.round((count/total)*100) : 0;
            return (
              <div key={fase} style={{ display:'grid', gridTemplateColumns:'160px 1fr 40px', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#475569', fontWeight:600 }}>{fase}</span>
                <div style={{ height:10, background:'#e2e8f0', borderRadius:99 }}>
                  <div style={{ height:'100%', borderRadius:99, background:c, width:`${w}%`, transition:'width .4s' }} />
                </div>
                <span style={{ fontSize:12, color:c, fontWeight:700, textAlign:'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Iniciativa','Municipio','CAR','Fase','Ejecución','Compromisos'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {iniciativas.map(ini => (
              <tr key={ini.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{ini.nombre}</td>
                <td style={TD}>{ini.municipio}</td>
                <td style={TD}>{ini.car}</td>
                <td style={TD}><FaseBadge fase={ini.fase}/></td>
                <td style={TD}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:80, height:6, background:'#e2e8f0', borderRadius:99 }}>
                      <div style={{ width:`${pct(ini)}%`, height:'100%', borderRadius:99, background:pct(ini)>=80?'#10b981':pct(ini)>=50?'#f59e0b':'#ef4444' }}/>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:'#475569' }}>{pct(ini)}%</span>
                  </div>
                </td>
                <td style={TD}>{ini.compromisos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Modal Detalle ──────────────────────────────────────────────────────
function ModalDetalle({ ini, onClose, onAvanzarFase, toast }) {
  const [tabD, setTabD] = useState('evidencias');
  const evs = EVIDENCIAS_MAP[ini.id] || [];
  const comps = COMPROMISOS_MAP[ini.id] || [];
  const sigFase = FASES[FASES.indexOf(ini.fase) + 1];

  return (
    <Modal title={ini.nombre} onClose={onClose} wide>
      <div style={{ marginBottom:12 }}>
        <FaseBadge fase={ini.fase} />
        {sigFase && (
          <button onClick={() => onAvanzarFase(ini.id)} style={{ marginLeft:10, padding:'4px 12px', borderRadius:7, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Avanzar → {sigFase}
          </button>
        )}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {[['Municipio',ini.municipio],['CAR',ini.car],['Responsable',ini.responsable],['Inicio',ini.fecha_inicio],['Presupuesto',fmt(ini.presupuesto)],['Ejecutado',`${fmt(ini.ejecutado)} (${pct(ini)}%)`]].map(([l,v]) => (
          <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
            <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:16 }}>
        {['evidencias','compromisos'].map(t => (
          <button key={t} onClick={()=>setTabD(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'8px 16px', fontSize:13, fontWeight:600, color:tabD===t?COLOR:'#64748b', borderBottom:`2px solid ${tabD===t?COLOR:'transparent'}`, marginBottom:-2, textTransform:'capitalize' }}>
            {t.charAt(0).toUpperCase()+t.slice(1)} <span style={{ fontSize:11, background:'#f1f5f9', borderRadius:999, padding:'1px 6px', marginLeft:4 }}>{t==='evidencias'?evs.length:comps.length}</span>
          </button>
        ))}
      </div>
      {tabD === 'evidencias' && (
        <div>
          {evs.length === 0 && <p style={{ color:'#94a3b8', fontSize:13, textAlign:'center', padding:'20px 0' }}>Sin evidencias registradas (demo)</p>}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {evs.map(e => (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>
                <IconImg /><div><div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{e.desc}</div><div style={{ fontSize:11, color:'#94a3b8' }}>{e.tipo}</div></div>
              </div>
            ))}
          </div>
          <button onClick={()=>toast('Evidencia adjuntada (demo)', true)} style={{ marginTop:12, padding:'7px 14px', borderRadius:8, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <IconPlus /> Agregar evidencia
          </button>
        </div>
      )}
      {tabD === 'compromisos' && (
        <div>
          {comps.length === 0 && <p style={{ color:'#94a3b8', fontSize:13, textAlign:'center', padding:'20px 0' }}>Sin compromisos registrados (demo)</p>}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {comps.map(c => (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>
                <span style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${c.cumplido?'#15803d':'#94a3b8'}`, background:c.cumplido?'#15803d':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {c.cumplido && <span style={{ color:'#fff', fontSize:10 }}>✓</span>}
                </span>
                <span style={{ fontSize:13, color:c.cumplido?'#15803d':'#475569', textDecoration:c.cumplido?'none':'none' }}>{c.texto}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

const TABS = ['Kanban','Dashboard'];

export default function InversionSocialPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Kanban');
  const [iniciativas, setIniciativas] = useState(INICIATIVAS);
  const [detalle, setDetalle] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });

  function showToast(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 3500);
  }

  function avanzarFase(id) {
    setIniciativas(prev => prev.map(i => {
      if (i.id !== id) return i;
      const idx = FASES.indexOf(i.fase);
      if (idx < FASES.length - 1) {
        const newFase = FASES[idx+1];
        if (detalle?.id === id) setDetalle({ ...i, fase: newFase });
        showToast(`Iniciativa avanzada a "${newFase}" (demo)`);
        return { ...i, fase: newFase };
      }
      return i;
    }));
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Inversión Social Territorial</span>
      </div>

      <InfoBanner />

      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Kanban'    && <TabKanban iniciativas={iniciativas} onVerDetalle={setDetalle} />}
      {tab === 'Dashboard' && <TabDashboard iniciativas={iniciativas} />}

      {detalle && (
        <ModalDetalle
          ini={detalle}
          onClose={() => setDetalle(null)}
          onAvanzarFase={avanzarFase}
          toast={showToast}
        />
      )}
      <Toast {...toast} />
    </div>
  );
}
