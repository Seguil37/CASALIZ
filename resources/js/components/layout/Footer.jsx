import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="footer">
            <div className="container columns">
                <div>
                    <div className="brand" style={{ color: '#fff' }}>
                        <div className="brand-mark">CA</div>
                        <div>
                            <div style={{ fontWeight: 800 }}>CASALIZ E.I.R.L.</div>
                            <small>Arquitectura peruana con precisión ejecutiva.</small>
                        </div>
                    </div>
                </div>
                <div>
                    <p style={{ fontWeight: 700 }}>Contacto</p>
                    <p>
                        <Phone size={16} /> +51 999 888 777
                    </p>
                    <p>
                        <Mail size={16} /> hola@casaliz.pe
                    </p>
                </div>
                <div>
                    <p style={{ fontWeight: 700 }}>Ubicación</p>
                    <p>
                        <MapPin size={16} /> Lima, Perú
                    </p>
                    <p>Atendemos proyectos a nivel nacional.</p>
                </div>
            </div>
            <div className="container" style={{ marginTop: '1.5rem', color: '#a8b9d1', fontSize: '0.9rem' }}>
                © {new Date().getFullYear()} CASALIZ E.I.R.L. Todos los derechos reservados.
            </div>
        </footer>
    );
}
