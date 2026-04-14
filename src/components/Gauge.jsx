import React from 'react';

/**
 * Componente de medidor tipo gauge (semicírculo)
 */
export default function Gauge({ value, max, label, color }) {
  const pct = value / max;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct * 0.75;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="110" height="80" viewBox="0 0 110 90">
        <path
          d="M 10 80 A 45 45 0 0 1 100 80"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 80 A 45 45 0 0 1 100 80"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray .8s ease" }}
        />
        <text
          x="55"
          y="60"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="#1A1D2B"
          fontFamily="'Bricolage Grotesque',sans-serif"
        >
          {value}%
        </text>
        <text
          x="55"
          y="78"
          textAnchor="middle"
          fontSize="10"
          fill="#8890A5"
          fontFamily="'IBM Plex Mono',monospace"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
