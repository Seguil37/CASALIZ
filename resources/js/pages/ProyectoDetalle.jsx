import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

const fetchProject = async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
};

export default function ProyectoDetalle() {
    const { id } = useParams();
    const { data: project } = useQuery({ queryKey: ['project', id], queryFn: () => fetchProject(id), enabled: Boolean(id) });

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
                <p className="badge">{project.project_type}</p>
                <h2 className="section-title">{project.name}</h2>
                <p className="section-subtitle">{project.location}</p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                <div className="card">
                    {project.image_url && <img src={project.image_url} alt={project.name} style={{ height: 260 }} />}
                    <div className="meta">Área: {project.area}</div>
                    <div className="meta">Estado: {project.status}</div>
                </div>
                <div className="card">
                    <h3>Descripción</h3>
                    <p>{project.description}</p>
                    <div className="badge" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                        Proyecto en {project.location}
                    </div>
                </div>
            </div>
        </section>
    );
}
