// src/features/admin-users/components/AdminUserForm.jsx
import { ShieldCheck, UserCog, X } from 'lucide-react';
import { ROLES } from '../../../shared/constants/roles';

const AdminUserForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors = {},
  isEditing,
  saving,
}) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebe7df] bg-[#f8f5ef]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#e5e1d6] text-[#233274]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a98a0] font-semibold">
                {isEditing ? 'Editar administrador' : 'Nuevo administrador'}
              </p>
              <h3 className="text-xl font-black text-[#233274]">
                {isEditing ? 'Actualiza datos y permisos' : 'Crea un usuario admin o master'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#6c6b70] hover:text-[#233274]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-1">Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ebe7df] focus:outline-none focus:ring-2 focus:ring-[#e15f0b] bg-[#fdfaf5]"
                placeholder="Ej: Ana Pérez"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ebe7df] focus:outline-none focus:ring-2 focus:ring-[#e15f0b] bg-[#fdfaf5]"
                placeholder="admin@empresa.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-1">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ebe7df] focus:outline-none focus:ring-2 focus:ring-[#e15f0b] bg-[#fdfaf5]"
                placeholder={isEditing ? 'Dejar vacío para mantener' : 'Mínimo 8 caracteres'}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ebe7df] focus:outline-none focus:ring-2 focus:ring-[#e15f0b] bg-[#fdfaf5]"
                placeholder="Repite la contraseña"
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#233274]">Rol</p>
              <div className="flex gap-3 flex-wrap">
                <label className={`admin-role-pill ${formData.role === ROLES.ADMIN ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={ROLES.ADMIN}
                    checked={formData.role === ROLES.ADMIN}
                    onChange={() => handleChange('role', ROLES.ADMIN)}
                    className="hidden"
                  />
                  <UserCog className="w-4 h-4" /> Admin
                </label>
                <label className={`admin-role-pill ${formData.role === ROLES.MASTER_ADMIN ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={ROLES.MASTER_ADMIN}
                    checked={formData.role === ROLES.MASTER_ADMIN}
                    onChange={() => handleChange('role', ROLES.MASTER_ADMIN)}
                    className="hidden"
                  />
                  <ShieldCheck className="w-4 h-4" /> Master Admin
                </label>
              </div>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>

            <div className="flex items-center justify-between bg-[#fdfaf5] border border-[#ebe7df] rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#233274]">Estado</p>
                <p className="text-xs text-[#6c6b70]">Activo por defecto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#d8d4c7] rounded-full peer peer-checked:bg-[#e15f0b] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebe7df]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#ebe7df] text-[#6c6b70] hover:bg-[#f8f5ef] font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-primary text-[#233274] font-bold shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
