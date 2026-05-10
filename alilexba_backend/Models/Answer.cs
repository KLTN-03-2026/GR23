using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; 

namespace alilexba_backend.Models
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        public string Text { get; set; } = string.Empty;

        public bool IsCorrect { get; set; } // Trả lời đúng hay sai

        public int QuestionId { get; set; }

        [JsonIgnore]
        public Question? Question { get; set; } 
    }
}