import { knowledgeItems, settings } from '@/lib/mock-data';

export function createSessionId() {
  return `sess_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSuggestedAnswer(message: string) {
  const normalized = message.toLowerCase();

  const matched = knowledgeItems.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  const buyingIntent = /(giá|báo giá|demo|tư vấn|đăng ký|mua|liên hệ)/i.test(message);
  const handoffIntent = /(nhân viên|người thật|gọi lại|tư vấn viên)/i.test(message);

  if (handoffIntent) {
    return {
      answer: settings.handoffMessage,
      confidence: 0.72,
      suggestedAction: 'handoff',
    };
  }

  if (buyingIntent) {
    return {
      answer:
        'Bên em có thể tư vấn gói phù hợp theo nhu cầu sử dụng. Anh/chị để lại tên và số điện thoại, em ghi nhận để bộ phận tư vấn liên hệ ngay nhé.',
      confidence: 0.84,
      suggestedAction: 'capture_lead',
    };
  }

  if (matched) {
    return {
      answer: matched.content,
      confidence: 0.9,
      suggestedAction: 'answer',
    };
  }

  return {
    answer: settings.fallbackMessage,
    confidence: 0.41,
    suggestedAction: 'fallback',
  };
}
