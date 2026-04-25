using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using alilexba_backend.Data;
using alilexba_backend.Models;
using alilexba_backend.DTOs;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

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

        // ==========================================
        // PB18: ADMIN - QUẢN LÝ ĐỀ THI
        // ==========================================

        // 1. Lấy danh sách đề thi (Cho Admin)
        [HttpGet]
        public async Task<IActionResult> GetAllExams()
        {
            var exams = await _context.Exams
                .Include(e => e.Subject)
                .Select(e => new {
                    e.Id,
                    e.Title,
                    e.Duration,
                    e.SubjectId,
                    SubjectName = e.Subject !.Name
                })
                .ToListAsync();
            return Ok(exams);
        }

        // 2. Tạo đề thi bằng cách BỐC NGẪU NHIÊN câu hỏi từ Ngân hàng
        [HttpPost("create-random")]
        public async Task<IActionResult> CreateRandomExam([FromBody] CreateExamRequest request)
        {
            // Kiểm tra xem môn học có đủ câu hỏi không
            var availableQuestions = await _context.Questions
                .Where(q => q.SubjectId == request.SubjectId)
                .ToListAsync();

            if (availableQuestions.Count < request.QuestionCount)
            {
                return BadRequest(new
                {
                    message = $"Môn học này chỉ có {availableQuestions.Count} câu hỏi, không đủ để tạo đề {request.QuestionCount} câu."
                });
            }

            // Bốc ngẫu nhiên câu hỏi (Sắp xếp theo GUID ngẫu nhiên)
            var randomQuestions = availableQuestions
                .OrderBy(q => Guid.NewGuid())
                .Take(request.QuestionCount)
                .ToList();

            var newExam = new Exam
            {
                Title = request.Title,
                SubjectId = request.SubjectId,
                Duration = request.Duration,
                Questions = randomQuestions // Giả sử model Exam của bạn có ICollection<Question> Questions
            };

            _context.Exams.Add(newExam);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo đề thi ngẫu nhiên thành công!", examId = newExam.Id });
        }


        // ==========================================
        // PB12: USER - LÀM BÀI THI & CHẤM ĐIỂM
        // ==========================================

        // 3. User: Lấy đề thi để làm (CHE ĐÁP ÁN ĐÚNG)
        [HttpGet("{id}/take")]
        public async Task<IActionResult> GetExamForTaking(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null) return NotFound(new { message = "Không tìm thấy đề thi." });

            // MAP SANG DỮ LIỆU ẨN DANH (Không trả về trường IsCorrect)
            var safeExamData = new
            {
                exam.Id,
                exam.Title,
                exam.Duration,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Content,
                    Answers = q.Answers.Select(a => new { a.Id, a.Text }).ToList() // Chỉ trả về Text, KHÔNG có IsCorrect
                }).ToList()
            };

            return Ok(safeExamData);
        }

        // 4. User: Nộp bài & Tự động chấm điểm
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitExam([FromBody] SubmitExamRequest request)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == request.ExamId);

            if (exam == null) return NotFound(new { message = "Đề thi không hợp lệ." });

            int correctCount = 0;
            int totalQuestions = exam.Questions.Count;

            // Thuật toán chấm điểm
            foreach (var studentAns in request.Answers)
            {
                var question = exam.Questions.FirstOrDefault(q => q.Id == studentAns.QuestionId);
                if (question != null)
                {
                    // Lấy đáp án đúng thực sự từ Database
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);

                    // So sánh với lựa chọn của sinh viên
                    if (correctAnswer != null && correctAnswer.Id == studentAns.SelectedAnswerId)
                    {
                        correctCount++;
                    }
                }
            }

            // Tính điểm hệ 10 (Làm tròn 2 chữ số thập phân)
            double rawScore = (double)correctCount / totalQuestions * 10;
            double finalScore = Math.Round(rawScore, 2);

            // Lưu vào bảng ExamResult
            var result = new ExamResult
            {
                UserId = request.UserId,
                ExamId = request.ExamId,
                Score = finalScore,
                CorrectAnswers = correctCount,
                TotalQuestions = totalQuestions,
                TakenAt = DateTime.UtcNow // Thời gian nộp bài
            };

            _context.ExamResults.Add(result);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Nộp bài thành công!",
                score = finalScore,
                correctCount = correctCount,
                total = totalQuestions
            });
        }


        // ==========================================
        // PB13: USER - LỊCH SỬ THI
        // ==========================================

        // 5. User: Xem danh sách bài đã làm
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetUserHistory(int userId)
        {
            var history = await _context.ExamResults
                .Include(er => er.Exam !)
                    .ThenInclude(e => e.Subject)
                .Where(er => er.UserId == userId)
                .OrderByDescending(er => er.TakenAt)
                .Select(er => new {
                    er.Id,
                    ExamTitle = er.Exam!.Title,
                    SubjectName = er.Exam !.Subject!.Name,
                    er.Score,
                    er.CorrectAnswers,
                    er.TotalQuestions,
                    er.TakenAt
                })
                .ToListAsync();

            return Ok(history);
        }
        // ==========================================
        // Thêm sửa xóa 
        // ==========================================
        // 6. Admin: Cập nhật thông tin đề thi
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] Exam exam)
        {
            if (id != exam.Id)
            {
                return BadRequest(new { message = "ID không đồng nhất!" });
            }

            // Kiểm tra xem đề thi có tồn tại không
            var existingExam = await _context.Exams.AnyAsync(e => e.Id == id);
            if (!existingExam)
            {
                return NotFound(new { message = "Không tìm thấy đề thi để cập nhật." });
            }

            _context.Entry(exam).State = EntityState.Modified;

            // Chặn không cho cập nhật các bảng liên quan (Questions/Results) qua hàm này 
            // để tránh lỗi dữ liệu phức tạp
            _context.Entry(exam).Property(x => x.CreatedAt).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { message = "Cập nhật đề thi thành công!" });
        }
        // 7. Admin: Xóa đề thi
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound(new { message = "Không tìm thấy đề thi." });
            }

            _context.Exams.Remove(exam);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Không thể xóa đề thi này vì đã có dữ liệu kết quả thi liên kết." });
            }

            return Ok(new { message = "Đã xóa đề thi thành công!" });
        }
    }
}