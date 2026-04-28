using alilexba_backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Quan trọng: Phải có dòng này để dùng CountAsync
using System;
using System.Linq;
using System.Threading.Tasks;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DashboardController(ApplicationDbContext context) => _context = context;

        [HttpGet("stats")]
        public async Task<IActionResult> GetSystemStats()
        {
            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalExams = await _context.Exams.CountAsync(),
                TotalQuestions = await _context.Questions.CountAsync(),
                TotalAttempts = await _context.ExamResults.CountAsync(),
                AverageScore = await _context.ExamResults.AnyAsync()
                    ? Math.Round(await _context.ExamResults.AverageAsync(r => r.Score), 2) : 0
            };
            return Ok(stats);
        }
    }
}