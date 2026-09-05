import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { servicesApi, toPublicUrl } from '../../../shared/utils/api';
import MotionTitle from '../../../shared/motion/MotionTitle';
import viviendasImg from '../../../assets/images/servicios-principales/viviendas_unifamiliares_multifamiliares.png';
import expedienteLicenciaImg from '../../../assets/images/servicios-principales/expediente_licencia_construccion.png';
import interiores3dImg from '../../../assets/images/servicios-principales/diseno_interiores_3d.png';
import compraVentaImg from '../../../assets/images/servicios-principales/compra_venta_de_terrenos.png';
import levantamientosImg from '../../../assets/images/servicios-principales/levantamientos_topograficos.png';
import expedientesTecnicosImg from '../../../assets/images/servicios-principales/expedientes_tecnicos.png';

const fallbackServices = [
  {
    id: 'srv-1',
    title: 'Diseño arquitectónico residencial',
    category: 'Arquitectura',
    fallback_image: viviendasImg,
    short_description: 'Planos, renders y expediente de licencia para tu vivienda.',
    is_featured: true,
  },
  {
    id: 'srv-2',
    title: 'Gestion de licencias y regularizaciones',
    category: 'Tramites',
    fallback_image: expedienteLicenciaImg,
    short_description: 'Licencia de construccion, declaratoria de fabrica e independizaciones.',
    is_featured: true,
  },
  {
    id: 'srv-3',
    title: 'Diseño de interiores y visualización 3D',
    category: 'Interiores',
    fallback_image: interiores3dImg,
    short_description: 'Modelado, materialidad e iluminacion para validar el espacio antes de obra.',
    is_featured: true,
  },
  {
    id: 'srv-4',
    title: 'Servicios inmobiliarios',
    category: 'Inmobiliaria',
    fallback_image: compraVentaImg,
    short_description: 'Compra, venta y asesoria tecnica para decisiones inmobiliarias seguras.',
    is_featured: true,
  },
  {
    id: 'srv-5',
    title: 'Levantamientos topograficos',
    category: 'Topografia',
    fallback_image: levantamientosImg,
    short_description: 'Medicion y mapeo preciso de terrenos para proyectos y tramites.',
    is_featured: true,
  },
  {
    id: 'srv-6',
    title: 'Expedientes tecnicos',
    category: 'Ingenieria',
    fallback_image: expedientesTecnicosImg,
    short_description: 'Documentacion tecnica completa para ejecutar y sustentar obra.',
    is_featured: true,
  },
];

const FeaturedServiceSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFeaturedService = (service) => {
    const value = service?.is_featured ?? service?.featured;
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return Boolean(value);
  };

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await servicesApi.list({ per_page: 6, is_featured: true });
        const data = response.data?.data ?? response.data ?? [];
        const featured = data.filter(isFeaturedService).slice(0, 6);
        setServices(featured);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const displayServices = services.length > 0 ? services : fallbackServices;

  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="container-custom text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#e15f0b] border-t-transparent" />
          <p className="mt-4 text-[#667085]">Cargando servicios...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f6f1e8] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#e15f0b]">
              <Sparkles className="h-4 w-4" />
              Seleccion del estudio
            </div>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#233274] sm:text-4xl lg:text-5xl"
            >
              Servicios destacados para avanzar con criterio tecnico.
            </MotionTitle>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#d8cbb9] bg-white px-5 py-3 text-sm font-bold text-[#233274] transition hover:border-[#e15f0b]/40 hover:text-[#d14a00] lg:self-auto"
          >
            Ver todos los servicios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayServices.map((service) => {
            const image =
              service.fallback_image ||
              toPublicUrl(service.cover_image || service.gallery?.[0]?.path) ||
              viviendasImg;

            return (
              <Link
                key={service.id}
                to={`/services/${service.slug || service.id}`}
                className="group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b274f] via-[#1f2f63] to-[#0f193a] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(15,25,58,0.26)]"
                data-motion-card
              >
                <div className="p-3 pb-0">
                  <div className="flex min-h-8 items-center gap-2">
                    <span
                      className="min-w-0 max-w-[calc(100%-6.5rem)] truncate rounded-full border border-[#ebe7df] bg-[#f8f5ef] px-2.5 py-1 text-[11px] font-bold text-[#233274]"
                      title={service.category || 'Servicio'}
                    >
                      {service.category || 'Servicio'}
                    </span>
                    {isFeaturedService(service) && (
                      <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e15f0b] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                        <Sparkles className="h-3.5 w-3.5" />
                        Destacado
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mt-3 flex aspect-[4/3] w-full items-center justify-center bg-[#f8f5ef]">
                  <img
                    src={image}
                    alt={service.title}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 px-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-3 text-2xl font-bold leading-tight">{service.title}</h3>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#233274]">
                      Ver mas detalle
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServiceSection;
