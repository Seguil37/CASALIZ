// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Users } from 'lucide-react';

const HeroSection = () => {
  const [mode, setMode] = useState('projects');
  const [projectQuery, setProjectQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'services') {
      const params = new URLSearchParams();
      if (serviceQuery) params.append('search', serviceQuery);
      navigate(`/services?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams();
    if (projectQuery) {
      params.append('search', projectQuery);
      params.append('city', projectQuery);
    }
    navigate(`/projects?${params.toString()}`);
  };

  const projectSuggestions = ['Casa Miraflores', 'Oficina abierta', 'Remodelacion integral', 'Interiorismo boutique', 'Edificio mixto'];
  const serviceSuggestions = ['Licencias y tramites', 'Diseno arquitectonico', 'Habilitaciones urbanas', 'Topografia'];

  const isAbout = mode === 'about';
  const inputLabel = mode === 'services' ? 'Servicio o palabra clave' : 'Ciudad o destino';
  const inputPlaceholder = mode === 'services'
    ? 'Licencias, diseno, topografia...'
    : 'Ciudad, tipo de proyecto o referencia';
  const suggestions = mode === 'services' ? serviceSuggestions : projectSuggestions;
  const value = mode === 'services' ? serviceQuery : projectQuery;
  const onChange = mode === 'services' ? setServiceQuery : setProjectQuery;

  return (
    <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
        <img
          src="https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/471261672_921713853272572_2849473084232492966_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=aO-qf6JFBE0Q7kNvwF2trnQ&_nc_oc=AdmNQcTEwlsSJhTw9l-3M7LbJPiL5iqNNAgVjwF-l-UG5XJhkIcmzhClMRWEuDzO0wY&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=UTAzAimmvmz_EEiBKXBcpA&oh=00_AflrXZ1VKzXVMcFBU1hU8YCQVh-My9zK4w7em0uq2vQQuw&oe=69401BA1"
          alt="Hero background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          <div className="mb-6">
            <h1 className="text-5xl lg:text-7xl font-black text-[#f8f5ef] mb-4 tracking-tight">
              Diseñamos espacios que hablan por ti.
            </h1>
            <p className="text-xl lg:text-2xl text-[#f8f5ef] font-semibold tracking-wide">
              Arquitectura, interiorismo y gestion de proyectos para viviendas, oficinas y espacios comerciales.
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {['projects', 'services', 'about'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  mode === value
                    ? 'bg-white text-[#233274] border-white shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {value === 'projects' && 'Proyectos'}
                {value === 'services' && 'Servicios'}
                {value === 'about' && 'Empresa'}
              </button>
            ))}
          </div>

          {isAbout ? (
            <div className="max-w-5xl mx-auto bg-[#0f1b35]/80 border border-white/30 rounded-3xl p-8 text-white shadow-2xl backdrop-blur">
              <p className="text-3xl md:text-4xl font-black mb-3">10+ años de experiencia combinada</p>
              <p className="text-white/85 mb-6 text-lg max-w-3xl mx-auto">
                Equipo de arquitectos e ingenieros que lidera licencias, diseno, construccion y supervision.
                Cuentanos tu idea y la llevamos a proyecto ejecutable.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contacto')}
                  className="px-6 py-3 rounded-full bg-white text-[#233274] font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
                >
                  Hablemos ahora
                </button>
                <a
                  href="#nosotros"
                  className="px-6 py-3 rounded-full border border-white/60 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Ver fortalezas
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl mx-auto mt-8 bg-[#f8f5ef] rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto] gap-4 items-end">
                <div className="text-left">
                  <label className="block text-sm font-semibold text-[#233274] mb-2">{inputLabel}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
                    <input
                      type="text"
                      placeholder={inputPlaceholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none transition-all text-[#233274] font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {mode === 'services' ? 'Buscar servicios' : 'Buscar soluciones'}
                  </button>
                </div>
              </div>

              
            </form>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{ icon: Star, text: 'Clientes que confian en Casaliz', count: '98%' }, { icon: Star, text: 'Proyectos disenados y construidos', count: '120+' }, { icon: Users, text: 'Años de experiencia combinada', count: '10+' }].map((item, index) => {
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
