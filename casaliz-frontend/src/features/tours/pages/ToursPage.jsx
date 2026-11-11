// src/features/tours/pages/ToursPage.jsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { StudioCatalogIntro } from "../../../shared/studio/StudioCatalog";
import { StudioClosing } from "../../../shared/studio/StudioElements";
import useStudioMotion from "../../../shared/studio/useStudioMotion";
import CatalogProjectCard from "../components/CatalogProjectCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import api from "../../../shared/utils/api";
import { usePublicMotion } from "../../../shared/motion/publicMotionContext";

const ToursPage = () => {
    const rootRef = useRef(null);
    useStudioMotion(rootRef);
    const [searchParams, setSearchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        lastPage: 1,
    });
    const { scrollTo } = usePublicMotion();
    const filterDialogRef = useRef(null);

    useEffect(() => {
        if (!showFilters) return undefined;
        const previousFocus = document.activeElement;
        const dialog = filterDialogRef.current;
        const focusables = () =>
            [
                ...dialog.querySelectorAll("button, input, select, a[href]"),
            ].filter((item) => !item.disabled && item.tabIndex >= 0);
        focusables()[0]?.focus();
        const handleKey = (event) => {
            if (event.key === "Escape") setShowFilters(false);
            if (event.key !== "Tab") return;
            const items = focusables();
            const first = items[0],
                last = items.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        dialog.addEventListener("keydown", handleKey);
        return () => {
            dialog.removeEventListener("keydown", handleKey);
            previousFocus?.focus();
        };
    }, [showFilters]);

    const defaultFilters = {
        search: searchParams.get("search") || "",
        city: searchParams.get("city") || "",
        type: searchParams.get("type") || "",
        featured: searchParams.get("featured") || "",
    };
    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        fetchProjects();
    }, [searchParams]);

    useEffect(() => {
        setFilters({
            search: searchParams.get("search") || "",
            city: searchParams.get("city") || "",
            type: searchParams.get("type") || "",
            featured: searchParams.get("featured") || "",
        });
    }, [searchParams]);

    const fetchProjects = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                search: searchParams.get("search") || undefined,
                city: searchParams.get("city") || undefined,
                type: searchParams.get("type") || undefined,
                featured: searchParams.get("featured") || undefined,
                page,
            };

            const response = await api.get("/projects", { params });
            const data = response.data;
            setProjects(data.data || data);
            setPagination({
                total:
                    data.total || (data.data ? data.data.length : data.length),
                currentPage: data.current_page || 1,
                lastPage: data.last_page || 1,
            });
        } catch (error) {
            console.error("Error al cargar proyectos", error);
            setProjects([]);
            setPagination({ total: 0, currentPage: 1, lastPage: 1 });
        } finally {
            setLoading(false);
        }
    };

    const buildParams = (currentFilters) => {
        const params = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return params;
    };

    const handleFilterChange = (filterName, value) => {
        const updatedFilters = { ...filters, [filterName]: value };
        setFilters(updatedFilters);
    };

    const scrollToResults = () => {
        setTimeout(() => {
            const resultsElement = document.getElementById("projects-results");
            if (resultsElement) {
                scrollTo(resultsElement);
            }
        }, 50);
    };

    const applyFilters = (customFilters = filters) => {
        setFilters(customFilters);
        const params = buildParams(customFilters);
        setSearchParams(params);
        scrollToResults();
    };

    const clearFilters = () => {
        const resetFilters = { search: "", city: "", type: "", featured: "" };
        setFilters(resetFilters);
        setSearchParams({});
    };

    const showAllProjects = () => {
        const resetFilters = { search: "", city: "", type: "", featured: "" };
        setFilters(resetFilters);
        setSearchParams({});
        scrollToResults();
    };

    const handlePageChange = (page) => {
        fetchProjects(page);
        scrollToResults();
    };

    return (
        <div className="cz-page cz-projects" ref={rootRef}>
            <StudioCatalogIntro
                total={pagination.total}
                loading={loading}
                onShowAll={showAllProjects}
            />

            <div className="border-b border-[#d6d2c9] bg-[#f7f6f2] lg:hidden">
                <div className="container-custom py-4">
                    <div className="flex flex-col gap-4">
                        <div className="min-w-0">
                            <SearchBar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onSearch={applyFilters}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom pt-4 pb-8">
                <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
                    <aside className="hidden lg:block lg:sticky lg:top-24">
                        <div className="space-y-4">
                            <SearchBar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onSearch={applyFilters}
                            />
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onApply={applyFilters}
                                onClear={clearFilters}
                            />
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div
                            id="projects-results"
                            className="mb-4 rounded-[28px] border border-[#e5ddd1] bg-white p-6 shadow-[0_18px_45px_rgba(77,58,31,0.07)] transition-all duration-500 hover:-translate-y-1 scroll-mt-32"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#d14a00]">
                                        Listado de proyectos
                                    </p>
                                    <h2 className="mt-2 mb-2 flex items-center gap-2 text-3xl font-black text-[#233274]">
                                        {filters.search && (
                                            <MapPin className="h-6 w-6 text-[#e15f0b]" />
                                        )}
                                        {filters.search ||
                                            "Todos los proyectos"}
                                    </h2>
                                    <p className="text-[#9a98a0]">
                                        {loading ? (
                                            "Cargando..."
                                        ) : (
                                            <span>
                                                <span className="font-semibold">
                                                    {pagination.total}
                                                </span>{" "}
                                                proyectos encontrados
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5ddd1] bg-[#f8f5ef] px-4 py-2 font-semibold text-[#233274] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white lg:hidden"
                                >
                                    Filtros
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-80 rounded-2xl bg-gray-200 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="rounded-[28px] border border-dashed border-[#d7ccbd] bg-white p-8 text-center shadow-sm">
                                <h3 className="mb-2 text-xl font-bold text-[#233274]">
                                    No encontramos proyectos
                                </h3>
                                <p className="mb-4 text-[#9a98a0]">
                                    Prueba ajustando los filtros o buscando otra
                                    ciudad.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="rounded-full bg-[#233274] px-4 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a255c]"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                    {projects.map((project) => (
                                        <div key={project.id} data-motion-card>
                                            <CatalogProjectCard tour={project} />
                                        </div>
                                    ))}
                                </div>

                                {pagination.lastPage > 1 && (
                                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.max(
                                                        1,
                                                        pagination.currentPage -
                                                            1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                pagination.currentPage === 1
                                            }
                                            className="rounded-full border border-[#d8d1c6] bg-white px-5 py-2.5 font-semibold text-[#233274] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#233274] disabled:cursor-not-allowed disabled:opacity-45"
                                        >
                                            Anterior
                                        </button>
                                        {Array.from(
                                            { length: pagination.lastPage },
                                            (_, index) => index + 1,
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                className={`h-11 w-11 rounded-full border text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                                                    page ===
                                                    pagination.currentPage
                                                        ? "border-[#e15f0b] bg-[#e15f0b] text-white shadow-md"
                                                        : "border-[#d8d1c6] bg-white text-[#233274] hover:border-[#233274]"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.min(
                                                        pagination.lastPage,
                                                        pagination.currentPage +
                                                            1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                pagination.currentPage ===
                                                pagination.lastPage
                                            }
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
            </div>

            <StudioClosing asset="interior" imageAlt="Interior residencial del repertorio visual de CasaLiz" caption="INTERIORISMO / ARCHIVO VISUAL CASALIZ" />
            {showFilters && (
                <div
                    ref={filterDialogRef}
                    className="fixed inset-0 z-[90] flex bg-black/50 lg:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filtros de proyectos"
                    data-lenis-prevent
                >
                    <div
                        className="w-80 overflow-y-auto bg-white p-4"
                        data-lenis-prevent
                    >
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onApply={(f) => {
                                applyFilters(f);
                                setShowFilters(false);
                            }}
                            onClear={() => {
                                clearFilters();
                                setShowFilters(false);
                            }}
                            isMobile
                            onClose={() => setShowFilters(false)}
                        />
                    </div>
                    <button
                        type="button"
                        aria-label="Cerrar filtros desde el fondo"
                        tabIndex={-1}
                        className="flex-1"
                        onClick={() => setShowFilters(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default ToursPage;
