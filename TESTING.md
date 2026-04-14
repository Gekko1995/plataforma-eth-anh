# Guía de Testing Responsive 📱💻

## Cómo probar la plataforma en diferentes dispositivos

### Opción 1: Chrome DevTools (Recomendado)

1. Abre la aplicación en Chrome: `npm start`
2. Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
3. Haz clic en el ícono de dispositivo móvil (arriba izquierda) o presiona `Ctrl+Shift+M`
4. Selecciona diferentes dispositivos del menú desplegable

#### Dispositivos para probar:

**Móvil:**
- iPhone SE (375 x 667)
- iPhone 12/13 Pro (390 x 844)
- Samsung Galaxy S20 (360 x 800)
- Pixel 5 (393 x 851)

**Tablet:**
- iPad Air (820 x 1180)
- iPad Pro (1024 x 1366)
- Surface Pro 7 (912 x 1368)

**Desktop:**
- 1280 x 720
- 1920 x 1080
- 2560 x 1440

### Opción 2: Testing Real en Dispositivos

#### Smartphone:
1. Asegúrate de estar en la misma red WiFi que tu computadora
2. Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
3. En el móvil, abre el navegador y ve a: `http://TU_IP:3000`

#### Ejemplo:
```
Si tu IP es 192.168.1.100, ve a: http://192.168.1.100:3000
```

### ✅ Checklist de Testing

#### Móvil (< 768px)
- [ ] Sidebar se oculta por defecto
- [ ] Botón hamburger funciona
- [ ] Overlay oscuro aparece cuando sidebar está abierto
- [ ] Sidebar se cierra al hacer clic en overlay
- [ ] Sidebar se cierra al seleccionar una opción
- [ ] KPIs en columna única
- [ ] Charts en columna única
- [ ] Tabla de logs muestra cards en lugar de tabla
- [ ] Barra de búsqueda no visible en header (espacio limitado)
- [ ] Iframe de Looker tiene altura de 500px
- [ ] Textos legibles (no muy pequeños)
- [ ] Botones fáciles de presionar (touch-friendly)

#### Tablet (768px - 1024px)
- [ ] Sidebar visible por defecto
- [ ] KPIs en 2 columnas
- [ ] Charts se adaptan bien
- [ ] Tabla de logs visible como tabla
- [ ] Barra de búsqueda visible

#### Desktop (> 1024px)
- [ ] Todo visible y espaciado correctamente
- [ ] Sidebar de 260px de ancho
- [ ] KPIs en grid auto-fit
- [ ] Charts en 3 columnas
- [ ] Iframe de Looker con altura de 800px
- [ ] Todas las funcionalidades accesibles

### 🐛 Problemas Comunes

#### Sidebar no se cierra en móvil
- Verifica que `closeSidebarMobile()` se llame al hacer clic en opciones
- Verifica que el overlay tenga `onClick={closeSidebarMobile}`

#### Elementos cortados o desbordados
- Verifica que todos los contenedores tengan `minWidth: 0`
- Verifica `overflow: hidden` y `text-overflow: ellipsis` en textos largos

#### Tamaños de fuente muy pequeños en móvil
- Ajusta los valores en `styles.card(isMobile)` y componentes
- Mínimo recomendado: 12px para textos

### 📸 Screenshots Recomendados

Para documentación, toma capturas en:
1. iPhone 12 Pro (móvil) - Sidebar cerrado
2. iPhone 12 Pro (móvil) - Sidebar abierto
3. iPad Air (tablet)
4. Desktop 1920x1080

### 🔧 Ajustes Rápidos

Si necesitas ajustar breakpoints:

Edita `src/styles/breakpoints.js`:
```javascript
export const BREAKPOINTS = {
  mobile: 768,   // Cambiar según necesites
  tablet: 1024,  // Cambiar según necesites
  desktop: 1280
};
```

Si necesitas ajustar tamaños de fuente en móvil:

Edita `src/styles/globalStyles.js`:
```javascript
@media (max-width: 767px) {
  h1 {
    font-size: 20px !important;  // Ajustar
  }
  h2 {
    font-size: 18px !important;  // Ajustar
  }
}
```

---

**Tip**: Usa el modo "Responsive" en DevTools para probar transiciones entre tamaños arrastrando el borde de la ventana.
