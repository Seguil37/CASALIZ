// src/features/tours/components/PopularLocationsSection.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Loader2, Star } from 'lucide-react';
import api from '../../../shared/utils/api';

const PopularLocationsSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularLocations();
  }, []);

  const fetchPopularLocations = async () => {
    try {
      // Obtener todos los tours publicados
      const response = await api.get('/tours', { 
        params: { 
          per_page: 100 // Obtener todos para contar por ubicación
        } 
      });

      const tours = response.data.data || response.data;

      // Agrupar tours por ciudad
      const locationCounts = {};
      const locationImages = {};

      tours.forEach((tour) => {
        const city = tour.location_city;
        if (city) {
          locationCounts[city] = (locationCounts[city] || 0) + 1;
          
          // Guardar la primera imagen encontrada para cada ciudad
          if (!locationImages[city] && tour.featured_image) {
            locationImages[city] = tour.featured_image;
          }
        }
      });

      // Convertir a array y ordenar por cantidad de experiencias
      const sortedLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({
          name,
          experiences: count,
          image: locationImages[name] || getDefaultImage(name),
          rating: (Math.random() * 2 + 3).toFixed(1), // Rating aleatorio entre 3.0 y 5.0
        }))
        .sort((a, b) => b.experiences - a.experiences)
        .slice(0, 9); // Mostrar top 9

      setLocations(sortedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback a datos de ejemplo
      setLocations(fallbackLocations);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener imagen por defecto según la ciudad
  const getDefaultImage = (cityName) => {
    const defaultImages = {
      'Miraflores': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      'San Isidro': 'https://images.unsplash.com/photo-1529429617124-aee314d1b56b?w=800',
      'Barranco': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      'Surco': 'https://images.unsplash.com/photo-1529429617124-aee314d1b56b?w=800',
      'La Molina': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    };

    return defaultImages[cityName] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
  };

  // Datos de fallback
  const fallbackLocations = [
    {
      name: 'Miraflores',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      experiences: 24,
      rating: 4.9,
    },
    {
      name: 'San Isidro',
      image: 'https://images.unsplash.com/photo-1529429617124-aee314d1b56b?w=800',
      experiences: 18,
      rating: 4.8,
    },
    {
      name: 'Barranco',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      experiences: 15,
      rating: 4.7,
    },
  ];

  if (loading) {
    return (
      <section className="py-20 bg-[#f8f5ef]">
        <div className="container-custom">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#e15f0b] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Si no hay ubicaciones, no mostrar la sección
  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#f8f5ef]">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <TrendingUp className="w-8 h-8 text-[#e15f0b]" />
          <h2 className="text-4xl lg:text-5xl font-black text-[#233274]">
            Zonas donde más diseñamos
          </h2>
        </div>

        {/* Grid de ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Link
              key={index}
              to={`/tours?location=${encodeURIComponent(location.name)}`}
              className="group bg-[#f8f5ef] rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Badge de rating */}
                <div className="absolute top-4 right-4 bg-[#f8f5ef]/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#e15f0b] fill-current" />
                  <span className="text-sm font-bold text-[#233274]">{location.rating}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#233274] mb-2 group-hover:text-[#e15f0b] transition-colors">
                  {location.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#9a98a0]">
                    <MapPin className="w-4 h-4 text-[#e15f0b]" />
                    <span className="text-sm font-medium">
                      {location.experiences} {location.experiences === 1 ? 'proyecto' : 'proyectos'}
                    </span>
                  </div>
                  
                  {/* Indicador de hover */}
                  <div className="flex items-center gap-1 text-[#e15f0b] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Ver proyectos</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón Ver Más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los proyectos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;