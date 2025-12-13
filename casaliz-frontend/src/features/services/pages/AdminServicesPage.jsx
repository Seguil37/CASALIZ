import { useEffect, useState } from 'react';
import { servicesApi } from '../../../shared/utils/api';
import { Plus, Pencil, Trash2, Search, ImagePlus } from 'lucide-react';

const STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Borrador',
  archived: 'Archivado',
};

const emptyImage = { path: '', caption: '' };

const emptyForm = {
  title: '',
  category: 'Diseño, Construccion e Inmobiliaria',
  short_description: '',
  description: '',
  status: 'published',
  featured: false,
  cover_image: '',
  images: [emptyImage],
};

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Ensure default status is published on initial load
    setForm(emptyForm);
  }, []);

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
    setSubmitError('');
    setSubmitting(true);

    const imagesPayload = (form.images || [])
      .filter((image) => image.path.trim())
      .map((image, index) => ({
        path: image.path.trim(),
        caption: image.caption?.trim() || null,
        position: index,
      }));

    const payload = {
      ...form,
      cover_image: form.cover_image.trim(),
      images: imagesPayload,
    };

    try {
      if (editing) {
        await servicesApi.update(editing.id, payload);
      } else {
        await servicesApi.create(payload);
      }
      setForm(emptyForm);
      setEditing(null);
      await loadServices();
    } catch (error) {
      console.error('Error guardando servicio', error);
      setSubmitError(error.response?.data?.message || 'No se pudo guardar el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setForm({
      ...emptyForm,
      title: service.title || '',
      category: service.category || emptyForm.category,
      short_description: service.short_description || '',
      description: service.description || '',
      status: service.status || 'draft',
      featured: Boolean(service.featured),
      cover_image: service.cover_image || '',
      images:
        service.gallery?.length > 0
          ? service.gallery.map((image) => ({
              path: image.path || '',
              caption: image.caption || '',
            }))
          : [emptyImage],
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este servicio?')) return;
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

  const handleImageChange = (index, field, value) => {
    const updated = [...form.images];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, images: updated });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, emptyImage] });
  };

  const removeImageField = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated.length ? updated : [emptyImage] });
  };

  const openPreview = (url) => {
    if (!url || !url.trim()) return;
    window.open(url.trim(), '_blank', 'noopener,noreferrer');
  };

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
              placeholder="Buscar por titulo"
              className="w-full outline-none"
            />
          </div>

          <div className="space-y-4">
            {filtered.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
                <img
                  src={service.cover_image || service.gallery?.[0]?.path || 'https://via.placeholder.com/120x90'}
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
              <label className="text-sm text-[#555]">Titulo</label>
              <input
                required
                className="w-full border rounded-lg p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-[#555]">Categoria</label>
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
              <label className="text-sm text-[#555]">Descripcion</label>
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
              <div className="flex items-start gap-3">
                <input
                  required
                  className="w-full border rounded-lg p-2"
                  value={form.cover_image}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => openPreview(form.cover_image)}
                  disabled={!form.cover_image.trim()}
                  className="px-3 py-2 rounded-lg border border-[#d5d1c9] text-[#233274] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ver
                </button>
              </div>
              {form.cover_image.trim() && (
                <div className="mt-2">
                  <p className="text-xs text-[#9a98a0] mb-1">Previsualizacion</p>
                  <img
                    src={form.cover_image.trim()}
                    alt={form.title || 'Portada del servicio'}
                    className="w-full h-40 object-cover rounded-xl border border-[#ebe7df]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[#555]">Estado</label>
              <select
                className="w-full border rounded-lg p-2"
                value={form.status || 'published'}
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

            <div className="border border-dashed border-[#d5d1c9] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImagePlus className="w-4 h-4 text-[#d14a00]" />
                <p className="text-sm font-semibold text-[#233274]">Galeria del servicio</p>
              </div>

              <div className="space-y-3">
                {form.images.map((image, index) => (
                  <div key={index} className="bg-[#fdfaf5] p-3 rounded-lg border border-[#ebe7df]">
                    <label className="text-xs text-[#555] block mb-1">URL de la imagen</label>
                    <div className="flex items-start gap-2">
                      <input
                        className="w-full border rounded-lg p-2"
                        value={image.path}
                        onChange={(e) => handleImageChange(index, 'path', e.target.value)}
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => openPreview(image.path)}
                        disabled={!image.path.trim()}
                        className="px-2 py-2 rounded-lg border border-[#d5d1c9] text-[#233274] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-2 py-2 rounded-lg border border-[#d5d1c9] text-[#d14a00] hover:border-[#d14a00]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <label className="text-xs text-[#555] block mt-2 mb-1">Leyenda</label>
                    <input
                      className="w-full border rounded-lg p-2"
                      value={image.caption}
                      onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                      placeholder="Detalle de la imagen"
                    />
                    {image.path.trim() && (
                      <img
                        src={image.path.trim()}
                        alt={image.caption || `Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#ebe7df] mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageField}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d5d1c9] text-[#233274] hover:border-primary"
              >
                <Plus className="w-4 h-4" /> Agregar imagen
              </button>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyForm);
                    setSubmitError('');
                  }}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-primary text-[#233274] font-bold py-2 rounded-lg disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
