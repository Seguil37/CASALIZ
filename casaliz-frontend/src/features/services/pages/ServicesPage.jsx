import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '../../../shared/utils/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 100 });
        const data = response.data?.data ?? response.data ?? [];
        setServices(data);
      } catch (error) {
        console.error('Error fetching services', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5ef] min-h-screen pb-12">
      <div className="bg-gradient-primary text-[#233274] py-16 mb-10">
        <div className="container-custom">
          <h1 className="text-4xl font-black mb-4">Servicios</h1>
          <p className="text-lg max-w-2xl text-[#233274]">
            Catálogo de soluciones de Diseño, Construcción e Inmobiliaria disponibles en CASALIZ.
          </p>
        </div>
      </div>

      <div className="container-custom">
        <h2 className="text-2xl font-bold text-[#233274] mb-6">Diseño, Construcción e Inmobiliaria</h2>

        {services.length === 0 ? (
          <p className="text-[#9a98a0]">No hay servicios publicados.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="bg-white rounded-2xl shadow p-5 flex flex-col">
                <img
                  src={service.cover_image || service.gallery?.[0]?.path || 'https://via.placeholder.com/400x240'}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#233274] mb-2">{service.title}</h3>
                  <p className="text-[#666] flex-1">{service.short_description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-[#9a98a0]">{service.category}</span>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
