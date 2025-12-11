// src/features/tours/components/TourCard.jsx

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Users, Heart } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useFavoriteStore from '../../../store/favoriteStore';

const TourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const messageTimerRef = useRef(null);
  const { isAuthenticated, user } = useAuthStore();
  const { favorites, fetchFavorites, toggleFavorite } = useFavoriteStore();

  useEffect(() => {
    if (isAuthenticated && favorites.length === 0) {
      fetchFavorites();
    }
  }, [fetchFavorites, favorites.length, isAuthenticated]);

  useEffect(() => {
    setIsFavorite(favorites.includes(tour.id));
  }, [favorites, tour.id]);

  useEffect(() => {
    if (!favoriteMessage) return undefined;

    const timer = setTimeout(() => setFavoriteMessage(''), 3000);
    messageTimerRef.current = timer;

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, [favoriteMessage]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || user?.role !== 'customer') {
      setFavoriteMessage('Debes iniciar sesión como cliente para usar favoritos.');
      return;
    }

    try {
      const response = await toggleFavorite(tour.id);
      const nowFavorite = response?.is_favorite ?? !isFavorite;
      setFavoriteMessage(
        nowFavorite ? 'Tour guardado en favoritos.' : 'Tour eliminado de favoritos.'
      );
    } catch (error) {
      if (error.message === 'AUTH_REQUIRED') {
        setFavoriteMessage('Inicia sesión para guardar tus favoritos.');
      }
    }
  };

  return (
    <Link
      to={`/tours/${tour.id}`}
      className="group bg-[#f8f5ef] rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-[#9a98a0]"
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.featured_image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* Badge de categoría */}
        <div className="absolute top-4 left-4 bg-[#e15f0b] text-[#233274] px-3 py-1 rounded-full text-xs font-bold">
          {tour.category?.name || 'Aventura'}
        </div>

        {/* Botón de favoritos */}
        <button
          className="absolute top-4 right-4 bg-[#f8f5ef]/90 backdrop-blur-sm p-2 rounded-full hover:bg-[#f8f5ef] transition-colors cursor-pointer"
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'text-[#d14a00] fill-current' : 'text-[#9a98a0]'}`}
          />
        </button>

        {favoriteMessage && (
          <div className="absolute top-14 right-4 bg-[#f8f5ef]/95 text-[#1a2555] text-xs px-3 py-2 rounded-lg shadow-lg border border-[#9a98a0] max-w-[220px]">
            {favoriteMessage}
          </div>
        )}

        {/* Badge de descuento */}
        {tour.discount_price && (
          <div className="absolute bottom-4 left-4 bg-[#f8f5ef]0 text-[#f8f5ef] px-3 py-1 rounded-full text-xs font-bold">
            -{Math.round((1 - tour.discount_price / tour.price) * 100)}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Ubicación */}
        <div className="flex items-center gap-1 text-[#9a98a0] text-sm mb-2">
          <MapPin className="w-4 h-4 text-[#e15f0b]" />
          <span>{tour.location_city || 'Perú'}</span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-[#233274] mb-3 line-clamp-2 group-hover:text-[#e15f0b] transition-colors">
          {tour.title}
        </h3>

        {/* Características */}
        <div className="flex items-center gap-4 text-[#9a98a0] text-sm mb-4">
          {tour.duration_days > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration_days} {tour.duration_days === 1 ? 'día' : 'días'}</span>
            </div>
          )}
          {tour.duration_hours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration_hours} {tour.duration_hours === 1 ? 'hora' : 'horas'}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Grupos</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(tour.rating || 0) ? 'text-[#e15f0b] fill-current' : 'text-[#9a98a0]'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-[#233274]">{tour.rating || 0}</span>
          <span className="text-sm text-[#9a98a0]">({tour.total_reviews || 0})</span>
        </div>

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#233274]">
                S/. {tour.discount_price || tour.price}
              </span>
              {tour.discount_price && (
                <span className="text-sm text-[#9a98a0] line-through">
                  S/. {tour.price}
                </span>
              )}
            </div>
            <span className="text-xs text-[#9a98a0]">por persona</span>
          </div>
          <button className="bg-[#e15f0b] hover:bg-[#d14a00] text-[#233274] font-bold py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer">
            Ver más
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
