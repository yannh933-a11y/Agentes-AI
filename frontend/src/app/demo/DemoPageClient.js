'use client';

import { useMemo, useState } from 'react';
import { agentes } from '../../lib/agentes';
import { ButtonLink, Card, Container, Pill } from '../components/ui';

const mensagensBase = {
  atendimento: ['Olá! Quero saber se vocês estão funcionando hoje.', 'Claro. Atendemos hoje e posso te ajudar agora. Você quer informações sobre horário, valores ou serviços?'],
  vendas: ['Tenho interesse, mas quero entender o melhor plano.', 'Perfeito. Para indicar o plano ideal, me diga: você quer automatizar atendimento, vendas ou suporte?'],
  suporte: ['Estou com dificuldade para acessar minha conta.', 'Vou te ajudar. Primeiro, confirme o e-mail usado no cadastro para eu registrar corretamente a solicitação.'],
  agendamento: ['Tem horário amanhã no fim do dia?', 'Tenho algumas opções no fim do dia. Você prefere 18h30 ou 19h?'],
  financeiro: ['Preciso da segunda via do pagamento.', 'Claro. Posso registrar a solicitação. Informe CPF/CNPJ ou código de cliente para localização segura.'],
  cobranca: ['Quero regularizar uma pendência.', 'Perfeito. Vou registrar seu retorno e te orientar sobre as opções de regularização disponíveis.'],
  'social-media': ['Preciso de ideias de posts para vender mais.', 'Posso montar uma sequência com conteúdo educativo, prova social e CTA para conversão. Qual produto quer divulgar?'],
  juridico: ['Preciso enviar informações sobre um contrato.', 'Posso coletar os dados iniciais e encaminhar para o responsável. É contrato de prestação de serviço, locação ou parceria?'],
};

export default function DemoPageClient() {
  const [slug, setSlug] = useState('vendas');
  const agente = useMemo(() => agentes.find((item) => item.slug === slug) || agentes[0], [slug]);
  const mensagens = mensagensBase[agente.slug] || mensagensBase.vendas;

  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Demonstração comercial</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Veja como um agente exclusivo conduz uma conversa.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">Esta demo é visual e comercial: mostra a lógica de atendimento, coleta de dados, resposta rápida e próxima ação. A versão real usa dados e regras da empresa contratante.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <Card>
            <h2 className="text-2xl font-black">Escolha um cenário</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Troque o agente para ver como a linguagem muda conforme a função.</p>
            <div className="mt-6 grid gap-2">
              {agentes.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setSlug(item.slug)}
                  className={`rounded-2xl border p-4 text-left transition ${slug === item.slug ? 'border-red-500/50 bg-red-500/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black text-white">{item.nome}</span>
                    <Pill>{item.categoria}</Pill>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.resumo}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">{agente.nome}</h2>
                <p className="text-sm text-slate-500">Empresa exemplo · Agente exclusivo</p>
              </div>
              <Pill tone="green">Online agora</Pill>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <div className="space-y-4">
                <Bubble who="Cliente">{mensagens[0]}</Bubble>
                <Bubble who="Agentes AI" right>{mensagens[1]}</Bubble>
                <Bubble who="Cliente">Pode me ajudar por aqui?</Bubble>
                <Bubble who="Agentes AI" right>Sim. Vou coletar as informações principais e deixar tudo organizado para a próxima etapa.</Bubble>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['Lead identificado', 'Contexto coletado', 'Resposta aprovada', 'Próxima ação definida'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-slate-400">● {item}</div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={`/agentes/${agente.slug}`} variant="outline">Ver página do agente</ButtonLink>
              <ButtonLink href={`/pre-cadastro?agente=${agente.slug}`}>Solicitar este agente</ButtonLink>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}

function Bubble({ children, right }) {
  return <div className={`flex ${right ? 'justify-end' : 'justify-start'}`}><div className={`${right ? 'border-red-500/20 bg-red-500/15' : 'border-white/10 bg-white/5'} max-w-[86%] rounded-2xl border p-3 text-sm leading-relaxed text-slate-200`}><div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{right ? 'Agente' : 'Cliente'}</div>{children}</div></div>;
}
