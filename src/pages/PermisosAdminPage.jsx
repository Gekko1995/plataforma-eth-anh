import PermisosAdminPanel from '../components/PermisosAdminPanel';

export default function PermisosAdminPage() {
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
        Permisos de Administradores
      </h1>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Configura qué acciones puede realizar cada administrador dentro de la plataforma.
      </p>
      <PermisosAdminPanel />
    </div>
  );
}
