// src/features/booking/pages/BookingPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Info,
  Star,
  Shield
} from 'lucide-react';
import api from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import DateSelector from '../components/DateSelector';
import GuestSelector from '../components/GuestSelector';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    date: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
  });

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/tours/${id}`);
      setTour(response.data);
    } catch (error) {
      console.error('Error fetching tour:', error);
      setError('Error al cargar el tour');
    } finally {
      setLoading(false);
    }
  };

  const totalGuests = bookingData.adults + bookingData.children;
  
  const calculatePrice = () => {
    if (!tour) return 0;
    const basePrice = parseFloat(tour.discount_price || tour.price);
    // Adultos: precio completo, Niños: 50%, Infantes: gratis
    const total = (basePrice * bookingData.adults) + (basePrice * 0.5 * bookingData.children);
    return total;
  };

  const handleCreateBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }

    if (!bookingData.date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    if (totalGuests < tour.min_people) {
      setError(`Mínimo ${tour.min_people} personas requeridas`);
      return;
    }

    if (totalGuests > tour.max_people) {
      setError(`Máximo ${tour.max_people} personas permitidas`);
      return;
    }

    const bookingPayload = {
      tour_id: tour.id,
      booking_date: bookingData.date,
      booking_time: null,
      adults: bookingData.adults,
      children: bookingData.children,
      infants: bookingData.infants,
      special_requests: bookingData.specialRequests,
      total_price: calculatePrice(),
      payment_method: 'manual',
    };

    setSubmitting(true);

    try {
      await api.post('/bookings', bookingPayload);

      navigate('/booking/success', {
        state: {
          totalPaid: bookingPayload.total_price,
          bookingsCount: 1,
          paymentMethod: 'manual',
        },
        replace: true,
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'No pudimos completar tu reserva. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e15f0b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9a98a0] font-medium">Cargando detalles del tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] flex items-center justify-center">
        <div className="text-center bg-[#f8f5ef] rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-[#f8f5ef] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#d14a00]" />
          </div>
          <h2 className="text-2xl font-bold text-[#233274] mb-4">
            {error || 'Tour no encontrado'}
          </h2>
          <button
            onClick={() => navigate('/tours')}
            className="bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Ver todos los tours
          </button>
        </div>
      </div>
    );
  }

  const basePrice = parseFloat(tour.discount_price || tour.price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] py-8">
      <div className="container-custom max-w-6xl">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/tours/${id}`)}
          className="flex items-center gap-2 text-[#9a98a0] hover:text-[#d14a00] mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al tour
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-8 animate-fade-in">
              <h1 className="text-3xl font-black text-[#233274] mb-6 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#e15f0b]" />
                Reserva tu Experiencia
              </h1>

              {/* Error */}
              {error && (
                <div className="bg-[#f8f5ef] border-l-4 border-[#d14a00] p-4 rounded-lg mb-6 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#d14a00] flex-shrink-0 mt-0.5" />
                    <p className="text-[#d14a00] text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Selector de Fecha */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-[#233274] mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#e15f0b]" />
                  Selecciona la fecha
                </label>
                <DateSelector
                  value={bookingData.date}
                  onChange={(date) => {
                    setBookingData({ ...bookingData, date });
                    setError(null); // Limpiar error al seleccionar fecha
                  }}
                  minDate={new Date()}
                />
              </div>

              {/* Selector de Huéspedes */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-[#233274] mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#e15f0b]" />
                  Número de personas
                </label>
                <GuestSelector
                  adults={bookingData.adults}
                  children={bookingData.children}
                  infants={bookingData.infants}
                  minPeople={tour.min_people}
                  maxPeople={tour.max_people}
                  onAdultsChange={(adults) => {
                    setBookingData({ ...bookingData, adults });
                    setError(null);
                  }}
                  onChildrenChange={(children) => {
                    setBookingData({ ...bookingData, children });
                    setError(null);
                  }}
                  onInfantsChange={(infants) => {
                    setBookingData({ ...bookingData, infants });
                    setError(null);
                  }}
                />
                <p className="text-sm text-[#9a98a0] mt-2">
                  Capacidad: {tour.min_people} - {tour.max_people} personas
                </p>
              </div>

              {/* Solicitudes Especiales */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-[#233274] mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-[#e15f0b]" />
                  Solicitudes Especiales (Opcional)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-[#e15f0b] focus:outline-none resize-none transition-all"
                  placeholder="Ej: Restricciones dietéticas, necesidades de accesibilidad, celebración especial..."
                />
              </div>

              {/* Información del Tour */}
              <div className="bg-gradient-to-br from-[#f8f5ef] to-[#e15f0b] rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-[#233274] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#e15f0b]" />
                  Información del Tour
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#233274]">
                    <Clock className="w-5 h-5 text-[#e15f0b]" />
                    <span>
                      Duración: 
                      {tour.duration_days > 0 && ` ${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}`}
                      {tour.duration_days > 0 && tour.duration_hours > 0 && ' y '}
                      {tour.duration_hours > 0 && ` ${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[#233274]">
                    <MapPin className="w-5 h-5 text-[#e15f0b]" />
                    <span>{tour.location_city}, {tour.location_region}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[#233274]">
                    <Users className="w-5 h-5 text-[#e15f0b]" />
                    <span>
                      Dificultad: {
                        tour.difficulty_level === 'easy' ? 'Fácil' : 
                        tour.difficulty_level === 'moderate' ? 'Moderado' : 
                        'Difícil'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 sticky top-24 animate-slide-up">
              {/* Imagen del Tour */}
              <div className="relative mb-6 rounded-xl overflow-hidden">
                <img
                  src={tour.featured_image || 'https://via.placeholder.com/400x300'}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#e15f0b] text-[#233274] px-3 py-1 rounded-full text-sm font-bold">
                  {tour.rating ? parseFloat(tour.rating).toFixed(1) : 'N/A'}
                </div>
              </div>

              <h3 className="font-bold text-[#233274] text-lg mb-4">
                {tour.title}
              </h3>

              {/* Desglose de Precios */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#9a98a0]">
                {bookingData.adults > 0 && (
                  <div className="flex justify-between text-[#233274] text-sm">
                    <span>
                      S/. {basePrice.toFixed(2)} x {bookingData.adults} adulto{bookingData.adults > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold text-[#233274]">
                      S/. {(basePrice * bookingData.adults).toFixed(2)}
                    </span>
                  </div>
                )}
                
                {bookingData.children > 0 && (
                  <div className="flex justify-between text-[#233274] text-sm">
                    <span>
                      S/. {(basePrice * 0.5).toFixed(2)} x {bookingData.children} niño{bookingData.children > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold text-[#233274]">
                      S/. {(basePrice * 0.5 * bookingData.children).toFixed(2)}
                    </span>
                  </div>
                )}

                {bookingData.infants > 0 && (
                  <div className="flex justify-between text-[#233274] text-sm">
                    <span>{bookingData.infants} infante{bookingData.infants > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-[#233274]">Gratis</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-black text-[#233274]">Total</span>
                <span className="text-3xl font-black text-[#e15f0b]">
                  S/. {calculatePrice().toFixed(2)}
                </span>
              </div>

              {/* Botón de reserva */}
              <button
                onClick={handleCreateBooking}
                disabled={!bookingData.date || submitting}
                className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#233274] font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Procesando reserva...' : 'Reservar ahora'}
              </button>

              <div className="mt-6 bg-[#f8f5ef] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#d14a00]" />
                  <span className="text-sm font-semibold text-[#d14a00]">
                    Cancelación gratuita
                  </span>
                </div>
                <p className="text-xs text-[#d14a00]">
                  Hasta {tour.cancellation_hours} horas antes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;