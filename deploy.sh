#!/bin/bash

# ============================================================
# SCRIPT DE DEPLOYMENT SEGURO
# Plataforma ETH-ANH 2026
# ============================================================

set -e  # Detener si hay error

echo "============================================"
echo "🚀 DEPLOYMENT SEGURO - Plataforma ETH-ANH"
echo "============================================"
echo ""

# ============================================================
# 1. VERIFICACIONES PRE-DEPLOY
# ============================================================

echo "📋 Verificando configuración de seguridad..."

# Verificar que NODE_ENV está en producción
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  WARNING: NODE_ENV no está en 'production'"
    echo "   Configurando NODE_ENV=production"
    export NODE_ENV=production
fi

# Verificar que existen archivos de configuración
if [ ! -f "server.js" ]; then
    echo "❌ ERROR: server.js no encontrado"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"

# ============================================================
# 2. CHECKLIST DE SEGURIDAD
# ============================================================

echo ""
echo "🔒 Checklist de Seguridad:"
echo ""

# Verificar whitelist de CORS
echo "🔍 Verificando CORS whitelist en server.js..."
if grep -q "localhost" server.js && [ "$NODE_ENV" = "production" ]; then
    echo "⚠️  WARNING: 'localhost' encontrado en allowedOrigins"
    echo "   Asegúrate de que está dentro del bloque development"
fi

# Verificar dominios de ejemplo
if grep -q "tu-dominio.com" server.js; then
    echo "⚠️  WARNING: 'tu-dominio.com' encontrado en server.js"
    echo "   Reemplaza con tus dominios reales antes de deploy"
    read -p "   ¿Continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar que no hay claves API expuestas
echo "🔍 Verificando que no hay claves API expuestas..."
if grep -r "AIza" src/ 2>/dev/null; then
    echo "⚠️  WARNING: Posible API key de Google encontrada"
fi

echo "✅ Verificaciones completadas"

# ============================================================
# 3. INSTALACIÓN DE DEPENDENCIAS
# ============================================================

echo ""
echo "📦 Instalando dependencias..."
npm ci --only=production

echo "✅ Dependencias instaladas"

# ============================================================
# 4. BUILD DE PRODUCCIÓN
# ============================================================

echo ""
echo "🏗️  Compilando aplicación React..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ ERROR: Carpeta build no fue creada"
    exit 1
fi

echo "✅ Build completado"

# ============================================================
# 5. VERIFICAR HEADERS DE SEGURIDAD
# ============================================================

echo ""
echo "🔐 Configurando headers de seguridad..."

# Verificar que index.html tiene meta tags de seguridad
if ! grep -q "Content-Security-Policy" public/index.html; then
    echo "⚠️  WARNING: CSP no encontrado en index.html"
fi

if ! grep -q "X-Frame-Options" public/index.html; then
    echo "⚠️  WARNING: X-Frame-Options no encontrado en index.html"
fi

echo "✅ Headers configurados"

# ============================================================
# 6. COPIAR .htaccess SI ES NECESARIO
# ============================================================

if [ -f ".htaccess" ]; then
    echo ""
    echo "📄 Copiando .htaccess a build/..."
    cp .htaccess build/.htaccess
    echo "✅ .htaccess copiado"
fi

# ============================================================
# 7. INFORME FINAL
# ============================================================

echo ""
echo "============================================"
echo "✅ DEPLOYMENT PREPARADO"
echo "============================================"
echo ""
echo "📂 Archivos generados en: ./build/"
echo ""
echo "📋 Próximos pasos según tu servidor:"
echo ""
echo "  OPCIÓN A - Servidor Express:"
echo "    npm run prod"
echo ""
echo "  OPCIÓN B - Nginx:"
echo "    1. Copiar archivos: sudo cp -r build/* /var/www/plataforma-eth-anh/"
echo "    2. Copiar config: sudo cp nginx.conf /etc/nginx/sites-available/"
echo "    3. Crear symlink: sudo ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/"
echo "    4. Probar: sudo nginx -t"
echo "    5. Recargar: sudo systemctl reload nginx"
echo ""
echo "  OPCIÓN C - Apache:"
echo "    1. Copiar archivos: sudo cp -r build/* /var/www/html/plataforma-eth-anh/"
echo "    2. .htaccess ya está incluido en build/"
echo "    3. Habilitar mod_rewrite: sudo a2enmod rewrite"
echo "    4. Recargar: sudo systemctl reload apache2"
echo ""
echo "⚠️  RECORDATORIOS IMPORTANTES:"
echo "  - Actualiza dominios en CORS (server.js, nginx.conf, .htaccess)"
echo "  - Configura certificado SSL/TLS"
echo "  - Verifica headers en: https://securityheaders.com"
echo "  - Prueba SSL en: https://www.ssllabs.com/ssltest/"
echo ""
echo "============================================"
