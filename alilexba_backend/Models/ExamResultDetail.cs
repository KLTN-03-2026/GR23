using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace alilexba_backend.Models
{
    public class ExamResultDetail
    {
        [Key]
        public int Id { get; set; }

        public int ExamResultId { get; set; } // Liên kết với bảng kết quả tổng

        public int QuestionId { get; set; } // Câu hỏi nào?

        public int SelectedAnswerId { get; set; } // Sinh viên đã chọn đáp án nào?

        public bool IsCorrect { get; set; } // Tại thời điểm đó chọn đúng hay sai?

        [JsonIgnore]
        public virtual ExamResult? ExamResult { get; set; }
        public int TimeSpent { get; set; }

        public virtual Question? Question { get; set; }
       
    }
}