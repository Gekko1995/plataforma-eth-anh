import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';
import { modulos as MODULOS_DATA } from '../data/modulos';
import ModuloModal from '../components/ModuloModal';
import { addLog } from '../utils/auth';

const moduloMap = Object.fromEntries(MODULOS_DATA.map(m => [m.id, m]));

/* ── Ícono único por módulo (SVG, 34×34, stroke blanco) ─────────────── */
const S = 'rgba(255,255,255,0.92)'; // stroke color
const F = 'rgba(255,255,255,0.92)'; // fill color for solid elements

const MODULE_ICONS = {
  /* 1 — Línea Diagnóstica Territorial: brújula */
  1: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={F} stroke="none"/>
      <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.3)" stroke="none"/>
    </svg>
  ),
  /* 2 — Evaluación de Impacto: gráfica de barras con flecha */
  2: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="20" x2="20" y2="20"/>
      <rect x="5" y="13" width="3" height="7" rx="0.5" fill="rgba(255,255,255,0.35)" stroke={S} strokeWidth="1.2"/>
      <rect x="10.5" y="8" width="3" height="12" rx="0.5" fill="rgba(255,255,255,0.35)" stroke={S} strokeWidth="1.2"/>
      <rect x="16" y="4" width="3" height="16" rx="0.5" fill="rgba(255,255,255,0.55)" stroke={S} strokeWidth="1.2"/>
      <polyline points="14,4 18,1 22,4" stroke={S} strokeWidth="1.4"/>
    </svg>
  ),
  /* 3 — Georeferenciación: cuadrícula con crosshair */
  3: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
      <circle cx="12" cy="12" r="2.5" fill={F} stroke="none"/>
    </svg>
  ),
  /* 4 — Análisis de Clúster: nodos conectados */
  4: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="5" cy="17" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="19" cy="17" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="12" cy="13" r="3" fill="rgba(255,255,255,0.55)"/>
      <line x1="12" y1="7" x2="12" y2="10"/>
      <line x1="9.5" y1="14.8" x2="6.5" y2="15.8"/>
      <line x1="14.5" y1="14.8" x2="17.5" y2="15.8"/>
    </svg>
  ),
  /* 5 — Recolección en Campo: portapapeles con pin */
  5: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>
      <circle cx="17" cy="17" r="2.5" fill="rgba(255,255,255,0.4)"/>
      <line x1="17" y1="19.5" x2="17" y2="22" strokeWidth="1.8"/>
    </svg>
  ),
  /* 6 — Lineamientos Técnicos Ambientales: hoja con documento */
  6: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  /* 7 — Inversión Social Territorial: mano con brote/semilla */
  7: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      <path d="M12 7v6"/>
      <path d="M9 12c0 0 1.5-2 3-2s3 2 3 2"/>
      <path d="M5 13h14l-1.5 7H6.5z"/>
    </svg>
  ),
  /* 8 — Prevención y Diálogo Social: burbujas de chat con escudo */
  8: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="12" y2="14"/>
    </svg>
  ),
  /* 9 — Formulación de Proyectos: árbol jerárquico */
  9: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" fill="rgba(255,255,255,0.35)"/>
      <rect x="2" y="17" width="6" height="4" rx="1" fill="rgba(255,255,255,0.35)"/>
      <rect x="16" y="17" width="6" height="4" rx="1" fill="rgba(255,255,255,0.35)"/>
      <line x1="12" y1="6" x2="12" y2="11"/>
      <line x1="5" y1="11" x2="19" y2="11"/>
      <line x1="5" y1="11" x2="5" y2="17"/>
      <line x1="19" y1="11" x2="19" y2="17"/>
    </svg>
  ),
  /* 10 — Campus Virtual Beneficiarios: birrete con play */
  10: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 12 15 2 8.5" fill="rgba(255,255,255,0.25)"/>
      <path d="M6 12v5c0 0 2.5 3 6 3s6-3 6-3v-5"/>
      <line x1="22" y1="8.5" x2="22" y2="14"/>
    </svg>
  ),
  /* 11 — Campus Virtual Comunidades: globo con personas */
  11: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  /* 12 — Campus Virtual Personal: escudo con insignia */
  12: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.2)"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M9 16c0-1.66 1.34-3 3-3s3 1.34 3 3"/>
    </svg>
  ),
  /* 13 — Aceleradora Exportadora: cohete */
  13: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="rgba(255,255,255,0.2)"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  /* 14 — Padrón de Beneficiarios: tarjeta de ID con QR */
  14: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="8" cy="12" r="2.5" fill="rgba(255,255,255,0.4)"/>
      <line x1="12" y1="10" x2="19" y2="10"/>
      <line x1="12" y1="14" x2="17" y2="14"/>
    </svg>
  ),
  /* 15 — CRM de Actores: nodos de red */
  15: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" fill="rgba(255,255,255,0.35)"/>
      <circle cx="6" cy="12" r="3" fill="rgba(255,255,255,0.35)"/>
      <circle cx="18" cy="19" r="3" fill="rgba(255,255,255,0.35)"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  /* 16 — Consulta Previa: balanza de justicia */
  16: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M5 21h14"/>
      <path d="M3 6l9-3 9 3"/>
      <path d="M6 12H3l3-6 3 6a3 3 0 0 1-3 0z" fill="rgba(255,255,255,0.25)"/>
      <path d="M18 12h-3l3-6 3 6a3 3 0 0 1-3 0z" fill="rgba(255,255,255,0.25)"/>
    </svg>
  ),
  /* 17 — Reclutamiento: persona con checkmark */
  17: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
  /* 18 — Administración de Personal: personas con engranaje */
  18: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3"/>
      <path d="M3 20v-2a4 4 0 0 1 4-4h4"/>
      <circle cx="18" cy="16" r="2"/>
      <path d="M18 12v1m0 6v1m-3.46-4.54.71.71m5.5 0 .71-.71M14 16h1m6 0h1m-4.54 3.46.71.71m0-8.38.71-.71" strokeWidth="1.2"/>
    </svg>
  ),
  /* 19 — Gestión de Alianzas: apretón de manos */
  19: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
      <path d="M8 6l3 3-3 3"/>
      <path d="M16 6l-3 3 3 3"/>
    </svg>
  ),
  /* 20 — Seguridad y Accesos: candado con escudo */
  20: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="rgba(255,255,255,0.2)"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      <circle cx="12" cy="16" r="1.5" fill={F} stroke="none"/>
      <line x1="12" y1="17.5" x2="12" y2="19.5" strokeWidth="1.8"/>
    </svg>
  ),
  /* 21 — Monitoreo Plan Operativo: velocímetro/gauge */
  21: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10"/>
      <path d="M12 6v6l4 2" strokeWidth="1.6"/>
      <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.4)"/>
      <path d="M20 14v3.5"/>
      <path d="M16.76 16.76l2.47 2.47"/>
    </svg>
  ),
  /* 22 — Gestión Financiera: monedas con gráfica */
  22: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="5" fill="rgba(255,255,255,0.2)"/>
      <circle cx="8" cy="9" r="5"/>
      <line x1="8" y1="6" x2="8" y2="12"/>
      <line x1="5.5" y1="7.5" x2="10.5" y2="7.5"/>
      <line x1="5.5" y1="10.5" x2="10.5" y2="10.5"/>
      <polyline points="14 17 17 14 20 16 23 12" stroke={S} strokeWidth="1.4"/>
    </svg>
  ),
  /* 23 — Cuentas de Cobro: factura/recibo */
  23: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z" fill="rgba(255,255,255,0.18)"/>
      <line x1="8" y1="9" x2="16" y2="9"/>
      <line x1="8" y1="13" x2="14" y2="13"/>
      <line x1="8" y1="17" x2="11" y2="17"/>
    </svg>
  ),
  /* 24 — Secretaría de Comité: mazo/gavel */
  24: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 12.5-8 8a2.119 2.119 0 0 1-3-3l8-8"/>
      <path d="m16 16 6-6" strokeWidth="1.2"/>
      <path d="m8 8 6-6"/>
      <path d="m9 7 8 8"/>
      <path d="m21 11-8-8"/>
    </svg>
  ),
  /* 25 — Adquisiciones ESAL: carrito con contrato */
  25: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="rgba(255,255,255,0.18)"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  /* 26 — Matriz de Riesgos: grid con triángulo de alerta */
  26: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="13" y="3" width="8" height="8" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="3" y="13" width="8" height="8" rx="1" fill="rgba(255,255,255,0.35)"/>
      <path d="M13 20.5 17.5 13 22 20.5z" fill="rgba(255,255,255,0.5)" stroke={S} strokeWidth="1.2"/>
      <line x1="17.5" y1="15.5" x2="17.5" y2="17.5" strokeWidth="1.8"/>
      <circle cx="17.5" cy="19" r="0.6" fill={F} stroke="none"/>
    </svg>
  ),
  /* 27 — Revisión de Informes: documento con flujo de aprobación */
  27: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(255,255,255,0.18)"/>
      <polyline points="14 2 14 8 20 8"/>
      <polyline points="9 15 11 17 15 13"/>
    </svg>
  ),
  /* 28 — Compilador Informes ANH: documentos apilados con flecha */
  28: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" fill="rgba(255,255,255,0.18)"/>
      <rect x="8" y="3" width="13" height="13" rx="2" fill="rgba(255,255,255,0.18)"/>
      <path d="M13 8h5m-5 4h5"/>
      <line x1="14.5" y1="20" x2="14.5" y2="14"/>
      <polyline points="12 16 14.5 14 17 16"/>
    </svg>
  ),
  /* 29 — Gestión del Conocimiento: bombilla con libro */
  29: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.96 4.96 0 0 0 18 8 6 6 0 0 0 6 8c0 1.38.5 2.64 1.5 3.5.75.76 1.23 1.52 1.41 2.5" fill="rgba(255,255,255,0.2)"/>
    </svg>
  ),
  /* 30 — Agenda Territorial: calendario con pin */
  30: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" fill="rgba(255,255,255,0.18)"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="16" cy="16" r="2.5" fill="rgba(255,255,255,0.4)"/>
      <line x1="16" y1="18.5" x2="16" y2="21" strokeWidth="1.8"/>
    </svg>
  ),
  /* 31 — Gestión Logística: camión con ruta */
  31: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" fill="rgba(255,255,255,0.18)"/>
      <path d="M16 8h4l3 3v5h-7V8z" fill="rgba(255,255,255,0.25)"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  /* 32 — Visibilidad y Prensa: megáfono con ondas */
  32: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z" fill="rgba(255,255,255,0.25)"/>
    </svg>
  ),
  /* 33 — HSE y Emergencias: cruz médica con alerta */
  33: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.18)"/>
      <line x1="12" y1="9" x2="12" y2="15"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  /* 34 — Gestión Documental IA: carpeta con chispa/IA */
  34: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.2)"/>
      <path d="M12 12l1.5-2.5 1.5 2.5-2.5 1.5 2.5 1.5-1.5 2.5-1.5-2.5 2.5-1.5z" fill={F} stroke="none"/>
    </svg>
  ),
  /* 35 — Control de Inventarios: caja con QR */
  35: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="rgba(255,255,255,0.18)"/>
      <line x1="3.27" y1="6.96" x2="12" y2="12.01"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
      <line x1="20.73" y1="6.96" x2="12" y2="12.01"/>
    </svg>
  ),
  /* 36 — Monitor de Pólizas: escudo con reloj */
  36: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.18)"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="9" x2="12" y2="12" strokeWidth="1.6"/>
      <line x1="12" y1="12" x2="14" y2="13" strokeWidth="1.6"/>
    </svg>
  ),
  /* 37 — Liquidación y Cierre: checklist con bandera */
  37: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="16" y2="18"/>
      <polyline points="3 6 4 7 6 5"/>
      <polyline points="3 12 4 13 6 11"/>
      <polyline points="3 18 4 19 6 17"/>
    </svg>
  ),
  /* 38 — Mesa de Ayuda: auricular con ticket */
  38: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  /* 39 — Continuidad Tecnológica: nube con flechas de sincronía */
  39: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h18" strokeDasharray="3 2"/>
    </svg>
  ),
};

function ModuleCardHeader({ moduloId, grupoId, grupoColor }) {
  const Icon = MODULE_ICONS[moduloId] || (() => null);
  return (
    <div style={{
      width: 'calc(100% + 2.5rem)',
      margin: '-1.1rem -1.25rem 1rem',
      height: '100px',
      borderRadius: '14px 14px 0 0',
      background: `linear-gradient(150deg, ${grupoColor}e6 0%, ${grupoColor}99 55%, ${grupoColor}18 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Shine superior */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Letra difuminada del grupo */}
      <span style={{
        position: 'absolute',
        fontSize: '96px',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.08)',
        lineHeight: 1,
        userSelect: 'none',
        bottom: '-14px',
        right: '10px',
        fontFamily: 'var(--font)',
        letterSpacing: '-2px',
      }}>
        {grupoId}
      </span>
      {/* Ícono único del módulo */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
      }}>
        <Icon />
      </div>
    </div>
  );
}

export default function ModulosPage() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading, error } = useModulosVisibles(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedModulo, setSelectedModulo] = useState(null);

  const filtroGrupo = searchParams.get('grupo') || '';
  const setFiltroGrupo = (val) => {
    if (val) setSearchParams({ grupo: val });
    else setSearchParams({});
  };

  function abrirModal(m, g) {
    const richData = moduloMap[m.id];
    if (!richData) return;
    setSelectedModulo({ ...richData, grupoColor: g.color, grupoNombre: g.name });
    addLog(user, 'ABRIR_MODULO', `#${m.id} — ${m.name}`);
  }

  if (loading) return <p style={{ color: 'var(--content-text-muted)' }}>Cargando módulos…</p>;
  if (error)   return <p style={{ color: 'var(--status-danger)' }}>{error}</p>;

  const modulosFiltrados = modulosVisibles.filter(m => {
    const coincideGrupo    = !filtroGrupo || m.grupoId === filtroGrupo;
    const coincideBusqueda = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return coincideGrupo && coincideBusqueda;
  });

  const gruposAccesibles = GROUPS.filter(g =>
    modulosVisibles.some(m => m.grupoId === g.id)
  );

  const gruposConModulos = gruposAccesibles
    .map(g => ({ ...g, modulos: modulosFiltrados.filter(m => m.grupoId === g.id) }))
    .filter(g => g.modulos.length > 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--content-text)' }}>
        Módulos
      </h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          className="form-input"
          style={{ maxWidth: '240px' }}
          placeholder="Buscar módulo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={filtroGrupo}
          onChange={e => setFiltroGrupo(e.target.value)}
        >
          <option value="">Todos los grupos</option>
          {gruposAccesibles.map(g => (
            <option key={g.id} value={g.id}>{g.id} — {g.name}</option>
          ))}
        </select>
        {(filtroGrupo || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFiltroGrupo(''); setSearch(''); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {gruposConModulos.length === 0 && (
        <p style={{ color: 'var(--content-text-muted)' }}>No se encontraron módulos.</p>
      )}

      {gruposConModulos.map(g => (
        <div key={g.id} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: g.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', flexShrink: 0,
            }}>
              {g.id}
            </span>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--content-text)' }}>
              {g.name}
            </span>
            <span className="badge" style={{ background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
              {g.modulos.length}
            </span>
          </div>

          <div className="modules-grid">
            {g.modulos.map(m => (
              <div key={m.id} className={`module-card group-${g.id.toLowerCase()}`}>
                <ModuleCardHeader moduloId={m.id} grupoId={g.id} grupoColor={g.color} />

                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--content-text-hint)', fontWeight: 500 }}>
                    #{m.id}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--content-text)', lineHeight: 1.35 }}>
                  {m.name}
                </div>
                <div style={{
                  fontSize: '12px', color: 'var(--content-text-muted)',
                  marginBottom: '14px', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  flex: 1,
                }}>
                  {m.desc}
                </div>
                <button
                  onClick={() => abrirModal(m, g)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', fontWeight: 600,
                    color: g.color, background: g.color + '12',
                    border: 'none', borderRadius: '6px',
                    padding: '5px 11px', cursor: 'pointer',
                    transition: 'background .15s',
                    marginTop: 'auto',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = g.color + '22'}
                  onMouseLeave={e => e.currentTarget.style.background = g.color + '12'}
                >
                  Abrir módulo →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedModulo && (
        <ModuloModal modulo={selectedModulo} onClose={() => setSelectedModulo(null)} />
      )}
    </div>
  );
}
