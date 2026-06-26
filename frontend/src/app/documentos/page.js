import { Card, Pill, ButtonLink } from '../components/ui';
import { DashboardShell } from '../components/DashboardShell';
import { knowledgeDocuments, aiQualityChecklist } from '../../lib/ai-config';
import { currentTenant } from '../../lib/tenant';

export const metadata = { title: 'Base de conhecimento | Agentes AI' };

const pipeline = [
  ['1. Coleta', 'FAQ, políticas, preços, scripts e documentos da empresa.'],
  ['2. Revisão', 'Remoção de dados sensíveis e validação do que pode ser usado pela IA.'],
  ['3. Publicação', 'Documento entra na base do agente e pode ser usado em respostas.'],
  ['4. Auditoria', 'Cada resposta registra documentos consultados e flags de segurança.'],
];

export default function Page() {
  const published = knowledgeDocuments.filter((doc) => doc.status === 'PUBLISHED').length;
  const review = knowledgeDocuments.filter((doc) => doc.status === 'REVIEW').length;

  return (
    <DashboardShell
      title="Base de conhecimento"
      description="Documentos, regras e contexto que permitem que cada agente responda como a empresa, sem misturar dados entre clientes."
      actions={<ButtonLink href="/ia-lab">Testar no IA Lab</ButtonLink>}
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Metric value={String(knowledgeDocuments.length)} label="documentos mapeados" />
        <Metric value={String(published)} label="publicados para IA" />
        <Metric value={String(review)} label="em revisão humana" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Documentos da {currentTenant.nome}</h2>
              <p className="mt-2 text-sm text-slate-500">Todos carregam companyId e escopo para impedir vazamento entre empresas.</p>
            </div>
            <button className="btn-primary rounded-full px-5 py-3 text-sm font-black">Adicionar documento</button>
          </div>

          <div className="mt-6 space-y-3">
            {knowledgeDocuments.map((doc) => (
              <div key={doc.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-white">{doc.title}</h3>
                      <Pill>{doc.type}</Pill>
                      <Pill tone={doc.status === 'PUBLISHED' ? 'green' : 'default'}>{doc.status === 'PUBLISHED' ? 'Publicado' : 'Revisão'}</Pill>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{doc.content}</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Prioridade</p>
                    <p className="mt-1 text-sm font-bold text-white">{doc.priority}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {doc.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-slate-500">#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-2xl font-black">Pipeline operacional</h2>
            <div className="mt-5 space-y-3">
              {pipeline.map(([title, desc]) => <div key={title} className="rounded-2xl border border-white/10 bg-[#07070f] p-4"><p className="font-black text-white">{title}</p><p className="mt-1 text-sm leading-relaxed text-slate-500">{desc}</p></div>)}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Regras anti-erro</h2>
            <div className="mt-5 space-y-2">
              {aiQualityChecklist.slice(0, 5).map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-400">✓ {item}</div>)}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ value, label }) {
  return <Card className="p-5"><div className="text-3xl font-black text-white">{value}</div><div className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-slate-500">{label}</div></Card>;
}
