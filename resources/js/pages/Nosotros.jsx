import { Lightbulb, Target } from 'lucide-react';
import { mission, team, values, vision } from '../data/company';

export default function Nosotros() {
    return (
        <section className="container">
            <div className="section-header">
                <p className="badge">Nosotros</p>
                <h2 className="section-title">CASALIZ E.I.R.L.</h2>
                <p className="section-subtitle">
                    Estudio de arquitectura peruano que combina diseño, normativa y gestión de obra.
                </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: '2rem' }}>
                <div className="card">
                    <h3>
                        <Target size={18} /> Misión
                    </h3>
                    <p>{mission}</p>
                </div>
                <div className="card">
                    <h3>
                        <Lightbulb size={18} /> Visión
                    </h3>
                    <p>{vision}</p>
                </div>
            </div>

            <div className="section-header">
                <h3 className="section-title">Valores</h3>
                <p className="section-subtitle">Sostenibilidad, colaboración y claridad técnica.</p>
            </div>
            <ul className="values">
                {values.map((value) => (
                    <li key={value.title}>
                        <strong style={{ color: 'var(--secondary)' }}>{value.title}</strong>
                        <p style={{ margin: '0.4rem 0 0' }}>{value.description}</p>
                    </li>
                ))}
            </ul>

            <div className="section-header" style={{ marginTop: '2.5rem' }}>
                <h3 className="section-title">Nuestro equipo</h3>
                <p className="section-subtitle">Arquitectos e ingenieros comprometidos con proyectos ejecutables.</p>
            </div>
            <div className="team-grid">
                {team.map((member) => (
                    <div key={member.name} className="team-card">
                        <div className="brand-mark" style={{ margin: '0 auto' }}>
                            {member.name
                                .split(' ')
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join('')}
                        </div>
                        <h4>{member.name}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{member.role}</p>
                        <p style={{ marginTop: '0.6rem' }}>{member.bio}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
