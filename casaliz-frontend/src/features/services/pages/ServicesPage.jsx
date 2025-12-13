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

  const serviceHighlights = [
    'Viviendas unifamiliares y multifamiliares',
    'Casas de campo',
    'Diseño de interiores con vistas en 3D',
    'Expediente de licencia de construcción',
    'Declaratoria de fábrica',
    'Independizaciones',
    'Habilitaciones urbanas',
    'Subdivisión de lote',
    'Acumulación de lote',
    'Prescripción adquisitiva',
    'Visación de planos',
    'Levantamientos topográficos',
    'Licencia de funcionamiento',
    'Compra-venta de terrenos',
    'Expedientes técnicos',
  ];

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
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#233274]">Estos son los servicios que hacemos</h2>
          <p className="text-[#233274] max-w-3xl">
            Conoce el catálogo de soluciones de Diseño, Construcción e Inmobiliaria disponibles en CASALIZ.
          </p>
          <div className="flex flex-wrap gap-3">
            {serviceHighlights.map((item) => (
              <span
                key={item}
                className="px-4 py-2 bg-white text-[#233274] rounded-full shadow-sm border border-[#e2dfd7] text-sm font-semibold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {services.length === 0 ? (
          <p className="text-[#9a98a0]">No hay servicios publicados.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl shadow overflow-hidden block"
              >
                <div className="relative h-72 w-full">
                  <img
                    src={service.cover_image || service.gallery?.[0]?.path || 'https://via.placeholder.com/400x240'}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 text-[#233274] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-sm font-medium">Haz clic para ver el detalle</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
