// src/features/about/pages/AboutPage.jsx

import { Building2, Compass, Handshake, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const experienceHighlights = [
  {
    title: '10+ años de experiencia combinada',
    description:
      'Equipo de arquitectos e ingenieros que lidera el ciclo completo: idea, diseño, gestión de licencias, construcción y supervisión.',
    icon: Building2,
  },
  {
    title: 'Arquitectura con propósito',
    description:
      'Proponemos soluciones habitables, eficientes y sostenibles que reflejan la identidad del cliente y cumplen normativas locales.',
    icon: Compass,
  },
  {
    title: 'Ejecución integral',
    description:
      'Coordinamos especialidades, proveedores y cronogramas para que cada proyecto avance con trazabilidad y control de calidad.',
    icon: Layers,
  },
];

const capabilityPillars = [
  {
    title: 'Diseño y conceptualización',
    detail: 'Anteproyecto, modelado 3D y experiencia espacial centrada en el usuario.',
  },
  {
    title: 'Gestión técnica y licencias',
    detail: 'Habilitaciones urbanas, expedientes técnicos y respuesta ágil a observaciones.',
  },
  {
    title: 'Dirección de obra y supervisión',
    detail: 'Seguimiento en campo, control de avances, seguridad y estándares constructivos.',
  },
  
];

const AboutPage = () => {
  return (
    <div className="bg-[#f8f5ef] text-[#233274]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1b35] via-[#18274a] to-[#0f1b35] text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute -left-12 -top-12 w-72 h-72 rounded-full bg-[#e15f0b] blur-3xl" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#d14a00] blur-3xl" />
        </div>

        <div className="container-custom relative py-20 lg:py-28 grid gap-12 lg:grid-cols-[1.2fr_auto] items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f9c991]">
              <Sparkles className="w-5 h-5" />
              <span>Arquitectura con años de experiencia</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Diseñamos, habilitamos y construimos proyectos con visión integral.
            </h1>

            <p className="text-lg md:text-xl text-white/85 max-w-3xl">
              Casaliz coordina cada etapa con precisión: conceptualización, gestión normativa, dirección de obra e interiorismo. Nos
              enfocamos en resultados habitables, eficientes y alineados a la identidad de cada cliente.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contacto"
                className="px-6 py-3 rounded-full bg-white text-[#233274] font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                Agenda una reunión
              </Link>
              <a
                href="#nosotros"
                className="px-6 py-3 rounded-full border border-white/60 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Conoce nuestra metodología
              </a>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl backdrop-blur max-w-sm w-full">
            <p className="text-sm uppercase tracking-[0.3em] text-[#f9c991] mb-3">Credenciales clave</p>
            <div className="space-y-3">
              {[{ label: 'Proyectos diseñados y ejecutados', value: '120+' }, { label: 'Años de experiencia combinada', value: '10+' }, { label: 'Tasa de satisfacción', value: '98%' }].map(
                (item) => (
                  <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-sm text-white/80">{item.label}</span>
                    <span className="text-2xl font-black text-white">{item.value}</span>
                  </div>
                ),
              )}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-white/15 border border-white/20">
              <p className="text-sm text-white/85">
                Acompañamos a empresas y familias en proyectos residenciales, corporativos y comerciales, asegurando trazabilidad y
                decisiones informadas en cada hito.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="container-custom py-16 lg:py-20 space-y-10">
        

        <div className="grid gap-6 md:grid-cols-3">
          {experienceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-2xl shadow-lg border border-[#e2dfd7] p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e15f0b] to-[#d14a00] flex items-center justify-center text-white shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-[#0f1b35]">{item.title}</h3>
                <p className="text-base text-[#4a4b57]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-y border-[#e2dfd7]">
        <div className="container-custom py-16 lg:py-20 grid gap-10 lg:grid-cols-[1.1fr_auto] items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#d14a00] uppercase tracking-[0.2em]">Metodología</p>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0f1b35]">Arquitectura informada por datos y territorio</h2>
            <p className="text-lg text-[#4a4b57] max-w-3xl">
              Analizamos contexto urbano, condicionantes técnicas y normativas locales para definir estrategias de implantación,
              circulaciones y materialidad. Cada entregable busca anticipar riesgos y viabilizar licencias sin perder la identidad
              arquitectónica.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilityPillars.map((item) => (
                <div key={item.title} className="p-5 border border-[#e2dfd7] rounded-2xl bg-[#f8f5ef] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="w-4 h-4 text-[#d14a00]" />
                    <h3 className="text-lg font-bold text-[#0f1b35]">{item.title}</h3>
                  </div>
                  <p className="text-sm text-[#4a4b57]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1b35] text-white rounded-3xl p-8 shadow-2xl border border-[#233274]/40 w-full max-w-md">
            <h3 className="text-2xl font-black mb-4">¿Listo para conversar tu proyecto?</h3>
            <p className="text-white/80 mb-6">
              Revisamos viabilidad, elaboramos cronogramas y preparamos rutas de licenciamiento para que construyas con confianza.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-[#233274] font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Coordinar una llamada
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
