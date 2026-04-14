import React, { useState } from 'react';
import { APPS_SCRIPT_URL, LOCAL_USERS } from '../data/constants';

/**
 * Modal de recuperación de contraseña.
 * - Modo demo (sin APPS_SCRIPT_URL): muestra las cuentas disponibles con sus contraseñas.
 * - Modo producción (con APPS_SCRIPT_URL): permite solicitar un restablecimiento por email.
 */
export default function ForgotPassword({ onClose, isMobile = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const [msg, setMsg] = useState('');

  async function handleReset(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetPassword', email: email.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        setStatus('sent');
        setMsg(data.message || 'Revisa tu correo, te enviamos las instrucciones.');
      } else {
        setStatus('error');
        setMsg((data && data.error) || 'No se pudo procesar tu solicitud. Intenta de nuevo.');
      }
    } catch {
      setStatus('error');
      setMsg('Error de conexion. Intenta de nuevo mas tarde.');
    }
  }

  const isDemo = !APPS_SCRIPT_URL;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#00000088',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '16px' : '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#171C32',
          border: '1px solid #252B45',
          borderRadius: 20,
          padding: isMobile ? '20px 16px' : '28px 24px',
          width: '100%',
          maxWidth: 400,
          animation: 'fadeIn .3s ease both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#fff' }}>
            {isDemo ? 'Cuentas disponibles' : '¿Olvidaste tu contraseña?'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7194',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
              padding: '0 4px',
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Modo demo: mostrar cuentas con contraseñas */}
        {isDemo && (
          <>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#8890A5' }}>
              La plataforma está en <strong style={{ color: '#FCD34D' }}>modo demo</strong>.
              Usa cualquiera de estas cuentas:
            </p>
            {LOCAL_USERS.map(u => (
              <div
                key={u.email}
                style={{
                  background: '#0F1729',
                  border: '1px solid #252B45',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#FCD34D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    {u.rol}
                  </span>
                  <span style={{ fontSize: 11, color: '#6B7194' }}>{u.nombre}</span>
                </div>
                <div style={{ fontSize: 12, color: '#8890A5', fontFamily: "'IBM Plex Mono',monospace", marginBottom: 2 }}>
                  📧 {u.email}
                </div>
                <div style={{ fontSize: 12, color: '#8890A5', fontFamily: "'IBM Plex Mono',monospace" }}>
                  🔑 {u.password}
                </div>
              </div>
            ))}
            <p style={{ margin: '12px 0 0', fontSize: 11, color: '#6B7194', textAlign: 'center' }}>
              Para activar usuarios reales, configura Google Sheets en{' '}
              <code style={{ color: '#7C8CFF' }}>src/data/constants.js</code>
            </p>
          </>
        )}

        {/* Modo producción: formulario de reset */}
        {!isDemo && (
          <>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
                <p style={{ margin: 0, fontSize: 14, color: '#6EE7B7' }}>{msg}</p>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8890A5' }}>
                  Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
                </p>
                {status === 'error' && (
                  <div
                    style={{
                      background: '#DC262612',
                      border: '1px solid #DC262633',
                      borderRadius: 8,
                      padding: '8px 12px',
                      marginBottom: 12,
                      fontSize: 13,
                      color: '#F87171',
                    }}
                  >
                    {msg}
                  </div>
                )}
                <label style={{ display: 'block', marginBottom: 16 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#6B7194',
                      display: 'block',
                      marginBottom: 5,
                      fontFamily: "'IBM Plex Mono',monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  >
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    maxLength={254}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1px solid #252B45',
                      background: '#0F1729',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
                    onBlur={e => (e.target.style.borderColor = '#252B45')}
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: status === 'sending' ? '#333' : 'linear-gradient(135deg,#4F6EF7,#7C3AED)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    border: 'none',
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
              </form>
            )}
            <p style={{ margin: '14px 0 0', fontSize: 11, color: '#6B7194', textAlign: 'center' }}>
              ¿Necesitas ayuda? Contacta al administrador:{' '}
              <a href="mailto:admin@sinapsis3d.com" style={{ color: '#7C8CFF' }}>
                admin@sinapsis3d.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
