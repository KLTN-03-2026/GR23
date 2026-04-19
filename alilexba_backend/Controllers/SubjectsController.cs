using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using alilexba_backend.Data;
using alilexba_backend.Models;
using System.Threading.Tasks;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách môn học
        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var subjects = await _context.Subjects.ToListAsync();
            return Ok(subjects);
        }

        // Thêm môn học mới (VD: Toán, Tiếng Anh)
        [HttpPost]
        public async Task<IActionResult> AddSubject([FromBody] Subject subject)
        {
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã thêm môn học thành công!", subjectId = subject.Id });
        }
        // sửa 
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(int id, [FromBody] Subject subject)
        {
            // Kiểm tra xem ID trên URL và ID trong Body có khớp nhau không
            if (id != subject.Id)
            {
                return BadRequest(new { message = "ID không đồng nhất giữa URL và dữ liệu gửi lên!" });
            }

            _context.Entry(subject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id)) return NotFound(new { message = "Không tìm thấy môn học để cập nhật." });
                else throw;
            }

            return Ok(new { message = "Cập nhật môn học thành công!" });
        }

        // xóa
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound(new { message = "Không tìm thấy môn học để xóa." });

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa môn học khỏi hệ thống!" });
        }

        // Hàm hỗ trợ kiểm tra tồn tại
        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.Id == id);
        }
    }
}