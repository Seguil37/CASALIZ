// src/features/auth/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Shield, Star } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Limpiar errores
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    clearError();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      // El error ya está en el store
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-2xl mb-6 shadow-xl">
            <LogIn className="w-12 h-12 text-[#233274]" />
          </div>
          <h2 className="text-4xl font-black text-[#233274] mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-[#9a98a0]">
            Inicia sesión para dejar reseñas, tu opinion nos importa.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {error && (
              <div className="bg-[#f8f5ef] border-l-4 border-[#d14a00] p-4 rounded-lg animate-fade-in flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#d14a00] flex-shrink-0 mt-0.5" />
                <p className="text-[#d14a00] text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e15f0b]" />
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'email' ? 'text-[#e15f0b]' : 'text-[#9a98a0]'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email
                      ? 'border-[#d14a00] focus:border-[#d14a00]'
                      : focusedField === 'email'
                      ? 'border-[#e15f0b] bg-[#f8f5ef]'
                      : 'border-[#9a98a0] focus:border-[#e15f0b]'
                  }`}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-[#d14a00] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#233274] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#e15f0b]" />
                Contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === 'password' ? 'text-[#e15f0b]' : 'text-[#9a98a0]'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password
                      ? 'border-[#d14a00] focus:border-[#d14a00]'
                      : focusedField === 'password'
                      ? 'border-[#e15f0b] bg-[#f8f5ef]'
                      : 'border-[#9a98a0] focus:border-[#e15f0b]'
                  }`}
                  placeholder="•••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a98a0] hover:text-[#e15f0b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-[#d14a00] animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Link a registro */}
          <div className="mt-8 text-center">
            <p className="text-[#9a98a0]">
              ¿Aún no tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-[#e15f0b] hover:text-[#d14a00] font-bold transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Beneficios */}
        

        {/* Cuentas de prueba */}
        <div className="mt-6 bg-[#f8f5ef] border border-[#f8f5ef] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1a2555] mb-2">🔐 Cuentas de prueba:</p>
          <div className="space-y-1 text-xs text-[#1a2555]">
            <p><strong>Master Admin:</strong> master@casaliz.test</p>
            <p><strong>Admin Principal:</strong> admin@casaliz.test</p>
            <p><strong>Cliente:</strong> cliente@casaliz.test</p>
            <p className="mt-2"><strong>Contraseña:</strong> password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;