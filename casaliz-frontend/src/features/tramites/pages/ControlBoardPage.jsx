import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, UserCircle, ClipboardList, Calendar, Clock3 } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { isStaff, ROLES } from '../../../shared/constants/roles';

const ControlBoardPage = () => {
  const { user } = useAuthStore();
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [dueDrafts, setDueDrafts] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await tramitesApi.overview();
      setRows(data);
      setNoteDrafts(
        Object.fromEntries(data.map((r) => [r.id, r.notes || '']))
      );
      setDueDrafts(
        Object.fromEntries(data.map((r) => [r.id, r.due_date || '']))
      );
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la vista general.');
    } finally {
      setLoading(false);
    }
  };

  const canEditNotes = user && user.role !== ROLES.OPERATOR;

  if (!isStaff(user?.role)) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#233274] font-semibold">
        Solo el equipo interno puede ver la vista de control.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-10">
      <div className="container-custom space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-[#e15f0b]" />
          <div>
            <h1 className="text-3xl font-black text-[#233274]">Vista General de Control</h1>
            <p className="text-[#9a98a0]">Monitor de todos los clientes y trámites en tiempo real.</p>
          </div>
        </div>

        <div className="bg-white border border-[#ebe7df] rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-9 bg-[#233274] text-white text-xs font-semibold uppercase tracking-wide">
            <div className="p-3">Código</div>
            <div className="p-3 col-span-2">Cliente</div>
            <div className="p-3 col-span-2">Proyecto / Trámite</div>
            <div className="p-3">Responsable</div>
            <div className="p-3">Fase actual</div>
            <div className="p-3">Fecha</div>
            <div className="p-3 text-center">Estado</div>
          </div>
          {loading ? (
            <div className="p-6 text-[#9a98a0]">Cargando...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-[#9a98a0]">No hay trámites registrados.</div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="border-t border-[#ebe7df]">
                <button
                  className="grid grid-cols-9 w-full text-left hover:bg-[#fdfaf5] transition"
                  onClick={() => setOpenId(openId === row.id ? null : row.id)}
                >
                  <div className="p-3 font-semibold text-[#233274] flex items-center gap-2">
                    <span>{row.code}</span>
                    {openId === row.id ? (
                      <ChevronUp className="w-4 h-4 text-[#e15f0b]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#e15f0b]" />
                    )}
                  </div>
                  <div className="p-3 col-span-2 text-[#233274]">{row.client || 'N/D'}</div>
                  <div className="p-3 col-span-2 text-[#233274]">{row.project}</div>
                  <div className="p-3 text-[#233274]">{row.responsible || 'Sin asignar'}</div>
                  <div className="p-3 text-[#233274]">{row.current_phase || '-'}</div>
                  <div className="p-3 text-[#233274]">{row.registered_at || '-'}</div>
                  <div className="p-3 flex items-center justify-center">
                    <StatusBadge status={row.status} />
                  </div>
                </button>
                {openId === row.id && (
                  <div className="px-4 py-4 bg-[#fdfaf5] border-t border-[#ebe7df] grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2 text-[#233274]">
                      <UserCircle className="w-5 h-5 text-[#e15f0b]" />
                      <div>
                        <p className="text-xs uppercase text-[#9a98a0]">Responsable</p>
                        <p className="font-semibold">{row.responsible || 'Sin asignar'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[#233274]">
                      <MapPin className="w-5 h-5 text-[#e15f0b]" />
                      <div>
                        <p className="text-xs uppercase text-[#9a98a0]">Ubicación</p>
                        <p className="font-semibold">{row.location || 'No definida'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-[#9a98a0]">Observaciones</p>
                      {canEditNotes ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full px-3 py-2 border border-[#ebe7df] rounded-lg text-sm"
                            value={noteDrafts[row.id] || ''}
                            onChange={(e) =>
                              setNoteDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                            }
                          />
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#233274] font-semibold">Vence</span>
                          {canEditNotes ? (
                            <input
                              type="date"
                              className="px-3 py-2 border border-[#ebe7df] rounded-lg"
                              value={dueDrafts[row.id] || ''}
                              onChange={(e) =>
                                setDueDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                              }
                            />
                          ) : (
                            <span className="text-[#233274] font-semibold">
                              {row.due_date || 'Sin fecha'}
                            </span>
                          )}
                        </div>
                          <button
                            disabled={savingNoteId === row.id}
                            onClick={async () => {
                              try {
                                setSavingNoteId(row.id);
                                await tramitesApi.updateNotes(row.id, {
                                  notes: noteDrafts[row.id],
                                  due_date: dueDrafts[row.id] || null,
                                });
                                await loadData();
                              } catch (err) {
                                alert('No se pudo guardar la nota');
                              } finally {
                                setSavingNoteId(null);
                              }
                            }}
                            className="px-3 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition disabled:opacity-50"
                          >
                            {savingNoteId === row.id ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      ) : (
                        <p className="font-semibold text-[#233274] whitespace-pre-line">{row.notes || '—'}</p>
                      )}
                    </div>
                    <div className="md:col-span-3 bg-white border border-[#ebe7df] rounded-xl p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-sm text-[#233274] font-semibold">
                          Fases: {row.phases_progress?.completed || 0}/{row.phases_progress?.total || 0}
                        </div>
                        <div className="text-sm text-[#233274] font-semibold">
                          Subfases: {row.subphases_progress?.completed || 0}/{row.subphases_progress?.total || 0}
                        </div>
                        <div className="flex-1 h-2 bg-[#ebe7df] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#e15f0b] to-[#d14a00]"
                            style={{ width: `${row.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#233274]">{row.progress_percent || 0}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-3">
                      <InfoChip icon={Calendar} label="Registrado" value={formatDate(row.registered_at)} />
                      <InfoChip icon={Clock3} label="Último avance" value={formatDateTime(row.last_progress_at || row.updated_at)} />
                      <InfoChip icon={Calendar} label="Vence" value={formatDate(row.due_date)} />
                    </div>
                    <div className="md:col-span-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#233274]">SLA</span>
                        <SlaBadge sla={row.sla} />
                      </div>
                      <div className="text-sm text-[#233274] font-semibold">
                        Tareas: {row.tasks_done}/{row.tasks_total} ({row.tasks_progress}%)
                      </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-3">
                      <a
                        href={`/tramites/${row.id}/detalle`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
                      >
                        Ver fases
                      </a>
                      <a
                        href={`/tramites/${row.id}/tareas`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
                      >
                        Ver tareas
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
    in_progress: { label: 'En proceso', className: 'bg-blue-100 text-blue-700' },
    observed: { label: 'Observado', className: 'bg-orange-100 text-orange-700' },
    completed: { label: 'Finalizado', className: 'bg-green-100 text-green-700' },
  };
  const data = map[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.className}`}>{data.label}</span>;
};

const SlaBadge = ({ sla }) => {
  const map = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    none: 'bg-gray-100 text-gray-700',
  };
  const labels = {
    green: 'En tiempo',
    yellow: 'Próximo a vencer',
    red: 'Vencido',
    none: 'Sin fecha',
  };
  const cls = map[sla] || map.none;
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{labels[sla] || labels.none}</span>;
};

const InfoChip = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-white border border-[#ebe7df] rounded-lg px-3 py-2">
    <Icon className="w-4 h-4 text-[#e15f0b]" />
    <div>
      <p className="text-[11px] uppercase text-[#9a98a0]">{label}</p>
      <p className="text-sm font-semibold text-[#233274]">{value}</p>
    </div>
  </div>
);

export default ControlBoardPage;

const formatDate = (value) => {
  if (!value) return 'N/D';
  try {
    return new Date(value).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Lima',
    });
  } catch {
    return value;
  }
};

const formatDateTime = (value) => {
  if (!value) return 'N/D';
  try {
    return new Date(value).toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Lima',
    });
  } catch {
    return value;
  }
};
