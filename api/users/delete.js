const { getSupabaseAdmin, verifyPermission } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyPermission(req, supabaseAdmin, 'puede_eliminar_usuarios');
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ success: false, error: 'userId requerido.' });

  if (userId === auth.requesterId) {
    return res.status(400).json({ success: false, error: 'No puedes eliminar tu propia cuenta.' });
  }

  // Proteger cuentas super_root de ser eliminadas por admins
  const { data: target } = await supabaseAdmin
    .from('profiles').select('rol').eq('id', userId).maybeSingle();

  if (target?.rol === 'super_root' && auth.rol !== 'super_root') {
    return res.status(403).json({ success: false, error: 'No puedes eliminar una cuenta super root.' });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return res.status(400).json({ success: false, error: error.message });

  return res.status(200).json({ success: true });
};
