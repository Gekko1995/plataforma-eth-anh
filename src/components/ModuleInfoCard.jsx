/**
 * ModuleInfoCard
 * Tarjeta de detalle de módulo con layout de grid equilibrado.
 * - Mobile: columna única
 * - md+:    3 columnas de contenido + 1 columna CTA a la derecha
 *
 * Props:
 *   modulo      — objeto de modulos.js + grupoColor + grupoNombre
 *   onOpen      — callback al pulsar "Abrir Módulo"
 */
export default function ModuleInfoCard({ modulo, onOpen }) {
  const { id, nombre, descripcion, puntosClave, stack, grupoColor, grupoNombre, url } = modulo;

  return (
    <>
      {/* Estilos responsive inyectados una sola vez */}
      <style>{`
        .mic-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 768px) {
          .mic-grid {
            grid-template-columns: 3fr 1fr;
          }
        }
        .mic-cta-col {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
          margin-top: 20px;
        }
        @media (min-width: 768px) {
          .mic-cta-col {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 0;
            padding-left: 24px;
            border-top: none;
            border-left: 1px solid #f1f5f9;
            margin-top: 0;
          }
        }
        .mic-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          background: #C97435;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background .15s, transform .1s;
          white-space: nowrap;
        }
        .mic-cta-btn:hover {
          background: #b5622a;
          transform: translateY(-1px);
        }
        .mic-cta-btn:active {
          transform: translateY(0);
        }
        .mic-cta-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(7,74,106,0.06)',
      }}>
        <div className="mic-grid">

          {/* ── Columnas de contenido (izquierda) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Badge de grupo + ID */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: grupoColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px', flexShrink: 0,
              }}>
                {id}
              </span>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                background: grupoColor + '15',
                color: grupoColor,
                padding: '3px 10px',
                borderRadius: '20px',
                border: `1px solid ${grupoColor}30`,
              }}>
                {grupoNombre}
              </span>
            </div>

            {/* Título */}
            <h2 style={{
              fontSize: '18px', fontWeight: 700,
              color: 'var(--content-text, #1e293b)',
              lineHeight: 1.3, margin: 0,
            }}>
              {nombre}
            </h2>

            {/* Qué encontrarás */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600,
                color: 'var(--content-text-muted, #64748b)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: '8px',
              }}>
                Qué encontrarás
              </p>
              <p style={{ fontSize: '14px', color: 'var(--content-text, #334155)', lineHeight: 1.65 }}>
                {descripcion}
              </p>
            </div>

            {/* Puntos clave */}
            {puntosClave && puntosClave.length > 0 && (
              <div>
                <p style={{
                  fontSize: '11px', fontWeight: 600,
                  color: 'var(--content-text-muted, #64748b)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}>
                  Puntos clave
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {puntosClave.map((punto, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '13px', color: 'var(--content-text, #334155)',
                    }}>
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

            {/* Stack tecnológico */}
            {stack && stack.length > 0 && (
              <div>
                <p style={{
                  fontSize: '11px', fontWeight: 600,
                  color: 'var(--content-text-muted, #64748b)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}>
                  Stack
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {stack.map((tool, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: 600,
                      background: grupoColor + '12',
                      color: grupoColor,
                      border: `1px solid ${grupoColor}30`,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Columna CTA (derecha) ── */}
          <div className="mic-cta-col">

            {/* Icono decorativo */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: '#074A6A12',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg
                width="32" height="32" viewBox="0 0 24 24"
                fill="none" stroke="#074A6A" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>

            {/* Botón CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <button
                className="mic-cta-btn"
                onClick={onOpen}
                disabled={!url && !onOpen}
                title={nombre}
              >
                Abrir Módulo ↗
              </button>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Acceso directo
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
