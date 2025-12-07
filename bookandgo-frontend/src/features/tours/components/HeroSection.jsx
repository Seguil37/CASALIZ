// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star } from 'lucide-react';

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
    <section className="relative h-[620px] lg:h-[720px] flex items-center justify-center overflow-hidden">
      {/* Rebranding BookandGo → CASALIZ Arquitectos Ingenieros */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70 z-10"></div>
        <img
          src="https://images.pexels.com/photos/245240/pexels-photo-245240.jpeg"
          alt="Fondo de planos y arquitectura"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      {/* Contenido */}
      <div className="container-custom relative z-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold uppercase tracking-[0.2em]">
              CASALIZ Arquitectos Ingenieros
            </p>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Arquitectura y regularización de obras en Cusco y todo el Perú
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 font-medium">
              CASALIZ E.I.R.L. te acompaña desde el diseño arquitectónico hasta la licencia de edificación y la regularización de tu inmueble.
            </p>
          </div>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Ubicación del proyecto
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Distrito, provincia o zona"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Inicio estimado
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Plazo objetivo
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Solicitar asesoría
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-white text-sm font-medium">Servicios más solicitados:</span>
            {[
              'Diseño arquitectónico',
              'Licencia de obra',
              'Regularización de construcción',
              'Expediente técnico',
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchData({ ...searchData, destination: tag });
                }}
                className="px-4 py-1 bg-white/15 hover:bg-primary/90 backdrop-blur-sm text-white hover:text-white rounded-full text-sm font-medium transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Star, text: 'Expedientes técnicos aprobados', count: '200+' },
              { icon: Star, text: 'Proyectos diseñados y regularizados', count: '350+' },
              { icon: Star, text: 'Equipo de arquitectos e ingenieros', count: '15' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
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