using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSampleToExam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSample",
                table: "Exams",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSample",
                table: "Exams");
        }
    }
}
