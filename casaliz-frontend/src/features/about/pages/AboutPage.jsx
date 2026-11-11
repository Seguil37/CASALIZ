import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
    StudioHero,
    StudioImage,
    StudioLabel,
    StudioClosing,
} from "../../../shared/studio/StudioElements";
import useStudioMotion from "../../../shared/studio/useStudioMotion";
import "./AboutPage.css";

const disciplines = [
    {
        number: "01",
        title: "Arquitectura",
        headline: "Imaginar nuevas formas de vivir.",
        text: "Diseño y conceptualización, anteproyecto, modelado 3D e interiorismo. Espacios habitables, eficientes y alineados con la identidad de cada cliente.",
        asset: "countryResidence",
        alt: "Render de vivienda de campo del archivo visual de CasaLiz",
        caption: "ARQUITECTURA RESIDENCIAL / ARCHIVO VISUAL CASALIZ",
        className: "",
    },
    {
        number: "02",
        title: "Ingeniería",
        headline: "La precisión también se diseña.",
        text: "Coordinación de especialidades, expedientes técnicos y gestión de licencias. Criterio técnico y normativo para dar sustento a cada decisión.",
        asset: "technical",
        alt: "Planos arquitectónicos del repertorio visual de servicios CasaLiz",
        caption: "DOCUMENTACIÓN TÉCNICA / ARCHIVO VISUAL CASALIZ",
        className: "cz-discipline-plan",
    },
    {
        number: "03",
        title: "Ejecución",
        headline: "Una visión que acompaña cada etapa.",
        text: "Dirección de obra y supervisión. Seguimiento en campo, control de avances, seguridad y coordinación de proveedores para una ejecución integral.",
        asset: "building",
        alt: "Visualización de edificio y estructura en construcción del archivo CasaLiz",
        caption: "DISEÑO Y CONSTRUCCIÓN / VISUALIZACIÓN ARQUITECTÓNICA",
        className: "cz-discipline-section",
    },
];

export default function AboutPage() {
    const rootRef = useRef(null);
    useStudioMotion(rootRef);
    return (
        <div className="cz-page cz-about" ref={rootRef}>
            <StudioHero
                eyebrow="EL ESTUDIO / NOSOTROS"
                lines={["DISEÑAMOS", "FORMAS DE", "HABITAR."]}
                description="Arquitectura, ingeniería y gestión inmobiliaria. Conectamos ideas, personas y espacios con una mirada integral."
                asset="residential"
                imageAlt="Render de vivienda contemporánea del repertorio de CasaLiz"
                target="nosotros"
                browseLabel="Conocer el estudio"
            />
            <section
                className="cz-wrap cz-section cz-intro"
                aria-labelledby="studio-intro"
            >
                <StudioLabel number="01">QUIÉNES SOMOS</StudioLabel>
                <div className="cz-intro-heading" id="nosotros">
                    <h2 id="studio-intro" data-cz-reveal>
                        Cada espacio
                        <br />
                        comienza con <em>una idea.</em>
                    </h2>
                    <span className="cz-drawing-mark" aria-hidden="true">
                        ↗
                    </span>
                </div>
                <div className="cz-intro-grid">
                    <figure data-cz-image>
                        <StudioImage
                            asset="interior"
                            alt="Comedor e interior residencial del repertorio visual de CasaLiz"
                        />
                        <figcaption>DISEÑO / LUZ / ESPACIO</figcaption>
                    </figure>
                    <div className="cz-intro-copy">
                        <p className="cz-lead" data-cz-reveal>
                            Diseñar es entender
                            <br />
                            cómo quieres habitar.
                        </p>
                        <p data-cz-reveal>
                            En CasaLiz entendemos la arquitectura como una
                            herramienta para ordenar, proyectar y mejorar la
                            forma en que las personas habitan y usan sus
                            espacios.
                        </p>
                        <p data-cz-reveal>
                            Combinamos criterio técnico, visión creativa y una
                            gestión cercana. Integramos arquitectura,
                            ingeniería, ejecución de proyectos y gestión
                            inmobiliaria: desde la conceptualización y la
                            gestión normativa hasta la dirección de obra y el
                            interiorismo.
                        </p>
                        <Link to="/services" className="cz-link">
                            Conoce nuestras especialidades
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                        <div className="cz-intro-signature">
                            <span>DISEÑO CON SENSIBILIDAD.</span>
                            <span>PRECISIÓN EN CADA DECISIÓN.</span>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="cz-manifesto cz-wrap cz-section"
                aria-labelledby="philosophy-title"
            >
                <div className="cz-rule" data-cz-line />
                <StudioLabel number="02">
                    EL ESPACIO COMO EXPERIENCIA
                </StudioLabel>
                <h2 id="philosophy-title">
                    <span>
                        No diseñamos
                        <br />
                        únicamente edificios.
                    </span>
                    <span>Diseñamos experiencias</span>
                    <span>
                        <em>que acompañan la vida.</em>
                    </span>
                </h2>
                <div className="cz-manifesto-foot">
                    <span>PERSONAS / ESPACIO / ENTORNO</span>
                    <span aria-hidden="true">+ &nbsp; + &nbsp; +</span>
                </div>
            </section>
            <section
                className="cz-disciplines cz-section"
                aria-labelledby="disciplines-title"
            >
                <div className="cz-wrap">
                    <div className="cz-section-heading">
                        <StudioLabel number="03">NUESTRA ESENCIA</StudioLabel>
                        <h2 id="disciplines-title" data-cz-reveal>
                            Libertad para imaginar.
                            <br />
                            <em>Rigor para resolver.</em>
                        </h2>
                    </div>
                    {disciplines.map((item) => (
                        <article
                            className={`cz-discipline ${item.className}`}
                            key={item.number}
                        >
                            <div className="cz-discipline-title" data-cz-reveal>
                                <span>{item.number}</span>
                                <h3>{item.title}</h3>
                            </div>
                            <div className="cz-discipline-content">
                                <figure data-cz-image>
                                    <StudioImage
                                        asset={item.asset}
                                        alt={item.alt}
                                    />
                                    <figcaption>{item.caption}</figcaption>
                                </figure>
                                <div
                                    className="cz-discipline-copy"
                                    data-cz-reveal
                                >
                                    <h4>{item.headline}</h4>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section
                className="cz-project-pair cz-wrap cz-section"
                aria-labelledby="archive-title"
            >
                <div className="cz-section-heading">
                    <StudioLabel number="04">DEL ARCHIVO CASALIZ</StudioLabel>
                    <h2 id="archive-title" data-cz-reveal>
                        Dos contextos.
                        <br />
                        <em>Una mirada integral.</em>
                    </h2>
                </div>
                <div className="cz-project-pair-grid">
                    <Link to="/services?search=Viviendas#servicios-listado">
                        <figure data-cz-image>
                            <StudioImage
                                asset="declaration"
                                alt="Fachada de edificio residencial del repertorio de CasaLiz"
                            />
                        </figure>
                        <div>
                            <span>01 / RESIDENCIAL URBANO</span>
                            <h3>
                                Arquitectura residencial
                                <ArrowUpRight size={23} aria-hidden="true" />
                            </h3>
                            <p>Archivo visual CasaLiz · Diseño de viviendas</p>
                        </div>
                    </Link>
                    <Link to="/projects/1">
                        <figure data-cz-image>
                            <StudioImage
                                asset="side"
                                alt="Render de fachada lateral de Casa de Campo Zurite"
                            />
                        </figure>
                        <div>
                            <span>02 / CASA DE CAMPO</span>
                            <h3>
                                Casa de Campo Zurite
                                <ArrowUpRight size={23} aria-hidden="true" />
                            </h3>
                            <p>Zurite, Cusco · Visualización arquitectónica</p>
                        </div>
                    </Link>
                </div>
            </section>
            <section className="cz-principles cz-section">
                <div className="cz-wrap">
                    <StudioLabel number="05">LO QUE NOS GUÍA</StudioLabel>
                    <article data-cz-reveal>
                        <span className="cz-principle-number">01</span>
                        <h2>
                            Nuestra
                            <br />
                            <em>misión.</em>
                        </h2>
                        <p>
                            Transformar ideas en espacios funcionales, estéticos
                            y viables, acompañando a cada cliente desde la
                            estrategia inicial hasta la ejecución final con
                            rigor técnico, transparencia y sensibilidad
                            arquitectónica.
                        </p>
                    </article>
                    <article data-cz-reveal>
                        <span className="cz-principle-number">02</span>
                        <h2>
                            Nuestra
                            <br />
                            <em>visión.</em>
                        </h2>
                        <p>
                            Consolidarnos como un estudio referente en
                            arquitectura y gestión integral de proyectos,
                            reconocido por crear soluciones sostenibles, humanas
                            y bien ejecutadas que generen valor real para las
                            personas y su entorno.
                        </p>
                    </article>
                    <div className="cz-values">
                        <span>Rigor técnico</span>
                        <span>Transparencia</span>
                        <span>Sensibilidad arquitectónica</span>
                        <span>Sostenibilidad</span>
                    </div>
                </div>
            </section>
            <StudioClosing asset="urban" imageAlt="Render de edificio residencial del repertorio visual de CasaLiz" />
        </div>
    );
}
