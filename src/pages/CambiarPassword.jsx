import { useState } from 'react';
import { changeOwnPassword } from '../utils/profile';

export default function CambiarPassword({ user, onChanged }) {
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (nueva.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const result = await changeOwnPassword(nueva);
    setLoading(false);

    if (result.ok) {
      onChanged();
    } else {
      setError(result.error);
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#1e2535 0%,#263045 100%)',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg,#f5c842,#fb923c)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '18px',
              color: '#0f1117',
            }}>PGV</span>
            <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 600 }}>Gestión & Viabilidad</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
              Crea tu contraseña
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Hola <strong>{user?.nombre?.split(' ')[0] || 'Usuario'}</strong>, por seguridad debes establecer una contraseña personal antes de continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 8 caracteres"
                value={nueva}
                onChange={e => setNueva(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Repite la contraseña"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
