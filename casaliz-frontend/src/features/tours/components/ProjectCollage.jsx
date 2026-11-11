import TourCard from "./TourCard";

export default function ProjectCollage({ projects }) {
    return (
        <div
            className="cz-project-collage"
            aria-label="Portadas de proyectos destacados"
        >
            <div className="cz-project-covers">
                {projects.map((project, index) => (
                    <article
                        className="cz-project-cover-entry"
                        key={project.id}
                        data-motion-card
                    >
                        <div className="cz-project-index">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <span>PROYECTO DESTACADO</span>
                        </div>
                        <TourCard tour={project} />
                    </article>
                ))}
            </div>
        </div>
    );
}
