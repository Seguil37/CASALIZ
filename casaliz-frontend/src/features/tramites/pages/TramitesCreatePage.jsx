import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardCheck, UserSquare2 } from 'lucide-react';
import { tramitesTemplates, statusOptions, tramitesTeamMembers } from '../data/tramitesData';

const tabs = [
  { id: 'general', label: 'Datos generales', icon: ClipboardCheck },
  { id: 'dates', label: 'Fechas clave', icon: Calendar },
  { id: 'team', label: 'Equipo y responsables', icon: UserSquare2 },
];

const TramitesCreatePage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedTemplateId, setSelectedTemplateId] = useState(tramitesTemplates[0]?.id);

  const selectedTemplate = useMemo(() => {
    return tramitesTemplates.find((template) => template.id === selectedTemplateId);
  }, [selectedTemplateId]);

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274]">Registro de trámite / proyecto</h1>
            <p className="text-[#9a98a0] mt-2 max-w-2xl">
              Crea una instancia real para un cliente a partir de una plantilla. La estructura se copiará
              automáticamente y se podrá gestionar el avance por fases y tareas.
            </p>
          </div>
          <Link
            to="/agency/tramites"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#233274] text-[#233274] font-semibold"
          >
            Volver al dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      activeTab === tab.id
                        ? 'border-[#e15f0b] bg-[#fff5ef] text-[#233274]'
                        : 'border-[#e5e7eb] text-[#9a98a0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Tipo de trámite</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]"
                  >
                    {tramitesTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Nombre del trámite</label>
                  <input
                    type="text"
                    placeholder="Ej. Licencia de Obra - Torre Huancayo"
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Cliente / Propietario</label>
                  <input
                    type="text"
                    placeholder="Ej. Grupo San Martín"
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Nombre del inmueble</label>
                  <input
                    type="text"
                    placeholder="Ej. Torre Huancayo"
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-[#233274]">Ubicación del inmueble</label>
                  <input
                    type="text"
                    placeholder="Ej. Av. Los Jardines 456, Huancayo"
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Responsable general</label>
                  <select className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]">
                    {tramitesTeamMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Estado general</label>
                  <select className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]">
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Fecha de creación</label>
                  <input type="date" className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Fecha de inicio</label>
                  <input type="date" className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Fecha estimada fin</label>
                  <input type="date" className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#233274]">Fecha fin real</label>
                  <input type="date" className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb]" />
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#233274]">Equipo operativo</label>
                    <select multiple className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb] h-40">
                      {tramitesTeamMembers.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name} · {member.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#233274]">Notas internas</label>
                    <textarea
                      placeholder="Observaciones internas para el equipo"
                      className="w-full mt-2 px-4 py-2 rounded-xl border border-[#e5e7eb] h-40"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-[#233274] text-white font-semibold"
              >
                Guardar trámite
              </button>
              <button type="button" className="px-6 py-3 rounded-xl border border-[#e5e7eb] text-[#9a98a0]">
                Guardar como borrador
              </button>
            </div>
          </section>

          <aside className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-black text-[#233274]">Estructura base copiada</h2>
            <p className="text-sm text-[#9a98a0] mt-2">
              Estas fases y subfases se copiarán desde la plantilla seleccionada.
            </p>
            <div className="mt-6 space-y-4">
              {selectedTemplate?.phases.map((phase) => (
                <div key={phase.id} className="border border-[#f1f5f9] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#233274]">{phase.name}</p>
                    <span className="text-xs text-[#9a98a0]">
                      {phase.required ? 'Obligatoria' : 'Opcional'}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-[#4b5563]">
                    {phase.subphases.map((subphase) => (
                      <li key={subphase.id} className="flex items-center justify-between">
                        <span>{subphase.name}</span>
                        <span className="text-xs text-[#9a98a0]">
                          {subphase.required ? 'Obligatoria' : 'Opcional'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TramitesCreatePage;
