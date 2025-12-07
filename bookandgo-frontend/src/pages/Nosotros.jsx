import { mission, vision, values, team } from '../data/company';

export default function Nosotros() {
  return (
    <section className="container">
      <div className="section-header">
        <p className="badge">Nosotros</p>
        <h2 className="section-title">Arquitectura con precisión y propósito</h2>
        <p className="section-subtitle">CASALIZ E.I.R.L. es un estudio peruano que combina diseño, normativa y ejecución.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <h3>Misión</h3>
          <p>{mission}</p>
        </div>
        <div className="card">
          <h3>Visión</h3>
          <p>{vision}</p>
        </div>
        <div className="card">
          <h3>Valores</h3>
          <ul className="pillars">
            {values.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: '3rem' }}>
        <p className="badge">Nuestro equipo</p>
        <h2 className="section-title">Liderazgo y coordinación</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {team.map((member) => (
          <div key={member.name} className="card">
            <h3>{member.name}</h3>
            <p className="meta">{member.role}</p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
