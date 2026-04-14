/* =====================================================================
   CONFIGURACION DE USUARIOS Y GRUPOS - CONVENIO ETH-ANH 2026
   ===================================================================== */

// >>> PEGA AQUI TU URL DE GOOGLE APPS SCRIPT <<<
export const APPS_SCRIPT_URL = "";

// >>> USUARIOS DE PRUEBA <<<
export const LOCAL_USERS = [
  { email: "admin@sinapsis3d.com", password: "admin2026", rol: "admin", nombre: "Administrador S3D" },
  { email: "coordinador@fwrts.org", password: "coord2026", rol: "coordinador", nombre: "Coordinador ETH" },
  { email: "profesional@convenio.com", password: "prof2026", rol: "profesional", nombre: "Prof. Campo" },
];

// Estados y sus colores
export const STATUS_STYLES = {
  nuevo: { l: "Nuevo", bg: "#EFF6FF", c: "#1E40AF", d: "#3B82F6" },
  adaptar: { l: "Adaptar", bg: "#FFFBEB", c: "#92400E", d: "#F59E0B" },
  reutilizar: { l: "Reutilizar", bg: "#ECFDF5", c: "#065F46", d: "#10B981" }
};

// ── GRUPO A: Diagnostico y Territorio (verde #1B6B4A) ──
export const GROUPS = [
  {
    id: "A",
    name: "Diagnostico y Territorio",
    color: "#1B6B4A",
    icon: "A",
    modules: [
      { id: 1, name: "Linea diagnostica territorial", desc: "Caracterizacion socioeconomica y ambiental", stack: "Sheets+Forms+Looker", status: "nuevo", url: "#" },
      { id: 2, name: "Lineas base e impacto", desc: "KPIs cadena valor DNP. Medicion brechas", stack: "Sheets+Looker", status: "nuevo", url: "#" },
      { id: 3, name: "Georeferenciacion y mapeo", desc: "Google Maps + Looker. Capas E&P, CARs, PDET", stack: "Looker+Maps", status: "adaptar", url: "#" },
      { id: 4, name: "Cluster productivo", desc: "Mercado, exportables, TLC, vocacion productiva", stack: "Sheets+Forms", status: "nuevo", url: "#" },
      { id: 5, name: "Recabo info campo", desc: "Fichas producto, encuestas, fitosanitarios", stack: "Forms+Sheets", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "B",
    name: "Nucleo Estrategico ANH",
    color: "#B45309",
    icon: "B",
    modules: [
      { id: 6, name: "Lineamientos ambientales", desc: "Planes CARs. Estudios E&P. Repositorio", stack: "Sheets+Drive+Looker", status: "adaptar", url: "#" },
      { id: 7, name: "Inversion social territorial", desc: "Iniciativas. Actas/fotos. Diversificacion", stack: "Sheets+Forms+Looker", status: "reutilizar", url: "#" },
      { id: 8, name: "Conflictividad y dialogo", desc: "Alertas SLA. 4 lineas ETH. Acuerdos", stack: "Sheets+Looker", status: "adaptar", url: "#" },
      { id: 9, name: "Marco logico proyectos", desc: "Arbol problemas. MGA-DNP. Gantt", stack: "Sheets+Forms", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "C",
    name: "Formacion y Capacitacion",
    color: "#7C3AED",
    icon: "C",
    modules: [
      { id: 10, name: "Moodle — Beneficiarios", desc: "Cursos productivos, emprendimiento, certificaciones", stack: "Moodle LMS", status: "adaptar", url: "#" },
      { id: 11, name: "Moodle — Comunidades", desc: "Derechos, participacion, medio ambiente", stack: "Moodle LMS", status: "nuevo", url: "#" },
      { id: 12, name: "Moodle — Personal convenio", desc: "Induccion ETH, protocolos, HSE", stack: "Moodle LMS", status: "adaptar", url: "#" },
      { id: 13, name: "Cluster exportacion", desc: "Planes negocio, ferias internacionales", stack: "Sheets+Forms+Drive", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "D",
    name: "Actores y Talento Humano",
    color: "#0369A1",
    icon: "D",
    modules: [
      { id: 14, name: "Gestion beneficiarios", desc: "Registro, consentimientos, segmentacion", stack: "Sheets+Forms+Looker", status: "reutilizar", url: "#" },
      { id: 15, name: "Directorio actores", desc: "Operadoras, comunidades, autoridades", stack: "Sheets+Looker", status: "nuevo", url: "#" },
      { id: 16, name: "Enfoque diferencial", desc: "Protocolos etnicos. Consulta previa", stack: "Sheets+Forms+Drive", status: "nuevo", url: "#" },
      { id: 17, name: "Seleccion hojas de vida", desc: "CVs. Evaluacion perfiles. Calificacion", stack: "Forms+Sheets", status: "nuevo", url: "#" },
      { id: 18, name: "Gestion personal", desc: "Equipo, seguridad social, salarios", stack: "Sheets+Looker", status: "adaptar", url: "#" },
      { id: 19, name: "Entidades aliadas", desc: "CARs 8 regiones. Estado alianzas", stack: "Sheets+Looker", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "E",
    name: "Financiero y Gobernanza",
    color: "#DC2626",
    icon: "E",
    modules: [
      { id: 20, name: "Admin y seguridad", desc: "Roles, permisos, auditoria, MFA", stack: "Script+Sheets", status: "reutilizar", url: "#" },
      { id: 21, name: "Seguimiento y monitoreo", desc: "Hitos, % avance, semaforos", stack: "Sheets+Looker", status: "reutilizar", url: "#" },
      { id: 22, name: "Gestion financiera", desc: "Presupuesto, desembolsos 20/30/40/10", stack: "Sheets+Looker", status: "nuevo", url: "#" },
      { id: 23, name: "Cuentas de cobro", desc: "Radicacion, verificacion SS, aprobacion", stack: "Forms+Sheets+Script", status: "nuevo", url: "#" },
      { id: 24, name: "Comite coordinacion", desc: "Sesiones mensuales. Actas. Quorum", stack: "Sheets+Drive", status: "nuevo", url: "#" },
      { id: 25, name: "Contratacion ESAL", desc: "Subcontratos, TdR, minutas", stack: "Sheets+Drive", status: "nuevo", url: "#" },
      { id: 26, name: "Gestion riesgos", desc: "CONPES 3714. Alertas. Mitigacion", stack: "Sheets+Looker", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "F",
    name: "Informes y Rendicion",
    color: "#0891B2",
    icon: "F",
    modules: [
      { id: 27, name: "Informes funcionarios", desc: "Radicacion > revision > aprobacion", stack: "Forms+Sheets+Drive", status: "nuevo", url: "#" },
      { id: 28, name: "Informes ANH", desc: "Compilador 4 desembolsos automatico", stack: "Script+Sheets", status: "nuevo", url: "#" },
      { id: 29, name: "Gestion conocimiento", desc: "Metodologias, casos exito, lecciones", stack: "Drive+Sheets+Moodle", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "G",
    name: "Operacion Territorial",
    color: "#059669",
    icon: "G",
    modules: [
      { id: 30, name: "Eventos y agenda", desc: "Talleres, foros, convocatoria, asistencia", stack: "Forms+Sheets+Looker", status: "nuevo", url: "#" },
      { id: 31, name: "Logistica territorial", desc: "Transporte, alojamiento, refrigerios", stack: "Forms+Sheets", status: "nuevo", url: "#" },
      { id: 32, name: "Comunicaciones", desc: "Piezas, campanas, presencia digital", stack: "Drive+Sheets", status: "nuevo", url: "#" },
      { id: 33, name: "HSE seguridad y salud", desc: "Protocolos, incidentes, emergencias", stack: "Forms+Sheets", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "H",
    name: "Documentacion y Cierre",
    color: "#6D28D9",
    icon: "H",
    modules: [
      { id: 34, name: "Gestion documental", desc: "Drive jerarquico. Alertas. Gemini API", stack: "Drive+Script+Gemini", status: "reutilizar", url: "#" },
      { id: 35, name: "Inventarios y bienes", desc: "Res. 0532/2024. Trazabilidad equipos", stack: "Sheets+Looker", status: "adaptar", url: "#" },
      { id: 36, name: "Polizas y garantias", desc: "Cumplimiento, calidad, salarios. Vigencias", stack: "Sheets", status: "nuevo", url: "#" },
      { id: 37, name: "Liquidacion y cierre", desc: "Checklist, acta, balance, paz y salvo", stack: "Sheets+Drive", status: "nuevo", url: "#" },
    ]
  },
  {
    id: "I",
    name: "Infraestructura TI",
    color: "#475569",
    icon: "I",
    modules: [
      { id: 38, name: "Mesa de ayuda", desc: "Tickets SLA. FAQ. Soporte 24/7", stack: "Forms+Sheets+Looker", status: "reutilizar", url: "#" },
      { id: 39, name: "Infraestructura cloud", desc: "Workspace. Backups. 99.5% SLA", stack: "Google Workspace", status: "adaptar", url: "#" },
    ]
  },
];
