// src/features/tours/components/PopularCountriesSection.jsx

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Star } from 'lucide-react';

const PopularCountriesSection = () => {
  const scrollRef = useRef(null);

  const countries = [
    {
      name: 'Viviendas unifamiliares y multifamiliares',
      subtitle: 'Diseño y proyectos residenciales de calidad',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      projectsCount: 45,
      rating: 4.9,
    },
    {
      name: 'Casas de campo',
      subtitle: 'Proyectos arquitectónicos rurales y de descanso',
      image: 'https://images.unsplash.com/photo-1570129477492-45e003008e0c?w=600',
      projectsCount: 28,
      rating: 4.8,
    },
    {
      name: 'Diseño de interiores con vistas en 3D',
      subtitle: 'Visualización y planificación de espacios interiores',
      image: 'https://images.unsplash.com/photo-1565182999555-5174ed846f4d?w=600',
      projectsCount: 32,
      rating: 4.9,
    },
    {
      name: 'Expediente de licencia de construcción',
      subtitle: 'Tramitación completa de permisos municipales',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      projectsCount: 60,
      rating: 4.8,
    },
    {
      name: 'Declaratoria de fábrica',
      subtitle: 'Legalización de construcciones existentes',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
      projectsCount: 22,
      rating: 4.7,
    },
    {
      name: 'Independizaciones',
      subtitle: 'Segregación y documentación de propiedades',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      projectsCount: 35,
      rating: 4.8,
    },
    {
      name: 'Habilitaciones urbanas',
      subtitle: 'Proyectos de urbanización y desarrollo territorial',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
      projectsCount: 18,
      rating: 4.7,
    },
    {
      name: 'Subdivisión de lote',
      subtitle: 'Parcelación y división de terrenos',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600',
      projectsCount: 25,
      rating: 4.8,
    },
    {
      name: 'Acumulación de lote',
      subtitle: 'Unificación de terrenos para nuevos proyectos',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
      projectsCount: 16,
      rating: 4.7,
    },
    {
      name: 'Prescripción adquisitiva',
      subtitle: 'Gestión de derechos de propiedad por posesión',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      projectsCount: 14,
      rating: 4.8,
    },
    {
      name: 'Visación de planos',
      subtitle: 'Revisión técnica y aprobación de documentos',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      projectsCount: 40,
      rating: 4.9,
    },
    {
      name: 'Levantamientos topográficos',
      subtitle: 'Mediciones y mapeos de terrenos precisos',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
      projectsCount: 38,
      rating: 4.8,
    },
    {
      name: 'Licencia de funcionamiento',
      subtitle: 'Permisos para operación de establecimientos',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      projectsCount: 45,
      rating: 4.7,
    },
    {
      name: 'Compra-venta de terrenos',
      subtitle: 'Asesoría en transacciones inmobiliarias',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
      projectsCount: 52,
      rating: 4.9,
    },
    {
      name: 'Expedientes técnicos',
      subtitle: 'Documentación completa para proyectos constructivos',
      image: 'https://images.unsplash.com/photo-1554224311-beee415c15c9?w=600',
      projectsCount: 48,
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
                    <p className="text-sm text-[#233274] font-semibold">{country.subtitle}</p>
              
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
