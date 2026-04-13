using System;
using System.ComponentModel.DataAnnotations;

namespace AILEXBA_Project.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "Student";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}