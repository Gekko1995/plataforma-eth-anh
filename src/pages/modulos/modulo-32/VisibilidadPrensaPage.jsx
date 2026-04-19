import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';
import ModuloInfoBanner from '../../../components/ModuloInfoBanner';

const COLOR = '#059669';
const META  = modulos.find(m => m.id === 32);

const PIEZAS = [
  { id:'PZ-001', titulo:'Video institucional ETH 2024',     tipo:'Video',        canal:'YouTube',   fecha:'2024-10-15', alcance:12400, interacciones:890, aprobado:true },
  { id:'PZ-002', titulo:'Infografía beneficiarios Vichada', tipo:'Infografía',   canal:'Instagram', fecha:'2024-11-02', alcance:5600,  interacciones:342, aprobado:true },
  { id:'PZ-003', titulo:'Nota de prensa D3 ANH',            tipo:'Nota prensa',  canal:'Web',       fecha:'2024-11-20', alcance:3200,  interacciones:145, aprobado:true },
  { id:'PZ-004', titulo:'Reels mingas de trabajo',          tipo:'Reels',        canal:'Instagram', fecha:'2024-12-01', alcance:8900,  interacciones:1240,aprobado:true },
  { id:'PZ-005', titulo:'Brochure proyecto PDF',            tipo:'Brochure',     canal:'WhatsApp',  fecha:'2024-12-03', alcance:1200,  interacciones:89,  aprobado:false },
  { id:'PZ-006', titulo:'Álbum fotográfico campo dic',      tipo:'Fotografías',  canal:'Drive',     fecha:'2024-12-04', alcance:0,     interacciones:0,   aprobado:false },
];

const METRICAS = [
  { label:'Alcance total acumulado', val:'31.300', sub:'personas', c:'#059669' },
  { label:'Interacciones totales',   val:'2.706',  sub:'reacciones+comentarios', c:'#0891b2' },
  { label:'Piezas publicadas',       val:'4',      sub:'de 6 en producción', c:'#b45309' },
  { label:'Nota en medios externos', val:'2',      sub:'regionales digitales', c:'#7c3aed' },
];

const TIPO_COLOR = { 'Video':'#dc2626','Infografía':'#7c3aed','Nota prensa':'#0891b2','Reels':'#b45309','Brochure':'#1d4ed8','Fotografías':'#059669' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };


function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabBiblioteca({ showToast }) {
  const [filtro, setFiltro] = useState('Todos');
  const tipos = ['Todos',...new Set(PIEZAS.map(p=>p.tipo))];
  const filtered = filtro==='Todos' ? PIEZAS : PIEZAS.filter(p=>p.tipo===filtro);
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {tipos.map(t => (
          <button key={t} onClick={()=>setFiltro(t)} style={{ padding:'5px 12px', borderRadius:7, fontSize:12, fontWeight:600, border:`1px solid ${filtro===t?COLOR:'#e2e8f0'}`, background:filtro===t?COLOR+'18':'#fff', color:filtro===t?COLOR:'#475569', cursor:'pointer' }}>{t}</button>
        ))}
        <button onClick={()=>showToast('Pieza registrada (demo)')} style={{ marginLeft:'auto', padding:'5px 12px', borderRadius:7, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Subir pieza
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {filtered.map(p => {
          const tc = TIPO_COLOR[p.tipo] || '#475569';
          return (
            <div key={p.id} style={{ background:'#fff', border:`1px solid ${p.aprobado?'#bbf7d0':'#e2e8f0'}`, borderRadius:12, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, background:tc+'18', color:tc, borderRadius:5, padding:'2px 7px' }}>{p.tipo}</span>
                <span style={{ fontSize:11, fontWeight:700, background:p.aprobado?'#dcfce7':'#fef9c3', color:p.aprobado?'#15803d':'#b45309', borderRadius:5, padding:'2px 7px' }}>{p.aprobado?'Publicado':'Pendiente'}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'#1e293b', marginBottom:6, lineHeight:1.35 }}>{p.titulo}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginBottom:10 }}>{p.canal} · {p.fecha}</div>
              {p.aprobado && (
                <div style={{ display:'flex', gap:16, fontSize:12, color:'#64748b' }}>
                  <span>👁 {p.alcance.toLocaleString('es-CO')}</span>
                  <span>❤ {p.interacciones.toLocaleString('es-CO')}</span>
                </div>
              )}
              {!p.aprobado && (
                <button onClick={()=>showToast(`${p.id} aprobado (demo)`)} style={{ marginTop:8, width:'100%', padding:'5px 0', borderRadius:6, background:COLOR+'18', color:COLOR, border:`1px solid ${COLOR}44`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Aprobar →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabMetricas() {
  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom:24 }}>
        {METRICAS.map(m => (
          <div key={m.label} className="kpi-card">
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{m.label}</div>
            <div style={{ fontSize:24, fontWeight:900, color:m.c }}>{m.val}</div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:700 }}>Alcance por canal</h3>
        {[
          { canal:'Instagram', alcance:14500, color:'#b45309' },
          { canal:'YouTube',   alcance:12400, color:'#dc2626' },
          { canal:'Web',       alcance:3200,  color:'#0891b2' },
          { canal:'WhatsApp',  alcance:1200,  color:'#15803d' },
        ].map(c => {
          const pct = Math.round((c.alcance/14500)*100);
          return (
            <div key={c.canal} style={{ display:'grid', gridTemplateColumns:'120px 1fr 80px', gap:10, alignItems:'center', marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{c.canal}</span>
              <div style={{ height:10, background:'#e2e8f0', borderRadius:99 }}>
                <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:c.color }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:c.color, textAlign:'right' }}>{c.alcance.toLocaleString('es-CO')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ['Biblioteca de Piezas','Métricas de Impacto'];

export default function VisibilidadPrensaPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Biblioteca de Piezas');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Visibilidad y Prensa</span>
      </div>
      <ModuloInfoBanner meta={META} color={COLOR} />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Biblioteca de Piezas' && <TabBiblioteca showToast={showToast} />}
      {tab === 'Métricas de Impacto'  && <TabMetricas />}
      <Toast {...toast} />
    </div>
  );
}
