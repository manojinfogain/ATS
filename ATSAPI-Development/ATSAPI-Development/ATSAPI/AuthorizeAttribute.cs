using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ATSAPI.Repositry;

namespace ATSAPI
{
    public class AuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        /// <summary>
        /// Called before the controller action executes.
        /// Returns true if the request is authorized.
        /// </summary>
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var identity = HttpContext.Current.User.Identity as ClaimsIdentity;

            // User must be authenticated
            if (identity != null && identity.IsAuthenticated)
            {
                // Retrieve token claim
                var tokenClaim = identity.FindFirst("AuthTokenId");

                if (tokenClaim != null && !string.IsNullOrEmpty(tokenClaim.Value))
                {
                    var accountRepository = new AccountRepository();

                    // Validate token in database
                    bool isValid = accountRepository.ValidateToken(tokenClaim.Value);

                    return isValid;
                }
            }

            // Either not authenticated or token not found
            return false;
        }

        /// <summary>
        /// Handles unauthorized requests by returning 401 or 403 depending on the case.
        /// </summary>
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            var identity = HttpContext.Current.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
            {
                // 401: No authentication
                actionContext.Response = actionContext.Request.CreateResponse(
                    HttpStatusCode.Unauthorized,
                    "Authentication required."
                );
            }
            else
            {
                // 403: Authenticated but invalid/expired token
                actionContext.Response = actionContext.Request.CreateResponse(
                    HttpStatusCode.Forbidden,
                    "Token has expired or is invalid."
                );
            }
        }
    }
}
