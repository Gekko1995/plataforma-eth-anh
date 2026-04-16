import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { addLog } from '../utils/auth';
import { modulos } from '../data/modulos';
import { GROUPS } from '../data/constants';
import { getPresentacion, savePresentacion } from '../utils/presentaciones';
import CanvasEditor from '../components/canvas/CanvasEditor';

const moduloMap = Object.fromEntries(modulos.map(m => [String(m.id), m]));
const grupoMap  = Object.fromEntries(GROUPS.map(g => [g.id, g]));

const T = {
  bg: '#0A0E2A', card: '#111836', border: '#1E2A5A',
  text: '#E2E8F0', muted: '#8892B0', accent: '#4B8EF1',
  green: '#00D48B', red: '#FF4D6A',
};

export default function PresentacionEditorPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const modulo = moduloMap[id];
  const grupo  = grupoMap[modulo?.grupo];
  const color  = grupo?.color || T.accent;

  const [bloques,  setBloques]  = useState([]);
  const [titulo,   setTitulo]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null); // { tipo: 'ok'|'error', texto }

  // Log al entrar al editor
  useEffect(() => {
    if (modulo && user) addLog(user, 'EDITAR_PRESENTACION', `#${modulo.id} — ${modulo.nombre}`);
  }, [modulo?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cargar presentación existente
  useEffect(() => {
    if (!modulo) return;
    getPresentacion(Number(id)).then(res => {
      if (res.ok && res.data) {
        setBloques(res.data.bloques || []);
        setTitulo(res.data.titulo  || modulo.nombre);
      } else {
        setTitulo(modulo.nombre);
      }
      setLoading(false);
    });
  }, [id, modulo]);

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const res = await savePresentacion({
      moduloId: Number(id),
      titulo,
      bloques,
      userId: user?.id,
    });
    setSaving(false);
    setMsg(res.ok
      ? { tipo: 'ok',    texto: '✓ Presentación guardada correctamente.' }
      : { tipo: 'error', texto: `Error: ${res.error}` }
    );
    setTimeout(() => setMsg(null), 4000);
  }

  if (!modulo) {
    return (
      <div style={{ margin: '-24px', minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted }}>
        Módulo no encontrado.
      </div>
    );
  }

  return (
    <div style={{ margin: '-24px', height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text }}>

      {/* ── Barra superior ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 16px', height: '52px', flexShrink: 0,
        background: T.card, borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Volver */}
        <button
          onClick={() => navigate(`/modulos/${id}/demo`)}
          onMouseEnter={e => e.currentTarget.style.borderColor = color}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: T.muted, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '7px', padding: '5px 11px', cursor: 'pointer', transition: 'border-color .15s', flexShrink: 0 }}
        >
          ← Volver
        </button>

        {/* Badge módulo */}
        <span style={{ width: '26px', height: '26px', background: color, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff', flexShrink: 0 }}>
          {modulo.id}
        </span>

        {/* Título editable */}
        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          style={{
            flex: 1, minWidth: 0,
            background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontSize: '14px', fontWeight: 600,
          }}
          placeholder="Nombre de la presentación…"
        />

        {/* Mensaje de estado */}
        {msg && (
          <span style={{ fontSize: '12px', color: msg.tipo === 'ok' ? T.green : T.red, flexShrink: 0 }}>
            {msg.texto}
          </span>
        )}

        {/* Ver presentación */}
        <button
          onClick={() => navigate(`/modulos/${id}/presentacion`)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: T.muted, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '7px', padding: '5px 11px', cursor: 'pointer', flexShrink: 0 }}
        >
          👁 Ver
        </button>

        {/* Guardar */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 700,
            color: '#fff', background: color,
            border: 'none', borderRadius: '7px', padding: '6px 14px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, flexShrink: 0,
            transition: 'opacity .15s',
          }}
        >
          {saving ? 'Guardando…' : '💾 Guardar'}
        </button>
      </div>

      {/* ── Canvas ── */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted }}>
          Cargando presentación…
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CanvasEditor bloques={bloques} onChange={setBloques} />
        </div>
      )}
    </div>
  );
}
