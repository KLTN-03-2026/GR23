using alilexba_backend.DTOs;
using alilexba_backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace alilexba_backend.Services
{
    public class AIService
    {
        public PredictScoreResponse PredictUserScore(List<ExamResult> history)
        {
            if (history == null || !history.Any()) return null!;

            double avg = history.Average(h => h.Score);
            return new PredictScoreResponse
            {
                PredictedScore = Math.Round(avg + 0.5, 2),
                StabilityLevel = history.Count > 5 ? "Cao" : "Trung bình",
                AiComment = "Bạn đang học tập rất tích cực!",
                WeakTopics = new List<string> { "Đạo hàm", "Hình học không gian" }
            };
        }
    }
}