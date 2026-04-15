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

// ─── Dark palette ─────────────────────────────────────────────────────
const D = {
  bg:     '#0A0E2A',
  card:   '#111836',
  card2:  '#141c3e',
  border: '#1E2A5A',
  text:   '#E2E8F0',
  muted:  '#8892B0',
  accent: '#4B8EF1',
  green:  '#00D48B',
  orange: '#F5A623',
  red:    '#FF4D6A',
};

// ─── Seeded PRNG ──────────────────────────────────────────────────────
function seededRand(seed) {
  let s = ((seed * 1664525 + 1013904223) & 0x7fffffff) >>> 0;
  return () => {
    s = ((s * 1664525 + 1013904223) & 0x7fffffff) >>> 0;
    return s / 0x7fffffff;
  };
}

// ─── Parse KPI value for count-up ────────────────────────────────────
function parseForAnim(raw) {
  const s = String(raw).trim();
  if (/\//.test(s)) return null;
  if (/[a-zA-Z]/.test(s) && !/[%hMK]$/.test(s)) return null;
  let m;
  m = s.match(/^\$(\d+(?:\.\d+)?)M$/);
  if (m) return { pre: '$', num: +m[1], suf: 'M', dec: 1 };
  m = s.match(/^\$(\d+(?:\.\d+)?)$/);
  if (m) return { pre: '$', num: +m[1], suf: '', dec: m[1].includes('.') ? 1 : 0 };
  m = s.match(/^(\d{1,3})\.(\d{3})$/); // Spanish thousands "1.847"
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
function useCountUp(rawValue, duration) {
  const dur = duration || 1600;
  const parsed = useMemo(() => parseForAnim(rawValue), [rawValue]);
  const [display, setDisplay] = useState(parsed ? parsed.pre + '0' + parsed.suf : rawValue);

  useEffect(() => {
    if (!parsed) { setDisplay(rawValue); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = parsed.num * e;
      const fmted = parsed.fmt
        ? parsed.fmt(Math.round(cur))
        : parsed.dec > 0 ? cur.toFixed(parsed.dec) : String(Math.round(cur));
      setDisplay(parsed.pre + fmted + parsed.suf);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawValue, parsed, dur]);

  return display;
}

// ─── Sparkline data (6 pts, deterministic) ───────────────────────────
function genSparkline(seed) {
  const r = seededRand(seed);
  let v = 30 + r() * 40;
  return Array.from({ length: 6 }, (_, i) => {
    v = Math.max(8, Math.min(95, v + (r() - 0.38) * 22 + i));
    return { v: Math.round(v) };
  });
}

// ─── Chart data (deterministic by moduleId + grupo) ──────────────────
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
    return MESES.map(mes => ({
      mes,
      'Disponibilidad': +((98.3 + r() * 1.6).toFixed(1)),
    }));
  }
  if (grupo === 'B' || grupo === 'F' || grupo === 'H') {
    return MESES.map(mes => ({
      mes,
      'Ejecutado': Math.round(7 + r() * 22),
      'Meta':      Math.round(11 + r() * 7),
    }));
  }
  // A, G → line chart (avance porcentual)
  let v = 20 + r() * 18;
  return MESES.map(mes => {
    v = Math.min(98, v + 3 + r() * 13);
    return { mes, 'Avance (%)': Math.round(v) };
  });
}

// ─── Dark tooltip ─────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a2150', border: `1px solid ${D.border}`,
      borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {label && <p style={{ color: D.muted, marginBottom: '6px', fontSize: '11px' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600, marginBottom: i < payload.length - 1 ? '3px' : 0 }}>
          {p.name}: <span style={{ color: D.text }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Chart per grupo ──────────────────────────────────────────────────
function DemoChart({ grupo, moduleId, color }) {
  const data = useMemo(() => genChartData(moduleId, grupo), [moduleId, grupo]);
  const axProps = {
    tick: { fill: D.muted, fontSize: 11 },
    axisLine: { stroke: D.border },
    tickLine: false,
  };
  const gridProps = { strokeDasharray: '3 3', stroke: D.border, vertical: false };
  const tip  = <Tooltip content={<DarkTooltip />} cursor={{ stroke: D.border, strokeWidth: 1 }} />;
  const leg  = <Legend wrapperStyle={{ color: D.muted, fontSize: 12, paddingTop: '8px' }} />;
  const g1   = `g1_${moduleId}`;
  const g2   = `g2_${moduleId}`;

  if (grupo === 'E') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={6} barCategoryGap="30%">
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Bar dataKey="Presupuesto" fill={D.accent + 'aa'} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Ejecutado"   fill={D.green}         radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (grupo === 'D') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={D.border} horizontal={false} vertical={false} />
          <XAxis type="number" {...axProps} />
          <YAxis dataKey="cat" type="category" width={105} {...axProps} />
          {tip}
          <Bar dataKey="val" name="Registros" fill={color} radius={[0, 4, 4, 0]} />
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
              <stop offset="5%"  stopColor={color}  stopOpacity={0.45} />
              <stop offset="95%" stopColor={color}  stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={D.green} stopOpacity={0.45} />
              <stop offset="95%" stopColor={D.green} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis {...axProps} />
          {tip}{leg}
          <Area type="monotone" dataKey="Inscritos"    stroke={color}  fill={`url(#${g1})`} strokeWidth={2} />
          <Area type="monotone" dataKey="Certificados" stroke={D.green} fill={`url(#${g2})`} strokeWidth={2} />
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
              <stop offset="5%"  stopColor={D.green} stopOpacity={0.5} />
              <stop offset="95%" stopColor={D.green} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="mes" {...axProps} />
          <YAxis domain={[97, 100.5]} {...axProps} tickFormatter={v => `${v}%`} />
          {tip}{leg}
          <ReferenceLine y={99.5} stroke={D.orange} strokeDasharray="5 3"
            label={{ value: 'SLA 99.5%', fill: D.orange, fontSize: 10, position: 'insideTopRight' }}
          />
          <Area type="monotone" dataKey="Disponibilidad" stroke={D.green} fill={`url(#${g1})`}
            strokeWidth={2} dot={{ fill: D.green, r: 3, strokeWidth: 0 }}
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
          <Bar  dataKey="Ejecutado" fill={color + 'cc'} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="Meta" stroke={D.orange} strokeWidth={2}
            dot={false} strokeDasharray="5 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // A, G — LineChart
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <defs>
          <linearGradient id={g1} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="mes" {...axProps} />
        <YAxis domain={[0, 100]} {...axProps} tickFormatter={v => `${v}%`} />
        {tip}{leg}
        <ReferenceLine y={75} stroke={D.orange} strokeDasharray="5 3"
          label={{ value: 'Meta 75%', fill: D.orange, fontSize: 10, position: 'insideTopRight' }}
        />
        <Line
          type="monotone" dataKey="Avance (%)" stroke={`url(#${g1})`} strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: color, stroke: D.bg, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────
function KpiCard({ kpi, moduleId, idx }) {
  const displayed = useCountUp(kpi.value);
  const spark = useMemo(() => genSparkline(moduleId * 13 + idx * 7), [moduleId, idx]);
  const [hov, setHov] = useState(false);
  const c = kpi.color;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: D.card,
        border: `1px solid ${hov ? c + '55' : D.border}`,
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
      <p style={{
        fontSize: '10px', fontWeight: 700, color: D.muted,
        textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0,
      }}>
        {kpi.label}
      </p>
      <p style={{
        fontSize: '32px', fontWeight: 700, color: c,
        lineHeight: 1.1, letterSpacing: '-0.02em', margin: '4px 0 2px',
      }}>
        {displayed}
      </p>
      <p style={{ fontSize: '11px', color: D.muted, margin: 0 }}>{kpi.sub}</p>
      {/* Sparkline */}
      <div style={{ marginTop: '10px', height: '36px', opacity: 0.65 }}>
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={spark}>
            <Line
              type="monotone" dataKey="v" stroke={c}
              strokeWidth={1.5} dot={false} isAnimationActive={false}
            />
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

  if (!modulo || !demo) {
    return (
      <div style={{
        margin: '-24px', padding: '48px 24px',
        minHeight: '100vh', background: D.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: D.muted, fontSize: '14px' }}>No se encontró la demo para este módulo.</p>
        <button
          onClick={() => navigate('/modulos')}
          style={{
            marginTop: '16px', fontSize: '13px', fontWeight: 600,
            color: D.accent, background: 'transparent',
            border: `1px solid ${D.accent}`, borderRadius: '8px',
            padding: '8px 16px', cursor: 'pointer',
          }}
        >
          ← Volver a módulos
        </button>
      </div>
    );
  }

  const grupo = grupoMap[modulo.grupo];
  const color = grupo?.color || D.accent;
  const numId = Number(id);

  return (
    <div style={{ margin: '-24px', minHeight: '100vh', background: D.bg, color: D.text }}>

      {/* ── Sticky top bar ───────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: D.bg + 'f0',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${D.border}`,
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button
          onClick={() => navigate('/modulos')}
          onMouseEnter={e => { e.currentTarget.style.color = D.text; e.currentTarget.style.borderColor = D.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = D.muted; e.currentTarget.style.borderColor = D.border; }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '13px', fontWeight: 600, color: D.muted,
            background: 'transparent', border: `1px solid ${D.border}`,
            borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
            transition: 'color .15s, border-color .15s', flexShrink: 0,
          }}
        >
          ← Volver
        </button>

        <span style={{
          fontSize: '13px', color: D.muted,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          Módulo {modulo.id} · {modulo.nombre}
        </span>

        <span style={{
          marginLeft: 'auto', fontSize: '10px', fontWeight: 700,
          color: color, background: color + '18',
          padding: '3px 10px', borderRadius: '20px',
          border: `1px solid ${color}30`,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          Vista Demo
        </span>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div style={{ padding: '28px 24px', maxWidth: '980px', margin: '0 auto' }}>

        {/* Image header */}
        {modulo.imagen && (
          <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '22px', position: 'relative', height: '180px' }}>
            <img
              src={modulo.imagen} alt={modulo.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.45) saturate(1.3)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(120deg, ${D.bg}dd 0%, ${D.bg}55 55%, ${D.bg}22 100%)`,
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
            <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', alignItems: 'flex-end' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: color, color: '#fff',
                    width: '32px', height: '32px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px', flexShrink: 0,
                  }}>
                    {modulo.id}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: '#fff',
                    background: 'rgba(0,0,0,0.45)', padding: '3px 10px',
                    borderRadius: '20px', backdropFilter: 'blur(6px)',
                  }}>
                    Grupo {modulo.grupo} · {grupo?.name}
                  </span>
                </div>
                <h1 style={{
                  fontSize: '22px', fontWeight: 700, color: '#fff',
                  margin: 0, lineHeight: 1.25,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                }}>
                  {modulo.nombre}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background: '#16110a', border: '1px solid #fde68a28',
          borderRadius: '8px', padding: '10px 16px',
          fontSize: '12px', color: '#fde68acc',
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '24px',
        }}>
          <span>⚠️</span>
          Los datos mostrados son completamente ficticios y tienen fines exclusivamente ilustrativos.
        </div>

        {/* KPI grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
          gap: '14px',
          marginBottom: '22px',
        }}>
          {demo.kpis.map((kpi, i) => (
            <KpiCard key={i} kpi={kpi} moduleId={numId} idx={i} />
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: D.card, border: `1px solid ${D.border}`,
          borderRadius: '12px', padding: '20px 24px', marginBottom: '22px',
        }}>
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0,
            }} />
            <p style={{
              fontSize: '11px', fontWeight: 700, color: D.muted,
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>
              Tendencia — Enero a Junio 2026
            </p>
          </div>
          <DemoChart grupo={modulo.grupo} moduleId={numId} color={color} />
        </div>

        {/* Table */}
        <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{
            padding: '13px 20px', borderBottom: `1px solid ${D.border}`,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0,
            }} />
            <span style={{
              fontSize: '11px', fontWeight: 700, color: D.muted,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
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
                      fontSize: '10px', fontWeight: 700, color: D.muted,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      whiteSpace: 'nowrap',
                      background: '#0c1228',
                      borderBottom: `1px solid ${D.border}`,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {demo.tabla.filas.map((fila, ri) => (
                  <tr key={ri} style={{
                    borderBottom: `1px solid ${D.border}22`,
                    background: ri % 2 === 0 ? 'transparent' : D.card2,
                  }}>
                    {fila.map((celda, ci) => (
                      <td key={ci} style={{
                        padding: '10px 16px', color: D.text, whiteSpace: 'nowrap',
                      }}>
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
