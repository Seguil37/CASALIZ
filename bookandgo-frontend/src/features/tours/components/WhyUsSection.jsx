// src/features/tours/components/WhyUsSection.jsx

import { Shield, ClipboardList, Building2, FileCheck, HardHat, Users } from 'lucide-react';

const WhyUsSection = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Asesoría inicial y diagnóstico',
      description:
        'Revisamos documentación, normativas locales y el contexto del predio para definir el alcance real del proyecto.',
      color: 'from-primary to-secondary',
    },
    {
      icon: Building2,
      title: 'Diseño arquitectónico & expediente técnico',
      description:
        'Desarrollamos propuestas funcionales y completas, listas para ser presentadas a la municipalidad o entidad competente.',
      color: 'from-secondary to-primary',
    },
    {
      icon: FileCheck,
      title: 'Licencias y regularización',
      description:
        'Gestionamos licencias de obra, declaratoria de fábrica y regularización (Ley 30830) con seguimiento de observaciones.',
      color: 'from-primary to-orange-500',
    },
  ];

  const stats = [
    { icon: Shield, value: '15+', label: 'Años de experiencia acumulada' },
    { icon: HardHat, value: '200+', label: 'Expedientes y licencias aprobadas' },
    { icon: Users, value: '350+', label: 'Clientes que confían en CASALIZ' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Nuestro proceso de trabajo
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icono con gradiente */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Línea decorativa */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"></div>
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
                className="bg-gradient-to-br from-accent.orangeSoft to-accent.blueSoft rounded-2xl p-8 text-center animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;