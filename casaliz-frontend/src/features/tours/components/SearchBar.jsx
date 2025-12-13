// src/features/tours/components/SearchBar.jsx
import { useEffect, useState } from 'react';
import { Search, Sparkles, Home } from 'lucide-react';

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [cityFilter, setCityFilter] = useState(filters.city || '');
  const [typeInput, setTypeInput] = useState(filters.type || '');

  useEffect(() => {
    setSearchInput(filters.search || '');
    setCityFilter(filters.city || '');
    setTypeInput(filters.type || '');
  }, [filters.city, filters.search, filters.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cityValue = cityFilter || searchInput;
    const nextFilters = {
      ...filters,
      search: searchInput,
      city: cityValue,
      type: typeInput,
    };
    onFilterChange('search', searchInput);
    onFilterChange('city', cityValue);
    onFilterChange('type', typeInput);
    onSearch(nextFilters);
  };

  const setLocation = (city) => {
    setCityFilter(city);
    setSearchInput(city);
    const nextFilters = {
      ...filters,
      search: city,
      city,
      type: typeInput,
    };
    onFilterChange('search', city);
    onFilterChange('city', city);
    onSearch(nextFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-4 md:p-6">
        <div className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2 text-[#233274]">
          <Home className="w-4 h-4 text-[#e15f0b]" />
          Encuentra tu proyecto
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
            <input
              type="text"
              placeholder="Busca por ciudad o proyecto"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCityFilter('');
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#9a98a0] text-[#233274] placeholder-[#9a98a0] focus:outline-none focus:border-[#e15f0b] transition-all"
            />
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
            <input
              type="text"
              placeholder="Tipo de proyecto"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#9a98a0] text-[#233274] placeholder-[#9a98a0] focus:outline-none focus:border-[#e15f0b] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] text-white font-bold py-3 rounded-xl hover:from-[#f26b1d] hover:to-[#e15f0b] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar proyectos
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[#233274]">
          <Sparkles className="w-4 h-4 text-[#e15f0b]" />
          <span className="text-xs text-[#9a98a0]">Ciudades frecuentes:</span>
          {['Lima', 'Arequipa', 'Cusco', 'Trujillo'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setLocation(tag)}
              className="text-xs px-3 py-1 bg-white border border-[#e2dfd7] hover:bg-[#fdfaf5] text-[#d14a00] rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
