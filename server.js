/**
 * SERVIDOR EXPRESS CON SEGURIDAD OBLIGATORIA
 * Plataforma ETH-ANH 2026
 * 
 * Este servidor implementa:
 * - CORS con whitelist de dominios
 * - Security Headers obligatorios
 * - Helmet.js para protección adicional
 * - Compresión gzip
 * - Rate limiting
 */

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;
const supabaseOrigin = (() => {
  if (!SUPABASE_URL) return null;
  try {
    return new URL(SUPABASE_URL).origin;
  } catch {
    return null;
  }
})();

// Trust reverse proxy (nginx, load balancer) — needed for correct IP in rate limiting
app.set('trust proxy', 1);

// ================================================================
// 1. CONFIGURACIÓN DE CORS CON WHITELIST
// ================================================================

// Read allowed origins from environment variable (comma-separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];

// In development, also allow localhost origins
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
} else if (allowedOrigins.length === 0) {
  console.warn('[CORS] ADVERTENCIA: La variable ALLOWED_ORIGINS no está configurada. Todas las peticiones cross-origin serán bloqueadas. Define ALLOWED_ORIGINS en tu .env.');
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Vary: Origin tells caches that the response depends on the request origin
  res.setHeader('Vary', 'Origin');

  // Solo permite métodos necesarios
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Solo permite headers necesarios
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Credentials deshabilitadas (cookies/sesiones no requeridas)
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  // Maneja preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
    return res.sendStatus(204);
  }

  next();
});

// ================================================================
// 2. SECURITY HEADERS CON HELMET
// ================================================================

app.use(helmet({
  // Strict-Transport-Security
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://lookerstudio.google.com",
        "https://datastudio.google.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      frameSrc: [
        "'self'",
        "https://lookerstudio.google.com",
        "https://datastudio.google.com"
      ],
      connectSrc: [
        "'self'",
        "https://lookerstudio.google.com",
        ...(supabaseOrigin ? [supabaseOrigin] : [])
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  
  // X-Frame-Options
  frameguard: {
    action: 'sameorigin' // SAMEORIGIN para permitir Looker Studio embed
  },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // X-XSS-Protection
  xssFilter: true,
  
  // Referrer-Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Permissions-Policy header adicional
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  next();
});

// ================================================================
// 3. COMPRESIÓN Y RATE LIMITING
// ================================================================

// Compresión gzip
app.use(compression());

// Rate limiting: máximo 100 requests por 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de requests
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ================================================================
// 4. BODY PARSER Y ENDPOINT DE AUTENTICACIÓN
// ================================================================

// Parse JSON bodies for the auth endpoint — strict size limit to prevent payload attacks
// Note: if other endpoints need larger payloads, apply express.json selectively to those routes
app.use(express.json({ limit: '16kb', strict: true }));

const VALID_ROLES = new Set(['admin', 'usuario']);
const VALID_GROUPS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

app.post('/api/users/create', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase Admin no está configurado en el servidor.' });
  }

  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!accessToken) {
    return res.status(401).json({ success: false, error: 'Token de sesión requerido.' });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData?.user?.id) {
    return res.status(401).json({ success: false, error: 'Sesión inválida.' });
  }

  const { data: requesterProfile, error: requesterError } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (requesterError || requesterProfile?.rol !== 'admin') {
    return res.status(403).json({ success: false, error: 'Solo los administradores pueden crear usuarios.' });
  }

  const { nombre, email, password, rol, grupo } = req.body || {};
  const normalizedRole = typeof rol === 'string' ? rol.trim().toLowerCase() : '';
  const normalizedGroup = typeof grupo === 'string' ? grupo.trim().toUpperCase() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const normalizedNombre = typeof nombre === 'string' ? nombre.trim() : '';

  if (
    !normalizedNombre ||
    !normalizedEmail ||
    typeof password !== 'string' ||
    password.length < 8 ||
    !VALID_ROLES.has(normalizedRole) ||
    !VALID_GROUPS.has(normalizedGroup)
  ) {
    return res.status(400).json({ success: false, error: 'Datos inválidos para crear el usuario.' });
  }

  const { data: createdData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      nombre: normalizedNombre,
      rol: normalizedRole,
      grupo: normalizedGroup,
    },
  });

  if (createError || !createdData?.user?.id) {
    return res.status(400).json({ success: false, error: createError?.message || 'No se pudo crear el usuario.' });
  }

  const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: createdData.user.id,
      nombre: normalizedNombre,
      email: normalizedEmail,
      rol: normalizedRole,
      grupo: normalizedGroup,
    },
    { onConflict: 'id' }
  );

  if (upsertProfileError) {
    return res.status(500).json({ success: false, error: 'Usuario creado, pero falló la sincronización del perfil.' });
  }

  return res.status(201).json({ success: true, user: { id: createdData.user.id, email: normalizedEmail } });
});

// ================================================================
// 6. SERVIR ARCHIVOS ESTÁTICOS DE REACT
// ================================================================

// Servir archivos estáticos con cache control
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // No cachear el index.html
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// ================================================================
// 7. RUTA CATCH-ALL PARA REACT ROUTER
// ================================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ================================================================
// 8. MANEJO DE ERRORES
// ================================================================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Algo salió mal!');
});

// ================================================================
// 9. INICIAR SERVIDOR
// ================================================================

app.listen(PORT, () => {
  console.log(`
  ========================================
  🚀 Servidor seguro iniciado
  ========================================
  Entorno: ${process.env.NODE_ENV || 'development'}
  Puerto: ${PORT}
  URL: http://localhost:${PORT}
  
  ✅ CORS configurado con whitelist
  ✅ Security Headers activos
  ✅ Rate Limiting: 100 req/15min
  ✅ Compresión gzip activa
  ========================================
  `);
});

module.exports = app;
