// src/features/tours/pages/ToursPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import api from '../../../shared/utils/api';

const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, currentPage: 1, lastPage: 1 });

  const defaultFilters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    featured: searchParams.get('featured') || '',
  };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetchProjects();
  }, [searchParams]);

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get('search') || undefined,
        city: searchParams.get('city') || undefined,
        type: searchParams.get('type') || undefined,
        featured: searchParams.get('featured') || undefined,
        page,
      };

      const response = await api.get('/projects', { params });
      const data = response.data;
      setProjects(data.data || data);
      setPagination({
        total: data.total || (data.data ? data.data.length : data.length),
        currentPage: data.current_page || 1,
        lastPage: data.last_page || 1,
      });
    } catch (error) {
      console.error('Error al cargar proyectos', error);
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

  const applyFilters = (customFilters = filters) => {
    setFilters(customFilters);
    const params = buildParams(customFilters);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <div className="bg-[#f8f5ef] border-b sticky top-20 z-40 shadow-sm">
        <div className="container-custom py-4">
          <SearchBar filters={filters} onFilterChange={handleFilterChange} onSearch={applyFilters} />
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
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

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-[#233274] mb-2 flex items-center gap-2">
                  {filters.search && <MapPin className="w-6 h-6 text-[#e15f0b]" />}
                  {filters.search || 'Todos los proyectos'}
                </h1>
                <p className="text-[#9a98a0]">
                  {loading ? 'Cargando...' : (
                    <span>
                      <span className="font-semibold">{pagination.total}</span> proyectos encontrados
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-[#233274]"
              >
                Filtros
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-[#233274] mb-2">No encontramos proyectos</h3>
                <p className="text-[#9a98a0] mb-4">Prueba ajustando los filtros o buscando otra ciudad.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#233274] text-white rounded-full hover:bg-[#1a255c]"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <TourCard key={project.id} tour={project} />
                  ))}
                </div>

                {pagination.currentPage < pagination.lastPage && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => fetchProjects(pagination.currentPage + 1)}
                      className="px-6 py-3 bg-[#233274] text-white rounded-full hover:bg-[#1a255c]"
                    >
                      Cargar más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex">
          <div className="bg-white w-80 p-4 overflow-y-auto">
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
          <div className="flex-1" onClick={() => setShowFilters(false)} />
        </div>
      )}
    </div>
  );
};

export default ToursPage;
