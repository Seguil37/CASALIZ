// src/features/about/pages/AboutPage.jsx
import { Users, Compass, Target, ShieldCheck } from 'lucide-react';

const team = [
  { name: 'Arq. Lucía Salazar', role: 'Directora de Diseño', focus: 'Diseño bioclimático y normativas urbanas' },
  { name: 'Ing. Marco Alva', role: 'Director de Ingeniería', focus: 'Estructuras sismo-resistentes y supervisión' },
  { name: 'Ing. Verónica Díaz', role: 'Gestión de Proyectos', focus: 'PMI, licitaciones y control de calidad' },
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="section bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container-custom space-y-3">
          <p className="badge-accent">Nosotros</p>
          <h1 className="text-4xl font-black text-slate-900">CASALIZ, arquitectura e ingeniería que cuida los detalles</h1>
          <p className="text-lg text-slate-600 max-w-4xl">
            Nuestra misión es diseñar y gestionar proyectos seguros, eficientes y alineados a las normativas peruanas. Acompañamos a nuestros clientes
            desde la idea hasta la entrega de obra, priorizando transparencia y comunicación.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container-custom grid md:grid-cols-3 gap-5">
          {[{ title: 'Misión', icon: Compass, text: 'Desarrollar proyectos que equilibren funcionalidad, estética y sostenibilidad.' },
            { title: 'Visión', icon: Target, text: 'Ser aliados estratégicos en arquitectura e ingeniería confiable en Perú.' },
            { title: 'Valores', icon: ShieldCheck, text: 'Integridad, seguridad, cumplimiento normativo y foco en el usuario.' }].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-2xl card-shadow p-6 space-y-3">
              <item.icon className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section bg-slate-50">
        <div className="container-custom space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-orange-500" />
            <div>
              <p className="badge-accent">Equipo</p>
              <h2 className="text-3xl font-black text-slate-900">Profesionales a tu lado</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-white font-black text-lg flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>
                <p className="text-lg font-bold text-slate-900">{member.name}</p>
                <p className="text-sm text-orange-600 font-semibold">{member.role}</p>
                <p className="text-sm text-slate-600">{member.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
