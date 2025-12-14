// src/features/booking/pages/ProfilePage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Star,
  AlertCircle,
  Lock,
  KeyRound,
  Settings
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { authApi } from '../../../shared/utils/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authApi.updateProfile(formData);
      updateUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      if (apiErrors) {
        const formattedErrors = Object.fromEntries(
          Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
        );

        setErrors(formattedErrors);
      } else {
        console.error('Error updating profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      country: user?.country || '',
      city: user?.city || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordError) {
      setPasswordError('');
    }
    if (passwordMessage) {
      setPasswordMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Por favor completa todos los campos.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await authApi.updateProfile({
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      });

      updateUser(response.data.user);
      setPasswordMessage('Tu contraseña ha sido actualizada correctamente.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const apiMessage = error.response?.data?.message;

      if (apiErrors?.current_password?.length) {
        setPasswordError(apiErrors.current_password[0]);
      } else if (apiErrors?.password?.length) {
        setPasswordError(apiErrors.password[0]);
      } else if (apiMessage) {
        setPasswordError(apiMessage);
      } else {
        setPasswordError('No se pudo actualizar la contraseña. Inténtalo nuevamente.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        // Aquí iría la subida del avatar a un servicio de almacenamiento
        // Simulación
        setTimeout(() => {
          updateUser({ ...user, avatar: result });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#f8f5ef] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-[#f8f5ef] rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-[#f8f5ef] rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-[#d14a00]" />
          </div>
          <h2 className="text-2xl font-bold text-[#233274] mb-2">Debes iniciar sesión</h2>
          <p className="text-[#9a98a0] mb-6">Por favor, inicia sesión para ver tu perfil</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#f8f5ef] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Principal - Perfil y Formulario */}
          <div className="md:col-span-2 space-y-8">
            {/* Header con Avatar y Botón de Editar */}
            <div className="bg-[#f8f5ef] rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in">
              {/* Banner de Perfil */}
              <div className="h-32 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e15f0b]/50 to-[#d14a00]/50"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-[#f8f5ef] rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-[#d14a00]" />
                    <span className="text-2xl font-bold text-[#d14a00]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Editar */}
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-[#f8f5ef]/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#f8f5ef] transition-colors"
              >
                <Edit2 className="w-5 h-5 text-[#233274]" />
              </button>
            </div>

            {/* Formulario de Edición */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#e15f0b]" />
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all ${
                        errors.name
                          ? 'border-[#d14a00]'
                          : 'border-[#9a98a0] focus:border-[#e15f0b]'
                      }`}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-[#d14a00] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#d14a00]" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#e15f0b]" />
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all ${
                        errors.email
                          ? 'border-[#d14a00]'
                          : 'border-[#9a98a0] focus:border-[#e15f0b]'
                        }`}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-[#d14a00] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#d14a00]" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#e15f0b]" />
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-[#d14a00]'
                          : 'border-[#9a98a0] focus:border-[#e15f0b]'
                      }`}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-[#d14a00] flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-[#d14a00]" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-[#e15f0b]" />
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none resize-none transition-all"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {/* País y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#233274] mb-2">
                      País
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all"
                    disabled={loading}
                    >
                      <option value="">Selecciona un país</option>
                      <option value="Perú">Perú</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#233274] mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all"
                      placeholder="Lima"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border-2 border-[#9a98a0] text-[#233274] font-semibold px-6 py-3 rounded-xl hover:bg-[#f8f5ef] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-4 border-[#9a98a0] border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Vista de Perfil (no edición)
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-[#233274] mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#e15f0b]" />
                    Información Personal
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[#9a98a0] font-medium w-24">Nombre:</span>
                      <span className="text-[#233274] font-medium">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#9a98a0] font-medium w-24">Email:</span>
                      <span className="text-[#233274] font-medium truncate">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-[#9a98a0] font-medium w-24">Teléfono:</span>
                        <span className="text-[#233274] font-medium">{user?.phone}</span>
                      </div>
                    )}
                    {user?.bio && (
                      <div className="mt-4 p-4 bg-[#f8f5ef] rounded-xl">
                        <p className="text-[#233274]">{user.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Ubicación */}
                  {(user?.city || user?.country) && (
                    <div className="flex items-center gap-3 mt-4 p-4 bg-[#f8f5ef] rounded-xl">
                      <MapPin className="w-5 h-5 text-[#e15f0b]" />
                      <span className="text-[#233274]">
                        {user?.city}, {user?.country}
                      </span>
                    </div>
                  )}

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-[#f8f5ef] rounded-xl">
                      <div className="w-12 h-12 bg-[#f8f5ef] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-[#d14a00]" />
                      </div>
                      <p className="text-[#233274] font-medium">Miembro desde</p>
                      <p className="text-[#233274] text-sm">
                        {new Date(user?.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#f8f5ef] rounded-xl">
                      <div className="w-12 h-12 bg-[#f8f5ef] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-[#233274]" />
                      </div>
                      <p className="text-[#233274] font-medium">Verificado</p>
                      <p className="text-[#233274] text-sm">Email verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Estadísticas y Actividad */}
          <div className="space-y-6">
            <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#233274] mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#e15f0b]" />
                Opciones rápidas
              </h3>
              <p className="text-[#233274] text-sm mb-4">
                Accede rápidamente a la edición de tus datos personales o a la actualización de tu contraseña.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-[#9a98a0]/40 hover:border-[#e15f0b] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#e15f0b]" />
                    <div className="text-left">
                      <p className="text-[#233274] font-semibold">Editar información</p>
                      <span className="text-xs text-[#9a98a0]">Nombre, correo, teléfono y ubicación</span>
                    </div>
                  </div>
                  <Edit2 className="w-4 h-4 text-[#233274]" />
                </button>

                <a
                  href="#cambiar-contrasena"
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-[#9a98a0]/40 hover:border-[#e15f0b] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-[#e15f0b]" />
                    <div className="text-left">
                      <p className="text-[#233274] font-semibold">Cambiar contraseña</p>
                      <span className="text-xs text-[#9a98a0]">Refuerza la seguridad de tu cuenta</span>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-[#233274]" />
                </a>
              </div>
            </div>

            <div id="cambiar-contrasena" className="bg-[#f8f5ef] rounded-2xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#233274] mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#e15f0b]" />
                Cambiar contraseña
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-[#d14a00] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-[#9a98a0] border-t-transparent rounded-full animate-spin"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar nueva contraseña
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
