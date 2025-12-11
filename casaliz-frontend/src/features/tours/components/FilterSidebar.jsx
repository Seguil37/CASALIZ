// src/features/tours/components/FilterSidebar.jsx
import { useEffect, useState } from 'react';
import { MapPin, Star, Home, X, Filter } from 'lucide-react';
import api from '../../../shared/utils/api';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isMobile = false, onClose }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await api.get('/settings/public');
      const projectTypes = response.data?.project_types || [];
      setTypes(projectTypes);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleApply = () => {
    onApply();
    if (isMobile && onClose) onClose();
  };

  return (
    <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-6 space-y-6 relative">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#233274] flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#e15f0b]" />
            Filtros
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f5ef] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#9a98a0]" />
          </button>
        </div>
      )}

      {!isMobile && <h3 className="text-xl font-bold text-[#233274]">Filtros</h3>}

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#233274] flex items-center gap-2">
          <Home className="w-4 h-4 text-[#e15f0b]" />
          Tipo de proyecto
        </label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full px-3 py-2 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all"
        >
          <option value="">Todos</option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#233274] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#e15f0b]" />
          Estado / Provincia
        </label>
        <input
          type="text"
          value={filters.state}
          onChange={(e) => onFilterChange('state', e.target.value)}
          placeholder="Lima, Cusco..."
          className="w-full px-3 py-2 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#233274] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#e15f0b]" />
          Ciudad
        </label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onFilterChange('city', e.target.value)}
          placeholder="Ciudad"
          className="w-full px-3 py-2 border-2 border-[#9a98a0] rounded-lg focus:border-[#e15f0b] focus:outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#233274] flex items-center gap-2">
          <Star className="w-4 h-4 text-[#e15f0b]" />
          Solo destacados
        </label>
        <label className="flex items-center gap-2 text-sm text-[#233274]">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked ? 1 : '')}
            className="text-[#e15f0b] focus:ring-[#e15f0b]"
          />
          Mostrar proyectos destacados
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onClear}
          className="flex-1 px-4 py-3 border-2 border-[#9a98a0] text-[#233274] font-semibold rounded-xl hover:bg-[#f8f5ef] transition-all"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-3 bg-[#233274] text-[#f8f5ef] font-semibold rounded-xl hover:bg-[#1a255c] transition-all"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
