using alilexba_backend.Data;
using alilexba_backend.DTOs;
using alilexba_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
        // ADMIN - QUẢN LÝ ĐỀ THI
        // ==========================================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllExams()
        {
            var exams = await _context.Exams
                .Include(e => e.Subject)
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Duration,
                    e.SubjectId,
                    SubjectName = e.Subject!.Name
                })
                .ToListAsync();

            return Ok(exams);
        }

        // ==========================================
        // USER - XEM DANH SÁCH ĐỀ THI
        // ==========================================

        [HttpGet("available")]
        [Authorize]
        public async Task<IActionResult> GetAvailableExams()
        {
            var exams = await _context.Exams
                .Include(e => e.Subject)
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Duration,
                    e.SubjectId,
                    SubjectName = e.Subject!.Name
                })
                .ToListAsync();

            return Ok(exams);
        }

        [HttpPost("create-random")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRandomExam([FromBody] CreateExamRequest request)
        {
            var availableQuestions = await _context.Questions
                .Where(q => q.SubjectId == request.SubjectId)
                .ToListAsync();

            if (availableQuestions.Count < request.QuestionCount)
            {
                return BadRequest(new
                {
                    message = $"Môn học này chỉ có {availableQuestions.Count} câu hỏi, không đủ tạo đề {request.QuestionCount} câu."
                });
            }

            var randomQuestions = availableQuestions
                .OrderBy(q => Guid.NewGuid())
                .Take(request.QuestionCount)
                .ToList();

            var newExam = new Exam
            {
                Title = request.Title,
                SubjectId = request.SubjectId,
                Duration = request.Duration,
                Questions = randomQuestions
            };

            _context.Exams.Add(newExam);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo đề thi ngẫu nhiên thành công!",
                examId = newExam.Id
            });
        }

        // ==========================================
        // USER - LÀM BÀI THI
        // ==========================================

        [HttpGet("{id}/take")]
        [Authorize]
        public async Task<IActionResult> GetExamForTaking(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đề thi."
                });
            }

            var safeExamData = new
            {
                exam.Id,
                exam.Title,
                exam.Duration,

                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Content,

                    Answers = q.Answers.Select(a => new
                    {
                        a.Id,
                        a.Text
                    }).ToList()

                }).ToList()
            };

            return Ok(safeExamData);
        }

        [HttpPost("submit")]
        [Authorize]
        public async Task<IActionResult> SubmitExam([FromBody] SubmitExamRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Phiên đăng nhập hết hạn!"
                });
            }

            int currentUserId = int.Parse(userIdClaim.Value);

            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == request.ExamId);

            if (exam == null)
            {
                return NotFound(new
                {
                    message = "Đề thi không hợp lệ."
                });
            }

            int correctCount = 0;

            var details = new List<ExamResultDetail>();

            foreach (var studentAns in request.Answers)
            {
                var question = exam.Questions
                    .FirstOrDefault(q => q.Id == studentAns.QuestionId);

                bool isCorrect = false;

                if (question != null)
                {
                    var correctAnswer = question.Answers
                        .FirstOrDefault(a => a.IsCorrect);

                    isCorrect =
                        correctAnswer != null &&
                        correctAnswer.Id == studentAns.SelectedAnswerId;

                    if (isCorrect)
                    {
                        correctCount++;
                    }
                }

                details.Add(new ExamResultDetail
                {
                    QuestionId = studentAns.QuestionId,
                    SelectedAnswerId = studentAns.SelectedAnswerId,
                    IsCorrect = isCorrect,
                    TimeSpent = studentAns.TimeSpent
                });
            }

            var result = new ExamResult
            {
                UserId = currentUserId,
                ExamId = request.ExamId,
                Score = Math.Round(
                    (double)correctCount / exam.Questions.Count * 10,
                    2
                ),
                CorrectAnswers = correctCount,
                TotalQuestions = exam.Questions.Count,
                TakenAt = DateTime.Now,
                Details = details
            };

            _context.ExamResults.Add(result);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Nộp bài thành công!",
                score = result.Score,
                resultId = result.Id
            });
        }

        // ==========================================
        // LỊCH SỬ THI
        // ==========================================

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetUserHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int currentUserId = int.Parse(userIdClaim.Value);

            var history = await _context.ExamResults
                .Include(er => er.Exam!)
                    .ThenInclude(e => e.Subject)
                .Where(er => er.UserId == currentUserId)
                .OrderByDescending(er => er.TakenAt)
                .Select(er => new
                {
                    er.Id,
                    ExamTitle = er.Exam!.Title,
                    SubjectName = er.Exam!.Subject!.Name,
                    er.Score,
                    er.CorrectAnswers,
                    er.TotalQuestions,
                    er.TakenAt
                })
                .ToListAsync();

            return Ok(history);
        }

        // ==========================================
        // CHI TIẾT KẾT QUẢ
        // ==========================================

        [HttpGet("result/{resultId}")]
        [Authorize]
        public async Task<IActionResult> GetResultDetail(int resultId)
        {
            var result = await _context.ExamResults
                .Include(er => er.Exam)
                .Include(er => er.Details!)
                    .ThenInclude(d => d.Question)
                        .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(er => er.Id == resultId);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy dữ liệu bài thi."
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (
                result.UserId.ToString() != userIdClaim?.Value &&
                userRole != "Admin"
            )
            {
                return Forbid();
            }

            return Ok(result);
        }

        // ==========================================
        // ADMIN - UPDATE / DELETE
        // ==========================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateExam(
            int id,
            [FromBody] Exam exam
        )
        {
            if (id != exam.Id)
            {
                return BadRequest(new
                {
                    message = "ID không đồng nhất!"
                });
            }

            _context.Entry(exam).State = EntityState.Modified;

            _context.Entry(exam)
                .Property(x => x.CreatedAt)
                .IsModified = false;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật đề thi thành công!"
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams.FindAsync(id);

            if (exam == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đề thi."
                });
            }

            _context.Exams.Remove(exam);

            try
            {
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Đã xóa đề thi thành công!"
                });
            }
            catch
            {
                return BadRequest(new
                {
                    message = "Không thể xóa đề thi này vì đã có kết quả thi liên kết."
                });
            }
        }

        // ==========================================
        // SEARCH
        // ==========================================

        [HttpGet("search")]
        public async Task<IActionResult> SearchExams(
            [FromQuery] int? subjectId,
            [FromQuery] string? title,
            [FromQuery] string? difficulty
        )
        {
            var query = _context.Exams
                .Include(e => e.Subject)
                .AsQueryable();

            if (subjectId.HasValue)
            {
                query = query.Where(
                    e => e.SubjectId == subjectId.Value
                );
            }

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(
                    e => e.Title.Contains(title)
                );
            }

            if (!string.IsNullOrEmpty(difficulty))
            {
                query = query.Where(
                    e => e.Difficulty == difficulty
                );
            }

            var result = await query
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Duration,
                    e.Difficulty,

                    SubjectName =
                        e.Subject != null
                            ? e.Subject.Name
                            : "Không xác định"
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}