// src/features/auth/pages/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuthStore();

  const [step, setStep] = useState(1); // 1: formulario, 2: términos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await registerUser(formData);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
  };

  if (step === 2) {
    return (
      <TermsAndConditionsStep
        onBack={() => setStep(1)}
        onSubmit={handleSubmit}
        loading={loading}
        apiError={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-2xl mb-6 shadow-xl">
            <UserPlus className="w-12 h-12 text-[#233274]" />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 min-h-[120px]">
            <h2 className="text-4xl font-black text-[#233274] leading-tight text-center">Crea tu cuenta</h2>
            <p className="text-[#9a98a0] text-center max-w-xl">
              Únete a Book&Go y descubre experiencias únicas.
            </p>
          </div>
        </div>

        <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-8 animate-slide-up">
          {errors.general && (
            <div className="bg-[#f8f5ef] border-l-4 border-[#d14a00] p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#d14a00] flex-shrink-0 mt-0.5" />
              <p className="text-[#d14a00] text-sm font-medium">{errors.general}</p>
            </div>
          )}
          <form onSubmit={handleNext} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#233274] flex items-center gap-2">
                <User className="w-5 h-5 text-[#e15f0b]" />
                Información Personal
              </h3>

              <InputField
                icon={User}
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Juan Pérez"
              />

              <InputField
                icon={Mail}
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="tu@email.com"
              />

              <InputField
                icon={Phone}
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="+51 999 999 999"
              />
            </div>

            {/* Contraseñas */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-bold text-[#233274] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#e15f0b]" />
                Seguridad
              </h3>

              <PasswordField
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Mínimo 8 caracteres"
              />

              <PasswordField
                label="Confirmar contraseña"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Continuar
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#9a98a0]">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-[#e15f0b] hover:text-[#d14a00] font-bold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para inputs
const InputField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  focusedField,
  setFocusedField,
  placeholder,
  maxLength,
}) => (
  <div className="relative group">
    <label className="block text-sm font-semibold text-[#233274] mb-2">{label}</label>
    <div
      className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white shadow-sm focus-within:border-[#e15f0b] focus-within:ring-2 focus-within:ring-[#e15f0b]/20 ${
        error ? 'border-[#d14a00]' : 'border-[#9a98a0]'
      }`}
    >
      {Icon && <Icon className={`w-5 h-5 mr-3 ${focusedField === name ? 'text-[#e15f0b]' : 'text-[#9a98a0]'}`} />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-transparent focus:outline-none text-[#233274] placeholder:text-[#9a98a0]"
      />
    </div>
    {error && (
      <p className="mt-1 text-sm text-[#d14a00] animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente para contraseñas
const PasswordField = ({ label, name, value, onChange, error, show, onToggle, focusedField, setFocusedField, placeholder }) => (
  <div className="relative group">
    <label className="block text-sm font-semibold text-[#233274] mb-2">{label}</label>
    <div
      className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white shadow-sm focus-within:border-[#e15f0b] focus-within:ring-2 focus-within:ring-[#e15f0b]/20 ${
        error ? 'border-[#d14a00]' : 'border-[#9a98a0]'
      }`}
    >
      <Lock className={`w-5 h-5 mr-3 ${focusedField === name ? 'text-[#e15f0b]' : 'text-[#9a98a0]'}`} />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none text-[#233274] placeholder:text-[#9a98a0]"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a98a0] hover:text-[#e15f0b] transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className="mt-1 text-sm text-[#d14a00] animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente de términos y condiciones
const TermsAndConditionsStep = ({ onBack, onSubmit, loading, apiError }) => {
  const [accepted, setAccepted] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      setLocalError('Debes aceptar los términos y condiciones');
      return;
    }

    setLocalError(null);
    await onSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-2xl mb-6 shadow-xl">
            <Shield className="w-12 h-12 text-[#233274]" />
          </div>
          <h2 className="text-4xl font-black text-[#233274] mb-2">Términos y Condiciones</h2>
          <p className="text-[#9a98a0]">Revisa y acepta nuestros términos para continuar</p>
        </div>

        <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-8 animate-slide-up">
          {(localError || apiError) && (
            <div className="bg-[#f8f5ef] border-l-4 border-[#d14a00] p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#d14a00] flex-shrink-0 mt-0.5" />
              <p className="text-[#d14a00] text-sm font-medium">{localError || apiError}</p>
            </div>
          )}

          <div className="border border-[#9a98a0] rounded-xl p-6 max-h-64 overflow-y-auto mb-6">
            <div className="space-y-4 text-sm text-[#9a98a0]">
              <p className="font-semibold text-[#233274]">1. Aceptación de términos</p>
              <p>Al crear una cuenta en Book&Go, aceptas nuestros términos y condiciones.</p>

              <p className="font-semibold text-[#233274]">2. Uso del servicio</p>
              <p>Debes utilizar nuestros servicios de manera responsable y legal.</p>

              <p className="font-semibold text-[#233274]">3. Privacidad</p>
              <p>Tus datos serán protegidos según nuestra política de privacidad.</p>

              <p className="font-semibold text-[#233274]">4. Pagos</p>
              <p>Todos los pagos se procesan de forma segura a través de nuestros partners de pago.</p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-[#9a98a0] hover:border-[#e15f0b] cursor-pointer transition-all mb-6">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-[#e15f0b] focus:ring-[#e15f0b] rounded"
            />
            <span className="text-sm text-[#233274]">
              Acepto los términos y condiciones, la política de privacidad y el acuerdo de la comunidad de Book&Go.
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 border-2 border-[#9a98a0] text-[#233274] font-bold py-4 rounded-xl hover:bg-[#f8f5ef] transition-all disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              disabled={!accepted || loading}
              className="flex-1 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
