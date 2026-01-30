import { useMemo, useState } from 'react';
import { ClipboardList, Calendar, UserCheck } from 'lucide-react';
import { tramiteTemplates, teamMembers } from '../data/tramitesData';

const TramiteCreatePage = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(tramiteTemplates[0]?.id || '');

  const selectedTemplate = useMemo(
    () => tramiteTemplates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId]
  );

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#233274] mb-2">Registro de Trámite / Proyecto</h1>
          <p className="text-[#9a98a0]">
            Crea un trámite real para un cliente y copia automáticamente la estructura base desde la plantilla.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <form className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <SectionTitle icon={ClipboardList} title="Datos principales" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre del trámite/proyecto" placeholder="Ej. Licencia de Obra - Torre San Isidro" />
              <Field label="Cliente / Propietario" placeholder="Ej. Constructora Miraflores SAC" />
              <Field label="Nombre del inmueble" placeholder="Ej. Torre San Isidro" />
              <Field label="Ubicación del inmueble" placeholder="Ej. Av. República de Panamá 2450" />
              <Field label="Código interno" placeholder="Ej. TR-003" />
              <div>
                <label className="text-sm font-semibold text-[#233274] mb-2 block">Responsable general</label>
                <select className="w-full border border-[#ebe7df] rounded-xl px-4 py-2">
                  {teamMembers.map((member) => (
                    <option key={member}>{member}</option>
                  ))}
                </select>
              </div>
            </div>

            <SectionTitle icon={Calendar} title="Fechas y estado" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field type="date" label="Fecha de creación" />
              <Field type="date" label="Fecha de inicio" />
              <Field type="date" label="Fecha estimada de fin" />
              <div>
                <label className="text-sm font-semibold text-[#233274] mb-2 block">Estado general</label>
                <select className="w-full border border-[#ebe7df] rounded-xl px-4 py-2">
                  <option>Pendiente</option>
                  <option>En proceso</option>
                  <option>Observado</option>
                  <option>Aprobado</option>
                  <option>Finalizado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274] mb-2 block">Modo / Situación</label>
                <input
                  type="text"
                  placeholder="Ej. Pendiente de dictamen municipal"
                  className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
                />
              </div>
            </div>

            <SectionTitle icon={UserCheck} title="Plantilla base" />
            <div>
              <label className="text-sm font-semibold text-[#233274] mb-2 block">Tipo de trámite</label>
              <select
                value={selectedTemplateId}
                onChange={(event) => setSelectedTemplateId(event.target.value)}
                className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
              >
                {tramiteTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#f8f5ef] rounded-xl p-4">
              <p className="text-sm text-[#9a98a0] mb-3">
                Al registrar el trámite se copiarán automáticamente estas fases y subfases:
              </p>
              <ul className="space-y-2">
                {selectedTemplate?.phases.map((phase) => (
                  <li key={phase.id} className="text-sm text-[#233274]">
                    <span className="font-semibold">{phase.name}</span>
                    <span className="text-[#9a98a0]"> ({phase.subphases.length} subfases)</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
              Guardar trámite
            </button>
          </form>

          <aside className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#233274]">Checklist de creación</h2>
            <ul className="space-y-3 text-sm text-[#233274]">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e15f0b] mt-2"></span>
                Validar datos del cliente y ubicación.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e15f0b] mt-2"></span>
                Definir responsable general y estado inicial.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e15f0b] mt-2"></span>
                Seleccionar plantilla para copiar fases y subfases.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e15f0b] mt-2"></span>
                Registrar fechas de inicio y fin estimado.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 text-[#233274]">
    <Icon className="w-5 h-5" />
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

const Field = ({ label, placeholder = '', type = 'text' }) => (
  <div>
    <label className="text-sm font-semibold text-[#233274] mb-2 block">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-[#ebe7df] rounded-xl px-4 py-2"
    />
  </div>
);

export default TramiteCreatePage;
