import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: "A", name: "Diagnóstico y Territorio", color: "#1B6B4A", icon: "🌍",
    modules: [
      { id: 1, name: "Línea diagnóstica territorial", desc: "Caracterización socioeconómica y ambiental. Mapeo actores.", stack: "Sheets + Forms + Looker", status: "nuevo", url: "#" },
      { id: 2, name: "Líneas base y evaluación de impacto", desc: "Indicadores medibles inicio/medio/cierre. KPIs cadena valor DNP.", stack: "Sheets + Looker", status: "nuevo", url: "#" },
      { id: 3, name: "Georeferenciación y mapeo", desc: "Google Maps + Looker. Capas E&P, CARs, PDET, ZOMAC.", stack: "Looker + Maps API", status: "adaptar", url: "#" },
      { id: 4, name: "Caracterización clúster productivo", desc: "Estudio mercado, productos exportables, TLC, vocación productiva.", stack: "Sheets + Forms", status: "nuevo", url: "#" },
      { id: 5, name: "Recabo información campo", desc: "Fichas producto, encuestas productores, requisitos fitosanitarios.", stack: "Forms + Sheets", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "B", name: "Núcleo Estratégico ANH", color: "#B45309", icon: "⚡",
    modules: [
      { id: 6, name: "Lineamientos técnicos ambientales", desc: "Planes trabajo CARs. Estudios técnicos E&P. Repositorio territorial.", stack: "Sheets + Drive + Looker", status: "adaptar", url: "#" },
      { id: 7, name: "Inversión social territorial", desc: "Formulación iniciativas. Implementación con actas/fotos.", stack: "Sheets + Forms + Looker", status: "reutilizar", url: "#" },
      { id: 8, name: "Gestión conflictividad y diálogo", desc: "Alertas tempranas SLA. 4 líneas ETH. Espacios diálogo. Acuerdos.", stack: "Sheets + Looker", status: "adaptar", url: "#" },
      { id: 9, name: "Formulación proyectos marco lógico", desc: "Árbol problemas/objetivos. Matriz marco lógico. MGA-DNP.", stack: "Sheets + Forms", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "C", name: "Formación y Capacitación", color: "#9333EA", icon: "🎓",
    modules: [
      { id: 10, name: "Moodle — Capacitación beneficiarios", desc: "Cursos productivos, emprendimiento, exportación. Certificaciones.", stack: "Moodle LMS", status: "adaptar", url: "#" },
      { id: 11, name: "Moodle — Capacitación comunidades", desc: "Derechos, participación, diálogo social, medio ambiente.", stack: "Moodle LMS", status: "nuevo", url: "#" },
      { id: 12, name: "Moodle — Formación personal convenio", desc: "Inducción ETH, protocolos, HSE, marco normativo.", stack: "Moodle LMS", status: "adaptar", url: "#" },
      { id: 13, name: "Planeación clúster y exportación", desc: "Fases 4-9 FWRTS: planes negocio, ferias internacionales.", stack: "Sheets + Forms + Drive", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "D", name: "Gestión Actores y Talento", color: "#0369A1", icon: "👥",
    modules: [
      { id: 14, name: "Gestión de beneficiarios", desc: "Registro, consentimientos, dashboard, segmentación, tarjetas puntaje.", stack: "Sheets + Forms + Looker", status: "reutilizar", url: "#" },
      { id: 15, name: "Directorio integral de actores", desc: "Operadoras, comunidades, autoridades, etnias, gremios.", stack: "Sheets + Looker", status: "nuevo", url: "#" },
      { id: 16, name: "Enfoque diferencial y consulta previa", desc: "Protocolos étnicos. Tracking consulta previa. Consentimiento.", stack: "Sheets + Forms + Drive", status: "nuevo", url: "#" },
      { id: 17, name: "Selección hojas de vida", desc: "Recepción CVs. Evaluación perfiles. Matriz calificación.", stack: "Forms + Sheets", status: "nuevo", url: "#" },
      { id: 18, name: "Gestión de personal", desc: "Equipo vinculado. Seguridad social. Salarios/prestaciones.", stack: "Sheets + Looker", status: "adaptar", url: "#" },
      { id: 19, name: "Entidades aliadas y corporaciones", desc: "Seguimiento CARs 8 regiones. Productos vs comprometidos.", stack: "Sheets + Looker", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "E", name: "Control Financiero y Gobernanza", color: "#DC2626", icon: "💰",
    modules: [
      { id: 20, name: "Administración y seguridad", desc: "Usuarios, roles, permisos, auditoría, logs, MFA, Habeas Data.", stack: "Apps Script + Sheets", status: "reutilizar", url: "#" },
      { id: 21, name: "Seguimiento y monitoreo", desc: "Plan operativo, hitos, % avance, semáforos. Alineado desembolsos.", stack: "Sheets + Looker", status: "reutilizar", url: "#" },
      { id: 22, name: "Gestión financiera", desc: "Ejecución presupuestal 3 ítems + contrapartida. Desembolsos.", stack: "Sheets + Looker", status: "nuevo", url: "#" },
      { id: 23, name: "Cuentas de cobro funcionarios", desc: "Radicación mensual. Verificación SS. Flujo aprobación.", stack: "Forms + Sheets + Script", status: "nuevo", url: "#" },
      { id: 24, name: "Comité de coordinación", desc: "Sesiones mensuales 3+2. Actas. Secretaría técnica.", stack: "Sheets + Drive", status: "nuevo", url: "#" },
      { id: 25, name: "Contratación y adquisiciones ESAL", desc: "Subcontratos, proveedores, TdR internos, minutas.", stack: "Sheets + Drive", status: "nuevo", url: "#" },
      { id: 26, name: "Gestión de riesgos del convenio", desc: "Matriz CONPES 3714. Riesgos operacionales. Alertas.", stack: "Sheets + Looker", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "F", name: "Informes y Rendición", color: "#0891B2", icon: "📄",
    modules: [
      { id: 27, name: "Recepción informes funcionarios", desc: "Informe periódico. Flujo radicación > revisión > aprobación.", stack: "Forms + Sheets + Drive", status: "nuevo", url: "#" },
      { id: 28, name: "Generación informes ANH", desc: "Compilador automático 4 desembolsos: D1, D2 35%, D3 70%, D4 final.", stack: "Apps Script + Sheets", status: "nuevo", url: "#" },
      { id: 29, name: "Gestión conocimiento y lecciones", desc: "Repositorio metodologías, casos éxito, buenas prácticas.", stack: "Drive + Sheets + Moodle", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "G", name: "Operación Territorial", color: "#059669", icon: "📍",
    modules: [
      { id: 30, name: "Gestión eventos y agenda", desc: "Talleres, foros, ferias. Convocatoria. Asistencia. Actas.", stack: "Forms + Sheets + Looker", status: "nuevo", url: "#" },
      { id: 31, name: "Logística territorial", desc: "Transporte, alojamiento, refrigerios, sonido por evento/región.", stack: "Forms + Sheets", status: "nuevo", url: "#" },
      { id: 32, name: "Comunicaciones y visibilidad", desc: "Piezas por iniciativa. Campaña. Presencia digital. Métricas.", stack: "Drive + Sheets", status: "nuevo", url: "#" },
      { id: 33, name: "HSE — Seguridad y salud", desc: "Protocolos campo. Reportes incidentes. Plan emergencias. SG-SST.", stack: "Forms + Sheets", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "H", name: "Soporte y Documentación", color: "#6D28D9", icon: "🗄️",
    modules: [
      { id: 34, name: "Gestión documental", desc: "Drive jerárquico. Alertas vencimiento. Validación Gemini API.", stack: "Drive + Apps Script + Gemini", status: "reutilizar", url: "#" },
      { id: 35, name: "Control inventarios y bienes", desc: "Bienes ANH. Res. 0532/2024. Trazabilidad maquinaria/equipos.", stack: "Sheets + Looker", status: "adaptar", url: "#" },
      { id: 36, name: "Control pólizas y garantías", desc: "Cumplimiento 20%, calidad 10%, salarios 5%. Vigencias.", stack: "Sheets", status: "nuevo", url: "#" },
      { id: 37, name: "Liquidación y cierre del convenio", desc: "Checklist productos. Acta liquidación. Balance final.", stack: "Sheets + Drive", status: "nuevo", url: "#" },
    ],
  },
  {
    id: "I", name: "Infraestructura y Soporte TI", color: "#475569", icon: "🛠️",
    modules: [
      { id: 38, name: "Mesa de ayuda y soporte", desc: "Tickets SLA. FAQ. Multicanal. Guías por rol. Soporte 24/7.", stack: "Forms + Sheets + Looker", status: "reutilizar", url: "#" },
      { id: 39, name: "Infraestructura y continuidad", desc: "Cloud Google Workspace. Backups. Disponibilidad 99.5%.", stack: "Google Workspace", status: "adaptar", url: "#" },
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, fontFamily: "var(--mono)",
      letterSpacing: "0.02em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const StackTag = ({ text }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 4,
    fontSize: 10, background: "var(--surface-2)", color: "var(--text-3)",
    fontFamily: "var(--mono)", letterSpacing: "0.03em", marginRight: 4, marginBottom: 3,
  }}>
    {text}
  </span>
);

const ModuleRow = ({ mod, groupColor, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={mod.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "42px 1fr auto",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 10,
        background: hovered ? "var(--surface-hover)" : "transparent",
        textDecoration: "none", color: "inherit",
        borderLeft: `3px solid ${hovered ? groupColor : "transparent"}`,
        transition: "all 0.25s ease",
        animation: `rowIn 0.35s ease ${delay}s both`,
        cursor: "pointer",
      }}
    >
      <span style={{
        width: 36, height: 36, borderRadius: 8,
        background: groupColor + "14",
        color: groupColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, fontFamily: "var(--mono)",
      }}>
        {String(mod.id).padStart(2, "0")}
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-1)",
          fontFamily: "var(--heading)", lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {mod.name}
        </p>
        <p style={{
          margin: "3px 0 5px", fontSize: 12, color: "var(--text-3)", lineHeight: 1.4,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {mod.desc}
        </p>
        <div>{mod.stack.split(" + ").map((t, i) => <StackTag key={i} text={t.trim()} />)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusBadge status={mod.status} />
        <span style={{
          fontSize: 16, color: "var(--text-3)",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
        }}>→</span>
      </div>
    </a>
  );
};

const GroupSection = ({ group, isOpen, onToggle, searchTerm }) => {
  const filtered = group.modules.filter(m =>
    !searchTerm || m.name.toLowerCase().includes(searchTerm) || m.desc.toLowerCase().includes(searchTerm) || m.stack.toLowerCase().includes(searchTerm)
  );
  if (searchTerm && filtered.length === 0) return null;

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: 14,
      border: "1px solid var(--border)",
      overflow: "hidden",
      transition: "box-shadow 0.3s ease",
      boxShadow: isOpen ? `0 4px 24px -8px ${group.color}18` : "none",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 14,
          padding: "18px 22px",
          background: isOpen ? group.color + "08" : "transparent",
          transition: "background 0.2s",
          borderBottom: isOpen ? `1px solid var(--border)` : "none",
        }}
      >
        <span style={{
          width: 40, height: 40, borderRadius: 10,
          background: group.color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {group.icon}
        </span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: group.color,
              fontFamily: "var(--mono)", letterSpacing: "0.08em",
            }}>
              GRUPO {group.id}
            </span>
            <span style={{
              fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)",
            }}>
              {filtered.length} módulo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p style={{
            margin: "2px 0 0", fontSize: 15, fontWeight: 600,
            color: "var(--text-1)", fontFamily: "var(--heading)",
          }}>
            {group.name}
          </p>
        </div>
        <span style={{
          fontSize: 18, color: "var(--text-3)",
          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.3s ease",
        }}>
          ▾
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "8px 8px 12px" }}>
          {filtered.map((m, i) => (
            <ModuleRow key={m.id} mod={m} groupColor={group.color} delay={i * 0.04} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [openGroups, setOpenGroups] = useState(["A", "B"]);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const toggle = (id) =>
    setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const expandAll = () => setOpenGroups(GROUPS.map(g => g.id));
  const collapseAll = () => setOpenGroups([]);

  const searchLower = search.toLowerCase();

  return (
    <div style={{
      "--heading": "'Outfit', 'Segoe UI', sans-serif",
      "--body": "'Source Sans 3', 'Segoe UI', sans-serif",
      "--mono": "'IBM Plex Mono', 'SF Mono', monospace",
      "--bg": "#F4F5F7",
      "--card": "#FFFFFF",
      "--surface-2": "#EFF1F5",
      "--surface-hover": "#F7F8FA",
      "--border": "#E2E5EB",
      "--text-1": "#1A1D2B",
      "--text-2": "#4A5068",
      "--text-3": "#8890A5",
      "--accent": "#1B6B4A",
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--body)",
      color: "var(--text-1)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        @keyframes rowIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #CBD0DC; border-radius: 3px; }
        input::placeholder { color: var(--text-3); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background: "#1A1D2B",
        color: "#fff",
        padding: "0",
        animation: "fadeUp 0.4s ease both",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "22px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: "linear-gradient(135deg, #1B6B4A, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff",
              fontFamily: "var(--heading)",
              boxShadow: "0 2px 12px #1B6B4A44",
            }}>
              S3D
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: 18, fontWeight: 700,
                fontFamily: "var(--heading)", letterSpacing: "-0.02em",
              }}>
                Plataforma Gestión Integrada
              </h1>
              <p style={{
                margin: 0, fontSize: 12, opacity: 0.55,
                fontFamily: "var(--mono)", letterSpacing: "0.03em",
              }}>
                CONVENIO ETH-ANH 2026 — SINAPSIS3D × FWRTS
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{
              fontSize: 12, opacity: 0.5, fontFamily: "var(--mono)",
            }}>
              {time.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })} · {time.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        {/* accent bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #1B6B4A, #0891B2, #9333EA, #DC2626, #B45309)" }} />
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 60px" }}>

        {/* KPI ROW */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12, marginBottom: 24,
        }}>
          {[
            { label: "Total módulos", value: totalModules, color: "#1A1D2B" },
            { label: "Grupos", value: "9", color: "#1B6B4A" },
            { label: "Nuevos", value: countByStatus("nuevo"), color: "#3B82F6" },
            { label: "A adaptar", value: countByStatus("adaptar"), color: "#F59E0B" },
            { label: "Reutilizar", value: countByStatus("reutilizar"), color: "#10B981" },
            { label: "Avance global", value: "12%", color: "#9333EA" },
          ].map((k, i) => (
            <div key={i} style={{
              background: "var(--card)", borderRadius: 12, padding: "16px 18px",
              border: "1px solid var(--border)",
              animation: `fadeUp 0.35s ease ${0.1 + i * 0.05}s both`,
            }}>
              <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {k.label}
              </span>
              <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 800, color: k.color, fontFamily: "var(--heading)", lineHeight: 1 }}>
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* SEARCH & CONTROLS */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 20, flexWrap: "wrap",
          animation: "fadeUp 0.4s ease 0.3s both",
        }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--text-3)" }}>⌕</span>
            <input
              type="text"
              placeholder="Buscar módulo, herramienta o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px 12px 40px",
                border: "1px solid var(--border)", borderRadius: 10,
                fontSize: 14, fontFamily: "var(--body)",
                background: "var(--card)", color: "var(--text-1)",
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1B6B4A88"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <button onClick={expandAll} style={{
            padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--card)", fontSize: 12, fontWeight: 600,
            fontFamily: "var(--mono)", cursor: "pointer", color: "var(--text-2)",
          }}>
            ▸ Expandir todo
          </button>
          <button onClick={collapseAll} style={{
            padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--card)", fontSize: 12, fontWeight: 600,
            fontFamily: "var(--mono)", cursor: "pointer", color: "var(--text-2)",
          }}>
            ▾ Colapsar
          </button>
        </div>

        {/* GROUP NAV PILLS */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 20, overflowX: "auto",
          paddingBottom: 4,
          animation: "fadeUp 0.4s ease 0.35s both",
        }}>
          {GROUPS.map(g => (
            <button
              key={g.id}
              onClick={() => {
                if (!openGroups.includes(g.id)) toggle(g.id);
                document.getElementById(`group-${g.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: g.color + "14", color: g.color,
                fontSize: 12, fontWeight: 600, fontFamily: "var(--mono)",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {g.icon} {g.id}
            </button>
          ))}
        </div>

        {/* GROUPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {GROUPS.map(g => (
            <div key={g.id} id={`group-${g.id}`}>
              <GroupSection
                group={g}
                isOpen={openGroups.includes(g.id) || !!searchLower}
                onToggle={() => toggle(g.id)}
                searchTerm={searchLower}
              />
            </div>
          ))}
        </div>

        {/* STACK LEGEND */}
        <div style={{
          marginTop: 32, padding: "20px 24px",
          background: "var(--card)", borderRadius: 14,
          border: "1px solid var(--border)",
          animation: "fadeUp 0.4s ease 0.5s both",
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: "var(--text-3)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Stack tecnológico del convenio
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Google Sheets", "Google Forms", "Looker Studio", "Google Drive", "Apps Script", "Moodle LMS", "Maps API", "Gemini API", "Google Workspace"].map(t => (
              <span key={t} style={{
                padding: "6px 14px", borderRadius: 8,
                background: "var(--surface-2)", fontSize: 12,
                fontWeight: 500, color: "var(--text-2)",
                fontFamily: "var(--mono)",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
