using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Security.Claims;
using System.DirectoryServices;
using ATSAPI.Models;
using System.Data;
using ATSAPI.Repositry;
using System.Web.Configuration;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using ATSAPI.App_Data;
using Microsoft.Owin;
using ATSAPI.common;
using System.Configuration;
using System.Runtime.Remoting;
using Microsoft.Owin.Security;

namespace ATSAPI
{
    public class MyAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.OwinContext.Set<string>("domain", context.Parameters["domain"]);
            context.OwinContext.Set<string>("Token", context.Parameters["Token"]);
            context.Validated();
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            AccountRepository objLogin = new AccountRepository();
            Common common = new Common();
            //var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            string EmpUserName = string.Empty;
            int LoginType = 0;

            IFormCollection parameters = await context.Request.ReadFormAsync();
            string Code = parameters.Get("Code");
            string OTP = parameters.Get("OTP");

            if (!String.IsNullOrEmpty(Code))
            {
                getUserDetailsOffice GetUserMe = common.GetUserDetailsMS(Code);
                if (!String.IsNullOrEmpty(GetUserMe.userPrincipalName))
                {
                    EmpUserDetails VerifyUser = objLogin.GetUserDetailsByEmail(GetUserMe.userPrincipalName);
                    if (VerifyUser.DomainId == null || VerifyUser.DomainId == "")
                    {
                        context.SetError("Invalid User.", "You are not an authorized User");
                        return;
                    }
                    else
                    {
                        string[] ExtractDomainId = VerifyUser.DomainId.Split('\\');
                        EmpUserName = ExtractDomainId[1];
                        LoginType = 1;
                    }
                }


            }

            Char UserType = 'I';
            string Token = context.OwinContext.Get<string>("Token");
            string User = string.Empty;
            if (context.UserName != null)
            {
                string[] UserNameA = context.UserName.Split('@');
                if (UserNameA.Length > 1 && (UserNameA[1].ToLower() != "infogain.com" && UserNameA[1].ToLower() != "igglobal.com"))
                {
                    UserType = 'E';
                    User = context.UserName;

                }
                else
                {
                    UserType = 'I';
                    User = UserNameA[0];
                }
            }
            var IsValid = false;

            if (Token != null && Token != "")
            {
                try
                {
                    string apiurl = WebConfigurationManager.AppSettings["WebApiBaseUrl"];
                    WebRequest req = WebRequest.Create(apiurl + "/api/auth/ValidateToken");
                    req.Method = "GET";
                    req.Headers.Add("token:" + Token);
                    req.ContentType = "application/json; charset=utf-8";
                    WebResponse resp = req.GetResponse();
                    Stream stream = resp.GetResponseStream();
                    StreamReader re = new StreamReader(stream);
                    String json = re.ReadToEnd();
                    //var serializer = new System.text.Script.Serialization.JavaScriptSerializer();
                    //Employee _Employee = serializer.Deserialize<Employee>(json);
                    Employee _Employee = JsonConvert.DeserializeObject<Employee>(json);
                    if (_Employee.UserId != null && _Employee.UserId != "")
                    {
                        IsValid = true;
                        EmpUserName = _Employee.UserId;
                    }
                    else
                        IsValid = false;
                }
                catch (Exception ex)
                {
                    IsValid = false;
                }
            }
            else if (LoginType == 1)
            {

                //  EmpUserName = context.UserName;
                IsValid = true;
            }

            else if (!String.IsNullOrEmpty(OTP))
            {
                IsValid = true;
                EmpUserName = context.UserName;
            }
            else if (context.Password == ConfigurationManager.AppSettings["Pwd"] ||
            objLogin.AuthenticateUser("IGGLOBAL", context.UserName, context.Password, UserType))
            {

                EmpUserName = context.UserName;
                IsValid = true;
            }

            if (IsValid)
            {
                string UN = string.Empty;
                if (UserType == 'E')
                    UN = context.UserName;
                else
                    UN = "igglobal\\" + EmpUserName;
                UserMaster objUser = objLogin.GetUserDetails(UN, UserType);
                if (objUser.Role == "" || objUser.Role == null)
                {
                    context.SetError("Invalid User.", "You are not an authorized User");
                    return;
                }
                else
                {
                    if (UserType == 'E')
                    {
                        if (String.IsNullOrEmpty(OTP))
                        {
                            string otp = common.GenerateSecureOTP(6, "0123456789").ToString();
                              int result = objLogin.SaveAndSendOtp(objUser.MailID, otp,'N');
                            // Return a custom response indicating OTP was sent
                            // Create a custom response
                            // context.SetError("EXT", "OTP SENT");
                            // 🔹 Generate a New GUID as Token
                            string guidTokenEx = Guid.NewGuid().ToString();
                            var identityExt = new ClaimsIdentity(context.Options.AuthenticationType);
                            // Set token expiration time (e.g., 5 minutes)
                            identityExt.AddClaim(new Claim("FirstName", objUser.FirstName));
                            identityExt.AddClaim(new Claim("LastName", objUser.LastName));
                            identityExt.AddClaim(new Claim("FullName", objUser.FullName));
                            identityExt.AddClaim(new Claim("EmpOldID", objUser.EmpOldID));
                            identityExt.AddClaim(new Claim("EmpNewId", objUser.EmpNewId));
                            identityExt.AddClaim(new Claim("MailID", objUser.MailID));
                            identityExt.AddClaim(new Claim("LocationID", objUser.LocationID.ToString()));
                            identityExt.AddClaim(new Claim("RoleId", objUser.RoleId.ToString()));
                            identityExt.AddClaim(new Claim("Role", objUser.Role));
                            identityExt.AddClaim(new Claim("UserType", UserType.ToString()));
                            identityExt.AddClaim(new Claim("IsPasswordChanged", objUser.IsPasswordChanged.ToString()));
                            identityExt.AddClaim(new Claim("AuthTokenId", guidTokenEx.ToString()));

                            // Add expiration time (e.g., 5 minutes)
                            DateTime expiryTime = DateTime.UtcNow.AddMinutes(1); // Token expires in 5 minutes
                            identityExt.AddClaim(new Claim("exp", ((DateTimeOffset)expiryTime).ToUnixTimeSeconds().ToString()));
                            var properties = new AuthenticationProperties()
                            {
                                IssuedUtc = DateTime.UtcNow,
                                ExpiresUtc = DateTime.UtcNow.AddMinutes(30) // Force token expiration here
                            };

                            var ticket = new AuthenticationTicket(identityExt, properties);
                            //// Create authentication ticket with expiration
                            //var ticket = new AuthenticationTicket(identity, new AuthenticationProperties()
                            //{
                            //    IssuedUtc = DateTime.UtcNow,
                            //    ExpiresUtc = DateTime.UtcNow.AddSeconds(30)
                            //});
                            //var token = Startup.OAuthAuthorizationServerOptions.AccessTokenFormat.Protect(ticket);
                            // Validate the identity (issue token)
                            context.Validated(ticket);
                            // Invalidate previous tokens
                            objLogin.InvalidatePreviousTokens(objUser.EmpNewId);
                            UserToken UserTokenEx = new UserToken();
                            UserTokenEx.UserId = objUser.EmpNewId;
                            UserTokenEx.Token = guidTokenEx;
                            UserTokenEx.Expiration = DateTime.Now.AddMinutes(30);
                            objLogin.StoreToken(UserTokenEx);

                            return;
                        }

                        if (!String.IsNullOrEmpty(OTP))
                        {
                            int result = objLogin.ValidateMFAOTP(objUser.EmpNewId, OTP);
                           if (result == -2)
                            {
                                context.SetError("OTP has expired.", "OTP has expired. Please click on resend button to get new OTP.");
                                return;
                            }
                            else if (result == -4)
                            {
                                context.SetError("OTP did not match.", "OTP did not match.Please enter valid OTP");
                                return;
                            }
                            else if (result == -5)
                            {
                                context.SetError("OTP limit Exceed", "OTP attempts exceeded");
                                return;
                            }
                            else if (result == -6)
                            {
                                context.SetError("Login temporarily locked", "Login temporarily locked try after 5 minutes");
                                return;
                            }

                            else if (result == -1)
                            {
                                context.SetError("Invalid User.", "Somthing went wrong.");
                                return;
                            }
                            else if (result == -3)
                            {
                                context.SetError("Invalid User.", "Somthing went wrong.");
                                return;
                            }
                        }
                    }
                    // 🔹 Generate a New GUID as Token
                    string guidToken = Guid.NewGuid().ToString();
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("DomainId", objUser.DomainId));
                    identity.AddClaim(new Claim("FirstName", objUser.FirstName));
                    identity.AddClaim(new Claim("LastName", objUser.LastName));
                    identity.AddClaim(new Claim("FullName", objUser.FullName));
                    identity.AddClaim(new Claim("EmpOldID", objUser.EmpOldID));
                    identity.AddClaim(new Claim("EmpNewId", objUser.EmpNewId));
                    identity.AddClaim(new Claim("MailID", objUser.MailID));
                    identity.AddClaim(new Claim("LocationID", objUser.LocationID.ToString()));
                    identity.AddClaim(new Claim("RoleId", objUser.RoleId.ToString()));
                    identity.AddClaim(new Claim("Role", objUser.Role));
                    identity.AddClaim(new Claim("UserType", UserType.ToString()));
                    identity.AddClaim(new Claim("IsPasswordChanged", objUser.IsPasswordChanged.ToString()));
                    identity.AddClaim(new Claim("DeptID", objUser.DeptID.ToString()));
                    identity.AddClaim(new Claim("IsRenuTeam", objUser.otherRoles.IsRenuTeam.ToString()));
                    identity.AddClaim(new Claim("IsInterviewer", objUser.otherRoles.IsInterviewer.ToString()));
                    identity.AddClaim(new Claim("IsPanelAccess", objUser.otherRoles.IsPanelAccess.ToString()));
                    identity.AddClaim(new Claim("AuthTokenId", guidToken.ToString()));
                    context.Validated(identity);

                    // Invalidate previous tokens
                     objLogin.InvalidatePreviousTokens(objUser.EmpNewId);
                    // Store the new token
                    //string newToken = context.Options.AccessTokenFormat.Protect(new AuthenticationTicket(identity, new AuthenticationProperties()
                    //{
                    //    IssuedUtc = DateTime.UtcNow,
                    //    ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
                    //}));
                    UserToken UserToken = new UserToken();
                    UserToken.UserId = objUser.EmpNewId;
                    UserToken.Token = guidToken;
                    UserToken.Expiration = DateTime.Now.AddHours(12);
                    objLogin.StoreToken(UserToken);

                    objLogin.AddEmpLoginDetails(objUser.EmpNewId, UserType, 1);
                }
            }
            else
            {
                context.SetError("Invalid User.", "Provided UserName and Password is incorrect");
                return;
            }
        }
    }
}