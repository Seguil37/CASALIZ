import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Paperclip, MessageSquareText, Flag, UserCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import {
  tramitesMock,
  tramitesTasks,
  priorityOptions,
  taskStatusOptions,
  tramitesTeamMembers,
} from '../data/tramitesData';

const TramitesDetailPage = () => {
  const { id } = useParams();
  const tramite = useMemo(() => tramitesMock.find((item) => item.id === id), [id]);
  const [selectedTaskId, setSelectedTaskId] = useState(tramitesTasks[0]?.id);

  if (!tramite) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] py-16">
        <div className="container-custom text-center">
          <p className="text-[#9a98a0]">No se encontró el trámite solicitado.</p>
          <Link
            to="/agency/tramites"
            className="inline-flex mt-4 px-4 py-2 rounded-xl border border-[#233274] text-[#233274]"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#9a98a0] font-semibold">Trámite</p>
            <h1 className="text-3xl font-black text-[#233274]">{tramite.name}</h1>
            <p className="text-[#9a98a0] mt-2">{tramite.location}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={tramite.status} />
            <Link
              to="/agency/tramites"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#233274] text-[#233274] font-semibold"
            >
              Volver al dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-black text-[#233274] mb-4">Resumen general</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4b5563]">
                <div>
                  <p className="font-semibold text-[#233274]">Cliente</p>
                  <p>{tramite.client}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#233274]">Responsable general</p>
                  <p>{tramite.manager}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#233274]">Tipo de trámite</p>
                  <p>{tramite.template}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#233274]">Fase actual</p>
                  <p>{tramite.phase}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#233274]">Última actualización</p>
                  <p>{tramite.lastUpdate}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#233274]">Próxima fecha límite</p>
                  <p>{tramite.nextDue}</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={tramite.progress} />
                <p className="text-xs text-[#9a98a0] mt-2">Avance global: {tramite.progress}%</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-black text-[#233274] mb-4">Asignación de tareas</h2>
              <div className="space-y-4">
                {tramitesTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border rounded-2xl p-4 transition-all ${
                      selectedTaskId === task.id ? 'border-[#e15f0b] bg-[#fff5ef]' : 'border-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#9a98a0]">{task.phase}</p>
                        <p className="font-semibold text-[#233274]">{task.subphase}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTaskId(task.id)}
                        className="text-sm font-semibold text-[#e15f0b]"
                      >
                        Ver detalle
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-[#4b5563]">
                      <div>
                        <p className="text-xs text-[#9a98a0]">Responsable</p>
                        <p>{task.assignee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9a98a0]">Fecha límite</p>
                        <p>{task.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9a98a0]">Estado</p>
                        <p>{task.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9a98a0]">Prioridad</p>
                        <p>{task.priority}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={task.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-black text-[#233274] mb-4">Detalle de tarea</h2>
              {tramitesTasks
                .filter((task) => task.id === selectedTaskId)
                .map((task) => (
                  <div key={task.id} className="space-y-4">
                    <div>
                      <p className="text-sm text-[#9a98a0]">Subfase</p>
                      <p className="font-semibold text-[#233274]">{task.subphase}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#233274]">Responsable asignado</label>
                      <select className="w-full mt-2 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm">
                        {tramitesTeamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-[#233274]">Prioridad</label>
                        <select className="w-full mt-2 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm">
                          {priorityOptions.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#233274]">Estado</label>
                        <select className="w-full mt-2 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm">
                          {taskStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#233274]">Comentarios</label>
                      <textarea
                        defaultValue={task.notes}
                        className="w-full mt-2 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#233274] text-white text-sm font-semibold"
                      >
                        <MessageSquareText className="w-4 h-4" />
                        Guardar actualización
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e5e7eb] text-sm text-[#4b5563]"
                      >
                        <Paperclip className="w-4 h-4" />
                        Adjuntar evidencia
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-black text-[#233274] mb-4">Historial y observaciones</h2>
              <div className="space-y-4 text-sm text-[#4b5563]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fff5ef] flex items-center justify-center">
                    <UserCircle2 className="w-5 h-5 text-[#e15f0b]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#233274]">María Pineda</p>
                    <p>Se enviaron observaciones al municipio y se esperan comentarios finales.</p>
                    <p className="text-xs text-[#9a98a0]">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center">
                    <Flag className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#233274]">Alerta automática</p>
                    <p>Próxima fecha límite en 3 días. Revisar avances de subfase.</p>
                    <p className="text-xs text-[#9a98a0]">Hace 1 día</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TramitesDetailPage;
