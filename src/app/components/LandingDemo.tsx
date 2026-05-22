import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Activity, Bell, Briefcase, CheckCircle2, ChevronRight, CircleUser, FileText, LayoutGrid, RefreshCw, Settings2, Shield, Sparkles, Users } from 'lucide-react';
import { KPICard } from './KPICard';
import { ADOTabs } from './ADOTabs';
import { DataTable, type DataTableColumn } from './DataTable';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { LANDING_DEMO_DATA, type LandingDemoProject, type LandingDemoView } from '../data/landingDemoData';

const VIEW_LABELS: Record<LandingDemoView, string> = {
  dashboard: 'Dashboard',
  projects: 'Proyectos',
  reports: 'Reportes',
  alerts: 'Alertas',
  profile: 'Perfil',
  settings: 'Configuración',
};

const DEMO_ROLE = 'project_manager' as const;

const roleToneMap = {
  project_manager: 'bg-info/10 text-info border-info/20',
} as const;

const metricIconMap = {
  primary: LayoutGrid,
  success: CheckCircle2,
  warning: Bell,
  info: Sparkles,
} as const;

function projectHealthStatus(health: LandingDemoProject['health']) {
  if (health === 'danger') return 'danger' as const;
  if (health === 'success') return 'success' as const;
  if (health === 'info') return 'info' as const;
  return 'warning' as const;
}

function DemoShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="bg-card border border-border rounded-[4px] shadow-sm overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

export function LandingDemo() {
  const [view, setView] = useState<LandingDemoView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number>(LANDING_DEMO_DATA[DEMO_ROLE].projects[0]?.id ?? 0);
  const [detailTab, setDetailTab] = useState<'resumen' | 'backlog' | 'timeline' | 'sprints' | 'boards' | 'milestones' | 'code-review' | 'repositorios' | 'equipo' | 'configuracion'>('resumen');
  const isStakeholderView = false;
  const canEditProfileSettings = true;

  const roleData = LANDING_DEMO_DATA[DEMO_ROLE];
  const visibleViews = roleData.views;
  const activeView = visibleViews.includes(view) ? view : visibleViews[0];
  const selectedProject = roleData.projects.find((project) => project.id === selectedProjectId) ?? roleData.projects[0];

  useEffect(() => {
    setView((current) => (visibleViews.includes(current) ? current : visibleViews[0]));
    setSelectedProjectId(roleData.projects[0]?.id ?? 0);
    setDetailTab('resumen');
  }, [roleData.projects, visibleViews]);

  useEffect(() => {
    setDetailTab('resumen');
  }, [selectedProjectId]);

  const columns = useMemo<DataTableColumn<LandingDemoProject>[]>(() => [
    {
      id: 'name',
      header: 'Proyecto',
      accessor: (project) => (
        <div className="min-w-0">
          <div className="font-medium text-foreground truncate">{project.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{project.scope}</div>
        </div>
      ),
      sortKey: 'name',
    },
    {
      id: 'status',
      header: 'Estado',
      accessor: (project) => <StatusBadge status={projectHealthStatus(project.health)} text={project.status.replace('_', ' ')} variant="pill" size="sm" />,
    },
    {
      id: 'progress',
      header: 'Avance',
      accessor: (project) => (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>{project.progress}%</span>
            <span>{project.dueLabel}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      ),
      sortKey: 'progress',
    },
    {
      id: 'owner',
      header: 'Owner',
      accessor: (project) => (
        <div className="text-[12px] text-foreground">
          <div className="font-medium">{project.owner}</div>
          <div className="text-muted-foreground">{project.teamSize} personas</div>
        </div>
      ),
      sortKey: 'owner',
    },
  ], []);

  const metricCards = roleData.metrics.map((metric) => {
    const Icon = metricIconMap[metric.tone];
    return (
      <KPICard
        key={metric.title}
        title={metric.title}
        value={metric.value}
        trendValue={metric.delta}
        trend={metric.tone === 'success' ? 'up' : 'neutral'}
        accentColor={metric.tone === 'success' ? 'success' : metric.tone === 'warning' ? 'warning' : metric.tone === 'info' ? 'info' : 'primary'}
        icon={<Icon className="w-4 h-4" />}
      />
    );
  });

  return (
    <section id="demo" className="container mx-auto px-6 py-20 max-w-6xl scroll-mt-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] border border-primary/20 bg-primary/10 text-primary text-[11px] font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Demo interactivo embebido
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          Una vista simulada que se siente parte de la plataforma
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Navega entre vistas internas y revisa datos mock locales usando el mismo lenguaje visual, los mismos radios y la misma jerarquía que el resto del producto.
        </p>
      </div>

      <DemoShell>
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b lg:border-b-0 lg:border-r border-border bg-surface-secondary/40 p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                <Shield className="w-3.5 h-3.5" />
                Contexto de demo
              </div>
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] border text-[11px] font-medium ${roleToneMap[DEMO_ROLE]}`}>
                <CircleUser className="w-3.5 h-3.5" />
                {roleData.label} · Vista fija de demo
              </div>
              <p className="mt-3 text-[12px] leading-5 text-muted-foreground">{roleData.description}</p>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">Navegación</div>
              <nav className="space-y-1">
                {visibleViews.map((candidateView) => {
                  const active = candidateView === activeView;
                  return (
                    <button
                      key={candidateView}
                      type="button"
                      onClick={() => setView(candidateView)}
                      className={`w-full flex items-center justify-between rounded-[3px] px-2.5 py-2 text-[12px] transition-colors ${active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                      <span>{VIEW_LABELS[candidateView]}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground/60'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-[3px] border border-border bg-card p-3">
              <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Acceso simulado</div>
              <div className="text-[12px] font-medium text-foreground">{roleData.projects.length} proyectos visibles</div>
              <div className="text-[11px] text-muted-foreground">{roleData.alerts.length} alertas activas en el contexto actual</div>
            </div>
          </aside>

          <div className="min-w-0 bg-background">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card/70 backdrop-blur-sm">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{roleData.audience}</div>
                <div className="text-[13px] font-semibold text-foreground truncate">
                  {VIEW_LABELS[activeView]} · {selectedProject?.name ?? roleData.profile.name}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-2 rounded-[3px] border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground min-w-[260px]">
                  <Activity className="w-3.5 h-3.5" />
                  Búsqueda local de demo
                </div>
                <div className="inline-flex items-center gap-2 rounded-[3px] border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  Mock data local
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5 space-y-5">
              {activeView === 'dashboard' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">{metricCards}</div>

                  <div className="grid xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] gap-3">
                    <div className="rounded-[4px] border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-[12px] font-semibold text-foreground">Avance consolidado</div>
                          <div className="text-[11px] text-muted-foreground">Evolución simulada de las últimas 12 iteraciones</div>
                        </div>
                        <StatusBadge status="success" text="Estable" variant="pill" size="sm" />
                      </div>
                      <div className="h-[190px] rounded-[3px] bg-surface-secondary/60 border border-border/60 p-3 flex items-end gap-2">
                        {[38, 44, 40, 52, 48, 61, 58, 66, 64, 72, 76, 82].map((height, index) => (
                          <div key={index} className="flex-1 flex items-end">
                            <div className="w-full rounded-t-[2px] bg-primary/15 overflow-hidden" style={{ height: `${height}%` }}>
                              <div className="h-[62%] w-full rounded-t-[2px] bg-primary/75" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[4px] border border-border bg-card p-4 space-y-4">
                      <div>
                        <div className="text-[12px] font-semibold text-foreground">Panel rápido</div>
                        <div className="text-[11px] text-muted-foreground">Acciones seguras y estado del contexto</div>
                      </div>
                      <div className="space-y-2">
                        <div className="rounded-[3px] border border-border bg-background p-3">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Siguiente decisión</div>
                          <div className="text-[12px] text-foreground font-medium">Alinear revisión de alcance antes del corte semanal.</div>
                        </div>
                        <div className="rounded-[3px] border border-border bg-background p-3">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Estado de seguridad</div>
                          <div className="flex items-center gap-2 text-[12px] text-foreground">
                            <Shield className="w-3.5 h-3.5 text-success" />
                            Acceso solo de lectura para esta demo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold text-foreground">Lista de proyectos</div>
                      <div className="text-[11px] text-muted-foreground">Tabla local con orden, estado y responsables simulados</div>
                    </div>
                    <StatusBadge status="info" text={`${roleData.projects.length} visibles`} variant="pill" size="sm" />
                  </div>
                  <div className="rounded-[4px] border border-border bg-card overflow-hidden">
                    <DataTable
                      columns={columns}
                      data={roleData.projects}
                      keyField="id"
                      emptyMessage={roleData.emptyStates.reports.title}
                      density="compact"
                      onRowClick={(project) => {
                        setSelectedProjectId(project.id);
                        setDetailTab('resumen');
                        setView('projects');
                      }}
                    />
                  </div>

                  {selectedProject && (
                    <div className="rounded-[4px] border border-border bg-card overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-surface-secondary/40">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Detalle del proyecto</div>
                        <div className="text-[18px] font-semibold text-foreground truncate">{selectedProject.name}</div>
                        <div className="mt-1 text-[12px] text-muted-foreground">{selectedProject.scope}</div>
                      </div>

                      <div className="px-3 pt-3">
                        <ADOTabs
                          tabs={[
                            { id: 'resumen', label: 'Overview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { id: 'backlog', label: 'Backlog', icon: <FileText className="w-3.5 h-3.5" /> },
                            { id: 'timeline', label: 'Timeline', icon: <Activity className="w-3.5 h-3.5" /> },
                            { id: 'sprints', label: 'Sprints', icon: <RefreshCw className="w-3.5 h-3.5" /> },
                            { id: 'boards', label: 'Boards', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { id: 'milestones', label: 'Milestones', icon: <Sparkles className="w-3.5 h-3.5" /> },
                            { id: 'code-review', label: 'Code Review', icon: <Shield className="w-3.5 h-3.5" /> },
                            { id: 'repositorios', label: 'Repositorios', icon: <Briefcase className="w-3.5 h-3.5" /> },
                            { id: 'equipo', label: 'Equipo', count: selectedProject.teamSize, icon: <Users className="w-3.5 h-3.5" /> },
                            { id: 'configuracion', label: 'Configuración', icon: <Settings2 className="w-3.5 h-3.5" /> },
                          ]}
                          activeTab={detailTab}
                          onTabChange={(id) => setDetailTab(id as typeof detailTab)}
                        />
                      </div>

                      <div className="p-4 space-y-4">
                        {detailTab === 'resumen' && (
                          <div className="space-y-3">
                            <div className="grid sm:grid-cols-3 gap-2">
                              <div className="rounded-[3px] border border-border bg-background p-3">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Avance</div>
                                <div className="text-[18px] font-semibold text-foreground">{selectedProject.progress}%</div>
                              </div>
                              <div className="rounded-[3px] border border-border bg-background p-3">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Budget</div>
                                <div className="text-[18px] font-semibold text-foreground">{selectedProject.budgetUsage}</div>
                              </div>
                              <div className="rounded-[3px] border border-border bg-background p-3">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Equipo</div>
                                <div className="text-[18px] font-semibold text-foreground">{selectedProject.teamSize}</div>
                              </div>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Owner</div>
                              <div className="font-medium text-foreground">{selectedProject.owner}</div>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Próximo hito</div>
                              <div className="font-medium text-foreground">{selectedProject.nextMilestone}</div>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="text-[12px] font-semibold text-foreground">Progreso global</div>
                                <div className="text-[11px] text-muted-foreground">Última actualización {selectedProject.lastUpdate}</div>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${selectedProject.progress}%` }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'backlog' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Historias priorizadas</div>
                              <div className="text-muted-foreground">3 tareas listas para sprint y 2 en refinamiento.</div>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Bloqueos activos</div>
                              <div className="text-muted-foreground">Una dependencia externa pendiente de confirmación.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'timeline' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3 flex items-center justify-between gap-2">
                              <span className="text-muted-foreground">Inicio estimado</span>
                              <span className="font-medium text-foreground">Hace 4 semanas</span>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3 flex items-center justify-between gap-2">
                              <span className="text-muted-foreground">Próxima entrega</span>
                              <span className="font-medium text-foreground">{selectedProject.dueLabel}</span>
                            </div>
                          </div>
                        )}

                        {detailTab === 'sprints' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Sprint actual</div>
                              <div className="text-muted-foreground">En progreso con seguimiento diario activo.</div>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Siguiente sprint</div>
                              <div className="text-muted-foreground">Planificado para continuar refinamiento y QA.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'boards' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Board principal</div>
                              <div className="text-muted-foreground">Flujo Kanban con columnas activas y finalizadas.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'milestones' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Milestone en curso</div>
                              <div className="text-muted-foreground">Pendiente de cerrar validaciones de integración.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'code-review' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Revisión activa</div>
                              <div className="text-muted-foreground">Pull requests pendientes de aprobación y merge.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'repositorios' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Repositorio enlazado</div>
                              <div className="text-muted-foreground">Conexión al repositorio principal del proyecto.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'equipo' && (
                          <div className="space-y-2 text-[12px]">
                            <div className="rounded-[3px] border border-border bg-background p-3 flex items-center justify-between gap-2">
                              <span className="text-muted-foreground">Miembros</span>
                              <span className="font-medium text-foreground">{selectedProject.teamSize}</span>
                            </div>
                            <div className="rounded-[3px] border border-border bg-background p-3">
                              <div className="font-medium text-foreground">Colaboradores activos</div>
                              <div className="text-muted-foreground">Equipo asignado a la entrega y seguimiento diario.</div>
                            </div>
                          </div>
                        )}

                        {detailTab === 'configuracion' && (
                          <div className="rounded-[3px] border border-border bg-background p-3 text-[12px] text-muted-foreground">
                            Configuración del proyecto disponible en la vista real después de iniciar sesión.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'reports' && (
                <div className="grid xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-3">
                  <div className="rounded-[4px] border border-border bg-card p-4 space-y-4">
                    <div>
                      <div className="text-[12px] font-semibold text-foreground">Reporte ejecutivo</div>
                      <div className="text-[11px] text-muted-foreground">Resumen comparable entre semanas con datos locales mockeados</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="rounded-[3px] border border-border bg-background p-3">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Desviación de plazo</div>
                        <div className="text-[20px] font-semibold text-foreground">-6%</div>
                        <div className="text-[11px] text-success">Mejoró respecto a la semana anterior</div>
                      </div>
                      <div className="rounded-[3px] border border-border bg-background p-3">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Variación de alcance</div>
                        <div className="text-[20px] font-semibold text-foreground">+2</div>
                        <div className="text-[11px] text-warning">Cambios menores bajo control</div>
                      </div>
                    </div>
                    <div className="rounded-[3px] border border-border bg-background p-3">
                      <div className="text-[12px] font-medium text-foreground mb-2">Tendencia del último ciclo</div>
                      <div className="h-28 rounded-[3px] bg-surface-secondary/60 border border-border/60 p-2 flex items-end gap-2">
                        {[22, 38, 35, 49, 54, 60, 58, 72].map((height, index) => (
                          <div key={index} className="flex-1 flex items-end"><div className="w-full rounded-t-[2px] bg-info/20" style={{ height: `${height}%` }}><div className="h-[70%] w-full rounded-t-[2px] bg-info/75" /></div></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[4px] border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-[12px] font-semibold text-foreground">Lecturas ejecutivas</div>
                        <div className="text-[11px] text-muted-foreground">Resúmenes y estados de control</div>
                      </div>
                      <StatusBadge status="info" variant="pill" size="sm" text="Semanal" />
                    </div>
                    <div className="space-y-2">
                      {isStakeholderView ? (
                        <EmptyState icon="inbox" title={roleData.emptyStates.reports.title} description={roleData.emptyStates.reports.description} />
                      ) : (
                        [
                          { label: 'Proyectos en verde', value: '18', tone: 'success' },
                          { label: 'Revisiones pendientes', value: '4', tone: 'warning' },
                          { label: 'Tareas bloqueadas', value: '1', tone: 'danger' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-[3px] border border-border bg-background px-3 py-2 text-[12px]">
                            <span className="text-muted-foreground">{item.label}</span>
                            <StatusBadge status={item.tone === 'danger' ? 'danger' : item.tone === 'warning' ? 'warning' : 'success'} variant="pill" size="sm" text={item.value} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'alerts' && (
                <div className="grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-3">
                  <div className="rounded-[4px] border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[12px] font-semibold text-foreground">Alertas recientes</div>
                        <div className="text-[11px] text-muted-foreground">Notificaciones simuladas del contexto actual</div>
                      </div>
                      <StatusBadge status="warning" variant="pill" size="sm" text={`${roleData.alerts.length} activas`} />
                    </div>
                    {roleData.alerts.length === 0 ? (
                      <EmptyState icon="inbox" title={roleData.emptyStates.alerts.title} description={roleData.emptyStates.alerts.description} />
                    ) : (
                      <div className="space-y-2">
                        {roleData.alerts.map((alert) => (
                          <div key={alert.id} className="rounded-[3px] border border-border bg-background p-3 flex items-start gap-3">
                            <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full shrink-0 ${alert.tone === 'danger' ? 'bg-destructive/90' : alert.tone === 'success' ? 'bg-success/90' : alert.tone === 'info' ? 'bg-info/90' : 'bg-warning/90'}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-[12px] font-medium text-foreground truncate">{alert.title}</div>
                                <div className="text-[10px] text-muted-foreground shrink-0">{alert.time}</div>
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-1 truncate">{alert.project} · {alert.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-[4px] border border-border bg-card p-4 space-y-3">
                    <div className="text-[12px] font-semibold text-foreground">Criterios de priorización</div>
                    <div className="space-y-2 text-[12px] text-muted-foreground">
                      <div className="rounded-[3px] border border-border bg-background p-3">Las alertas críticas elevan la franja roja en la cabecera del proyecto.</div>
                      <div className="rounded-[3px] border border-border bg-background p-3">Las incidencias medias se agrupan por proyecto para no saturar la vista.</div>
                      <div className="rounded-[3px] border border-border bg-background p-3">Los perfiles ejecutivos ven resúmenes y no la cola operativa completa.</div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'profile' && (
                <div className="grid xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-3">
                  <div className="rounded-[4px] border border-border bg-card p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">{roleData.profile.name.charAt(0)}</div>
                      <div>
                        <div className="text-[12px] font-semibold text-foreground">{roleData.profile.name}</div>
                        <div className="text-[11px] text-muted-foreground">{roleData.profile.title}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-[12px]">
                      <div><span className="text-muted-foreground">Correo:</span> <span className="text-foreground">{roleData.profile.email}</span></div>
                      <div><span className="text-muted-foreground">Cobertura:</span> <span className="text-foreground">{roleData.profile.scope}</span></div>
                      <div><span className="text-muted-foreground">Ubicación:</span> <span className="text-foreground">{roleData.profile.location}</span></div>
                      <div><span className="text-muted-foreground">Equipo:</span> <span className="text-foreground">{roleData.profile.team}</span></div>
                    </div>
                  </div>

                  <div className="rounded-[4px] border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-[12px] font-semibold text-foreground">Configuración y alcance</div>
                        <div className="text-[11px] text-muted-foreground">Preferencias, permisos y placeholders de demo</div>
                      </div>
                      <StatusBadge status="neutral" variant="pill" size="sm" text="Solo lectura" />
                    </div>

                    {canEditProfileSettings ? (
                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="rounded-[3px] border border-border bg-background p-3">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Notificaciones</div>
                          <div className="text-[12px] font-medium text-foreground">Resumen diario activado</div>
                        </div>
                        <div className="rounded-[3px] border border-border bg-background p-3">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Privacidad</div>
                          <div className="text-[12px] font-medium text-foreground">Datos visibles por rol</div>
                        </div>
                        <div className="rounded-[3px] border border-border bg-background p-3 md:col-span-2">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Vista de prueba</div>
                          <div className="text-[12px] text-foreground">{roleData.emptyStates.settings.description}</div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState icon="file" title={roleData.emptyStates.settings.title} description={roleData.emptyStates.settings.description} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DemoShell>
    </section>
  );
}
