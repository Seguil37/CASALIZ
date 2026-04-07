import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, UserCircle, Building2, Plus, Loader2 } from 'lucide-react';
import { tramitesApi, adminUsersApi } from '../../../shared/utils/api';
import { ROLES, isStaff } from '../../../shared/constants/roles';
import useAuthStore from '../../../store/authStore';

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  observed: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
};

const TramitesByClientPage = () => {
  const { user } = useAuthStore();
  const [types, setTypes] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [form, setForm] = useState({
    code: '',
    tramite_type_id: '',
    client_name: '',
    project_name: '',
    property_name: '',
    location: '',
    due_date: '',
    responsible_id: '',
    status: 'pending',
  });

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const promises = [
        tramitesApi.listTypes(),
        tramitesApi.list({ per_page: 20 }),
      ];
      const shouldLoadUsers = user && [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role);
      if (shouldLoadUsers) promises.push(adminUsersApi.list());

      const [typesRes, tramitesRes, usersRes] = await Promise.all(promises);

      setTypes(typesRes.data);
      setTramites(tramitesRes.data.data || tramitesRes.data);
      if (shouldLoadUsers && usersRes) {
        setResponsables((usersRes.data?.data || usersRes.data || []).filter((u) => isStaff(u.role)));
      } else {
        setResponsables([]);
      }
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la información inicial.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tramitesApi.create(form);
      await loadInitial();
      setForm({
        code: '',
        tramite_type_id: '',
        client_name: '',
        project_name: '',
        property_name: '',
        location: '',
        due_date: '',
        responsible_id: '',
        status: 'pending',
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'No se pudo crear el trámite.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !user.role || ![ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#233274] font-semibold">
        Solo el Administrador puede gestionar trámites por cliente/proyecto.
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2 rounded-xl border border-[#ebe7df] bg-[#f8f5ef] focus:border-[#e15f0b] focus:ring-2 focus:ring-[#f6b17a] outline-none text-[#233274] placeholder-[#9a98a0]';
  const labelClass = 'text-sm font-semibold text-[#233274] mb-1 block';

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#233274]">Trámites por Cliente / Proyecto</h1>
            <p className="text-[#9a98a0]">
              Asigna un flujo de trámite ya definido a un cliente o proyecto específico.
            </p>
          </div>
          <Link
            to="/tramites/control"
            className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            <ClipboardList className="w-4 h-4" />
            Vista general
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-[#ebe7df] shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-[#e15f0b]" />
              <h2 className="text-xl font-black text-[#233274]">Registrar trámite</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Código / Identificador</label>
                <input
                  className={inputClass}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tipo de trámite</label>
                <select
                  className={inputClass}
                  value={form.tramite_type_id}
                  onChange={(e) => setForm({ ...form, tramite_type_id: e.target.value })}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.code} - {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Cliente / Propietario</label>
                <input
                  className={inputClass}
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className={labelClass}>Proyecto / Trámite</label>
                <input
                  className={inputClass}
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                  required
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div>
                <label className={labelClass}>Nombre del Inmueble / Establecimiento</label>
                <input
                  className={inputClass}
                  value={form.property_name}
                  onChange={(e) => setForm({ ...form, property_name: e.target.value })}
                  placeholder="Ej: Torre A, Local 102"
                />
              </div>
              <div>
                <label className={labelClass}>Ubicación</label>
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Distrito, Ciudad"
                />
              </div>
              <div>
                <label className={labelClass}>Fecha de vencimiento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Responsable general</label>
                <select
                  className={inputClass}
                  value={form.responsible_id}
                  onChange={(e) => setForm({ ...form, responsible_id: e.target.value })}
                >
                  <option value="">Selecciona un responsable</option>
                  {responsables.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.role})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-[#233274] font-bold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Registrar trámite
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#ebe7df] shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-[#e15f0b]" />
              <h2 className="text-xl font-black text-[#233274]">Trámites recientes</h2>
            </div>
            {loading ? (
              <div className="text-[#9a98a0]">Cargando...</div>
            ) : tramites.length === 0 ? (
              <div className="text-[#9a98a0]">Aún no hay trámites asignados.</div>
            ) : (
              <div className="space-y-3">
                {tramites.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-[#ebe7df] bg-[#fdfaf5] flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-[#e15f0b]">{t.code}</p>
                      <p className="text-lg font-bold text-[#233274]">{t.project_name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-[#233274]">
                        <span className="flex items-center gap-1">
                          <UserCircle className="w-4 h-4 text-[#e15f0b]" /> {t.client_name || 'Cliente N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-[#e15f0b]" /> {t.property_name || 'Inmueble N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#e15f0b]" /> {t.location || 'Ubicación N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-4 h-4 text-[#e15f0b]" /> Fecha de vencimiento: {formatDate(t.due_date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusBadges[t.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabel(t.status)}
                      </span>
                      <Link
                        to={`/tramites/${t.id}/tareas`}
                        className="px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
                      >
                        Ver tareas
                      </Link>
                      <button
                        onClick={() => {
                          setEditErrors({});
                          setEditing(t);
                        }}
                        className="px-4 py-2 rounded-lg border border-[#e15f0b] text-[#e15f0b] font-semibold hover:bg-[#fff3e6] transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('¿Eliminar este trámite?')) return;
                          try {
                            setDeletingId(t.id);
                            await tramitesApi.delete(t.id);
                            setTramites((prev) => prev.filter((x) => x.id !== t.id));
                          } catch (err) {
                            alert('No se pudo eliminar el trámite');
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === t.id}
                        className="px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {deletingId === t.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#233274]">Editar trámite</h3>
              <button onClick={() => setEditing(null)} className="text-[#9a98a0] hover:text-[#233274]">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Código</label>
                <input
                  className={`${inputClass} ${editErrors.code ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={editing.code}
                  onChange={(e) => {
                    setEditErrors((prev) => ({ ...prev, code: '' }));
                    setEditing({ ...editing, code: e.target.value });
                  }}
                />
                {editErrors.code && <p className="text-sm text-red-600 mt-1">{editErrors.code}</p>}
              </div>
              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  className={inputClass}
                  value={editing.tramite_type_id}
                  onChange={(e) => setEditing({ ...editing, tramite_type_id: e.target.value })}
                >
                  <option value="">Seleccione</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.code} - {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Cliente</label>
                <input
                  className={inputClass}
                  value={editing.client_name || ''}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Proyecto</label>
                <input
                  className={inputClass}
                  value={editing.project_name || ''}
                  onChange={(e) => setEditing({ ...editing, project_name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Inmueble</label>
                <input
                  className={inputClass}
                  value={editing.property_name || ''}
                  onChange={(e) => setEditing({ ...editing, property_name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Ubicación</label>
                <input
                  className={inputClass}
                  value={editing.location || ''}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Fecha de vencimiento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={editing.due_date ? String(editing.due_date).slice(0, 10) : ''}
                  onChange={(e) => setEditing({ ...editing, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Responsable</label>
                <select
                  className={inputClass}
                  value={editing.responsible_id || ''}
                  onChange={(e) => setEditing({ ...editing, responsible_id: e.target.value })}
                >
                  <option value="">Sin responsable</option>
                  {responsables.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select
                  className={inputClass}
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En proceso</option>
                  <option value="observed">Observado</option>
                  <option value="completed">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg border border-[#ebe7df] text-[#6c6b70]"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    setUpdating(true);
                    setEditErrors({});
                    await tramitesApi.update(editing.id, {
                      code: editing.code,
                      tramite_type_id: editing.tramite_type_id,
                      client_name: editing.client_name,
                      project_name: editing.project_name,
                      property_name: editing.property_name,
                      location: editing.location,
                      due_date: editing.due_date || null,
                      responsible_id: editing.responsible_id || null,
                      status: editing.status,
                    });
                    setTramites((prev) =>
                      prev.map((t) => (t.id === editing.id ? { ...t, ...editing } : t))
                    );
                    setEditing(null);
                  } catch (err) {
                    const e = err.response?.data?.errors;
                    if (e?.code?.length) {
                      setEditErrors({ code: 'El código ya existe.' });
                    } else {
                      alert('No se pudo actualizar el trámite');
                    }
                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating}
                className="px-5 py-2 rounded-lg bg-gradient-primary text-[#233274] font-bold shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {updating ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const statusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'in_progress':
      return 'En proceso';
    case 'observed':
      return 'Observado';
    case 'completed':
      return 'Finalizado';
    default:
      return status;
  }
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';

  const fixed = typeof value === 'string' ? value.replace(/\.\d+Z$/, 'Z') : value;
  const date = new Date(fixed);

  if (Number.isNaN(date.getTime())) return value;

  try {
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Lima',
    });
  } catch {
    return value;
  }
};

export default TramitesByClientPage;
