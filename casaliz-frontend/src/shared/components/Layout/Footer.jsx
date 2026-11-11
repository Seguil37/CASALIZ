import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { usePublicMotion } from "../../motion/publicMotionContext";
import logo from "../../../assets/images/casaliz-logo.png";

export default function Footer() {
    const { scrollTo } = usePublicMotion();
    return (
        <footer className="cz-footer">
            <div className="cz-wrap">
                <div className="cz-footer-top">
                    <h2>
                        Una idea merece
                        <br />
                        un buen comienzo.
                    </h2>
                    <Link className="cz-link" to="/contacto">
                        Conversemos sobre tu proyecto
                        <ArrowUpRight size={20} aria-hidden="true" />
                    </Link>
                </div>
                <div className="cz-footer-columns">
                    <div>
                        <Link className="cz-footer-brand" to="/" aria-label="CasaLiz, inicio">
                            <img
                                className="cz-footer-logo"
                                src={logo}
                                alt="CasaLiz Arquitectos e Ingenieros"
                                width="1280"
                                height="600"
                                loading="lazy"
                            />
                        </Link>
                        <p>
                            Arquitectura, ingeniería y gestión inmobiliaria.
                            <br />
                            Espacios pensados para las personas.
                        </p>
                    </div>
                    <div>
                        <h3>Especialidades</h3>
                        <nav aria-label="Servicios del pie de página">
                            {[
                                "Diseño arquitectónico",
                                "Licencias",
                                "Expedientes técnicos",
                                "Consultorías y supervisión",
                            ].map((label) => (
                                <Link to="/services" key={label}>
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div>
                        <h3>Explora CasaLiz</h3>
                        <nav aria-label="Navegación del pie de página">
                            <Link to="/">Inicio</Link>
                            <Link to="/about">El estudio</Link>
                            <Link to="/projects">Proyectos y categorías</Link>
                            <Link to="/contacto">Contacto</Link>
                        </nav>
                    </div>
                    <div>
                        <h3>El estudio / Cusco, Perú</h3>
                        <div className="cz-footer-contact">
                            <a href="tel:+51984696802">+51 984 696 802 ↗</a>
                            <a href="mailto:lissyosores@hotmail.com">
                                lissyosores@hotmail.com ↗
                            </a>
                            <Link to="/contacto#ubicacion">
                                <address>
                                    Av. Lloque Yupanqui, Edificio Ecological
                                    Plaza
                                    <br />
                                    2do. nivel, Of. 202 · Wanchaq, Cusco
                                </address>
                            </Link>
                            <p>Lun – Vie: 9:00 AM – 6:00 PM</p>
                            <nav aria-label="Redes sociales">
                                <a
                                    href="https://www.facebook.com/CASALIZEIRL"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook ↗
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram ↗
                                </a>
                                <a
                                    href="https://tinyurl.com/CasalizArquitectura"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp ↗
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="cz-footer-bottom">
                    <span>
                        © {new Date().getFullYear()} CasaLiz Arquitectos e
                        Ingenieros. Todos los derechos reservados.
                    </span>
                    <button type="button" onClick={() => scrollTo(0)}>
                        Volver arriba
                        <ArrowUp size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
