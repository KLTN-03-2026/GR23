using System.Collections.Generic;

namespace alilexba_backend.DTOs
{
    // 1. DTO cho Admin tạo đề thi ngẫu nhiên
    public class CreateExamRequest
    {
        public string Title { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public int Duration { get; set; } // Thời gian làm bài (phút)
        public int QuestionCount { get; set; } // Số lượng câu hỏi muốn lấy ngẫu nhiên
    }

    // 2. DTO để User nộp bài
    public class SubmitExamRequest
    {
        public int UserId { get; set; }
        public int ExamId { get; set; }
        // Danh sách các câu trả lời của sinh viên
        public List<StudentAnswerDTO> Answers { get; set; } = new List<StudentAnswerDTO>();
    }

    public class StudentAnswerDTO
    {
        public int QuestionId { get; set; }
        public int SelectedAnswerId { get; set; } // ID của đáp án mà sinh viên chọn
    }
}