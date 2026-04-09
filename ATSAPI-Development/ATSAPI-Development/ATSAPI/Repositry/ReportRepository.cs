using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.Models;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
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
    public class ReportRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "ReportRepository";
        DataUtility du;
        public ReportRepository()
        {
            du = new DataUtility();
        }

        public DataSet GetReferralCandidateReport(int PageNo, int PageSize, string search, string Location, string EmpId, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getReferralCandidateReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = PageNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                 .Value = PageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = search;
                cmdObj.Parameters
                .Add(new SqlParameter("@Location", SqlDbType.NVarChar))
                .Value = Location;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReferralCandidateReport");
            }
            return ds;
        }

        public DataSet GetOpenPositionReports(OpenPositionFilter obj, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_OpenPositionReports";
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
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpenPositionReportsMultiple");
            }
            return ds;
        }

        public DataSet GetOpenPositionCandidateDetails(string Thid, string Flag, int Round, int page, int PageSize, string search, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_OpenPositionCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Thid", SqlDbType.VarChar))
                 .Value = Thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@Flag", SqlDbType.VarChar))
                .Value = Flag;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Round", SqlDbType.Int))
                 .Value = Round;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                .Value = PageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpenPositionCandidateDetails");
            }
            return ds;
        }

        public DataSet GetRecruiterProductivityReport(string Month, string Year, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_RecruiterProductivityReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Month", SqlDbType.VarChar))
                .Value = Month;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.VarChar))
                 .Value = Year;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "grandTotal";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRecruiterProductivityReport");
            }
            return ds;
        }

        public DataSet GetSalaryDeviationReport(SalaryDevFilter obj, string EmpID, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetSalaryDeviationReport";
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
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
               .Value = obj.PracticeId;
                cmdObj.Parameters
             .Add(new SqlParameter("@IsReportSalaryMask", SqlDbType.Char))
             .Value = obj.IsReportSalaryMask;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalaryDeviationReport");
            }
            return ds;
        }

        public DataSet GetCandidateOfferReport(CandidateOfferFilter obj, string empId, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetCandidateOfferReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empId;
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
                cmdObj.Parameters
                .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
                .Value = obj.PracticeId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateOfferReport");
            }
            return ds;
        }
        public DataSet GetInterviewProcesssReportList(InterviewProcessFilter obj, string empID, out int result)
        {

            DataSet ds = new DataSet(); 
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetInterviewProcessReportList";
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
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
               .Value = obj.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeCommunityId", SqlDbType.NVarChar, 2000))
               .Value = obj.practiceCommunityId;
                cmdObj.Parameters
              .Add(new SqlParameter("@SubPracticeId", SqlDbType.NVarChar, 2000))
              .Value = obj.subPracticeId;
                cmdObj.Parameters
               .Add(new SqlParameter("@SourceType", SqlDbType.NVarChar, 2000))
               .Value = obj.SourceType;
                cmdObj.Parameters
               .Add(new SqlParameter("@empID", SqlDbType.Int))
               .Value = empID;
                cmdObj.Parameters
              .Add(new SqlParameter("@modifiedOnStartdate", SqlDbType.Date))
              .Value = obj.modifiedOnStartdate;
                cmdObj.Parameters
                .Add(new SqlParameter("@modifiedOnEnddate", SqlDbType.Date))
                .Value = obj.modifiedOnEnddate;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";

                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetInterviewProcesssReport");
            }
            return ds;
        }

        public DataSet GetInterviewProcessReportDetailsByCid(int cid, string empID, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetInterviewProcessReportDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@CID", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetInterviewProcessReportDetailsByCid");
            }
            return ds;
        }
        public DataSet GetInterviewProcesssReport(InterviewProcessFilter obj, string empID, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetInterviewProcessReport";

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
                cmdObj.Parameters
              .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
              .Value = obj.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeCommunityId", SqlDbType.NVarChar, 2000))
               .Value = obj.practiceCommunityId;
                cmdObj.Parameters
             .Add(new SqlParameter("@SubPracticeId", SqlDbType.NVarChar, 2000))
             .Value = obj.subPracticeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SourceType", SqlDbType.NVarChar, 2000))
                 .Value = obj.SourceType;
                cmdObj.Parameters
             .Add(new SqlParameter("@empID", SqlDbType.NVarChar, 2000))
             .Value = empID;
                cmdObj.Parameters
              .Add(new SqlParameter("@modifiedOnStartdate", SqlDbType.Date))
              .Value = obj.modifiedOnStartdate;
                cmdObj.Parameters
                .Add(new SqlParameter("@modifiedOnEnddate", SqlDbType.Date))
                .Value = obj.modifiedOnEnddate;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
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

        public DataSet GetReferralReport(ReferralModel obj, string empID, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetReferralReport";
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
                .Add(new SqlParameter("@empID", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
               .Value = obj.PracticeId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReferralReport");
            }
            return ds;
        }

        public DataSet GetWeekWiseRecruiterProductivityReport(string Month, string Year, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_WeekWiseRecruiterProductivityReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Month", SqlDbType.VarChar))
                .Value = Month;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.VarChar))
                 .Value = Year;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                //ds.Tables[1].TableName = "grandTotal";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetWeekWiseRecruiterProductivityReport");
            }
            return ds;
        }

        // Added by Jivan 
        public DataSet GetPanelWiseReportNew(panelWiseFilterModelNew OBJ, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetPanelWiseReportNew";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = OBJ.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = OBJ.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@sDate", SqlDbType.VarChar))
                .Value = OBJ.StartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@eDate", SqlDbType.VarChar))
                .Value = OBJ.EndDate;
                cmdObj.Parameters
             .Add(new SqlParameter("@empId", SqlDbType.VarChar))
             .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelWiseReportNew");
            }
            return ds;
        }

        public DataSet GetOnboardReport([FromBody] OnBoardModel obj, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetOnboardingReport";
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
                .Add(new SqlParameter("@location", SqlDbType.NVarChar))
                .Value = obj.Location;
                cmdObj.Parameters
                .Add(new SqlParameter("@division", SqlDbType.NVarChar))
                .Value = obj.Division;
                cmdObj.Parameters
                .Add(new SqlParameter("@dateofJoiningStart", SqlDbType.NVarChar))
                .Value = obj.DateOfjoiningStart;
                cmdObj.Parameters
                .Add(new SqlParameter("@dateofJoiningend", SqlDbType.NVarChar))
                .Value = obj.DateOfjoiningEnd;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelWiseReportNew");
            }
            return ds;
        }

        public DataSet GetTalentIdReportRenuTeam(TalentReportRenuTeamFilter obj, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTalentDetailsReport_RENUTeam";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
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
               .Add(new SqlParameter("@search", SqlDbType.NVarChar))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
              .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@primarySkillId", SqlDbType.NVarChar, 2000))
                .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@RecruiterId", SqlDbType.NVarChar, 2000))
                .Value = obj.recruiterId;
                cmdObj.Parameters
                .Add(new SqlParameter("@StatusID", SqlDbType.NVarChar, 2000))
                .Value = obj.talentStatus;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentIdReportRenuTeam");
            }
            return ds;
        }

        public DataSet GetCandidateWiseReport(CandidateWiseReportFilter obj, string empID, out int result) 
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetCandidateWiseReport";
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
                cmdObj.Parameters
              .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar, 2000))
              .Value = obj.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeCommunityId", SqlDbType.NVarChar, 2000))
               .Value = obj.practiceCommunityId;
                cmdObj.Parameters
             .Add(new SqlParameter("@SubPracticeId", SqlDbType.NVarChar, 2000))
             .Value = obj.subPracticeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SourceType", SqlDbType.NVarChar, 2000))
                 .Value = obj.SourceType;
                cmdObj.Parameters
             .Add(new SqlParameter("@empID", SqlDbType.NVarChar, 2000))
             .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@StatusID", SqlDbType.NVarChar, 2000))
                 .Value = obj.talentStatus;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateWiseReport");
            }
            return ds;
        }
        public DataSet GetIJPTalentReport(GetIJPViewList obj, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetIJPTalentReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Page", SqlDbType.Int))
               .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@PageSize", SqlDbType.Int))
               .Value = obj.pageSize;
                cmdObj.Parameters
               .Add(new SqlParameter("@LocationIDs", SqlDbType.NVarChar))
               .Value = obj.LocationIDs;
                cmdObj.Parameters
              .Add(new SqlParameter("@AccountIDs", SqlDbType.NVarChar))
              .Value = obj.AccountIDs;
                cmdObj.Parameters
            .Add(new SqlParameter("@GradeIDs", SqlDbType.NVarChar))
            .Value = obj.GradeIDs;
                cmdObj.Parameters
            .Add(new SqlParameter("@SkillIDs", SqlDbType.NVarChar))
            .Value = obj.SkillIDs;
                cmdObj.Parameters
           .Add(new SqlParameter("@IsApplied", SqlDbType.Int))
           .Value = obj.IsApplied;
                cmdObj.Parameters
             .Add(new SqlParameter("@search", SqlDbType.NVarChar))
             .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusId", SqlDbType.NVarChar))
              .Value = obj.ijpStatusId;
                cmdObj.Parameters
               .Add(new SqlParameter("@startDate", SqlDbType.Date))
               .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@endDate", SqlDbType.Date))
                .Value = obj.endDate;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPTalentReport");
            }
            return ds;
        }

        public DataSet CandidateInterviewToOnboardingVideoCompReport(InterviewToOnboardingVideoCompReport obj, string EmpId)
        {
            DataSet ds = null;

            try
            {
                OpeneConnection();
                string _sql = "CandidateVideoComparisonReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@Search", SqlDbType.VarChar))
              .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@page", SqlDbType.Int))
               .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@PageSize", SqlDbType.Int))
               .Value = obj.pageSize;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateVideoComparisonReport");
            }
            return ds;
        }


    }
}