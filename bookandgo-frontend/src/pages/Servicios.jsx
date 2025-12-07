import { useServices } from '../hooks/useServices';

export default function Servicios() {
  const { data: services = [] } = useServices();

  return (
    <section className="container">
      <div className="section-header">
        <p className="badge">Servicios</p>
        <h2 className="section-title">Arquitectura y gestión integral</h2>
        <p className="section-subtitle">Desde concepto hasta supervisión de obra y licencias.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {services.map((service) => (
          <div key={service.slug} className="card">
            <div className="pill" style={{ background: 'rgba(15, 76, 129, 0.1)', color: 'var(--secondary)' }}>
              {service.icon?.replace('-', ' ') || 'CASALIZ'}
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
