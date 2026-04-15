/* =====================================================================
   DATOS DEMO — ETH-ANH 2026
   Datos completamente ficticios para fines de demostración.
   Cada entrada: { kpis: [...], tabla: { columnas, filas } }
   ===================================================================== */

export const demos = {

  // ─── GRUPO A ─────────────────────────────────────────────────────
  1: {
    kpis: [
      { label: "Municipios cubiertos", value: "24", sub: "de 32 objetivo", color: "#1B6B4A" },
      { label: "Actores mapeados",     value: "312", sub: "+18 este mes",   color: "#059669" },
      { label: "% Cobertura",         value: "75%",  sub: "en progreso",   color: "#0369A1" },
      { label: "Alertas activas",     value: "3",    sub: "requieren atención", color: "#DC2626" },
    ],
    tabla: {
      columnas: ["Municipio", "Departamento", "Actores", "% Diagnóstico", "Estado"],
      filas: [
        ["Tibú",            "N. de Santander", "42", "88%", "✅ Completo"],
        ["El Tarra",        "N. de Santander", "18", "65%", "🔄 En proceso"],
        ["La Gabarra",      "N. de Santander", "31", "72%", "🔄 En proceso"],
        ["Teorama",         "N. de Santander", "25", "90%", "✅ Completo"],
        ["Convención",      "N. de Santander", "38", "45%", "⚠️ Pendiente"],
        ["Puerto Wilches",  "Santander",       "29", "82%", "✅ Completo"],
        ["Barrancabermeja", "Santander",       "55", "95%", "✅ Completo"],
      ],
    },
  },

  2: {
    kpis: [
      { label: "Indicadores activos", value: "48",  sub: "total definidos",    color: "#1B6B4A" },
      { label: "Con meta cumplida",   value: "31",  sub: "64% del total",      color: "#059669" },
      { label: "En riesgo",           value: "9",   sub: "requieren acción",   color: "#B45309" },
      { label: "% Avance global",     value: "67%", sub: "según plan DNP",     color: "#0369A1" },
    ],
    tabla: {
      columnas: ["Indicador", "Línea base", "Meta", "Actual", "% Avance", "Semáforo"],
      filas: [
        ["Familias beneficiadas",       "0",    "1.200", "847",  "71%", "🟡 En progreso"],
        ["Hectáreas intervenidas",      "0",    "3.500", "2.890","83%", "🟢 En meta"],
        ["Empleos directos generados",  "120",  "450",   "312",  "58%", "🟡 En progreso"],
        ["Exportadores certificados",   "0",    "80",    "24",   "30%", "🔴 En riesgo"],
        ["Acuerdos de diálogo firmados","0",    "60",    "54",   "90%", "🟢 En meta"],
        ["Formados con certificación",  "0",    "2.000", "1.340","67%", "🟡 En progreso"],
      ],
    },
  },

  3: {
    kpis: [
      { label: "Capas activas",       value: "14",   sub: "E&P, CARs, PDET, ZOMAC", color: "#1B6B4A" },
      { label: "Municipios mapeados", value: "32",   sub: "cobertura total",         color: "#059669" },
      { label: "Puntos de interés",   value: "1.847",sub: "georeferenciados",        color: "#0369A1" },
      { label: "Km² cubiertos",       value: "42.300",sub: "área de influencia",     color: "#B45309" },
    ],
    tabla: {
      columnas: ["Capa temática", "Tipo", "Municipios", "Puntos", "Última actualiz.", "Estado"],
      filas: [
        ["Bloques E&P",        "Operativo", "32", "156",   "15/04/2026", "✅ Activa"],
        ["CARs — límites",     "Ambiental", "32", "8",     "10/04/2026", "✅ Activa"],
        ["Zonas PDET",         "Político",  "18", "18",    "01/03/2026", "✅ Activa"],
        ["ZOMAC activas",      "Fiscal",    "14", "14",    "01/01/2026", "✅ Activa"],
        ["Resguardos indígenas","Étnico",   "11", "34",    "20/02/2026", "✅ Activa"],
        ["Áreas protegidas",   "Ambiental", "32", "89",    "15/03/2026", "🔄 Actualizando"],
        ["Vías de acceso",     "Logístico", "32", "1.528", "12/04/2026", "✅ Activa"],
      ],
    },
  },

  4: {
    kpis: [
      { label: "Productos analizados",     value: "23",   sub: "cadenas productivas",    color: "#1B6B4A" },
      { label: "Con potencial exportador", value: "11",   sub: "validados por mercado",  color: "#059669" },
      { label: "Clústeres identificados",  value: "6",    sub: "en 4 regiones",          color: "#0369A1" },
      { label: "Empleos proyectados",      value: "2.840",sub: "en 3 años",              color: "#B45309" },
    ],
    tabla: {
      columnas: ["Producto", "Región", "Mercado destino", "Precio USD/kg", "Potencial", "Estado"],
      filas: [
        ["Cacao fino de aroma",   "Norte de Santander", "Bélgica, Alemania", "$4.20", "Alto",  "🟢 En desarrollo"],
        ["Aguacate Hass",         "Santander",          "Países Bajos, UK",  "$2.80", "Alto",  "🟢 En desarrollo"],
        ["Miel de abejas nativa", "Arauca",             "Japón, EE.UU.",     "$9.50", "Medio", "🟡 Evaluando"],
        ["Madera certificada",    "Vichada",            "China, Corea",      "$1.40", "Medio", "🟡 Evaluando"],
        ["Frutas exóticas",       "Putumayo",           "EE.UU., Canadá",   "$3.60", "Alto",  "🟢 En desarrollo"],
        ["Piscicultura",          "Meta",               "EE.UU., México",   "$5.10", "Bajo",  "🔴 En análisis"],
      ],
    },
  },

  5: {
    kpis: [
      { label: "Encuestas diseñadas", value: "12",  sub: "fichas activas",       color: "#1B6B4A" },
      { label: "Registros capturados",value: "4.328",sub: "este trimestre",      color: "#059669" },
      { label: "Tasa de respuesta",   value: "91%", sub: "sobre meta del 85%",  color: "#0369A1" },
      { label: "Pendientes validar",  value: "87",  sub: "en cola de revisión", color: "#B45309" },
    ],
    tabla: {
      columnas: ["Municipio", "Encuestados", "Completados", "Validados", "% Completado", "Responsable"],
      filas: [
        ["Tibú",           "180", "172", "165", "95%", "Ing. Rodríguez, A."],
        ["El Tarra",       "94",  "88",  "80",  "94%", "Tec. Martínez, C."],
        ["Puerto Wilches", "210", "198", "190", "94%", "Ing. López, M."],
        ["Convención",     "156", "132", "110", "85%", "Tec. García, P."],
        ["Teorama",        "120", "115", "112", "96%", "Ing. Suárez, J."],
        ["Ábrego",         "98",  "87",  "72",  "89%", "Tec. Vargas, L."],
      ],
    },
  },

  // ─── GRUPO B ─────────────────────────────────────────────────────
  6: {
    kpis: [
      { label: "CARs vinculadas",      value: "8",   sub: "de las 8 regiones",    color: "#B45309" },
      { label: "Estudios técnicos",    value: "34",  sub: "en repositorio",       color: "#059669" },
      { label: "Alertas ambientales",  value: "5",   sub: "en monitoreo activo",  color: "#DC2626" },
      { label: "Documentos activos",   value: "127", sub: "último trimestre",     color: "#0369A1" },
    ],
    tabla: {
      columnas: ["CAR", "Región", "Acuerdos vigentes", "Estudios activos", "Estado", "Prox. reunión"],
      filas: [
        ["CORPONOR",   "N. de Santander", "4", "6", "✅ Activa", "22/04/2026"],
        ["CAS",        "Santander",       "3", "5", "✅ Activa", "25/04/2026"],
        ["CORPORINOQUIA","Arauca/Meta",   "2", "4", "🔄 En gestión", "30/04/2026"],
        ["CORMACARENA", "Meta",           "3", "7", "✅ Activa", "28/04/2026"],
        ["CORPOAMAZONIA","Putumayo",      "1", "3", "⚠️ Pendiente", "05/05/2026"],
        ["CORNARE",    "Antioquia",       "2", "4", "✅ Activa", "20/04/2026"],
        ["CVS",        "Córdoba",         "2", "3", "✅ Activa", "23/04/2026"],
        ["CODECHOCÓ",  "Chocó",           "1", "2", "🔄 En gestión", "15/05/2026"],
      ],
    },
  },

  7: {
    kpis: [
      { label: "Iniciativas activas",  value: "18",   sub: "en 6 regiones",         color: "#B45309" },
      { label: "Ejecutando",           value: "12",   sub: "con evidencias cargadas",color: "#059669" },
      { label: "Inversión total ($M)", value: "$4.2", sub: "presupuestados",         color: "#0369A1" },
      { label: "Beneficiarios",        value: "2.340",sub: "impacto directo",        color: "#7C3AED" },
    ],
    tabla: {
      columnas: ["Iniciativa", "Municipio", "Inversión ($M)", "% Avance", "Beneficiarios", "Estado"],
      filas: [
        ["Huertas comunitarias",         "Tibú",            "$0.38", "78%", "120", "🟢 En ejecución"],
        ["Vivero forestal comunitario",  "El Tarra",        "$0.22", "55%", "85",  "🟡 En proceso"],
        ["Piscicultura familiar",        "Convención",      "$0.45", "90%", "200", "🟢 En ejecución"],
        ["Apicultura tecnificada",       "Puerto Wilches",  "$0.31", "40%", "95",  "🔴 Con retraso"],
        ["Artesanías con identidad",     "Teorama",         "$0.18", "65%", "60",  "🟡 En proceso"],
        ["Turismo comunitario",          "Ábrego",          "$0.29", "20%", "40",  "🔴 En inicio"],
      ],
    },
  },

  8: {
    kpis: [
      { label: "Alertas activas",         value: "7",  sub: "en monitoreo",        color: "#B45309" },
      { label: "Diálogos realizados",     value: "34", sub: "este semestre",       color: "#059669" },
      { label: "Acuerdos suscritos",      value: "28", sub: "92% con seguimiento", color: "#0369A1" },
      { label: "% Cumplimiento SLA",      value: "87%",sub: "meta: 90%",           color: "#DC2626" },
    ],
    tabla: {
      columnas: ["Alerta / Mesa", "Municipio", "Tipo", "Fecha apertura", "SLA", "Estado"],
      filas: [
        ["Mesa energía renovable",    "Tibú",           "Diálogo social", "10/01/2026", "30 días", "✅ Acuerdo suscrito"],
        ["Bloqueo vía La Gabarra",    "La Gabarra",     "Conflictividad",  "22/02/2026", "15 días", "🔄 En negociación"],
        ["Disputa tierras productivas","El Tarra",      "Conflictividad",  "05/03/2026", "20 días", "⚠️ Escalada"],
        ["Mesa afrocolombianos",      "Puerto Wilches", "Étnico",          "15/01/2026", "45 días", "✅ Acuerdo suscrito"],
        ["Mesa productores cacao",    "Teorama",        "Productivo",      "18/03/2026", "30 días", "🔄 En proceso"],
        ["Alerta ambiental Catatumbo","Convención",     "Ambiental",       "01/04/2026", "10 días", "⚠️ Urgente"],
      ],
    },
  },

  9: {
    kpis: [
      { label: "Proyectos formulados", value: "14",   sub: "ciclo 2025-2026",    color: "#B45309" },
      { label: "Aprobados ante DNP",   value: "8",    sub: "en el MGA",          color: "#059669" },
      { label: "En ejecución",         value: "5",    sub: "con recursos ANH",   color: "#0369A1" },
      { label: "Recursos totales ($M)",value: "$12.8",sub: "comprometidos",      color: "#7C3AED" },
    ],
    tabla: {
      columnas: ["Proyecto", "Responsable", "Recursos ($M)", "% Formulación", "Estado MGA"],
      filas: [
        ["Cadena cacao Catatumbo",      "Coord. Ramírez",  "$2.4",  "100%", "✅ Aprobado"],
        ["Infraestructura vial rural",  "Coord. Díaz",     "$3.8",  "100%", "✅ Aprobado"],
        ["Centro acopio aguacate",      "Coord. Torres",   "$1.6",  "80%",  "🔄 En revisión"],
        ["Parque solar comunitario",    "Coord. Mendoza",  "$2.1",  "100%", "✅ Aprobado"],
        ["Acueducto veredal",           "Coord. Herrera",  "$0.9",  "60%",  "🔄 Formulando"],
        ["Planta de cacao tecnificada", "Coord. Castro",   "$2.0",  "100%", "✅ Aprobado"],
      ],
    },
  },

  // ─── GRUPO C ─────────────────────────────────────────────────────
  10: {
    kpis: [
      { label: "Cursos activos",   value: "15",   sub: "en 3 modalidades", color: "#7C3AED" },
      { label: "Inscritos",        value: "1.847",sub: "beneficiarios",    color: "#059669" },
      { label: "Certificados",     value: "1.203",sub: "65% de inscritos", color: "#0369A1" },
      { label: "% Promedio global",value: "74%",  sub: "sobre meta 70%",  color: "#B45309" },
    ],
    tabla: {
      columnas: ["Curso", "Modalidad", "Inscritos", "Completados", "% Completado", "Estado"],
      filas: [
        ["Buenas prácticas agrícolas",    "Presencial", "340", "298", "88%", "✅ En curso"],
        ["Emprendimiento rural",          "Virtual",    "520", "341", "66%", "🔄 En curso"],
        ["Comercio exterior básico",      "Virtual",    "210", "124", "59%", "🔄 En curso"],
        ["Manipulación de alimentos",     "Presencial", "180", "175", "97%", "✅ Finalizado"],
        ["Asociatividad y cooperativas",  "Híbrido",    "290", "198", "68%", "🔄 En curso"],
        ["Finanzas para emprendedores",   "Virtual",    "307", "167", "54%", "⚠️ En riesgo"],
      ],
    },
  },

  11: {
    kpis: [
      { label: "Comunidades activas", value: "28",   sub: "en 6 regiones",      color: "#7C3AED" },
      { label: "Participantes",       value: "934",  sub: "inscritos activos",  color: "#059669" },
      { label: "Certificados",        value: "612",  sub: "65% de participantes",color: "#0369A1" },
      { label: "Módulos activos",     value: "9",    sub: "derechos y ambiente", color: "#B45309" },
    ],
    tabla: {
      columnas: ["Comunidad", "Municipio", "Participantes", "% Avance", "Certificados", "Facilitador"],
      filas: [
        ["Resguardo Catalaura",    "Tibú",           "45", "82%", "37", "Lic. Murillo, A."],
        ["Consejo Comunitario Sur","Puerto Wilches",  "78", "71%", "55", "Lic. Parra, S."],
        ["Cabildo Motilón Barí",   "El Tarra",       "34", "65%", "22", "Lic. Murillo, A."],
        ["Comunidad La Gabarra",   "La Gabarra",     "62", "58%", "36", "Lic. Hernández, O."],
        ["ASOCOMUN Convención",    "Convención",     "89", "78%", "69", "Lic. Parra, S."],
        ["JAC Veredal Tibú",       "Tibú",           "53", "90%", "48", "Lic. Hernández, O."],
      ],
    },
  },

  12: {
    kpis: [
      { label: "Personal vinculado",  value: "87",  sub: "en activo",            color: "#7C3AED" },
      { label: "Con inducción ETH",   value: "82",  sub: "94% cumplimiento",     color: "#059669" },
      { label: "Certificados HSE",    value: "79",  sub: "91% del equipo",       color: "#0369A1" },
      { label: "% Cumplimiento",      value: "94%", sub: "sobre meta 90%",       color: "#B45309" },
    ],
    tabla: {
      columnas: ["Nombre", "Cargo", "Inducción ETH", "Cert. HSE", "Actualización", "Estado"],
      filas: [
        ["Rodríguez Peña, Ana",   "Coord. Territorial", "✅ Completa",  "✅ Vigente",   "15/03/2026", "Activo"],
        ["Martínez Cruz, Carlos", "Técnico de campo",   "✅ Completa",  "✅ Vigente",   "10/03/2026", "Activo"],
        ["López Gómez, María",    "Profesional social", "✅ Completa",  "⚠️ Por renovar","01/02/2026", "Activo"],
        ["García Ríos, Pedro",    "Ingeniero agrónomo", "✅ Completa",  "✅ Vigente",   "20/03/2026", "Activo"],
        ["Suárez Villa, Juliana", "Profesional jurídica","⚠️ Pendiente","✅ Vigente",   "—",          "Pendiente"],
        ["Vargas Mora, Luis",     "Asesor financiero",  "✅ Completa",  "✅ Vigente",   "05/04/2026", "Activo"],
      ],
    },
  },

  13: {
    kpis: [
      { label: "Planes de negocio",    value: "34",   sub: "formulados",          color: "#7C3AED" },
      { label: "Validados por mercado",value: "21",   sub: "con estudio de demanda",color: "#059669" },
      { label: "Ferias participadas",  value: "5",    sub: "nacionales e internacionales",color: "#0369A1" },
      { label: "Exportadores activos", value: "8",    sub: "primera exportación",  color: "#B45309" },
    ],
    tabla: {
      columnas: ["Producto / Asociación", "País destino", "Estado plan", "Trámites", "Exportación", "Próxima acción"],
      filas: [
        ["Cacao — ASOCATIBÚ",     "Bélgica",      "✅ Aprobado",   "90% listos", "🟢 En proceso", "Envío prueba mayo"],
        ["Aguacate — AGROPLUS",   "Países Bajos", "✅ Aprobado",   "75% listos", "🟡 En trámite",  "Certificación ICA"],
        ["Miel — APICOOP",        "Japón",        "🔄 Revisando",  "40% listos", "🔴 En preparación","Estudio de mercado"],
        ["Frutas — FRUTICOR",     "EE.UU.",       "✅ Aprobado",   "60% listos", "🟡 En trámite",  "FDA pre-approval"],
        ["Madera — MADECOOP",     "China",        "🔄 Revisando",  "20% listos", "🔴 En preparación","Certificación FSC"],
      ],
    },
  },

  // ─── GRUPO D ─────────────────────────────────────────────────────
  14: {
    kpis: [
      { label: "Beneficiarios registrados", value: "3.847",sub: "en base activa",    color: "#0369A1" },
      { label: "Activos",                   value: "3.412",sub: "88% del total",     color: "#059669" },
      { label: "Incorporados este mes",     value: "128",  sub: "+3.4% mes anterior",color: "#7C3AED" },
      { label: "Puntaje promedio",          value: "68/100",sub: "escala ANH",       color: "#B45309" },
    ],
    tabla: {
      columnas: ["Nombre", "Municipio", "Actividad productiva", "Puntaje", "Estado"],
      filas: [
        ["Gómez Reyes, Martha",   "Tibú",           "Cacaocultura",    "85", "✅ Activo"],
        ["Pérez Leal, Roberto",   "El Tarra",       "Piscicultura",    "72", "✅ Activo"],
        ["Torres Cruz, Carmen",   "Puerto Wilches", "Apicultura",      "91", "✅ Activo"],
        ["Díaz Fuentes, Jorge",   "Convención",     "Aguacate Hass",   "63", "⚠️ Seguimiento"],
        ["Herrera Paz, Luz",      "Teorama",        "Artesanías",      "78", "✅ Activo"],
        ["Castro Vera, Álvaro",   "La Gabarra",     "Ganadería menor", "45", "🔴 En riesgo"],
        ["Mendoza Ríos, Patricia","Ábrego",         "Horticultura",    "82", "✅ Activo"],
      ],
    },
  },

  15: {
    kpis: [
      { label: "Actores registrados", value: "284", sub: "en 4 categorías",     color: "#0369A1" },
      { label: "Operadoras",          value: "12",  sub: "aliadas del convenio",color: "#059669" },
      { label: "Comunidades",         value: "48",  sub: "vinculadas",          color: "#7C3AED" },
      { label: "Autoridades",         value: "67",  sub: "locales y nacionales",color: "#B45309" },
    ],
    tabla: {
      columnas: ["Actor", "Tipo", "Municipio", "Contacto principal", "Estado relación"],
      filas: [
        ["ETH — Equipo territorial",      "Operadora",   "Regional",           "Dir. Sánchez, R.",   "✅ Activo"],
        ["Alcaldía Tibú",                 "Autoridad",   "Tibú",               "Secretaría Planeación","✅ Activo"],
        ["CAS",                           "CAR",         "Santander",          "Subdirector Técnico", "✅ Activo"],
        ["CORPONOR",                      "CAR",         "N. de Santander",    "Dir. Ambiental",      "✅ Activo"],
        ["Resguardo Catalaura",           "Comunidad étnica","Tibú",           "Gobernador Indígena", "🔄 En proceso"],
        ["ASOCATIBÚ",                     "Asociación",  "Tibú",               "Presidenta Gómez, M.","✅ Activo"],
        ["Agencia Nacional de Hidrocarburos","Ente contratante","Nacional",    "Coordinador ANH",     "✅ Activo"],
      ],
    },
  },

  16: {
    kpis: [
      { label: "Procesos activos",  value: "6",  sub: "en curso legal",         color: "#0369A1" },
      { label: "Completados",       value: "3",  sub: "con acta de acuerdo",    color: "#059669" },
      { label: "Acuerdos suscritos",value: "14", sub: "compromisos activos",    color: "#7C3AED" },
      { label: "Comunidades",       value: "11", sub: "cabildos y resguardos",  color: "#B45309" },
    ],
    tabla: {
      columnas: ["Comunidad", "Tipo", "Municipio", "Estado proceso", "Fecha inicio", "Representante"],
      filas: [
        ["Resguardo Catalaura",    "Indígena",        "Tibú",           "🔄 En consulta",    "15/01/2026", "Gobernador Aricapú"],
        ["Cabildo Motilón Barí",   "Indígena",        "El Tarra",       "✅ Acuerdo firmado","01/11/2025", "Cacique Boyoy"],
        ["Consejo Afro Sur",       "Afrodescendiente","Puerto Wilches",  "🔄 En consulta",    "20/02/2026", "Pres. Mosquera"],
        ["JAC La Gabarra",         "Campesino",       "La Gabarra",     "✅ Acuerdo firmado","15/09/2025", "Pres. Ríos, M."],
        ["Resguardo Bachira",      "Indígena",        "El Tarra",       "⚠️ En revisión",    "10/03/2026", "Gobernador Peña"],
        ["Comunidad Veredal Norte","Campesino",       "Convención",     "🔄 En consulta",    "01/04/2026", "Rep. Fuentes, J."],
      ],
    },
  },

  17: {
    kpis: [
      { label: "Vacantes abiertas", value: "8",  sub: "activas",               color: "#0369A1" },
      { label: "Postulantes",       value: "143",sub: "CVs recibidos",         color: "#059669" },
      { label: "En evaluación",     value: "34", sub: "etapa técnica",         color: "#7C3AED" },
      { label: "Contratados",       value: "5",  sub: "este trimestre",        color: "#B45309" },
    ],
    tabla: {
      columnas: ["Cargo", "Región", "Postulantes", "Etapa actual", "Responsable RR.HH.", "Fecha límite"],
      filas: [
        ["Coord. Territorial Sur",      "Meta",           "28", "✅ Oferta enviada",     "Dir. Parra, L.",   "30/04/2026"],
        ["Ingeniero Agrónomo Senior",   "N. de Santander","22", "🔄 Entrevista técnica", "Mgr. Silva, C.",   "25/04/2026"],
        ["Profesional Social",          "Santander",      "34", "🔄 Prueba psicotécnica","Dir. Parra, L.",   "28/04/2026"],
        ["Asesor Jurídico",             "Regional",       "18", "📋 Revisión de CVs",   "Mgr. Silva, C.",   "15/05/2026"],
        ["Técnico de campo x2",         "Arauca",         "41", "📋 Revisión de CVs",   "Dir. Parra, L.",   "20/05/2026"],
      ],
    },
  },

  18: {
    kpis: [
      { label: "Personal vinculado",   value: "87",  sub: "contratos activos",    color: "#0369A1" },
      { label: "Alertas seguridad social",value: "4",sub: "pendientes de regularizar",color: "#DC2626" },
      { label: "Novedades del mes",    value: "12",  sub: "licencias, incapacidades",color: "#B45309" },
      { label: "Contratos por vencer", value: "7",   sub: "próximos 30 días",     color: "#7C3AED" },
    ],
    tabla: {
      columnas: ["Nombre", "Cargo", "Región", "Estado SS", "Contrato hasta", "Novedad"],
      filas: [
        ["Rodríguez, Ana",     "Coord. Territorial", "N. Santander","✅ Al día",      "31/12/2026", "—"],
        ["Martínez, Carlos",   "Técnico de campo",   "Santander",   "✅ Al día",      "30/06/2026", "—"],
        ["López, María",       "Prof. social",        "Meta",        "⚠️ Mora EPS",    "31/12/2026", "Mora 1 mes"],
        ["García, Pedro",      "Ing. agrónomo",       "Arauca",      "✅ Al día",      "31/03/2026", "⚠️ Vence 15 días"],
        ["Suárez, Juliana",    "Prof. jurídica",      "Regional",    "✅ Al día",      "31/12/2026", "Licencia médica"],
        ["Vargas, Luis",       "Asesor financiero",   "Regional",    "⚠️ Mora pension","30/06/2026", "Mora 2 meses"],
      ],
    },
  },

  19: {
    kpis: [
      { label: "Entidades aliadas",     value: "23",  sub: "activas en convenio",    color: "#0369A1" },
      { label: "CARs activas",          value: "8",   sub: "8 regiones cubiertas",   color: "#059669" },
      { label: "Compromisos totales",   value: "156", sub: "productos / entregables", color: "#7C3AED" },
      { label: "% Cumplimiento",        value: "78%", sub: "sobre compromisos totales",color: "#B45309" },
    ],
    tabla: {
      columnas: ["Entidad", "Tipo", "Región", "Comprometidos", "Entregados", "Estado"],
      filas: [
        ["CORPONOR",                "CAR",          "N. de Santander","12", "10", "🟢 83%"],
        ["CAS",                     "CAR",          "Santander",      "10", "8",  "🟢 80%"],
        ["SENA regional",           "Formación",    "Nacional",       "8",  "5",  "🟡 63%"],
        ["Cámara Comercio Cúcuta",  "Gremio",       "N. de Santander","6",  "6",  "🟢 100%"],
        ["Alcaldía Tibú",           "Municipio",    "Tibú",           "15", "9",  "🟡 60%"],
        ["Gobernación Santander",   "Depto.",       "Santander",      "20", "12", "🔴 60%"],
        ["Agencia Renovación Terr.","ART",          "Nacional",       "18", "14", "🟢 78%"],
      ],
    },
  },

  // ─── GRUPO E ─────────────────────────────────────────────────────
  20: {
    kpis: [
      { label: "Usuarios activos",     value: "87",  sub: "en 5 roles",            color: "#DC2626" },
      { label: "Roles definidos",      value: "5",   sub: "admin, coord, técnico…",color: "#0369A1" },
      { label: "Eventos de auditoría", value: "1.243",sub: "último mes",           color: "#7C3AED" },
      { label: "Alertas de seguridad", value: "2",   sub: "en investigación",      color: "#B45309" },
    ],
    tabla: {
      columnas: ["Usuario", "Rol", "Último acceso", "Módulos asignados", "MFA", "Estado"],
      filas: [
        ["admin@eth-anh.co",          "Administrador",    "15/04/2026 08:30", "39", "✅ Activo",    "Activo"],
        ["coord.norte@eth-anh.co",    "Coordinador",      "15/04/2026 07:45", "28", "✅ Activo",    "Activo"],
        ["tecnico1@eth-anh.co",       "Técnico de campo", "14/04/2026 16:20", "12", "⚠️ Pendiente","Activo"],
        ["financiero@eth-anh.co",     "Financiero",       "15/04/2026 09:10", "15", "✅ Activo",    "Activo"],
        ["juridico@eth-anh.co",       "Asesor jurídico",  "12/04/2026 11:00", "8",  "⚠️ Pendiente","Activo"],
        ["externo1@operadora.co",     "Externo",          "01/03/2026 14:30", "3",  "❌ Sin MFA",  "⚠️ Revisar"],
      ],
    },
  },

  21: {
    kpis: [
      { label: "Hitos totales",    value: "124", sub: "plan operativo 2026",   color: "#DC2626" },
      { label: "Completados",      value: "78",  sub: "63% del plan",          color: "#059669" },
      { label: "En progreso",      value: "32",  sub: "según cronograma",      color: "#0369A1" },
      { label: "Críticos/atrasados",value: "14", sub: "requieren acción",      color: "#B45309" },
    ],
    tabla: {
      columnas: ["Hito", "Responsable", "Fecha límite", "% Avance", "Semáforo", "Desembolso"],
      filas: [
        ["Plan operativo D1 aprobado",     "Dir. Convenio",     "28/02/2026", "100%", "🟢 Completado", "D1"],
        ["1er informe técnico ANH",        "Coord. técnico",    "31/03/2026", "100%", "🟢 Completado", "D1"],
        ["500 beneficiarios registrados",  "Coord. social",     "30/04/2026", "87%",  "🟡 En progreso","D2"],
        ["8 CARs vinculadas",              "Coord. ambiental",  "30/04/2026", "100%", "🟢 Completado", "D2"],
        ["Plataforma digital operativa",   "Coord. TI",         "15/05/2026", "60%",  "🔴 Atrasado",  "D2"],
        ["Primer desembolso ejecutado 35%","Dir. financiero",   "31/05/2026", "45%",  "🔴 En riesgo", "D2"],
      ],
    },
  },

  22: {
    kpis: [
      { label: "Presupuesto total",  value: "$18.4M",sub: "convenio ANH",        color: "#DC2626" },
      { label: "Ejecutado",          value: "$7.2M", sub: "39% de ejecución",    color: "#059669" },
      { label: "Disponible",         value: "$11.2M",sub: "3 desembolsos pend.", color: "#0369A1" },
      { label: "% Ejecución",        value: "39%",   sub: "meta D2: 35%",        color: "#B45309" },
    ],
    tabla: {
      columnas: ["Rubro presupuestal", "Presupuesto ($M)", "Ejecutado ($M)", "Disponible ($M)", "% Ejec.", "Semáforo"],
      filas: [
        ["1. Gastos de personal",           "$5.8M", "$2.9M", "$2.9M", "50%", "🟢 En meta"],
        ["2. Gastos operativos y logística", "$3.2M", "$1.4M", "$1.8M", "44%", "🟢 En meta"],
        ["3. Inversión social directa",      "$7.4M", "$2.1M", "$5.3M", "28%", "🔴 Bajo"],
        ["4. Contrapartida ETH",             "$2.0M", "$0.8M", "$1.2M", "40%", "🟡 Aceptable"],
      ],
    },
  },

  23: {
    kpis: [
      { label: "Radicadas este mes", value: "74",  sub: "de 87 esperadas",       color: "#DC2626" },
      { label: "Aprobadas",          value: "61",  sub: "82% de radicadas",      color: "#059669" },
      { label: "Pendientes revisión",value: "13",  sub: "en plazo de 5 días",    color: "#B45309" },
      { label: "Rechazadas",         value: "3",   sub: "inconsistencia SS",     color: "#7C3AED" },
    ],
    tabla: {
      columnas: ["Profesional", "Periodo", "Monto ($)", "SS verificado", "Fecha radicación", "Estado"],
      filas: [
        ["Rodríguez, Ana",   "Marzo 2026", "$4.850.000", "✅ OK", "01/04/2026", "✅ Aprobada"],
        ["Martínez, Carlos", "Marzo 2026", "$3.200.000", "✅ OK", "01/04/2026", "✅ Aprobada"],
        ["López, María",     "Marzo 2026", "$3.200.000", "⚠️ Mora EPS","02/04/2026","⚠️ Devuelta"],
        ["García, Pedro",    "Marzo 2026", "$3.800.000", "✅ OK", "03/04/2026", "🔄 En revisión"],
        ["Suárez, Juliana",  "Marzo 2026", "$4.200.000", "✅ OK", "02/04/2026", "✅ Aprobada"],
        ["Vargas, Luis",     "Marzo 2026", "$4.500.000", "⚠️ Mora pensión","04/04/2026","⚠️ Devuelta"],
      ],
    },
  },

  24: {
    kpis: [
      { label: "Sesiones realizadas",    value: "4",  sub: "2026 (meta: 12/año)",   color: "#DC2626" },
      { label: "Actas aprobadas",        value: "4",  sub: "100% de sesiones",      color: "#059669" },
      { label: "Subcontratos aprobados", value: "12", sub: "en comité",             color: "#0369A1" },
      { label: "Próxima sesión",         value: "28 Abr",sub: "comité ordinario",   color: "#B45309" },
    ],
    tabla: {
      columnas: ["Sesión", "Fecha", "Quórum", "Temas tratados", "Acuerdos", "Acta"],
      filas: [
        ["Comité #01-2026","20/01/2026","✅ 5/5","Arranque convenio, asignación roles","3","✅ Aprobada"],
        ["Comité #02-2026","17/02/2026","✅ 4/5","Plan operativo D1, subcontratos","5","✅ Aprobada"],
        ["Comité #03-2026","24/03/2026","✅ 5/5","Ejecución financiera, avance social","4","✅ Aprobada"],
        ["Comité #04-2026","15/04/2026","✅ 5/5","Preparación informe D2, adquisiciones","6","🔄 En firma"],
        ["Comité #05-2026","28/04/2026","—",     "Agenda por confirmar","—","📅 Programada"],
      ],
    },
  },

  25: {
    kpis: [
      { label: "Contratos activos",  value: "18",   sub: "en ejecución",        color: "#DC2626" },
      { label: "Por adjudicar",      value: "5",    sub: "en proceso licitación",color: "#B45309" },
      { label: "Valor total ($M)",   value: "$6.4M",sub: "contratado",          color: "#0369A1" },
      { label: "% Ejecución",        value: "52%",  sub: "del valor contratado",color: "#059669" },
    ],
    tabla: {
      columnas: ["Contrato / TdR", "Proveedor / ESAL", "Valor ($M)", "Estado", "Fecha inicio", "Vence"],
      filas: [
        ["Servicios logística eventos", "TransLogCo S.A.S.",   "$0.80M","✅ En ejecución","01/02/2026","31/12/2026"],
        ["Comunicaciones y prensa",     "Agencia Innovar",     "$0.45M","✅ En ejecución","01/02/2026","30/06/2026"],
        ["Asesoría técnica ambiental",  "EcoConsult Ltda.",    "$1.20M","✅ En ejecución","15/01/2026","31/12/2026"],
        ["Plataforma tecnológica",      "SoftwareETH S.A.S.",  "$0.90M","🔄 En ajustes", "15/03/2026","31/08/2026"],
        ["Coord. social comunitaria",   "Fundación ProCauca",  "$1.40M","✅ En ejecución","01/02/2026","31/12/2026"],
        ["Asesoría jurídica especializ.","Estudio Jurídico J.","$0.35M","⚠️ Sin iniciar","—",         "30/06/2026"],
      ],
    },
  },

  26: {
    kpis: [
      { label: "Riesgos identificados",value: "42",  sub: "en matriz CONPES 3714",  color: "#DC2626" },
      { label: "Críticos (nivel alto)", value: "7",   sub: "requieren plan activo",  color: "#B45309" },
      { label: "Mitigados",             value: "24",  sub: "57% del total",          color: "#059669" },
      { label: "% Control general",     value: "71%", sub: "riesgos bajo control",   color: "#0369A1" },
    ],
    tabla: {
      columnas: ["Riesgo", "Tipo", "Probabilidad", "Impacto", "Nivel", "Plan de mitigación"],
      filas: [
        ["Retrasos en desembolso ANH",     "Financiero",   "Media",  "Alto",    "🔴 Crítico",  "Fondo reserva operativo"],
        ["Bloqueos vías de acceso",        "Operacional",  "Alta",   "Medio",   "🔴 Crítico",  "Rutas alternas mapeadas"],
        ["Conflictividad social escalada", "Social",       "Baja",   "Alto",    "🟡 Moderado", "Mesa de diálogo activa"],
        ["Variabilidad climática",         "Natural",      "Alta",   "Medio",   "🔴 Crítico",  "Plan contingencia HSE"],
        ["Incumplimiento proveedores",     "Contractual",  "Media",  "Medio",   "🟡 Moderado", "Multas y garantías"],
        ["Falla sistema tecnológico",      "TI",           "Baja",   "Bajo",    "🟢 Bajo",     "Backup y redundancia"],
        ["Cambios normativos ANH",         "Regulatorio",  "Baja",   "Alto",    "🟡 Moderado", "Monitoreo normativo"],
      ],
    },
  },

  // ─── GRUPO F ─────────────────────────────────────────────────────
  27: {
    kpis: [
      { label: "Informes radicados",  value: "74",  sub: "este mes",              color: "#0891B2" },
      { label: "Aprobados",           value: "61",  sub: "82% del total",         color: "#059669" },
      { label: "En revisión",         value: "10",  sub: "plazo 5 días hábiles",  color: "#B45309" },
      { label: "Devueltos",           value: "3",   sub: "con observaciones",     color: "#DC2626" },
    ],
    tabla: {
      columnas: ["Profesional", "Tipo informe", "Periodo", "Fecha radicación", "Revisor", "Estado"],
      filas: [
        ["Rodríguez, Ana",   "Informe mensual técnico", "Marzo 2026", "01/04/2026", "Coord. Técnico", "✅ Aprobado"],
        ["Martínez, Carlos", "Informe actividades campo","Marzo 2026","02/04/2026", "Coord. Técnico", "✅ Aprobado"],
        ["García, Pedro",    "Informe agronómico",       "Marzo 2026", "03/04/2026", "Coord. Técnico", "🔄 En revisión"],
        ["López, María",     "Informe social comunit.",  "Marzo 2026", "04/04/2026", "Coord. Social",  "🔄 En revisión"],
        ["Suárez, Juliana",  "Informe jurídico",         "Marzo 2026", "01/04/2026", "Dir. Jurídico",  "✅ Aprobado"],
        ["Vargas, Luis",     "Informe financiero",       "Marzo 2026", "05/04/2026", "Dir. Financiero","⚠️ Devuelto"],
      ],
    },
  },

  28: {
    kpis: [
      { label: "Informes ANH generados",value: "2",  sub: "de 4 desembolsos",     color: "#0891B2" },
      { label: "Desembolsos procesados", value: "2",  sub: "D1 y preparando D2",  color: "#059669" },
      { label: "Módulos compilados",     value: "39", sub: "100% de componentes", color: "#0369A1" },
      { label: "Pendientes validación",  value: "12", sub: "secciones D2",        color: "#B45309" },
    ],
    tabla: {
      columnas: ["Informe ANH", "Desembolso", "Fecha entrega", "Módulos incluidos", "Observaciones ANH", "Estado"],
      filas: [
        ["Informe D1 — Plan inicial",  "D1 (20%)", "28/02/2026", "39/39", "Aprobado sin observaciones", "✅ Aprobado"],
        ["Informe D2 — 35% avance",   "D2 (35%)", "31/05/2026", "32/39", "En preparación",             "🔄 En redacción"],
        ["Informe D3 — 70% avance",   "D3 (40%)", "31/08/2026", "—",     "—",                          "📅 Programado"],
        ["Informe D4 — Final",        "D4 (10%)", "30/11/2026", "—",     "—",                          "📅 Programado"],
      ],
    },
  },

  29: {
    kpis: [
      { label: "Documentos en repo.",  value: "187", sub: "metodologías y guías",   color: "#0891B2" },
      { label: "Casos de éxito",       value: "23",  sub: "publicados",             color: "#059669" },
      { label: "Buenas prácticas",     value: "45",  sub: "validadas por equipo",   color: "#0369A1" },
      { label: "Descargas totales",    value: "1.243",sub: "último trimestre",      color: "#B45309" },
    ],
    tabla: {
      columnas: ["Documento", "Tipo", "Región", "Fecha publicación", "Descargas", "Estado"],
      filas: [
        ["Guía caracterización territorial",  "Metodología",   "Nacional",          "15/01/2026", "234", "✅ Publicado"],
        ["Caso éxito cacao Catatumbo",        "Caso de éxito", "N. de Santander",   "20/02/2026", "187", "✅ Publicado"],
        ["Protocolo consulta previa",         "Protocolo",     "Nacional",          "10/01/2026", "312", "✅ Publicado"],
        ["Manual piscicultura familiar",      "Guía técnica",  "Santander",         "01/03/2026", "145", "✅ Publicado"],
        ["Lecciones aprendidas bloqueos",     "Lección aprendida","Meta/Arauca",    "25/03/2026", "98",  "✅ Publicado"],
        ["Modelo financiero clúster agro.",   "Metodología",   "Nacional",          "10/04/2026", "67",  "🔄 En revisión"],
      ],
    },
  },

  // ─── GRUPO G ─────────────────────────────────────────────────────
  30: {
    kpis: [
      { label: "Eventos programados", value: "48",   sub: "2do trimestre 2026",   color: "#059669" },
      { label: "Realizados",          value: "31",   sub: "64% de ejecución",     color: "#1B6B4A" },
      { label: "Total participantes", value: "4.820",sub: "acumulado 2026",       color: "#0369A1" },
      { label: "Regiones activas",    value: "8",    sub: "de 8 regiones",        color: "#B45309" },
    ],
    tabla: {
      columnas: ["Evento", "Tipo", "Municipio", "Fecha", "Participantes", "Estado"],
      filas: [
        ["Feria productiva Catatumbo",     "Feria",          "Tibú",           "22/03/2026","380","✅ Realizado"],
        ["Taller BPA beneficiarios",       "Capacitación",   "Puerto Wilches", "28/03/2026","95", "✅ Realizado"],
        ["Foro ambiental CARs",            "Foro",           "Cúcuta",         "05/04/2026","120","✅ Realizado"],
        ["Entrega equipos clúster cacao",  "Entrega",        "El Tarra",       "10/04/2026","45", "✅ Realizado"],
        ["Mesa diálogo social Norte",      "Diálogo",        "Convención",     "20/04/2026","60", "📅 Programado"],
        ["Taller formación digital",       "Capacitación",   "Barrancabermeja","28/04/2026","150","📅 Programado"],
        ["Rueda de negocios exportación",  "Negocios",       "Bucaramanga",    "15/05/2026","200","📅 Programado"],
      ],
    },
  },

  31: {
    kpis: [
      { label: "Eventos con logística", value: "31",   sub: "2026 ejecutados",     color: "#059669" },
      { label: "Presupuesto logístico", value: "$1.2M",sub: "asignado 2026",       color: "#0369A1" },
      { label: "Ejecutado",             value: "$0.7M",sub: "58% del presupuesto", color: "#B45309" },
      { label: "Proveedores activos",   value: "14",   sub: "en 4 categorías",     color: "#DC2626" },
    ],
    tabla: {
      columnas: ["Evento", "Municipio", "Transporte ($)", "Alimentación ($)", "Alojamiento ($)", "Total ($)"],
      filas: [
        ["Feria productiva Catatumbo",  "Tibú",          "$4.800.000","$3.200.000","$2.400.000","$10.400.000"],
        ["Taller BPA beneficiarios",    "Puerto Wilches","$1.200.000","$1.900.000","$0",        "$3.100.000"],
        ["Foro ambiental CARs",         "Cúcuta",        "$2.100.000","$2.400.000","$1.800.000","$6.300.000"],
        ["Entrega equipos clúster",     "El Tarra",      "$3.500.000","$900.000",  "$0",        "$4.400.000"],
        ["Mesa diálogo social",         "Convención",    "$1.600.000","$1.200.000","$600.000",  "$3.400.000"],
      ],
    },
  },

  32: {
    kpis: [
      { label: "Piezas producidas",   value: "142", sub: "material de difusión",    color: "#059669" },
      { label: "Campañas activas",    value: "4",   sub: "en canales digitales",    color: "#1B6B4A" },
      { label: "Alcance digital",     value: "87.4K",sub: "usuarios únicos",       color: "#0369A1" },
      { label: "Menciones en prensa", value: "23",  sub: "medios locales/nac.",     color: "#B45309" },
    ],
    tabla: {
      columnas: ["Pieza / Campaña", "Tipo", "Canal", "Fecha lanzamiento", "Alcance", "Estado"],
      filas: [
        ["Lanzamiento convenio ETH-ANH",    "Nota de prensa", "Medios escritos",  "20/01/2026", "15 medios",  "✅ Publicado"],
        ["Campaña 'Campo Productivo'",      "Social media",   "FB, IG, TW",       "01/02/2026", "42.000 usr.","🔄 Activa"],
        ["Video feria Catatumbo",           "Video",          "YouTube, FB",      "25/03/2026", "8.300 views","✅ Publicado"],
        ["Infografía resultados Q1",        "Infografía",     "Web + redes",      "01/04/2026", "12.000 usr.","✅ Publicado"],
        ["Campaña formación digital",       "Social media",   "FB, IG",           "15/04/2026", "En pauta",   "📅 Próxima"],
        ["Boletín mensual aliados",         "Newsletter",     "Email",            "15/04/2026", "340 suscrit.","🔄 En diseño"],
      ],
    },
  },

  33: {
    kpis: [
      { label: "Protocolos activos",     value: "8",  sub: "campo y laboratorio",   color: "#059669" },
      { label: "Incidentes reportados",  value: "3",  sub: "Q1 2026 (sin graves)",  color: "#B45309" },
      { label: "Capacitaciones HSE",     value: "14", sub: "personal capacitado",   color: "#0369A1" },
      { label: "% Cumplimiento SG-SST",  value: "89%",sub: "sobre meta 85%",        color: "#1B6B4A" },
    ],
    tabla: {
      columnas: ["Reporte / Protocolo", "Municipio", "Tipo", "Fecha", "Gravedad", "Estado"],
      filas: [
        ["Accidente leve campo",         "El Tarra",       "Accidente",      "12/02/2026","Leve",   "✅ Cerrado"],
        ["Protocolo ingreso zonas E&P",  "Tibú",           "Protocolo",      "01/01/2026","N/A",    "✅ Vigente"],
        ["Conato incendio almacén",      "Puerto Wilches", "Incidente",      "28/03/2026","Leve",   "🔄 En seguimiento"],
        ["Plan emergencias Catatumbo",   "Regional Norte", "Plan",           "15/01/2026","N/A",    "✅ Vigente"],
        ["Simulacro evacuación",         "Barrancabermeja","Simulacro",      "10/03/2026","N/A",    "✅ Realizado"],
        ["Accidente tránsito vehicular", "Convención",     "Accidente tráns.","05/04/2026","Moderado","🔄 En investigación"],
      ],
    },
  },

  // ─── GRUPO H ─────────────────────────────────────────────────────
  34: {
    kpis: [
      { label: "Documentos activos",    value: "1.847",sub: "en repositorio Drive",  color: "#6D28D9" },
      { label: "Por vencer (30 días)", value: "28",   sub: "requieren renovación",  color: "#B45309" },
      { label: "Vencidos",             value: "5",    sub: "acción inmediata",      color: "#DC2626" },
      { label: "Alertas IA activas",   value: "33",   sub: "procesadas por Gemini", color: "#0369A1" },
    ],
    tabla: {
      columnas: ["Documento", "Tipo", "Región", "Fecha vencimiento", "Estado", "Acción IA"],
      filas: [
        ["Póliza de cumplimiento ANH",     "Póliza",       "Nacional",          "30/06/2026","⚠️ Por vencer","Recordatorio enviado"],
        ["Convenio operativo ETH",         "Convenio",     "Nacional",          "31/12/2026","✅ Vigente",   "Sin acción"],
        ["Licencia ambiental Tibú",        "Licencia",     "N. de Santander",   "15/05/2026","⚠️ Por vencer","Alerta a coord."],
        ["Acta comité #04-2026",           "Acta",         "Nacional",          "N/A",        "🔄 En firma",  "Recordatorio coord."],
        ["Plan gestión ambiental",         "Plan técnico", "Regional Norte",    "01/08/2026","✅ Vigente",   "Sin acción"],
        ["Contrato TransLogCo",            "Contrato",     "Nacional",          "31/12/2026","✅ Vigente",   "Sin acción"],
        ["Cert. fitosanit. cacao",         "Certificado",  "N. de Santander",   "10/04/2026","❌ Vencido",   "Alerta urgente"],
      ],
    },
  },

  35: {
    kpis: [
      { label: "Bienes registrados",       value: "347", sub: "activos del convenio",   color: "#6D28D9" },
      { label: "Entregados a comunidades", value: "189", sub: "con acta firmada",       color: "#059669" },
      { label: "En bodega / tránsito",     value: "142", sub: "pendientes entrega",     color: "#0369A1" },
      { label: "Alertas trazabilidad",     value: "6",   sub: "sin confirmación",       color: "#DC2626" },
    ],
    tabla: {
      columnas: ["Bien / Equipo", "Núm. serie", "Municipio", "Beneficiario / Comunidad", "Fecha entrega", "Estado"],
      filas: [
        ["Kit apícola completo",    "KIT-APÍ-001","Tibú",           "Asociación APICOOP",       "10/03/2026","✅ Entregado"],
        ["Equipo piscicultura x5",  "PIS-SET-014","Puerto Wilches", "Familia Gómez Reyes",      "15/03/2026","✅ Entregado"],
        ["Motosierra profesional",  "MSR-PRO-008","El Tarra",       "ASOCOMUN El Tarra",        "20/03/2026","✅ Entregado"],
        ["Computador portátil",     "LAP-DEL-022","Cúcuta",         "Coord. territorial",       "01/02/2026","✅ Entregado"],
        ["Sistema riego tecnificado","SRT-AGR-003","Convención",    "Asociación AGROPRODUCES",  "—",         "📦 En bodega"],
        ["Bomba fumigación",        "BOM-AGR-011","Teorama",        "Familia Torres Cruz",      "—",         "⚠️ Sin confirmar"],
      ],
    },
  },

  36: {
    kpis: [
      { label: "Pólizas activas",       value: "6",    sub: "en vigencia",         color: "#6D28D9" },
      { label: "Por vencer (60 días)", value: "2",    sub: "renovación urgente",  color: "#B45309" },
      { label: "Vencidas",             value: "0",    sub: "sin pólizas caducas", color: "#059669" },
      { label: "Cobertura total",      value: "$18.4M",sub: "valor asegurado",    color: "#0369A1" },
    ],
    tabla: {
      columnas: ["Póliza", "Tipo", "Aseguradora", "Valor ($M)", "Fecha vencimiento", "Estado"],
      filas: [
        ["Póliza cumplimiento 20%",      "Cumplimiento",   "Seguros Bolívar", "$3.68M","30/06/2026","⚠️ Por vencer (75 días)"],
        ["Póliza calidad 10%",           "Calidad",        "Allianz Colombia","$1.84M","31/12/2026","✅ Vigente"],
        ["Póliza salarios 5%",           "Laboral",        "Sura",            "$0.92M","31/12/2026","✅ Vigente"],
        ["Responsabilidad civil",        "RC general",     "Seguros Bolívar", "$2.00M","31/08/2026","✅ Vigente"],
        ["Todo riesgo equipos",          "Equipos",        "Liberty",         "$0.50M","30/04/2026","⚠️ Renovar urgente"],
        ["Accidentes personales equipo", "Vida y AP",      "Sura",            "$1.20M","31/12/2026","✅ Vigente"],
      ],
    },
  },

  37: {
    kpis: [
      { label: "Entregables totales",     value: "124", sub: "plan cierre convenio", color: "#6D28D9" },
      { label: "Entregados y validados",  value: "48",  sub: "39% del total",        color: "#059669" },
      { label: "Aliados con paz y salvo", value: "6",   sub: "de 23 aliados",        color: "#0369A1" },
      { label: "% Progreso cierre",       value: "39%", sub: "según cronograma",     color: "#B45309" },
    ],
    tabla: {
      columnas: ["Producto / Entregable", "Responsable", "Fecha entrega", "Estado", "Observación"],
      filas: [
        ["Informe final técnico",           "Coord. técnico",   "30/11/2026","📅 Programado","—"],
        ["Acta liquidación financiera",     "Dir. financiero",  "15/12/2026","📅 Programado","—"],
        ["Inventario final bienes",         "Coord. logística", "30/11/2026","📅 Programado","—"],
        ["Paz y salvo CORPONOR",            "Coord. ambiental", "15/11/2026","📅 Programado","—"],
        ["Informe impacto beneficiarios",   "Coord. social",    "30/11/2026","🔄 En redacción","Avance 30%"],
        ["Devolución bienes excedentes",    "Coord. logística", "31/10/2026","📅 Programado","Pendiente inventario"],
      ],
    },
  },

  // ─── GRUPO I ─────────────────────────────────────────────────────
  38: {
    kpis: [
      { label: "Tickets activos",        value: "18",  sub: "en resolución",        color: "#475569" },
      { label: "Resueltos este mes",     value: "87",  sub: "de 105 ingresados",    color: "#059669" },
      { label: "% SLA cumplido",         value: "91%", sub: "meta: 90%",            color: "#0369A1" },
      { label: "Tiempo prom. resolución",value: "4.2h",sub: "dentro de SLA",        color: "#B45309" },
    ],
    tabla: {
      columnas: ["Ticket", "Usuario", "Tipo", "Prioridad", "Estado", "Tiempo resolución"],
      filas: [
        ["TKT-2026-0142","rodrigueza@eth-anh.co","Acceso módulo",    "Alta",   "🔄 En proceso","2h"],
        ["TKT-2026-0141","martinezc@eth-anh.co","Error formulario",  "Media",  "✅ Resuelto",  "1.5h"],
        ["TKT-2026-0140","lopezm@eth-anh.co",  "Contraseña olvidada","Baja",   "✅ Resuelto",  "0.5h"],
        ["TKT-2026-0139","garciap@eth-anh.co", "No carga Looker",    "Alta",   "🔄 En proceso","5h"],
        ["TKT-2026-0138","suarezj@eth-anh.co", "Duda uso módulo",    "Baja",   "✅ Resuelto",  "3h"],
        ["TKT-2026-0137","vargas@eth-anh.co",  "Error exportar PDF", "Media",  "⚠️ Escalado",  "8h"],
      ],
    },
  },

  39: {
    kpis: [
      { label: "Servicios monitoreados", value: "12",    sub: "cloud y apps",        color: "#475569" },
      { label: "Disponibilidad",         value: "99.7%", sub: "vs SLA 99.5%",        color: "#059669" },
      { label: "Incidentes este mes",    value: "1",     sub: "resuelto en <2h",     color: "#0369A1" },
      { label: "Backups ejecutados",     value: "30/30", sub: "100% exitosos",       color: "#B45309" },
    ],
    tabla: {
      columnas: ["Servicio", "Tipo", "Uptime", "Último incidente", "Backup", "SLA"],
      filas: [
        ["Google Workspace",    "Colaboración", "99.9%","15/03/2026 (2h)","✅ Diario",  "✅ Cumple"],
        ["Plataforma ETH-ANH",  "Aplicación",   "99.7%","10/04/2026 (1h)","✅ Diario",  "✅ Cumple"],
        ["Supabase (BD)",       "Base de datos","99.8%","—",              "✅ Cada 6h", "✅ Cumple"],
        ["Drive repositorio",   "Almacenamiento","100%","—",              "✅ Semanal", "✅ Cumple"],
        ["Vercel (hosting)",    "Infraestructura","99.9%","—",            "N/A",        "✅ Cumple"],
        ["Looker Studio",       "BI / Reportes", "99.5%","01/04/2026 (3h)","N/A",      "✅ Cumple"],
        ["Gmail corporativo",   "Comunicación",  "99.9%","—",             "✅ Diario",  "✅ Cumple"],
      ],
    },
  },

};
