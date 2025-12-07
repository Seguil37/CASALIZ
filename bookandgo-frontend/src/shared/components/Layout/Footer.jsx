// src/shared/components/Layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-12">
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <span className="text-xl font-black text-white">CA</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">CASALIZ</p>
              <p className="text-lg font-black text-white">Arquitectos Ingenieros</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            Diseñamos y gestionamos proyectos que cumplen normativa, optimizan recursos y priorizan la seguridad de cada cliente.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-slate-900 flex items-center justify-center transition"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Secciones</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-orange-400">Inicio</Link></li>
            <li><Link to="/servicios" className="hover:text-orange-400">Servicios</Link></li>
            <li><Link to="/proyectos" className="hover:text-orange-400">Proyectos</Link></li>
            <li><Link to="/nosotros" className="hover:text-orange-400">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-orange-400">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Servicios clave</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>Diseño arquitectónico</li>
            <li>Expedientes técnicos</li>
            <li>Licencias y regularización</li>
            <li>Supervisión de obra</li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <h3 className="text-white font-semibold mb-4">Contacto</h3>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-orange-400 mt-1" />
            <div>
              <a href="tel:+51990179027" className="hover:text-orange-400 block">+51 990 179 027</a>
              <a href="tel:+51913106359" className="hover:text-orange-400 block">+51 913 106 359</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-orange-400 mt-1" />
            <a href="mailto:contacto@casaliz.com" className="hover:text-orange-400">contacto@casaliz.com</a>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-orange-400 mt-1" />
            <span>Av. Principal 123, Cusco - Perú</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2025 CASALIZ. Arquitectura y gestión de proyectos.</p>
          <div className="flex gap-6">
            <span>Privacidad</span>
            <span>Términos</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
