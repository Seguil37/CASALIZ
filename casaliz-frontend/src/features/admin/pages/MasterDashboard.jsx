// src/features/admin/pages/MasterDashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Lock, Plus, Power, RefreshCw, Users } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { projectsApi, reviewsApi, usersApi } from '../../../shared/utils/api';

const MasterDashboard = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([loadUsers(), loadProjects(), loadReviews()]).finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(
    () => ({
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.is_active).length,
      totalProjects: projects.length,
      totalReviews: reviews.length,
    }),
    [projects.length, reviews.length, users]
  );

  const loadUsers = async () => {
    const response = await usersApi.list();
    setUsers(response.data.data || response.data || []);
  };

  const loadProjects = async () => {
    const response = await projectsApi.list({ per_page: 6 });
    const items = response.data.data || response.data || [];
    setProjects(items);
  };

  const loadReviews = async () => {
    const response = await reviewsApi.listByProject();
    setReviews(response.data.data || response.data || []);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.create(form);
      await loadUsers();
      setForm({ name: '', email: '', password: '', role: 'client' });
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (targetUser) => {
    try {
      await usersApi.update(targetUser.id, { is_active: !targetUser.is_active });
      await loadUsers();
    } catch (error) {
      alert('No se pudo actualizar el estado del usuario');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-[#9a98a0]">Panel maestro</p>
          <h1 className="text-3xl font-black text-[#233274]">Hola, {user?.name}</h1>
          <p className="text-[#9a98a0]">Gestiona usuarios, proyectos y reseñas desde un solo lugar.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Usuarios" value={metrics.totalUsers} icon={Users} />
          <MetricCard label="Usuarios activos" value={metrics.activeUsers} icon={CheckCircle} />
          <MetricCard label="Proyectos" value={metrics.totalProjects} icon={RefreshCw} />
          <MetricCard label="Reseñas" value={metrics.totalReviews} icon={Lock} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#233274]">Usuarios</h2>
              <button
                onClick={loadUsers}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                type="button"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>

            <div className="divide-y divide-[#ebe7df]">
              {users.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#233274]">{item.name}</p>
                    <p className="text-sm text-[#9a98a0]">{item.email} · {item.role}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(item)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                      item.is_active ? 'bg-green-100 text-green-700' : 'bg-[#fbe9e7] text-[#d14a00]'
                    }`}
                  >
                    <Power className="w-4 h-4" /> {item.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-[#233274] mb-4">Crear usuario</h2>
            <form className="space-y-3" onSubmit={handleCreateUser}>
              <input
                type="text"
                required
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2"
              />
              <input
                type="email"
                required
                placeholder="Correo"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2"
              />
              <input
                type="password"
                required
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2"
              />
              <select
                className="w-full rounded-lg border border-[#ebe7df] px-3 py-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="client">Cliente</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-[#233274] font-bold px-4 py-3 rounded-lg"
              >
                <Plus className="w-4 h-4" /> {saving ? 'Guardando...' : 'Crear usuario'}
              </button>
            </form>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#233274]">Proyectos recientes</h2>
            <span className="text-sm text-[#9a98a0]">{projects.length} registros</span>
          </div>
          <div className="grid gap-3">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between border border-[#ebe7df] rounded-xl p-3">
                <div>
                  <p className="font-semibold text-[#233274]">{project.title}</p>
                  <p className="text-xs text-[#9a98a0]">Estado: {project.status}</p>
                </div>
                <span className="text-xs text-[#233274] bg-[#f8f5ef] px-3 py-1 rounded-full">
                  {project.reviews_count || 0} reseñas · {project.favorites_count || 0} favoritos
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[#f8f5ef] flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#d14a00]" />
    </div>
    <div>
      <p className="text-sm text-[#9a98a0]">{label}</p>
      <p className="text-xl font-black text-[#233274]">{value}</p>
    </div>
  </div>
);

export default MasterDashboard;
