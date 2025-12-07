// src/features/tours/components/HeroSection.jsx
// Rebranding BookandGo → CASALIZ Arquitectos Ingenieros

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star, Building2, CheckCircle2 } from 'lucide-react';

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.destination) params.append('location', searchData.destination);
    if (searchData.checkIn) params.append('from', searchData.checkIn);
    if (searchData.checkOut) params.append('to', searchData.checkOut);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative h-[640px] lg:h-[720px] flex items-center justify-center overflow-hidden bg-secondary">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/70 to-secondary/80 z-10"></div>
        <img
          src="https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg"
          alt="Equipo de arquitectos revisando planos"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      {/* Contenido */}
      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          {/* Logo y título principal */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Building2 className="w-6 h-6 text-primary" />
              <span className="text-white font-semibold">CASALIZ Arquitectos Ingenieros</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-2 tracking-tight">
              Arquitectura y regularización de obras en Cusco y todo el Perú
            </h1>
            <p className="text-lg lg:text-2xl text-primary font-semibold tracking-wide max-w-4xl">
              CASALIZ E.I.R.L. te acompaña desde el diseño arquitectónico hasta la licencia de edificación y la regularización de tu inmueble.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                onClick={() => navigate('/contacto')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Solicitar asesoría
              </button>
              <Link
                to="/tours"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
              >
                Ver proyectos realizados
              </Link>
            </div>
          </div>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* ¿Dónde está tu proyecto? */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Ubicación del proyecto
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Distrito, provincia o dirección"
                    value={searchData.destination}
                    onChange={(e) =>
                      setSearchData({ ...searchData, destination: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Check In */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Fecha estimada de inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkIn: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Check Out */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Fecha de entrega o licencia
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkOut: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Botón Buscar */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buscar
                </button>
              </div>
            </div>
          </form>

          {/* Tags populares */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-white text-sm font-medium">Búsquedas populares:</span>
            {['Licencia de obra', 'Expediente técnico', 'Regularización', 'Vivienda en Cusco', 'Local comercial'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchData({ ...searchData, destination: tag });
                }}
                className="px-4 py-1 bg-white/20 hover:bg-primary backdrop-blur-sm text-white hover:text-secondary rounded-full text-sm font-medium transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Indicadores de confianza */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: CheckCircle2, text: 'Expedientes técnicos entregados', count: '280+' },
              { icon: Building2, text: 'Proyectos desarrollados en Perú', count: '150+' },
              { icon: Star, text: 'Clientes que confían en nuestro equipo', count: '98%' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-primary fill-current" />
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;