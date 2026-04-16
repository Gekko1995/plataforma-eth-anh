const { getSupabaseAdmin, verifyPermission } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyPermission(req, supabaseAdmin, 'puede_activar_desactivar');
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId, activo } = req.body || {};
  if (!userId || typeof activo !== 'boolean') {
    return res.status(400).json({ success: false, error: 'userId y activo (boolean) requeridos.' });
  }

  // Proteger cuentas super_root
  const { data: target } = await supabaseAdmin
    .from('profiles').select('rol').eq('id', userId).maybeSingle();

  if (target?.rol === 'super_root' && auth.rol !== 'super_root') {
    return res.status(403).json({ success: false, error: 'No puedes modificar una cuenta super root.' });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: activo ? 'none' : '876600h',
  });
  if (error) return res.status(400).json({ success: false, error: error.message });

  await supabaseAdmin.from('profiles').update({ activo }).eq('id', userId);

  return res.status(200).json({ success: true });
};
