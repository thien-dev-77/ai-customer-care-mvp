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
1. Chạy `supabase/schema.sql`
2. Chạy `supabase/seed.sql`
3. Nếu cần, chạy `supabase/policies.sql`
4. Thay `getSuggestedAnswer()` bằng LLM + retrieval
5. Tích hợp Google Sheets/CRM
6. Thêm auth admin
7. Viết test E2E

## File quan trọng
- `src/app/page.tsx` — landing page
- `src/components/chat-widget.tsx` — widget chat
- `src/app/admin/page.tsx` — admin demo
- `src/lib/chat.ts` — mock orchestration
- `src/lib/repositories.ts` — repository layer qua Supabase
- `supabase/schema.sql` — schema DB
- `supabase/seed.sql` — seed dữ liệu mẫu
- `supabase/policies.sql` — RLS policies mẫu
- `docs/SUPABASE_SETUP.md` — hướng dẫn setup nhanh
- `docs/BACKLOG.md` — backlog triển khai
