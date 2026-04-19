import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import IdleWarningModal from './components/IdleWarningModal';
import { useIdleTimeout } from './hooks/useIdleTimeout';
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
import GestionBeneficiariosPage    from './pages/modulos/modulo-14/GestionBeneficiariosPage';
import DirectorioActoresPage       from './pages/modulos/modulo-15/DirectorioActoresPage';
import ConsultaPreviaPage          from './pages/modulos/modulo-16/ConsultaPreviaPage';
import ReclutamientoPage           from './pages/modulos/modulo-17/ReclutamientoPage';
import GestionPersonalPage         from './pages/modulos/modulo-18/GestionPersonalPage';
import GestionAlianzasPage         from './pages/modulos/modulo-19/GestionAlianzasPage';
import SeguridadAccesosPage        from './pages/modulos/modulo-20/SeguridadAccesosPage';
import MonitoreoOperativoPage      from './pages/modulos/modulo-21/MonitoreoOperativoPage';
import GestionFinancieraPage       from './pages/modulos/modulo-22/GestionFinancieraPage';
import CuentasCobroPage            from './pages/modulos/modulo-23/CuentasCobroPage';
import SecretariaComitePage        from './pages/modulos/modulo-24/SecretariaComitePage';
import AdquisicionesPage           from './pages/modulos/modulo-25/AdquisicionesPage';
import MatrizRiesgosPage           from './pages/modulos/modulo-26/MatrizRiesgosPage';
import RevisionInformesPage        from './pages/modulos/modulo-27/RevisionInformesPage';
import CompiladoresANHPage         from './pages/modulos/modulo-28/CompiladoresANHPage';
import GestionConocimientoPage     from './pages/modulos/modulo-29/GestionConocimientoPage';
import AgendaTerritorialPage       from './pages/modulos/modulo-30/AgendaTerritorialPage';
import LogisticaPage               from './pages/modulos/modulo-31/LogisticaPage';
import VisibilidadPrensaPage       from './pages/modulos/modulo-32/VisibilidadPrensaPage';
import HSEPage                     from './pages/modulos/modulo-33/HSEPage';
import GestionDocumentalPage       from './pages/modulos/modulo-34/GestionDocumentalPage';
import ControlInventariosPage      from './pages/modulos/modulo-35/ControlInventariosPage';
import PolizasGarantiasPage        from './pages/modulos/modulo-36/PolizasGarantiasPage';
import LiquidacionCierrePage       from './pages/modulos/modulo-37/LiquidacionCierrePage';
import MesaAyudaPage               from './pages/modulos/modulo-38/MesaAyudaPage';
import InfraestructuraPage         from './pages/modulos/modulo-39/InfraestructuraPage';
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

  async function handleLogout() {
    if (user) await addLog(user, 'LOGOUT');
    await signOutUser();
    setUser(null);
  }

  const { showWarning, secondsLeft, resetTimer } = useIdleTimeout({
    onLogout: handleLogout,
    enabled: !!user,
  });

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
    <>
    {showWarning && (
      <IdleWarningModal
        secondsLeft={secondsLeft}
        onStay={resetTimer}
        onLogout={handleLogout}
      />
    )}
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
          <Route path="modulos/14/app" element={<GestionBeneficiariosPage />} />
          <Route path="modulos/15/app" element={<DirectorioActoresPage />} />
          <Route path="modulos/16/app" element={<ConsultaPreviaPage />} />
          <Route path="modulos/17/app" element={<ReclutamientoPage />} />
          <Route path="modulos/18/app" element={<GestionPersonalPage />} />
          <Route path="modulos/19/app" element={<GestionAlianzasPage />} />
          <Route path="modulos/20/app" element={<SeguridadAccesosPage />} />
          <Route path="modulos/21/app" element={<MonitoreoOperativoPage />} />
          <Route path="modulos/22/app" element={<GestionFinancieraPage />} />
          <Route path="modulos/23/app" element={<CuentasCobroPage />} />
          <Route path="modulos/24/app" element={<SecretariaComitePage />} />
          <Route path="modulos/25/app" element={<AdquisicionesPage />} />
          <Route path="modulos/26/app" element={<MatrizRiesgosPage />} />
          <Route path="modulos/27/app" element={<RevisionInformesPage />} />
          <Route path="modulos/28/app" element={<CompiladoresANHPage />} />
          <Route path="modulos/29/app" element={<GestionConocimientoPage />} />
          <Route path="modulos/30/app" element={<AgendaTerritorialPage />} />
          <Route path="modulos/31/app" element={<LogisticaPage />} />
          <Route path="modulos/32/app" element={<VisibilidadPrensaPage />} />
          <Route path="modulos/33/app" element={<HSEPage />} />
          <Route path="modulos/34/app" element={<GestionDocumentalPage />} />
          <Route path="modulos/35/app" element={<ControlInventariosPage />} />
          <Route path="modulos/36/app" element={<PolizasGarantiasPage />} />
          <Route path="modulos/37/app" element={<LiquidacionCierrePage />} />
          <Route path="modulos/38/app" element={<MesaAyudaPage />} />
          <Route path="modulos/39/app" element={<InfraestructuraPage />} />
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
    </>
  );
}
