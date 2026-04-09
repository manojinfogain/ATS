using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;

    public class RejectMalformedUrlHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var path = request.RequestUri.AbsolutePath;

            // Check for spaces in the path
            if (path.Contains(" "))
            {
                var response = request.CreateResponse(HttpStatusCode.BadRequest);
                response.Content = new StringContent("Malformed URL: spaces are not allowed in the API path.");
                return response;
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }

}