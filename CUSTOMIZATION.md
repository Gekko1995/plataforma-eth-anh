# 🎨 Guía de Personalización

Esta guía te ayudará a personalizar la plataforma según tus necesidades.

## 📝 Cambiar Módulos y Grupos

### Archivo: `src/data/constants.js`

#### 1. Agregar un nuevo grupo

```javascript
{
  id: "J",                    // ID único (A-Z)
  name: "Nuevo Grupo",        // Nombre descriptivo
  color: "#EC4899",          // Color hex del grupo
  icon: "J",                 // Ícono (letra o emoji)
  modules: []                // Array de módulos
}
```

#### 2. Agregar un módulo a un grupo existente

```javascript
{
  id: 40,                              // ID único (numérico)
  name: "Nombre del Módulo",           // Título del módulo
  desc: "Descripción breve",           // Descripción corta
  stack: "Sheets+Forms+Looker",        // Tecnologías (separadas por +)
  status: "nuevo",                     // nuevo | adaptar | reutilizar
  url: "https://..."                   // URL del módulo
}
```

#### 3. Cambiar estado de un módulo

Estados disponibles:
- `"nuevo"` - Azul - Módulos por construir
- `"adaptar"` - Amarillo - Módulos que requieren adaptación
- `"reutilizar"` - Verde - Módulos listos para usar

#### 4. Eliminar un módulo

Simplemente borra el objeto completo del módulo del array.

---

## 👤 Gestión de Usuarios

### Archivo: `src/data/constants.js`

#### Agregar usuario de prueba

```javascript
export const LOCAL_USERS = [
  // ... usuarios existentes
  {
    email: "nuevo@correo.com",
    password: "contraseña123",
    rol: "tipo_rol",
    nombre: "Nombre Completo"
  }
];
```

#### Conectar con Google Sheets

1. Crea un Google Sheet con columnas: `email`, `password`, `nombre`, `rol`
2. Crea un Google Apps Script que exponga endpoint de login
3. Pega la URL en `APPS_SCRIPT_URL`:

```javascript
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/ABC123.../exec";
```

---

## 🎨 Personalizar Colores

### Colores de Grupos

Cada grupo tiene su color. Cambiar en `src/data/constants.js`:

```javascript
{
  id: "A",
  color: "#1B6B4A",  // ← Cambiar este valor hex
  // ...
}
```

### Colores de Estados

En `src/data/constants.js`, modifica `STATUS_STYLES`:

```javascript
export const STATUS_STYLES = {
  nuevo: {
    l: "Nuevo",
    bg: "#EFF6FF",    // Fondo del badge
    c: "#1E40AF",     // Color del texto
    d: "#3B82F6"      // Color del punto
  }
  // ...
};
```

### Color Principal de la Plataforma

Busca y reemplaza estos colores en los archivos:

**Primario** (azul/morado):
- `#4F6EF7` - Azul principal
- `#7C3AED` - Morado acento
- `linear-gradient(135deg,#4F6EF7,#7C3AED)` - Gradiente

**Archivos a modificar:**
- `src/components/Login.jsx`
- `src/components/NavItem.jsx`
- `src/App.jsx`

---

## 🏷️ Cambiar Logo y Branding

### Logo S3D

**Archivo**: `src/components/Login.jsx` y `src/App.jsx`

Busca:
```javascript
<div style={{...}}>S3D</div>
```

Opciones:
1. **Cambiar texto**: Reemplaza "S3D" por tu texto
2. **Usar imagen**: 
```javascript
<img src="/logo.png" alt="Logo" style={{width: 38, height: 38}} />
```

### Nombre de la Plataforma

Busca y reemplaza:
- **"Plataforma ETH-ANH"** → Tu nombre
- **"ETH-ANH 2026"** → Tu proyecto
- **"Gestion Integrada"** → Tu subtítulo

**Archivos:**
- `src/components/Login.jsx`
- `src/App.jsx`
- `public/index.html`

### Favicon

Reemplaza el data URI en `public/index.html`:

```html
<link rel="icon" href="/favicon.ico">
```

O usa un archivo:
1. Coloca `favicon.ico` en la carpeta `public/`
2. Actualiza la referencia en `index.html`

---

## 📊 Personalizar KPIs del Dashboard

### Archivo: `src/App.jsx`

Busca el array de KPIs:

```javascript
{[
  {
    label: "Modulos totales",      // ← Cambiar etiqueta
    value: total,                   // ← Cambiar valor
    color: "#4F6EF7",              // ← Cambiar color
    delta: "+2 este mes"           // ← Cambiar descripción
  },
  // ... más KPIs
]}
```

#### Agregar un KPI personalizado:

```javascript
{
  label: "Mi Métrica",
  value: "100",                    // Puede ser número o string
  color: "#10B981",
  delta: "Descripción adicional"
}
```

---

## 📈 Cambiar Iframe de Looker Studio

### Archivo: `src/App.jsx`

Busca:
```javascript
<iframe
  src="https://lookerstudio.google.com/embed/reporting/..."
  // ...
/>
```

Reemplaza con tu URL de Looker Studio:
1. Abre tu reporte en Looker Studio
2. Clic en **Compartir** → **Insertar**
3. Copia la URL del iframe
4. Pega en `src`

---

## 🔧 Ajustar Breakpoints Responsive

### Archivo: `src/styles/breakpoints.js`

```javascript
export const BREAKPOINTS = {
  mobile: 768,    // ← Pantallas móviles
  tablet: 1024,   // ← Tablets
  desktop: 1280   // ← Desktop
};
```

**Ejemplo**: Si quieres que tablet empiece en 800px:
```javascript
mobile: 800,
tablet: 1200,
```

---

## 🎯 Personalizar Métricas

### Desembolsos

**Archivo**: `src/App.jsx` (página "metricas")

```javascript
{[
  { l: "D1 — Plan trabajo", p: 100, c: "#10B981" },  // ← Cambiar
  { l: "D2 — Avance 35%", p: 45, c: "#4F6EF7" },
  // ...
]}
```

- `l`: Label/etiqueta
- `p`: Porcentaje (0-100)
- `c`: Color

### Stack Tecnológico

```javascript
{[
  { l: "Google Sheets", v: 28 },  // ← Cambiar nombre y valor
  { l: "Nueva Tech", v: 15 },     // ← Agregar nueva
  // ...
]}
```

---

## 🌙 Agregar Modo Oscuro (Futuro)

Para preparar tu código:

1. Crea un context de tema:
```javascript
// src/context/ThemeContext.js
export const ThemeContext = createContext();
```

2. Define colores para ambos temas:
```javascript
const themes = {
  light: { bg: "#F0F2F8", text: "#1A1D2B" },
  dark: { bg: "#1A1D2B", text: "#F0F2F8" }
};
```

3. Usa variables en lugar de colores hardcodeados

---

## 📱 Personalizar Comportamiento Móvil

### Cambiar si sidebar está abierto por defecto en móvil

**Archivo**: `src/App.jsx`

```javascript
useEffect(() => {
  const checkSize = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) {
      setSideOpen(true);  // ← Cambia a true para abierto
    }
  };
  // ...
}, []);
```

### Cambiar altura del iframe en móvil

```javascript
height={isMobile ? "400" : "800"}  // ← Cambiar 400 a tu valor
```

---

## 💡 Tips

1. **Buscar y reemplazar**: Usa `Ctrl+Shift+F` en VS Code para buscar en todos los archivos
2. **Hot Reload**: Los cambios se reflejan automáticamente con `npm start`
3. **Testing**: Prueba en Chrome DevTools después de cada cambio
4. **Backup**: Siempre haz backup antes de cambios grandes
5. **Git**: Usa commits frecuentes para poder revertir cambios

---

## 🆘 Problemas Comunes

### El build falla
```bash
# Borra node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Los cambios no se ven
```bash
# Borra cache del navegador o usa incógnito
# O borra build y reconstruye
rm -rf build
npm run build
```

### Errores de sintaxis
- Verifica que todos los objetos tengan comas correctas
- Verifica que los corchetes `[]` y llaves `{}` estén balanceados
- Usa un linter: `npm run lint` (si está configurado)

---

**¿Necesitas más ayuda?** Revisa los archivos de componentes - están bien comentados!
