using Microsoft.AspNetCore.Http;

namespace alilexba_backend.DTOs
{
    public class UploadExcelRequest
    {
        public IFormFile File { get; set; } = null!;
    }
}