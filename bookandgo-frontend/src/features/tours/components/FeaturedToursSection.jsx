import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTACIÓN AÑADIDA
import { Sparkles, Star, MapPin, Clock, Users, Heart } from 'lucide-react';
import TourCard from './TourCard';
import api from '../../../shared/utils/api';

const FeaturedToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await api.get('/tours/featured');
        setTours(response.data.slice(0, 8)); // Mostrar solo 8 proyectos destacados
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Rebranding BookandGo → CASALIZ Arquitectos Ingenieros
  // Data de ejemplo por si falla el backend
  const exampleTours = [
    {
      id: 1,
      title: 'Vivienda unifamiliar moderna',
      category: { name: 'Residencial' },
      featured_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      duration_days: 4,
      duration_hours: 0,
      rating: 4.9,
      total_reviews: 32,
      price: 12000,
      discount_price: null,
      location_city: 'Cusco',
    },
    {
      id: 2,
      title: 'Edificio multifamiliar en Wanchaq',
      category: { name: 'Multifamiliar' },
      featured_image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800',
      duration_days: 6,
      duration_hours: 0,
      rating: 4.8,
      total_reviews: 28,
      price: 45000,
      discount_price: 42000,
      location_city: 'Cusco',
    },
    {
      id: 3,
      title: 'Centro comercial en desarrollo',
      category: { name: 'Comercial' },
      featured_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      duration_days: 3,
      duration_hours: 0,
      rating: 4.7,
      total_reviews: 41,
      price: 38000,
      discount_price: 35000,
      location_city: 'Arequipa',
    },
    {
      id: 4,
      title: 'Regularización Ley 30830',
      category: { name: 'Regularización' },
      featured_image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      duration_days: 2,
      duration_hours: 0,
      rating: 4.6,
      total_reviews: 22,
      price: 8500,
      discount_price: 8000,
      location_city: 'Lima',
    },
    {
      id: 5,
      title: 'Ampliación y remodelación de vivienda',
      category: { name: 'Remodelación' },
      featured_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      duration_days: 1,
      duration_hours: 0,
      rating: 4.8,
      total_reviews: 54,
      price: 9500,
      discount_price: 9000,
      location_city: 'Cusco',
    },
    {
      id: 6,
      title: 'Licencia de obra en distrito metropolitano',
      category: { name: 'Licencias' },
      featured_image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?w=800',
      duration_days: 2,
      duration_hours: 0,
      rating: 4.7,
      total_reviews: 38,
      price: 6800,
      discount_price: 6400,
      location_city: 'Lima',
    },
    {
      id: 7,
      title: 'Edificio corporativo en Miraflores',
      category: { name: 'Corporativo' },
      featured_image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=800',
      duration_days: 5,
      duration_hours: 0,
      rating: 4.9,
      total_reviews: 33,
      price: 52000,
      discount_price: null,
      location_city: 'Lima',
    },
    {
      id: 8,
      title: 'Complejo turístico convertido en ecohotel',
      category: { name: 'Hospitality' },
      featured_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      duration_days: 4,
      duration_hours: 0,
      rating: 4.5,
      total_reviews: 29,
      price: 28000,
      discount_price: 25000,
      location_city: 'Sacred Valley',
    },
  ];

  const displayTours = tours.length > 0 ? tours : exampleTours;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando proyectos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              Proyectos destacados
            </h2>
          </div>
          <Link
            to="/tours"
            className="hidden md:flex items-center gap-2 text-primary hover:text-secondary font-semibold"
          >
            Ver todas
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

        {/* Grid de tours - 4 cards por fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        {/* Ver más - visible solo en móvil */}
        <div className="text-center mt-12 md:hidden">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default FeaturedToursSection;