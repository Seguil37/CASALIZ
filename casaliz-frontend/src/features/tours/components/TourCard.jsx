// src/features/tours/components/TourCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';

const TourCard = ({ tour }) => {
  const image = tour.hero_image || tour.featured_image || (tour.images?.[0]?.path ?? 'https://images.unsplash.com/photo-1505691938895-1758d7feb511');

  return (
    <Link
      to={`/projects/${tour.id}`}
      className="group bg-[#f8f5ef] rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-[#9a98a0]"
    >
      <div className="p-4 pb-0">
        {tour.is_featured && (
          <span className="inline-flex bg-[#e15f0b] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Destacado
          </span>
        )}
      </div>
        
      <div className="relative overflow-hidden bg-white aspect-[4/3]">
        <img
          src={image}
          alt={tour.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#9a98a0]">
          <MapPin className="w-4 h-4 text-[#e15f0b]" />
          <span>{tour.city ? `${tour.city}${tour.state ? ', ' + tour.state : ''}` : 'Ubicación por confirmar'}</span>
        </div>

        <h3 className="text-xl font-bold text-[#233274] leading-tight line-clamp-2">{tour.title}</h3>

        <div className="flex items-center gap-2 text-sm text-[#233274]">
          <Home className="w-4 h-4 text-[#e15f0b]" />
          <span>{tour.type || 'Proyecto residencial'}</span>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
