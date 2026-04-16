/**
 * Panel lateral izquierdo — botones para agregar nuevos bloques al canvas.
 */
const T = { text: '#E2E8F0', muted: '#8892B0', border: '#1E2A5A', card: '#111836' };

const TIPOS_BLOQUE = [
  { tipo: 'texto',  icon: '📝', label: 'Texto',   desc: 'Título, párrafo o etiqueta' },
  { tipo: 'kpi',   icon: '📌', label: 'KPI',     desc: 'Número grande + etiqueta' },
  { tipo: 'imagen',icon: '🖼️', label: 'Imagen',  desc: 'URL de imagen externa' },
  { tipo: 'link',  icon: '🔗', label: 'Enlace',  desc: 'Tarjeta con URL clickeable' },
  { tipo: 'forma', icon: '🟦', label: 'Forma',   desc: 'Rectángulo de color' },
];

export default function PanelLateral({ onAgregar }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Agregar bloque
      </p>

      {TIPOS_BLOQUE.map(({ tipo, icon, label, desc }) => (
        <button
          key={tipo}
          onClick={() => onAgregar(tipo)}
          style={{
            width: '100%', textAlign: 'left',
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: '8px', padding: '10px 12px',
            cursor: 'pointer', color: T.text,
            transition: 'border-color .15s, background .15s',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4B8EF1'; e.currentTarget.style.background = '#4B8EF108'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}
        >
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{label}</p>
            <p style={{ margin: 0, fontSize: '11px', color: T.muted }}>{desc}</p>
          </div>
        </button>
      ))}

      <div style={{
        marginTop: '8px', padding: '10px 12px',
        background: '#1a1500', border: '1px solid #fde68a22',
        borderRadius: '8px', fontSize: '11px', color: '#fde68a99', lineHeight: 1.6,
      }}>
        💡 Arrastra los bloques desde la barra superior para reposicionarlos.
      </div>
    </div>
  );
}
