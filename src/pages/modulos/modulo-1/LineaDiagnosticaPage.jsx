import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

// ── Colores del módulo (Grupo A) ──────────────────────────────────────
const COLOR   = '#1B6B4A';
const COLOR_L = '#1B6B4A22';

// Datos descriptivos del módulo (provenientes de modulos.js)
const META = modulos.find(m => m.id === 1);

// ── Datos demo ────────────────────────────────────────────────────────
const DEMO_FICHAS = [
  { id: 'f1', municipio: 'Aguazul',       departamento: 'Casanare',          region: 'Orinoquía',    poblacion_total: 47820, actividad_economica: 'Industria, ganadería extensiva', presencia_institucional: ['Alcaldía', 'Gobernación', 'ANLA', 'Operadora regional'], nivel_conflictividad: 'alto',    observaciones: 'Alta presencia de industria. Tensión por uso del suelo entre sector productivo y comunidades campesinas.' },
  { id: 'f2', municipio: 'Yopal',         departamento: 'Casanare',          region: 'Orinoquía',    poblacion_total: 180220, actividad_economica: 'Servicios, agroindustria', presencia_institucional: ['Alcaldía', 'Gobernación', 'Entidad contratante', 'ICBF'], nivel_conflictividad: 'medio',  observaciones: 'Capital departamental con dinámicas urbanas. Crecimiento acelerado por nueva inversión productiva.' },
  { id: 'f3', municipio: 'Tauramena',     departamento: 'Casanare',          region: 'Orinoquía',    poblacion_total: 20550, actividad_economica: 'Industria, turismo, ganadería', presencia_institucional: ['Alcaldía', 'Operadora regional', 'Parques Nacionales'], nivel_conflictividad: 'critico', observaciones: 'Zona limítrofe con área protegida. Conflicto activo entre operación industrial y comunidades.' },
  { id: 'f4', municipio: 'Villanueva',    departamento: 'Casanare',          region: 'Orinoquía',    poblacion_total: 31000, actividad_economica: 'Turismo, palma africana', presencia_institucional: ['Alcaldía', 'Corporinoquia'], nivel_conflictividad: 'bajo',    observaciones: 'Potencial turístico en crecimiento. Baja conflictividad social.' },
  { id: 'f5', municipio: 'Saravena',      departamento: 'Arauca',            region: 'Orinoquía',    poblacion_total: 64000, actividad_economica: 'Cacao, ganadería, agroindustria', presencia_institucional: ['Alcaldía', 'Gobernación', 'Ejército Nacional', 'Defensoría'], nivel_conflictividad: 'critico', observaciones: 'Zona de presencia histórica de grupos armados. Producción cacaotera como alternativa económica.' },
  { id: 'f6', municipio: 'Puerto Gaitán', departamento: 'Meta',              region: 'Orinoquía',    poblacion_total: 19000, actividad_economica: 'Agroindustria, ganadería', presencia_institucional: ['Alcaldía', 'Operadora regional', 'ANLA', 'Entidad contratante'], nivel_conflictividad: 'alto',    observaciones: 'Municipio con alta actividad productiva. Pasivos ambientales y conflictos laborales.' },
  { id: 'f7', municipio: 'Mocoa',         departamento: 'Putumayo',          region: 'Amazonia',     poblacion_total: 44000, actividad_economica: 'Agroindustria, cultivos ilícitos (en reducción), ecoturismo', presencia_institucional: ['Alcaldía', 'Gobernación', 'ART', 'UNODC'], nivel_conflictividad: 'alto',    observaciones: 'Capital departamental con fuerte presencia institucional post-PNIS. Avance en sustitución de cultivos.' },
  { id: 'f8', municipio: 'La Dorada',     departamento: 'Caldas',            region: 'Magdalena Medio', poblacion_total: 78000, actividad_economica: 'Puerto fluvial, ganadería, pesca', presencia_institucional: ['Alcaldía', 'CORPOCALDAS', 'DIMAR'], nivel_conflictividad: 'medio',  observaciones: 'Nodo logístico del Magdalena Medio. Conflictos por contaminación hídrica del río Magdalena.' },
];

const DEMO_ACTORES = [
  { id: 'a1',  ficha_id: 'f1', nombre: 'Ecopetrol S.A.',                    tipo: 'privado',        nivel_influencia: 5, municipio: 'Aguazul',    contacto: 'relacionamiento@ecopetrol.com.co', notas: 'Principal operador. Programa de responsabilidad social activo.' },
  { id: 'a2',  ficha_id: 'f1', nombre: 'Asociación de Juntas de Aguazul',   tipo: 'comunitario',    nivel_influencia: 3, municipio: 'Aguazul',    contacto: 'jac.aguazul@gmail.com', notas: 'Agrupa 42 JAC. Interés en compensaciones ambientales y vías.' },
  { id: 'a3',  ficha_id: 'f1', nombre: 'ANLA Regional Llanos',              tipo: 'institucional',  nivel_influencia: 4, municipio: 'Yopal',      contacto: 'anla.llanos@anla.gov.co', notas: 'Autoridad ambiental de licenciamiento. Competencia en proyectos > 5.000 ha.' },
  { id: 'a4',  ficha_id: 'f2', nombre: 'Alcaldía de Yopal',                 tipo: 'institucional',  nivel_influencia: 5, municipio: 'Yopal',      contacto: 'alcalde@yopal-casanare.gov.co', notas: 'Gobierno local. Liderazgo en Plan de Desarrollo "Casanare que avanza".' },
  { id: 'a5',  ficha_id: 'f2', nombre: 'Fenalco Casanare',                  tipo: 'privado',        nivel_influencia: 3, municipio: 'Yopal',      contacto: 'fenalco.casanare@fenalco.com.co', notas: 'Gremio comercio formal. Interés en infraestructura vial y servicios.' },
  { id: 'a6',  ficha_id: 'f3', nombre: 'Comunidad Indígena Sikuani',        tipo: 'comunitario',    nivel_influencia: 4, municipio: 'Tauramena',  contacto: 'cabildo.sikuani@gmail.com', notas: 'Resguardo colindante con bloque Cusiana. Proceso de consulta previa activo.' },
  { id: 'a7',  ficha_id: 'f3', nombre: 'Parques Nacionales Naturales',      tipo: 'institucional',  nivel_influencia: 5, municipio: 'Tauramena',  contacto: 'pnn.cordilleradelosandes@parquesnacionales.gov.co', notas: 'Administra zona amortiguadora. Oposición a ampliación de bloque.' },
  { id: 'a8',  ficha_id: 'f5', nombre: 'Comité de Cafeteros Arauca',        tipo: 'comunitario',    nivel_influencia: 3, municipio: 'Saravena',   contacto: 'comite.arauca@fedecafe.com.co', notas: 'Liderazgo en diversificación productiva cacao-café.' },
  { id: 'a9',  ficha_id: 'f5', nombre: 'Defensoría del Pueblo Arauca',      tipo: 'institucional',  nivel_influencia: 4, municipio: 'Arauca',     contacto: 'defensoria.arauca@defensoria.gov.co', notas: 'Monitoreo DDHH. Alertas tempranas emitidas en 2024.' },
  { id: 'a10', ficha_id: 'f6', nombre: 'Gran Tierra Energy Colombia',        tipo: 'privado',        nivel_influencia: 5, municipio: 'Puerto Gaitán', contacto: 'colombia@gratierra.com', notas: 'Operador bloque CPE-6. Mayor empleador privado del municipio.' },
  { id: 'a11', ficha_id: 'f7', nombre: 'ART — Agencia Renovación Territorio', tipo: 'institucional', nivel_influencia: 5, municipio: 'Mocoa',    contacto: 'art@renovacionterritorio.gov.co', notas: 'Coordinación PDET Piedemonte Amazónico. Inversiones 2024-2026.' },
  { id: 'a12', ficha_id: 'f7', nombre: 'UNODC Colombia',                    tipo: 'internacional',  nivel_influencia: 4, municipio: 'Mocoa',      contacto: 'colombia@unodc.org', notas: 'Apoyo técnico y financiero al PNIS. Monitoreo cultivos ilícitos.' },
];

const DEMO_CONFLICTOS = [
  { id: 'c1',  ficha_id: 'f1', categoria: 'Ambiental',    variable: 'Contaminación de fuentes hídricas por vertimientos de producción',  nivel: 'alto',    descripcion: 'Derrames frecuentes en los ríos Unete y Chiquito. 3 eventos en 2024.' },
  { id: 'c2',  ficha_id: 'f1', categoria: 'Social',       variable: 'Disputa por acceso a empleos locales en sector productivo',         nivel: 'medio',   descripcion: 'Comunidades exigen cuota mínima del 30% de empleos para residentes.' },
  { id: 'c3',  ficha_id: 'f3', categoria: 'Territorial',  variable: 'Superposición de bloque Cusiana con zona de amortiguamiento PNN',   nivel: 'critico', descripcion: 'Conflicto jurídico activo. Expediente ANLA 2022-015432.' },
  { id: 'c4',  ficha_id: 'f3', categoria: 'Étnico',       variable: 'Consulta previa incompleta con resguardo Sikuani',                  nivel: 'critico', descripcion: 'Proceso suspendido por incumplimiento de acuerdos en fase 2.' },
  { id: 'c5',  ficha_id: 'f5', categoria: 'Político',     variable: 'Presencia de grupos armados no estatales',                         nivel: 'critico', descripcion: 'ELN mantiene influencia en corredores rurales. 14 eventos 2024.' },
  { id: 'c6',  ficha_id: 'f5', categoria: 'Económico',    variable: 'Economías ilegales como sustituto ante baja institucionalidad',    nivel: 'alto',    descripcion: 'Cultivos de coca en reducción pero minería ilegal en aumento.' },
  { id: 'c7',  ficha_id: 'f6', categoria: 'Ambiental',    variable: 'Pasivos ambientales de pozos abandonados sin remediación',         nivel: 'alto',    descripcion: '47 pozos abandonados identificados. Plan de remediación pendiente desde 2021.' },
  { id: 'c8',  ficha_id: 'f6', categoria: 'Social',       variable: 'Conflicto por distribución de regalías y recursos territoriales', nivel: 'medio',   descripcion: 'Disputa entre municipio y departamento por asignación de regalías directas.' },
  { id: 'c9',  ficha_id: 'f7', categoria: 'Territorial',  variable: 'Titulación de predios en zonas de antigua colonización',           nivel: 'medio',   descripcion: '2.300 familias sin títulos en área de influencia PDET.' },
  { id: 'c10', ficha_id: 'f8', categoria: 'Ambiental',    variable: 'Contaminación hídrica del río Magdalena',                         nivel: 'alto',    descripcion: 'Índice ICACOSU bajo. Vertimientos industriales sin tratar detectados.' },
  { id: 'c11', ficha_id: 'f2', categoria: 'Social',       variable: 'Presión migratoria y déficit de servicios urbanos',                nivel: 'bajo',    descripcion: 'Crecimiento urbano 4.2% anual supera capacidad de acueducto.' },
  { id: 'c12', ficha_id: 'f4', categoria: 'Económico',    variable: 'Dependencia turística sin diversificación productiva',            nivel: 'bajo',    descripcion: 'Temporalidad del turismo genera desempleo estacional (40%).' },
];

// ── Niveles ───────────────────────────────────────────────────────────
const NIVELES = {
  bajo:    { label: 'Bajo',    bg: '#dcfce7', color: '#15803d', shape: 'circle' },
  medio:   { label: 'Medio',   bg: '#fef9c3', color: '#854d0e', shape: 'square' },
  alto:    { label: 'Alto',    bg: '#ffedd5', color: '#c2410c', shape: 'triangle' },
  critico: { label: 'Crítico', bg: '#fee2e2', color: '#dc2626', shape: 'triangle' },
};

const TIPOS_ACTOR    = ['institucional','comunitario','privado','internacional','otro'];
const CATS_CONFLICTO = ['Ambiental','Social','Económico','Político','Territorial','Étnico','Otro'];

// ── Componentes UI ────────────────────────────────────────────────────
function NivelShape({ shape, color }) {
  if (shape === 'circle') return <span style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0, display:'inline-block' }} />;
  if (shape === 'square') return <span style={{ width:8, height:8, borderRadius:1, background:color, flexShrink:0, display:'inline-block' }} />;
  return <span style={{ width:0, height:0, flexShrink:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderBottom:`8px solid ${color}`, display:'inline-block' }} />;
}

function NivelBadge({ nivel }) {
  if (!nivel) return <span style={{ color:'#94a3b8' }}>—</span>;
  const n = NIVELES[nivel] || { label:nivel, bg:'#f1f5f9', color:'#475569', shape:'circle' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 10px', borderRadius:999, fontSize:12, fontWeight:600, background:n.bg, color:n.color }}>
      <NivelShape shape={n.shape} color={n.color} />
      {n.label}
    </span>
  );
}

function InfluenciaStars({ value }) {
  return (
    <span style={{ display:'inline-flex', gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:13, color: i <= value ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────
const IconBack  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconPlus  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconEdit  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconX     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconMap   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/></svg>;
const IconGrid  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

// ── Modal ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
    >
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth: wide ? 640 : 480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1e293b' }}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'#475569' }}>
        {label}{required && <span style={{ color:'#dc2626', marginLeft:2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background: ok ? '#dcfce7' : '#fee2e2', color: ok ? '#15803d' : '#dc2626', border:`1px solid ${ok ? '#86efac' : '#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>
      {ok ? '✓ ' : '✗ '}{msg}
    </div>
  );
}

const INPUT = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:14, fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

// ─────────────────────────────────────────────────────────────────────
// TAB RESUMEN
// ─────────────────────────────────────────────────────────────────────
function TabResumen({ fichas, actores, conflictos }) {
  const nivelCounts = ['bajo','medio','alto','critico'].map(n => ({ nivel:n, count: fichas.filter(f => f.nivel_conflictividad === n).length }));
  const tiposCount  = TIPOS_ACTOR.map(t => ({ tipo:t, count: actores.filter(a => a.tipo === t).length })).filter(t => t.count > 0);

  const kpis = [
    { label:'Fichas territoriales',   value: fichas.length,                                color: COLOR,    bg:'#f0fdf6' },
    { label:'Actores mapeados',        value: actores.length,                               color:'#0369A1', bg:'#f0f9ff' },
    { label:'Variables de conflicto',  value: conflictos.length,                            color:'#c2410c', bg:'#fff7ed' },
    { label:'Municipios cubiertos',    value: new Set(fichas.map(f => f.municipio)).size,   color:'#7C3AED', bg:'#faf5ff' },
  ];

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:28 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTop:`3px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <span className="kpi-label">{k.label}</span>
              <div style={{ width:30, height:30, borderRadius:7, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:14, fontWeight:700, color:k.color }}>#</span>
              </div>
            </div>
            <div className="kpi-value" style={{ color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 14px' }}>Niveles de conflictividad</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {nivelCounts.map(({ nivel, count }) => {
              const n = NIVELES[nivel];
              const pct = fichas.length ? (count / fichas.length) * 100 : 0;
              return (
                <div key={nivel}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <NivelBadge nivel={nivel} />
                    <span style={{ fontSize:12, color:'#64748b' }}>{count}</span>
                  </div>
                  <div style={{ height:6, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:n.color, borderRadius:4, transition:'width .5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 14px' }}>Tipos de actores</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {tiposCount.map(({ tipo, count }) => (
              <div key={tipo} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#475569', textTransform:'capitalize' }}>{tipo}</span>
                <span style={{ fontSize:12, fontWeight:600, background:COLOR_L, color:COLOR, padding:'1px 8px', borderRadius:999 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla resumen fichas */}
      <p style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:10 }}>Últimas fichas registradas</p>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Municipio','Departamento','Población','Conflictividad'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fichas.slice(0, 5).map((f, i) => (
              <tr key={f.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding:'9px 12px', fontWeight:600, fontSize:14, color:'#1e293b' }}>{f.municipio}</td>
                <td style={{ padding:'9px 12px', fontSize:13, color:'#475569' }}>{f.departamento}</td>
                <td style={{ padding:'9px 12px', fontSize:13, color:'#475569' }}>{f.poblacion_total?.toLocaleString('es-CO') || '—'}</td>
                <td style={{ padding:'9px 12px' }}><NivelBadge nivel={f.nivel_conflictividad} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB FICHAS
// ─────────────────────────────────────────────────────────────────────
function TabFichas({ fichas, setFichas }) {
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ msg:'', ok:true });

  const EMPTY = { municipio:'', departamento:'', region:'', poblacion_total:'', actividad_economica:'', presencia_institucional:'', nivel_conflictividad:'', observaciones:'' };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast({ msg:'', ok:true }), 3500); }

  function openNew() { setForm(EMPTY); setModal('new'); }

  function openEdit(f) {
    setForm({ ...f, presencia_institucional: (f.presencia_institucional || []).join(', '), poblacion_total: f.poblacion_total ?? '' });
    setModal(f);
  }

  function handleSave() {
    if (!form.municipio.trim() || !form.departamento.trim()) { showToast('Municipio y Departamento son requeridos.', false); return; }
    const payload = {
      municipio: form.municipio.trim(),
      departamento: form.departamento.trim(),
      region: form.region.trim() || null,
      poblacion_total: form.poblacion_total ? parseInt(form.poblacion_total, 10) : null,
      actividad_economica: form.actividad_economica.trim() || null,
      presencia_institucional: form.presencia_institucional ? form.presencia_institucional.split(',').map(s => s.trim()).filter(Boolean) : [],
      nivel_conflictividad: form.nivel_conflictividad || null,
      observaciones: form.observaciones.trim() || null,
    };
    if (modal === 'new') {
      setFichas(prev => [{ id: 'f' + Date.now(), ...payload }, ...prev]);
      showToast('Ficha creada (demo).');
    } else {
      setFichas(prev => prev.map(f => f.id === modal.id ? { ...f, ...payload } : f));
      showToast('Ficha actualizada (demo).');
    }
    setModal(null);
  }

  function handleDelete(f) {
    if (!window.confirm(`¿Eliminar la ficha de ${f.municipio}?`)) return;
    setFichas(prev => prev.filter(x => x.id !== f.id));
    showToast('Ficha eliminada (demo).');
  }

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <p style={{ fontSize:13, color:'var(--content-text-muted)', margin:0 }}>{fichas.length} ficha{fichas.length !== 1 ? 's' : ''} registrada{fichas.length !== 1 ? 's' : ''}</p>
        <button className="btn btn-primary btn-sm" onClick={openNew} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
          <IconPlus /> Nueva ficha
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Municipio','Departamento','Región','Población','Nivel de conflicto','Acciones'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fichas.map((f, i) => (
              <tr key={f.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding:'10px 12px', fontWeight:600, fontSize:14, color:'#1e293b' }}>{f.municipio}</td>
                <td style={{ padding:'10px 12px', fontSize:13, color:'#475569' }}>{f.departamento}</td>
                <td style={{ padding:'10px 12px', fontSize:13, color:'#475569' }}>{f.region || '—'}</td>
                <td style={{ padding:'10px 12px', fontSize:13, color:'#475569' }}>{f.poblacion_total?.toLocaleString('es-CO') || '—'}</td>
                <td style={{ padding:'10px 12px' }}><NivelBadge nivel={f.nivel_conflictividad} /></td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => openEdit(f)} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:4 }}><IconEdit /> Editar</button>
                    <button onClick={() => handleDelete(f)} className="btn btn-danger btn-sm" style={{ display:'flex', alignItems:'center', gap:4 }}><IconTrash /> Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'new' ? 'Nueva ficha territorial' : `Editar — ${modal.municipio}`} onClose={() => setModal(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Field label="Municipio" required><input className="form-input" style={INPUT} value={form.municipio} onChange={e => setForm(f => ({...f, municipio:e.target.value}))} placeholder="Ej: Aguazul" /></Field>
            <Field label="Departamento" required><input className="form-input" style={INPUT} value={form.departamento} onChange={e => setForm(f => ({...f, departamento:e.target.value}))} placeholder="Ej: Casanare" /></Field>
            <Field label="Región"><input className="form-input" style={INPUT} value={form.region} onChange={e => setForm(f => ({...f, region:e.target.value}))} placeholder="Ej: Orinoquía" /></Field>
            <Field label="Población total"><input type="number" className="form-input" style={INPUT} value={form.poblacion_total} onChange={e => setForm(f => ({...f, poblacion_total:e.target.value}))} placeholder="0" min="0" /></Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Actividad económica principal"><input className="form-input" style={INPUT} value={form.actividad_economica} onChange={e => setForm(f => ({...f, actividad_economica:e.target.value}))} placeholder="Ej: Agricultura, ganadería, agroindustria" /></Field></div>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Presencia institucional (separada por comas)"><input className="form-input" style={INPUT} value={form.presencia_institucional} onChange={e => setForm(f => ({...f, presencia_institucional:e.target.value}))} placeholder="Ej: Alcaldía, Gobernación, ANLA" /></Field></div>
            <Field label="Nivel de conflictividad">
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.nivel_conflictividad} onChange={e => setForm(f => ({...f, nivel_conflictividad:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {Object.entries(NIVELES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Observaciones"><textarea className="form-input" style={{ ...INPUT, resize:'vertical', minHeight:72 }} value={form.observaciones} onChange={e => setForm(f => ({...f, observaciones:e.target.value}))} placeholder="Contexto relevante del territorio…" /></Field></div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>
              {modal === 'new' ? 'Crear ficha' : 'Guardar cambios'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB ACTORES
// ─────────────────────────────────────────────────────────────────────
function TabActores({ actores, setActores, fichas }) {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroFicha, setFiltroFicha] = useState('');

  const EMPTY = { ficha_id:'', nombre:'', tipo:'', nivel_influencia:'3', municipio:'', contacto:'', notas:'' };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast({ msg:'', ok:true }), 3500); }

  function handleSave() {
    if (!form.nombre.trim()) { showToast('El nombre es requerido.', false); return; }
    setActores(prev => [{ id:'a'+Date.now(), ...form, nivel_influencia: parseInt(form.nivel_influencia, 10) }, ...prev]);
    showToast('Actor registrado (demo).');
    setModal(false);
    setForm(EMPTY);
  }

  function handleDelete(a) {
    if (!window.confirm(`¿Eliminar al actor "${a.nombre}"?`)) return;
    setActores(prev => prev.filter(x => x.id !== a.id));
    showToast('Actor eliminado (demo).');
  }

  const filtrados = filtroFicha ? actores.filter(a => a.ficha_id === filtroFicha) : actores;

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <select className="form-select" style={{ maxWidth:240 }} value={filtroFicha} onChange={e => setFiltroFicha(e.target.value)}>
          <option value="">Todos los municipios</option>
          {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY); setModal(true); }} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
          <IconPlus /> Registrar actor
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Actor','Tipo','Municipio','Influencia','Contacto',''].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a, i) => {
              const ficha = fichas.find(f => f.id === a.ficha_id);
              return (
                <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ fontWeight:600, fontSize:14, color:'#1e293b' }}>{a.nombre}</div>
                    {ficha && <div style={{ fontSize:12, color:'#64748b' }}>{ficha.municipio}</div>}
                  </td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontSize:12, fontWeight:500, background:COLOR_L, color:COLOR, padding:'2px 8px', borderRadius:999, textTransform:'capitalize' }}>{a.tipo || '—'}</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:13, color:'#475569' }}>{a.municipio || '—'}</td>
                  <td style={{ padding:'10px 12px' }}><InfluenciaStars value={a.nivel_influencia} /></td>
                  <td style={{ padding:'10px 12px', fontSize:13, color:'#475569', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.contacto || '—'}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <button onClick={() => handleDelete(a)} className="btn btn-danger btn-sm" style={{ display:'flex', alignItems:'center', gap:4 }}><IconTrash /> Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar actor" onClose={() => setModal(false)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Nombre del actor" required><input className="form-input" style={INPUT} value={form.nombre} onChange={e => setForm(f => ({...f, nombre:e.target.value}))} placeholder="Nombre o entidad" /></Field></div>
            <Field label="Tipo">
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.tipo} onChange={e => setForm(f => ({...f, tipo:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {TIPOS_ACTOR.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Ficha territorial">
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.ficha_id} onChange={e => setForm(f => ({...f, ficha_id:e.target.value}))}>
                <option value="">— Sin ficha —</option>
                {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio} — {f.departamento}</option>)}
              </select>
            </Field>
            <Field label="Municipio"><input className="form-input" style={INPUT} value={form.municipio} onChange={e => setForm(f => ({...f, municipio:e.target.value}))} placeholder="Municipio del actor" /></Field>
            <Field label="Nivel de influencia (1–5)">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="range" min="1" max="5" value={form.nivel_influencia} onChange={e => setForm(f => ({...f, nivel_influencia:e.target.value}))} style={{ flex:1 }} />
                <InfluenciaStars value={parseInt(form.nivel_influencia, 10)} />
              </div>
            </Field>
            <Field label="Contacto"><input className="form-input" style={INPUT} value={form.contacto} onChange={e => setForm(f => ({...f, contacto:e.target.value}))} placeholder="Email o teléfono" /></Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Notas"><textarea className="form-input" style={{ ...INPUT, resize:'vertical', minHeight:64 }} value={form.notas} onChange={e => setForm(f => ({...f, notas:e.target.value}))} placeholder="Rol, intereses, posición…" /></Field></div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Registrar actor</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TAB CONFLICTIVIDAD
// ─────────────────────────────────────────────────────────────────────
function TabConflictividad({ conflictos, setConflictos, fichas }) {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroFicha, setFiltroFicha] = useState('');
  const [filtroCat, setFiltroCat] = useState('');

  const EMPTY = { ficha_id:'', categoria:'', variable:'', nivel:'', descripcion:'' };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast({ msg:'', ok:true }), 3500); }

  function handleSave() {
    if (!form.categoria || !form.variable.trim()) { showToast('Categoría y variable son requeridas.', false); return; }
    setConflictos(prev => [{ id:'c'+Date.now(), ...form }, ...prev]);
    showToast('Variable registrada (demo).');
    setModal(false);
    setForm(EMPTY);
  }

  function handleDelete(c) {
    if (!window.confirm(`¿Eliminar la variable "${c.variable}"?`)) return;
    setConflictos(prev => prev.filter(x => x.id !== c.id));
    showToast('Variable eliminada (demo).');
  }

  const filtrados = conflictos
    .filter(c => !filtroFicha || c.ficha_id === filtroFicha)
    .filter(c => !filtroCat || c.categoria === filtroCat);

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <select className="form-select" style={{ maxWidth:220 }} value={filtroFicha} onChange={e => setFiltroFicha(e.target.value)}>
            <option value="">Todos los municipios</option>
            {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth:160 }} value={filtroCat} onChange={e => setFiltroCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATS_CONFLICTO.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY); setModal(true); }} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
          <IconPlus /> Nueva variable
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Categoría','Variable','Municipio','Nivel','Descripción',''].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c, i) => {
              const ficha = fichas.find(f => f.id === c.ficha_id);
              return (
                <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontSize:12, fontWeight:600, background:'#f1f5f9', color:'#475569', padding:'2px 8px', borderRadius:999 }}>{c.categoria}</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontWeight:500, fontSize:14, color:'#1e293b', maxWidth:240 }}>
                    <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.variable}</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:13, color:'#64748b' }}>{ficha?.municipio || '—'}</td>
                  <td style={{ padding:'10px 12px' }}><NivelBadge nivel={c.nivel} /></td>
                  <td style={{ padding:'10px 12px', fontSize:13, color:'#64748b', maxWidth:240 }}>
                    <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.descripcion || '—'}</span>
                  </td>
                  <td style={{ padding:'10px 12px' }}>
                    <button onClick={() => handleDelete(c)} className="btn btn-danger btn-sm" style={{ display:'flex', alignItems:'center', gap:4 }}><IconTrash /> Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Nueva variable de conflictividad" onClose={() => setModal(false)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Field label="Categoría" required>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.categoria} onChange={e => setForm(f => ({...f, categoria:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {CATS_CONFLICTO.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Ficha territorial">
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.ficha_id} onChange={e => setForm(f => ({...f, ficha_id:e.target.value}))}>
                <option value="">— Sin ficha —</option>
                {fichas.map(f => <option key={f.id} value={f.id}>{f.municipio}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Variable" required><input className="form-input" style={INPUT} value={form.variable} onChange={e => setForm(f => ({...f, variable:e.target.value}))} placeholder="Ej: Conflicto por uso del suelo" /></Field></div>
            <Field label="Nivel">
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.nivel} onChange={e => setForm(f => ({...f, nivel:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {Object.entries(NIVELES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Descripción"><textarea className="form-input" style={{ ...INPUT, resize:'vertical', minHeight:72 }} value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion:e.target.value}))} placeholder="Describe causas y efectos…" /></Field></div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Registrar variable</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'resumen',        label:'Resumen',              icon:<IconGrid /> },
  { id:'fichas',         label:'Fichas Territoriales', icon:<IconMap /> },
  { id:'actores',        label:'Mapa de Actores',      icon:<IconUsers /> },
  { id:'conflictividad', label:'Conflictividad',       icon:<IconAlert /> },
];

export default function LineaDiagnosticaPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('resumen');

  // Estado local — los datos demo se modifican en memoria (sin persistencia)
  const [fichas,     setFichas]     = useState(DEMO_FICHAS);
  const [actores,    setActores]    = useState(DEMO_ACTORES);
  const [conflictos, setConflictos] = useState(DEMO_CONFLICTOS);

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}>
          <IconBack /> Módulos
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, flexShrink:0 }}>A</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#1 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Línea Diagnóstica Territorial</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>
          DEMO
        </span>
      </div>

      {/* Banner informativo del módulo */}
      <ModuloInfoBanner meta={META} color={COLOR} />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e2e8f0', marginBottom:20, overflowX:'auto' }} role="tablist">
        {TABS.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:13, fontWeight: tab===t.id ? 700 : 500, color: tab===t.id ? COLOR : '#64748b', borderBottom: tab===t.id ? `2px solid ${COLOR}` : '2px solid transparent', marginBottom:-2, whiteSpace:'nowrap', transition:'color .15s' }}>
            <span style={{ opacity: tab===t.id ? 1 : 0.6 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'resumen'        && <TabResumen       fichas={fichas} actores={actores} conflictos={conflictos} />}
      {tab === 'fichas'         && <TabFichas        fichas={fichas} setFichas={setFichas} />}
      {tab === 'actores'        && <TabActores       actores={actores} setActores={setActores} fichas={fichas} />}
      {tab === 'conflictividad' && <TabConflictividad conflictos={conflictos} setConflictos={setConflictos} fichas={fichas} />}
    </div>
  );
}
