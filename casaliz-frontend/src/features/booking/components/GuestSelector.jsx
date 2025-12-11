// src/features/booking/components/GuestSelector.jsx

import { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

const GuestSelector = ({ 
  adults, 
  children, 
  infants, 
  minPeople, 
  maxPeople, 
  onAdultsChange, 
  onChildrenChange, 
  onInfantsChange 
}) => {
  const totalGuests = adults + children + infants;

  return (
    <div className="space-y-6">
      {/* Adultos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#e15f0b]" />
          <span className="font-medium text-[#233274]">Adultos</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
            disabled={adults <= 1}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#d14a00]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#233274]">{adults}</span>
          <button
            onClick={() => onAdultsChange(adults + 1)}
            disabled={adults >= maxPeople || totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#d14a00]" />
          </button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#e15f0b]" />
          <span className="font-medium text-[#233274]">Niños</span>
          <span className="text-xs text-[#9a98a0]">(2-11 años)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChildrenChange(Math.max(0, children - 1))}
            disabled={children <= 0}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#d14a00]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#233274]">{children}</span>
          <button
            onClick={() => onChildrenChange(children + 1)}
            disabled={totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#d14a00]" />
          </button>
        </div>
      </div>

      {/* Infantes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#e15f0b]" />
          <span className="font-medium text-[#233274]">Infantes</span>
          <span className="text-xs text-[#9a98a0]">(0-2 años)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInfantsChange(Math.max(0, infants - 1))}
            disabled={infants <= 0}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-[#d14a00]" />
          </button>
          <span className="w-8 text-center font-semibold text-[#233274]">{infants}</span>
          <button
            onClick={() => onInfantsChange(infants + 1)}
            disabled={totalGuests >= maxPeople}
            className="w-8 h-8 rounded-full bg-[#f8f5ef] hover:bg-[#f8f5ef] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-[#d14a00]" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 p-4 bg-[#f8f5ef] rounded-xl">
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#233274]">Total:</span>
          <span className="font-bold text-[#233274]">{totalGuests} personas</span>
        </div>
        <p className="text-sm text-[#d14a00] mt-1">
          Capacidad: {minPeople} - {maxPeople} personas
        </p>
      </div>
    </div>
  );
};

export default GuestSelector;