import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { createUser, changeUserPassword, toggleUserStatus, deleteUser, updateUser } from '../utils/auth';

const ROLES_ADMIN     = ['admin', 'usuario', 'Gestor de Contenido'];
const ROLES_SUPERROOT = ['super_root', 'admin', 'usuario', 'Gestor de Contenido'];
const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const MODAL_NONE   = null;
const MODAL_CREAR  = 'crear';
const MODAL_EDITAR = 'editar';
const MODAL_PWD    = 'pwd';
const MODAL_BORRAR = 'borrar';

function Badge({ activo }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: 600,
      background: activo ? '#dcfce7' : '#fee2e2',
      color:      activo ? '#15803d' : '#dc2626',
    }}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export default function GestionUsuarios({ isMobile, user }) {
  const p = user?.adminPermisos || {};
  const isSuperRoot = user?.rol === 'super_root';

  const canCreate  = isSuperRoot || !!p.puede_crear_usuarios;
  const canDelete  = isSuperRoot || !!p.puede_eliminar_usuarios;
  const canEdit    = isSuperRoot || !!p.puede_modificar_usuarios;
  const canPwd     = isSuperRoot || !!p.puede_cambiar_password;
  const canToggle  = isSuperRoot || !!p.puede_activar_desactivar;

  const availableRoles = isSuperRoot ? ROLES_SUPERROOT : ROLES_ADMIN;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(MODAL_NONE);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg]           = useState({ text: '', ok: true });

  const [form, setForm]         = useState({ nombre: '', email: '', password: '', confirmar: '', rol: 'Gestor de Contenido', grupo: 'A', enviarCorreo: false });
  const [formError, setFormError] = useState('');
  const [saving, setSaving]     = useState(false);

  const [editForm, setEditForm] = useState({ nombre: '', email: '', rol: '', grupo: '' });
  const [editError, setEditError] = useState('');

  const [pwdForm, setPwdForm]   = useState({ nueva: '', confirmar: '', enviarCorreo: false });
  const [pwdError, setPwdError] = useState('');

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, nombre, email, rol, grupo, activo, debe_cambiar_password')
      .order('nombre');

    // Los admins no ven cuentas super_root ni otros admins
    if (!isSuperRoot) {
      query = query.not('rol', 'in', '("super_root","admin")');
    }

    const { data, error } = await query;
    if (!error) setUsuarios(data || []);
    setLoading(false);
  }, [isSuperRoot]);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  function showMsg(text, ok = true) {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: '', ok: true }), 4000);
  }

  function openCrear() {
    setForm({ nombre: '', email: '', password: '', confirmar: '', rol: 'Gestor de Contenido', grupo: 'A', enviarCorreo: false });
    setFormError('');
    setModal(MODAL_CREAR);
  }

  function openEditar(u) {
    setSelected(u);
    setEditForm({ nombre: u.nombre, email: u.email, rol: u.rol, grupo: u.grupo });
    setEditError('');
    setModal(MODAL_EDITAR);
  }

  function openPwd(u) {
    setSelected(u);
    setPwdForm({ nueva: '', confirmar: '', enviarCorreo: false });
    setPwdError('');
    setModal(MODAL_PWD);
  }

  function openBorrar(u) {
    setSelected(u);
    setModal(MODAL_BORRAR);
  }

  function closeModal() { setModal(MODAL_NONE); setSelected(null); }

  async function handleCrear(e) {
    e.preventDefault();
    setFormError('');
    if (!form.nombre.trim())              return setFormError('El nombre es requerido.');
    if (!form.email.trim())               return setFormError('El email es requerido.');
    if (form.password.length < 8)         return setFormError('La contraseña debe tener mínimo 8 caracteres.');
    if (form.password !== form.confirmar) return setFormError('Las contraseñas no coinciden.');

    setSaving(true);
    const result = await createUser({
      nombre: form.nombre.trim(), email: form.email.trim(),
      password: form.password, rol: form.rol, grupo: form.grupo,
      enviarCorreo: form.enviarCorreo,
    });
    setSaving(false);

    if (result.ok) {
      closeModal();
      showMsg(form.enviarCorreo ? 'Usuario creado. Se envió el correo con sus credenciales.' : 'Usuario creado.');
      fetchUsuarios();
    } else {
      setFormError(result.error);
    }
  }

  async function handleEditar(e) {
    e.preventDefault();
    setEditError('');
    if (!editForm.nombre.trim()) return setEditError('El nombre no puede estar vacío.');

    setSaving(true);
    const result = await updateUser(selected.id, {
      nombre: editForm.nombre.trim(),
      email:  editForm.email.trim(),
      rol:    editForm.rol,
      grupo:  editForm.grupo,
    });
    setSaving(false);

    if (result.ok) {
      closeModal();
      showMsg('Usuario actualizado.');
      fetchUsuarios();
    } else {
      setEditError(result.error);
    }
  }

  async function handleCambiarPwd(e) {
    e.preventDefault();
    setPwdError('');
    if (pwdForm.nueva.length < 8)            return setPwdError('Mínimo 8 caracteres.');
    if (pwdForm.nueva !== pwdForm.confirmar) return setPwdError('Las contraseñas no coinciden.');

    setSaving(true);
    const result = await changeUserPassword(selected.id, pwdForm.nueva, pwdForm.enviarCorreo);
    setSaving(false);

    if (result.ok) {
      closeModal();
      showMsg('Contraseña actualizada.');
    } else {
      setPwdError(result.error);
    }
  }

  async function handleToggle(u) {
    const result = await toggleUserStatus(u.id, !u.activo);
    if (result.ok) {
      showMsg(`Usuario ${!u.activo ? 'activado' : 'desactivado'}.`);
      fetchUsuarios();
    } else {
      showMsg(result.error, false);
    }
  }

  async function handleBorrar() {
    setSaving(true);
    const result = await deleteUser(selected.id);
    setSaving(false);
    if (result.ok) {
      closeModal();
      showMsg('Usuario eliminado.');
      fetchUsuarios();
    } else {
      showMsg(result.error, false);
      closeModal();
    }
  }

  // Determina si el usuario actual puede operar sobre el target
  function canOperateOn(targetUser) {
    if (isSuperRoot) return true;
    return targetUser?.rol !== 'super_root' && targetUser?.rol !== 'admin';
  }

  const inputStyle = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: '#374151' };
  const errBox = (msg) => msg ? (
    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>
      {msg}
    </div>
  ) : null;

  return (
    <div>
      {msg.text && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
          background: msg.ok ? '#dcfce7' : '#fee2e2',
          color:      msg.ok ? '#15803d' : '#dc2626',
          border: `1px solid ${msg.ok ? '#86efac' : '#fca5a5'}`,
        }}>
          {msg.text}
        </div>
      )}

      {canCreate && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="btn btn-primary" onClick={openCrear}>+ Crear usuario</button>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--content-text-muted)' }}>Cargando usuarios…</p>
      ) : usuarios.length === 0 ? (
        <p style={{ color: 'var(--content-text-muted)' }}>No hay usuarios registrados.</p>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {usuarios.map(u => (
            <div key={u.id} style={{ background: '#fff', border: '1px solid var(--content-border)', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>
                    {u.nombre}
                    {u.debe_cambiar_password && <span title="Pendiente cambio de contraseña" style={{ marginLeft: '6px', color: '#f59e0b' }}>⚠</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{u.email}</div>
                </div>
                <Badge activo={u.activo} />
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{u.rol}</span>
                <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>Grupo {u.grupo}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {canEdit  && canOperateOn(u) && <button className="btn btn-secondary btn-sm" onClick={() => openEditar(u)}>Editar</button>}
                {canPwd   && canOperateOn(u) && <button className="btn btn-secondary btn-sm" onClick={() => openPwd(u)}>Contraseña</button>}
                {canToggle && canOperateOn(u) && <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u)}>{u.activo ? 'Desactivar' : 'Activar'}</button>}
                {canDelete && canOperateOn(u) && <button className="btn btn-danger btn-sm" onClick={() => openBorrar(u)}>Eliminar</button>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nombre', 'Email', 'Rol', 'Grupo', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '11px 12px', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                    {u.nombre}
                    {u.debe_cambiar_password && <span title="Pendiente cambio de contraseña" style={{ marginLeft: '6px', fontSize: '13px', color: '#f59e0b' }}>⚠</span>}
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: '13px', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '11px 12px' }}><span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{u.rol}</span></td>
                  <td style={{ padding: '11px 12px', fontSize: '14px', color: '#64748b' }}>{u.grupo}</td>
                  <td style={{ padding: '11px 12px' }}><Badge activo={u.activo} /></td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {canEdit   && canOperateOn(u) && <button className="btn btn-secondary btn-sm" onClick={() => openEditar(u)}>Editar</button>}
                      {canPwd    && canOperateOn(u) && <button className="btn btn-secondary btn-sm" onClick={() => openPwd(u)}>Contraseña</button>}
                      {canToggle && canOperateOn(u) && <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u)}>{u.activo ? 'Desactivar' : 'Activar'}</button>}
                      {canDelete && canOperateOn(u) && <button className="btn btn-danger btn-sm" onClick={() => openBorrar(u)}>Eliminar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR */}
      {modal === MODAL_CREAR && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">Crear usuario</div>
                <div className="modal-subtitle">Completa los datos del nuevo usuario</div>
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleCrear}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={inputStyle}>Nombre completo</label>
                  <input className="form-input" placeholder="Ej: María González" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={inputStyle}>Correo electrónico</label>
                  <input className="form-input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label style={inputStyle}>Contraseña temporal</label>
                    <input className="form-input" type="password" placeholder="Mín. 8 caracteres" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label style={inputStyle}>Confirmar</label>
                    <input className="form-input" type="password" placeholder="Repite la contraseña" value={form.confirmar} onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={form.enviarCorreo} onChange={e => setForm(f => ({ ...f, enviarCorreo: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>Enviar correo de bienvenida con credenciales</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={inputStyle}>Rol</label>
                    <select className="form-select" value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                      {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={inputStyle}>Grupo</label>
                    <select className="form-select" value={form.grupo} onChange={e => setForm(f => ({ ...f, grupo: e.target.value }))}>
                      {GRUPOS.map(g => <option key={g} value={g}>Grupo {g}</option>)}
                    </select>
                  </div>
                </div>
                {errBox(formError)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creando…' : 'Crear usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modal === MODAL_EDITAR && selected && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">Editar usuario</div>
                <div className="modal-subtitle">{selected.nombre}</div>
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleEditar}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={inputStyle}>Nombre completo</label>
                  <input className="form-input" value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={inputStyle}>Correo electrónico</label>
                  <input className="form-input" type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={inputStyle}>Rol</label>
                    <select className="form-select" value={editForm.rol} onChange={e => setEditForm(f => ({ ...f, rol: e.target.value }))}>
                      {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={inputStyle}>Grupo</label>
                    <select className="form-select" value={editForm.grupo} onChange={e => setEditForm(f => ({ ...f, grupo: e.target.value }))}>
                      {GRUPOS.map(g => <option key={g} value={g}>Grupo {g}</option>)}
                    </select>
                  </div>
                </div>
                {errBox(editError)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {modal === MODAL_PWD && selected && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <div>
                <div className="modal-title">Cambiar contraseña</div>
                <div className="modal-subtitle">{selected.nombre}</div>
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleCambiarPwd}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={inputStyle}>Nueva contraseña</label>
                  <input className="form-input" type="password" placeholder="Mínimo 8 caracteres" value={pwdForm.nueva} onChange={e => setPwdForm(f => ({ ...f, nueva: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={inputStyle}>Confirmar contraseña</label>
                  <input className="form-input" type="password" placeholder="Repite la contraseña" value={pwdForm.confirmar} onChange={e => setPwdForm(f => ({ ...f, confirmar: e.target.value }))} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={pwdForm.enviarCorreo} onChange={e => setPwdForm(f => ({ ...f, enviarCorreo: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>Notificar al usuario por correo</span>
                </label>
                {errBox(pwdError)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modal === MODAL_BORRAR && selected && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <div className="modal-title">Eliminar usuario</div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                ¿Seguro que quieres eliminar a <strong>{selected.nombre}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleBorrar} disabled={saving}>{saving ? 'Eliminando…' : 'Sí, eliminar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
