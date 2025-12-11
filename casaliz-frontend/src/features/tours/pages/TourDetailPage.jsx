// src/features/tours/pages/TourDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft } from 'lucide-react';
import api from '../../../shared/utils/api';

const TourDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError('Proyecto no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="container-custom py-16 text-center">Cargando proyecto...</div>;
  }

  if (error || !project) {
    return (
      <div className="container-custom py-16 text-center space-y-4">
        <p className="text-xl text-[#233274] font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Link to="/tours" className="text-[#e15f0b] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
      </div>
    );
  }

  const hero = project.hero_image || project.images?.[0]?.path;

  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <div className="relative h-96 w-full">
        <img
          src={hero}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white space-y-2">
          <p className="text-sm uppercase tracking-wider">Proyecto de arquitectura</p>
          <h1 className="text-3xl md:text-4xl font-black">{project.title}</h1>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>{project.city}{project.state ? `, ${project.state}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebe7df]">
            <h2 className="text-xl font-bold text-[#233274] mb-3">Descripción</h2>
            <p className="text-[#4b4b4b] leading-relaxed whitespace-pre-line">{project.description || 'Próximamente más detalles del proyecto.'}</p>
          </div>

          {project.images?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebe7df]">
              <h3 className="text-lg font-bold text-[#233274] mb-4">Galería</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.path}
                    alt={image.caption || project.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebe7df] space-y-4">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-[#e15f0b]" />
              <div>
                <p className="text-sm text-[#9a98a0]">Tipo</p>
                <p className="text-lg font-semibold text-[#233274]">{project.type || 'Residencial'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#9a98a0]">Estado</p>
              <p className="text-lg font-semibold text-[#233274]">{project.status === 'published' ? 'Publicado' : 'Borrador'}</p>
            </div>
            <div>
              <p className="text-sm text-[#9a98a0]">Resumen</p>
              <p className="text-[#4b4b4b]">{project.summary || 'Proyecto destacado del portafolio de CASALIZ.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
