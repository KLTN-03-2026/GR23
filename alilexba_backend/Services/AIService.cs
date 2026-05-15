using alilexba_backend.DTOs;
using alilexba_backend.Models;
using alilexba_backend.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Net.Http.Json;

namespace alilexba_backend.Services
{
    public class AIService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;

        public AIService(
            IConfiguration configuration,
            ApplicationDbContext context
        )
        {
            _configuration = configuration;
            _context = context;

            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(60)
            };
        }

        private async Task<string> CallGeminiAsync(string prompt)
        {
            try
            {
                var apiKey =
                    _configuration["Gemini:ApiKey"];

                Console.WriteLine($"API KEY: [{apiKey}]");

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    return "Gemini API Key không tồn tại.";
                }

                var url =
 $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
                                    text = prompt
                                }
                            }
                        }
                    }
                };

                var response =
                    await _httpClient.PostAsJsonAsync(
                        url,
                        requestBody
                    );

                // Retry nếu bị rate limit
                if ((int)response.StatusCode == 429)
                {
                    Console.WriteLine("Gemini quota exceeded. Waiting 20s...");

                    await Task.Delay(20000);

                    response =
                        await _httpClient.PostAsJsonAsync(
                            url,
                            requestBody
                        );
                }

                var responseText =
                    await response.Content.ReadAsStringAsync();

                Console.WriteLine("========== GEMINI RESPONSE ==========");
                Console.WriteLine(response.StatusCode);
                Console.WriteLine(responseText);
                Console.WriteLine("=====================================");

                if (!response.IsSuccessStatusCode)
                {
                    return $"Gemini API Error: {response.StatusCode}";
                }

                using var doc =
                    JsonDocument.Parse(responseText);

                var root =
                    doc.RootElement;

                if (
                    !root.TryGetProperty(
                        "candidates",
                        out var candidates
                    )
                )
                {
                    return "Gemini không trả về candidates.";
                }

                if (candidates.GetArrayLength() == 0)
                {
                    return "Gemini không có phản hồi.";
                }

                var text =
                    candidates[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                return text ?? "AI không trả về nội dung.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("========== AI ERROR ==========");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine("==============================");

                return $"Lỗi AI: {ex.Message}";
            }
        }

        public async Task<string> ExplainDeepAsync(int resultDetailId)
        {
            var detail =
                await _context.ExamResultDetails
                    .Include(d => d.Question)
                        .ThenInclude(q => q!.Subject)
                    .Include(d => d.Question)
                        .ThenInclude(q => q!.Answers)
                    .FirstOrDefaultAsync(
                        d => d.Id == resultDetailId
                    );

            if (detail == null || detail.Question == null)
            {
                return "Không tìm thấy dữ liệu câu hỏi.";
            }

            string subjectName =
                detail.Question.Subject?.Name
                ?? "Môn học tự do";

            string correctAnswer =
                detail.Question.Answers?
                    .FirstOrDefault(a => a.IsCorrect)
                    ?.Text
                ?? "Chưa xác định";

            string prompt = $@"
Bạn là chuyên gia giáo dục.

Hãy giải thích câu hỏi môn {subjectName}.

- Nội dung: {detail.Question.Content}

- Đáp án đúng: {correctAnswer}

- Sinh viên đã làm trong:
{detail.TimeSpent} giây.

{(detail.TimeSpent < 10
? "Lưu ý: Sinh viên làm quá nhanh nên có thể cẩu thả."
: "")}

Yêu cầu:
- Giải thích ngắn gọn
- Dễ hiểu
- Có mẹo làm bài nhanh
";

            return await CallGeminiAsync(prompt);
        }

        public async Task<PredictScoreResponse> PredictEnhancedAsync(
            int userId
        )
        {
            var history =
                await _context.ExamResults
                    .Include(r => r.Details!)
                        .ThenInclude(d => d.Question)
                            .ThenInclude(q => q!.Subject)
                    .Where(r => r.UserId == userId)
                    .OrderByDescending(r => r.TakenAt)
                    .Take(10)
                    .ToListAsync();

            if (history == null || !history.Any())
            {
                return null!;
            }

            var allDetails =
                history
                    .SelectMany(
                        h => h.Details
                        ?? new List<ExamResultDetail>()
                    )
                    .ToList();

            var weakTopics =
                allDetails
                    .Where(d =>
                        d.Question != null
                        && d.Question.Subject != null
                        && !d.IsCorrect
                    )
                    .GroupBy(
                        d => d.Question!.Subject!.Name
                    )
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .Take(2)
                    .ToList();

            double avgScore =
                history.Average(h => h.Score);

            int carelessCount =
                allDetails.Count(d =>
                    !d.IsCorrect
                    && d.TimeSpent < 15
                );

            string aiPrompt = $@"
Điểm trung bình: {avgScore}/10

Môn yếu:
{string.Join(", ", weakTopics)}

Số câu sai do làm nhanh:
{carelessCount}

Hãy đưa ra nhận xét học tập
và lời khuyên cải thiện.
";

            return new PredictScoreResponse
            {
                PredictedScore =
                    Math.Round(
                        avgScore
                        + (carelessCount > 5 ? -0.5 : 0.2),
                        2
                    ),

                StabilityLevel =
                    history.Count > 5
                    ? "Cao"
                    : "Trung bình",

                AiComment =
                    await CallGeminiAsync(aiPrompt),

                WeakTopics = weakTopics
            };
        }

        public async Task<string> ExplainQuestionAsync(
            string question,
            string userAnswer,
            string correctAnswer
        )
        {
            string prompt = $@"
Bạn là chuyên gia luyện thi THPT Quốc gia.

Hãy giải thích vì sao:

Câu hỏi:
{question}

Đáp án đúng:
{correctAnswer}

Đáp án người dùng chọn:
{userAnswer}

Yêu cầu:
- Trả lời bằng tiếng Việt
- Ngắn gọn
- Có markdown bullet
";

            return await CallGeminiAsync(prompt);
        }
    }
}