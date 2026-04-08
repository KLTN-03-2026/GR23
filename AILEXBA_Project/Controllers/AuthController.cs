using Microsoft.AspNetCore.Mvc;
using AILEXBA_Project.Data;
using AILEXBA_Project.Models;
using AILEXBA_Project.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AILEXBA_Project.Controllers
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
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Kiểm tra email trùng
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng. Quốc thử email khác nhé!" });
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                // Hash mật khẩu để bảo mật
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Student" // Mặc định là sinh viên
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công! Giờ Quốc có thể đăng nhập rồi." });
        }

        // PB05: Đăng nhập hệ thống
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Kiểm tra user tồn tại và khớp mật khẩu
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            // Trả về thông tin cơ bản để Frontend lưu vào LocalStorage/Cookie
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

        // PB06: Đổi mật khẩu (Cần mật khẩu cũ để đảm bảo chính chủ)
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản này." });
            }

            // Bắt buộc phải có mật khẩu cũ để xác thực (trừ khi Quốc làm tính năng Reset cho Admin)
            if (string.IsNullOrEmpty(request.OldPassword) || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            // Cập nhật mật khẩu mới
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật mật khẩu thành công!" });
        }
    }
}