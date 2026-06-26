import Link from 'next/link';
import { AdminShell } from '../../components/DashboardShell';
import { Card, Pill } from '../../components/ui';
import AdminOrdersPanel from './AdminOrdersPanel';

export const metadata = { title: 'Contratações | Admin Agentes AI' };

export default function Page() {
  return (
    <AdminShell title="Contratações" description="Acompanhe pedidos criados pelo checkout, pagamentos, planos e início de implantação.">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <Pill tone="red">Pix manual</Pill>
          <h2 className="mt-4 text-xl font-black">Venda imediatamente</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Comece capturando pedidos e conferindo pagamentos manualmente.</p>
        </Card>
        <Card>
          <Pill>Mercado Pago</Pill>
          <h2 className="mt-4 text-xl font-black">Checkout externo</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Ative com MP_ACCESS_TOKEN quando quiser pagamentos automáticos.</p>
        </Card>
        <Card>
          <Pill>Stripe</Pill>
          <h2 className="mt-4 text-xl font-black">Assinaturas futuras</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Base preparada para recorrência, invoices e billing avançado.</p>
        </Card>
      </div>
      <AdminOrdersPanel />
      <div className="mt-6">
        <Link href="/checkout" className="btn-primary inline-flex rounded-full px-6 py-3.5 text-sm font-black no-underline">Criar contratação manual</Link>
      </div>
    </AdminShell>
  );
}
