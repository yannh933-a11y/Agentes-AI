'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { agentes, planos } from '../../lib/agentes';
import { ButtonLink, Card, Container, Pill } from '../components/ui';

const tamanhos = ['1-5 pessoas', '6-20 pessoas', '21-100 pessoas', '100+ pessoas'];
const segmentos = ['Clínica/saúde', 'Loja/e-commerce', 'Educação', 'Academia/serviços locais', 'SaaS/tecnologia', 'Financeiro/cobrança', 'Marketing/conteúdo', 'Jurídico/consultoria', 'Outro'];

export default function PreCadastroForm() {
  const params = useSearchParams();
  const agenteInicial = params.get('agente') || '';
  const planoInicial = params.get('plano') || '';
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', whatsapp: '', segmento: '', agente: agenteInicial, plano: planoInicial, tamanho: '', problema: '', origem: 'site' });
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const agenteSelecionado = useMemo(() => agentes.find((agente) => agente.slug === form.agente), [form.agente]);
  const planoSelecionado = useMemo(() => planos.find((plano) => plano.slug === form.plano), [form.plano]);

  async function submit(event) {
    event.preventDefault();
    setErro('');

    if (!form.nome.trim() || !form.empresa.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setErro('Preencha nome, empresa, e-mail e WhatsApp para enviar o pré-cadastro.');
      return;
    }

    if (!form.problema.trim() || form.problema.trim().length < 20) {
      setErro('Explique o principal problema da empresa com pelo menos 20 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/precadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, interesse: form.agente, planoDesejado: form.plano }),
      });
      if (!response.ok) throw new Error('Falha ao enviar');
      setOk(true);
    } catch (error) {
      setErro('Não foi possível enviar agora. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <main className="pt-28 pb-20">
        <Container>
          <Card className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-300">✓</div>
            <h1 className="text-4xl font-black">Pré-cadastro recebido.</h1>
            <p className="mt-4 leading-relaxed text-slate-400">As informações comerciais foram enviadas. O próximo passo é analisar o cenário da empresa, definir o agente mais adequado e preparar uma proposta de implantação.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ButtonLink href="/agentes" variant="outline">Ver agentes</ButtonLink>
              <ButtonLink href="/planos" variant="outline">Ver planos</ButtonLink>
              <ButtonLink href="/">Voltar ao início</ButtonLink>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Pré-cadastro comercial</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Solicite um agente exclusivo para sua empresa.</h1>
          <p className="mt-4 leading-relaxed text-slate-400">Este formulário é o primeiro filtro comercial. Ele ajuda a entender o problema, indicar o agente correto e evitar propostas genéricas.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-start">
          <Card>
            {erro && <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">{erro}</div>}
            <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
              <Field label="Nome" required value={form.nome} onChange={(value) => setForm({ ...form, nome: value })} placeholder="Seu nome" />
              <Field label="Empresa" required value={form.empresa} onChange={(value) => setForm({ ...form, empresa: value })} placeholder="Nome da empresa" />
              <Field label="E-mail" type="email" required value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="contato@empresa.com" />
              <Field label="WhatsApp" required value={form.whatsapp} onChange={(value) => setForm({ ...form, whatsapp: value })} placeholder="(31) 99999-9999" />

              <Select label="Segmento" value={form.segmento} onChange={(value) => setForm({ ...form, segmento: value })} options={segmentos} placeholder="Selecione o segmento" />
              <Select label="Tipo de agente desejado" value={form.agente} onChange={(value) => setForm({ ...form, agente: value })} options={agentes.map((agente) => ({ value: agente.slug, label: agente.nome }))} placeholder="Ainda não sei" />
              <Select label="Plano de interesse" value={form.plano} onChange={(value) => setForm({ ...form, plano: value })} options={planos.map((plano) => ({ value: plano.slug, label: plano.nome }))} placeholder="Ainda não sei" />
              <Select label="Tamanho da empresa" value={form.tamanho} onChange={(value) => setForm({ ...form, tamanho: value })} options={tamanhos} placeholder="Selecione" />

              <div className="md:col-span-2">
                <label className="label">Principal problema *</label>
                <textarea className="input min-h-[150px]" required value={form.problema} onChange={(event) => setForm({ ...form, problema: event.target.value })} placeholder="Ex: perdemos muitos leads porque demoramos a responder no WhatsApp; a equipe responde dúvidas repetidas o dia inteiro; precisamos organizar agendamentos." />
                <p className="mt-2 text-xs text-slate-500">Quanto mais claro o problema, melhor será a indicação do agente.</p>
              </div>

              <button disabled={loading} className="btn-primary rounded-full border-0 py-4 font-black md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Enviando pré-cadastro...' : 'Enviar pré-cadastro'}
              </button>
            </form>
          </Card>

          <div className="space-y-5">
            <Card>
              <h2 className="text-2xl font-black">Resumo da solicitação</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <Resumo label="Agente" value={agenteSelecionado?.nome || 'A definir'} />
                <Resumo label="Plano" value={planoSelecionado?.nome || 'A definir'} />
                <Resumo label="Segmento" value={form.segmento || 'A definir'} />
                <Resumo label="Tamanho" value={form.tamanho || 'A definir'} />
              </div>
            </Card>
            <Card>
              <div className="mb-3 flex flex-wrap gap-2"><Pill tone="red">Diagnóstico</Pill><Pill>Sem compromisso</Pill></div>
              <h2 className="text-xl font-black">O que acontece depois?</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400">
                <li><b className="text-white">1.</b> Análise do problema e segmento.</li>
                <li><b className="text-white">2.</b> Indicação do agente e plano inicial.</li>
                <li><b className="text-white">3.</b> Proposta de ativação e implantação.</li>
                <li><b className="text-white">4.</b> Criação do agente exclusivo da empresa.</li>
              </ol>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return <div><label className="label">{label}{required ? ' *' : ''}</label><input required={required} type={type} className="input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></div>;
}

function Select({ label, value, onChange, options, placeholder }) {
  return <div><label className="label">{label}</label><select className="input" value={value} onChange={(event) => onChange(event.target.value)}><option value="">{placeholder}</option>{options.map((option) => typeof option === 'string' ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

function Resumo({ label, value }) {
  return <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"><span className="text-slate-500">{label}</span><span className="font-bold text-white">{value}</span></div>;
}
