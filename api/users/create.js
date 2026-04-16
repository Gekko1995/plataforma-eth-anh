const { getSupabaseAdmin, verifyPermission } = require('../_auth');
const { sendEmail, bienvenidaHtml } = require('../_email');

const VALID_ROLES_ADMIN     = new Set(['admin', 'usuario', 'Gestor de Contenido']);
const VALID_ROLES_SUPERROOT = new Set(['super_root', 'admin', 'usuario', 'Gestor de Contenido']);
const VALID_GRUPOS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(503).json({ success: false, error: 'Servidor no configurado.' });

  const auth = await verifyPermission(req, supabaseAdmin, 'puede_crear_usuarios');
  if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

  const { nombre, email, password, rol, grupo, enviarCorreo } = req.body || {};

  const n = typeof nombre === 'string' ? nombre.trim() : '';
  const e = typeof email  === 'string' ? email.trim()  : '';
  const g = typeof grupo  === 'string' ? grupo.trim().toUpperCase() : '';

  if (!n) return res.status(400).json({ success: false, error: 'El nombre es requerido.' });
  if (!e) return res.status(400).json({ success: false, error: 'El email es requerido.' });
  if (!password || password.length < 8) return res.status(400).json({ success: false, error: 'La contraseña debe tener mínimo 8 caracteres.' });
  if (g && !VALID_GRUPOS.has(g)) return res.status(400).json({ success: false, error: 'Grupo inválido.' });

  // admin no puede crear super_root
  const validRoles = auth.rol === 'super_root' ? VALID_ROLES_SUPERROOT : VALID_ROLES_ADMIN;
  if (!validRoles.has(rol)) return res.status(400).json({ success: false, error: 'Rol inválido.' });

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: e,
    password,
    email_confirm: true,
    user_metadata: { nombre: n, rol, grupo: g },
  });

  if (error) return res.status(400).json({ success: false, error: error.message });

  await supabaseAdmin.from('profiles').upsert({
    id:                    data.user.id,
    nombre:                n,
    email:                 e,
    rol,
    grupo:                 g,
    activo:                true,
    debe_cambiar_password: true,
  }, { onConflict: 'id' });

  // Si es admin, crear registro en permisos_admin con todo en false
  if (rol === 'admin') {
    await supabaseAdmin.from('permisos_admin').upsert({
      admin_id:   data.user.id,
      updated_by: auth.requesterId,
    }, { onConflict: 'admin_id' });
  }

  if (enviarCorreo === true) {
    await sendEmail({
      to:      e,
      subject: 'Bienvenido a la Plataforma ETH-ANH 2026 — Tus credenciales',
      html:    bienvenidaHtml({ nombre: n, email: e, password, rol, grupo: g }),
    });
  }

  return res.status(200).json({ success: true });
};
