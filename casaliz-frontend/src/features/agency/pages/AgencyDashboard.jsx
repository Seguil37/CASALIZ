// src/features/agency/pages/AgencyDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Users, TrendingUp, Eye, Edit, Trash2, CheckCircle, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { projectsApi } from '../../../shared/utils/api';

const STATUS_CONFIG = {
  published: {
    label: 'Publicado',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: CheckCircle
  },
  draft: {
    label: 'Borrador',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: null
  },
  archived: {
    label: 'Archivado',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: Archive
  }
};

const AgencyDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total_projects: 0, featured: 0, total_reviews: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.list({ per_page: perPage, page: currentPage });
      const data = response.data;
      const items = data.data || data;
      
      setRecentProjects(items);
      setTotalPages(data.last_page || Math.ceil((data.total || items.length) / perPage));
      
      // Solo actualizar stats en la primera página
      if (currentPage === 1) {
        setStats({
          total_projects: data.total || items.length,
          featured: items.filter((p) => p.is_featured).length,
          total_reviews: items.reduce((sum, p) => sum + (p.reviews_count || 0), 0),
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setRecentProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    const projectToDelete = recentProjects.find((p) => p.id === projectId);
    if (!projectToDelete) return;
    if (!window.confirm('Estas seguro de eliminar este proyecto?')) return;

    try {
      await projectsApi.delete(projectId);
      setRecentProjects((prev) => prev.filter((p) => p.id !== projectId));
      setStats((prev) => ({
        ...prev,
        total_projects: Math.max(0, prev.total_projects - 1),
        featured: projectToDelete.is_featured ? Math.max(0, prev.featured - 1) : prev.featured,
        total_reviews: Math.max(0, prev.total_reviews - (projectToDelete.reviews_count || 0)),
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">Hola, {user?.name} 👋</h1>
            <p className="text-[#9a98a0]">Administra los proyectos del portafolio CASALIZ.</p>
          </div>
          <Link
            to="/agency/tours/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear proyecto
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Home} title="Proyectos publicados" value={stats.total_projects} />
          <StatCard icon={TrendingUp} title="Destacados" value={stats.featured} />
          <StatCard icon={Users} title="Comentarios" value={stats.total_reviews} />
        </div>

        <div className="bg-[#f8f5ef] rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#233274]">Todos los proyectos</h2>
            <Link to="/tours" className="text-primary hover:text-primary-dark font-semibold">
              Ver galería →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-[#9a98a0] mx-auto mb-4" />
              <p className="text-[#9a98a0] mb-4">Aún no has creado proyectos</p>
              <Link
                to="/agency/tours/create"
                className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Crear mi primer proyecto
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {recentProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} onDelete={handleDelete} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#ebe7df] pt-6">
                <div className="text-sm text-[#9a98a0]">
                  Página <span className="font-bold text-[#233274]">{currentPage}</span> de <span className="font-bold text-[#233274]">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[#ebe7df] hover:bg-[#f8f5ef] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#233274]" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-primary text-[#233274]'
                            : 'border border-[#ebe7df] text-[#9a98a0] hover:bg-[#f8f5ef]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[#ebe7df] hover:bg-[#f8f5ef] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#233274]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ebe7df] flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-[#f8f5ef] flex items-center justify-center">
      <Icon className="w-6 h-6 text-[#e15f0b]" />
    </div>
    <div>
      <p className="text-sm text-[#9a98a0]">{title}</p>
      <p className="text-2xl font-black text-[#233274]">{value}</p>
    </div>
  </div>
);

const ProjectRow = ({ project, onDelete }) => {
  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#ebe7df] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        <img
          src={project.hero_image || project.images?.[0]?.path || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511'}
          alt={project.title}
          className="w-16 h-16 object-cover rounded-xl"
        />
        <div>
          <h3 className="text-lg font-bold text-[#233274]">{project.title}</h3>
          <p className="text-sm text-[#9a98a0]">{project.city}{project.state ? `, ${project.state}` : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1 text-sm ${statusConfig.textColor} ${statusConfig.bgColor} px-2 py-1 rounded-full whitespace-nowrap`}>
          {StatusIcon && <StatusIcon className="w-4 h-4" />}
          {statusConfig.label}
        </span>
        {project.is_featured && (
          <span className="inline-flex items-center gap-1 text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
            <TrendingUp className="w-4 h-4" /> Destacado
          </span>
        )}
        <div className="flex items-center gap-2">
          <Link to={`/tours/${project.id}`} className="p-2 rounded-full hover:bg-[#f8f5ef]"><Eye className="w-4 h-4 text-[#233274]" /></Link>
          <Link to={`/agency/tours/${project.id}/edit`} className="p-2 rounded-full hover:bg-[#f8f5ef]"><Edit className="w-4 h-4 text-[#233274]" /></Link>
          <button
            type="button"
            onClick={() => onDelete?.(project.id)}
            className="p-2 rounded-full hover:bg-[#f8f5ef]"
          >
            <Trash2 className="w-4 h-4 text-[#d14a00]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;