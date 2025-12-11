// src/features/tours/components/SearchBar.jsx

import { MapPin, Calendar, Search, Sparkles } from 'lucide-react';

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-2 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* ¿A dónde vas? */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">
              ¿A dónde vas?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="text"
                placeholder="Destino o atracción"
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Check In */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">
              Check In
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => onFilterChange('checkIn', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#233274] mb-1.5">
              Check Out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e15f0b] w-4 h-4" />
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => onFilterChange('checkOut', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Botón Buscar */}
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
        
        {/* Búsquedas populares */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e15f0b]" />
          <span className="text-xs text-[#9a98a0]">Popular:</span>
          {['Cusco', 'Lima', 'Machu Picchu', 'Valle Sagrado'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onFilterChange('location', tag)}
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