// src/features/tours/components/FilterSidebar.jsx
import { Star, X, Filter } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isMobile = false, onClose }) => {
  const handleApply = () => {
    onApply();
    if (isMobile && onClose) onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 space-y-3 relative border border-[#e2dfd7] text-[#233274] text-sm">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#233274] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#e15f0b]" />
            Filtros
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f5ef] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#9a98a0]" />
          </button>
        </div>
      )}

      {!isMobile && (
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#233274] flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#e15f0b]" />
          Filtros
        </h3>
      )}

      <div className="space-y-1.5 bg-[#fdfaf5] border border-[#e2dfd7] rounded-xl p-2 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#233274]">
          <Star className="w-4 h-4 text-[#e15f0b]" />
          Solo destacados
        </div>
        <label className="flex items-center gap-2 text-sm text-[#233274]">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked ? 1 : '')}
            className="h-4 w-4 rounded border-[#9a98a0] text-[#e15f0b] focus:ring-[#e15f0b] focus:outline-none"
            style={{ accentColor: '#e15f0b' }}
          />
          Mostrar proyectos destacados
        </label>
      </div>

      <div className="flex gap-3 pt-2 border-t border-[#e2dfd7]">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-1.5 border-2 border-[#9a98a0] text-[#233274] font-semibold rounded-xl hover:bg-[#f8f5ef] transition-all text-sm"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-1.5 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] text-white font-semibold rounded-xl hover:from-[#f26b1d] hover:to-[#e15f0b] transition-all shadow-md text-sm"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
