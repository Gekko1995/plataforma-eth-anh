/* =====================================================================
   CONFIGURACION DE GRUPOS Y ESTADOS — CONVENIO ETH-ANH 2026
   Los datos de módulos viven en src/data/modulos.js
   ===================================================================== */

import { modulos } from './modulos';

// ── Estados (para el hook y permisos) ────────────────────────────────
export const STATUS_STYLES = {
  nuevo:     { l: "Nuevo",     bg: "#EFF6FF", c: "#1E40AF", d: "#3B82F6" },
  adaptar:   { l: "Adaptar",   bg: "#FFFBEB", c: "#92400E", d: "#F59E0B" },
  reutilizar:{ l: "Reutilizar",bg: "#ECFDF5", c: "#065F46", d: "#10B981" },
};

// ── Helper: convierte módulos del array a la forma que espera el hook ─
const toGroupModules = (grupoId) =>
  modulos
    .filter(m => m.grupo === grupoId)
    .map(m => ({
      id: m.id,
      name: m.nombre,
      desc: m.descripcion,
      stack: m.stack.join('+'),
      status: m.status,
      url: m.url,
    }));

// ── Grupos con metadatos visuales ─────────────────────────────────────
export const GROUPS = [
  { id: "A", name: "Diagnóstico y Territorio",   color: "#1B6B4A", icon: "A", modules: toGroupModules("A") },
  { id: "B", name: "Núcleo Estratégico ANH",      color: "#B45309", icon: "B", modules: toGroupModules("B") },
  { id: "C", name: "Formación y Capacitación",    color: "#7C3AED", icon: "C", modules: toGroupModules("C") },
  { id: "D", name: "Actores y Talento Humano",    color: "#0369A1", icon: "D", modules: toGroupModules("D") },
  { id: "E", name: "Financiero y Gobernanza",     color: "#DC2626", icon: "E", modules: toGroupModules("E") },
  { id: "F", name: "Informes y Rendición",        color: "#0891B2", icon: "F", modules: toGroupModules("F") },
  { id: "G", name: "Operación Territorial",       color: "#059669", icon: "G", modules: toGroupModules("G") },
  { id: "H", name: "Documentación y Cierre",      color: "#6D28D9", icon: "H", modules: toGroupModules("H") },
  { id: "I", name: "Infraestructura TI",          color: "#475569", icon: "I", modules: toGroupModules("I") },
];
