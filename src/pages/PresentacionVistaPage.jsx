import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { modulos } from '../data/modulos';
import { GROUPS } from '../data/constants';
import { getPresentacion } from '../utils/presentaciones';
import BloqueContenido from '../components/canvas/BloqueContenido';

const moduloMap = Object.fromEntries(modulos.map(m => [String(m.id), m]));
const grupoMap  = Object.fromEntries(GROUPS.map(g => [g.id, g]));

// Paleta oscura por grupo (misma de ModuloDemoPage)
const GROUP_DARK = {
  A: { bg: '#060f0a', card: '#0b1a13', border: '#163324' },
  B: { bg: '#120800', card: '#1c1103', border: '#301d07' },
  C: { bg: '#080519', card: '#100a27', border: '#1f1245' },
  D: { bg: '#02101c', card: '#051828', border: '#0c3048' },
  E: { bg: '#140404', card: '#1e0606', border: '#360c0c' },
  F: { bg: '#030d14', card: '#06151f', border: '#0e2c3f' },
  G: { bg: '#031008', card: '#071a10', border: '#103020' },
  H: { bg: '#080418', card: '#0e0824', border: '#1c1042' },
  I: { bg: '#07090e', card: '#0d1018', border: '#1c2335' },
};

const BASE = { bg: '#0A0E2A', card: '#111836', border: '#1E2A5A', text: '#E2E8F0', muted: '#8892B0' };

const CANVAS_W = 1400;
const CANVAS_H = 900;

export default function PresentacionVistaPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const modulo = moduloMap[id];
  const grupo  = grupoMap[modulo?.grupo];
  const color  = grupo?.color || BASE.accent;
  const gd     = GROUP_DARK[modulo?.grupo] || {};
  const T      = { ...BASE, ...gd };

  const [bloques,  setBloques]  = useState([]);
  const [titulo,   setTitulo]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [vacio,    setVacio]    = useState(false);

  useEffect(() => {
    if (!modulo) return;
    getPresentacion(Number(id)).then(res => {
      if (res.ok && res.data) {
        setBloques(res.data.bloques || []);
        setTitulo(res.data.titulo  || modulo.nombre);
        setVacio((res.data.bloques || []).length === 0);
      } else {
        setVacio(true);
      }
      setLoading(false);
    });
  }, [id, modulo]);

  if (!modulo) {
    return (
      <div style={{ margin: '-24px', minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted }}>
        Módulo no encontrado.
      </div>
    );
  }

  return (
    <div style={{ margin: '-24px', minHeight: '100vh', background: T.bg, color: T.text }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: T.bg + 'f0', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button
          onClick={() => navigate(`/modulos/${id}/demo`)}
          onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = color; }}
          onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: T.muted, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', transition: 'color .15s, border-color .15s', flexShrink: 0 }}
        >
          ← Volver
        </button>

        <span style={{ width: '28px', height: '28px', background: color, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#fff', flexShrink: 0 }}>
          {modulo.id}
        </span>

        <span style={{ fontSize: '14px', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {titulo || modulo.nombre}
        </span>

        <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: color, background: color + '18', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${color}30`, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
          Presentación
        </span>

        {/* Solo admin puede editar */}
        {user?.rol === 'admin' && (
          <button
            onClick={() => navigate(`/modulos/${id}/presentacion/editar`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: color, background: color + '15', border: `1px solid ${color}30`, borderRadius: '7px', padding: '6px 12px', cursor: 'pointer', flexShrink: 0 }}
          >
            ✏️ Editar
          </button>
        )}
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: T.muted, paddingTop: '60px' }}>
            Cargando presentación…
          </div>
        )}

        {!loading && vacio && (
          <div style={{ textAlign: 'center', color: T.muted, paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '48px', opacity: 0.2 }}>⊞</span>
            <p style={{ margin: 0, fontSize: '15px' }}>Este módulo no tiene presentación todavía.</p>
            {user?.rol === 'admin' && (
              <button
                onClick={() => navigate(`/modulos/${id}/presentacion/editar`)}
                style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: color, background: color + '15', border: `1px solid ${color}30`, borderRadius: '8px', padding: '8px 18px', cursor: 'pointer' }}
              >
                ✏️ Crear presentación
              </button>
            )}
          </div>
        )}

        {!loading && !vacio && (
          <div style={{
            position: 'relative',
            width: CANVAS_W, height: CANVAS_H,
            background: T.bg,
            backgroundImage: `radial-gradient(circle, ${T.border}55 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            borderRadius: '12px',
            border: `1px solid ${T.border}`,
            margin: '0 auto',
          }}>
            {bloques.map(block => (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  left: block.x, top: block.y,
                  width: block.w, height: block.h,
                }}
              >
                <BloqueContenido block={block} modoVista={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
