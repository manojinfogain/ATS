using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ATSAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            MvcHandler.DisableMvcResponseHeader = true;
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            string allowedHostsSetting = System.Configuration.ConfigurationManager.AppSettings["AllowedHosts"];
            var allowedHosts = allowedHostsSetting.Split(',')
                                                  .Select(h => h.Trim())
                                                  .ToList();

            var hostHeader = HttpContext.Current.Request.Headers["Host"];

            if (!allowedHosts.Contains(hostHeader, StringComparer.OrdinalIgnoreCase))
            {
                HttpContext.Current.Response.StatusCode = 400;
                HttpContext.Current.Response.End();
            }
        }

    }
}
