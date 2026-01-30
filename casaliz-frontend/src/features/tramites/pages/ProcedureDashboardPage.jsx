import { useMemo, useState } from 'react';
import { Filter, LayoutDashboard, Search } from 'lucide-react';
import { procedureInstances, staffMembers, statusOptions } from '../data/mockData';

const ProcedureDashboardPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [responsibleFilter, setResponsibleFilter] = useState('Todos');
  const [selectedProcedureId, setSelectedProcedureId] = useState(procedureInstances[0]?.id || '');

  const filteredProcedures = useMemo(() => {
    return procedureInstances.filter((procedure) => {
      const matchesSearch =
        procedure.client.toLowerCase().includes(searchValue.toLowerCase()) ||
        procedure.projectName.toLowerCase().includes(searchValue.toLowerCase()) ||
        procedure.code.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || procedure.status === statusFilter;
      const matchesResponsible =
        responsibleFilter === 'Todos' || procedure.generalResponsible === responsibleFilter;
      return matchesSearch && matchesStatus && matchesResponsible;
    });
  }, [searchValue, statusFilter, responsibleFilter]);

  const selectedProcedure = useMemo(
    () => procedureInstances.find((procedure) => procedure.id === selectedProcedureId),
    [selectedProcedureId]
  );

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#233274] mb-2">Dashboard de trámites</h1>
          <p className="text-[#9a98a0]">
            Vista general con filtros, alertas y detalle por fases para todos los trámites.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 text-[#233274] font-bold">
              <LayoutDashboard className="w-5 h-5" />
              Modo Dios
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a98a0]" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Buscar por código, cliente o trámite"
                  className="w-full rounded-lg border border-[#ebe7df] pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#9a98a0]" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                >
                  <option value="Todos">Todos los estados</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  value={responsibleFilter}
                  onChange={(event) => setResponsibleFilter(event.target.value)}
                  className="rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                >
                  <option value="Todos">Todos los responsables</option>
                  {staffMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#233274]">
                    <th className="py-2">Código</th>
                    <th>Cliente</th>
                    <th>Trámite</th>
                    <th>Ubicación</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Fase actual</th>
                    <th>Últ. actualización</th>
                    <th>Próxima fecha</th>
                  </tr>
                </thead>
                <tbody className="text-[#233274]">
                  {filteredProcedures.map((procedure) => (
                    <tr
                      key={procedure.id}
                      className={`border-t border-[#ebe7df] cursor-pointer ${
                        selectedProcedureId === procedure.id ? 'bg-[#f8f5ef]' : ''
                      }`}
                      onClick={() => setSelectedProcedureId(procedure.id)}
                    >
                      <td className="py-3 font-semibold">{procedure.code}</td>
                      <td>{procedure.client}</td>
                      <td>{procedure.projectName}</td>
                      <td>{procedure.location}</td>
                      <td>{procedure.generalResponsible}</td>
                      <td>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            procedure.status === 'En Proceso'
                              ? 'bg-blue-100 text-blue-700'
                              : procedure.status === 'Observado'
                              ? 'bg-yellow-100 text-yellow-700'
                              : procedure.status === 'Aprobado'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {procedure.status}
                        </span>
                      </td>
                      <td>
                        {procedure.currentPhase} · {procedure.currentSubphase}
                      </td>
                      <td>{procedure.lastUpdate}</td>
                      <td>{procedure.nextDue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProcedures.length === 0 && (
                <div className="text-center py-10 text-[#9a98a0]">No se encontraron trámites.</div>
              )}
            </div>
          </div>

          <aside className="bg-white rounded-2xl shadow-lg p-6">
            {selectedProcedure ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#233274]">Detalle del trámite</h2>
                  <p className="text-sm text-[#9a98a0]">{selectedProcedure.projectName}</p>
                </div>

                <div className="bg-[#f8f5ef] rounded-xl p-4 text-sm text-[#233274] space-y-1">
                  <p>
                    <span className="font-semibold">Cliente:</span> {selectedProcedure.client}
                  </p>
                  <p>
                    <span className="font-semibold">Ubicación:</span> {selectedProcedure.location}
                  </p>
                  <p>
                    <span className="font-semibold">Responsable general:</span>{' '}
                    {selectedProcedure.generalResponsible}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span> {selectedProcedure.status}
                  </p>
                  <p>
                    <span className="font-semibold">Avance global:</span> {selectedProcedure.progress}%
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#233274] mb-2">Alertas & observaciones</h3>
                  <div className="border border-[#ebe7df] rounded-lg p-3 text-sm text-[#9a98a0]">
                    {selectedProcedure.alerts}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#233274] mb-2">Tareas activas</h3>
                  {selectedProcedure.tasks.length === 0 ? (
                    <p className="text-sm text-[#9a98a0]">Sin tareas activas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedProcedure.tasks.map((task) => (
                        <li key={task.id} className="border border-[#ebe7df] rounded-lg p-3">
                          <p className="text-sm font-semibold text-[#233274]">{task.subphase}</p>
                          <p className="text-xs text-[#9a98a0]">{task.phase}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-[#233274]">
                            <span>{task.responsible}</span>
                            <span className="px-2 py-1 rounded-full bg-[#f8f5ef]">
                              {task.status}
                            </span>
                            <span>{task.dueDate}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-[#9a98a0]">Selecciona un trámite para ver el detalle.</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDashboardPage;
