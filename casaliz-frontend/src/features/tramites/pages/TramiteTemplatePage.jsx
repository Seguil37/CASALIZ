import { useState } from 'react';
import { Plus, ClipboardList, GripVertical, Trash2, Pencil } from 'lucide-react';
import { tramiteTemplates } from '../data/tramitesData';

const TramiteTemplatePage = () => {
  const [templates, setTemplates] = useState(tramiteTemplates);

  const handleToggleRequired = (templateId, phaseId, subphaseId) => {
    setTemplates((prev) =>
      prev.map((template) => {
        if (template.id !== templateId) return template;
        return {
          ...template,
          phases: template.phases.map((phase) => {
            if (phase.id !== phaseId) return phase;
            if (!subphaseId) {
              return { ...phase, required: !phase.required };
            }
            return {
              ...phase,
              subphases: phase.subphases.map((subphase) =>
                subphase.id === subphaseId ? { ...subphase, required: !subphase.required } : subphase
              ),
            };
          }),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">Plantillas de Trámite</h1>
            <p className="text-[#9a98a0]">
              Define fases y subfases reutilizables. Solo Master Admin puede crear y editar plantillas globales.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            Nueva plantilla
          </button>
        </div>

        <div className="space-y-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#233274]">
                    <ClipboardList className="w-5 h-5" />
                    <h2 className="text-xl font-bold">{template.name}</h2>
                  </div>
                  <p className="text-sm text-[#9a98a0]">{template.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#d8d3c5] rounded-xl text-[#233274] font-semibold hover:bg-[#f8f5ef]">
                    <Pencil className="w-4 h-4" />
                    Editar plantilla
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#f4c7c3] rounded-xl text-red-600 font-semibold hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {template.phases.map((phase, index) => (
                  <div key={phase.id} className="border border-[#ebe7df] rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-[#9a98a0]" />
                        <div>
                          <p className="text-sm text-[#9a98a0]">Fase {index + 1}</p>
                          <h3 className="text-lg font-semibold text-[#233274]">{phase.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-[#233274]">
                          <input
                            type="checkbox"
                            checked={phase.required}
                            onChange={() => handleToggleRequired(template.id, phase.id)}
                            className="accent-[#e15f0b]"
                          />
                          Obligatoria
                        </label>
                        <button className="text-sm font-semibold text-[#e15f0b] hover:text-[#d14a00]">
                          Añadir subfase
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.subphases.map((subphase) => (
                        <div key={subphase.id} className="flex items-center justify-between bg-[#f8f5ef] rounded-lg px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-[#233274]">{subphase.name}</p>
                            <p className="text-xs text-[#9a98a0]">{subphase.required ? 'Obligatoria' : 'Opcional'}</p>
                          </div>
                          <label className="flex items-center gap-2 text-xs text-[#233274]">
                            <input
                              type="checkbox"
                              checked={subphase.required}
                              onChange={() => handleToggleRequired(template.id, phase.id, subphase.id)}
                              className="accent-[#e15f0b]"
                            />
                            Obligatoria
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TramiteTemplatePage;
