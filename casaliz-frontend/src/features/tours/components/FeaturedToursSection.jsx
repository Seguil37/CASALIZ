import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MapPin, Sparkles } from 'lucide-react';
import api, { toPublicUrl } from '../../../shared/utils/api';
import MotionTitle from '../../../shared/motion/MotionTitle';
import viviendasImg from '../../../assets/images/servicios-principales/viviendas_unifamiliares_multifamiliares.png';
import casasCampoImg from '../../../assets/images/servicios-principales/casas_de_campo.png';
import interioresImg from '../../../assets/images/servicios-principales/diseno_interiores_3d.png';

const exampleProjects = [
  {
    id: 1,
    title: 'Casa Miraflores',
    type: 'Residencial',
    fallback_image: viviendasImg,
    city: 'Lima',
    state: 'Lima',
    is_featured: true,
  },
  {
    id: 2,
    title: 'Casa de Campo Zurite',
    type: 'Casa de campo',
    fallback_image: casasCampoImg,
    city: 'Zurite',
    state: 'Cusco',
    is_featured: true,
  },
  {
    id: 3,
    title: 'Interior residencial 3D',
    type: 'Interiores',
    fallback_image: interioresImg,
    city: 'Cusco',
    state: 'Cusco',
    is_featured: true,
  },
];

const FeaturedToursSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await api.get('/projects/featured');
        const data = response.data?.data ?? response.data ?? [];
        setProjects(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const displayProjects = projects.length > 0 ? projects : exampleProjects;

  if (loading) {
    return (
      <section className="bg-[#f6f1e8] py-20">
        <div className="container-custom text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#e15f0b] border-t-transparent" />
          <p className="mt-4 text-[#667085]">Cargando proyectos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f6f1e8] py-16 sm:py-20">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e] shadow-sm">
              <Sparkles className="h-4 w-4" />
              Portafolio destacado
            </div>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#233274] sm:text-4xl lg:text-5xl"
            >
              Proyectos con criterio espacial, documentacion y obra.
            </MotionTitle>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#d8cbb9] bg-white px-5 py-3 text-sm font-bold text-[#233274] transition hover:border-[#e15f0b]/40 hover:text-[#d14a00] lg:self-auto"
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayProjects.map((project) => {
            const image =
              project.fallback_image ||
              toPublicUrl(project.hero_image || project.featured_image || project.images?.[0]?.path) ||
              viviendasImg;
            const location = project.city
              ? `${project.city}${project.state ? `, ${project.state}` : ''}`
              : 'Ubicacion por confirmar';

            return (
              <Link
                key={project.id || project.title}
                to={project.id ? `/projects/${project.id}` : '/projects'}
                className="group overflow-hidden rounded-lg border border-[#e2d6c6] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#e15f0b]/35 hover:shadow-xl"
                data-motion-card
              >
                <div className="flex flex-wrap items-center gap-2 p-4 pb-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f6f1e8] px-3 py-1.5 text-xs font-black text-[#233274]">
                    <Home className="h-4 w-4 text-[#0f766e]" />
                    {project.type || 'Proyecto residencial'}
                  </span>
                  {project.is_featured && (
                    <span className="inline-flex rounded-full bg-[#101828] px-3 py-1.5 text-xs font-black text-white">
                      Destacado
                    </span>
                  )}
                </div>

                <div className="relative mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#efe6d8]">
                  <img
                    src={image}
                    alt={project.title}
                    className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.015]"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#667085]">
                    <MapPin className="h-4 w-4 text-[#e15f0b]" />
                    {location}
                  </div>

                  <h3 className="text-xl font-black leading-tight text-[#233274] transition group-hover:text-[#d14a00]">
                    {project.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#233274]">
                    Ver detalle
                    <ArrowRight className="h-4 w-4 text-[#e15f0b] transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedToursSection;
