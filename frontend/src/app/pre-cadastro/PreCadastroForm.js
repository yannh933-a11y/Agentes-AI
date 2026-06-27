'use client';

import { useMemo, useState } from 'react';
import { agentes, planos } from '../../lib/agentes';
import { ButtonLink, Card, Container, Pill } from '../components/ui';

const segmentos = [
  'Clínica/saúde',
  'Loja/e-commerce',
  'Educação',
  'Academia/serviços locais',
  'SaaS/tecnologia',
  'Financeiro/cobrança',
  'Marketing/conteúdo',
  'Jurídico/consultoria',
  'Imobiliária',
  'Restaurante/Delivery',
  'Outro',
];

const tamanhos = [
  '1-5 pessoas',
  '6-20 pessoas',
  '21-100 pessoas',
  '100+ pessoas',
];

const canais = [
  'WhatsApp',
  'Instagram',
  'Site',
  'Interno',
  'WhatsApp + Instagram',
  'Multicanal',
  'Outro',
];

const volumes = [
  'Até 20 atendimentos/dia',
  '21 a 50 atendimentos/dia',
  '51 a 100 atendimentos/dia',
  '101 a 300 atendimentos/dia',
  'Mais de 300 atendimentos/dia',
  'Ainda não sei',
];

const agentFallback = { slug: 'a-definir', nome: 'Ainda não sei / preciso de diagnóstico' };

const initialState = (initialAgente = '', initialPlano = '') => ({
  nome: '',
  whatsapp: '',
  email: '',
  empresa: '',
  segmento: '',
  tamanho: '',
  agente: initialAgente || agentFallback.slug,
  plano: initialPlano || '',
  canal: '',
  volume: '',
  problema: '',
  origem: 'pre-cadastro-site',
});

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function getAgentLabel(value) {
  if (value === agentFallback.slug) return agentFallback.nome;
  return agentes.find((agente) => agente.slug === value)?.nome || 'A definir';
}

function getPlanLabel(value) {
  return planos.find((plano) => plano.slug === value)?.nome || 'A definir';
}

export default function PreCadastroForm({ initialAgente = '', initialPlano = '' }) {
  const [form, setForm] = useState(() => initialState(initialAgente, initialPlano));
  const [success, setSuccess] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const agenteSelecionado = useMemo(() => getAgentLabel(form.agente), [form.agente]);
  const planoSelecionado = useMemo(() => getPlanLabel(form.plano), [form.plano]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const required = [
      ['nome', 'nome completo'],
      ['whatsapp', 'WhatsApp'],
      ['email', 'e-mail'],
      ['empresa', 'nome da empresa'],
      ['segmento', 'segmento da empresa'],
      ['tamanho', 'tamanho da empresa'],
      ['agente', 'tipo de agente desejado'],
      ['canal', 'canal onde o agente será usado'],
      ['volume', 'volume aproximado de atendimentos'],
      ['problema', 'principal problema da empresa'],
    ];

    const missing = required.find(([field]) => !String(form[field] || '').trim());
    if (missing) return `Preencha o campo ${missing[1]} para receber o diagnóstico.`;

    if (!validateEmail(form.email.trim())) return 'Informe um e-mail válido.';
    if (onlyDigits(form.whatsapp).length < 10) return 'Informe um WhatsApp válido com DDD.';
    if (form.problema.trim().length < 20) return 'Explique o principal problema com pelo menos 20 caracteres.';

    return '';
  }

  async function submit(event) {
    event.preventDefault();
    setErro('');

    const validationError = validateForm();
    if (validationError) {
      setErro(validationError);
      return;
    }

    const payload = {
      ...form,
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: form.whatsapp.trim(),
      empresa: form.empresa.trim(),
      problema: form.problema.trim(),
      interesse: form.agente,
      agenteNome: agenteSelecionado,
      planoDesejado: form.plano,
      planoNome: planoSelecionado,
    };

    setLoading(true);
    try {
      const response = await fetch('/api/precadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.erro || 'Falha ao enviar o pré-cadastro.');

      setSuccess({
        leadId: data.leadId,
        source: data.source,
        empresa: payload.empresa,
        agente: payload.agenteNome,
      });
      setForm(initialState(initialAgente, initialPlano));
    } catch (error) {
      setErro(error.message || 'Não foi possível enviar agora. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="pt-28 pb-20">
        <Container>
          <Card className="mx-auto max-w-3xl overflow-hidden text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-3xl font-black text-emerald-300">✓</div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-200">Diagnóstico solicitado</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Pré-cadastro recebido.</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-400">
              Recebemos as informações da <b className="text-white">{success.empresa}</b>. Agora a próxima etapa é analisar o cenário, indicar o melhor agente e preparar uma proposta de implantação.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
              <NextStep number="1" title="Análise" text="Entendemos o segmento, canal e volume de atendimento." />
              <NextStep number="2" title="Indicação" text="Definimos o agente mais adequado para a operação." />
              <NextStep number="3" title="Proposta" text="Montamos o caminho de ativação e implantação." />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ButtonLink href="/ia-lab" variant="outline">Testar IA Lab</ButtonLink>
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
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="mb-5 flex flex-wrap gap-2">
              <Pill tone="red">Pré-cadastro comercial</Pill>
              <Pill>Diagnóstico sem compromisso</Pill>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Receba um diagnóstico para criar seu agente de IA
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Preencha as informações da sua empresa e nossa equipe irá entender qual agente faz mais sentido para seu atendimento, vendas ou automação.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <MiniCard title="1. Entendemos" text="Seu segmento, canal, volume e gargalo principal." />
              <MiniCard title="2. Indicamos" text="O tipo de agente mais adequado para começar." />
              <MiniCard title="3. Implantamos" text="Um agente exclusivo treinado para sua empresa." />
            </div>

            <Card className="mt-6">
              <h2 className="text-xl font-black">O formulário ajuda a evitar proposta genérica.</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400">
                <ChecklistItem>Identifica se o foco inicial é atendimento, vendas, suporte ou automação.</ChecklistItem>
                <ChecklistItem>Mostra em qual canal o agente precisa atuar primeiro.</ChecklistItem>
                <ChecklistItem>Ajuda a estimar complexidade, prazo e plano inicial.</ChecklistItem>
              </ul>
            </Card>
          </section>

          <section>
            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Dados para diagnóstico</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">Campos com * são obrigatórios para enviar sua solicitação.</p>
                  </div>
                  <Pill tone="green">Conversão principal</Pill>
                </div>

                {erro && (
                  <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold leading-relaxed text-red-100">
                    {erro}
                  </div>
                )}

                <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                  <Field label="Nome completo" required value={form.nome} onChange={(value) => update('nome', value)} placeholder="Seu nome completo" autoComplete="name" />
                  <Field label="WhatsApp" required value={form.whatsapp} onChange={(value) => update('whatsapp', value)} placeholder="(31) 99999-9999" autoComplete="tel" />
                  <Field label="E-mail" type="email" required value={form.email} onChange={(value) => update('email', value)} placeholder="contato@empresa.com" autoComplete="email" />
                  <Field label="Nome da empresa" required value={form.empresa} onChange={(value) => update('empresa', value)} placeholder="Nome da empresa" autoComplete="organization" />

                  <Select label="Segmento da empresa" required value={form.segmento} onChange={(value) => update('segmento', value)} options={segmentos} placeholder="Selecione o segmento" />
                  <Select label="Tamanho da empresa" required value={form.tamanho} onChange={(value) => update('tamanho', value)} options={tamanhos} placeholder="Selecione o tamanho" />
                  <Select
                    label="Tipo de agente desejado"
                    required
                    value={form.agente}
                    onChange={(value) => update('agente', value)}
                    options={[agentFallback, ...agentes].map((agente) => ({ value: agente.slug, label: agente.nome }))}
                    placeholder="Selecione o agente"
                  />
                  <Select label="Canal onde será usado" required value={form.canal} onChange={(value) => update('canal', value)} options={canais} placeholder="Selecione o canal" />
                  <Select label="Volume aproximado por dia" required value={form.volume} onChange={(value) => update('volume', value)} options={volumes} placeholder="Selecione o volume" />
                  <Select label="Plano de interesse" value={form.plano} onChange={(value) => update('plano', value)} options={planos.map((plano) => ({ value: plano.slug, label: plano.nome }))} placeholder="Ainda não sei" />

                  <div className="md:col-span-2">
                    <label className="label">Principal problema que deseja resolver *</label>
                    <textarea
                      className="input min-h-[150px] resize-y"
                      required
                      value={form.problema}
                      onChange={(event) => update('problema', event.target.value)}
                      placeholder="Ex: perdemos muitos leads porque demoramos a responder no WhatsApp; a equipe responde dúvidas repetidas o dia inteiro; precisamos organizar agendamentos."
                    />
                    <p className="mt-2 text-xs text-slate-500">Mínimo recomendado: 20 caracteres. Quanto mais claro o problema, melhor será o diagnóstico.</p>
                  </div>

                  <div className="md:col-span-2">
                    <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-3 rounded-full border-0 px-6 py-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
                      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                      {loading ? 'Enviando diagnóstico...' : 'Receber diagnóstico'}
                    </button>
                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
                      Ao enviar, você autoriza a Agentes AI a usar esses dados para analisar sua solicitação comercial.
                    </p>
                  </div>
                </form>
              </div>
            </Card>

            <Card className="mt-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-black">Resumo da solicitação</h2>
                  <p className="mt-2 text-sm text-slate-500">Atualizado automaticamente conforme você preenche o formulário.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>{agenteSelecionado}</Pill>
                  {form.canal && <Pill tone="red">{form.canal}</Pill>}
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Resumo label="Empresa" value={form.empresa || 'A definir'} />
                <Resumo label="Segmento" value={form.segmento || 'A definir'} />
                <Resumo label="Tamanho" value={form.tamanho || 'A definir'} />
                <Resumo label="Volume" value={form.volume || 'A definir'} />
                <Resumo label="Canal" value={form.canal || 'A definir'} />
                <Resumo label="Plano" value={planoSelecionado} />
              </div>
            </Card>
          </section>
        </div>
      </Container>
    </main>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder, autoComplete }) {
  return (
    <div>
      <label className="label">{label}{required ? ' *' : ''}</label>
      <input required={required} type={type} className="input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <label className="label">{label}{required ? ' *' : ''}</label>
      <select required={required} className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => typeof option === 'string'
          ? <option key={option} value={option}>{option}</option>
          : <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function Resumo({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function MiniCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-black text-emerald-300">✓</span>
      <span>{children}</span>
    </li>
  );
}

function NextStep({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-sm font-black text-red-200">{number}</div>
      <h3 className="font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}
