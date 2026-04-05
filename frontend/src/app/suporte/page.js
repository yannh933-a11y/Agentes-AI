'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { agentes } from '../../lib/agentes';

const API = process.env.NEXT_PUBLIC_API_URL || '';

// ID de sessão único por visita
function gerarSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now();
}

// Respostas locais (fallback se backend offline)
const RESPOSTAS_LOCAL = {
  saudacao: { text: 'Olá! 😊 Bem-vindo ao suporte da **AgentesIA**.\n\nComo posso te ajudar hoje?', botoes: [{ label: '💰 Preços', acao: 'preco' }, { label: '🤖 Agentes', acao: 'agente' }, { label: '📱 Como funciona', acao: 'telegram' }] },
  preco: { text: '💰 **Nossos preços:**\n\n🟢 **Básicos** (Atendimento, Calendário, Suporte)\n→ Ativação: R$20 | Mensalidade: **R$50/mês**\n\n🔴 **Avançados** (Vendas, Agendamento, Emails, Manutenção)\n→ Ativação: R$20 | Mensalidade: **R$65/mês**', botoes: [{ label: '🤖 Ver agentes', acao: 'agente' }, { label: '💳 Como pagar?', acao: 'pagamento' }] },
  agente: { text: '🤖 **Nossos agentes:**\n\n' + agentes.map(a => `${a.emoji} **${a.nome}** — R$${a.preco}/mês`).join('\n'), botoes: [{ label: '💰 Ver preços', acao: 'preco' }, { label: '🛒 Contratar', acao: 'link', href: '/agentes' }] },
  pagamento: { text: '💳 **Pagamento via PIX:**\n\n1. Escolha seu agente\n2. Preencha seus dados\n3. Receba o QR Code\n4. Pague com seu banco\n5. Confirmação instantânea ✅\n\nCredenciais chegam em até **5 minutos** no email!', botoes: [{ label: '🛒 Contratar agora', acao: 'link', href: '/agentes' }] },
  ativacao: { text: '⚡ **Ativação em até 5 minutos!**\n\n1. Pague via PIX\n2. Receba email com credenciais\n3. Acesse o Telegram\n4. Insira o código de pareamento\n5. Pronto! Funcionando 24h 🎉', botoes: [{ label: '🛒 Contratar', acao: 'link', href: '/agentes' }] },
  cancelamento: { text: '❌ **Cancelamento sem complicação:**\n\n• Cancele quando quiser\n• Sem multa ou fidelidade\n• Ativo até o fim do período pago\n• Email: suporte@agentesia.com.br', botoes: [{ label: '🤖 Ver agentes', acao: 'agente' }] },
  telegram: { text: '📱 **Como usar no Telegram:**\n\n1. Receba o código por email\n2. Abra o Telegram e encontre seu bot\n3. Digite o código de pareamento\n4. Pronto! Seus clientes já podem interagir 🚀', botoes: [{ label: '🛒 Contratar', acao: 'link', href: '/agentes' }] },
  default: { text: '🤔 Posso te ajudar com:\n\n• Preços e planos\n• Qual agente escolher\n• Como funciona o PIX\n• Prazo de ativação\n• Cancelamento', botoes: [{ label: '💰 Preços', acao: 'preco' }, { label: '🤖 Agentes', acao: 'agente' }, { label: '📱 Como funciona', acao: 'telegram' }] },
};

function detectarTopico(msg) {
  const t = msg.toLowerCase();
  if (/olá|oi |bom dia|boa tarde|boa noite|hello|hey/.test(t)) return 'saudacao';
  if (/preço|preco|valor|custa|mensalidade|quanto/.test(t)) return 'preco';
  if (/agente|qual|escolher|indicar|recomendar|melhor/.test(t)) return 'agente';
  if (/pagar|pagamento|pix|boleto/.test(t)) return 'pagamento';
  if (/ativar|ativação|ativacao|prazo|quando recebo/.test(t)) return 'ativacao';
  if (/cancelar|cancelamento|reembolso|devolução/.test(t)) return 'cancelamento';
  if (/telegram|como usa|funciona/.test(t)) return 'telegram';
  return 'default';
}

function renderTexto(text) {
  return text.split('\n').map((linha, i, arr) => {
    const partes = linha.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {partes.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>)}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function SuportePage() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [digitando, setDigitando] = useState(false);
  const sessionId = useRef(gerarSessionId());
  const bottomRef = useRef(null);
  const pollingRef = useRef(null);

  // Mensagem de boas-vindas ao abrir
  useEffect(() => {
    setTimeout(async () => {
      setDigitando(true);
      try {
        const res = await fetch(`${API}/api/suporte/boas-vindas`);
        const data = await res.json();
        // Converte texto Markdown simples para formato local
        const topico = 'saudacao';
        const local = RESPOSTAS_LOCAL[topico];
        setMsgs([{ tipo: 'bot', text: local.text, botoes: local.botoes }]);
      } catch {
        const local = RESPOSTAS_LOCAL.saudacao;
        setMsgs([{ tipo: 'bot', text: local.text, botoes: local.botoes }]);
      } finally {
        setDigitando(false);
      }
    }, 500);

    // Polling para buscar respostas do backend a cada 2s
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/suporte/respostas/${sessionId.current}`);
        const data = await res.json();
        if (data.respostas && data.respostas.length > 0) {
          // Converte respostas do backend para formato exibível
          data.respostas.forEach(r => {
            const topico = detectarTopico(r.texto.slice(0, 30)) || 'default';
            const local = RESPOSTAS_LOCAL[topico] || RESPOSTAS_LOCAL.default;
            setMsgs(prev => [...prev, { tipo: 'bot', text: local.text, botoes: local.botoes }]);
          });
          setDigitando(false);
        }
      } catch {/* backend offline — sem problema */}
    }, 2000);

    return () => clearInterval(pollingRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, digitando]);

  async function enviarMensagem(texto) {
    if (!texto.trim()) return;

    setMsgs(prev => [...prev, { tipo: 'user', text: texto }]);
    setInput('');
    setDigitando(true);

    // Envia ao backend (que usa o bot do Telegram)
    try {
      await fetch(`${API}/api/suporte/mensagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, texto }),
      });
    } catch {/* fallback local */}

    // Resposta local instantânea (não espera o polling)
    setTimeout(() => {
      const topico = detectarTopico(texto);
      const local = RESPOSTAS_LOCAL[topico] || RESPOSTAS_LOCAL.default;
      setMsgs(prev => [...prev, { tipo: 'bot', text: local.text, botoes: local.botoes }]);
      setDigitando(false);
    }, 900);
  }

  function handleBotao(botao) {
    if (botao.acao === 'link') return;
    enviarMensagem(botao.label);
  }

  return (
    <main className="pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Suporte AgentesIA</h1>
          <p className="text-slate-400 text-sm">Atendimento automático 24h — tire suas dúvidas agora</p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold mt-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Online agora
          </div>
        </div>

        {/* Chat */}
        <div className="card rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[88%]">
                  {m.tipo === 'bot' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 bg-red-500/15 rounded-full flex items-center justify-center text-xs">🤖</div>
                      <span className="text-slate-500 text-xs font-medium">Suporte IA</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.tipo === 'user'
                      ? 'bg-red-600 text-white rounded-tr-sm'
                      : 'bg-white/[0.05] text-slate-200 rounded-tl-sm'
                  }`}>
                    {renderTexto(m.text)}
                  </div>

                  {/* Botões rápidos */}
                  {m.botoes && m.tipo === 'bot' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.botoes.map((b, bi) =>
                        b.acao === 'link' ? (
                          <Link key={bi} href={b.href}
                            className="bg-white/[0.06] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/25 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full no-underline transition-all">
                            {b.label}
                          </Link>
                        ) : (
                          <button key={bi} onClick={() => handleBotao(b)}
                            className="bg-white/[0.06] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/25 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer">
                            {b.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de digitação */}
            {digitando && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-3.5">
                  <div className="flex gap-1 items-center">
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
              onKeyDown={e => e.key === 'Enter' && enviarMensagem(input)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
            />
            <button
              onClick={() => enviarMensagem(input)}
              className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer whitespace-nowrap"
            >
              Enviar →
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
          <p className="text-slate-600 text-xs">
            Precisa de ajuda humana?{' '}
            <a href="mailto:suporte@agentesia.com.br" className="text-red-400 hover:text-red-300">
              suporte@agentesia.com.br
            </a>
          </p>
          <Link href="/agentes" className="btn-primary font-semibold px-5 py-2 rounded-full text-xs no-underline">
            Ver agentes →
          </Link>
        </div>
      </div>
    </main>
  );
}
