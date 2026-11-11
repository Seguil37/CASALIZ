import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import { StudioHero, StudioLabel } from "../../../shared/studio/StudioElements";

export default function HeroSection() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("services");
    const [queries, setQueries] = useState({ services: "", projects: "" });
    const suggestions =
        mode === "services"
            ? [
                  "Diseño de interiores",
                  "Licencias",
                  "Servicios Inmobiliarios",
                  "Topografia",
              ]
            : [
                  "Edificio Multifamiliar Ecologica Plaza",
                  "Casa de Campo Zurite",
                  "Vivienda unifamiliar",
                  "Remodelacion integral",
                  "Oficina comercial",
              ];
    const submit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (queries[mode]) params.set("search", queries[mode]);
        navigate({
            pathname: `/${mode}`,
            search: params.size ? `?${params}` : "",
            hash:
                mode === "services"
                    ? "#servicios-listado"
                    : "#projects-results",
        });
    };
    return (
        <>
            <StudioHero
                home
                eyebrow="ARQUITECTURA / INGENIERÍA / INMOBILIARIA"
                lines={["EL ARTE DE CREAR", "ESPACIOS.", "CASALIZ"]}
                description="Diseñamos, regularizamos y ejecutamos proyectos residenciales y comerciales. Una mirada integral, desde la primera idea hasta la entrega."
                asset="home"
                imageAlt="Render residencial original de la portada de CasaLiz"
                target="home-buscador"
                browseLabel="Ver proyectos"
                browseTo="/projects"
            />
            <section
                className="cz-home-search cz-wrap"
                id="home-buscador"
                aria-label="Encuentra tu servicio o proyecto"
            >
                <div className="cz-home-search-intro">
                    <StudioLabel number="01">
                        TU PRÓXIMO PROYECTO
                    </StudioLabel>
                    <h2>¿Qué espacio tienes en mente?</h2>
                    <p>Encuentra el servicio o la referencia que necesitas para comenzar.</p>
                    <div
                        className="cz-search-tabs"
                        role="group"
                        aria-label="Tipo de búsqueda"
                    >
                        {[
                            ["services", "Servicios"],
                            ["projects", "Proyectos"],
                            ["about", "Empresa"],
                        ].map(([key, label]) => (
                            <button
                                type="button"
                                key={key}
                                aria-pressed={mode === key}
                                onClick={() => setMode(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                {mode === "about" ? (
                    <div className="cz-home-company">
                        <h2>
                            Una sola ruta para
                            <br />
                            <em>diseño, permisos y obra.</em>
                        </h2>
                        <p>
                            Arquitectos e ingenieros coordinan la documentación,
                            el expediente técnico, la supervisión y la
                            ejecución.
                        </p>
                        <div className="cz-actions">
                            <Link className="cz-button" to="/contacto">
                                Hablemos ahora
                                <ArrowUpRight size={17} />
                            </Link>
                            <Link className="cz-link" to="/about#nosotros">
                                Explorar nuestra empresa
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <label htmlFor="home-catalog-search">
                            {mode === "services"
                                ? "Servicio o palabra clave"
                                : "Proyecto, zona o referencia"}
                        </label>
                        <div className="cz-search-row">
                            <input
                                id="home-catalog-search"
                                value={queries[mode]}
                                onChange={(event) =>
                                    setQueries({
                                        ...queries,
                                        [mode]: event.target.value,
                                    })
                                }
                                placeholder={
                                    mode === "services"
                                        ? "Licencias, diseño, topografía…"
                                        : "Cusco, vivienda, remodelación…"
                                }
                            />
                            <button type="submit" className="cz-button">
                                {mode === "services"
                                    ? "Buscar servicios"
                                    : "Buscar proyectos"}
                                <Search size={17} />
                            </button>
                        </div>
                        <div className="cz-search-suggestions">
                            {suggestions.map((suggestion) => (
                                <button
                                    type="button"
                                    key={suggestion}
                                    onClick={() =>
                                        setQueries({
                                            ...queries,
                                            [mode]: suggestion,
                                        })
                                    }
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </form>
                )}
                <div className="cz-home-shortcuts">
                    <Link
                        className="cz-button cz-button-outline"
                        to="/projects"
                    >
                        Ver proyectos
                        <ArrowUpRight size={15} />
                    </Link>
                    <Link
                        className="cz-button cz-button-outline"
                        to="/services"
                    >
                        Explorar servicios
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </section>
        </>
    );
}
