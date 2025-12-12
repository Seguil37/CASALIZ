// src/features/admin-users/pages/AdminUsersPage.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shield,
  ShieldCheck,
  UserCog,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { adminUsersApi } from '../../../shared/utils/api';
import { ROLES, roleLabels } from '../../../shared/constants/roles';
import useAuthStore from '../../../store/authStore';
import AdminUserForm from '../components/AdminUserForm';

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-red-100 text-red-700 border-red-200',
};

const AdminUsersPage = () => {
  const { user: authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(getInitialForm());
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  function getInitialForm() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: ROLES.ADMIN,
      is_active: true,
    };
  }

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await adminUsersApi.list(page);
      const data = response.data;
      const items = data.data || data;
      setUsers(items);
      setMeta({
        current_page: data.current_page || page,
        last_page: data.last_page || 1,
        total: data.total || items.length,
      });
    } catch (err) {
      console.error('Error fetching users', err);
      setError('No se pudieron cargar los administradores.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData(getInitialForm());
    setFormErrors({});
    setIsEditing(false);
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
      role: user.role || ROLES.ADMIN,
      is_active: Boolean(user.is_active),
    });
    setFormErrors({});
    setIsEditing(true);
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    }

    if (!isEditing || formData.password) {
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres';
      }

      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = 'Las contraseñas no coinciden';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (isEditing && !editingUserId) {
      setError('No se encontró el usuario a editar.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing && formData.password_confirmation) {
        payload.password_confirmation = formData.password_confirmation;
      }

      if (isEditing) {
        await adminUsersApi.update(editingUserId, payload);
      } else {
        await adminUsersApi.create(payload);
      }

      setIsModalOpen(false);
      setError('');
      setFormData(getInitialForm());
      fetchUsers(currentPage);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setFormErrors(Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]])));
      }
      setError(err.response?.data?.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    if (authUser?.id === user.id && user.is_active) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas ${user.is_active ? 'desactivar' : 'activar'} a ${user.name}?`)) {
      return;
    }

    try {
      const response = await adminUsersApi.update(user.id, { is_active: !user.is_active });
      updateUserInState(user.id, response.data.user || response.data);
    } catch (err) {
      alert(err.response?.data?.errors?.is_active?.[0] || 'No se pudo actualizar el estado.');
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === ROLES.MASTER_ADMIN ? ROLES.ADMIN : ROLES.MASTER_ADMIN;

    if (authUser?.id === user.id && nextRole !== ROLES.MASTER_ADMIN) {
      alert('No puedes degradar tu propio rol de master admin.');
      return;
    }

    if (!window.confirm(`¿Confirmas cambiar el rol de ${user.name} a ${roleLabels[nextRole]}?`)) {
      return;
    }

    try {
      const response = await adminUsersApi.update(user.id, { role: nextRole });
      updateUserInState(user.id, response.data.user || response.data);
    } catch (err) {
      alert(err.response?.data?.errors?.role?.[0] || 'No se pudo actualizar el rol.');
    }
  };

  const updateUserInState = (userId, updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updatedUser } : u)));
  };

  const renderStatusBadge = (isActive) => {
    const style = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${style}`}>
        {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const pages = useMemo(() => Array.from({ length: meta.last_page || 1 }, (_, i) => i + 1), [meta.last_page]);

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#9a98a0] font-semibold">Panel de administración</p>
            <h1 className="text-3xl font-black text-[#233274] mt-2">Gestión de Administradores</h1>
            <p className="text-[#6c6b70] mt-2 max-w-3xl">
              Crea, edita y controla el acceso de los administradores. Solo los master admin pueden ver y usar este módulo.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear Admin
          </button>
        </div>

        <div className="bg-white/70 rounded-2xl shadow-lg border border-[#ebe7df]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 border-b border-[#ebe7df]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#e5e1d6] text-[#233274]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#233274]">Usuarios Admin</h2>
                <p className="text-[#6c6b70]">Nombre, correo, rol y estado de acceso</p>
              </div>
            </div>
            <div className="text-sm text-[#9a98a0] font-semibold">
              Total: <span className="text-[#233274] font-black">{meta.total}</span>
            </div>
          </div>

          {error && <p className="text-red-600 px-6 pt-4">{error}</p>}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-[#6c6b70]">No hay administradores registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-[#f8f5ef] text-[#6c6b70] uppercase text-xs tracking-[0.1em]">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Nombre</th>
                    <th className="py-4 px-6 font-semibold">Email</th>
                    <th className="py-4 px-6 font-semibold">Rol</th>
                    <th className="py-4 px-6 font-semibold">Estado</th>
                    <th className="py-4 px-6 font-semibold">Creado</th>
                    <th className="py-4 px-6 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1ece2]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#fdfaf5]">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#233274]">{u.name}</span>
                          <span className="text-xs text-[#9a98a0]">ID: {u.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#233274]">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${
                            u.role === ROLES.MASTER_ADMIN
                              ? 'bg-[#e5ecff] text-[#233274] border-[#d0dbff]'
                              : 'bg-[#fff3e5] text-[#b55600] border-[#ffe0bf]'
                          }`}
                        >
                          {u.role === ROLES.MASTER_ADMIN ? <Shield className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">{renderStatusBadge(u.is_active)}</td>
                      <td className="py-4 px-6 text-[#6c6b70]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#ebe7df] text-[#233274] hover:bg-[#f8f5ef] text-sm font-semibold"
                          >
                            <UserCog className="w-4 h-4" /> Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
                              u.is_active
                                ? 'border-red-200 text-red-700 hover:bg-red-50'
                                : 'border-green-200 text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {u.is_active ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {u.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#ebe7df] text-[#233274] hover:bg-[#f8f5ef] text-sm font-semibold"
                          >
                            {u.role === ROLES.MASTER_ADMIN ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            {u.role === ROLES.MASTER_ADMIN ? 'Quitar Master' : 'Hacer Master'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length > 0 && meta.last_page > 1 && (
            <div className="flex items-center justify-between p-5 border-t border-[#ebe7df] text-sm text-[#6c6b70]">
              <div>
                Página <span className="font-bold text-[#233274]">{meta.current_page}</span> de{' '}
                <span className="font-bold text-[#233274]">{meta.last_page}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={meta.current_page === 1}
                  className="p-2 rounded-lg border border-[#ebe7df] hover:bg-[#f8f5ef] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        meta.current_page === page
                          ? 'bg-gradient-primary text-[#233274]'
                          : 'border border-[#ebe7df] text-[#6c6b70] hover:bg-[#f8f5ef]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={meta.current_page === meta.last_page}
                  className="p-2 rounded-lg border border-[#ebe7df] hover:bg-[#f8f5ef] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminUserForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={formErrors}
        isEditing={isEditing}
        saving={saving}
      />
    </div>
  );
};

export default AdminUsersPage;
