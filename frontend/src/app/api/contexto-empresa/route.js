import { companies, getCompanyBySlug } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const company = slug ? getCompanyBySlug(slug) : companies[0];

  return Response.json({
    ok: true,
    company,
    regras: {
      requiredScope: 'companyId',
      agentScope: 'companyId + agentId',
      documentScope: 'companyId + documentId',
      chatScope: 'companyId + chatId',
    },
  });
}
