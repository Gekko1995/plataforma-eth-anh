import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#0369A1';
const META  = modulos.find(m => m.id === 14);

const BENEFICIARIOS = [
  { id:'ben001', cedula:'1018293847', nombre:'Juan Carlos Peña Morales',    municipio:'Yopal',       perfil:'Caficultor',      etnia:'Mestizo',         condicion:'PDET',         consentimiento:true,  seguimiento:'2024-11-28' },
  { id:'ben002', cedula:'1023456789', nombre:'María Luz Torres Salinas',    municipio:'Florencia',   perfil:'Cacaotero',       etnia:'Mestizo',         condicion:'Víctima',      consentimiento:true,  seguimiento:'2024-12-01' },
  { id:'ben003', cedula:'80194736',   nombre:'Pedro Morales Rincón',        municipio:'Arauca',      perfil:'Ganadero',        etnia:'Mestizo',         condicion:'PDET',         consentimiento:true,  seguimiento:'2024-10-05' },
  { id:'ben004', cedula:'1052638291', nombre:'Claudia Vargas de la Cruz',   municipio:'Mocoa',       perfil:'Cacaotero',       etnia:'Indígena',        condicion:'Étnico',       consentimiento:false, seguimiento:'2024-11-15' },
  { id:'ben005', cedula:'1019273645', nombre:'Luis Herrera Pinto',          municipio:'Inírida',     perfil:'Apicultor',       etnia:'Indígena Sikuani',condicion:'Étnico/PDET',  consentimiento:true,  seguimiento:'2024-09-20' },
  { id:'ben006', cedula:'1011223344', nombre:'Sandra Moreno Guzmán',        municipio:'Sogamoso',    perfil:'Caficultor',      etnia:'Mestizo',         condicion:'Mujer rural',  consentimiento:true,  seguimiento:'2024-11-30' },
  { id:'ben007', cedula:'79654321',   nombre:'Roberto Quintero Castro',     municipio:'Villavicencio',perfil:'Palma de aceite', etnia:'Afrodescendiente',condicion:'Reintegrado',  consentimiento:true,  seguimiento:'2024-12-02' },
  { id:'ben008', cedula:'1035476829', nombre:'Elena Castillo Ríos',         municipio:'Montería',    perfil:'Ganadero',        etnia:'Mestizo',         condicion:'Víctima/PDET', consentimiento:true,  seguimiento:'2024-11-10' },
  { id:'ben009', cedula:'1094837261', nombre:'Carlos Mendoza Torres',       municipio:'Bucaramanga', perfil:'Caficultor',      etnia:'Mestizo',         condicion:'PDET',         consentimiento:true,  seguimiento:'2024-12-03' },
  { id:'ben010', cedula:'1073920184', nombre:'Patricia Ríos Salcedo',       municipio:'Puerto Rico', perfil:'Cacaotero',       etnia:'Mestizo',         condicion:'Mujer rural',  consentimiento:false, seguimiento:'2024-10-15' },
  { id:'ben011', cedula:'1066453812', nombre:'Fabio Guerrero Pinzón',       municipio:'Pasto',       perfil:'Quinuero',        etnia:'Indígena Pasto',  condicion:'Étnico',       consentimiento:true,  seguimiento:'2024-11-20' },
  { id:'ben012', cedula:'1049281736', nombre:'Nelly Torres Jiménez',        municipio:'Quibdó',      perfil:'Artesana',        etnia:'Afrodescendiente',condicion:'PDET/Étnico',  consentimiento:true,  seguimiento:'2024-12-01' },
];

const HOY = new Date('2024-12-05');
const diasSin = (f) => Math.floor((HOY - new Date(f)) / 86400000);
const ALERTA_DIAS = 30;

const IconBack  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconQR    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="19" y="19" width="2" height="2"/><rect x="19" y="14" width="2" height="3"/></svg>;
const IconWarn  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#1e3a8a' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#1e40af', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div role="dialog" aria-modal onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:wide?720:500, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.22)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', padding:4 }}><IconX /></button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

function QRCard({ ben, onClose }) {
  return (
    <Modal title="Tarjeta QR Beneficiario" onClose={onClose}>
      <div style={{ textAlign:'center' }}>
        <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:24, display:'inline-block', marginBottom:16 }}>
          <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8 }}>CONVENIO ETH-ANH 2026</div>
          {/* Simulated QR */}
          <div style={{ width:120, height:120, background:'#fff', border:'2px solid #1e293b', borderRadius:4, margin:'0 auto 12px', display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:6, gap:1 }}>
            {Array.from({length:49}).map((_,i) => (
              <div key={i} style={{ background:[0,1,2,3,7,8,9,14,16,17,18,21,28,29,30,35,36,37,42,43,44,45,46,47,48,12,24,4,11,38].includes(i)?'#1e293b':'transparent', borderRadius:1 }}/>
            ))}
          </div>
          <div style={{ fontSize:16, fontWeight:800, color:'#1e293b', letterSpacing:2 }}>{ben.cedula}</div>
          <div style={{ fontSize:12, fontWeight:600, color:'#475569', marginTop:4 }}>{ben.nombre}</div>
          <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{ben.perfil} · {ben.municipio}</div>
          <div style={{ marginTop:8, padding:'4px 12px', background:ben.consentimiento?'#dcfce7':'#fee2e2', borderRadius:999, fontSize:11, fontWeight:700, color:ben.consentimiento?'#15803d':'#dc2626', display:'inline-block' }}>
            {ben.consentimiento?'✓ Habeas Data firmado':'⚠ Sin consentimiento'}
          </div>
        </div>
        <div style={{ fontSize:11, color:'#94a3b8' }}>* Documento demostrativo — datos simulados</div>
      </div>
    </Modal>
  );
}

// ── Tab Padrón ─────────────────────────────────────────────────────────
function TabPadron({ beneficiarios, onVerFicha, onVerQR, showToast }) {
  const [buscar, setBuscar] = useState('');
  const alertas = beneficiarios.filter(b => diasSin(b.seguimiento) > ALERTA_DIAS);
  const filtrados = beneficiarios.filter(b =>
    !buscar || b.nombre.toLowerCase().includes(buscar.toLowerCase()) || b.cedula.includes(buscar)
  );

  return (
    <div>
      {alertas.length > 0 && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:10, padding:'10px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
          <IconWarn /><span style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>{alertas.length} beneficiario(s) con condición especial sin seguimiento en +{ALERTA_DIAS} días</span>
        </div>
      )}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input className="form-input" style={{ maxWidth:260 }} placeholder="Buscar por cédula o nombre…" value={buscar} onChange={e=>setBuscar(e.target.value)} />
        <button onClick={() => showToast('Formulario de registro abierto (demo)')} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          <IconPlus /> Registrar
        </button>
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Cédula','Nombre','Municipio','Perfil','Condición','Consentimiento','Seguimiento','Acciones'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.map(b => {
              const dias = diasSin(b.seguimiento);
              const alerta = dias > ALERTA_DIAS;
              return (
                <tr key={b.id} style={{ borderBottom:'1px solid #f1f5f9', background:alerta?'#fffbeb':'transparent' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:12}}>{b.cedula}</td>
                  <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{b.nombre}</td>
                  <td style={TD}>{b.municipio}</td>
                  <td style={TD}><span style={{ fontSize:11, background:COLOR+'18', color:COLOR, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{b.perfil}</span></td>
                  <td style={TD}><span style={{ fontSize:11, color:'#475569' }}>{b.condicion}</span></td>
                  <td style={TD}>
                    {b.consentimiento
                      ? <span style={{ display:'inline-flex', gap:4, alignItems:'center', fontSize:11, color:'#15803d', fontWeight:700 }}><span style={{ width:7,height:7,borderRadius:'50%',background:'#15803d' }}/>Firmado</span>
                      : <span style={{ display:'inline-flex', gap:4, alignItems:'center', fontSize:11, color:'#dc2626', fontWeight:700 }}><span style={{ width:0,height:0,borderLeft:'4px solid transparent',borderRight:'4px solid transparent',borderBottom:'7px solid #dc2626' }}/>Pendiente</span>
                    }
                  </td>
                  <td style={{...TD, color:alerta?'#b45309':'#475569', fontWeight:alerta?700:400}}>{b.seguimiento} {alerta&&'⚠'}</td>
                  <td style={TD}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => onVerFicha(b)} style={{ padding:'3px 8px', borderRadius:5, background:'#f1f5f9', color:'#475569', border:'none', fontSize:11, cursor:'pointer', fontWeight:600 }}>Ficha</button>
                      <button onClick={() => onVerQR(b)} style={{ padding:'3px 8px', borderRadius:5, background:COLOR+'18', color:COLOR, border:'none', fontSize:11, cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', gap:3 }}><IconQR/> QR</button>
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

// ── Tab Dashboard ──────────────────────────────────────────────────────
function TabDashboard({ beneficiarios }) {
  const total = beneficiarios.length;
  const conConsentimiento = beneficiarios.filter(b => b.consentimiento).length;
  const conAlertas = beneficiarios.filter(b => diasSin(b.seguimiento) > ALERTA_DIAS).length;

  const perPerfil = [...new Set(beneficiarios.map(b => b.perfil))].map(p => ({
    perfil:p, count:beneficiarios.filter(b=>b.perfil===p).length
  })).sort((a,b)=>b.count-a.count);

  const perMuni = [...new Set(beneficiarios.map(b => b.municipio))].map(m => ({
    muni:m, count:beneficiarios.filter(b=>b.municipio===m).length
  })).sort((a,b)=>b.count-a.count);

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {[
          { label:'Total beneficiarios', val:total, c:COLOR },
          { label:'Consentimiento firmado', val:conConsentimiento, c:'#15803d' },
          { label:'Sin consentimiento', val:total-conConsentimiento, c:'#dc2626' },
          { label:'Con alerta seguimiento', val:conAlertas, c:'#b45309' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.c }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
          <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Por perfil productivo</h3>
          {perPerfil.map(({ perfil, count }) => (
            <div key={perfil} style={{ display:'grid', gridTemplateColumns:'130px 1fr 32px', gap:8, alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:12, color:'#475569' }}>{perfil}</span>
              <div style={{ height:8, background:'#e2e8f0', borderRadius:99 }}>
                <div style={{ width:`${Math.round((count/total)*100)}%`, height:'100%', borderRadius:99, background:COLOR }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:COLOR, textAlign:'right' }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
          <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Por municipio</h3>
          {perMuni.map(({ muni, count }) => (
            <div key={muni} style={{ display:'grid', gridTemplateColumns:'130px 1fr 32px', gap:8, alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:12, color:'#475569' }}>{muni}</span>
              <div style={{ height:8, background:'#e2e8f0', borderRadius:99 }}>
                <div style={{ width:`${Math.round((count/total)*100)}%`, height:'100%', borderRadius:99, background:'#0ea5e9' }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'#0ea5e9', textAlign:'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = ['Padrón','Dashboard'];

export default function GestionBeneficiariosPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Padrón');
  const [ficha, setFicha] = useState(null);
  const [qr, setQR] = useState(null);
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Padrón de Beneficiarios</span>
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
      {tab === 'Padrón'     && <TabPadron beneficiarios={BENEFICIARIOS} onVerFicha={setFicha} onVerQR={setQR} showToast={showToast} />}
      {tab === 'Dashboard'  && <TabDashboard beneficiarios={BENEFICIARIOS} />}
      {ficha && (
        <Modal title={`Ficha 360 — ${ficha.nombre}`} onClose={() => setFicha(null)} wide>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['Cédula',ficha.cedula],['Nombre completo',ficha.nombre],['Municipio',ficha.municipio],['Perfil productivo',ficha.perfil],['Etnia',ficha.etnia],['Condición especial',ficha.condicion],['Último seguimiento',ficha.seguimiento],['Consentimiento HD',ficha.consentimiento?'Firmado':'Pendiente']].map(([l,v]) => (
              <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'8px 12px' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, padding:14, background:'#eff6ff', borderRadius:10, border:'1px solid #bfdbfe' }}>
            <div style={{ fontSize:12, fontWeight:700, color:COLOR, marginBottom:6 }}>Historial de interacciones (demo)</div>
            {['2024-11-28 — Visita de seguimiento en municipio','2024-10-15 — Taller BPA Módulo 1','2024-09-05 — Registro inicial en plataforma'].map((e,i) => (
              <div key={i} style={{ fontSize:12, color:'#475569', padding:'4px 0', borderBottom:'1px solid #e2e8f0' }}>{e}</div>
            ))}
          </div>
        </Modal>
      )}
      {qr && <QRCard ben={qr} onClose={() => setQR(null)} />}
      <Toast {...toast} />
    </div>
  );
}
