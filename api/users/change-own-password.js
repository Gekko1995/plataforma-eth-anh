const { getSupabaseAdmin } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  // Verificar sesión del usuario (cualquier usuario autenticado, no solo admin)
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ success: false, error: 'No autenticado.' });

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ success: false, error: 'Sesión inválida.' });
  }

  const userId = userData.user.id;
  const { newPassword } = req.body || {};

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'La contraseña debe tener mínimo 8 caracteres.' });
  }

  // Cambiar contraseña
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return res.status(400).json({ success: false, error: error.message });

  // Quitar el flag de cambio obligatorio
  await supabaseAdmin
    .from('profiles')
    .update({ debe_cambiar_password: false })
    .eq('id', userId);

  return res.status(200).json({ success: true });
};
