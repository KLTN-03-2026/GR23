using Microsoft.AspNetCore.Mvc;
using alilexba_backend.Data;
using alilexba_backend.Models;
using alilexba_backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration; 

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Student" // Mặc định là sinh viên
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công! Giờ Quốc có thể đăng nhập." });
        }

        // PB05: Đăng nhập hệ thống (Đã cập nhật JWT)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            // --- 1. Tạo danh sách Claims (Thông tin định danh) ---
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role), // Lưu Role để FE phân quyền
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // --- 2. Tạo Signing Key ---
            var jwtKey = _configuration["Jwt:Key"] ?? "Chuoi_Bi_Mat_Sieu_Dai_Va_An_Toan_De_Ky_Token_123456";
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            // --- 3. Cấu trúc Token ---
            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddHours(4), // Token hết hạn sau 4 tiếng
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            // --- 4. Trả về Token và thông tin User ---
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                token = new JwtSecurityTokenHandler().WriteToken(token),
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

        // PB07: Quên mật khẩu (Đã cập nhật bảo mật)
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "Email này không tồn tại trong hệ thống." });
            }

            // Tạo mật khẩu tạm thời
            var random = new Random();
            string newTempPassword = random.Next(100000, 999999).ToString();

            // Mã hóa và lưu vào DB
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newTempPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // LƯU Ý: Trong thực tế, bạn sẽ gửi `newTempPassword` qua Email tại đây.
            // Không trả mật khẩu về Response để tránh rủi ro bảo mật.
            return Ok(new
            {
                message = "Khôi phục thành công! Một mật khẩu mới đã được khởi tạo cho tài khoản của bạn. Vui lòng liên hệ quản trị viên hoặc kiểm tra email (nếu có)."
            });
        }
    }
}