using ATSAPI.App_Data;
using System;
using System.Data.SqlClient;
using System.Data;
using ATSAPI.Models;

namespace ATSAPI.Repositry
{
    public class CandidateConnectRepository : Connection
    {

        SqlCommand cmdObj;
        string sectionName = "DashboardRepository";
        DataUtility du;
        public CandidateConnectRepository()
        {
            du = new DataUtility();
        }


        public DataSet GetOfferedCandidatesList(string EmpId, CandidateConnectModel obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;

            try
            {
                OpeneConnection();
                string _sql = "sp_GetOfferedCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.Int))
               .Value = obj.thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@primarySkillId", SqlDbType.NVarChar))
                .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@accountId", SqlDbType.NVarChar))
                .Value = obj.accountId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar))
                 .Value = obj.recruiterId;
                cmdObj.Parameters
               .Add(new SqlParameter("@SDateforDOJ", SqlDbType.NVarChar, 500))
               .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EDateforDOJ", SqlDbType.NVarChar, 500))
                .Value = obj.endDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@SDateforOfferedOn", SqlDbType.NVarChar, 500))
              .Value = obj.startDate2;
                cmdObj.Parameters
                .Add(new SqlParameter("@EDateforOfferedOn", SqlDbType.NVarChar, 500))
                .Value = obj.endDate2;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferedCandidatesList");
            }
            return ds;
        }


        public int addUpdateCandidateConnectHistory(CandidateConnect candidateconnect, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdateCandidateConnectHistory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = candidateconnect.Cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CandidateStatus", SqlDbType.VarChar))
                .Value = candidateconnect.CandidateStatus;

                cmdObj.Parameters
                .Add(new SqlParameter("@ResheduleDate", SqlDbType.VarChar))
                .Value = candidateconnect.RescheduleDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@ResheduleReason", SqlDbType.Int))
               .Value = candidateconnect.RescheduleReason;
                cmdObj.Parameters
              .Add(new SqlParameter("@ConnectDate", SqlDbType.VarChar))
              .Value = candidateconnect.ConnectDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@ConnectPerson", SqlDbType.VarChar))
              .Value = candidateconnect.ConnectPerson;
                cmdObj.Parameters
             .Add(new SqlParameter("@Status", SqlDbType.VarChar))
             .Value = candidateconnect.StatusCondi;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addUpdateCandidateConnectHistory");
                result = -1;
            }
            return result;
        }

        public DataSet CandidateStatusMaster(int? cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_CandidateStatusMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.VarChar))
                .Value = cid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                //ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateStatusMaster");
            }
            return ds;
        }

        public DataSet getAllEmployeeList(string EmpId, bool Pagination, int limit, out int result, string searchText)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getAllEmployeeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@pagination", SqlDbType.Bit))
               .Value = Pagination;
                cmdObj.Parameters
               .Add(new SqlParameter("@limit", SqlDbType.Int))
               .Value = limit;
                cmdObj.Parameters
               .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
               .Value = searchText;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllEmployeeList");
            }
            return ds;
        }

        public DataSet getCandidateConnectView(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateView";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.VarChar))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);               
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                //ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateConnectView");
            }
            return ds;
        }

        public DataSet GetCandidateConnectTracker(CandidateTrackerModel obj,string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Get_CandidateConnectReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                 .Add(new SqlParameter("@SDateforDOJ", SqlDbType.VarChar))
                .Value = obj.startDate;
                 cmdObj.Parameters
                 .Add(new SqlParameter("@EDateforDOJ", SqlDbType.VarChar))
                 .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@SDateforOfferedOn", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                .Add(new SqlParameter("@EDateforOfferedOn", SqlDbType.VarChar))
                .Value = obj.endDate2;
                cmdObj.Parameters
               .Add(new SqlParameter("@RecruiterId", SqlDbType.VarChar))
               .Value = obj.RecruiterId;

                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.VarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateConnectTracker");
            }
            return ds;
        }

        public DataSet CandidateConnectReason(string flag = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_CandidateConnectReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@flag", SqlDbType.VarChar))
                .Value = flag;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                //ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateConnectReason");
            }
            return ds;
        }

        public DataSet getCandidateConnectCallDetails(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidateConnectedCalls";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.VarChar))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.VarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateConnectCallDetails");
            }
            return ds;
        }

    }
}