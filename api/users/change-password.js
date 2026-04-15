const { getSupabaseAdmin, verifyAdmin } = require('../_auth');
const { sendEmail, cambioPasswordHtml } = require('../_email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyAdmin(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId, newPassword } = req.body || {};

  if (!userId || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'userId requerido y contraseña mínimo 8 caracteres.' });
  }

  // Cambiar contraseña
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return res.status(400).json({ success: false, error: error.message });

  // Marcar que debe cambiar contraseña al próximo login
  await supabaseAdmin
    .from('profiles')
    .update({ debe_cambiar_password: true })
    .eq('id', userId);

  // Obtener datos del usuario para el correo
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('nombre, email')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.email) {
    await sendEmail({
      to:      profile.email,
      subject: 'Tu contraseña ha sido actualizada — ETH-ANH 2026',
      html:    cambioPasswordHtml({ nombre: profile.nombre || 'Usuario', email: profile.email }),
    });
  }

  return res.status(200).json({ success: true });
};
