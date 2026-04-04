'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { agentes } from '../../lib/agentes';

// Base de conhecimento do suporte automático
const FAQ = {
  saudacao: ['oi', 'olá', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'oi tudo bem', 'hello'],
  preco: ['preço', 'preco', 'valor', 'custa', 'custo', 'mensalidade', 'quanto', 'barato', 'caro'],
  agente: ['agente', 'qual agente', 'agentes', 'tipo', 'escolher', 'indicar', 'recomendar', 'melhor'],
  pagamento: ['pagar', 'pagamento', 'pix', 'forma de pagamento', 'como pago', 'boleto'],
  ativacao: ['ativar', 'ativação', 'ativacao', 'quanto tempo', 'prazo', 'quando recebo', 'receber'],
  cancelamento: ['cancelar', 'cancelamento', 'cancelo', 'desistir', 'reembolso', 'devolução', 'devolver'],
  telegram: ['telegram', 'como usar', 'usar', 'funciona', 'como funciona'],
  suporte_humano: ['humano', 'atendente', 'pessoa', 'falar com alguém', 'nao entendi', 'não entendi', 'não resolveu', 'nao resolveu'],
  comprar: ['comprar', 'contratar', 'quero', 'adquirir', 'assinar'],
};

const respostas = {
  saudacao: () => ({
    text: '👋 Olá! Seja bem-vindo ao suporte da **AgentesIA**!\n\nEstou aqui para te ajudar a escolher o agente ideal e tirar todas as suas dúvidas.\n\nComo posso te ajudar hoje?',
    botoes: [
      { label: '💰 Ver preços', acao: 'preco' },
      { label: '🤖 Conhecer os agentes', acao: 'agente' },
      { label: '⚡ Como funciona?', acao: 'telegram' },
    ],
  }),
  preco: () => ({
    text: '💰 **Nossos preços são simples e acessíveis:**\n\n🟢 **Agentes Básicos** (Atendimento, Calendário, Suporte)\n• Ativação: R$ 20,00 (única vez)\n• Mensalidade: R$ 50,00/mês\n\n🔴 **Agentes Avançados** (Vendas, Agendamento, Emails, Manutenção)\n• Ativação: R$ 20,00 (única vez)\n• Mensalidade: R$ 65,00/mês\n\nTodos os planos incluem suporte e ativação em até 5 minutos!',
    botoes: [
      { label: '🤖 Ver todos os agentes', acao: 'agente' },
      { label: '💳 Como pagar?', acao: 'pagamento' },
      { label: '⏱️ Quando ativo?', acao: 'ativacao' },
    ],
  }),
  agente: () => ({
    text: `🤖 **Temos 7 agentes disponíveis:**\n\n${agentes.map(a => `${a.emoji} **${a.nome}** — R$ ${a.preco}/mês\n_${a.descricao}_`).join('\n\n')}\n\nQual tipo de negócio você tem? Posso indicar o melhor para você!`,
    botoes: [
      { label: '💰 Ver preços', acao: 'preco' },
      { label: '🛒 Quero contratar', acao: 'comprar' },
      { label: '❓ Como funciona?', acao: 'telegram' },
    ],
  }),
  pagamento: () => ({
    text: '💳 **Pagamento via PIX — rápido e seguro!**\n\nComo funciona:\n1. Escolha seu agente\n2. Preencha seus dados (nome, email)\n3. Receba o QR Code PIX na tela\n4. Pague com seu banco\n5. Confirmação instantânea ✅\n\nO pagamento é processado em segundos. Após confirmar, seu agente fica pronto em até **5 minutos**!',
    botoes: [
      { label: '🤖 Escolher agente', acao: 'comprar' },
      { label: '⏱️ Prazo de ativação', acao: 'ativacao' },
      { label: '❓ Como usar?', acao: 'telegram' },
    ],
  }),
  ativacao: () => ({
    text: '⚡ **Ativação super rápida!**\n\nApós confirmar o pagamento:\n• ✅ Você recebe um email com as credenciais\n• ✅ Em até **5 minutos** seu agente já está ativo\n• ✅ Ativação 100% automática\n• ✅ Suporte incluso se precisar de ajuda\n\nO agente funciona diretamente no **Telegram**, disponível 24 horas por dia!',
    botoes: [
      { label: '🛒 Contratar agora', acao: 'comprar' },
      { label: '📱 Como usar no Telegram?', acao: 'telegram' },
      { label: '❌ E se cancelar?', acao: 'cancelamento' },
    ],
  }),
  cancelamento: () => ({
    text: '❌ **Cancelamento sem complicação!**\n\n• Cancele quando quiser\n• Sem multa ou fidelidade\n• O agente fica ativo até o fim do período pago\n• Para cancelar, basta enviar email para suporte@agentesia.com.br\n\n⚠️ Não fazemos reembolso proporcional de mensalidades em andamento.',
    botoes: [
      { label: '🤖 Conhecer os agentes', acao: 'agente' },
      { label: '💰 Ver preços', acao: 'preco' },
      { label: '🛒 Contratar mesmo assim', acao: 'comprar' },
    ],
  }),
  telegram: () => ({
    text: '📱 **Como funciona o agente no Telegram:**\n\n1. Após contratar, você recebe um código por email\n2. Abra o Telegram e encontre o bot do seu agente\n3. Envie qualquer mensagem para ativá-lo\n4. Insira o código de pareamento\n5. Pronto! Seu agente já responde automaticamente 🎉\n\nSeus clientes só precisam iniciar uma conversa com o bot — sem instalar nada!',
    botoes: [
      { label: '🛒 Quero contratar', acao: 'comprar' },
      { label: '💰 Ver preços', acao: 'preco' },
      { label: '🤖 Ver agentes', acao: 'agente' },
    ],
  }),
  comprar: () => ({
    text: '🛒 **Ótima escolha! Veja nossos agentes e escolha o seu:**',
    botoes: agentes.slice(0, 4).map(a => ({ label: `${a.emoji} ${a.nome} — R$${a.preco}/mês`, acao: 'link', href: `/agentes/${a.slug}` })).concat([
      { label: '📋 Ver todos os agentes →', acao: 'link', href: '/agentes' },
    ]),
  }),
  suporte_humano: () => ({
    text: '👤 **Prefere falar com alguém da equipe?**\n\nNossa equipe está disponível via email:\n📧 **suporte@agentesia.com.br**\n\nRetornamos em até 2 horas úteis!\n\nOu continue aqui que eu resolvo a maioria das dúvidas na hora. 😊',
    botoes: [
      { label: '🔙 Voltar ao início', acao: 'saudacao' },
      { label: '🤖 Ver agentes', acao: 'agente' },
    ],
  }),
  default: () => ({
    text: '🤔 Não entendi muito bem sua pergunta. Posso te ajudar com:\n\n• Preços e planos\n• Qual agente escolher\n• Como funciona o pagamento\n• Prazo de ativação\n• Cancelamento\n\nSobre o que você quer saber?',
    botoes: [
      { label: '💰 Preços', acao: 'preco' },
      { label: '🤖 Agentes', acao: 'agente' },
      { label: '📱 Como funciona', acao: 'telegram' },
      { label: '👤 Falar com humano', acao: 'suporte_humano' },
    ],
  }),
};

function detectarIntencao(msg) {
  const lower = msg.toLowerCase();
  for (const [intencao, palavras] of Object.entries(FAQ)) {
    if (palavras.some(p => lower.includes(p))) return intencao;
  }
  return 'default';
}

function renderTexto(text) {
  return text.split('\n').map((linha, i) => {
    const partes = linha.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {partes.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>)}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function SuportePage() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [digitando, setDigitando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Mensagem inicial
    setTimeout(() => {
      const r = respostas.saudacao();
      setMsgs([{ tipo: 'bot', text: r.text, botoes: r.botoes }]);
    }, 400);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, digitando]);

  function responderBot(intencao) {
    setDigitando(true);
    setTimeout(() => {
      const r = (respostas[intencao] || respostas.default)();
      setMsgs(prev => [...prev, { tipo: 'bot', text: r.text, botoes: r.botoes }]);
      setDigitando(false);
    }, 800);
  }

  function handleBotao(botao) {
    if (botao.acao === 'link') return; // Link é tratado pelo <a>
    setMsgs(prev => [...prev, { tipo: 'user', text: botao.label }]);
    responderBot(botao.acao);
  }

  function handleEnviar() {
    const texto = input.trim();
    if (!texto) return;
    setMsgs(prev => [...prev, { tipo: 'user', text: texto }]);
    setInput('');
    const intencao = detectarIntencao(texto);
    responderBot(intencao);
  }

  return (
    <main className="pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Suporte AgentesIA</h1>
          <p className="text-slate-400 text-sm">Atendimento automático 24h — tire suas dúvidas agora</p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold mt-3">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Online agora
          </div>
        </div>

        {/* Chat window */}
        <div className="card rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${m.tipo === 'user' ? 'order-2' : 'order-1'}`}>
                  {m.tipo === 'bot' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 bg-red-500/15 rounded-full flex items-center justify-center text-xs">🤖</div>
                      <span className="text-slate-500 text-xs">Suporte IA</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.tipo === 'user'
                      ? 'bg-red-600 text-white rounded-tr-sm'
                      : 'bg-white/[0.05] text-slate-200 rounded-tl-sm'
                  }`}>
                    {renderTexto(m.text)}
                  </div>
                  {/* Botões de ação */}
                  {m.botoes && m.tipo === 'bot' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.botoes.map((b, bi) =>
                        b.acao === 'link' ? (
                          <Link key={bi} href={b.href}
                            className="bg-white/[0.07] hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full no-underline transition-all">
                            {b.label}
                          </Link>
                        ) : (
                          <button key={bi} onClick={() => handleBotao(b)}
                            className="bg-white/[0.07] hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer">
                            {b.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {digitando && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.06] p-4 flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnviar()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
            />
            <button
              onClick={handleEnviar}
              className="btn-primary px-4 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer whitespace-nowrap"
            >
              Enviar →
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          Suporte automatizado 24h • Dúvidas complexas?{' '}
          <a href="mailto:suporte@agentesia.com.br" className="text-red-400 hover:text-red-300">
            suporte@agentesia.com.br
          </a>
        </p>
      </div>
    </main>
  );
}
