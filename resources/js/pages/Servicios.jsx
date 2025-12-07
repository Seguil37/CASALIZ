import { useServices } from '../hooks/useServices';

export default function Servicios() {
    const { data: services = [] } = useServices();

    return (
        <section className="container">
            <div className="section-header">
                <p className="badge">Servicios</p>
                <h2 className="section-title">Arquitectura y gestión integral</h2>
                <p className="section-subtitle">
                    Diseñamos, tramitamos y supervisamos con una metodología clara y colaborativa.
                </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {services.map((service) => (
                    <div key={service.slug} className="card">
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <span className="badge" style={{ alignSelf: 'flex-start' }}>
                            {service.icon?.replace('-', ' ') || 'CASALIZ'}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
