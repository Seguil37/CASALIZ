import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTACIÓN AÑADIDA
import { Sparkles } from 'lucide-react';
import TourCard from './TourCard';
import api from '../../../shared/utils/api';

const FeaturedToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await api.get('/tours/featured');
        setTours(response.data.slice(0, 8)); // Mostrar solo 8 tours
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Data de ejemplo por si falla el backend
  const exampleTours = [
    {
      id: 1,
      title: 'Casa Miraflores 03',
      category: { name: 'Residencial' },
      featured_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      surface_area: '145 m²',
      status: 'Construido',
      year: '2023',
      rating: 4.9,
      total_reviews: 32,
      price: 320000,
      discount_price: 295000,
      location_city: 'Miraflores, Lima',
    },
    {
      id: 2,
      title: 'Oficinas Torre Central',
      category: { name: 'Oficinas' },
      featured_image: 'https://images.unsplash.com/photo-1529429617124-aee314d1b56b?w=800',
      surface_area: '2,400 m²',
      status: 'En construcción',
      year: '2025',
      rating: 4.8,
      total_reviews: 21,
      price: 1450000,
      discount_price: 1375000,
      location_city: 'San Isidro, Lima',
    },
    {
      id: 3,
      title: 'Loft Barranco',
      category: { name: 'Interiorismo' },
      featured_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      surface_area: '98 m²',
      status: 'Construido',
      year: '2022',
      rating: 4.7,
      total_reviews: 18,
      price: 185000,
      discount_price: 172000,
      location_city: 'Barranco, Lima',
    },
    {
      id: 4,
      title: 'Centro Comercial Aurora',
      category: { name: 'Comercial' },
      featured_image: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800',
      surface_area: '6,800 m²',
      status: 'En diseño',
      year: '2026',
      rating: 4.6,
      total_reviews: 12,
      price: 2250000,
      discount_price: null,
      location_city: 'Surco, Lima',
    },
    {
      id: 5,
      title: 'Casa de playa Asia Norte',
      category: { name: 'Residencial' },
      featured_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      surface_area: '320 m²',
      status: 'En construcción',
      year: '2024',
      rating: 4.8,
      total_reviews: 27,
      price: 480000,
      discount_price: 455000,
      location_city: 'Asia, Cañete',
    },
    {
      id: 6,
      title: 'Clínica Santa Elena',
      category: { name: 'Salud' },
      featured_image: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800',
      surface_area: '4,200 m²',
      status: 'En diseño',
      year: '2025',
      rating: 4.7,
      total_reviews: 19,
      price: 1675000,
      discount_price: 1580000,
      location_city: 'La Molina, Lima',
    },
    {
      id: 7,
      title: 'Coworking Prado',
      category: { name: 'Oficinas' },
      featured_image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=800',
      surface_area: '1,150 m²',
      status: 'Construido',
      year: '2021',
      rating: 4.9,
      total_reviews: 44,
      price: 620000,
      discount_price: null,
      location_city: 'San Borja, Lima',
    },
    {
      id: 8,
      title: 'Hotel Boutique Andes',
      category: { name: 'Hospitality' },
      featured_image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?w=800',
      surface_area: '3,100 m²',
      status: 'En construcción',
      year: '2024',
      rating: 4.5,
      total_reviews: 25,
      price: 1380000,
      discount_price: 1295000,
      location_city: 'Cusco',
    },
  ];

  const displayTours = tours.length > 0 ? tours : exampleTours;

  if (loading) {
    return (
      <section className="py-20 bg-[#f8f5ef]">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e15f0b] border-t-transparent"></div>
            <p className="mt-4 text-[#9a98a0]">Cargando proyectos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#f8f5ef]">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#e15f0b]" />
            <h2 className="text-4xl lg:text-5xl font-black text-[#233274]">
              Proyectos destacados
            </h2>
          </div>
          <Link
            to="/tours"
            className="hidden md:flex items-center gap-2 text-[#e15f0b] hover:text-[#d14a00] font-semibold"
          >
            Ver todos
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

export default FeaturedToursSection;
