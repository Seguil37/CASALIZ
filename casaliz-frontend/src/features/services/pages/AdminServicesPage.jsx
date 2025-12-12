import { useEffect, useState } from 'react';
import { servicesApi } from '../../../shared/utils/api';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Borrador',
  archived: 'Archivado',
};

const emptyForm = {
  title: '',
  category: 'Diseño, Construcción e Inmobiliaria',
  short_description: '',
  description: '',
  status: 'draft',
  featured: false,
  cover_image: '',
};

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.list({ per_page: 200, status: 'all' });
      const data = response.data?.data ?? response.data ?? [];
      setServices(data);
    } catch (error) {
      console.error('Error al cargar servicios', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await servicesApi.update(editing.id, form);
      } else {
        await servicesApi.create(form);
      }
      setForm(emptyForm);
      setEditing(null);
      loadServices();
    } catch (error) {
      console.error('Error guardando servicio', error);
      alert('No se pudo guardar el servicio');
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title || '',
      category: service.category || emptyForm.category,
      short_description: service.short_description || '',
      description: service.description || '',
      status: service.status || 'draft',
      featured: Boolean(service.featured),
      cover_image: service.cover_image || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error eliminando servicio', error);
    }
  };

  const filtered = services.filter((service) =>
    service.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-[#233274]">Servicios</h1>
            <span className="text-sm text-[#9a98a0]">{filtered.length} servicios</span>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 mb-4 flex items-center gap-3">
            <Search className="text-[#9a98a0]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título"
              className="w-full outline-none"
            />
          </div>

          <div className="space-y-4">
            {filtered.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
                <img
                  src={service.cover_image || 'https://via.placeholder.com/120x90'}
                  alt={service.title}
                  className="w-24 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="text-xs uppercase text-[#9a98a0]">{service.category}</p>
                  <h3 className="text-lg font-bold text-[#233274]">{service.title}</h3>
                  <p className="text-sm text-[#666] line-clamp-2">{service.short_description}</p>
                  <div className="mt-2 text-xs text-[#555]">{STATUS_LABELS[service.status] || service.status}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg bg-[#f0f0f5] hover:bg-[#e5e5ee]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg bg-[#ffe7e0] text-[#d14a00] hover:bg-[#ffd5c7]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-[#233274]">
              {editing ? 'Editar servicio' : 'Crear servicio'}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-[#555]">Título</label>
              <input
                required
                className="w-full border rounded-lg p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-[#555]">Categoría</label>
              <input
                className="w-full border rounded-lg p-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-[#555]">Resumen</label>
              <textarea
                required
                className="w-full border rounded-lg p-2"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-[#555]">Descripción</label>
              <textarea
                required
                rows={4}
                className="w-full border rounded-lg p-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-[#555]">Imagen principal (URL)</label>
              <input
                required
                className="w-full border rounded-lg p-2"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[#555]">Estado</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#555] mt-6">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Destacado
              </label>
            </div>

            <div className="flex gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyForm);
                  }}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancelar
                </button>
              )}
              <button type="submit" className="flex-1 bg-gradient-primary text-[#233274] font-bold py-2 rounded-lg">
                {editing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
