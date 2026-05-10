using Microsoft.EntityFrameworkCore;
using alilexba_backend.Models;

namespace alilexba_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }
        public DbSet<ExamResultDetail> ExamResultDetails { get; set; }

       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           
            modelBuilder.Entity<ExamResultDetail>()
                .HasOne(d => d.Question)
                .WithMany()
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.Restrict); 
        }
    }
}