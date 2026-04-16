import { supabase } from '../lib/supabase';

const DEFAULT_PERMISOS = {
  puede_crear_usuarios:     false,
  puede_eliminar_usuarios:  false,
  puede_modificar_usuarios: false,
  puede_cambiar_password:   false,
  puede_activar_desactivar: false,
  puede_ver_historial:      false,
  puede_gestionar_permisos: false,
};

const ALL_PERMISOS = Object.fromEntries(Object.keys(DEFAULT_PERMISOS).map(k => [k, true]));

/**
 * Obtiene flags adicionales del perfil que auth.js no incluye.
 */
export async function getProfileFlags(userId) {
  if (!supabase || !userId) return { debe_cambiar_password: false };
  const { data } = await supabase
    .from('profiles')
    .select('debe_cambiar_password, activo, rol')
    .eq('id', userId)
    .maybeSingle();

  const flags = {
    debe_cambiar_password: data?.debe_cambiar_password ?? false,
    activo: data?.activo ?? true,
    adminPermisos: null,
  };

  if (data?.rol === 'super_root') {
    flags.adminPermisos = { ...ALL_PERMISOS };
  } else if (data?.rol === 'admin') {
    const { data: p } = await supabase
      .from('permisos_admin')
      .select('*')
      .eq('admin_id', userId)
      .maybeSingle();
    flags.adminPermisos = p ? { ...DEFAULT_PERMISOS, ...p } : { ...DEFAULT_PERMISOS };
  }

  return flags;
}

/**
 * El usuario actualiza su propio nombre y/o correo.
 * Usa Supabase directamente — no requiere rutas API ni token manual.
 */
export async function updateOwnProfile({ nombre, email }) {
  if (!supabase) return { ok: false, error: 'Supabase no está configurado.' };

  try {
    // Obtener sesión activa
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { ok: false, error: 'Sesión expirada. Recarga la página e intenta de nuevo.' };

    // Campos a actualizar en la tabla profiles
    const profilePatch = {};
    if (nombre !== undefined) profilePatch.nombre = nombre;
    if (email  !== undefined) profilePatch.email  = email;

    if (Object.keys(profilePatch).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(profilePatch)
        .eq('id', user.id);
      if (error) return { ok: false, error: error.message };
    }

    // Actualizar correo en Supabase Auth (requiere confirmación por email)
    if (email !== undefined) {
      const { error } = await supabase.auth.updateUser({ email });
      // No bloqueamos si falla Auth — el profiles ya quedó actualizado
      if (error) console.warn('Auth email update pending:', error.message);
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Error desconocido.' };
  }
}

/**
 * El usuario cambia su propia contraseña.
 * Usa Supabase Auth directamente — no requiere rutas API ni token manual.
 */
export async function changeOwnPassword(newPassword) {
  if (!supabase) return { ok: false, error: 'Supabase no está configurado.' };

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { ok: false, error: 'Sesión expirada. Recarga la página e intenta de nuevo.' };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };

    // Marcar en la BD que ya cambió su contraseña
    await supabase.from('profiles').update({ debe_cambiar_password: false }).eq('id', user.id);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Error desconocido.' };
  }
}
