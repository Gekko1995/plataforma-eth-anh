# Plataforma ETH-ANH 2026 🚀

Plataforma de Gestión Integrada para el Convenio ETH-ANH 2026
Desarrollado por **SINAPSIS3D S.A.S.** para Fundación WR Tejido Social

## ✨ Características

- ✅ **39 Módulos** organizados en 9 grupos temáticos
- ✅ **Diseño Responsive** (móvil, tablet, desktop)
- ✅ **Arquitectura modular** con componentes reutilizables
- ✅ **Autenticación real** con Supabase Auth
- ✅ **Dashboard interactivo** con KPIs y métricas
- ✅ **Registro de accesos** con localStorage
- ✅ **Integración Looker Studio** para visualización de datos
- 🔒 **Seguridad obligatoria** implementada (CORS, Headers, CSP)

## 🏗️ Estructura del Proyecto

```
plataforma-eth-anh/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Login.jsx       # Pantalla de inicio de sesión
│   │   ├── NavItem.jsx     # Botón de navegación
│   │   ├── Gauge.jsx       # Medidor tipo gauge
│   │   ├── MiniBarChart.jsx # Gráfica de barras
│   │   └── KPICard.jsx     # Tarjeta de KPI
│   ├── data/
│   │   └── constants.js    # Usuarios, grupos y módulos
│   ├── styles/
│   │   ├── globalStyles.js # Estilos globales responsive
│   │   └── breakpoints.js  # Breakpoints y media queries
│   ├── utils/
│   │   └── auth.js         # Funciones de autenticación
│   ├── App.jsx             # Componente principal
│   └── index.js            # Punto de entrada
└── package.json
```

## 🔒 Seguridad

Este proyecto implementa **medidas de seguridad obligatorias**:

- ✅ **CORS** con whitelist de dominios (sin wildcard)
- ✅ **Security Headers** (HSTS, CSP, X-Frame-Options, etc.)
- ✅ **Content Security Policy** específica para Looker Studio
- ✅ **Rate Limiting** para prevenir abuso
- ✅ **HTTPS forzado** con certificados válidos

**📖 Documentación completa:** Ver [`SECURITY.md`](SECURITY.md)

⚠️ **IMPORTANTE:** Antes de desplegar a producción, lee y aplica todas las medidas en `SECURITY.md`

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Compilación

```bash
npm run build
```

Genera una versión optimizada para producción en la carpeta `build/`

### Deployment Seguro

```bash
# Ejecutar script de deployment con verificaciones de seguridad
./deploy.sh

# Opción 1: Servidor Express (recomendado)
npm run prod

# Opción 2: Usar tu propio servidor web
# Ver SECURITY.md para configuraciones de Nginx/Apache
```

**⚠️ Antes del primer deploy:** 
1. Lee [`SECURITY.md`](SECURITY.md) completamente
2. Actualiza dominios en CORS (`server.js`, `nginx.conf`, `.htaccess`)
3. Configura certificado SSL/TLS
4. Ejecuta `./deploy.sh` para verificar configuración

## 📱 Responsive Design

La plataforma se adapta automáticamente a diferentes tamaños de pantalla:

- **Móvil** (< 768px): Sidebar colapsable con hamburger menu, grids en columna única
- **Tablet** (768px - 1024px): Grids de 2 columnas, sidebar fijo
- **Desktop** (> 1024px): Experiencia completa con sidebar expandido

## 🔐 Autenticación

La autenticación se maneja con **Supabase Auth**:

1. Define en `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo backend/admin)
2. Ejecuta el script SQL de `supabase/profiles.sql` para crear tabla `profiles`, trigger y políticas RLS.
3. Inicia sesión con usuarios reales creados en Supabase.

## 🎨 Personalización

### Cambiar Módulos

Edita `src/data/constants.js` → array `GROUPS`:

```javascript
{
  id: "A",
  name: "Nombre del Grupo",
  color: "#1B6B4A",  // Color del grupo
  icon: "A",         // Icono/letra
  modules: [
    {
      id: 1,
      name: "Nombre del Módulo",
      desc: "Descripción breve",
      stack: "Sheets+Forms",  // Tecnologías usadas
      status: "nuevo",        // nuevo | adaptar | reutilizar
      url: "https://..."      // URL del módulo
    }
  ]
}
```

### Cambiar Colores/Estilos

- **Estilos globales**: `src/styles/globalStyles.js`
- **Breakpoints**: `src/styles/breakpoints.js`
- **Colores de estado**: `src/data/constants.js` → `STATUS_STYLES`

### Cambiar Logo y Nombre

Busca "S3D" y "ETH-ANH 2026" en:
- `src/components/Login.jsx`
- `src/App.jsx`

## 📊 Integración Looker Studio

1. Crea tu reporte en Looker Studio
2. Obtén el enlace de embed
3. Edita `src/App.jsx`
4. Busca el iframe y reemplaza la URL:

```javascript
<iframe src="TU_URL_DE_LOOKER_AQUI" ... />
```

## 🛠️ Próximas Mejoras Sugeridas

- [ ] Implementar lazy loading para iframe
- [ ] Agregar React.memo para optimizar re-renders
- [ ] Implementar dark mode
- [ ] Agregar atajos de teclado
- [ ] Implementar notificaciones toast
- [ ] Agregar tests unitarios
- [ ] Implementar breadcrumbs de navegación
- [ ] Agregar modo offline con Service Workers

## 📦 Tecnologías Utilizadas

- **React** 18.2.0
- **React Scripts** 5.0.1
- **Supabase JS** (autenticación y gestión de usuarios)
- **Google Fonts**: Bricolage Grotesque, IBM Plex Mono
- **Google Looker Studio** (integración)
- **LocalStorage** (persistencia)

## 🤝 Soporte

Para preguntas o soporte técnico, contacta a:
- **SINAPSIS3D S.A.S.**
- Email: admin@sinapsis3d.com

## 📄 Licencia

Propiedad de Fundación WR Tejido Social - Convenio ETH-ANH 2026

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Desarrollado por**: SINAPSIS3D S.A.S.
