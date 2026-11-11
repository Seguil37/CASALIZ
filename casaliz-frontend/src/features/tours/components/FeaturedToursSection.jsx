import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import api from "../../../shared/utils/api";
import { StudioLabel } from "../../../shared/studio/StudioElements";
import ProjectCollage from "./ProjectCollage";

export default function FeaturedToursSection() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        api.get("/projects/featured")
            .then((response) => {
                const rows = response.data?.data ?? response.data ?? [];
                if (active)
                    setProjects(Array.isArray(rows) ? rows.slice(0, 8) : []);
            })
            .catch((error) => console.error("Error fetching projects:", error))
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);
    return (
        <section className="cz-home-projects cz-section">
            <div className="cz-wrap">
                <div className="cz-home-section-heading">
                    <div>
                        <StudioLabel number="↗">
                            PORTAFOLIO DESTACADO
                        </StudioLabel>
                        <h2 data-cz-reveal>
                            Ideas que encuentran
                            <br />
                            <em>su propia forma.</em>
                        </h2>
                    </div>
                    <Link to="/projects" className="cz-link">
                        Ver todos los proyectos
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
                {loading ? (
                    <p role="status">Cargando proyectos…</p>
                ) : projects.length ? (
                    <ProjectCollage projects={projects} />
                ) : (
                    <p>
                        Explora las categorías para conocer los proyectos
                        publicados.
                    </p>
                )}
            </div>
        </section>
    );
}
