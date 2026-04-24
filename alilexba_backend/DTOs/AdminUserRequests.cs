namespace alilexba_backend.DTOs
{
    // DTO dùng cho chức năng Thêm người dùng của Admin
    public class AdminCreateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";
    }

    // DTO dùng cho chức năng Sửa thông tin / Phân quyền của Admin
    public class AdminUpdateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}