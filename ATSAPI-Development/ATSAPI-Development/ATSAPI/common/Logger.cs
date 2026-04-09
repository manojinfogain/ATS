using Atatus.Config;
using ATSAPI.App_Data;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net.Http;


namespace ATSAPI
{
    public class Logger
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["ATSConnection"].ConnectionString;
        string sectionName = "Logger";

        public Logger() { }

        public void  LogRequestAsync(string methodName, HttpRequestMessage request)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string userId = claims[5].Value;
                string ipAddress = GetClientIpAddress(request);

                string logMessage = $"Method: {methodName}, Timestamp: {DateTime.UtcNow}, IP: {ipAddress}, User: {userId}, URL: {request.RequestUri}";
                 LogToDatabaseAsync(methodName, ipAddress, userId, request.RequestUri.ToString(), logMessage, null);
            }
            catch (Exception ex)
            {
                 LogErrorAsync(methodName, ex);
            }
        }

        public void LogResponseAsync(string methodName, string statusCode)
        {
            string logMessage = $"Method: {methodName}, Status: {statusCode}, Timestamp: {DateTime.UtcNow}";
            LogToDatabaseAsync(methodName, null, null, null, null, null);
        }

        public void  LogErrorAsync(string methodName, Exception ex)
        {
            string logMessage = $"Method: {methodName}, Timestamp: {DateTime.UtcNow}, Error: {ex.Message}, StackTrace: {ex.StackTrace}";
            LogToDatabaseAsync(methodName, null, null, null, null, logMessage);
        }

        public void LogExceptionAsync(Exception ex, string userId, string location)
        {
            string logMessage = $"Exception: {ex.Message}, StackTrace: {ex.StackTrace}, User: {userId}, Location: {location}, Timestamp: {DateTime.UtcNow}";
             LogToDatabaseAsync(location, null, userId, null, null, logMessage);
        }

        public void LogUnauthorizedAccessAsync(HttpRequestMessage request, string methodName, string userId)
        {
            string ipAddress = GetClientIpAddress(request);
            string logMessage = $"Unauthorized access attempt. Method: {methodName}, User: {userId}, IP: {ipAddress}, Timestamp: {DateTime.UtcNow}";
            LogToDatabaseAsync(methodName, ipAddress, userId, null, null, logMessage);
        }

        private void LogToDatabaseAsync(string methodName, string ipAddress, string userId, string url, string request, string exception)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmdObj = new SqlCommand("sp_InsertApiLog", connection))
                    {
                        cmdObj.CommandType = CommandType.StoredProcedure;

                        cmdObj.Parameters.AddWithValue("@MethodName", methodName ?? (object)DBNull.Value);
                        cmdObj.Parameters.AddWithValue("@IPAddress", ipAddress ?? (object)DBNull.Value);
                        cmdObj.Parameters.AddWithValue("@UserId", userId ?? (object)DBNull.Value);
                        cmdObj.Parameters.AddWithValue("@Url", url ?? (object)DBNull.Value);
                        cmdObj.Parameters.AddWithValue("@Request", request ?? (object)DBNull.Value);
                        cmdObj.Parameters.AddWithValue("@Exception", exception ?? (object)DBNull.Value);

                        connection.Open();
                        cmdObj.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, $"Error in LogToDatabaseAsync: {ex.Message}");
            }

        }

        private string GetClientIpAddress(HttpRequestMessage request)
        {
            // Check for 'X-Forwarded-For' header (common in proxy setups)
            if (request.Headers.Contains("X-Forwarded-For"))
            {
                return request.Headers.GetValues("X-Forwarded-For").FirstOrDefault();
            }

            // Fallback to remote address from request properties if not behind a proxy
            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }

            // Fallback to remote endpoint if needed
            return request.GetOwinContext()?.Request?.RemoteIpAddress;
        }



    }
}
