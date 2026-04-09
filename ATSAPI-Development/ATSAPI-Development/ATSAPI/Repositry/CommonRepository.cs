using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace ATSAPI.Repositry
{
    public class CommonRepository: Connection
    {
        SqlCommand cmdObj;
        string sectionName = "CommonRepository";
        DataUtility du;
        public CommonRepository()
        {
            du = new DataUtility();
        }

        public DataSet GetUnreadNotificationCount(char? type, string empId)
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getUnreadNotificationCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@type", SqlDbType.Char))
                 .Value = type;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetUnreadNotificationCount");
            }
            return ds;
        }

        public DataSet GetAllNotificationList(int page, int pageSize,char? type, string empId)
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllNotificationList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@type", SqlDbType.Char))
                 .Value = type;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllNotificationList");
            }
            return ds;
        }

        public int ReadNotification(int id, string empId, ref string Message)
        {

            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_read_notications";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = id;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllNotificationList");
                result = -1;
            }
            return result;
        }

        public int ReadAllNotification(string empId, ref string Message)
        {

            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_read_all_notications";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllNotificationList");
                result = -1;
            }
            return result;
        }

        public DataSet GetVideoMatchAccess(int roundId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetVideoMatchAccess";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
             .Add(new SqlParameter("@RoundId", SqlDbType.Int))
             .Value = roundId;
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVideoMatchAccess");
            }
            return ds;
        }

        public DataSet GetVideoMatchDetails(int roundId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetVideoMatchDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = roundId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVideoMatchDetails");
            }
            return ds;
        }

        public int SendOTPtoVideoMatcher(int roundId, string EmployeeId, string otp, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sendOTPtoVideoMatcher";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@RoundId", SqlDbType.Int))
                .Value = roundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmployeeId", SqlDbType.NVarChar))
                .Value = EmployeeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.NVarChar, 2000))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sendOTPtoVideoMatcher");
                result = -1;
            }
            return result;
        }

        public int SubmitOtpVideoMatching(int roundId, string EmpId, string otp, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "VideoMatchingSubmitOtp";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@RoundId", SqlDbType.Int))
                .Value = roundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.Int))
                .Value = EmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.VarChar, 100))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@remarks", SqlDbType.VarChar, 500))
                .Value = remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.VarChar, 2000))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SubmitOtpVideoMatching");
                result = -1;
            }
            return result;

        }

       

        public int AssessmentCompleted(AssessmentCompleted obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_AssessmentCompleted";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@operation", SqlDbType.VarChar))
                .Value = obj.operation;
                cmdObj.Parameters
                .Add(new SqlParameter("@time_expired", SqlDbType.Bit))
                .Value = obj.time_expired;
                cmdObj.Parameters
                .Add(new SqlParameter("@challenges_being_graded", SqlDbType.Bit))
                .Value = obj.challenges_being_graded;
                cmdObj.Parameters
                .Add(new SqlParameter("@organization_id", SqlDbType.VarChar))
                .Value = obj.organization_id;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.VarChar))
                .Value = obj.email;
                cmdObj.Parameters
                .Add(new SqlParameter("@report_url", SqlDbType.VarChar))
                .Value = obj.report_url;
                cmdObj.Parameters
                .Add(new SqlParameter("@assessment_id", SqlDbType.VarChar))
                .Value = obj.assessment_id;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AssessmentCompleted");
            }
            return 1;
        }

        //public int UpdateCoderByteSore(string email, string assessmentId, int finalScore, string assessmentDate, string userName, string reportUrl,int qualifyingScore)
        public int UpdateCoderByteSore(Report report)
        {
            DataSet ds = new DataSet();
           
            try
            {
                OpeneConnection();
                string _sql = "sp_AddcoderByteReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
               .Add(new SqlParameter("@userName", SqlDbType.VarChar))
               .Value = report.username;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.VarChar))
                .Value = report.email;
                cmdObj.Parameters
                .Add(new SqlParameter("@assessmentdate", SqlDbType.VarChar))
                .Value = report.date_joined;
                cmdObj.Parameters
             .Add(new SqlParameter("@assessment_id", SqlDbType.VarChar))
             .Value = report.test_id;
                cmdObj.Parameters
               .Add(new SqlParameter("@display_name", SqlDbType.VarChar))
               .Value = report.display_name;
                cmdObj.Parameters
                .Add(new SqlParameter("@reportUrl", SqlDbType.VarChar))
                .Value = report.report_link;
                cmdObj.Parameters
                .Add(new SqlParameter("@total_challenges", SqlDbType.Int))
                .Value = report.total_challenges;
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalScore", SqlDbType.Int))
                .Value = report.final_score;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.VarChar))
                .Value = report.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@mc_score", SqlDbType.VarChar))
                .Value = report.mc_score;
                cmdObj.Parameters
                .Add(new SqlParameter("@QualifyingScore", SqlDbType.VarChar))
                .Value = report.qualifying_score;
                cmdObj.Parameters
                .Add(new SqlParameter("@qualified", SqlDbType.Bit))
                .Value = report.qualified;
                cmdObj.Parameters
               .Add(new SqlParameter("@code_score", SqlDbType.Int))
               .Value = report.code_score;
                cmdObj.Parameters
               .Add(new SqlParameter("@cheating_flag", SqlDbType.VarChar))
               .Value = report.cheating_flag;
                cmdObj.Parameters
               .Add(new SqlParameter("@cheating_details_tab_leaving", SqlDbType.Int))
               .Value = report.cheating_details.tab_leaving;
                cmdObj.Parameters
                .Add(new SqlParameter("@cheating_details_plagiarism", SqlDbType.VarChar))
                .Value = report.cheating_details.plagiarism;
                cmdObj.Parameters
                .Add(new SqlParameter("@cheating_details_pasted_code", SqlDbType.VarChar))
                .Value = report.cheating_details.pasted_code;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ScoreUpdated");
            }
            return 1;
        }

        public DataSet getCoderByteInterviewDetails(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCoderByteInterviewDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
             .Add(new SqlParameter("@cid", SqlDbType.Int))
             .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@empid", SqlDbType.VarChar))
               .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(outputParam);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCoderByteInterviewDetails");
            }
            return ds;
        }


        public int InsertCoderByteAssessments(List<AssessmentModel> model)
        {

            DataTable dtassessment = ConvertToDatatable(model);

            DataSet ds = new DataSet();

            try
            {
                OpeneConnection();
                string _sql = "CoderByteAssessmentsList_dump";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
               .Add(new SqlParameter("@assessments", SqlDbType.Structured))
               .Value = dtassessment;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "InsertCoderByteAssessments");
            }
            return 1;
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            if (items != null)
            {
                DataTable dataTable = new DataTable(typeof(T).Name);

                //Get all the properties
                PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                foreach (PropertyInfo prop in Props)
                {
                    //Defining type of data column gives proper data table 
                    var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                    //Setting column names as Property names
                    dataTable.Columns.Add(prop.Name, type);
                }
                foreach (T item in items)
                {
                    var values = new object[Props.Length];
                    for (int i = 0; i < Props.Length; i++)
                    {
                        //inserting property values to datatable rows
                        values[i] = Props[i].GetValue(item, null);
                    }
                    dataTable.Rows.Add(values);
                }
                //put a breakpoint here and check datatable
                return dataTable;
            }
            else
                return null;
        }

        public DataSet getCoderByteAssessmentList(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCoderByteAssessmentList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCoderByteInterviewDetails");
            }
            return ds;
        }

        private DataTable ConvertToDatatable(List<AssessmentModel> cnt)
        {
            var table = new DataTable();
            table.Columns.Add("Id", typeof(int));
            table.Columns.Add("test_id", typeof(string));
            table.Columns.Add("display_name", typeof(string));
            table.Columns.Add("public_url", typeof(string));
            table.Columns.Add("closed", typeof(bool));
            table.Columns.Add("created_date", typeof(DateTime));
            table.Columns.Add("created_by_email", typeof(string));
            table.Columns.Add("qualifying_score", typeof(int));
            table.Columns.Add("addedon", typeof(DateTime));


            int i = 1;
            foreach (var entity in cnt)
            { 
                
                var row = table.NewRow();
                row["Id"] = i;
                row["test_id"] = entity.test_id;
                row["display_name"] = entity.display_name;
                row["public_url"] = entity.public_url;
                row["closed"] = entity.closed;
                row["created_date"] = entity.created_date;
                row["created_by_email"] = entity.created_by_email;
                row["qualifying_score"] = entity.qualifying_score;
                row["addedon"] = entity.addedon;


                table.Rows.Add(row);
                i++;
            }
            return table;
        }

        public DataSet GetOfferedCandidateBasicDetails(int cid, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetOfferedCandidateBasicDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferedCandidateBasicDetails");
                ds = null;
            }
            return ds;
        }

        public DataSet GetCandidateDetailsForMailer(int cid, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetOfferedCandidateBasicDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferedCandidateBasicDetails");
                ds = null;
            }
            return ds;
        }



    }
}