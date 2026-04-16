import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addLog } from '../utils/auth';

/**
 * Modal de detalle de módulo.
 * Props:
 *   modulo      — objeto completo de modulos.js + grupoColor + grupoNombre
 *   onClose     — función para cerrar
 *   user        — usuario autenticado (para registrar visita en el historial)
 */
export default function ModuloModal({ modulo, onClose, user }) {
  const navigate = useNavigate();
  const { id, nombre, descripcion, stack, grupoColor, grupoNombre, url, imagen } = modulo;
  const tieneUrl = Boolean(url);
  const openedAt = useRef(Date.now());

  // Registra en el historial cuánto tiempo estuvo abierto el modal al cerrarlo
  function logVista() {
    if (!user) return;
    const segundos = Math.round((Date.now() - openedAt.current) / 1000);
    addLog(user, 'MODULO_VISTA', `${nombre} · ${segundos}s`);
  }

  // Cierra con ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]); // eslint-disable-line

  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleClose() {
    logVista();
    onClose();
  }

  function irADemo() {
    logVista();
    onClose();
    navigate(`/modulos/${id}/demo`);
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="modal"
        style={{ maxWidth: '540px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Imagen de cabecera */}
        <div style={{ position: 'relative', height: '180px', flexShrink: 0, overflow: 'hidden' }}>
          {imagen ? (
            <img
              src={imagen}
              alt={nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: grupoColor + '22' }} />
          )}
          {/* Degradado sobre la imagen */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
          }} />
          {/* Barra de color del grupo */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: grupoColor }} />
          {/* Etiqueta de grupo sobre imagen */}
          <div style={{ position: 'absolute', bottom: '14px', left: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: grupoColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '12px', flexShrink: 0,
            }}>
              {id}
            </span>
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: '#fff', background: 'rgba(0,0,0,0.35)',
              padding: '3px 10px', borderRadius: '20px',
              backdropFilter: 'blur(4px)',
            }}>
              Grupo {modulo.grupo} · {grupoNombre}
            </span>
          </div>
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)', border: 'none',
              color: '#fff', fontSize: '16px', lineHeight: 1,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            ×
          </button>
        </div>

        {/* Header con título */}
        <div style={{ padding: '18px 20px 0' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.3, color: 'var(--content-text)', margin: 0 }}>
            {nombre}
          </h2>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Descripción */}
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 600,
              color: 'var(--content-text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Qué encontrarás
            </p>
            <p style={{ fontSize: '14px', color: 'var(--content-text)', lineHeight: 1.65 }}>
              {descripcion}
            </p>
          </div>

          {/* Puntos clave con checkmarks */}
          {modulo.puntosClave && modulo.puntosClave.length > 0 && (
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600,
                color: 'var(--content-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: '8px',
              }}>
                Puntos clave
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {modulo.puntosClave.map((punto, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--content-text)' }}>
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: grupoColor + '18', color: grupoColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '11px', flexShrink: 0, marginTop: '1px',
                    }}>
                      ✓
                    </span>
                    {punto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stack de herramientas */}
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 600,
              color: 'var(--content-text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Componentes tecnológicos
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {stack.map((tool, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600,
                    background: grupoColor + '12',
                    color: grupoColor,
                    border: `1px solid ${grupoColor}30`,
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={handleClose}>
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            onClick={irADemo}
            style={{
              background: grupoColor,
              borderColor: grupoColor,
            }}
          >
            Ver demo del módulo →
          </button>
        </div>
      </div>
    </div>
  );
}
