using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using alilexba_backend.Data;
using alilexba_backend.Models;
using System.Threading.Tasks;
using MiniExcelLibs; // Thư viện xử lý Excel
using System.IO;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Lấy toàn bộ câu hỏi kèm đáp án
        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            // CỰC KỲ QUAN TRỌNG: Phải có .Include thì mảng answers mới có dữ liệu
            var questions = await _context.Questions
                .Include(q => q.Answers)
                .ToListAsync();

            return Ok(questions);
        }

        // 2. Thêm câu hỏi lẻ thủ công
        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromBody] Question question)
        {
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == question.SubjectId);
            if (!subjectExists) return BadRequest(new { message = "Môn học không tồn tại!" });

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã thêm câu hỏi thành công!", questionId = question.Id });
        }

        // 3. TÍNH NĂNG CHÍNH: Nhập hàng loạt từ Excel
        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadExcel(IFormFile file, [FromQuery] int subjectId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng chọn file Excel!");

            // Kiểm tra môn học có tồn tại không
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectId);
            if (!subjectExists)
                return BadRequest("ID môn học không hợp lệ hoặc không tồn tại!");

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    // MiniExcel sẽ tự động map các cột trong file vào Model này
                    var rows = stream.Query<QuestionExcelModel>().ToList();

                    if (!rows.Any()) return BadRequest("File Excel trống hoặc sai cấu trúc!");

                    foreach (var row in rows)
                    {
                        // Tạo đối tượng Question mới
                        var newQuestion = new Question
                        {
                            Content = row.Content ?? "Câu hỏi không có nội dung",
                            SubjectId = subjectId,
                            Answers = new List<Answer>()
                        };

                        // Chuẩn hóa đáp án đúng (A, B, C, D)
                        string correctLetter = row.CorrectOption?.Trim().ToUpper() ?? "";

                        // Tạo 4 đáp án tương ứng dựa trên dữ liệu từ file Answer.cs của Quốc (giả sử dùng field Content)
                        newQuestion.Answers.Add(new Answer { Text = row.OptionA ?? "", IsCorrect = (correctLetter == "A") });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionB ?? "", IsCorrect = (correctLetter == "B") });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionC ?? "", IsCorrect = (correctLetter == "C") });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionD ?? "", IsCorrect = (correctLetter == "D") });

                        _context.Questions.Add(newQuestion);
                    }

                    await _context.SaveChangesAsync();
                    return Ok(new { message = $"Thành công! Đã nhập {rows.Count} câu hỏi vào hệ thống AILEXBA." });
                }
            }
            catch (Exception ex)
            {
                // Trả về lỗi chi tiết để Quốc dễ sửa
                return BadRequest($"Lỗi xử lý: {ex.Message}");
            }
        }
    }

    // --- LỚP TRUNG GIAN ĐỂ ĐỌC EXCEL (DTO) ---
    // Quốc có thể để ngay dưới này cho tiện hoặc chuyển sang folder DTOs
    public class QuestionExcelModel
    {
        public string? Content { get; set; }
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string? CorrectOption { get; set; }
    }
}