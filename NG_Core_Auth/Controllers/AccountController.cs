using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NG_Core_Auth.Email;
using NG_Core_Auth.Helpers;
using NG_Core_Auth.Models;

namespace NG_Core_Auth.Controllers
{
    // 2.2 kontroller
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signManager;
        private readonly AppSettings _appSettings;
        private IEmailSender _emailSender;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings, IEmailSender emailSender)
        {
            _userManager = userManager;
            _signManager = signInManager;
            _appSettings = appSettings.Value;
            _emailSender = emailSender; 
        }
        //10. Pravljenje register metoda
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel formdata)
        {
            // tu ce biti sve greske povezane sa registracijom
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = formdata.Email,
                UserName = formdata.UserName,
                SecurityStamp = Guid.NewGuid().ToString() // trazi promjene koje ce se pojaviti
            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            // kada se user registruje bit ce registrovan kao Customer
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                // Slanje konfirmacijskom emaila
                // 42 Sending Registration Confirmation Email Using SendGrid - 4
                // povezati email servis sa identity servisom
                
                // token za usera
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // callback url
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code}, protocol: HttpContext.Request.Scheme);

                // slanje emaila

                await _emailSender.SendEmailAsync(user.Email, "Confirm your email", "Pls confirm your email by clicking on the link: <a href=\"" + callbackUrl + "\">click here </a>");

                return Ok(new { username = user.UserName, email = user.Email, status  = 1, message = "Registration Successuful"});
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }
            return BadRequest(new JsonResult(errorList));
        }

        // 11. Login method
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel formData)
        {
            // get the user from db
            var user = await _userManager.FindByNameAsync(formData.Username);



            // key objekat koji se koristi da signanje tokena
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            // da li je user pronadjen ili imas greska
            if (user != null && await _userManager.CheckPasswordAsync(user, formData.Password))
            {
                //43 Sending Registration Confirmation Email Using SendGrid - 5 ->account.service.ts
                // provjera da li je email confirmed
                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    ModelState.AddModelError(string.Empty, "User has not confirmed email");
                    return Unauthorized(new { LoginError = "We have sent you confirmation email. Pls confirm your registration to log in"});
                }
                // kreiranje rola
                var roles = await _userManager.GetRolesAsync(user);

                // Potvrda emaila
                var tokenHandler = new JwtSecurityTokenHandler();

                // opisivanje tokena
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, formData.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString())
                    }),
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                };
                // generisanje tokena   
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, username = user.UserName, userRole = roles.FirstOrDefault()});
            }

            // vracanje greske
            ModelState.AddModelError("", "Username/Password was not found");
            return Unauthorized(new { LoginError = "Please Check the Login Credentials - Invalid Username/Password was entered"});
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
            {
                ModelState.AddModelError("", "User id or code are required");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new JsonResult("ERROR");
            }
            if (user.EmailConfirmed)
            {
                return Redirect("/login");
            }

            // user je pronadjen al mu email nije confirmed
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return RedirectToAction("EmailConfirmed", "Notifications", new { userId, code});
            }
            else
            {
                List<string> errors = new List<string>();
                foreach (var error in result.Errors)
                {
                    errors.Add(error.ToString());
                }
                return new JsonResult(errors);
            }
        }

    }
}