import { useState, useEffect } from "react";

/* =====================================================================
   PLATAFORMA DE GESTION INTEGRADA — CONVENIO ETH-ANH 2026
   SINAPSIS3D S.A.S. para Fundacion WR Tejido Social
   =====================================================================

   MAPA DEL ARCHIVO — Busca estas secciones para editar:

   SECCION 1 (linea ~15)   → USUARIOS: emails, contrasenas, roles
   SECCION 2 (linea ~35)   → MODULOS: nombres, URLs, estados, colores
   SECCION 3 (linea ~100)  → LOGIN: pantalla de inicio de sesion
   SECCION 4 (linea ~190)  → SIDEBAR: menu lateral izquierdo
   SECCION 5 (linea ~210)  → GRAFICAS: barras y gauge de avance
   SECCION 6 (linea ~250)  → DASHBOARD: KPIs, metricas, registro

   =====================================================================
   EDICIONES RAPIDAS:
   - Cambiar nombre/URL de un modulo → busca el modulo en SECCION 2
   - Agregar usuario de prueba → agrega linea en LOCAL_USERS (SECCION 1)
   - Cambiar logo "S3D" → busca "S3D" (aparece 2 veces)
   - Cambiar avance % → busca "value={12}" en el Gauge
   - Conectar Google Sheets → pega URL en APPS_SCRIPT_URL (SECCION 1)
   ===================================================================== */


/* =====================================================================
   SECCION 1: CONFIGURACION DE USUARIOS Y LOGIN
   =====================================================================
   - APPS_SCRIPT_URL: cuando configures Google Sheets, pega la URL aqui
   - LOCAL_USERS: usuarios de prueba (solo funcionan si APPS_SCRIPT_URL
     esta vacio). Para agregar uno, copia el formato de abajo.
   ===================================================================== */

// >>> PEGA AQUI TU URL DE GOOGLE APPS SCRIPT <<<
// Ejemplo: const APPS_SCRIPT_URL = "https://script.google.com/macros/s/ABC123/exec";
const APPS_SCRIPT_URL = "";

// >>> USUARIOS DE PRUEBA — agrega o quita los que necesites <<<
const LOCAL_USERS = [
  { email: "admin@sinapsis3d.com", password: "admin2026", rol: "admin", nombre: "Administrador S3D" },
  { email: "coordinador@fwrts.org", password: "coord2026", rol: "coordinador", nombre: "Coordinador ETH" },
  { email: "profesional@convenio.com", password: "prof2026", rol: "profesional", nombre: "Prof. Campo" },
];

// Funcion de login — NO MODIFICAR
// Verifica email y contrasena contra Google Sheets o usuarios locales
async function authUser(email, password) {
  if (APPS_SCRIPT_URL) {
    try {
      const r = await fetch(`${APPS_SCRIPT_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const d = await r.json();
      return d.success ? { ok: true, user: d.user } : { ok: false, error: d.error || "Credenciales incorrectas" };
    } catch { return { ok: false, error: "Error de conexion" }; }
  }
  const f = LOCAL_USERS.find(u => u.email === email && u.password === password);
  return f ? { ok: true, user: { email: f.email, nombre: f.nombre, rol: f.rol } } : { ok: false, error: "Email o contrasena incorrectos" };
}

// Guarda registro cada vez que alguien entra o accede a un modulo
function addLog(user, mod) {
  const log = JSON.parse(localStorage.getItem("eth_log") || "[]");
  log.unshift({ user: user.email, nombre: user.nombre, rol: user.rol, modulo: mod, ts: new Date().toISOString() });
  localStorage.setItem("eth_log", JSON.stringify(log.slice(0, 300)));
}

/* =====================================================================
   SECCION 2: LOS 39 MODULOS DEL CONVENIO
   =====================================================================
   COMO EDITAR UN MODULO:
   - name: "texto"     → Cambiar el nombre que se muestra
   - desc: "texto"     → Cambiar la descripcion corta
   - url: "https://..."→ Poner la URL real del Google Sheet/Form/Moodle
   - status: "nuevo"   → Opciones: "nuevo" (azul), "adaptar" (amarillo),
                          "reutilizar" (verde)
   - stack: "X+Y"      → Herramientas que usa (solo informativo)

   PARA AGREGAR UN MODULO: copia una linea y cambia id (usa 40, 41...)
   PARA QUITAR UN MODULO: borra la linea completa

   COLORES DE GRUPO: cambia el valor de "color" (codigo hex)
   Busca colores en Google: "hex color picker"
   ===================================================================== */

// ── GRUPO A: Diagnostico y Territorio (verde #1B6B4A) ──
const GROUPS = [
  { id:"A", name:"Diagnostico y Territorio", color:"#1B6B4A", icon:"A", modules:[
    { id:1, name:"Linea diagnostica territorial", desc:"Caracterizacion socioeconomica y ambiental", stack:"Sheets+Forms+Looker", status:"nuevo", url:"#" },
    { id:2, name:"Lineas base e impacto", desc:"KPIs cadena valor DNP. Medicion brechas", stack:"Sheets+Looker", status:"nuevo", url:"#" },
    { id:3, name:"Georeferenciacion y mapeo", desc:"Google Maps + Looker. Capas E&P, CARs, PDET", stack:"Looker+Maps", status:"adaptar", url:"#" },
    { id:4, name:"Cluster productivo", desc:"Mercado, exportables, TLC, vocacion productiva", stack:"Sheets+Forms", status:"nuevo", url:"#" },
    { id:5, name:"Recabo info campo", desc:"Fichas producto, encuestas, fitosanitarios", stack:"Forms+Sheets", status:"nuevo", url:"#" },
  ]},
  { id:"B", name:"Nucleo Estrategico ANH", color:"#B45309", icon:"B", modules:[
    { id:6, name:"Lineamientos ambientales", desc:"Planes CARs. Estudios E&P. Repositorio", stack:"Sheets+Drive+Looker", status:"adaptar", url:"#" },
    { id:7, name:"Inversion social territorial", desc:"Iniciativas. Actas/fotos. Diversificacion", stack:"Sheets+Forms+Looker", status:"reutilizar", url:"#" },
    { id:8, name:"Conflictividad y dialogo", desc:"Alertas SLA. 4 lineas ETH. Acuerdos", stack:"Sheets+Looker", status:"adaptar", url:"#" },
    { id:9, name:"Marco logico proyectos", desc:"Arbol problemas. MGA-DNP. Gantt", stack:"Sheets+Forms", status:"nuevo", url:"#" },
  ]},
  { id:"C", name:"Formacion y Capacitacion", color:"#7C3AED", icon:"C", modules:[
    { id:10, name:"Moodle — Beneficiarios", desc:"Cursos productivos, emprendimiento, certificaciones", stack:"Moodle LMS", status:"adaptar", url:"#" },
    { id:11, name:"Moodle — Comunidades", desc:"Derechos, participacion, medio ambiente", stack:"Moodle LMS", status:"nuevo", url:"#" },
    { id:12, name:"Moodle — Personal convenio", desc:"Induccion ETH, protocolos, HSE", stack:"Moodle LMS", status:"adaptar", url:"#" },
    { id:13, name:"Cluster exportacion", desc:"Planes negocio, ferias internacionales", stack:"Sheets+Forms+Drive", status:"nuevo", url:"#" },
  ]},
  { id:"D", name:"Actores y Talento Humano", color:"#0369A1", icon:"D", modules:[
    { id:14, name:"Gestion beneficiarios", desc:"Registro, consentimientos, segmentacion", stack:"Sheets+Forms+Looker", status:"reutilizar", url:"#" },
    { id:15, name:"Directorio actores", desc:"Operadoras, comunidades, autoridades", stack:"Sheets+Looker", status:"nuevo", url:"#" },
    { id:16, name:"Enfoque diferencial", desc:"Protocolos etnicos. Consulta previa", stack:"Sheets+Forms+Drive", status:"nuevo", url:"#" },
    { id:17, name:"Seleccion hojas de vida", desc:"CVs. Evaluacion perfiles. Calificacion", stack:"Forms+Sheets", status:"nuevo", url:"#" },
    { id:18, name:"Gestion personal", desc:"Equipo, seguridad social, salarios", stack:"Sheets+Looker", status:"adaptar", url:"#" },
    { id:19, name:"Entidades aliadas", desc:"CARs 8 regiones. Estado alianzas", stack:"Sheets+Looker", status:"nuevo", url:"#" },
  ]},
  { id:"E", name:"Financiero y Gobernanza", color:"#DC2626", icon:"E", modules:[
    { id:20, name:"Admin y seguridad", desc:"Roles, permisos, auditoria, MFA", stack:"Script+Sheets", status:"reutilizar", url:"#" },
    { id:21, name:"Seguimiento y monitoreo", desc:"Hitos, % avance, semaforos", stack:"Sheets+Looker", status:"reutilizar", url:"#" },
    { id:22, name:"Gestion financiera", desc:"Presupuesto, desembolsos 20/30/40/10", stack:"Sheets+Looker", status:"nuevo", url:"#" },
    { id:23, name:"Cuentas de cobro", desc:"Radicacion, verificacion SS, aprobacion", stack:"Forms+Sheets+Script", status:"nuevo", url:"#" },
    { id:24, name:"Comite coordinacion", desc:"Sesiones mensuales. Actas. Quorum", stack:"Sheets+Drive", status:"nuevo", url:"#" },
    { id:25, name:"Contratacion ESAL", desc:"Subcontratos, TdR, minutas", stack:"Sheets+Drive", status:"nuevo", url:"#" },
    { id:26, name:"Gestion riesgos", desc:"CONPES 3714. Alertas. Mitigacion", stack:"Sheets+Looker", status:"nuevo", url:"#" },
  ]},
  { id:"F", name:"Informes y Rendicion", color:"#0891B2", icon:"F", modules:[
    { id:27, name:"Informes funcionarios", desc:"Radicacion > revision > aprobacion", stack:"Forms+Sheets+Drive", status:"nuevo", url:"#" },
    { id:28, name:"Informes ANH", desc:"Compilador 4 desembolsos automatico", stack:"Script+Sheets", status:"nuevo", url:"#" },
    { id:29, name:"Gestion conocimiento", desc:"Metodologias, casos exito, lecciones", stack:"Drive+Sheets+Moodle", status:"nuevo", url:"#" },
  ]},
  { id:"G", name:"Operacion Territorial", color:"#059669", icon:"G", modules:[
    { id:30, name:"Eventos y agenda", desc:"Talleres, foros, convocatoria, asistencia", stack:"Forms+Sheets+Looker", status:"nuevo", url:"#" },
    { id:31, name:"Logistica territorial", desc:"Transporte, alojamiento, refrigerios", stack:"Forms+Sheets", status:"nuevo", url:"#" },
    { id:32, name:"Comunicaciones", desc:"Piezas, campanas, presencia digital", stack:"Drive+Sheets", status:"nuevo", url:"#" },
    { id:33, name:"HSE seguridad y salud", desc:"Protocolos, incidentes, emergencias", stack:"Forms+Sheets", status:"nuevo", url:"#" },
  ]},
  { id:"H", name:"Documentacion y Cierre", color:"#6D28D9", icon:"H", modules:[
    { id:34, name:"Gestion documental", desc:"Drive jerarquico. Alertas. Gemini API", stack:"Drive+Script+Gemini", status:"reutilizar", url:"#" },
    { id:35, name:"Inventarios y bienes", desc:"Res. 0532/2024. Trazabilidad equipos", stack:"Sheets+Looker", status:"adaptar", url:"#" },
    { id:36, name:"Polizas y garantias", desc:"Cumplimiento, calidad, salarios. Vigencias", stack:"Sheets", status:"nuevo", url:"#" },
    { id:37, name:"Liquidacion y cierre", desc:"Checklist, acta, balance, paz y salvo", stack:"Sheets+Drive", status:"nuevo", url:"#" },
  ]},
  { id:"I", name:"Infraestructura TI", color:"#475569", icon:"I", modules:[
    { id:38, name:"Mesa de ayuda", desc:"Tickets SLA. FAQ. Soporte 24/7", stack:"Forms+Sheets+Looker", status:"reutilizar", url:"#" },
    { id:39, name:"Infraestructura cloud", desc:"Workspace. Backups. 99.5% SLA", stack:"Google Workspace", status:"adaptar", url:"#" },
  ]},
];

// Estados y sus colores — NO MODIFICAR a menos que quieras cambiar colores
const ST = { nuevo:{l:"Nuevo",bg:"#EFF6FF",c:"#1E40AF",d:"#3B82F6"}, adaptar:{l:"Adaptar",bg:"#FFFBEB",c:"#92400E",d:"#F59E0B"}, reutilizar:{l:"Reutilizar",bg:"#ECFDF5",c:"#065F46",d:"#10B981"} };
const total = GROUPS.reduce((a,g)=>a+g.modules.length,0);
const countSt = s => GROUPS.reduce((a,g)=>a+g.modules.filter(m=>m.status===s).length,0);

/* =====================================================================
   SECCION 3: PANTALLA DE LOGIN
   =====================================================================
   Lo que ven los usuarios ANTES de iniciar sesion.
   - Cambiar titulo: busca "Plataforma ETH-ANH" abajo
   - Cambiar logo: busca "S3D" abajo
   - Cambiar color del boton: busca "linear-gradient(135deg,#4F6EF7,#7C3AED)"
   ===================================================================== */

// ── Pantalla de Login ──
const Login = ({ onLogin, error, loading }) => {
  const [em,setEm]=useState(""); const [pw,setPw]=useState(""); const [show,setShow]=useState(false);
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0F1729 0%,#1a1f3a 50%,#0F1729 100%)",fontFamily:"'Bricolage Grotesque',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box} input::placeholder{color:#4a5280}
      `}</style>
      <div style={{width:"100%",maxWidth:400,padding:"0 20px",animation:"fadeIn .6s ease both"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#4F6EF7,#7C3AED)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",marginBottom:16,boxShadow:"0 12px 40px #4F6EF744"}}>S3D</div>
          <h1 style={{margin:"0 0 4px",fontSize:24,fontWeight:700,color:"#fff"}}>Plataforma ETH-ANH</h1>
          <p style={{margin:0,fontSize:13,color:"#6B7194",fontFamily:"'IBM Plex Mono',monospace"}}>Convenio 2026 — Gestion Integrada</p>
        </div>
        {!APPS_SCRIPT_URL && <div style={{background:"#F59E0B14",border:"1px solid #F59E0B33",borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:12,color:"#FCD34D",textAlign:"center"}}>Modo demo — Usa las cuentas de prueba</div>}
        <div style={{background:"#171C32",borderRadius:20,padding:"28px 24px",border:"1px solid #252B45"}}>
          {error && <div style={{background:"#DC262612",border:"1px solid #DC262633",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:13,color:"#F87171"}}>{error}</div>}
          <label style={{display:"block",marginBottom:14}}>
            <span style={{fontSize:11,fontWeight:600,color:"#6B7194",display:"block",marginBottom:5,fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:".06em"}}>Email</span>
            <input type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="tu@correo.com" style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1px solid #252B45",background:"#0F1729",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none"}} onFocus={e=>e.target.style.borderColor="#4F6EF7"} onBlur={e=>e.target.style.borderColor="#252B45"} />
          </label>
          <label style={{display:"block",marginBottom:22}}>
            <span style={{fontSize:11,fontWeight:600,color:"#6B7194",display:"block",marginBottom:5,fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:".06em"}}>Contrasena</span>
            <div style={{position:"relative"}}>
              <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" style={{width:"100%",padding:"11px 42px 11px 14px",borderRadius:10,border:"1px solid #252B45",background:"#0F1729",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none"}} onFocus={e=>e.target.style.borderColor="#4F6EF7"} onBlur={e=>e.target.style.borderColor="#252B45"} />
              <button type="button" onClick={()=>setShow(!show)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6B7194",cursor:"pointer",fontSize:12}}>{show?"Ocultar":"Ver"}</button>
            </div>
          </label>
          <button onClick={()=>onLogin(em,pw)} disabled={loading} style={{width:"100%",padding:"12px",borderRadius:12,background:loading?"#333":"linear-gradient(135deg,#4F6EF7,#7C3AED)",color:"#fff",fontSize:15,fontWeight:600,border:"none",cursor:loading?"wait":"pointer",fontFamily:"inherit",boxShadow:"0 6px 24px #4F6EF744",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading && <span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite",display:"inline-block"}}/>}
            {loading?"Verificando...":"Iniciar sesion"}
          </button>
        </div>
        {!APPS_SCRIPT_URL && <div style={{marginTop:16,padding:"12px 16px",background:"#171C32",borderRadius:14,border:"1px solid #252B45"}}>
          <p style={{margin:"0 0 6px",fontSize:10,color:"#6B7194",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase"}}>Cuentas demo:</p>
          {LOCAL_USERS.map(u=><div key={u.email} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <span style={{fontSize:11,color:"#8890A5",fontFamily:"'IBM Plex Mono',monospace"}}>{u.email}</span>
            <button onClick={()=>{setEm(u.email);setPw(u.password)}} style={{background:"#4F6EF718",border:"none",borderRadius:5,padding:"2px 8px",fontSize:10,color:"#7C8CFF",cursor:"pointer",fontWeight:600}}>Usar</button>
          </div>)}
        </div>}
      </div>
    </div>
  );
};

/* =====================================================================
   SECCION 4: SIDEBAR — Boton del menu lateral
   =====================================================================
   Cada boton del sidebar usa este componente. No necesitas modificarlo.
   ===================================================================== */

const NavItem = ({icon,label,active,onClick,badge}) => (
  <button onClick={onClick} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderRadius:12,border:"none",background:active?"#4F6EF7":"transparent",color:active?"#fff":"#8890A5",fontSize:13,fontWeight:active?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",position:"relative"}}>
    <span style={{fontSize:18,width:24,textAlign:"center"}}>{icon}</span>
    <span>{label}</span>
    {badge && <span style={{marginLeft:"auto",background:active?"#fff3":"#4F6EF722",color:active?"#fff":"#4F6EF7",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>{badge}</span>}
  </button>
);

/* =====================================================================
   SECCION 5: GRAFICAS — Barras y medidor de avance
   =====================================================================
   Componentes visuales. No necesitas modificarlos.
   ===================================================================== */

// Grafica de barras pequena
const MiniBarChart = ({data,color,height=100}) => {
  const max = Math.max(...data);
  const w = 100/data.length;
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((v,i)=>{
        const h = (v/max)*(height-10);
        return <rect key={i} x={i*w+1} y={height-h} width={w-2} height={h} rx={2} fill={color} opacity={i===data.length-1?1:0.5} />;
      })}
    </svg>
  );
};

// ── GAUGE ────────────────────────────────────────────────────────────────────
const Gauge = ({value,max,label,color}) => {
  const pct = value/max;
  const r=40; const circ=2*Math.PI*r; const dash=circ*pct*0.75;
  return (
    <div style={{textAlign:"center"}}>
      <svg width="110" height="80" viewBox="0 0 110 90">
        <path d="M 10 80 A 45 45 0 0 1 100 80" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 10 80 A 45 45 0 0 1 100 80" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{transition:"stroke-dasharray .8s ease"}}/>
        <text x="55" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1D2B" fontFamily="'Bricolage Grotesque',sans-serif">{value}%</text>
        <text x="55" y="78" textAnchor="middle" fontSize="10" fill="#8890A5" fontFamily="'IBM Plex Mono',monospace">{label}</text>
      </svg>
    </div>
  );
};

/* =====================================================================
   SECCION 6: APP PRINCIPAL — El dashboard completo
   =====================================================================
   Aqui se une todo: sidebar + header + paginas.
   
   PAGINAS: "home" = Dashboard | "modulos" = Los 39 modulos
            "metricas" = Graficas | "log" = Registro de accesos
   
   EDITAR:
   - Nombre plataforma: busca "ETH-ANH 2026" y "Gestion Integrada"
   - Logo: busca "S3D"
   - Avance %: busca "value={12}" en el Gauge
   - KPIs: busca el array con label/value/color/delta
   - Desembolsos: busca "D1", "D2", "D3", "D4" y cambia "p" (porcentaje)
   ===================================================================== */

export default function App() {
  const [user,setUser]=useState(null);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [page,setPage]=useState("home");
  const [sideOpen,setSideOpen]=useState(true);
  const [openG,setOpenG]=useState(["A"]);
  const [search,setSearch]=useState("");
  const [time,setTime]=useState(new Date());

  useEffect(()=>{
    const s=localStorage.getItem("eth_user"); if(s) setUser(JSON.parse(s));
    const t=setInterval(()=>setTime(new Date()),60000); return()=>clearInterval(t);
  },[]);

  const login=async(em,pw)=>{
    setLoading(true);setErr("");
    const r=await authUser(em,pw); setLoading(false);
    if(r.ok){const ud={...r.user,loginAt:new Date().toISOString()};setUser(ud);localStorage.setItem("eth_user",JSON.stringify(ud));addLog(ud,"LOGIN");}
    else setErr(r.error);
  };
  const logout=()=>{addLog(user,"LOGOUT");setUser(null);localStorage.removeItem("eth_user");};
  const togG=id=>setOpenG(p=>p.includes(id)?p.filter(g=>g!==id):[...p,id]);
  const logs=JSON.parse(localStorage.getItem("eth_log")||"[]");

  if(!user) return <Login onLogin={login} error={err} loading={loading}/>;

  const sl=search.toLowerCase();
  const greeting=time.getHours()<12?"Buenos dias":time.getHours()<18?"Buenas tardes":"Buenas noches";

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Bricolage Grotesque',sans-serif",background:"#F0F2F8"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        *{box-sizing:border-box;margin:0;padding:0} input::placeholder{color:#A0A5BD}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#CBD0E0;border-radius:3px}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{width:sideOpen?260:0,minHeight:"100vh",background:"#fff",borderRight:"1px solid #E8EBF2",display:"flex",flexDirection:"column",overflow:"hidden",transition:"width .3s ease",flexShrink:0}}>
        <div style={{padding:"22px 20px 16px",borderBottom:"1px solid #E8EBF2"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#4F6EF7,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff"}}>S3D</div>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:"#1A1D2B"}}>ETH-ANH 2026</p>
              <p style={{fontSize:10,color:"#8890A5",fontFamily:"'IBM Plex Mono',monospace"}}>Gestion Integrada</p>
            </div>
          </div>
        </div>

        <div style={{padding:"12px 12px 8px"}}>
          <p style={{fontSize:10,fontWeight:600,color:"#A0A5BD",padding:"0 8px 6px",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:".08em"}}>Menu</p>
          <NavItem icon="~" label="Dashboard" active={page==="home"} onClick={()=>setPage("home")} />
          <NavItem icon="#" label="Modulos" active={page==="modulos"} onClick={()=>setPage("modulos")} badge={total} />
          <NavItem icon="%" label="Metricas" active={page==="metricas"} onClick={()=>setPage("metricas")} />
          <NavItem icon="!" label="Registro accesos" active={page==="log"} onClick={()=>setPage("log")} badge={logs.length||null} />
        </div>

        <div style={{padding:"4px 12px"}}>
          <p style={{fontSize:10,fontWeight:600,color:"#A0A5BD",padding:"8px 8px 6px",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:".08em"}}>Grupos</p>
          {GROUPS.map(g=>(
            <NavItem key={g.id} icon={g.icon} label={`${g.id}. ${g.name}`} active={page==="grupo_"+g.id} onClick={()=>{setPage("modulos");setOpenG([g.id]);setTimeout(()=>document.getElementById("g-"+g.id)?.scrollIntoView({behavior:"smooth",block:"start"}),100);}} />
          ))}
        </div>

        <div style={{marginTop:"auto",padding:"16px 20px",borderTop:"1px solid #E8EBF2"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#4F6EF7,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700}}>{user.nombre.charAt(0)}</div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:13,fontWeight:600,color:"#1A1D2B",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.nombre}</p>
              <p style={{fontSize:10,color:"#8890A5",fontFamily:"'IBM Plex Mono',monospace"}}>{user.rol}</p>
            </div>
            <button onClick={logout} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#A0A5BD",padding:4}} title="Cerrar sesion">{"\u23FB"}</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Top bar */}
        <header style={{background:"#fff",borderBottom:"1px solid #E8EBF2",padding:"14px 28px",display:"flex",alignItems:"center",gap:16,justifyContent:"space-between",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8890A5"}}>{sideOpen?"\u2630":"\u2630"}</button>
            <div style={{position:"relative",minWidth:260}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#A0A5BD"}}>{"\u2315"}</span>
              <input type="text" placeholder="Buscar modulos..." value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setPage("modulos");}}
                style={{width:"100%",padding:"9px 14px 9px 36px",borderRadius:10,border:"1px solid #E8EBF2",background:"#F7F8FB",fontSize:13,fontFamily:"inherit",color:"#1A1D2B",outline:"none"}}
                onFocus={e=>e.target.style.borderColor="#4F6EF7"} onBlur={e=>e.target.style.borderColor="#E8EBF2"} />
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <span style={{fontSize:12,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace"}}>{time.toLocaleDateString("es-CO",{weekday:"short",day:"numeric",month:"short"})}</span>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:"#ECFDF5",borderRadius:20,fontSize:11,color:"#065F46",fontWeight:600}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#10B981",animation:"pulse 2s infinite"}}/> En linea
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,padding:"24px 28px",overflowY:"auto"}}>

          {/* ══ HOME PAGE ══ */}
          {page==="home" && (<div style={{animation:"fadeIn .4s ease both"}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#1A1D2B",marginBottom:4}}>{greeting}, {user.nombre}</h2>
            <p style={{fontSize:13,color:"#8890A5",marginBottom:24}}>Convenio ETH-ANH 2026 — Panel de control general</p>

            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
              {[
                {label:"Modulos totales",value:total,color:"#4F6EF7",delta:"+2 este mes"},
                {label:"Nuevos por construir",value:countSt("nuevo"),color:"#3B82F6",delta:"72% del total"},
                {label:"Adaptaciones",value:countSt("adaptar"),color:"#F59E0B",delta:"En progreso"},
                {label:"Reutilizables",value:countSt("reutilizar"),color:"#10B981",delta:"Listos"},
                {label:"Usuarios activos",value:"156",color:"#7C3AED",delta:"+12 esta semana"},
                {label:"Avance global",value:"12%",color:"#DC2626",delta:"Meta: 35%"},
              ].map((k,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:16,padding:"18px 20px",border:"1px solid #E8EBF2",animation:`fadeIn .35s ease ${.1+i*.06}s both`}}>
                  <p style={{fontSize:11,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>{k.label}</p>
                  <p style={{fontSize:30,fontWeight:800,color:k.color,lineHeight:1}}>{k.value}</p>
                  <p style={{fontSize:11,color:"#8890A5",marginTop:4}}>{k.delta}</p>
                </div>
              ))}
            </div>

             {/* === LOOKER STUDIO EMBEBIDO === */}
               {/* Cambia la URL por la de tu reporte Looker */}
               <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",border:"1px solid #E8EBF2",marginBottom:14}}>
              <p style={{fontSize:14,fontWeight:600,marginBottom:14}}>Reporte Looker Studio</p>
                 <iframe
                   src="https://lookerstudio.google.com/embed/reporting/2b97e06b-d56f-4f2a-ac73-84942060d75e/page/rzP6E"
                   width="100%"
                   height="450"
                   style={{border:"none",borderRadius:8}}
                   allowFullScreen
                 />
               </div>


             

             
            {/* Charts row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 300px",gap:14,marginBottom:24}}>
              {/* Bar chart - modules by group */}
              <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",border:"1px solid #E8EBF2",gridColumn:"span 1"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                  <div><p style={{fontSize:14,fontWeight:600,color:"#1A1D2B"}}>Modulos por grupo</p><p style={{fontSize:11,color:"#A0A5BD"}}>Distribucion de los 39 modulos</p></div>
                </div>
                <MiniBarChart data={GROUPS.map(g=>g.modules.length)} color="#4F6EF7" height={120} />
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  {GROUPS.map(g=><span key={g.id} style={{fontSize:10,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace"}}>{g.id}</span>)}
                </div>
              </div>

              {/* Status distribution */}
              <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",border:"1px solid #E8EBF2"}}>
                <p style={{fontSize:14,fontWeight:600,color:"#1A1D2B",marginBottom:4}}>Estado de desarrollo</p>
                <p style={{fontSize:11,color:"#A0A5BD",marginBottom:16}}>Progreso por categoria</p>
                {[{l:"Nuevos",v:countSt("nuevo"),c:"#3B82F6"},{l:"Adaptar",v:countSt("adaptar"),c:"#F59E0B"},{l:"Reutilizar",v:countSt("reutilizar"),c:"#10B981"}].map((s,i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:500,color:"#4A5068"}}>{s.l}</span>
                      <span style={{fontSize:12,fontWeight:600,color:s.c}}>{s.v} modulos</span>
                    </div>
                    <div style={{height:8,background:"#F0F2F8",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(s.v/total)*100}%`,background:s.c,borderRadius:4,transition:"width .8s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gauge */}
              <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",border:"1px solid #E8EBF2",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <p style={{fontSize:14,fontWeight:600,color:"#1A1D2B",marginBottom:12}}>Avance general</p>
                <Gauge value={12} max={100} label="del convenio" color="#4F6EF7" />
                <p style={{fontSize:11,color:"#10B981",fontWeight:600,marginTop:8}}>En tiempo segun cronograma</p>
              </div>
            </div>

            {/* Recent activity */}
            <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",border:"1px solid #E8EBF2"}}>
              <p style={{fontSize:14,fontWeight:600,color:"#1A1D2B",marginBottom:14}}>Actividad reciente</p>
              {logs.slice(0,6).map((l,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<5?"1px solid #F0F2F8":"none"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:l.modulo==="LOGIN"?"#10B981":l.modulo==="LOGOUT"?"#F87171":"#4F6EF7"}}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,color:"#1A1D2B"}}><strong>{l.nombre}</strong> — {l.modulo==="LOGIN"?"Inicio sesion":l.modulo==="LOGOUT"?"Cerro sesion":`Accedio a ${l.modulo}`}</p>
                  </div>
                  <span style={{fontSize:10,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace"}}>{new Date(l.ts).toLocaleString("es-CO",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"})}</span>
                </div>
              ))}
              {logs.length===0 && <p style={{fontSize:13,color:"#A0A5BD",textAlign:"center",padding:20}}>Los accesos a modulos aparaceran aqui</p>}
            </div>
          </div>)}

          {/* ══ MODULES PAGE ══ */}
          {page==="modulos" && (<div style={{animation:"fadeIn .4s ease both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
              <div>
                <h2 style={{fontSize:22,fontWeight:700,color:"#1A1D2B"}}>Modulos del convenio</h2>
                <p style={{fontSize:13,color:"#8890A5"}}>{total} modulos en {GROUPS.length} grupos</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setOpenG(GROUPS.map(g=>g.id))} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #E8EBF2",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:"#4A5068"}}>Expandir todo</button>
                <button onClick={()=>setOpenG([])} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #E8EBF2",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:"#4A5068"}}>Colapsar</button>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {GROUPS.map(g=>{
                const filt=g.modules.filter(m=>!sl||m.name.toLowerCase().includes(sl)||m.desc.toLowerCase().includes(sl)||m.stack.toLowerCase().includes(sl));
                if(sl&&filt.length===0)return null;
                const isO=openG.includes(g.id)||!!sl;
                return(<div key={g.id} id={"g-"+g.id} style={{background:"#fff",borderRadius:16,border:"1px solid #E8EBF2",overflow:"hidden",boxShadow:isO?`0 4px 20px -8px ${g.color}12`:"none"}}>
                  <button onClick={()=>togG(g.id)} style={{width:"100%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:isO?g.color+"08":"transparent",borderBottom:isO?"1px solid #E8EBF2":"none"}}>
                    <span style={{width:38,height:38,borderRadius:10,background:g.color+"16",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{g.icon}</span>
                    <div style={{flex:1,textAlign:"left"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:11,fontWeight:700,color:g.color,fontFamily:"'IBM Plex Mono',monospace"}}>GRUPO {g.id}</span>
                        <span style={{fontSize:11,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace"}}>{filt.length} mod.</span>
                      </div>
                      <p style={{fontSize:14,fontWeight:600,color:"#1A1D2B"}}>{g.name}</p>
                    </div>
                    <span style={{fontSize:16,color:"#A0A5BD",transform:isO?"rotate(180deg)":"none",transition:"transform .3s"}}>{"\u25BE"}</span>
                  </button>
                  {isO&&<div style={{padding:"6px 8px 10px"}}>{filt.map((m,i)=>{
                    const st=ST[m.status];
                    return(<a key={m.id} href={m.url} onClick={e=>{e.preventDefault();addLog(user,m.name);window.open(m.url,"_blank");}}
                      style={{display:"grid",gridTemplateColumns:"40px 1fr auto",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,textDecoration:"none",color:"inherit",cursor:"pointer",transition:"background .15s",borderLeft:"3px solid transparent"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#F7F8FB";e.currentTarget.style.borderLeftColor=g.color}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderLeftColor="transparent"}}>
                      <span style={{width:34,height:34,borderRadius:8,background:g.color+"12",color:g.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{String(m.id).padStart(2,"0")}</span>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:13,fontWeight:600,color:"#1A1D2B",lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</p>
                        <p style={{fontSize:11,color:"#8890A5",margin:"2px 0 4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.desc}</p>
                        <div>{m.stack.split("+").map((t,j)=><span key={j} style={{display:"inline-block",padding:"1px 7px",borderRadius:4,fontSize:10,background:"#F0F2F8",color:"#6B7194",fontFamily:"'IBM Plex Mono',monospace",marginRight:3}}>{t.trim()}</span>)}</div>
                      </div>
                      <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:6,fontSize:10,fontWeight:600,background:st.bg,color:st.c,fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase"}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:st.d}}/>{st.l}
                      </span>
                    </a>);
                  })}</div>}
                </div>);
              })}
            </div>
          </div>)}

          {/* ══ METRICS PAGE ══ */}
          {page==="metricas" && (<div style={{animation:"fadeIn .4s ease both"}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#1A1D2B",marginBottom:20}}>Metricas del convenio</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #E8EBF2"}}>
                <p style={{fontSize:14,fontWeight:600,marginBottom:16}}>Desembolsos ANH</p>
                {[{l:"D1 — Plan trabajo",p:100,c:"#10B981"},{l:"D2 — Avance 35%",p:45,c:"#4F6EF7"},{l:"D3 — Avance 70%",p:0,c:"#A0A5BD"},{l:"D4 — Final 100%",p:0,c:"#A0A5BD"}].map((d,i)=>(
                  <div key={i} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#4A5068"}}>{d.l}</span><span style={{fontSize:12,fontWeight:600,color:d.c}}>{d.p}%</span></div>
                    <div style={{height:6,background:"#F0F2F8",borderRadius:3}}><div style={{height:"100%",width:d.p+"%",background:d.c,borderRadius:3,transition:"width .6s"}}/></div>
                  </div>
                ))}
              </div>
              <div style={{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #E8EBF2"}}>
                <p style={{fontSize:14,fontWeight:600,marginBottom:16}}>Stack tecnologico</p>
                {[{l:"Google Sheets",v:28},{l:"Google Forms",v:16},{l:"Looker Studio",v:14},{l:"Google Drive",v:10},{l:"Moodle LMS",v:3},{l:"Apps Script",v:4}].map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:12,color:"#4A5068",minWidth:110}}>{s.l}</span>
                    <div style={{flex:1,height:6,background:"#F0F2F8",borderRadius:3}}><div style={{height:"100%",width:`${(s.v/28)*100}%`,background:"#4F6EF7",borderRadius:3}}/></div>
                    <span style={{fontSize:11,fontWeight:600,color:"#4F6EF7",fontFamily:"'IBM Plex Mono',monospace"}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>)}

          {/* ══ LOG PAGE ══ */}
          {page==="log" && (<div style={{animation:"fadeIn .4s ease both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><h2 style={{fontSize:22,fontWeight:700,color:"#1A1D2B"}}>Registro de accesos</h2><p style={{fontSize:13,color:"#8890A5"}}>{logs.length} registros</p></div>
              {logs.length>0&&<button onClick={()=>{localStorage.removeItem("eth_log");setPage("home");}} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #FCA5A5",background:"#FEF2F2",fontSize:12,fontWeight:600,cursor:"pointer",color:"#DC2626"}}>Limpiar registros</button>}
            </div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #E8EBF2",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 160px",padding:"12px 20px",background:"#F7F8FB",borderBottom:"1px solid #E8EBF2",fontSize:11,fontWeight:600,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase"}}>
                <span>Usuario</span><span>Accion</span><span>Rol</span><span>Fecha / Hora</span>
              </div>
              {logs.slice(0,50).map((l,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 160px",padding:"12px 20px",borderBottom:"1px solid #F0F2F8",fontSize:13,alignItems:"center"}}>
                  <span style={{fontWeight:500,color:"#1A1D2B"}}>{l.nombre}</span>
                  <span style={{color:l.modulo==="LOGIN"?"#10B981":l.modulo==="LOGOUT"?"#DC2626":"#4F6EF7",fontWeight:500}}>{l.modulo==="LOGIN"?"Inicio sesion":l.modulo==="LOGOUT"?"Cerro sesion":l.modulo}</span>
                  <span style={{fontSize:11,color:"#8890A5",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase"}}>{l.rol}</span>
                  <span style={{fontSize:11,color:"#A0A5BD",fontFamily:"'IBM Plex Mono',monospace"}}>{new Date(l.ts).toLocaleString("es-CO")}</span>
                </div>
              ))}
              {logs.length===0&&<p style={{padding:40,textAlign:"center",color:"#A0A5BD",fontSize:13}}>Sin registros aun</p>}
            </div>
          </div>)}

        </main>
      </div>
    </div>
  );
}
