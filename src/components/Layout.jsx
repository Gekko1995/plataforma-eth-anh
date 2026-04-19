import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOutUser } from '../utils/auth';
import AccesibilidadMenu from './AccesibilidadMenu';

/* ── Isotipos SVG minimalistas ── */
function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconModulos() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconUsuarios() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

function IconPermisos() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Isotipo ETH-ANH para el logo del sidebar ── */
function SidebarIsotipo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="url(#sidebarGrad)" />
      {/* E */}
      <rect x="6" y="10" width="9" height="2.2" rx="1" fill="white" />
      <rect x="6" y="18.9" width="7.2" height="2.2" rx="1" fill="white" />
      <rect x="6" y="27.8" width="9" height="2.2" rx="1" fill="white" />
      <rect x="6" y="10" width="2.2" height="20" rx="1" fill="white" />
      {/* H */}
      <rect x="19" y="10" width="2.2" height="20" rx="1" fill="white" />
      <rect x="19" y="18.9" width="8.8" height="2.2" rx="1" fill="white" />
      <rect x="25.6" y="10" width="2.2" height="20" rx="1" fill="white" />
      <defs>
        <linearGradient id="sidebarGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C97435" />
          <stop offset="1" stopColor="#E8892A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconHistorial() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3" />
      <path d="M3.05 11a9 9 0 1 1 .5 4" />
      <polyline points="3 16 3 11 8 11" />
    </svg>
  );
}

function IconPerfil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/dashboard',      label: 'Dashboard',      Icon: IconDashboard },
  { to: '/modulos',        label: 'Módulos',         Icon: IconModulos },
  { to: '/usuarios',       label: 'Usuarios',        Icon: IconUsuarios,  adminOnly: true },
  { to: '/permisos',       label: 'Permisos Módulos',Icon: IconPermisos,  adminOnly: true },
  { to: '/historial',      label: 'Historial',       Icon: IconHistorial, historialOnly: true },
  { to: '/permisos-admin', label: 'Permisos Admin',  Icon: IconPermisos,  superRootOnly: true },
  { to: '/perfil',         label: 'Mi perfil',       Icon: IconPerfil },
];

export default function Layout({ user, onLogout, onUserUpdate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutUser();
    onLogout();
    navigate('/login');
  }

  const isSuperRoot = user?.rol === 'super_root';
  const isAdmin     = user?.rol === 'admin' || isSuperRoot;

  const navItems = NAV_ITEMS.filter(item => {
    if (item.superRootOnly)  return isSuperRoot;
    if (item.adminOnly)      return isAdmin;
    if (item.historialOnly)  return user?.adminPermisos?.puede_ver_historial || isSuperRoot;
    return true;
  });
  const initials = (user?.nombre || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="app-layout">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="sidebar-overlay-click" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <SidebarIsotipo />
          <span className="sidebar-logo-text">
            <span className="sidebar-logo-title">ETH-ANH 2026</span>
            <span className="sidebar-logo-sub">Gestión Integrada</span>
          </span>
        </div>

        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ flexShrink: 0, padding: '8px 0', borderTop: '1px solid var(--sidebar-border)' }}>
          <button className="nav-item nav-logout" onClick={handleLogout}>
            <span className="nav-icon"><IconLogout /></span>
            <span className="nav-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="header">
        <button
          className="btn btn-ghost btn-sm sidebar-toggle"
          onClick={() => setSidebarOpen(s => !s)}
          aria-label="Menú"
        >
          ☰
        </button>

        <span className="header-title">
          Plataforma ETH-ANH 2026
        </span>

        <AccesibilidadMenu />

        <span className={`header-role-badge${isAdmin ? ' admin' : ''}`}>
          {user?.rol || 'usuario'}
        </span>

        <div
          className="header-avatar"
          title={`${user?.nombre} — Mi perfil`}
          onClick={() => navigate('/perfil')}
          style={{ cursor: 'pointer' }}
        >
          {initials}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <Outlet context={{ user, onUserUpdate }} />
      </main>
    </div>
  );
}
