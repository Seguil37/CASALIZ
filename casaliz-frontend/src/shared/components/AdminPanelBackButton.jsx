import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

const AdminPanelBackButton = ({ className = '' }) => (
  <Link
    to="/admin/panel"
    className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#233274] bg-white px-4 py-2 text-sm font-semibold leading-none text-[#233274] shadow-sm transition hover:bg-[#233274] hover:text-white ${className}`}
  >
    <ArrowLeft className="h-4 w-4 shrink-0" />
    <LayoutDashboard className="h-4 w-4 shrink-0" />
    Volver al panel principal
  </Link>
);

export default AdminPanelBackButton;
