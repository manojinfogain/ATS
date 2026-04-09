using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace ATSAPI.Controllers
{
    [AuthorizeAttribute]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        AccountRepository objRepo = new AccountRepository();
        Common common = new Common();
        Logger logger = new Logger();
        public AccountController()
        {
        }

        [Route("me")]
        [HttpGet]
        public IHttpActionResult me()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("me", Request);
                var userDetails = objRepo.GetUserDetails(claims[0].Value, Convert.ToChar(claims[10].Value));
                logger.LogResponseAsync("me", "200 OK");
                return Ok(userDetails);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("me", ex);
                ExceptionLogging.SendExcepToDB(ex, "Account", "me");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("changePassword")]
        [HttpPost]
        public IHttpActionResult ChangePassword(string NewPassword)
        {
            try
            {
                Common cmn = new Common();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                Guid g = Guid.NewGuid();
                string Salt = Convert.ToBase64String(g.ToByteArray());
                Salt = Salt.Replace("=", "");
                Salt = Salt.Replace("+", "");
                string ensPwd = cmn.Encrypt(NewPassword, Salt);
                logger.LogRequestAsync("ChangePassword", Request);
                int result = objRepo.ChangePassword(claims[5].Value, ensPwd, Salt, NewPassword);
                if (result == 1)
                {
                    logger.LogResponseAsync("ChangePassword", "200 OK");
                    return Ok("Password changed.");
                }
                if (result == -4)
                {
                    logger.LogResponseAsync("ChangePassword", "200 OK");
                    return BadRequest("Password already changed.");
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangePassword", ex);
                ExceptionLogging.SendExcepToDB(ex, "Account", "ChangePassword");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("SendOtp")]
        [HttpPost]
        public IHttpActionResult SendOTPtoCandidate()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string otp = common.GenerateSecureOTP(6, "0123456789").ToString();
                logger.LogRequestAsync("SendOTPtoCandidate", Request);
                int result = objRepo.SaveAndSendOtp(claims[5].Value, otp, 'R');

                if (result == 1)
                {
                    logger.LogResponseAsync("SendOTPtoCandidate", "200 OK");
                    return Ok("OTP has been shared successfully");
                }
                else if (result == -3)
                {
                    return BadRequest("Maximum OTP resend attempts reached. Please log in again.");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendOTPtoCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Account", "SendOTP");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("logout")]
        [HttpPost]
        public IHttpActionResult Logout()
        {
            try
            {
                //var token = HttpContext.Current.Request.Headers["Authorization"]?.Replace("Bearer ", "");
                //if (string.IsNullOrEmpty(token))
                //{
                //    return BadRequest("Token is required.");
                //}
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.InvalidatePreviousTokens(claims[5].Value);

                if(result == 1)
                {
                    return Ok("Logged out successfully.");
                }
                else
                 return BadRequest("Invalid Request.");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Auth", "Logout");
                return BadRequest("There is some error! Try again later");
            }
        }

    }
}
