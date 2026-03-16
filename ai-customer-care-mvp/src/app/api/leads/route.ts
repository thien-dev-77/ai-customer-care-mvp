import { leads } from '@/lib/mock-data';

export async function GET() {
  return Response.json({ items: leads });
}

export async function POST(request: Request) {
  const body = await request.json();

  const payload = {
    id: `lead_${Date.now()}`,
    name: body?.name ?? 'Unknown',
    phone: body?.phone ?? '',
    email: body?.email ?? '',
    interest: body?.interest ?? '',
    source: body?.source ?? 'website',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  return Response.json({ success: true, item: payload });
}
