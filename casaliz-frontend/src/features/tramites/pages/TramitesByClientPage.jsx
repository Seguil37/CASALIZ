import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ClipboardList, Loader2, MapPin, Plus, UserCircle } from 'lucide-react';
import { tramitesApi, adminUsersApi } from '../../../shared/utils/api';
import { ROLES, isStaff } from '../../../shared/constants/roles';
import useAuthStore from '../../../store/authStore';

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  observed: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
};

const PERU_DEPARTMENTS = [
  'Amazonas',
  'Ancash',
  'Apurimac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huanuco',
  'Ica',
  'Junin',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martin',
  'Tacna',
  'Tumbes',
  'Ucayali',
];
const LOCATION_SUGGESTIONS = {
  Lima: {
    provinces: ['Lima', 'Huaral', 'Cañete', 'Huaura'],
    districts: ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'Cieneguilla'],
  },
  Cusco: {
    provinces: ['Cusco', 'Anta', 'Urubamba', 'Calca'],
    districts: ['Cusco', 'San Sebastian', 'San Jeronimo', 'Wanchaq', 'Santiago', 'Zurite'],
  },
  Arequipa: {
    provinces: ['Arequipa', 'Camana', 'Caylloma'],
    districts: ['Yanahuara', 'Cayma', 'Cerro Colorado', 'Jose Luis Bustamante'],
  },
  Piura: {
    provinces: ['Piura', 'Sullana', 'Paita'],
    districts: ['Piura', 'Castilla', 'Catacaos'],
  },
};

const emptyForm = {
  code: '',
  tramite_type_id: '',
  client_name: '',
  project_name: '',
  property_name: '',
  location_department: '',
  location_province: '',
  location_district: '',
  due_date: '',
  responsible_id: '',
  status: 'pending',
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
  const [form, setForm] = useState(emptyForm);
  const provinceHints = LOCATION_SUGGESTIONS[form.location_department]?.provinces || [];
  const districtHints = LOCATION_SUGGESTIONS[form.location_department]?.districts || [];

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const promises = [tramitesApi.listTypes(), tramitesApi.list({ per_page: 20 })];
      const shouldLoadUsers = user && [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role);

      if (shouldLoadUsers) promises.push(adminUsersApi.list());

      const [typesRes, tramitesRes, usersRes] = await Promise.all(promises);

      setTypes(typesRes.data);
      setTramites(tramitesRes.data.data || tramitesRes.data);

      if (shouldLoadUsers && usersRes) {
        setResponsables((usersRes.data?.data || usersRes.data || []).filter((item) => isStaff(item.role)));
      } else {
        setResponsables([]);
      }
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la informacion inicial.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await tramitesApi.create(buildPayload(form));
      await loadInitial();
      setForm(emptyForm);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'No se pudo crear el tramite.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tramite) => {
    setEditErrors({});
    setEditing({
      ...tramite,
      ...parseLocation(tramite.location),
      due_date: tramite.due_date ? String(tramite.due_date).slice(0, 10) : '',
    });
  };

  if (!user || !user.role || ![ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] font-semibold text-[#233274]">
        Solo el Administrador puede gestionar tramites por cliente/proyecto.
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-[#ebe7df] bg-[#f8f5ef] px-4 py-2 text-[#233274] outline-none placeholder-[#9a98a0] focus:border-[#e15f0b] focus:ring-2 focus:ring-[#f6b17a]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#233274]';
  const codePlaceholder = form.tramite_type_id ? `Ej: ${buildTramiteCodeSuggestion(types, form.tramite_type_id)}` : 'Ej: TR-001';

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#233274]">Tramites por Cliente / Proyecto</h1>
            <p className="text-[#9a98a0]">
              Asigna un flujo de tramite ya definido a un cliente o proyecto especifico.
            </p>
          </div>
          <Link
            to="/tramites/control"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-bold text-[#233274] shadow-md hover:shadow-lg"
          >
            <ClipboardList className="h-4 w-4" />
            Vista general
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#ebe7df] bg-white p-6 shadow-lg lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#e15f0b]" />
              <h2 className="text-xl font-black text-[#233274]">Registrar tramite</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Codigo / Identificador</label>
                <input
                  className={inputClass}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: normalizeTramiteCode(e.target.value) })}
                  placeholder={codePlaceholder}
                  required
                />
                <div className="mt-1 flex items-center justify-between text-xs text-[#9a98a0]">
                  <span>Usa un codigo corto y facil de rastrear.</span>
                  <button
                    type="button"
                    className="font-semibold text-[#e15f0b]"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        code: buildTramiteCodeSuggestion(types, prev.tramite_type_id),
                      }))
                    }
                    disabled={!form.tramite_type_id}
                  >
                    Sugerir codigo
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Tipo de tramite</label>
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
                <p className="mt-1 text-xs text-[#9a98a0]">Escribe el nombre tal como quieres verlo en el seguimiento.</p>
              </div>

              <div>
                <label className={labelClass}>Nombre del tramite</label>
                <input
                  className={inputClass}
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                  placeholder="Ej: Licencia de obra de vivienda unifamiliar"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Nombre del inmueble / establecimiento (opcional)</label>
                <input
                  className={inputClass}
                  value={form.property_name}
                  onChange={(e) => setForm({ ...form, property_name: e.target.value })}
                  placeholder="Ej: Torre A, Local 102"
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-[#f0e8dd] bg-[#fcfaf6] p-4">
                <div>
                  <label className={labelClass}>Departamento</label>
                  <select
                    className={inputClass}
                    value={form.location_department}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location_department: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    {PERU_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Provincia</label>
                  <input
                    className={inputClass}
                    value={form.location_province}
                    onChange={(e) => setForm({ ...form, location_province: e.target.value })}
                    placeholder="Ej: Cusco"
                    list="tramite-province-suggestions"
                    required
                  />
                  <datalist id="tramite-province-suggestions">
                    {provinceHints.map((province) => (
                      <option key={province} value={province} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className={labelClass}>Distrito</label>
                  <input
                    className={inputClass}
                    value={form.location_district}
                    onChange={(e) => setForm({ ...form, location_district: e.target.value })}
                    placeholder="Ej: San Sebastian"
                    list="tramite-district-suggestions"
                    required
                  />
                  <datalist id="tramite-district-suggestions">
                    {districtHints.map((district) => (
                      <option key={district} value={district} />
                    ))}
                  </datalist>
                </div>

                <p className="text-xs text-[#9a98a0]">
                  {form.location_department
                    ? `Sugerencias para ${form.location_department}: provincias ${provinceHints.join(', ') || 'sin datos'}; distritos ${districtHints.join(', ') || 'sin datos'}.`
                    : 'Primero elige un departamento para ver sugerencias de provincia y distrito.'}
                </p>
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
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.name} ({responsable.role})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-bold text-[#233274] shadow-md transition hover:shadow-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Registrar tramite
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-[#ebe7df] bg-white p-6 shadow-lg lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[#e15f0b]" />
              <h2 className="text-xl font-black text-[#233274]">Tramites recientes</h2>
            </div>

            {loading ? (
              <div className="text-[#9a98a0]">Cargando...</div>
            ) : tramites.length === 0 ? (
              <div className="text-[#9a98a0]">Aun no hay tramites asignados.</div>
            ) : (
              <div className="space-y-3">
                {tramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#ebe7df] bg-[#fdfaf5] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-[#e15f0b]">{tramite.code}</p>
                      <p className="text-lg font-bold text-[#233274]">{tramite.project_name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-[#233274]">
                        <span className="flex items-center gap-1">
                          <UserCircle className="h-4 w-4 text-[#e15f0b]" />
                          {tramite.client_name || 'Cliente N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-[#e15f0b]" />
                          {tramite.property_name || 'Inmueble N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-[#e15f0b]" />
                          {tramite.location || 'Ubicacion N/D'}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClipboardList className="h-4 w-4 text-[#e15f0b]" />
                          Fecha de vencimiento: {formatDate(tramite.due_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadges[tramite.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabel(tramite.status)}
                      </span>

                      <Link
                        to={`/tramites/${tramite.id}/tareas`}
                        className="rounded-lg border border-[#233274] px-4 py-2 font-semibold text-[#233274] transition hover:bg-[#233274] hover:text-white"
                      >
                        Ver tareas
                      </Link>

                      <button
                        onClick={() => startEdit(tramite)}
                        className="rounded-lg border border-[#e15f0b] px-4 py-2 font-semibold text-[#e15f0b] transition hover:bg-[#fff3e6]"
                      >
                        Editar
                      </button>

                      <button
                        onClick={async () => {
                          if (!window.confirm('Eliminar este tramite?')) return;

                          try {
                            setDeletingId(tramite.id);
                            await tramitesApi.delete(tramite.id);
                            setTramites((prev) => prev.filter((item) => item.id !== tramite.id));
                          } catch (error) {
                            alert('No se pudo eliminar el tramite');
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === tramite.id}
                        className="rounded-lg border border-red-500 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === tramite.id ? 'Eliminando...' : 'Eliminar'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#233274]">Editar tramite</h3>
              <button onClick={() => setEditing(null)} className="text-[#9a98a0] hover:text-[#233274]">
                x
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Codigo</label>
                <input
                  className={`${inputClass} ${editErrors.code ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={editing.code}
                  onChange={(e) => {
                    setEditErrors((prev) => ({ ...prev, code: '' }));
                    setEditing({ ...editing, code: normalizeTramiteCode(e.target.value) });
                  }}
                />
                {editErrors.code && <p className="mt-1 text-sm text-red-600">{editErrors.code}</p>}
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
                <label className={labelClass}>Nombre del tramite</label>
                <input
                  className={inputClass}
                  value={editing.project_name || ''}
                  onChange={(e) => setEditing({ ...editing, project_name: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Inmueble / establecimiento (opcional)</label>
                <input
                  className={inputClass}
                  value={editing.property_name || ''}
                  onChange={(e) => setEditing({ ...editing, property_name: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Departamento</label>
                <select
                  className={inputClass}
                  value={editing.location_department || ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      location_department: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona un departamento</option>
                  {PERU_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Provincia</label>
                <input
                  className={inputClass}
                  value={editing.location_province || ''}
                  onChange={(e) => setEditing({ ...editing, location_province: e.target.value })}
                  list="edit-tramite-province-suggestions"
                />
                <datalist id="edit-tramite-province-suggestions">
                  {(LOCATION_SUGGESTIONS[editing.location_department]?.provinces || []).map((province) => (
                    <option key={province} value={province} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelClass}>Distrito</label>
                <input
                  className={inputClass}
                  value={editing.location_district || ''}
                  onChange={(e) => setEditing({ ...editing, location_district: e.target.value })}
                  list="edit-tramite-district-suggestions"
                />
                <datalist id="edit-tramite-district-suggestions">
                  {(LOCATION_SUGGESTIONS[editing.location_department]?.districts || []).map((district) => (
                    <option key={district} value={district} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelClass}>Fecha de vencimiento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={editing.due_date || ''}
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
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.name} ({responsable.role})
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
                className="rounded-lg border border-[#ebe7df] px-4 py-2 text-[#6c6b70]"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    setUpdating(true);
                    setEditErrors({});

                    const payload = buildPayload(editing);

                    await tramitesApi.update(editing.id, payload);
                    setTramites((prev) =>
                      prev.map((tramite) =>
                        tramite.id === editing.id
                          ? { ...tramite, ...editing, location: payload.location, due_date: payload.due_date }
                          : tramite
                      )
                    );
                    setEditing(null);
                  } catch (error) {
                    const errors = error.response?.data?.errors;
                    if (errors?.code?.length) {
                      setEditErrors({ code: 'El codigo ya existe.' });
                    } else {
                      alert('No se pudo actualizar el tramite');
                    }
                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating}
                className="rounded-lg bg-gradient-primary px-5 py-2 font-bold text-[#233274] shadow-md hover:shadow-lg disabled:opacity-60"
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

const buildLocation = (values) => {
  const parts = [
    values.location_district?.trim(),
    values.location_province?.trim(),
    values.location_department?.trim(),
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : null;
};

const normalizeTramiteCode = (value = '') =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const buildTramiteCodeSuggestion = (types, typeId) => {
  const type = types.find((item) => String(item.id) === String(typeId));
  const base = normalizeTramiteCode(type?.code || 'TR');
  const year = new Date().getFullYear();
  return `${base}-${year}`;
};

const buildPayload = (values) => ({
  code: values.code,
  tramite_type_id: values.tramite_type_id,
  client_name: values.client_name,
  project_name: values.project_name,
  property_name: values.property_name,
  location: buildLocation(values),
  due_date: values.due_date || null,
  responsible_id: values.responsible_id || null,
  status: values.status,
});

const parseLocation = (value) => {
  if (!value) {
    return {
      location_department: '',
      location_province: '',
      location_district: '',
    };
  }

  const parts = String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return {
      location_district: parts[0],
      location_province: parts[1],
      location_department: parts.slice(2).join(', '),
    };
  }

  if (parts.length === 2) {
    return {
      location_district: '',
      location_province: parts[0],
      location_department: parts[1],
    };
  }

  return {
    location_district: '',
    location_province: '',
    location_department: parts[0] || '',
  };
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
