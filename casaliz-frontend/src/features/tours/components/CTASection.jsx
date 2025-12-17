// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Heart } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#e15f0b] via-[#f26b1d] to-[#233274] relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-[-6rem] right-[-4rem] w-96 h-96 bg-[#fbbf24]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] w-[28rem] h-[28rem] bg-[#1a2555]/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="text-4xl lg:text-5xl font-black text-[#f8f5ef] mb-6 animate-fade-in">
            Accede a tu cuenta Casaliz
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-[#f8f5ef] mb-8 animate-fade-in">
            Inicia sesión para dejar reseñas, descubrir proyectos destacados y guardar tus favoritos.
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
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                title: 'Proyectos favoritos',
                description:
                  'Guarda tus proyectos favoritos para consultarlos siempre que los necesites. Descubre trabajos populares de la comunidad, comparte tus favoritos con otros usuarios y mantén una lista personalizada de inspiración.',
                color: 'from-[#e15f0b] to-[#d14a00]',
              },
              {
                icon: UserPlus,
                title: 'Opiniones de clientes',
                description:
                  'Lee reseñas de la comunidad, descubre proyectos destacados y guarda tus favoritos. Crea tu cuenta para dejar tus propias valoraciones y ayudar a otros usuarios a tomar mejores decisiones.',
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
                  <p className="text-[#233274] text-center">
                    <span className="font-extrabold">{benefit.title}</span>
                    <br />
                    {benefit.description}
                  </p>
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
