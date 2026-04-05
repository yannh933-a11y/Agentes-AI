'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

function gerarSessionId() {
  if (typeof window !== 'undefined') {
    const salvo = sessionStorage.getItem('suporte_session');
    if (salvo) return salvo;
    const novo = 'sess_' + Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem('suporte_session', novo);
    return novo;
  }
  return 'sess_' + Math.random().toString(36).slice(2);
}

function renderTexto(text) {
  return text.split('\n').map((linha, i, arr) => {
    const partes = linha.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {partes.map((p, j) =>
          j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function SuportePage() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [digitando, setDigitando] = useState(false);
  const [aguardando, setAguardando] = useState(false);
  const sessionId = useRef(null);
  const bottomRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    sessionId.current = gerarSessionId();

    // Mensagem de boas-vindas
    setTimeout(() => {
      setDigitando(true);
      setTimeout(() => {
        setMsgs([{
          tipo: 'bot',
          text: 'Olá! 😊 Sou o assistente da **AgentesIA**. Estou aqui para te ajudar a escolher o agente ideal para o seu negócio e tirar qualquer dúvida.\n\nComo posso te ajudar hoje?',
          botoes: [
            { label: '💰 Quais são os preços?', texto: 'Quais são os preços dos agentes?' },
            { label: '🤖 Qual agente me indica?', texto: 'Qual agente você me indica?' },
            { label: '📱 Como funciona?', texto: 'Como funciona o agente no Telegram?' },
          ],
        }]);
        setDigitando(false);
      }, 1000);
    }, 400);

    // Polling para buscar respostas do backend a cada 1.5s
    pollingRef.current = setInterval(async () => {
      if (!sessionId.current || !aguardando) return;
      try {
        const res = await fetch(`${API}/api/suporte/respostas/${sessionId.current}`);
        const data = await res.json();
        if (data.respostas && data.respostas.length > 0) {
          data.respostas.forEach(r => {
            setMsgs(prev => [...prev, { tipo: 'bot', text: r.texto }]);
          });
          setDigitando(false);
          setAguardando(false);
        }
      } catch { /* silencioso */ }
    }, 1500);

    return () => clearInterval(pollingRef.current);
  }, []);

  // Ref para aguardando (para usar no polling sem re-render)
  const aguardandoRef = useRef(false);
  useEffect(() => { aguardandoRef.current = aguardando; }, [aguardando]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, digitando]);

  async function enviarMensagem(texto) {
    if (!texto.trim() || digitando) return;
    setInput('');
    setMsgs(prev => [...prev, { tipo: 'user', text: texto }]);
    setDigitando(true);
    setAguardando(true);

    try {
      await fetch(`${API}/api/suporte/mensagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, texto }),
      });
    } catch {
      // Backend offline — resposta de fallback
      setTimeout(() => {
        setMsgs(prev => [...prev, {
          tipo: 'bot',
          text: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato pelo email **suporte@agentesia.com.br** e responderemos em breve! 😊',
        }]);
        setDigitando(false);
        setAguardando(false);
      }, 800);
    }
  }

  return (
    <main className="pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl">🤖</div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050508]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Suporte AgentesIA</h1>
          <p className="text-slate-400 text-sm">Assistente inteligente • Responde em tempo real</p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold mt-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Online agora
          </div>
        </div>

        {/* Chat */}
        <div className="card rounded-2xl overflow-hidden flex flex-col" style={{ height: '540px' }}>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[88%]">
                  {m.tipo === 'bot' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 bg-red-500/15 rounded-full flex items-center justify-center text-xs">🤖</div>
                      <span className="text-slate-500 text-xs font-medium">Assistente IA</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.tipo === 'user'
                      ? 'bg-red-600 text-white rounded-tr-sm'
                      : 'bg-white/[0.05] text-slate-200 rounded-tl-sm'
                  }`}>
                    {renderTexto(m.text)}
                  </div>

                  {/* Botões de sugestão */}
                  {m.botoes && m.tipo === 'bot' && !digitando && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.botoes.map((b, bi) => (
                        <button
                          key={bi}
                          onClick={() => enviarMensagem(b.texto)}
                          className="bg-white/[0.06] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/25 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer"
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Digitando */}
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
              onKeyDown={e => e.key === 'Enter' && !digitando && enviarMensagem(input)}
              placeholder={digitando ? 'Aguarde a resposta...' : 'Digite sua dúvida...'}
              disabled={digitando}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition disabled:opacity-50"
            />
            <button
              onClick={() => enviarMensagem(input)}
              disabled={digitando || !input.trim()}
              className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {digitando ? '...' : 'Enviar →'}
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
          <p className="text-slate-600 text-xs">
            Prefere email?{' '}
            <a href="mailto:suporte@agentesia.com.br" className="text-red-400 hover:text-red-300 transition-colors">
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
