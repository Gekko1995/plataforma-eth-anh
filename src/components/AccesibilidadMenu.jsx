import { useState, useEffect, useCallback } from 'react';

const LS_KEY = 'eth_a11y';

const DEFAULTS = {
  contraste:  false,
  grises:     false,
  dislexia:   false,
  subrayar:   false,
  tamano:     0,       // 0 = normal, 1 = grande, 2 = muy grande
};

function applyToHtml(prefs) {
  const cl = document.documentElement.classList;
  cl.toggle('a11y-contrast',  prefs.contraste);
  cl.toggle('a11y-grayscale', prefs.grises);
  cl.toggle('a11y-dyslexia',  prefs.dislexia);
  cl.toggle('a11y-underline', prefs.subrayar);
  cl.remove('a11y-text-lg', 'a11y-text-xl');
  if (prefs.tamano === 1) cl.add('a11y-text-lg');
  if (prefs.tamano === 2) cl.add('a11y-text-xl');
}

function IconA11y() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4" r="1.5" />
      <path d="M7 8h10M12 8v5M9 21l3-8 3 8" />
      <path d="M8 13c-1.5 1-2.5 2.5-2.5 4" />
      <path d="M16 13c1.5 1 2.5 2.5 2.5 4" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
      background: checked ? '#074A6A10' : '#f8fafc',
      border: `1px solid ${checked ? '#074A6A44' : '#e2e8f0'}`,
      transition: 'all .15s',
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{
        width: 40, height: 22, borderRadius: 99, flexShrink: 0,
        background: checked ? '#074A6A' : '#cbd5e1',
        position: 'relative', transition: 'background .2s',
        marginLeft: 12,
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }} />
        <input type="checkbox" checked={checked} onChange={onChange}
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          aria-label={label}
        />
      </div>
    </label>
  );
}

export default function AccesibilidadMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  });

  // Aplicar al montar y al cambiar prefs
  useEffect(() => {
    applyToHtml(prefs);
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const toggle = useCallback((key) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }, []);

  const setTamano = useCallback((val) => {
    setPrefs(p => ({ ...p, tamano: val }));
  }, []);

  const resetAll = useCallback(() => {
    setPrefs({ ...DEFAULTS });
  }, []);

  const active = prefs.contraste || prefs.grises || prefs.dislexia || prefs.subrayar || prefs.tamano > 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
        title="Accesibilidad (MinTIC Res. 1519)"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: active ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.12)',
          color: '#fff',
          outline: active ? '2px solid rgba(255,255,255,.6)' : 'none',
          transition: 'background .15s',
          position: 'relative',
        }}
      >
        <IconA11y />
        {active && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 7, height: 7, borderRadius: '50%',
            background: '#0CAABC', border: '1.5px solid #053D58',
          }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1099 }}
            aria-hidden="true"
          />
          <div role="dialog" aria-label="Panel de accesibilidad" style={{
            position: 'absolute', top: 44, right: 0, zIndex: 1100,
            width: 300, background: '#fff',
            border: '1px solid #e2e8f0', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,.15)',
            padding: '16px 14px 14px',
          }}>
            {/* Cabecera panel */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#074A6A' }}>Accesibilidad</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>MinTIC — Res. 1519 de 2020</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar panel"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4, borderRadius: 6 }}>
                <IconClose />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>

              {/* Tamaño de texto */}
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Tamaño de texto</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { val: 0, label: 'A',  title: 'Normal'     },
                    { val: 1, label: 'A+', title: 'Grande'     },
                    { val: 2, label: 'A++',title: 'Muy grande' },
                  ].map(({ val, label, title }) => (
                    <button key={val} onClick={() => setTamano(val)} title={title}
                      aria-pressed={prefs.tamano === val}
                      style={{
                        flex: 1, padding: '6px 0', borderRadius: 7,
                        border: `1.5px solid ${prefs.tamano === val ? '#074A6A' : '#e2e8f0'}`,
                        background: prefs.tamano === val ? '#074A6A' : '#fff',
                        color: prefs.tamano === val ? '#fff' : '#475569',
                        fontSize: val === 0 ? 13 : val === 1 ? 15 : 17,
                        fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Toggle
                label="Alto contraste"
                desc="Fondo oscuro, texto brillante"
                checked={prefs.contraste}
                onChange={() => toggle('contraste')}
              />
              <Toggle
                label="Escala de grises"
                desc="Para personas con daltonismo"
                checked={prefs.grises}
                onChange={() => toggle('grises')}
              />
              <Toggle
                label="Fuente legible"
                desc="Mayor espaciado y tipografía simple"
                checked={prefs.dislexia}
                onChange={() => toggle('dislexia')}
              />
              <Toggle
                label="Subrayar enlaces"
                desc="Destacar todos los vínculos"
                checked={prefs.subrayar}
                onChange={() => toggle('subrayar')}
              />
            </div>

            {/* Restablecer */}
            {active && (
              <button onClick={resetAll} style={{
                width: '100%', marginTop: 12, padding: '8px', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff',
                fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer',
              }}>
                Restablecer configuración
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
