using alilexba_backend.DTOs;
using alilexba_backend.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Text.Json;

namespace alilexba_backend.Services
{
    public class AIService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AIService(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        // PB16: Giải thích câu hỏi (Sử dụng gọi trực tiếp API)
        public async Task<string> ExplainQuestionAsync(string question, string userAnswer, string correctAnswer)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                // Dùng endpoint v1 (ổn định nhất) thay vì v1beta
                var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={apiKey}";

                var requestBody = new
                {
                    contents = new[] {
                        new { parts = new[] { new { text = $@"Bạn là chuyên gia luyện thi THPT Quốc gia của hệ thống AILEXBA. 
                                Hãy giải thích ngắn gọn tại sao câu hỏi: '{question}' có đáp án đúng là '{correctAnswer}' thay vì '{userAnswer}'.
                                Yêu cầu: Trình bày bằng tiếng Việt, dùng Markdown dấu đầu dòng." } } }
                    }
                };

                var response = await _httpClient.PostAsJsonAsync(url, requestBody);
                var jsonResponse = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode) return $"Lỗi API: {jsonResponse}";

                using var doc = JsonDocument.Parse(jsonResponse);
                return doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString()
                       ?? "AI không trả về nội dung.";
            }
            catch (Exception ex)
            {
                return $"Lỗi hệ thống: {ex.Message}";
            }
        }

        // PB15: Dự đoán điểm số
        public async Task<PredictScoreResponse> PredictUserScoreAsync(List<ExamResult> history)
        {
            if (history == null || !history.Any()) return null!;
            double avg = Math.Round(history.Average(h => h.Score), 2);

            // Gọi AI để lấy nhận xét (Tương tự như hàm Explain trên)
            string comment = "Cố gắng phát huy nhé!";
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={apiKey}";
                var body = new { contents = new[] { new { parts = new[] { new { text = $"Điểm trung bình của tôi là {avg}/10, hãy viết 1 câu nhận xét khích lệ ngắn." } } } } };
                var response = await _httpClient.PostAsJsonAsync(url, body);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    comment = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? comment;
                }
            }
            catch { /* Nếu AI lỗi thì dùng comment mặc định */ }

            return new PredictScoreResponse
            {
                PredictedScore = Math.Round(avg + 0.3, 2),
                StabilityLevel = history.Count > 5 ? "Cao" : "Trung bình",
                AiComment = comment,
                WeakTopics = new List<string> { "Đạo hàm", "Số phức" }
            };
        }
    }
}