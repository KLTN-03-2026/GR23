using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExamAndResultModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DurationMinutes",
                table: "Exams",
                newName: "Duration");

            migrationBuilder.RenameColumn(
                name: "CompletedAt",
                table: "ExamResults",
                newName: "TakenAt");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SubjectId",
                table: "Exams",
                column: "SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Subjects_SubjectId",
                table: "Exams",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Subjects_SubjectId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_SubjectId",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Exams",
                newName: "DurationMinutes");

            migrationBuilder.RenameColumn(
                name: "TakenAt",
                table: "ExamResults",
                newName: "CompletedAt");
        }
    }
}
