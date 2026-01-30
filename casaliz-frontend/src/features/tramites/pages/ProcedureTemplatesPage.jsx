import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardList, Plus, Save, Trash2 } from 'lucide-react';
import { procedureTemplates } from '../data/mockData';

const ProcedureTemplatesPage = () => {
  const [templates, setTemplates] = useState(procedureTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCode, setNewTemplateCode] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newSubphaseName, setNewSubphaseName] = useState('');

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;
    const id = `template-${Date.now()}`;
    const nextTemplate = {
      id,
      code: newTemplateCode || `TR-${templates.length + 1}`,
      name: newTemplateName,
      description: 'Nueva plantilla de trámite.',
      phases: [],
    };
    setTemplates((prev) => [...prev, nextTemplate]);
    setSelectedTemplateId(id);
    setNewTemplateName('');
    setNewTemplateCode('');
  };

  const handleAddPhase = () => {
    if (!newPhaseName.trim() || !selectedTemplate) return;
    const phase = {
      id: `phase-${Date.now()}`,
      name: newPhaseName,
      required: true,
      subphases: [],
    };
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, phases: [...template.phases, phase] }
          : template
      )
    );
    setNewPhaseName('');
  };

  const handleAddSubphase = (phaseId) => {
    if (!newSubphaseName.trim() || !selectedTemplate) return;
    setTemplates((prev) =>
      prev.map((template) => {
        if (template.id !== selectedTemplate.id) return template;
        return {
          ...template,
          phases: template.phases.map((phase) =>
            phase.id === phaseId
              ? {
                  ...phase,
                  subphases: [
                    ...phase.subphases,
                    {
                      id: `subphase-${Date.now()}`,
                      name: newSubphaseName,
                      required: true,
                    },
                  ],
                }
              : phase
          ),
        };
      })
    );
    setNewSubphaseName('');
  };

  const handleTogglePhaseRequired = (phaseId) => {
    if (!selectedTemplate) return;
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === selectedTemplate.id
          ? {
              ...template,
              phases: template.phases.map((phase) =>
                phase.id === phaseId ? { ...phase, required: !phase.required } : phase
              ),
            }
          : template
      )
    );
  };

  const handleToggleSubphaseRequired = (phaseId, subphaseId) => {
    if (!selectedTemplate) return;
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === selectedTemplate.id
          ? {
              ...template,
              phases: template.phases.map((phase) =>
                phase.id === phaseId
                  ? {
                      ...phase,
                      subphases: phase.subphases.map((subphase) =>
                        subphase.id === subphaseId
                          ? { ...subphase, required: !subphase.required }
                          : subphase
                      ),
                    }
                  : phase
              ),
            }
          : template
      )
    );
  };

  const handleRemovePhase = (phaseId) => {
    if (!selectedTemplate) return;
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, phases: template.phases.filter((phase) => phase.id !== phaseId) }
          : template
      )
    );
  };

  const handleMovePhase = (phaseId, direction) => {
    if (!selectedTemplate) return;
    setTemplates((prev) =>
      prev.map((template) => {
        if (template.id !== selectedTemplate.id) return template;
        const phases = [...template.phases];
        const index = phases.findIndex((phase) => phase.id === phaseId);
        const nextIndex = index + direction;
        if (index === -1 || nextIndex < 0 || nextIndex >= phases.length) return template;
        [phases[index], phases[nextIndex]] = [phases[nextIndex], phases[index]];
        return { ...template, phases };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#233274] mb-2">Plantillas de trámites</h1>
          <p className="text-[#9a98a0]">
            Define fases y subfases reutilizables para cada tipo de trámite (solo Master Admin).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-2 text-[#233274] font-bold mb-4">
              <ClipboardList className="w-5 h-5" />
              Plantillas
            </div>

            <div className="space-y-3 mb-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selectedTemplateId === template.id
                      ? 'bg-[#233274] text-white border-[#233274]'
                      : 'border-[#ebe7df] hover:border-[#233274] text-[#233274]'
                  }`}
                >
                  <p className="text-sm font-semibold">{template.name}</p>
                  <p className={`text-xs ${selectedTemplateId === template.id ? 'text-white/80' : 'text-[#9a98a0]'}`}>
                    {template.code}
                  </p>
                </button>
              ))}
            </div>

            <div className="border-t border-[#ebe7df] pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#233274]">Nueva plantilla</h3>
              <input
                type="text"
                value={newTemplateName}
                onChange={(event) => setNewTemplateName(event.target.value)}
                placeholder="Nombre del trámite"
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={newTemplateCode}
                onChange={(event) => setNewTemplateCode(event.target.value)}
                placeholder="Código interno (opcional)"
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddTemplate}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-[#233274] font-semibold px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Crear plantilla
              </button>
            </div>
          </aside>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            {selectedTemplate ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#233274]">{selectedTemplate.name}</h2>
                    <p className="text-[#9a98a0]">{selectedTemplate.description}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-semibold px-4 py-2 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                    Guardar plantilla
                  </button>
                </div>

                <div className="bg-[#f8f5ef] rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-semibold text-[#233274] mb-3">Agregar nueva fase</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      value={newPhaseName}
                      onChange={(event) => setNewPhaseName(event.target.value)}
                      placeholder="Nombre de la fase"
                      className="flex-1 rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhase}
                      className="inline-flex items-center justify-center gap-2 bg-[#233274] text-white px-4 py-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar fase
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {selectedTemplate.phases.length === 0 ? (
                    <div className="text-center py-12 text-[#9a98a0]">
                      Agrega fases para estructurar la plantilla.
                    </div>
                  ) : (
                    selectedTemplate.phases.map((phase, index) => (
                      <div key={phase.id} className="border border-[#ebe7df] rounded-xl p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-[#233274]">Fase {index + 1}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${phase.required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {phase.required ? 'Obligatoria' : 'Opcional'}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-[#233274]">{phase.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleMovePhase(phase.id, -1)}
                              className="p-2 border border-[#ebe7df] rounded-lg"
                              aria-label="Mover fase arriba"
                            >
                              <ChevronUp className="w-4 h-4 text-[#233274]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePhase(phase.id, 1)}
                              className="p-2 border border-[#ebe7df] rounded-lg"
                              aria-label="Mover fase abajo"
                            >
                              <ChevronDown className="w-4 h-4 text-[#233274]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePhaseRequired(phase.id)}
                              className="px-3 py-2 text-xs font-semibold border border-[#233274] text-[#233274] rounded-lg"
                            >
                              {phase.required ? 'Marcar opcional' : 'Marcar obligatoria'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhase(phase.id)}
                              className="p-2 border border-red-200 text-red-600 rounded-lg"
                              aria-label="Eliminar fase"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex flex-col md:flex-row gap-3">
                            <input
                              type="text"
                              value={newSubphaseName}
                              onChange={(event) => setNewSubphaseName(event.target.value)}
                              placeholder="Nombre de la subfase"
                              className="flex-1 rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubphase(phase.id)}
                              className="inline-flex items-center justify-center gap-2 bg-[#233274] text-white px-4 py-2 rounded-lg"
                            >
                              <Plus className="w-4 h-4" />
                              Agregar subfase
                            </button>
                          </div>

                          <ul className="space-y-2">
                            {phase.subphases.length === 0 ? (
                              <li className="text-sm text-[#9a98a0]">Sin subfases aún.</li>
                            ) : (
                              phase.subphases.map((subphase) => (
                                <li
                                  key={subphase.id}
                                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#f8f5ef] rounded-lg px-3 py-2"
                                >
                                  <span className="text-sm text-[#233274]">{subphase.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        subphase.required
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {subphase.required ? 'Obligatoria' : 'Opcional'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSubphaseRequired(phase.id, subphase.id)}
                                      className="text-xs font-semibold text-[#233274]"
                                    >
                                      Cambiar
                                    </button>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-[#9a98a0]">Selecciona o crea una plantilla.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProcedureTemplatesPage;
