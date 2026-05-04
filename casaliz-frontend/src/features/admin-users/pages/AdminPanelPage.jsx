import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  Layers3,
  ListTodo,
  Megaphone,
  Settings2,
  UserRound,
  Users,
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { ROLES, MODULES, canAccessModule } from '../../../shared/constants/roles';

const STAFF_ROLES = [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR];

const adminItems = [
  {
    key: 'projects',
    module: MODULES.PROJECTS,
    group: 'announcements',
    title: 'Gestion de proyectos publicados',
    description: 'Administra los proyectos visibles en la web y su contenido comercial.',
    eyebrow: 'Anuncios',
    to: '/agency/dashboard',
    roles: STAFF_ROLES,
    icon: FolderKanban,
    accent: 'from-[#233274] via-[#31469a] to-[#425cc2]',
    badge: 'Proyectos',
    glow: 'shadow-[0_20px_50px_rgba(35,50,116,0.18)]',
  },
  {
    key: 'services',
    module: MODULES.SERVICES,
    group: 'announcements',
    title: 'Gestion de servicios',
    description: 'Administra los servicios publicados y sus contenidos.',
    eyebrow: 'Anuncios',
    to: '/agency/services',
    roles: STAFF_ROLES,
    icon: BriefcaseBusiness,
    accent: 'from-[#e15f0b] via-[#ef7d2b] to-[#f6a45c]',
    badge: 'Servicios',
    glow: 'shadow-[0_20px_50px_rgba(225,95,11,0.16)]',
  },
  {
    key: 'tramites',
    module: MODULES.TRAMITES_MANAGE,
    group: 'operations',
    title: 'Gestion de tramites',
    description: 'Crea, organiza y controla los tramites registrados.',
    eyebrow: 'Operacion',
    to: '/tramites/gestion',
    roles: STAFF_ROLES,
    icon: Settings2,
    accent: 'from-[#1f6f78] via-[#2e8f99] to-[#58b2bb]',
    badge: 'Control',
    glow: 'shadow-[0_20px_50px_rgba(31,111,120,0.16)]',
  },
  {
    key: 'clients',
    module: MODULES.TRAMITES_MANAGE,
    group: 'operations',
    title: 'Clientes',
    description: 'Administra clientes registrados, vincula tramites, revisa historial y detecta oportunidades de seguimiento.',
    eyebrow: 'Relacion comercial',
    to: '/admin/clientes',
    roles: STAFF_ROLES,
    icon: UserRound,
    accent: 'from-[#6b4a2f] via-[#9a6a43] to-[#c89662]',
    badge: 'Clientes',
    glow: 'shadow-[0_20px_50px_rgba(154,106,67,0.16)]',
  },
  {
    key: 'types',
    module: MODULES.TRAMITE_TYPES,
    group: 'operations',
    title: 'Tipos de tramite',
    description: 'Configura fases, subfases y estructuras de tramite.',
    eyebrow: 'Configuracion',
    to: '/tramites/tipos',
    roles: STAFF_ROLES,
    icon: Layers3,
    accent: 'from-[#5b3f99] via-[#7153b7] to-[#9274d8]',
    badge: 'Plantillas',
    glow: 'shadow-[0_20px_50px_rgba(91,63,153,0.18)]',
  },
  {
    key: 'control',
    module: MODULES.TRAMITES_CONTROL,
    group: 'operations',
    title: 'Vista general tramites',
    description: 'Supervisa el avance global de todos los tramites.',
    eyebrow: 'Seguimiento',
    to: '/tramites/control',
    roles: STAFF_ROLES,
    icon: ClipboardList,
    accent: 'from-[#0f4c81] via-[#246ca8] to-[#4b93d6]',
    badge: 'Monitoreo',
    glow: 'shadow-[0_20px_50px_rgba(15,76,129,0.16)]',
  },
  {
    key: 'tasks',
    module: MODULES.TASKS_SUMMARY,
    group: 'operations',
    title: 'Resumen de tareas',
    description: 'Consulta tareas asignadas por proyecto, usuario y estado.',
    eyebrow: 'Productividad',
    to: '/tramites/resumen-tareas',
    roles: STAFF_ROLES,
    icon: ListTodo,
    accent: 'from-[#8b3d16] via-[#b85a24] to-[#dc7d3f]',
    badge: 'Tareas',
    glow: 'shadow-[0_20px_50px_rgba(184,90,36,0.16)]',
  },
  {
    key: 'admins',
    module: MODULES.ADMIN_USERS,
    group: 'operations',
    title: 'Gestion de administradores',
    description: 'Controla cuentas internas, roles y accesos.',
    eyebrow: 'Equipo',
    to: '/admin/users',
    roles: STAFF_ROLES,
    icon: Users,
    accent: 'from-[#285c3a] via-[#3d8751] to-[#6cb47f]',
    badge: 'Usuarios',
    glow: 'shadow-[0_20px_50px_rgba(40,92,58,0.16)]',
  },
];

const adminGroups = [
  {
    key: 'operations',
    title: 'Tramites y operacion interna',
    eyebrow: 'Control operativo',
    description:
      'Organizacion, seguimiento y administracion de tramites, tareas, plantillas y accesos internos.',
    icon: ClipboardList,
  },
  {
    key: 'announcements',
    title: 'Anuncios',
    eyebrow: 'Contenido visible',
    description:
      'Publicacion y gestion de contenido comercial que aparece en la web: proyectos y servicios.',
    icon: Megaphone,
  },
];

const roleCopy = {
  [ROLES.MASTER_ADMIN]: 'Acceso total a configuracion, usuarios y operacion.',
  [ROLES.ADMIN]: 'Accesos de gestion y seguimiento operativo.',
  [ROLES.OPERATOR]: 'Panel enfocado en control y tareas asignadas.',
};

const AdminPanelPage = () => {
  const { user } = useAuthStore();
  const items = adminItems.filter((item) => item.roles.includes(user?.role) && canAccessModule(user, item.module));
  const groupedItems = adminGroups
    .map((group) => ({
      ...group,
      items: items.filter((item) => item.group === group.key),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,50,116,0.14),_transparent_34%),linear-gradient(180deg,#fbf7f1_0%,#f6f1ea_100%)] py-8 md:py-10">
      <div className="container-custom max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[30px] border border-[#e5ddd1] bg-white shadow-[0_25px_70px_rgba(77,58,31,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="relative overflow-hidden px-6 py-8 sm:px-8">
              <div className="absolute inset-y-0 right-0 hidden w-40 bg-gradient-to-l from-[#fff1e4] to-transparent lg:block" />
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#e15f0b]">
                Panel administrativo
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-[#233274] sm:text-4xl">
                Accesos rapidos organizados por funcion
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#726c78] sm:text-base">
                Separa anuncios web, tramites internos y el futuro espacio de clientes
                desde un panel mas claro y escalable.
              </p>
            </div>
            <div className="border-t border-[#eee5d9] bg-[#fcfaf6] px-6 py-8 sm:px-8 lg:border-l lg:border-t-0">
              <div className="rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#233274]">
                  Tu alcance
                </p>
                <p className="mt-3 text-lg font-black text-[#233274]">
                  {items.length} modulos disponibles
                </p>
                <p className="mt-2 text-sm leading-6 text-[#7d7783]">
                  {roleCopy[user?.role] || 'Accesos internos segun tu rol actual.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {groupedItems.map((group) => {
          const GroupIcon = group.icon;

          return (
            <section key={group.key} className="space-y-4">
              <div className="flex flex-col gap-3 rounded-[24px] border border-[#eadfce] bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e15f0b]">
                    {group.eyebrow}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#233274]">{group.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#726c78]">
                    {group.description}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#233274] text-white">
                  <GroupIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      className={`group relative overflow-hidden rounded-[30px] border border-white/70 bg-white ${item.glow} transition duration-300 hover:-translate-y-1`}
                    >
                      <div className={`h-28 bg-gradient-to-br ${item.accent} p-6 text-white`}>
                        <div className="flex items-start justify-between">
                          <span className="rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]">
                            {item.eyebrow}
                          </span>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 backdrop-blur-sm">
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                      </div>

                      <div className="flex min-h-[220px] flex-col p-6">
                        <span className="inline-flex w-fit rounded-full bg-[#f3eee5] px-3 py-1 text-xs font-bold text-[#7d6e57]">
                          {item.badge}
                        </span>
                        <h3 className="mt-4 text-2xl font-black leading-tight text-[#233274] transition-colors group-hover:text-[#e15f0b]">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[#78727d]">{item.description}</p>

                        <div className="mt-auto pt-6">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#233274] px-4 py-2 text-sm font-bold text-white transition group-hover:bg-[#e15f0b]">
                            Entrar
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanelPage;
