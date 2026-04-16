import { useState, useEffect, useCallback } from 'react';
import { listAdminPermisos, setAdminPermisos } from '../utils/auth';

const PERMISOS_CONFIG = [
  { key: 'puede_crear_usuarios',     label: 'Crear usuarios',           desc: 'Puede agregar nuevas cuentas a la plataforma' },
  { key: 'puede_eliminar_usuarios',  label: 'Eliminar usuarios',        desc: 'Puede eliminar cuentas permanentemente' },
  { key: 'puede_modificar_usuarios', label: 'Modificar datos usuarios', desc: 'Puede editar nombre, email, rol y grupo' },
  { key: 'puede_cambiar_password',   label: 'Resetear contraseñas',     desc: 'Puede cambiar la contraseña de cualquier usuario' },
  { key: 'puede_activar_desactivar', label: 'Activar / desactivar',     desc: 'Puede bloquear o habilitar cuentas' },
  { key: 'puede_ver_historial',      label: 'Ver historial',            desc: 'Puede acceder al log de actividad' },
  { key: 'puede_gestionar_permisos', label: 'Gestionar permisos módulos', desc: 'Puede asignar permisos de módulos a usuarios' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative', width: 36, height: 20, borderRadius: 10,
        border: 'none', cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg,#4F6EF7,#7C3AED)' : '#D1D5DB',
        transition: 'background .2s', flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

export default function PermisosAdminPanel() {
  const [admins, setAdmins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [permisos, setPermisos] = useState({});
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ text: '', ok: true });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const result = await listAdminPermisos();
    if (result.ok) {
      setAdmins(result.admins);
      if (result.admins.length > 0 && !selected) {
        const first = result.admins[0];
        setSelected(first);
        setPermisos({ ...first.permisos });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  function selectAdmin(admin) {
    setSelected(admin);
    setPermisos({ ...admin.permisos });
    setMsg({ text: '', ok: true });
  }

  function togglePermiso(key) {
    setPermisos(p => ({ ...p, [key]: !p[key] }));
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const result = await setAdminPermisos(selected.id, permisos);
    setSaving(false);
    if (result.ok) {
      setMsg({ text: 'Permisos guardados correctamente.', ok: true });
      // Actualizar localmente
      setAdmins(prev => prev.map(a =>
        a.id === selected.id ? { ...a, permisos: { ...permisos } } : a
      ));
      setTimeout(() => setMsg({ text: '', ok: true }), 3000);
    } else {
      setMsg({ text: result.error || 'Error al guardar.', ok: false });
    }
  }

  if (loading) return <p style={{ color: 'var(--content-text-muted)' }}>Cargando administradores…</p>;

  if (admins.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ margin: 0 }}>No hay administradores registrados.</p>
        <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Crea un usuario con rol <strong>admin</strong> para configurar sus permisos aquí.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
      {/* Lista de admins */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          Administradores
        </div>
        {admins.map(a => (
          <button
            key={a.id}
            onClick={() => selectAdmin(a)}
            style={{
              width: '100%', textAlign: 'left', padding: '12px 16px',
              border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
              background: selected?.id === a.id ? '#eff6ff' : '#fff',
              transition: 'background .15s',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '14px', color: selected?.id === a.id ? '#1d4ed8' : '#1e293b' }}>{a.nombre}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{a.email}</div>
            {!a.activo && <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>Inactivo</span>}
          </button>
        ))}
      </div>

      {/* Panel de permisos */}
      {selected && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>{selected.nombre}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{selected.email}</div>
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

          {msg.text && (
            <div style={{
              margin: '12px 20px 0', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              background: msg.ok ? '#dcfce7' : '#fef2f2',
              color:      msg.ok ? '#15803d' : '#dc2626',
              border: `1px solid ${msg.ok ? '#86efac' : '#fca5a5'}`,
            }}>
              {msg.text}
            </div>
          )}

          <div style={{ padding: '8px 0' }}>
            {PERMISOS_CONFIG.map(({ key, label, desc }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
                </div>
                <Toggle checked={!!permisos[key]} onChange={() => togglePermiso(key)} />
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 20px', background: '#fffbeb', borderTop: '1px solid #fde68a' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>
              Los cambios aplican en el próximo inicio de sesión del administrador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
