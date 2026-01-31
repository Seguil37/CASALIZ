import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, UserCircle, ClipboardList } from 'lucide-react';
import { tramitesApi } from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';
import { isStaff } from '../../../shared/constants/roles';

const ControlBoardPage = () => {
  const { user } = useAuthStore();
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await tramitesApi.overview();
      setRows(data);
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la vista general.');
    } finally {
      setLoading(false);
    }
  };

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
                      <p className="font-semibold text-[#233274]">{row.notes || '—'}</p>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <a
                        href={`/tramites/${row.id}/tareas`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#233274] text-[#233274] font-semibold hover:bg-[#233274] hover:text-white transition"
                      >
                        Ver tareas y avances
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

export default ControlBoardPage;
