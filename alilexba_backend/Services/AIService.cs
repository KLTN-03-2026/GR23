using alilexba_backend.DTOs;
using alilexba_backend.Models;
using alilexba_backend.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace alilexba_backend.Services
{
    public class AIService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;

        public AIService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
            _httpClient = new HttpClient();
        }

        private async Task<string> CallGeminiAsync(string prompt)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={apiKey}";

                var requestBody = new
                {
                    contents = new[] { new { parts = new[] { new { text = prompt } } } }
                };

                var response = await _httpClient.PostAsJsonAsync(url, requestBody);
                if (!response.IsSuccessStatusCode) return "Dịch vụ AI đang bận, vui lòng thử lại sau.";

                using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
                return doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? "";
            }
            catch { return "Lỗi kết nối AI."; }
        }


        public async Task<string> ExplainDeepAsync(int resultDetailId)
        {
            var detail = await _context.ExamResultDetails
                .Include(d => d.Question)
                    .ThenInclude(q => q!.Subject)
                .Include(d => d.Question)
                    .ThenInclude(q => q!.Answers)
                .FirstOrDefaultAsync(d => d.Id == resultDetailId);

            // Kiểm tra null an toàn
            if (detail == null || detail.Question == null) return "Không tìm thấy dữ liệu câu hỏi.";


            string subjectName = detail.Question.Subject?.Name ?? "Môn học tự do";
            string correctAnswer = detail.Question.Answers?.FirstOrDefault(a => a.IsCorrect)?.Text ?? "Chưa xác định";

            string prompt = $@"Bạn là chuyên gia giáo dục. Hãy giải thích câu hỏi môn {subjectName}.
            - Nội dung: {detail.Question.Content}
            - Đáp án đúng: {correctAnswer}
            - Sinh viên đã làm trong: {detail.TimeSpent} giây.
            {(detail.TimeSpent < 10 ? "Lưu ý: Sinh viên làm rất nhanh, có thể do cẩu thả." : "")}
            Hãy giải thích ngắn gọn lý do chọn đáp án đúng và mẹo làm nhanh dạng bài này.";

            return await CallGeminiAsync(prompt);
        }


        public async Task<PredictScoreResponse> PredictEnhancedAsync(int userId)
        {
            var history = await _context.ExamResults
                .Include(r => r.Details!)
                    .ThenInclude(d => d.Question)
                        .ThenInclude(q => q!.Subject)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.TakenAt)
                .Take(10).ToListAsync();

            if (history == null || !history.Any()) return null!;

            var allDetails = history.SelectMany(h => h.Details ?? new List<ExamResultDetail>()).ToList();


            var weakTopics = allDetails
                .Where(d => d.Question != null && d.Question.Subject != null && !d.IsCorrect)
                .GroupBy(d => d.Question!.Subject!.Name) // Sử dụng "!" để khẳng định dữ liệu đã qua lọc null
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key).Take(2).ToList();

            double avgScore = history.Average(h => h.Score);
            int carelessCount = allDetails.Count(d => !d.IsCorrect && d.TimeSpent < 15);

            string aiPrompt = $@"Dựa trên kết quả học tập: Điểm TB {avgScore}/10. 
            Môn yếu nhất: {string.Join(", ", weakTopics)}. 
            Số câu sai do làm quá nhanh (<15s): {carelessCount}.
            Hãy đưa ra 1 lời nhận xét chuyên môn về hành vi học tập này.";

            return new PredictScoreResponse
            {
                PredictedScore = Math.Round(avgScore + (carelessCount > 5 ? -0.5 : 0.2), 2),
                StabilityLevel = history.Count > 5 ? "Cao" : "Trung bình",
                AiComment = await CallGeminiAsync(aiPrompt),
                WeakTopics = weakTopics
            };
        }

        public async Task<string> ExplainQuestionAsync(string question, string userAnswer, string correctAnswer)
        {
            string prompt = $@"Bạn là chuyên gia luyện thi THPT Quốc gia của hệ thống AILEXBA. 
                              Hãy giải thích ngắn gọn tại sao câu hỏi: '{question}' có đáp án đúng là '{correctAnswer}' thay vì '{userAnswer}'.
                              Yêu cầu: Trình bày bằng tiếng Việt, dùng Markdown dấu đầu dòng.";
            return await CallGeminiAsync(prompt);
        }
    }
}