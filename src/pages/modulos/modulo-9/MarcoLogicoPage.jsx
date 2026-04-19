import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#B45309';
const META  = modulos.find(m => m.id === 9);

const PROBLEMA_CENTRAL = 'Baja competitividad de los productores agropecuarios en zonas PDET';

const CAUSAS = [
  { id:'c1', texto:'Acceso limitado a mercados nacionales e internacionales', hijos:['Falta de canales de comercialización','Desconocimiento de estándares de calidad'] },
  { id:'c2', texto:'Baja capacidad técnica y organizacional de productores', hijos:['Escasa formación en buenas prácticas agrícolas','Débil asociatividad gremial'] },
  { id:'c3', texto:'Infraestructura productiva deficiente',                   hijos:['Vías terciarias en mal estado','Falta de centros de acopio'] },
];

const EFECTOS = [
  { id:'e1', texto:'Migración forzada de jóvenes rurales a centros urbanos' },
  { id:'e2', texto:'Persistencia de cultivos ilícitos como alternativa económica' },
  { id:'e3', texto:'Deterioro de la seguridad alimentaria regional' },
];

const MATRIZ = [
  {
    nivel:'Fin', desc:'Contribuir al desarrollo sostenible y paz territorial en zonas PDET',
    indicadores:['% reducción cultivos ilícitos en área de intervención','# familias con ingresos por encima de línea de pobreza'],
    fuentes:['UNODC - Monitoreo coca','DANE - Encuesta calidad de vida'],
    supuestos:['Estabilidad política y seguridad en la región','Voluntad institucional sostenida'],
  },
  {
    nivel:'Propósito', desc:'Aumentar en 40% los ingresos de 500 familias productoras en 24 meses',
    indicadores:['Variación ingreso bruto familiar (%)','# familias vinculadas a cadenas de exportación'],
    fuentes:['Sistema SINAPSIS 3D - Fichas técnicas','Registros comerciales SAC'],
    supuestos:['Permanencia de beneficiarios en programa','Acceso real a mercados formalizado'],
  },
  {
    nivel:'Componentes', desc:'C1: Capacitación técnica | C2: Asociatividad | C3: Infraestructura | C4: Mercados',
    indicadores:['# productores certificados BPA','# asociaciones fortalecidas','km vía terciaria habilitada','# acuerdos comerciales formalizados'],
    fuentes:['Registros SINAPSIS','ICA - Certificaciones','INVIAS - reportes','Cámara Comercio'],
    supuestos:['Disponibilidad presupuestal oportuna','Aprobación comunitaria de intervenciones'],
  },
  {
    nivel:'Actividades', desc:'A1.1 Talleres BPA · A1.2 Pasantías · A2.1 Constitución asociaciones · A3.1 Mejora vías · A4.1 Ruedas negocios',
    indicadores:['# talleres realizados / planeados','# pasantías completadas','# asociaciones constituidas','# eventos de negocio realizados'],
    fuentes:['Informes técnicos internos','Listas de asistencia','Actas notariales','Memorias eventos'],
    supuestos:['Logística disponible','Asistencia comprometida de beneficiarios','Aliados estratégicos activos'],
  },
];

const ACTIVIDADES_GANTT = [
  { id:'g1',  nombre:'Diagnóstico productivo participativo',  inicio:1,  duracion:2, componente:'C1', responsable:'Coord. Técnico' },
  { id:'g2',  nombre:'Diseño curricular talleres BPA',        inicio:2,  duracion:1, componente:'C1', responsable:'Ing. Agrónomo' },
  { id:'g3',  nombre:'Talleres BPA – Módulo 1 (cultivos)',    inicio:3,  duracion:2, componente:'C1', responsable:'Ing. Agrónomo' },
  { id:'g4',  nombre:'Talleres BPA – Módulo 2 (poscosecha)',  inicio:5,  duracion:2, componente:'C1', responsable:'Ing. Agrónomo' },
  { id:'g5',  nombre:'Constitución 5 asociaciones piloto',    inicio:3,  duracion:3, componente:'C2', responsable:'Trabajo Social' },
  { id:'g6',  nombre:'Capacitación gestión asociativa',       inicio:6,  duracion:2, componente:'C2', responsable:'Adm. Empresas' },
  { id:'g7',  nombre:'Estudios topográficos vías',            inicio:2,  duracion:2, componente:'C3', responsable:'Ing. Civil' },
  { id:'g8',  nombre:'Obras vías terciarias fase 1',          inicio:6,  duracion:4, componente:'C3', responsable:'Contratista' },
  { id:'g9',  nombre:'Rueda negocios regional',               inicio:8,  duracion:1, componente:'C4', responsable:'Coord. Comercial' },
  { id:'g10', nombre:'Feria internacional exportadora',       inicio:12, duracion:1, componente:'C4', responsable:'Coord. Comercial' },
  { id:'g11', nombre:'Seguimiento y evaluación intermedia',   inicio:13, duracion:1, componente:'C1', responsable:'M&E' },
  { id:'g12', nombre:'Evaluación final del proyecto',         inicio:23, duracion:2, componente:'C1', responsable:'M&E' },
];

const COMP_COLOR = { 'C1':'#3b82f6','C2':'#10b981','C3':'#f59e0b','C4':'#8b5cf6','M&E':'#64748b' };
const MESES = Array.from({ length:24 }, (_,i) => `M${i+1}`);

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 10px', fontSize:12, color:'#475569', verticalAlign:'top' };

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

// ── Tab Árbol ──────────────────────────────────────────────────────────
function TabArbol() {
  const [expandedCausa, setExpandedCausa] = useState(null);

  return (
    <div style={{ maxWidth:760 }}>
      {/* Efectos */}
      <div style={{ marginBottom:16 }}>
        <div style={{ textAlign:'center', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>EFECTOS</div>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          {EFECTOS.map(e => (
            <div key={e.id} style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:9, padding:'10px 14px', fontSize:13, color:'#7f1d1d', fontWeight:500, maxWidth:220, textAlign:'center', lineHeight:1.4 }}>
              {e.texto}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'center', margin:'6px 0' }}>
          <div style={{ width:2, height:24, background:'#fca5a5' }}/>
        </div>
      </div>

      {/* Problema central */}
      <div style={{ background:COLOR, borderRadius:12, padding:'16px 24px', textAlign:'center', color:'#fff', fontSize:15, fontWeight:700, lineHeight:1.4, marginBottom:6, boxShadow:`0 4px 20px ${COLOR}44` }}>
        {PROBLEMA_CENTRAL}
      </div>
      <div style={{ display:'flex', justifyContent:'center', margin:'6px 0' }}>
        <div style={{ width:2, height:24, background:'#fde68a' }}/>
      </div>

      {/* Causas */}
      <div style={{ textAlign:'center', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>CAUSAS DIRECTAS</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {CAUSAS.map(c => (
          <div key={c.id}>
            <div onClick={() => setExpandedCausa(expandedCausa===c.id ? null : c.id)} style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:9, padding:'10px 14px', fontSize:13, color:'#713f12', fontWeight:600, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              {c.texto}
              <span style={{ fontSize:12, color:'#b45309' }}>{expandedCausa===c.id ? '▲' : '▼'}</span>
            </div>
            {expandedCausa === c.id && (
              <div style={{ marginTop:4, marginLeft:20, display:'flex', flexDirection:'column', gap:4 }}>
                {c.hijos.map((h,i) => (
                  <div key={i} style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:7, padding:'8px 12px', fontSize:12, color:'#9a3412' }}>{h}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab Matriz Lógica ──────────────────────────────────────────────────
function TabMatriz() {
  const NIVEL_COLOR = { Fin:'#8b5cf6', Propósito:'#3b82f6', Componentes:COLOR, Actividades:'#10b981' };
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:800 }}>
        <thead>
          <tr style={{ background:'#f8fafc' }}>
            {['Nivel','Descripción','Indicadores','Fuentes de verificación','Supuestos'].map(h => (
              <th key={h} style={TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIZ.map(row => {
            const c = NIVEL_COLOR[row.nivel] || '#64748b';
            return (
              <tr key={row.nivel} style={{ borderBottom:'1px solid #e2e8f0' }}>
                <td style={{ ...TD, verticalAlign:'middle' }}>
                  <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:c+'22', color:c, border:`1px solid ${c}44`, whiteSpace:'nowrap' }}>{row.nivel}</span>
                </td>
                <td style={{ ...TD, maxWidth:200, fontWeight:500 }}>{row.desc}</td>
                <td style={TD}><ul style={{ margin:0, paddingLeft:16 }}>{row.indicadores.map((ind,i)=><li key={i} style={{ marginBottom:3 }}>{ind}</li>)}</ul></td>
                <td style={TD}><ul style={{ margin:0, paddingLeft:16 }}>{row.fuentes.map((f,i)=><li key={i} style={{ marginBottom:3 }}>{f}</li>)}</ul></td>
                <td style={TD}><ul style={{ margin:0, paddingLeft:16 }}>{row.supuestos.map((s,i)=><li key={i} style={{ marginBottom:3 }}>{s}</li>)}</ul></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Tab Gantt ──────────────────────────────────────────────────────────
function TabGantt() {
  const CELL_W = 32;
  const ROW_H  = 36;

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {Object.entries(COMP_COLOR).map(([k,c]) => (
          <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:c, background:c+'18', border:`1px solid ${c}44`, borderRadius:6, padding:'2px 8px', fontWeight:700 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:c, flexShrink:0 }}/>{k}
          </span>
        ))}
      </div>
      <div style={{ overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:12 }}>
        <div style={{ minWidth: 300 + MESES.length * CELL_W }}>
          {/* Header meses */}
          <div style={{ display:'flex', borderBottom:'2px solid #e2e8f0', background:'#f8fafc' }}>
            <div style={{ width:300, flexShrink:0, padding:'8px 12px', fontSize:11, fontWeight:700, color:'#64748b', borderRight:'1px solid #e2e8f0' }}>Actividad</div>
            {MESES.map(m => (
              <div key={m} style={{ width:CELL_W, flexShrink:0, textAlign:'center', padding:'8px 2px', fontSize:10, fontWeight:700, color:'#94a3b8', borderRight:'1px solid #f1f5f9' }}>{m}</div>
            ))}
          </div>
          {/* Filas */}
          {ACTIVIDADES_GANTT.map((act, idx) => {
            const c = COMP_COLOR[act.componente] || '#64748b';
            return (
              <div key={act.id} style={{ display:'flex', alignItems:'center', borderBottom:'1px solid #f1f5f9', height:ROW_H, background:idx%2===0?'#fff':'#fafafa' }}>
                <div style={{ width:300, flexShrink:0, padding:'0 12px', fontSize:12, color:'#1e293b', fontWeight:500, borderRight:'1px solid #e2e8f0', lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {act.nombre}
                </div>
                {MESES.map((m, mi) => {
                  const mesNum = mi + 1;
                  const activo = mesNum >= act.inicio && mesNum < act.inicio + act.duracion;
                  const esInicio = mesNum === act.inicio;
                  const esFin    = mesNum === act.inicio + act.duracion - 1;
                  return (
                    <div key={m} style={{ width:CELL_W, flexShrink:0, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #f1f5f9', padding:'4px 2px' }}>
                      {activo && (
                        <div style={{ width:'100%', height:12, background:c, borderRadius:`${esInicio?6:0}px ${esFin?6:0}px ${esFin?6:0}px ${esInicio?6:0}px`, opacity:.85 }}/>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const TABS = ['Árbol de Problemas','Matriz Lógica','Gantt'];

export default function MarcoLogicoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Árbol de Problemas');

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4, padding:'6px 8px', borderRadius:7, fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <IconBack /> Módulos
        </button>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Formulación Marco Lógico</span>
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

      {tab === 'Árbol de Problemas' && <TabArbol />}
      {tab === 'Matriz Lógica'      && <TabMatriz />}
      {tab === 'Gantt'              && <TabGantt />}
    </div>
  );
}
