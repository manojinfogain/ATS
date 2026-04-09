using ATSAPI.App_Data;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace ATSAPI.Auth
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        [HttpPost]
        [Route("token")]
        public IHttpActionResult GetExternalToken()
        {
            try
            {

                // Retrieve the API key from the headers
                var apiKeyHeader = HttpContext.Current.Request.Headers["X-API-KEY"];
                var originHeader = HttpContext.Current.Request.Headers["Origin"];
                // Get  from web.config
                string APIKeyEx = ConfigurationManager.AppSettings["APIKeyEx"];
                string APICheckOrigin = ConfigurationManager.AppSettings["APICheckOrigin"];
                bool IsCheckOrigin = false;
                if (APICheckOrigin == "1")
                {
                    IsCheckOrigin = true;
                }
                var allowedOrigins = new List<string>
                {
                   "https://ats.infogain.com",
                   "http://localhost:4200"
                };
                // Validate Origin
                if (!allowedOrigins.Contains(originHeader) && IsCheckOrigin)
                {
                    //return Content(HttpStatusCode., "Invalid Request");
                    return Content(HttpStatusCode.Forbidden, new { Message = "Permission denied. Please try again later." });
                }

             //   string apiKey = credentials.ApiKey;
                if (apiKeyHeader == APIKeyEx)
                {
                    // Create Identity and Token
                    var identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);
                    // identity.AddClaim(new Claim(ClaimTypes.Name, credentials.Username));
                    identity.AddClaim(new Claim("Role", "External User"));
                    identity.AddClaim(new Claim("UserType", "P"));

                    var ticket = new AuthenticationTicket(identity, new AuthenticationProperties
                    {
                        IssuedUtc = DateTime.UtcNow,
                        ExpiresUtc = DateTime.UtcNow.AddHours(1)
                    });

                    var token = Startup.OAuthAuthorizationServerOptions.AccessTokenFormat.Protect(ticket);

                    return Ok(new { access_token = token });
                  
                }
                else
                {
                    // return BadRequest("InvaLID rEQUEST");
                    //   return Content(HttpStatusCode.Unauthorized, "api KEY Invalid Request");
                    return Content(HttpStatusCode.Forbidden, new { Message = "Access denied. Please try again later." });
                }


                //  return Unauthorized();
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Auth", "Token");
                return BadRequest("There is some error! Try again later");
            }


        }


        private bool ValidateUser(string username, string password)
        {

            string APIUsername = ConfigurationManager.AppSettings["APIUsername"];
            string ApiPassword = ConfigurationManager.AppSettings["ApiPassword"];

            return username == APIUsername && password == ApiPassword;
        }



        public static string GenerateJwtToken(string username)
        {
            var identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, username));
            var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
            var token = Startup.OAuthAuthorizationServerOptions.AccessTokenFormat.Protect(ticket);
            return token;
        }

        public class ExternalUserCredentials
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string ApiKey { get; set; }
        }



    }
}