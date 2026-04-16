import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_TIMEOUT_MS = 10_000;
const INVALID_CREDENTIALS_MESSAGE = 'Email o contraseña incorrectos';
const VALID_ROLES = new Set(['admin', 'usuario']);

const normalizeProfile = (authUser, profile) => {
  const metadata = authUser?.user_metadata || {};
  return {
    id: authUser?.id,
    email: profile?.email || authUser?.email || '',
    nombre: profile?.nombre || metadata.nombre || authUser?.email || 'Usuario',
    rol: VALID_ROLES.has(profile?.rol) ? profile.rol : (VALID_ROLES.has(metadata.rol) ? metadata.rol : 'usuario'),
    grupo: profile?.grupo || metadata.grupo || '',
  };
};

const getAuthErrorMessage = (error) => {
  if (!error) return 'No se pudo autenticar. Intenta de nuevo.';
  const message = String(error.message || '').toLowerCase();
  if (message.includes('invalid login credentials') || message.includes('email not confirmed')) {
    return INVALID_CREDENTIALS_MESSAGE;
  }
  return error.message || 'No se pudo autenticar. Intenta de nuevo.';
};

async function fetchProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id,nombre,email,rol,grupo')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('No se pudo consultar profiles en Supabase:', error.message || error);
    return null;
  }

  return data;
}

async function buildAuthenticatedUser(authUser) {
  if (!authUser) return null;
  const profile = await fetchProfile(authUser.id);
  return normalizeProfile(authUser, profile);
}

export async function authUser(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase no está configurado. Verifica tus variables de entorno.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data?.user) {
      return { ok: false, error: getAuthErrorMessage(error) };
    }

    const user = await buildAuthenticatedUser(data.user);
    return user ? { ok: true, user } : { ok: false, error: 'No se pudo cargar el perfil del usuario.' };
  } catch (err) {
    return { ok: false, error: 'Error de conexión' };
  }
}

export async function getCurrentAuthenticatedUser() {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase no está configurado. Verifica tus variables de entorno.' };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) return { ok: false, error: error.message || 'No se pudo validar la sesión.' };

  const authUser = data?.session?.user;
  if (!authUser) return { ok: false, error: 'Sesión no activa.' };

  const user = await buildAuthenticatedUser(authUser);
  return user ? { ok: true, user } : { ok: false, error: 'No se pudo cargar el perfil del usuario.' };
}

export function onAuthStateChange(callback) {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session));
}

export async function signOutUser() {
  if (!supabase) return { ok: false, error: 'Supabase no está configurado.' };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: error.message || 'No se pudo cerrar sesión.' };
  return { ok: true };
}

export async function getAccessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

/**
 * Guarda registro de acceso en localStorage y en Supabase.
 * @param {object} user    — usuario autenticado
 * @param {string} accion  — p.ej. LOGIN, LOGOUT, MODULO_VISTA, MODULO_DEMO
 * @param {string} [detalle] — información extra (nombre del módulo, duración, etc.)
 * Retorna una promesa que resuelve cuando el insert remoto termina (o null si no aplica).
 */
export function addLog(user, accion, detalle) {
  // Persistencia local (fallback / cache)
  const log = JSON.parse(localStorage.getItem('eth_log') || '[]');
  log.unshift({
    user: user.email,
    nombre: user.nombre,
    rol: user.rol,
    modulo: accion,
    detalle: detalle || null,
    ts: new Date().toISOString(),
  });
  localStorage.setItem('eth_log', JSON.stringify(log.slice(0, 300)));

  // Persistencia remota — retorna la promesa para poder ser esperada (ej: logout)
  if (supabase && user.id) {
    return supabase.from('activity_log').insert({
      user_id:     user.id,
      user_email:  user.email,
      user_nombre: user.nombre,
      user_rol:    user.rol,
      accion,
      detalle:     detalle || null,
    }).then(({ error }) => {
      if (error) console.warn('Failed to save user activity log:', error.message);
    }).catch(err => {
      console.warn('Failed to save user activity log:', err.message || err);
    });
  }
  return Promise.resolve();
}

/**
 * Obtiene registros de acceso
 */
export function getLogs() {
  return JSON.parse(localStorage.getItem('eth_log') || '[]');
}

/**
 * Limpia registros de acceso
 */
export function clearLogs() {
  localStorage.removeItem('eth_log');
}

/**
 * Crea un nuevo usuario usando el endpoint seguro del backend.
 */
export async function createUser({ nombre, email, password, rol, grupo }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { ok: false, error: 'Sesión inválida. Inicia sesión nuevamente.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  try {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ nombre, email, password, rol, grupo }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      return { ok: false, error: (data && data.error) || 'Error al crear el usuario' };
    }
    return data.success ? { ok: true } : { ok: false, error: data.error || 'Error al crear el usuario' };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, error: 'Tiempo de espera agotado. Intenta de nuevo.' };
    }
    return { ok: false, error: 'Error de conexión' };
  } finally {
    clearTimeout(timer);
  }
}

// ── GESTIÓN DE USUARIOS (Admin) ─────────────────────────────────────

async function callAdminApi(endpoint, body) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, error: 'Sesión inválida. Inicia sesión nuevamente.' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) return { ok: false, error: (data && data.error) || 'Error en el servidor.' };
    return data.success ? { ok: true } : { ok: false, error: data.error || 'Error desconocido.' };
  } catch (err) {
    if (err.name === 'AbortError') return { ok: false, error: 'Tiempo de espera agotado.' };
    return { ok: false, error: 'Error de conexión.' };
  } finally {
    clearTimeout(timer);
  }
}

export async function inviteUser({ nombre, email, rol, grupo }) {
  return callAdminApi('/api/users/create', { nombre, email, rol, grupo });
}

export async function changeUserPassword(userId, newPassword) {
  return callAdminApi('/api/users/change-password', { userId, newPassword });
}

export async function toggleUserStatus(userId, activo) {
  return callAdminApi('/api/users/toggle-status', { userId, activo });
}

export async function deleteUser(userId) {
  return callAdminApi('/api/users/delete', { userId });
}

// ── PERMISOS DE MÓDULOS ─────────────────────────────────────────────

export async function getUsuarios() {
  if (!supabase) return { ok: false, error: 'Supabase no configurado.' };
  const { data, error } = await supabase
    .from('profiles')
    .select('id,nombre,email,rol,grupo')
    .order('nombre');
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function getPermisosUsuario(userId) {
  if (!supabase || !userId) return { ok: false, error: 'Parámetros inválidos.' };
  const { data, error } = await supabase
    .from('permisos_modulos')
    .select('modulo_id,puede_ver')
    .eq('user_id', userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data || [] };
}

export async function savePermisosUsuario(userId, permisos) {
  if (!supabase || !userId) return { ok: false, error: 'Parámetros inválidos.' };
  const rows = permisos.map(p => ({
    user_id: userId,
    modulo_id: p.modulo_id,
    grupo_id: p.grupo_id,
    puede_ver: p.puede_ver,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from('permisos_modulos')
    .upsert(rows, { onConflict: 'user_id,modulo_id' });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ────────────────────────────────────────────────────────────────────

export async function resetPassword(email) {
  if (!supabase) {
    return { ok: false, error: 'Supabase no está configurado.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
  if (error) {
    return { ok: false, error: error.message || 'No se pudo procesar la solicitud.' };
  }

  return { ok: true, message: 'Revisa tu correo, te enviamos las instrucciones.' };
}
