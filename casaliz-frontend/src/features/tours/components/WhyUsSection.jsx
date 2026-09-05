// src/features/tours/components/WhyUsSection.jsx

import {
  Award,
  ClipboardCheck,
  Clock3,
  DraftingCompass,
  ShieldCheck,
  Users,
} from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';

const features = [
  {
    icon: ShieldCheck,
    title: 'Tu proyecto, nuestra prioridad',
    description:
      'Acompañamos cada etapa: idea, diseño, planos y obra. El resultado se alinea con tu estilo, presupuesto y necesidades reales.',
  },
  {
    icon: DraftingCompass,
    title: 'Diseño funcional y estético',
    description:
      'Ordenamos iluminacion, circulacion, materiales y detalle constructivo para lograr espacios utiles, durables y coherentes.',
  },
  {
    icon: ClipboardCheck,
    title: 'Gestion integral y transparente',
    description:
      'Coordinamos especialistas, expediente, permisos y ejecucion para que el avance tecnico sea claro en todo momento.',
  },
];

const stats = [
  { icon: Award, value: '98%', label: 'Proyectos entregados a tiempo' },
  { icon: Users, value: '120+', label: 'Proyectos diseñados y ejecutados' },
  { icon: Clock3, value: '10+ anos', label: 'Experiencia en arquitectura y construccion' },
];

const WhyUsSection = () => {
  return (
    <section id="nosotros" className="bg-white py-16 sm:py-20">
      <div className="container-custom">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-24" data-motion-card>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#e15f0b]">
              Metodo CasaLiz
            </p>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#233274] sm:text-4xl lg:text-5xl"
            >
              Un equipo tecnico para decisiones importantes.
            </MotionTitle>
            <p className="mt-4 text-base leading-8 text-[#667085]">
              Integramos arquitectura, ingenieria y gestion para que cada decision avance con
              sustento tecnico, presupuesto claro y documentacion ordenada.
            </p>
          </div>

          <div className="grid gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group grid gap-5 rounded-lg border border-[#e2d6c6] bg-[#fdfbf7] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#e15f0b]/35 hover:shadow-xl sm:grid-cols-[64px_1fr] sm:p-6"
                  data-motion-card
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#233274] text-white shadow-lg shadow-[#233274]/15">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">
                      0{index + 1}
                    </div>
                    <h3 className="text-2xl font-black text-[#233274] transition group-hover:text-[#d14a00]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#667085]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-[#d8cbb9] bg-[#101828] p-6 text-white shadow-sm"
                data-motion-card
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#233274]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="mt-2 text-sm leading-6 text-white/72">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
