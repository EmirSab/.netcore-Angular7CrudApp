using Microsoft.Extensions.DependencyInjection;
using NG_Core_Auth.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Email
{ 
    // 41.1 Sending Sending Registration Confirmation Email Using SendGrid - 3 ->Startup.cs
    public static class SendGridExtensions
    {
        public static IServiceCollection AddSendGridEmailSender(this IServiceCollection services)
        {
            services.AddTransient<IEmailSender, SendGridEmailSender>();
            return services;
        }
    }
}
