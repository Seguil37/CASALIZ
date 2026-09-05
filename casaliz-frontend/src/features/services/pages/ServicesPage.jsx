import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Briefcase } from 'lucide-react';
import { servicesApi, toPublicUrl } from '../../../shared/utils/api';
import { usePublicMotion } from '../../../shared/motion/publicMotionContext';

const SERVICES_PER_PAGE = 12;

const normalizeText = (value) =>
  (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const ServicesPage = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || location.state?.prefill || '');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [featuredOnly, setFeaturedOnly] = useState(
    searchParams.get('featured') === '1' || searchParams.get('featured') === 'true'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { scrollTo } = usePublicMotion();

  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      const resultsElement = document.getElementById('servicios-listado');
      if (resultsElement) {
        scrollTo(resultsElement);
      }
    }, 50);
  }, [scrollTo]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 100 });
        const data = response.data?.data ?? response.data ?? [];
        setServices(data);
      } catch (error) {
        console.error('Error fetching services', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fromQuery = searchParams.get('search') || '';
    setSearchTerm(fromQuery || location.state?.prefill || '');
    setAppliedSearchTerm(fromQuery);
    setCategoryFilter(searchParams.get('category') || '');
    const featuredFromUrl = searchParams.get('featured');
    setFeaturedOnly(featuredFromUrl === '1' || featuredFromUrl === 'true');
  }, [searchParams, location.state]);

  useEffect(() => {
    if (!loading && location.hash === '#servicios-listado') {
      scrollToResults();
    }
  }, [loading, location.hash, scrollToResults]);

  const applyFiltersToQuery = (nextSearchTerm, nextCategory, nextFeatured) => {
    const params = new URLSearchParams();
    if (nextSearchTerm) params.append('search', nextSearchTerm);
    if (nextCategory) params.append('category', nextCategory);
    if (nextFeatured) params.append('featured', '1');
    setAppliedSearchTerm(nextSearchTerm);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersToQuery(searchTerm, categoryFilter, featuredOnly);
    scrollToResults();
  };

  const handleFeaturedToggle = (checked) => {
    setFeaturedOnly(checked);
    applyFiltersToQuery(searchTerm, categoryFilter, checked);
    scrollToResults();
  };

  const showAllServices = () => {
    setSearchTerm('');
    setAppliedSearchTerm('');
    setCategoryFilter('');
    setFeaturedOnly(false);
    setSearchParams({});
    scrollToResults();
  };

  const isFeaturedService = (service) => {
    const value = service?.is_featured ?? service?.featured;
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return Boolean(value);
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchableText = normalizeText(
        `${service.title} ${service.short_description || ''} ${service.category || ''}`
      );
      const normalizedSearch = normalizeText(appliedSearchTerm);
      const normalizedCategory = normalizeText(categoryFilter);

      const matchesText = appliedSearchTerm
        ? searchableText.includes(normalizedSearch)
        : true;
      const matchesCategory = categoryFilter
        ? normalizeText(service.category || '').includes(normalizedCategory)
        : true;
      const matchesFeatured = featuredOnly ? isFeaturedService(service) : true;
      return matchesText && matchesCategory && matchesFeatured;
    });
  }, [services, appliedSearchTerm, categoryFilter, featuredOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchTerm, categoryFilter, featuredOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / SERVICES_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);
  }, [filteredServices, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToResults();
  };

  const serviceHighlights = [
    'Viviendas unifamiliares y multifamiliares',
    'Casas de campo',
    'Diseño de interiores con vistas en 3D',
    'Expediente de licencia de construccion',
    'Declaratoria de fabrica',
    'Independizaciones',
    'Habilitaciones urbanas',
    'Subdivision de lote',
    'Acumulacion de lote',
    'Prescripcion adquisitiva',
    'Visacion de planos',
    'Levantamientos topograficos',
    'Licencia de funcionamiento',
    'Compra-venta de terrenos',
    'Expedientes tecnicos',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5ef] min-h-screen pb-12" data-motion-page>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e2a63] via-[#243883] to-[#f59e0b] text-white py-16" data-motion-hero>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-16 -top-10 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5" data-motion-item>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 rounded-full text-sm font-semibold uppercase tracking-wide border border-white/25 transition-transform duration-500 hover:translate-x-1">
              <span className="h-2 w-2 rounded-full bg-[#fbbf24] transition-transform duration-500 hover:scale-125" />
              Servicios CASALIZ
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight transition-transform duration-500 hover:translate-x-1">
              Soluciones de diseño, construccion e inmobiliaria en un solo equipo.
            </h1>
            <p className="text-lg max-w-2xl text-white/90 transition-colors duration-500 hover:text-white">
              Conecta con el servicio que necesitas: licencias, diseño, obra y gestion comercial. Te acompanamos desde la
              idea hasta la entrega final.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#servicios-listado"
                className="px-5 py-3 rounded-xl bg-white text-[#233274] font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Ver catalogo
              </a>
              <button
                type="button"
                onClick={showAllServices}
                className="px-5 py-3 rounded-xl border border-white/35 bg-white/10 text-white font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
              >
                Mostrar todos
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15" data-motion-item>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-white/80 mb-4">
              <Briefcase className="w-5 h-5 transition-transform duration-500 hover:scale-110 hover:rotate-6" />
              Encuentra tu servicio
            </div>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Licencias, diseño, topografia..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  placeholder="Categoria o especialidad"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => handleFeaturedToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-white/60 bg-white/20 text-[#fbbf24] focus:ring-white/60"
                />
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Ver solo destacados</span>
              </label>
              <button
                type="submit"
                className="w-full bg-white text-[#233274] font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
              >
                Buscar servicios
              </button>
              <button
                type="button"
                onClick={showAllServices}
                className="w-full rounded-xl border border-white/25 bg-white/10 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
              >
                Mostrar todos los servicios
              </button>
              <div className="flex flex-wrap gap-2 text-xs text-white/80">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Sugerencias:</span>
                {[ 'Diseño, Construcción y Regularización Inmobiliaria', 'Servicios Inmobiliarios', 'Trámites y Regularización Inmobiliaria'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mt-8 relative z-10" data-motion-section>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#ebe7df] p-4 space-y-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(35,50,116,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#9a98a0]">Especialidades</p>
                <h2 className="text-lg font-bold text-[#233274]">Estos son los servicios que hacemos</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceHighlights.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 bg-[#fdfaf5] text-[#233274] rounded-full shadow-sm border border-[#e2dfd7] text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-[#ebe7df] p-4 space-y-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(225,95,11,0.10)]">
            <p className="text-xs font-semibold text-[#233274] uppercase tracking-wide">SOLUCIONES PROFESIONALES</p>
            <p className="text-base leading-8 text-[#4b4b4b]">
              Gestionamos licencias, diseño, obra y venta. Cada servicio incluye seguimiento y asesoria personalizada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#233274]">
              <span className="px-3 py-1.5 rounded-xl bg-[#fdf1df] border border-[#f3d7a6] font-semibold text-center transition-transform duration-300 hover:-translate-y-0.5">
                Arquitectura
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#e8f2ff] border border-[#c6dbff] font-semibold text-center transition-transform duration-300 hover:-translate-y-0.5">
                Construccion
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#eaf8ef] border border-[#c6e8d2] font-semibold text-center transition-transform duration-300 hover:-translate-y-0.5">
                Inmobiliaria
              </span>
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-[#9a98a0]">No hay servicios publicados.</p>
        ) : (
          <>
            <div id="servicios-listado" className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 scroll-mt-32">
              {paginatedServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group relative rounded-2xl shadow-lg overflow-hidden block h-full bg-gradient-to-br from-[#1b274f] via-[#1f2f63] to-[#0f193a] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(15,25,58,0.26)]"
                  data-motion-card
                >
                  <div className="p-4 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex bg-[#f8f5ef] text-[#233274] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border border-[#ebe7df]">
                        {service.category || 'Servicio'}
                      </span>
                      {isFeaturedService(service) && (
                        <span className="inline-flex items-center gap-1 bg-[#e15f0b] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-md">
                          <Sparkles className="w-4 h-4" />
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-[#f8f5ef] flex items-center justify-center">
                    <img
                      src={toPublicUrl(service.cover_image || service.gallery?.[0]?.path) || 'https://via.placeholder.com/400x240'}
                      alt={service.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm font-medium">Haz clic para ver el detalle</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#d8d1c6] bg-white px-5 py-2.5 font-semibold text-[#233274] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#233274] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-11 w-11 rounded-full border text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                      page === currentPage
                        ? 'border-[#e15f0b] bg-[#e15f0b] text-white shadow-md'
                        : 'border-[#d8d1c6] bg-white text-[#233274] hover:border-[#233274]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-[#d8d1c6] bg-white px-5 py-2.5 font-semibold text-[#233274] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#233274] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
