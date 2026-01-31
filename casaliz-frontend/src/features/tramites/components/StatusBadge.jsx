const STATUS_STYLES = {
  Pendiente: 'bg-yellow-100 text-yellow-700',
  'En Proceso': 'bg-blue-100 text-blue-700',
  Observado: 'bg-rose-100 text-rose-700',
  Aprobado: 'bg-green-100 text-green-700',
  Finalizado: 'bg-emerald-100 text-emerald-700',
};

const StatusBadge = ({ status }) => {
  const styles = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
