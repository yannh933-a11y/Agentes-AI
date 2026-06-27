'use client';

import { useState } from 'react';
import { ButtonLink, Pill } from '../components/ui';

const motivos = [
  'Quero contratar um agente',
  'Quero uma demonstração',
  'Sou cliente e preciso de suporte',
  'Quero entender planos e implantação',
  'Parceria ou integração',
  'Outro assunto',
];

const initialForm = {
  nome: '',
  whatsapp: '',
  email: '',
  empresa: '',
  motivo: '',
  mensagem: '',
  origem: 'contato-site',
};

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());
}

export default function ContactQuickForm() {
  const [form, setForm] = useState(initialForm);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const required = [
      ['nome', 'nome'],
      ['whatsapp', 'WhatsApp'],
      ['email', 'e-mail'],
      ['empresa', 'empresa'],
      ['motivo', 'motivo do contato'],
      ['mensagem', 'mensagem'],
    ];

    const missing = required.find(([field]) => !String(form[field] || '').trim());
    if (missing) return `Preencha o campo ${missing[1]} para enviar o contato.`;
    if (!validateEmail(form.email)) return 'Informe um e-mail válido.';
    if (onlyDigits(form.whatsapp).length < 10) return 'Informe um WhatsApp válido com DDD.';
    if (form.mensagem.trim().length < 15) return 'Escreva uma mensagem com pelo menos 15 caracteres.';
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
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim().toLowerCase(),
      empresa: form.empresa.trim(),
      motivo: form.motivo.trim(),
      mensagem: form.mensagem.trim(),
    };

    setLoading(true);
    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.erro || 'Não foi possível enviar sua mensagem agora.');

      setSuccess({
        id: data.contactId,
        source: data.source,
        nome: payload.nome,
        empresa: payload.empresa,
        motivo: payload.motivo,
      });
      setForm(initialForm);
    } catch (error) {
      setErro(error.message || 'Falha ao enviar contato. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.07] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-2xl font-black text-emerald-300">✓</div>
          <Pill tone="green">Contato recebido</Pill>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Recebemos sua mensagem.</h2>
          <p className="mt-3 leading-relaxed text-slate-300">
            Obrigado, <b className="text-white">{success.nome}</b>. A solicitação da <b className="text-white">{success.empresa}</b> foi registrada como <b className="text-white">{success.motivo}</b>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            O retorno será feito pelos contatos informados. Enquanto isso, você pode testar uma simulação no IA Lab ou preencher o diagnóstico completo para acelerar a análise comercial.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink>
            <ButtonLink href="/ia-lab" variant="outline">Testar IA Lab</ButtonLink>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="btn-outline inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold"
            >
              Novo contato
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
      {erro && (
        <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold leading-relaxed text-red-100">
          {erro}
        </div>
      )}

      <Field label="Nome" required value={form.nome} onChange={(value) => update('nome', value)} placeholder="Seu nome" autoComplete="name" />
      <Field label="WhatsApp" required value={form.whatsapp} onChange={(value) => update('whatsapp', value)} placeholder="(31) 99999-9999" autoComplete="tel" />
      <Field label="E-mail" type="email" required value={form.email} onChange={(value) => update('email', value)} placeholder="contato@empresa.com" autoComplete="email" />
      <Field label="Empresa" required value={form.empresa} onChange={(value) => update('empresa', value)} placeholder="Nome da empresa" autoComplete="organization" />
      <Select label="Motivo do contato" required value={form.motivo} onChange={(value) => update('motivo', value)} options={motivos} placeholder="Selecione o motivo" />

      <div className="md:col-span-2">
        <label className="label">Mensagem *</label>
        <textarea
          className="input min-h-[150px] resize-y"
          required
          value={form.mensagem}
          onChange={(event) => update('mensagem', event.target.value)}
          placeholder="Conte o que sua empresa precisa automatizar, qual canal usa hoje e qual seria o melhor próximo passo."
        />
        <p className="mt-2 text-xs text-slate-500">Quanto mais contexto você enviar, mais precisa será a orientação inicial.</p>
      </div>

      <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">
          Ao enviar, você autoriza o contato da Agentes AI pelos canais informados para tratar desta solicitação.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary inline-flex min-w-[210px] items-center justify-center rounded-full px-6 py-3.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Enviar contato'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, required = false, type = 'text', placeholder = '', autoComplete }) {
  return (
    <div>
      <label className="label">{label}{required ? ' *' : ''}</label>
      <input
        className="input"
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false, placeholder = 'Selecione' }) {
  return (
    <div>
      <label className="label">{label}{required ? ' *' : ''}</label>
      <select className="input" required={required} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
