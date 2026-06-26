import { ButtonLink, Card, Container, Section, SectionTitle, Stat } from '../components/ui';
import AgentesCatalog from './AgentesCatalog';

export const metadata = {
  title: 'Catálogo de agentes de IA | Agentes AI',
  description: 'Veja agentes de IA para atendimento, vendas, suporte, agendamento, financeiro, cobrança, social media e triagem operacional.',
};

const ganhos = [
  ['8', 'agentes base'],
  ['24h', 'atendimento'],
  ['1:1', 'por empresa'],
  ['3-14d', 'implantação'],
];

const escolhas = [
  ['Quer responder clientes mais rápido?', 'Comece pelo Agente de Atendimento.'],
  ['Quer qualificar leads e vender mais?', 'Escolha o Agente de Vendas.'],
  ['Quer reduzir trabalho repetitivo?', 'Veja Suporte, Financeiro e Cobrança.'],
];

export default function AgentesPage() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Catálogo comercial</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Escolha o agente ideal para vender, atender ou automatizar.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">Cada agente tem uma base pronta, mas é treinado com dados, regras, linguagem e objetivos da empresa contratante. O cliente sente que está falando com um agente feito exclusivamente para ele.</p>
        </div>
        <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ganhos.map(([value, label]) => <Stat key={label} value={value} label={label} />)}
        </div>
        <AgentesCatalog />
      </Container>

      <Section>
        <Container>
          <SectionTitle eyebrow="Como escolher" title="Não venda tecnologia. Venda o agente certo para a dor certa." desc="A página de catálogo foi estruturada para ajudar empresas a se enxergarem em um problema e avançarem para o pré-cadastro." />
          <div className="grid gap-5 md:grid-cols-3">
            {escolhas.map(([pergunta, resposta]) => (
              <Card key={pergunta}>
                <h2 className="text-xl font-black">{pergunta}</h2>
                <p className="mt-3 leading-relaxed text-slate-400">{resposta}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h2 className="text-3xl font-black">Sua empresa precisa de um agente diferente?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">Use o pré-cadastro para explicar o processo, o segmento e o problema. A Agentes AI pode montar um agente personalizado a partir do diagnóstico.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/pre-cadastro">Solicitar agente personalizado</ButtonLink>
              <ButtonLink href="/demo" variant="outline">Ver demonstração</ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
