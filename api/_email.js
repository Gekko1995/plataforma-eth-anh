const RESEND_URL = 'https://api.resend.com/emails';

/**
 * Envía un correo usando la API de Resend.
 */
async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY no configurada — correo no enviado.');
    return { ok: false };
  }

  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error('[email] Error Resend:', err);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[email] Error de red:', err.message);
    return { ok: false };
  }
}

function bienvenidaHtml({ nombre, email, password, rol, grupo }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f6fb;padding:24px;">
    <div style="background:#1e2535;border-radius:12px;padding:20px 24px;display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <span style="background:linear-gradient(135deg,#f5c842,#fb923c);padding:6px 12px;border-radius:8px;font-weight:700;font-size:16px;color:#0f1117;">ETH</span>
      <span style="color:#e2e8f0;font-size:17px;font-weight:600;">ANH 2026</span>
    </div>

    <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <h2 style="color:#1e293b;margin:0 0 8px;">Bienvenido/a, ${nombre}</h2>
      <p style="color:#64748b;margin:0 0 24px;">Tu cuenta ha sido creada en la Plataforma ETH-ANH 2026. A continuación encontrarás tus credenciales de acceso.</p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 12px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Tus credenciales</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:14px;width:140px;">Correo</td><td style="padding:5px 0;color:#1e293b;font-size:14px;font-weight:600;">${email}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:14px;">Contraseña temporal</td><td style="padding:5px 0;"><code style="background:#f1f5f9;padding:3px 10px;border-radius:5px;font-family:monospace;font-size:14px;color:#1e293b;">${password}</code></td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:14px;">Rol</td><td style="padding:5px 0;color:#1e293b;font-size:14px;">${rol}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:14px;">Grupo</td><td style="padding:5px 0;color:#1e293b;font-size:14px;">${grupo}</td></tr>
        </table>
      </div>

      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
        <p style="margin:0;color:#92400e;font-size:14px;"><strong>Importante:</strong> Al ingresar por primera vez el sistema te pedirá cambiar tu contraseña.</p>
      </div>

      <p style="color:#64748b;font-size:13px;margin:0;">Si tienes problemas para acceder, comunícate con el administrador de la plataforma.</p>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">Fundación WR Tejido Social · SINAPSIS3D · ETH-ANH 2026</p>
  </div>`;
}

function cambioPasswordHtml({ nombre, email }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f6fb;padding:24px;">
    <div style="background:#1e2535;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
      <span style="background:linear-gradient(135deg,#f5c842,#fb923c);padding:6px 12px;border-radius:8px;font-weight:700;font-size:16px;color:#0f1117;">ETH</span>
      <span style="color:#e2e8f0;font-size:17px;font-weight:600;margin-left:10px;">ANH 2026</span>
    </div>

    <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <h2 style="color:#1e293b;margin:0 0 8px;">Cambio de contraseña</h2>
      <p style="color:#64748b;margin:0 0 20px;">Hola <strong>${nombre}</strong>, el administrador ha actualizado la contraseña de tu cuenta (<strong>${email}</strong>).</p>

      <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:14px 16px;">
        <p style="margin:0;color:#991b1b;font-size:14px;">Al ingresar con tu nueva contraseña, el sistema te pedirá establecer una contraseña personal.</p>
      </div>

      <p style="color:#64748b;font-size:13px;margin-top:20px;">Si no solicitaste este cambio, comunícate con el administrador.</p>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">Fundación WR Tejido Social · SINAPSIS3D · ETH-ANH 2026</p>
  </div>`;
}

module.exports = { sendEmail, bienvenidaHtml, cambioPasswordHtml };
