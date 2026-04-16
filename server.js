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

// Rutas de usuarios y permisos de admin — delegadas a módulos separados
const usersCreate      = require('./api/users/create');
const usersDelete      = require('./api/users/delete');
const usersChangePwd   = require('./api/users/change-password');
const usersToggle      = require('./api/users/toggle-status');
const usersUpdateUser  = require('./api/users/update-user');
const adminPermisosList = require('./api/admin-permisos/list');
const adminPermisosSet  = require('./api/admin-permisos/set');

app.post('/api/users/create',          (req, res) => usersCreate(req, res));
app.post('/api/users/delete',          (req, res) => usersDelete(req, res));
app.post('/api/users/change-password', (req, res) => usersChangePwd(req, res));
app.post('/api/users/toggle-status',   (req, res) => usersToggle(req, res));
app.post('/api/users/update-user',     (req, res) => usersUpdateUser(req, res));
app.get('/api/admin-permisos/list',    (req, res) => adminPermisosList(req, res));
app.post('/api/admin-permisos/set',    (req, res) => adminPermisosSet(req, res));

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
