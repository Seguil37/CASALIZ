// src/features/tours/pages/ToursPage.jsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Filter } from 'lucide-react';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import api from '../../../shared/utils/api';

const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
  });

  // Estados de filtros
  const defaultFilters = {
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    category: searchParams.get('category_id') || '',
    rating: searchParams.get('min_rating') || '',
    duration: searchParams.get('duration') || '',
    difficulty: searchParams.get('difficulty') || '',
    sortBy: searchParams.get('sort_by') || 'created_at',
  };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetchTours();
  }, [searchParams]);

  const fetchTours = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get('search'),
        location: searchParams.get('location'),
        min_price: searchParams.get('min_price'),
        max_price: searchParams.get('max_price'),
        category_id: searchParams.get('category_id'),
        min_rating: searchParams.get('min_rating'),
        duration: searchParams.get('duration'),
        difficulty: searchParams.get('difficulty'),
        sort_by: searchParams.get('sort_by'),
        per_page: 12,
        page,
      };

      // Filtrar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await api.get('/tours', { params });

      // Manejar respuesta paginada o array simple
      if (response.data.data) {
        setTours(response.data.data);
        setPagination({
          total: response.data.total || 0,
          currentPage: response.data.current_page || 1,
          lastPage: response.data.last_page || 1,
          perPage: response.data.per_page || 12,
        });
      } else {
        setTours(response.data);
        setPagination({
          total: response.data.length,
          currentPage: 1,
          lastPage: 1,
          perPage: 12,
        });
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      setPagination({
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const buildParams = (currentFilters) => {
    const params = new URLSearchParams();

    const apiMapping = {
      search: 'search',
      location: 'location',
      minPrice: 'min_price',
      maxPrice: 'max_price',
      category: 'category_id',
      rating: 'min_rating',
      duration: 'duration',
      difficulty: 'difficulty',
      sortBy: 'sort_by',
    };

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        const apiKey = apiMapping[key] || key;
        params.append(apiKey, value);
      }
    });

    return params;
  };

  const handleFilterChange = (filterName, value) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
  };

  const applyFilters = (customFilters = filters) => {
    setFilters(customFilters);
    const params = buildParams(customFilters);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const removeFilter = (key) => {
    const updated = { ...filters, [key]: key === 'sortBy' ? 'created_at' : '' };
    applyFilters(updated);
  };

  const clearPriceRange = () => {
    const updated = { ...filters, minPrice: '', maxPrice: '' };
    applyFilters(updated);
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.lastPage) {
      fetchTours(pagination.currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      {/* Barra de búsqueda superior */}
      <div className="bg-[#f8f5ef] border-b sticky top-20 z-40 shadow-sm">
        <div className="container-custom py-4">
          <SearchBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={applyFilters}
          />
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={applyFilters}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Header con resultados y botón de filtros móvil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-[#233274] mb-2 flex items-center gap-2">
                  {filters.location && <MapPin className="w-6 h-6 text-[#e15f0b]" />}
                  {filters.location || 'Todas las atracciones'}
                </h1>
                <p className="text-[#9a98a0]">
                  {loading ? 'Cargando...' : (
                    <span>
                      <span className="font-semibold">{pagination.total}</span> experiencias encontradas
                    </span>
                  )}
                </p>
              </div>

              {/* Botón filtros móvil */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] text-[#f8f5ef] px-4 py-2 rounded-lg hover:from-[#f26b1d] hover:to-[#e15f0b] transition-all shadow-md"
              >
                <Filter className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Filtros activos */}
            {Object.values(filters).some(v => v && v !== 'created_at') && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-[#f8f5ef] rounded-lg border border-[#e15f0b]">
                <span className="text-sm font-semibold text-[#233274]">Filtros activos:</span>
                {filters.search && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    Búsqueda: {filters.search}
                    <button
                      onClick={() => removeFilter('search')}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    Ubicación: {filters.location}
                    <button
                      onClick={() => removeFilter('location')}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    S/. {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                    <button
                      onClick={clearPriceRange}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    Categoría
                    <button
                      onClick={() => removeFilter('category')}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    Rating: {filters.rating}⭐+
                    <button
                      onClick={() => removeFilter('rating')}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.duration && (
                  <span className="px-3 py-1 bg-[#f8f5ef] text-[#d14a00] rounded-full text-sm flex items-center gap-2 border border-[#e15f0b]">
                    Duración
                    <button
                      onClick={() => removeFilter('duration')}
                      className="hover:text-[#d14a00] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#d14a00] hover:text-[#d14a00] font-semibold"
                >
                  Limpiar todos
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#f8f5ef] rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-[#f8f5ef]"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-[#f8f5ef] rounded w-1/3"></div>
                      <div className="h-6 bg-[#f8f5ef] rounded"></div>
                      <div className="h-4 bg-[#f8f5ef] rounded w-1/2"></div>
                      <div className="h-8 bg-[#f8f5ef] rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length > 0 ? (
              <>
                {/* Grid de Tours */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Paginación */}
                {pagination.lastPage > 1 && (
                  <div className="text-center mt-12">
                    {pagination.currentPage < pagination.lastPage ? (
                      <button
                        onClick={handleLoadMore}
                        className="bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                      >
                        Ver más ({pagination.total - tours.length} restantes)
                      </button>
                    ) : (
                      <p className="text-[#9a98a0]">
                        Mostrando todos los resultados ({pagination.total} tours)
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-[#9a98a0] mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-[#233274] mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-[#9a98a0] mb-6">
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#e15f0b] to-[#d14a00] text-[#f8f5ef] font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar de Filtros - Móvil */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#f8f5ef] shadow-2xl overflow-y-auto animate-slide-in">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={applyFilters}
              onClear={clearFilters}
              isMobile={true}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursPage;
