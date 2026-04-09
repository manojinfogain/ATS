using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http.Controllers;

namespace ATSAPI
{
    public class ExternalAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
            {
                base.HandleUnauthorizedRequest(actionContext);
            }
            else
            {
                actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
            }
            //if (!HttpContext.Current.User.Identity.IsAuthenticated)
            //{
            //    actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized)
            //    {
            //        ReasonPhrase = "Token is missing or invalid"
            //    };
            //}
            //else
            //{
            //    actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden)
            //    {
            //        ReasonPhrase = "Access is denied"
            //    };
            //}
        }
    }
}
