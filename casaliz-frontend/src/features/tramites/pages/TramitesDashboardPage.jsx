import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  Search,
  ClipboardList,
  AlertTriangle,
  CalendarClock,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { tramitesInstances } from '../data/tramitesData';

const statusStyles = {
  'En proceso': 'bg-blue-100 text-blue-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Observado: 'bg-red-100 text-red-700',
  Aprobado: 'bg-green-100 text-green-700',
  Finalizado: 'bg-gray-100 text-gray-700',
};

const TramitesDashboardPage = () => {
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTramiteId, setSelectedTramiteId] = useState(tramitesInstances[0]?.id || '');

  const filtered = useMemo(() => {
    return tramitesInstances.filter((tramite) => {
      const matchesQuery = [
        tramite.code,
        tramite.client,
        tramite.projectName,
        tramite.location,
        tramite.generalResponsible,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = !selectedStatus || tramite.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [query, selectedStatus]);

  const selectedTramite = tramitesInstances.find((tramite) => tramite.id === selectedTramiteId);

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">Modo Dios - Trámites</h1>
            <p className="text-[#9a98a0]">
              Visualiza el estado general de todos los trámites, filtra por responsable y profundiza en cada fase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/agency/tramites/nuevo"
              className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              Nuevo trámite
            </Link>
            <Link
              to="/agency/tramites/plantillas"
              className="inline-flex items-center gap-2 border border-[#d8d3c5] text-[#233274] font-semibold px-5 py-3 rounded-xl hover:bg-white transition-colors"
            >
              <Users className="w-5 h-5" />
              Plantillas
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-6">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 text-[#233274]">
                <Filter className="w-5 h-5" />
                <h2 className="text-xl font-bold">Tabla general de trámites</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#9a98a0] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por cliente, proyecto o código"
                    className="pl-10 pr-4 py-2 rounded-full border border-[#ebe7df] focus:border-[#e15f0b] outline-none text-sm w-64"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="px-4 py-2 rounded-full border border-[#ebe7df] text-sm text-[#233274]"
                >
                  <option value="">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Observado">Observado</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-[#9a98a0] uppercase text-xs">
                  <tr>
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Proyecto/Trámite</th>
                    <th className="pb-3">Responsable</th>
                    <th className="pb-3">Estado general</th>
                    <th className="pb-3">Fase actual</th>
                    <th className="pb-3">Próxima fecha</th>
                    <th className="pb-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tramite) => (
                    <tr
                      key={tramite.id}
                      className={`border-t border-[#f1ede4] hover:bg-[#f8f5ef] transition-colors ${
                        selectedTramiteId === tramite.id ? 'bg-[#f8f5ef]' : ''
                      }`}
                    >
                      <td className="py-4 font-semibold text-[#233274]">{tramite.code}</td>
                      <td className="py-4">{tramite.client}</td>
                      <td className="py-4">{tramite.projectName}</td>
                      <td className="py-4">{tramite.generalResponsible}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[tramite.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tramite.status}
                        </span>
                      </td>
                      <td className="py-4">{tramite.currentPhase}</td>
                      <td className="py-4">{tramite.nextDue}</td>
                      <td className="py-4">
                        <button
                          onClick={() => setSelectedTramiteId(tramite.id)}
                          className="text-[#e15f0b] font-semibold hover:text-[#d14a00] inline-flex items-center gap-1"
                        >
                          Ver detalle
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {selectedTramite ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase text-[#9a98a0]">Detalle del trámite</p>
                    <h3 className="text-xl font-bold text-[#233274]">{selectedTramite.projectName}</h3>
                    <p className="text-sm text-[#9a98a0]">{selectedTramite.client}</p>
                  </div>
                  <Link
                    to={`/agency/tramites/${selectedTramite.id}`}
                    className="text-sm font-semibold text-[#e15f0b] hover:text-[#d14a00]"
                  >
                    Abrir ficha
                  </Link>
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow label="Ubicación" value={selectedTramite.location} />
                  <DetailRow label="Responsable general" value={selectedTramite.generalResponsible} />
                  <DetailRow label="Estado general" value={selectedTramite.status} />
                  <DetailRow label="Última actualización" value={selectedTramite.lastUpdate} />
                </div>

                <div className="bg-[#f8f5ef] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#233274] mb-3">
                    <CalendarClock className="w-4 h-4" />
                    <h4 className="font-semibold">Próxima fecha límite</h4>
                  </div>
                  <p className="text-lg font-bold text-[#e15f0b]">{selectedTramite.nextDue}</p>
                  <p className="text-sm text-[#9a98a0]">{selectedTramite.mode}</p>
                </div>

                <div className="bg-[#fef3c7] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#b45309] mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="font-semibold">Alertas y observaciones</h4>
                  </div>
                  <p className="text-sm text-[#b45309]">{selectedTramite.alerts}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-[#9a98a0]">Avance general</span>
                    <span className="font-semibold text-[#233274]">{selectedTramite.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#ebe7df] rounded-full">
                    <div
                      className="h-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] rounded-full"
                      style={{ width: `${selectedTramite.progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#9a98a0]">Selecciona un trámite para ver el detalle.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[#9a98a0]">{label}</span>
    <span className="text-right text-[#233274] font-semibold">{value}</span>
  </div>
);

export default TramitesDashboardPage;
