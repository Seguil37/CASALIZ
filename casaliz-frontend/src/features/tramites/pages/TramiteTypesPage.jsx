import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Layers, ListChecks, Trash2 } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';

const emptyPhase = (order = 1) => ({ name: '', order, description: '', subphases: [] });
const emptySubphase = (order = 1) => ({ name: '', order, description: '' });

const TramiteTypesPage = () => {
  const { user } = useAuthStore();
  const inputClass =
    'w-full rounded-xl border border-[#ebe7df] bg-[#f8f5ef] px-4 py-2 text-[#233274] outline-none placeholder-[#9a98a0] focus:border-[#e15f0b] focus:ring-2 focus:ring-[#f6b17a]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#233274]';
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    is_active: true,
    phases: [emptyPhase()],
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const codeSuggestion = useMemo(() => buildTypeCodeSuggestion(form.name), [form.name]);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const { data } = await tramitesApi.listTypes();
      setTypes(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los tipos de tramite.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      code: '',
      name: '',
      description: '',
      is_active: true,
      phases: [emptyPhase()],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        code: normalizeTypeCode(form.code || codeSuggestion),
      };

      if (editingId) {
        await tramitesApi.updateType(editingId, payload);
      } else {
        await tramitesApi.createType(payload);
      }

      await loadTypes();
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setForm({
      code: type.code,
      name: type.name,
      description: type.description || '',
      is_active: type.is_active,
      phases:
        type.phases?.map((phase, phaseIndex) => ({
          name: phase.name,
          order: phaseIndex + 1,
          description: phase.description || '',
          subphases:
            phase.subphases?.map((subphase, subIndex) => ({
              name: subphase.name,
              order: subIndex + 1,
              description: subphase.description || '',
            })) || [],
        })) || [emptyPhase()],
    });
  };

  const handleDeleteType = async (type) => {
    if (!window.confirm(`¿Eliminar el tipo de trámite "${type.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingId(type.id);
      await tramitesApi.deleteType(type.id);

      if (editingId === type.id) {
        resetForm();
      }

      await loadTypes();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar el tipo de tramite.');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePhaseChange = (index, field, value) => {
    const updated = [...form.phases];
    updated[index][field] = value;
    setForm({ ...form, phases: updated });
  };

  const handleSubphaseChange = (phaseIndex, subIndex, field, value) => {
    const updated = [...form.phases];
    updated[phaseIndex].subphases[subIndex][field] = value;
    setForm({ ...form, phases: updated });
  };

  const addPhase = () => {
    const nextOrder = form.phases.length + 1;
    setForm({ ...form, phases: [...form.phases, emptyPhase(nextOrder)] });
  };

  const addSubphase = (phaseIndex) => {
    const updated = [...form.phases];
    const nextOrder = (updated[phaseIndex].subphases?.length || 0) + 1;
    updated[phaseIndex].subphases.push(emptySubphase(nextOrder));
    setForm({ ...form, phases: updated });
  };

  const removePhase = (phaseIndex) => {
    const updated = form.phases
      .filter((_, index) => index !== phaseIndex)
      .map((phase, index) => ({
        ...phase,
        order: index + 1,
      }));

    setForm({
      ...form,
      phases: updated.length > 0 ? updated : [emptyPhase()],
    });
  };

  const removeSubphase = (phaseIndex, subIndex) => {
    const updated = [...form.phases];
    updated[phaseIndex] = {
      ...updated[phaseIndex],
      subphases: updated[phaseIndex].subphases
        .filter((_, index) => index !== subIndex)
        .map((subphase, index) => ({
          ...subphase,
          order: index + 1,
        })),
    };

    setForm({ ...form, phases: updated });
  };

  if (user?.role !== ROLES.MASTER_ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] font-semibold text-[#233274]">
        Solo el Administrador Master puede acceder a Gestion de Tramites.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#ebe7df] bg-white p-6 shadow-lg lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="h-6 w-6 text-[#e15f0b]" />
            <div>
              <h1 className="text-2xl font-black text-[#233274]">
                {editingId ? 'Editar tipo de tramite' : 'Crear tipo de tramite'}
              </h1>
              <p className="text-sm text-[#9a98a0]">Define fases y subfases reutilizables.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Codigo</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: normalizeTypeCode(e.target.value) })}
                  className={inputClass}
                  placeholder={codeSuggestion || 'LIC-OBRA'}
                  required
                />
                <div className="mt-1 flex items-center justify-between text-xs text-[#9a98a0]">
                  <span>Usa un codigo corto y en mayusculas.</span>
                  <button
                    type="button"
                    className="font-semibold text-[#e15f0b]"
                    onClick={() => setForm((prev) => ({ ...prev, code: codeSuggestion }))}
                    disabled={!codeSuggestion}
                  >
                    Usar sugerencia
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Ej: Licencia de obra"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripcion</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} min-h-[80px]`}
                placeholder="Explica para que sirve este tipo de tramite y cuando se usa."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#233274]">Fases</h3>
                <button
                  type="button"
                  onClick={addPhase}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#233274] px-4 py-2 font-semibold text-white transition hover:bg-[#1b285c]"
                >
                  <Plus className="h-4 w-4" />
                  Añadir fase
                </button>
              </div>

              {form.phases.map((phase, idx) => (
                <div key={idx} className="rounded-xl border border-[#ebe7df] bg-[#fdfaf5] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex rounded-full bg-[#233274] px-3 py-1 text-xs font-semibold text-white">
                      Fase {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhase(idx)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar fase
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                        className={inputClass}
                        placeholder="Ej: Recepcion documental"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Orden automatico</label>
                      <div className="rounded-xl border border-[#ebe7df] bg-[#f8f5ef] px-4 py-2 font-semibold text-[#233274]">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Descripcion (opcional)</label>
                      <input
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                        className={inputClass}
                        placeholder="Ej: Revision inicial de documentos y requisitos."
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#233274]">
                        <ListChecks className="h-4 w-4 text-[#e15f0b]" />
                        Subfases
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubphase(idx)}
                        className="rounded-lg border border-[#e15f0b] px-3 py-2 font-semibold text-[#e15f0b] transition hover:bg-[#fff3e6]"
                      >
                        + Subfase
                      </button>
                    </div>

                    <div className="space-y-2">
                      {phase.subphases.map((subphase, subIndex) => (
                        <div
                          key={subIndex}
                          className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_140px_1fr_auto]"
                        >
                          <input
                            value={subphase.name}
                            onChange={(e) => handleSubphaseChange(idx, subIndex, 'name', e.target.value)}
                            placeholder="Ej: Validacion de planos"
                            className={inputClass}
                          />
                          <div className="rounded-xl border border-[#ebe7df] bg-[#f8f5ef] px-4 py-2 font-semibold text-[#233274]">
                            {subIndex + 1}
                          </div>
                          <input
                            value={subphase.description}
                            onChange={(e) => handleSubphaseChange(idx, subIndex, 'description', e.target.value)}
                            placeholder="Descripcion opcional"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => removeSubphase(idx, subIndex)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                            title="Eliminar subfase"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addPhase}
                className="order-last ml-auto inline-flex items-center gap-2 rounded-xl bg-[#233274] px-4 py-3 font-semibold text-white transition hover:bg-[#1b285c]"
              >
                <Plus className="h-4 w-4" />
                Añadir fase
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-bold text-[#233274] shadow-md transition hover:shadow-lg"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border border-[#e15f0b] px-3 py-2 font-semibold text-[#e15f0b] transition hover:bg-[#fff3e6]"
                  onClick={resetForm}
                >
                  Cancelar edicion
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-[#ebe7df] bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-[#e15f0b]" />
            <h2 className="text-xl font-black text-[#233274]">Tipos registrados</h2>
          </div>
          {loading ? (
            <div className="text-center text-[#9a98a0]">Cargando...</div>
          ) : types.length === 0 ? (
            <div className="text-[#9a98a0]">Aun no hay tipos.</div>
          ) : (
            <div className="space-y-3">
              {types.map((type) => (
                <div
                  key={type.id}
                  className="w-full rounded-xl border border-[#ebe7df] bg-[#fdfaf5] p-4 transition hover:shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#e15f0b]">{type.code}</p>
                      <p className="text-lg font-bold text-[#233274]">{type.name}</p>
                      <p className="text-sm text-[#9a98a0]">{type.phases?.length || 0} fases</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        type.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(type)}
                      className="rounded-lg border border-[#233274] px-3 py-2 text-sm font-semibold text-[#233274] transition hover:bg-[#233274] hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteType(type)}
                      disabled={deletingId === type.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === type.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const normalizeTypeCode = (value = '') =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const buildTypeCodeSuggestion = (name = '') => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase())
    .filter(Boolean);

  return words.join('-');
};

export default TramiteTypesPage;
