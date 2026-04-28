using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using alilexba_backend.Data;
using alilexba_backend.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization; //

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // - Chỉ tài khoản có Role là Admin mới có thể truy cập Controller này
    public class SubjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // PB20: QUẢN LÝ MÔN HỌC & CHUYÊN ĐỀ
        // ==========================================

        // 1. Lấy danh sách môn học
        [HttpGet]
        // Nếu bạn muốn sinh viên vẫn có thể xem danh sách môn học để chọn đề thi, 
        // bạn có thể thêm [AllowAnonymous] hoặc chỉ để [Authorize] tại riêng hàm này.
        public async Task<IActionResult> GetSubjects()
        {
            var subjects = await _context.Subjects.ToListAsync();
            return Ok(subjects);
        }

        // 2. Thêm môn học mới
        [HttpPost]
        public async Task<IActionResult> AddSubject([FromBody] Subject subject)
        {
            // Kiểm tra tên môn học không được để trống
            if (string.IsNullOrWhiteSpace(subject.Name))
            {
                return BadRequest(new { message = "Tên môn học không được để trống." });
            }

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã thêm môn học thành công!", data = subject });
        }

        // 3. Sửa môn học
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(int id, [FromBody] Subject subject)
        {
            if (id != subject.Id)
            {
                return BadRequest(new { message = "ID không đồng nhất giữa URL và dữ liệu gửi lên!" });
            }

            if (string.IsNullOrWhiteSpace(subject.Name))
            {
                return BadRequest(new { message = "Tên môn học không được để trống." });
            }

            _context.Entry(subject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
                    return NotFound(new { message = "Không tìm thấy môn học để cập nhật." });
                else
                    throw;
            }

            return Ok(new { message = "Cập nhật môn học thành công!" });
        }

        // 4. Xóa môn học
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
                return NotFound(new { message = "Không tìm thấy môn học để xóa." });

            _context.Subjects.Remove(subject);

            try
            {
                // Nếu môn học đang chứa Câu hỏi/Đề thi, dòng này sẽ văng lỗi khóa ngoại
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Bắt lỗi và báo cho Frontend biết thay vì sập API
                return BadRequest(new { message = "Không thể xóa môn học này vì đang có câu hỏi hoặc đề thi liên kết với nó." });
            }

            return Ok(new { message = "Đã xóa môn học khỏi hệ thống!" });
        }

        // Hàm hỗ trợ kiểm tra tồn tại
        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.Id == id);
        }
    }
}