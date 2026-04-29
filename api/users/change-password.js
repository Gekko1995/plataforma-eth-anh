const { getSupabaseAdmin, verifyPermission } = require('../_auth');
const { sendEmail, cambioPasswordHtml } = require('../_email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyPermission(req, supabaseAdmin, 'puede_cambiar_password');
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId, newPassword, enviarCorreo } = req.body || {};

  if (!userId || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'userId requerido y contraseña mínimo 8 caracteres.' });
  }

  // Proteger cuentas super_root
  const { data: target } = await supabaseAdmin
    .from('profiles').select('rol, nombre, email').eq('id', userId).maybeSingle();

  if (target?.rol === 'super_root' && auth.rol !== 'super_root') {
    return res.status(403).json({ success: false, error: 'No puedes modificar una cuenta super root.' });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return res.status(400).json({ success: false, error: error.message });

  await supabaseAdmin
    .from('profiles')
    .update({ debe_cambiar_password: true })
    .eq('id', userId);

  if (enviarCorreo && target?.email) {
    await sendEmail({
      to:      target.email,
      subject: 'Tu contraseña ha sido actualizada — Plataforma de Gestión y Viabilidad de Proyectos de Inversión',
      html:    cambioPasswordHtml({ nombre: target.nombre || 'Usuario', email: target.email }),
    });
  }

  return res.status(200).json({ success: true });
};
