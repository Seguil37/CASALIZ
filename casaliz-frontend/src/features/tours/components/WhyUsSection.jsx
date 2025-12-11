// src/features/tours/components/WhyUsSection.jsx

import { Shield, Gift, Calendar, Award, Users, Clock } from 'lucide-react';

const WhyUsSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Tu proyecto, nuestra prioridad',
      description:
        'Acompañamos cada etapa: idea, diseño, planos y obra. Nos enfocamos en que el resultado se ajuste a tu estilo, presupuesto y necesidades reales.',
      color: 'from-[#233274] to-[#1a2555]',
    },
    {
      icon: Gift,
      title: 'Diseño funcional y estético',
      description:
        'Creamos espacios que se ven bien, se sienten bien y funcionan mejor: iluminación, circulación, materiales y cada detalle pensado para el uso diario.',
      color: 'from-[#e15f0b] to-[#d14a00]',
    },
    {
      icon: Calendar,
      title: 'Gestión integral y transparente',
      description:
        'Coordinamos con ingenieros, proveedores y constructores. Tú ves el avance, nosotros nos encargamos de la complejidad técnica.',
      color: 'from-[#233274] to-[#3a4c9c]',
    },
  ];

  const stats = [
    { icon: Award, value: '98%', label: 'Proyectos entregados a tiempo' },
    { icon: Users, value: '120+', label: 'Proyectos diseñados y ejecutados' },
    { icon: Clock, value: '10+ años', label: 'Experiencia en arquitectura y construcción' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#f8f5ef] to-[#f8f5ef]">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black text-[#233274] mb-4">
            ¿Por qué diseñar tu proyecto con Casaliz?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] mx-auto rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-[#f8f5ef] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icono con gradiente */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-[#f8f5ef]" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-[#233274] mb-4 group-hover:text-[#e15f0b] transition-colors">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-[#9a98a0] leading-relaxed">{feature.description}</p>

                {/* Línea decorativa */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] transition-all duration-500 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#f8f5ef] to-[#e15f0b] rounded-2xl p-8 text-center animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-8 h-8 text-[#f8f5ef]" />
                </div>
                <div className="text-4xl font-black text-[#233274] mb-2">{stat.value}</div>
                <div className="text-[#233274] font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;