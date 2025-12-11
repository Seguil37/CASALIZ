// src/features/booking/pages/ProfilePage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Shield, Star, AlertCircle } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la llamada al API
      // await api.put('/profile', formData);
      
      // Simulación
      setTimeout(() => {
        updateUser({ ...user, ...formData });
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
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
                      disabled
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
          <div className="md:col-span-1 space-y-8">
            {/* Estadísticas del Perfil */}
            <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-8 sticky top-24 animate-fade-in">
              <h3 className="text-xl font-bold text-[#233274] mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#e15f0b] fill-current" />
                Estadísticas
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#9a98a0]">Reservas realizadas</span>
                  <span className="text-2xl font-bold text-[#233274]">{user?.total_bookings || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#9a98a0]">Total gastado</span>
                  <span className="text-2xl font-bold text-[#233274]">S/. {user?.total_spent || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#9a98a0]">
                <span className="text-[#9a98a0]">Nivel de viajero</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#e15f0b] fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[#233274] font-bold">
                    {user?.rating ? parseFloat(user.rating).toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="pt-6">
                <h4 className="text-lg font-bold text-[#233274] mb-4">Actividad Reciente</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f8f5ef] rounded-full flex items-center justify-center">
                      <span className="text-[#d14a00] font-bold text-lg">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#233274]">Reservas este mes</p>
                      <p className="text-sm text-[#9a98a0]">Ver todas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f8f5ef] rounded-full flex items-center justify-center">
                      <span className="text-[#1a2555] font-bold text-lg">12</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#233274]">Reservas este año</p>
                      <p className="text-sm text-[#9a98a0]">Ver todas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f8f5ef] rounded-full flex items-center justify-center">
                      <span className="text-[#1a2555] font-bold text-lg">24</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#233274]">Reservas este año</p>
                      <p className="text-sm text-[#9a98a0]">Ver todas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;