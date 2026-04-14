import React from 'react';

/**
 * Componente de botón de navegación del sidebar
 */
export default function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 12,
        border: "none",
        background: active ? "#4F6EF7" : "transparent",
        color: active ? "#fff" : "#8890A5",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all .2s",
        position: "relative"
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {badge && (
        <span
          style={{
            marginLeft: "auto",
            background: active ? "#fff3" : "#4F6EF722",
            color: active ? "#fff" : "#4F6EF7",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 10,
            flexShrink: 0
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
