// src/features/projects/pages/ProjectDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../shared/utils/api';
import { MapPin, Home, Ruler, ArrowLeft, ShieldCheck } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(['project', id], () => projectsApi.show(id));

  if (isLoading) return <p className="p-8">Cargando proyecto...</p>;
  if (error || !data?.data) return <p className="p-8">Proyecto no encontrado.</p>;

  const project = data.data;

  return (
    <div className="bg-white min-h-screen">
      <div className="section bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container-custom space-y-2">
          <Link to="/proyectos" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver a proyectos
          </Link>
          <p className="badge-accent">Proyecto</p>
          <h1 className="text-4xl font-black text-slate-900">{project.name}</h1>
          <p className="text-slate-600">{project.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
              <MapPin className="w-4 h-4 text-orange-500" /> {project.location}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
              <Home className="w-4 h-4 text-orange-500" /> {project.type}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
              <ShieldCheck className="w-4 h-4 text-orange-500" /> {project.status}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
              <Ruler className="w-4 h-4 text-orange-500" /> Área {project.area}
            </span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container-custom grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-80 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 card-shadow" aria-hidden />
            <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-3 card-shadow">
              <h2 className="text-2xl font-bold text-slate-900">Descripción</h2>
              <p className="text-slate-700 leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 card-shadow space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Puntos clave</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {project.highlights?.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-500 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-2xl p-6 space-y-3">
              <h3 className="text-xl font-black">¿Quieres un proyecto similar?</h3>
              <p className="text-sm text-orange-50">Contáctanos y planifiquemos la mejor solución para tu terreno o inmueble.</p>
              <Link to="/contacto" className="inline-flex items-center gap-2 font-semibold">
                Escríbenos
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
