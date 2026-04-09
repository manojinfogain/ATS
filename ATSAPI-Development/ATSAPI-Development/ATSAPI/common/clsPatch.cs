using ATSAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace ATSAPI.common
{
    public static class clsPatch
    {
        public static void PatchAsync(this HttpClient client, Uri requestUri, HttpContent iContent, out string msteamlink, out string newmid)
        {
            var method = new HttpMethod("PATCH");
            CalendarAppointment jsonObj = null;
            var request = new HttpRequestMessage(method, requestUri)
            {
                Content = iContent
            };

            HttpResponseMessage servicerequest = new HttpResponseMessage();
            try
            {
                servicerequest = client.SendAsync(request).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                jsonObj = JsonConvert.DeserializeObject<CalendarAppointment>(response);
            }
            catch (Exception e)
            {

            }
            msteamlink = jsonObj.JoinWebUrl.ToString();
            newmid = jsonObj.Id.ToString();
        }


        public async static Task<HttpResponseMessage> PatchAsyncAyat(this HttpClient client, string requestUri, HttpContent content)
        {
            var method = new HttpMethod("PATCH");

            var request = new HttpRequestMessage(method, requestUri)
            {
                Content = content
            };

            return await client.SendAsync(request);
        }


    }
}