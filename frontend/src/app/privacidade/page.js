import Link from 'next/link';
import { Badge, ButtonLink, Card, CheckItem, Container, Pill, Section } from '../components/ui';

export const metadata = {
  title: 'Política de Privacidade | Agentes AI',
  description: 'Entenda como a Agentes AI coleta, usa, protege e trata dados enviados por visitantes, leads e empresas clientes.',
};

const privacyTopics = [
  {
    title: '1. Dados que podemos coletar',
    body: [
      'Podemos coletar dados fornecidos diretamente por você em formulários, pré-cadastros, contatos comerciais, solicitações de suporte e interações com páginas demonstrativas da Agentes AI.',
      'Esses dados podem incluir nome, WhatsApp, e-mail, nome da empresa, segmento, tamanho da empresa, tipo de agente desejado, canal de uso, volume aproximado de atendimento, mensagens enviadas e descrição do problema que a empresa deseja resolver.',
    ],
  },
  {
    title: '2. Finalidade do uso dos dados',
    body: [
      'Usamos os dados para responder solicitações, entender necessidades comerciais, preparar diagnósticos, organizar atendimento, configurar agentes de IA, oferecer suporte e melhorar a experiência de uso do site e da plataforma.',
      'Também podemos usar informações agregadas para identificar quais tipos de agentes, segmentos e canais são mais procurados, sem expor dados pessoais de visitantes ou clientes.',
    ],
  },
  {
    title: '3. Dados enviados em formulários',
    body: [
      'Os dados enviados em formulários de contato ou pré-cadastro são usados para comunicação comercial, análise da necessidade informada e organização do relacionamento com a empresa interessada.',
      'Ao enviar um formulário, você declara que as informações fornecidas são verdadeiras e que possui autorização para compartilhar dados relacionados à empresa informada.',
    ],
  },
  {
    title: '4. Dados usados para configurar agentes de IA',
    body: [
      'Para configurar um agente, a empresa pode enviar documentos, instruções, perguntas frequentes, regras de atendimento, políticas comerciais e outras informações de operação.',
      'Esses dados são usados para personalizar respostas, orientar fluxos de atendimento, gerar simulações e permitir que o agente atue de acordo com o contexto autorizado pela empresa cliente.',
    ],
  },
  {
    title: '5. Compartilhamento de dados',
    body: [
      'A Agentes AI não vende dados pessoais de visitantes, leads ou clientes.',
      'Dados podem ser compartilhados com fornecedores técnicos necessários para hospedagem, banco de dados, processamento, comunicação, segurança e operação da plataforma, sempre de acordo com a finalidade do serviço contratado ou solicitado.',
    ],
  },
  {
    title: '6. Segurança das informações',
    body: [
      'Adotamos medidas técnicas e organizacionais para reduzir riscos de acesso indevido, perda, alteração, exposição ou uso não autorizado das informações tratadas pela plataforma.',
      'Nenhum ambiente digital é totalmente imune a falhas. Por isso, recomendamos que clientes evitem enviar dados excessivos, desnecessários ou altamente sensíveis sem necessidade operacional clara.',
    ],
  },
  {
    title: '7. Direitos do usuário',
    body: [
      'Você pode solicitar informações sobre dados associados ao seu contato, pedir correção, atualização, exclusão ou esclarecimentos sobre o tratamento realizado pela Agentes AI.',
      'As solicitações serão analisadas conforme a natureza do dado, vínculo com a empresa cliente, obrigações operacionais e requisitos legais aplicáveis.',
    ],
  },
  {
    title: '8. Retenção de dados',
    body: [
      'Mantemos dados pelo tempo necessário para cumprir as finalidades descritas nesta política, prestar suporte, manter histórico operacional, atender obrigações legais ou resguardar direitos da Agentes AI e de seus clientes.',
      'Dados de leads podem ser mantidos para continuidade do relacionamento comercial, salvo solicitação válida de exclusão ou obrigação de conservação.',
    ],
  },
  {
    title: '9. Contato para solicitações',
    body: [
      'Solicitações sobre privacidade, dados enviados em formulários, cadastro comercial ou informações usadas em agentes de IA podem ser feitas pela página de contato da Agentes AI.',
      'Ao entrar em contato, informe o nome, empresa, canal usado e uma descrição clara da solicitação para facilitar a análise.',
    ],
  },
];

const highlights = [
  'Uso de dados limitado à operação, atendimento, diagnóstico e configuração dos agentes.',
  'Dados enviados em formulários são usados para contato comercial e suporte.',
  'Informações da empresa podem ser usadas para personalizar agentes de IA contratados.',
  'Solicitações de privacidade podem ser enviadas pela página de contato.',
];

function LegalSection({ title, body }) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-black text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}

export default function Privacidade() {
  return (
    <main className="pt-20">
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Container className="relative py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Badge>Privacidade e dados</Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Política de <span className="text-gradient-main">Privacidade</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                Esta política explica como a Agentes AI coleta, usa, protege e trata informações enviadas por visitantes, leads e empresas que utilizam ou avaliam nossos agentes de IA.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contato">Falar sobre privacidade</ButtonLink>
                <ButtonLink href="/termos" variant="outline">Ver termos de uso</ButtonLink>
              </div>
              <p className="mt-5 text-sm font-bold text-slate-500">Última atualização: junho de 2026</p>
            </div>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <Pill tone="red">Resumo prático</Pill>
                <h2 className="mt-4 text-2xl font-black">Tratamento responsável para operação comercial.</h2>
                <p className="mt-3 leading-relaxed text-slate-400">
                  Os dados enviados à Agentes AI são usados para entender necessidades, responder contatos, configurar agentes e prestar suporte às empresas atendidas.
                </p>
                <ul className="mt-6 space-y-3">
                  {highlights.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-5xl">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Formulários</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Pré-cadastro, contato e solicitações comerciais.</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Agentes</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Informações usadas para configurar atendimento e automações.</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Solicitações</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Canal para dúvidas, correções e pedidos sobre dados.</p>
            </Card>
          </div>

          <div className="space-y-5">
            {privacyTopics.map((topic) => (
              <LegalSection key={topic.title} title={topic.title} body={topic.body} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container className="max-w-5xl">
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Pill tone="red">Solicitações de dados</Pill>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Precisa falar com a equipe?</h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
                  Use a página de contato para solicitar informações, correções ou esclarecimentos sobre dados enviados à Agentes AI.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/contato">Abrir contato</ButtonLink>
                <Link href="/termos" className="btn-outline inline-flex items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-bold no-underline">
                  Ver termos
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
