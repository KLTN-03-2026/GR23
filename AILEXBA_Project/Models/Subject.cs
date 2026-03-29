using System.ComponentModel.DataAnnotations;

namespace AILEXBA_Project.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } // VD: Toán, Tiếng Anh
    }
}