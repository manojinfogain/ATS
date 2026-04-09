using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.Models;
using Microsoft.Owin;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Caching;
using System.Web.Http;
using static ATSAPI.Models.NaukriIntigration;

namespace ATSAPI.Repositry
{
    public class NaukriRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "NaukriRepository";

        DataUtility du;

        public NaukriRepository()
        {
            du = new DataUtility();
        }

        public int AddUpdateJobOnNaukri(CreateJobModel OBJ, string EmpID, out string message)
        {
            int result = 0;
            message = string.Empty;
            try
            {
                OpeneConnection();
                string _sql = "AddPostedJobOnNaukri";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
             .Add(new SqlParameter("@Message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@ThId", SqlDbType.Int))
                .Value = OBJ.thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@Title", SqlDbType.VarChar))
                .Value = OBJ.Title;
                cmdObj.Parameters
                .Add(new SqlParameter("@JobDescription", SqlDbType.NVarChar))
                .Value = OBJ.description;
                cmdObj.Parameters
               .Add(new SqlParameter("@MinSalary", SqlDbType.Int))
               .Value = OBJ.minSalary;
                cmdObj.Parameters
               .Add(new SqlParameter("@MaxSalary", SqlDbType.Int))
               .Value = OBJ.maxSalary;
                cmdObj.Parameters
               .Add(new SqlParameter("@SalaryCurrency", SqlDbType.Int))
               .Value = OBJ.salaryCurrency;
                cmdObj.Parameters
              .Add(new SqlParameter("@Industry", SqlDbType.Int))
              .Value = OBJ.industry;
                cmdObj.Parameters
              .Add(new SqlParameter("@WorkModeId", SqlDbType.Int))
              .Value = OBJ.workModeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmployementTypeId", SqlDbType.Int))
              .Value = OBJ.employmentTypeId;
                cmdObj.Parameters
               .Add(new SqlParameter("@OrgId", SqlDbType.Int))
               .Value = OBJ.orgId;
                cmdObj.Parameters
            .Add(new SqlParameter("@MinWorkExperience", SqlDbType.Int))
            .Value = OBJ.minWorkExperience;
                cmdObj.Parameters
            .Add(new SqlParameter("@MaxWorkExperience", SqlDbType.Int))
            .Value = OBJ.maxWorkExperience;
                cmdObj.Parameters
              .Add(new SqlParameter("@CauseTypeId", SqlDbType.NVarChar))
              .Value = OBJ.CauseTypeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@QaulificationId", SqlDbType.NVarChar))
              .Value = OBJ.QaulificationId;
                cmdObj.Parameters
           .Add(new SqlParameter("@PostingLocationId", SqlDbType.NVarChar))
           .Value = OBJ.PostingLocationId;
                cmdObj.Parameters
            .Add(new SqlParameter("@distributeTo", SqlDbType.VarChar))
            .Value = OBJ.distributeTo;
                cmdObj.Parameters
            .Add(new SqlParameter("@showSalary", SqlDbType.Char))
            .Value = OBJ.showSalary;
                cmdObj.Parameters
              .Add(new SqlParameter("@ModifiedBy", SqlDbType.VarChar))
              .Value = EmpID;
                cmdObj.Parameters
               .Add(new SqlParameter("@JobId", SqlDbType.VarChar))
               .Value = OBJ.JobId;
                cmdObj.Parameters
                .Add(new SqlParameter("@NaukriJobPostedQues", SqlDbType.Structured))
                .Value = ToDataTable<questions>(OBJ.questions);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CreateJobRequest");
            }
            return result;
        }

        public DataSet GetWorkModes()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetWorkModes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetWorkModes");
            }
            return ds;
        }


        public DataSet GetSalaryCurrency()
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "SP_SalaryCurrency";
                SqlCommand cmd = new SqlCommand(_sql, ConCampus);
                cmd.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmd);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalaryCurrency");
            }
            return ds;
        }

        public DataSet GetEmploymentType()
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string sql = "GetEmploymentTypes";
                SqlCommand cmd = new SqlCommand(sql, ConCampus);
                cmd.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmd);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmploymentType");
            }
            finally
            {
                CloseConnection();
            }
            return ds;
        }

        public DataSet GetQualificationsCourseType()
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string sql = "GetQualificationsCourseType";
                SqlCommand cmd = new SqlCommand(sql, ConCampus);
                cmd.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmd);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetQualificationsCourseType");
            }
            finally
            {
                CloseConnection();
            }
            return ds;
        }

        public DataSet GetPostedLocationsForNaukri()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetPostedLocationsForNaukri";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPostedLocationsForNaukri");
            }
            return ds;
        }

        public DataSet GetOrganizationForNaukri()
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOrganizationDetails";
                SqlCommand cmd = new SqlCommand(_sql, ConCampus);
                cmd.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmd);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOrganizationForNaukri");
            }
            return ds;
        }

        public DataSet GetQualificationsByCauseType(int? CaureTypeId = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetQualificationsByCauseType";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@CauseTypeId", SqlDbType.Int))
                .Value = CaureTypeId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetQualificationsByCauseType");
            }
            return ds;
        }

        public JobPostRequest GetPostedJobDetails(int Id)
        {
            JobPostRequest rd = new JobPostRequest();
            try
            {
                OpeneConnection();
                string _sql = "GetPostedJobDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = Id;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                rd = (JobPostRequest)RepositryMapper.getMap<JobPostRequest>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCurrentRoundDetailsByCid");
            }
            return rd;
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

        public DataSet GetPostedJobDetailsbyId(string jobId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetPostedJobDetailsbyId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@jobId", SqlDbType.VarChar))
                 .Value = jobId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Queations";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SearchCandidate");
            }
            return ds;
        }

        public int SaveJobStatus(JobDetailsResponse OBJ,string EmpId, char? IsPosted = null, char? IsUpdated = null, char? IsRefresh = null, char? IsUnpublish = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdatePostedJobIdStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@JobId", SqlDbType.VarChar))
                .Value = OBJ.JobStatus.Naukri.JobId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReferenceCode", SqlDbType.VarChar))
                .Value = OBJ.ReferenceCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@Status", SqlDbType.VarChar))
               .Value = OBJ.JobStatus.Naukri.Status;
                cmdObj.Parameters
               .Add(new SqlParameter("@JobBoardId", SqlDbType.VarChar))
               .Value = OBJ.JobStatus.Naukri.JobBoardId;
                cmdObj.Parameters
               .Add(new SqlParameter("@JobBoardJobId", SqlDbType.VarChar))
               .Value = OBJ.JobStatus.Naukri.JobBoardJobId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar))
               .Value = OBJ.JobStatus.Naukri.Message;
                cmdObj.Parameters
               .Add(new SqlParameter("@Url", SqlDbType.VarChar))
               .Value = OBJ.JobStatus.Naukri.Url;
                cmdObj.Parameters
             .Add(new SqlParameter("@ExpiryDateUTC", SqlDbType.DateTimeOffset))
             .Value = OBJ.JobStatus.Naukri.ExpiryDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@PostedDateUTC", SqlDbType.DateTimeOffset))
            .Value = OBJ.JobStatus.Naukri.PostedDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@ProcessedDateUTC", SqlDbType.DateTimeOffset))
            .Value = OBJ.JobStatus.Naukri.ProcessedDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@RefreshedDateUTC", SqlDbType.DateTimeOffset))
            .Value = OBJ.JobStatus.Naukri.RefreshedDate;
                cmdObj.Parameters
         .Add(new SqlParameter("@CreatedDateUTC", SqlDbType.DateTimeOffset))
         .Value = OBJ.CreatedDate;
                cmdObj.Parameters
         .Add(new SqlParameter("@UpdatedDateUTC", SqlDbType.DateTimeOffset))
         .Value = OBJ.UpdatedDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@RefreshedCount", SqlDbType.Int))
            .Value = OBJ.JobStatus.Naukri.RefreshedCount;
                cmdObj.Parameters
            .Add(new SqlParameter("@IsUnpublish", SqlDbType.Char))
            .Value = IsUnpublish;
                cmdObj.Parameters
            .Add(new SqlParameter("@IsRefresh", SqlDbType.Char))
            .Value = IsRefresh;
                    cmdObj.Parameters
            .Add(new SqlParameter("@IsPosted", SqlDbType.Char))
            .Value = IsPosted;
                    cmdObj.Parameters
            .Add(new SqlParameter("@IsUpdated", SqlDbType.Char))
            .Value = IsUpdated;
                cmdObj.Parameters
        .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
        .Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Result", SqlDbType.Int))
            .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@Result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveJobStatus");
                result = -1;
            }
            return result;
        }

        public int SaveJobId(string jobId, int thId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_SaveJobId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@JobId", SqlDbType.VarChar)).Value = jobId;
                cmdObj.Parameters.Add(new SqlParameter("@ThId", SqlDbType.Int)).Value = thId;
                cmdObj.Parameters.Add(new SqlParameter("@Result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@Result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveJobId");
                result = -1;
            }
            return result;
        }

        public int SaveApplicantStages(string applyId, string Status)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_SaveApplicantStages";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@applyId", SqlDbType.VarChar)).Value = applyId;
                cmdObj.Parameters.Add(new SqlParameter("@Status", SqlDbType.VarChar)).Value = Status;
                cmdObj.Parameters.Add(new SqlParameter("@Result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@Result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveJobId");
                result = -1;
            }
            return result;
        }

        public DataSet GetIndustries()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetNaukriIndustries";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIndustries");
            }
            return ds;
        }
        public DataSet GetApplicantDetailsById(int Id, string Empid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetNaukriApplicantsDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = Id;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.NVarChar))
                .Value = Empid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "AppicantDetails";
                ds.Tables[1].TableName = "EducationDetails";
                ds.Tables[2].TableName = "WorkDetails";
                ds.Tables[3].TableName = "Q&ADetails";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SearchCandidate");
            }
            return ds;
        }

        public int RoleBaseAuth(string EmpId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_RoleBaseAuth";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@UserId", SqlDbType.VarChar)).Value = EmpId;             
                cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "RoleBaseAuth");
                result = -1;
            }
            return result;
        }


    }
}