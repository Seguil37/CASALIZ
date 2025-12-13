// src/features/tours/pages/TourDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft, Heart, X, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import api from '../../../shared/utils/api';
import ReviewsSection from '../components/ReviewsSection';
import useFavoriteStore from '../../../store/favoriteStore';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';
const TourDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteError, setFavoriteError] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { favorites, toggleFavorite, fetchFavorites } = useFavoriteStore();
  const { isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch {
        setError('Proyecto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);
  useEffect(() => {
    if (isAuthenticated && user?.role === ROLES.CLIENT) {
      fetchFavorites();
    }
  }, [fetchFavorites, isAuthenticated, user?.role]);
  if (loading) {
    return <div className="container-custom py-16 text-center">Cargando proyecto...</div>;
  }
  if (error || !project) {
    return (
      <div className="container-custom py-16 text-center space-y-4">
        <p className="text-xl text-[#233274] font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Link to="/projects" className="text-[#e15f0b] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
      </div>
    );
  }
  const hero = project.hero_image || project.images?.[0]?.path;
  const isFavorite = favorites.includes(Number(id));
  const handleToggleFavorite = async () => {
    setFavoriteError('');
    try {
      await toggleFavorite(Number(id));
    } catch (err) {
      setFavoriteError(
        err.message === 'AUTH_REQUIRED'
          ? 'Inicia sesion como cliente para guardar favoritos.'
          : 'No se pudo actualizar tu lista de favoritos.'
      );
    }
  };
  const openImage = (image, index) => {
    setLightboxImage(image);
    setCurrentImageIndex(index);
  };
  const closeImage = () => setLightboxImage(null);
  const showPrevImage = () => {
    if (!project?.images?.length) return;
    const newIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(project.images[newIndex]);
  };
  const showNextImage = () => {
    if (!project?.images?.length) return;
    const newIndex = (currentImageIndex + 1) % project.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(project.images[newIndex]);
  };
  return (
    <div className="bg-gradient-to-b from-[#f6f2e8] via-white to-[#f6f2e8] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1b35] via-[#1e2f5f] to-[#233274]">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -left-32 top-0 w-80 h-80 rounded-full bg-[#e15f0b]/20 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-[-4rem] w-96 h-96 rounded-full bg-[#f59e0b]/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container-custom py-16 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver a proyectos
          </Link>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* CONTENIDO HERO */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#e15f0b]/20 to-[#f59e0b]/20 backdrop-blur border border-[#e15f0b]/40 text-[#fbbf24] text-xs uppercase tracking-widest font-bold">
                  ✨ Proyecto Destacado
                </span>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#1f3a8a]/80 to-[#233274]/80 border border-white/20 text-white text-xs font-semibold shadow-sm">
                  {project.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
                {project.type && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-xs font-semibold">
                    {project.type}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-lg text-white">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3 text-base font-medium text-[#fbbf24]">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {project.city}
                    {project.state ? `, ${project.state}` : ''}
                  </span>
                </div>
              </div>
              {project.summary && (
                <p className="max-w-2xl text-lg text-white/85 leading-relaxed font-light">{project.summary}</p>
              )}
              {isAuthenticated && user?.role === ROLES.CLIENT && (
                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base border-2 transition-all duration-300 transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-white text-[#233274] border-white shadow-lg shadow-white/30'
                      : 'bg-transparent text-white border-white hover:bg-white hover:text-[#233274] hover:shadow-lg hover:shadow-white/20'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-[#233274]' : ''}`} />
                  {isFavorite ? 'En favoritos' : 'Guardar favorito'}
                </button>
              )}
            </div>
            {/* IMAGEN HERO */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#e15f0b] to-[#f59e0b] rounded-3xl blur-2xl opacity-30" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                  <img
                    src={hero}
                    alt={project.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-gradient-to-r from-[#e15f0b] to-[#f59e0b] text-white text-sm font-bold shadow-lg">
                    {project.images?.length || 0} fotos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* STATS SECTION */}
      <section className="container-custom -mt-8 mb-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#ebe7df] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold">Ubicación</p>
            <p className="text-lg font-bold text-[#233274] mt-2">
              {project.city}
              {project.state ? `, ${project.state}` : ''}
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#ebe7df] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold">Tipo de Proyecto</p>
            <p className="text-lg font-bold text-[#233274] mt-2">{project.type || 'Residencial'}</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#ebe7df] shadow-lg p-6 hover:shadow-xl transition-shadow">
            <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold">Galería</p>
            <p className="text-lg font-bold text-[#233274] mt-2">{project.images?.length || 0} imagen(es)</p>
          </div>
        </div>
      </section>
      {/* MAIN CONTENT */}
      <section className="container-custom pb-16 space-y-12">
        {/* DESCRIPCION */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#ebe7df]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-1 rounded-full bg-[#e15f0b]" />
              <h2 className="text-2xl font-black text-[#233274]">Descripción del Proyecto</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#e15f0b]/30 to-transparent" />
            </div>
            <p className="text-[#4b4b4b] leading-relaxed whitespace-pre-line text-base lg:text-lg font-light">
              {project.description || 'Proximamente mas detalles del proyecto.'}
            </p>
          </div>
        </div>
        {/* GALERÍA DE IMÁGENES MEJORADA */}
        {project.images?.length > 0 && (
          <div className="space-y-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-widest text-[#e15f0b] font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Galería
                  </p>
                  <h3 className="text-3xl font-black text-[#233274]">Recorrido Visual</h3>
                </div>
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#e15f0b]/10 to-[#f59e0b]/10 border-2 border-[#e15f0b]/20">
                  <span className="text-sm font-bold text-[#e15f0b]">{project.images.length} imagen(es)</span>
                </div>
              </div>
              {/* GRID DE IMÁGENES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => openImage(image, index)}
                    className="group relative w-full h-64 overflow-hidden rounded-2xl border-2 border-[#ebe7df] bg-[#f8f5ef] focus:outline-none focus:ring-4 focus:ring-[#e15f0b]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <img
                      src={image.path}
                      alt={image.caption || project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-4 right-4 text-xs font-bold text-white px-4 py-2 rounded-full bg-[#e15f0b]/90 backdrop-blur transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      Ver grande →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* LAYOUT CON SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* SIDEBAR INFO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#ebe7df] sticky top-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b-2 border-[#ebe7df]">
                  <Home className="w-6 h-6 text-[#e15f0b] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold">Tipo</p>
                    <p className="text-lg font-bold text-[#233274] mt-1">{project.type || 'Residencial'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b-2 border-[#ebe7df]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e15f0b] to-[#f59e0b] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold">Estado</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg font-bold text-[#233274]">
                        {project.status === 'published' ? 'Publicado' : 'Borrador'}
                      </p>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#fdf1df] to-[#f3d7a6] border-2 border-[#e15f0b]/30 text-xs font-bold text-[#8a4b00]">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-widest text-[#9a98a0] font-bold mb-2">Resumen</p>
                  <p className="text-[#4b4b4b] leading-relaxed text-sm font-light">{project.summary || 'Proyecto destacado del portafolio de CASALIZ.'}</p>
                </div>
              </div>
              {isAuthenticated && user?.role === ROLES.CLIENT && (
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full mt-4 flex items-center justify-center gap-3 px-6 py-3 rounded-full font-bold border-2 transition-all duration-300 transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-[#233274] text-white border-[#233274] shadow-lg shadow-[#233274]/30'
                      : 'bg-white text-[#233274] border-[#233274] hover:bg-[#233274] hover:text-white hover:shadow-lg hover:shadow-[#233274]/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                </button>
              )}
              {favoriteError && <p className="text-sm text-red-600 text-center font-semibold mt-3">{favoriteError}</p>}
            </div>
          </div>
          {/* REVIEWS SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#ebe7df]">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-1 rounded-full bg-[#e15f0b]" />
                <h2 className="text-2xl font-black text-[#233274]">Reseñas de Clientes</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e15f0b]/30 to-transparent" />
              </div>
              <ReviewsSection projectId={project.id} />
            </div>
          </div>
        </div>
      </section>
      {/* LIGHTBOX MEJORADO */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center px-4 py-8"
          onClick={closeImage}
          role="button"
          tabIndex={0}
          aria-label="Cerrar imagen ampliada"
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeImage}
              className="absolute -top-8 right-0 text-white hover:text-[#fbbf24] transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-3xl overflow-hidden bg-[#0d0d0d] border-2 border-[#e15f0b]/40 shadow-2xl">
              <div className="relative bg-black">
                <img
                  src={lightboxImage.path}
                  alt={lightboxImage.caption || project.title}
                  className="w-full max-h-[75vh] object-contain"
                />
                {/* CONTROLES NAVEGACIÓN */}
                <button
                  type="button"
                  onClick={showPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#e15f0b]/80 hover:bg-[#e15f0b] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#e15f0b]/80 hover:bg-[#e15f0b] text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
                {/* INDICADOR DE PROGRESO */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white text-sm font-semibold">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              </div>
              {lightboxImage.caption && (
                <p className="text-base text-white/90 px-6 py-4 border-t-2 border-[#e15f0b]/30 font-light bg-gradient-to-r from-black to-black/80">
                  {lightboxImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TourDetailPage;
