const { getSupabaseAdmin, verifySuperRoot } = require('../_auth');

const CAMPOS = [
  'puede_crear_usuarios',
  'puede_eliminar_usuarios',
  'puede_modificar_usuarios',
  'puede_cambiar_password',
  'puede_activar_desactivar',
  'puede_ver_historial',
  'puede_gestionar_permisos',
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifySuperRoot(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { adminId, permisos } = req.body || {};
  if (!adminId || typeof permisos !== 'object') {
    return res.status(400).json({ success: false, error: 'adminId y permisos requeridos.' });
  }

  // Verificar que el target sea admin
  const { data: target } = await supabaseAdmin
    .from('profiles').select('rol').eq('id', adminId).maybeSingle();

  if (target?.rol !== 'admin') {
    return res.status(400).json({ success: false, error: 'Solo se pueden configurar permisos para admins.' });
  }

  const patch = { admin_id: adminId, updated_by: auth.requesterId, updated_at: new Date().toISOString() };
  CAMPOS.forEach(campo => {
    if (typeof permisos[campo] === 'boolean') patch[campo] = permisos[campo];
  });

  const { error } = await supabaseAdmin
    .from('permisos_admin')
    .upsert(patch, { onConflict: 'admin_id' });

  if (error) return res.status(500).json({ success: false, error: error.message });

  return res.status(200).json({ success: true });
};
