import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';

/* ── Isotipo ETH-ANH inline SVG ── */
function EthAnhIsotipo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="white" fillOpacity="0.15" />
      {/* E */}
      <rect x="8" y="11" width="10" height="2.5" rx="1" fill="white" />
      <rect x="8" y="18.75" width="8" height="2.5" rx="1" fill="white" />
      <rect x="8" y="26.5" width="10" height="2.5" rx="1" fill="white" />
      <rect x="8" y="11" width="2.5" height="18" rx="1" fill="white" />
      {/* H */}
      <rect x="21" y="11" width="2.5" height="18" rx="1" fill="white" />
      <rect x="21" y="18.75" width="8" height="2.5" rx="1" fill="white" />
      <rect x="26.5" y="11" width="2.5" height="18" rx="1" fill="white" />
    </svg>
  );
}

/* ── Ícono usuario ── */
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

/* ── Ícono candado ── */
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/* ── Ícono ojo ── */
function IconEye({ closed }) {
  return closed ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const INPUT_BASE = {
  width: "100%",
  padding: "11px 14px 11px 42px",
  borderRadius: 10,
  border: "1.5px solid #e2e8f0",
  background: "#f8fafc",
  color: "#1e293b",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color .15s",
  boxSizing: "border-box",
};

/**
 * Pantalla de Login — diseño split-panel
 */
export default function Login({ onLogin, error, loading }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <>
      <style>{`
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinLogin { to { transform: rotate(360deg); } }
        .login-input:focus { border-color: #1d6ae5 !important; background: #fff !important; }
        .login-btn-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .login-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .login-forgot:hover { color: #1d6ae5 !important; }
        @media (max-width: 700px) {
          .login-panel-left  { display: none !important; }
          .login-card        { border-radius: 0 !important; max-width: 100% !important; min-height: 100dvh !important; }
          .login-panel-right { padding: 32px 24px !important; }
        }
      `}</style>

      {/* Fondo azul de página */}
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1565C0 0%, #0a3a8a 60%, #082f6e 100%)",
        padding: "24px 16px",
        fontFamily: "'Outfit', 'Bricolage Grotesque', sans-serif",
      }}>
        {/* Tarjeta split */}
        <div className="login-card" style={{
          display: "flex",
          width: "100%",
          maxWidth: 860,
          minHeight: 520,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "loginFadeUp .55s ease both",
        }}>

          {/* ── Panel izquierdo decorativo ── */}
          <div className="login-panel-left" style={{
            flex: "0 0 46%",
            background: "linear-gradient(145deg, #1976D2 0%, #1251a3 50%, #0d3d85 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 40px 36px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Círculos decorativos */}
            <div style={{
              position: "absolute", bottom: -60, left: -60,
              width: 260, height: 260, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
            }} />
            <div style={{
              position: "absolute", bottom: 40, left: 80,
              width: 160, height: 160, borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
            }} />
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 180, height: 180, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }} />

            {/* Logo isotipo */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <EthAnhIsotipo size={48} />
            </div>

            {/* Texto bienvenida */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{
                margin: "0 0 10px",
                fontSize: 30,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                textTransform: "uppercase",
              }}>
                Bienvenido
              </h2>
              <p style={{
                margin: "0 0 8px",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.04em",
              }}>
                PLATAFORMA ETH-ANH 2026
              </p>
              <p style={{
                margin: 0,
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                maxWidth: 240,
              }}>
                Gestión integrada del Convenio ETH-ANH.<br />
                Desarrollado por SINAPSIS3D S.A.S.
              </p>
            </div>
          </div>

          {/* ── Panel derecho — formulario ── */}
          <div className="login-panel-right" style={{
            flex: 1,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 44px",
          }}>
            <h1 style={{
              margin: "0 0 6px",
              fontSize: 26,
              fontWeight: 700,
              color: "#1e293b",
              letterSpacing: "-0.01em",
            }}>
              Iniciar sesión
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#94a3b8" }}>
              Ingresa tus credenciales para continuar
            </p>

            {error && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "9px 13px",
                marginBottom: 16,
                fontSize: 13,
                color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            {/* Campo email */}
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>
                Correo electrónico
              </span>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "#94a3b8", display: "flex", pointerEvents: "none",
                }}>
                  <IconUser />
                </span>
                <input
                  className="login-input"
                  type="email"
                  value={em}
                  onChange={e => setEm(e.target.value)}
                  placeholder="tu@correo.com"
                  maxLength={254}
                  autoComplete="email"
                  style={INPUT_BASE}
                />
              </div>
            </label>

            {/* Campo contraseña */}
            <label style={{ display: "block", marginBottom: 22 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>
                Contraseña
              </span>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "#94a3b8", display: "flex", pointerEvents: "none",
                }}>
                  <IconLock />
                </span>
                <input
                  className="login-input"
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="••••••••"
                  maxLength={128}
                  autoComplete="current-password"
                  onKeyDown={e => e.key === "Enter" && onLogin(em, pw)}
                  style={{ ...INPUT_BASE, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#94a3b8",
                    cursor: "pointer", display: "flex", padding: 2,
                  }}
                  aria-label={show ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  <IconEye closed={show} />
                </button>
              </div>
            </label>

            {/* Fila recordar / olvidé */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22, marginTop: -10 }}>
              <button
                type="button"
                className="login-forgot"
                onClick={() => setShowForgot(true)}
                style={{
                  background: "none", border: "none",
                  color: "#64748b", fontSize: 12,
                  cursor: "pointer", padding: 0,
                  fontFamily: "inherit", transition: "color .15s",
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón principal */}
            <button
              className="login-btn-primary"
              onClick={() => onLogin(em, pw)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 10,
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d6ae5, #1251a3)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 6px 20px rgba(29,106,229,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "filter .15s, transform .15s, box-shadow .15s",
                letterSpacing: "0.01em",
              }}
            >
              {loading && (
                <span style={{
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spinLogin .6s linear infinite",
                  display: "inline-block",
                }} />
              )}
              {loading ? "Verificando…" : "Ingresar"}
            </button>

            <p style={{ margin: "28px 0 0", fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>
              © 2026 Fundación WR Tejido Social · SINAPSIS3D S.A.S.
            </p>
          </div>
        </div>
      </div>

      {/* Modal recuperar contraseña */}
      {showForgot && (
        <ForgotPassword onClose={() => setShowForgot(false)} />
      )}
    </>
  );
}
