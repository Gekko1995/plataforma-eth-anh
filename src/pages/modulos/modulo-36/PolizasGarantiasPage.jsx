import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#6D28D9';
const META  = modulos.find(m => m.id === 36);

const HOY = new Date('2024-12-05');
const diasRestantes = (f) => Math.floor((new Date(f) - HOY) / 86400000);

const fmt = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(n);

const POLIZAS = [
  { id:'POL-001', tipo:'Cumplimiento',         aseguradora:'Seguros Bolívar', valor_asegurado:640000000, inicio:'2024-01-15', vencimiento:'2025-01-15', estado:'Vigente',   m22_bloqueado:false },
  { id:'POL-002', tipo:'Manejo buen uso',       aseguradora:'Allianz Colombia',valor_asegurado:320000000, inicio:'2024-01-15', vencimiento:'2024-12-20', estado:'Por vencer',m22_bloqueado:false },
  { id:'POL-003', tipo:'Calidad del servicio',  aseguradora:'Seguros Bolívar', valor_asegurado:160000000, inicio:'2024-01-15', vencimiento:'2024-12-30', estado:'Por vencer',m22_bloqueado:false },
  { id:'POL-004', tipo:'Responsabilidad civil', aseguradora:'Sura',            valor_asegurado:200000000, inicio:'2024-01-15', vencimiento:'2024-12-08', estado:'Crítica',   m22_bloqueado:true  },
  { id:'POL-005', tipo:'SOAT vehículo',         aseguradora:'Seguros del Estado',valor_asegurado:0,       inicio:'2024-03-01', vencimiento:'2025-03-01', estado:'Vigente',   m22_bloqueado:false },
];

const semaforo = (f) => {
  const d = diasRestantes(f);
  if (d < 0)  return { label:'Vencida', c:'#dc2626', bg:'#fee2e2', shape:'triangle' };
  if (d <= 15) return { label:'Crítica', c:'#dc2626', bg:'#fee2e2', shape:'triangle' };
  if (d <= 30) return { label:'Por vencer', c:'#b45309', bg:'#fef9c3', shape:'square' };
  return { label:'Vigente', c:'#15803d', bg:'#dcfce7', shape:'circle' };
};

function Shape({ tipo, c }) {
  if (tipo==='circle')   return <span style={{ width:10, height:10, borderRadius:'50%', background:c, display:'inline-block' }}/>;
  if (tipo==='square')   return <span style={{ width:10, height:10, borderRadius:2,     background:c, display:'inline-block' }}/>;
  return <span style={{ width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderBottom:`10px solid ${c}`, display:'inline-block' }}/>;
}

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#ede9fe', color:'#6d28d9', border:'1px solid #ddd6fe', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#3b0764' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#6d28d9', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#ede9fe', color:'#6d28d9', border:'1px solid #ddd6fe', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabPolizas({ showToast }) {
  const criticas = POLIZAS.filter(p => { const d = diasRestantes(p.vencimiento); return d <= 15; });
  const bloqueaM22 = POLIZAS.filter(p => p.m22_bloqueado).length > 0;
  return (
    <div>
      {criticas.length > 0 && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 16px', marginBottom:10, fontSize:13, fontWeight:700, color:'#7f1d1d' }}>
          ⚠ {criticas.length} póliza(s) crítica(s) (≤15 días) — renovación urgente requerida
        </div>
      )}
      {bloqueaM22 && (
        <div style={{ background:'#f1f5f9', border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 16px', marginBottom:14, fontSize:13, fontWeight:700, color:'#475569' }}>
          🔒 Póliza vencida bloquea pagos en M22 (Gestión Financiera)
        </div>
      )}
      <button onClick={()=>showToast('Póliza registrada (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        + Registrar póliza
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14, marginBottom:24 }}>
        {POLIZAS.map(p => {
          const s = semaforo(p.vencimiento);
          const dias = diasRestantes(p.vencimiento);
          return (
            <div key={p.id} style={{ background:'#fff', border:`2px solid ${s.c}44`, borderRadius:12, padding:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:800, color:COLOR }}>{p.id}</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, background:s.bg, color:s.c, borderRadius:6, padding:'2px 8px' }}>
                  <Shape tipo={s.shape} c={s.c} /> {s.label}
                </span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginBottom:4 }}>{p.tipo}</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:10 }}>{p.aseguradora}</div>
              {p.valor_asegurado > 0 && <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginBottom:8 }}>{fmt(p.valor_asegurado)}</div>}
              <div style={{ fontSize:12, color:s.c, fontWeight:700 }}>
                Vence: {p.vencimiento} ({dias > 0 ? `${dias} días` : `${Math.abs(dias)}d vencida`})
              </div>
              {dias <= 30 && (
                <button onClick={()=>showToast(`${p.id} renovada (demo)`)} style={{ marginTop:10, width:'100%', padding:'6px 0', borderRadius:7, background:COLOR, color:'#fff', border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Renovar póliza →
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['ID','Tipo','Aseguradora','Valor asegurado','Vencimiento','Días rest.','Estado','M22'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {POLIZAS.map(p => {
              const s = semaforo(p.vencimiento);
              const dias = diasRestantes(p.vencimiento);
              return (
                <tr key={p.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{p.id}</td>
                  <td style={{...TD, fontWeight:500}}>{p.tipo}</td>
                  <td style={TD}>{p.aseguradora}</td>
                  <td style={TD}>{p.valor_asegurado > 0 ? fmt(p.valor_asegurado) : '—'}</td>
                  <td style={TD}>{p.vencimiento}</td>
                  <td style={{...TD, fontWeight:700, color:s.c}}>{dias > 0 ? dias : `(${Math.abs(dias)}d)`}</td>
                  <td style={TD}><span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, background:s.bg, color:s.c, borderRadius:6, padding:'2px 8px' }}><Shape tipo={s.shape} c={s.c} />{s.label}</span></td>
                  <td style={{...TD, textAlign:'center'}}>{p.m22_bloqueado ? <span style={{color:'#dc2626',fontWeight:700}}>🔒</span> : <span style={{color:'#15803d',fontWeight:700}}>✓</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Pólizas y Garantías'];

export default function PolizasGarantiasPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pólizas y Garantías');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Pólizas y Garantías</span>
      </div>
      <InfoBanner />
      <TabPolizas showToast={showToast} />
      <Toast {...toast} />
    </div>
  );
}
