// src/features/tours/components/ReferenceContentSection.jsx
// Rebranding BookandGo → CASALIZ Arquitectos Ingenieros

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Globe2, Star, HardHat } from 'lucide-react';

const ReferenceContentSection = () => {
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    {
      id: 'services',
      label: 'Servicios de Arquitectura',
      icon: Landmark,
    },
    {
      id: 'projects',
      label: 'Tipos de Proyecto',
      icon: HardHat,
    },
    {
      id: 'locations',
      label: 'Ubicaciones en Perú',
      icon: Globe2,
    },
  ];

  const content = {
    services: [
      { name: 'Diseño arquitectónico integral', count: 120, rating: 4.9 },
      { name: 'Expedientes técnicos y metrados', count: 95, rating: 4.8 },
      { name: 'Licencia de obra y edificación', count: 86, rating: 4.8 },
      { name: 'Regularización de construcciones', count: 74, rating: 4.7 },
      { name: 'Remodelaciones y ampliaciones', count: 68, rating: 4.7 },
      { name: 'Supervisión y seguridad de obra', count: 59, rating: 4.8 },
    ],
    projects: [
      { name: 'Vivienda unifamiliar', count: 80, rating: 4.9 },
      { name: 'Edificio multifamiliar', count: 55, rating: 4.8 },
      { name: 'Locales comerciales', count: 62, rating: 4.7 },
      { name: 'Oficinas corporativas', count: 40, rating: 4.7 },
      { name: 'Equipamiento turístico', count: 28, rating: 4.6 },
      { name: 'Plantas industriales', count: 18, rating: 4.6 },
    ],
    locations: [
      { name: 'Cusco', count: 145, rating: 4.9 },
      { name: 'Lima', count: 98, rating: 4.8 },
      { name: 'Arequipa', count: 67, rating: 4.7 },
      { name: 'Wanchaq', count: 45, rating: 4.7 },
      { name: 'San Isidro', count: 38, rating: 4.8 },
      { name: 'Mollendo', count: 20, rating: 4.6 },
      { name: 'San Sebastián', count: 33, rating: 4.7 },
      { name: 'Santiago de Cusco', count: 29, rating: 4.6 },
      { name: 'Miraflores', count: 41, rating: 4.8 },
      { name: 'San Borja', count: 22, rating: 4.6 },
      { name: 'Cercado de Cusco', count: 18, rating: 4.7 },
      { name: 'Callao', count: 25, rating: 4.6 },
    ],
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Título */}
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 text-center animate-fade-in">
          Referencias para tus proyectos
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
          {content[activeTab].map((item, index) => (
            <Link
              key={index}
              to={`/tours?search=${item.name}`}
              className="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-primary"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors truncate">
                {item.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-sm font-medium text-gray-900">{item.rating}</span>
              </div>

              <p className="text-sm text-gray-500">
                {item.count} {item.count === 1 ? 'proyecto' : 'proyectos'} gestionados
              </p>

              {/* Indicador de hover */}
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500 rounded-full"></div>
            </Link>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explorar todos los proyectos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReferenceContentSection;
