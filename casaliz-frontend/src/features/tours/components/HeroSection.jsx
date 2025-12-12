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
    navigate(`/projects?${params.toString()}`);
  };

  return (
    <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
        <img
          src="https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/471261672_921713853272572_2849473084232492966_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=aO-qf6JFBE0Q7kNvwF2trnQ&_nc_oc=AdmNQcTEwlsSJhTw9l-3M7LbJPiL5iqNNAgVjwF-l-UG5XJhkIcmzhClMRWEuDzO0wY&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=UTAzAimmvmz_EEiBKXBcpA&oh=00_AflrXZ1VKzXVMcFBU1hU8YCQVh-My9zK4w7em0uq2vQQuw&oe=69401BA1"
          alt="Travel Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      {/* Contenido */}
      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          {/* Logo y título principal */}
          <div className="mb-6">
            <h1 className="text-5xl lg:text-7xl font-black text-[#f8f5ef] mb-4 tracking-tight">
              Diseñamos espacios que hablan por ti.
            </h1>
            <p className="text-xl lg:text-2xl text-[#f8f5ef] font-semibold tracking-wide">
              Arquitectura, interiorismo y gestión de proyectos para viviendas, oficinas y espacios comerciales.
            </p>
          </div>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto mt-12 bg-[#f8f5ef] rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* ¿Qué necesitas? */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-[#233274] mb-2">
                  ¿Qué necesitas?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Diseño arquitectónico, interiores, trámites…"
                    value={searchData.destination}
                    onChange={(e) =>
                      setSearchData({ ...searchData, destination: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none transition-all text-[#233274] font-medium"
                  />
                </div>
              </div>

              {/* Tipo de proyecto */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-[#233274] mb-2">
                  Tipo de proyecto
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Unifamiliar, multifamiliar, comercial…"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkIn: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none transition-all text-[#233274] font-medium"
                  />
                </div>
              </div>

              {/* Ubicación del proyecto */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-[#233274] mb-2">
                  Ubicación del proyecto
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cusco, distrito, ciudad…"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkOut: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none transition-all text-[#233274] font-medium"
                  />
                </div>
              </div>

              {/* Botón Buscar */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buscar soluciones
                </button>
              </div>
            </div>
          </form>

          {/* Tags populares */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-[#f8f5ef] text-sm font-medium">Proyectos populares:</span>
            {[
              'Casa Miraflores',
              'Oficina abierta',
              'Remodelación integral',
              'Interiorismo boutique',
              'Edificio mixto',
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchData({ ...searchData, destination: tag });
                }}
                className="px-4 py-1 bg-[#f8f5ef]/20 hover:bg-[#e15f0b] backdrop-blur-sm text-[#f8f5ef] hover:text-[#233274] rounded-full text-sm font-medium transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Indicadores de confianza */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Star, text: 'Clientes que confían en Casaliz', count: '98%' },
              { icon: Star, text: 'Proyectos diseñados y construidos', count: '120+' },
              { icon: Star, text: 'Años de experiencia combinada', count: '10+' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#f8f5ef]/10 backdrop-blur-sm rounded-lg p-4 text-[#f8f5ef] animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-[#e15f0b] fill-current" />
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
