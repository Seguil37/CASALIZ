// src/features/agency/pages/CreateTourPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ImagePlus, PlusCircle, Trash2 } from 'lucide-react';
import { projectsApi } from '../../../shared/utils/api';

const emptyImage = { path: '', caption: '' };

const CreateTourPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    city: '',
    state: '',
    country: 'Peru',
    status: 'draft',
    is_featured: false,
    summary: '',
    description: '',
    hero_image: '',
    images: [emptyImage],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const openPreview = (url) => {
    if (!url || !url.trim()) return;
    window.open(url.trim(), '_blank', 'noopener,noreferrer');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, emptyImage] }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages.length ? updatedImages : [emptyImage] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El nombre del proyecto es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'Agrega una descripción del proyecto';
    if (!['draft', 'published', 'archived'].includes(formData.status)) {
      newErrors.status = 'Selecciona un estado válido';
    }

    const imagesWithPath = formData.images.filter((image) => image.path.trim());
    if (imagesWithPath.length === 0) {
      newErrors.images = 'Agrega al menos una imagen del proyecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      ...formData,
      images: formData.images
        .filter((image) => image.path.trim())
        .map((image, index) => ({
          path: image.path.trim(),
          caption: image.caption || null,
          position: index,
        })),
    };

    try {
      await projectsApi.create(payload);
      navigate('/agency/dashboard');
    } catch (error) {
      const validationErrors = error.response?.data?.errors || {};
      setErrors(validationErrors);
      setSubmitError(error.response?.data?.message || 'No se pudo crear el proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/agency/dashboard')}
          className="flex items-center gap-2 text-[#9a98a0] hover:text-[#233274] mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-[#ebe7df] p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-[#9a98a0] uppercase tracking-widest">Nuevo proyecto</p>
              <h1 className="text-3xl font-black text-[#233274]">Crea un proyecto para el portafolio</h1>
              <p className="text-[#4b4b4b]">Comparte la información esencial del proyecto y sus imágenes destacadas.</p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-primary text-[#233274] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Guardando...' : 'Guardar proyecto'}
            </button>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Nombre del proyecto *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Casa de campo en Cieneguilla"
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Tipo de proyecto</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Residencial, comercial, interiorismo..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Lima"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Región/Estado</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Lima"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">País</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Perú"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#233274] mb-1">Estado *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                  {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="w-4 h-4 text-primary border-[#ebe7df] rounded focus:ring-primary"
                  />
                  <label htmlFor="is_featured" className="text-sm text-[#233274] font-semibold">
                    Marcar como proyecto destacado
                  </label>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Resumen</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Descripción corta del proyecto"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Descripción detallada *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Detalles, objetivos y resultados del proyecto"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#233274] mb-1">Imagen principal</label>
                <div className="flex items-start gap-3">
                  <input
                    type="text"
                    value={formData.hero_image}
                    onChange={(e) => handleChange('hero_image', e.target.value)}
                    className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="URL de la imagen principal"
                  />
                  <button
                    type="button"
                    onClick={() => openPreview(formData.hero_image)}
                    disabled={!formData.hero_image.trim()}
                    className="px-3 py-2 rounded-xl border border-[#ebe7df] text-[#233274] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ver
                  </button>
                </div>
                {formData.hero_image.trim() && (
                  <div className="mt-3">
                    <p className="text-xs text-[#9a98a0] mb-1">PrevisualizaciA3n</p>
                    <img
                      src={formData.hero_image.trim()}
                      alt="PrevisualizaciA3n de la imagen principal"
                      className="w-full max-w-sm max-h-48 object-contain rounded-lg border border-[#ebe7df] bg-white"
                    />
                  </div>
                )}
                <p className="text-xs text-[#9a98a0] mt-1">Usaremos esta imagen en las vistas destacadas del proyecto.</p>
              </div>
              <div className="bg-[#f8f5ef] rounded-xl border border-dashed border-[#d5d1c9] p-4 flex items-center gap-3">
                <ImagePlus className="w-5 h-5 text-[#d14a00]" />
                <p className="text-sm text-[#4b4b4b]">
                  Agrega enlaces públicos de tus imágenes alojadas (por ejemplo, en tu CDN o almacenamiento en la nube).
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#233274]">Galería del proyecto</h2>
                  <p className="text-sm text-[#9a98a0]">Incluye al menos una imagen con su enlace público.</p>
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ebe7df] text-[#233274] hover:border-primary"
                >
                  <PlusCircle className="w-4 h-4" /> Añadir imagen
                </button>
              </div>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-[#fdfaf5] p-4 rounded-xl border border-[#ebe7df]">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-[#233274] mb-1">URL de la imagen *</label>
                      <div className="flex items-start gap-3">
                        <input
                          type="text"
                          value={image.path}
                          onChange={(e) => handleImageChange(index, 'path', e.target.value)}
                          className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => openPreview(image.path)}
                          disabled={!image.path.trim()}
                          className="px-3 py-2 rounded-xl border border-[#ebe7df] text-[#233274] hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Ver
                        </button>
                      </div>
                      {image.path.trim() && (
                        <div className="mt-2">
                          <p className="text-xs text-[#9a98a0] mb-1">PrevisualizaciA3n</p>
                          <img
                            src={image.path.trim()}
                            alt={image.caption || `Imagen ${index + 1}`}
                            className="w-full h-32 object-contain rounded-lg border border-[#ebe7df] bg-white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#233274] mb-1">Leyenda</label>
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                        className="w-full rounded-xl border border-[#ebe7df] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Vista interior, fachada, etc."
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2 rounded-full hover:bg-white border border-[#ebe7df]"
                        aria-label="Eliminar imagen"
                      >
                        <Trash2 className="w-4 h-4 text-[#d14a00]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.images && <p className="text-sm text-red-600 mt-2">{errors.images}</p>}
            </section>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#233274] text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Guardando...' : 'Guardar y publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTourPage;
