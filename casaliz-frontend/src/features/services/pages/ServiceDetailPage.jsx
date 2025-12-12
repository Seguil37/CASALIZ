import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { servicesApi } from '../../../shared/utils/api';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesApi.show(slug);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return <p className="text-center mt-10 text-[#9a98a0]">Servicio no encontrado.</p>;
  }

  return (
    <div className="bg-[#f8f5ef] min-h-screen pb-12">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <img
            src={service.cover_image || service.gallery?.[0]?.path || 'https://via.placeholder.com/800x500'}
            alt={service.title}
            className="w-full h-full object-cover rounded-2xl shadow"
          />

          <div>
            <p className="text-sm uppercase tracking-wide text-[#9a98a0] mb-2">{service.category}</p>
            <h1 className="text-4xl font-black text-[#233274] mb-4">{service.title}</h1>
            <p className="text-lg text-[#555] mb-6">{service.short_description}</p>
            <div className="prose max-w-none text-[#333]">
              {service.description}
            </div>

            <a
              href="/contacto"
              className="inline-flex items-center gap-2 mt-6 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl"
            >
              Cotizar / Contáctanos
            </a>
          </div>
        </div>

        {service.gallery?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#233274] mb-4">Galería</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {service.gallery.map((image) => (
                <img
                  key={image.id}
                  src={image.path}
                  alt={image.caption || service.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;
