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
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            // TRẢ VỀ DỮ LIỆU PHẲNG: Để Frontend (authService.login) nhận được đúng tên trường
            return Ok(new
            {
                userId = user.Id, // Đổi từ "id" thành "userId" cho khớp với Interface UserData ở FE
                fullName = user.FullName,
                email = user.Email,
                role = user.Role,
                message = "Đăng nhập thành công!"
            });
        }

        // PB06: Đổi mật khẩu
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
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
    }
}