const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateAnswer(params: {
  message: string;
  knowledge: Array<{ title: string; content: string; category: string }>;
  welcomeMessage?: string;
  fallbackMessage: string;
  handoffMessage: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const context = params.knowledge
    .map((item, index) => `${index + 1}. [${item.category}] ${item.title}: ${item.content}`)
    .join('\n');

  const systemPrompt = [
    'Bạn là trợ lý AI chăm sóc khách hàng cho doanh nghiệp.',
    'Chỉ trả lời dựa trên knowledge base được cung cấp.',
    'Không bịa giá, chính sách, tính năng ngoài dữ liệu.',
    'Nếu câu hỏi vượt ngoài knowledge hoặc không chắc, hãy trả lời ngắn gọn và nói rõ là chưa chắc.',
    'Nếu người dùng có ý định mua hàng, demo, báo giá hoặc muốn được tư vấn, hãy khuyến khích để lại tên và số điện thoại.',
    'Nếu người dùng muốn gặp người thật, hãy hướng sang handoff.',
    '',
    'Knowledge base:',
    context || 'Không có knowledge.',
  ].join('\n');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.message },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text}`);
  }

  const json = await response.json();
  const answer = json?.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return params.fallbackMessage;
  }
  return answer;
}
