import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  ComposedChart,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { modulos } from '../data/modulos';
import { GROUPS } from '../data/constants';
import { demos } from '../data/demos';

// ─── Paleta base (invariante) ─────────────────────────────────────────
const BASE = {
  text:   '#E2E8F0',
  muted:  '#8892B0',
  accent: '#4B8EF1',
  green:  '#00D48B',
  orange: '#F5A623',
  red:    '#FF4D6A',
  // defaults que se sobreescriben por grupo:
  bg:     '#0A0E2A',
  card:   '#111836',
  card2:  '#141c3e',
  border: '#1E2A5A',
};

// ─── Paleta oscura por grupo (bg · card · card2 · border) ─────────────
// Cada valor mezcla ~12-20% del color identidad del grupo sobre una base casi negra.
const GROUP_DARK = {
  A: { bg: '#060f0a', card: '#0b1a13', card2: '#0e2018', border: '#163324' }, // Verde bosque
  B: { bg: '#120800', card: '#1c1103', card2: '#211505', border: '#301d07' }, // Ámbar café
  C: { bg: '#080519', card: '#100a27', card2: '#140e30', border: '#1f1245' }, // Púrpura profundo
  D: { bg: '#02101c', card: '#051828', card2: '#082030', border: '#0c3048' }, // Azul océano
  E: { bg: '#140404', card: '#1e0606', card2: '#240808', border: '#360c0c' }, // Carmesí oscuro
  F: { bg: '#030d14', card: '#06151f', card2: '#091c28', border: '#0e2c3f' }, // Cian profundo
  G: { bg: '#031008', card: '#071a10', card2: '#0a2015', border: '#103020' }, // Esmeralda oscuro
  H: { bg: '#080418', card: '#0e0824', card2: '#12092c', border: '#1c1042' }, // Violeta profundo
  I: { bg: '#07090e', card: '#0d1018', card2: '#12161f', border: '#1c2335' }, // Gris pizarra
};

// ─── Seeded PRNG ──────────────────────────────────────────────────────
function seededRand(seed) {
  let s = ((seed * 1664525 + 1013904223) & 0x7fffffff) >>> 0;
  return () => {
    s = ((s * 1664525 + 1013904223) & 0x7fffffff) >>> 0;
    return s / 0x7fffffff;
  };
}

// ─── Parse KPI value para count-up ───────────────────────────────────
function parseForAnim(raw) {
  const s = String(raw).trim();
  if (/\//.test(s)) return null;
  if (/[a-zA-Z]/.test(s) && !/[%hMK]$/.test(s)) return null;
  let m;
  m = s.match(/^\$(\d+(?:\.\d+)?)M$/);
  if (m) return { pre: '$', num: +m[1], suf: 'M', dec: 1 };
  m = s.match(/^\$(\d+(?:\.\d+)?)$/);
  if (m) return { pre: '$', num: +m[1], suf: '', dec: m[1].includes('.') ? 1 : 0 };
  m = s.match(/^(\d{1,3})\.(\d{3})$/);
  if (m) {
    const num = parseInt(s.replace('.', ''), 10);
    return { pre: '', num, suf: '', dec: 0, fmt: n => n >= 1000 ? Math.floor(n / 1000) + '.' + String(n % 1000).padStart(3, '0') : String(n) };
  }
  m = s.match(/^(\d+(?:\.\d+)?)K$/);
  if (m) return { pre: '', num: +m[1], suf: 'K', dec: 1 };
  m = s.match(/^(\d+(?:\.\d+)?)%$/);
  if (m) return { pre: '', num: +m[1], suf: '%', dec: m[1].includes('.') ? 1 : 0 };
  m = s.match(/^(\d+(?:\.\d+)?)h$/);
  if (m) return { pre: '', num: +m[1], suf: 'h', dec: 1 };
  m = s.match(/^\d+$/);
  if (m) return { pre: '', num: +s, suf: '', dec: 0 };
  return null;
}

// ─── Count-up hook ────────────────────────────────────────────────────
function useCountUp(rawValue) {
  const parsed = useMemo(() => parseForAnim(rawValue), [rawValue]);
  const [display, setDisplay] = useState(parsed ? parsed.pre + '0' + parsed.suf : rawValue);
  useEffect(() => {
    if (!parsed) { setDisplay(rawValue); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / 1600, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = parsed.num * e;
      const fmted = parsed.fmt ? parsed.fmt(Math.round(cur)) : parsed.dec > 0 ? cur.toFixed(parsed.dec) : String(Math.round(cur));
      setDisplay(parsed.pre + fmted + parsed.suf);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawValue, parsed]);
  return display;
}

// ─── Sparkline data ───────────────────────────────────────────────────
function genSparkline(seed) {
  const r = seededRand(seed);
  let v = 30 + r() * 40;
  return Array.from({ length: 6 }, (_, i) => {
    v = Math.max(8, Math.min(95, v + (r() - 0.38) * 22 + i));
    return { v: Math.round(v) };
  });
}

// ─── Chart data ───────────────────────────────────────────────────────
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

function genChartData(moduleId, grupo) {
  const r = seededRand(moduleId * 41 + grupo.charCodeAt(0) * 7);
  if (grupo === 'E') {
    return MESES.map((mes, i) => ({
      mes,
      'Presupuesto': Math.round(2200 + r() * 600),
      'Ejecutado':   Math.round(300 + r() * (350 + i * 130)),
    }));
  }
  if (grupo === 'D') {
    return [
      { cat: 'Beneficiarios', val: Math.round(300 + r() * 3500) },
      { cat: 'Comunidades',   val: Math.round(20 + r() * 70) },
      { cat: 'Aliados',       val: Math.round(5 + r() * 40) },
      { cat: 'Autoridades',   val: Math.round(15 + r() * 60) },
      { cat: 'Operadoras',    val: Math.round(3 + r() * 15) },
    ];
  }
  if (grupo === 'C') {
    let ins = 0;
    return MESES.map(mes => {
      ins += Math.round(110 + r() * 290);
      return { mes, 'Inscritos': ins, 'Certificados': Math.round(ins * (0.42 + r() * 0.36)) };
    });
  }
  if (grupo === 'I') {
    return MESES.map(mes => ({ mes, 'Disponibilidad': +((98.3 + r() * 1.6).toFixed(1)) }));
  }
  if (grupo === 'B' || grupo === 'F' || grupo === 'H') {
    return MESES.map(mes => ({
      mes,
      'Ejecutado': Math.round(7 + r() * 22),
      'Meta':      Math.round(11 + r() * 7),
    }));
  }
  let v = 20 + r() * 18;
  return MESES.map(mes => {
    v = Math.min(98, v + 3 + r() * 13);
    return { mes, 'Avance (%)': Math.round(v) };
  });
}

// ─── Tooltip oscuro (recibe tema) ─────────────────────────────────────
function makeDarkTooltip(theme) {
  return function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: theme.card2, border: `1px solid ${theme.border}`,
        borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}>
        {label && <p style={{ color: theme.muted, marginBottom: '6px', fontSize: '11px' }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600, marginBottom: i < payload.length - 1 ? '3px' : 0 }}>
            {p.name}: <span style={{ color: theme.text }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  };
}

// ─── Gráfica por grupo ────────────────────────────────────────────────
function DemoChart({ grupo, moduleId, color, theme }) {
  const data = useMemo(() => genChartData(moduleId, grupo), [moduleId, grupo]);
  const DarkTooltip = useMemo(() => makeDarkTooltip(theme), [theme]);

  const axProps = {
    tick: { fill: theme.muted, fontSize: 11 },
    axisLine: { stroke: theme.border },
    tickLine: false,
  };
  const gridProps = { strokeDasharray: '3 3', stroke: theme.border, vertical: false };
  const tip = <Tooltip content={<DarkTooltip />} cursor={{ stroke: theme.border, strokeWidth: 1 }} />;
  const leg = <Legend wrapperStyle={{ color: theme.muted, fontSize: 12, paddingTop: '8px' }} />;
  const g1  = `g1_${moduleId}`;
  const g2  = `g2_${moduleId}`;

  if (grupo === 'E') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={6} barCategoryGap="30%">
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Bar dataKey="Presupuesto" fill={BASE.accent + 'aa'} radius={[4,4,0,0]} />
          <Bar dataKey="Ejecutado"   fill={BASE.green}         radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (grupo === 'D') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} horizontal={false} vertical={false} />
          <XAxis type="number" {...axProps} />
          <YAxis dataKey="cat" type="category" width={105} {...axProps} />
          {tip}
          <Bar dataKey="val" name="Registros" fill={color} radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (grupo === 'C') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={g1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color}      stopOpacity={0.45} />
              <stop offset="95%" stopColor={color}      stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={BASE.green} stopOpacity={0.45} />
              <stop offset="95%" stopColor={BASE.green} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Area type="monotone" dataKey="Inscritos"    stroke={color}      fill={`url(#${g1})`} strokeWidth={2} />
          <Area type="monotone" dataKey="Certificados" stroke={BASE.green} fill={`url(#${g2})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  if (grupo === 'I') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={g1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={BASE.green} stopOpacity={0.5} />
              <stop offset="95%" stopColor={BASE.green} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis domain={[97, 100.5]} {...axProps} tickFormatter={v => `${v}%`} />
          {tip}{leg}
          <ReferenceLine y={99.5} stroke={BASE.orange} strokeDasharray="5 3"
            label={{ value: 'SLA 99.5%', fill: BASE.orange, fontSize: 10, position: 'insideTopRight' }}
          />
          <Area type="monotone" dataKey="Disponibilidad" stroke={BASE.green} fill={`url(#${g1})`}
            strokeWidth={2} dot={{ fill: BASE.green, r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  if (grupo === 'B' || grupo === 'F' || grupo === 'H') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Bar  dataKey="Ejecutado" fill={color + 'cc'} radius={[4,4,0,0]} />
          <Line type="monotone" dataKey="Meta" stroke={BASE.orange} strokeWidth={2} dot={false} strokeDasharray="5 3" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
  // A, G → LineChart
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <defs>
          <linearGradient id={g1} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="mes" {...axProps} />
        <YAxis domain={[0, 100]} {...axProps} tickFormatter={v => `${v}%`} />
        {tip}{leg}
        <ReferenceLine y={75} stroke={BASE.orange} strokeDasharray="5 3"
          label={{ value: 'Meta 75%', fill: BASE.orange, fontSize: 10, position: 'insideTopRight' }}
        />
        <Line type="monotone" dataKey="Avance (%)" stroke={`url(#${g1})`} strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: color, stroke: theme.bg, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────
function KpiCard({ kpi, moduleId, idx, theme }) {
  const displayed = useCountUp(kpi.value);
  const spark = useMemo(() => genSparkline(moduleId * 13 + idx * 7), [moduleId, idx]);
  const [hov, setHov] = useState(false);
  const c = kpi.color;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: theme.card,
        border: `1px solid ${hov ? c + '55' : theme.border}`,
        borderRadius: '12px',
        padding: '18px 20px 10px',
        borderTop: `3px solid ${c}`,
        transition: 'border-color .2s, box-shadow .2s, transform .2s',
        transform: hov ? 'translateY(-3px) scale(1.01)' : 'none',
        boxShadow: hov ? `0 12px 32px ${c}22, 0 0 0 1px ${c}18` : 'none',
        display: 'flex', flexDirection: 'column', gap: '3px',
        cursor: 'default',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>
        {kpi.label}
      </p>
      <p style={{ fontSize: '32px', fontWeight: 700, color: c, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '4px 0 2px' }}>
        {displayed}
      </p>
      <p style={{ fontSize: '11px', color: theme.muted, margin: 0 }}>{kpi.sub}</p>
      <div style={{ marginTop: '10px', height: '36px', opacity: 0.65 }}>
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={spark}>
            <Line type="monotone" dataKey="v" stroke={c} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Lookups ──────────────────────────────────────────────────────────
const moduloMap = Object.fromEntries(modulos.map(m => [String(m.id), m]));
const grupoMap  = Object.fromEntries(GROUPS.map(g => [g.id, g]));

// ─── Page ─────────────────────────────────────────────────────────────
export default function ModuloDemoPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const modulo = moduloMap[id];
  const demo   = demos[Number(id)];
  const grupo  = grupoMap[modulo?.grupo];
  const color  = grupo?.color || BASE.accent;

  // Tema derivado del grupo
  const theme = useMemo(() => ({
    ...BASE,
    ...(GROUP_DARK[modulo?.grupo] || {}),
  }), [modulo?.grupo]);

  if (!modulo || !demo) {
    return (
      <div style={{ margin: '-24px', padding: '48px 24px', minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: theme.muted, fontSize: '14px' }}>No se encontró la demo para este módulo.</p>
        <button onClick={() => navigate('/modulos')} style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: BASE.accent, background: 'transparent', border: `1px solid ${BASE.accent}`, borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>
          ← Volver a módulos
        </button>
      </div>
    );
  }

  const numId = Number(id);

  return (
    <div style={{ margin: '-24px', minHeight: '100vh', background: theme.bg, color: theme.text }}>

      {/* ── Top bar sticky ───────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: theme.bg + 'f0',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button
          onClick={() => navigate('/modulos')}
          onMouseEnter={e => { e.currentTarget.style.color = theme.text; e.currentTarget.style.borderColor = color; }}
          onMouseLeave={e => { e.currentTarget.style.color = theme.muted; e.currentTarget.style.borderColor = theme.border; }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '13px', fontWeight: 600, color: theme.muted,
            background: 'transparent', border: `1px solid ${theme.border}`,
            borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
            transition: 'color .15s, border-color .15s', flexShrink: 0,
          }}
        >
          ← Volver
        </button>
        <span style={{ fontSize: '13px', color: theme.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Módulo {modulo.id} · {modulo.nombre}
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: '10px', fontWeight: 700,
          color: color, background: color + '18',
          padding: '3px 10px', borderRadius: '20px',
          border: `1px solid ${color}30`,
          textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0,
        }}>
          Vista Demo
        </span>
      </div>

      {/* ── Contenido ────────────────────────────────────────────── */}
      <div style={{ padding: '28px 24px', maxWidth: '980px', margin: '0 auto' }}>

        {/* Image header */}
        {modulo.imagen && (
          <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '22px', position: 'relative', height: '180px' }}>
            <img src={modulo.imagen} alt={modulo.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.4) saturate(1.3)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(120deg, ${theme.bg}ee 0%, ${theme.bg}55 55%, ${theme.bg}22 100%)`,
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
            <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', alignItems: 'flex-end' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: color, color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                    {modulo.id}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(6px)' }}>
                    Grupo {modulo.grupo} · {grupo?.name}
                  </span>
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.25, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
                  {modulo.nombre}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background: color + '12', border: `1px solid ${color}25`,
          borderRadius: '8px', padding: '10px 16px',
          fontSize: '12px', color: color + 'cc',
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '24px',
        }}>
          <span>⚠️</span>
          Los datos mostrados son completamente ficticios y tienen fines exclusivamente ilustrativos.
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))', gap: '14px', marginBottom: '22px' }}>
          {demo.kpis.map((kpi, i) => (
            <KpiCard key={i} kpi={kpi} moduleId={numId} idx={i} theme={theme} />
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '22px' }}>
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
            <p style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Tendencia — Enero a Junio 2026
            </p>
          </div>
          <DemoChart grupo={modulo.grupo} moduleId={numId} color={color} theme={theme} />
        </div>

        {/* Tabla */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Datos de muestra
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {demo.tabla.columnas.map((col, i) => (
                    <th key={i} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '10px', fontWeight: 700, color: theme.muted,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      whiteSpace: 'nowrap',
                      background: theme.bg,
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {demo.tabla.filas.map((fila, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${theme.border}22`, background: ri % 2 === 0 ? 'transparent' : theme.card2 }}>
                    {fila.map((celda, ci) => (
                      <td key={ci} style={{ padding: '10px 16px', color: theme.text, whiteSpace: 'nowrap' }}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ height: '48px' }} />
      </div>
    </div>
  );
}
