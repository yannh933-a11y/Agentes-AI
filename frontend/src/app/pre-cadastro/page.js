import PreCadastroForm from './PreCadastroForm';

export const metadata = {
  title: 'Pré-cadastro | Agentes AI',
  description: 'Receba um diagnóstico para criar um agente de IA exclusivo para atendimento, vendas ou automação da sua empresa.',
};

function getParam(searchParams, key) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default function Page({ searchParams = {} }) {
  return (
    <PreCadastroForm
      initialAgente={getParam(searchParams, 'agente')}
      initialPlano={getParam(searchParams, 'plano')}
    />
  );
}
