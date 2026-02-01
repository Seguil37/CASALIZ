import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../shared/constants/roles';

const statusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in_progress', label: 'En proceso', color: 'bg-blue-100 text-blue-700' },
  { value: 'observed', label: 'Observado', color: 'bg-orange-100 text-orange-700' },
  { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-700' },
];

const TramiteDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [tramite, setTramite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPhase, setSavingPhase] = useState(null);
  const [savingSub, setSavingSub] = useState(null);
  const [error, setError] = useState('');

  const canManage = useMemo(() => {
    if (!tramite || !user) return false;
    if ([ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(user.role)) return true;
    return tramite.responsible?.id === user.id;
  }, [tramite, user]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await tramitesApi.show(id);
        setTramite(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el trámite.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePhaseStatus = async (phaseId, status) => {
    if (!canManage) return;
    setSavingPhase(phaseId);
    try {
      await tramitesApi.updatePhase(tramite.id, phaseId, { status });
      // refrescar
      const { data } = await tramitesApi.show(tramite.id);
      setTramite(data);
    } catch (err) {
      alert('No se pudo actualizar la fase');
    } finally {
      setSavingPhase(null);
    }
  };

  const handleSubStatus = async (subId, status) => {
    if (!canManage) return;
    setSavingSub(subId);
    try {
      await tramitesApi.updateSubphase(tramite.id, subId, { status });
      const { data } = await tramitesApi.show(tramite.id);
      setTramite(data);
    } catch (err) {
      alert('No se pudo actualizar la subfase');
    } finally {
      setSavingSub(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#233274]">
        Cargando...
      </div>
    );
  }

  if (!tramite || error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#233274]">
        {error || 'Trámite no encontrado'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#e15f0b]">TRÁMITE</p>
            <h1 className="text-3xl font-black text-[#233274] flex items-center gap-3">
              {tramite.project_name}
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#233274] text-white">
                {tramite.code}
              </span>
            </h1>
            <p className="text-sm text-[#9a98a0]">{tramite.client_name || tramite.client?.name}</p>
          </div>
          <Link
            to="/tramites/control"
            className="px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
          >
            Volver a vista general
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fases */}
          <div className="lg:col-span-2 bg-white border border-[#ebe7df] rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5 text-[#e15f0b]" />
              <h2 className="text-xl font-black text-[#233274]">Fases y subfases</h2>
            </div>
            {tramite.phases?.length ? (
              <div className="space-y-3">
                {tramite.phases.map((phase) => (
                  <div key={phase.id} className="border border-[#ebe7df] rounded-xl p-4 bg-[#fdfaf5]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#233274]">{phase.name}</p>
                        <p className="text-xs text-[#9a98a0]">Orden {phase.order}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="px-3 py-2 border border-[#ebe7df] rounded-lg"
                          value={phase.status}
                          disabled={!canManage || savingPhase === phase.id}
                          onChange={(e) => handlePhaseStatus(phase.id, e.target.value)}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusOptions.find((o) => o.value === phase.status)?.color || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusOptions.find((o) => o.value === phase.status)?.label || phase.status}
                        </span>
                        {savingPhase === phase.id && <Loader2 className="w-4 h-4 animate-spin text-[#233274]" />}
                      </div>
                    </div>

                    {phase.subphases?.length > 0 && (
                      <div className="mt-3 space-y-2 pl-2 border-l-2 border-[#ebe7df]">
                        {phase.subphases.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white border border-[#ebe7df] rounded-lg p-2"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-[#e15f0b]" />
                              <div>
                                <p className="text-sm font-semibold text-[#233274]">{sub.name}</p>
                                <p className="text-xs text-[#9a98a0]">Orden {sub.order}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                className="px-3 py-2 border border-[#ebe7df] rounded-lg"
                                value={sub.status}
                                disabled={!canManage || savingSub === sub.id}
                                onChange={(e) => handleSubStatus(sub.id, e.target.value)}
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusOptions.find((o) => o.value === sub.status)?.color ||
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {statusOptions.find((o) => o.value === sub.status)?.label || sub.status}
                              </span>
                              {savingSub === sub.id && <Loader2 className="w-4 h-4 animate-spin text-[#233274]" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9a98a0]">No hay fases configuradas.</p>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-white border border-[#ebe7df] rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#e15f0b]" />
              <h3 className="text-lg font-black text-[#233274]">Resumen</h3>
            </div>
            <div className="space-y-3 text-sm text-[#233274]">
              <div className="flex justify-between"><span>Cliente</span><span>{tramite.client_name || 'N/D'}</span></div>
              <div className="flex justify-between"><span>Responsable</span><span>{tramite.responsible?.name || 'N/D'}</span></div>
              <div className="flex justify-between"><span>Estado</span><span>{statusOptions.find(s => s.value === tramite.status)?.label || tramite.status}</span></div>
              <div className="flex justify-between"><span>Ubicación</span><span>{tramite.location || 'N/D'}</span></div>
              <div className="flex justify-between"><span>Registrado</span><span>{tramite.registered_at || 'N/D'}</span></div>
              <Link
                to={`/tramites/${tramite.id}/tareas`}
                className="block mt-2 text-center px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
              >
                Ver tareas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramiteDetailPage;
