import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#059669';
const META  = modulos.find(m => m.id === 30);

const EVENTOS = [
  { id:'EV-001', titulo:'Taller diagnóstico comunitario', tipo:'Taller',      fecha:'2024-12-10', hora:'09:00', lugar:'Resguardo Sikuani', municipio:'Puerto Gaitán', asistentes_esperados:45, confirmados:38, qr:'QR-001' },
  { id:'EV-002', titulo:'Reunión CIPRUNNA CDA',           tipo:'Reunión',     fecha:'2024-12-12', hora:'14:00', lugar:'Sede CDA Inírida',  municipio:'Inírida',      asistentes_esperados:15, confirmados:12, qr:'QR-002' },
  { id:'EV-003', titulo:'Capacitación SIG básico',        tipo:'Capacitación',fecha:'2024-12-16', hora:'08:00', lugar:'Casa comunal',      municipio:'Vichada',      asistentes_esperados:30, confirmados:27, qr:'QR-003' },
  { id:'EV-004', titulo:'Jornada de campo parcela 3',     tipo:'Campo',       fecha:'2024-12-18', hora:'06:00', lugar:'Finca La Esperanza',municipio:'Mapiripán',    asistentes_esperados:8,  confirmados:8,  qr:'QR-004' },
  { id:'EV-005', titulo:'Comité técnico mensual',         tipo:'Comité',      fecha:'2025-01-08', hora:'10:00', lugar:'Sala virtual Zoom', municipio:'Bogotá',       asistentes_esperados:12, confirmados:0,  qr:'QR-005' },
  { id:'EV-006', titulo:'Mingas de trabajo colectivo',    tipo:'Minga',       fecha:'2025-01-15', hora:'07:00', lugar:'Comunidad Wacoyo',  municipio:'Puerto Gaitán',asistentes_esperados:60, confirmados:0,  qr:'QR-006' },
];

const ASISTENCIAS = [
  { evento:'EV-001', nombre:'Carlos Pérez',    doc:'12345678', ingreso:'09:05', metodo:'QR' },
  { evento:'EV-001', nombre:'Ana Gómez',       doc:'87654321', ingreso:'09:12', metodo:'QR' },
  { evento:'EV-001', nombre:'Luis Torres',     doc:'11223344', ingreso:'09:08', metodo:'Manual' },
  { evento:'EV-002', nombre:'Pedro Ortiz',     doc:'55667788', ingreso:'14:03', metodo:'QR' },
  { evento:'EV-002', nombre:'María Ruiz',      doc:'99887766', ingreso:'14:15', metodo:'QR' },
];

const TIPO_COLOR = { 'Taller':'#7c3aed','Reunión':'#1d4ed8','Capacitación':'#0891b2','Campo':'#059669','Comité':'#b45309','Minga':'#dc2626' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#14532d' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#15803d', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

function TabCalendario({ showToast }) {
  const [sel, setSel] = useState(null);
  const ev = sel ? EVENTOS.find(e=>e.id===sel) : null;
  return (
    <div style={{ display:'grid', gridTemplateColumns: ev ? '1fr 300px' : '1fr', gap:20 }}>
      <div>
        <button onClick={()=>showToast('Evento creado (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Nuevo evento
        </button>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {EVENTOS.map(e => {
            const tc = TIPO_COLOR[e.tipo] || '#475569';
            const pct = e.confirmados > 0 ? Math.round((e.confirmados/e.asistentes_esperados)*100) : 0;
            return (
              <div key={e.id} onClick={() => setSel(e.id===sel?null:e.id)} style={{ background:'#fff', border:`2px solid ${e.id===sel?COLOR:'#e2e8f0'}`, borderRadius:12, padding:16, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, background:tc+'18', color:tc, borderRadius:5, padding:'2px 7px' }}>{e.tipo}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:'#1e293b' }}>{e.titulo}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:COLOR }}>{e.fecha} {e.hora}</span>
                </div>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>📍 {e.lugar} · {e.municipio}</div>
                {e.confirmados > 0 && (
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:3 }}>
                      <span>Confirmados {e.confirmados}/{e.asistentes_esperados}</span><span style={{ fontWeight:700, color:pct>=80?'#15803d':COLOR }}>{pct}%</span>
                    </div>
                    <div style={{ height:5, background:'#e2e8f0', borderRadius:99 }}>
                      <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:pct>=80?'#10b981':COLOR }}/>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {ev && (
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:18, alignSelf:'start' }}>
          <h3 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>{ev.titulo}</h3>
          <div style={{ background:'#f0fdf4', borderRadius:10, padding:14, marginBottom:14, textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:4 }}>▣</div>
            <div style={{ fontSize:11, fontFamily:'monospace', color:COLOR, fontWeight:700 }}>{ev.qr}</div>
            <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>QR registro asistencia</div>
          </div>
          {[['Fecha',ev.fecha],['Hora',ev.hora],['Lugar',ev.lugar],['Municipio',ev.municipio],['Esperados',ev.asistentes_esperados],['Confirmados',ev.confirmados]].map(([k,v])=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'5px 0', borderBottom:'1px solid #f1f5f9' }}>
              <span style={{ color:'#94a3b8', fontWeight:600 }}>{k}</span>
              <span style={{ color:'#1e293b', fontWeight:500 }}>{v}</span>
            </div>
          ))}
          <button onClick={()=>showToast(`Lista asistencia ${ev.id} exportada (demo)`)} style={{ marginTop:14, width:'100%', padding:'7px 0', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Exportar lista asistencia
          </button>
        </div>
      )}
    </div>
  );
}

function TabAsistencia({ showToast }) {
  return (
    <div>
      <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#15803d', fontWeight:600 }}>
        ▣ Escanea el código QR del evento para registrar asistencia automáticamente
      </div>
      <button onClick={()=>showToast('Asistencia registrada por QR (demo)')} style={{ marginBottom:16, padding:'7px 14px', borderRadius:8, background:COLOR, color:'#fff', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        Simular escaneo QR
      </button>
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Evento','Nombre','Documento','Hora ingreso','Método'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {ASISTENCIAS.map((a,i) => (
              <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{...TD, fontFamily:'monospace', fontSize:11, fontWeight:700, color:COLOR}}>{a.evento}</td>
                <td style={{...TD, fontWeight:600, color:'#1e293b'}}>{a.nombre}</td>
                <td style={{...TD, fontFamily:'monospace', fontSize:11}}>{a.doc}</td>
                <td style={TD}>{a.ingreso}</td>
                <td style={TD}><span style={{ fontSize:11, fontWeight:700, background:a.metodo==='QR'?'#dcfce7':'#f1f5f9', color:a.metodo==='QR'?'#15803d':'#64748b', borderRadius:5, padding:'2px 7px' }}>{a.metodo}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = ['Calendario de Eventos','Registro Asistencia'];

export default function AgendaTerritorialPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Calendario de Eventos');
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
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Agenda Territorial</span>
      </div>
      <InfoBanner />
      <div style={{ display:'flex', gap:0, borderBottom:'2px solid #e2e8f0', marginBottom:24 }} role="tablist">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} style={{ background:'none', border:'none', cursor:'pointer', padding:'10px 20px', fontSize:13, fontWeight:600, color:tab===t?COLOR:'#64748b', borderBottom:`2px solid ${tab===t?COLOR:'transparent'}`, marginBottom:-2 }}>{t}</button>)}
      </div>
      {tab === 'Calendario de Eventos' && <TabCalendario showToast={showToast} />}
      {tab === 'Registro Asistencia'   && <TabAsistencia showToast={showToast} />}
      <Toast {...toast} />
    </div>
  );
}
