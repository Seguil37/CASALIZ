import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

export default function ProyectoDetalle() {
  const { id } = useParams();
  const { data: projects = [] } = useProjects();

  const project = useMemo(() => projects.find((item) => String(item.id) === id), [projects, id]);

  if (!project) {
    return (
      <section className="container">
        <p className="section-subtitle">Cargando proyecto...</p>
      </section>
    );
  }

  return (
    <section className="container">
      <div className="section-header">
        <p className="badge">Proyecto</p>
        <h2 className="section-title">{project.name}</h2>
        <p className="section-subtitle">{project.project_type}</p>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
        {project.image_url && <img src={project.image_url} alt={project.name} />}
        <p>{project.description}</p>
        <div className="meta">Ubicación: {project.location}</div>
        {project.area && <div className="meta">Área: {project.area} m²</div>}
      </div>
    </section>
  );
}
