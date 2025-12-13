// src/features/tours/components/PopularCountriesSection.jsx

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Star } from 'lucide-react';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    {
      name: 'Diseños y Proyectos Arquitectónicos',
      subtitle: 'Viviendas, multifamiliares, casas de campo e interiores 3D',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600',
      projectsCount: 45,
      rating: 4.9,
    },
    {
      name: 'Licencias y Trámites Municipales',
      subtitle: 'Gestión completa de licencias y documentos',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600',
      projectsCount: 60,
      rating: 4.8,
    },
    {
      name: 'Habilitaciones Urbanas y Regularizaciones',
      subtitle: 'Lotes, prescripción adquisitiva y visación de planos',
      image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600',
      projectsCount: 38,
      rating: 4.7,
    },
    {
      name: 'Topografía y Gestión de Terrenos',
      subtitle: 'Levantamientos topográficos y asesoría en terrenos',
      image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600',
      projectsCount: 25,
      rating: 4.8,
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
              Nuestros servicios principales
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#e15f0b]">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Explora nuestros servicios clave</span>
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

                {/* Nombre del servicio */}
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
                        {country.projectsCount} proyectos
                      </div>
                    </div>
                    <p className="text-sm text-[#233274]">{country.subtitle}</p>
                  </div>

                  {/* Boton de accion (aparece al hover) */}
                  <Link
                    to={`/services?search=${encodeURIComponent(country.name)}`}
                    className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold py-3 rounded-xl transition-all opacity-0 group-hover:opacity-100 text-center block"
                  >
                    Explorar servicios de este tipo
                  </Link>
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
