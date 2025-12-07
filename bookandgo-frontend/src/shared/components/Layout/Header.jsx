// src/shared/components/Layout/Header.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-orange-600' : 'text-slate-700 hover:text-orange-600'
    }`;

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-white">CA</span>
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">CASALIZ</p>
              <p className="text-lg font-black text-slate-900">Arquitectos Ingenieros</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+51990179027" className="text-sm font-semibold text-secondary flex items-center gap-2 text-blue-700">
              <Phone className="w-4 h-4" />
              +51 990 179 027
            </a>
            <Link
              to="/contacto"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              Solicitar asesoría
            </Link>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-sm font-semibold text-slate-600 hover:text-orange-600"
              >
                Salir
              </button>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-orange-600">
                Iniciar sesión
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-slate-700 hover:bg-orange-50'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 text-blue-700 font-semibold">
                <Phone className="w-4 h-4" />
                +51 990 179 027
              </div>
              <Link
                to="/contacto"
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Escríbenos
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left text-slate-700 font-semibold"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-left text-slate-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
