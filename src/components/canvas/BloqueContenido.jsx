/**
 * Renderiza el contenido visual de cada tipo de bloque.
 * Usado tanto en el editor (modo editable) como en la vista (modo lectura).
 */
export default function BloqueContenido({ block, modoVista = false }) {
  switch (block.tipo) {
    case 'texto':   return <BloqueTexto   block={block} />;
    case 'imagen':  return <BloqueImagen  block={block} />;
    case 'kpi':     return <BloqueKPI     block={block} />;
    case 'link':    return <BloqueLink    block={block} modoVista={modoVista} />;
    case 'forma':   return <BloqueForma   block={block} />;
    default:        return null;
  }
}

// ─── Texto ────────────────────────────────────────────────────────────
function BloqueTexto({ block }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: '12px',
      display: 'flex', alignItems: 'flex-start',
      overflow: 'hidden',
    }}>
      <p style={{
        margin: 0,
        fontSize: block.fontSize || 16,
        fontWeight: block.fontWeight || 400,
        color: block.color || '#E2E8F0',
        textAlign: block.align || 'left',
        lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
      }}>
        {block.contenido || 'Escribe aquí…'}
      </p>
    </div>
  );
}

// ─── Imagen ───────────────────────────────────────────────────────────
function BloqueImagen({ block }) {
  if (!block.url) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#1E2A5A', borderRadius: '6px',
        color: '#8892B0', fontSize: '12px', gap: '6px',
      }}>
        <span style={{ fontSize: '28px', opacity: 0.5 }}>🖼️</span>
        <span>Agrega una URL de imagen</span>
      </div>
    );
  }
  return (
    <img
      src={block.url}
      alt="bloque"
      style={{
        width: '100%', height: '100%',
        objectFit: block.objectFit || 'cover',
        borderRadius: '6px', display: 'block',
      }}
      onError={e => { e.currentTarget.style.opacity = 0.3; }}
    />
  );
}

// ─── KPI ──────────────────────────────────────────────────────────────
function BloqueKPI({ block }) {
  const c = block.color || '#4B8EF1';
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: '16px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      borderTop: `3px solid ${c}`,
      background: c + '10',
      borderRadius: '0 0 6px 6px',
    }}>
      <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: c + 'cc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {block.label || 'Indicador'}
      </p>
      <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: 800, color: c, lineHeight: 1, letterSpacing: '-0.02em' }}>
        {block.value || '0'}
      </p>
      {block.sub && (
        <p style={{ margin: 0, fontSize: '11px', color: '#8892B0' }}>{block.sub}</p>
      )}
    </div>
  );
}

// ─── Link ─────────────────────────────────────────────────────────────
function BloqueLink({ block, modoVista }) {
  const inner = (
    <div style={{
      width: '100%', height: '100%',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      gap: '4px',
      background: '#1E2A5A',
      borderRadius: '6px',
      border: '1px solid #2a3a6a',
      cursor: modoVista && block.url ? 'pointer' : 'default',
      transition: 'background .15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px' }}>🔗</span>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#4B8EF1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {block.titulo || 'Enlace'}
        </p>
      </div>
      {block.descripcion && (
        <p style={{ margin: 0, fontSize: '12px', color: '#8892B0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {block.descripcion}
        </p>
      )}
      {block.url && (
        <p style={{ margin: 0, fontSize: '11px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {block.url}
        </p>
      )}
    </div>
  );

  if (modoVista && block.url) {
    return (
      <a href={block.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Forma ────────────────────────────────────────────────────────────
function BloqueForma({ block }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: block.bgColor || '#1E2A5A',
      borderRadius: block.borderRadius ?? 8,
      opacity: block.opacity ?? 1,
    }} />
  );
}
