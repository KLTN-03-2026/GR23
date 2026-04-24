using alilexba_backend.Data;
using alilexba_backend.DTOs;
using alilexba_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // KHU VỰC 1: DÀNH CHO ADMIN (PB19 - QUẢN LÝ NGƯỜI DÙNG)
        // ==========================================

        // 1. Admin: Xem danh sách người dùng
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new { u.Id, u.FullName, u.Email, u.Role })
                .ToListAsync();

            return Ok(users);
        }

        // 2. Admin: Thêm người dùng mới (Chức năng bị thiếu lúc trước)
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] AdminCreateUserRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã tồn tại trong hệ thống." });
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = string.IsNullOrWhiteSpace(request.Role) ? "Student" : request.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm người dùng thành công!" });
        }

        // 3. Admin: Sửa thông tin & Phân quyền người dùng 
        [HttpPut("admin-update/{id}")]
        public async Task<IActionResult> AdminUpdateUser(int id, [FromBody] AdminUpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            user.FullName = request.FullName;
            user.Email = request.Email;
            user.Role = request.Role; // Admin có quyền đổi Role (Admin/Student)

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật tài khoản thành công!" });
        }

        // 4. Admin: Xóa người dùng
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            // Ràng buộc PB19: Không được xóa Admin cuối cùng
            if (user.Role == "Admin")
            {
                var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
                if (adminCount <= 1)
                    return BadRequest(new { message = "Không thể xóa Admin duy nhất của hệ thống." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa người dùng thành công." });
        }


        // ==========================================
        // KHU VỰC 2: DÀNH CHO USER (PB10 & PB09 - CÁ NHÂN HÓA)
        // ==========================================

        // 1. User: Xem thông tin cá nhân
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role
            });
        }

        // 2. User: Tự cập nhật thông tin (Chỉ được đổi tên)
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Tài khoản không tồn tại." });

            user.FullName = request.FullName;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin cá nhân thành công!",
                user = new { id = user.Id, fullName = user.FullName, email = user.Email, role = user.Role }
            });
        }

        // 3. User: Đổi mật khẩu
        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            if (string.IsNullOrWhiteSpace(request.OldPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng nhập đủ mật khẩu cũ và mới." });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Mật khẩu hiện tại không đúng." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }
    }
}