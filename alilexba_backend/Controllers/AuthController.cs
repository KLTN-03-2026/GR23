using Microsoft.AspNetCore.Mvc;
using alilexba_backend.Data;
using alilexba_backend.Models;
using alilexba_backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System; // Cần thêm System để dùng hàm Random tạo số

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PB04: Đăng ký tài khoản
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] alilexba_backend.DTOs.RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã tồn tại. Quốc thử email khác nhé!" });
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                // Đảm bảo đã cài thư viện BCrypt.Net-Next
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Student" // Gán mặc định để tránh lỗi Null ở Database
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công! Giờ Quốc có thể đăng nhập." });
        }

        // PB05: Đăng nhập hệ thống
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] alilexba_backend.DTOs.LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            // TRẢ VỀ DỮ LIỆU PHẲNG: Để Frontend (authService.login) nhận được đúng tên trường
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        // PB06: Đổi mật khẩu
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] alilexba_backend.DTOs.ChangePasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản này." });
            }

            if (string.IsNullOrEmpty(request.OldPassword) || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật mật khẩu thành công!" });
        }

        // PB07: Quên mật khẩu
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] alilexba_backend.DTOs.ForgotPasswordRequest request)
        {
            // 1. Kiểm tra xem email có trong hệ thống không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "Email này không tồn tại trong hệ thống. Quốc kiểm tra lại nhé!" });
            }

            // 2. Tạo mật khẩu mới ngẫu nhiên (6 chữ số)
            var random = new Random();
            string newTempPassword = random.Next(100000, 999999).ToString();

            // 3. Mã hóa và lưu mật khẩu mới vào Database
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newTempPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Khôi phục thành công! Mật khẩu mới của bạn là: {newTempPassword}",
                tempPassword = newTempPassword
            });
        }
    }
}