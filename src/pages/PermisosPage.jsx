import { useOutletContext } from 'react-router-dom';
import PanelPermisos from '../components/PanelPermisos';

export default function PermisosPage() {
  const { user } = useOutletContext();
  const isMobile = window.innerWidth < 768;
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Permisos de Módulos
      </h1>
      <PanelPermisos isMobile={isMobile} user={user} />
    </div>
  );
}
