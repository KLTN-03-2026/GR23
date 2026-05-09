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

        [HttpGet("predict-score")]
        public async Task<IActionResult> GetPrediction()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var history = await _context.ExamResults.Where(r => r.UserId == userId).ToListAsync();

            var result = await _aiService.PredictUserScoreAsync(history);
            return result != null ? Ok(result) : BadRequest("Chưa đủ dữ liệu để AI phân tích.");
        }

        [HttpPost("explain")]
        public async Task<IActionResult> Explain([FromBody] ExplainRequest request)
        {
            var explanation = await _aiService.ExplainQuestionAsync(request.Question, request.UserAnswer, request.CorrectAnswer);
            return Ok(new { explanation });
        }
    }
}