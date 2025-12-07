// src/features/services/pages/ServicesPage.jsx
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../../../shared/utils/api';
import { CheckCircle } from 'lucide-react';

const ServicesPage = () => {
  const { data: services } = useQuery(['services'], servicesApi.list);

  return (
    <div className="bg-white min-h-screen">
      <div className="section bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container-custom space-y-3">
          <p className="badge-accent">Servicios</p>
          <h1 className="text-4xl font-black text-slate-900">Soluciones para cada etapa del proyecto</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Desde el diseño conceptual hasta la supervisión de obra, combinamos ingeniería y arquitectura para asegurar
            proyectos viables, seguros y listos para operar.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container-custom grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services?.data?.map((service) => (
            <div key={service.id} className="bg-white border border-slate-100 rounded-2xl card-shadow p-6 space-y-3">
              <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
              <p className="text-sm text-slate-600">{service.description}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
