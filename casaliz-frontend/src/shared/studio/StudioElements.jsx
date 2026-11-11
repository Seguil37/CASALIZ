import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicMotion } from "../motion/publicMotionContext";
import home from "../../assets/images/studio/home-cover.webp";
import homeSmall from "../../assets/images/studio/home-cover-800.webp";
import building from "../../assets/images/studio/services/expediente_licencia_construccion.webp";
import buildingSmall from "../../assets/images/studio/expediente_licencia_construccion-800.webp";
import residential from "../../assets/images/studio/services/prescripcion_adquisitiva.webp";
import residentialSmall from "../../assets/images/studio/prescripcion_adquisitiva-800.webp";
import urban from "../../assets/images/studio/services/independizaciones.webp";
import urbanSmall from "../../assets/images/studio/independizaciones-800.webp";
import technical from "../../assets/images/studio/services/visacion_de_planos.webp";
import technicalSmall from "../../assets/images/studio/visacion_de_planos-800.webp";
import interior from "../../assets/images/studio/services/diseno_interiores_3d.webp";
import countryResidence from "../../assets/images/studio/services/casas_de_campo.webp";
import district from "../../assets/images/studio/services/habilitaciones_urbanas.webp";
import declaration from "../../assets/images/studio/services/declaratoria_de_fabrica.webp";
import country from "../../assets/images/studio/country.webp";
import countrySmall from "../../assets/images/studio/country-800.webp";
import side from "../../assets/images/studio/zurite-side.webp";
import sideSmall from "../../assets/images/studio/zurite-side-800.webp";

const media = {
    home: [home, homeSmall, 1024, 1536],
    building: [building, buildingSmall, 1024, 1024],
    residential: [residential, residentialSmall, 1024, 1024],
    urban: [urban, urbanSmall, 957, 1024],
    technical: [technical, technicalSmall, 1100, 688],
    interior: [interior, null, 733, 1100],
    countryResidence: [countryResidence, null, 1100, 619],
    district: [district, null, 930, 525],
    declaration: [declaration, null, 733, 1100],
    country: [country, countrySmall, 1403, 742],
    side: [side, sideSmall, 1600, 900],
};

export function StudioImage({
    asset,
    alt,
    eager = false,
    className = "",
    sizes = "(max-width: 760px) 100vw, 60vw",
}) {
    const [src, small, width, height] = media[asset];
    return (
        <img
            src={src}
            srcSet={small ? `${small} 800w, ${src} ${width}w` : undefined}
            width={width}
            height={height}
            sizes={sizes}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding="async"
            className={className}
        />
    );
}

export function StudioLabel({ number, children }) {
    return (
        <p className="cz-label">
            <span>{number}</span>
            {children}
        </p>
    );
}

export function StudioJump({ target, children, className = "cz-link" }) {
    const { scrollTo } = usePublicMotion();
    return (
        <a
            className={className}
            href={`#${target}`}
            onClick={(event) => {
                event.preventDefault();
                scrollTo(`#${target}`);
            }}
        >
            {children}
            <ArrowDown size={17} aria-hidden="true" />
        </a>
    );
}

export function StudioHero({
    eyebrow,
    lines,
    description,
    asset = "residential",
    imageAlt,
    target,
    browseLabel = "Explorar el estudio",
    browseTo,
    contactLabel = "Hablemos de tu proyecto",
    children,
    home = false,
}) {
    return (
        <section className={`cz-hero${home ? " cz-hero-home" : ""}`}>
            <figure className="cz-hero-backdrop" data-cz-cover>
                <StudioImage asset={asset} alt={imageAlt} eager sizes="100vw" />
            </figure>
            <div className="cz-hero-wash" />
            <div className="cz-grid" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
            </div>
            <div className="cz-wrap cz-hero-layout">
                <div className="cz-hero-copy">
                    <StudioLabel number="CASALIZ">{eyebrow}</StudioLabel>
                    <h1>
                        {lines.map((line, index) => (
                            <span className="cz-mask" key={line}>
                                <span
                                    data-cz-title
                                    className={
                                        index === lines.length - 1
                                            ? "cz-accent"
                                            : ""
                                    }
                                >
                                    {line}
                                    {index < lines.length - 1 ? " " : ""}
                                </span>
                            </span>
                        ))}
                    </h1>
                    <p className="cz-hero-description" data-cz-reveal>
                        {description}
                    </p>
                    <div className="cz-actions" data-cz-reveal>
                        <Link className="cz-button" to="/contacto">
                            {contactLabel}
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                        {browseTo ? (
                            <Link
                                className="cz-button cz-button-outline"
                                to={browseTo}
                            >
                                {browseLabel}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        ) : (
                            <StudioJump
                                className="cz-button cz-button-outline"
                                target={target}
                            >
                                {browseLabel}
                            </StudioJump>
                        )}
                    </div>
                </div>
                {children && (
                    <div className="cz-hero-panel" data-cz-reveal>
                        {children}
                    </div>
                )}
            </div>
            <div className="cz-wrap cz-hero-bottom">
                <span>ARQUITECTOS E INGENIEROS</span>
                <span>CUSCO, PERÚ</span>
                <span>DISEÑO QUE SE HABITA ↘</span>
            </div>
        </section>
    );
}

export function StudioClosing({
    asset = "side",
    imageAlt = "Render de vivienda del archivo visual CasaLiz",
    caption = "ARQUITECTURA RESIDENCIAL / ARCHIVO VISUAL CASALIZ",
}) {
    return (
        <section className="cz-closing">
            <figure data-cz-image>
                <StudioImage asset={asset} alt={imageAlt} sizes="100vw" />
            </figure>
            <div className="cz-closing-shade" />
            <div className="cz-wrap cz-closing-copy">
                <StudioLabel number="↗">
                    UNA IDEA. UN NUEVO COMIENZO.
                </StudioLabel>
                <h2 data-cz-reveal>
                    Tu próximo espacio
                    <br />
                    <em>comienza aquí.</em>
                </h2>
                <Link to="/contacto" className="cz-button cz-button-light">
                    Hablemos de tu proyecto
                    <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <span className="cz-closing-caption">{caption}</span>
            </div>
        </section>
    );
}
