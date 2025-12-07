import { NavLink } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';

const links = [
    { to: '/', label: 'Inicio' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/proyectos', label: 'Proyectos' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
];

export function Navbar() {
    return (
        <header className="navbar">
            <div className="container content">
                <div className="brand">
                    <div className="brand-mark">CA</div>
                    <div>
                        <div>CASALIZ E.I.R.L.</div>
                        <small style={{ color: '#5b6475', fontWeight: 600 }}>Arquitectura & gestión</small>
                    </div>
                </div>
                <nav className="nav-links">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `nav-link${isActive && link.to !== '/' ? ' active' : isActive ? ' active' : ''}`
                            }
                            end={link.to === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <a className="nav-link" href="tel:+51999888777" style={{ color: '#0f4c81', fontWeight: 800 }}>
                        <PhoneCall size={18} /> +51 999 888 777
                    </a>
                </nav>
            </div>
        </header>
    );
}
