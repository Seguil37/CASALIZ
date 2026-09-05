// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';
import heroImage from '../../../assets/images/servicios-principales/viviendas_unifamiliares_multifamiliares.png';

const modeOptions = [
  { value: 'services', label: 'Servicios' },
  { value: 'projects', label: 'Proyectos' },
  { value: 'about', label: 'Empresa' },
];

const HeroSection = () => {
  const [mode, setMode] = useState('services');
  const [projectQuery, setProjectQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'services') {
      const params = new URLSearchParams();
      if (serviceQuery) params.append('search', serviceQuery);
      navigate({
        pathname: '/services',
        search: params.toString() ? `?${params.toString()}` : '',
        hash: '#servicios-listado',
      });
      return;
    }

    const params = new URLSearchParams();
    if (projectQuery) {
      params.append('search', projectQuery);
    }
    navigate({
      pathname: '/projects',
      search: params.toString() ? `?${params.toString()}` : '',
      hash: '#projects-results',
    });
  };

  const projectSuggestions = [
    'Edificio Multifamiliar Ecologica Plaza',
    'Casa de Campo Zurite',
    'Vivienda unifamiliar',
    'Remodelacion integral',
    'Oficina comercial',
  ];
  const serviceSuggestions = [
    'Diseno, Construccion y Regularizacion Inmobiliaria',
    'Servicios Inmobiliarios',
    'Tramites y Regularizacion Inmobiliaria',
    'Diseno de interiores',
    'Topografia',
  ];

  const isAbout = mode === 'about';
  const inputLabel = mode === 'services' ? 'Servicio o palabra clave' : 'Proyecto, zona o referencia';
  const inputPlaceholder =
    mode === 'services'
      ? 'Licencias, diseno, topografia...'
      : 'Cusco, vivienda, remodelacion...';
  const suggestions = mode === 'services' ? serviceSuggestions : projectSuggestions;
  const value = mode === 'services' ? serviceQuery : projectQuery;
  const onChange = mode === 'services' ? setServiceQuery : setProjectQuery;

  return (
    <section
      className="relative overflow-hidden bg-[#101828] text-white"
      data-motion-hero
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Proyecto arquitectonico residencial"
          className="h-full w-full object-cover opacity-75"
          data-motion-parallax="8"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,40,0.96)_0%,rgba(16,24,40,0.82)_42%,rgba(16,24,40,0.36)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f6f1e8] to-transparent" />
      </div>

      <div className="container-custom relative z-10 grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:py-16 xl:py-20">
        <div className="max-w-3xl" data-motion-item>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f8f5ef] backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#f6a24a]" />
            Arquitectura, obra y gestion inmobiliaria
          </div>

          <MotionTitle
            as="h1"
            className="max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-[#f8f5ef] sm:text-5xl lg:text-6xl"
          >
            CasaLiz Arquitectos e Ingenieros
          </MotionTitle>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Disenamos, regularizamos y ejecutamos proyectos residenciales y comerciales con
            acompanamiento tecnico desde la primera idea hasta la entrega.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f26b1d] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:bg-[#d14a00] hover:-translate-y-0.5"
            >
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              Explorar servicios
              <Building2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Star, text: 'Clientes que confian en CasaLiz', count: '98%' },
              { icon: Building2, text: 'Proyectos disenados y construidos', count: '120+' },
              { icon: Users, text: 'Anos de experiencia combinada', count: '10+' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
                  data-motion-item
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[#f6a24a]" />
                    <span className="text-2xl font-black text-white">{item.count}</span>
                  </div>
                  <p className="text-sm leading-5 text-white/74">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-lg border border-white/20 bg-[#f8f5ef] p-4 text-[#233274] shadow-2xl shadow-black/30 sm:p-5"
          data-motion-item
        >
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#e8dfd1] p-1">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`rounded-md px-2 py-2 text-xs font-black transition sm:text-sm ${
                  mode === option.value
                    ? 'bg-white text-[#233274] shadow-sm'
                    : 'text-[#6c6258] hover:bg-white/60'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {isAbout ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e15f0b]">
                  Equipo integral
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#233274]">
                  Una sola ruta para diseno, permisos y obra.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5b6472]">
                  Arquitectos e ingenieros coordinan la documentacion, el expediente tecnico,
                  la supervision y la ejecucion para reducir fricciones en cada etapa.
                </p>
              </div>

              <div className="grid gap-2">
                {['Planificacion tecnica', 'Gestion municipal', 'Control de calidad'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#344054]">
                    <CheckCircle2 className="h-4 w-4 text-[#0f766e]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/contacto')}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#233274] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a2555]"
                >
                  Hablemos ahora
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#nosotros"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#d9cbb7] bg-white px-5 py-3 text-sm font-bold text-[#233274] transition hover:border-[#e15f0b]/40 hover:text-[#d14a00]"
                >
                  Ver fortalezas
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-[#233274]">
                  {inputLabel}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#e15f0b]" />
                  <input
                    type="text"
                    placeholder={inputPlaceholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-14 w-full rounded-lg border border-[#d8cbb9] bg-white pl-12 pr-4 text-sm font-semibold text-[#233274] outline-none transition placeholder:text-[#8f8478] focus:border-[#e15f0b] focus:ring-4 focus:ring-[#e15f0b]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#e15f0b] px-6 text-sm font-black text-white shadow-lg shadow-[#e15f0b]/20 transition hover:bg-[#d14a00] hover:-translate-y-0.5"
              >
                <Search className="h-5 w-5" />
                {mode === 'services' ? 'Buscar servicios' : 'Buscar proyectos'}
              </button>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8f8478]">
                  Prueba con
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 4).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onChange(item)}
                      className="rounded-full border border-[#dfd2bf] bg-white px-3 py-1.5 text-xs font-bold text-[#665f57] transition hover:border-[#e15f0b]/40 hover:text-[#d14a00]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
