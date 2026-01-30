export const procedureTemplates = [
  {
    id: 'template-obra',
    code: 'TR-LO-001',
    name: 'Licencia de Obra',
    description: 'Plantilla base para trámites de licencia de obra y habilitación urbana.',
    phases: [
      {
        id: 'fase-parametros',
        name: 'Solicitud de parámetros urbanísticos',
        required: true,
        subphases: [
          { id: 'sub-plano-ubicacion', name: 'Plano de ubicación', required: true },
          { id: 'sub-solicitud-parametros', name: 'Solicitud de parámetros', required: true },
          { id: 'sub-programacion-visita', name: 'Programación de visita', required: true },
          { id: 'sub-recojo-parametro', name: 'Recojo del parámetro', required: false },
        ],
      },
      {
        id: 'fase-anteproyecto',
        name: 'Anteproyecto',
        required: true,
        subphases: [
          { id: 'sub-propuesta-1', name: '1ra propuesta', required: true },
          { id: 'sub-propuesta-2', name: '2da propuesta', required: false },
          { id: 'sub-propuesta-3', name: '3ra propuesta', required: false },
          { id: 'sub-presentacion-ante', name: 'Presentación', required: true },
          { id: 'sub-evaluacion-ante', name: 'Evaluación', required: true },
          { id: 'sub-observaciones-ante', name: 'Observaciones', required: false },
          { id: 'sub-dictamen-ante', name: 'Dictamen', required: true },
        ],
      },
      {
        id: 'fase-proyecto',
        name: 'Proyecto',
        required: true,
        subphases: [
          { id: 'sub-estudio-suelos', name: 'Estudio de suelos', required: true },
          { id: 'sub-planos-electricos', name: 'Planos eléctricos', required: true },
          { id: 'sub-planos-sanitarios', name: 'Planos sanitarios', required: true },
          { id: 'sub-planos-estructuras', name: 'Planos de estructuras', required: true },
          { id: 'sub-presentacion-proyecto', name: 'Presentación', required: true },
          { id: 'sub-evaluacion-proyecto', name: 'Evaluación', required: true },
          { id: 'sub-observaciones-proyecto', name: 'Observaciones', required: false },
          { id: 'sub-dictamen-proyecto', name: 'Dictamen favorable', required: true },
        ],
      },
      {
        id: 'fase-entrega',
        name: 'Entrega del expediente',
        required: false,
        subphases: [
          { id: 'sub-impresion-planos', name: 'Impresión de juegos de planos', required: false },
          { id: 'sub-entrega-municipalidad', name: 'Entrega en municipalidad', required: true },
        ],
      },
    ],
  },
  {
    id: 'template-licencia-funcionamiento',
    code: 'TR-LF-002',
    name: 'Licencia de Funcionamiento',
    description: 'Modelo base para licencias comerciales y expedientes municipales.',
    phases: [
      {
        id: 'fase-analisis',
        name: 'Análisis previo',
        required: true,
        subphases: [
          { id: 'sub-visita-tecnica', name: 'Visita técnica', required: true },
          { id: 'sub-levantamiento', name: 'Levantamiento de información', required: true },
        ],
      },
      {
        id: 'fase-expediente',
        name: 'Preparación de expediente',
        required: true,
        subphases: [
          { id: 'sub-formatos', name: 'Formatos municipales', required: true },
          { id: 'sub-planos', name: 'Planos y memoria descriptiva', required: true },
          { id: 'sub-revision', name: 'Revisión legal', required: false },
        ],
      },
      {
        id: 'fase-seguimiento',
        name: 'Seguimiento',
        required: true,
        subphases: [
          { id: 'sub-ingreso', name: 'Ingreso de expediente', required: true },
          { id: 'sub-observaciones', name: 'Respuesta a observaciones', required: false },
          { id: 'sub-licencia', name: 'Licencia emitida', required: true },
        ],
      },
    ],
  },
];

export const staffMembers = [
  { id: 'staff-1', name: 'Ana Torres', role: 'Responsable Técnico' },
  { id: 'staff-2', name: 'Carlos Rivas', role: 'Coordinador Operativo' },
  { id: 'staff-3', name: 'María Valdez', role: 'Especialista Legal' },
  { id: 'staff-4', name: 'José Medina', role: 'Topografía y campo' },
  { id: 'staff-5', name: 'Lucía Pérez', role: 'Gestión Documental' },
];

export const procedureInstances = [
  {
    id: 'proc-2024-001',
    code: 'TR-2024-001',
    templateId: 'template-obra',
    client: 'Inmobiliaria Sol S.A.C.',
    projectName: 'Torre Miraflores',
    location: 'Miraflores, Lima',
    generalResponsible: 'Ana Torres',
    status: 'En Proceso',
    currentPhase: 'Anteproyecto',
    currentSubphase: '2da propuesta',
    lastUpdate: '2024-05-12',
    nextDue: '2024-05-18',
    alerts: 'Observaciones en evaluación del anteproyecto.',
    progress: 45,
    tasks: [
      {
        id: 'task-1',
        phase: 'Solicitud de parámetros urbanísticos',
        subphase: 'Programación de visita',
        responsible: 'José Medina',
        status: 'Hecho',
        dueDate: '2024-04-20',
      },
      {
        id: 'task-2',
        phase: 'Anteproyecto',
        subphase: '2da propuesta',
        responsible: 'Ana Torres',
        status: 'En proceso',
        dueDate: '2024-05-18',
      },
    ],
  },
  {
    id: 'proc-2024-002',
    code: 'TR-2024-002',
    templateId: 'template-licencia-funcionamiento',
    client: 'Grupo Comercial Larco',
    projectName: 'Local Larco 120',
    location: 'Miraflores, Lima',
    generalResponsible: 'Carlos Rivas',
    status: 'Observado',
    currentPhase: 'Preparación de expediente',
    currentSubphase: 'Revisión legal',
    lastUpdate: '2024-05-10',
    nextDue: '2024-05-16',
    alerts: 'Pendiente subsanar observaciones municipales.',
    progress: 32,
    tasks: [
      {
        id: 'task-3',
        phase: 'Preparación de expediente',
        subphase: 'Revisión legal',
        responsible: 'María Valdez',
        status: 'Observado',
        dueDate: '2024-05-16',
      },
    ],
  },
  {
    id: 'proc-2024-003',
    code: 'TR-2024-003',
    templateId: 'template-obra',
    client: 'Constructora Andina',
    projectName: 'Condominio Surco',
    location: 'Santiago de Surco, Lima',
    generalResponsible: 'Lucía Pérez',
    status: 'Pendiente',
    currentPhase: 'Solicitud de parámetros urbanísticos',
    currentSubphase: 'Plano de ubicación',
    lastUpdate: '2024-05-05',
    nextDue: '2024-05-22',
    alerts: 'A la espera de documentación inicial.',
    progress: 10,
    tasks: [],
  },
];

export const statusOptions = [
  'Pendiente',
  'En Proceso',
  'Observado',
  'Aprobado',
  'Finalizado',
];

export const taskStatusOptions = [
  'Pendiente',
  'En proceso',
  'Hecho',
  'Observado',
];

export const priorityOptions = ['Alta', 'Media', 'Baja'];
