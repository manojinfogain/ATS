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
    public class ReportUATRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "ReportUATRepository";
        DataUtility du;
        public ReportUATRepository()
        {
            du = new DataUtility();
        }


        public DataSet GetCandidateOfferReport_UAT(CandidateOfferFilter obj)
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetCandidateOfferReport_UAT";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                 .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = obj.search;
                cmdObj.Parameters
                 .Add(new SqlParameter("@location", SqlDbType.NVarChar, 2000))
                 .Value = obj.location;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerstatus", SqlDbType.NVarChar, 2000))
                .Value = obj.offerStatus;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dropReasonId", SqlDbType.NVarChar, 2000))
                 .Value = obj.dropReasonId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
                 .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@RecruiterId", SqlDbType.NVarChar, 2000))
                .Value = obj.recruiterId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DU", SqlDbType.NVarChar, 2000))
                 .Value = obj.DUIDs;
                cmdObj.Parameters
                .Add(new SqlParameter("@REQUIREMENTTYPE", SqlDbType.NVarChar, 2000))
                .Value = obj.requisitionType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Source", SqlDbType.NVarChar, 2000))
                 .Value = obj.source;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmploymentType", SqlDbType.NVarChar, 2000))
                .Value = obj.contractType;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateOfferReport");
            }
            return ds;
        }

        public DataSet GetOpenPositionReports_UAT(OpenPositionFilter obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_OpenPositionReports_UAT";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DU", SqlDbType.NVarChar, 2000))
                 .Value = obj.DUIDs;
                cmdObj.Parameters
                .Add(new SqlParameter("@startDate", SqlDbType.NVarChar, 2000))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@endDate", SqlDbType.NVarChar, 2000))
                 .Value = obj.endDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LOCATION", SqlDbType.NVarChar, 2000))
                 .Value = obj.location;
                cmdObj.Parameters
               .Add(new SqlParameter("@REQUIREMENTTYPE", SqlDbType.NVarChar, 2000))
               .Value = obj.requisitionType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BUId", SqlDbType.NVarChar, 2000))
                 .Value = obj.BUId;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.NVarChar))
               .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
                .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@RecruiterId", SqlDbType.NVarChar, 2000))
                .Value = obj.recruiterId;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubStatusId", SqlDbType.NVarChar, 2000))
                .Value = obj.subStatusId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpenPositionReportsMultiple");
            }
            return ds;
        }

        public DataSet GetSalaryDeviationReport_UAT(SalaryDevFilter obj, string EmpID)
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetSalaryDeviationReport_UAT";
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
               .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                 .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = obj.search;
                cmdObj.Parameters
                 .Add(new SqlParameter("@location", SqlDbType.NVarChar, 2000))
                 .Value = obj.location;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerstatus", SqlDbType.NVarChar, 2000))
                .Value = obj.offerStatus;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
                 .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@RecruiterId", SqlDbType.NVarChar, 2000))
                .Value = obj.recruiterId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DU", SqlDbType.NVarChar, 2000))
                 .Value = obj.DUIDs;
                cmdObj.Parameters
                .Add(new SqlParameter("@REQUIREMENTTYPE", SqlDbType.NVarChar, 2000))
                .Value = obj.requisitionType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Source", SqlDbType.NVarChar, 2000))
                 .Value = obj.source;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmploymentType", SqlDbType.NVarChar, 2000))
                .Value = obj.contractType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalaryDeviationReport");
            }
            return ds;
        }


        public DataSet GetInterviewProcesssReport_UAT(InterviewProcessFilter obj)
        {

            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetInterviewProcessReport_UAT";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.NVarChar, 2000))
               .Value = obj.thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                cmdObj.Parameters
                .Add(new SqlParameter("@startDate", SqlDbType.Date))
                .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@endDate", SqlDbType.Date))
                .Value = obj.endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@DU", SqlDbType.NVarChar, 2000))
               .Value = obj.DUIDs;
                cmdObj.Parameters
               .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
               .Value = obj.accountId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrimarySkillId", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
               .Add(new SqlParameter("@RecruiterId", SqlDbType.NVarChar, 2000))
               .Value = obj.recruiterId;
                cmdObj.Parameters
               .Add(new SqlParameter("@interviewStartDate", SqlDbType.Date))
               .Value = obj.interviewStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@interviewEndDate", SqlDbType.Date))
                .Value = obj.interviewEndDate;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetInterviewProcesssReport");
            }
            return ds;
        }

    }
}