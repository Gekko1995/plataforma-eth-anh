import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../../../data/modulos';

const COLOR = '#7C3AED';
const META  = modulos.find(m => m.id === 11);

const ETNIAS = ['Mestizo','Indígena Sikuani','Indígena Wayúu','Indígena Emberá','Afrodescendiente','Raizal'];
const IDIOMAS = ['Español','Sikuani','Wayuunaiki','Emberá','Español/Palenquero'];

const CATALOGO = [
  { id:'cc1', nombre:'Gestión Territorial y Autonomía Comunitaria',       etnia:'Indígena Sikuani',     idioma:'Sikuani',     duracion:'10h', estado:'Disponible', matriculados:45 },
  { id:'cc2', nombre:'Derechos Territoriales y Consulta Previa',          etnia:'Todos',                idioma:'Español',     duracion:'8h',  estado:'Disponible', matriculados:120 },
  { id:'cc3', nombre:'Semillas Nativas y Soberanía Alimentaria',          etnia:'Indígena Emberá',      idioma:'Emberá',      duracion:'12h', estado:'Disponible', matriculados:28 },
  { id:'cc4', nombre:'Economía Propia Wayúu — Artesanías y Mercado',      etnia:'Indígena Wayúu',       idioma:'Wayuunaiki',  duracion:'14h', estado:'Disponible', matriculados:62 },
  { id:'cc5', nombre:'Agricultura Agroecológica para Comunidades',        etnia:'Todos',                idioma:'Español',     duracion:'16h', estado:'Disponible', matriculados:89 },
  { id:'cc6', nombre:'Cultura Afro y Emprendimiento Pacífico',            etnia:'Afrodescendiente',     idioma:'Español/Palenquero', duracion:'10h', estado:'En construcción', matriculados:0 },
  { id:'cc7', nombre:'Gobernanza del Agua en Territorios Ancestrales',    etnia:'Indígena Sikuani',     idioma:'Sikuani',     duracion:'8h',  estado:'Disponible', matriculados:33 },
  { id:'cc8', nombre:'Resolución Pacífica de Conflictos Comunitarios',    etnia:'Todos',                idioma:'Español',     duracion:'6h',  estado:'Disponible', matriculados:74 },
];

const COMUNIDADES = [
  { id:'cm1', nombre:'Resguardo El Vigía',        municipio:'Arauca',          etnia:'Indígena Sikuani',  activos:28, total:35, ultimo_acceso:'2024-11-30', diasSin:5  },
  { id:'cm2', nombre:'Comunidad La Esperanza',    municipio:'Yopal',           etnia:'Mestizo',           activos:62, total:70, ultimo_acceso:'2024-12-01', diasSin:4  },
  { id:'cm3', nombre:'Ranchería Los Wayúu',        municipio:'Manaure',         etnia:'Indígena Wayúu',   activos:12, total:45, ultimo_acceso:'2024-10-20', diasSin:46 },
  { id:'cm4', nombre:'Cabildo Río Baudó',          municipio:'Alto Baudó',      etnia:'Indígena Emberá',  activos:19, total:22, ultimo_acceso:'2024-11-28', diasSin:7  },
  { id:'cm5', nombre:'Consejo Comunitario Tumaco', municipio:'Tumaco',          etnia:'Afrodescendiente', activos:41, total:50, ultimo_acceso:'2024-12-02', diasSin:3  },
  { id:'cm6', nombre:'Vereda San Isidro',          municipio:'Puerto Rico',     etnia:'Mestizo',          activos:8,  total:18, ultimo_acceso:'2024-10-01', diasSin:65 },
  { id:'cm7', nombre:'Resguardo Caño Mochuelo',    municipio:'Paz de Ariporo',  etnia:'Indígena Sikuani', activos:22, total:28, ultimo_acceso:'2024-11-15', diasSin:20 },
  { id:'cm8', nombre:'Comunidad Raizal San Andrés',municipio:'San Andrés',      etnia:'Raizal',           activos:15, total:15, ultimo_acceso:'2024-12-03', diasSin:2  },
];

const ETNIA_COLOR = { 'Mestizo':'#64748b', 'Indígena Sikuani':'#10b981', 'Indígena Wayúu':'#f59e0b', 'Indígena Emberá':'#0ea5e9', 'Afrodescendiente':'#8b5cf6', 'Raizal':'#ec4899' };

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconX    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconBell = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

const TH = { textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const TD = { padding:'9px 12px', fontSize:13, color:'#475569' };

function InfoBanner() {
  if (!META) return null;
  return (
    <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, background:'#ede9fe', color:'#5b21b6', border:'1px solid #ddd6fe', borderRadius:999, padding:'2px 9px', letterSpacing:'.05em', textTransform:'uppercase' }}>DEMO</span>
        <span style={{ fontSize:14, fontWeight:700, color:'#4c1d95' }}>Módulo {META.id} — {META.nombre}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:'#5b21b6', lineHeight:1.55 }}>{META.descripcion}</p>
      {META.puntosClave?.length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {META.puntosClave.map((p,i) => <span key={i} style={{ fontSize:11, background:'#ede9fe', color:'#5b21b6', border:'1px solid #ddd6fe', borderRadius:6, padding:'2px 8px' }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, ok }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:20, right:20, zIndex:1200, padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, background:ok?'#f0fdf4':'#fee2e2', color:ok?'#15803d':'#dc2626', border:`1px solid ${ok?'#86efac':'#fca5a5'}`, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}>{ok?'✓ ':'✗ '}{msg}</div>;
}

// ── Tab Catálogo ───────────────────────────────────────────────────────
function TabCatalogo({ showToast }) {
  const [filtro, setFiltro] = useState('Todos');
  const filtrados = CATALOGO.filter(c => filtro === 'Todos' || c.etnia === filtro || c.etnia === 'Todos');

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {['Todos',...ETNIAS].map(e => {
          const c = ETNIA_COLOR[e] || COLOR;
          const sel = filtro === e;
          return (
            <button key={e} onClick={() => setFiltro(e)} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${sel?c:'#e2e8f0'}`, background:sel?c:'transparent', color:sel?'#fff':'#475569', fontSize:11, fontWeight:600, cursor:'pointer' }}>
              {e}
            </button>
          );
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {filtrados.map(c => {
          const ec = ETNIA_COLOR[c.etnia] || COLOR;
          const disponible = c.estado === 'Disponible';
          return (
            <div key={c.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16, opacity:disponible?1:0.7 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, background:ec+'18', color:ec, border:`1px solid ${ec}44`, borderRadius:6, padding:'2px 7px' }}>{c.etnia}</span>
                <span style={{ fontSize:11, color:disponible?'#15803d':'#94a3b8', fontWeight:600 }}>{c.estado}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginBottom:5, lineHeight:1.35 }}>{c.nombre}</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Idioma: <strong>{c.idioma}</strong> · {c.duracion}</div>
              <div style={{ fontSize:12, color:'#94a3b8', marginBottom:12 }}>{c.matriculados} matriculados</div>
              <button
                disabled={!disponible}
                onClick={() => showToast(`Curso "${c.nombre}" abierto (demo)`)}
                style={{ width:'100%', padding:'7px 0', borderRadius:8, background:disponible?COLOR:'#e2e8f0', color:disponible?'#fff':'#94a3b8', border:'none', fontSize:12, fontWeight:700, cursor:disponible?'pointer':'default' }}>
                {disponible?'Acceder →':'En construcción'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Acceso ─────────────────────────────────────────────────────────
function TabAcceso() {
  const ALERTA_DIAS = 15;
  const alertas = COMUNIDADES.filter(c => c.diasSin >= ALERTA_DIAS);

  return (
    <div>
      {alertas.length > 0 && (
        <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <IconBell />
          <span style={{ fontSize:13, fontWeight:700, color:'#9a3412' }}>{alertas.length} comunidad(es) sin acceso por más de {ALERTA_DIAS} días</span>
        </div>
      )}
      <div className="table-wrapper">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            {['Comunidad','Municipio','Etnia','Activos / Total','Último acceso','Días sin actividad'].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {COMUNIDADES.sort((a,b)=>b.diasSin-a.diasSin).map(c => {
              const ec = ETNIA_COLOR[c.etnia] || '#64748b';
              const pct = Math.round((c.activos/c.total)*100);
              const alerta = c.diasSin >= ALERTA_DIAS;
              return (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9', background:alerta?'#fff7ed':'transparent' }}>
                  <td style={{...TD,fontWeight:600,color:'#1e293b'}}>{c.nombre}</td>
                  <td style={TD}>{c.municipio}</td>
                  <td style={TD}><span style={{ fontSize:11, background:ec+'18', color:ec, border:`1px solid ${ec}44`, borderRadius:6, padding:'2px 7px', fontWeight:600 }}>{c.etnia}</span></td>
                  <td style={TD}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:60, height:6, background:'#e2e8f0', borderRadius:99 }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:pct>=70?'#10b981':pct>=40?COLOR:'#ef4444' }}/>
                      </div>
                      <span style={{ fontSize:11, color:'#64748b' }}>{c.activos}/{c.total}</span>
                    </div>
                  </td>
                  <td style={TD}>{c.ultimo_acceso}</td>
                  <td style={{...TD, color:alerta?'#dc2626':'#475569', fontWeight:alerta?700:400}}>
                    {c.diasSin}d {alerta && '⚠'}
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

const TABS = ['Catálogo Diferenciado','Acceso por Comunidad'];

export default function CampusComunidadesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Catálogo Diferenciado');
  const [toast, setToast] = useState({ msg:'', ok:true });

  function showToast(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 3500);
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('/modulos')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4, padding:'6px 8px', borderRadius:7, fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <IconBack /> Módulos
        </button>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ fontSize:14, fontWeight:700, color:COLOR }}>Campus Virtual Comunidades</span>
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

      {tab === 'Catálogo Diferenciado'  && <TabCatalogo showToast={showToast} />}
      {tab === 'Acceso por Comunidad'   && <TabAcceso />}

      <Toast {...toast} />
    </div>
  );
}
