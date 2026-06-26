import { NextResponse } from 'next/server';
import { updateKnowledgeDocument } from '@/lib/server/knowledge-repository';

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const result = await updateKnowledgeDocument(params.id, body);
    if (!result.document) return NextResponse.json({ erro: 'Documento não encontrado ou banco não configurado' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ erro: error.message || 'Erro ao atualizar documento' }, { status: 400 });
  }
}
