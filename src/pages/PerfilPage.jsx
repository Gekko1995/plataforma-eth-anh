import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { updateOwnProfile, changeOwnPassword } from '../utils/profile';

/* ── Iconos ── */
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div style={{
      background: 'var(--content-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--content-border)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 24px',
        borderBottom: '1px solid var(--content-border)',
        background: 'var(--anh-mist)',
      }}>
        <span style={{ color: 'var(--anh-primary)', display: 'flex' }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--content-text)' }}>{title}</span>
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

function SuccessBanner({ message }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#f0fdf4',
      border: '1px solid #86efac',
      borderRadius: '8px',
      padding: '10px 14px',
      marginTop: '16px',
      fontSize: '13px',
      color: '#15803d',
    }}>
      <IconCheck /> {message}
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{
      background: '#fef2f2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '10px 14px',
      marginTop: '16px',
      fontSize: '13px',
      color: '#dc2626',
    }}>
      {message}
    </div>
  );
}

/* ── Sección nombre ── */
function NombreForm({ user, onUpdated }) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setOk(false);
    if (!nombre.trim()) { setError('El nombre no puede estar vacío.'); return; }
    setLoading(true);
    const res = await updateOwnProfile({ nombre: nombre.trim() });
    setLoading(false);
    if (res.ok) { setOk(true); onUpdated({ nombre: nombre.trim() }); }
    else setError(res.error);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          Nombre completo
        </label>
        <input
          type="text"
          className="form-input"
          value={nombre}
          onChange={e => { setNombre(e.target.value); setOk(false); setError(''); }}
          placeholder="Tu nombre completo"
          maxLength={100}
        />
      </div>
      {error && <ErrorBanner message={error} />}
      {ok && <SuccessBanner message="Nombre actualizado correctamente." />}
      <div style={{ marginTop: '16px' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar nombre'}
        </button>
      </div>
    </form>
  );
}

/* ── Sección correo ── */
function EmailForm({ user, onUpdated }) {
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setOk(false);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Ingresa un correo válido.'); return;
    }
    setLoading(true);
    const res = await updateOwnProfile({ email: trimmed });
    setLoading(false);
    if (res.ok) { setOk(true); onUpdated({ email: trimmed }); }
    else setError(res.error);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          Correo electrónico
        </label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={e => { setEmail(e.target.value); setOk(false); setError(''); }}
          placeholder="correo@ejemplo.com"
        />
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--content-text-muted)' }}>
          Al cambiar el correo, recibirás un enlace de confirmación en la nueva dirección.
        </p>
      </div>
      {error && <ErrorBanner message={error} />}
      {ok && <SuccessBanner message="Correo actualizado. Si recibes un enlace de confirmación en la nueva dirección, ábrelo para activar el cambio en el acceso." />}
      <div style={{ marginTop: '16px' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Guardando…' : 'Actualizar correo'}
        </button>
      </div>
    </form>
  );
}

/* ── Sección contraseña ── */
function PasswordForm() {
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setOk(false);
    if (nueva.length < 8) { setError('La contraseña debe tener mínimo 8 caracteres.'); return; }
    if (nueva !== confirmar) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    const res = await changeOwnPassword(nueva);
    setLoading(false);
    if (res.ok) {
      setOk(true);
      setNueva(''); setConfirmar('');
    } else {
      setError(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Nueva contraseña
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Mínimo 8 caracteres"
            value={nueva}
            onChange={e => { setNueva(e.target.value); setOk(false); setError(''); }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Confirmar contraseña
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Repite la nueva contraseña"
            value={confirmar}
            onChange={e => { setConfirmar(e.target.value); setOk(false); setError(''); }}
          />
        </div>
      </div>
      {error && <ErrorBanner message={error} />}
      {ok && <SuccessBanner message="Contraseña actualizada correctamente." />}
      <div style={{ marginTop: '16px' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </div>
    </form>
  );
}

/* ── Página principal ── */
export default function PerfilPage() {
  const { user, onUserUpdate } = useOutletContext();
  const navigate = useNavigate();
  const initials = (user?.nombre || 'U').split(' ').filter(w => w).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  function handleUpdated(patch) {
    if (typeof onUserUpdate === 'function') onUserUpdate(patch);
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--anh-primary),var(--anh-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: '20px',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--content-text)' }}>
            Mi perfil
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--content-text-muted)' }}>
            {user?.nombre} · <span style={{ textTransform: 'capitalize' }}>{user?.rol}</span>
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
      </div>

      {/* Secciones */}
      <div style={{ display: 'grid', gap: '20px' }}>
        <SectionCard icon={<IconUser />} title="Nombre">
          <NombreForm user={user} onUpdated={handleUpdated} />
        </SectionCard>

        <SectionCard icon={<IconMail />} title="Correo electrónico">
          <EmailForm user={user} onUpdated={handleUpdated} />
        </SectionCard>

        <SectionCard icon={<IconLock />} title="Contraseña">
          <PasswordForm />
        </SectionCard>
      </div>
    </div>
  );
}
