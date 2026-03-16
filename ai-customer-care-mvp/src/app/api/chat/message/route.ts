import { detectIntent } from '@/lib/chat';
import { generateAnswer } from '@/lib/openai';
import { getAppSettings, listKnowledgeItems } from '@/lib/repositories';

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? '');

  if (!message.trim()) {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const [knowledge, settings] = await Promise.all([
    listKnowledgeItems(),
    getAppSettings(),
  ]);

  const suggestedAction = detectIntent(message);

  try {
    const answer = await generateAnswer({
      message,
      knowledge: knowledge.map((item) => ({
        title: item.title,
        content: item.content,
        category: item.category,
      })),
      welcomeMessage: settings.welcomeMessage,
      fallbackMessage: settings.fallbackMessage,
      handoffMessage: settings.handoffMessage,
    });

    return Response.json({
      answer,
      confidence: suggestedAction === 'answer' ? 0.85 : 0.78,
      suggestedAction,
      sessionId: body?.sessionId ?? null,
    });
  } catch (error) {
    return Response.json({
      answer: settings.fallbackMessage,
      confidence: 0.35,
      suggestedAction: suggestedAction === 'answer' ? 'fallback' : suggestedAction,
      sessionId: body?.sessionId ?? null,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
