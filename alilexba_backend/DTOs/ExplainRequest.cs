namespace alilexba_backend.DTOs
{
    public class ExplainRequest
    {
        public string Question { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
    }
}