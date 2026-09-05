// src/features/tours/components/PopularLocationsSection.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, MapPin, Star, TrendingUp } from 'lucide-react';
import MotionTitle from '../../../shared/motion/MotionTitle';
import cuscoImg from '../../../assets/images/zonas/cusco.png';
import sanJeronimoImg from '../../../assets/images/zonas/san-jeronimo.png';
import sanSebastianImg from '../../../assets/images/zonas/san-sebastian.png';
import santiagoImg from '../../../assets/images/zonas/santiago.png';

const projectLocations = [
  {
    name: 'Cusco Centro',
    subtitle: 'Proyectos de vivienda e interiores',
    image: cuscoImg,
    projects: 32,
    rating: 4.8,
  },
  {
    name: 'San Sebastian',
    subtitle: 'Casas unifamiliares y multifamiliares',
    image: sanSebastianImg,
    projects: 28,
    rating: 4.7,
  },
  {
    name: 'San Jeronimo',
    subtitle: 'Casas de campo y proyectos residenciales',
    image: sanJeronimoImg,
    projects: 22,
    rating: 4.6,
  },
  {
    name: 'Santiago',
    subtitle: 'Vivienda y comercio local',
    image: santiagoImg,
    projects: 18,
    rating: 4.6,
  },
];

const PopularLocationsSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocations(projectLocations);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f6f1e8] py-20">
        <div className="container-custom">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#e15f0b]" />
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f6f1e8] py-16 sm:py-20">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e] shadow-sm">
              <TrendingUp className="h-4 w-4" />
              Zonas frecuentes
            </div>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#233274] sm:text-4xl lg:text-5xl"
            >
              Lugares donde desarrollamos vivienda, obra y regularizacion.
            </MotionTitle>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#d8cbb9] bg-white px-5 py-3 text-sm font-bold text-[#233274] transition hover:border-[#e15f0b]/40 hover:text-[#d14a00] lg:self-auto"
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location) => (
            <Link
              key={location.name}
              to={`/projects?search=${encodeURIComponent(location.name)}`}
              className="group overflow-hidden rounded-lg border border-[#e2d6c6] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#e15f0b]/35 hover:shadow-xl"
              data-motion-card
            >
              <div className="relative h-56 overflow-hidden bg-[#efe6d8]">
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-black text-[#233274] shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#f6a24a] text-[#f6a24a]" />
                  {location.rating}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
                  <MapPin className="h-4 w-4" />
                  {location.projects}+ proyectos
                </div>
                <h3 className="text-2xl font-black text-[#233274] transition group-hover:text-[#d14a00]">
                  {location.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{location.subtitle}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#233274]">
                  Ver proyectos
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocationsSection;
