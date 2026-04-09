using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http.Controllers;

namespace ATSAPI
{
    public class UserWiseAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        private readonly string _allowedUserType;

        public UserWiseAuthorizeAttribute(string allowedUserType)
        {
            _allowedUserType = allowedUserType;
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var identity = HttpContext.Current.User.Identity as ClaimsIdentity;

            if (identity != null && identity.IsAuthenticated)
            {
                var userTypeClaim = identity.FindFirst("UserType");
                if (userTypeClaim != null && userTypeClaim.Value == _allowedUserType)
                {
                    return true;
                }
            }

            return false;
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            var identity = HttpContext.Current?.User?.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
            {
                // Token missing or invalid
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized,
                    new { message = "Unauthorized: Token is missing or invalid." });
            }
            else
            {
                // User is authenticated but does not have required role
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden,
                    new { message = "Forbidden: You do not have access to this resource." });
            }
        }
    }
}

