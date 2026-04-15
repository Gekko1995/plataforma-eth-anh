import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOutUser } from '../utils/auth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/modulos', label: 'Módulos', icon: '⊞' },
  { to: '/usuarios', label: 'Usuarios', icon: '👥', adminOnly: true },
  { to: '/permisos', label: 'Permisos', icon: '🔐', adminOnly: true },
];

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutUser();
    onLogout();
    navigate('/login');
  }

  const navItems = NAV_ITEMS.filter(item => !item.adminOnly || user?.rol === 'admin');
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
          <span className="sidebar-logo-mark">ETH</span>
          <span className="sidebar-logo-text">ANH 2026</span>
        </div>

        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ flexShrink: 0, padding: '8px 0', borderTop: '1px solid var(--sidebar-border)' }}>
          <button className="nav-item nav-logout" onClick={handleLogout}>
            <span className="nav-icon">↩</span>
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

        <span className={`header-role-badge${user?.rol === 'admin' ? ' admin' : ''}`}>
          {user?.rol || 'usuario'}
        </span>

        <div className="header-avatar" title={user?.nombre}>
          {initials}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
