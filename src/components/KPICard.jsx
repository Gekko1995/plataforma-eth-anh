import React from 'react';

/**
 * Componente de tarjeta KPI (Key Performance Indicator)
 */
export default function KPICard({ label, value, color, delta, index = 0, isMobile = false }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: isMobile ? "16px" : "18px 20px",
        border: "1px solid #E8EBF2",
        animation: `fadeIn .35s ease ${0.1 + index * 0.06}s both`
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "#A0A5BD",
          fontFamily: "'IBM Plex Mono',monospace",
          textTransform: "uppercase",
          letterSpacing: ".04em",
          marginBottom: 8
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: "#8890A5", marginTop: 4 }}>{delta}</p>
    </div>
  );
}
