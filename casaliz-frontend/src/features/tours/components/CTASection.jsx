// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Star, Shield, Gift } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-r from-[#e15f0b] via-[#f26b1d] to-[#d14a00] relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8f5ef] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f8f5ef] rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="text-4xl lg:text-5xl font-black text-[#233274] mb-6 animate-fade-in">
            Inicia sesión para seguir tu proyecto con Casaliz
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-[#1a2555] mb-8 animate-fade-in">
            Visualiza planos, revisiones, avances y documentos de tu obra en un solo lugar.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/login"
              className="group bg-[#233274] hover:bg-[#1a2555] text-[#f8f5ef] font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Iniciar sesión
            </Link>

            <Link
              to="/register"
              className="group bg-[#f8f5ef] hover:bg-[#f8f5ef] text-[#233274] font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center border-2 border-[#233274]"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crear cuenta
            </Link>
          </div>

          {/* Beneficios */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Gift,
                text: 'Oficina virtual del proyecto — Ve el estado de tu proyecto en tiempo real.',
                color: 'from-[#e15f0b] to-[#d14a00]',
              },
              {
                icon: Star,
                text: 'Historial de revisiones — Control de versiones de planos y cambios aprobados.',
                color: 'from-[#233274] to-[#1a2555]',
              },
              {
                icon: Shield,
                text: 'Documentación centralizada — Presupuestos, contratos y planos siempre disponibles.',
                color: 'from-[#233274] to-[#1a2555]',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-[#f8f5ef]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-[#f8f5ef]" />
                  </div>
                  <p className="font-semibold text-[#233274]">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;