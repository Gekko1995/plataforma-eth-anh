import { supabase } from '../lib/supabase';
import { getAccessToken } from './auth';

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
 * El usuario cambia su propia contraseña (primer login o voluntario).
 */
export async function changeOwnPassword(newPassword) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, error: 'Sesión inválida. Inicia sesión nuevamente.' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch('/api/users/change-own-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ newPassword }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) return { ok: false, error: data?.error || 'Error al cambiar la contraseña.' };
    return data.success ? { ok: true } : { ok: false, error: data.error || 'Error desconocido.' };
  } catch (err) {
    if (err.name === 'AbortError') return { ok: false, error: 'Tiempo de espera agotado.' };
    return { ok: false, error: 'Error de conexión.' };
  } finally {
    clearTimeout(timer);
  }
}
