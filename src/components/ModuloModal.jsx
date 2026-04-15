import { useEffect } from 'react';

/**
 * Modal de detalle de módulo.
 * Props:
 *   modulo      — objeto completo de modulos.js + grupoColor + grupoNombre
 *   onClose     — función para cerrar
 */
export default function ModuloModal({ modulo, onClose }) {
  const { id, nombre, descripcion, stack, grupoColor, grupoNombre, url } = modulo;
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

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal"
        style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Barra de color del grupo */}
        <div style={{ height: '4px', background: grupoColor, flexShrink: 0 }} />

        {/* Header */}
        <div className="modal-header" style={{ alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {/* Número del módulo */}
              <span style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: grupoColor + '18', color: grupoColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '12px', flexShrink: 0,
              }}>
                {id}
              </span>
              {/* Etiqueta de grupo */}
              <span style={{
                fontSize: '11px', fontWeight: 600,
                color: grupoColor, background: grupoColor + '12',
                padding: '2px 8px', borderRadius: '20px',
              }}>
                Grupo {modulo.grupo} · {grupoNombre}
              </span>
            </div>
            <h2 className="modal-title" style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.3 }}>
              {nombre}
            </h2>
          </div>

          {/* Botón cerrar */}
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
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

          {/* Puntos clave (solo si tiene contenido) */}
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
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {modulo.puntosClave.map((punto, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--content-text)' }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: grupoColor, flexShrink: 0,
                    }} />
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

          {/* Aviso si el módulo no tiene URL aún */}
          {!tieneUrl && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>⏳</span>
              Este módulo estará disponible próximamente.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            disabled={!tieneUrl}
            onClick={() => tieneUrl && window.open(url, '_blank', 'noopener,noreferrer')}
            style={{
              background: tieneUrl ? grupoColor : undefined,
              borderColor: tieneUrl ? grupoColor : undefined,
              opacity: tieneUrl ? 1 : 0.5,
              cursor: tieneUrl ? 'pointer' : 'not-allowed',
            }}
          >
            Ir al módulo →
          </button>
        </div>
      </div>
    </div>
  );
}
