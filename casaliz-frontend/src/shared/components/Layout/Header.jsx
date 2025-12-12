// src/shared/components/Layout/Header.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, Mail, Phone } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import casalizLogo from '../../../assets/images/casaliz-logo.png';
import { ROLES, roleLabels, isAdminRole } from '../../constants/roles';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-[#f8f5ef] shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo y Buscador */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center">
              <div className="h-12 md:h-14 lg:h-16 max-w-[180px] flex items-center">
                <img
                  src={casalizLogo}
                  alt="CasaLiz Arquitectos Ingenieros"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            </Link>
            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none transition-all bg-[#f8f5ef] text-[#233274] placeholder-[#9a98a0]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4 ml-6">
            {/* Navegación Principal - Desktop */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
              <Link
                to="/services"
                className="text-[#233274] hover:text-[#e15f0b] transition-colors"
              >
                Nuestros Servicios
              </Link>
              <Link
                to="/projects"
                className="text-[#233274] hover:text-[#e15f0b] transition-colors"
              >
                Nuestros Proyectos
              </Link>
              <Link
                to="/about"
                className="text-[#233274] hover:text-[#e15f0b] transition-colors"
              >
                Nosotros
              </Link>
            </nav>

            {/* Contacto */}
            <div className="hidden xl:flex items-center gap-4 text-sm">
              <Link
                to="/contacto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#233274] hover:text-[#e15f0b] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contactanos</span>
              </Link>
            </div>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-white rounded-full transition-all">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#f8f5ef]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="font-semibold text-[#233274]">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[11px] text-[#9a98a0] font-medium uppercase tracking-wide">
                      {roleLabels[user?.role] || 'Usuario'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#f8f5ef] rounded-xl shadow-xl border border-[#9a98a0] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-white text-[#233274] rounded-t-xl transition-colors"
                  >
                    Mi Perfil
                  </Link>

                  {/* Favoritos - Solo para clientes */}
                  {user?.role === ROLES.CLIENT && (
                    <Link
                      to="/favorites"
                      className="block px-4 py-3 hover:bg-white text-[#233274] transition-colors"
                    >
                      Favoritos
                    </Link>
                  )}

                  {isAdminRole(user?.role) && (
                    <Link
                      to="/agency/dashboard"
                      className="block px-4 py-3 hover:bg-white text-[#233274] transition-colors border-t"
                    >
                      Dashboard Proyectos
                    </Link>
                  )}

                  {user?.role === ROLES.MASTER_ADMIN && (
                    <Link
                      to="/admin/users"
                      className="block px-4 py-3 hover:bg-white text-[#233274] transition-colors border-t"
                    >
                      Gestión de administradores
                    </Link>
                  )}

                  {user?.role === ROLES.CLIENT && (
                    <Link
                      to="/customer/dashboard"
                      className="block px-4 py-3 hover:bg-white text-[#233274] transition-colors border-t"
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-b-xl transition-colors border-t"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-[#e15f0b] to-[#d14a00] hover:from-[#f26b1d] hover:to-[#e15f0b] text-[#f8f5ef] font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#233274]" />
              ) : (
                <Menu className="w-6 h-6 text-[#233274]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#9a98a0] focus:border-[#e15f0b] focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a98a0] w-5 h-5" />
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/services"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#233274] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nuestros Servicios
              </Link>
              <Link
                to="/projects"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#233274] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nuestros Proyectos
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#233274] rounded-lg transition-colors font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <div className="border-t border-[#9a98a0] my-2 pt-2">
                <a href="tel:+51990179027" className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#233274] rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-[#e15f0b]" />
                  <span>+51 990 179 027</span>
                </a>
                <Link
                  to="/contacto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white text-[#233274] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Mail className="w-4 h-4 text-[#e15f0b]" />
                  <span>Contactanos</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;