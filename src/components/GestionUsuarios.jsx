import { useState, useEffect, useCallback } from 'react';
import { getUsuarios, inviteUser, changeUserPassword, toggleUserStatus, deleteUser } from '../utils/auth';

/* =====================================================================
   GESTIÓN DE USUARIOS — Solo Admin
   ===================================================================== */

const ROL_BADGE = {
  admin:                { bg: '#EFF6FF', color: '#1E40AF', label: 'Admin' },
  usuario:              { bg: '#F3F4F6', color: '#4B5563', label: 'Usuario' },
  'Gestor de Contenido':{ bg: '#F5F3FF', color: '#6D28D9', label: 'Gestor' },
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1px solid #E8EBF2',
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#1A1D2B',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
};

function Modal({ show, onClose, title, subtitle, children, isMobile }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
        display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center', zIndex: 2000,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff',
        borderRadius: isMobile ? '20px 20px 0 0' : 16,
        padding: isMobile ? '24px 20px 36px' : '36px 40px',
        width: '100%',
        maxWidth: isMobile ? '100%' : 520,
        maxHeight: '92dvh',
        overflowY: 'auto',
        boxShadow: '0 -4px 40px rgba(0,0,0,.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1D2B', marginBottom: 2 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 12, color: '#8890A5' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ background: '#F0F2F8', border: 'none', borderRadius: 8, width: 34, height: 34, fontSize: 16, cursor: 'pointer', color: '#4A5068', flexShrink: 0 }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Msg({ msg }) {
  if (!msg?.text) return null;
  return (
    <div style={{
      fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16,
      background: msg.type === 'ok' ? '#ECFDF5' : '#FEF2F2',
      color: msg.type === 'ok' ? '#065F46' : '#DC2626',
      border: `1px solid ${msg.type === 'ok' ? '#BBF7D0' : '#FCA5A5'}`,
    }}>
      {msg.text}
    </div>
  );
}

export default function GestionUsuarios({ isMobile }) {
  const [usuarios, setUsuarios]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');

  // Modal invitar
  const [showInvite, setShowInvite]       = useState(false);
  const [inviteForm, setInviteForm]       = useState({ nombre: '', email: '', rol: 'Gestor de Contenido', grupo: 'A' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg]         = useState({ type: '', text: '' });

  // Modal cambiar contraseña
  const [showPwd, setShowPwd]             = useState(false);
  const [selectedUser, setSelectedUser]   = useState(null);
  const [newPwd, setNewPwd]               = useState('');
  const [pwdLoading, setPwdLoading]       = useState(false);
  const [pwdMsg, setPwdMsg]               = useState({ type: '', text: '' });

  // Confirmar eliminar
  const [showDelete, setShowDelete]       = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMsg, setActionMsg]         = useState({ type: '', text: '' });

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    const r = await getUsuarios();
    if (r.ok) setUsuarios(r.data);
    setLoading(false);
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const setAction = (userId, val) => setActionLoading(p => ({ ...p, [userId]: val }));

  // ── Invitar usuario ──────────────────────────────────────────────
  const handleInvite = async e => {
    e.preventDefault();
    setInviteMsg({ type: '', text: '' });
    const { nombre, email, rol, grupo } = inviteForm;
    if (!nombre.trim() || !email.trim()) {
      setInviteMsg({ type: 'error', text: 'Nombre y email son obligatorios.' });
      return;
    }
    setInviteLoading(true);
    const r = await inviteUser({ nombre: nombre.trim(), email: email.trim(), rol, grupo });
    setInviteLoading(false);
    if (r.ok) {
      setInviteMsg({ type: 'ok', text: `Invitación enviada a ${email.trim()}. El usuario recibirá un email para crear su contraseña.` });
      setInviteForm({ nombre: '', email: '', rol: 'Gestor de Contenido', grupo: 'A' });
      cargarUsuarios();
    } else {
      setInviteMsg({ type: 'error', text: r.error || 'No se pudo enviar la invitación.' });
    }
  };

  // ── Cambiar contraseña ───────────────────────────────────────────
  const handleChangePwd = async e => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    if (newPwd.length < 8) {
      setPwdMsg({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    setPwdLoading(true);
    const r = await changeUserPassword(selectedUser.id, newPwd);
    setPwdLoading(false);
    if (r.ok) {
      setPwdMsg({ type: 'ok', text: 'Contraseña actualizada correctamente.' });
      setNewPwd('');
    } else {
      setPwdMsg({ type: 'error', text: r.error || 'No se pudo cambiar la contraseña.' });
    }
  };

  // ── Toggle estado ────────────────────────────────────────────────
  const handleToggle = async (u) => {
    setAction(u.id, 'toggle');
    setActionMsg({ type: '', text: '' });
    const nuevoEstado = !(u.activo !== false);
    const r = await toggleUserStatus(u.id, nuevoEstado);
    setAction(u.id, null);
    if (r.ok) {
      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, activo: nuevoEstado } : x));
    } else {
      setActionMsg({ type: 'error', text: r.error || 'No se pudo cambiar el estado.' });
    }
  };

  // ── Eliminar usuario ─────────────────────────────────────────────
  const handleDelete = async () => {
    setAction(selectedUser.id, 'delete');
    setActionMsg({ type: '', text: '' });
    const r = await deleteUser(selectedUser.id);
    setAction(selectedUser.id, null);
    setShowDelete(false);
    if (r.ok) {
      setUsuarios(prev => prev.filter(x => x.id !== selectedUser.id));
      setSelectedUser(null);
    } else {
      setActionMsg({ type: 'error', text: r.error || 'No se pudo eliminar el usuario.' });
    }
  };

  const filtrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={{ animation: 'fadeIn .4s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#1A1D2B', marginBottom: 2 }}>Gestión de usuarios</h2>
          <p style={{ fontSize: 13, color: '#8890A5' }}>{usuarios.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => { setShowInvite(true); setInviteMsg({ type: '', text: '' }); }}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#4F6EF7,#7C3AED)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          + Invitar usuario
        </button>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0A5BD', fontSize: 14 }}>⌕</span>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36 }}
          onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
          onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
        />
      </div>

      {/* Mensaje global */}
      <Msg msg={actionMsg} />

      {/* Lista de usuarios */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#A0A5BD', fontSize: 13 }}>Cargando usuarios...</div>
      ) : filtrados.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8EBF2', padding: 40, textAlign: 'center', color: '#A0A5BD', fontSize: 13 }}>
          {search ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtrados.map(u => {
            const badge   = ROL_BADGE[u.rol] || ROL_BADGE.usuario;
            const activo  = u.activo !== false;
            const loading = actionLoading[u.id];
            return (
              <div
                key={u.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid #E8EBF2',
                  padding: isMobile ? '14px 16px' : '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: activo ? 1 : 0.6,
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: activo ? 'linear-gradient(135deg,#4F6EF7,#7C3AED)' : '#D1D5DB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff',
                }}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2B' }}>{u.nombre}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: badge.bg, color: badge.color, fontFamily: "'IBM Plex Mono',monospace" }}>
                      {badge.label}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: '#A0A5BD' }}>Grupo {u.grupo}</span>
                    {!activo && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#FEF2F2', color: '#DC2626' }}>
                        Deshabilitado
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#8890A5', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {/* Cambiar contraseña */}
                  <button
                    title="Cambiar contraseña"
                    onClick={() => { setSelectedUser(u); setNewPwd(''); setPwdMsg({ type: '', text: '' }); setShowPwd(true); }}
                    style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid #E8EBF2', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#4A5068' }}
                  >
                    🔑
                  </button>
                  {/* Habilitar / Deshabilitar */}
                  <button
                    title={activo ? 'Deshabilitar' : 'Habilitar'}
                    disabled={!!loading}
                    onClick={() => handleToggle(u)}
                    style={{
                      padding: '7px 10px', borderRadius: 7, border: '1px solid #E8EBF2',
                      background: activo ? '#FFFBEB' : '#ECFDF5',
                      cursor: loading ? 'wait' : 'pointer', fontSize: 14,
                      color: activo ? '#92400E' : '#065F46',
                    }}
                  >
                    {loading === 'toggle' ? '...' : activo ? '🚫' : '✅'}
                  </button>
                  {/* Eliminar */}
                  <button
                    title="Eliminar usuario"
                    disabled={!!loading}
                    onClick={() => { setSelectedUser(u); setShowDelete(true); }}
                    style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid #FCA5A5', background: '#FEF2F2', cursor: loading ? 'wait' : 'pointer', fontSize: 14, color: '#DC2626' }}
                  >
                    {loading === 'delete' ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL INVITAR USUARIO ── */}
      <Modal show={showInvite} onClose={() => setShowInvite(false)} isMobile={isMobile}
        title="Invitar usuario"
        subtitle="El usuario recibirá un email para crear su propia contraseña"
      >
        <form onSubmit={handleInvite} autoComplete="off">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4A5068', marginBottom: 6 }}>Nombre completo</label>
              <input
                type="text" placeholder="Ej. María González"
                value={inviteForm.nombre}
                onChange={e => setInviteForm(p => ({ ...p, nombre: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
                onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4A5068', marginBottom: 6 }}>Correo electrónico</label>
              <input
                type="email" placeholder="usuario@ejemplo.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
                onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4A5068', marginBottom: 6 }}>Rol</label>
              <select value={inviteForm.rol} onChange={e => setInviteForm(p => ({ ...p, rol: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
                onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
              >
                <option value="Gestor de Contenido">Gestor de Contenido</option>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4A5068', marginBottom: 6 }}>Grupo</label>
              <select value={inviteForm.grupo} onChange={e => setInviteForm(p => ({ ...p, grupo: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
                onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
              >
                {['A','B','C','D','E','F','G','H','I'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <Msg msg={inviteMsg} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setShowInvite(false)}
              style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #E8EBF2', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A5068' }}>
              Cancelar
            </button>
            <button type="submit" disabled={inviteLoading}
              style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: inviteLoading ? '#A5B4FC' : 'linear-gradient(135deg,#4F6EF7,#7C3AED)', fontSize: 13, fontWeight: 600, cursor: inviteLoading ? 'not-allowed' : 'pointer', color: '#fff' }}>
              {inviteLoading ? 'Enviando...' : 'Enviar invitación'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL CAMBIAR CONTRASEÑA ── */}
      <Modal show={showPwd} onClose={() => setShowPwd(false)} isMobile={isMobile}
        title="Cambiar contraseña"
        subtitle={selectedUser ? `Usuario: ${selectedUser.nombre}` : ''}
      >
        <form onSubmit={handleChangePwd} autoComplete="off">
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4A5068', marginBottom: 6 }}>Nueva contraseña</label>
            <input
              type="password" placeholder="Mínimo 8 caracteres"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4F6EF7')}
              onBlur={e => (e.target.style.borderColor = '#E8EBF2')}
            />
          </div>
          <Msg msg={pwdMsg} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setShowPwd(false)}
              style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #E8EBF2', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A5068' }}>
              Cancelar
            </button>
            <button type="submit" disabled={pwdLoading}
              style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: pwdLoading ? '#A5B4FC' : 'linear-gradient(135deg,#4F6EF7,#7C3AED)', fontSize: 13, fontWeight: 600, cursor: pwdLoading ? 'not-allowed' : 'pointer', color: '#fff' }}>
              {pwdLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL CONFIRMAR ELIMINACIÓN ── */}
      <Modal show={showDelete} onClose={() => setShowDelete(false)} isMobile={isMobile}
        title="Eliminar usuario"
        subtitle="Esta acción no se puede deshacer"
      >
        <div style={{ padding: '8px 0 24px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 600 }}>{selectedUser?.nombre}</p>
            <p style={{ fontSize: 12, color: '#EF4444', marginTop: 2 }}>{selectedUser?.email}</p>
          </div>
          <p style={{ fontSize: 13, color: '#4A5068' }}>
            Se eliminará permanentemente el usuario y todos sus datos. ¿Estás seguro?
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowDelete(false)}
            style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #E8EBF2', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A5068' }}>
            Cancelar
          </button>
          <button onClick={handleDelete}
            style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff' }}>
            Sí, eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
