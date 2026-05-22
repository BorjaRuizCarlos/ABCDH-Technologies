import type { UserRole } from '../utils/roles';
import type { ProjectWorkflowStatus } from '../utils/projectStatus';

export type LandingDemoView = 'dashboard' | 'projects' | 'project-detail' | 'reports' | 'alerts' | 'profile' | 'settings';

export interface LandingDemoMetric {
  title: string;
  value: string;
  delta: string;
  tone: 'primary' | 'success' | 'warning' | 'info';
}

export interface LandingDemoProject {
  id: number;
  name: string;
  status: ProjectWorkflowStatus;
  progress: number;
  owner: string;
  teamSize: number;
  dueLabel: string;
  health: 'success' | 'warning' | 'danger' | 'info';
  budgetUsage: string;
  scope: string;
  nextMilestone: string;
  lastUpdate: string;
}

export interface LandingDemoAlert {
  id: number;
  title: string;
  project: string;
  detail: string;
  time: string;
  tone: 'warning' | 'danger' | 'info' | 'success';
}

export interface LandingDemoProfile {
  name: string;
  title: string;
  email: string;
  scope: string;
  location: string;
  team: string;
}

export interface LandingDemoRoleConfig {
  label: string;
  description: string;
  audience: string;
  views: LandingDemoView[];
  metrics: LandingDemoMetric[];
  projects: LandingDemoProject[];
  alerts: LandingDemoAlert[];
  profile: LandingDemoProfile;
  emptyStates: {
    alerts: { title: string; description: string };
    reports: { title: string; description: string };
    settings: { title: string; description: string };
  };
}

const PROJECT_CATALOG: LandingDemoProject[] = [
  {
    id: 101,
    name: 'Atlas Retail Platform',
    status: 'in_progress',
    progress: 74,
    owner: 'María González',
    teamSize: 12,
    dueLabel: '18 días',
    health: 'warning',
    budgetUsage: '81%',
    scope: 'Omnicanal y analítica comercial para operaciones retail.',
    nextMilestone: 'Liberar catálogo unificado y revisión de integraciones.',
    lastUpdate: 'Hace 2 horas',
  },
  {
    id: 102,
    name: 'Core API Stabilization',
    status: 'review',
    progress: 58,
    owner: 'Diego Ortega',
    teamSize: 8,
    dueLabel: '9 días',
    health: 'warning',
    budgetUsage: '67%',
    scope: 'Refactor de servicios críticos, observabilidad y hardening.',
    nextMilestone: 'Cerrar pruebas de contrato y validación de seguridad.',
    lastUpdate: 'Hace 40 min',
  },
  {
    id: 103,
    name: 'Data Hub Consolidation',
    status: 'planning',
    progress: 42,
    owner: 'Andrea Flores',
    teamSize: 6,
    dueLabel: '27 días',
    health: 'danger',
    budgetUsage: '53%',
    scope: 'Modelo unificado para KPIs ejecutivos y auditoría transversal.',
    nextMilestone: 'Definir gobierno de datos y catálogo inicial.',
    lastUpdate: 'Ayer',
  },
  {
    id: 104,
    name: 'Mobile Release v2',
    status: 'completed',
    progress: 100,
    owner: 'Roberto Pérez',
    teamSize: 5,
    dueLabel: 'Completado',
    health: 'success',
    budgetUsage: '94%',
    scope: 'Entrega final de la app de campo con reportes offline.',
    nextMilestone: 'Handover a soporte y monitoreo pos-liberación.',
    lastUpdate: 'Hace 3 días',
  },
];

export const LANDING_DEMO_DATA: Record<UserRole, LandingDemoRoleConfig> = {
  admin: {
    label: 'Admin',
    description: 'Visibilidad completa del portafolio, usuarios y alertas operativas.',
    audience: 'Dirección de plataforma y operación.',
    views: ['dashboard', 'projects', 'project-detail', 'reports', 'alerts', 'profile', 'settings'],
    metrics: [
      { title: 'Proyectos activos', value: '24', delta: '+3 esta semana', tone: 'primary' },
      { title: 'Salud del portafolio', value: '78%', delta: '+6 pts vs. mes anterior', tone: 'success' },
      { title: 'Alertas abiertas', value: '5', delta: '+1 crítica', tone: 'warning' },
      { title: 'Cobertura de equipos', value: '96%', delta: 'Sin brechas relevantes', tone: 'info' },
    ],
    projects: PROJECT_CATALOG,
    alerts: [
      {
        id: 1,
        title: 'Dos entregables se acercan al límite de revisión',
        project: 'Core API Stabilization',
        detail: 'El pipeline de QA aún marca inconsistencias en contratos de integración.',
        time: 'Hace 12 min',
        tone: 'danger',
      },
      {
        id: 2,
        title: 'Consumo presupuestal por encima del plan',
        project: 'Atlas Retail Platform',
        detail: 'El avance va por debajo del consumo esperado para esta fase.',
        time: 'Hace 27 min',
        tone: 'warning',
      },
      {
        id: 3,
        title: 'Se publicó un release estable en móvil',
        project: 'Mobile Release v2',
        detail: 'El cierre de la iniciativa ya fue registrado y queda listo para seguimiento.',
        time: 'Ayer',
        tone: 'success',
      },
    ],
    profile: {
      name: 'María González',
      title: 'VP de Operaciones',
      email: 'maria.gonzalez@abcdh.com',
      scope: 'Gobierno global del portafolio y revisión de riesgos.',
      location: 'CDMX · HQ',
      team: '14 proyectos críticos',
    },
    emptyStates: {
      alerts: { title: 'Sin alertas nuevas', description: 'Todo el monitoreo está en verde para esta vista.' },
      reports: { title: 'Sin reportes generados', description: 'Los reportes personalizados se mostrarán aquí cuando el ciclo cierre.' },
      settings: { title: 'Configuración no disponible', description: 'Este espacio reserva la administración avanzada para la demo.' },
    },
  },
  project_manager: {
    label: 'Project Manager',
    description: 'Seguimiento operativo, riesgos y coordinación de entregas.',
    audience: 'Gestión de proyectos y delivery.',
    views: ['dashboard', 'projects', 'project-detail', 'reports', 'alerts', 'profile', 'settings'],
    metrics: [
      { title: 'Proyectos en curso', value: '9', delta: '+2 en revisión', tone: 'primary' },
      { title: 'Tareas vencidas', value: '3', delta: '-2 desde ayer', tone: 'warning' },
      { title: 'Bloqueos críticos', value: '1', delta: 'Pendiente de decisión', tone: 'warning' },
      { title: 'Entregas a tiempo', value: '84%', delta: '+4 pts', tone: 'success' },
    ],
    projects: PROJECT_CATALOG.slice(0, 3),
    alerts: [
      {
        id: 4,
        title: 'La revisión de contrato se movió 1 día',
        project: 'Core API Stabilization',
        detail: 'El equipo de QA pidió una validación extra antes de aprobar el release.',
        time: 'Hace 18 min',
        tone: 'warning',
      },
      {
        id: 5,
        title: 'Un entregable quedó bloqueado por dependencias',
        project: 'Atlas Retail Platform',
        detail: 'El avance depende de una integración pendiente del partner externo.',
        time: 'Hace 1 h',
        tone: 'danger',
      },
    ],
    profile: {
      name: 'Diego Ortega',
      title: 'Project Manager',
      email: 'diego.ortega@abcdh.com',
      scope: 'Coordinación de equipos, fechas y riesgos.',
      location: 'Guadalajara · Remote',
      team: '3 squads activos',
    },
    emptyStates: {
      alerts: { title: 'Sin alertas activas', description: 'Esta vista queda vacía cuando las incidencias ya fueron atendidas.' },
      reports: { title: 'Sin exportaciones recientes', description: 'Las exportaciones listas para compartir aparecerán aquí.' },
      settings: { title: 'Configuración limitada', description: 'La demo conserva solo accesos operativos para este perfil.' },
    },
  },
  stakeholder: {
    label: 'Stakeholder',
    description: 'Resumen ejecutivo de salud, avance y riesgos relevantes.',
    audience: 'Dirección y partes interesadas.',
    views: ['dashboard', 'projects', 'reports', 'alerts', 'profile'],
    metrics: [
      { title: 'Portafolio visible', value: '7', delta: 'Proyectos priorizados', tone: 'primary' },
      { title: 'Salud general', value: '81%', delta: 'Tendencia estable', tone: 'success' },
      { title: 'Riesgo agregado', value: 'Medio', delta: '2 focos por revisar', tone: 'warning' },
      { title: 'Cumplimiento', value: '93%', delta: 'Dentro de umbral', tone: 'info' },
    ],
    projects: PROJECT_CATALOG.slice(0, 2),
    alerts: [],
    profile: {
      name: 'Ana Torres',
      title: 'Executive Sponsor',
      email: 'ana.torres@abcdh.com',
      scope: 'Lectura ejecutiva y validación de prioridades.',
      location: 'Monterrey · Oficina regional',
      team: 'Cobertura transversal',
    },
    emptyStates: {
      alerts: { title: 'Sin alertas para este rol', description: 'Las alertas detalladas se ocultan para mantener la vista ejecutiva limpia.' },
      reports: { title: 'Reportes resumidos no activos', description: 'Los resúmenes ejecutivos aparecerán cuando se publique el corte semanal.' },
      settings: { title: 'No hay configuración editable', description: 'Este perfil solo consume información consolidada.' },
    },
  },
  user: {
    label: 'User',
    description: 'Trabajo diario, seguimiento personal y acceso a proyectos asignados.',
    audience: 'Contribuyentes y usuarios finales.',
    views: ['dashboard', 'projects', 'profile'],
    metrics: [
      { title: 'Mis tareas', value: '12', delta: '4 próximas a vencer', tone: 'primary' },
      { title: 'Entregas hechas', value: '8', delta: '67% completado', tone: 'success' },
      { title: 'Bloqueos', value: '1', delta: 'Pendiente de apoyo', tone: 'warning' },
      { title: 'Actividad hoy', value: '5', delta: 'Actualizado hace 10 min', tone: 'info' },
    ],
    projects: [PROJECT_CATALOG[1], PROJECT_CATALOG[3]],
    alerts: [],
    profile: {
      name: 'Roberto Pérez',
      title: 'Product Developer',
      email: 'roberto.perez@abcdh.com',
      scope: 'Ejecución de tareas y revisión de avances asignados.',
      location: 'Puebla · Híbrido',
      team: 'Equipo Core API',
    },
    emptyStates: {
      alerts: { title: 'Sin alertas personales', description: 'Las notificaciones operativas se agrupan fuera de esta vista de demo.' },
      reports: { title: 'Reportes personales no disponibles', description: 'Este perfil no publica reportes ejecutivos en la demo.' },
      settings: { title: 'Preferencias restringidas', description: 'Los ajustes avanzados se reservan para perfiles de gestión.' },
    },
  },
};
