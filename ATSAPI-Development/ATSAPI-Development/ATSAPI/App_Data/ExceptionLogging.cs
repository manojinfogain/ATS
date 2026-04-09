using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System.Web;
using Newtonsoft.Json;

namespace ATSAPI.App_Data
{
    public static class ExceptionLogging
    {
        static SqlConnection con;
        private static void connecttion()
        {
            string constr = ConfigurationManager.ConnectionStrings["ATSConnection"].ToString();
            con = new SqlConnection(constr);
            con.Open();
        }
        public static void SendExcepToDB(Exception exdb, string sectionName, string methodName, string EmpID = "")
        {

            try
            {
                connecttion();
                SqlCommand com = new SqlCommand("ExceptionLogging", con);
                com.CommandType = CommandType.StoredProcedure;
                com.Parameters.AddWithValue("@sectionName", sectionName);
                com.Parameters.AddWithValue("@methodName", methodName);
                com.Parameters.AddWithValue("@exceptionMsg", exdb.Message.ToString());
                com.Parameters.AddWithValue("@exceptionType", exdb.GetType().Name.ToString());
                com.Parameters.AddWithValue("@exceptionSource", "Application");
                com.Parameters.AddWithValue("@exceptionDetails", exdb.StackTrace.ToString());
                com.Parameters.AddWithValue("@createdOn", DateTime.Now);
                com.Parameters.AddWithValue("@createdBy", "");
                com.Parameters.AddWithValue("@createdBy", EmpID);
                com.ExecuteNonQuery();
                con.Close();

            }
            catch (Exception ex)
            {
                using (EventLog eventLog = new EventLog("Application"))
                {
                    eventLog.Source = "Application";
                    eventLog.WriteEntry("Unable to create the log using ExceptionLogging class. Exact error is :  " + ex.Message.ToString() + " Stack Trace: " + ex.StackTrace.ToString(), EventLogEntryType.Error, 101, 1);
                }
            }
        }

        public static void LogApiErrorToDatabase(dynamic errorDetails,string SectionName,string MethodName)
        {
            // Assuming a database table structure for logging API errors
            string status = errorDetails.status;
            string timestamp = errorDetails.timestamp;
            string message = errorDetails.message;
            string details = errorDetails.details;
            string validationErrors = JsonConvert.SerializeObject(errorDetails.validationErrors);
            try
            {
                connecttion();
                SqlCommand com = new SqlCommand("InsertNaukriApiErrorLogs", con);
                com.CommandType = CommandType.StoredProcedure;
                com.Parameters.AddWithValue("@Status", status);
                com.Parameters.AddWithValue("@Timestamp", timestamp);
                com.Parameters.AddWithValue("@Message",message);
                com.Parameters.AddWithValue("@Details", details);
                com.Parameters.AddWithValue("@ValidationErrors",validationErrors);
                com.Parameters.AddWithValue("@SectionName", SectionName);
                com.Parameters.AddWithValue("@MethodName", MethodName);

                com.ExecuteNonQuery();
                con.Close();

            }
            catch (Exception ex)
            {
                using (EventLog eventLog = new EventLog("Application"))
                {
                    eventLog.Source = "Application";
                    eventLog.WriteEntry("Unable to create the log using ExceptionLogging class. Exact error is :  " + ex.Message.ToString() + " Stack Trace: " + ex.StackTrace.ToString(), EventLogEntryType.Error, 101, 1);
                }
            }
        }



    }
}
