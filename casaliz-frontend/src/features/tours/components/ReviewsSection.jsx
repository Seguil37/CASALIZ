// src/features/tours/components/ReviewsSection.jsx
import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { reviewsApi } from '../../../shared/utils/api';
import { ROLES } from '../../../shared/constants/roles';

const RatingStars = ({ value = 0 }) => (
  <div className="flex items-center gap-1 text-[#e15f0b]">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={star <= value ? 'fill-[#e15f0b]' : 'text-[#9a98a0]'}
      />
    ))}
  </div>
);

const ReviewsSection = ({ projectId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const isClient = user?.role === ROLES.CLIENT;
  const myReview = useMemo(
    () => reviews.find((review) => review.user_id === user?.id),
    [reviews, user?.id]
  );

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewsApi.listByProject(projectId);
        setReviews(response.data.data || response.data || []);
      } catch {
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isClient) {
      setError('Debes iniciar sesión como cliente para dejar una reseña.');
      return;
    }

    if (!form.comment.trim()) {
      setError('Escribe un comentario antes de enviar.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        project_id: projectId,
        rating: form.rating,
        comment: form.comment.trim(),
      };
      const response = await reviewsApi.createOrUpdate(payload);
      const savedReview = response.data;

      setReviews((current) => {
        const existingIndex = current.findIndex((review) => review.id === savedReview.id);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = savedReview;
          return updated;
        }
        return [savedReview, ...current];
      });

      setForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar tu reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebe7df] space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-[#e15f0b]" />
        <div>
          <h3 className="text-xl font-bold text-[#233274]">Reseñas</h3>
          <p className="text-sm text-[#9a98a0]">Comparte tu experiencia con este proyecto.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-[#9a98a0]">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-[#233274]">Sé el primero en dejar un comentario.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl bg-[#f8f5ef] border border-[#ebe7df]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#233274]">{review.user?.name || 'Cliente'}</p>
                  <p className="text-xs text-[#9a98a0]">{review.user?.email}</p>
                </div>
                {review.rating && <RatingStars value={review.rating} />}
              </div>
              <p className="text-[#4b4b4b] leading-relaxed">{review.comment}</p>
              {review.user_id === user?.id && (
                <span className="inline-block mt-2 text-xs font-semibold text-[#e15f0b]">Tu reseña</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#ebe7df] pt-4">
        <h4 className="text-lg font-bold text-[#233274] mb-2">Escribe una reseña</h4>
        {!isClient && (
          <p className="text-sm text-[#9a98a0] mb-3">Solo los clientes pueden dejar reseñas.</p>
        )}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-[#233274]">Calificación</label>
            <select
              value={form.rating}
              onChange={(e) => setForm((state) => ({ ...state, rating: Number(e.target.value) }))}
              className="border border-[#9a98a0] rounded-lg px-3 py-2 text-sm"
              disabled={!isClient}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{`${value} estrellas`}</option>
              ))}
            </select>
          </div>

          <textarea
            value={form.comment}
            onChange={(e) => setForm((state) => ({ ...state, comment: e.target.value }))}
            placeholder={isClient ? 'Cuéntanos qué te pareció este proyecto' : 'Inicia sesión como cliente para comentar'}
            className="w-full min-h-[100px] border border-[#9a98a0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e15f0b]"
            disabled={!isClient || submitting}
          />

          <button
            type="submit"
            disabled={!isClient || submitting}
            className="bg-gradient-to-r from-[#e15f0b] to-[#d14a00] disabled:opacity-60 text-[#f8f5ef] font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {submitting ? 'Guardando...' : myReview ? 'Actualizar reseña' : 'Publicar reseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
