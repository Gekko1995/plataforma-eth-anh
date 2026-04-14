import { useState, useEffect } from "react";
import Login from "./components/Login";
import NavItem from "./components/NavItem";
import Gauge from "./components/Gauge";
import MiniBarChart from "./components/MiniBarChart";
import { GROUPS, STATUS_STYLES } from "./data/constants";
import { authUser, addLog, getLogs, clearLogs } from "./utils/auth";
import { globalStyles, styles } from "./styles/globalStyles";

/* =====================================================================
   PLATAFORMA DE GESTION INTEGRADA — CONVENIO ETH-ANH 2026
   SINAPSIS3D S.A.S. para Fundacion WR Tejido Social
   
   VERSION REFACTORIZADA con:
   - Componentes separados
   - Diseño responsive (móvil, tablet, desktop)
   - Mejor organización del código
   ===================================================================== */

const total = GROUPS.reduce((a, g) => a + g.modules.length, 0);
const countSt = s => GROUPS.reduce((a, g) => a + g.modules.filter(m => m.status === s).length, 0);

export default function App() {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [sideOpen, setSideOpen] = useState(true);
  const [openG, setOpenG] = useState(["A"]);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      // En móvil, cerrar sidebar por defecto
      if (window.innerWidth < 768) {
        setSideOpen(false);
      }
    };
    
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const s = localStorage.getItem("eth_user");
    if (s) setUser(JSON.parse(s));
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const login = async (em, pw) => {
    setLoading(true);
    setErr("");
    const r = await authUser(em, pw);
    setLoading(false);
    if (r.ok) {
      const ud = { ...r.user, loginAt: new Date().toISOString() };
      setUser(ud);
      localStorage.setItem("eth_user", JSON.stringify(ud));
      addLog(ud, "LOGIN");
    } else setErr(r.error);
  };

  const logout = () => {
    addLog(user, "LOGOUT");
    setUser(null);
    localStorage.removeItem("eth_user");
  };

  const togG = id => setOpenG(p => (p.includes(id) ? p.filter(g => g !== id) : [...p, id]));
  const logs = getLogs();

  if (!user) return <Login onLogin={login} error={err} loading={loading} />;

  const sl = search.toLowerCase();
  const greeting = time.getHours() < 12 ? "Buenos dias" : time.getHours() < 18 ? "Buenas tardes" : "Buenas noches";

  // Cerrar sidebar en móvil al hacer clic en overlay
  const closeSidebarMobile = () => {
    if (isMobile) setSideOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Bricolage Grotesque',sans-serif", background: "#F0F2F8" }}>
      <style>{globalStyles}</style>

      {/* Overlay para móvil */}
      {isMobile && <div style={styles.overlay(sideOpen)} onClick={closeSidebarMobile} />}

      {/* SIDEBAR */}
      <aside style={styles.sidebar(sideOpen, isMobile)}>
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #E8EBF2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#4F6EF7,#7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                color: "#fff"
              }}
            >
              S3D
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1D2B" }}>ETH-ANH 2026</p>
              <p style={{ fontSize: 10, color: "#8890A5", fontFamily: "'IBM Plex Mono',monospace" }}>Gestion Integrada</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 12px 8px" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#A0A5BD",
              padding: "0 8px 6px",
              fontFamily: "'IBM Plex Mono',monospace",
              textTransform: "uppercase",
              letterSpacing: ".08em"
            }}
          >
            Menu
          </p>
          <NavItem
            icon="~"
            label="Dashboard"
            active={page === "home"}
            onClick={() => {
              setPage("home");
              closeSidebarMobile();
            }}
          />
          <NavItem
            icon="#"
            label="Modulos"
            active={page === "modulos"}
            onClick={() => {
              setPage("modulos");
              closeSidebarMobile();
            }}
            badge={total}
          />
          <NavItem
            icon="%"
            label="Metricas"
            active={page === "metricas"}
            onClick={() => {
              setPage("metricas");
              closeSidebarMobile();
            }}
          />
          <NavItem
            icon="!"
            label="Registro accesos"
            active={page === "log"}
            onClick={() => {
              setPage("log");
              closeSidebarMobile();
            }}
            badge={logs.length || null}
          />
        </div>

        <div style={{ padding: "4px 12px", overflowY: "auto", flex: 1 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#A0A5BD",
              padding: "8px 8px 6px",
              fontFamily: "'IBM Plex Mono',monospace",
              textTransform: "uppercase",
              letterSpacing: ".08em"
            }}
          >
            Grupos
          </p>
          {GROUPS.map(g => (
            <NavItem
              key={g.id}
              icon={g.icon}
              label={`${g.id}. ${g.name}`}
              active={page === "grupo_" + g.id}
              onClick={() => {
                setPage("modulos");
                setOpenG([g.id]);
                closeSidebarMobile();
                setTimeout(() => document.getElementById("g-" + g.id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #E8EBF2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#4F6EF7,#7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700
              }}
            >
              {user.nombre.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1D2B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.nombre}
              </p>
              <p style={{ fontSize: 10, color: "#8890A5", fontFamily: "'IBM Plex Mono',monospace" }}>{user.rol}</p>
            </div>
            <button onClick={logout} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#A0A5BD", padding: 4 }} title="Cerrar sesion">
              {"\u23FB"}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={styles.header(isMobile)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: isMobile ? "1" : "auto" }}>
            <button
              onClick={() => setSideOpen(!sideOpen)}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8890A5" }}
            >
              {"\u2630"}
            </button>
            {!isMobile && (
              <div style={{ position: "relative", minWidth: 260 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#A0A5BD" }}>
                  {"\u2315"}
                </span>
                <input
                  type="text"
                  placeholder="Buscar modulos..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    if (e.target.value) setPage("modulos");
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 14px 9px 36px",
                    borderRadius: 10,
                    border: "1px solid #E8EBF2",
                    background: "#F7F8FB",
                    fontSize: 13,
                    fontFamily: "inherit",
                    color: "#1A1D2B",
                    outline: "none"
                  }}
                  onFocus={e => (e.target.style.borderColor = "#4F6EF7")}
                  onBlur={e => (e.target.style.borderColor = "#E8EBF2")}
                />
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16 }}>
            <span style={{ fontSize: isMobile ? 11 : 12, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>
              {time.toLocaleDateString("es-CO", { weekday: isMobile ? undefined : "short", day: "numeric", month: "short" })}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "#ECFDF5",
                borderRadius: 20,
                fontSize: 11,
                color: "#065F46",
                fontWeight: 600
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} /> En linea
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={styles.container(isMobile)}>
          {/* HOME PAGE */}
          {page === "home" && (
            <div style={{ animation: "fadeIn .4s ease both" }}>
              <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: "#1A1D2B", marginBottom: 4 }}>
                {greeting}, {user.nombre}
              </h2>
              <p style={{ fontSize: 13, color: "#8890A5", marginBottom: 24 }}>Convenio ETH-ANH 2026 — Panel de control general</p>

              {/* KPI Cards */}
              <div style={styles.kpiGrid(isMobile, isTablet)}>
                {[
                  { label: "Modulos totales", value: total, color: "#4F6EF7", delta: "+2 este mes" },
                  { label: "Nuevos por construir", value: countSt("nuevo"), color: "#3B82F6", delta: "72% del total" },
                  { label: "Adaptaciones", value: countSt("adaptar"), color: "#F59E0B", delta: "En progreso" },
                  { label: "Reutilizables", value: countSt("reutilizar"), color: "#10B981", delta: "Listos" },
                  { label: "Usuarios activos", value: "156", color: "#7C3AED", delta: "+12 esta semana" },
                  { label: "Avance global", value: "12%", color: "#DC2626", delta: "Meta: 35%" }
                ].map((k, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.card(isMobile),
                      animation: `fadeIn .35s ease ${0.1 + i * 0.06}s both`
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#A0A5BD",
                        fontFamily: "'IBM Plex Mono',monospace",
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                        marginBottom: 8
                      }}
                    >
                      {k.label}
                    </p>
                    <p style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</p>
                    <p style={{ fontSize: 11, color: "#8890A5", marginTop: 4 }}>{k.delta}</p>
                  </div>
                ))}
              </div>

              {/* Looker Studio Embed */}
              <div style={{ ...styles.card(isMobile), marginBottom: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Datos de interes</p>
                <iframe
                  src="https://lookerstudio.google.com/embed/reporting/2b97e06b-d56f-4f2a-ac73-84942060d75e/page/rzP6E"
                  width="100%"
                  height={isMobile ? "500" : "800"}
                  style={{ border: "none", borderRadius: 8 }}
                  allowFullScreen
                />
              </div>

              {/* Charts row */}
              <div style={isMobile ? { display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 } : styles.chartGrid(isMobile)}>
                {/* Bar chart */}
                <div style={styles.card(isMobile)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1D2B" }}>Modulos por grupo</p>
                      <p style={{ fontSize: 11, color: "#A0A5BD" }}>Distribucion de los 39 modulos</p>
                    </div>
                  </div>
                  <MiniBarChart data={GROUPS.map(g => g.modules.length)} color="#4F6EF7" height={120} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    {GROUPS.map(g => (
                      <span key={g.id} style={{ fontSize: 10, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>
                        {g.id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status distribution */}
                <div style={styles.card(isMobile)}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1D2B", marginBottom: 4 }}>Estado de desarrollo</p>
                  <p style={{ fontSize: 11, color: "#A0A5BD", marginBottom: 16 }}>Progreso por categoria</p>
                  {[
                    { l: "Nuevos", v: countSt("nuevo"), c: "#3B82F6" },
                    { l: "Adaptar", v: countSt("adaptar"), c: "#F59E0B" },
                    { l: "Reutilizar", v: countSt("reutilizar"), c: "#10B981" }
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#4A5068" }}>{s.l}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: s.c }}>{s.v} modulos</span>
                      </div>
                      <div style={{ height: 8, background: "#F0F2F8", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(s.v / total) * 100}%`, background: s.c, borderRadius: 4, transition: "width .8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gauge */}
                <div
                  style={{
                    ...styles.card(isMobile),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1D2B", marginBottom: 12 }}>Avance general</p>
                  <Gauge value={12} max={100} label="del convenio" color="#4F6EF7" />
                  <p style={{ fontSize: 11, color: "#10B981", fontWeight: 600, marginTop: 8 }}>En tiempo segun cronograma</p>
                </div>
              </div>

              {/* Recent activity */}
              <div style={styles.card(isMobile)}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1D2B", marginBottom: 14 }}>Actividad reciente</p>
                {logs.slice(0, 6).map((l, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: i < 5 ? "1px solid #F0F2F8" : "none"
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: l.modulo === "LOGIN" ? "#10B981" : l.modulo === "LOGOUT" ? "#F87171" : "#4F6EF7",
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: isMobile ? 12 : 13, color: "#1A1D2B", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <strong>{l.nombre}</strong> —{" "}
                        {l.modulo === "LOGIN" ? "Inicio sesion" : l.modulo === "LOGOUT" ? "Cerro sesion" : `Accedio a ${l.modulo}`}
                      </p>
                    </div>
                    <span style={{ fontSize: 10, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0 }}>
                      {new Date(l.ts).toLocaleString("es-CO", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
                {logs.length === 0 && <p style={{ fontSize: 13, color: "#A0A5BD", textAlign: "center", padding: 20 }}>Los accesos a modulos aparaceran aqui</p>}
              </div>
            </div>
          )}

          {/* MODULES PAGE */}
          {page === "modulos" && (
            <div style={{ animation: "fadeIn .4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: "#1A1D2B" }}>Modulos del convenio</h2>
                  <p style={{ fontSize: 13, color: "#8890A5" }}>
                    {total} modulos en {GROUPS.length} grupos
                  </p>
                </div>
                {!isMobile && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setOpenG(GROUPS.map(g => g.id))}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #E8EBF2",
                        background: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "#4A5068"
                      }}
                    >
                      Expandir todo
                    </button>
                    <button
                      onClick={() => setOpenG([])}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #E8EBF2",
                        background: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "#4A5068"
                      }}
                    >
                      Colapsar
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {GROUPS.map(g => {
                  const filt = g.modules.filter(
                    m =>
                      !sl ||
                      m.name.toLowerCase().includes(sl) ||
                      m.desc.toLowerCase().includes(sl) ||
                      m.stack.toLowerCase().includes(sl)
                  );
                  if (sl && filt.length === 0) return null;
                  const isO = openG.includes(g.id) || !!sl;
                  return (
                    <div
                      key={g.id}
                      id={"g-" + g.id}
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #E8EBF2",
                        overflow: "hidden",
                        boxShadow: isO ? `0 4px 20px -8px ${g.color}12` : "none"
                      }}
                    >
                      <button
                        onClick={() => togG(g.id)}
                        style={{
                          width: "100%",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: isMobile ? "14px 16px" : "16px 20px",
                          background: isO ? g.color + "08" : "transparent",
                          borderBottom: isO ? "1px solid #E8EBF2" : "none"
                        }}
                      >
                        <span
                          style={{
                            width: isMobile ? 32 : 38,
                            height: isMobile ? 32 : 38,
                            borderRadius: 10,
                            background: g.color + "16",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: isMobile ? 16 : 18,
                            flexShrink: 0
                          }}
                        >
                          {g.icon}
                        </span>
                        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: g.color, fontFamily: "'IBM Plex Mono',monospace" }}>
                              GRUPO {g.id}
                            </span>
                            <span style={{ fontSize: 11, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>{filt.length} mod.</span>
                          </div>
                          <p style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: "#1A1D2B", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {g.name}
                          </p>
                        </div>
                        <span style={{ fontSize: 16, color: "#A0A5BD", transform: isO ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
                          {"\u25BE"}
                        </span>
                      </button>
                      {isO && (
                        <div style={{ padding: "6px 8px 10px" }}>
                          {filt.map(m => {
                            const st = STATUS_STYLES[m.status];
                            return (
                              <a
                                key={m.id}
                                href={m.url}
                                onClick={e => {
                                  e.preventDefault();
                                  addLog(user, m.name);
                                  window.open(m.url, "_blank");
                                }}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: isMobile ? "34px 1fr auto" : "40px 1fr auto",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: isMobile ? "10px 12px" : "12px 16px",
                                  borderRadius: 10,
                                  textDecoration: "none",
                                  color: "inherit",
                                  cursor: "pointer",
                                  transition: "background .15s",
                                  borderLeft: "3px solid transparent"
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = "#F7F8FB";
                                  e.currentTarget.style.borderLeftColor = g.color;
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.borderLeftColor = "transparent";
                                }}
                              >
                                <span
                                  style={{
                                    width: isMobile ? 30 : 34,
                                    height: isMobile ? 30 : 34,
                                    borderRadius: 8,
                                    background: g.color + "12",
                                    color: g.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: isMobile ? 11 : 13,
                                    fontWeight: 700,
                                    fontFamily: "'IBM Plex Mono',monospace"
                                  }}
                                >
                                  {String(m.id).padStart(2, "0")}
                                </span>
                                <div style={{ minWidth: 0 }}>
                                  <p
                                    style={{
                                      fontSize: isMobile ? 12 : 13,
                                      fontWeight: 600,
                                      color: "#1A1D2B",
                                      lineHeight: 1.3,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {m.name}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: isMobile ? 10 : 11,
                                      color: "#8890A5",
                                      margin: "2px 0 4px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {m.desc}
                                  </p>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                                    {m.stack.split("+").map((t, j) => (
                                      <span
                                        key={j}
                                        style={{
                                          display: "inline-block",
                                          padding: "1px 7px",
                                          borderRadius: 4,
                                          fontSize: isMobile ? 9 : 10,
                                          background: "#F0F2F8",
                                          color: "#6B7194",
                                          fontFamily: "'IBM Plex Mono',monospace"
                                        }}
                                      >
                                        {t.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "3px 9px",
                                    borderRadius: 6,
                                    fontSize: isMobile ? 9 : 10,
                                    fontWeight: 600,
                                    background: st.bg,
                                    color: st.c,
                                    fontFamily: "'IBM Plex Mono',monospace",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.d }} />
                                  {st.l}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* METRICS PAGE */}
          {page === "metricas" && (
            <div style={{ animation: "fadeIn .4s ease both" }}>
              <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: "#1A1D2B", marginBottom: 20 }}>Metricas del convenio</h2>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <div style={styles.card(isMobile)}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Desembolsos ANH</p>
                  {[
                    { l: "D1 — Plan trabajo", p: 100, c: "#10B981" },
                    { l: "D2 — Avance 35%", p: 45, c: "#4F6EF7" },
                    { l: "D3 — Avance 70%", p: 0, c: "#A0A5BD" },
                    { l: "D4 — Final 100%", p: 0, c: "#A0A5BD" }
                  ].map((d, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#4A5068" }}>{d.l}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: d.c }}>{d.p}%</span>
                      </div>
                      <div style={{ height: 6, background: "#F0F2F8", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: d.p + "%", background: d.c, borderRadius: 3, transition: "width .6s" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.card(isMobile)}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Stack tecnologico</p>
                  {[
                    { l: "Google Sheets", v: 28 },
                    { l: "Google Forms", v: 16 },
                    { l: "Looker Studio", v: 14 },
                    { l: "Google Drive", v: 10 },
                    { l: "Moodle LMS", v: 3 },
                    { l: "Apps Script", v: 4 }
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#4A5068", minWidth: isMobile ? 90 : 110 }}>{s.l}</span>
                      <div style={{ flex: 1, height: 6, background: "#F0F2F8", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${(s.v / 28) * 100}%`, background: "#4F6EF7", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#4F6EF7", fontFamily: "'IBM Plex Mono',monospace" }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LOG PAGE */}
          {page === "log" && (
            <div style={{ animation: "fadeIn .4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: "#1A1D2B" }}>Registro de accesos</h2>
                  <p style={{ fontSize: 13, color: "#8890A5" }}>{logs.length} registros</p>
                </div>
                {logs.length > 0 && (
                  <button
                    onClick={() => {
                      clearLogs();
                      setPage("home");
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #FCA5A5",
                      background: "#FEF2F2",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "#DC2626"
                    }}
                  >
                    Limpiar registros
                  </button>
                )}
              </div>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EBF2", overflow: isMobile ? "auto" : "hidden" }}>
                {!isMobile ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 160px",
                        padding: "12px 20px",
                        background: "#F7F8FB",
                        borderBottom: "1px solid #E8EBF2",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#A0A5BD",
                        fontFamily: "'IBM Plex Mono',monospace",
                        textTransform: "uppercase"
                      }}
                    >
                      <span>Usuario</span>
                      <span>Accion</span>
                      <span>Rol</span>
                      <span>Fecha / Hora</span>
                    </div>
                    {logs.slice(0, 50).map((l, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 160px",
                          padding: "12px 20px",
                          borderBottom: "1px solid #F0F2F8",
                          fontSize: 13,
                          alignItems: "center"
                        }}
                      >
                        <span style={{ fontWeight: 500, color: "#1A1D2B" }}>{l.nombre}</span>
                        <span style={{ color: l.modulo === "LOGIN" ? "#10B981" : l.modulo === "LOGOUT" ? "#DC2626" : "#4F6EF7", fontWeight: 500 }}>
                          {l.modulo === "LOGIN" ? "Inicio sesion" : l.modulo === "LOGOUT" ? "Cerro sesion" : l.modulo}
                        </span>
                        <span style={{ fontSize: 11, color: "#8890A5", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" }}>{l.rol}</span>
                        <span style={{ fontSize: 11, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>
                          {new Date(l.ts).toLocaleString("es-CO")}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ padding: "12px" }}>
                    {logs.slice(0, 50).map((l, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "12px",
                          borderBottom: i < logs.length - 1 ? "1px solid #F0F2F8" : "none",
                          marginBottom: 8
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: "#1A1D2B", fontSize: 13 }}>{l.nombre}</span>
                          <span style={{ fontSize: 10, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>{l.rol}</span>
                        </div>
                        <div style={{ fontSize: 12, color: l.modulo === "LOGIN" ? "#10B981" : l.modulo === "LOGOUT" ? "#DC2626" : "#4F6EF7", marginBottom: 2 }}>
                          {l.modulo === "LOGIN" ? "Inicio sesion" : l.modulo === "LOGOUT" ? "Cerro sesion" : l.modulo}
                        </div>
                        <div style={{ fontSize: 10, color: "#8890A5", fontFamily: "'IBM Plex Mono',monospace" }}>
                          {new Date(l.ts).toLocaleString("es-CO")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {logs.length === 0 && <p style={{ padding: 40, textAlign: "center", color: "#A0A5BD", fontSize: 13 }}>Sin registros aun</p>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
