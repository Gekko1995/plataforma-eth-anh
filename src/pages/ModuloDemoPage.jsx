import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
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
import { addLog } from '../utils/auth';

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

// ─── Acciones por módulo ──────────────────────────────────────────────
// Cada entrada: [acción primaria, acción secundaria, acción terciaria]
const MODULE_ACTIONS = {
  1:  ['Nueva caracterización', 'Ver mapa territorial',    'Exportar'],
  2:  ['Nuevo indicador',       'Generar reporte',         'Exportar'],
  3:  ['Abrir visor GIS',       'Nueva capa',              'Exportar'],
  4:  ['Nuevo clúster',         'Ver ranking',             'Exportar'],
  5:  ['Nueva ficha de campo',  'Sincronizar datos',       'Exportar'],
  6:  ['Nuevo estudio',         'Repositorio',             'Exportar'],
  7:  ['Nueva iniciativa',      'Ver avance',              'Exportar'],
  8:  ['Nueva alerta',          'Nueva mesa de diálogo',   'Exportar'],
  9:  ['Nuevo proyecto MGA',    'Árbol de problemas',      'Exportar'],
  10: ['Nueva ruta',            'Certificados',            'Exportar'],
  11: ['Nueva formación',       'Ver participantes',       'Exportar'],
  12: ['Nueva inducción',       'Cumplimiento HSE',        'Exportar'],
  13: ['Nuevo plan de negocio', 'Ferias internacionales',  'Exportar'],
  14: ['Nuevo beneficiario',    'Generar QR',              'Exportar'],
  15: ['Nuevo actor',           'Buscar en directorio',    'Exportar'],
  16: ['Nueva consulta previa', 'Ver protocolos',          'Exportar'],
  17: ['Nueva vacante',         'Recibir CVs',             'Exportar'],
  18: ['Nueva novedad',         'Liquidar nómina',         'Exportar'],
  19: ['Nueva alianza',         'Ver compromisos',         'Exportar'],
  20: ['Nuevo usuario',         'Ver auditoría',           'Exportar logs'],
  21: ['Nuevo hito',            'Ver semáforo',            'Exportar'],
  22: ['Nuevo movimiento',      'Ver ejecución',           'Exportar'],
  23: ['Nueva cuenta de cobro', 'Verificar SS',            'Exportar'],
  24: ['Nueva sesión',          'Nueva acta',              'Exportar'],
  25: ['Nuevo contrato',        'Ver TdR',                 'Exportar'],
  26: ['Nuevo riesgo',          'Mapa de calor',           'Exportar'],
  27: ['Radicar informe',       'Pendientes de aprobación','Exportar'],
  28: ['Compilar desembolso',   'Estado desembolsos',      'Exportar'],
  29: ['Nuevo caso de éxito',   'Repositorio',             'Exportar'],
  30: ['Nuevo evento',          'Convocar asistentes',     'Exportar'],
  31: ['Nueva solicitud',       'Calcular costo',          'Exportar'],
  32: ['Nueva pieza digital',   'Ver métricas',            'Exportar'],
  33: ['Reportar incidente',    'Protocolos HSE',          'Exportar'],
  34: ['Subir documento',       'Analizar con IA',         'Exportar'],
  35: ['Nuevo activo',          'Escanear QR',             'Exportar'],
  36: ['Nueva póliza',          'Ver renovaciones',        'Exportar'],
  37: ['Actualizar checklist',  'Generar acta',            'Exportar'],
  38: ['Nuevo ticket',          'Ver SLA',                 'Exportar'],
  39: ['Ver backups',           'Monitor disponibilidad',  'Exportar'],
};

// ─── Descripciones extendidas por módulo ─────────────────────────────
const MODULE_DESC = {
  1: [
    'Plataforma centralizada para la caracterización socioeconómica y ambiental de los territorios de intervención. Integra datos de encuestas de campo, fuentes oficiales del DANE e IGAC, y capas satelitales para construir un perfil territorial completo por municipio y región.',
    'Facilita el mapeo estratégico de actores: comunidades, operadoras, autoridades étnicas y gremios. Identifica variables de conflictividad, superposición de intereses y zonas de alta sensibilidad social, generando insumos para la toma de decisiones de intervención.',
    'Los resultados se visualizan en dashboards interactivos y se exportan como reportes de diagnóstico para el supervisor técnico y la ANH.',
  ],
  2: [
    'Herramienta analítica para medir el avance y cierre de brechas en los KPIs estratégicos alineados a la cadena de valor del DNP. Opera bajo metodología MGA y genera semáforos de cumplimiento por componente, región y período de desembolso.',
    'Permite comparar línea base vs. situación actual, detectar rezagos en indicadores críticos y generar alertas tempranas antes de que se comprometa la meta del desembolso. Trazabilidad completa desde el indicador hasta el registro de campo que lo soporta.',
    'Produce los reportes de impacto requeridos por ANH y los órganos de control, con firmas digitales y control de versiones.',
  ],
  3: [
    'Sistema de visualización geoespacial interactivo que superpone capas operativas sobre cartografía oficial del IGAC, DANE y Corporaciones Autónomas Regionales. Genera mapas de calor de concentración de inversión, zonas de riesgo social y cobertura de beneficiarios por municipio.',
    'Permite filtrar por grupo temático, rango de fechas y tipo de intervención. Cruza información de campo con datos de infraestructura vial, fuentes hídricas y límites de resguardos indígenas para apoyar la planificación estratégica y el despliegue territorial del equipo.',
    'Los mapas se exportan en formatos estándar (GeoJSON, KML, PDF) para presentaciones ante autoridades locales y nacionales.',
  ],
  4: [
    'Inteligencia de mercados para evaluar el potencial exportador de los clústeres productivos regionales. Analiza costos operativos, matrices de competitividad y tendencias de demanda internacional para productos clave de la región hidrocarburífera.',
    'Genera rankings de exportación por clúster, identifica aliados estratégicos en cadenas globales de valor y orienta la estructuración de planes de comercialización. Cruza datos de operadoras locales con inteligencia de mercados internacionales para detectar oportunidades de diversificación económica.',
    'Sirve de insumo directo para la Aceleradora Exportadora y los planes de negocio de los beneficiarios del programa.',
  ],
  5: [
    'Solución digital para la captura de datos en territorio mediante formularios PWA que funcionan sin conexión y se sincronizan automáticamente al recuperar señal. Gestiona fichas de producto, validaciones fitosanitarias y registros de beneficiarios directamente desde dispositivos móviles en campo.',
    'Consolida encuestas de múltiples coordinadores regionales en una sola base de datos centralizada con validación automática, detección de duplicados y alertas de inconsistencias. Reduce los tiempos de digitación manual en oficina y elimina errores de transcripción.',
    'Los datos capturados alimentan en tiempo real los módulos de Línea Diagnóstica, Padrón de Beneficiarios y Evaluación de Impacto.',
  ],
  6: [
    'Repositorio digital para la gestión de planes de trabajo con Corporaciones Autónomas Regionales (CARs) y estudios técnicos de Exploración y Producción (E&P). Centraliza protocolos ambientales, Planes de Manejo Ambiental (PMA) y documentos de línea base exigidos por la normativa vigente.',
    'Incluye control de versiones, alertas de vencimiento de compromisos y flujo estructurado de aprobación para cada documento técnico por región y operadora. Garantiza que ningún plazo ambiental quede sin atención y que toda la documentación esté disponible para auditorías externas.',
    'Cumple con los estándares de archivo requeridos por la ANLA, el MADS y las CARs de las 8 regiones del convenio.',
  ],
  7: [
    'Herramienta para estructurar y hacer seguimiento a iniciativas de inversión social orientadas a la diversificación económica en comunidades productoras de hidrocarburos. Registra evidencias de ejecución en tiempo real: beneficiarios, desembolsos, productos entregados y registros audiovisuales.',
    'Genera reportes con métricas de impacto territorial para respaldar la gestión de relaciones comunitarias, la rendición de cuentas ante la ANH y el cumplimiento de los compromisos de Responsabilidad Social Empresarial de las operadoras vinculadas.',
    'Integra con Gestión Financiera para cruzar ejecución física con ejecución presupuestal por iniciativa y por región.',
  ],
  8: [
    'Sistema de alertas tempranas y monitoreo de acuerdos derivados de mesas de diálogo con comunidades, grupos étnicos y autoridades locales. Registra cada sesión: agenda, participantes, compromisos adquiridos, responsables y fechas de cumplimiento.',
    'Genera alertas automáticas cuando un acuerdo está próximo a vencer sin evidencia de cumplimiento, y produce el historial completo de cada proceso de diálogo como respaldo ante el Ministerio del Interior o procesos judiciales. Diferencia por tipo de actor: comunidades campesinas, étnicas, municipios y operadoras.',
    'Reduce el riesgo de escalamiento de conflictos al garantizar trazabilidad y seguimiento sistemático de cada compromiso social adquirido.',
  ],
  9: [
    'Entorno estructurado para el diseño de proyectos bajo metodología MGA-DNP, con árboles de problemas, árboles de objetivos y matrices de marco lógico. Guía al equipo en cada fase: análisis de situación, definición de resultados, actividades, indicadores, riesgos y supuestos.',
    'Genera automáticamente la ficha MGA compatible con el banco de programas del DNP y produce el presupuesto por actividad en formato requerido para aprobación del Comité Directivo. Integra con el módulo de Monitoreo del Plan Operativo para hacer seguimiento a los proyectos formulados.',
    'Incluye biblioteca de marcos lógicos validados en proyectos anteriores de la Fundación para acelerar la formulación de nuevas iniciativas.',
  ],
  10: [
    'Plataforma de aprendizaje modular con rutas de formación en emprendimiento, procesos de exportación, gestión financiera básica y asociatividad para beneficiarios directos del programa. Incluye cursos grabados, evaluaciones, biblioteca de recursos y certificación automática al superar el umbral de aprobación.',
    'Rastrea el progreso de cada usuario, genera reportes de graduación por cohorte y región, y permite personalizar el contenido por sector productivo. Los certificados digitales incluyen código QR de verificación y son reconocidos por aliados del ecosistema de emprendimiento.',
    'Alimenta los indicadores del componente de formación requeridos en los informes de desembolso ante la ANH.',
  ],
  11: [
    'Plataforma de e-learning con enfoque diferencial para comunidades étnicas, centrada en derechos colectivos, transición energética justa, manejo ambiental comunitario y participación ciudadana. Los contenidos se adaptan a contextos culturales y lingüísticos con materiales audiovisuales accesibles.',
    'Registra la participación comunitaria por resguardo y cabildo, generando los indicadores del componente étnico exigidos por el convenio. Permite descargar los módulos para uso offline en comunidades sin acceso permanente a internet.',
    'Cumple con los lineamientos del enfoque diferencial establecidos por el MINSALUD, el Ministerio del Interior y los estándares del Convenio 169 de la OIT.',
  ],
  12: [
    'Plataforma de inducción obligatoria y formación continua para todo el personal vinculado al convenio. Gestiona protocolos HSE, seguridad en campo, políticas de cumplimiento y procedimientos específicos por rol.',
    'Bloquea el acceso a módulos sensibles de la plataforma hasta que el colaborador complete los cursos obligatorios de su perfil. Genera reportes de cumplimiento para el supervisor técnico de la ANH y los auditores de calidad, con evidencia de cada evaluación aprobada.',
    'Reduce la curva de aprendizaje del nuevo personal y garantiza que todos los integrantes del equipo operen bajo los mismos estándares de seguridad y calidad desde el primer día.',
  ],
  13: [
    'Gestión integral de planes de negocio, participación en ferias internacionales, trámites de exportación y comercialización de productos regionales. Acompaña a cada exportador a través del pipeline de aceleración: diagnóstico, formulación del plan, rueda de negocios, gestión aduanera y primera exportación.',
    'Integra contactos de misiones de compradores, rondas de negocios y cámaras de comercio aliadas. Registra evidencia de cada hito del proceso exportador con documentos soporte que respaldan el cumplimiento de las metas de diversificación económica ante la ANH.',
    'Genera métricas de impacto: número de empresas exportadoras, valor FOB exportado, nuevos mercados abiertos y empleos generados por la actividad exportadora.',
  ],
  14: [
    'Registro centralizado de beneficiarios directos con consentimientos informados digitales, perfilamiento socioeconómico y clasificación por tarjeta de puntaje de vulnerabilidad. Genera carnets de identidad digital con código QR para control de asistencia en eventos y actividades del programa.',
    'Gestiona deduplicación, actualizaciones, retiros y reemplazos con trazabilidad completa y cumplimiento de la Ley 1581 de Habeas Data. Permite segmentar la base por género, etnia, municipio, nivel de vulnerabilidad y sector productivo para focalizar intervenciones.',
    'Es el registro maestro del que se alimentan el CRM de Actores, Campus Virtual y los módulos de seguimiento de impacto.',
  ],
  15: [
    'Directorio integral de operadoras, comunidades étnicas y campesinas, autoridades locales y nacionales, gremios y entidades aliadas. Registra perfiles institucionales, áreas de influencia, tipo de relación con el convenio e historial de interacciones.',
    'Permite segmentación inteligente para convocatorias, gestión de eventos y generación de mapas de actores por región, componente y tipo de actor. Incluye alertas de renovación de acuerdos de cooperación y recordatorios de fechas clave con cada aliado estratégico.',
    'Es la base de datos relacional que alimenta todos los módulos que requieren identificar o contactar actores del territorio: Consulta Previa, Agenda Territorial, Inversión Social y Gestión de Alianzas.',
  ],
  16: [
    'Sistema de seguimiento a procesos de consulta previa con comunidades indígenas y afrocolombianas, en cumplimiento del Convenio 169 de la OIT y la jurisprudencia de la Corte Constitucional. Documenta cada etapa procedimental: apertura, socialización, deliberación, acuerdos y seguimiento post-acuerdo.',
    'Registra protocolos notariales, listas de asistencia, actas firmadas y compromisos adquiridos por la operadora o entidad consultante. Genera alertas automáticas para plazos reglamentarios y produce el expediente completo requerido por el Ministerio del Interior.',
    'Reduce el riesgo legal de nulidades procesales al garantizar el cumplimiento de cada paso del procedimiento con evidencia documental trazable y auditada.',
  ],
  17: [
    'Plataforma de reclutamiento para los cargos asociados al convenio. Gestiona publicación de vacantes, recepción de hojas de vida, puntuación automática de perfiles con base en matrices de calificación definidas por el área de talento humano, y programación de entrevistas.',
    'Genera ranking comparativo de candidatos por cargo, registra las decisiones del panel evaluador y alimenta automáticamente el módulo de Administración de Personal cuando se confirma la vinculación. Almacena el historial de procesos como respaldo ante posibles impugnaciones.',
    'Garantiza transparencia y trazabilidad en los procesos de selección, cumpliendo con los requisitos de equidad, enfoque diferencial y priorización de talento local exigidos por el convenio.',
  ],
  18: [
    'Gestión integral del personal vinculado: contratos, afiliaciones a seguridad social, salarios, prestaciones y novedades de nómina. Emite alertas de vencimiento de contratos y pólizas, valida mes a mes las cotizaciones de seguridad social para el flujo de cuentas de cobro, y genera la liquidación de nómina por período de desembolso.',
    'Mantiene hoja de vida laboral completa por colaborador, con todos los documentos soporte del proceso de vinculación. Permite generar certificados laborales, colillas de pago y constancias de afiliación de forma automatizada.',
    'Integra con el módulo de Cuentas de Cobro para la validación de aportes y con Adquisiciones ESAL para el control de honorarios de contratistas.',
  ],
  19: [
    'Dashboard de seguimiento a los compromisos adquiridos con las CARs en las 8 regiones de intervención, entidades nacionales y socios estratégicos del convenio. Monitorea cada producto comprometido vs. ejecutado, el presupuesto asociado y las fechas de cumplimiento contractual.',
    'Genera reportes automatizados para las sesiones del Comité Directivo y activa alertas cuando un compromiso está en riesgo de incumplimiento. Registra evidencias de ejecución por alianza: actas, informes técnicos, registros fotográficos y productos entregables.',
    'Facilita la negociación de adendas y la gestión proactiva de las relaciones institucionales al mantener visibilidad en tiempo real del estado de cada acuerdo interinstitucional.',
  ],
  20: [
    'Administración de usuarios con roles granulares, permisos por módulo, autenticación multifactor (MFA) y auditoría completa de todos los eventos del sistema. Implementa los protocolos de Habeas Data para tratamiento de datos personales y genera los registros de acceso requeridos por la normativa de ciberseguridad colombiana.',
    'Gestiona incidentes de seguridad, recuperación de cuentas y políticas de bloqueo automático por intentos fallidos. Permite configurar perfiles de acceso diferenciados por rol: coordinador regional, profesional temático, supervisor técnico y administrador del sistema.',
    'Genera reportes de auditoría listos para presentar ante la ANH, la Contraloría o cualquier ente de control que requiera evidencia del control de accesos y la integridad de los datos del convenio.',
  ],
  21: [
    'Monitoreo en tiempo real del plan operativo del convenio: actividades, hitos, porcentaje de avance físico y semáforos de cumplimiento alineados a los cuatro desembolsos ANH (20/35/70/100%). Muestra el estado por componente, por región y por período, cruzando avance físico con ejecución financiera.',
    'Activa alertas cuando una actividad está rezagada respecto a la meta del próximo desembolso, sugiriendo acciones de recuperación. Genera el cuadro de seguimiento al plan operativo en el formato exigido por la supervisión técnica de la ANH para cada informe de desembolso.',
    'Es la vista ejecutiva principal del Comité Directivo para tomar decisiones de reasignación de recursos, ajuste de metas y gestión de riesgos de ejecución.',
  ],
  22: [
    'Control total de la ejecución presupuestal en los 3 ítems de inversión más la contrapartida del convenio. Gestiona el flujo de desembolsos (20/30/40/10%), registra cada gasto con soporte documental, valida elegibilidad por ítem y genera los estados financieros para la ANH y los órganos de control.',
    'Incluye herramientas de proyección presupuestal, alertas de sub-ejecución o sobre-ejecución por ítem, y conciliación automatizada de movimientos bancarios. Permite generar el informe financiero del desembolso con solo seleccionar el período y el componente.',
    'Cumple con los estándares contables de las ESAL en Colombia y con los requisitos de transparencia financiera del Manual Operativo de la ANH.',
  ],
  23: [
    'Flujo de radicación y procesamiento mensual de cuentas de cobro con garantía de trámite en 5 días hábiles. Recibe documentos, valida automáticamente los aportes a seguridad social del prestador de servicios, enruta para revisión del supervisor financiero y genera la orden de pago.',
    'Mantiene trazabilidad completa de cada cuenta desde la radicación hasta el pago efectivo, con registro de observaciones, rechazos y correcciones. Genera automáticamente los soportes de pago que deben adjuntarse al informe de desembolso.',
    'Reduce los tiempos de gestión de pagos, elimina errores de validación de seguridad social y garantiza que el flujo de caja del convenio opere sin interrupciones.',
  ],
  24: [
    'Gestión integral de las sesiones mensuales del Comité Directivo: convocatoria, agenda, quórum, actas, compromisos adquiridos y seguimiento de cumplimiento. Administra también la aprobación de subcontratos y reportes especiales que requieren aval del Comité.',
    'Archiva todos los documentos con firma digital de los miembros, gestiona los quórums decisorios y genera recordatorios automáticos a los integrantes. Proporciona el libro de actas digital del Comité como respaldo ante auditorías de la ANH o la Contraloría.',
    'Agiliza la toma de decisiones del órgano máximo del convenio al mantener toda la información previa, los documentos soporte y el historial de decisiones en un solo lugar accesible para todos los miembros.',
  ],
  25: [
    'Gestión de las adquisiciones del convenio bajo el régimen de las ESAL colombianas: elaboración de términos de referencia, proceso de selección de contratistas, evaluación, contratación y seguimiento a la ejecución. Administra la biblioteca de minutas estándar para los tipos de contrato más frecuentes.',
    'El flujo de aprobación para contratos que superen los umbrales definidos se enruta automáticamente al Comité Directivo. Valida RUT, certificados de experiencia y estados de proveedor ante la DIAN antes de generar el contrato. Mantiene el registro de contratos activos, sus montos, plazos y productos entregables.',
    'Genera el informe de adquisiciones requerido por la ANH para cada desembolso y facilita las auditorías al mantener toda la cadena documental de cada contratación.',
  ],
  26: [
    'Matriz de riesgos bajo la metodología CONPES 3714 para la gestión de riesgos operacionales, regulatorios, comunitarios, ambientales y de fuerza mayor del convenio. Evalúa probabilidad e impacto, genera mapas de calor por categoría de riesgo y asigna propietarios y planes de mitigación a cada riesgo identificado.',
    'Monitorea la efectividad de los controles implementados y actualiza el riesgo residual con base en los avances reportados por los responsables. Genera alertas cuando un riesgo sube de categoría y activa el protocolo de escalamiento al Comité Directivo.',
    'Produce el informe de gestión de riesgos requerido por la ANH en cada desembolso y facilita la actualización periódica de la matriz conforme evoluciona el contexto territorial y operativo del convenio.',
  ],
  27: [
    'Flujo digital de radicación, revisión técnica y aprobación de los informes elaborados por los profesionales del convenio. Gestiona versiones de documentos, plazos de revisión y notificaciones en cada etapa del proceso editorial.',
    'El supervisor técnico puede aprobar, devolver con observaciones o rechazar cada informe directamente en la plataforma, dejando trazabilidad de cada decisión. Genera métricas de tiempo promedio de aprobación por profesional y por componente, facilitando la detección de cuellos de botella.',
    'Reduce los tiempos de entrega de informes finales a la ANH al eliminar el intercambio de correos y versiones sueltas, manteniendo toda la cadena documental en un repositorio centralizado con control de acceso.',
  ],
  28: [
    'Compilador automático de los 4 informes de desembolso ante la ANH: D1 plan de trabajo, D2 al 35%, D3 al 70% y D4 informe final. Agrega la información física, financiera y narrativa de todos los módulos para generar la estructura documental requerida por el Manual Operativo de la ANH.',
    'Valida la completitud de cada sección antes de permitir la generación del informe, alertando sobre componentes o regiones con información pendiente. Genera automáticamente la tabla de contenido, los anexos y los formatos estandarizados de la ANH.',
    'Elimina el proceso manual de consolidación que históricamente toma semanas, reduciendo el tiempo de preparación de cada informe de desembolso a horas y minimizando el riesgo de errores de compilación.',
  ],
  29: [
    'Repositorio institucional de metodologías validadas, casos de éxito documentados, buenas prácticas y lecciones aprendidas de todas las regiones del convenio. Permite búsqueda por tema, región, componente y tipo de intervención para facilitar la réplica de soluciones efectivas.',
    'Incluye un banco de herramientas con plantillas editables, guías técnicas y marcos metodológicos probados en campo. Cada caso de éxito registra el contexto, la intervención, los resultados y las condiciones de replicabilidad para que otros equipos puedan adoptarlo con las adaptaciones necesarias.',
    'Construye la memoria institucional del convenio, garantizando que el conocimiento generado no se pierda con la rotación de personal y quede disponible para futuros proyectos de la Fundación y de la ANH.',
  ],
  30: [
    'Gestión integral de todos los eventos territoriales del convenio: talleres, foros, ferias productivas, entregas de bienes y visitas de campo. Administra convocatorias, registro de asistentes, registro de asistencia con QR, actas de reunión y registros fotográficos geolocalizados.',
    'Genera el informe de cada evento con indicadores de cobertura: número de participantes desagregado por género, etnia y municipio. Integra con el módulo de Gestión Logística para el presupuesto asociado a cada actividad y con el Padrón de Beneficiarios para el registro de asistencia.',
    'Produce las listas de asistencia firmadas, las actas de compromiso y los reportes de eventos requeridos como soportes en los informes de desembolso ante la ANH.',
  ],
  31: [
    'Control de costos y gestión logística por evento y por región: transporte, alojamiento, refrigerios, equipos audiovisuales e insumos. Calcula el costo total de cada actividad con base en tarifas precargadas por región y genera los soportes de gasto por rubro presupuestal.',
    'Realiza seguimiento al pago de proveedores logísticos y genera la comparación presupuesto vs. real por componente operativo. Permite aprobar solicitudes logísticas con el flujo de autorización definido antes de comprometer recursos del convenio.',
    'Integra con Gestión Financiera para actualizar la ejecución presupuestal del ítem logístico en tiempo real, y con Agenda Territorial para tener el costo unitario de cada evento del programa.',
  ],
  32: [
    'Gestión de piezas de comunicación por iniciativa: contenidos para redes sociales, comunicados de prensa, pendones de eventos y material audiovisual. Administra la campaña de comunicaciones del convenio en sus tres etapas: expectativa, cubrimiento de hitos y presencia digital continua.',
    'Rastrea métricas de impacto mediático: alcance, impresiones, clips de prensa y menciones en medios. Mantiene la biblioteca de activos digitales por región y actividad, con trazabilidad de derechos de imagen y autorización de uso de datos personales para cada pieza que incluya beneficiarios.',
    'Cumple con los lineamientos de visibilidad de la ANH y genera el informe de comunicaciones requerido en cada desembolso con evidencias de la estrategia ejecutada.',
  ],
  33: [
    'Gestión de protocolos de seguridad en campo, reporte de incidentes (casi accidentes, accidentes, emergencias ambientales) y administración del Plan de Emergencias SG-SST del convenio. Genera notificaciones automáticas al coordinador de área y al supervisor técnico cuando se registra un incidente.',
    'Hace seguimiento a las acciones correctivas y preventivas derivadas de cada incidente, con plazos de cierre y evidencias de implementación. Genera las estadísticas OSHA obligatorias y el registro de inspecciones de seguridad, simulacros y capacitaciones HSE por región.',
    'Reduce la ocurrencia de accidentes al garantizar que cada evento de seguridad sea documentado, investigado y resuelto sistemáticamente, cumpliendo con la Resolución 0312 de 2019 del Ministerio de Trabajo.',
  ],
  34: [
    'Repositorio cloud con estructura jerárquica región > municipio > componente, búsqueda semántica con inteligencia artificial y clasificación automática de documentos al momento de la carga. Detecta duplicados, versiones desactualizadas y documentos próximos a vencer antes de que generen incumplimientos.',
    'Permite consultas en lenguaje natural: "mostrar todos los permisos ambientales del Casanare que vencen en 2026". La IA extrae información clave de documentos extensos y genera resúmenes ejecutivos para agilizar la revisión. Incluye control de acceso granular por perfil y registro de préstamo digital.',
    'Cumple con la Ley 594 de 2000 (Ley General de Archivos) y los protocolos de gestión documental de la Función Pública colombiana.',
  ],
  35: [
    'Gestión de los bienes adquiridos con recursos ANH: equipos, insumos, semillas, materiales de construcción y maquinaria entregada a comunidades. Utiliza escaneo QR y código de barras para el registro de entradas y salidas, y genera actas de entrega por beneficiario y comunidad con firma digital.',
    'Mantiene trazabilidad completa de cada bien desde la compra hasta la entrega final, con fotografías, coordenadas GPS y datos del receptor. Genera el inventario periódico requerido por el contrato de supervisión de la ANH y facilita las visitas de verificación física de los activos.',
    'Alertas automáticas para revisiones técnicas preventivas de maquinaria, renovación de garantías y seguimiento al estado de conservación de los bienes entregados a comunidades.',
  ],
  36: [
    'Monitoreo de las pólizas obligatorias del convenio: cumplimiento (20%), calidad (10%) y salarios (5%). Genera alertas automáticas 60, 30 y 15 días antes del vencimiento de cada póliza, enruta el flujo de renovación al área jurídica y mantiene el historial de versiones de cada póliza con sus respectivos certificados.',
    'Valida la suficiencia de los amparos frente a los montos del convenio y registra cualquier siniestro o reclamación. Produce el reporte de estado de pólizas requerido como soporte en cada informe de desembolso ante la ANH.',
    'Elimina el riesgo de que el convenio quede sin cobertura asegurada, situación que puede generar incumplimiento contractual y bloqueo de desembolsos por parte de la ANH.',
  ],
  37: [
    'Checklist transversal para la liquidación ordenada del convenio: verificación de entregables por componente, balance financiero final, registro de pasivos pendientes, certificados de paz y salvo de aliados y proveedores, y generación del acta de liquidación oficial.',
    'Guía al equipo de coordinación a través de cada paso del proceso en orden secuencial, bloqueando el avance hasta que cada requisito sea validado con su respectivo soporte documental. Genera el acta de liquidación final en el formato requerido por la ANH lista para firma digital de ambas partes.',
    'Garantiza que el cierre del convenio se realice sin pasivos ocultos, cumpliendo todos los requisitos jurídicos, contables y técnicos para que la Fundación quede en paz y salvo ante la ANH y los órganos de control.',
  ],
  38: [
    'Sistema multicanal de soporte técnico (web, chat, correo) con gestión de tickets, monitoreo de SLA y base de conocimiento por rol de usuario. Clasifica los tickets por severidad, los asigna a agentes de soporte y activa alertas cuando el SLA está en riesgo de incumplirse.',
    'Ofrece guías de autoservicio por módulo con capturas de pantalla y videos paso a paso, reduciendo las consultas recurrentes al equipo técnico. Los coordinadores regionales y profesionales pueden resolver el 70% de sus dudas sin abrir un ticket, a través de la base de conocimiento y el chatbot de primer nivel.',
    'Garantiza que todas las personas usuarias del sistema puedan aprovecharlo al máximo, independientemente de su nivel de alfabetización digital, con soporte disponible 24/7 para las regiones con diferencia horaria significativa.',
  ],
  39: [
    'Gestión de la infraestructura cloud de Google Workspace, backups automatizados diarios con verificación de integridad y monitoreo de disponibilidad con SLA del 99.5%. Administra certificados SSL, configuraciones de dominio y el plan de recuperación ante desastres tecnológicos.',
    'Genera reportes mensuales de infraestructura con métricas de disponibilidad, tiempo de restauración de backups e incidentes técnicos resueltos. El panel de monitoreo en tiempo real detecta degradaciones de rendimiento y activa alertas antes de que el problema afecte a los usuarios.',
    'Garantiza la continuidad operativa del convenio incluso ante fallas de conectividad regional, con sincronización offline para los módulos críticos y recuperación total de datos en menos de 4 horas ante cualquier incidente mayor.',
  ],
};

// ─── Lookups ──────────────────────────────────────────────────────────
const moduloMap = Object.fromEntries(modulos.map(m => [String(m.id), m]));
const grupoMap  = Object.fromEntries(GROUPS.map(g => [g.id, g]));

// ─── Page ─────────────────────────────────────────────────────────────
export default function ModuloDemoPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const modulo = moduloMap[id];
  const demo   = demos[Number(id)];
  const grupo  = grupoMap[modulo?.grupo];
  const color  = grupo?.color || '#4f8ef7';

  const theme = useMemo(() => ({
    ...BASE,
    ...(GROUP_LIGHT[modulo?.grupo] || {}),
  }), [modulo?.grupo]);

  const numId = Number(id);

  // Registra visita y duración al salir de la demo
  const openedAt = useRef(Date.now());
  useEffect(() => {
    return () => {
      if (user && modulo) {
        const segundos = Math.round((Date.now() - openedAt.current) / 1000);
        addLog(user, 'MODULO_DEMO', `${modulo.nombre} · ${segundos}s`);
      }
    };
  }, []); // eslint-disable-line

  const [toast, setToast] = useState(null);
  function showToast(label) {
    setToast(label);
    setTimeout(() => setToast(null), 2200);
  }

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

  return (
    <div style={{ background: theme.bg, minHeight: '100%' }}>

      {/* ── Barra superior: solo volver ── */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/modulos')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Volver a módulos
        </button>
      </div>

      {/* ── Toast demo ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
          background: BASE.text, color: '#fff',
          borderRadius: '10px', padding: '12px 20px',
          fontSize: '13px', fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          animation: 'fadeInUp .2s ease',
        }}>
          <span style={{ opacity: 0.55, marginRight: '6px' }}>Demo —</span>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '1100px' }}>

        {/* ── Header de módulo (gradiente) ── */}
        <div style={{
          borderRadius: '14px', overflow: 'hidden',
          marginBottom: '22px', position: 'relative',
          height: '140px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
          boxShadow: `0 4px 24px ${color}30`,
        }}>
          {/* Trama de puntos decorativa */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }} />
          {/* Brillo esquina superior derecha */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '220px', height: '220px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />

          {/* Contenido */}
          <div style={{ position: 'absolute', inset: 0, padding: '22px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
                color: '#fff', width: '34px', height: '34px', borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)',
                flexShrink: 0,
              }}>
                {modulo.id}
              </span>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.80)',
                background: 'rgba(255,255,255,0.15)', padding: '3px 10px',
                borderRadius: '20px', backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.20)',
              }}>
                Grupo {modulo.grupo} · {grupo?.name}
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
              {modulo.nombre}
            </h1>
          </div>
        </div>

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

        {/* Descripción del módulo */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 14px' }}>
            Acerca de este módulo
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: modulo.stack?.length > 0 ? '16px' : 0 }}>
            {(MODULE_DESC[numId] || [modulo.descripcion]).map((parrafo, i) => (
              <p key={i} style={{ fontSize: '13px', lineHeight: '1.7', color: BASE.text, margin: 0 }}>
                {parrafo}
              </p>
            ))}
          </div>
          {modulo.stack?.length > 0 && (
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: BASE.muted, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
                Tecnologías
              </span>
              {modulo.stack.map(s => (
                <span key={s} style={{ fontSize: '11px', fontWeight: 500, color: color, background: color + '12', border: `1px solid ${color}25`, borderRadius: '20px', padding: '3px 10px' }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Toolbox de acciones ── */}
        {MODULE_ACTIONS[numId] && (
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: BASE.muted, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 12px' }}>
              Acciones disponibles
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {MODULE_ACTIONS[numId].map((label, i) => (
                <button
                  key={label}
                  onClick={() => showToast(label)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: `1px solid ${i === 0 ? color : color + '35'}`,
                    background: i === 0 ? color : i === 1 ? color + '0e' : 'transparent',
                    color: i === 0 ? '#fff' : color,
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1.3,
                    transition: 'opacity .15s, transform .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

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
