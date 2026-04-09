using Ganss.Xss;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System;
using System.Net;
using System.Web;

namespace ATSAPI
{
    public class NoHtmlInputFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            // ✅ Create sanitizer and allow only safe tags
            var sanitizer = new HtmlSanitizer();

            sanitizer.AllowedTags.Clear();
            sanitizer.AllowedTags.Add("b");
            sanitizer.AllowedTags.Add("i");
            sanitizer.AllowedTags.Add("u");
            sanitizer.AllowedTags.Add("p");
            sanitizer.AllowedTags.Add("br");
            sanitizer.AllowedTags.Add("ul");
            sanitizer.AllowedTags.Add("ol");
            sanitizer.AllowedTags.Add("li");
            sanitizer.AllowedTags.Add("strong");
            sanitizer.AllowedTags.Add("em");
            sanitizer.AllowedTags.Add("span");
            sanitizer.AllowedTags.Add("div");

            sanitizer.AllowedAttributes.Clear();
            sanitizer.AllowedAttributes.Add("style"); // Optional: allow inline styles
            sanitizer.AllowedCssProperties.Add("color");
            sanitizer.AllowedCssProperties.Add("font-weight");
            sanitizer.AllowedCssProperties.Add("text-decoration");

            // 1️⃣ Validate model-bound (body) input
            foreach (var param in actionContext.ActionArguments)
            {
                var paramValue = param.Value;
                if (paramValue == null) continue;

                var props = paramValue.GetType()
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                    .Where(p => p.PropertyType == typeof(string));

                foreach (var prop in props)
                {
                    var original = prop.GetValue(paramValue) as string;
                    if (!string.IsNullOrWhiteSpace(original))
                    {
                        string sanitized = sanitizer.Sanitize(original);

                        // ❗ If dangerous HTML was removed, reject request
                        if (original != sanitized)
                        {
                            actionContext.Response = actionContext.Request.CreateErrorResponse(
                                HttpStatusCode.BadRequest,
                                $"Invalid HTML detected in field: {prop.Name}"
                            );
                            return;
                        }
                    }
                }
            }

            base.OnActionExecuting(actionContext);
        }
    }
}
