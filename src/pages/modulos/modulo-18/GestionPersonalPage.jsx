import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 18);

const HOY = new Date('2024-12-05');
const diasHasta = (f) => Math.ceil((new Date(f) - HOY) / 86400000);

const PERSONAL = [
  { id:'p01', nombre:'Ing. Laura Castillo',   cargo:'Coordinadora CAR',        region:'Orinoquía',   tipo:'OPS',    salario:5800000,  inicio:'2024-01-15', fin_contrato:'2025-01-14', eps:'Sanitas',    pension:'Protección', arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p02', nombre:'Ing. Pedro Salinas',    cargo:'Técnico Campo',           region:'Macarena',    tipo:'OPS',    salario:3200000,  inicio:'2024-03-01', fin_contrato:'2025-02-28', eps:'Nueva EPS',  pension:'Colpensiones',arl:'AXA',  eps_ok:true, pension_ok:false,arl_ok:true, novedades:['Incapacidad 5 días'] },
  { id:'p03', nombre:'Ing. Clara Moreno',     cargo:'Líder Ambiental',         region:'Amazonia',    tipo:'Nómina', salario:6200000,  inicio:'2024-01-15', fin_contrato:'2024-12-31', eps:'Compensar',  pension:'Porvenir',  arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p04', nombre:'Ing. Roberto Pinto',    cargo:'Técnico GIS',             region:'Amazonia Or.',tipo:'OPS',    salario:4100000,  inicio:'2024-06-01', fin_contrato:'2025-05-31', eps:'Medimás',    pension:'Colpensiones',arl:'Liberty',eps_ok:false,pension_ok:true, arl_ok:true, novedades:['EPS en mora'] },
  { id:'p05', nombre:'Ing. Sandra Vargas',    cargo:'Coordinadora Proyecto',   region:'Boyacá',      tipo:'Nómina', salario:8500000,  inicio:'2024-01-15', fin_contrato:'2025-06-30', eps:'Sanitas',    pension:'Protección', arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p06', nombre:'Ing. Luis Herrera',     cargo:'Técnico Social',          region:'Santander',   tipo:'OPS',    salario:3800000,  inicio:'2024-04-01', fin_contrato:'2024-12-31', eps:'Compensar',  pension:'Porvenir',  arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p07', nombre:'Ing. Patricia Ríos',    cargo:'Prof. Agropecuario',      region:'Antioquia',   tipo:'OPS',    salario:4800000,  inicio:'2024-02-01', fin_contrato:'2025-01-31', eps:'Sanitas',    pension:'Protección', arl:'AXA',  eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p08', nombre:'Ing. Carlos Mendoza',   cargo:'Prof. Financiero',        region:'Córdoba',     tipo:'Nómina', salario:7200000,  inicio:'2024-01-15', fin_contrato:'2025-01-14', eps:'Cruz Blanca',pension:'Protección', arl:'Liberty',eps_ok:true,pension_ok:true,arl_ok:true, novedades:['Vacaciones dic 20-31'] },
  { id:'p09', nombre:'Ing. Nelly Torres',     cargo:'Prof. M&E',               region:'Santander',   tipo:'OPS',    salario:5200000,  inicio:'2024-03-15', fin_contrato:'2025-03-14', eps:'Sanitas',    pension:'Colpensiones',arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
  { id:'p10', nombre:'Ing. Fabio Guerrero',   cargo:'Técnico HSE',             region:'Córdoba',     tipo:'OPS',    salario:3900000,  inicio:'2024-05-01', fin_contrato:'2024-12-31', eps:'Medimás',    pension:'Protección', arl:'Sura', eps_ok:true, pension_ok:true, arl_ok:true, novedades:[] },
];

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);
const ssOk = (p) => p.eps_ok && p.pension_ok && p.arl_ok;
const diasVence = (p) => diasHasta(p.fin_contrato);

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconWarn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?700:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

function TabPlanta({ personal, onVerFicha }) {
  const ssProblemas = personal.filter(p => !ssOk(p));
  const porVencer30 = personal.filter(p => { const d = diasVence(p); return d >= 0 && d <= 30; });

  return (
    <div>
      {ssProblemas.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:12, display:'flex', gap:8, alignItems:'center' }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#7f1d1d' }}>{ssProblemas.length} funcionario(s) con seguridad social en mora</span>
        </div>
      )}
      {porVencer30.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, display:'flex', gap:8, alignItems:'center' }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>{porVencer30.length} contrato(s) vencen en los próximos 30 días</span>
        </div>
      )}
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Nombre','Cargo','Región','Tipo','Salario','SS','Contrato hasta','Novedades'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {personal.map(p => {
              const d = diasVence(p);
              const ok = ssOk(p);
              return (
                <tr key={p.id} onClick={()=>onVerFicha(p)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', background:!ok?'#fff5f5':d<=30&&d>=0?'#fffbeb':'transparent' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=!ok?'#fff5f5':d<=30&&d>=0?'#fffbeb':'transparent'}>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{p.nombre.replace('Ing. ','')}</td>
                  <td style={TD}>{p.cargo}</td>
                  <td style={TD}>{p.region}</td>
                  <td style={TD}><span style={{ fontSize:11, background:COLOR+'18', color:COLOR, borderRadius:6, padding:'2px 6px', fontWeight:600 }}>{p.tipo}</span></td>
                  <td style={TD}>{fmt(p.salario)}</td>
                  <td style={TD}>
                    {ok
                      ? <span style={{ fontSize:11, color:'#15803d', fontWeight:700 }}>✓ Al día</span>
                      : <span style={{ fontSize:11, color:'#dc2626', fontWeight:700 }}>✗ Mora</span>
                    }
                  </td>
                  <td style={{...TD, color:d<=7?'#dc2626':d<=30?'#b45309':'#475569', fontWeight:d<=30?700:400}}>{p.fin_contrato} {d<=30&&d>=0?`(${d}d)`:''}</td>
                  <td style={TD}>{p.novedades.length > 0 ? <span style={{ fontSize:11, color:'#b45309' }}>{p.novedades[0]}</span> : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabNomina({ personal }) {
  const totalNomina = personal.filter(p=>p.tipo==='Nómina').reduce((s,p)=>s+p.salario,0);
  const totalOPS    = personal.filter(p=>p.tipo==='OPS').reduce((s,p)=>s+p.salario,0);
  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Total planta', val:personal.length, c:COLOR },
          { label:'Nómina', val:personal.filter(p=>p.tipo==='Nómina').length, c:'#1d4ed8' },
          { label:'OPS', val:personal.filter(p=>p.tipo==='OPS').length, c:'#0891b2' },
          { label:'SS al día', val:personal.filter(p=>ssOk(p)).length, c:'#15803d' },
        ].map(k => <div key={k.label} className="kpi-card"><div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div><div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.val}</div></div>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        {[['Masa salarial Nómina',fmt(totalNomina),'#1d4ed8'],['Masa salarial OPS',fmt(totalOPS),'#0891b2']].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
            <div style={{ fontSize:12, color:'#64748b', fontWeight:600, marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:10, padding:'12px 16px' }}>
        <div style={{ fontSize:12, fontWeight:700, color:COLOR, marginBottom:6 }}>Reporte de nómina — Desembolso D2 (35%)</div>
        <p style={{ fontSize:12, color:'#475569', margin:0 }}>El reporte incluye planta activa, valor por persona, tipo de vinculación y estado de SS. Se genera en PDF según formato requerido por ANH. (demo)</p>
        <button style={{ marginTop:10, padding:'6px 14px', borderRadius:7, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Descargar reporte PDF (demo)
        </button>
      </div>
    </div>
  );
}

const TABS = ['Planta de Personal','Nómina y SS'];

export default function GestionPersonalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Planta de Personal');
  const [ficha, setFicha] = useState(null);
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Administración de Personal</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Planta de Personal' && <TabPlanta personal={PERSONAL} onVerFicha={setFicha} />}
      {tab === 'Nómina y SS'        && <TabNomina personal={PERSONAL} />}
      {ficha && (
        <Modal title={ficha.nombre} onClose={() => setFicha(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {[['Cargo',ficha.cargo],['Región',ficha.region],['Tipo',ficha.tipo],['Salario',fmt(ficha.salario)],['Inicio',ficha.inicio],['Fin contrato',ficha.fin_contrato],['EPS',`${ficha.eps} (${ficha.eps_ok?'Al día':'⚠ Mora'})`],['Pensión',`${ficha.pension} (${ficha.pension_ok?'Al día':'⚠ Mora'})`],['ARL',`${ficha.arl} (${ficha.arl_ok?'Al día':'⚠ Mora'})`],['Novedades',ficha.novedades.join(', ')||'—']].map(([l,v]) => (
              <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={() => { showToast('Novedad registrada (demo)'); setFicha(null); }} style={{ padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            + Registrar novedad
          </button>
        </Modal>
      )}
      <Toast {...toast} />
    </div>
  );
}
