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
    'Expediente de licencia de construccion',
    'Declaratoria de fabrica',
    'Independizaciones',
    'Habilitaciones urbanas',
    'Subdivision de lote',
    'Acumulacion de lote',
    'Prescripcion adquisitiva',
    'Visacion de planos',
    'Levantamientos topograficos',
    'Licencia de funcionamiento',
    'Compra-venta de terrenos',
    'Expedientes tecnicos',
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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e2a63] via-[#243883] to-[#f59e0b] text-white py-16">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-16 -top-10 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 rounded-full text-sm font-semibold uppercase tracking-wide border border-white/25">
              <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
              Servicios CASALIZ
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight">
              Soluciones de diseño, construccion e inmobiliaria en un solo equipo.
            </h1>
            <p className="text-lg max-w-2xl text-white/90">
              Conecta con el servicio que necesitas: licencias, diseño, obra y gestion comercial. Te acompaniamos desde la
              idea hasta la entrega final.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#servicios-listado"
                className="px-5 py-3 rounded-xl bg-white text-[#233274] font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                Ver catalogo
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]" /> Tramites municipales
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]" /> Diseño y supervision
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]" /> Venta y regularizacion
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-4 col-span-2">
              <p className="text-sm text-white/70">Atencion integral</p>
              <p className="text-lg font-semibold">
                Coordinamos arquitectura, gestion tecnica y tramites para que avances sin retrasos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-10 relative z-10">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#ebe7df] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#9a98a0]">Especialidades</p>
                <h2 className="text-xl font-bold text-[#233274]">Estos son los servicios que hacemos</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {serviceHighlights.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-[#fdfaf5] text-[#233274] rounded-full shadow-sm border border-[#e2dfd7] text-sm font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-[#ebe7df] p-6 space-y-4">
            <p className="text-sm font-semibold text-[#233274] uppercase tracking-wide">SOLUCIONES PROFESIONALES</p>
            <p className="text-lg text-[#4b4b4b]">
              Gestionamos licencias, diseño, obra y venta. Cada servicio incluye seguimiento y asesoria personalizada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-[#233274]">
              <span className="px-3 py-2 rounded-xl bg-[#fdf1df] border border-[#f3d7a6] font-semibold text-center">
                Arquitectura
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#e8f2ff] border border-[#c6dbff] font-semibold text-center">
                Construccion
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#eaf8ef] border border-[#c6e8d2] font-semibold text-center">
                Inmobiliaria
              </span>
            </div>
          </div>
        </div>

        {services.length === 0 ? (
          <p className="text-[#9a98a0]">No hay servicios publicados.</p>
        ) : (
          <div id="servicios-listado" className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden block h-full"
              >
                <div className="relative h-[30rem] sm:h-[34rem] lg:h-[38rem] w-full bg-[#f8f5ef] flex items-center justify-center">
                  <img
                    src={service.cover_image || service.gallery?.[0]?.path || 'https://via.placeholder.com/400x240'}
                    alt={service.title}
                    className="w-full h-full object-contain"
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
