using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Subjects
            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Name", },
                values: new object[] { 1, "Tin"});

            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Name", },
                values: new object[] {2, "Toan"});
            
            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Name", },
                values: new object[] { 3, "Van"});
            
            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Name", },
                values: new object[] { 4, "Anh"});

            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Name", },
                values: new object[] { 5, "Hoa"});

//Exmas
            migrationBuilder.InsertData(
                table: "Exams",
                columns: new[]
                {
                    "Id", "Title", "Description", "SubjectId",
                    "Duration", "CreatedAt", "IsActive",
                    "Difficulty", "IsSample"
                },
                values: new object[]
                {
                    1,
                    "Đề thi Tin học cơ bản",
                    "Đề kiểm tra kiến thức Tin học cơ bản.",
                    1, // Tin
                    45,
                    DateTime.Now,
                    true,
                    "Easy",
                    true
                });

            migrationBuilder.InsertData(
                table: "Exams",
                columns: new[]
                {
                    "Id", "Title", "Description", "SubjectId",
                    "Duration", "CreatedAt", "IsActive",
                    "Difficulty", "IsSample"
                },
                values: new object[]
                {
                    2,
                    "Đề thi Toán đại số",
                    "Đề kiểm tra kiến thức Toán đại số cơ bản.",
                    2, // Toan
                    60,
                    DateTime.Now,
                    true,
                    "Medium",
                    true
                });

            migrationBuilder.InsertData(
                table: "Exams",
                columns: new[]
                {
                    "Id", "Title", "Description", "SubjectId",
                    "Duration", "CreatedAt", "IsActive",
                    "Difficulty", "IsSample"
                },
                values: new object[]
                {
                    3,
                    "Đề thi Ngữ văn",
                    "Đề kiểm tra kiến thức Ngữ văn tổng hợp.",
                    3, // Van
                    90,
                    DateTime.Now,
                    true,
                    "Medium",
                    false
                });

            migrationBuilder.InsertData(
                table: "Exams",
                columns: new[]
                {
                    "Id", "Title", "Description", "SubjectId",
                    "Duration", "CreatedAt", "IsActive",
                    "Difficulty", "IsSample"
                },
                values: new object[]
                {
                    4,
                    "Đề thi Tiếng Anh giao tiếp",
                    "Đề kiểm tra từ vựng và ngữ pháp Tiếng Anh.",
                    4, // Anh
                    60,
                    DateTime.Now,
                    true,
                    "Easy",
                    true
                });

            migrationBuilder.InsertData(
                table: "Exams",
                columns: new[]
                {
                    "Id", "Title", "Description", "SubjectId",
                    "Duration", "CreatedAt", "IsActive",
                    "Difficulty", "IsSample"
                },
                values: new object[]
                {
                    5,
                    "Đề thi Hóa học cơ bản",
                    "Đề kiểm tra phản ứng và công thức Hóa học.",
                    5, // Hoa
                    75,
                    DateTime.Now,
                    true,
                    "Hard",
                    false
                });

//Questions
            migrationBuilder.InsertData( 
                table: "Questions", 
                columns: new[] { "Id", "Content", "Level", "Explanation", "SubjectId", "ExamId" }, 
                values: new object[] { 
                    1, 
                    "Trong C#, từ khóa dùng để kế thừa lớp là gì?",
                    "Easy", 
                    "Từ khóa ':' được dùng để kế thừa giữa các lớp trong C#.", 
                    1, //tin
                    1 
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Content", "Level", "Explanation", "SubjectId", "ExamId" },
                values: new object[] {
                    2,
                    "4-2",
                    "Easy",
                    "4-2=2",
                    2, //toan
                    1
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Content", "Level", "Explanation", "SubjectId", "ExamId" },
                values: new object[] {
                    3,
                    "Truyện Kiều của ai",
                    "Medium",
                    "Tố Hữu",
                    3, //van
                    1
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Content", "Level", "Explanation", "SubjectId", "ExamId" },
                values: new object[] {
                    4,
                    "Will là động từ của thì nào",
                    "Medium",
                    "Thì tương lai đơn",
                    4, //anh
                    2
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Content", "Level", "Explanation", "SubjectId", "ExamId" },
                values: new object[] {
                    5,
                    "NaCl viết tắt cho gì",
                    "Hard",
                    "Natri Clorua là câu trả lời đúng và NaCl hay được gọi là muối ăn",
                    5, //hoa
                    2
                });
            

            
//ExamResult
            migrationBuilder.InsertData(
                table: "ExamResults",
                columns: new[]
                {
                    "Id", "UserId", "ExamId", "Score",
                    "CorrectAnswers", "TotalQuestions", "TakenAt"
                },
                values: new object[]
                {
                    1,
                    2,
                    1,
                    8.5,
                    17,
                    20,
                    DateTime.Now
                });

            migrationBuilder.InsertData(
                table: "ExamResults",
                columns: new[]
                {
                    "Id", "UserId", "ExamId", "Score",
                    "CorrectAnswers", "TotalQuestions", "TakenAt"
                },
                values: new object[]
                {
                    2,
                    3,
                    2,
                    7.0,
                    14,
                    20,
                    DateTime.Now
                });

            migrationBuilder.InsertData(
                table: "ExamResults",
                columns: new[]
                {
                    "Id", "UserId", "ExamId", "Score",
                    "CorrectAnswers", "TotalQuestions", "TakenAt"
                },
                values: new object[]
                {
                    3,
                    4,
                    3,
                    9.0,
                    18,
                    20,
                    DateTime.Now
                });

            migrationBuilder.InsertData(
                table: "ExamResults",
                columns: new[]
                {
                    "Id", "UserId", "ExamId", "Score",
                    "CorrectAnswers", "TotalQuestions", "TakenAt"
                },
                values: new object[]
                {
                    4,
                    2,
                    4,
                    6.5,
                    13,
                    20,
                    DateTime.Now
                });

            migrationBuilder.InsertData(
                table: "ExamResults",
                columns: new[]
                {
                    "Id", "UserId", "ExamId", "Score",
                    "CorrectAnswers", "TotalQuestions", "TakenAt"
                },
                values: new object[]
                {
                    5,
                    3,
                    5,
                    8.0,
                    16,
                    20,
                    DateTime.Now
                });

//ExamResultDetail
            migrationBuilder.InsertData(
                table: "ExamResultDetails",
                columns: new[]
                {
                    "Id", "ExamResultId", "QuestionId",
                    "SelectedAnswerId", "IsCorrect", "TimeSpent"
                },
                values: new object[]
                {
                    1,
                    1,
                    1,
                    1,
                    true,
                    35
                });

            migrationBuilder.InsertData(
                table: "ExamResultDetails",
                columns: new[]
                {
                    "Id", "ExamResultId", "QuestionId",
                    "SelectedAnswerId", "IsCorrect", "TimeSpent"
                },
                values: new object[]
                {
                    2,
                    2,
                    2,
                    2,
                    true,
                    42
                });

            migrationBuilder.InsertData(
                table: "ExamResultDetails",
                columns: new[]
                {
                    "Id", "ExamResultId", "QuestionId",
                    "SelectedAnswerId", "IsCorrect", "TimeSpent"
                },
                values: new object[]
                {
                    3,
                    3,
                    3,
                    3,
                    true,
                    50
                });

            migrationBuilder.InsertData(
                table: "ExamResultDetails",
                columns: new[]
                {
                    "Id", "ExamResultId", "QuestionId",
                    "SelectedAnswerId", "IsCorrect", "TimeSpent"
                },
                values: new object[]
                {
                    4,
                    4,
                    4,
                    4,
                    false,
                    28
                });

            migrationBuilder.InsertData(
                table: "ExamResultDetails",
                columns: new[]
                {
                    "Id", "ExamResultId", "QuestionId",
                    "SelectedAnswerId", "IsCorrect", "TimeSpent"
                },
                values: new object[]
                {
                    5,
                    5,
                    5,
                    5,
                    true,
                    40
                });

///Answers

            // Question 1 - Tin
            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 1, ":", true, 1 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 2, ";", false, 1 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 3, "=", false, 1 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 4, "->", false, 1 });


            // Question 2 - Toan
            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 5, "1", false, 2 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 6, "2", true, 2 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 7, "3", false, 2 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 8, "4", false, 2 });


            // Question 3 - Van
            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 9, "Nguyễn Du", true, 3 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 10, "Nam Cao", false, 3 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 11, "Tố Hữu", false, 3 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 12, "Xuân Diệu", false, 3 });


            // Question 4 - Anh
            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 13, "Tương lai đơn", true, 4 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 14, "Hiện tại đơn", false, 4 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 15, "Quá khứ đơn", false, 4 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 16, "Hiện tại hoàn thành", false, 4 });


            // Question 5 - Hoa
            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 17, "Natri Clorua", true, 5 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 18, "Natri Cacbonat", false, 5 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 19, "Canxi Clorua", false, 5 });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Text", "IsCorrect", "QuestionId" },
                values: new object[] { 20, "Kali Clorua", false, 5 });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
