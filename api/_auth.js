const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

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

  if (profile?.rol !== 'admin') return { ok: false, status: 403, error: 'Solo administradores.' };

  return { ok: true, requesterId: data.user.id };
}

module.exports = { getSupabaseAdmin, verifyAdmin };
