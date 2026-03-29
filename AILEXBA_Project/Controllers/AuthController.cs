using Microsoft.AspNetCore.Mvc;
using AILEXBA_Project.Data;
using AILEXBA_Project.Models;
using AILEXBA_Project.DTOs;
using System.Linq;
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

        // Chức năng Đăng ký (PB04)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Kiểm tra xem email đã tồn tại chưa
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            // Tạo người dùng mới
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                // Mã hóa mật khẩu trước khi lưu vào Database
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Student" // Mặc định người đăng ký mới là Học sinh
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // Chức năng Đăng nhập (PB05)
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Tìm người dùng theo email
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            // Kiểm tra user có tồn tại và mật khẩu có khớp với mã hash trong DB không
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu." });
            }

            // Trả về thông tin cơ bản (Ở bước sau chúng ta sẽ nâng cấp lên JWT Token)
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                userId = user.Id,
                fullName = user.FullName,
                role = user.Role
            });
        }
    }
}