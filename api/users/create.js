const { getSupabaseAdmin, verifyAdmin } = require('../_auth');

const VALID_ROLES  = new Set(['admin', 'usuario', 'Gestor de Contenido']);
const VALID_GROUPS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyAdmin(req, supabaseAdmin);
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { nombre, email, rol, grupo } = req.body || {};
  const normalizedEmail  = typeof email  === 'string' ? email.trim().toLowerCase()  : '';
  const normalizedNombre = typeof nombre === 'string' ? nombre.trim()                : '';
  const normalizedRol    = typeof rol    === 'string' ? rol.trim()                   : '';
  const normalizedGrupo  = typeof grupo  === 'string' ? grupo.trim().toUpperCase()   : '';

  if (
    !normalizedNombre ||
    !normalizedEmail  ||
    !VALID_ROLES.has(normalizedRol)   ||
    !VALID_GROUPS.has(normalizedGrupo)
  ) {
    return res.status(400).json({ success: false, error: 'Datos inválidos. Verifica nombre, email, rol y grupo.' });
  }

  // Invitar usuario — Supabase envía email para que el usuario cree su contraseña
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
    data: { nombre: normalizedNombre, rol: normalizedRol, grupo: normalizedGrupo },
  });

  if (error) return res.status(400).json({ success: false, error: error.message });

  // Crear perfil manualmente (el trigger puede tardar)
  await supabaseAdmin.from('profiles').upsert({
    id:     data.user.id,
    nombre: normalizedNombre,
    email:  normalizedEmail,
    rol:    normalizedRol,
    grupo:  normalizedGrupo,
    activo: true,
  }, { onConflict: 'id' });

  return res.status(201).json({ success: true });
};
