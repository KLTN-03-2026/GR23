using alilexba_backend.Data;
using alilexba_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            var history = await _context.ExamResults.Where(r => r.UserId == userId).ToListAsync();

            var result = _aiService.PredictUserScore(history);
            return result != null ? Ok(result) : BadRequest("Chưa đủ dữ liệu.");
        }
    }
}