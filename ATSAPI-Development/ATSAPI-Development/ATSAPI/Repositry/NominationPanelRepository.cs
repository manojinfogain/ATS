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
using System.IO;
using Org.BouncyCastle.Ocsp;
using TimeZoneConverter;

namespace ATSAPI.Repositry
{
    public class NominationPanelRepository : Connection
    {

        SqlCommand cmdObj;
        string sectionName = "NominationPanelRepository";
        DataUtility du;
        public NominationPanelRepository()
        {
            du = new DataUtility();
        }

        public int AddUpdatePanelDetails(PanelAddUpdate obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdatePanel";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = obj.Id;
                cmdObj.Parameters
               .Add(new SqlParameter("@PanelEmpId", SqlDbType.VarChar))
               .Value = obj.PanelEmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@GradeId", SqlDbType.Int))
                .Value = obj.GradeId;
                cmdObj.Parameters
                   .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                   .Value = obj.LocationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
                .Value = obj.AccountId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Skills", SqlDbType.NVarChar, 2000))
               .Value = obj.Skills;
                cmdObj.Parameters
              .Add(new SqlParameter("@ActionDateUTC", SqlDbType.VarChar))
              .Value = obj.ActionDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTimeZone", SqlDbType.VarChar))
                 .Value = obj.ActionTimeZone;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpID", SqlDbType.VarChar, 100))
               .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SubmitTechnicalQuestionnnaire");
                result = -1;
            }
            return result;

        }

        public DataSet GetEmpListForPanelAddition(string EmpID, int page, int pageSize, out int result,string search = null )
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetEmpListForPanelAddition";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpListForPanelAddition");
            }
            return ds;
        }


        public DataSet GetEmpDetails(string actionBy, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetEmpDetailsNom";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionByID", SqlDbType.VarChar))
               .Value = actionBy;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpDetails");
            }
            return ds;
        }

        public DataSet GetPanelList(PanelListFilter obj, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetPanelList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@LocationId", SqlDbType.Int))
              .Value = obj.LocationId;
                cmdObj.Parameters
             .Add(new SqlParameter("@skillIds", SqlDbType.NVarChar))
             .Value = obj.PrimarySkill;
                cmdObj.Parameters
             .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar))
             .Value = obj.AccountID;
                cmdObj.Parameters
             .Add(new SqlParameter("@MinExp", SqlDbType.Int))
             .Value = obj.MinExp;
                cmdObj.Parameters
             .Add(new SqlParameter("@MaxExp", SqlDbType.Int))
             .Value = obj.MaxExp;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
               
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelList");
            }
            return ds;
        }

        public int ChangePanelStatus(PanelStatusUpdate obj, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ChangePanelStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = obj.Id;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = obj.Status;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
            .Add(new SqlParameter("@ActionDateUTC", SqlDbType.VarChar))
            .Value = obj.ActionDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTimeZone", SqlDbType.VarChar))
                 .Value = obj.ActionTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePanelStatus");
                result = -1;
            }
            return result;
        }

        public int PostJob(JobPosting obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_PublishedJobRequisitions";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@Id", SqlDbType.Int))
               .Value = obj.Id;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar, 100))
                .Value = obj.thId;
                cmdObj.Parameters
               .Add(new SqlParameter("@startDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@endtDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@candidateCount", SqlDbType.Int))
               .Value = obj.candidateCount;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
            .Add(new SqlParameter("@ActionDateUTC", SqlDbType.VarChar))
            .Value = obj.ActionDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTimeZone", SqlDbType.VarChar))
                 .Value = obj.ActionTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                 .Value = obj.LocationId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "PostJob");
                result = -1;
            }
            return result;

        }

        public DataSet GetPublishJobStatus(string thid, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetPublishJobStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = thid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data"; 
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishJobStatus");
            }
            return ds;
        }


        public DataSet GetPublishedJobList(PanelListFilter obj, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_PublishedJobRequisitionsList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@LocationId", SqlDbType.Int))
              .Value = obj.LocationId;
                cmdObj.Parameters
             .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar))
             .Value = obj.PrimarySkill;
                cmdObj.Parameters
             .Add(new SqlParameter("@accountId", SqlDbType.NVarChar))
             .Value = obj.AccountID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishedJobList");
            }
            return ds;
        }

        public int AddPanelJobSlotTime(AddPanelJobSlotTime obj, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddPanelJobSlotTime";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = obj.ThId;
                cmdObj.Parameters
                .Add(new SqlParameter("@PanelId", SqlDbType.VarChar))
                .Value = obj.PanelEmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
                 cmdObj.Parameters
               .Add(new SqlParameter("@ActionDateUTC", SqlDbType.VarChar))
               .Value = obj.ActionDateUTC;
                cmdObj.Parameters
               .Add(new SqlParameter("@SlotDateUTC", SqlDbType.VarChar))
               .Value = obj.SlotDateUTC;
                cmdObj.Parameters
             .Add(new SqlParameter("@SlotStartTime", SqlDbType.VarChar))
             .Value = obj.PanelSlotTimeDetails.SlotStartTime;

                cmdObj.Parameters
             .Add(new SqlParameter("@SlotEndTime", SqlDbType.VarChar))
             .Value = obj.PanelSlotTimeDetails.SlotEndTime;
                cmdObj.Parameters
             .Add(new SqlParameter("@SlotStartDateUTC", SqlDbType.VarChar))
             .Value = obj.PanelSlotTimeDetails.SlotStartDateUTC;
                cmdObj.Parameters
             .Add(new SqlParameter("@SlotEndDateUTC", SqlDbType.VarChar))
             .Value = obj.PanelSlotTimeDetails.SlotEndDateUTC;
                cmdObj.Parameters
                .Add(new SqlParameter("@TimeZone", SqlDbType.NVarChar))
                .Value = obj.TimeZone;
                cmdObj.Parameters
             .Add(new SqlParameter("@WinTimeZone", SqlDbType.NVarChar))
             .Value = TZConvert.IanaToWindows(obj.TimeZone);
                cmdObj.Parameters
             .Add(new SqlParameter("@OffSetDate", SqlDbType.NVarChar))
             .Value = obj.OffSetDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@PanelSlotTimeDetails", SqlDbType.Structured))
                //.Value = ToDataTable<PanelSlotTimeDetails>(obj.PanelSlotTimeDetails);
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddPanelJobSlotTime");
                result = -1;
            }
            return result;
        }

        public DataSet getPanelSlotsByTHID(PanelSlotByTh obj, string EmpID,out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPanelSlotsByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = obj.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@SlotStartDate", SqlDbType.VarChar))
                .Value = obj.SlotStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@SlotEndDate", SqlDbType.VarChar))
                .Value = obj.SlotEndDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@SlotStartTime", SqlDbType.VarChar))
              .Value = obj.SlotStartTime;
                cmdObj.Parameters
                .Add(new SqlParameter("@SlotEndTime", SqlDbType.VarChar))
                .Value = obj.SlotEndTime;
                cmdObj.Parameters
              .Add(new SqlParameter("@PanelEmpId", SqlDbType.NVarChar))
              .Value = obj.PanelEmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPanelSlotsByTHID");
            }
            return ds;
        }
        public DataSet getPanelSlotsCountByTHID(string thid, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPanelSlotCountsByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = thid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPanelSlotCountsByTHID");
            }
            return ds;
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

        public DataSet getPanelSlotDetails(string PanelEmpId, string EmpID,string thid,string date,  int page, int pagesize, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPanelSlotDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@PanelEmpId", SqlDbType.VarChar))
                .Value = PanelEmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = thid;
                cmdObj.Parameters
              .Add(new SqlParameter("@date", SqlDbType.VarChar))
              .Value = date;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pagesize;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);               
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPanelSlotDetails");
            }
            return ds;
        }

        public int DeletePanelSlot(int SlotId, string DeletedBy)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_DeletePanelSlot";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SlotId", SqlDbType.Int))
                 .Value = SlotId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                 .Value = DeletedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DeletePanelSlot");
                result = -1;
            }
            return result;
        }

        public DataSet GetPanelListBySlotThid(string EmpID, string thid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetPanelListBySlotThid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = thid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelListBySlotThid");
            }
            return ds;
        }

        public DataSet GetPanelNominationNotificationlistBytid(string EmpID, int thid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPanelNominationNotificationlistBytid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empid", SqlDbType.NVarChar))
                 .Value = EmpID;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.Int))
               .Value = thid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelNominationNotificationlistBytid");
            }
            return ds;
        }
    }
}