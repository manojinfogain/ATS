using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web;

namespace ATSAPI.Repositry
{
    public class BuddyRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "BuddyRepository";
        DataUtility du;

        public BuddyRepository()
        {
            du = new DataUtility();
        }


        public DataSet GetCandidateListForBuddyAssign(BuddyModel obj, string Empid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateListForBuddyAssign";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = Empid;               
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
                .Add(new SqlParameter("@accountId", SqlDbType.NVarChar))
                .Value = obj.AccountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@locationId", SqlDbType.NVarChar))
                .Value = obj.locationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningDatestartdate", SqlDbType.NVarChar))
                .Value = obj.StartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningDateEnddate", SqlDbType.NVarChar))
                .Value = obj.EndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@pendingCase", SqlDbType.Int))
                .Value = obj.PendingCases;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListForBuddyAssign");
            }
            return ds;
        }

        public DataSet GetEmployeeListToAssign(string Empid, int cid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetEmployeeListToAssign";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.NVarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmployeeListToAssign");
            }
            return ds;
        }

        public int AddUpdateBuddy(BuddyAssign obj, string EmpID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateBuddy";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@BuddyEmpId", SqlDbType.NVarChar))
                .Value = obj.BuddyEmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.NVarChar))
                .Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateCompany");
                result = -1;
            }
            return result;
        }
    }
}