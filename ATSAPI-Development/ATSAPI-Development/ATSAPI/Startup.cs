using System;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using ATSAPI;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Owin;


[assembly: OwinStartup(typeof(ATSAPI.Startup))]

namespace ATSAPI
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthAuthorizationServerOptions { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            // Enable Cross-Origin Requests (CORS)
            //  app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            // ✅ Step 1: Allow only Angular frontend
            var corsPolicy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };

            // ✅ Important: Use the correct frontend origin
            // corsPolicy.Origins.Add("http://localhost:4200");
            // Read origins from web.config
            // ✅ Read allowed origins from Web.config
            var allowedOrigins = ConfigurationManager.AppSettings["AllowedCorsOrigins"];
            if (!string.IsNullOrEmpty(allowedOrigins))
            {
                foreach (var origin in allowedOrigins.Split(',').Select(o => o.Trim()))
                {
                    corsPolicy.Origins.Add(origin);
                }
            }


            var corsOptions = new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(corsPolicy)
                }
            };

            // ✅ Step 2: Apply custom CORS policy BEFORE OAuth
            app.UseCors(corsOptions);

            // ✅ Security headers
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-Frame-Options", "DENY");
                context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Append("Referrer-Policy", "no-referrer");
                context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=()");
                context.Response.Headers.Append("Content-Security-Policy", "default-src 'self';");

                await next.Invoke();
            });

            // ✅ OAuth configuration
            OAuthAuthorizationServerOptions = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true, // ❗ Change to false in production
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(2),
                Provider = new MyAuthorizationServerProvider()
            };

            app.UseOAuthAuthorizationServer(OAuthAuthorizationServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            // ✅ Web API configuration
            HttpConfiguration config = new HttpConfiguration();
            WebApiConfig.Register(config);
            app.UseWebApi(config);
        }
    }
}
