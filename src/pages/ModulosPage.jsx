import { useState } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { useModulosVisibles } from '../hooks/useModulosVisibles';
import { GROUPS } from '../data/constants';
import { modulos as MODULOS_DATA } from '../data/modulos';
import ModuloModal from '../components/ModuloModal';
import { addLog } from '../utils/auth';
import { MODULE_ICONS } from '../data/moduleIcons';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

// Módulos con página dedicada (ruta /modulos/:id/app)
const MODULOS_CON_APP = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]);

const MODULE_INFO = {
  1:  { que:'Registra cómo está el territorio antes de que el convenio llegue: cuántas familias viven allí, qué hacen, qué les hace falta y quiénes son los actores locales.',        por:'Sin una foto inicial clara del territorio no se puede medir el impacto del convenio al final. Construye la "línea de partida" que la ANH exige para comparar resultados.' },
  2:  { que:'Mide los mismos indicadores en tres momentos del convenio (inicio, mitad y cierre) para demostrar qué cambió gracias a la intervención.',                                 por:'La ANH paga desembolsos contra impacto demostrable. Convierte el esfuerzo territorial en evidencia medible y comparable.' },
  3:  { que:'Pone todo el convenio en un mapa: beneficiarios, zonas PDET, ZOMAC, CARs, comunidades étnicas y puntos de operación.',                                                    por:'Las decisiones territoriales se toman mejor con el mapa a la vista. Evita errores de planificación y facilita los informes geográficos exigidos por la ANH.' },
  4:  { que:'Analiza qué se produce en cada zona del convenio y cuál es su potencial real de exportación según TLCs vigentes y condiciones del mercado.',                              por:'El convenio busca llevar productos colombianos al mundo. Antes de invertir hay que saber cuáles clústeres tienen oportunidad real de competir.' },
  5:  { que:'Va al terreno y recolecta directamente con productores la información que completa el perfil de cada clúster (fichas de producto, encuestas, fitosanitarios).',           por:'Los datos de escritorio no bastan. La realidad del campo valida o corrige lo que se piensa del clúster desde la ciudad.' },
  6:  { que:'Administra el cumplimiento ambiental del convenio: planes de trabajo con las CARs, estudios técnicos, repositorio por región y seguimiento de compromisos.',              por:'El convenio tiene obligaciones ambientales específicas con 8 CARs. Sin trazabilidad documental no hay forma de demostrar su cumplimiento.' },
  7:  { que:'Registra y documenta todas las iniciativas sociales que el convenio ejecuta en las comunidades, con evidencia fotográfica y trazabilidad de compromisos.',                por:'Las obligaciones 8–10 del TdR ANH exigen demostrar cada peso invertido en impacto social. Sin evidencia organizada el desembolso peligra.' },
  8:  { que:'Detecta tempranamente conflictos en el territorio, los escala con SLAs comprometidos y documenta los espacios de diálogo y acuerdos alcanzados.',                         por:'Un conflicto no atendido puede paralizar la operación completa del convenio. Previene crisis antes de que se vuelvan irreversibles.' },
  9:  { que:'Estructura cada proyecto del convenio con la metodología oficial MGA-DNP: árbol de problemas, matriz marco lógico, Gantt y análisis de involucrados.',                    por:'Es el lenguaje que habla el Estado colombiano. Sin marco lógico un proyecto no se puede radicar ni sustentar ante entidades nacionales.' },
  10: { que:'Capacita en línea a los beneficiarios del convenio en habilidades productivas, emprendimiento y exportación, con rutas personalizadas según su perfil.',                  por:'Sin formación no hay empoderamiento real. Una plataforma LMS escalable llega a miles de personas donde no alcanzaría un instructor presencial.' },
  11: { que:'Forma a comunidades étnicas y rurales en derechos, participación, medio ambiente y transición energética, con material diferenciado culturalmente.',                       por:'La formación a comunidades no puede ser una sola para todos. Respeta la diferenciación cultural exigida por la ley y los protocolos de consulta previa.' },
  12: { que:'Certifica a todo el personal del convenio en inducción ETH, protocolos operativos, HSE y marco normativo antes de habilitarlos para operar.',                             por:'Ningún funcionario debe operar en campo sin certificación. La obligación 7 del TdR ANH lo exige de forma expresa.' },
  13: { que:'Lleva a los beneficiarios más avanzados por las fases 4–9 de exportación: puntaje, trámites, asignación de maquinaria y postulación a ferias internacionales.',          por:'Exportar tiene decenas de requisitos. Convierte a un productor pequeño en un exportador competitivo siguiendo un pipeline claro.' },
  14: { que:'Es el registro maestro del convenio: quién es cada beneficiario, dónde vive, qué hace, qué consentimientos firmó y qué curso está tomando.',                             por:'Con más de 10.000 personas beneficiarias no hay margen para improvisar. Casi todos los demás módulos dependen de este núcleo único de verdad.' },
  15: { que:'Administra la relación con todos los actores del territorio: operadoras, comunidades, autoridades, gremios y etnias, con historial de cada interacción.',                 por:'Los convenios viven o mueren por las relaciones. Guarda memoria institucional de cada encuentro, acuerdo y riesgo con cada actor.' },
  16: { que:'Gestiona los procesos de consulta previa con cabildos y resguardos, respetando protocolos étnicos y controlando etapas, acuerdos y firmas.',                             por:'La consulta previa es un derecho fundamental de las comunidades étnicas. Sin cumplirla, todo el convenio puede ser judicializado o detenido.' },
  17: { que:'Recibe CVs de convocatorias públicas, los califica automáticamente con puntaje ponderado y administra el pipeline de selección hasta la vinculación.',                    por:'La transparencia en la contratación la exige la ANH y la ESAL. Deja trazabilidad completa de cada decisión del proceso.' },
  18: { que:'Lleva toda la vida laboral del personal del convenio: contrato, seguridad social, salario, novedades, vencimientos y nómina consolidada.',                                por:'Un funcionario sin seguridad social al día no puede cobrar. Garantiza que no haya sorpresas financieras ni legales.' },
  19: { que:'Hace seguimiento a las 8 CARs y entidades nacionales con las que el convenio tiene compromisos, midiendo productos entregados y estado de la alianza.',                  por:'Las obligaciones 12 y 13 del TdR ANH dependen de estas alianzas. Un reporte atrasado puede comprometer el desembolso del convenio.' },
  20: { que:'Controla quién entra a la plataforma, qué puede hacer cada rol, registra toda acción con auditoría y activa MFA para roles financieros.',                                 por:'Habeas Data (Ley 1581/2012), MSPI y la ANH exigen control estricto. Sin este módulo la plataforma no puede operar legalmente.' },
  21: { que:'Muestra en una pantalla ejecutiva cómo va todo el convenio: % de avance por grupo, hitos próximos, semáforo de riesgos y estado de los 4 desembolsos.',                  por:'La dirección toma decisiones con datos, no con suposiciones. Un dashboard de una sola pantalla evita reuniones largas para entender el estado real.' },
  22: { que:'Lleva el presupuesto del convenio en 3 ítems + contrapartida, registra cada egreso, proyecta el cierre y controla la cuenta bancaria.',                                   por:'Gastar de más es incumplimiento contractual. Gastar de menos es riesgo de no generar impacto. Este módulo equilibra ambos extremos.' },
  23: { que:'Recibe, revisa y aprueba las cuentas de cobro mensuales de cada funcionario, con validación automática de seguridad social e informe aprobado.',                          por:'Más de 200 funcionarios con cobros mensuales implica alto riesgo de error humano. La automatización asegura el plazo legal de 5 días hábiles.' },
  24: { que:'Administra las sesiones mensuales entre ETH y ANH: convocatorias, orden del día, actas, quórum, aprobación de subcontratos y seguimiento de compromisos.',               por:'El comité es el órgano máximo de gobernanza del convenio. Sus decisiones deben quedar documentadas con numeración y trazabilidad total.' },
  25: { que:'Administra todos los subcontratos y compras del convenio, desde la solicitud inicial hasta la liquidación final, con minutas tipo reutilizables.',                        por:'Toda compra debe pasar por comité para cumplir los lineamientos ESAL. Sin pipeline trazable no hay transparencia en la contratación.' },
  26: { que:'Identifica, prioriza y planifica la mitigación de riesgos del convenio (operacionales, regulatorios y naturales) según la metodología CONPES 3714.',                     por:'Los riesgos no se eliminan, solo se anticipan. Convierte lo impredecible en gestionable con matriz de calor y planes concretos.' },
  27: { que:'Recibe los informes periódicos que cada funcionario debe presentar, los revisa bajo flujo de aprobación y habilita el pago cuando están aprobados.',                      por:'Sin informe aprobado no se paga. Las obligaciones 9, 11 y 19 del TdR ANH lo exigen y la ESAL requiere rendición de cuentas individual.' },
  28: { que:'Compila automáticamente los informes de rendición para los 4 desembolsos de la ANH (D1 plan, D2 35%, D3 70%, D4 final) jalando datos de múltiples módulos.',             por:'Armar un informe manual con datos de 6 módulos y 10.000 beneficiarios tomaría semanas. Automatizado toma minutos con menos errores.' },
  29: { que:'Almacena las mejores prácticas, metodologías y casos de éxito del convenio para que otras regiones y fases puedan replicarlas.',                                          por:'Si el conocimiento generado se pierde al terminar el convenio, se pierde parte sustancial de la inversión. Este módulo lo preserva y distribuye.' },
  30: { que:'Organiza cada evento del convenio: convocatoria masiva, registro de asistencia con QR, levantamiento de actas y seguimiento de compromisos.',                             por:'Un evento sin trazabilidad no cuenta como evidencia ante la ANH. Garantiza que cada actividad en terreno quede documentada.' },
  31: { que:'Administra costos de transporte, alojamiento, alimentación y sonido de cada evento, con validación de presupuesto y soporte documental por rubro.',                       por:'La logística es donde más se gastan recursos y donde más se pierden soportes. Este módulo cuida la chequera y organiza las evidencias.' },
  32: { que:'Crea, organiza y archiva todas las piezas de comunicación del convenio (fotos, videos, casos de éxito) y mide su alcance digital.',                                       por:'La obligación 10 del TdR ANH exige visibilidad. Los casos de éxito bien documentados son activos estratégicos del convenio.' },
  33: { que:'Previene y gestiona incidentes en campo, controla protocolos, registra la dotación EPP y verifica las certificaciones HSE de cada funcionario.',                          por:'Un incidente sin gestionar puede paralizar el convenio y tener consecuencias legales graves. Aquí se gestiona antes de que sea tarde.' },
  34: { que:'Organiza toda la documentación del convenio en carpetas jerárquicas (Región → Municipio → Componente) con nomenclatura automática y alertas de vencimiento.',            por:'Una auditoría final con documentos dispersos es un naufragio. Mantiene el archivo ordenado y listo para la ANH en todo momento.' },
  35: { que:'Lleva la trazabilidad de cada bien del convenio con QR único, GPS al momento de entrega, actas automáticas y seguimiento de ubicación mensual.',                         por:'La Resolución ANH 0532 de 2024 exige saber dónde está cada bien entregado. QR y georreferenciación lo resuelven con evidencia móvil.' },
  36: { que:'Gestiona todas las pólizas del convenio (cumplimiento 20%, calidad 10%, salarios 5%) con alertas automáticas a 60, 30 y 15 días antes del vencimiento.',                por:'Una póliza vencida bloquea el desembolso de la ANH sin negociación. Garantiza vigencia permanente y evita bloqueos de flujo de caja.' },
  37: { que:'Ejecuta el cierre ordenado del convenio con checklist interactivo de los 39 módulos, acta de liquidación, balance final y recolección de paz y salvos.',                 por:'Un mal cierre deja cabos sueltos y riesgos legales. Un buen cierre entrega un archivo completo, acta firmada y paz y salvo total.' },
  38: { que:'Recibe los problemas técnicos de los usuarios de la plataforma y los resuelve bajo SLAs comprometidos (2 h crítico, 8 h alto, 24 h medio).',                             por:'Si un módulo se cae y nadie responde, la operación del convenio se frena. Con SLA comprometido y escalamiento eso no puede suceder.' },
  39: { que:'Mantiene viva la plataforma con backups diarios, disponibilidad del 99.5 %, plan de contingencia activable y retención de datos por 24 meses.',                          por:'Sin plataforma no hay convenio. Es el seguro de vida del sistema: garantiza que nada importante se pierda bajo ningún escenario.' },
};

const moduloMap = Object.fromEntries(MODULOS_DATA.map(m => [m.id, m]));

function ModuleCardHeader({ moduloId, grupoId, grupoColor }) {
  const Icon = MODULE_ICONS[moduloId] || (() => null);
  return (
    <div style={{
      width: 'calc(100% + 2.5rem)',
      margin: '-1.1rem -1.25rem 1rem',
      height: '100px',
      borderRadius: '14px 14px 0 0',
      background: `linear-gradient(150deg, ${grupoColor}e6 0%, ${grupoColor}99 55%, ${grupoColor}18 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <span style={{
        position: 'absolute', fontSize: '96px', fontWeight: 900,
        color: 'rgba(255,255,255,0.08)', lineHeight: 1, userSelect: 'none',
        bottom: '-14px', right: '10px', fontFamily: 'var(--font)', letterSpacing: '-2px',
      }}>
        {grupoId}
      </span>
      <div style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
        <Icon />
      </div>
    </div>
  );
}

export default function ModulosPage() {
  const { user } = useOutletContext();
  const { modulosVisibles, loading, error } = useModulosVisibles(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedModulo, setSelectedModulo] = useState(null);
  const navigate = useNavigate();

  const filtroGrupo = searchParams.get('grupo') || '';
  const setFiltroGrupo = (val) => {
    if (val) setSearchParams({ grupo: val });
    else setSearchParams({});
  };

  function abrirModal(m, g) {
    if (MODULOS_CON_APP.has(m.id)) {
      addLog(user, 'ABRIR_MODULO', `#${m.id} — ${m.name}`);
      navigate(`/modulos/${m.id}/app`);
      return;
    }
    const richData = moduloMap[m.id];
    if (!richData) return;
    setSelectedModulo({ ...richData, grupoColor: g.color, grupoNombre: g.name });
    addLog(user, 'ABRIR_MODULO', `#${m.id} — ${m.name}`);
  }

  if (loading) return (
    <div>
      <div style={{ height: '32px', width: '120px', marginBottom: '20px' }} className="skeleton" />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ height: '40px', width: '240px' }} className="skeleton" />
        <div style={{ height: '40px', width: '180px' }} className="skeleton" />
      </div>
      <div className="modules-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div style={{ height: '100px', borderRadius: 'var(--radius-md)' }} className="skeleton" />
            <div style={{ height: '12px', width: '40%' }} className="skeleton" />
            <div style={{ height: '16px', width: '85%' }} className="skeleton" />
            <div style={{ height: '12px', width: '70%' }} className="skeleton" />
            <div style={{ height: '32px', width: '120px', marginTop: '4px' }} className="skeleton" />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const modulosFiltrados = modulosVisibles.filter(m => {
    const coincideGrupo    = !filtroGrupo || m.grupoId === filtroGrupo;
    const coincideBusqueda = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return coincideGrupo && coincideBusqueda;
  });

  const gruposAccesibles = GROUPS.filter(g => modulosVisibles.some(m => m.grupoId === g.id));
  const gruposConModulos = gruposAccesibles
    .map(g => ({ ...g, modulos: modulosFiltrados.filter(m => m.grupoId === g.id) }))
    .filter(g => g.modulos.length > 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--content-text)' }}>
        Módulos
      </h1>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          className="form-input"
          style={{ maxWidth: '240px' }}
          placeholder="Buscar módulo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={filtroGrupo}
          onChange={e => setFiltroGrupo(e.target.value)}
        >
          <option value="">Todos los grupos</option>
          {gruposAccesibles.map(g => (
            <option key={g.id} value={g.id}>{g.id} — {g.name}</option>
          ))}
        </select>
        {(filtroGrupo || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFiltroGrupo(''); setSearch(''); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {gruposConModulos.length === 0 && !search && !filtroGrupo && (
        <EmptyState
          icon="lock"
          title="Sin módulos asignados"
          description="Tu cuenta aún no tiene módulos habilitados. Contacta al administrador para solicitar acceso."
        />
      )}

      {gruposConModulos.length === 0 && (search || filtroGrupo) && (
        <EmptyState
          icon="search"
          title="Sin resultados"
          description={`No se encontraron módulos${search ? ` para "${search}"` : ''}${filtroGrupo ? ` en el grupo ${filtroGrupo}` : ''}. Prueba con otros términos.`}
          action={{ label: 'Limpiar filtros', onClick: () => { setSearch(''); setFiltroGrupo(''); } }}
        />
      )}

      {gruposConModulos.map(g => (
        <div key={g.id} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: g.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', flexShrink: 0,
            }}>
              {g.id}
            </span>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--content-text)' }}>{g.name}</span>
            <span className="badge" style={{ background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
              {g.modulos.length}
            </span>
          </div>

          <div className="modules-grid">
            {g.modulos.map(m => (
              <div
                key={m.id}
                className={`module-card group-${g.id.toLowerCase()}`}
                role="article"
                aria-label={`Módulo ${m.id}: ${m.name}`}
              >
                <ModuleCardHeader moduloId={m.id} grupoId={g.id} grupoColor={g.color} />
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--content-text-hint)', fontWeight: 500 }}>#{m.id}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: 'var(--content-text)', lineHeight: 1.35 }}>
                  {m.name}
                </div>
                {MODULE_INFO[m.id] && (
                  <div style={{ marginBottom: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: g.color, textTransform: 'uppercase', letterSpacing: '.05em' }}>¿Qué hace?</span>
                      <div style={{
                        fontSize: '12px', color: 'var(--content-text-muted)', lineHeight: 1.55,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {MODULE_INFO[m.id].que}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--content-text-hint)', textTransform: 'uppercase', letterSpacing: '.05em' }}>¿Por qué existe?</span>
                      <div style={{
                        fontSize: '11px', color: 'var(--content-text-hint)', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {MODULE_INFO[m.id].por}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => abrirModal(m, g)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', fontWeight: 600,
                    color: g.color, background: g.color + '12',
                    border: 'none', borderRadius: '6px',
                    padding: '5px 11px', cursor: 'pointer',
                    transition: 'background .15s', marginTop: 'auto',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = g.color + '22'}
                  onMouseLeave={e => e.currentTarget.style.background = g.color + '12'}
                >
                  Abrir módulo →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedModulo && (
        <ModuloModal modulo={selectedModulo} onClose={() => setSelectedModulo(null)} />
      )}
    </div>
  );
}
