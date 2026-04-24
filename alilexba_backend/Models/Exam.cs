using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace alilexba_backend.Models
{
    public class Exam
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên đề thi không được để trống.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn môn học.")]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Thời gian làm bài không được để trống.")]
        public int Duration { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // ==========================================
        // KHU VỰC NAVIGATION PROPERTIES (LIÊN KẾT BẢNG)
        // ==========================================

        // Liên kết N-1: 1 Đề thi thuộc về 1 Môn học
        public virtual Subject? Subject { get; set; }

        // Liên kết 1-N: 1 Đề thi có nhiều Câu hỏi
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

        // Liên kết 1-N: 1 Đề thi có nhiều Kết quả thi (của nhiều sinh viên)
        public virtual ICollection<ExamResult> ExamResults { get; set; } = new List<ExamResult>();
    }
}