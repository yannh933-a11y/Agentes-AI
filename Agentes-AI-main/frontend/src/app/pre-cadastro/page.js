import { Suspense } from 'react';
import PreCadastroForm from './PreCadastroForm';
export const metadata={title:'Pré-cadastro | OpenClaw'};
export default function Page(){return <Suspense fallback={<main className="pt-28 pb-20"><div className="max-w-3xl mx-auto px-5 text-slate-400">Carregando...</div></main>}><PreCadastroForm /></Suspense>}
