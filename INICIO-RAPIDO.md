# 🚀 INICIO RÁPIDO - Deployment Seguro

## ⚡ Para Empezar en 5 Minutos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Elegir Tu Opción de Deployment

#### 🟢 OPCIÓN A: Servidor Express (MÁS FÁCIL)

```bash
# 1. Editar dominios permitidos
nano server.js
# Busca línea 20-28 y reemplaza 'tu-dominio.com' con tus dominios reales

# 2. Build + Iniciar
npm run prod
```

**✅ Listo!** El servidor estará en `http://localhost:3000` con todos los headers de seguridad.

---

#### 🟡 OPCIÓN B: Nginx (MÁS RÁPIDO EN PRODUCCIÓN)

```bash
# 1. Editar dominios
nano nginx.conf
# Reemplaza 'tu-dominio.com' con tu dominio real

# 2. Build React
npm run build

# 3. Copiar archivos
sudo cp -r build/* /var/www/plataforma-eth-anh/
sudo cp nginx.conf /etc/nginx/sites-available/plataforma-eth-anh
sudo ln -s /etc/nginx/sites-available/plataforma-eth-anh /etc/nginx/sites-enabled/

# 4. Configurar SSL (Let's Encrypt)
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# 5. Activar
sudo nginx -t
sudo systemctl reload nginx
```

**✅ Listo!** Tu sitio estará en `https://tu-dominio.com` con SSL y headers de seguridad.

---

#### 🟠 OPCIÓN C: Apache (MÁS COMPATIBLE)

```bash
# 1. Editar dominios
nano .htaccess
# Reemplaza 'tu-dominio.com' con tu dominio real

# 2. Build React
npm run build

# 3. Copiar archivos
sudo cp -r build/* /var/www/html/plataforma-eth-anh/
# El .htaccess ya está en build/

# 4. Habilitar módulos
sudo a2enmod rewrite headers deflate ssl

# 5. Activar
sudo systemctl reload apache2
```

**✅ Listo!** Tu sitio estará en `https://tu-dominio.com`.

---

## ⚠️ IMPORTANTE: Antes de Deploy

### 1. Actualizar Dominios (OBLIGATORIO)

Reemplaza `'tu-dominio.com'` en estos archivos:

| Archivo | Líneas | Ejemplo |
|---------|--------|---------|
| `server.js` | 20-28 | `'https://plataforma-eth.com'` |
| `nginx.conf` | 5, 14, 70-74 | `server_name plataforma-eth.com` |
| `.htaccess` | 30-32 | `https://plataforma-eth.com` |

### 2. Configurar Variables de Entorno (Opcional)

```bash
# Copiar template
cp .env.example .env

# Editar con tus valores
nano .env
```

**Mínimo necesario:**
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

### 3. Verificar con el Script

```bash
chmod +x deploy.sh
./deploy.sh
```

Este script verificará:
- ✅ Archivos de configuración
- ✅ Dominios actualizados
- ✅ Build exitoso
- ✅ Headers configurados

---

## 🧪 Testing Rápido

### Probar Headers

```bash
curl -I https://tu-dominio.com
```

**Debes ver:**
```
strict-transport-security: max-age=31536000
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
content-security-policy: default-src 'self'...
```

### Probar CORS

```javascript
// En consola del navegador DESDE tu dominio permitido
fetch('https://tu-dominio.com')
  .then(r => console.log('✅ CORS OK'))
  .catch(e => console.log('❌ CORS ERROR', e))
```

### Probar Looker Studio

1. Abre la aplicación
2. Verifica que el iframe de Looker carga
3. Si no carga, revisa CSP en DevTools → Console

---

## 🆘 Solución Rápida de Problemas

### Looker Studio no carga

**Síntoma:** Iframe en blanco

**Solución:**
1. Verifica que `X-Frame-Options` sea `SAMEORIGIN` (NO `DENY`)
2. Verifica que CSP incluya:
   ```
   frame-src 'self' https://lookerstudio.google.com
   ```

### Error CORS

**Síntoma:** "No 'Access-Control-Allow-Origin' header"

**Solución:**
1. Verifica que el dominio está en la whitelist
2. Si es desarrollo, incluye `http://localhost:3000`
3. Reinicia el servidor

### Headers no aparecen

**Express:**
```bash
npm list helmet  # Verificar que está instalado
npm run prod     # Reiniciar servidor
```

**Nginx:**
```bash
sudo nginx -t          # Verificar sintaxis
sudo systemctl reload nginx
```

**Apache:**
```bash
sudo a2enmod headers   # Habilitar módulo
sudo systemctl reload apache2
```

---

## 📚 Más Información

| Documento | Para Qué |
|-----------|----------|
| **SECURITY.md** | Guía completa de seguridad (léelo!) |
| **SECURITY-SUMMARY.md** | Resumen ejecutivo técnico |
| **README.md** | Información general del proyecto |
| **CUSTOMIZATION.md** | Personalizar la plataforma |
| **TESTING.md** | Probar responsive |

---

## 🎯 Checklist Final

Antes de considerar el deployment completo:

- [ ] Dominios actualizados en todos los archivos
- [ ] Certificado SSL instalado
- [ ] `./deploy.sh` ejecutado sin errores
- [ ] Headers verificados con `curl -I`
- [ ] CORS probado
- [ ] Looker Studio cargando
- [ ] Probado en https://securityheaders.com
- [ ] Probado en https://www.ssllabs.com/ssltest/

---

## 🎉 ¡Listo!

Si completaste los pasos:

1. ✅ Instalaste dependencias
2. ✅ Elegiste opción de deployment
3. ✅ Actualizaste dominios
4. ✅ Configuraste SSL
5. ✅ Verificaste funcionamiento

**Tu plataforma está SEGURA y LISTA para producción! 🔒🚀**

---

**Soporte:** Ver `SECURITY.md` sección 6 (Troubleshooting)  
**Desarrollado por:** SINAPSIS3D S.A.S.  
**Versión:** 1.0.0
