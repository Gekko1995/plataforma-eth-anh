import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Modal de detalle de módulo.
 * Props:
 *   modulo      — objeto completo de modulos.js + grupoColor + grupoNombre
 *   onClose     — función para cerrar
 */
export default function ModuloModal({ modulo, onClose }) {
  const navigate = useNavigate();
  const { id, nombre, descripcion, stack, grupoColor, grupoNombre, url, imagen } = modulo;
  const tieneUrl = Boolean(url);

  // Cierra con ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function irADemo() {
    onClose();
    navigate(`/modulos/${id}/demo`);
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal"
        style={{ maxWidth: '540px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera de gradiente */}
        <div style={{
          position: 'relative', height: '150px', flexShrink: 0, overflow: 'hidden',
          background: `linear-gradient(135deg, ${grupoColor} 0%, ${grupoColor}88 100%)`,
        }}>
          {/* Trama de puntos */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }} />
          {/* Brillo esquina */}
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />

          {/* Etiqueta grupo + título */}
          <div style={{ position: 'absolute', inset: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.30)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px', flexShrink: 0,
              }}>
                {id}
              </span>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.15)', padding: '3px 10px',
                borderRadius: '20px', backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.20)',
              }}>
                Grupo {modulo.grupo} · {grupoNombre}
              </span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {nombre}
            </h2>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(255,255,255,0.30)',
              color: '#fff', fontSize: '16px', lineHeight: 1,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            ×
          </button>
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
          <button className="btn btn-ghost" onClick={onClose}>
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
