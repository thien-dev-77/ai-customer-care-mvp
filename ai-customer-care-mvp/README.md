# AI Customer Care MVP

Bộ skeleton cho MVP chatbot AI bán hàng/chăm sóc khách hàng trên website doanh nghiệp.

## Có gì trong project
- Landing page demo
- Chat widget mock chạy qua API nội bộ
- Admin dashboard demo
- API routes mẫu
- Schema SQL cho Supabase/Postgres
- Backlog kỹ thuật để dev tiếp

## Chạy local
```bash
npm install
npm run dev
```

Mở:
- `/` landing page + chat widget
- `/admin` admin demo
- `/api/chat/message` API chat mock

## Việc cần làm tiếp để ra production
1. Kết nối Supabase thật
2. Thay mock data bằng DB
3. Thay `getSuggestedAnswer()` bằng LLM + retrieval
4. Tích hợp Google Sheets/CRM
5. Thêm auth admin
6. Viết test E2E

## File quan trọng
- `src/app/page.tsx` — landing page
- `src/components/chat-widget.tsx` — widget chat
- `src/app/admin/page.tsx` — admin demo
- `src/lib/chat.ts` — mock orchestration
- `supabase/schema.sql` — schema DB
- `docs/BACKLOG.md` — backlog triển khai
