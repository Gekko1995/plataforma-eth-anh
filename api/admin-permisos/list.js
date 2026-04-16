const { getSupabaseAdmin, verifySuperRoot } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifySuperRoot(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  // Obtener todos los admins con sus permisos
  const { data: admins, error } = await supabaseAdmin
    .from('profiles')
    .select('id, nombre, email, activo')
    .eq('rol', 'admin')
    .order('nombre');

  if (error) return res.status(500).json({ success: false, error: error.message });

  if (!admins || admins.length === 0) {
    return res.status(200).json({ success: true, admins: [] });
  }

  const adminIds = admins.map(a => a.id);

  const { data: permisos } = await supabaseAdmin
    .from('permisos_admin')
    .select('*')
    .in('admin_id', adminIds);

  const permisosMap = {};
  (permisos || []).forEach(p => { permisosMap[p.admin_id] = p; });

  const result = admins.map(a => ({
    ...a,
    permisos: permisosMap[a.id] || {
      admin_id:                 a.id,
      puede_crear_usuarios:     false,
      puede_eliminar_usuarios:  false,
      puede_modificar_usuarios: false,
      puede_cambiar_password:   false,
      puede_activar_desactivar: false,
      puede_ver_historial:      false,
      puede_gestionar_permisos: false,
    },
  }));

  return res.status(200).json({ success: true, admins: result });
};
