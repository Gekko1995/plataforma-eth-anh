# 🔒 SEGURIDAD OBLIGATORIA - Plataforma ETH-ANH 2026

Esta guía documenta las medidas de seguridad **obligatorias** implementadas en el proyecto y cómo mantenerlas.

---

## 📋 Índice

1. [CORS (Cross-Origin Resource Sharing)](#1-cors)
2. [Security Headers](#2-security-headers)
3. [RLS (Row Level Security)](#3-rls)
4. [Configuración por Tipo de Servidor](#4-configuración-por-servidor)
5. [Checklist Pre-Deploy](#5-checklist-pre-deploy)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. CORS (Cross-Origin Resource Sharing)

### ✅ Reglas Implementadas

#### ❌ NUNCA Hagas Esto:
```javascript
// MAL - Wildcard en producción
Access-Control-Allow-Origin: *
```

#### ✅ Siempre Haz Esto:
```javascript
// BIEN - Whitelist explícita
const allowedOrigins = [
  'https://tu-dominio.com',
  'https://www.tu-dominio.com'
];
```

### Configuración Actual

**En el servidor Express (`server.js`):**
```javascript
const allowedOrigins = [
  'https://tu-dominio.com',
  'https://www.tu-dominio.com',
  'https://plataforma-eth-anh.com',
  
  // Solo en desarrollo
  ...(process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000']
    : []
  )
];
```

**Métodos permitidos:** `GET, POST, PUT, DELETE, OPTIONS`  
**Headers permitidos:** `Content-Type, Authorization, X-Requested-With`  
**Credentials:** `false` (no se usan cookies)

### 🔧 Cómo Modificar

1. Edita `server.js` línea 20-28
2. Edita `nginx.conf` línea 70-74
3. Edita `.htaccess` línea 30-32

**Reemplaza:**
```javascript
'https://tu-dominio.com'
```

**Por tus dominios reales:**
```javascript
'https://plataforma-eth-anh.sinapsis3d.com',
'https://convenio2026.fwrts.org'
```

---

## 2. Security Headers

### Headers Obligatorios Implementados

| Header | Valor | Propósito |
|--------|-------|-----------|
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` | Fuerza HTTPS por 1 año |
| **X-Content-Type-Options** | `nosniff` | Previene MIME-type sniffing |
| **X-Frame-Options** | `SAMEORIGIN` | Previene clickjacking (permite Looker) |
| **X-XSS-Protection** | `1; mode=block` | Protección XSS en navegadores antiguos |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Controla información de referrer |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Deshabilita APIs sensibles |
| **Content-Security-Policy** | Ver abajo | Controla fuentes de contenido |

### Content Security Policy (CSP)

**Configurado específicamente para Looker Studio:**

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lookerstudio.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  frame-src 'self' https://lookerstudio.google.com https://datastudio.google.com;
  connect-src 'self' https://script.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
```

### ⚠️ Importante sobre CSP

**`unsafe-inline` y `unsafe-eval` están permitidos SOLO para Looker Studio.**

Si en el futuro quieres una CSP más estricta:
1. Mueve los estilos inline a archivos CSS
2. Usa nonces para scripts inline
3. Evita `eval()` en el código

**Nunca elimines estas directivas sin verificar que Looker siga funcionando.**

### 🔧 Dónde Están Configurados

Los headers están configurados en **3 lugares** (usa el que corresponda a tu servidor):

1. **`public/index.html`** (meta tags) - Líneas 7-31
2. **`server.js`** (Express) - Líneas 50-140
3. **`nginx.conf`** (Nginx) - Líneas 39-58
4. **`.htaccess`** (Apache) - Líneas 12-25

---

## 3. RLS (Row Level Security)

### 📌 Estado Actual

**No aplica directamente** porque la aplicación:
- No tiene base de datos SQL propia
- Usa Google Sheets para datos
- Usa localStorage para logs

### 🔮 Para Futuras Integraciones

Si en el futuro integras una base de datos (PostgreSQL, Supabase, etc.), **DEBES** implementar RLS:

#### Políticas Obligatorias

```sql
-- 1. Activar RLS en TODAS las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- 2. Política de SELECT - Solo sus propios datos
CREATE POLICY select_own_data ON usuarios
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Política de INSERT - Solo crear sus propios registros
CREATE POLICY insert_own_data ON logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Política de UPDATE - Solo modificar sus propios datos
CREATE POLICY update_own_data ON usuarios
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Política de DELETE - Solo borrar sus propios datos
CREATE POLICY delete_own_data ON logs
  FOR DELETE
  USING (auth.uid() = user_id);
```

#### Verificación de RLS

```sql
-- Comprobar que RLS está activo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Ver políticas activas
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

#### ⛔ Nunca Hagas Esto

```sql
-- PELIGROSO - Deshabilitar RLS
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- PELIGROSO - Política que permite acceso a todo
CREATE POLICY allow_all ON usuarios FOR ALL USING (true);
```

---

## 4. Configuración por Servidor

### Opción A: Servidor Express (Recomendado)

**Ventajas:**
- ✅ Control total de headers
- ✅ CORS dinámico
- ✅ Rate limiting incluido
- ✅ Fácil de configurar

**Uso:**

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar React
npm run build

# 3. Iniciar servidor seguro
npm run prod

# O en desarrollo
npm run serve
```

**Archivos:**
- `server.js` - Configuración del servidor
- `package.json` - Scripts y dependencias

### Opción B: Nginx

**Ventajas:**
- ✅ Excelente performance
- ✅ Ideal para producción
- ✅ Maneja SSL/TLS eficientemente

**Instalación:**

```bash
# 1. Copiar configuración
sudo cp nginx.conf /etc/nginx/sites-available/plataforma-eth-anh

# 2. Crear symlink
sudo ln -s /etc/nginx/sites-available/plataforma-eth-anh /etc/nginx/sites-enabled/

# 3. Ajustar dominios en el archivo
sudo nano /etc/nginx/sites-available/plataforma-eth-anh
# Reemplazar "tu-dominio.com" por tu dominio real

# 4. Obtener certificado SSL (Let's Encrypt)
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# 5. Probar configuración
sudo nginx -t

# 6. Recargar Nginx
sudo systemctl reload nginx
```

**Archivo:**
- `nginx.conf` - Configuración completa

### Opción C: Apache

**Ventajas:**
- ✅ Ampliamente soportado
- ✅ .htaccess portable

**Instalación:**

```bash
# 1. Habilitar módulos necesarios
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod ssl

# 2. Copiar .htaccess al directorio build
cp .htaccess build/.htaccess

# 3. Ajustar dominios
nano build/.htaccess
# Reemplazar "tu-dominio.com" por tu dominio real

# 4. Configurar VirtualHost con SSL
sudo nano /etc/apache2/sites-available/plataforma-eth-anh-ssl.conf

# 5. Habilitar sitio
sudo a2ensite plataforma-eth-anh-ssl

# 6. Recargar Apache
sudo systemctl reload apache2
```

**Archivo:**
- `.htaccess` - Configuración completa

---

## 5. Checklist Pre-Deploy

Antes de desplegar a producción, **verifica** estos puntos:

### CORS
- [ ] Whitelist de dominios actualizada (sin localhost)
- [ ] Variable `NODE_ENV=production` configurada
- [ ] Credentials en `false` (o `true` solo si usas sesiones)
- [ ] Métodos permitidos solo los necesarios

### Security Headers
- [ ] HSTS configurado con `max-age=31536000`
- [ ] CSP permite Looker Studio pero nada más
- [ ] X-Frame-Options en `SAMEORIGIN` (para Looker)
- [ ] Todos los headers presentes en respuestas

### SSL/TLS
- [ ] Certificado SSL válido instalado
- [ ] Fuerza HTTPS (redirige HTTP → HTTPS)
- [ ] Protocolo mínimo TLS 1.2
- [ ] HSTS preload registrado en [hstspreload.org](https://hstspreload.org)

### Archivos Sensibles
- [ ] `.env` en `.gitignore`
- [ ] No hay API keys en el código fuente
- [ ] `APPS_SCRIPT_URL` configurado correctamente
- [ ] Backups de configuraciones sensibles

### Testing
- [ ] Probar CORS desde dominio permitido
- [ ] Probar CORS desde dominio NO permitido (debe fallar)
- [ ] Verificar headers con: [securityheaders.com](https://securityheaders.com)
- [ ] Probar Looker Studio embebido funciona
- [ ] Verificar SSL con: [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

## 6. Troubleshooting

### Problema: Looker Studio no carga

**Síntoma:** Iframe de Looker en blanco o error de CSP

**Solución:**
1. Verifica que CSP incluya:
   ```
   frame-src 'self' https://lookerstudio.google.com https://datastudio.google.com;
   script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lookerstudio.google.com;
   ```

2. Verifica X-Frame-Options:
   ```
   X-Frame-Options: SAMEORIGIN
   ```
   (NO uses `DENY`)

### Problema: Error CORS en fetch

**Síntoma:** Error en consola: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solución:**
1. Verifica que el origen está en la whitelist
2. Verifica que el servidor está enviando los headers CORS
3. En desarrollo, asegúrate de incluir `http://localhost:3000`

**Debug:**
```javascript
// Ver headers en la respuesta
fetch('https://api.ejemplo.com/data')
  .then(res => {
    console.log('CORS Origin:', res.headers.get('Access-Control-Allow-Origin'));
    return res.json();
  });
```

### Problema: Mixed Content Warning

**Síntoma:** "Mixed Content: The page was loaded over HTTPS, but requested an insecure resource"

**Solución:**
1. Todas las URLs deben usar HTTPS en producción
2. Verifica que `APPS_SCRIPT_URL` usa HTTPS
3. CSP incluye `upgrade-insecure-requests`

### Problema: Headers no se aplican

**Síntoma:** Al verificar en securityheaders.com faltan headers

**Solución según servidor:**

**Express:**
```bash
# Verifica que helmet está instalado
npm list helmet

# Reinicia el servidor
npm run prod
```

**Nginx:**
```bash
# Verifica sintaxis
sudo nginx -t

# Recarga configuración
sudo systemctl reload nginx
```

**Apache:**
```bash
# Verifica módulos
sudo a2enmod headers
sudo systemctl reload apache2
```

### Problema: Rate Limiting muy estricto

**Síntoma:** "Too many requests" en uso normal

**Solución en `server.js`:**
```javascript
// Aumentar límite (línea 160)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Aumentar de 100 a 200
});
```

---

## 🚨 Reglas de Oro

### NUNCA:
1. ❌ Usar `Access-Control-Allow-Origin: *` en producción
2. ❌ Deshabilitar HSTS después de activarlo
3. ❌ Usar `X-Frame-Options: DENY` (rompe Looker)
4. ❌ Eliminar `upgrade-insecure-requests` de CSP
5. ❌ Exponer archivos `.env` o claves API
6. ❌ Desactivar RLS en tablas con datos de usuarios

### SIEMPRE:
1. ✅ Whitelist explícita de dominios en CORS
2. ✅ Todos los security headers en cada respuesta
3. ✅ HTTPS en producción con certificado válido
4. ✅ CSP específico para lo que necesitas
5. ✅ Rate limiting activo
6. ✅ RLS activo en todas las tablas (cuando uses BD)

---

## 📞 Soporte

**Si necesitas relajar alguna regla de seguridad:**

1. **PARA** - No lo hagas directamente
2. Documenta **por qué** es necesario
3. Evalúa **alternativas** más seguras
4. Implementa **mitigaciones** adicionales
5. Solicita **revisión** del equipo de seguridad

**Ejemplo de justificación aceptable:**
```
Necesito permitir 'unsafe-eval' en CSP porque Looker Studio lo requiere
para renderizar gráficas dinámicas. He verificado que:
- Solo aplica a scripts de lookerstudio.google.com
- No hay alternativa sin romper funcionalidad core
- El riesgo es aceptable dado el aislamiento del iframe
```

---

## 🔗 Recursos Adicionales

- [OWASP Cheat Sheet - CORS](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [MDN - CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [HSTS Preload](https://hstspreload.org/)

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Mantenido por:** SINAPSIS3D S.A.S.
