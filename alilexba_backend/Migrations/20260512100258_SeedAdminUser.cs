using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace alilexba_backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[] { 1, new DateTime(2026, 5, 12, 10, 2, 56, 927, DateTimeKind.Local).AddTicks(4280), "admin@gmail.com", "Admin", BCrypt.Net.BCrypt.HashPassword("123456"), "Admin" });
       
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[] { 2, new DateTime(2026, 5, 12, 10, 2, 56, 927, DateTimeKind.Local).AddTicks(4280), "test1@gmail.com", "Nguyen test 1", BCrypt.Net.BCrypt.HashPassword("123456"), "Student" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[] { 3, new DateTime(2026, 5, 12, 10, 2, 56, 927, DateTimeKind.Local).AddTicks(4280), "test2@gmail.com", "Nguyen test 2", BCrypt.Net.BCrypt.HashPassword("123456"), "Student" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[] { 4, new DateTime(2026, 5, 12, 10, 2, 56, 927, DateTimeKind.Local).AddTicks(4280), "test3@gmail.com", "Nguyen test 3", BCrypt.Net.BCrypt.HashPassword("123456"), "Student" });
        
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
