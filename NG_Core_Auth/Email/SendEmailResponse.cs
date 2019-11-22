using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Email
{
    // 39.1 Sending Registration Confirmation Email Using SendGrid - 1, za hendlovanje errorsa i uspjesnog responsa
    // napraviti service folder koji ce hendlati servise -> Services
    public class SendEmailResponse
    {
        public string ErrorMsg { get; set; }
        public bool Successuful => ErrorMsg == null;
    }
}
