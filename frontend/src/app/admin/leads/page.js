import { AdminShell } from '../../components/DashboardShell';
import AdminLeadsPanel from '../AdminLeadsPanel';

export const metadata = { title: 'Leads | Admin Agentes AI' };

export default function Page() {
  return (
    <AdminShell title="Leads comerciais" description="Pipeline de pré-cadastros recebidos pelo site, com persistência em banco quando DATABASE_URL estiver configurada.">
      <AdminLeadsPanel />
    </AdminShell>
  );
}
