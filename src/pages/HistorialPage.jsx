import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 50;

function formatFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-CO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function toCSV(rows) {
  const headers = ['Fecha/Hora', 'Email', 'Nombre', 'Rol', 'Acción', 'Detalle'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map(r => [
      formatFecha(r.created_at),
      r.user_email,
      r.user_nombre,
      r.user_rol,
      r.accion,
      r.detalle ?? '',
    ].map(escape).join(',')),
  ];
  return lines.join('\r\n');
}

function downloadCSV(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AccionBadge({ accion }) {
  const styles = {
    LOGIN:  { bg: '#dcfce7', color: '#15803d' },
    LOGOUT: { bg: '#fee2e2', color: '#dc2626' },
  };
  const s = styles[accion] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: 600, background: s.bg, color: s.color,
    }}>
      {accion}
    </span>
  );
}

export default function HistorialPage() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroAccion, setFiltroAccion] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [msg, setMsg]         = useState({ text: '', ok: true });
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);

  function showMsg(text, ok = true) {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: '', ok: true }), 4000);
  }

  const fetchLogs = useCallback(async (currentPage, email, accion, desde, hasta) => {
    if (!supabase) return;
    setLoading(true);

    let query = supabase
      .from('activity_log')
      .select('id, user_email, user_nombre, user_rol, accion, detalle, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE - 1);

    if (email.trim()) query = query.ilike('user_email', `%${email.trim()}%`);
    if (accion)       query = query.eq('accion', accion);
    if (desde)        query = query.gte('created_at', desde);
    if (hasta)        query = query.lte('created_at', hasta + 'T23:59:59');

    const { data, error, count } = await query;
    if (!error) {
      setLogs(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs(page, filtroEmail, filtroAccion, filtroDesde, filtroHasta);
  }, [fetchLogs, page, filtroEmail, filtroAccion, filtroDesde, filtroHasta]);

  function handleFiltroEmail(e) {
    setFiltroEmail(e.target.value);
    setPage(0);
  }

  function handleFiltroAccion(e) {
    setFiltroAccion(e.target.value);
    setPage(0);
  }

  function handleFiltroDesde(e) {
    setFiltroDesde(e.target.value);
    setPage(0);
  }

  function handleFiltroHasta(e) {
    setFiltroHasta(e.target.value);
    setPage(0);
  }

  async function handleExport() {
    if (!supabase) return;
    setExporting(true);
    try {
      let query = supabase
        .from('activity_log')
        .select('id, user_email, user_nombre, user_rol, accion, detalle, created_at')
        .order('created_at', { ascending: false });

      if (filtroEmail.trim()) query = query.ilike('user_email', `%${filtroEmail.trim()}%`);
      if (filtroAccion)       query = query.eq('accion', filtroAccion);
      if (filtroDesde)        query = query.gte('created_at', filtroDesde);
      if (filtroHasta)        query = query.lte('created_at', filtroHasta + 'T23:59:59');

      const { data, error } = await query;
      if (error) { showMsg('Error al exportar: ' + error.message, false); return; }

      const fecha = new Date().toISOString().slice(0, 10);
      downloadCSV(toCSV(data || []), `historial_${fecha}.csv`);
      showMsg(`Exportados ${(data || []).length} registros.`);
    } finally {
      setExporting(false);
    }
  }

  async function handleClearAll() {
    if (!window.confirm('¿Eliminar TODO el historial? Esta acción no se puede deshacer.')) return;
    setClearing(true);
    // Delete all rows by filtering on the epoch start (covers all valid timestamps)
    const { error } = await supabase.from('activity_log').delete().gte('created_at', '1970-01-01');
    setClearing(false);
    if (error) {
      showMsg('Error al limpiar el historial: ' + error.message, false);
    } else {
      showMsg('Historial eliminado.');
      setPage(0);
      fetchLogs(0, filtroEmail, filtroAccion, filtroDesde, filtroHasta);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        Historial de uso
      </h1>

      {msg.text && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
          background: msg.ok ? '#dcfce7' : '#fee2e2',
          color:      msg.ok ? '#15803d' : '#dc2626',
          border: `1px solid ${msg.ok ? '#86efac' : '#fca5a5'}`,
        }}>
          {msg.text}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ maxWidth: '220px' }}
          placeholder="Filtrar por email…"
          value={filtroEmail}
          onChange={handleFiltroEmail}
        />
        <select
          className="form-select"
          style={{ maxWidth: '180px' }}
          value={filtroAccion}
          onChange={handleFiltroAccion}
        >
          <option value="">Todas las acciones</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>
        <input
          type="date"
          className="form-input"
          style={{ maxWidth: '160px' }}
          title="Desde"
          value={filtroDesde}
          onChange={handleFiltroDesde}
        />
        <input
          type="date"
          className="form-input"
          style={{ maxWidth: '160px' }}
          title="Hasta"
          value={filtroHasta}
          onChange={handleFiltroHasta}
        />
        {(filtroEmail || filtroAccion || filtroDesde || filtroHasta) && (
          <button className="btn btn-ghost btn-sm" onClick={() => {
            setFiltroEmail(''); setFiltroAccion('');
            setFiltroDesde(''); setFiltroHasta('');
            setPage(0);
          }}>
            Limpiar filtros
          </button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleExport}
            disabled={exporting || loading}
            title="Exportar registros filtrados a CSV"
          >
            {exporting ? 'Exportando…' : '⬇ Exportar CSV'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleClearAll} disabled={clearing}>
            {clearing ? 'Limpiando…' : 'Limpiar historial'}
          </button>
        </div>
      </div>

      {/* Contador */}
      <p style={{ fontSize: '13px', color: 'var(--content-text-muted)', marginBottom: '12px' }}>
        {loading ? 'Cargando…' : `${total.toLocaleString('es-CO')} registro${total !== 1 ? 's' : ''} en total`}
      </p>

      {/* Tabla */}
      {loading ? (
        <p style={{ color: 'var(--content-text-muted)' }}>Cargando historial…</p>
      ) : logs.length === 0 ? (
        <p style={{ color: 'var(--content-text-muted)' }}>No hay registros.</p>
      ) : (
        <div className="table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Fecha / Hora', 'Usuario', 'Rol', 'Acción', 'Detalle'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px',
                    fontSize: '12px', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '.04em',
                    borderBottom: '2px solid #e2e8f0',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {formatFecha(log.created_at)}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>{log.user_nombre}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{log.user_email}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                      {log.user_rol}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <AccionBadge accion={log.accion} />
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: '#64748b' }}>
                    {log.detalle || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', justifyContent: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
            ← Anterior
          </button>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Página {page + 1} de {totalPages}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
