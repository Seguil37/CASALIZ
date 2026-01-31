import { useMemo, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';
import { tramitesTemplates } from '../data/tramitesData';

const TramitesTemplatesPage = () => {
  const { user } = useAuthStore();
  const [templates, setTemplates] = useState(tramitesTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(tramitesTemplates[0]?.id);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newSubphaseName, setNewSubphaseName] = useState('');

  const isMasterAdmin = user?.role === ROLES.MASTER_ADMIN;

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => template.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  const updateTemplate = (updatedTemplate) => {
    setTemplates((prev) => prev.map((template) => (template.id === updatedTemplate.id ? updatedTemplate : template)));
  };

  const handleAddPhase = () => {
    if (!newPhaseName.trim()) return;
    const newPhase = {
      id: `fase-${Date.now()}`,
      name: newPhaseName,
      required: true,
      subphases: [],
    };
    updateTemplate({
      ...selectedTemplate,
      phases: [...selectedTemplate.phases, newPhase],
    });
    setNewPhaseName('');
  };

  const handleAddSubphase = (phaseId) => {
    if (!newSubphaseName.trim()) return;
    const updatedPhases = selectedTemplate.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        subphases: [
          ...phase.subphases,
          { id: `subfase-${Date.now()}`, name: newSubphaseName, required: true },
        ],
      };
    });
    updateTemplate({ ...selectedTemplate, phases: updatedPhases });
    setNewSubphaseName('');
  };

  const handleDeletePhase = (phaseId) => {
    updateTemplate({
      ...selectedTemplate,
      phases: selectedTemplate.phases.filter((phase) => phase.id !== phaseId),
    });
  };

  const handleDeleteSubphase = (phaseId, subphaseId) => {
    const updatedPhases = selectedTemplate.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        subphases: phase.subphases.filter((subphase) => subphase.id !== subphaseId),
      };
    });
    updateTemplate({ ...selectedTemplate, phases: updatedPhases });
  };

  const movePhase = (phaseId, direction) => {
    const index = selectedTemplate.phases.findIndex((phase) => phase.id === phaseId);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedTemplate.phases.length) return;
    const newPhases = [...selectedTemplate.phases];
    const [removed] = newPhases.splice(index, 1);
    newPhases.splice(newIndex, 0, removed);
    updateTemplate({ ...selectedTemplate, phases: newPhases });
  };

  const togglePhaseRequired = (phaseId) => {
    const updatedPhases = selectedTemplate.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return { ...phase, required: !phase.required };
    });
    updateTemplate({ ...selectedTemplate, phases: updatedPhases });
  };

  const toggleSubphaseRequired = (phaseId, subphaseId) => {
    const updatedPhases = selectedTemplate.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        subphases: phase.subphases.map((subphase) =>
          subphase.id === subphaseId ? { ...subphase, required: !subphase.required } : subphase
        ),
      };
    });
    updateTemplate({ ...selectedTemplate, phases: updatedPhases });
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274]">Catálogo de plantillas de trámite</h1>
            <p className="text-[#9a98a0] mt-2 max-w-2xl">
              Define la estructura base de fases, subfases y tareas que se reutilizará en todos los trámites
              por cliente. Solo el Master Admin puede editar plantillas globales.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e7eb] text-[#233274]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Rol actual: {isMasterAdmin ? 'Master Admin' : 'Usuario/Admin'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-sm font-semibold text-[#9a98a0] uppercase tracking-widest">Plantillas</h2>
            <div className="mt-4 space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    template.id === selectedTemplateId
                      ? 'border-[#e15f0b] bg-[#fff5ef] text-[#233274]'
                      : 'border-transparent hover:border-[#e5e7eb] text-[#4b5563]'
                  }`}
                >
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-xs text-[#9a98a0]">Actualizado: {template.updatedAt}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#233274]">{selectedTemplate.name}</h2>
                <p className="text-sm text-[#9a98a0]">{selectedTemplate.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nueva fase"
                  value={newPhaseName}
                  onChange={(event) => setNewPhaseName(event.target.value)}
                  className="px-4 py-2 rounded-xl border border-[#e5e7eb] text-sm"
                  disabled={!isMasterAdmin}
                />
                <button
                  type="button"
                  onClick={handleAddPhase}
                  disabled={!isMasterAdmin}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
                    isMasterAdmin
                      ? 'bg-[#233274] text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Agregar fase
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {selectedTemplate.phases.map((phase, index) => (
                <div key={phase.id} className="border border-[#f1f5f9] rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-semibold text-[#233274]">{phase.name}</p>
                      <p className="text-xs text-[#9a98a0]">
                        {phase.required ? 'Obligatoria' : 'Opcional'} · {phase.subphases.length} subfases
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => movePhase(phase.id, 'up')}
                        disabled={!isMasterAdmin || index === 0}
                        className="p-2 rounded-lg border border-[#e5e7eb] text-[#233274] disabled:opacity-40"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhase(phase.id, 'down')}
                        disabled={!isMasterAdmin || index === selectedTemplate.phases.length - 1}
                        className="p-2 rounded-lg border border-[#e5e7eb] text-[#233274] disabled:opacity-40"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePhaseRequired(phase.id)}
                        disabled={!isMasterAdmin}
                        className="px-3 py-2 rounded-lg border border-[#e5e7eb] text-xs font-semibold"
                      >
                        {phase.required ? 'Marcar opcional' : 'Marcar obligatoria'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhase(phase.id)}
                        disabled={!isMasterAdmin}
                        className="p-2 rounded-lg border border-[#fee2e2] text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
                    <div className="space-y-3">
                      {phase.subphases.map((subphase) => (
                        <div
                          key={subphase.id}
                          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-[#f9fafb] rounded-xl px-4 py-3"
                        >
                          <div>
                            <p className="font-semibold text-[#233274]">{subphase.name}</p>
                            <p className="text-xs text-[#9a98a0]">
                              {subphase.required ? 'Obligatoria' : 'Opcional'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSubphaseRequired(phase.id, subphase.id)}
                              disabled={!isMasterAdmin}
                              className="px-3 py-1 rounded-lg border border-[#e5e7eb] text-xs font-semibold"
                            >
                              {subphase.required ? 'Marcar opcional' : 'Marcar obligatoria'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubphase(phase.id, subphase.id)}
                              disabled={!isMasterAdmin}
                              className="p-2 rounded-lg border border-[#fee2e2] text-red-500 disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#fffaf6] rounded-xl p-4">
                      <p className="text-sm font-semibold text-[#233274] mb-2">Nueva subfase</p>
                      <input
                        type="text"
                        placeholder="Nombre de subfase"
                        value={newSubphaseName}
                        onChange={(event) => setNewSubphaseName(event.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm"
                        disabled={!isMasterAdmin}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubphase(phase.id)}
                        disabled={!isMasterAdmin}
                        className={`mt-3 w-full px-3 py-2 rounded-lg text-sm font-semibold ${
                          isMasterAdmin
                            ? 'bg-[#e15f0b] text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Agregar subfase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TramitesTemplatesPage;
