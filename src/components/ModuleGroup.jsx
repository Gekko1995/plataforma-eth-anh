import React from 'react';
import { STATUS_STYLES } from '../data/constants';
import { addLog } from '../utils/auth';

/**
 * Componente de tarjeta de módulo individual
 */
function ModuleCard({ module, groupColor, user, isMobile = false, onAccess }) {
  const st = STATUS_STYLES[module.status];

  return (
    <a
      href={module.url}
      onClick={e => {
        e.preventDefault();
        if (onAccess) onAccess(module);
        addLog(user, module.name);
        window.open(module.url, "_blank", "noopener,noreferrer");
      }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "34px 1fr auto" : "40px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: isMobile ? "10px 12px" : "12px 16px",
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        transition: "background .15s",
        borderLeft: "3px solid transparent"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "#F7F8FB";
        e.currentTarget.style.borderLeftColor = groupColor;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderLeftColor = "transparent";
      }}
    >
      {/* ID Badge */}
      <span
        style={{
          width: isMobile ? 30 : 34,
          height: isMobile ? 30 : 34,
          borderRadius: 8,
          background: groupColor + "12",
          color: groupColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? 11 : 13,
          fontWeight: 700,
          fontFamily: "'IBM Plex Mono',monospace"
        }}
      >
        {String(module.id).padStart(2, "0")}
      </span>

      {/* Module Info */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: isMobile ? 12 : 13,
            fontWeight: 600,
            color: "#1A1D2B",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {module.name}
        </p>
        <p
          style={{
            fontSize: isMobile ? 10 : 11,
            color: "#8890A5",
            margin: "2px 0 4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {module.desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {module.stack.split("+").map((t, j) => (
            <span
              key={j}
              style={{
                display: "inline-block",
                padding: "1px 7px",
                borderRadius: 4,
                fontSize: isMobile ? 9 : 10,
                background: "#F0F2F8",
                color: "#6B7194",
                fontFamily: "'IBM Plex Mono',monospace"
              }}
            >
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "3px 9px",
          borderRadius: 6,
          fontSize: isMobile ? 9 : 10,
          fontWeight: 600,
          background: groupColor + "12",
          color: groupColor,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Abrir módulo →
      </span>
    </a>
  );
}

/**
 * Componente de grupo de módulos colapsable
 */
export default function ModuleGroup({ group, modules, isOpen, onToggle, searchTerm = "", user, isMobile = false }) {
  const filt = modules.filter(
    m =>
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm) ||
      m.desc.toLowerCase().includes(searchTerm) ||
      m.stack.toLowerCase().includes(searchTerm)
  );

  if (searchTerm && filt.length === 0) return null;

  const isExpanded = isOpen || !!searchTerm;

  return (
    <div
      id={"g-" + group.id}
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E8EBF2",
        overflow: "hidden",
        boxShadow: isExpanded ? `0 4px 20px -8px ${group.color}12` : "none"
      }}
    >
      {/* Group Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: isMobile ? "14px 16px" : "16px 20px",
          background: isExpanded ? group.color + "08" : "transparent",
          borderBottom: isExpanded ? "1px solid #E8EBF2" : "none"
        }}
      >
        <span
          style={{
            width: isMobile ? 32 : 38,
            height: isMobile ? 32 : 38,
            borderRadius: 10,
            background: group.color + "16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? 16 : 18,
            flexShrink: 0
          }}
        >
          {group.icon}
        </span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: group.color, fontFamily: "'IBM Plex Mono',monospace" }}>
              GRUPO {group.id}
            </span>
            <span style={{ fontSize: 11, color: "#A0A5BD", fontFamily: "'IBM Plex Mono',monospace" }}>
              {filt.length} mod.
            </span>
          </div>
          <p style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: "#1A1D2B", overflow: "hidden", textOverflow: "ellipsis" }}>
            {group.name}
          </p>
        </div>
        <span style={{ fontSize: 16, color: "#A0A5BD", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
          {"\u25BE"}
        </span>
      </button>

      {/* Module List */}
      {isExpanded && (
        <div style={{ padding: "6px 8px 10px" }}>
          {filt.map(m => (
            <ModuleCard
              key={m.id}
              module={m}
              groupColor={group.color}
              user={user}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
