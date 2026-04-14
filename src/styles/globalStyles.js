/**
 * Estilos globales de la aplicación con soporte responsive
 */

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
  
  /* Reset y estilos base */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  /* Placeholders */
  input::placeholder {
    color: #A0A5BD;
  }
  
  /* Scrollbar personalizado */
  ::-webkit-scrollbar {
    width: 5px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #CBD0E0;
    border-radius: 3px;
  }
  
  /* Animaciones */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Utilidades responsive */
  .hide-mobile {
    display: block;
  }
  
  .show-mobile {
    display: none;
  }
  
  /* Media queries para móvil */
  @media (max-width: 767px) {
    .hide-mobile {
      display: none !important;
    }
    
    .show-mobile {
      display: block !important;
    }
    
    /* Ajustes de tipografía en móvil */
    h1 {
      font-size: 20px !important;
    }
    
    h2 {
      font-size: 18px !important;
    }
    
    /* Reducir padding en móvil */
    .responsive-padding {
      padding: 16px !important;
    }
  }
  
  /* Media queries para tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    h1 {
      font-size: 22px !important;
    }
    
    h2 {
      font-size: 20px !important;
    }
  }
`;

/**
 * Estilos inline reutilizables con soporte responsive
 */
const MOBILE_SIDEBAR_WIDTH = "min(82vw, 320px)";

export const styles = {
  // Container principal con padding responsive
  container: (isMobile) => ({
    flex: 1,
    minHeight: 0,
    padding: isMobile ? "16px" : "24px 28px",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch"
  }),

  // Grid responsive para KPIs
  kpiGrid: (isMobile, isTablet) => ({
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 24
  }),

  // Grid responsive para charts
  chartGrid: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 300px",
    gap: 14,
    marginBottom: 24
  }),

  // Header responsive
  header: (isMobile) => ({
    background: "#fff",
    borderBottom: "1px solid #E8EBF2",
    padding: isMobile ? "12px 16px" : "14px 28px",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 8 : 16,
    justifyContent: "space-between",
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 10
  }),

  // Card genérica responsive
  card: (isMobile) => ({
    background: "#fff",
    borderRadius: 16,
    padding: isMobile ? "16px" : "20px 24px",
    border: "1px solid #E8EBF2"
  }),

  // Sidebar responsive
  sidebar: (isOpen, isMobile) => {
    const desktopWidth = isOpen ? 260 : 0;
    const width = isMobile ? MOBILE_SIDEBAR_WIDTH : desktopWidth;
    const transform = isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "none";
    const pointerEvents = !isMobile || isOpen ? "auto" : "none";

    return {
      width,
      height: "100dvh",
      background: "#fff",
      borderRight: "1px solid #E8EBF2",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: isMobile ? "transform .25s ease" : "width .3s ease",
      flexShrink: 0,
      position: isMobile ? "fixed" : "relative",
      zIndex: isMobile ? 1000 : "auto",
      left: 0,
      top: 0,
      bottom: 0,
      transform,
      pointerEvents,
      boxShadow: isMobile && isOpen ? "0 0 20px rgba(0,0,0,0.3)" : "none"
    };
  },

  // Overlay para sidebar en móvil
  overlay: (show) => ({
    display: show ? "block" : "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999
  })
};
