// src/features/tours/components/SearchBar.jsx
import { MapPin, Search, Sparkles, Home } from 'lucide-react';

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const setLocation = (city) => {
    onFilterChange('city', city);
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-2 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">Ciudad</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="text"
                placeholder="Ciudad o distrito"
                value={filters.city}
                onChange={(e) => onFilterChange('city', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">Estado/Provincia</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="text"
                placeholder="Provincia"
                value={filters.state}
                onChange={(e) => onFilterChange('state', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">Tipo de proyecto</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="text"
                placeholder="Casa, departamento, condominio..."
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e15f0b]" />
          <span className="text-xs text-[#9a98a0]">Ciudades frecuentes:</span>
          {['Lima', 'Arequipa', 'Cusco', 'Trujillo'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setLocation(tag)}
              className="text-xs px-3 py-1 bg-[#f8f5ef] hover:bg-[#f8f5ef] text-[#d14a00] rounded-full transition-colors"
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
