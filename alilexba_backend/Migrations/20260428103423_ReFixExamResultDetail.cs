using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class ReFixExamResultDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExamResultDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExamResultId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    SelectedAnswerId = table.Column<int>(type: "int", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    ExamResultDetailId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamResultDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamResultDetails_ExamResultDetails_ExamResultDetailId",
                        column: x => x.ExamResultDetailId,
                        principalTable: "ExamResultDetails",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ExamResultDetails_ExamResults_ExamResultId",
                        column: x => x.ExamResultId,
                        principalTable: "ExamResults",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamResultDetails_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultDetails_ExamResultDetailId",
                table: "ExamResultDetails",
                column: "ExamResultDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultDetails_ExamResultId",
                table: "ExamResultDetails",
                column: "ExamResultId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultDetails_QuestionId",
                table: "ExamResultDetails",
                column: "QuestionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamResultDetails");
        }
    }
}
