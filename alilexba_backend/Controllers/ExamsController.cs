using alilexba_backend.Data;
using alilexba_backend.DTOs;
using alilexba_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        #region --- QUẢN LÝ ĐỀ THI (ADMIN & USER) ---

        // PB09: Lấy danh sách tất cả đề thi
        [HttpGet]
        public async Task<IActionResult> GetExams()
        {
            var exams = await _context.Exams.ToListAsync();
            return Ok(exams);
        }

        // PB09: Tìm kiếm và Lọc đề thi theo Môn học hoặc Tiêu đề
        [HttpGet("search")]
        public async Task<IActionResult> SearchExams([FromQuery] int? subjectId, [FromQuery] string? title)
        {
            var query = _context.Exams.AsQueryable();

            if (subjectId.HasValue)
                query = query.Where(e => e.SubjectId == subjectId);

            if (!string.IsNullOrEmpty(title))
                query = query.Where(e => e.Title.Contains(title));

            var results = await query.ToListAsync();
            return Ok(results);
        }

        // PB16: Admin tạo mới đề thi
        [HttpPost]
        public async Task<IActionResult> CreateExam([FromBody] Exam exam)
        {
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Tạo đề thi thành công!", examId = exam.Id });
        }

        // PB16: Admin cập nhật đề thi
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] Exam exam)
        {
            var existingExam = await _context.Exams.FindAsync(id);
            if (existingExam == null) return NotFound(new { message = "Không tìm thấy đề thi." });

            existingExam.Title = exam.Title;
            existingExam.DurationMinutes = exam.DurationMinutes;
            existingExam.IsActive = exam.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật đề thi thành công!" });
        }

        // PB16: Admin xóa đề thi
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound(new { message = "Đề thi không tồn tại." });

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa đề thi thành công!" });
        }

        #endregion

        #region --- LOGIC THI VÀ KẾT QUẢ ---

        // PB11: Nộp bài thi và Chấm điểm tự động
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitExam([FromBody] SubmitExamRequest request)
        {
            // 1. Xử lý trường hợp nộp bài trắng (Edge Case)
            if (request.Answers == null || !request.Answers.Any())
            {
                var zeroResult = new ExamResult
                {
                    UserId = request.UserId,
                    ExamId = request.ExamId,
                    Score = 0,
                    CorrectAnswers = 0,
                    TotalQuestions = 0
                };
                _context.ExamResults.Add(zeroResult);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Bạn đã nộp bài trắng!", Score = 0, Correct = 0 });
            }

            // 2. Lấy thông tin đề thi kèm đáp án đúng
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == request.ExamId);

            if (exam == null) return NotFound("Không tìm thấy đề thi!");

            int correctCount = 0;
            int total = exam.Questions.Count;

            // 3. Chấm điểm logic
            foreach (var userAnswer in request.Answers)
            {
                var question = exam.Questions.FirstOrDefault(q => q.Id == userAnswer.QuestionId);
                if (question != null)
                {
                    // So khớp Id đáp án đã chọn với bảng Answers (IsCorrect == true)
                    var isCorrect = question.Answers.Any(a => a.Id == userAnswer.SelectedAnswerId && a.IsCorrect);
                    if (isCorrect) correctCount++;
                }
            }

            // 4. Tính điểm hệ 10
            double finalScore = total > 0 ? Math.Round(((double)correctCount / total) * 10, 2) : 0;

            // 5. Lưu kết quả vào Database
            var result = new ExamResult
            {
                UserId = request.UserId,
                ExamId = request.ExamId,
                Score = finalScore,
                CorrectAnswers = correctCount,
                TotalQuestions = total
            };

            _context.ExamResults.Add(result);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Nộp bài thành công!",
                Score = finalScore,
                Correct = correctCount,
                Total = total
            });
        }

        // PB14: Xem lịch sử thi của sinh viên
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetExamHistory(int userId)
        {
            var history = await _context.ExamResults
                .Where(r => r.UserId == userId)
                .Include(r => r.Exam)
                .OrderByDescending(r => r.CompletedAt)
                .ToListAsync();

            return Ok(history);
        }

        #endregion
    }
}