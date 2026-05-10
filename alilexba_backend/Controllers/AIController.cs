using alilexba_backend.Data;
using alilexba_backend.DTOs;
using alilexba_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;
        private readonly ApplicationDbContext _context;

        public AIController(AIService aiService, ApplicationDbContext context)
        {
            _aiService = aiService;
            _context = context;
        }

        // CẢI TIẾN PB15: Dự đoán điểm dựa trên phân tích hành vi thực tế
       
        [HttpGet("predict-score")]
        public async Task<IActionResult> GetPrediction()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            // Gọi hàm mới: PredictEnhancedAsync thay vì PredictUserScoreAsync
            var result = await _aiService.PredictEnhancedAsync(userId);

            return result != null ? Ok(result) : BadRequest("Chưa đủ dữ liệu phân tích.");
        }

        // CẢI TIẾN PB16: Giải thích sâu (AI Chat Tutor) dựa trên ngữ cảnh câu hỏi cụ thể
        [HttpPost("explain-result-detail/{detailId}")]
        public async Task<IActionResult> ExplainByDetail(int detailId)
        {
            // Kiểm tra xem chi tiết kết quả có tồn tại và thuộc về user này không
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var detail = await _context.ExamResultDetails
                .Include(d => d.ExamResult)
                .FirstOrDefaultAsync(d => d.Id == detailId);

            if (detail == null || detail.ExamResult?.UserId != userId)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu bài làm hợp lệ." });
            }

            // Gọi hàm giải thích sâu có kèm theo dữ liệu TimeSpent và Chuyên đề
            var explanation = await _aiService.ExplainDeepAsync(detailId);
            return Ok(new { explanation });
        }

        // Giữ lại endpoint cũ để đảm bảo tính tương thích (tùy chọn)
        [HttpPost("explain-simple")]
        public async Task<IActionResult> ExplainSimple([FromBody] ExplainRequest request)
        {
            var explanation = await _aiService.ExplainQuestionAsync(request.Question, request.UserAnswer, request.CorrectAnswer);
            return Ok(new { explanation });
        }
    }
}