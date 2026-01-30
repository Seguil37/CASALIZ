import { useMemo, useState } from 'react';
import { ClipboardCheck, Save, UserPlus } from 'lucide-react';
import {
  priorityOptions,
  procedureTemplates,
  staffMembers,
  statusOptions,
  taskStatusOptions,
} from '../data/mockData';

const buildAssignments = (template) => {
  if (!template) return [];
  return template.phases.flatMap((phase) =>
    phase.subphases.map((subphase) => ({
      id: `${phase.id}-${subphase.id}`,
      phaseName: phase.name,
      subphaseName: subphase.name,
      required: subphase.required,
      responsibleId: staffMembers[0]?.id || '',
      dueDate: '',
      priority: 'Media',
      status: 'Pendiente',
      progress: 0,
      comments: '',
    }))
  );
};

const ProcedureRegistryPage = () => {
  const [formValues, setFormValues] = useState({
    templateId: procedureTemplates[0]?.id || '',
    name: '',
    client: '',
    propertyName: '',
    location: '',
    generalResponsible: staffMembers[0]?.name || '',
    status: 'Pendiente',
    createdAt: new Date().toISOString().split('T')[0],
    startDate: '',
    estimatedEndDate: '',
    actualEndDate: '',
  });

  const activeTemplate = useMemo(
    () => procedureTemplates.find((template) => template.id === formValues.templateId),
    [formValues.templateId]
  );

  const [assignments, setAssignments] = useState(buildAssignments(activeTemplate));

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setFormValues((prev) => ({ ...prev, templateId }));
    const template = procedureTemplates.find((item) => item.id === templateId);
    setAssignments(buildAssignments(template));
  };

  const handleAssignmentChange = (assignmentId, field, value) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, [field]: value } : assignment
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#233274] mb-2">Registro de trámite</h1>
          <p className="text-[#9a98a0]">
            Crea instancias por cliente a partir de una plantilla y asigna responsables por subfase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-[#233274] font-bold mb-4">
              <ClipboardCheck className="w-5 h-5" />
              Datos principales
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#233274]">Plantilla</label>
                <select
                  value={formValues.templateId}
                  onChange={handleTemplateChange}
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                >
                  {procedureTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Trámite / Proyecto</label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Nombre para identificar"
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Cliente / Propietario</label>
                <input
                  type="text"
                  value={formValues.client}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, client: event.target.value }))}
                  placeholder="Razón social o persona"
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Inmueble / Establecimiento</label>
                <input
                  type="text"
                  value={formValues.propertyName}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, propertyName: event.target.value }))
                  }
                  placeholder="Nombre del inmueble"
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Ubicación</label>
                <input
                  type="text"
                  value={formValues.location}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="Distrito, ciudad"
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Responsable general</label>
                <select
                  value={formValues.generalResponsible}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, generalResponsible: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                >
                  {staffMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name} · {member.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Estado general</label>
                <select
                  value={formValues.status}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Fecha de creación</label>
                <input
                  type="date"
                  value={formValues.createdAt}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, createdAt: event.target.value }))}
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Fecha de inicio</label>
                <input
                  type="date"
                  value={formValues.startDate}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, startDate: event.target.value }))}
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Fecha estimada fin</label>
                <input
                  type="date"
                  value={formValues.estimatedEndDate}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, estimatedEndDate: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#233274]">Fecha fin real</label>
                <input
                  type="date"
                  value={formValues.actualEndDate}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, actualEndDate: event.target.value }))}
                  className="w-full rounded-lg border border-[#ebe7df] px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-[#233274] font-bold mb-4">
              <UserPlus className="w-5 h-5" />
              Checklist de fases
            </div>
            {activeTemplate ? (
              <div className="space-y-4">
                {activeTemplate.phases.map((phase) => (
                  <div key={phase.id} className="border border-[#ebe7df] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-[#233274]">{phase.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${phase.required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {phase.required ? 'Obligatoria' : 'Opcional'}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-[#233274]">
                      {phase.subphases.map((subphase) => (
                        <li key={subphase.id} className="flex items-center justify-between">
                          <span>{subphase.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${subphase.required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {subphase.required ? 'Obligatoria' : 'Opcional'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9a98a0]">Selecciona una plantilla para visualizar fases.</p>
            )}
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-black text-[#233274]">Asignación de tareas por subfase</h2>
              <p className="text-sm text-[#9a98a0]">
                Asigna responsables, fechas límite y estado para cada subfase del trámite.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-gradient-primary text-[#233274] font-semibold px-4 py-2 rounded-lg"
            >
              <Save className="w-4 h-4" />
              Guardar trámite
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#233274]">
                  <th className="py-3">Fase</th>
                  <th>Subfase</th>
                  <th>Responsable</th>
                  <th>Fecha límite</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Avance</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody className="text-[#233274]">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-t border-[#ebe7df]">
                    <td className="py-3">
                      <div className="font-semibold">{assignment.phaseName}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${assignment.required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {assignment.required ? 'Obligatoria' : 'Opcional'}
                      </span>
                    </td>
                    <td>{assignment.subphaseName}</td>
                    <td>
                      <select
                        value={assignment.responsibleId}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'responsibleId', event.target.value)
                        }
                        className="rounded-lg border border-[#ebe7df] px-2 py-1"
                      >
                        {staffMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={assignment.dueDate}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'dueDate', event.target.value)
                        }
                        className="rounded-lg border border-[#ebe7df] px-2 py-1"
                      />
                    </td>
                    <td>
                      <select
                        value={assignment.priority}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'priority', event.target.value)
                        }
                        className="rounded-lg border border-[#ebe7df] px-2 py-1"
                      >
                        {priorityOptions.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={assignment.status}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'status', event.target.value)
                        }
                        className="rounded-lg border border-[#ebe7df] px-2 py-1"
                      >
                        {taskStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={assignment.progress}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'progress', event.target.value)
                        }
                        className="w-20 rounded-lg border border-[#ebe7df] px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={assignment.comments}
                        onChange={(event) =>
                          handleAssignmentChange(assignment.id, 'comments', event.target.value)
                        }
                        placeholder="Observación"
                        className="rounded-lg border border-[#ebe7df] px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProcedureRegistryPage;
