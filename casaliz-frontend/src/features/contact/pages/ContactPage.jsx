import { useRef } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import {
    StudioImage,
    StudioJump,
    StudioLabel,
} from "../../../shared/studio/StudioElements";
import useStudioMotion from "../../../shared/studio/useStudioMotion";
import "./ContactPage.css";

const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=CasaLiz+Arquitectos+Ingenieros+Wanchaq+Cusco";
const mapsEmbed =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.5035743018245!2d-71.96059956528927!3d-13.523442715970118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5fdb208814b%3A0xccb5144368db6c15!2sCasaLiz%20%E2%80%93%20Arquitectos%20%E2%80%93%20Ingenieros!5e0!3m2!1ses-419!2spe!4v1765583209300!5m2!1ses-419!2spe";

export default function ContactPage() {
    const rootRef = useRef(null);
    useStudioMotion(rootRef);
    return (
        <div className="cz-page cz-contact" ref={rootRef}>
            <section className="cz-wrap cz-contact-intro">
                <figure className="cz-contact-backdrop" data-cz-cover>
                    <StudioImage
                        asset="interior"
                        alt="Interior residencial con comedor del archivo visual de CasaLiz"
                        eager
                        sizes="100vw"
                    />
                </figure>
                <div className="cz-contact-wash" aria-hidden="true" />
                <StudioLabel number="CASALIZ">
                    CONTACTO / UN NUEVO COMIENZO
                </StudioLabel>
                <div className="cz-contact-heading">
                    <h1>
                        {["TODO EMPIEZA", "CON UNA", "CONVERSACIÓN."].map(
                            (line, index) => (
                                <span className="cz-mask" key={line}>
                                    <span
                                        data-cz-title
                                        className={
                                            index === 2 ? "cz-accent" : ""
                                        }
                                    >
                                        {line}
                                    </span>
                                </span>
                            ),
                        )}
                    </h1>
                    <div>
                        <p data-cz-reveal>
                            Una vivienda, una remodelación, una licencia o un
                            proyecto inmobiliario. Cuéntanos lo que imaginas.
                            Démosle forma juntos.
                        </p>
                        <a
                            className="cz-button"
                            href="https://tinyurl.com/CasalizArquitectura"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Escribir por WhatsApp
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                        <StudioJump
                            target="ubicacion"
                            className="cz-link cz-location-jump"
                        >
                            Ver ubicación
                        </StudioJump>
                    </div>
                </div>
                <div className="cz-contact-strip">
                    <a href="tel:+51984696802">
                        <Phone size={18} aria-hidden="true" />
                        +51 984 696 802
                        <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    <a href="mailto:lissyosores@hotmail.com">
                        <Mail size={18} aria-hidden="true" />
                        lissyosores@hotmail.com
                        <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    <span>CUSCO, PERÚ</span>
                </div>
            </section>
            <section className="cz-contact-location cz-section">
                <div className="cz-wrap">
                    <div className="cz-contact-location-heading">
                        <StudioLabel number="01">
                            NOS ENCUENTRAS AQUÍ
                        </StudioLabel>
                        <h2 data-cz-reveal>
                            Un lugar para
                            <br />
                            <em>imaginar el tuyo.</em>
                        </h2>
                    </div>
                    <div id="ubicacion" className="cz-location-grid">
                        <div className="cz-address">
                            <span>EL ESTUDIO / WANCHAQ</span>
                            <h3>
                                Av. Lloque
                                <br />
                                Yupanqui.
                            </h3>
                            <p>
                                Edificio Ecological Plaza
                                <br />
                                2do. nivel, Oficina 202
                                <br />
                                Wanchaq, Cusco, Perú
                            </p>
                            <a
                                href={mapsUrl}
                                className="cz-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Cómo llegar
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </a>
                            <p className="cz-office-hours">
                                Lun – Vie: 9:00 AM – 6:00 PM
                            </p>
                            <div className="cz-contact-social">
                                <a
                                    href="https://www.facebook.com/CASALIZEIRL"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook ↗
                                </a>
                                <a
                                    href="https://tinyurl.com/CasalizArquitectura"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp ↗
                                </a>
                            </div>
                        </div>
                        <div className="cz-contact-map">
                            <iframe
                                src={mapsEmbed}
                                title="Ubicación de CasaLiz en Wanchaq, Cusco"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir en Google Maps
                                <ArrowUpRight size={17} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="cz-contact-photo">
                <figure data-cz-image>
                    <StudioImage
                        asset="declaration"
                        alt="Render de fachada residencial del repertorio visual CasaLiz"
                        sizes="100vw"
                    />
                </figure>
                <span>DE UNA CONVERSACIÓN, A UN ESPACIO QUE SE VIVE.</span>
            </section>
        </div>
    );
}
