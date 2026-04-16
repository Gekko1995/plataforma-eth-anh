import { useState, useRef, useCallback } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import BloqueContenido from './BloqueContenido';
import PanelLateral from './PanelLateral';
import EditPanel from './EditPanel';

const T = {
  bg: '#0A0E2A', card: '#111836', border: '#1E2A5A',
  text: '#E2E8F0', muted: '#8892B0', accent: '#4B8EF1',
  green: '#00D48B', red: '#FF4D6A',
};

const CANVAS_W = 1400;
const CANVAS_H = 900;

// ─── Valores por defecto para cada tipo de bloque ─────────────────────
const DEFAULTS = {
  texto:  { w: 340, h: 130, contenido: 'Escribe aquí…', fontSize: 18, fontWeight: 400, color: '#E2E8F0', align: 'left' },
  imagen: { w: 320, h: 220, url: '', objectFit: 'cover' },
  kpi:    { w: 230, h: 140, label: 'Indicador', value: '0', sub: 'descripción', color: '#4B8EF1' },
  link:   { w: 290, h: 110, url: '', titulo: 'Enlace', descripcion: '' },
  forma:  { w: 220, h: 130, bgColor: '#1E2A5A', borderRadius: 10, opacity: 1 },
};

// ─── Bloque arrastrable ───────────────────────────────────────────────
function DraggableBloque({ block, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      onClick={e => { e.stopPropagation(); onSelect(block.id); }}
      style={{
        position: 'absolute',
        left: block.x, top: block.y,
        width: block.w, height: block.h,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : isSelected ? 10 : 1,
        outline: isSelected ? `2px solid ${T.accent}` : '2px solid transparent',
        outlineOffset: '2px',
        borderRadius: '8px',
        transition: isDragging ? 'none' : 'outline .1s',
        userSelect: 'none',
      }}
    >
      {/* Barra de drag (handle) */}
      <div
        {...listeners}
        {...attributes}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '18px', borderRadius: '8px 8px 0 0',
          background: isSelected ? T.accent + '33' : 'transparent',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isSelected && (
          <span style={{ fontSize: '9px', color: T.accent, letterSpacing: '3px', opacity: 0.7 }}>⠿⠿⠿</span>
        )}
      </div>

      {/* Contenido del bloque */}
      <div style={{ width: '100%', height: '100%', pointerEvents: isDragging ? 'none' : 'auto' }}>
        <BloqueContenido block={block} modoVista={false} />
      </div>
    </div>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────
export default function CanvasEditor({ bloques, onChange }) {
  const [selectedId, setSelectedId] = useState(null);
  const canvasRef = useRef(null);
  const nextPos = useRef({ x: 80, y: 80 });

  const selectedBlock = bloques.find(b => b.id === selectedId) || null;

  // Agregar nuevo bloque
  const handleAgregar = useCallback((tipo) => {
    const defaults = DEFAULTS[tipo] || {};
    const newBlock = {
      id: `${tipo}_${Date.now()}`,
      tipo,
      x: nextPos.current.x,
      y: nextPos.current.y,
      ...defaults,
    };
    // Escalonar siguientes posiciones
    nextPos.current = {
      x: (nextPos.current.x + 30) % (CANVAS_W - 300),
      y: (nextPos.current.y + 30) % (CANVAS_H - 200),
    };
    onChange([...bloques, newBlock]);
    setSelectedId(newBlock.id);
  }, [bloques, onChange]);

  // Actualizar bloque
  const handleUpdate = useCallback((updated) => {
    onChange(bloques.map(b => b.id === updated.id ? updated : b));
  }, [bloques, onChange]);

  // Eliminar bloque
  const handleDelete = useCallback((id) => {
    onChange(bloques.filter(b => b.id !== id));
    setSelectedId(null);
  }, [bloques, onChange]);

  // Fin del drag → actualizar posición
  const handleDragEnd = useCallback(({ active, delta }) => {
    onChange(bloques.map(b =>
      b.id === active.id
        ? { ...b, x: Math.max(0, b.x + delta.x), y: Math.max(0, b.y + delta.y) }
        : b
    ));
  }, [bloques, onChange]);

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, overflow: 'hidden' }}>

      {/* ── Panel izquierdo: tipos de bloque ── */}
      <div style={{
        width: '200px', flexShrink: 0,
        borderRight: `1px solid ${T.border}`,
        overflowY: 'auto',
        background: T.card,
      }}>
        <PanelLateral onAgregar={handleAgregar} />
      </div>

      {/* ── Canvas central ── */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <DndContext onDragEnd={handleDragEnd}>
          <div
            ref={canvasRef}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'relative',
              width: CANVAS_W, height: CANVAS_H,
              background: T.bg,
              backgroundImage: `radial-gradient(circle, #1E2A5A44 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
              margin: '20px',
              borderRadius: '12px',
              border: `1px solid ${T.border}`,
              boxShadow: '0 0 60px rgba(75,142,241,0.06)',
            }}
          >
            {bloques.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: T.muted, fontSize: '14px', gap: '8px',
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: '40px', opacity: 0.2 }}>⊞</span>
                <p style={{ margin: 0, opacity: 0.4 }}>Canvas vacío — agrega bloques desde el panel izquierdo</p>
              </div>
            )}

            {bloques.map(block => (
              <DraggableBloque
                key={block.id}
                block={block}
                isSelected={selectedId === block.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* ── Panel derecho: edición del bloque seleccionado ── */}
      <div style={{
        width: '220px', flexShrink: 0,
        borderLeft: `1px solid ${T.border}`,
        background: T.card,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Propiedades
          </p>
        </div>
        <EditPanel
          block={selectedBlock}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
