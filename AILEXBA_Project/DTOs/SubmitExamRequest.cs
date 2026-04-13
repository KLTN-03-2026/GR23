namespace AILEXBA_Project.DTOs
{
    public class SubmitExamRequest
    {
        public int ExamId { get; set; }
        public int UserId { get; set; }
        public List<UserAnswerDto> Answers { get; set; } = new();
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedAnswerId { get; set; } // Id đáp án sinh viên chọn
    }
}