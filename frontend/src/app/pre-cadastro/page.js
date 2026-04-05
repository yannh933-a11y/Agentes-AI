'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { agentes } from '../../lib/agentes';
import axios from 'axios';

// Dropdown customizado com estética do site
function SelectAgente({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const opcoes = [
    { value: '', label: 'Não sei ainda', emoji: '🤔' },
    ...agentes.map(a => ({ value: a.nome, label: `${a.nome} — R$${a.preco}/mês`, emoji: a.emoji })),
  ];

  const selecionado = opcoes.find(o => o.value === value) || opcoes[0];

  // Fecha ao clicar fora
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Botão de abertura */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-left text-white focus:outline-none focus:border-red-500/40 transition flex items-center justify-between hover:border-white/20"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{selecionado.emoji}</span>
          <span className={value ? 'text-white' : 'text-slate-500'}>{selecionado.label}</span>
        </span>
        <span className={`text-red-500 text-xl transition-transform duration-700 ease-in-out ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#0e0e1a] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          {opcoes.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors hover:bg-red-500/10 hover:text-white border-none cursor-pointer ${
                value === o.value ? 'bg-red-500/10 text-white' : 'text-slate-400 bg-transparent'
              }`}
            >
              <span className="text-base w-6 text-center">{o.emoji}</span>
              <span>{o.label}</span>
              {value === o.value && <span className="ml-auto text-red-400 text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PreCadastroPage() {
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '', interesse: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      // Salva pré-cadastro
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/precadastro`, form).catch(() => {});
      // Envia email de agradecimento
      await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'precadastro', email: form.email, nome: form.nome, interesse: form.interesse }),
      }).catch(() => {});
      // Agenda follow-up após 30 min se não comprar (via sessionStorage flag)
      sessionStorage.setItem('precadastro_email', form.email);
      sessionStorage.setItem('precadastro_nome', form.nome);
      sessionStorage.setItem('precadastro_ts', Date.now().toString());
      setSucesso(true);
    } catch {
      setErro('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (sucesso) {
    return (
      <main className="pt-28 pb-24 px-5 sm:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">Pré-cadastro realizado!</h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Enviamos um email de confirmação para você. Quando estiver pronto, é só voltar e contratar seu agente em minutos!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/agentes" className="btn-primary font-bold px-8 py-3 rounded-full no-underline text-center">
              Ver agentes →
            </Link>
            <Link href="/suporte" className="btn-outline font-semibold px-6 py-3 rounded-full no-underline text-center">
              Falar com suporte
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Pré-cadastro</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Salve seus dados agora e contrate seu agente quando estiver pronto — sem pressa!
          </p>
        </div>

        {/* Benefícios */}
        <div className="card rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ['⚡', 'Ativação rápida', 'Quando comprar, já está tudo preenchido'],
              ['📧', 'Atualizações', 'Você recebe novidades por email'],
              ['🎯', 'Sem compromisso', 'Cancele quando quiser'],
            ].map(([icon, titulo, desc]) => (
              <div key={titulo} className="text-center p-3">
                <span className="text-2xl block mb-1">{icon}</span>
                <p className="text-white text-xs font-semibold mb-1">{titulo}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div className="card rounded-2xl p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Nome completo *</label>
              <input
                required type="text" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="João Silva"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm block mb-2">Email *</label>
              <input
                required type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="joao@email.com"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm block mb-2">
                WhatsApp <span className="text-slate-600">(opcional)</span>
              </label>
              <input
                type="text" value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm block mb-2">
                Qual agente te interessa? <span className="text-slate-600">(opcional)</span>
              </label>
              <SelectAgente
                value={form.interesse}
                onChange={val => setForm({ ...form, interesse: val })}
              />
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary font-bold py-4 rounded-full text-base border-none cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar meus dados →'}
            </button>

            <p className="text-slate-600 text-xs text-center">
              Seus dados são protegidos. Veja nossa{' '}
              <Link href="/privacidade" className="text-slate-400 hover:text-white no-underline">Política de Privacidade</Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Já sabe o que quer?{' '}
          <Link href="/agentes" className="text-red-400 hover:text-red-300 no-underline font-semibold">
            Contratar agora →
          </Link>
        </p>
      </div>
    </main>
  );
}
