const { getSupabaseAdmin, verifyAdmin } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyAdmin(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId, activo } = req.body || {};
  if (!userId || typeof activo !== 'boolean') {
    return res.status(400).json({ success: false, error: 'userId y activo (boolean) requeridos.' });
  }

  // Ban 876600h ≈ 100 años = deshabilitar. 'none' = habilitar
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: activo ? 'none' : '876600h',
  });
  if (error) return res.status(400).json({ success: false, error: error.message });

  // Reflejar estado en profiles
  await supabaseAdmin.from('profiles').update({ activo }).eq('id', userId);

  return res.status(200).json({ success: true });
};
