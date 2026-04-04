import { useEffect, useState } from 'react';
import { Plus, Save, Layers, ListChecks, Trash2 } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';

const emptyPhase = (order = 1) => ({ name: '', order, description: '', subphases: [] });
const emptySubphase = (order = 1) => ({ name: '', order, description: '' });

const TramiteTypesPage = () => {
  const { user } = useAuthStore();
  const inputClass =
    'w-full px-4 py-2 rounded-xl border border-[#ebe7df] bg-[#f8f5ef] focus:border-[#e15f0b] focus:ring-2 focus:ring-[#f6b17a] outline-none text-[#233274] placeholder-[#9a98a0]';
  const labelClass = 'text-sm font-semibold text-[#233274] mb-1 block';
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const loadTypes = async () => {
    setLoading(true);
    try {
      const { data } = await tramitesApi.listTypes();
      setTypes(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los tipos de trámite.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await tramitesApi.updateType(editingId, form);
      } else {
        await tramitesApi.createType(form);
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
      phases: type.phases?.map((p) => ({
        name: p.name,
        order: p.order,
        description: p.description || '',
        subphases: p.subphases?.map((s) => ({
          name: s.name,
          order: s.order,
          description: s.description || '',
        })) || [],
      })) || [emptyPhase()],
    });
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
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#233274] font-semibold">
        Solo el Administrador Master puede acceder a Gestión de Trámites.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-[#ebe7df]">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-[#e15f0b]" />
            <div>
              <h1 className="text-2xl font-black text-[#233274]">
                {editingId ? 'Editar tipo de trámite' : 'Crear tipo de trámite'}
              </h1>
              <p className="text-[#9a98a0] text-sm">Define fases y subfases reutilizables.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Código</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} min-h-[80px]`}
              />
            </div>

            {/* Phases */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#233274]">Fases</h3>
                <button
                  type="button"
                  onClick={addPhase}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#233274] text-white font-semibold hover:bg-[#1b285c] transition"
                >
                  <Plus className="w-4 h-4" />
                  Añadir fase
                </button>
              </div>

              {form.phases.map((phase, idx) => (
                <div key={idx} className="rounded-xl border border-[#ebe7df] p-4 bg-[#fdfaf5]">
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removePhase(idx)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar fase
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Orden</label>
                      <input
                        type="number"
                        min={1}
                        value={phase.order}
                        onChange={(e) => handlePhaseChange(idx, 'order', Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Descripción</label>
                      <input
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#233274]">
                        <ListChecks className="w-4 h-4 text-[#e15f0b]" />
                        Subfases
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubphase(idx)}
                        className="text-[#e15f0b] font-semibold px-3 py-2 rounded-lg border border-[#e15f0b] hover:bg-[#fff3e6] transition"
                      >
                        + Subfase
                      </button>
                    </div>
                    <div className="space-y-2">
                      {phase.subphases.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_140px_1fr_auto]"
                        >
                          <input
                            value={sub.name}
                            onChange={(e) =>
                              handleSubphaseChange(idx, sIdx, 'name', e.target.value)
                            }
                            placeholder="Nombre"
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min={1}
                            value={sub.order}
                            onChange={(e) =>
                              handleSubphaseChange(idx, sIdx, 'order', Number(e.target.value))
                            }
                            className={inputClass}
                          />
                          <input
                            value={sub.description}
                            onChange={(e) =>
                              handleSubphaseChange(idx, sIdx, 'description', e.target.value)
                            }
                            placeholder="Descripción"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => removeSubphase(idx, sIdx)}
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
	                className="order-last ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#233274] text-white font-semibold hover:bg-[#1b285c] transition"
	              >
	                <Plus className="w-4 h-4" />
	                Añadir fase
	              </button>
	              <button
	                type="submit"
	                className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition"
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="text-[#e15f0b] font-semibold px-3 py-2 rounded-lg border border-[#e15f0b] hover:bg-[#fff3e6] transition"
                  onClick={resetForm}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#ebe7df]">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-[#e15f0b]" />
            <h2 className="text-xl font-black text-[#233274]">Tipos registrados</h2>
          </div>
          {loading ? (
            <div className="text-center text-[#9a98a0]">Cargando...</div>
          ) : types.length === 0 ? (
            <div className="text-[#9a98a0]">Aún no hay tipos.</div>
          ) : (
            <div className="space-y-3">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleEdit(type)}
                  className="w-full text-left p-4 rounded-xl border border-[#ebe7df] hover:shadow transition bg-[#fdfaf5]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#e15f0b]">{type.code}</p>
                      <p className="text-lg font-bold text-[#233274]">{type.name}</p>
                      <p className="text-sm text-[#9a98a0]">{type.phases?.length || 0} fases</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        type.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TramiteTypesPage;
