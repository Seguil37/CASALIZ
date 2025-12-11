// src/features/agency/pages/MyToursPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { projectsApi } from '../../../shared/utils/api';

const MyToursPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.list();
      const data = response.data?.data ?? response.data ?? [];
      setProjects(data);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await projectsApi.delete(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const filtered = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#233274] mb-2">Mis proyectos</h1>
            <p className="text-[#9a98a0]">Gestiona tus proyectos publicados</p>
          </div>
          <Link
            to="/agency/tours/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear proyecto
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
              placeholder="Buscar proyectos..."
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-[#f8f5ef] rounded-2xl shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#9a98a0]">No se encontraron proyectos</p>
            </div>
          ) : (
            <div className="divide-y divide-[#9a98a0]">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="p-6 hover:bg-[#f8f5ef] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={project.hero_image || project.featuredImages?.[0]?.path || 'https://via.placeholder.com/100'}
                      alt={project.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-[#233274] text-lg mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#9a98a0]">
                        <span>{project.city}{project.state ? `, ${project.state}` : ''}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status === 'published' ? 'Publicado' : project.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </span>
                        {project.is_featured && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tours/${project.id}`}
                        className="p-2 hover:bg-[#f8f5ef] rounded-lg transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-5 h-5 text-[#9a98a0]" />
                      </Link>
                      <Link
                        to={`/agency/tours/${project.id}/edit`}
                        className="p-2 hover:bg-[#f8f5ef] rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5 text-[#9a98a0]" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
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
