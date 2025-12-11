// src/features/agency/pages/AgencyDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Users, TrendingUp, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { projectsApi } from '../../../shared/utils/api';

const AgencyDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total_projects: 0, featured: 0, total_reviews: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await projectsApi.list({ per_page: 5 });
      const data = response.data;
      const items = data.data || data;
      setRecentProjects(items);
      setStats({
        total_projects: data.total || items.length,
        featured: items.filter((p) => p.is_featured).length,
        total_reviews: items.reduce((sum, p) => sum + (p.reviews_count || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setRecentProjects([]);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">Hola, {user?.name} 👋</h1>
            <p className="text-[#9a98a0]">Administra los proyectos del portafolio CASALIZ.</p>
          </div>
          <Link
            to="/admin/projects/create"
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
            <h2 className="text-2xl font-black text-[#233274]">Proyectos recientes</h2>
            <Link to="/projects" className="text-primary hover:text-primary-dark font-semibold">
              Ver todos →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-[#9a98a0] mx-auto mb-4" />
              <p className="text-[#9a98a0] mb-4">Aún no has creado proyectos</p>
              <Link
                to="/admin/projects/create"
                className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Crear mi primer proyecto
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
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

const ProjectRow = ({ project }) => (
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
      {project.status === 'published' ? (
        <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
          <CheckCircle className="w-4 h-4" /> Publicado
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-[#9a98a0] bg-[#f8f5ef] px-2 py-1 rounded-full">
          Borrador
        </span>
      )}
      <div className="flex items-center gap-2">
        <Link to={`/projects/${project.id}`} className="p-2 rounded-full hover:bg-[#f8f5ef]"><Eye className="w-4 h-4 text-[#233274]" /></Link>
        <Link to={`/admin/projects/${project.id}/edit`} className="p-2 rounded-full hover:bg-[#f8f5ef]"><Edit className="w-4 h-4 text-[#233274]" /></Link>
        <button type="button" className="p-2 rounded-full hover:bg-[#f8f5ef]">
          <Trash2 className="w-4 h-4 text-[#d14a00]" />
        </button>
      </div>
    </div>
  </div>
);

export default AgencyDashboard;
