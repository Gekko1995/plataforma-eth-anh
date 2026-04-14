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

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================================
// 1. CONFIGURACIÓN DE CORS CON WHITELIST
// ================================================================

const allowedOrigins = [
  // PRODUCCIÓN - Reemplaza con tus dominios reales
  'https://tu-dominio.com',
  'https://www.tu-dominio.com',
  'https://plataforma-eth-anh.com',
  
  // DESARROLLO - Solo en modo desarrollo
  ...(process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
    : []
  )
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Solo permite métodos necesarios
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Solo permite headers necesarios
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Permite credentials solo si es necesario (cookies/sesiones)
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
        "'unsafe-eval'",
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
        "https://script.google.com",
        "https://lookerstudio.google.com"
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
// 4. SERVIR ARCHIVOS ESTÁTICOS DE REACT
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
// 5. RUTA CATCH-ALL PARA REACT ROUTER
// ================================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ================================================================
// 6. MANEJO DE ERRORES
// ================================================================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Algo salió mal!');
});

// ================================================================
// 7. INICIAR SERVIDOR
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
