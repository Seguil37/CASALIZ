import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  MessageSquare,
  Paperclip,
  UserPlus,
} from 'lucide-react';
import { statusOptions, teamMembers, tramitesInstances } from '../data/tramitesData';

const TramiteDetailPage = () => {
  const { id } = useParams();
  const tramite = useMemo(() => tramitesInstances.find((item) => item.id === id), [id]);
  const [assignment, setAssignment] = useState({
    task: tramite?.tasks?.[0]?.name || '',
    assignee: teamMembers[0],
    due: '',
    priority: 'Media',
  });

  if (!tramite) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] py-8">
        <div className="container-custom">
          <p className="text-[#9a98a0]">No se encontró el trámite solicitado.</p>
          <Link to="/agency/tramites" className="text-[#e15f0b] font-semibold">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <Link to="/agency/tramites" className="inline-flex items-center gap-2 text-[#233274] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-[#9a98a0]">{tramite.code}</p>
              <h1 className="text-2xl font-black text-[#233274] mb-2">{tramite.projectName}</h1>
              <p className="text-sm text-[#9a98a0]">Cliente: {tramite.client}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#f8f5ef] rounded-xl px-4 py-2 text-sm text-[#233274]">
                Responsable: <span className="font-semibold">{tramite.generalResponsible}</span>
              </div>
              <div className="bg-[#fef3c7] rounded-xl px-4 py-2 text-sm text-[#b45309]">
                Estado: <span className="font-semibold">{tramite.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <InfoCard label="Ubicación" value={tramite.location} />
            <InfoCard label="Modo/Estado" value={tramite.mode} />
            <InfoCard label="Fecha última actualización" value={tramite.lastUpdate} icon={CalendarClock} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#233274] mb-4">Fases y subfases</h2>
            <div className="space-y-4">
              {tramite.phases.map((phase) => (
                <div key={phase.name} className="border border-[#ebe7df] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#233274]">{phase.name}</h3>
                    <span className="text-sm font-semibold text-[#e15f0b]">{phase.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#ebe7df] rounded-full mb-4">
                    <div
                      className="h-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] rounded-full"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  <ul className="space-y-2 text-sm">
                    {phase.subphases.map((subphase) => (
                      <li
                        key={subphase.name}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#f8f5ef] rounded-lg px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-[#233274]">{subphase.name}</p>
                          <p className="text-xs text-[#9a98a0]">Responsable: {subphase.assignee}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-[#9a98a0]">{subphase.due}</span>
                          <span className="px-3 py-1 rounded-full bg-white text-[#233274] border border-[#ebe7df]">
                            {subphase.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 text-[#233274] mb-4">
                <ClipboardCheck className="w-5 h-5" />
                <h2 className="text-xl font-bold">Asignación de tareas</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#233274] mb-2 block">Subfase / tarea</label>
                  <input
                    type="text"
                    value={assignment.task}
                    onChange={(event) => setAssignment({ ...assignment, task: event.target.value })}
                    className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274] mb-2 block">Responsable</label>
                  <select
                    value={assignment.assignee}
                    onChange={(event) => setAssignment({ ...assignment, assignee: event.target.value })}
                    className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
                  >
                    {teamMembers.map((member) => (
                      <option key={member}>{member}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#233274] mb-2 block">Fecha límite</label>
                    <input
                      type="date"
                      value={assignment.due}
                      onChange={(event) => setAssignment({ ...assignment, due: event.target.value })}
                      className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#233274] mb-2 block">Prioridad</label>
                    <select
                      value={assignment.priority}
                      onChange={(event) => setAssignment({ ...assignment, priority: event.target.value })}
                      className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
                    >
                      <option>Alta</option>
                      <option>Media</option>
                      <option>Baja</option>
                    </select>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all">
                  <UserPlus className="w-4 h-4" />
                  Asignar tarea
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 text-[#233274] mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-xl font-bold">Tareas activas</h2>
              </div>
              <div className="space-y-3">
                {tramite.tasks.map((task) => (
                  <div key={task.name} className="border border-[#ebe7df] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#233274]">{task.name}</h3>
                      <span className="text-xs text-[#9a98a0]">{task.priority}</span>
                    </div>
                    <p className="text-xs text-[#9a98a0]">Responsable: {task.assignee}</p>
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <span className="px-3 py-1 rounded-full bg-[#f8f5ef] text-[#233274]">
                        {task.status}
                      </span>
                      <span className="text-[#9a98a0]">Vence: {task.due}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9a98a0]">Avance</span>
                        <span className="font-semibold text-[#233274]">{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#ebe7df] rounded-full">
                        <div
                          className="h-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9a98a0] mt-3">
                      <MessageSquare className="w-4 h-4" />
                      {task.notes}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9a98a0] mt-2">
                      <Paperclip className="w-4 h-4" />
                      Adjuntar evidencia
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#233274] mb-4">Actualizar estados</h2>
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className="w-full text-left px-4 py-2 border border-[#ebe7df] rounded-xl text-sm text-[#233274] hover:bg-[#f8f5ef]"
                  >
                    Marcar como {status}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[#f8f5ef] rounded-xl p-4">
    <p className="text-xs uppercase text-[#9a98a0] mb-2 flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4" /> : null}
      {label}
    </p>
    <p className="text-sm font-semibold text-[#233274]">{value}</p>
  </div>
);

export default TramiteDetailPage;
