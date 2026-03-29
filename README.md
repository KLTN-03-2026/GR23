# 🚀 AILEXBA Backend API

Dự án Backend cung cấp hệ thống API nền tảng cho **AILEXBA** - Hệ thống quản lý học sinh và ngân hàng đề thi thông minh. Dự án được phát triển với kiến trúc tiên tiến nhất của .NET 8.

## 🛠️ Công nghệ sử dụng
* **Framework:** .NET 8.0 (Web API)
* **Kiến trúc:** Minimal APIs (Tối ưu hiệu suất, loại bỏ Controllers rườm rà)
* **Ngôn ngữ:** C# 12 (Sử dụng Primary Constructors, Records, Collection Expressions)
* **Cơ sở dữ liệu:** SQL Server (LocalDB)
* **ORM:** Entity Framework Core 8
* **Bảo mật:** BCrypt.Net-Next (Mã hóa mật khẩu)

## 🎯 Tiến độ dự án
### ✅ Sprint 1 (Hoàn thành)
- [x] **PB04, PB05 (Xác thực):** Đăng ký và Đăng nhập tài khoản với mật khẩu được mã hóa an toàn.
- [x] **PB18 (Môn học):** API thêm và lấy danh sách các môn học (Toán, Tiếng Anh...).
- [x] **PB15 (Ngân hàng đề thi):** API quản lý câu hỏi trắc nghiệm kèm theo danh sách 4 đáp án.

### ⏳ Sprint 2 (Sắp tới)
- [ ] Tích hợp JWT Token để phân quyền Admin / Student.
- [ ] Xây dựng logic chấm điểm bài thi tự động.
- [ ] Tích hợp Generative AI giải thích chi tiết đáp án sai.

## 🚀 Hướng dẫn cài đặt cho Team (Frontend / QA)

### Yêu cầu môi trường:
* [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* Visual Studio 2022 (hoặc VS Code)
* SQL Server Express LocalDB (Thường có sẵn khi cài Visual Studio)

### Các bước khởi chạy:
1. **Clone dự án về máy:**
   ```bash
   git clone [https://github.com/vanquoc06/AILEXBA_Backend.git](https://github.com/vanquoc06/AILEXBA_Backend.git)
