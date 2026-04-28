using System;
using System.Collections.Generic; 
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace alilexba_backend.Models
{
    public class ExamResult
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ExamId { get; set; }

        public double Score { get; set; } // Điểm số hệ 10

        public int CorrectAnswers { get; set; } // Số câu đúng

        public int TotalQuestions { get; set; } // Tổng số câu hỏi

        // Sửa CompletedAt thành TakenAt để khớp với Controller
        public DateTime TakenAt { get; set; } = DateTime.UtcNow;

        // ==========================================
        // KHU VỰC LIÊN KẾT BẢNG (NAVIGATION)
        // ==========================================

        [JsonIgnore] // Chặn vòng lặp JSON từ Result -> User
        public virtual User? User { get; set; }

        [JsonIgnore] // Chặn vòng lặp JSON từ Result -> Exam
        public virtual Exam? Exam { get; set; }

        public virtual ICollection<ExamResultDetail> Details { get; set; } = new List<ExamResultDetail>();
    }
}