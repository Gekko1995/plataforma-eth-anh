import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#DC2626';
const META  = modulos.find(m => m.id === 22);

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const ITEMS = [
  { id:'i1', nombre:'Personal', presupuesto:3200000000, ejecutado:2176000000, tipo:'item' },
  { id:'i2', nombre:'Operación', presupuesto:800000000,  ejecutado:544000000,  tipo:'item' },
  { id:'i3', nombre:'Inversión', presupuesto:2400000000, ejecutado:1632000000, tipo:'item' },
  { id:'i4', nombre:'Contrapartida', presupuesto:640000000,ejecutado:435200000, tipo:'contrapartida' },
];

const EGRESOS = [
  { id:'e01', fecha:'2024-12-03', item:'Personal',   concepto:'Nómina diciembre', proveedor:'Planta interna', valor:267000000, soporte:'NOM-DIC-2024' },
  { id:'e02', fecha:'2024-11-28', item:'Operación',  concepto:'Combustible vehículos', proveedor:'Terpel S.A.', valor:8500000, soporte:'FAC-20241128' },
  { id:'e03', fecha:'2024-11-25', item:'Inversión',  concepto:'Compra semillas mejoradas', proveedor:'ICA certified', valor:45000000, soporte:'ORD-20241125' },
  { id:'e04', fecha:'2024-11-20', item:'Operación',  concepto:'Papelería y suministros', proveedor:'Papelsa', valor:3200000, soporte:'FAC-20241120' },
  { id:'e05', fecha:'2024-11-15', item:'Inversión',  concepto:'Equipos de campo GPS', proveedor:'TecnoGIS', valor:12800000, soporte:'ORD-20241115' },
  { id:'e06', fecha:'2024-11-10', item:'Personal',   concepto:'OPS noviembre', proveedor:'Varios', valor:187500000, soporte:'CTA-NOV-2024' },
];

const pct = (it) => Math.round((it.ejecutado/it.presupuesto)*100);
const proyeccion = (it) => Math.round((it.ejecutado/10)*12);

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconWarn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabDashboard() {
  const totalPres = ITEMS.reduce((s,i)=>s+i.presupuesto,0);
  const totalEjec = ITEMS.reduce((s,i)=>s+i.ejecutado,0);
  const pctGlobal = Math.round((totalEjec/totalPres)*100);
  const sobreEjec = ITEMS.filter(i => pct(i) >= 80);

  return (
    <div>
      {sobreEjec.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, display:'flex', gap:8, alignItems:'center' }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>{sobreEjec.map(i=>i.nombre).join(', ')} superan el 80% de ejecución — vigilar disponibilidad</span>
        </div>
      )}
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {[
          { label:'Presupuesto total', val:fmt(totalPres), c:COLOR },
          { label:'Ejecutado', val:fmt(totalEjec), c:'#dc2626' },
          { label:'Disponible', val:fmt(totalPres-totalEjec), c:'#15803d' },
          { label:'% Ejecución global', val:`${pctGlobal}%`, c:pctGlobal>=80?'#dc2626':pctGlobal>=50?COLOR:'#475569' },
        ].map(k => <div key={k.label} className="kpi-card"><div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div><div style={{ fontSize:20, fontWeight:800, color:k.c }}>{k.val}</div></div>)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {ITEMS.map(it => {
          const p = pct(it);
          const c = p>=95?'#dc2626':p>=80?'#b45309':p>=50?COLOR:'#64748b';
          const proy = proyeccion(it);
          const riesgo = proy > it.presupuesto;
          return (
            <div key={it.id} style={{ background:'#fff', border:`1px solid ${p>=80?'#fde68a':'#e2e8f0'}`, borderRadius:12, padding:18, background:p>=80?'#fffbeb':'#fff' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div>
                  <span style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>{it.nombre}</span>
                  <span style={{ marginLeft:10, fontSize:11, background:it.tipo==='contrapartida'?'#dbeafe':'#f1f5f9', color:it.tipo==='contrapartida'?'#1d4ed8':'#64748b', borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{it.tipo}</span>
                </div>
                <span style={{ fontSize:22, fontWeight:900, color:c }}>{p}%</span>
              </div>
              <div style={{ height:12, background:'#e2e8f0', borderRadius:99, marginBottom:10 }}>
                <div style={{ width:`${Math.min(p,100)}%`, height:'100%', borderRadius:99, background:c, transition:'width .4s' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {[['Presupuesto',fmt(it.presupuesto),'#475569'],['Ejecutado',fmt(it.ejecutado),c],['Disponible',fmt(it.presupuesto-it.ejecutado),'#15803d'],['Proyección cierre',fmt(proy),riesgo?'#dc2626':'#475569']].map(([l,v,vc]) => (
                  <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>{l}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:vc }}>{v}</div>
                  </div>
                ))}
              </div>
              {riesgo && <div style={{ marginTop:8, fontSize:11, color:'#dc2626', fontWeight:700 }}>⚠ Proyección supera presupuesto — requiere revisión</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabEgresos({ showToast }) {
  return (
    <div>
      <button onClick={()=>showToast('Egreso registrado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar egreso
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Fecha','Ítem','Concepto','Proveedor','Valor','Soporte'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {EGRESOS.map(e => (
              <tr key={e.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={TD}>{e.fecha}</td>
                <td style={TD}><span style={{ fontSize:11, background:COLOR+'18', color:COLOR, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{e.item}</span></td>
                <td style={{...TD, fontWeight:500, color:'#1e293b'}}>{e.concepto}</td>
                <td style={TD}>{e.proveedor}</td>
                <td style={{...TD, fontWeight:700, color:'#1e293b'}}>{fmt(e.valor)}</td>
                <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{e.soporte}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Dashboard Financiero','Registro de Egresos'];

export default function GestionFinancieraPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard Financiero');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Gestión Financiera</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Dashboard Financiero'  && <TabDashboard />}
      {tab === 'Registro de Egresos'   && <TabEgresos showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
