using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // Thư viện để xử lý JSON

namespace AILEXBA_Project.Models
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        public string Text { get; set; } = string.Empty;

        public bool IsCorrect { get; set; } // Trả lời đúng hay sai

        public int QuestionId { get; set; }

        [JsonIgnore]
        public Question? Question { get; set; } // Chặn không cho JSON quay ngược lại Question
    }
}