import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { StudioServiceCatalog } from "../../../shared/studio/StudioCatalog";
import { servicesApi } from "../../../shared/utils/api";
import { usePublicMotion } from "../../../shared/motion/publicMotionContext";

const SERVICES_PER_PAGE = 12;

const normalizeText = (value) =>
    (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const ServicesPage = () => {
    const location = useLocation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || location.state?.prefill || "",
    );
    const [appliedSearchTerm, setAppliedSearchTerm] = useState(
        searchParams.get("search") || "",
    );
    const [categoryFilter, setCategoryFilter] = useState(
        searchParams.get("category") || "",
    );
    const [featuredOnly, setFeaturedOnly] = useState(
        searchParams.get("featured") === "1" ||
            searchParams.get("featured") === "true",
    );
    const [currentPage, setCurrentPage] = useState(1);
    const { scrollTo } = usePublicMotion();

    const scrollToResults = useCallback(() => {
        setTimeout(() => {
            const resultsElement = document.getElementById("servicios-listado");
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
                console.error("Error fetching services", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const fromQuery = searchParams.get("search") || "";
        setSearchTerm(fromQuery || location.state?.prefill || "");
        setAppliedSearchTerm(fromQuery);
        setCategoryFilter(searchParams.get("category") || "");
        const featuredFromUrl = searchParams.get("featured");
        setFeaturedOnly(featuredFromUrl === "1" || featuredFromUrl === "true");
    }, [searchParams, location.state]);

    useEffect(() => {
        if (!loading && location.hash === "#servicios-listado") {
            scrollToResults();
        }
    }, [loading, location.hash, scrollToResults]);

    const applyFiltersToQuery = (
        nextSearchTerm,
        nextCategory,
        nextFeatured,
    ) => {
        const params = new URLSearchParams();
        if (nextSearchTerm) params.append("search", nextSearchTerm);
        if (nextCategory) params.append("category", nextCategory);
        if (nextFeatured) params.append("featured", "1");
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
        setSearchTerm("");
        setAppliedSearchTerm("");
        setCategoryFilter("");
        setFeaturedOnly(false);
        setSearchParams({});
        scrollToResults();
    };

    const isFeaturedService = (service) => {
        const value = service?.is_featured ?? service?.featured;
        if (typeof value === "string")
            return value === "1" || value.toLowerCase() === "true";
        if (typeof value === "number") return value === 1;
        return Boolean(value);
    };

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const searchableText = normalizeText(
                `${service.title} ${service.short_description || ""} ${service.category || ""}`,
            );
            const normalizedSearch = normalizeText(appliedSearchTerm);
            const normalizedCategory = normalizeText(categoryFilter);

            const matchesText = appliedSearchTerm
                ? searchableText.includes(normalizedSearch)
                : true;
            const matchesCategory = categoryFilter
                ? normalizeText(service.category || "").includes(
                      normalizedCategory,
                  )
                : true;
            const matchesFeatured = featuredOnly
                ? isFeaturedService(service)
                : true;
            return matchesText && matchesCategory && matchesFeatured;
        });
    }, [services, appliedSearchTerm, categoryFilter, featuredOnly]);

    useEffect(() => {
        setCurrentPage(1);
    }, [appliedSearchTerm, categoryFilter, featuredOnly]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredServices.length / SERVICES_PER_PAGE),
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
        return filteredServices.slice(
            startIndex,
            startIndex + SERVICES_PER_PAGE,
        );
    }, [filteredServices, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        scrollToResults();
    };

    const serviceHighlights = [
        "Viviendas unifamiliares y multifamiliares",
        "Casas de campo",
        "Diseño de interiores con vistas en 3D",
        "Expediente de licencia de construccion",
        "Declaratoria de fabrica",
        "Independizaciones",
        "Habilitaciones urbanas",
        "Subdivision de lote",
        "Acumulacion de lote",
        "Prescripcion adquisitiva",
        "Visacion de planos",
        "Levantamientos topograficos",
        "Licencia de funcionamiento",
        "Compra-venta de terrenos",
        "Expedientes tecnicos",
    ];

    return (
        <StudioServiceCatalog
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            featuredOnly={featuredOnly}
            handleFeaturedToggle={handleFeaturedToggle}
            handleSearch={handleSearch}
            showAllServices={showAllServices}
            services={paginatedServices}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            serviceHighlights={serviceHighlights}
            resultCount={filteredServices.length}
        />
    );
};

export default ServicesPage;
