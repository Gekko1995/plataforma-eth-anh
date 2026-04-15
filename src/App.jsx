import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import ModulosPage from './pages/ModulosPage';
import UsuariosPage from './pages/UsuariosPage';
import PermisosPage from './pages/PermisosPage';
import {
  authUser,
  addLog,
  getCurrentAuthenticatedUser,
  onAuthStateChange,
} from './utils/auth';
import './styles/eth-anh-styles.css';

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = cargando, null = no autenticado
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Restaurar sesión al cargar
  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const timeout = new Promise(resolve =>
          setTimeout(() => resolve({ ok: false }), 5000)
        );
        const result = await Promise.race([getCurrentAuthenticatedUser(), timeout]);
        if (!mounted) return;
        setUser(result.ok ? { ...result.user, loginAt: new Date().toISOString() } : null);
      } catch {
        if (mounted) setUser(null);
      }
    }

    hydrate();

    const { data: { subscription } } = onAuthStateChange(() => hydrate());

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(email, password) {
    setAuthLoading(true);
    setAuthError('');
    const result = await authUser(email, password);
    setAuthLoading(false);
    if (result.ok) {
      const ud = { ...result.user, loginAt: new Date().toISOString() };
      setUser(ud);
      addLog(ud, 'LOGIN');
    } else {
      setAuthError(result.error);
    }
  }

  function handleLogout() {
    if (user) addLog(user, 'LOGOUT');
    setUser(null);
  }

  // Pantalla de carga mientras se verifica sesión
  if (user === undefined) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--content-bg)',
        fontSize: '15px', color: 'var(--text-secondary)',
      }}>
        Cargando…
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Login onLogin={handleLogin} error={authError} loading={authLoading} />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            user
              ? <Layout user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="modulos" element={<ModulosPage />} />
          <Route
            path="usuarios"
            element={user?.rol === 'admin' ? <UsuariosPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="permisos"
            element={user?.rol === 'admin' ? <PermisosPage /> : <Navigate to="/dashboard" replace />}
          />
        </Route>

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
