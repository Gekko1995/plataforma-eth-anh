import { useState, useEffect, useCallback } from 'react';
import { GROUPS } from '../data/constants';
import { getUsuarios, getPermisosUsuario, savePermisosUsuario } from '../utils/auth';

/* =====================================================================
   PANEL DE PERMISOS — Solo accesible por Admin
   Permite asignar qué módulos puede ver cada usuario
   ===================================================================== */

const ROL_BADGE = {
  admin: { bg: '#EFF6FF', color: '#1E40AF' },
  usuario: { bg: '#F3F4F6', color: '#4B5563' },
  'Gestor de Contenido': { bg: '#F5F3FF', color: '#6D28D9' },
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: 36,
        height: 20,
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg,#4F6EF7,#7C3AED)' : '#D1D5DB',
        transition: 'background .2s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }}
      />
    </button>
  );
}

export default function PanelPermisos({ isMobile, user }) {
  const isSuperRoot = user?.rol === 'super_root';
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permisos, setPermisos] = useState({});        // { [modulo_id]: boolean }
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [filterGrupo, setFilterGrupo] = useState('todos');

  // Cargar lista de usuarios
  useEffect(() => {
    (async () => {
      setLoadingUsuarios(true);
      const r = await getUsuarios();
      if (r.ok) {
        setUsuarios(r.data.filter(u => {
          // super_root puede gestionar módulos de admins pero no de otros super_root
          if (isSuperRoot) return u.rol !== 'super_root';
          // admin solo puede gestionar usuarios y gestores, nunca admins ni super_root
          return u.rol !== 'admin' && u.rol !== 'super_root';
        }));
      }
      setLoadingUsuarios(false);
    })();
  }, []);

  // Cargar permisos del usuario seleccionado
  const cargarPermisos = useCallback(async (userId) => {
    setLoadingPermisos(true);
    setMsg({ type: '', text: '' });
    const r = await getPermisosUsuario(userId);
    if (r.ok) {
      const mapa = {};
      r.data.forEach(p => { mapa[p.modulo_id] = p.puede_ver; });
      setPermisos(mapa);
    } else {
      setPermisos({});
    }
    setLoadingPermisos(false);
  }, []);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    cargarPermisos(u.id);
  };

  const handleToggle = (moduloId) => {
    setPermisos(prev => ({ ...prev, [moduloId]: !prev[moduloId] }));
  };

  const handleGuardar = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setMsg({ type: '', text: '' });

    const allModules = GROUPS.flatMap(g =>
      g.modules.map(m => ({
        modulo_id: m.id,
        grupo_id: g.id,
        puede_ver: permisos[m.id] === true,
      }))
    );

    const r = await savePermisosUsuario(selectedUser.id, allModules);
    setSaving(false);
    if (r.ok) {
      setMsg({ type: 'ok', text: 'Permisos guardados correctamente.' });
    } else {
      setMsg({ type: 'error', text: r.error || 'No se pudieron guardar los permisos.' });
    }
  };

  const handleToggleGrupo = (grupoId, valor) => {
    const modulosGrupo = GROUPS.find(g => g.id === grupoId)?.modules || [];
    setPermisos(prev => {
      const next = { ...prev };
      modulosGrupo.forEach(m => { next[m.id] = valor; });
      return next;
    });
  };

  const gruposFiltrados = filterGrupo === 'todos'
    ? GROUPS
    : GROUPS.filter(g => g.id === filterGrupo);

  const totalActivos = Object.values(permisos).filter(Boolean).length;

  // ── ESTILOS ──────────────────────────────────────────────────────────
  const card = {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #E8EBF2',
    overflow: 'hidden',
  };

  const labelMono = {
    fontSize: 10,
    fontFamily: "'IBM Plex Mono',monospace",
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: '#A0A5BD',
    fontWeight: 600,
  };

  return (
    <div style={{ animation: 'fadeIn .4s ease both' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#1A1D2B', marginBottom: 4 }}>
          Permisos de módulos
        </h2>
        <p style={{ fontSize: 13, color: '#8890A5' }}>
          Controla qué módulos puede ver cada usuario. Solo admins pueden modificar estos permisos.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: 16,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
      }}>
        {/* ── Panel izquierdo: lista de usuarios ── */}
        <div style={{ ...card, width: isMobile ? '100%' : 260, flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8EBF2' }}>
            <p style={labelMono}>Usuarios</p>
          </div>
          {loadingUsuarios ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#A0A5BD', fontSize: 13 }}>
              Cargando...
            </div>
          ) : usuarios.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#A0A5BD', fontSize: 13 }}>
              No hay usuarios registrados
            </div>
          ) : (
            <div style={{ maxHeight: isMobile ? 200 : 520, overflowY: 'auto' }}>
              {usuarios.map(u => {
                const badge = ROL_BADGE[u.rol] || ROL_BADGE.usuario;
                const active = selectedUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: '1px solid #F0F2F8',
                      background: active ? '#F5F3FF' : 'transparent',
                      cursor: 'pointer',
                      borderLeft: active ? '3px solid #7C3AED' : '3px solid transparent',
                      transition: 'background .15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: active ? 'linear-gradient(135deg,#4F6EF7,#7C3AED)' : '#E8EBF2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        color: active ? '#fff' : '#8890A5',
                        flexShrink: 0,
                      }}>
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1D2B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.nombre}
                        </p>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: badge.bg,
                          color: badge.color,
                          fontFamily: "'IBM Plex Mono',monospace",
                        }}>
                          {u.rol}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Panel derecho: módulos ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedUser ? (
            <div style={{
              ...card,
              padding: 40,
              textAlign: 'center',
              color: '#A0A5BD',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#4A5068' }}>Selecciona un usuario</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>para gestionar sus permisos de módulos</p>
            </div>
          ) : (
            <>
              {/* Barra de acciones */}
              <div style={{
                ...card,
                padding: '14px 20px',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D2B' }}>
                    {selectedUser.nombre}
                  </p>
                  <p style={{ fontSize: 12, color: '#8890A5' }}>
                    {totalActivos} de 39 módulos activos
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Filtro por grupo */}
                  <select
                    value={filterGrupo}
                    onChange={e => setFilterGrupo(e.target.value)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: '1px solid #E8EBF2',
                      fontSize: 12,
                      fontFamily: 'inherit',
                      color: '#4A5068',
                      background: '#F7F8FB',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="todos">Todos los grupos</option>
                    {GROUPS.map(g => (
                      <option key={g.id} value={g.id}>{g.id}. {g.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleGuardar}
                    disabled={saving || loadingPermisos}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      border: 'none',
                      background: saving ? '#A0A5BD' : 'linear-gradient(135deg,#4F6EF7,#7C3AED)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: saving ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {saving && (
                      <span style={{
                        width: 12, height: 12, border: '2px solid #fff4', borderTopColor: '#fff',
                        borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block',
                      }} />
                    )}
                    {saving ? 'Guardando...' : 'Guardar permisos'}
                  </button>
                </div>
              </div>

              {/* Mensaje feedback */}
              {msg.text && (
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  marginBottom: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  background: msg.type === 'ok' ? '#ECFDF5' : '#FEF2F2',
                  color: msg.type === 'ok' ? '#065F46' : '#DC2626',
                  border: `1px solid ${msg.type === 'ok' ? '#10B98133' : '#DC262633'}`,
                }}>
                  {msg.text}
                </div>
              )}

              {/* Grupos y módulos */}
              {loadingPermisos ? (
                <div style={{ ...card, padding: 32, textAlign: 'center', color: '#A0A5BD', fontSize: 13 }}>
                  Cargando permisos...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {gruposFiltrados.map(g => {
                    const activosGrupo = g.modules.filter(m => permisos[m.id]).length;
                    const todosActivos = activosGrupo === g.modules.length;
                    return (
                      <div key={g.id} style={card}>
                        {/* Cabecera del grupo */}
                        <div style={{
                          padding: '12px 18px',
                          borderBottom: '1px solid #F0F2F8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: g.color + '22',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 800,
                              color: g.color,
                            }}>
                              {g.id}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2B' }}>{g.name}</p>
                              <p style={{ fontSize: 10, color: '#A0A5BD', fontFamily: "'IBM Plex Mono',monospace" }}>
                                {activosGrupo}/{g.modules.length} activos
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, color: '#8890A5' }}>
                              {todosActivos ? 'Desactivar todo' : 'Activar todo'}
                            </span>
                            <Toggle
                              checked={todosActivos}
                              onChange={(val) => handleToggleGrupo(g.id, val)}
                            />
                          </div>
                        </div>

                        {/* Lista de módulos */}
                        {g.modules.map((m, idx) => (
                          <div
                            key={m.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '11px 18px',
                              borderBottom: idx < g.modules.length - 1 ? '1px solid #F7F8FB' : 'none',
                              background: permisos[m.id] ? '#FAFBFF' : 'transparent',
                              transition: 'background .15s',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                              <p style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: permisos[m.id] ? '#1A1D2B' : '#8890A5',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                <span style={{ color: '#A0A5BD', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, marginRight: 6 }}>
                                  {String(m.id).padStart(2, '0')}
                                </span>
                                {m.name}
                              </p>
                              {!isMobile && (
                                <p style={{ fontSize: 11, color: '#A0A5BD', marginTop: 1 }}>{m.desc}</p>
                              )}
                            </div>
                            <Toggle
                              checked={permisos[m.id] === true}
                              onChange={() => handleToggle(m.id)}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
