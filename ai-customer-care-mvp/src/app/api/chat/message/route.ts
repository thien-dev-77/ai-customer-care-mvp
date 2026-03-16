import { getSuggestedAnswer } from '@/lib/chat';

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? '');

  if (!message.trim()) {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const result = getSuggestedAnswer(message);

  return Response.json({
    answer: result.answer,
    confidence: result.confidence,
    suggestedAction: result.suggestedAction,
    sessionId: body?.sessionId ?? null,
  });
}
