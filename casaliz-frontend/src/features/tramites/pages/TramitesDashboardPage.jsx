import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import { tramitesMock, statusOptions, tramitesTemplates } from '../data/tramitesData';

const TramitesDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedManager, setSelectedManager] = useState('Todos');
  const [selectedTemplate, setSelectedTemplate] = useState('Todos');
  const [expandedId, setExpandedId] = useState(null);

  const managers = useMemo(() => {
    return ['Todos', ...new Set(tramitesMock.map((item) => item.manager))];
  }, []);

  const templates = useMemo(() => {
    return ['Todos', ...new Set(tramitesTemplates.map((item) => item.name))];
  }, []);

  const filteredTramites = useMemo(() => {
    return tramitesMock.filter((item) => {
      const matchesSearch = [item.code, item.client, item.name, item.location]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'Todos' || item.status === selectedStatus;
      const matchesManager = selectedManager === 'Todos' || item.manager === selectedManager;
      const matchesTemplate = selectedTemplate === 'Todos' || item.template === selectedTemplate;

      return matchesSearch && matchesStatus && matchesManager && matchesTemplate;
    });
  }, [searchTerm, selectedStatus, selectedManager, selectedTemplate]);

  const stats = useMemo(() => {
    const total = tramitesMock.length;
    const inProgress = tramitesMock.filter((item) => item.status === 'En Proceso').length;
    const observed = tramitesMock.filter((item) => item.status === 'Observado').length;
    const approved = tramitesMock.filter((item) => item.status === 'Aprobado').length;
    return { total, inProgress, observed, approved };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#9a98a0] font-semibold">
              Modo Dios
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[#233274]">
              Gestión integral de trámites
            </h1>
            <p className="text-[#9a98a0] mt-2 max-w-2xl">
              Vista unificada para monitorear el estado general, responsables, fechas clave y alertas de
              todos los trámites en curso.
            </p>
          </div>
          <Link
            to="/agency/tramites/nuevo"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#e15f0b] to-[#d14a00] text-[#f8f5ef] font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Registrar trámite
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-sm text-[#9a98a0]">Total trámites</p>
            <p className="text-2xl font-black text-[#233274]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-sm text-[#9a98a0]">En proceso</p>
            <p className="text-2xl font-black text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-sm text-[#9a98a0]">Observados</p>
            <p className="text-2xl font-black text-rose-600">{stats.observed}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-sm text-[#9a98a0]">Aprobados</p>
            <p className="text-2xl font-black text-green-600">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-[#233274] font-semibold">
              <Filter className="w-5 h-5" />
              Filtros avanzados
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a98a0]" />
                <input
                  type="text"
                  placeholder="Buscar por código, cliente o ubicación"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#e15f0b]/40"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="w-full md:w-48 py-2 px-3 rounded-xl border border-[#e5e7eb] text-sm"
              >
                <option value="Todos">Todos los estados</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                value={selectedManager}
                onChange={(event) => setSelectedManager(event.target.value)}
                className="w-full md:w-52 py-2 px-3 rounded-xl border border-[#e5e7eb] text-sm"
              >
                {managers.map((manager) => (
                  <option key={manager} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
              <select
                value={selectedTemplate}
                onChange={(event) => setSelectedTemplate(event.target.value)}
                className="w-full md:w-64 py-2 px-3 rounded-xl border border-[#e5e7eb] text-sm"
              >
                {templates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f9fafb] text-[#233274]">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Código</th>
                  <th className="text-left px-6 py-4 font-semibold">Cliente</th>
                  <th className="text-left px-6 py-4 font-semibold">Proyecto / Trámite</th>
                  <th className="text-left px-6 py-4 font-semibold">Responsable</th>
                  <th className="text-left px-6 py-4 font-semibold">Estado</th>
                  <th className="text-left px-6 py-4 font-semibold">Fase actual</th>
                  <th className="text-left px-6 py-4 font-semibold">Próxima fecha</th>
                  <th className="text-left px-6 py-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTramites.map((item) => (
                  <Fragment key={item.id}>
                    <tr
                      key={item.id}
                      className="border-b border-[#f1f5f9] hover:bg-[#fdf6f1] transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-[#233274]">{item.code}</td>
                      <td className="px-6 py-4">{item.client}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#233274]">{item.name}</div>
                        <div className="text-xs text-[#9a98a0]">{item.location}</div>
                      </td>
                      <td className="px-6 py-4">{item.manager}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#9a98a0]">{item.phase}</div>
                        <div className="mt-2">
                          <ProgressBar value={item.progress} />
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.nextDue}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setExpandedId(item.id === expandedId ? null : item.id)}
                          className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          Detalle
                          {expandedId === item.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === item.id && (
                      <tr className="bg-[#fffaf6]">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <h3 className="font-semibold text-[#233274] mb-3">Detalle general</h3>
                              <ul className="text-sm text-[#4b5563] space-y-2">
                                <li>
                                  <span className="font-semibold text-[#233274]">Tipo:</span>{' '}
                                  {item.template}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Responsable:</span>{' '}
                                  {item.manager}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Última actualización:</span>{' '}
                                  {item.lastUpdate}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Alertas:</span>{' '}
                                  {item.alerts}
                                </li>
                              </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <h3 className="font-semibold text-[#233274] mb-3">Fechas clave</h3>
                              <ul className="text-sm text-[#4b5563] space-y-2">
                                <li>
                                  <span className="font-semibold text-[#233274]">Creación:</span>{' '}
                                  {item.createdAt}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Inicio:</span>{' '}
                                  {item.startedAt}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Fin estimado:</span>{' '}
                                  {item.estimatedEnd}
                                </li>
                                <li>
                                  <span className="font-semibold text-[#233274]">Fin real:</span>{' '}
                                  {item.realEnd || 'En curso'}
                                </li>
                              </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <h3 className="font-semibold text-[#233274] mb-3">Acciones rápidas</h3>
                              <div className="space-y-3">
                                <Link
                                  to={`/agency/tramites/${item.id}`}
                                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-[#233274] text-white font-semibold"
                                >
                                  Ver tablero del trámite
                                </Link>
                                <Link
                                  to="/agency/tramites/plantillas"
                                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl border border-[#233274] text-[#233274] font-semibold"
                                >
                                  Revisar plantilla
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTramites.length === 0 && (
            <div className="p-8 text-center text-[#9a98a0]">
              No se encontraron trámites con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TramitesDashboardPage;
