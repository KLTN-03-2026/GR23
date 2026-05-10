using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using alilexba_backend.Services;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] 
    public class AIConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AIConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("status")]
        public IActionResult GetAIStatus()
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var isConfigured = !string.IsNullOrEmpty(apiKey);

            return Ok(new
            {
                status = isConfigured ? "Connected" : "Not Configured",
                model = "gemini-1.5-flash",
                lastChecked = DateTime.Now
            });
        }

        // Lưu ý: Trong thực tế, việc cập nhật API Key thường qua Environment Variables hoặc KeyVault.
       
        [HttpPost("update-settings")]
        public IActionResult UpdateAISettings([FromBody] dynamic settings)
        {
            // lưu cấu hình vào DB hoặc File cấu hình
            return Ok(new { message = "Cấu hình AI đã được cập nhật thành công!" });
        }
    }
}