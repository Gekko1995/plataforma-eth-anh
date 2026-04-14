import React from 'react';

/**
 * Componente de gráfica de barras miniatura
 */
export default function MiniBarChart({ data, color, height = 100 }) {
  const max = Math.max(...data);
  const w = 100 / data.length;
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * (height - 10);
        return (
          <rect
            key={i}
            x={i * w + 1}
            y={height - h}
            width={w - 2}
            height={h}
            rx={2}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
}
