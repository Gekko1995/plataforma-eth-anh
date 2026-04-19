import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import ModulosPage from './pages/ModulosPage';
import UsuariosPage from './pages/UsuariosPage';
import PermisosPage from './pages/PermisosPage';
import CambiarPassword from './pages/CambiarPassword';
import ModuloDemoPage from './pages/ModuloDemoPage';
import PresentacionVistaPage from './pages/PresentacionVistaPage';
import PresentacionEditorPage from './pages/PresentacionEditorPage';
import HistorialPage from './pages/HistorialPage';
import PerfilPage from './pages/PerfilPage';
import PermisosAdminPage from './pages/PermisosAdminPage';
import LineaDiagnosticaPage  from './pages/modulos/modulo-1/LineaDiagnosticaPage';
import EvaluacionImpactoPage from './pages/modulos/modulo-2/EvaluacionImpactoPage';
import GeoreferenciaPage     from './pages/modulos/modulo-3/GeoreferenciaPage';
import ClusterProductivoPage from './pages/modulos/modulo-4/ClusterProductivoPage';
import RecaboCampoPage            from './pages/modulos/modulo-5/RecaboCampoPage';
import LineamientosAmbientalesPage from './pages/modulos/modulo-6/LineamientosAmbientalesPage';
import InversionSocialPage         from './pages/modulos/modulo-7/InversionSocialPage';
import PrevencionDialogoPage       from './pages/modulos/modulo-8/PrevencionDialogoPage';
import MarcoLogicoPage             from './pages/modulos/modulo-9/MarcoLogicoPage';
import CampusBeneficiariosPage     from './pages/modulos/modulo-10/CampusBeneficiariosPage';
import CampusComunidadesPage       from './pages/modulos/modulo-11/CampusComunidadesPage';
import CampusPersonalPage          from './pages/modulos/modulo-12/CampusPersonalPage';
import AceleradoraExportadoraPage  from './pages/modulos/modulo-13/AceleradoraExportadoraPage';
import {
  authUser,
  addLog,
  getCurrentAuthenticatedUser,
  onAuthStateChange,
  signOutUser,
} from './utils/auth';
import { getProfileFlags } from './utils/profile';
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
        // Timeout generoso: solo para conexiones completamente caídas, no latencia normal
        const timeout = new Promise(resolve => setTimeout(() => resolve({ ok: false }), 20000));
        const result = await Promise.race([getCurrentAuthenticatedUser(), timeout]);
        if (!mounted) return;
        if (result.ok) {
          const flags = await getProfileFlags(result.user.id);
          setUser({ ...result.user, ...flags, loginAt: new Date().toISOString() });
        } else {
          setUser(null);
        }
      } catch {
        if (mounted) setUser(null);
      }
    }

    hydrate();

    // TOKEN_REFRESHED ocurre automáticamente cada ~50 min — no requiere re-hidratar
    // SIGNED_OUT lo manejamos directamente sin query a la BD
    const { data: { subscription } } = onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) setUser(null);
      } else if (event !== 'TOKEN_REFRESHED') {
        hydrate();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(email, password) {
    setAuthLoading(true);
    setAuthError('');
    const result = await authUser(email, password);
    if (result.ok) {
      const flags = await getProfileFlags(result.user.id);
      const ud = { ...result.user, ...flags, loginAt: new Date().toISOString() };
      setUser(ud);
      addLog(ud, 'LOGIN');
    } else {
      setAuthError(result.error);
    }
    setAuthLoading(false);
  }

  async function handleLogout() {
    if (user) {
      // Await the LOGOUT log so the insert completes before the session ends
      // (RLS requires auth.uid() = user_id, which is null after signOut)
      await addLog(user, 'LOGOUT');
    }
    await signOutUser();
    setUser(null);
  }

  function handlePasswordChanged() {
    setUser(u => ({ ...u, debe_cambiar_password: false }));
  }

  function handleUserUpdate(patch) {
    setUser(u => ({ ...u, ...patch }));
  }

  if (user === undefined) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f4f6fb',
        fontSize: '15px', color: '#64748b',
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
              ? <Navigate to={user.debe_cambiar_password ? '/cambiar-password' : '/dashboard'} replace />
              : <Login onLogin={handleLogin} error={authError} loading={authLoading} />
          }
        />

        {/* Cambiar contraseña obligatorio */}
        <Route
          path="/cambiar-password"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.debe_cambiar_password
                ? <CambiarPassword user={user} onChanged={handlePasswordChanged} />
                : <Navigate to="/dashboard" replace />
          }
        />

        {/* Rutas protegidas — bloquea acceso si debe cambiar contraseña */}
        <Route
          path="/"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.debe_cambiar_password
                ? <Navigate to="/cambiar-password" replace />
                : <Layout user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="modulos" element={<ModulosPage />} />
          <Route path="modulos/:id/demo" element={<ModuloDemoPage />} />
          <Route path="modulos/1/app" element={<LineaDiagnosticaPage />} />
          <Route path="modulos/2/app" element={<EvaluacionImpactoPage />} />
          <Route path="modulos/3/app" element={<GeoreferenciaPage />} />
          <Route path="modulos/4/app" element={<ClusterProductivoPage />} />
          <Route path="modulos/5/app"  element={<RecaboCampoPage />} />
          <Route path="modulos/6/app"  element={<LineamientosAmbientalesPage />} />
          <Route path="modulos/7/app"  element={<InversionSocialPage />} />
          <Route path="modulos/8/app"  element={<PrevencionDialogoPage />} />
          <Route path="modulos/9/app"  element={<MarcoLogicoPage />} />
          <Route path="modulos/10/app" element={<CampusBeneficiariosPage />} />
          <Route path="modulos/11/app" element={<CampusComunidadesPage />} />
          <Route path="modulos/12/app" element={<CampusPersonalPage />} />
          <Route path="modulos/13/app" element={<AceleradoraExportadoraPage />} />
          <Route path="modulos/:id/presentacion" element={<PresentacionVistaPage />} />
          <Route
            path="modulos/:id/presentacion/editar"
            element={['admin','super_root'].includes(user?.rol) ? <PresentacionEditorPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="usuarios"
            element={['admin','super_root'].includes(user?.rol) ? <UsuariosPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="permisos"
            element={['admin','super_root'].includes(user?.rol) ? <PermisosPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="historial"
            element={
              user?.adminPermisos?.puede_ver_historial || user?.rol === 'super_root'
                ? <HistorialPage />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="permisos-admin"
            element={user?.rol === 'super_root' ? <PermisosAdminPage /> : <Navigate to="/dashboard" replace />}
          />
        </Route>

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
