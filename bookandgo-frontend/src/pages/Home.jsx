import { ArrowRight, Building2, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useServices } from '../hooks/useServices';

const highlights = [
  { icon: <ShieldCheck color="#0f4c81" />, title: 'Normativa y permisos', text: 'Expedientes y licencias con control de hitos.' },
  { icon: <Compass color="#0f4c81" />, title: 'Diseño con identidad', text: 'Espacios que responden al contexto peruano.' },
  { icon: <Building2 color="#0f4c81" />, title: 'Seguimiento ejecutivo', text: 'Supervisión y reportes claros para clientes.' },
];

export default function Home() {
  const { data: services = [] } = useServices();
  const { data: projects = [] } = useProjects();

  const featuredProjects = projects.slice(0, 3);
  const topServices = services.slice(0, 3);

  return (
    <>
      <section className="hero container">
        <div>
          <span className="badge">
            <Sparkles size={16} /> Estudio de arquitectura peruano
          </span>
          <h1 className="hero-title">Espacios que construyen confianza y valor</h1>
          <p className="hero-subtitle">
            CASALIZ E.I.R.L. diseña, documenta y supervisa proyectos residenciales, corporativos y públicos con una mirada integral: estética, normativa y ejecución alineadas.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/contacto" className="btn btn-primary">
              Solicitar asesoría <ArrowRight size={18} />
            </Link>
            <Link to="/proyectos" className="btn btn-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>
              Ver proyectos
            </Link>
          </div>
          <div className="pill-strip" style={{ marginTop: '1.5rem' }}>
            <div className="pill">Arquitectura &amp; gestión integral</div>
            <div className="pill">Tramitología y licencias</div>
            <div className="pill">Supervisión de obra</div>
            <div className="pill">Asesoría ejecutiva</div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <strong>Entregables claros</strong>
            <p>Planos, renders y cronogramas listos para presentar a clientes, bancos o municipalidades.</p>
            <div className="hero-pillars">
              <li>Control de calidad y normativa</li>
              <li>Diseño contemporáneo peruano</li>
              <li>Equipo multidisciplinario</li>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="highlight-grid">
          {highlights.map((item) => (
            <div key={item.title} className="highlight-card">
              {item.icon}
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <p className="badge">Servicios principales</p>
          <h2 className="section-title">Soluciones integrales para tu proyecto</h2>
          <p className="section-subtitle">Documentos listos para licitar, tramitar y ejecutar sin fricciones.</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {topServices.map((service) => (
            <div key={service.slug} className="card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="badge" style={{ alignSelf: 'flex-start' }}>
                {service.icon?.replace('-', ' ') || 'CASALIZ'}
              </span>
            </div>
          ))}
        </div>
        <Link to="/servicios" className="btn btn-secondary" style={{ marginTop: '1.4rem' }}>
          Ver todos los servicios
        </Link>
      </section>

      <section className="container">
        <div className="section-header">
          <p className="badge">Proyectos</p>
          <h2 className="section-title">Selección de proyectos destacados</h2>
          <p className="section-subtitle">Arquitectura contemporánea pensada para Perú.</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {featuredProjects.map((project) => (
            <div key={project.id} className="card">
              {project.image_url && <img src={project.image_url} alt={project.name} />}
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="meta">{project.location}</div>
              <div className="meta">{project.project_type}</div>
            </div>
          ))}
        </div>
        <Link to="/proyectos" className="btn btn-primary" style={{ marginTop: '1.4rem' }}>
          Ver portafolio completo
        </Link>
      </section>
    </>
  );
}
