import { supabase } from '../lib/supabase';

/**
 * Obtiene flags adicionales del perfil que auth.js no incluye.
 */
export async function getProfileFlags(userId) {
  if (!supabase || !userId) return { debe_cambiar_password: false };
  const { data } = await supabase
    .from('profiles')
    .select('debe_cambiar_password, activo')
    .eq('id', userId)
    .maybeSingle();
  return {
    debe_cambiar_password: data?.debe_cambiar_password ?? false,
    activo: data?.activo ?? true,
  };
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

    // Actualizar nombre en tabla profiles
    if (nombre !== undefined) {
      const { error } = await supabase
        .from('profiles')
        .update({ nombre })
        .eq('id', user.id);
      if (error) return { ok: false, error: error.message };
    }

    // Actualizar correo vía Supabase Auth (envía email de confirmación)
    if (email !== undefined) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) return { ok: false, error: error.message };
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
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Error desconocido.' };
  }
}
