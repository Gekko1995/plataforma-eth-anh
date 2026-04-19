import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#B45309';
const META  = modulos.find(m => m.id === 6);

const CARS = [
  { id:'c1', nombre:'Corporinoquia',  region:'Orinoquía',         depts:['Casanare','Meta','Arauca','Vichada'],       responsable:'Ing. Laura Castillo',   ejecucion:82, ultima_act:'2024-11-28', estado:'verde' },
  { id:'c2', nombre:'Cormacarena',   region:'Macarena',          depts:['Meta'],                                    responsable:'Ing. Pedro Salinas',    ejecucion:65, ultima_act:'2024-11-10', estado:'amarillo' },
  { id:'c3', nombre:'Corpoamazonia', region:'Amazonia',          depts:['Putumayo','Caquetá','Amazonas'],            responsable:'Ing. Clara Moreno',     ejecucion:91, ultima_act:'2024-12-01', estado:'verde' },
  { id:'c4', nombre:'CDA',           region:'Amazonia Oriental', depts:['Guainía','Vaupés','Guaviare'],              responsable:'Ing. Roberto Pinto',    ejecucion:48, ultima_act:'2024-10-15', estado:'rojo' },
  { id:'c5', nombre:'Corpoboyacá',   region:'Boyacá',            depts:['Boyacá'],                                  responsable:'Ing. Sandra Vargas',    ejecucion:74, ultima_act:'2024-11-20', estado:'verde' },
  { id:'c6', nombre:'CDMB',          region:'Santander',         depts:['Santander (área Mérida)'],                 responsable:'Ing. Luis Herrera',     ejecucion:58, ultima_act:'2024-10-30', estado:'amarillo' },
  { id:'c7', nombre:'Corantioquia',  region:'Antioquia',         depts:['Antioquia'],                               responsable:'Ing. Patricia Ríos',    ejecucion:38, ultima_act:'2024-09-12', estado:'rojo' },
  { id:'c8', nombre:'CVS',           region:'Córdoba',           depts:['Córdoba'],                                 responsable:'Ing. Carlos Mendoza',   ejecucion:70, ultima_act:'2024-11-18', estado:'verde' },
];

const DOCS = [
  { id:'d01', car:'c1', tipo:'Plan de trabajo', nombre:'CORPORINOQUIA_Orinoquia_PlanTrabajo_20240301.pdf', fecha:'2024-03-01', tamano:'2.4 MB', vigente:true },
  { id:'d02', car:'c1', tipo:'Estudio E&P',     nombre:'CORPORINOQUIA_Orinoquia_EstudioEP_20240415.pdf',  fecha:'2024-04-15', tamano:'8.1 MB', vigente:true },
  { id:'d03', car:'c1', tipo:'Acta reunión',    nombre:'CORPORINOQUIA_Orinoquia_Acta_20240610.pdf',       fecha:'2024-06-10', tamano:'0.8 MB', vigente:true },
  { id:'d04', car:'c2', tipo:'Plan de trabajo', nombre:'CORMACARENA_Macarena_PlanTrabajo_20240215.pdf',   fecha:'2024-02-15', tamano:'1.9 MB', vigente:true },
  { id:'d05', car:'c2', tipo:'Informe avance',  nombre:'CORMACARENA_Macarena_Informe_20240520.pdf',       fecha:'2024-05-20', tamano:'3.2 MB', vigente:false },
  { id:'d06', car:'c3', tipo:'Plan de trabajo', nombre:'CORPOAMAZONIA_Amazonia_PlanTrabajo_20240301.pdf', fecha:'2024-03-01', tamano:'2.1 MB', vigente:true },
  { id:'d07', car:'c4', tipo:'Plan de trabajo', nombre:'CDA_AmazOrient_PlanTrabajo_20240120.pdf',         fecha:'2024-01-20', tamano:'1.5 MB', vigente:false },
  { id:'d08', car:'c5', tipo:'Estudio E&P',     nombre:'CORPOBOYACA_Boyaca_EstudioEP_20240310.pdf',       fecha:'2024-03-10', tamano:'5.6 MB', vigente:true },
  { id:'d09', car:'c6', tipo:'Plan de trabajo', nombre:'CDMB_Santander_PlanTrabajo_20240225.pdf',         fecha:'2024-02-25', tamano:'1.8 MB', vigente:true },
  { id:'d10', car:'c7', tipo:'Acta reunión',    nombre:'CORANTIOQUIA_Antioquia_Acta_20240118.pdf',        fecha:'2024-01-18', tamano:'0.6 MB', vigente:false },
  { id:'d11', car:'c8', tipo:'Plan de trabajo', nombre:'CVS_Cordoba_PlanTrabajo_20240228.pdf',            fecha:'2024-02-28', tamano:'2.0 MB', vigente:true },
];

const TIPOS_DOC = ['Plan de trabajo','Estudio E&P','Acta reunión','Informe avance','Resolución CAR','Concepto técnico'];
const diasSinActualizar = (fecha) => Math.floor((new Date() - new Date(fecha)) / 86400000);

const IconBack  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconFile  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconWarn  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;
const IconGrid  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };
const INPUT = { width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:7, fontSize:14, fontFamily:'var(--font)', outline:'none', boxSizing:'border-box' };

function EstadoBadge({ estado }) {
  const map = { verde:{ label:'Cumpliendo', bg:'#dcfce7', c:'#15803d', shape:'circle' }, amarillo:{ label:'En riesgo', bg:'#fef9c3', c:'#854d0e', shape:'square' }, rojo:{ label:'Incumplido', bg:'#fee2e2', c:'#dc2626', shape:'triangle' } };
  const s = map[estado] || map.verde;
  const dot = s.shape==='circle' ? <span style={{width:8,height:8,borderRadius:'50%',background:s.c,flexShrink:0,display:'inline-block'}}/> : s.shape==='square' ? <span style={{width:8,height:8,borderRadius:1,background:s.c,flexShrink:0,display:'inline-block'}}/> : <span style={{width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderBottom:`8px solid ${s.c}`,flexShrink:0,display:'inline-block'}}/>;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:12, fontWeight:600, background:s.bg, color:s.c }}>{dot} {s.label}</span>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?640:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
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

// ── TAB: Panel CARs ───────────────────────────────────────────────────
function TabPanel({ cars, selectedCar, setSelectedCar }) {
  const alertas30 = cars.filter(c => diasSinActualizar(c.ultima_act) > 30);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16, alignItems:'start' }}>
      {/* Lista CARs */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'12px 14px', borderBottom:'1px solid #e2e8f0', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em' }}>
          {cars.length} CARs registradas
        </div>
        {cars.map(c => (
          <button key={c.id} onClick={()=>setSelectedCar(c)} style={{ width:'100%', textAlign:'left', padding:'12px 14px', background: selectedCar?.id===c.id ? COLOR+'0d' : '#fff', border:'none', borderBottom:'1px solid #f1f5f9', cursor:'pointer', borderLeft: selectedCar?.id===c.id ? `3px solid ${COLOR}` : '3px solid transparent' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{c.nombre}</span>
              <EstadoBadge estado={c.estado} />
            </div>
            <div style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>{c.region}</div>
          </button>
        ))}
      </div>

      {/* Detalle CAR */}
      {selectedCar ? (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {alertas30.some(a=>a.id===selectedCar.id) && (
            <div style={{ padding:'12px 16px', borderRadius:8, background:'#fef9c3', color:'#854d0e', border:'1px solid #fde68a', fontSize:13, display:'flex', gap:8 }}>
              <IconWarn /> Plan no actualizado en {diasSinActualizar(selectedCar.ultima_act)} días. Se requiere actualización urgente.
            </div>
          )}
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:'#1e293b' }}>{selectedCar.nombre}</h2>
                <p style={{ margin:'4px 0 0', fontSize:13, color:'#64748b' }}>{selectedCar.region} · {selectedCar.depts.join(', ')}</p>
              </div>
              <EstadoBadge estado={selectedCar.estado} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
              {[['Ejecución del plan', `${selectedCar.ejecucion}%`, selectedCar.ejecucion>=80?'#16a34a':selectedCar.ejecucion>=60?'#ca8a04':'#dc2626'], ['Responsable', selectedCar.responsable, '#1e293b'], ['Última actualización', selectedCar.ultima_act, diasSinActualizar(selectedCar.ultima_act)>30?'#dc2626':'#475569']].map(([l,v,c])=>(
                <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'12px 14px' }}>
                  <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                <span style={{ color:'#64748b' }}>% de ejecución del plan de trabajo</span>
                <span style={{ fontWeight:700, color:selectedCar.ejecucion>=80?'#16a34a':selectedCar.ejecucion>=60?'#ca8a04':'#dc2626' }}>{selectedCar.ejecucion}%</span>
              </div>
              <div style={{ height:10, background:'#f1f5f9', borderRadius:5, overflow:'hidden' }}>
                <div style={{ width:`${selectedCar.ejecucion}%`, height:'100%', background:selectedCar.ejecucion>=80?'#16a34a':selectedCar.ejecucion>=60?'#ca8a04':'#dc2626', borderRadius:5, transition:'width .5s' }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#94a3b8' }}>
          <IconGrid />
          <p style={{ fontSize:14, fontWeight:600, color:'#64748b', marginTop:10 }}>Selecciona una CAR para ver el detalle</p>
        </div>
      )}
    </div>
  );
}

// ── TAB: Repositorio ──────────────────────────────────────────────────
function TabRepositorio({ docs, setDocs, cars }) {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState({ msg:'', ok:true });
  const [filtroCar,  setFiltroCar]  = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [form, setForm] = useState({ car_id:'', tipo:'', nombre:'', fecha: new Date().toISOString().slice(0,10) });

  function showToast(msg,ok=true){setToast({msg,ok});setTimeout(()=>setToast({msg:'',ok:true}),3500);}

  function handleSave() {
    if (!form.tipo || !form.car_id) { showToast('CAR y tipo de documento son obligatorios.',false); return; }
    const car   = cars.find(c=>c.id===form.car_id);
    const auto  = `${car?.nombre?.toUpperCase().replace(' ','')}_${car?.region?.replace(' ','')}_${form.tipo.replace(' ','')}_${form.fecha.replace(/-/g,'')}.pdf`;
    setDocs(prev=>[{ id:'d'+Date.now(), ...form, nombre: auto, tamano:'—', vigente:true },...prev]);
    showToast('Documento registrado con nomenclatura automática (demo).');
    setModal(false);
  }

  function handleDelete(d) {
    if (!window.confirm(`¿Eliminar "${d.nombre}"?`)) return;
    setDocs(prev=>prev.filter(x=>x.id!==d.id));
    showToast('Documento eliminado (demo).');
  }

  const filtrados = docs.filter(d=>(!filtroCar||d.car===filtroCar)&&(!filtroTipo||d.tipo===filtroTipo));

  return (
    <div>
      <Toast msg={toast.msg} ok={toast.ok} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:8 }}>
          <select className="form-select" style={{ maxWidth:200 }} value={filtroCar} onChange={e=>setFiltroCar(e.target.value)}>
            <option value="">Todas las CARs</option>
            {cars.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth:180 }} value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {TIPOS_DOC.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal(true)} style={{ background:COLOR, borderColor:COLOR, display:'flex', alignItems:'center', gap:6 }}>
          <IconPlus /> Subir documento
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Nomenclatura','Tipo','CAR','Fecha','Tamaño','Vigente',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filtrados.map((d,i)=>{
              const car = cars.find(c=>c.id===d.car);
              return (
                <tr key={d.id} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
                  <td style={{ ...TD, fontWeight:500, color:'#1e293b', fontFamily:'monospace', fontSize:12, maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    <span style={{ marginRight:6, color:COLOR }}><IconFile /></span>{d.nombre}
                  </td>
                  <td style={TD}><span style={{ fontSize:11, fontWeight:600, background:COLOR+'12', color:COLOR, padding:'1px 7px', borderRadius:999 }}>{d.tipo}</span></td>
                  <td style={TD}>{car?.nombre||'—'}</td>
                  <td style={TD}>{d.fecha}</td>
                  <td style={TD}>{d.tamano}</td>
                  <td style={TD}><span style={{ fontSize:12, fontWeight:600, color:d.vigente?'#16a34a':'#dc2626' }}>{d.vigente?'✓ Vigente':'✗ Vencido'}</span></td>
                  <td style={TD}><button onClick={()=>handleDelete(d)} className="btn btn-danger btn-sm">Eliminar</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar documento" onClose={()=>setModal(false)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>CAR *</label>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.car_id} onChange={e=>setForm(f=>({...f,car_id:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {cars.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Tipo de documento *</label>
              <select className="form-select" style={{ ...INPUT, background:'#fff' }} value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {TIPOS_DOC.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1' }}><label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Fecha del documento</label>
              <input type="date" className="form-input" style={INPUT} value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))} />
            </div>
            <div style={{ gridColumn:'1/-1', padding:'10px 14px', borderRadius:8, background:'#f8fafc', border:'1px solid #e2e8f0', fontSize:12, color:'#64748b' }}>
              💡 La nomenclatura se generará automáticamente: <strong style={{ color:'#1e293b' }}>{'{CAR}_{Region}_{TipoDoc}_{YYYYMMDD}.pdf'}</strong>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ background:COLOR, borderColor:COLOR }}>Registrar con nomenclatura automática</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── TAB: Semáforo cumplimiento ────────────────────────────────────────
function TabSemaforo({ cars }) {
  const verde    = cars.filter(c=>c.estado==='verde').length;
  const amarillo = cars.filter(c=>c.estado==='amarillo').length;
  const rojo     = cars.filter(c=>c.estado==='rojo').length;
  const alertas  = cars.filter(c=>diasSinActualizar(c.ultima_act)>30);

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        {[['Cumpliendo',verde,'#dcfce7','#15803d','circle'],['En riesgo',amarillo,'#fef9c3','#854d0e','square'],['Incumplido',rojo,'#fee2e2','#dc2626','triangle']].map(([l,v,bg,c,sh])=>(
          <div key={l} style={{ flex:'1 1 140px', background:bg, borderRadius:10, padding:'16px 18px', border:`1px solid ${c}33` }}>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:13, fontWeight:600, color:c, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {alertas.length > 0 && (
        <div style={{ padding:'12px 16px', borderRadius:8, background:'#fff7ed', color:'#c2410c', border:'1px solid #fed7aa', marginBottom:16, fontSize:13, display:'flex', gap:8, alignItems:'center' }}>
          <IconWarn /> <strong>{alertas.length} CAR{alertas.length>1?'s':''}</strong> sin actualizar en más de 30 días: {alertas.map(a=>a.nombre).join(', ')}
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {[...cars].sort((a,b)=>a.ejecucion-b.ejecucion).map(c=>(
          <div key={c.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ minWidth:160 }}>
              <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{c.nombre}</div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>{c.responsable}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${c.ejecucion}%`, height:'100%', background:c.ejecucion>=80?'#16a34a':c.ejecucion>=60?'#ca8a04':'#dc2626', borderRadius:4 }} />
              </div>
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:c.ejecucion>=80?'#16a34a':c.ejecucion>=60?'#ca8a04':'#dc2626', minWidth:40, textAlign:'right' }}>{c.ejecucion}%</span>
            <EstadoBadge estado={c.estado} />
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id:'panel',    label:'Panel por CAR',         icon:<IconGrid /> },
  { id:'repo',     label:'Repositorio estudios',  icon:<IconFile /> },
  { id:'semaforo', label:'Semáforo cumplimiento', icon:<IconGrid /> },
];

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:COLOR+'0d', border:`1px solid ${COLOR}30`, borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', flexDirection:'column', gap:14 }}>
      <p style={{ margin:0, fontSize:14, color:'var(--content-text)', lineHeight:1.65 }}>{META.descripcion}</p>
      <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 200px' }}>
          <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:COLOR, textTransform:'uppercase', letterSpacing:'.06em' }}>Puntos clave</p>
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
            {META.puntosClave.map((p,i)=><li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--content-text)' }}><span style={{ width:18,height:18,borderRadius:'50%',background:COLOR+'18',color:COLOR,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:11,flexShrink:0,marginTop:1 }}>✓</span>{p}</li>)}
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
  );
}

export default function LineamientosAmbientalesPage() {
  useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab]       = useState('panel');
  const [cars]              = useState(CARS);
  const [docs, setDocs]     = useState(DOCS);
  const [selectedCar, setSelectedCar] = useState(CARS[0]);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/modulos')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px' }}><IconBack /> Módulos</button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:32, height:32, borderRadius:8, background:COLOR+'18', color:COLOR, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>B</span>
          <div>
            <div style={{ fontSize:11, color:'var(--content-text-hint)', fontWeight:500 }}>#6 · Grupo B — Núcleo Estratégico ANH</div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:'var(--content-text)', lineHeight:1.2 }}>Lineamientos Técnicos Ambientales</h1>
          </div>
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:999, border:'1px solid #fde68a' }}>DEMO</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:4, borderBottom:'2px solid #e2e8f0', marginBottom:20, overflowX:'auto' }} role="tablist">
        {TABS.map(t=><button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:13, fontWeight:tab===t.id?700:500, color:tab===t.id?COLOR:'#64748b', borderBottom:tab===t.id?`2px solid ${COLOR}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' }}><span style={{ opacity:tab===t.id?1:0.6 }}>{t.icon}</span>{t.label}</button>)}
      </div>
      {tab==='panel'    && <TabPanel       cars={cars} selectedCar={selectedCar} setSelectedCar={setSelectedCar} />}
      {tab==='repo'     && <TabRepositorio docs={docs} setDocs={setDocs} cars={cars} />}
      {tab==='semaforo' && <TabSemaforo    cars={cars} />}
    </div>
  );
}
