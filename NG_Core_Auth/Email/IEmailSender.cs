using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Email
{
    public interface IEmailSender
    {
        // 41 Sending Sending Registration Confirmation Email Using SendGrid - 3 ->SendGridEmailSender.cs -> SendGridExtensions
        // sljanje emaila sa odredjenim informacijama
        Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message);
    }
}
