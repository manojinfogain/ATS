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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace ATSAPI.Repositry
{
    public class OnboardRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "OnboardRepository";
        DataUtility du;
        public OnboardRepository()
        {
            du = new DataUtility();
        }

        public DataSet getPipelineJoineeCandidateList(PipelineJoineeListFilters obj, string empId, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPipelineJoineeCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = obj.PageNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                 .Value = obj.PageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = obj.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = obj.search;
                cmdObj.Parameters
                .Add(new SqlParameter("@Location", SqlDbType.Int))
                .Value = obj.Location;
                cmdObj.Parameters
                .Add(new SqlParameter("@startDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@endDate", SqlDbType.VarChar))
                .Value = obj.endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@startDateFirstUTC", SqlDbType.VarChar))
               .Value = obj.startDateFirstUTC;
                cmdObj.Parameters
               .Add(new SqlParameter("@endDateFirstUTC", SqlDbType.VarChar))
               .Value = obj.endDateFirstUTC;
                cmdObj.Parameters
              .Add(new SqlParameter("@empid", SqlDbType.VarChar))
              .Value = empId;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatusId", SqlDbType.Int))
              .Value = obj.offerStatusId;
                cmdObj.Parameters
           .Add(new SqlParameter("@LocationIds", SqlDbType.NVarChar))
           .Value = obj.location;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPipelineJoineeCandidateList");
            }
            return ds;
        }

        public int UpdateJoineeCandidateStatus(UpdateJoineeCandidateStatus obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "updateJoineeCandidateStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@remark", SqlDbType.NVarChar))
                .Value = obj.remark;
                cmdObj.Parameters
                .Add(new SqlParameter("@confirmJoinDate", SqlDbType.VarChar))
                .Value = obj.confirmJoinDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingStartDate", SqlDbType.VarChar))
                .Value = obj.billingStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoineeStatus", SqlDbType.VarChar))
                .Value = obj.joineeStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@declineCategId", SqlDbType.Int))
                .Value = obj.declineCategId;
                cmdObj.Parameters
                .Add(new SqlParameter("@reportingManager", SqlDbType.VarChar))
                .Value = obj.reportingManager;
                cmdObj.Parameters
               .Add(new SqlParameter("@OnboardingMode", SqlDbType.Char))
               .Value = obj.OnboardMode;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateJoineeCandidateStatus");
                result = -1;
            }
            return result;
        }

        public int AddJoineeCandidateDetailsByISS(JoineeCandidateDetails obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "addUpdateJoineeCandidateDetailsByISS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.VarChar))
                .Value = obj.emailId;
                cmdObj.Parameters
                .Add(new SqlParameter("@domainId", SqlDbType.VarChar))
                .Value = obj.domainId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public int UpdateJoineeCandidateDetailsByISS(JoineeCandidateDetails obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "updateJoineeCandidateDetailsByISS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.VarChar))
                .Value = obj.emailId;
                cmdObj.Parameters
                .Add(new SqlParameter("@domainId", SqlDbType.VarChar))
                .Value = obj.domainId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public int DeleteJoineeCandidateDetailsByISS(int cid, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "deleteJoineeCandidateDetailsByISS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DeleteJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public DataSet getCandidateDetails(int cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDetailsOnboard";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetailsByCid");
            }
            return ds;
        }

        public int CreateCandidateUser(CandidateUser obj, string Password, string Salt, string pwdTxt, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CreateCandidateUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = obj.cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JoiningLocation", SqlDbType.Int))
                 .Value = obj.JoiningLocationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DivisionId", SqlDbType.Int))
                 .Value = obj.DivisionId;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Password", SqlDbType.NVarChar))
                .Value = Password;
                cmdObj.Parameters
                .Add(new SqlParameter("@Salt", SqlDbType.NVarChar))
                .Value = Salt;
                cmdObj.Parameters
                .Add(new SqlParameter("@pwdTxt", SqlDbType.NVarChar))
                .Value = pwdTxt;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CreatePartnerUser");
                result = -1;
            }
            return result;
        }


        public DataSet GetAllOnboardCandidateList(string EmpId, OnboardListFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllOnboardCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.NVarChar, 200))
               .Value = obj.thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.NVarChar, 500))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatus", SqlDbType.NVarChar, 2000))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
              .Add(new SqlParameter("@LocationIds", SqlDbType.NVarChar, 2000))
              .Value = obj.location;
                cmdObj.Parameters
             .Add(new SqlParameter("@OnboardStatus", SqlDbType.NVarChar, 2000))
             .Value = obj.onboardstatus;
                cmdObj.Parameters
            .Add(new SqlParameter("@Onboardsubstatus", SqlDbType.NVarChar, 2000))
            .Value = obj.onboardsubstatus;
                cmdObj.Parameters
            .Add(new SqlParameter("@day1SubStatus", SqlDbType.NVarChar, 2000))
            .Value = obj.day1SubStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar, 2000))
               .Value = obj.recruiterId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOnboardCandidateList");
            }
            return ds;
        }

        public DataSet getCandidatePersonalDetails(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidatePersonalDetailsByHRRec";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@empid", SqlDbType.VarChar))
              .Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidatePersonalDetails");
            }
            return ds;
        }

        public DataSet getCandidateAllDetails(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getOnboardCandidateDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@empid", SqlDbType.VarChar))
              .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "familyData";
                ds.Tables[1].TableName = "educationData";
                ds.Tables[2].TableName = "employmentData";
                ds.Tables[3].TableName = "trainingData";
                ds.Tables[4].TableName = "salaryData";
                ds.Tables[5].TableName = "questionireData";
                ds.Tables[6].TableName = "refrenceData";
                ds.Tables[7].TableName = "MandateJoiningDocUpload";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidatePersonalDetails");
            }
            return ds;
        }

        public DataSet getCandidateDocumentList(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDocumentsByHRRec";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@empid", SqlDbType.VarChar))
              .Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidatePersonalDetails");
            }
            return ds;
        }


        public DataSet GetCandidateDocumentByid(int id, string userId, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDocumentByid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserId ", SqlDbType.VarChar))
                .Value = userId;
                cmdObj.Parameters
                .Add(new SqlParameter("@id ", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProfilePicture");
            }
            return ds;
        }


        public DataSet GetJoiningMandateHRDocsByCidandDocType(int Cid, string documentType, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetJoiningMandateHRDocs";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@documentType ", SqlDbType.Char))
                .Value = documentType;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid ", SqlDbType.Int))
                .Value = Cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJoiningMandateHRDocsByCidandDocType");
            }
            return ds;
        }

        public int verificationOnboardingByRecHr(verificationOnboardingByRecHr obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "verificationOnboardingByRecHr";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionBy", SqlDbType.Char))
                .Value = obj.ActionBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@Type", SqlDbType.VarChar))
                .Value = obj.type;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Int))
                .Value = obj.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar, 1000))
                .Value = obj.remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public int uploadPicVideoOnboard(uploadDocOnBoards model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddUpdateCandidateOnboardProofVidFile";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsConsent", SqlDbType.Char))
                .Value = model.IsConsent;
                cmdObj.Parameters
                .Add(new SqlParameter("@FileNameVideo", SqlDbType.VarChar))
                .Value = model.FileNameVideo;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePathVideo", SqlDbType.NVarChar))
               .Value = model.FilePathVideo;
                cmdObj.Parameters
               .Add(new SqlParameter("@FileNameProfilePic", SqlDbType.VarChar))
               .Value = model.FileNameProfilePic;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePathProfilePic", SqlDbType.NVarChar))
               .Value = model.FilePathProfilePic;
                cmdObj.Parameters
              .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
              .Value = model.remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "uploadDocVid");
                result = -1;
            }
            return result;
        }


        public int CandidateIdentificationByHR(CandidateIdentificationByHR model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_CandidateIdentificationByHR";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsConsent", SqlDbType.Char))
                .Value = model.IsConsent;
                cmdObj.Parameters
                .Add(new SqlParameter("@FileNameVideo", SqlDbType.VarChar))
                .Value = model.FileNameVideo;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePathVideo", SqlDbType.NVarChar))
               .Value = model.FilePathVideo;
                cmdObj.Parameters
              .Add(new SqlParameter("@sharePointIdVideo", SqlDbType.NVarChar))
              .Value = model.sharePointIdVideo;
                cmdObj.Parameters
              .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
              .Value = model.remarks;
                cmdObj.Parameters
            .Add(new SqlParameter("@VideoMatchPercent", SqlDbType.Decimal))
            .Value = model.videoMatchPercent;
                cmdObj.Parameters
           .Add(new SqlParameter("@VideoMatch", SqlDbType.Char))
           .Value = model.videoMatch;
                cmdObj.Parameters
           .Add(new SqlParameter("@OnboardingMode", SqlDbType.Int))
           .Value = model.OnboardingMode;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "uploadDocVid");
                result = -1;
            }
            return result;
        }
        public int SendEmailtoITTeamOnboardVideoResult(CandidateIdentificationByHR model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_SendEmailtoITTeamOnboardVideoResult";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
            .Add(new SqlParameter("@VideoMatchPercent", SqlDbType.Decimal))
            .Value = model.videoMatchPercent;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendEmailtoITTeamOnboardVideoResult");
                result = -1;
            }
            return result;
        }


        public DataSet GetVideoProfilePicOnboard(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_CandidateOnboardProofVidFile";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProfilePicture");
            }
            return ds;
        }

        public DataSet GetVideoTechHR(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetVideoTechHR";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProfilePicture");
            }
            return ds;
        }

        public DataSet GetAllCandidatesForHRValidation(string EmpId, OfferApprovedCandidateFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAllCandidatesForHRValidation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@page", SqlDbType.Int))
               .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@pageSize", SqlDbType.Int))
               .Value = obj.pageSize;
                cmdObj.Parameters
               .Add(new SqlParameter("@empid", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.NVarChar, 500))
               .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.NVarChar, 200))
               .Value = obj.thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@offerStatus", SqlDbType.NVarChar, 2000))
               .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.Date))
               .Value = obj.startDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.Date))
               .Value = obj.endDate;
                cmdObj.Parameters
          .Add(new SqlParameter("@LocationIds", SqlDbType.NVarChar, 2000))
          .Value = obj.location;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllCandidatesForHRValidation");
            }
            return ds;
        }

        public int FinalVerificationOnboardingByRecHr(VerificationOnboardingCandidateDetails obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_FinalVerificationOnboardingByRecHr";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionBy", SqlDbType.Char))
                .Value = obj.ActionBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailSubject", SqlDbType.VarChar))
                .Value = obj.mailSubject;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Int))
                .Value = obj.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailBody", SqlDbType.NVarChar, 1000))
                .Value = obj.mailBody;
                // Added by jivan
                //cmdObj.parameters
                //.add(new sqlparameter("@OnBordingMode", sqld))
                //.value = obj.OnBordingMode;

                cmdObj.Parameters
               .Add(new SqlParameter("@OnBordingMode", SqlDbType.Char))
               .Value = obj.OnBordingMode;

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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public int RefferedbackToCandidateByRecruiter(VerificationOnboardingCandidateDetails obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_refferedbackToCandidateByRecruiter";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailSubject", SqlDbType.VarChar))
                .Value = obj.mailSubject;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Int))
                .Value = obj.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailBody", SqlDbType.NVarChar, 1000))
                .Value = obj.mailBody;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateJoineeCandidateDetailsByISS");
                result = -1;
            }
            return result;
        }

        public int sendOnboardDocToCandidate(sendOnboardForm obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sendOnboardDocToCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@FormType", SqlDbType.Char))
                .Value = obj.formType;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsEmailSend", SqlDbType.Char))
                .Value = obj.isEmailSend;
                cmdObj.Parameters
                .Add(new SqlParameter("@FormId", SqlDbType.NVarChar))
                .Value = obj.formId;
                cmdObj.Parameters
                // Added by jivan
                .Add(new SqlParameter("@OnBoardingMode", SqlDbType.Char))
                .Value = obj.OnBoardingMode;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sendOnboardDocToCandidate");
                result = -1;
            }
            return result;
        }

        public int OnboardFormEnableDisable(OnboardFormEnableDisable obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "OnboardFormEnableDisable";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@FormId", SqlDbType.Int))
                .Value = obj.formId;
                cmdObj.Parameters
                .Add(new SqlParameter("@StatusId", SqlDbType.Int))
                .Value = obj.status;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "OnboardFormEnableDisable");
                result = -1;
            }
            return result;
        }
        public DataSet GetOnboardingFormList(int cid, string EmpId, int formType, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOnboardingFormList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@formType", SqlDbType.Int))
                 .Value = formType;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.Int))
                .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOnboardingFormDetails");
            }
            return ds;
        }

        public DataSet GetOnboardingFormDetails(int cid, string EmpId, int formType, out int result, int? formId = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOnboardingFormDetailsByHR";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@formType", SqlDbType.Int))
                .Value = formType;
                cmdObj.Parameters
               .Add(new SqlParameter("@formId", SqlDbType.Int))
                .Value = formId;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.Int))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pendingdocs";
                ds.Tables[2].TableName = "profilePhotoPath";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOnboardingFormDetails");
            }
            return ds;
        }

        public int OnboardingFormVerificationByFormId(OnboardingFormVerificationByFormId obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_OnboardingFormVerificationByFormId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@formId", SqlDbType.Int))
               .Value = obj.formId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Char))
                .Value = obj.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@remark", SqlDbType.VarChar))
                .Value = obj.remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "FinalVerificationOnboardingForm");
                result = -1;
            }
            return result;
        }

        public int FinalVerificationOnboardingForm(VerificationOnboardingForm obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_FinalVerificationOnboardingForm";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Consent", SqlDbType.Char))
                .Value = obj.Consent;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailSubject", SqlDbType.VarChar))
                .Value = obj.mailSubject;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailBody", SqlDbType.NVarChar, 1000))
                .Value = obj.mailBody;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "FinalVerificationOnboardingForm");
                result = -1;
            }
            return result;
        }

        public int FinalVerificationDay1Form(VerificationOnboardingForm obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_FinalVerificationDay1Form";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Consent", SqlDbType.Char))
                .Value = obj.Consent;
                cmdObj.Parameters
                .Add(new SqlParameter("@mailBody", SqlDbType.NVarChar, 1000))
                .Value = obj.mailBody;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "FinalVerificationOnboardingForm");
                result = -1;
            }
            return result;
        }



        public int SaveAppoimentLetter(int cid, string filename, string Empid, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "SP_AddAppoimentLetter";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@FileName", SqlDbType.VarChar))
               .Value = filename;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveAndSentAppoimentLetter");
                result = -1;
            }
            return result;
        }

        public int SendAppoimentLetter(int cid, string Empid, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "SP_SendAppoimentLetter";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendAppoimentLetter");
                result = -1;
            }
            return result;
        }

        public DataSet GetAppoinmentLetterToCandidateMailer(int cid, string empId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendAppoinmentLetterToCandidateMailerENC";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                    .Add(new SqlParameter("@cid", SqlDbType.Int))
                    .Value = cid;
                cmdObj.Parameters
                    .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                    .Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AppoinmentLetterToCandidateMailer");
                ds = null;
            }
            return ds;
        }

        public DataSet GetAppoinmentLetterDetail(int cid, string empId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAppoinmentLetterDetail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                   .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                   .Value = empId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAppoinmentLetterDetail");
                ds = null;
            }
            return ds;
        }

        public DataSet GetEmpCreationDivision()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetEmpCreationDivision";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpCreationDivision");
            }
            return ds;
        }

        public DataSet GetEmpCategoryDetails()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetEmpCategoryDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "PIMS_GetEmpCategoryDetails");
            }
            return ds;
        }

        public DataSet GetEmpCreationLocation()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetEmpCreationLocation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpCreationLocation");
            }
            return ds;
        }

        public DataSet GetSubLocationNames(int LocationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetSubLocationNames";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@LocID", SqlDbType.Int))
                .Value = LocationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubLocationNames");
            }
            return ds;
        }

        public DataSet GetNationalityNames()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "NationalityNames";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetNationalityNames");
            }
            return ds;
        }

        public DataSet GetLegalEntityByLocation(int LocationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetLegalEntityByLocation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@loc", SqlDbType.Int))
               .Value = LocationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetLegalEntityByLocation");
            }
            return ds;
        }

        public DataSet GetEmployeeUnitforEmpCreation(int IsCreated)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetEmployeeUnitforEmpCreation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsCreation", SqlDbType.Int))
                .Value = IsCreated;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmployeeUnitforEmpCreation");
            }
            return ds;
        }

        public DataSet GetTeamPracticeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTeamPracticeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTeamPracticeList");
            }
            return ds;
        }

        public DataSet GetRelationShipNames()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRelationShipNames";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRelationShipNames");
            }
            return ds;
        }

        public DataSet GetPIMSEmpStatus(char CreateType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetEmpStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@CREATE_TYPE", SqlDbType.Char))
                .Value = CreateType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPIMSEmpStatus");
            }
            return ds;
        }

        public DataSet GetPIMSDesignation()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetDesignation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPIMSDesignation");
            }
            return ds;
        }

        public DataSet GetGradeByDesignation(int DesignationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetGradeByDesignation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@DESINGATION", SqlDbType.Int))
               .Value = DesignationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetGradeByDesignation");
            }
            return ds;
        }

        public DataSet GetPIMSDesignationNames()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetDesignationNames";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPIMSDesignationNames");
            }
            return ds;
        }

        public DataSet GetCandidateDetailsbyCid(int cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateDetailsbyCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("cid", SqlDbType.Int))
                .Value = cid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateDetailsbyCid");
            }
            return ds;
        }
        public DataSet GetAllPIMSEmployer(int @flag)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_getAllEmployer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("flag", SqlDbType.Int))
                .Value = @flag;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllPIMSEmployer");
            }
            return ds;
        }


        public int CreateEmployeeId(EmployeeCreationModel obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_Create_EmployeeId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@CID", SqlDbType.Int))
                .Value = obj.CID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionType", SqlDbType.Char))
                .Value = obj.Action_Type;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_TYPE", SqlDbType.Char))
                .Value = obj.EMP_TYPE;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_DOMAINID", SqlDbType.VarChar))
                .Value = obj.EMP_DOMAINID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_ISACTIVE", SqlDbType.Char))
                .Value = obj.EMP_ISACTIVE;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpTeamPracticeID", SqlDbType.Char))
                .Value = obj.EmpTeamPracticeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpTeamPracticeDate", SqlDbType.DateTime))
                .Value = obj.EmpTeamPracticeDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_FIRSTNAME", SqlDbType.VarChar))
                .Value = obj.EMP_FIRSTNAME;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_LASTNAME", SqlDbType.VarChar))
               .Value = obj.EMP_LASTNAME;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_MIDDLENAME", SqlDbType.VarChar))
               .Value = obj.EMP_MIDDLENAME;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_DOB", SqlDbType.DateTime))
               .Value = obj.EMP_DOB;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_GENDER", SqlDbType.VarChar))
               .Value = obj.EMP_GENDER;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_DATEOFJOINING", SqlDbType.DateTime))
              .Value = obj.EMP_DATEOFJOINING;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_EFFECTIVEFROM", SqlDbType.DateTime))
              .Value = obj.EMP_EFFECTIVEFROM;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_CONTRACTENDDATE", SqlDbType.DateTime))
              .Value = obj.EMP_CONTRACTENDDATE;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_STATUS", SqlDbType.Char))
              .Value = obj.EMP_STATUS;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_CONFIRMATIONDUEDATE", SqlDbType.DateTime))
              .Value = obj.EMP_CONFIRMATIONDUEDATE;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_LOCATION_ID", SqlDbType.Int))
              .Value = obj.EMP_LOCATION_ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_SUB_LOCATION_ID", SqlDbType.Int))
              .Value = obj.EMP_SUB_LOCATION_ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@emp_location_new", SqlDbType.Int))
               .Value = obj.EMP_LOCATION_ID_New;
                cmdObj.Parameters
               .Add(new SqlParameter("@emp_subLocation_new", SqlDbType.Int))
              .Value = obj.EMP_SUB_LOCATION_ID_New;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_DESIGNATION_CODE", SqlDbType.Int))
              .Value = obj.EMP_DESIGNATION_CODE;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_GRADEID", SqlDbType.Int))
             .Value = obj.EMP_GRADEID;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_INDEXP_YRS", SqlDbType.Int))
             .Value = obj.EMP_INDEXP_YRS;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_INDEXP_MTH", SqlDbType.Int))
             .Value = obj.EMP_INDEXP_MTH;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_MAILID", SqlDbType.VarChar))
             .Value = obj.EMP_MAILID;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_NOTICEPERIODDAYS", SqlDbType.Int))
              .Value = obj.EMP_NOTICEPERIODDAYS;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_UPLOADPHOTO", SqlDbType.VarChar))
              .Value = obj.UploadProfilePic;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_MODIFIEDBY", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_LEAVE_POLICY", SqlDbType.Int))
               .Value = obj.EMP_LEAVE_POLICY;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_DESCRIPTION", SqlDbType.VarChar))
              .Value = obj.EMP_DESCRIPTION;
                cmdObj.Parameters
              .Add(new SqlParameter("@JOBTITLE_EFFECTIVEDATE", SqlDbType.DateTime))
              .Value = obj.JOBTITLE_EFFECTIVEDATE;
                cmdObj.Parameters
              .Add(new SqlParameter("@DesignationId", SqlDbType.Int))
              .Value = obj.DesignationId;
                cmdObj.Parameters
              .Add(new SqlParameter("@IsBootCamp", SqlDbType.Char))
              .Value = obj.IsBootCamp;
                cmdObj.Parameters
              .Add(new SqlParameter("@TraineeType", SqlDbType.Char))
              .Value = obj.TraineeType;
                cmdObj.Parameters
              .Add(new SqlParameter("@ContractorPayType", SqlDbType.Char))
              .Value = obj.ContractorPayType;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_TRAINEEENDDATE", SqlDbType.DateTime))
              .Value = obj.EMP_TRAINEEENDDATE;
                cmdObj.Parameters
              .Add(new SqlParameter("@Emp_LegalEntity", SqlDbType.Int))
              .Value = obj.Emp_LegalEntity;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_Horizontal", SqlDbType.Int))
              .Value = obj.EMP_Horizontal;
                cmdObj.Parameters
              .Add(new SqlParameter("@Emp_DeliveryStatus", SqlDbType.Int))
              .Value = obj.Emp_DeliveryStatus;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_VendorID", SqlDbType.Int))
              .Value = obj.EMP_VendorID;
                cmdObj.Parameters
              .Add(new SqlParameter("@EMP_DOJ_BSIL", SqlDbType.DateTime))
              .Value = obj.EMP_DOJ_BSIL;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpRM", SqlDbType.VarChar))
              .Value = obj.EmpRM;
                cmdObj.Parameters
                .Add(new SqlParameter("@Emp_EmployerId", SqlDbType.Int))
                .Value = obj.Emp_EmployerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmrContactNo", SqlDbType.VarChar))
                .Value = obj.EmrContactNo;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmrContactPersonName", SqlDbType.VarChar))
              .Value = obj.EmrContactPersonName;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmrContactPersonRelation", SqlDbType.Int))
               .Value = obj.EmrContactPersonRelation;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_IsPepApplicable", SqlDbType.Char))
               .Value = obj.EMP_IsPepApplicable;
                cmdObj.Parameters
               .Add(new SqlParameter("@EMP_COUNTRY", SqlDbType.Int))
                .Value = obj.EMP_COUNTRY;
                cmdObj.Parameters
                .Add(new SqlParameter("@baseEmployer", SqlDbType.Int))
               .Value = obj.baseEmployer;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMP_STAFFIDP", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@EMP_STAFFIDP"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CreateEmployeeId");
                result = -1;
            }
            return result;
        }

        public void AddNewEmployeeDetails_leave(string EMPLOYEE_ID, string FLAG, string CreateBy, string DLG_APPROVEID, int DLG_APPLICATIONID, int DLG_APPLICATIONID2, int DLG_APPLICATIONID3)
        {
            try
            {
                OpeneConnection();
                string _sql = "PIMS_NewEmployeeTransaction";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMPLOYEE_ID", SqlDbType.VarChar))
                .Value = EMPLOYEE_ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@FLAG", SqlDbType.Char))
                .Value = FLAG;
                cmdObj.Parameters
               .Add(new SqlParameter("@CreateBy", SqlDbType.VarChar))
               .Value = CreateBy;
                cmdObj.Parameters
               .Add(new SqlParameter("@DLG_APPROVEID", SqlDbType.VarChar))
               .Value = DLG_APPROVEID;
                cmdObj.Parameters
               .Add(new SqlParameter("@DLG_APPLICATIONID", SqlDbType.Int))
                .Value = DLG_APPLICATIONID;
                cmdObj.Parameters
                .Add(new SqlParameter("@DLG_APPLICATIONID2", SqlDbType.Int))
                .Value = DLG_APPLICATIONID2;
                cmdObj.Parameters
               .Add(new SqlParameter("@DLG_APPLICATIONID3", SqlDbType.Int))
               .Value = DLG_APPLICATIONID3;
                du.ExecuteSqlProcedure(cmdObj);
                // result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddNewEmployeeDetails_leave");
            }
        }

        public void UploadImageOnEmployeeCreation(string EMPLOYEE_ID, string ProfileName)
        {
            try
            {
                OpeneConnection();
                string _sql = "PIMS_UploadImageOnEmpCreation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EMPLOYEE_ID", SqlDbType.VarChar))
                .Value = EMPLOYEE_ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@imagePath", SqlDbType.VarChar))
                .Value = ProfileName;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UploadImageOnEmployeeCreation");
            }
        }
        public DataSet GetHorizontalDepartment(int EmpUnit)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIM_GetHorizontalDepartment";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpUnit", SqlDbType.Int))
                 .Value = EmpUnit;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetHorizontalDepartment");
            }
            return ds;
        }

        public DataSet GetReportingManagerBYGrade(int GradeId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetEmployeesList_byGrade";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@GradeID", SqlDbType.Int))
                 .Value = GradeId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReportingManagerBYGrade");
            }
            return ds;
        }

        public int SaveSignatureInternalUser(signatureSave model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SaveSignatureInternalUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@signFileName", SqlDbType.VarChar))
                .Value = model.signFileName;
                cmdObj.Parameters
               .Add(new SqlParameter("@signFilePath", SqlDbType.NVarChar))
               .Value = model.signFilePath;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveCandidateSignature");
                result = -1;
            }
            return result;
        }

        public DataSet GetSignatureInternalUser(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetSignatureInternalUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                 .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSignatureInternalUser");
            }
            return ds;
        }

        public int HrSignatureOnForms(HrSignatureOnForms model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_HrSignatureOnForms";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@FormId", SqlDbType.Int))
               .Value = model.FormId;
                cmdObj.Parameters
               .Add(new SqlParameter("@SignatureFileName", SqlDbType.VarChar))
               .Value = model.signFileName;
                cmdObj.Parameters
              .Add(new SqlParameter("@SignatureFilePath", SqlDbType.VarChar))
              .Value = model.signFilePath;
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "HrSignatureOnForms");
                result = -1;
            }
            return result;
        }


        public int uploadDocuments(UploadOnboardFormDocs model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UploadOnboardFormDocuments";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@documentName", SqlDbType.VarChar))
                .Value = model.documentName;
                cmdObj.Parameters
               .Add(new SqlParameter("@documentPath", SqlDbType.VarChar))
               .Value = model.documentPath;
                cmdObj.Parameters
              .Add(new SqlParameter("@joiningLocation ", SqlDbType.Int))
              .Value = model.joiningLocation;
                cmdObj.Parameters
            .Add(new SqlParameter("@divisionId", SqlDbType.Int))
            .Value = model.divisionId;
                cmdObj.Parameters
              .Add(new SqlParameter("@candidateType", SqlDbType.Int))
              .Value = model.candidateType;
                cmdObj.Parameters
             .Add(new SqlParameter("@formId", SqlDbType.Int))
             .Value = model.formId;
                cmdObj.Parameters
              .Add(new SqlParameter("@onboardingMode", SqlDbType.Char))
              .Value = model.onboardingMode;
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "uploadOnboardFormDocuments");
                result = -1;
            }
            return result;
        }

        public int UploadHRDocuments(UploadMandateHRDocuments model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UploadJoiningMandateHRDocs";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = model.CId;
                cmdObj.Parameters
                .Add(new SqlParameter("@documentName", SqlDbType.VarChar))
                .Value = model.documentName;
                cmdObj.Parameters
               .Add(new SqlParameter("@documentPath", SqlDbType.VarChar))
               .Value = model.documentPath;
                cmdObj.Parameters
              .Add(new SqlParameter("@documenttype", SqlDbType.Char))
              .Value = model.documentType;
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UploadHRDocuments");
                result = -1;
            }
            return result;
        }


        public DataSet GetOnboardFormDocuments(int formId, int joiningLocation, int divisionId, char onboardingMode, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOnboardFormDocuments";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                 .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningLocation ", SqlDbType.Int))
               .Value = joiningLocation;
                cmdObj.Parameters
                .Add(new SqlParameter("@divisionId", SqlDbType.Int))
                .Value = divisionId;
                cmdObj.Parameters
             .Add(new SqlParameter("@formId", SqlDbType.Int))
             .Value = formId;
                cmdObj.Parameters
            .Add(new SqlParameter("@onboardingMode", SqlDbType.Char))
            .Value = onboardingMode;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOnboardFormDocuments");
            }
            return ds;
        }
        public int SendOfferLetterMailer(int cid, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendOfferLetterToBharatiAndTeamMailer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "HrSignatureOnForms");
                result = -1;
            }
            return result;
        }

        public DataSet GetNewLocation(int LocationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetLocationNames";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                .Value = LocationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetNewLocation");
            }
            return ds;
        }

        public DataSet GetSubLocationNew(int locationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetSubLocationNames_New";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@LocID", SqlDbType.Int))
                .Value = locationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubLocationNew");
            }
            return ds;
        }

        public DataSet GetVendor()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "PIMS_GetVendor";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVendor");
            }
            return ds;
        }

        public DataSet GetEmpCreationDefaultDetails(int CID, string Empid, out int result)
        {
            DataSet ds = new DataSet();
            result= 0;
            try
            {
                OpeneConnection();
                string _sql = "getEmpCreationDefaultDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@CID", SqlDbType.Int))
               .Value = CID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = Empid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpCreationDefaultDetails");
            }
            return ds;
        }

        public int SendIdCardDetailsToAdmin(int cid, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendIdCardDetailsToAdmin";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendIdCardDetailsToAdmin");
                result = -1;
            }
            return result;
        }

        public int SendAccountDetailsLinkToCandidate(int cid, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendAccountDetailsLinkToCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendAccountDetailsLinkToCandidate");
                result = -1;
            }
            return result;
        }

        public int VerifyPendingDocument(VerifyPendingDocument obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_verifyPendingDocument";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("id", SqlDbType.Int))
               .Value = obj.id;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Char))
                .Value = obj.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@remark", SqlDbType.VarChar))
                .Value = obj.remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "VerifyPendingDocument");
                result = -1;
            }
            return result;
        }

        public JoiningItineraryList GetJoiningItineraryList(int LocationId, string EmpId, out int result)
        {
            JoiningItineraryList rd = new JoiningItineraryList();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetJoiningItineraryList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("locationId", SqlDbType.Int))
                 .Value = LocationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = EmpId; SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);               
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd = (JoiningItineraryList)RepositryMapper.getMap<JoiningItineraryList>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJoiningItineraryList");
            }
            return rd;
        }

        public DataSet GetCandidateListByJoiningDate(int LocationId, string InviteDate, string EmpId, out int result)
        {
            DataSet rd = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateListByJoiningDate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                 .Value = LocationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@InviteDate", SqlDbType.VarChar))
                .Value = InviteDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                rd = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListByJoiningDate");
            }
            return rd;
        }

        public int AddUpdateDay1InductionInviteDetails(Day1InductionInviteDetails model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateDay1InductionInviteDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@CandidateEmpIds", SqlDbType.NVarChar))
                .Value = model.CandidateEmpIds;
                cmdObj.Parameters
               .Add(new SqlParameter("@JoiningDate", SqlDbType.VarChar))
               .Value = model.JoiningDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@InviteDate", SqlDbType.VarChar))
              .Value = model.InviteDate;
                cmdObj.Parameters
             .Add(new SqlParameter("@LocationId", SqlDbType.Int))
             .Value = model.locationId;
                cmdObj.Parameters
              .Add(new SqlParameter("@InductionInvite", SqlDbType.Structured))
              .Value = ToDataTable<Day1InductionInvites>(model.Day1InductionInvites);
                cmdObj.Parameters
              .Add(new SqlParameter("@InductionInviteSpoc", SqlDbType.Structured))
              .Value = ToDataTable<Day1InductionInviteSpoc>(model.Day1InductionInviteSpoc);
                cmdObj.Parameters
             .Add(new SqlParameter("@InductionInviteCandidate", SqlDbType.Structured))
             .Value = ToDataTable<Day1InductionInviteSpoc>(model.InductionInviteCandidate);
                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateDay1InductionInviteDetails");
                result = -1;
            }
            return result;
        }

        public Day1InductionInviteMeetingInfo GetDay1InductionInviteDetails(int LocationId, string InviteDate, string EmpId, out int result)
        {
            Day1InductionInviteMeetingInfo rd = new Day1InductionInviteMeetingInfo();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetDay1InductionInviteDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                 .Value = LocationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@InviteDate", SqlDbType.VarChar))
                .Value = InviteDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd = (Day1InductionInviteMeetingInfo)RepositryMapper.getMap<Day1InductionInviteMeetingInfo>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDay1InductionInviteDetails");
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
        public void UpdateCalendarIDDay1InductionInvite(int Id, string ICalUId, string Msteamlink, string MSTeamMeetingId, string Empid)
        {
            try
            {
                OpeneConnection();
                string _sql = "UpdateCalendarIDDay1InductionInvite";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = Id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@iCalUId", SqlDbType.NVarChar))
                 .Value = ICalUId;
                cmdObj.Parameters
                .Add(new SqlParameter("@msteamlink", SqlDbType.NVarChar))
                .Value = Msteamlink;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@MSTeamMeetingId", SqlDbType.NVarChar))
               .Value = MSTeamMeetingId;

                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveCalenderId");
            }
        }

        public int AddEmployeeVideoMatchDetails(CandidateIdentificationByHR model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddEmployeeVideoMatchDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpIsConsent", SqlDbType.Char))
                .Value = model.IsConsent;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpFileNameVideo", SqlDbType.VarChar))
                .Value = model.FileNameVideo;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpFilePathVideo", SqlDbType.NVarChar))
               .Value = model.FilePathVideo;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpsharePointIdVideo", SqlDbType.NVarChar))
              .Value = model.sharePointIdVideo;
                cmdObj.Parameters
              .Add(new SqlParameter("@Empremarks", SqlDbType.NVarChar))
              .Value = model.remarks;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpvideoMatchPercent", SqlDbType.Decimal))
              .Value = model.videoMatchPercent;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpvideoMatch", SqlDbType.Char))
               .Value = model.videoMatch;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OnboardingMode", SqlDbType.Int))
                 .Value = model.OnboardingMode;
                cmdObj.Parameters
              .Add(new SqlParameter("@Type", SqlDbType.VarChar))
              .Value = model.type;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddEmployeeVideoMatchDetails");
                result = -1;
            }
            return result;
        }
        public DataSet GenerateOnboardPdf(int FormId, int cid, string EmpId, out int result)
        {
            DataSet rd = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetPDFforOnboard";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@formid", SqlDbType.Int)).Value = FormId;
                cmdObj.Parameters.Add(new SqlParameter("@cid", SqlDbType.Int)).Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);                
                rd = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GenerateOnboardPdf");
            }
            return rd;
        }

        public void UpdatePdfNamePathOnboard(int cid, int FormId, string PdfName, string PdfPath)
        {
            try
            {
                OpeneConnection();
                string _sql = "sp_addpdfNamePath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@FormId", SqlDbType.Int))
               .Value = FormId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PdfName", SqlDbType.NVarChar))
               .Value = PdfName;
                cmdObj.Parameters
                .Add(new SqlParameter("@PdfPath", SqlDbType.NVarChar))
               .Value = PdfPath;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePdfNamePathOnboard");
            }

        }

        public int SendEmailtoITTeamEmployeeVideoFail(CandidateIdentificationByHR model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_SendEmailtoITTeamEmployeeVideoFail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@VideoMatchPercent", SqlDbType.Decimal))
                .Value = model.videoMatchPercent;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendEmailtoITTeamEmployeeVideoFail");
                result = -1;
            }
            return result;
        }

        public int Save_RptAccessUsers(string DomainId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "PIMS_AddRPT_ACCESS_USERS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@USERNAME", SqlDbType.VarChar))
               .Value = DomainId;
                cmdObj.Parameters
               .Add(new SqlParameter("@USERID", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@USERID"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "Save_RptAccessUsers");
                result = -1;
            }
            return result;
        }

        public int Save_EmployeeAccessRoles(int UserId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "PIMS_Add_RPT_EMPLOYEE_ACCESS_ROLES";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@UserId", SqlDbType.Int))
               .Value = UserId;
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "Save_EmployeeAccessRoles");
                result = -1;
            }
            return result;
        }

        public DataSet getPIMSGender()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getPIMSGender";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPIMSGender");
            }
            return ds;
        }

        public int GetNumberOfJoinedCandidates(int cid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetNumberOfJoinedCandidates";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@CID", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetNumberOfJoinedCandidates");
                result = -1;
            }
            return result;
        }

        public DataSet GetOnboardCandidateVerificationReport([FromBody] RMHRReportFilters obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOnboardCandidateVerificationReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.PageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRMandPMReport");
            }
            return ds;
        }

        public int updateCandidateOnboardingMode(int cid, char onboardingMode, string Empid, ref string Message, string remarks)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateCandidateOnboardingMode";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
             .Add(new SqlParameter("@cid", SqlDbType.Int))
             .Value = cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@onboardingMode", SqlDbType.Char))
                 .Value = onboardingMode;
                cmdObj.Parameters
               .Add(new SqlParameter("@remarks", SqlDbType.NVarChar, 1000))
               .Value = remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = Empid;

                du.ExecuteSqlProcedure(cmdObj);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateCandidateOnboardingMode");
                result = -1;
            }
            return result;
        }

        public DataSet GetUploadedDocById(int Id, string userId, char Type)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetUploadedbDocById";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserId", SqlDbType.VarChar))
                .Value = userId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = Id;
                cmdObj.Parameters
                .Add(new SqlParameter("@FormType", SqlDbType.Char))
                .Value = Type;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "downloadUploadedDocById");
            }
            return ds;
        }

        // Added by jivan for resume path for murcurrecy

        public DataSet GetResumePathForCandidate(int Cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidateResumePath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = Cid;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetResumePathForCandidate");
            }
            return ds;
        }


        // Added by jivan but already added by prabhat 
        public DataSet GetCandidateLocationDivision(int Cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateLocationDivision";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = Cid;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetResumePathForCandidate");
            }
            return ds;
        }



        // PDF for EAF
        public DataSet GetPDFforEAF_Form_NewRequirement()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                //string _sql = "GetPDFforEAF_Form";
                string _sql = "GetPDFforEAF_Form_NewRequirement";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPDFforEAF_Form");
            }
            return ds;
        }



        // Added by jivan for EAF pdf only Educational details
        public DataSet getCandidateEducationalDetails(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result=0;
            try
            {
                OpeneConnection();
                string _sql = "getOnboardCandidateEductionDetailsByCidForEAF_Pdf";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@empid", SqlDbType.VarChar))
              .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "EDUCATION";
                ds.Tables[1].TableName = "TRAINING";
                ds.Tables[2].TableName = "EMPLOYMENT";
                ds.Tables[3].TableName = "FamilyMember";
                ds.Tables[4].TableName = "CurrentJob";
                ds.Tables[5].TableName = "Questionire";
                ds.Tables[6].TableName = "Reference";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getOnboardCandidateEductionDetailsByCidForEAF_Pdf");
            }
            return ds;
        }

        public DataSet GetPendingDocReport([FromBody] OnBoardModelPending obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOnboardingPendingDoc";
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
                .Add(new SqlParameter("@dateofJoiningStart", SqlDbType.NVarChar))
                .Value = obj.DateOfjoiningStart;
                cmdObj.Parameters
                .Add(new SqlParameter("@dateofJoiningend", SqlDbType.NVarChar))
                .Value = obj.DateOfjoiningEnd;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelWiseReportNew");
            }
            return ds;
        }

        public DataSet GetPathInfoForUploadDocOnMurcury(int cid, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetPathInfoForUploadDocOnMurcury";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPathInfoForUploadDocOnMurcury");
                ds = null;
            }
            return ds;
        }


        public DataSet GetPathInfoForUploadAcceptanceOffer(int cid, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetPathInfoForUploadAcceptanceOffer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPathInfoForUploadAcceptanceOffers");
                ds = null;
            }
            return ds;
        }

        public int ResendDay1DocToCandidate(int cid, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ResendDay1DocToCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ResendDay1DocToCandidate");
                result = -1;
            }
            return result;
        }

        public int Mailersendforcandidatestatus(Mailersendforcandidatestatus obj, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Mailersendforcandidatestatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@location", SqlDbType.Int))
                .Value = obj.locationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@dayofjoining", SqlDbType.VarChar))
                .Value = obj.dateOfJoining;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "Mailersendforcandidatestatus");
                result = -1;
            }
            return result;
        }

        public int UpdateCandidateJoiningStatus(UpdateCandidsateJoiningStatus obj, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateCandidateJoiningStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = obj.Status;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "Mailersendforcandidatestatus");
                result = -1;
            }
            return result;
        }

        public DataSet GetJoiningItineraryToCandidateMailer(int cid, string empId)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "SendJoiningItenaryOnOfferRevisionENC";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
             .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
             .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AppoinmentLetterToCandidateMailer");
                ds = null;
            }
            return ds;
        }

        public DataSet GetEnableDisableOnboardingFormMailer(int cid, string empId = null, string formid = null)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "EnableDisableOnboardingFormMailerENC";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@FormId", SqlDbType.NVarChar))
                .Value = formid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEnableDisableOnboardingFormMailer");
                ds = null;
            }
            return ds;
        }
        public int ResendOnboardingFormMailer(int cid, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ResendOnboardingFormMailer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ResendOnboardingFormMailer");
                result = -1;
            }
            return result;
        }

        public DataSet SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange(int cid, string empId, int changeType)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "SendJoiningItenaryOnOnboardModeChange";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@changetype", SqlDbType.Int))
                .Value = changeType;
                cmdObj.Parameters
             .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
             .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange");
                ds = null;
            }
            return ds;
        }
        public DataSet getOnboadingSignaturePath(int id, char signType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getOnboadingSignaturePath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
               .Add(new SqlParameter("@type", SqlDbType.Char))
               .Value = signType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getOnboadingSignaturePath");
            }
            return ds;
        }

        public DataSet getPendingDocPath(int cid, int docId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getPendingDocPath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@docId", SqlDbType.Int))
                .Value = docId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPendingDocPath");
            }
            return ds;
        }

        public DataSet getOnboadingCommonpdfPath(int cid, int pdfid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getOnboadingCommonpdfPath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@pdfid", SqlDbType.Int))
               .Value = pdfid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getOnboadingCommonpdfPath");
            }
            return ds;
        }
    }
}