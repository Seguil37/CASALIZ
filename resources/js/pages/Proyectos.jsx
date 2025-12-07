import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

export default function Proyectos() {
    const { data: projects = [] } = useProjects();

    return (
        <section className="container">
            <div className="section-header">
                <p className="badge">Portafolio</p>
                <h2 className="section-title">Proyectos que reflejan precisión y carácter</h2>
                <p className="section-subtitle">Residencial, corporativo, hospitalidad y equipamiento público.</p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {projects.map((project) => (
                    <Link key={project.id} to={`/proyectos/${project.id}`} className="card" style={{ textDecoration: 'none' }}>
                        {project.image_url && <img src={project.image_url} alt={project.name} />}
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <div className="meta">{project.location}</div>
                        <div className="meta">{project.project_type}</div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
