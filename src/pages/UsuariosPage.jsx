import { useOutletContext } from 'react-router-dom';
import GestionUsuarios from '../components/GestionUsuarios';

export default function UsuariosPage() {
  const { user } = useOutletContext();
  const isMobile = window.innerWidth < 768;
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Gestión de Usuarios
      </h1>
      <GestionUsuarios isMobile={isMobile} user={user} />
    </div>
  );
}
