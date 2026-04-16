const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Verifica que el solicitante sea admin o super_root
async function verifyAdmin(req, supabaseAdmin) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return { ok: false, status: 401, error: 'Token requerido.' };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user?.id) return { ok: false, status: 401, error: 'Sesión inválida.' };

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!['admin', 'super_root'].includes(profile?.rol)) {
    return { ok: false, status: 403, error: 'Acceso no autorizado.' };
  }

  return { ok: true, requesterId: data.user.id, rol: profile.rol };
}

// Verifica que el solicitante sea exclusivamente super_root
async function verifySuperRoot(req, supabaseAdmin) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return { ok: false, status: 401, error: 'Token requerido.' };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user?.id) return { ok: false, status: 401, error: 'Sesión inválida.' };

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profile?.rol !== 'super_root') {
    return { ok: false, status: 403, error: 'Solo el super root puede realizar esta acción.' };
  }

  return { ok: true, requesterId: data.user.id, rol: 'super_root' };
}

// Verifica permiso específico:
// - super_root: pasa siempre
// - admin: verifica columna en permisos_admin
async function verifyPermission(req, supabaseAdmin, permiso) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return { ok: false, status: 401, error: 'Token requerido.' };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user?.id) return { ok: false, status: 401, error: 'Sesión inválida.' };

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) return { ok: false, status: 403, error: 'Perfil no encontrado.' };

  if (profile.rol === 'super_root') {
    return { ok: true, requesterId: data.user.id, rol: 'super_root' };
  }

  if (profile.rol === 'admin') {
    const { data: permisos } = await supabaseAdmin
      .from('permisos_admin')
      .select(permiso)
      .eq('admin_id', data.user.id)
      .maybeSingle();

    if (!permisos || !permisos[permiso]) {
      return { ok: false, status: 403, error: 'No tienes permiso para realizar esta acción.' };
    }
    return { ok: true, requesterId: data.user.id, rol: 'admin' };
  }

  return { ok: false, status: 403, error: 'Acceso no autorizado.' };
}

module.exports = { getSupabaseAdmin, verifyAdmin, verifySuperRoot, verifyPermission };
