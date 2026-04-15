import { useParams, useNavigate } from 'react-router-dom';
import { modulos } from '../data/modulos';
import { GROUPS } from '../data/constants';
import { demos } from '../data/demos';

const moduloMap = Object.fromEntries(modulos.map(m => [String(m.id), m]));
const grupoMap  = Object.fromEntries(GROUPS.map(g => [g.id, g]));

export default function ModuloDemoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const modulo = moduloMap[id];
  const demo   = demos[Number(id)];

  if (!modulo || !demo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--content-text-muted)' }}>
        <p>No se encontró la demo para este módulo.</p>
        <button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={() => navigate('/modulos')}>
          ← Volver a módulos
        </button>
      </div>
    );
  }

  const grupo = grupoMap[modulo.grupo];
  const color = grupo?.color || '#4f8ef7';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Botón volver */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate('/modulos')}
        style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        ← Volver a módulos
      </button>

      {/* Header */}
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        marginBottom: '28px', position: 'relative',
      }}>
        {modulo.imagen && (
          <div style={{ height: '160px', position: 'relative' }}>
            <img
              src={modulo.imagen}
              alt={modulo.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: color }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{
                  background: color, color: '#fff',
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px',
                }}>
                  {modulo.id}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#fff',
                  background: 'rgba(0,0,0,0.35)', padding: '3px 10px',
                  borderRadius: '20px', backdropFilter: 'blur(4px)',
                }}>
                  Grupo {modulo.grupo} · {grupo?.name}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#fff',
                  background: 'rgba(255,255,255,0.15)', padding: '3px 10px',
                  borderRadius: '20px', backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  Vista Demo
                </span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                {modulo.nombre}
              </h1>
            </div>
          </div>
        )}

        {!modulo.imagen && (
          <div style={{
            padding: '24px', background: color + '10',
            borderTop: `4px solid ${color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: color, color: '#fff',
                width: '32px', height: '32px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '14px',
              }}>
                {modulo.id}
              </span>
              <span style={{
                fontSize: '11px', fontWeight: 600, color,
                background: color + '15', padding: '3px 10px', borderRadius: '20px',
              }}>
                Grupo {modulo.grupo} · {grupo?.name}
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--content-text)', margin: 0 }}>
              {modulo.nombre}
            </h1>
          </div>
        )}
      </div>

      {/* Aviso demo */}
      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: '8px', padding: '10px 16px',
        fontSize: '12px', color: '#92400e',
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '24px',
      }}>
        <span style={{ fontSize: '14px' }}>⚠️</span>
        Los datos mostrados son completamente ficticios y tienen fines exclusivamente ilustrativos.
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '28px',
      }}>
        {demo.kpis.map((kpi, i) => (
          <div key={i} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '10px',
            padding: '16px',
            borderTop: `3px solid ${kpi.color}`,
          }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--content-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: '26px', fontWeight: 700, color: kpi.color, lineHeight: 1, marginBottom: '4px' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--content-text-hint)' }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla de datos */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        {/* Título de tabla */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: color, flexShrink: 0,
          }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--content-text)' }}>
            Datos de muestra
          </span>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: color + '0e' }}>
                {demo.tabla.columnas.map((col, i) => (
                  <th key={i} style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: 'var(--content-text-muted)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    borderBottom: `2px solid ${color}20`,
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demo.tabla.filas.map((fila, ri) => (
                <tr
                  key={ri}
                  style={{
                    borderBottom: '1px solid var(--card-border)',
                    background: ri % 2 === 0 ? 'transparent' : 'var(--sidebar-bg)',
                  }}
                >
                  {fila.map((celda, ci) => (
                    <td key={ci} style={{
                      padding: '10px 16px',
                      color: 'var(--content-text)',
                      whiteSpace: 'nowrap',
                    }}>
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
