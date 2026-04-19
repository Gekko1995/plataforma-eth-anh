import { MODULE_INFO } from '../data/moduleInfo';

export default function ModuloInfoBanner({ meta, color }) {
  if (!meta) return null;
  const info = MODULE_INFO[meta.id];

  const bg     = color + '0f';
  const border = color + '33';
  const badge  = color + '20';

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '18px 22px', marginBottom: 22 }}>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{
          fontSize: 10, fontWeight: 800,
          background: badge, color,
          border: `1px solid ${border}`,
          borderRadius: 999, padding: '2px 10px',
          letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          DEMO
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          Módulo {meta.id} — {meta.nombre}
        </span>
      </div>

      {/* ¿Qué hace? y ¿Por qué existe? — dos columnas */}
      {(info?.que || info?.por) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: meta.puntosClave?.length ? 14 : 0 }}>
          {info?.que && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
                ¿Qué hace?
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#1e293b', lineHeight: 1.65 }}>
                {info.que}
              </p>
            </div>
          )}
          {info?.por && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
                ¿Por qué existe?
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#1e293b', lineHeight: 1.65 }}>
                {info.por}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Puntos clave */}
      {meta.puntosClave?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
            Puntos clave
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {meta.puntosClave.map((p, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600,
                background: badge, color,
                border: `1px solid ${border}`,
                borderRadius: 6, padding: '3px 10px',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
