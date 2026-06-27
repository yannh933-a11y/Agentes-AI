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
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Ative checkout externo quando quiser pagamentos automáticos por cartão, boleto e Pix.</p>
        </Card>
        <Card>
          <Pill>Stripe</Pill>
          <h2 className="mt-4 text-xl font-black">Assinaturas recorrentes</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Estrutura para recorrência, invoices e cobrança avançada em operações maiores.</p>
        </Card>
      </div>
      <AdminOrdersPanel />
      <div className="mt-6">
        <Link href="/checkout" className="btn-primary inline-flex rounded-full px-6 py-3.5 text-sm font-black no-underline">Criar contratação manual</Link>
      </div>
    </AdminShell>
  );
}
