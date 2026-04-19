import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#1B6B4A';
const META  = modulos.find(m => m.id === 5);

// ── Datos demo ─────────────────────────────────────────────────────────
const CLUSTERS_REF = ['Cacao Orinoquía','Café Piedemonte','Aguacate Hass Meta','Palma Casanare','Pesca Amazónica','Ganadería Llanos'];

const DEMO_ENCUESTAS = [
  { id:'e1', nombre:'Carlos Gómez Ruiz',       municipio:'Aguazul',     cluster:'Cacao Orinoquía',    producto:'Cacao',      estado:'Completa',     pct:100, fecha:'2024-03-12' },
  { id:'e2', nombre:'María Torres Cárdenas',   municipio:'Saravena',    cluster:'Cacao Orinoquía',    producto:'Cacao',      estado:'Completa',     pct:100, fecha:'2024-03-14' },
  { id:'e3', nombre:'Juan Pérez López',        municipio:'Tauramena',   cluster:'Ganadería Llanos',   producto:'Ganadería',  estado:'En progreso',  pct:65,  fecha:'2024-03-18' },
  { id:'e4', nombre:'Ana Rodríguez Vargas',    municipio:'Puerto Asís', cluster:'Café Piedemonte',    producto:'Café',       estado:'Completa',     pct:100, fecha:'2024-03-20' },
  { id:'e5', nombre:'Pedro Martínez Rueda',    municipio:'Mocoa',       cluster:'Café Piedemonte',    producto:'Café',       estado:'En progreso',  pct:45,  fecha:'2024-03-22' },
  { id:'e6', nombre:'Luisa Fernández Castro',  municipio:'Florencia',   cluster:'Ganadería Llanos',   producto:'Ganadería',  estado:'No iniciada',  pct:0,   fecha:'2024-03-25' },
  { id:'e7', nombre:'Roberto Salcedo Moreno',  municipio:'San Martín',  cluster:'Aguacate Hass Meta', producto:'Aguacate',   estado:'Completa',     pct:100, fecha:'2024-03-26' },
  { id:'e8', nombre:'Carmen Jiménez Prada',    municipio:'Villavicencio',cluster:'Aguacate Hass Meta', producto:'Aguacate', estado:'En progreso',  pct:10,  fecha:'2024-03-27' },
];

const DEMO_FICHAS_PROD = [
  { id:'fp1', producto:'Cacao en grano',   codigo_ica:'ICA-CAC-001', cert:'RUP vigente',     exigencia:'Cert. fitosanitario ICA + EUDR',      estado:'valido',    cluster:'Cacao Orinoquía' },
  { id:'fp2', producto:'Aguacate Hass',    codigo_ica:'ICA-AVO-045', cert:'RUP vigente',     exigencia:'Protocolo USDA/SENASA + GlobalGAP',   estado:'valido',    cluster:'Aguacate Hass Meta' },
  { id:'fp3', producto:'Café verde',       codigo_ica:'ICA-CAF-012', cert:'RUP vigente',     exigencia:'SCA, RFA, UTZ, organico (opt)',        estado:'valido',    cluster:'Café Piedemonte' },
  { id:'fp4', producto:'Plátano hartón',   codigo_ica:'ICA-PLA-023', cert:'Sin cert.',        exigencia:'Cert. fitosanitario ICA',             estado:'alerta',    cluster:'Ganadería Llanos' },
  { id:'fp5', producto:'Maíz amarillo',    codigo_ica:'ICA-MAI-034', cert:'RUP expirado',    exigencia:'Registro productor actualizado',       estado:'vencido',   cluster:'Cacao Orinoquía' },
  { id:'fp6', producto:'Palma aceite',     codigo_ica:'ICA-PAL-067', cert:'RUP vigente',     exigencia:'RSPO (opcional) + BPM',               estado:'valido',    cluster:'Palma Casanare' },
  { id:'fp7', producto:'Tilapia',          codigo_ica:'ICA-ACU-089', cert:'Sin cert.',        exigencia:'Registro acuícola ICA',               estado:'alerta',    cluster:'Pesca Amazónica' },
  { id:'fp8', producto:'Carne vacuna',     codigo_ica:'ICA-BOV-102', cert:'RUP vigente',     exigencia:'Trazabilidad SINIGAN + Cert. fito.',   estado:'valido',    cluster:'Ganadería Llanos' },
  { id:'fp9', producto:'Leche cruda',      codigo_ica:'ICA-LAC-118', cert:'RUP vigente',     exigencia:'Decreto 616/2006 + BPO',              estado:'valido',    cluster:'Ganadería Llanos' },
  { id:'fp10',producto:'Peces ornamentales',codigo_ica:'ICA-PEC-134',cert:'Sin cert.',        exigencia:'CITES + Res. MADS 0074/2021',          estado:'alerta',    cluster:'Pesca Amazónica' },
];

// ── Icons ─────────────────────────────────────────────────────────────
const IconBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconForm   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconCheck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IconChart  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconWarn   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;
const IconPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };
const INPUT = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:14, fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

function EstadoBadge({ estado, pct }) {
  if (estado === 'Completa')     return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:12, fontWeight:600, background:'#dcfce7', color:'#15803d' }}><span style={{ width:7,height:7,borderRadius:'50%',background:'#15803d',flexShrink:0 }}/> Completa</span>;
  if (estado === 'En progreso')  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:12, fontWeight:600, background:'#fef9c3', color:'#854d0e' }}><span style={{ width:7,height:7,borderRadius:1,background:'#854d0e',flexShrink:0 }}/> En progreso ({pct}%)</span>;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:12, fontWeight:600, background:'#f1f5f9', color:'#64748b' }}><span style={{ width:0,height:0,borderLeft:'4px solid transparent',borderRight:'4px solid transparent',borderBottom:'7px solid #64748b',flexShrink:0 }}/> No iniciada</span>;
}

function FitoBadge({ estado }) {
  if (estado === 'valido')  return <span style={{ background:'#dcfce7', color:'#15803d', fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:999 }}>✓ Válido</span>;
  if (estado === 'alerta')  return <span style={{ background:'#fef9c3', color:'#854d0e', fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:999, display:'inline-flex', alignItems:'center', gap:4 }}><IconWarn /> Sin cert.</span>;
  return <span style={{ background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:999 }}>✗ Expirado</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
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

// ── TAB 1: Encuestas ──────────────────────────────────────────────────
function TabEncuestas({ encuestas, setEncuestas }) {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroCluster, setFiltroCluster] = useState('');
  const [filtroEstado, setFiltroEstado]   = useState('');

  const EMPTY = { nombre:'', municipio:'', cluster:'', producto:'', estado:'No iniciada', pct:'0', fecha: new Date().toISOString().slice(0,10) };
  const [form, setForm] = useState(EMPTY);

  function showToast(msg,ok=true){setToast({msg,ok});setTimeout(()=>setToast({msg:'',ok:true}),3500);}

  function handleSave() {
    if (!form.nombre.trim() || !form.municipio.trim()) { showToast('Nombre y municipio son obligatorios.',false); return; }
    setEncuestas(prev=>[{ id:'e'+Date.now(), ...form, pct:parseInt(form.pct)||0 },...prev]);
    showToast('Encuesta registrada (demo).');
    setModal(false); setForm(EMPTY);
  }

  function handleDelete(e) {
    if (!window.confirm(`¿Eliminar la encuesta de ${e.nombre}?`)) return;
    setEncuestas(prev=>prev.filter(x=>x.id!==e.id));
    showToast('Encuesta eliminada (demo).');
  }

  const filtradas = encuestas
    .filter(e=>!filtroCluster||e.cluster===filtroCluster)
    .filter(e=>!filtroEstado||e.estado===filtroEstado);

  const resumen = { Completa:encuestas.filter(e=>e.estado==='Completa').length, 'En progreso':encuestas.filter(e=>e.estado==='En progreso').length, 'No iniciada':encuestas.filter(e=>e.estado==='No iniciada').length };

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />

      {/* KPIs */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        {[['Completas',resumen['Completa'],'#dcfce7','#15803d'],['En progreso',resumen['En progreso'],'#fef9c3','#854d0e'],['No iniciadas',resumen['No iniciada'],'#f1f5f9','#64748b']].map(([l,v,bg,c])=>(
          <div key={l} style={{ background:bg, borderRadius:10, padding:'10px 16px', border:`1px solid ${c}22` }}>
            <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:12, color:c }}>{l}</div>
          </div>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <select className="form-select" style={{ maxWidth:200 }} value={filtroCluster} onChange={e=>setFiltroCluster(e.target.value)}>
            <option value="">Todos los clústeres</option>
            {CLUSTERS_REF.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth:160 }} value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {['Completa','En progreso','No iniciada'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={()=>{setForm(EMPTY);setModal(true);}} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
            <IconPlus /> Registrar encuesta
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Productor','Municipio','Clúster','Producto','Estado','Fecha',''].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtradas.map((e,i)=>(
              <tr key={e.id} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
                <td style={{ ...TD, fontWeight:600, color:'#1e293b' }}>{e.nombre}</td>
                <td style={TD}>{e.municipio}</td>
                <td style={TD}><span style={{ fontSize:12, fontWeight:500, background:COLOR+'12', color:COLOR, padding:'1px 7px', borderRadius:999 }}>{e.cluster}</span></td>
                <td style={TD}>{e.producto}</td>
                <td style={TD}><EstadoBadge estado={e.estado} pct={e.pct} /></td>
                <td style={TD}>{e.fecha}</td>
                <td style={TD}><button onClick={()=>handleDelete(e)} className="btn btn-danger btn-sm">Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar encuesta de productor" onClose={()=>setModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['nombre','Nombre del productor *','text','Carlos Gómez'],['municipio','Municipio *','text','Aguazul'],['producto','Producto principal','text','Cacao']].map(([k,l,t,ph])=>(
              <div key={k}>
                <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>{l}</label>
                <input type={t} className="form-input" style={INPUT} value={form[k]} onChange={ev=>setForm(f=>({...f,[k]:ev.target.value}))} placeholder={ph} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Clúster</label>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.cluster} onChange={e=>setForm(f=>({...f,cluster:e.target.value}))}>
                <option value="">— Sin clúster —</option>
                {CLUSTERS_REF.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Estado</label>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.estado} onChange={e=>setForm(f=>({...f,estado:e.target.value}))}>
                {['No iniciada','En progreso','Completa'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Registrar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── TAB 2: Fichas técnicas ────────────────────────────────────────────
function TabFichas({ fichas }) {
  const alertas = fichas.filter(f=>f.estado!=='valido');
  return (
    <div>
      {alertas.length > 0 && (
        <div style={{ padding:'12px 16px', borderRadius:8, background:'#fef9c3', color:'#854d0e', border:'1px solid #fde68a', marginBottom:16, fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
          <IconWarn /> <strong>{alertas.length} producto{alertas.length>1?'s':''}</strong> sin certificación válida no podrán avanzar al pipeline de exportación.
        </div>
      )}
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Producto','Código ICA','Certificación actual','Exigencia exportación','Estado fito.','Clúster'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {fichas.map((f,i)=>(
              <tr key={f.id} style={{ background: f.estado!=='valido'?'#fffbeb':i%2===0?'#fff':'#f8fafc' }}>
                <td style={{ ...TD, fontWeight:600, color:'#1e293b' }}>{f.producto}</td>
                <td style={{ ...TD, fontFamily:'monospace', fontSize:12 }}>{f.codigo_ica}</td>
                <td style={TD}>{f.cert}</td>
                <td style={{ ...TD, fontSize:12, maxWidth:220 }}>{f.exigencia}</td>
                <td style={TD}><FitoBadge estado={f.estado} /></td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:500, background:COLOR+'12', color:COLOR, padding:'1px 7px', borderRadius:999 }}>{f.cluster}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TAB 3: Validador fitosanitario ───────────────────────────────────
function TabValidador() {
  const [buscar, setBuscar] = useState('');
  const [resultado, setResultado] = useState(null);

  const CATALOGO = DEMO_FICHAS_PROD.map(f=>({ ...f, label: f.producto }));

  function buscarProducto(q) {
    setBuscar(q);
    const found = CATALOGO.find(p=>p.producto.toLowerCase().includes(q.toLowerCase()));
    setResultado(found || null);
  }

  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:20, marginBottom:20 }}>
        <p style={{ fontSize:14, fontWeight:600, color:'#1e293b', margin:'0 0 12px' }}>Validador automático ICA/INVIMA</p>
        <p style={{ fontSize:13, color:'#64748b', margin:'0 0 16px', lineHeight:1.6 }}>Ingresa el nombre del producto para verificar su estado fitosanitario y los requisitos para exportación.</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <input className="form-input" style={{ flex:1, minWidth:200 }} placeholder="Ej: Cacao, Aguacate, Café…" value={buscar} onChange={e=>buscarProducto(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={()=>{setBuscar('');setResultado(null);}}>Limpiar</button>
        </div>
      </div>

      {resultado ? (
        <div style={{ background:'#fff', border:`2px solid ${resultado.estado==='valido'?'#16a34a':resultado.estado==='alerta'?'#ca8a04':'#dc2626'}`, borderRadius:12, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1e293b' }}>{resultado.producto}</h3>
              <p style={{ margin:'4px 0 0', fontSize:12, color:'#64748b' }}>{resultado.codigo_ica}</p>
            </div>
            <FitoBadge estado={resultado.estado} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['Certificación actual',resultado.cert],['Exigencia para exportación',resultado.exigencia],['Clúster relacionado',resultado.cluster]].map(([k,v])=>(
              <div key={k} style={{ display:'flex', gap:12, borderBottom:'1px solid #f1f5f9', paddingBottom:10 }}>
                <span style={{ fontSize:13, color:'#94a3b8', minWidth:180 }}>{k}</span>
                <span style={{ fontSize:13, color:'#1e293b', fontWeight:500 }}>{v}</span>
              </div>
            ))}
          </div>
          {resultado.estado !== 'valido' && (
            <div style={{ marginTop:14, padding:'12px 14px', borderRadius:8, background:'#fff7ed', color:'#c2410c', fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
              <IconWarn /> Este producto requiere regularización antes de habilitar el pipeline de exportación.
            </div>
          )}
        </div>
      ) : buscar.length > 1 ? (
        <div style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>
          <p style={{ fontSize:14 }}>No se encontró <strong>"{buscar}"</strong> en el catálogo ICA.</p>
          <p style={{ fontSize:12 }}>Verifica el nombre o contacta al técnico de campo para registrar el producto.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
          {CATALOGO.map(p=>(
            <button key={p.id} onClick={()=>buscarProducto(p.producto)} style={{ background:'#f8fafc', border:`1px solid ${p.estado==='valido'?'#bbf7d0':p.estado==='alerta'?'#fde68a':'#fca5a5'}`, borderRadius:10, padding:'12px 14px', cursor:'pointer', textAlign:'left' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#1e293b', marginBottom:4 }}>{p.producto}</div>
              <FitoBadge estado={p.estado} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TAB 4: Completitud ───────────────────────────────────────────────
function TabCompletitud({ encuestas }) {
  const porCluster = CLUSTERS_REF.map(cl => {
    const sub = encuestas.filter(e=>e.cluster===cl);
    const completas = sub.filter(e=>e.estado==='Completa').length;
    const total = sub.length;
    const pct = total ? Math.round((completas/total)*100) : 0;
    return { cl, total, completas, pct };
  });

  return (
    <div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Panel de completitud de encuestas por clúster. Un clúster puede avanzar al pipeline de exportación cuando su completitud supere el <strong>80%</strong>.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {porCluster.map(({ cl, total, completas, pct })=>{
          const habilitado = pct >= 80;
          return (
            <div key={cl} style={{ background:'#fff', border:`1px solid ${habilitado?COLOR+'44':'#e2e8f0'}`, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{cl}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:12, color:'#64748b' }}>{completas}/{total} completas</span>
                    <span style={{ fontSize:16, fontWeight:800, color: pct>=80?COLOR:pct>=50?'#ca8a04':'#dc2626' }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background: pct>=80?COLOR:pct>=50?'#ca8a04':'#dc2626', borderRadius:4, transition:'width .6s ease' }} />
                </div>
              </div>
              <div style={{ flexShrink:0 }}>
                {habilitado
                  ? <span style={{ fontSize:12, fontWeight:600, background:'#dcfce7', color:'#15803d', padding:'4px 12px', borderRadius:999 }}>✓ Habilitado</span>
                  : <span style={{ fontSize:12, fontWeight:600, background:'#f1f5f9', color:'#94a3b8', padding:'4px 12px', borderRadius:999 }}>Pendiente</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'encuestas',  label:'Encuestas de productor',    icon:<IconForm /> },
  { id:'fichas',     label:'Fichas técnicas',           icon:<IconCheck /> },
  { id:'validador',  label:'Validador fitosanitario',   icon:<IconCheck /> },
  { id:'completitud',label:'Completitud por clúster',  icon:<IconChart /> },
];

export default function RecaboCampoPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('encuestas');
  const [encuestas, setEncuestas] = useState(DEMO_ENCUESTAS);
  const [fichas]                  = useState(DEMO_FICHAS_PROD);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}><IconBack /> Módulos</button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>A</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#5 · Grupo A — Diagnóstico y Territorio</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Recolección de Información en Campo</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>DEMO</span>
      </div>

      <ModuloInfoBanner meta={META} color={COLOR} />

      <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e2e8f0', marginBottom:20, overflowX:'auto' }} role="tablist">
        {TABS.map(t=>(
          <button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:13, fontWeight:tab===t.id?700:500, color:tab===t.id?COLOR:'#64748b', borderBottom:tab===t.id?`2px solid ${COLOR}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' }}>
            <span style={{ opacity:tab===t.id?1:0.6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab==='encuestas'   && <TabEncuestas   encuestas={encuestas} setEncuestas={setEncuestas} />}
      {tab==='fichas'      && <TabFichas      fichas={fichas} />}
      {tab==='validador'   && <TabValidador />}
      {tab==='completitud' && <TabCompletitud encuestas={encuestas} />}
    </div>
  );
}
