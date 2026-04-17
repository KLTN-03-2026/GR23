using Microsoft.AspNetCore.Mvc;
using alilexba_backend.Data;
using alilexba_backend.Models;
using alilexba_backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

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

        // PB08: Xem thông tin cá nhân (Profile)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            // Trả về object mới để không lộ PasswordHash
            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role
            });
        }

        // PB08: Cập nhật thông tin cá nhân
        [HttpPut("{id}/profile")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            user.FullName = request.FullName;
            // Nếu Quốc muốn cho đổi Email thì thêm dòng dưới, nhưng thường email dùng làm tài khoản nên ít khi đổi
            // user.Email = request.Email; 

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thành công!" });
        }

        // PB08: Đổi mật khẩu (Tính năng cộng thêm cho Sprint 2)
        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Lưu ý: Ở đây Quốc nên dùng thư viện BCrypt hoặc Identity để kiểm tra và hash mật khẩu nhé
            // Đây là bản đơn giản để Quốc chạy luồng logic trước:
            user.PasswordHash = request.NewPassword;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        // PB17: Quản lý người dùng - Admin lấy danh sách (Không lấy Pass)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new { u.Id, u.FullName, u.Email, u.Role })
                .ToListAsync();

            return Ok(users);
        }

        // PB17: Quản lý người dùng - Admin xóa tài khoản
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Người dùng không tồn tại." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa người dùng thành công!" });
        }
    }
}