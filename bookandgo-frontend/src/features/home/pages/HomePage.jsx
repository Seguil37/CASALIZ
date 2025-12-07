// src/features/home/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { servicesApi, projectsApi } from '../../../shared/utils/api';
import { ArrowRight, CheckCircle, Building2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

const benefitList = [
  'Acompañamiento en licencias y trámites municipales',
  'Diseño funcional y estético alineado a normativa',
  'Supervisión técnica con enfoque en seguridad',
  'Equipo multidisciplinario en arquitectura e ingeniería',
];

const HomePage = () => {
  const { data: services } = useQuery(['services'], servicesApi.list);
  const { data: projects } = useQuery(['projects'], projectsApi.list);

  return (
    <div className="bg-white">
      <section className="section-lg bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="badge-accent inline-block">Arquitectura y gestión integral</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              CASALIZ Arquitectos Ingenieros
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Diseñamos y gestionamos tus proyectos de construcción con seguridad y confianza. Integramos normativa peruana,
              eficiencia energética y control de calidad en cada etapa.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefitList.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white/70 backdrop-blur border border-slate-100 p-3 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contacto" className="btn-primary inline-flex items-center gap-2">
                Solicitar asesoría
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/proyectos" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                Ver proyectos
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-10 h-10 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Portafolio</p>
                  <p className="text-xl font-black text-slate-900">Proyectos corporativos</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Oficinas, vivienda, salud y educación diseñados para operar con eficiencia.</p>
            </div>
            <div className="bg-blue-900 text-white rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-10 h-10 text-orange-300" />
                <div>
                  <p className="text-sm text-blue-100">Control</p>
                  <p className="text-xl font-black">Seguridad y normativas</p>
                </div>
              </div>
              <p className="text-sm text-blue-100">Supervisión y control de calidad en obra con reportes claros y trazables.</p>
            </div>
            <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6">
                <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Documentos</p>
                  <p className="text-xl font-black text-slate-900">Expedientes listos</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Expedientes técnicos, metrados y memorias para licitar o ejecutar con respaldo.</p>
            </div>
            <div className="bg-orange-500 text-white rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-sm uppercase tracking-wide">Equipo CASALIZ</p>
              <p className="text-2xl font-black leading-tight">Arquitectos e ingenieros especializados en cada etapa.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="badge-accent">Qué hacemos</p>
              <h2 className="text-3xl font-black text-slate-900">Servicios de arquitectura e ingeniería</h2>
              <p className="text-slate-600">Soluciones integrales desde el concepto hasta la entrega de obra.</p>
            </div>
            <Link to="/servicios" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Ver todos
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {services?.data?.slice(0, 3).map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-custom space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="badge-accent">Portafolio</p>
              <h2 className="text-3xl font-black text-slate-900">Proyectos recientes</h2>
              <p className="text-slate-600">Experiencia en vivienda, oficinas, salud y educación.</p>
            </div>
            <Link to="/proyectos" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Ver portafolio
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.data?.slice(0, 3).map((project) => (
              <Link
                to={`/proyectos/${project.id}`}
                key={project.id}
                className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 hover:-translate-y-1 transition"
              >
                <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-100 rounded-xl mb-4" aria-hidden />
                <p className="text-sm text-slate-500">{project.location}</p>
                <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
