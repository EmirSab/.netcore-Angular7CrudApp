using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Helpers
{
    // 3.1 authentication middlwere, jwt token signature class
    public class AppSettings
    {
        public string Site { get; set; }
        public string Audience { get; set; }
        public string ExpireTime { get; set; }
        public string Secret { get; set; }
        // 40.1 Sending Registration Confirmation Email Using SendGrid - 2 ->SendGridEmailSender.cs
        // dodati propertije za sendgrid
        public string SendGridKey { get; set; }
        public string SendGridUser { get; set; }
    }
}
