🚀 AILEXBA - Backend API
Dự án Backend cung cấp hệ thống API nền tảng cho AILEXBA - Hệ thống quản lý học sinh và ngân hàng đề thi thông minh tích hợp AI.

🛠️ Công nghệ & Kiến trúc
Framework: .NET 8.0 (ASP.NET Core Web API)

Kiến trúc: Controllers & DTOs pattern (Phân chia rõ ràng logic xử lý và dữ liệu truyền tải).

Cơ sở dữ liệu: SQL Server (LocalDB).

ORM: Entity Framework Core 8 (Code-First).

Xử lý JSON: ReferenceHandler.IgnoreCycles (Xử lý mượt mà quan hệ vòng lặp giữa Question - Answer - Result).

Bảo mật: BCrypt.Net-Next (Mã hóa mật khẩu) & CORS Policy (Cấu hình cho Next.js).

🎯 Tiến độ dự án
✅ Sprint 1 & 2 (Đã và đang hoàn thành - Cập nhật 13/04/2026)
Dựa trên cấu trúc dự án hiện tại, các module sau đã được xây dựng hoàn thiện:

Xác thực (Auth):

API Đăng ký (RegisterRequest) và Đăng nhập (LoginRequest) với mã hóa BCrypt.

API Đổi mật khẩu (ChangePasswordRequest).

Quản lý người dùng (Users):

API xem và cập nhật thông tin hồ sơ cá nhân (UpdateProfileRequest).

Admin API: Lấy danh sách toàn bộ người dùng và xóa tài khoản.

Quản lý đề thi (Exams):

CRUD Đề thi: Admin có thể tạo, sửa, xóa và quản lý trạng thái đề thi.

Tìm kiếm & Lọc: API tìm kiếm đề thi theo tiêu đề hoặc lọc theo Môn học (SubjectId).

Hệ thống Chấm điểm & Lịch sử (Trọng tâm Sprint 2):

Logic Chấm điểm tự động: API /api/Exams/submit nhận bài làm, tự động so khớp đáp án đúng và tính điểm hệ 10.

Xử lý Edge Cases: Hoàn thiện logic xử lý khi sinh viên nộp bài trống.

Lịch sử thi: API lấy danh sách các bài đã làm của sinh viên kèm điểm số và thời gian hoàn thành.

⏳ Sprint 3 (Sắp tới)
[ ] Generative AI: Tích hợp LLM (Gemini/OpenAI) để giải thích chi tiết các câu hỏi sinh viên làm sai.

[ ] JWT Token: Triển khai Middleware để phân quyền Admin/Student tự động qua Token.

[ ] Dashboard Analytics: API thống kê tỉ lệ làm bài đúng/sai cho Admin.

🚀 Hướng dẫn cài đặt cho Team (Frontend / QA)
Yêu cầu môi trường
.NET 8.0 SDK

SQL Server Express LocalDB

Visual Studio 2022

Các bước khởi chạy
Clone dự án:

Cập nhật Database:
Mở Package Manager Console trong Visual Studio và chạy:

Chạy dự án:
Nhấn F5 hoặc dotnet run. Swagger sẽ khởi chạy tại: https://localhost:7083/swagger.
