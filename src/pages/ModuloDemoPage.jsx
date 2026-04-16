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

// ─── Paleta base clara ────────────────────────────────────────────────
const BASE = {
  bg:     '#f4f6fb',
  card:   '#ffffff',
  card2:  '#f8fafc',
  border: '#e2e8f0',
  text:   '#1e293b',
  muted:  '#64748b',
  hint:   '#94a3b8',
  orange: '#f59e0b',
};

// ─── Tinte claro por grupo (bg · card · border) ───────────────────────
const GROUP_LIGHT = {
  A: { bg: '#f0fdf6', card: '#ffffff', card2: '#f5fffe', border: '#bbf7d0' },
  B: { bg: '#fffbeb', card: '#ffffff', card2: '#fffef5', border: '#fde68a' },
  C: { bg: '#faf5ff', card: '#ffffff', card2: '#fdfaff', border: '#e9d5ff' },
  D: { bg: '#eff6ff', card: '#ffffff', card2: '#f5f9ff', border: '#bfdbfe' },
  E: { bg: '#fff5f5', card: '#ffffff', card2: '#fffafa', border: '#fecaca' },
  F: { bg: '#ecfeff', card: '#ffffff', card2: '#f5feff', border: '#a5f3fc' },
  G: { bg: '#f0fdf4', card: '#ffffff', card2: '#f7fffe', border: '#bbf7d0' },
  H: { bg: '#f5f3ff', card: '#ffffff', card2: '#faf8ff', border: '#ddd6fe' },
  I: { bg: '#f8fafc', card: '#ffffff', card2: '#fbfcfe', border: '#e2e8f0' },
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

// ─── Tooltip claro ────────────────────────────────────────────────────
function LightTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      {label && <p style={{ color: '#94a3b8', marginBottom: '6px', fontSize: '11px' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600, marginBottom: i < payload.length - 1 ? '3px' : 0 }}>
          {p.name}: <span style={{ color: '#1e293b' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Gráfica por grupo ────────────────────────────────────────────────
function DemoChart({ grupo, moduleId, color }) {
  const data = useMemo(() => genChartData(moduleId, grupo), [moduleId, grupo]);

  const axProps = {
    tick: { fill: '#94a3b8', fontSize: 11 },
    axisLine: { stroke: '#e2e8f0' },
    tickLine: false,
  };
  const gridProps = { strokeDasharray: '3 3', stroke: '#f1f5f9', vertical: false };
  const tip = <Tooltip content={<LightTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />;
  const leg = <Legend wrapperStyle={{ color: '#64748b', fontSize: 12, paddingTop: '8px' }} />;
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
          <Bar dataKey="Presupuesto" fill={color + '55'} radius={[4,4,0,0]} />
          <Bar dataKey="Ejecutado"   fill={color}        radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (grupo === 'D') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} vertical={false} />
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
              <stop offset="5%"  stopColor={color}  stopOpacity={0.2} />
              <stop offset="95%" stopColor={color}  stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Area type="monotone" dataKey="Inscritos"    stroke={color}    fill={`url(#${g1})`} strokeWidth={2} />
          <Area type="monotone" dataKey="Certificados" stroke="#10b981"  fill={`url(#${g2})`} strokeWidth={2} />
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
              <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis domain={[97, 100.5]} {...axProps} tickFormatter={v => `${v}%`} />
          {tip}{leg}
          <ReferenceLine y={99.5} stroke={BASE.orange} strokeDasharray="5 3"
            label={{ value: 'SLA 99.5%', fill: BASE.orange, fontSize: 10, position: 'insideTopRight' }}
          />
          <Area type="monotone" dataKey="Disponibilidad" stroke={color} fill={`url(#${g1})`} strokeWidth={2} dot={{ fill: color, r: 3, strokeWidth: 0 }} />
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
          <Bar  dataKey="Ejecutado" fill={color + 'aa'} radius={[4,4,0,0]} />
          <Line type="monotone" dataKey="Meta" stroke={BASE.orange} strokeWidth={2} dot={false} strokeDasharray="5 3" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
  // A, G — LineChart
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <defs>
          <linearGradient id={g1} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="mes" {...axProps} />
        <YAxis domain={[0, 100]} {...axProps} tickFormatter={v => `${v}%`} />
        {tip}{leg}
        <ReferenceLine y={75} stroke={BASE.orange} strokeDasharray="5 3"
          label={{ value: 'Meta 75%', fill: BASE.orange, fontSize: 10, position: 'insideTopRight' }}
        />
        <Line type="monotone" dataKey="Avance (%)" stroke={color} strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
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
        border: `1px solid ${hov ? c + '60' : theme.border}`,
        borderRadius: '12px',
        padding: '18px 20px 10px',
        borderTop: `3px solid ${c}`,
        transition: 'border-color .2s, box-shadow .2s, transform .2s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 24px ${c}18` : '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', gap: '3px',
        cursor: 'default',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 700, color: BASE.muted, textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>
        {kpi.label}
      </p>
      <p style={{ fontSize: '30px', fontWeight: 700, color: c, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '4px 0 2px' }}>
        {displayed}
      </p>
      <p style={{ fontSize: '11px', color: BASE.hint, margin: 0 }}>{kpi.sub}</p>
      <div style={{ marginTop: '10px', height: '36px', opacity: 0.5 }}>
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
  const color  = grupo?.color || '#4f8ef7';

  const theme = useMemo(() => ({
    ...BASE,
    ...(GROUP_LIGHT[modulo?.grupo] || {}),
  }), [modulo?.grupo]);

  if (!modulo || !demo) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: BASE.muted }}>
        <p>No se encontró la demo para este módulo.</p>
        <button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={() => navigate('/modulos')}>
          ← Volver a módulos
        </button>
      </div>
    );
  }

  const numId = Number(id);

  return (
    <div style={{ background: theme.bg, minHeight: '100%' }}>

      {/* ── Botón volver ── */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/modulos')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Volver a módulos
        </button>
      </div>

      <div style={{ maxWidth: '900px' }}>

        {/* Header con imagen */}
        {modulo.imagen && (
          <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '22px', position: 'relative', height: '180px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <img src={modulo.imagen} alt={modulo.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)',
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: color }} />
            <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', alignItems: 'flex-end' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: color, color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                    {modulo.id}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                    Grupo {modulo.grupo} · {grupo?.name}
                  </span>
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {modulo.nombre}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: '8px', padding: '10px 16px',
          fontSize: '12px', color: '#92400e',
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '24px',
        }}>
          <span>⚠️</span>
          Los datos mostrados son completamente ficticios y tienen fines exclusivamente ilustrativos.
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
          {demo.kpis.map((kpi, i) => (
            <KpiCard key={i} kpi={kpi} moduleId={numId} idx={i} theme={theme} />
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <p style={{ fontSize: '11px', fontWeight: 700, color: BASE.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Tendencia — Enero a Junio 2026
            </p>
          </div>
          <DemoChart grupo={modulo.grupo} moduleId={numId} color={color} />
        </div>

        {/* Tabla */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '13px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: BASE.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                      fontSize: '10px', fontWeight: 700, color: BASE.muted,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      whiteSpace: 'nowrap', background: theme.card2,
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {demo.tabla.filas.map((fila, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${theme.border}`, background: ri % 2 === 0 ? 'transparent' : theme.card2 }}>
                    {fila.map((celda, ci) => (
                      <td key={ci} style={{ padding: '10px 16px', color: BASE.text, whiteSpace: 'nowrap' }}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
}
