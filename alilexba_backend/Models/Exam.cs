using System.ComponentModel.DataAnnotations;

namespace alilexba_backend.Models
{
    public class Exam
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int DurationMinutes { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
        public virtual List<Question> Questions { get; set; } = new List<Question>();
    }
}