import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 19);

const HOY = new Date('2024-12-05');
const diasSin = (f) => Math.floor((HOY - new Date(f)) / 86400000);
const ALERTA_DIAS = 21;

const CARS_ALIANZAS = [
  { id:'ca1', car:'Corporinoquia', region:'Orinoquía', responsable:'Dir. María Castro', estado:'verde', ultimo_reporte:'2024-11-28', productos:5, cumplidos:5 },
  { id:'ca2', car:'Cormacarena',   region:'Macarena',  responsable:'Dir. Julio Ramos',  estado:'amarillo',ultimo_reporte:'2024-11-10', productos:4, cumplidos:3 },
  { id:'ca3', car:'Corpoamazonia', region:'Amazonia',  responsable:'Dir. Ana Bernal',   estado:'verde', ultimo_reporte:'2024-12-01', productos:6, cumplidos:6 },
  { id:'ca4', car:'CDA',           region:'Guainía',   responsable:'Dir. Pedro Ortiz',  estado:'rojo',  ultimo_reporte:'2024-10-01', productos:3, cumplidos:1 },
  { id:'ca5', car:'Corpoboyacá',   region:'Boyacá',    responsable:'Dir. Sandra Gil',   estado:'verde', ultimo_reporte:'2024-11-22', productos:5, cumplidos:4 },
  { id:'ca6', car:'CDMB',          region:'Santander', responsable:'Dir. Luis Ayala',   estado:'amarillo',ultimo_reporte:'2024-11-05',productos:4, cumplidos:2 },
  { id:'ca7', car:'Corantioquia',  region:'Antioquia', responsable:'Dir. Clara Soto',   estado:'rojo',  ultimo_reporte:'2024-09-20', productos:5, cumplidos:2 },
  { id:'ca8', car:'CVS',           region:'Córdoba',   responsable:'Dir. Felipe Mora',  estado:'verde', ultimo_reporte:'2024-11-18', productos:4, cumplidos:4 },
];

const ENTIDADES_NAC = [
  { id:'en1', nombre:'Entidad contratante', tipo:'Contratante', contacto:'Supervisor del convenio', estado:'verde',   ultimo_reporte:'2024-12-02' },
  { id:'en2', nombre:'DNP',            tipo:'Técnico',       contacto:'Dir. Inversión', estado:'verde',   ultimo_reporte:'2024-11-25' },
  { id:'en3', nombre:'MINAGRICULTURA', tipo:'Aliado técnico',contacto:'Sec. Técnica',   estado:'amarillo',ultimo_reporte:'2024-10-30' },
  { id:'en4', nombre:'UARIV',          tipo:'Aliado social', contacto:'Dir. Territorial',estado:'verde',  ultimo_reporte:'2024-11-28' },
];

const ESTADO_CFG = { verde:{ label:'Activa', bg:'#dcfce7', c:'#15803d' }, amarillo:{ label:'En riesgo', bg:'#fef9c3', c:'#b45309' }, rojo:{ label:'Crítica', bg:'#fee2e2', c:'#dc2626' } };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconWarn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function EstadoBadge({ estado }) {
  const s = ESTADO_CFG[estado]||ESTADO_CFG.verde;
  const shape = estado==='verde'?<span style={{width:8,height:8,borderRadius:'50%',background:s.c,display:'inline-block'}}/>:estado==='amarillo'?<span style={{width:8,height:8,borderRadius:1,background:s.c,display:'inline-block'}}/>:<span style={{width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderBottom:`8px solid ${s.c}`,display:'inline-block'}}/>;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:s.bg, color:s.c }}>{shape} {s.label}</span>;
}

function TabCARs({ cars, showToast }) {
  const alertas = cars.filter(c => diasSin(c.ultimo_reporte) >= ALERTA_DIAS);
  return (
    <div>
      {alertas.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, display:'flex', gap:8, alignItems:'center' }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>{alertas.length} CAR(s) sin reporte en más de {ALERTA_DIAS} días — incluido en próximo informe institucional</span>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {cars.map(c => {
          const pct = Math.round((c.cumplidos/c.productos)*100);
          const alerta = diasSin(c.ultimo_reporte) >= ALERTA_DIAS;
          const s = ESTADO_CFG[c.estado];
          return (
            <div key={c.id} style={{ background:'#fff', border:`1px solid ${alerta?'#fde68a':'#e2e8f0'}`, borderRadius:12, padding:16, background:alerta?'#fffbeb':'#fff' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>{c.car}</span>
                <EstadoBadge estado={c.estado} />
              </div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>{c.region} · {c.responsable}</div>
              <div style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#475569', marginBottom:4 }}>
                  <span>Productos comprometidos</span><span style={{ fontWeight:700, color:pct>=80?'#15803d':pct>=50?COLOR:'#dc2626' }}>{c.cumplidos}/{c.productos} ({pct}%)</span>
                </div>
                <div style={{ height:7, background:'#e2e8f0', borderRadius:99 }}>
                  <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:pct>=80?'#10b981':pct>=50?COLOR:'#ef4444' }}/>
                </div>
              </div>
              <div style={{ fontSize:11, color:alerta?'#b45309':'#94a3b8', fontWeight:alerta?700:400 }}>
                Último reporte: {c.ultimo_reporte} {alerta&&`(${diasSin(c.ultimo_reporte)}d sin reporte ⚠)`}
              </div>
              <button onClick={()=>showToast(`Reporte de ${c.car} registrado (demo)`)} style={{ marginTop:10, width:'100%', padding:'6px 0', borderRadius:7, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                Registrar reporte →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabEntidades({ entidades }) {
  return (
    <div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Entidad','Tipo','Contacto','Estado alianza','Último reporte','Días sin reporte'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {entidades.map(e => {
              const d = diasSin(e.ultimo_reporte);
              return (
                <tr key={e.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontWeight:700, color:'#1e293b'}}>{e.nombre}</td>
                  <td style={TD}>{e.tipo}</td>
                  <td style={TD}>{e.contacto}</td>
                  <td style={TD}><EstadoBadge estado={e.estado} /></td>
                  <td style={TD}>{e.ultimo_reporte}</td>
                  <td style={{...TD, color:d>=21?'#b45309':'#475569', fontWeight:d>=21?700:400}}>{d}d {d>=21&&'⚠'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Panel CARs','Entidades Nacionales'];

export default function GestionAlianzasPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Panel CARs');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Gestión de Alianzas</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Panel CARs'          && <TabCARs cars={CARS_ALIANZAS} showToast={showToast} />}
      {tab === 'Entidades Nacionales' && <TabEntidades entidades={ENTIDADES_NAC} />}
      <Toast {...toast} />
    </div>
  );
}
