const { getSupabaseAdmin, verifyPermission } = require('../_auth');

const VALID_ROLES_ADMIN     = new Set(['admin', 'usuario', 'Gestor de Contenido']);
const VALID_ROLES_SUPERROOT = new Set(['super_root', 'admin', 'usuario', 'Gestor de Contenido']);
const VALID_GRUPOS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyPermission(req, supabaseAdmin, 'puede_modificar_usuarios');
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { userId, nombre, email, rol, grupo } = req.body || {};
  if (!userId) return res.status(400).json({ success: false, error: 'userId requerido.' });

  // Proteger cuentas super_root
  const { data: target } = await supabaseAdmin
    .from('profiles').select('rol').eq('id', userId).maybeSingle();

  if (target?.rol === 'super_root' && auth.rol !== 'super_root') {
    return res.status(403).json({ success: false, error: 'No puedes modificar una cuenta super root.' });
  }

  const patch = {};

  if (nombre !== undefined) {
    const n = nombre.trim();
    if (!n) return res.status(400).json({ success: false, error: 'El nombre no puede estar vacío.' });
    patch.nombre = n;
  }

  if (email !== undefined) {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return res.status(400).json({ success: false, error: 'El correo no es válido.' });
    }
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { email: e });
    if (authErr) return res.status(400).json({ success: false, error: authErr.message });
    patch.email = e;
  }

  if (rol !== undefined) {
    const validRoles = auth.rol === 'super_root' ? VALID_ROLES_SUPERROOT : VALID_ROLES_ADMIN;
    if (!validRoles.has(rol)) return res.status(400).json({ success: false, error: 'Rol inválido.' });
    patch.rol = rol;

    // Si cambia a admin, asegurar que exista registro en permisos_admin
    if (rol === 'admin') {
      await supabaseAdmin.from('permisos_admin').upsert(
        { admin_id: userId, updated_by: auth.requesterId },
        { onConflict: 'admin_id', ignoreDuplicates: true }
      );
    }
  }

  if (grupo !== undefined) {
    const g = grupo.trim().toUpperCase();
    if (g && !VALID_GRUPOS.has(g)) return res.status(400).json({ success: false, error: 'Grupo inválido.' });
    patch.grupo = g;
  }

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ success: false, error: 'No hay datos para actualizar.' });
  }

  const { error } = await supabaseAdmin.from('profiles').update(patch).eq('id', userId);
  if (error) return res.status(400).json({ success: false, error: error.message });

  return res.status(200).json({ success: true });
};
