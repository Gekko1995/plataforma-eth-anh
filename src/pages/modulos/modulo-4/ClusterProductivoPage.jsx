import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#1B6B4A';
const META  = modulos.find(m => m.id === 4);

// ── Datos demo ─────────────────────────────────────────────────────────
const DEMO_CLUSTERS = [
  {
    id:'cl1', nombre:'Cacao de la Orinoquía', municipios:['Arauca','Saravena','Arauquita'],
    productos:'Cacao en grano, pasta de cacao, pulpa',
    tlc:['UE','USA','Suiza'], vocacion:'Exportación directa, agroindustria',
    costos_op:280, precio_usd:3.20, demanda:'Alta', puntaje_exp:82,
    dofa:{ F:['Alta calidad organoléptica','Productores organizados en asociación','Tradición cacaotera de 20+ años'], O:['Creciente demanda mundial de chocolate fino','TLC con UE y USA activos','Programas USAID de apoyo'], D:['Baja capacidad de post-cosecha','Falta certificación orgánica','Transporte precario en zona rural'], A:['Variabilidad climática','Competencia de Costa Rica y Ecuador','Inestabilidad de precios internacionales'] },
    completitud:92
  },
  {
    id:'cl2', nombre:'Café Especial del Piedemonte', municipios:['Mocoa','Puerto Asís','San Francisco'],
    productos:'Café verde, café tostado especial, microlotes',
    tlc:['UE','Japón','Corea'], vocacion:'Exportación de microlotes, café de especialidad',
    costos_op:320, precio_usd:4.10, demanda:'Muy alta', puntaje_exp:76,
    dofa:{ F:['Altitud ideal 1.400-1.800 msnm','Diversidad de perfiles de taza','Diferenciación por origen'], O:['Mercado specialty en crecimiento 12% anual','Interés de compradores directos japoneses','Ecoturismo cafetero emergente'], D:['Volúmenes pequeños por finca','Falta de laboratorio de catación local','Capacidad de trilla limitada'], A:['Deforestación para cultivos ilícitos','Presencia histórica de grupos armados','Fenómeno El Niño'] },
    completitud:78
  },
  {
    id:'cl3', nombre:'Aguacate Hass Meta', municipios:['Villavicencio','San Martín','Granada','Acacías'],
    productos:'Aguacate Hass fresco, guacamole, aceite',
    tlc:['USA','UE','China'], vocacion:'Exportación fresca, procesado',
    costos_op:210, precio_usd:1.80, demanda:'Muy alta', puntaje_exp:90,
    dofa:{ F:['Clima ideal de sabana para Hass','Productores con experiencia exportadora','Cercanía a Bogotá (logística)'], O:['Demanda USA+20% anual','Protocolo fitosanitario con USDA activo','Subsidios MADR para reconversión'], D:['Alta dependencia de precio spot','Plagas sin manejo integrado','Falta de cuartos fríos'], A:['Enfermedades fúngicas emergentes','Competencia de México y Perú','Dólar volátil'] },
    completitud:95
  },
  {
    id:'cl4', nombre:'Palma Oleaginosa Casanare', municipios:['Aguazul','Yopal','Villanueva','San Luis de Palenque'],
    productos:'Aceite crudo de palma, oleína, estearina',
    tlc:['India','Colombia interno','Malasia'], vocacion:'Sustitución importaciones, exportación residual',
    costos_op:180, precio_usd:0.95, demanda:'Media', puntaje_exp:65,
    dofa:{ F:['Grandes extensiones aptas','Extractoras establecidas','Agremiación FEDEPALMA'], O:['Biocombustibles como mercado alternativo','Palma de aceite sostenible (RSPO)'], D:['Dependencia de precios CPO internacional','Conflictos de tierras sin resolver','Alto uso de agua'], A:['Sobrecostos de insumos post-COVID','Presión ambiental de ONGs','Competencia asiática'] },
    completitud:71
  },
  {
    id:'cl5', nombre:'Pesca Artesanal Amazónica', municipios:['Puerto Asís','Puerto Leguízamo','La Tagua'],
    productos:'Peces ornamentales, peces ahumados, ictiofauna nativa',
    tlc:['Brasil','UE (ornamentales)'], vocacion:'Exportación ornamental, mercado interno regional',
    costos_op:95, precio_usd:2.40, demanda:'Media', puntaje_exp:58,
    dofa:{ F:['Biodiversidad ictiológica única','Conocimiento ancestral de comunidades','Bajo costo de extracción'], O:['Creciente mercado acuarismo mundial','Ecoturismo amazónico'], D:['Sin cadena fría en región','Ausencia total de marca','Regulación CITES compleja'], A:['Deforestación y contaminación hídrica','Competencia pesca ilegal','Mercurio en ecosistemas'] },
    completitud:52
  },
  {
    id:'cl6', nombre:'Ganadería Sostenible Llanos', municipios:['Paz de Ariporo','Hato Corozal','Trinidad','Maní'],
    productos:'Carne vacuna, leche, queso llanero',
    tlc:['China','Históricamente USA'], vocacion:'Exportación de carne, quesería artesanal',
    costos_op:260, precio_usd:3.80, demanda:'Alta', puntaje_exp:71,
    dofa:{ F:['Razas adaptadas al trópico','Sabanas naturales extensas','Tradición llanera fuerte'], O:['Demanda China en crecimiento','Ganadería carbono-neutro emergente','Silvopastoreo con incentivos MADR'], D:['Baja productividad por hectárea','Sin trazabilidad completa','Informalidad en eslabón frigorífico'], A:['Inundaciones ciclo ENSO','Fiebre aftosa (riesgo país)','Devaluación peso colombiano'] },
    completitud:68
  },
];

// ── Icons ─────────────────────────────────────────────────────────────
const IconBack  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconList  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconDofa  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>;
const IconStar  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconPlus  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconX     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const TH  = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD  = { padding:'9px 12px', fontSize:13, color:'#475569' };

function puntajeColor(p) {
  if (p >= 80) return { color:'#16a34a', bg:'#dcfce7' };
  if (p >= 65) return { color:'#ca8a04', bg:'#fef9c3' };
  return { color:'#dc2626', bg:'#fee2e2' };
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
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

// ── TAB 1: Listado ────────────────────────────────────────────────────
function TabListado({ clusters, onVerDofa }) {
  const [orden, setOrden] = useState('puntaje');
  const ordenados = [...clusters].sort((a,b) => orden==='puntaje' ? b.puntaje_exp-a.puntaje_exp : a.nombre.localeCompare(b.nombre));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <p style={{ fontSize:13, color:'var(--content-text-muted)', margin:0 }}>{clusters.length} clústeres identificados</p>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#64748b' }}>Ordenar por:</span>
          <button className={orden==='puntaje'?'btn btn-primary btn-sm':'btn btn-ghost btn-sm'} onClick={()=>setOrden('puntaje')} style={orden==='puntaje'?{background:COLOR,borderColor:COLOR}:{}}>Puntaje exportador</button>
          <button className={orden==='nombre'?'btn btn-primary btn-sm':'btn btn-ghost btn-sm'} onClick={()=>setOrden('nombre')} style={orden==='nombre'?{background:COLOR,borderColor:COLOR}:{}}>Nombre</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
        {ordenados.map(cl => {
          const { color, bg } = puntajeColor(cl.puntaje_exp);
          return (
            <div key={cl.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:'#1e293b' }}>{cl.nombre}</h3>
                  <p style={{ margin:'4px 0 0', fontSize:12, color:'#64748b' }}>{cl.municipios.join(' · ')}</p>
                </div>
                <span style={{ fontSize:20, fontWeight:800, color, background:bg, padding:'4px 12px', borderRadius:8, flexShrink:0 }}>{cl.puntaje_exp}</span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:12 }}>
                <div style={{ display:'flex', gap:6 }}><span style={{ color:'#94a3b8', minWidth:80 }}>Productos</span><span style={{ color:'#475569' }}>{cl.productos}</span></div>
                <div style={{ display:'flex', gap:6 }}><span style={{ color:'#94a3b8', minWidth:80 }}>TLC activos</span><span style={{ color:'#475569' }}>{cl.tlc.join(', ')}</span></div>
                <div style={{ display:'flex', gap:6 }}><span style={{ color:'#94a3b8', minWidth:80 }}>Precio USD</span><span style={{ color:COLOR, fontWeight:700 }}>${cl.precio_usd}/kg</span></div>
                <div style={{ display:'flex', gap:6 }}><span style={{ color:'#94a3b8', minWidth:80 }}>Demanda</span><span style={{ color:'#1e293b', fontWeight:500 }}>{cl.demanda}</span></div>
              </div>

              {/* Completitud */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:4 }}>
                  <span style={{ color:'#64748b' }}>Completitud de ficha</span>
                  <span style={{ fontWeight:700, color: cl.completitud>=80?'#16a34a':cl.completitud>=60?'#ca8a04':'#dc2626' }}>{cl.completitud}%</span>
                </div>
                <div style={{ height:5, background:'#f1f5f9', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:`${cl.completitud}%`, height:'100%', background:cl.completitud>=80?'#16a34a':cl.completitud>=60?'#ca8a04':'#dc2626', borderRadius:3 }} />
                </div>
              </div>

              <button onClick={()=>onVerDofa(cl)} className="btn btn-ghost btn-sm" style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:6, color:COLOR }}>
                <IconDofa /> Ver Matriz DOFA
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TAB 2: Ranking ────────────────────────────────────────────────────
function TabRanking({ clusters }) {
  const ranked = [...clusters].sort((a,b)=>b.puntaje_exp-a.puntaje_exp);
  const max = ranked[0]?.puntaje_exp || 100;

  return (
    <div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Ranking calculado por: <strong>Potencial exportador = Demanda internacional × TLC vigentes × Precio USD × Costos operativos inversos</strong></p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {ranked.map((cl,i) => {
          const { color, bg } = puntajeColor(cl.puntaje_exp);
          const pct = (cl.puntaje_exp / max) * 100;
          return (
            <div key={cl.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:22, fontWeight:800, color:i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#b45309':'#cbd5e1', minWidth:32, textAlign:'center' }}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
              </span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:4 }}>{cl.nombre}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4, transition:'width .6s ease' }} />
                  </div>
                  <span style={{ fontSize:20, fontWeight:800, color, background:bg, padding:'2px 10px', borderRadius:6, minWidth:48, textAlign:'center' }}>{cl.puntaje_exp}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {cl.tlc.map(t=><span key={t} style={{ fontSize:11, fontWeight:600, background:COLOR+'12', color:COLOR, padding:'2px 7px', borderRadius:999 }}>{t}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TAB 3: Matriz DOFA ────────────────────────────────────────────────
function TabDofa({ clusters, initialCluster }) {
  const [selected, setSelected] = useState(initialCluster || clusters[0]?.id || '');
  const cl = clusters.find(c=>c.id===selected);

  const secciones = [
    { key:'F', label:'Fortalezas',     color:'#16a34a', bg:'#f0fdf4', borde:'#bbf7d0' },
    { key:'O', label:'Oportunidades',  color:'#0369A1', bg:'#eff6ff', borde:'#bfdbfe' },
    { key:'D', label:'Debilidades',    color:'#dc2626', bg:'#fff5f5', borde:'#fecaca' },
    { key:'A', label:'Amenazas',       color:'#c2410c', bg:'#fff7ed', borde:'#fed7aa' },
  ];

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <label style={{ fontSize:13, fontWeight:600, color:'#475569' }}>Seleccionar clúster:</label>
        <select className="form-select" style={{ maxWidth:280 }} value={selected} onChange={e=>setSelected(e.target.value)}>
          {clusters.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      {cl && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1e293b' }}>{cl.nombre}</h3>
            <span style={{ fontSize:12, color:'#64748b' }}>— Puntaje exportador: <strong style={{ color:puntajeColor(cl.puntaje_exp).color }}>{cl.puntaje_exp}/100</strong></span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {secciones.map(sec => (
              <div key={sec.key} style={{ background:sec.bg, border:`1px solid ${sec.borde}`, borderRadius:12, padding:16 }}>
                <p style={{ fontSize:12, fontWeight:700, color:sec.color, textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 10px', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:20, height:20, borderRadius:5, background:sec.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800 }}>{sec.key}</span>
                  {sec.label}
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
                  {(cl.dofa[sec.key]||[]).map((item,i)=>(
                    <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:6, fontSize:13, color:'#1e293b' }}>
                      <span style={{ color:sec.color, flexShrink:0, marginTop:2 }}>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── TAB 4: Comparativo ───────────────────────────────────────────────
function TabComparativo({ clusters }) {
  const campos = [
    { key:'puntaje_exp', label:'Puntaje exportador' },
    { key:'precio_usd',  label:'Precio USD/kg' },
    { key:'costos_op',   label:'Costos op. (COP K/ton)' },
    { key:'demanda',     label:'Demanda' },
    { key:'completitud', label:'Completitud ficha (%)' },
  ];

  return (
    <div className="table-wrapper">
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={TH}>Campo</th>
            {clusters.map(cl=><th key={cl.id} style={{ ...TH, maxWidth:140 }}>{cl.nombre}</th>)}
          </tr>
        </thead>
        <tbody>
          {campos.map((c,i)=>(
            <tr key={c.key} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
              <td style={{ ...TD, fontWeight:600, color:'#475569' }}>{c.label}</td>
              {clusters.map(cl=>{
                const val = cl[c.key];
                const isNum = typeof val === 'number';
                const highlight = c.key==='puntaje_exp' ? puntajeColor(val).color : c.key==='completitud' ? (val>=80?'#16a34a':val>=60?'#ca8a04':'#dc2626') : '#1e293b';
                return (
                  <td key={cl.id} style={{ ...TD, fontWeight: isNum ? 700 : 400, color: isNum ? highlight : '#475569' }}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'listado',     label:'Clústeres',         icon:<IconList /> },
  { id:'ranking',     label:'Ranking exportador', icon:<IconStar /> },
  { id:'dofa',        label:'Matriz DOFA',        icon:<IconDofa /> },
  { id:'comparativo', label:'Comparativo',        icon:<IconList /> },
];

export default function ClusterProductivoPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listado');
  const [clusters] = useState(DEMO_CLUSTERS);
  const [dofaCluster, setDofaCluster] = useState(null);

  function verDofa(cl) { setDofaCluster(cl.id); setTab('dofa'); }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}><IconBack /> Módulos</button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>A</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#4 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Análisis de Clúster Productivo</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>DEMO</span>
      </div>

      {META && (
        <div style={{ background:COLOR+'0d', border:`1px solid ${COLOR}30`, borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ margin:0, fontSize:14, color:'var(--content-text)', lineHeight:1.65 }}>{META.descripcion}</p>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            <div style={{ flex:'1 1 200px' }}>
              <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:COLOR, textTransform:'uppercase', letterSpacing:'.06em' }}>Puntos clave</p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
                {META.puntosClave.map((p,i)=>(
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--content-text)' }}>
                    <span style={{ width:18, height:18, borderRadius:'50%', background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, flexShrink:0, marginTop:1 }}>✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex:'1 1 200px' }}>
              <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:COLOR, textTransform:'uppercase', letterSpacing:'.06em' }}>Componentes tecnológicos</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {META.stack.map((t,i)=><span key={i} style={{ display:'inline-flex', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600, background:COLOR+'12', color:COLOR, border:`1px solid ${COLOR}30` }}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e2e8f0', marginBottom:20, overflowX:'auto' }} role="tablist">
        {TABS.map(t=>(
          <button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:13, fontWeight:tab===t.id?700:500, color:tab===t.id?COLOR:'#64748b', borderBottom:tab===t.id?`2px solid ${COLOR}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' }}>
            <span style={{ opacity:tab===t.id?1:0.6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab==='listado'     && <TabListado    clusters={clusters} onVerDofa={verDofa} />}
      {tab==='ranking'     && <TabRanking    clusters={clusters} />}
      {tab==='dofa'        && <TabDofa       clusters={clusters} initialCluster={dofaCluster} />}
      {tab==='comparativo' && <TabComparativo clusters={clusters} />}
    </div>
  );
}
