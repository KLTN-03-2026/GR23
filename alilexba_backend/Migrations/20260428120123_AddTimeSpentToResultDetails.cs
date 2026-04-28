using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTimeSpentToResultDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamResultDetails_ExamResultDetails_ExamResultDetailId",
                table: "ExamResultDetails");

            migrationBuilder.DropIndex(
                name: "IX_ExamResultDetails_ExamResultDetailId",
                table: "ExamResultDetails");

            migrationBuilder.DropColumn(
                name: "ExamResultDetailId",
                table: "ExamResultDetails");

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TimeSpent",
                table: "ExamResultDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "TimeSpent",
                table: "ExamResultDetails");

            migrationBuilder.AddColumn<int>(
                name: "ExamResultDetailId",
                table: "ExamResultDetails",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultDetails_ExamResultDetailId",
                table: "ExamResultDetails",
                column: "ExamResultDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResultDetails_ExamResultDetails_ExamResultDetailId",
                table: "ExamResultDetails",
                column: "ExamResultDetailId",
                principalTable: "ExamResultDetails",
                principalColumn: "Id");
        }
    }
}
