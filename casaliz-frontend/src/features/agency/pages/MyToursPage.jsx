// src/features/agency/pages/MyToursPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { projectsApi } from '../../../shared/utils/api';

const MyToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await projectsApi.list({ per_page: 50 });
      const data = response.data.data || response.data || [];
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!confirm('¿Estás seguro de eliminar este tour?')) return;

    try {
      await projectsApi.delete(tourId);
      setTours(tours.filter((t) => t.id !== tourId));
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    }
  };

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">
              Mis Tours
            </h1>
            <p className="text-[#9a98a0]">
              Gestiona tus experiencias publicadas
            </p>
          </div>
          <Link
            to="/admin/projects/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear Tour
          </Link>
        </div>

        {/* Search */}
        <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-[#9a98a0] rounded-xl focus:border-primary focus:outline-none"
              placeholder="Buscar tours..."
            />
          </div>
        </div>

        {/* Tours List */}
        <div className="bg-[#f8f5ef] rounded-2xl shadow-lg overflow-hidden">
          {filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#9a98a0]">No se encontraron tours</p>
            </div>
          ) : (
            <div className="divide-y divide-[#9a98a0]">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="p-6 hover:bg-[#f8f5ef] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tour.featured_image || 'https://via.placeholder.com/100'}
                      alt={tour.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-[#233274] text-lg mb-2">
                        {tour.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#9a98a0]">
                        <span>S/. {tour.price}</span>
                        <span>·</span>
                        <span>{tour.total_bookings || 0} reservas</span>
                        <span>·</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tour.is_published
                            ? 'bg-[#f8f5ef] text-[#233274]'
                            : 'bg-[#f8f5ef] text-[#233274]'
                        }`}>
                          {tour.is_published ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/${tour.slug || tour.id}`}
                        className="p-2 hover:bg-[#f8f5ef] rounded-lg transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-5 h-5 text-[#9a98a0]" />
                      </Link>
                      <Link
                        to={`/admin/projects/${tour.id}/edit`}
                        className="p-2 hover:bg-[#f8f5ef] rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5 text-[#9a98a0]" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="p-2 hover:bg-[#f8f5ef] rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5 text-[#d14a00]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyToursPage;