import { MODULE_INFO } from '../data/moduleInfo';

export default function ModuloInfoBanner({ meta, color }) {
  if (!meta) return null;
  const info = MODULE_INFO[meta.id];

  const isDark = (hex) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return (r*299 + g*587 + b*114) / 1000 < 128;
  };

  const bg      = color + '12';
  const border  = color + '44';
  const textMain= color;
  const badgeBg = color + '22';

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: badgeBg, color: textMain,
          border: `1px solid ${border}`,
          borderRadius: 999, padding: '2px 9px',
          letterSpacing: '.05em', textTransform: 'uppercase',
        }}>
          DEMO
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: textMain }}>
          Módulo {meta.id} — {meta.nombre}
        </span>
      </div>

      {/* ¿Qué hace? */}
      {info?.que && (
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '.06em', color: textMain, opacity: .85,
          }}>
            ¿Qué hace?
          </span>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: textMain, lineHeight: 1.6, opacity: .9 }}>
            {info.que}
          </p>
        </div>
      )}

      {/* ¿Por qué existe? */}
      {info?.por && (
        <div style={{ marginBottom: meta.puntosClave?.length ? 12 : 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '.06em', color: textMain, opacity: .7,
          }}>
            ¿Por qué existe?
          </span>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: textMain, lineHeight: 1.55, opacity: .75 }}>
            {info.por}
          </p>
        </div>
      )}

      {/* Puntos clave */}
      {meta.puntosClave?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {meta.puntosClave.map((p, i) => (
            <span key={i} style={{
              fontSize: 11, background: badgeBg, color: textMain,
              border: `1px solid ${border}`, borderRadius: 6, padding: '2px 8px',
            }}>
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
