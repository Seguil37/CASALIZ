// src/features/tours/components/PopularCountriesSection.jsx

import { useEffect, useRef } from 'react';
import { Globe, Star } from 'lucide-react';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    {
      name: 'Vivienda unifamiliar',
      image: 'https://images.unsplash.com/photo-1505693415763-3ed5e04ba4cd?w=600',
      tours: 45,
      rating: 4.9,
    },
    {
      name: 'Departamentos y multifamiliares',
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
      tours: 32,
      rating: 4.8,
    },
    {
      name: 'Oficinas y espacios corporativos',
      image: 'https://images.unsplash.com/photo-1529429617124-aee314d1b56b?w=600',
      tours: 28,
      rating: 4.7,
    },
    {
      name: 'Locales comerciales',
      image: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=600',
      tours: 19,
      rating: 4.6,
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
    <section className="py-20 bg-[#f8f5ef] overflow-hidden">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#e15f0b]" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#233274]">
              Tipos de proyectos más solicitados
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#e15f0b]">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Explora proyectos de este tipo</span>
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
                    <h3 className="text-[#f8f5ef] font-bold text-2xl">{country.name}</h3>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#f8f5ef]/90 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-[#e15f0b] fill-current" />
                        <span className="font-bold text-[#233274]">{country.rating}</span>
                      </div>
                      <div className="text-sm text-[#9a98a0]">
                        {country.tours} proyectos
                      </div>
                    </div>
                  </div>

                  {/* Botón de acción (aparece al hover) */}
                  <button className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold py-3 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    Explorar proyectos de este tipo
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
              className="w-2 h-2 rounded-full bg-[#9a98a0] animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCountriesSection;