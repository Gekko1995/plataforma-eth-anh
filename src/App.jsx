import { useState, useEffect, useRef } from "react";

// ─── SIMULATED AUTH (en produccion se reemplaza por Firebase Auth) ────────────
const MOCK_USERS = [
  { email: "admin@sinapsis3d.com", password: "admin2026", role: "admin", name: "Administrador" },
  { email: "coordinador@fwrts.org", password: "coord2026", role: "coordinador", name: "Coordinador ETH" },
  { email: "profesional@convenio.com", password: "prof2026", role: "profesional", name: "Profesional Campo" },
];

// ─── DATA ────────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: "A", name: "Diagnostico y Territorio", color: "#1B6B4A", icon: "\u{1F30D}",
    modules: [
      { id: 1, name: "Linea diagnostica territorial", desc: "Caracterizacion socioeconomica y ambiental. Mapeo actores.", stack: "Sheets + Forms + Looker", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 2, name: "Lineas base y evaluacion de impacto", desc: "Indicadores medibles inicio/medio/cierre. KPIs cadena valor DNP.", stack: "Sheets + Looker", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 3, name: "Georeferenciacion y mapeo", desc: "Google Maps + Looker. Capas E&P, CARs, PDET, ZOMAC.", stack: "Looker + Maps API", status: "adaptar", url: "https://lookerstudio.google.com" },
      { id: 4, name: "Caracterizacion cluster productivo", desc: "Estudio mercado, productos exportables, TLC, vocacion productiva.", stack: "Sheets + Forms", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 5, name: "Recabo informacion campo", desc: "Fichas producto, encuestas productores, requisitos fitosanitarios.", stack: "Forms + Sheets", status: "nuevo", url: "https://docs.google.com/forms" },
    ],
  },
  {
    id: "B", name: "Nucleo Estrategico ANH", color: "#B45309", icon: "\u26A1",
    modules: [
      { id: 6, name: "Lineamientos tecnicos ambientales", desc: "Planes trabajo CARs. Estudios tecnicos E&P.", stack: "Sheets + Drive + Looker", status: "adaptar", url: "https://drive.google.com" },
      { id: 7, name: "Inversion social territorial", desc: "Formulacion iniciativas. Implementacion con actas/fotos.", stack: "Sheets + Forms + Looker", status: "reutilizar", url: "https://docs.google.com/spreadsheets" },
      { id: 8, name: "Gestion conflictividad y dialogo", desc: "Alertas tempranas SLA. 4 lineas ETH. Espacios dialogo.", stack: "Sheets + Looker", status: "adaptar", url: "https://lookerstudio.google.com" },
      { id: 9, name: "Formulacion proyectos marco logico", desc: "Arbol problemas/objetivos. Matriz marco logico. MGA-DNP.", stack: "Sheets + Forms", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
    ],
  },
  {
    id: "C", name: "Formacion y Capacitacion", color: "#9333EA", icon: "\u{1F393}",
    modules: [
      { id: 10, name: "Moodle \u2014 Capacitacion beneficiarios", desc: "Cursos productivos, emprendimiento, exportacion. Certificaciones.", stack: "Moodle LMS", status: "adaptar", url: "https://moodle.org" },
      { id: 11, name: "Moodle \u2014 Capacitacion comunidades", desc: "Derechos, participacion, dialogo social, medio ambiente.", stack: "Moodle LMS", status: "nuevo", url: "https://moodle.org" },
      { id: 12, name: "Moodle \u2014 Formacion personal convenio", desc: "Induccion ETH, protocolos, HSE, marco normativo.", stack: "Moodle LMS", status: "adaptar", url: "https://moodle.org" },
      { id: 13, name: "Planeacion cluster y exportacion", desc: "Fases 4-9 FWRTS: planes negocio, ferias internacionales.", stack: "Sheets + Forms + Drive", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
    ],
  },
  {
    id: "D", name: "Gestion Actores y Talento", color: "#0369A1", icon: "\u{1F465}",
    modules: [
      { id: 14, name: "Gestion de beneficiarios", desc: "Registro, consentimientos, dashboard, segmentacion.", stack: "Sheets + Forms + Looker", status: "reutilizar", url: "https://docs.google.com/spreadsheets" },
      { id: 15, name: "Directorio integral de actores", desc: "Operadoras, comunidades, autoridades, etnias, gremios.", stack: "Sheets + Looker", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 16, name: "Enfoque diferencial y consulta previa", desc: "Protocolos etnicos. Tracking consulta previa.", stack: "Sheets + Forms + Drive", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 17, name: "Seleccion hojas de vida", desc: "Recepcion CVs. Evaluacion perfiles. Matriz calificacion.", stack: "Forms + Sheets", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 18, name: "Gestion de personal", desc: "Equipo vinculado. Seguridad social. Salarios/prestaciones.", stack: "Sheets + Looker", status: "adaptar", url: "https://docs.google.com/spreadsheets" },
      { id: 19, name: "Entidades aliadas y corporaciones", desc: "Seguimiento CARs 8 regiones. Estado alianzas.", stack: "Sheets + Looker", status: "nuevo", url: "https://lookerstudio.google.com" },
    ],
  },
  {
    id: "E", name: "Control Financiero y Gobernanza", color: "#DC2626", icon: "\u{1F4B0}",
    modules: [
      { id: 20, name: "Administracion y seguridad", desc: "Usuarios, roles, permisos, auditoria, logs, MFA.", stack: "Apps Script + Sheets", status: "reutilizar", url: "https://script.google.com" },
      { id: 21, name: "Seguimiento y monitoreo", desc: "Plan operativo, hitos, % avance, semaforos.", stack: "Sheets + Looker", status: "reutilizar", url: "https://lookerstudio.google.com" },
      { id: 22, name: "Gestion financiera", desc: "Ejecucion presupuestal 3 items + contrapartida.", stack: "Sheets + Looker", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 23, name: "Cuentas de cobro funcionarios", desc: "Radicacion mensual. Verificacion SS. Flujo aprobacion.", stack: "Forms + Sheets + Script", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 24, name: "Comite de coordinacion", desc: "Sesiones mensuales 3+2. Actas. Secretaria tecnica.", stack: "Sheets + Drive", status: "nuevo", url: "https://drive.google.com" },
      { id: 25, name: "Contratacion y adquisiciones ESAL", desc: "Subcontratos, proveedores, TdR internos.", stack: "Sheets + Drive", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 26, name: "Gestion de riesgos del convenio", desc: "Matriz CONPES 3714. Riesgos operacionales. Alertas.", stack: "Sheets + Looker", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
    ],
  },
  {
    id: "F", name: "Informes y Rendicion", color: "#0891B2", icon: "\u{1F4C4}",
    modules: [
      { id: 27, name: "Recepcion informes funcionarios", desc: "Informe periodico. Flujo radicacion > revision > aprobacion.", stack: "Forms + Sheets + Drive", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 28, name: "Generacion informes ANH", desc: "Compilador automatico 4 desembolsos.", stack: "Apps Script + Sheets", status: "nuevo", url: "https://script.google.com" },
      { id: 29, name: "Gestion conocimiento y lecciones", desc: "Repositorio metodologias, casos exito, buenas practicas.", stack: "Drive + Sheets + Moodle", status: "nuevo", url: "https://drive.google.com" },
    ],
  },
  {
    id: "G", name: "Operacion Territorial", color: "#059669", icon: "\u{1F4CD}",
    modules: [
      { id: 30, name: "Gestion eventos y agenda", desc: "Talleres, foros, ferias. Convocatoria. Asistencia.", stack: "Forms + Sheets + Looker", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 31, name: "Logistica territorial", desc: "Transporte, alojamiento, refrigerios por evento/region.", stack: "Forms + Sheets", status: "nuevo", url: "https://docs.google.com/forms" },
      { id: 32, name: "Comunicaciones y visibilidad", desc: "Piezas por iniciativa. Presencia digital. Metricas.", stack: "Drive + Sheets", status: "nuevo", url: "https://drive.google.com" },
      { id: 33, name: "HSE \u2014 Seguridad y salud", desc: "Protocolos campo. Reportes incidentes. Plan emergencias.", stack: "Forms + Sheets", status: "nuevo", url: "https://docs.google.com/forms" },
    ],
  },
  {
    id: "H", name: "Soporte y Documentacion", color: "#6D28D9", icon: "\u{1F5C4}\uFE0F",
    modules: [
      { id: 34, name: "Gestion documental", desc: "Drive jerarquico. Alertas vencimiento. Validacion Gemini API.", stack: "Drive + Apps Script + Gemini", status: "reutilizar", url: "https://drive.google.com" },
      { id: 35, name: "Control inventarios y bienes", desc: "Bienes ANH. Trazabilidad maquinaria/equipos.", stack: "Sheets + Looker", status: "adaptar", url: "https://docs.google.com/spreadsheets" },
      { id: 36, name: "Control polizas y garantias", desc: "Cumplimiento 20%, calidad 10%, salarios 5%. Vigencias.", stack: "Sheets", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
      { id: 37, name: "Liquidacion y cierre del convenio", desc: "Checklist productos. Acta liquidacion. Balance final.", stack: "Sheets + Drive", status: "nuevo", url: "https://docs.google.com/spreadsheets" },
    ],
  },
  {
    id: "I", name: "Infraestructura y Soporte TI", color: "#475569", icon: "\u{1F6E0}\uFE0F",
    modules: [
      { id: 38, name: "Mesa de ayuda y soporte", desc: "Tickets SLA. FAQ. Multicanal. Soporte 24/7.", stack: "Forms + Sheets + Looker", status: "reutilizar", url: "https://docs.google.com/forms" },
      { id: 39, name: "Infraestructura y continuidad", desc: "Cloud Google Workspace. Backups. Disponibilidad 99.5%.", stack: "Google Workspace", status: "adaptar", url: "https://workspace.google.com" },
    ],
  },
];

const STATUS_MAP = {
  nuevo: { label: "Nuevo", bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
  adaptar: { label: "Adaptar", bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  reutilizar: { label: "Reutilizar", bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
};

const totalModules = GROUPS.reduce((a, g) => a + g.modules.length, 0);
const countByStatus = (s) => GROUPS.reduce((a, g) => a + g.modules.filter(m => m.status === s).length, 0);

// ─── LOGIN SCREEN ────────────────────────────────────────────────────────────

const LoginScreen = ({ onLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0F1118",
      fontFamily: "'Outfit', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        * { box-sizing:border-box; }
        input::placeholder { color:#5A6175; }
      `}</style>

      {/* Ambient bg shapes */}
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, #1B6B4A22 0%, transparent 70%)", animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-15%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, #9333EA18 0%, transparent 70%)", animation:"float 10s ease-in-out infinite 2s" }} />

      <div style={{
        width: "100%", maxWidth: 420, padding: "0 20px",
        animation: "fadeUp 0.6s ease both",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, #1B6B4A, #059669)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff",
            boxShadow: "0 8px 32px #1B6B4A44",
            marginBottom: 16,
          }}>S3D</div>
          <h1 style={{ margin:"0 0 4px", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing:"-0.02em" }}>
            Plataforma ETH-ANH
          </h1>
          <p style={{ margin:0, fontSize: 13, color: "#5A6175", fontFamily:"'IBM Plex Mono', monospace" }}>
            Convenio 2026 \u2014 Acceso seguro
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} style={{
          background: "#181B25",
          borderRadius: 16,
          padding: "32px 28px",
          border: "1px solid #2A2D3A",
        }}>
          {error && (
            <div style={{
              background: "#DC262618", border: "1px solid #DC262644",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: "#F87171",
            }}>{error}</div>
          )}

          <label style={{ display:"block", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#8890A5", display:"block", marginBottom: 6, fontFamily:"'IBM Plex Mono', monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Correo electronico
            </span>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com" required
              style={{
                width:"100%", padding:"12px 14px", borderRadius:10,
                border:"1px solid #2A2D3A", background:"#0F1118",
                color:"#fff", fontSize:14, fontFamily:"'Outfit', sans-serif",
                outline:"none", transition:"border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#1B6B4A"}
              onBlur={e => e.target.style.borderColor = "#2A2D3A"}
            />
          </label>

          <label style={{ display:"block", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#8890A5", display:"block", marginBottom: 6, fontFamily:"'IBM Plex Mono', monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Contrasena
            </span>
            <div style={{ position:"relative" }}>
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required
                style={{
                  width:"100%", padding:"12px 44px 12px 14px", borderRadius:10,
                  border:"1px solid #2A2D3A", background:"#0F1118",
                  color:"#fff", fontSize:14, fontFamily:"'Outfit', sans-serif",
                  outline:"none", transition:"border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#1B6B4A"}
                onBlur={e => e.target.style.borderColor = "#2A2D3A"}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"#5A6175", cursor:"pointer",
                  fontSize:13, padding:4,
                }}>
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          <button type="submit" style={{
            width:"100%", padding:"13px", borderRadius:10,
            background:"linear-gradient(135deg, #1B6B4A, #059669)",
            color:"#fff", fontSize:15, fontWeight:600, border:"none",
            cursor:"pointer", fontFamily:"'Outfit', sans-serif",
            boxShadow:"0 4px 16px #1B6B4A44",
            transition:"transform 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={e => { e.target.style.transform = "scale(0.98)"; }}
          onMouseUp={e => { e.target.style.transform = "scale(1)"; }}
          >
            Iniciar sesion
          </button>

          <div style={{ textAlign:"center", marginTop:16 }}>
            <button type="button" style={{
              background:"none", border:"1px solid #2A2D3A", borderRadius:10,
              padding:"10px 20px", color:"#8890A5", fontSize:13,
              cursor:"pointer", fontFamily:"'Outfit', sans-serif",
              width:"100%", transition:"border-color 0.2s",
            }}
            onMouseEnter={e => e.target.style.borderColor = "#4285F4"}
            onMouseLeave={e => e.target.style.borderColor = "#2A2D3A"}
            >
              Continuar con Google
            </button>
          </div>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: 20, padding: "14px 18px",
          background: "#181B25", borderRadius: 12,
          border: "1px solid #2A2D3A",
        }}>
          <p style={{ margin:"0 0 8px", fontSize: 11, color: "#5A6175", fontFamily:"'IBM Plex Mono', monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>
            Cuentas de prueba:
          </p>
          {MOCK_USERS.map(u => (
            <div key={u.email} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <span style={{ fontSize:12, color:"#8890A5", fontFamily:"'IBM Plex Mono', monospace" }}>
                {u.email}
              </span>
              <button onClick={() => { setEmail(u.email); setPassword(u.password); }}
                style={{
                  background:"#1B6B4A22", border:"none", borderRadius:6,
                  padding:"3px 10px", fontSize:10, color:"#1B9E6A",
                  cursor:"pointer", fontWeight:600,
                }}>
                Usar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600,
      background:s.bg, color:s.color, fontFamily:"var(--mono)",
      letterSpacing:"0.02em", textTransform:"uppercase",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot }} />
      {s.label}
    </span>
  );
};

const ModuleRow = ({ mod, groupColor, delay, user }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    // Log access
    const log = JSON.parse(localStorage.getItem("access_log") || "[]");
    log.unshift({
      user: user.email,
      name: user.name,
      role: user.role,
      module: mod.name,
      moduleId: mod.id,
      url: mod.url,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("access_log", JSON.stringify(log.slice(0, 200)));
    window.open(mod.url, "_blank");
  };

  return (
    <a href={mod.url} onClick={handleClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display:"grid", gridTemplateColumns:"42px 1fr auto",
        alignItems:"center", gap:14, padding:"14px 18px", borderRadius:10,
        background: hovered ? "var(--surface-hover)" : "transparent",
        textDecoration:"none", color:"inherit",
        borderLeft:`3px solid ${hovered ? groupColor : "transparent"}`,
        transition:"all 0.25s ease",
        animation:`rowIn 0.35s ease ${delay}s both`, cursor:"pointer",
      }}
    >
      <span style={{
        width:36, height:36, borderRadius:8,
        background:groupColor + "14", color:groupColor,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:14, fontWeight:700, fontFamily:"var(--mono)",
      }}>{String(mod.id).padStart(2, "0")}</span>
      <div style={{ minWidth:0 }}>
        <p style={{ margin:0, fontSize:14, fontWeight:600, color:"var(--text-1)", fontFamily:"var(--heading)", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{mod.name}</p>
        <p style={{ margin:"3px 0 5px", fontSize:12, color:"var(--text-3)", lineHeight:1.4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{mod.desc}</p>
        <div>{mod.stack.split(" + ").map((t, i) => (
          <span key={i} style={{ display:"inline-block", padding:"2px 8px", borderRadius:4, fontSize:10, background:"var(--surface-2)", color:"var(--text-3)", fontFamily:"var(--mono)", letterSpacing:"0.03em", marginRight:4, marginBottom:3 }}>{t.trim()}</span>
        ))}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <StatusBadge status={mod.status} />
        <span style={{ fontSize:16, color:"var(--text-3)", opacity: hovered ? 1 : 0, transition:"opacity 0.2s" }}>\u2192</span>
      </div>
    </a>
  );
};

const GroupSection = ({ group, isOpen, onToggle, searchTerm, user }) => {
  const filtered = group.modules.filter(m =>
    !searchTerm || m.name.toLowerCase().includes(searchTerm) || m.desc.toLowerCase().includes(searchTerm) || m.stack.toLowerCase().includes(searchTerm)
  );
  if (searchTerm && filtered.length === 0) return null;

  return (
    <div style={{
      background:"var(--card)", borderRadius:14,
      border:"1px solid var(--border)", overflow:"hidden",
      transition:"box-shadow 0.3s ease",
      boxShadow: isOpen ? `0 4px 24px -8px ${group.color}18` : "none",
    }}>
      <button onClick={onToggle} style={{
        width:"100%", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:14,
        padding:"18px 22px",
        background: isOpen ? group.color + "08" : "transparent",
        transition:"background 0.2s",
        borderBottom: isOpen ? "1px solid var(--border)" : "none",
      }}>
        <span style={{ width:40, height:40, borderRadius:10, background:group.color + "18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{group.icon}</span>
        <div style={{ flex:1, textAlign:"left" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, fontWeight:700, color:group.color, fontFamily:"var(--mono)", letterSpacing:"0.08em" }}>GRUPO {group.id}</span>
            <span style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--mono)" }}>{filtered.length} modulo{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <p style={{ margin:"2px 0 0", fontSize:15, fontWeight:600, color:"var(--text-1)", fontFamily:"var(--heading)" }}>{group.name}</p>
        </div>
        <span style={{ fontSize:18, color:"var(--text-3)", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition:"transform 0.3s ease" }}>\u25BE</span>
      </button>
      {isOpen && (
        <div style={{ padding:"8px 8px 12px" }}>
          {filtered.map((m, i) => <ModuleRow key={m.id} mod={m} groupColor={group.color} delay={i * 0.04} user={user} />)}
        </div>
      )}
    </div>
  );
};

// ─── ACCESS LOG PANEL ────────────────────────────────────────────────────────

const AccessLogPanel = ({ isOpen, onClose }) => {
  const logs = JSON.parse(localStorage.getItem("access_log") || "[]");

  return (
    <div style={{
      position:"fixed", top:0, right: isOpen ? 0 : -400, width:380, height:"100vh",
      background:"#181B25", borderLeft:"1px solid #2A2D3A",
      zIndex:1000, transition:"right 0.3s ease",
      display:"flex", flexDirection:"column", fontFamily:"'Outfit', sans-serif",
    }}>
      <div style={{ padding:"20px 24px", borderBottom:"1px solid #2A2D3A", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>Registro de accesos</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#5A6175", fontSize:20, cursor:"pointer" }}>\u2715</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
        {logs.length === 0 && <p style={{ color:"#5A6175", fontSize:13, textAlign:"center", marginTop:40 }}>Sin registros aun. Los accesos a modulos se guardaran aqui.</p>}
        {logs.map((log, i) => (
          <div key={i} style={{ padding:"12px 14px", background:"#0F1118", borderRadius:10, marginBottom:8, border:"1px solid #2A2D3A" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{log.name}</span>
              <span style={{ fontSize:10, color:"#5A6175", fontFamily:"'IBM Plex Mono', monospace" }}>{log.role}</span>
            </div>
            <p style={{ margin:"0 0 4px", fontSize:12, color:"#8890A5" }}>Accedio a: <span style={{ color:"#1B9E6A" }}>{log.module}</span></p>
            <p style={{ margin:0, fontSize:10, color:"#5A6175", fontFamily:"'IBM Plex Mono', monospace" }}>
              {new Date(log.timestamp).toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>
      {logs.length > 0 && (
        <div style={{ padding:"12px 16px", borderTop:"1px solid #2A2D3A" }}>
          <button onClick={() => { localStorage.removeItem("access_log"); onClose(); }}
            style={{ width:"100%", padding:"10px", borderRadius:8, border:"1px solid #DC262644", background:"#DC262618", color:"#F87171", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            Limpiar registros
          </button>
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [openGroups, setOpenGroups] = useState(["A", "B"]);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [showLog, setShowLog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eth_user");
    if (saved) setUser(JSON.parse(saved));
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { email: found.email, name: found.name, role: found.role, loginAt: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem("eth_user", JSON.stringify(userData));
      setLoginError("");
      // Log the login
      const log = JSON.parse(localStorage.getItem("access_log") || "[]");
      log.unshift({ user: found.email, name: found.name, role: found.role, module: "LOGIN", moduleId: 0, url: "-", timestamp: new Date().toISOString() });
      localStorage.setItem("access_log", JSON.stringify(log.slice(0, 200)));
    } else {
      setLoginError("Email o contrasena incorrectos. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    const log = JSON.parse(localStorage.getItem("access_log") || "[]");
    log.unshift({ user: user.email, name: user.name, role: user.role, module: "LOGOUT", moduleId: 0, url: "-", timestamp: new Date().toISOString() });
    localStorage.setItem("access_log", JSON.stringify(log.slice(0, 200)));
    setUser(null);
    localStorage.removeItem("eth_user");
    setShowUserMenu(false);
  };

  const toggle = (id) => setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  const expandAll = () => setOpenGroups(GROUPS.map(g => g.id));
  const collapseAll = () => setOpenGroups([]);
  const searchLower = search.toLowerCase();

  // ── NOT LOGGED IN ──
  if (!user) return <LoginScreen onLogin={handleLogin} error={loginError} />;

  // ── LOGGED IN ──
  return (
    <div style={{
      "--heading": "'Outfit', 'Segoe UI', sans-serif",
      "--body": "'Outfit', 'Segoe UI', sans-serif",
      "--mono": "'IBM Plex Mono', 'SF Mono', monospace",
      "--bg": "#F4F5F7", "--card": "#FFFFFF",
      "--surface-2": "#EFF1F5", "--surface-hover": "#F7F8FA",
      "--border": "#E2E5EB",
      "--text-1": "#1A1D2B", "--text-2": "#4A5068", "--text-3": "#8890A5",
      minHeight: "100vh", background: "var(--bg)",
      fontFamily: "var(--body)", color: "var(--text-1)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        @keyframes rowIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; }
        input::placeholder { color: var(--text-3); }
      `}</style>

      {/* Access Log Panel */}
      <AccessLogPanel isOpen={showLog} onClose={() => setShowLog(false)} />
      {showLog && <div onClick={() => setShowLog(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:999 }} />}

      {/* Header */}
      <header style={{ background:"#1A1D2B", color:"#fff", animation:"fadeUp 0.4s ease both" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"18px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:10, background:"linear-gradient(135deg, #1B6B4A, #059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", boxShadow:"0 2px 12px #1B6B4A44" }}>S3D</div>
            <div>
              <h1 style={{ margin:0, fontSize:18, fontWeight:700, letterSpacing:"-0.02em" }}>Plataforma Gestion Integrada</h1>
              <p style={{ margin:0, fontSize:12, opacity:0.55, fontFamily:"var(--mono)", letterSpacing:"0.03em" }}>CONVENIO ETH-ANH 2026</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setShowLog(true)} style={{
              background:"#2A2D3A", border:"none", borderRadius:8,
              padding:"8px 14px", color:"#8890A5", fontSize:12,
              cursor:"pointer", fontFamily:"var(--mono)",
              display:"flex", alignItems:"center", gap:6,
            }}>
              <span style={{ fontSize:14 }}>\u{1F4CB}</span> Registro accesos
            </button>
            <div style={{ position:"relative" }}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                background:"#1B6B4A33", border:"1px solid #1B6B4A66", borderRadius:10,
                padding:"8px 14px", color:"#fff", fontSize:13,
                cursor:"pointer", fontFamily:"var(--body)",
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ width:28, height:28, borderRadius:8, background:"#1B6B4A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>
                  {user.name.charAt(0)}
                </span>
                <span>{user.name}</span>
                <span style={{ fontSize:10, opacity:0.6 }}>\u25BE</span>
              </button>
              {showUserMenu && (
                <div style={{
                  position:"absolute", top:"100%", right:0, marginTop:6,
                  background:"#181B25", border:"1px solid #2A2D3A", borderRadius:12,
                  padding:8, minWidth:220, zIndex:100,
                }}>
                  <div style={{ padding:"10px 14px", borderBottom:"1px solid #2A2D3A", marginBottom:4 }}>
                    <p style={{ margin:0, fontSize:13, color:"#fff", fontWeight:600 }}>{user.name}</p>
                    <p style={{ margin:"2px 0 0", fontSize:11, color:"#5A6175", fontFamily:"var(--mono)" }}>{user.email}</p>
                    <p style={{ margin:"4px 0 0", fontSize:10, color:"#1B9E6A", fontFamily:"var(--mono)", textTransform:"uppercase" }}>{user.role}</p>
                  </div>
                  <button onClick={handleLogout} style={{
                    width:"100%", padding:"10px 14px", borderRadius:8,
                    border:"none", background:"#DC262618", color:"#F87171",
                    fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left",
                  }}>
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ height:3, background:"linear-gradient(90deg, #1B6B4A, #0891B2, #9333EA, #DC2626, #B45309)" }} />
      </header>

      {/* Main */}
      <main style={{ maxWidth:1280, margin:"0 auto", padding:"28px 32px 60px" }}>

        {/* Welcome bar */}
        <div style={{
          background:"var(--card)", borderRadius:14, padding:"16px 22px",
          border:"1px solid var(--border)", marginBottom:20,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
          animation:"fadeUp 0.4s ease both",
        }}>
          <div>
            <p style={{ margin:0, fontSize:15, fontWeight:600, color:"var(--text-1)" }}>
              {time.getHours() < 12 ? "Buenos dias" : time.getHours() < 18 ? "Buenas tardes" : "Buenas noches"}, {user.name}
            </p>
            <p style={{ margin:"2px 0 0", fontSize:12, color:"var(--text-3)", fontFamily:"var(--mono)" }}>
              Sesion iniciada: {new Date(user.loginAt).toLocaleString("es-CO")} \u2014 Rol: {user.role}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"#22c55e14", borderRadius:20, fontSize:12, color:"#16a34a", fontWeight:600 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }} />
            Sesion activa
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))", gap:12, marginBottom:24 }}>
          {[
            { label:"Total modulos", value:totalModules, color:"#1A1D2B" },
            { label:"Grupos", value:"9", color:"#1B6B4A" },
            { label:"Nuevos", value:countByStatus("nuevo"), color:"#3B82F6" },
            { label:"A adaptar", value:countByStatus("adaptar"), color:"#F59E0B" },
            { label:"Reutilizar", value:countByStatus("reutilizar"), color:"#10B981" },
            { label:"Avance global", value:"12%", color:"#9333EA" },
          ].map((k, i) => (
            <div key={i} style={{ background:"var(--card)", borderRadius:12, padding:"16px 18px", border:"1px solid var(--border)", animation:`fadeUp 0.35s ease ${0.1+i*0.05}s both` }}>
              <span style={{ fontSize:10, color:"var(--text-3)", fontFamily:"var(--mono)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.label}</span>
              <p style={{ margin:"6px 0 0", fontSize:28, fontWeight:800, color:k.color, fontFamily:"var(--heading)", lineHeight:1 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap", animation:"fadeUp 0.4s ease 0.3s both" }}>
          <div style={{ flex:1, minWidth:240, position:"relative" }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"var(--text-3)" }}>\u2315</span>
            <input type="text" placeholder="Buscar modulo, herramienta o descripcion..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"12px 16px 12px 40px", border:"1px solid var(--border)", borderRadius:10, fontSize:14, fontFamily:"var(--body)", background:"var(--card)", color:"var(--text-1)", outline:"none" }}
              onFocus={e => e.target.style.borderColor = "#1B6B4A88"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <button onClick={expandAll} style={{ padding:"10px 16px", borderRadius:8, border:"1px solid var(--border)", background:"var(--card)", fontSize:12, fontWeight:600, fontFamily:"var(--mono)", cursor:"pointer", color:"var(--text-2)" }}>Expandir todo</button>
          <button onClick={collapseAll} style={{ padding:"10px 16px", borderRadius:8, border:"1px solid var(--border)", background:"var(--card)", fontSize:12, fontWeight:600, fontFamily:"var(--mono)", cursor:"pointer", color:"var(--text-2)" }}>Colapsar</button>
        </div>

        {/* Group Nav */}
        <div style={{ display:"flex", gap:6, marginBottom:20, overflowX:"auto", paddingBottom:4, animation:"fadeUp 0.4s ease 0.35s both" }}>
          {GROUPS.map(g => (
            <button key={g.id} onClick={() => { if (!openGroups.includes(g.id)) toggle(g.id); document.getElementById(`group-${g.id}`)?.scrollIntoView({ behavior:"smooth", block:"center" }); }}
              style={{ padding:"7px 14px", borderRadius:8, border:"none", background:g.color + "14", color:g.color, fontSize:12, fontWeight:600, fontFamily:"var(--mono)", cursor:"pointer", whiteSpace:"nowrap" }}>
              {g.icon} {g.id}
            </button>
          ))}
        </div>

        {/* Groups */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {GROUPS.map(g => (
            <div key={g.id} id={`group-${g.id}`}>
              <GroupSection group={g} isOpen={openGroups.includes(g.id) || !!searchLower} onToggle={() => toggle(g.id)} searchTerm={searchLower} user={user} />
            </div>
          ))}
        </div>

        {/* Stack Legend */}
        <div style={{ marginTop:32, padding:"20px 24px", background:"var(--card)", borderRadius:14, border:"1px solid var(--border)", animation:"fadeUp 0.4s ease 0.5s both" }}>
          <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:600, color:"var(--text-3)", fontFamily:"var(--mono)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Stack tecnologico</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["Google Sheets", "Google Forms", "Looker Studio", "Google Drive", "Apps Script", "Moodle LMS", "Maps API", "Gemini API", "Google Workspace"].map(t => (
              <span key={t} style={{ padding:"6px 14px", borderRadius:8, background:"var(--surface-2)", fontSize:12, fontWeight:500, color:"var(--text-2)", fontFamily:"var(--mono)" }}>{t}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
