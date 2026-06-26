'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { agentes, categorias } from '../../lib/agentes';
import { ButtonLink, Card, Pill } from '../components/ui';

export default function AgentesCatalog() {
  const [categoria, setCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return agentes.filter((agente) => {
      const matchCategoria = categoria === 'Todos' || agente.categoria === categoria;
      const texto = `${agente.nome} ${agente.categoria} ${agente.descricao} ${agente.paraQuem} ${(agente.idealPara || []).join(' ')}`.toLowerCase();
      return matchCategoria && (!termo || texto.includes(termo));
    });
  }, [categoria, busca]);

  return (
    <>
      <Card className="mb-8 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <label className="label" htmlFor="busca-agente">Buscar agente por necessidade</label>
            <input
              id="busca-agente"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              className="input"
              placeholder="Ex: WhatsApp, clínica, vendas, agendamento, cobrança..."
            />
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {categorias.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategoria(item)}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${categoria === item ? 'border-red-500/50 bg-red-500/15 text-red-100' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-400">
          {filtrados.length} agente{filtrados.length === 1 ? '' : 's'} encontrado{filtrados.length === 1 ? '' : 's'}
        </p>
        <ButtonLink href="/demo" variant="outline" className="w-full sm:w-auto">Testar demonstração</ButtonLink>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtrados.map((agente) => (
          <Link href={`/agentes/${agente.slug}`} key={agente.slug} className="group card rounded-3xl p-6 no-underline">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 font-black text-red-200">{agente.icon}</div>
              <div className="flex flex-col items-end gap-2">
                {agente.destaque && <Pill tone="red">Popular</Pill>}
                <Pill>{agente.categoria}</Pill>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-black text-white group-hover:text-red-100">{agente.nome}</h2>
            <p className="min-h-[88px] text-sm leading-relaxed text-slate-400">{agente.resumo || agente.descricao}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(agente.idealPara || []).slice(0, 3).map((segmento) => <Pill key={segmento}>{segmento}</Pill>)}
            </div>
            <div className="mt-6 flex items-end gap-1">
              <span className="text-3xl font-black text-white">R$ {agente.preco}</span>
              <span className="mb-1 text-sm text-slate-500">/mês</span>
            </div>
            <div className="mt-5 font-black text-red-300">Ver página do agente →</div>
          </Link>
        ))}
      </div>

      {filtrados.length === 0 && (
        <Card className="mt-8 text-center">
          <h2 className="text-2xl font-black">Nenhum agente encontrado.</h2>
          <p className="mt-3 text-slate-400">Tente outro termo ou solicite um agente personalizado para sua operação.</p>
          <ButtonLink href="/pre-cadastro" className="mt-6">Solicitar agente personalizado</ButtonLink>
        </Card>
      )}
    </>
  );
}
