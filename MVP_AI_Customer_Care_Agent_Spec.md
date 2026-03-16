# MVP AI Customer Care Agent – Technical Spec v1

## 1. Mục tiêu
Xây dựng một MVP chatbot AI cho website doanh nghiệp, có khả năng:
- trả lời FAQ 24/7
- tư vấn thông tin sản phẩm/dịch vụ cơ bản
- thu lead khi khách có nhu cầu
- chuyển người thật khi AI không xử lý tốt
- lưu lịch sử hội thoại
- hỗ trợ demo và thương mại hóa nhanh

## 2. Phạm vi MVP

### In scope
- Chat widget nhúng website
- Hỏi đáp dựa trên knowledge base
- Lead capture
- Human handoff cơ bản
- Lưu conversation
- Admin quản lý FAQ, leads, settings
- Tích hợp Google Sheets để nhận lead

### Out of scope
- Messenger/Zalo/Telegram đa kênh
- Voice bot
- CRM enterprise phức tạp
- Recommendation engine nâng cao
- Dashboard BI nâng cao
- AI tự học hoàn toàn

## 3. User roles
- Visitor: khách truy cập website chat với bot
- Admin: quản lý FAQ, xem leads, cấu hình bot
- Sales/CSKH: nhận lead và follow-up

## 4. Use cases chính

### UC1: Khách hỏi FAQ
1. Khách mở widget chat
2. Bot gửi lời chào
3. Khách hỏi chính sách/sản phẩm
4. Backend tìm trong knowledge base
5. AI trả lời ngắn gọn, đúng dữ liệu

### UC2: Khách có ý định mua
1. Khách hỏi giá / muốn tư vấn / để lại liên hệ
2. Bot hỏi tên + số điện thoại + nhu cầu
3. Lưu lead vào DB
4. Đẩy lead sang Google Sheets
5. Gửi thông báo cho admin/sales

### UC3: AI không chắc
1. Khách hỏi ngoài phạm vi
2. Bot không bịa
3. Bot mời để lại thông tin hoặc chờ nhân viên hỗ trợ
4. Tạo lead với tag `handoff`

### UC4: Admin quản lý dữ liệu
1. Admin đăng nhập
2. Xem/sửa FAQ
3. Xem lead mới
4. Xem lịch sử chat
5. Cấu hình lời chào / fallback / thông tin doanh nghiệp

## 5. Chức năng chi tiết

### 5.1 Chat widget
- Nút chat nổi ở góc website
- Popup chat UI đơn giản
- Hiển thị message user/bot
- Loading khi bot trả lời
- Tự cuộn xuống cuối cuộc hội thoại
- Cho phép reset cuộc hội thoại

### 5.2 AI hỏi đáp
- Trả lời dựa trên knowledge base
- Không bịa giá/chính sách nếu không có dữ liệu
- Có fallback message khi không chắc
- Có thể gợi ý khách để lại thông tin

### 5.3 Lead capture
Trigger khi:
- khách hỏi giá
- khách muốn mua
- khách muốn nhân viên tư vấn
- khách để lại số điện thoại/email

Field tối thiểu:
- name
- phone
- email (optional)
- interest
- source
- conversation_id
- created_at

### 5.4 Human handoff
- Bot nói rõ khi không chắc câu trả lời
- Tạo lead với trạng thái `pending_followup`
- Gắn tag `handoff`

### 5.5 Admin panel
#### FAQ management
- thêm / sửa / xóa knowledge item
- phân loại category
- publish/unpublish

#### Lead management
- xem danh sách lead
- lọc theo ngày/trạng thái
- export CSV

#### Conversation log
- xem lịch sử chat
- xem message nào fallback nhiều

#### Settings
- company name
- bot name
- welcome message
- fallback message
- contact info
- Google Sheet webhook/config

## 6. Kiến trúc hệ thống

### Frontend
- Website widget: Next.js/React embeddable widget
- Admin panel: Next.js dashboard

### Backend
- REST API / server actions
- Session handling
- AI orchestration layer
- Retrieval layer
- Lead creation service
- Google Sheets integration service

### Data
- PostgreSQL / Supabase
- Vector search: pgvector hoặc Supabase vector

### AI
- LLM API: OpenAI/Claude/Gemini
- Embedding model để tìm knowledge liên quan
- Prompt templates + guardrails

## 7. Đề xuất stack
- Frontend: Next.js
- UI: Tailwind CSS + shadcn/ui
- Backend: Next.js API routes
- DB: Supabase Postgres
- Auth admin: Supabase Auth
- AI model: OpenAI GPT-4.1 hoặc tương đương
- Embeddings: text-embedding-3-small hoặc tương đương
- Deploy: Vercel + Supabase
- Lead sync: Google Sheets API hoặc Apps Script webhook

## 8. Database schema đề xuất

### table: knowledge_items
- id
- title
- content
- category
- status
- source
- created_at
- updated_at

### table: conversations
- id
- session_id
- user_id_nullable
- source
- created_at

### table: messages
- id
- conversation_id
- role
- content
- confidence_nullable
- created_at

### table: leads
- id
- conversation_id
- name
- phone
- email
- interest
- source
- status
- tags
- created_at

### table: settings
- id
- company_name
- bot_name
- welcome_message
- fallback_message
- handoff_message
- notification_email
- created_at
- updated_at

## 9. API design gợi ý

### Public APIs
#### POST /api/chat/session
- tạo session chat mới

#### POST /api/chat/message
Input:
- sessionId
- message
Output:
- answer
- confidence
- suggestedAction

#### POST /api/leads
Input:
- conversationId
- name
- phone
- email
- interest
Output:
- success

### Admin APIs
#### GET /api/admin/knowledge
#### POST /api/admin/knowledge
#### PUT /api/admin/knowledge/:id
#### DELETE /api/admin/knowledge/:id

#### GET /api/admin/leads
#### GET /api/admin/conversations
#### GET /api/admin/settings
#### PUT /api/admin/settings

## 10. Luồng AI xử lý message
1. Nhận user message
2. Classify intent:
   - FAQ
   - buying_intent
   - handoff_request
   - out_of_scope
3. Retrieve knowledge liên quan
4. Gọi LLM với prompt + context
5. Trả lời khách
6. Nếu buying_intent => trigger lead flow
7. Lưu logs vào DB

## 11. Prompt rules
System rules:
- Chỉ trả lời dựa trên knowledge được cung cấp
- Không tự bịa thông tin về giá, tồn kho, chính sách
- Nếu không chắc, nói không chắc và mời để lại thông tin
- Giữ câu trả lời ngắn, dễ hiểu, lịch sự
- Nếu phát hiện nhu cầu mua hàng, thu lead
- Nếu khách yêu cầu gặp người thật, chuyển handoff

## 12. UI screens cần có

### Public
- Website with chat widget
- Chat popup

### Admin
- Login page
- Dashboard overview đơn giản
- FAQ list/create/edit
- Lead list/detail
- Conversation list/detail
- Settings page

## 13. Acceptance criteria

### Chat
- Bot trả lời được ít nhất 80% FAQ mẫu
- Response time trung bình < 5 giây
- Có fallback rõ ràng khi thiếu dữ liệu

### Lead
- Lead được lưu DB thành công
- Lead được đẩy lên Google Sheets
- Có thể xem lại trong admin panel

### Admin
- CRUD FAQ hoạt động
- Lead list hiển thị đúng
- Conversation logs xem được

## 14. Test cases tối thiểu
- gửi câu hỏi FAQ hợp lệ
- gửi câu hỏi ngoài phạm vi
- lead capture với phone hợp lệ
- handoff khi bot không chắc
- sync lead lên Google Sheets
- admin thêm/sửa/xóa FAQ
- admin xem danh sách lead
- reset session chat

## 15. Security & guardrails
- Rate limit cho API chat
- Sanitize input
- Auth cho admin panel
- Log các fallback/handoff
- Không expose prompt nội bộ ra client
- Không lưu dữ liệu nhạy cảm không cần thiết

## 16. Roadmap 4 tuần

### Tuần 1
- chốt scope
- setup project
- thiết kế DB
- tạo admin auth
- tạo knowledge schema

### Tuần 2
- làm chat widget
- API chat
- retrieval + prompt
- lưu conversation

### Tuần 3
- lead capture
- Google Sheets integration
- admin FAQ + lead list

### Tuần 4
- test end-to-end
- tối ưu prompt
- deploy
- chuẩn bị demo thương mại

## 17. Deliverables
- source code MVP
- database schema
- admin panel
- widget chat nhúng web
- tài liệu setup
- demo script bán hàng

## 18. Kế hoạch thương mại hóa sau MVP
Phase 2:
- thêm Messenger/Zalo
- lead scoring
- analytics tốt hơn
- workflow follow-up

Phase 3:
- multi-tenant SaaS
- billing
- white-label
- CRM integrations nâng cao

## 19. Gợi ý pricing ban đầu
- Setup fee: 10–30 triệu
- Monthly fee: 3–10 triệu
- Custom integration: báo giá riêng

## 20. Kết luận
MVP này đủ để:
- demo với khách hàng thật
- triển khai cho 1 doanh nghiệp đầu tiên
- chứng minh hiệu quả trước khi mở rộng thành hệ sản phẩm AI B2B
