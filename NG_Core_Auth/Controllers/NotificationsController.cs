using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Controllers
{
    public class NotificationsController : Controller
    {
        // 41.3 Sending Sending Registration Confirmation Email Using SendGrid - 3 ->AccountController.cs
        public IActionResult EmailConfirmed(string userId, string code)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
            {
                return Redirect("/login");
            }
            return View();
        }
    }
}
