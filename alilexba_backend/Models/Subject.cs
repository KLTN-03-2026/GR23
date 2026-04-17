using System.ComponentModel.DataAnnotations;

namespace alilexba_backend.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}