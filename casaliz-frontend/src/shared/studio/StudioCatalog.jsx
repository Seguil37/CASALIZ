import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Briefcase, Search, Sparkles } from "lucide-react";
import { StudioHero, StudioLabel, StudioClosing } from "./StudioElements";
import useStudioMotion from "./useStudioMotion";
import "./StudioCatalog.css";
import CatalogServiceCard from "../../features/tours/components/CatalogServiceCard";

export function StudioCatalogIntro({ total, loading, onShowAll }) {
    return (
        <div className="cz-project-cover">
            <StudioHero
                eyebrow="PORTAFOLIO / PROYECTOS"
                lines={["IDEAS QUE", "ENCUENTRAN", "SU LUGAR."]}
                description="Viviendas, interiores y propuestas arquitectónicas. Explora nuestro portafolio por ciudad, especialidad o proyecto destacado."
                asset="urban"
                imageAlt="Render de edificio residencial del archivo visual de CasaLiz"
                target="projects-results"
                browseLabel="Ver categorías"
                contactLabel="Ver contacto"
            />
            <div className="cz-wrap cz-catalog-intro-foot">
                <span>
                    {loading
                        ? "Cargando proyectos…"
                        : `${total} proyectos publicados`}
                </span>
                <button type="button" onClick={onShowAll}>
                    Mostrar todos
                    <ArrowUpRight size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export function StudioPagination({ current, total, onChange }) {
    if (total <= 1) return null;
    return (
        <nav className="cz-pagination" aria-label="Paginación de servicios">
            <button
                type="button"
                disabled={current === 1}
                onClick={() => onChange(Math.max(1, current - 1))}
            >
                Anterior
            </button>
            {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    type="button"
                    aria-label={`Página ${page}`}
                    aria-current={page === current ? "page" : undefined}
                    onClick={() => onChange(page)}
                >
                    {page}
                </button>
            ))}
            <button
                type="button"
                disabled={current === total}
                onClick={() => onChange(Math.min(total, current + 1))}
            >
                Siguiente
            </button>
        </nav>
    );
}

export function StudioServiceCatalog({
    loading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    featuredOnly,
    handleFeaturedToggle,
    handleSearch,
    showAllServices,
    services,
    currentPage,
    totalPages,
    handlePageChange,
    serviceHighlights,
    resultCount,
}) {
    const rootRef = useRef(null);
    useStudioMotion(rootRef);
    return (
        <div className="cz-page cz-services" ref={rootRef}>
            <StudioHero
                eyebrow="ESPECIALIDADES / SERVICIOS"
                lines={["IMAGINA.", "PROYECTA.", "CONSTRUYE."]}
                description="Diseño, construcción y gestión inmobiliaria. Encuentra la especialidad que tu proyecto necesita para dar el siguiente paso."
                asset="building"
                imageAlt="Render de edificio y estructura del repertorio CasaLiz"
                target="servicios-listado"
                browseLabel="Ver servicios"
            >
                <div className="cz-original-service-heading">
                    <Briefcase size={19} aria-hidden="true" />
                    Encuentra tu servicio
                </div>
                <form onSubmit={handleSearch} className="cz-original-service-form space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  id="service-search"
                  aria-label="Servicio o trámite"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Licencias, diseño, topografia..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  id="service-category"
                  aria-label="Categoría o especialidad"
                  type="text"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  placeholder="Categoria o especialidad"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/70 transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <label className="cz-checkbox flex items-center gap-2 text-sm font-semibold text-white/80">
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
                <p className="cz-service-note">
                    Gestión integral: licencias, diseño, obra y venta, con
                    seguimiento y asesoría personalizada.
                </p>
            </StudioHero>
            <section
                className="cz-wrap cz-section cz-service-results"
                aria-labelledby="service-results-title"
                aria-busy={loading}
            >
                <div className="cz-results-heading">
                    <div>
                        <StudioLabel number="01">
                            NUESTRAS ESPECIALIDADES
                        </StudioLabel>
                        <h2 id="service-results-title">
                            Tu idea. <em>Nuestro oficio.</em>
                        </h2>
                        <p role="status">
                            {loading
                                ? "Cargando servicios…"
                                : `${resultCount} servicios encontrados`}
                        </p>
                    </div>
                    <button
                        className="cz-link"
                        type="button"
                        onClick={showAllServices}
                    >
                        Mostrar todos
                        <ArrowUpRight size={17} />
                    </button>
                </div>
                <div id="servicios-listado" className="cz-service-cards-target">
                {loading ? (
                    <div className="cz-service-grid">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div className="cz-skeleton" key={i} />
                        ))}
                    </div>
                ) : resultCount === 0 ? (
                    <div className="cz-empty">
                        <h3>No hay servicios con esos filtros.</h3>
                        <p>
                            Prueba otra categoría o consulta el catálogo
                            completo.
                        </p>
                        <button
                            className="cz-button"
                            type="button"
                            onClick={showAllServices}
                        >
                            Mostrar todos los servicios
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cz-service-grid">
                            {services.map((service) => (
                                <CatalogServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                        <StudioPagination
                            current={currentPage}
                            total={totalPages}
                            onChange={handlePageChange}
                        />
                    </>
                )}
                </div>
            </section>
            <section className="cz-service-specialties cz-wrap">
                <StudioLabel number="↗">DISEÑO / TÉCNICA / GESTIÓN</StudioLabel>
                <div>
                    {serviceHighlights.map((title) => (
                        <span key={title}>{title}</span>
                    ))}
                </div>
                <div className="cz-actions">
                    <Link className="cz-button" to="/contacto">
                        Ver contacto
                        <ArrowUpRight size={17} />
                    </Link>
                    <Link className="cz-link" to="/projects">
                        Ver categorías
                        <ArrowUpRight size={17} />
                    </Link>
                </div>
            </section>
            <StudioClosing />
        </div>
    );
}
