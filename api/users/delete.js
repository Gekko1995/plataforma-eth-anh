const { getSupabaseAdmin, verifyAdmin } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyAdmin(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ success: false, error: 'userId requerido.' });

  // Proteger: admin no puede borrarse a sí mismo
  if (userId === auth.requesterId) {
    return res.status(400).json({ success: false, error: 'No puedes eliminar tu propia cuenta.' });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return res.status(400).json({ success: false, error: error.message });

  // El perfil se borra por CASCADE (ON DELETE CASCADE en profiles)
  return res.status(200).json({ success: true });
};
