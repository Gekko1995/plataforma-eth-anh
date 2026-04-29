import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#7C3AED';
const META  = modulos.find(m => m.id === 12);

const HOY = new Date('2024-12-05');
const diasHasta = (fecha) => Math.ceil((new Date(fecha) - HOY) / 86400000);
const estaVencida = (fecha) => new Date(fecha) < HOY;
const addMeses = (base, m) => { const d = new Date(base); d.setMonth(d.getMonth()+m); return d.toISOString().slice(0,10); };

const MODULOS_INDUCCION = [
  { id:'m1', nombre:'Contexto institucional: misión, visión y marco normativo', duracion:'2h', obligatorio:true  },
  { id:'m2', nombre:'Roles y responsabilidades del convenio',              duracion:'1h', obligatorio:true  },
  { id:'m3', nombre:'Ética pública y conflictos de interés',               duracion:'1.5h', obligatorio:true },
  { id:'m4', nombre:'Gestión documental y reporte de avances',             duracion:'2h', obligatorio:true  },
  { id:'m5', nombre:'Seguridad y salud en el trabajo — generalidades',    duracion:'3h', obligatorio:true  },
];

const PERSONAL = [
  { id:'p01', nombre:'Ing. Laura Castillo',   cargo:'Coordinadora CAR',       region:'Orinoquía',  induccion:[true,true,true,true,true],   hse_fecha:'2025-06-15', hse_nivel:'Avanzado' },
  { id:'p02', nombre:'Ing. Pedro Salinas',    cargo:'Técnico Campo',          region:'Macarena',   induccion:[true,true,true,true,false],  hse_fecha:'2024-11-20', hse_nivel:'Básico'   },
  { id:'p03', nombre:'Ing. Clara Moreno',     cargo:'Líder Ambiental',        region:'Amazonia',   induccion:[true,true,true,true,true],   hse_fecha:'2025-04-10', hse_nivel:'Intermedio' },
  { id:'p04', nombre:'Ing. Roberto Pinto',    cargo:'Técnico GIS',            region:'Amazonia Or.',induccion:[true,false,false,false,false],hse_fecha:'2024-10-01', hse_nivel:'Básico' },
  { id:'p05', nombre:'Ing. Sandra Vargas',    cargo:'Coordinadora Proyecto',  region:'Boyacá',     induccion:[true,true,true,true,true],   hse_fecha:'2025-09-30', hse_nivel:'Avanzado' },
  { id:'p06', nombre:'Ing. Luis Herrera',     cargo:'Técnico Social',         region:'Santander',  induccion:[true,true,true,false,false],  hse_fecha:'2024-09-15', hse_nivel:'Básico'  },
  { id:'p07', nombre:'Ing. Patricia Ríos',    cargo:'Profesional Agropecuario',region:'Antioquia', induccion:[true,true,true,true,true],   hse_fecha:'2025-03-22', hse_nivel:'Avanzado' },
  { id:'p08', nombre:'Ing. Carlos Mendoza',   cargo:'Profesional Financiero', region:'Córdoba',    induccion:[true,true,false,false,false], hse_fecha:'2025-01-10', hse_nivel:'Intermedio' },
  { id:'p09', nombre:'Ing. Nelly Torres',     cargo:'Profesional M&E',        region:'Santander',  induccion:[true,true,true,true,true],   hse_fecha:'2025-07-05', hse_nivel:'Avanzado' },
  { id:'p10', nombre:'Ing. Fabio Guerrero',   cargo:'Técnico HSE',            region:'Córdoba',    induccion:[true,true,true,true,true],   hse_fecha:'2025-11-30', hse_nivel:'Avanzado' },
];

const pctInduccion = (p) => Math.round((p.induccion.filter(Boolean).length / MODULOS_INDUCCION.length)*100);
const induccionCompleta = (p) => p.induccion.every(Boolean);
const hseVigente = (p) => !estaVencida(p.hse_fecha);
const hseAlerta  = (p) => { const d = diasHasta(p.hse_fecha); return d >= 0 && d <= 30; };

const NIVEL_COLOR = { Básico:'#3b82f6', Intermedio:'#f59e0b', Avanzado:'#10b981' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconLock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconWarn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;


const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

// ── Tab Inducción ──────────────────────────────────────────────────────
function TabInduccion({ showToast }) {
  return (
    <div>
      <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:16, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700 }}>Ruta de Inducción Obligatoria — {MODULOS_INDUCCION.length} módulos</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {MODULOS_INDUCCION.map((m, idx) => (
            <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:9 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:COLOR, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>{idx+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{m.nombre}</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>{m.duracion} · {m.obligatorio?'Obligatorio':''}</div>
              </div>
              <button onClick={() => showToast(`Módulo "${m.nombre}" abierto (demo)`)} style={{ padding:'4px 10px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                Ver →
              </button>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Estado de inducción por persona</h3>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            <th style={TH}>Persona</th>
            <th style={TH}>Cargo</th>
            {MODULOS_INDUCCION.map((_,i) => <th key={i} style={{...TH, textAlign:'center'}}>M{i+1}</th>)}
            <th style={TH}>Avance</th>
          </tr></thead>
          <tbody>
            {PERSONAL.map(p => {
              const pct = pctInduccion(p);
              const completa = induccionCompleta(p);
              return (
                <tr key={p.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD,fontWeight:600,color:'#1e293b'}}>{p.nombre.replace('Ing. ','')}</td>
                  <td style={{...TD,fontSize:11,color:'#64748b'}}>{p.cargo}</td>
                  {p.induccion.map((done,i) => (
                    <td key={i} style={{...TD, textAlign:'center'}}>
                      <span style={{ fontSize:14 }}>{done ? '✓' : '○'}</span>
                    </td>
                  ))}
                  <td style={TD}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:60, height:6, background:'#e2e8f0', borderRadius:99 }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:completa?'#10b981':pct>=60?COLOR:'#94a3b8' }}/>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:completa?'#15803d':COLOR }}>{pct}%</span>
                      {!completa && <span title="Inducción incompleta — acceso restringido"><IconLock/></span>}
                    </div>
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

// ── Tab HSE ────────────────────────────────────────────────────────────
function TabHSE({ showToast }) {
  const vencidos = PERSONAL.filter(p => !hseVigente(p));
  const alertas  = PERSONAL.filter(p => hseVigente(p) && hseAlerta(p));

  return (
    <div>
      {vencidos.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 16px', marginBottom:12, display:'flex', gap:10, alignItems:'center' }}>
          <IconWarn />
          <span style={{ fontSize:13, fontWeight:700, color:'#7f1d1d' }}>{vencidos.length} persona(s) con certificación HSE vencida — acceso bloqueado automáticamente</span>
        </div>
      )}
      {alertas.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:10, alignItems:'center' }}>
          <IconWarn />
          <span style={{ fontSize:13, fontWeight:700, color:'#713f12' }}>{alertas.length} persona(s) con HSE por vencer en los próximos 30 días</span>
        </div>
      )}

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Persona','Cargo','Región','Nivel HSE','Vence','Estado','Acción'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {PERSONAL.map(p => {
              const vigente = hseVigente(p);
              const alerta  = vigente && hseAlerta(p);
              const dias    = diasHasta(p.hse_fecha);
              const nc = NIVEL_COLOR[p.hse_nivel] || '#64748b';
              return (
                <tr key={p.id} style={{ borderBottom:'1px solid #f1f5f9', background:!vigente?'#fff5f5':alerta?'#fffbeb':'transparent' }}>
                  <td style={{...TD,fontWeight:600,color:'#1e293b'}}>{p.nombre.replace('Ing. ','')}</td>
                  <td style={{...TD,fontSize:11}}>{p.cargo}</td>
                  <td style={{...TD,fontSize:11}}>{p.region}</td>
                  <td style={TD}><span style={{ fontSize:11, background:nc+'18', color:nc, border:`1px solid ${nc}44`, borderRadius:6, padding:'2px 7px', fontWeight:700 }}>{p.hse_nivel}</span></td>
                  <td style={TD}>{p.hse_fecha}</td>
                  <td style={TD}>
                    {!vigente
                      ? <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'#dc2626', background:'#fee2e2', borderRadius:999, padding:'2px 9px' }}><span style={{ width:0,height:0,borderLeft:'4px solid transparent',borderRight:'4px solid transparent',borderBottom:'7px solid #dc2626' }}/> Vencida</span>
                      : alerta
                        ? <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'#b45309', background:'#fef9c3', borderRadius:999, padding:'2px 9px' }}><span style={{ width:8,height:8,borderRadius:1,background:'#b45309' }}/> Alerta ({dias}d)</span>
                        : <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'#15803d', background:'#dcfce7', borderRadius:999, padding:'2px 9px' }}><span style={{ width:8,height:8,borderRadius:'50%',background:'#15803d' }}/> Vigente</span>
                    }
                  </td>
                  <td style={TD}>
                    {(!vigente || alerta) && (
                      <button onClick={() => showToast(`Renovación HSE programada para ${p.nombre.replace('Ing. ','')} (demo)`)} style={{ padding:'3px 10px', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                        Renovar
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

// ── Tab Cumplimiento ───────────────────────────────────────────────────
function TabCumplimiento() {
  const bloqueados = PERSONAL.filter(p => !induccionCompleta(p) || !hseVigente(p));
  const completos  = PERSONAL.filter(p => induccionCompleta(p) && hseVigente(p));

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Total personal', val:PERSONAL.length, c:'#475569' },
          { label:'Habilitados', val:completos.length, c:'#15803d' },
          { label:'Con restricción', val:bloqueados.length, c:'#dc2626' },
          { label:'% Cumplimiento', val:`${Math.round((completos.length/PERSONAL.length)*100)}%`, c:COLOR },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {PERSONAL.map(p => {
          const ind = induccionCompleta(p);
          const hse = hseVigente(p);
          const ok  = ind && hse;
          return (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:ok?'#f0fdf4':'#fff5f5', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, borderRadius:10 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:ok?'#15803d':'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>{ok?'✓':'✗'}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{p.nombre} <span style={{ fontSize:11, color:'#64748b', fontWeight:400 }}>— {p.cargo}</span></div>
                <div style={{ display:'flex', gap:8, marginTop:3 }}>
                  <span style={{ fontSize:11, color:ind?'#15803d':'#dc2626' }}>{ind?'✓ Inducción':'✗ Inducción incompleta'}</span>
                  <span style={{ fontSize:11, color:'#94a3b8' }}>·</span>
                  <span style={{ fontSize:11, color:hse?'#15803d':'#dc2626' }}>{hse?'✓ HSE vigente':'✗ HSE vencida'}</span>
                </div>
              </div>
              {!ok && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'#dc2626', background:'#fee2e2', borderRadius:999, padding:'3px 9px' }}>
                  <IconLock /> Bloqueado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


const TABS = ['Ruta Inducción','Certificación HSE','Cumplimiento'];

export default function CampusPersonalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Ruta Inducción');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Campus Virtual Personal Convenio</span>
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

      {tab === 'Ruta Inducción'   && <TabInduccion showToast={showToast} />}
      {tab === 'Certificación HSE' && <TabHSE showToast={showToast} />}
      {tab === 'Cumplimiento'     && <TabCumplimiento />}

      <Toast {...toast} />
    </div>
  );
}
