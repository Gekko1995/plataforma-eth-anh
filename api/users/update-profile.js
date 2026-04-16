const { getSupabaseAdmin } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ success: false, error: 'No autenticado.' });

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ success: false, error: 'Sesión inválida.' });
  }

  const userId = userData.user.id;
  const { nombre, email } = req.body || {};

  if (!nombre && !email) {
    return res.status(400).json({ success: false, error: 'Se requiere al menos un campo para actualizar.' });
  }

  if (nombre !== undefined) {
    const trimmed = nombre.trim();
    if (!trimmed) return res.status(400).json({ success: false, error: 'El nombre no puede estar vacío.' });

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ nombre: trimmed })
      .eq('id', userId);

    if (profileError) return res.status(400).json({ success: false, error: profileError.message });
  }

  if (email !== undefined) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return res.status(400).json({ success: false, error: 'El correo no es válido.' });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, { email: trimmed });
    if (authError) return res.status(400).json({ success: false, error: authError.message });

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ email: trimmed })
      .eq('id', userId);

    if (profileError) return res.status(400).json({ success: false, error: profileError.message });
  }

  return res.status(200).json({ success: true });
};
