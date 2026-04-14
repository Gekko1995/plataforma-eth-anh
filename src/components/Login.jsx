import React, { useState } from 'react';
import { APPS_SCRIPT_URL, LOCAL_USERS } from '../data/constants';

/**
 * Pantalla de Login
 */
export default function Login({ onLogin, error, loading }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0F1729 0%,#1a1f3a 50%,#0F1729 100%)",
        fontFamily: "'Bricolage Grotesque',sans-serif",
        padding: "24px 20px 32px",
        overflowY: "auto"
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeIn .6s ease both" }}>
        {/* Logo y título */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg,#4F6EF7,#7C3AED)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 16,
              boxShadow: "0 12px 40px #4F6EF744"
            }}
          >
            S3D
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#fff" }}>
            Plataforma ETH-ANH
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6B7194", fontFamily: "'IBM Plex Mono',monospace" }}>
            Convenio 2026 — Gestion Integrada
          </p>
        </div>

        {/* Mensaje modo demo */}
        {!APPS_SCRIPT_URL && (
          <div
            style={{
              background: "#F59E0B14",
              border: "1px solid #F59E0B33",
              borderRadius: 10,
              padding: "8px 14px",
              marginBottom: 14,
              fontSize: 12,
              color: "#FCD34D",
              textAlign: "center"
            }}
          >
            Modo demo — Usa las cuentas de prueba
          </div>
        )}

        {/* Formulario */}
        <div
          style={{
            background: "#171C32",
            borderRadius: 20,
            padding: "28px 24px",
            border: "1px solid #252B45"
          }}
        >
          {error && (
            <div
              style={{
                background: "#DC262612",
                border: "1px solid #DC262633",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 14,
                fontSize: 13,
                color: "#F87171"
              }}
            >
              {error}
            </div>
          )}

          <label style={{ display: "block", marginBottom: 14 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6B7194",
                display: "block",
                marginBottom: 5,
                fontFamily: "'IBM Plex Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: ".06em"
              }}
            >
              Email
            </span>
            <input
              type="email"
              value={em}
              onChange={e => setEm(e.target.value)}
              placeholder="tu@correo.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1px solid #252B45",
                background: "#0F1729",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none"
              }}
              onFocus={e => (e.target.style.borderColor = "#4F6EF7")}
              onBlur={e => (e.target.style.borderColor = "#252B45")}
            />
          </label>

          <label style={{ display: "block", marginBottom: 22 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6B7194",
                display: "block",
                marginBottom: 5,
                fontFamily: "'IBM Plex Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: ".06em"
              }}
            >
              Contrasena
            </span>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "11px 42px 11px 14px",
                  borderRadius: 10,
                  border: "1px solid #252B45",
                  background: "#0F1729",
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none"
                }}
                onFocus={e => (e.target.style.borderColor = "#4F6EF7")}
                onBlur={e => (e.target.style.borderColor = "#252B45")}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#6B7194",
                  cursor: "pointer",
                  fontSize: 12
                }}
              >
                {show ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          <button
            onClick={() => onLogin(em, pw)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: loading ? "#333" : "linear-gradient(135deg,#4F6EF7,#7C3AED)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              fontFamily: "inherit",
              boxShadow: "0 6px 24px #4F6EF744",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            {loading && (
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid #fff4",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin .6s linear infinite",
                  display: "inline-block"
                }}
              />
            )}
            {loading ? "Verificando..." : "Iniciar sesion"}
          </button>
        </div>

        {/* Cuentas demo */}
        {!APPS_SCRIPT_URL && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#171C32",
              borderRadius: 14,
              border: "1px solid #252B45"
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 10,
                color: "#6B7194",
                fontFamily: "'IBM Plex Mono',monospace",
                textTransform: "uppercase"
              }}
            >
              Cuentas demo:
            </p>
            {LOCAL_USERS.map(u => (
              <div
                key={u.email}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3
                }}
              >
                <span style={{ fontSize: 11, color: "#8890A5", fontFamily: "'IBM Plex Mono',monospace" }}>
                  {u.email}
                </span>
                <button
                  onClick={() => {
                    setEm(u.email);
                    setPw(u.password);
                  }}
                  style={{
                    background: "#4F6EF718",
                    border: "none",
                    borderRadius: 5,
                    padding: "2px 8px",
                    fontSize: 10,
                    color: "#7C8CFF",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Usar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
