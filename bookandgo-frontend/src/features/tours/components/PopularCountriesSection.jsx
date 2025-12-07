// src/features/tours/components/PopularCountriesSection.jsx
// Rebranding BookandGo → CASALIZ Arquitectos Ingenieros

import { useEffect, useRef } from 'react';
import { Building2, Star } from 'lucide-react';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    {
      name: 'Diseño arquitectónico',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      tours: 120,
      rating: 4.9,
    },
    {
      name: 'Expedientes técnicos',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      tours: 210,
      rating: 4.8,
    },
    {
      name: 'Licencias de edificación',
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800',
      tours: 165,
      rating: 4.7,
    },
    {
      name: 'Regularización de construcciones',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      tours: 140,
      rating: 4.8,
    },
    {
      name: 'Remodelaciones y ampliaciones',
      image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      tours: 95,
      rating: 4.6,
    },
    {
      name: 'Supervisión de obra',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      tours: 180,
      rating: 4.7,
    },
  ];

  // Duplicar el array para crear un loop infinito
  const duplicatedCountries = [...countries, ...countries, ...countries];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.2; // Velocidad del scroll automático (reducida)

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      scrollContainer.scrollLeft = scrollPosition;

      // Reset cuando llegue al final del primer set
      if (scrollPosition >= scrollContainer.scrollWidth / 3) {
        scrollPosition = 0;
      }

      requestAnimationFrame(autoScroll);
    };

    const animationFrame = requestAnimationFrame(autoScroll);

    // Pausar scroll al hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrame);
    };

    const handleMouseLeave = () => {
      requestAnimationFrame(autoScroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              Servicios y especialidades
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-primary">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Conoce cómo impulsamos tus proyectos</span>
          </div>
        </div>

        {/* Carrusel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedCountries.map((country, index) => (
            <div
              key={`${country.name}-${index}`}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Imagen */}
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                {/* Nombre del país */}
                <div className="absolute top-6 left-6">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                    <h3 className="text-white font-bold text-2xl">{country.name}</h3>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{country.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {country.tours} proyectos gestionados
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de acción (aparece al hover) */}
                  <button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-3 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    Explorar servicio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de scroll */}
        <div className="flex justify-center gap-2 mt-8">
          {countries.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCountriesSection;