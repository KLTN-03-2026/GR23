using MailKit.Net.Smtp;
using MimeKit;

namespace alilexba_backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(
            IConfiguration config
        )
        {
            _config = config;
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string body
        )
        {
            var email =
                new MimeMessage();

            email.From.Add(
                MailboxAddress.Parse(
                    _config["SmtpSettings:SenderEmail"]
                )
            );

            email.To.Add(
                MailboxAddress.Parse(
                    toEmail
                )
            );

            email.Subject =
                subject;

            email.Body =
                new TextPart(
                    MimeKit.Text.TextFormat.Html
                )
                {
                    Text = body
                };

            using var smtp =
                new SmtpClient();

            await smtp.ConnectAsync(
                _config["SmtpSettings:Server"],
                int.Parse(
                    _config["SmtpSettings:Port"]!),
                MailKit.Security
                    .SecureSocketOptions
                    .StartTls
            );

            await smtp.AuthenticateAsync(
                _config["SmtpSettings:Username"],
                _config["SmtpSettings:Password"]
            );

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(
                true
            );
        }
    }
}