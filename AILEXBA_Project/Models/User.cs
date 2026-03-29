using System;
using System.ComponentModel.DataAnnotations;

namespace AILEXBA_Project.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // Admin hoặc Student
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}