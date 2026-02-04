import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ClipboardCheck, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { tramitesApi, adminUsersApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';

const taskStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'done', label: 'Completado' },
];

const TramiteTasksPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [tramite, setTramite] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'pending',
    progress: 0,
    due_date: '',
  });

  const canCreate = useMemo(() => {
    if (!tramite || !user) return false;
    if ([ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role)) return true;
    return tramite.responsible?.id === user.id;
  }, [tramite, user]);

  const canViewStaff = useMemo(
    () => user && [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR].includes(user.role),
    [user]
  );

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const promises = [tramitesApi.show(id), tramitesApi.listTasks(id)];
      if (canViewStaff) promises.push(adminUsersApi.list());

      const [tramiteRes, tasksRes, staffRes] = await Promise.all(promises);
      setTramite(tramiteRes.data);
      setTasks(tasksRes.data);
      if (canViewStaff && staffRes) {
        setStaff(staffRes.data?.data || staffRes.data || []);
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.error(error);
      const status = error.response?.status;
      if (status === 403) {
        setError(
          'No tienes permiso para ver este trámite. Si eres operador, solo puedes ver trámites con tareas asignadas a ti.'
        );
      } else {
        setError('No se pudieron cargar las tareas del trámite.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
        progress: Number(form.progress) || 0,
        due_date: form.due_date || null,
        description: form.description || null,
      };
      await tramitesApi.createTask(id, payload);
      setForm({ title: '', description: '', assigned_to: '', status: 'pending', progress: 0, due_date: '' });
      await loadData();
    } catch (error) {
      console.error(error);
      alert('No se pudo crear la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (taskId, payload) => {
    try {
      await tramitesApi.updateTask(id, taskId, payload);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar la tarea.');
    }
  };

  const inputClass =
    'w-full px-4 py-2 rounded-xl border border-[#ebe7df] bg-[#f8f5ef] focus:border-[#e15f0b] focus:ring-2 focus:ring-[#f6b17a] outline-none text-[#233274] placeholder-[#9a98a0]';
  const labelClass = 'text-sm font-semibold text-[#233274] mb-1 block';

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#e15f0b]">TRÁMITE</p>
            <h1 className="text-3xl font-black text-[#233274]">{tramite?.project_name || 'Cargando...'}</h1>
            <p className="text-sm text-[#9a98a0]">{tramite?.code}</p>
          </div>
          <Link
            to="/tramites/control"
            className="px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
          >
            Volver a vista general
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-[#9a98a0]">Cargando...</div>
        ) : error ? (
          <div className="bg-white border border-red-200 text-red-600 rounded-2xl p-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tareas */}
            <div className="lg:col-span-2 bg-white border border-[#ebe7df] shadow-lg rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#e15f0b]" />
                <h2 className="text-xl font-black text-[#233274]">Tareas asignadas</h2>
              </div>
              {tasks.length === 0 ? (
                <div className="text-[#9a98a0]">Aún no hay tareas.</div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      inputClass={inputClass}
                      onUpdate={handleUpdate}
                      isOperator={user?.role === ROLES.OPERATOR}
                      userId={user?.id}
                      staff={staff}
                      canManageAssignments={canCreate && canViewStaff}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Crear tarea */}
            {canCreate && (
              <div className="bg-white border border-[#ebe7df] shadow-lg rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="w-5 h-5 text-[#e15f0b]" />
                  <h3 className="text-lg font-black text-[#233274]">Nueva tarea</h3>
                </div>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className={labelClass}>Título</label>
                    <input
                      className={inputClass}
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Descripción</label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Asignar a (opcional)</label>
                    <select
                      className={inputClass}
                      value={form.assigned_to}
                      onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    >
                      <option value="">Sin asignar</option>
                      {staff.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Estado</label>
                      <select
                        className={inputClass}
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        {taskStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Progreso (%)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={form.progress}
                        onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                        className="w-full accent-[#e15f0b]"
                      />
                      <div className="text-xs text-[#233274] font-semibold mt-1">{form.progress}%</div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Fecha límite</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-[#233274] font-bold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {saving ? 'Creando...' : 'Crear tarea'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, inputClass, onUpdate, isOperator, userId, staff, canManageAssignments }) => {
  const locked = isOperator && task.assignee?.id !== userId;
  const [local, setLocal] = useState({
    status: task.status,
    progress: task.progress,
    observations: task.observations || '',
    assigned_to: task.assignee?.id || '',
    due_date: task.due_date ? String(task.due_date).slice(0, 10) : '',
  });

  useEffect(() => {
    setLocal({
      status: task.status,
      progress: task.progress,
      observations: task.observations || '',
      assigned_to: task.assignee?.id || '',
      due_date: task.due_date ? String(task.due_date).slice(0, 10) : '',
    });
  }, [task]);

  const handleSave = () => {
    const payload = {
      status: local.status,
      progress: Number(local.progress) || 0,
      observations: local.observations,
      assigned_to: local.assigned_to || null,
      due_date: local.due_date || null,
    };
    onUpdate(task.id, payload);
  };

  const handleChange = (field, value) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 rounded-xl border border-[#ebe7df] bg-[#fdfaf5] space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#e15f0b]">{task.phase?.name}</p>
          <p className="text-lg font-bold text-[#233274]">{task.title}</p>
          <p className="text-sm text-[#9a98a0]">{task.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#233274] text-white">
          {task.assignee?.name || 'Sin asignar'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <label className="text-xs font-semibold text-[#233274]">Estado</label>
          <select
            className={inputClass}
            value={local.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={locked}
          >
            {taskStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#233274]">Progreso</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            className="w-full accent-[#e15f0b]"
            value={local.progress}
            onChange={(e) => handleChange('progress', e.target.value)}
            disabled={locked}
          />
          <div className="text-xs text-[#233274] font-semibold mt-1">{local.progress}%</div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#233274]">Observaciones</label>
          <input
            className={inputClass}
            value={local.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            disabled={locked}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#233274]">Fecha límite</label>
          <input
            type="date"
            className={inputClass}
            value={local.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            disabled={locked || isOperator}
            readOnly={isOperator}
          />
        </div>
        {canManageAssignments && (
          <div>
            <label className="text-xs font-semibold text-[#233274]">Asignado a</label>
            <select
              className={inputClass}
              value={local.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
            >
              <option value="">Sin asignar</option>
              {staff.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {task.status === 'blocked' && (
        <div className="flex items-center gap-2 text-orange-600 text-sm">
          <AlertCircle className="w-4 h-4" /> Esta tarea está bloqueada, agrega observaciones.
        </div>
      )}
      {!locked && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

export default TramiteTasksPage;
