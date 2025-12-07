// src/features/projects/pages/ProjectsPage.jsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../shared/utils/api';
import { MapPin, ArrowRight } from 'lucide-react';

const ProjectsPage = () => {
  const { data: projects } = useQuery(['projects'], projectsApi.list);

  return (
    <div className="bg-white min-h-screen">
      <div className="section bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container-custom space-y-3">
          <p className="badge-accent">Portafolio</p>
          <h1 className="text-4xl font-black text-slate-900">Proyectos de arquitectura e ingeniería</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Experiencia en vivienda, corporativo, salud y educación con control de calidad y cumplimiento normativo.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container-custom grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.data?.map((project) => (
            <Link
              to={`/proyectos/${project.id}`}
              key={project.id}
              className="bg-white border border-slate-100 rounded-2xl card-shadow p-6 space-y-3 hover:-translate-y-1 transition"
            >
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" aria-hidden />
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {project.location}
              </p>
              <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-sm font-semibold text-blue-700">
                <span>{project.type}</span>
                <span className="flex items-center gap-1">
                  Ver detalle
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
