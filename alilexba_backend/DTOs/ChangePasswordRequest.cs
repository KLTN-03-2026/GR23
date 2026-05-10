namespace alilexba_backend.DTOs
{
    public class ChangePasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? OldPassword { get; set; } 
        public string NewPassword { get; set; } = string.Empty;
    }
}   