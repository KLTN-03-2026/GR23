namespace alilexba_backend.DTOs
{
    public class PredictScoreResponse
    {
        public double PredictedScore { get; set; } // Điểm dự đoán tổng quát 
        public string StabilityLevel { get; set; } = string.Empty; // Mức độ ổn định 
        public string AiComment { get; set; } = string.Empty; // Nhận xét từ AI 
        public List<string> WeakTopics { get; set; } = new List<string>(); // Chuyên đề còn yếu 
    }
}