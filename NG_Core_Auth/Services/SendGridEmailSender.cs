using Microsoft.Extensions.Options;
using NG_Core_Auth.Email;
using NG_Core_Auth.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Services
{
    // 40 Sending Registration Confirmation Email Using SendGrid - 2 ->AppSettings.cs
    // dobaviti vrijednosti sengrid username i key
    public class SendGridEmailSender : IEmailSender
    {
        private readonly AppSettings _appSettings;
        public SendGridEmailSender(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        // metod za slanje emaila
        public async Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            var apiKey = _appSettings.SendGridKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("emir.sabanic.ro@gmail.com", "MIRCE GLJIVA");
            var subject = emailSubject;
            var to = new EmailAddress(userEmail, "Test");
            var plainTextContent = message;
            var htmlContent = message;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return new SendEmailResponse();
        }
    }
}
