// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { BookmarkCheck, Heart, LogIn, UserPlus } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import MotionTitle from '../../../shared/motion/MotionTitle';

const benefits = [
  {
    icon: Heart,
    title: 'Favoritos guardados',
    description: 'Organiza referencias de proyectos y servicios para revisarlas cuando avances tu idea.',
  },
  {
    icon: BookmarkCheck,
    title: 'Seguimiento personal',
    description: 'Conserva tu historial de consultas y vuelve rapidamente a lo que te interesa.',
  },
];

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="bg-[#101828] py-14 text-white sm:py-16">
      <div className="container-custom">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="max-w-3xl" data-motion-card>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#f6a24a]">
              Cuenta CasaLiz
            </p>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#f8f5ef] sm:text-4xl lg:text-5xl"
            >
              Guarda tus referencias y vuelve a tus proyectos favoritos.
            </MotionTitle>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/74">
              Accede para tener una experiencia mas ordenada al revisar servicios, proyectos
              destacados y futuras consultas con el equipo.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f26b1d] px-6 py-3 text-sm font-black text-white transition hover:bg-[#d14a00] hover:-translate-y-0.5"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesion
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/20 hover:-translate-y-0.5"
              >
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur"
                  data-motion-card
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#233274]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">{benefit.description}</p>
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
