/**
 * Panel lateral derecho — edita las propiedades del bloque seleccionado.
 */
const T = { text: '#E2E8F0', muted: '#8892B0', border: '#1E2A5A', card: '#111836', bg: '#0A0E2A' };

export default function EditPanel({ block, onUpdate, onDelete }) {
  if (!block) {
    return (
      <div style={{ padding: '20px 16px', color: T.muted, fontSize: '12px', textAlign: 'center', lineHeight: 1.7 }}>
        <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px', opacity: 0.4 }}>←</span>
        Selecciona un bloque<br />para editarlo
      </div>
    );
  }

  const set = (key, val) => onUpdate({ ...block, [key]: val });

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', flex: 1 }}>

      {/* Tipo badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#4B8EF1', background: '#4B8EF115', padding: '3px 10px', borderRadius: '20px',
          border: '1px solid #4B8EF130',
        }}>
          {TIPO_LABELS[block.tipo] || block.tipo}
        </span>
        <button
          onClick={() => onDelete(block.id)}
          style={{ background: 'transparent', border: 'none', color: '#FF4D6A', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px 6px' }}
          title="Eliminar bloque"
        >
          🗑
        </button>
      </div>

      {/* Posición y tamaño */}
      <Section label="Posición y tamaño">
        <Row2>
          <Field label="X" type="number" value={block.x} onChange={v => set('x', +v)} />
          <Field label="Y" type="number" value={block.y} onChange={v => set('y', +v)} />
        </Row2>
        <Row2>
          <Field label="Ancho" type="number" value={block.w} onChange={v => set('w', Math.max(80, +v))} />
          <Field label="Alto"  type="number" value={block.h} onChange={v => set('h', Math.max(40, +v))} />
        </Row2>
      </Section>

      {/* Campos por tipo */}
      {block.tipo === 'texto'  && <CamposTexto  block={block} set={set} />}
      {block.tipo === 'imagen' && <CamposImagen block={block} set={set} />}
      {block.tipo === 'kpi'    && <CamposKPI    block={block} set={set} />}
      {block.tipo === 'link'   && <CamposLink   block={block} set={set} />}
      {block.tipo === 'forma'  && <CamposForma  block={block} set={set} />}
    </div>
  );
}

// ─── Campos por tipo ──────────────────────────────────────────────────

function CamposTexto({ block, set }) {
  return (
    <Section label="Contenido">
      <label style={labelStyle}>Texto</label>
      <textarea
        rows={4}
        value={block.contenido || ''}
        onChange={e => set('contenido', e.target.value)}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
      />
      <Row2>
        <Field label="Tamaño fuente" type="number" value={block.fontSize || 16} onChange={v => set('fontSize', Math.max(10, Math.min(72, +v)))} />
        <div>
          <label style={labelStyle}>Color texto</label>
          <input type="color" value={block.color || '#E2E8F0'} onChange={e => set('color', e.target.value)} style={colorStyle} />
        </div>
      </Row2>
      <div>
        <label style={labelStyle}>Grosor</label>
        <select value={block.fontWeight || 400} onChange={e => set('fontWeight', +e.target.value)} style={inputStyle}>
          <option value={300}>Delgado</option>
          <option value={400}>Normal</option>
          <option value={600}>Semibold</option>
          <option value={700}>Bold</option>
          <option value={800}>Extrabold</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Alineación</label>
        <select value={block.align || 'left'} onChange={e => set('align', e.target.value)} style={inputStyle}>
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>
    </Section>
  );
}

function CamposImagen({ block, set }) {
  return (
    <Section label="Imagen">
      <Field label="URL de imagen" value={block.url || ''} onChange={v => set('url', v)} placeholder="https://..." />
      <div>
        <label style={labelStyle}>Ajuste</label>
        <select value={block.objectFit || 'cover'} onChange={e => set('objectFit', e.target.value)} style={inputStyle}>
          <option value="cover">Cubrir (cover)</option>
          <option value="contain">Contener (contain)</option>
          <option value="fill">Estirar (fill)</option>
        </select>
      </div>
    </Section>
  );
}

function CamposKPI({ block, set }) {
  return (
    <Section label="KPI">
      <Field label="Etiqueta"   value={block.label || ''} onChange={v => set('label', v)} />
      <Field label="Valor"      value={block.value || ''} onChange={v => set('value', v)} placeholder="ej: 1.847 o 75%" />
      <Field label="Subtítulo"  value={block.sub   || ''} onChange={v => set('sub', v)} />
      <div>
        <label style={labelStyle}>Color acento</label>
        <input type="color" value={block.color || '#4B8EF1'} onChange={e => set('color', e.target.value)} style={colorStyle} />
      </div>
    </Section>
  );
}

function CamposLink({ block, set }) {
  return (
    <Section label="Enlace">
      <Field label="URL"         value={block.url         || ''} onChange={v => set('url', v)}         placeholder="https://..." />
      <Field label="Título"      value={block.titulo      || ''} onChange={v => set('titulo', v)} />
      <Field label="Descripción" value={block.descripcion || ''} onChange={v => set('descripcion', v)} />
    </Section>
  );
}

function CamposForma({ block, set }) {
  return (
    <Section label="Forma">
      <div>
        <label style={labelStyle}>Color de fondo</label>
        <input type="color" value={block.bgColor || '#1E2A5A'} onChange={e => set('bgColor', e.target.value)} style={colorStyle} />
      </div>
      <Field label="Radio borde (px)" type="number" value={block.borderRadius ?? 8} onChange={v => set('borderRadius', Math.max(0, +v))} />
      <Field label="Opacidad (0-1)"   type="number" value={block.opacity ?? 1}    onChange={v => set('opacity', Math.max(0, Math.min(1, +v)))} placeholder="0 a 1" />
    </Section>
  );
}

// ─── Utilidades de UI ────────────────────────────────────────────────

const TIPO_LABELS = { texto: '📝 Texto', imagen: '🖼️ Imagen', kpi: '📌 KPI', link: '🔗 Enlace', forma: '🟦 Forma' };

function Section({ label, children }) {
  return (
    <div>
      <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function Row2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>{children}</div>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '10px', fontWeight: 600,
  color: T.muted,
  marginBottom: '4px',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: T.bg, border: `1px solid ${T.border}`,
  borderRadius: '6px', padding: '6px 10px',
  color: T.text, fontSize: '12px',
  outline: 'none',
};

const colorStyle = {
  width: '100%', height: '32px', boxSizing: 'border-box',
  background: T.bg, border: `1px solid ${T.border}`,
  borderRadius: '6px', padding: '2px 4px', cursor: 'pointer',
};
