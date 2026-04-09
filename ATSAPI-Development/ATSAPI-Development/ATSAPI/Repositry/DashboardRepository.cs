using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.Models;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ATSAPI.Repositry
{
    public class DashboardRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "DashboardRepository";
        DataUtility du;

        public DashboardRepository()
        {
            du = new DataUtility();
        }

        public TotalCount getCountOfAllOpenRequisition(string EmpId, out int result)
        {
            TotalCount tc = new TotalCount();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCountOfAllOpenRequisition";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                //SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                //outputParam.Direction = ParameterDirection.Output;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (TotalCount)RepositryMapper.getMap<TotalCount>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfAllOpenRequisition");
            }
            return tc;
        }

        public Total getCountOfAllUnmapCandidate(string EmpId, out int result)
        {
            Total tc = new Total();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getTotalCountUnmapProfile";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (Total)RepositryMapper.getMap<Total>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfAllUnmapCandidate");
            }
            return tc;
        }
        public Total getCountOfAllUnmapCandidatebyProfile(string EmpId, out int result)
        {
            Total tc = new Total();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getTotalCountUnmapProfileByPId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                tc = (Total)RepositryMapper.getMap<Total>(ds);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfAllUnmapCandidatebyProfile");
            }
            return tc;
        }
        public DataSet getAllOpenRequisition(bool pagination, string empid, int limit, string searchText, out int result)
        {
            DataSet ds = new DataSet(); 
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllOpenRequisition";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pagination", SqlDbType.Int))
                 .Value = pagination;
                cmdObj.Parameters
                 .Add(new SqlParameter("@limit", SqlDbType.Int))
                 .Value = limit;
                cmdObj.Parameters
                 .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                 .Value = searchText;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOpenRequisition");
            }
            return ds;
        }

        public TotalAssignedLoCount getCountOfRequisitionForRecruiters(string EmailID, out int result)
        {
            TotalAssignedLoCount tc = new TotalAssignedLoCount();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCountOfRequisitionForRecruiters";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@emailed", SqlDbType.NVarChar))
                 .Value = EmailID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (TotalAssignedLoCount)RepositryMapper.getMap<TotalAssignedLoCount>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfRequisitionForRecruiters");
            }
            return tc;
        }

        public DataSet getRequisitionForRecruiters(string EmailID, bool offShore, int page, int pageSize, string search, int? primarySkill, int? accountId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getRequisitionForRecruiters";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@emailed", SqlDbType.NVarChar))
                 .Value = EmailID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_Offshore", SqlDbType.Bit))
                 .Value = offShore;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = search;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.Int))
              .Value = primarySkill;
                cmdObj.Parameters
               .Add(new SqlParameter("@accountId", SqlDbType.Int))
               .Value = accountId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRequisitionForRecruiters");
            }
            return ds;
        }

        public Total getCountOfProfilesBasedOnTalentID(string thid,string EmpId, out int result)
        {
            Total tc = new Total();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCountOfProfilesBasedOnTalentID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (Total)RepositryMapper.getMap<Total>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfProfilesBasedOnTalentID");
            }
            return tc;
        }

        public TotalCount getCountOfTalentIDFulfillmentAvailable(string emailID, out int result)
        {
            TotalCount tc = new TotalCount();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCountOfTalentIDFulfillmentAvailable";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@emailid", SqlDbType.NVarChar))
                 .Value = emailID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (TotalCount)RepositryMapper.getMap<TotalCount>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfTalentIDFulfillmentAvailable");
            }
            return tc;
        }

        public DataSet getFulfillmentDateBasedOnTalentID(string thid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getFulfillmentDateBasedOnTalentID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getFulfillmentDateBasedOnTalentID");
            }
            return ds;
        }

        public DataSet getResumeOfProfilesBasedOnTalentID(string thid, int page, int pageSize, string EmpId, out int result, string search)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getResumeOfProfilesBasedOnTalentID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = search;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getResumeOfProfilesBasedOnTalentID");
            }
            return ds;
        }

        public DataSet getProfileWiseCandidateCount(string thid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_get_profile_with_candidate_count";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters
             .Add(new SqlParameter("@empId", SqlDbType.NVarChar))
             .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfileWiseCandidateCount");
            }
            return ds;
        }

        public DataSet getProfileWiseUnmapCandidateCount(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_get_profile_unmap_candidate_counts";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfileWiseUnmapCandidateCount");
            }
            return ds;
        }
        public DataSet getProfileWiseUnmapCandidateCountByProfileId(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_get_profile_unmap_candidateCounts_ByprofileId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfileWiseUnmapCandidateCountByProfileId");
            }
            return ds;


        }

        public DataSet getUnMapProfileWiseCandidateListByProfileId(int ProfileID, int page, int pageSize, string search, string startDate, string endDate, string sortColumn, string sortDir, string EmpId, out int result, int? screenReject)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getProfileWiseUnmapCandidateListsByProfileid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_id", SqlDbType.Int))
                 .Value = ProfileID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
             .Value = sortColumn;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             .Value = sortDir;
                cmdObj.Parameters
                .Add(new SqlParameter("@screenRejected", SqlDbType.Int))
               .Value = screenReject;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getProfileWiseUnmapCandidateListsByProfileid");
            }
            return ds;
        }

        public int addupdateCandidateDetailsFile(candidateProfile cnd, string EmpId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_add_update_profile_wise_candidate_detail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_id", SqlDbType.Int))
                 .Value = cnd.id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_profile_id", SqlDbType.Int))
                 .Value = cnd.ProfileId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@FirstName", SqlDbType.NVarChar))
                 .Value = cnd.FirstName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@MiddleName", SqlDbType.NVarChar))
                 .Value = cnd.MiddleName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LastName", SqlDbType.NVarChar))
                 .Value = cnd.LastName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_email", SqlDbType.NVarChar))
                 .Value = cnd.Email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_mobile_number", SqlDbType.VarChar))
                 .Value = cnd.MobileNumber;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_primary_skill", SqlDbType.VarChar))
                 .Value = cnd.PrimarySkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_secondary_skill", SqlDbType.VarChar))
                 .Value = cnd.SecondarySkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_total_experience", SqlDbType.VarChar))
                 .Value = cnd.totalExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_total_exp_month", SqlDbType.VarChar))
                 .Value = cnd.totalExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_relevent_experience", SqlDbType.VarChar))
                 .Value = cnd.releventExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_rel_exp_month", SqlDbType.VarChar))
                .Value = cnd.relExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_status_id", SqlDbType.Int))
                 .Value = cnd.StatusId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CountryCode", SqlDbType.Int))
                 .Value = cnd.CountryCode;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_added_by", SqlDbType.VarChar))
                 .Value = cnd.AddedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.VarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_resume", SqlDbType.NVarChar))
                 .Value = cnd.Resume;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_resumePath", SqlDbType.NVarChar))
                 .Value = cnd.Path;
                cmdObj.Parameters
                     .Add(new SqlParameter("@dob", SqlDbType.NVarChar))
                     .Value = cnd.dob;
                cmdObj.Parameters
               .Add(new SqlParameter("@ApproverId", SqlDbType.NVarChar))
                 .Value = cnd.ApproverId;
                cmdObj.Parameters
               .Add(new SqlParameter("@ApproverRemarks", SqlDbType.NVarChar))
                 .Value = cnd.Remarks;
                cmdObj.Parameters
             .Add(new SqlParameter("@ReferredBy", SqlDbType.NVarChar))
               .Value = cnd.ReferredById;
                cmdObj.Parameters
             .Add(new SqlParameter("@Partner", SqlDbType.NVarChar))
               .Value = cnd.PartnerId;
                cmdObj.Parameters
             .Add(new SqlParameter("@Link", SqlDbType.NVarChar))
               .Value = cnd.Link;
                cmdObj.Parameters
           .Add(new SqlParameter("@IsResend", SqlDbType.Char))
             .Value = cnd.IsResend;
                cmdObj.Parameters
          .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
            .Value = cnd.IsFromNaukriAPI;
              cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addupdateCandidateDetailsFile");
                result = -1;
            }
            return result;
        }

        public DataSet SendProfileForApprovalMailer(int id,string empId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTempProfileForApprovalMailer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@id", SqlDbType.Int))
                 .Value = id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                // ds= du.ExecuteSqlProcedure(cmdObj);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendProfileForApprovalMailer");
                ds = null;
            }
            return ds;
        }


        public int updateUnMapCandidateProfileDetails(candidateProfile cnd)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_update_unmap_profile_candidate_detail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_id", SqlDbType.Int))
                 .Value = cnd.id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_profile_id", SqlDbType.Int))
                 .Value = cnd.ProfileId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_added_by", SqlDbType.VarChar))
                 .Value = cnd.AddedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.VarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_remarks", SqlDbType.VarChar))
                 .Value = cnd.Remarks;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateUnMapCandidateProfileDetails");
                result = -1;
            }
            return result;
        }

        public DataSet getProfileWiseCandidateList(int ProfileID, string thid, int page, int pageSize, string search, string EmpId, out int result, char? Type = 'N', int? RatingMin = 0, int? RatingMax = 0, char? ISFromNaukri = null, DateTime? startDate = null, DateTime? endDate = null )
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getProfileWiseCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_id", SqlDbType.Int))
                .Value = ProfileID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Type", SqlDbType.Char))
                 .Value = Type;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                .Value = thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pageSize;
                cmdObj.Parameters
               .Add(new SqlParameter("@ISFromNaukri", SqlDbType.Char))
               .Value = ISFromNaukri;
                cmdObj.Parameters
               .Add(new SqlParameter("@startDate", SqlDbType.DateTime))
               .Value = startDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@endDate", SqlDbType.DateTime))
               .Value = endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                  cmdObj.Parameters
                .Add(new SqlParameter("@RatingScoreMin", SqlDbType.Int))
                .Value = RatingMin;
                cmdObj.Parameters
               .Add(new SqlParameter("@RatingScoreMax", SqlDbType.Int))
               .Value = RatingMax;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getProfileWiseCandidateList");
            }
            return ds;
        }
        public int DeleteCandidateDetails(int CandidateId, string DeletedBy)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_deleteCandidateDetail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_candidate_id", SqlDbType.Int))
                 .Value = CandidateId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_deleted_by", SqlDbType.VarChar))
                 .Value = DeletedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DeleteCandidateDetails");
                result = -1;
            }
            return result;
        }


        public DataSet getRequisitionByThid(string thid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getRequisitionTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRequisitionByThid");
            }
            return ds;
        }

        public DataSet getAllOpenRequisitionDetails(OpenPositionFilter obj, string empid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getAllOpenRequisitionDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                 .Value = empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offShore", SqlDbType.Bit))
                 .Value = obj.Offshore;
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
                .Add(new SqlParameter("@Filter", SqlDbType.NVarChar))
                .Value = obj.Filter;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar))
              .Value = obj.skillId;
                cmdObj.Parameters
               .Add(new SqlParameter("@accountId", SqlDbType.NVarChar))
               .Value = obj.accountId;
                cmdObj.Parameters
               .Add(new SqlParameter("@HMId", SqlDbType.NVarChar))
               .Value = obj.HMId;
                cmdObj.Parameters
              .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar))
              .Value = obj.recruiterId;
                cmdObj.Parameters
              .Add(new SqlParameter("@accountHeadId", SqlDbType.VarChar))
              .Value = obj.accountHeadId;
                cmdObj.Parameters
             .Add(new SqlParameter("@location", SqlDbType.VarChar))
             .Value = obj.location;
                cmdObj.Parameters
              .Add(new SqlParameter("@designationId", SqlDbType.VarChar))
              .Value = obj.designationId;
                cmdObj.Parameters
              .Add(new SqlParameter("@RequirementType", SqlDbType.NVarChar))
              .Value = obj.requisitionType;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOpenRequisitionDetails");
            }
            return ds;
        }

        /**
        * Develop By Ayat
        * **/
        public Total getCountOfAllUnusedCskillProfile(string thid, string EmpId, out int result, int? uniq)
        {
            Total tc = new Total();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getUnusedCskillProfileCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                .Value = thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@uniq", SqlDbType.NVarChar))
               .Value = uniq;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (Total)RepositryMapper.getMap<Total>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountOfAllUnusedCskillProfile");
            }
            return tc;
        }

        /**
      * Develop By Ayat
      * **/
        public DataSet getListOfAllUnusedCskillProfile(CSkillFilterModel obj, string empID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getUnusedCskillProfileList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = obj.thid;
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
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@recruiterID", SqlDbType.VarChar))
              .Value = obj.recruiterId;
                cmdObj.Parameters
                .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
              .Value = obj.sortColumn;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             .Value = obj.sortDir;
                cmdObj.Parameters
                .Add(new SqlParameter("@empID", SqlDbType.VarChar))
               .Value = empID;
                cmdObj.Parameters
               .Add(new SqlParameter("@screenRejected", SqlDbType.Int))
              .Value = obj.screenReject;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NPMax", SqlDbType.Int))
                 .Value = obj.NPMax;
                cmdObj.Parameters
               .Add(new SqlParameter("@MinExp", SqlDbType.VarChar))
             .Value = obj.MinExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@MaxExp", SqlDbType.VarChar))
               .Value = obj.MaxExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@skillId", SqlDbType.VarChar))
              .Value = obj.skillId;
                cmdObj.Parameters
                .Add(new SqlParameter("@LocationId", SqlDbType.NVarChar, 2000))
                .Value = obj.location;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar, 2000))
                 .Value = obj.accountId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Country", SqlDbType.NVarChar))
                 .Value = obj.country;
                cmdObj.Parameters
                .Add(new SqlParameter("@orgName", SqlDbType.NVarChar))
                .Value = obj.orgName;
                 cmdObj.Parameters
                 .Add(new SqlParameter("@RatingScoreMin", SqlDbType.Int))
                 .Value = obj.RatingMin;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RatingScoreMax", SqlDbType.Int))
                 .Value = obj.RatingMax;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getListOfAllUnusedCskillProfile");
            }
            return ds;
        }

        public int transferCskillUnusedCandidateRecord(candidateProfile cnd)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateUnusedCskillCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = cnd.id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                 .Value = cnd.AddedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                 .Value = cnd.Remarks;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "transferCskillUnusedCandidateRecord");
                result = -1;
            }
            return result;
        }

        public DataSet getAllOpenRequisitionForTransfer(bool pagination, string empid, int limit, string searchText, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllOpenRequisitionForTransfer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pagination", SqlDbType.Int))
                 .Value = pagination;
                cmdObj.Parameters
                 .Add(new SqlParameter("@limit", SqlDbType.Int))
                 .Value = limit;
                cmdObj.Parameters
                 .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                 .Value = searchText;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOpenRequisitionForTransfer");
            }
            return ds;
        }

        public int CskillProfileScreenReject(string id, int screenRejected, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_screenRejectCskillCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@screenRejected", SqlDbType.Int))
                .Value = screenRejected;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = id;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CskillProfileScreenReject");
                result = -1;
            }
            return result;
        }

        public int unmapEmpRefProfileScreenReject(string id, int screenRejected, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_screenRejectUnmapEmpRefCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@screenRejected", SqlDbType.Int))
                .Value = screenRejected;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@updated_by", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = id;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "unmapEmpRefProfileScreenReject");
                result = -1;
            }
            return result;
        }

        public DataSet getDeliveryWiseReport(DashboardFilter obj, out int result, string EmpID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getDeliveryWiseReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getDeliveryWiseReport");
            }
            return ds;
        }


        public DataSet getDeliveryWiseReportDetails(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getDeliveryWiseReportDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
               .Add(new SqlParameter("@DUID", SqlDbType.VarChar))
               .Value = obj.ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.NVarChar, 2000))
                  .Value = obj.accountId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getDeliveryWiseReport");
            }
            return ds;
        }

        public DataSet getDUTHIDWiseCount(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getDUTHIDWiseCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@DUID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getBUTHIDWiseCount");
            }
            return ds;
        }


        public DataSet getBUHeadWiseDetails(DashboardFilter obj, out int result,string EmpID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getBUHeadWiseDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getBUHeadWiseDetails");
            }
            return ds;
        }

        public DataSet getBUHeadWiseCandidateDetails(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getBUHeadWiseCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
                .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@BUID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.NVarChar, 2000))
                  .Value = obj.accountId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getBUHeadWiseCandidateDetails");
            }
            return ds;
        }


        //public DataSet getBUTHIDWiseCount(string EmpID, string BUID, string ColumnType)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        OpeneConnection();
        //        string _sql = "getBUTHIDWiseCount";
        //        cmdObj = new SqlCommand(_sql, ConCampus);
        //        cmdObj.CommandType = CommandType.StoredProcedure;

        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
        //        .Value = EmpID;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@BUID", SqlDbType.VarChar))
        //        .Value = BUID;
        //        cmdObj.Parameters
        //       .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
        //       .Value = ColumnType;
        //        ds = du.GetDataSetWithProc(cmdObj);
        //        ds.Tables[0].TableName = "data";

        //        CloseConnection();
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, sectionName, "getBUTHIDWiseCount");
        //    }
        //    return ds;
        //}

        public DataSet getBUTHIDWiseCount(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getBUTHIDWiseCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@BUID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getBUTHIDWiseCount");
            }
            return ds;
        }


        public DataSet getAccountOwnerWiseDetails(DashboardFilter obj, out int result, string EmpID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAccountOwnerWiseDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAccountOwnerWiseDetails");
            }
            return ds;
        }

        public DataSet getAccountOwnerWiseCandidateDetails(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAccountOwnerWiseCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
                .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAccountOwnerWiseCandidateDetails");
            }
            return ds;
        }

        public DataSet getAccountTHIDWiseCount(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAccountTHIDWiseCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAccountTHIDWiseCount");
            }
            return ds;
        }

        public DataSet getPMWiseDetails(DashboardFilter obj, out int result, string EmpID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPMWiseDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPMWiseDetails");
            }
            return ds;
        }

        public DataSet getPMWiseCandidateDetails(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPMWiseCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
                .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProjectID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPMWiseCandidateDetails");
            }
            return ds;
        }

        public DataSet getPMTHIDWiseCount(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPMTHIDWiseCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProjectID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPMTHIDWiseCount");
            }
            return ds;
        }

        public DataSet getHiringManagerWiseTHIDsDetails(DashboardFilter obj, out int result, string EmpID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getHiringManagerWiseTHIDsDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                 .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getHiringManagerWiseTHIDsDetails");
            }
            return ds;
        }

        public DataSet getHMTHIDWiseCount(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getHMTHIDWiseCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@HMID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
               .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getHMTHIDWiseCount");
            }
            return ds;
        }

        public DataSet getHiringManagerWiseCandidateDetails(string EmpID, DashboardFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getHiringManagerWiseCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@ColumnType", SqlDbType.VarChar))
              .Value = obj.ColumnType;
                cmdObj.Parameters
                .Add(new SqlParameter("@HMID", SqlDbType.VarChar))
                .Value = obj.ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentCreatedOnStartDate", SqlDbType.VarChar))
                .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@talentCreatedOnEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@markToExternalHiringStartDate", SqlDbType.VarChar))
                .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@markToExternalHiringEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.NVarChar, 2000))
                  .Value = obj.accountId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getHiringManagerWiseCandidateDetails");
            }
            return ds;
        }

        /**
       * Develop By Ayat
       * **/
        public Total getAllProfileCountByClosedTalentId(string EmpID, out int result)
        {
            Total tc = new Total();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllProfileCountByClosedTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.NVarChar))
                .Value = EmpID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                tc = (Total)RepositryMapper.getMap<Total>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllProfileCountByClosedTalentId");
            }
            return tc;
        }


        /**
     * Develop By Ayat
     * **/
        public DataSet getAllProfileByClosedTalentId(string thid, int page, int pageSize, string search, string startDate, string endDate, string recruiterId, string sortColumn, string sortDir, string empID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllProfileByClosedTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = search;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@recruiterID", SqlDbType.VarChar))
              .Value = recruiterId;
                cmdObj.Parameters
                .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
              .Value = sortColumn;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             .Value = sortDir;
                cmdObj.Parameters
                .Add(new SqlParameter("@empID", SqlDbType.VarChar))
               .Value = empID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllProfileByClosedTalentId");
            }
            return ds;
        }


        public int updateRequisitionDetails(updateTalentId obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateRequisitionDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thId", SqlDbType.Int))
                .Value = obj.thId;
                cmdObj.Parameters
                .Add(new SqlParameter("@prRecEmpId", SqlDbType.VarChar, 100))
                .Value = obj.prRecEmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@srRecEmpId", SqlDbType.VarChar, 100))
               .Value = obj.srRecEmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@fullfillmentDate", SqlDbType.VarChar, 200))
               .Value = obj.fullfillmentDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@tagRemarkId", SqlDbType.Int))
               .Value = obj.tagRemarkId;
                cmdObj.Parameters
               .Add(new SqlParameter("@updatedBy", SqlDbType.VarChar, 100))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateRequisitionDetails");
                result = -1;
            }
            return result;

        }

        public DataSet getAllselectedRequisition(bool pagination, string empid, int limit, string searchText, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllSelectedRequisition";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pagination", SqlDbType.Int))
                 .Value = pagination;
                cmdObj.Parameters
                 .Add(new SqlParameter("@limit", SqlDbType.Int))
                 .Value = limit;
                cmdObj.Parameters
                 .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                 .Value = searchText;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllSelectedRequisition");
            }
            return ds;
        }
        public int CandidateScreenReject(string id, string empID, ref string Message, int profileTypeId, int screenRejectReasonId,char? IsFromNaukriAPI= null ,string Remarks = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_screenRejectCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@updated_by", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = id;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
               .Value = IsFromNaukriAPI;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@profileType", SqlDbType.Int))
               .Value = profileTypeId;
                cmdObj.Parameters
             .Add(new SqlParameter("@screenRejectReason", SqlDbType.Int))
             .Value = screenRejectReasonId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateScreenReject");
                result = -1;
            }
            return result;
        }
        public int ActivateCandidate(string id, string empID, ref string Message, int profileTypeId, string Remarks ,char? IsFromNaukriAPI = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_activateCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@updated_by", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = id;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
                .Value = IsFromNaukriAPI;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
             .Add(new SqlParameter("@profileType", SqlDbType.Int))
             .Value = profileTypeId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ActivateCandidate");
                result = -1;
            }
            return result;
        }

        public DataSet GetWeekWiseHiringViews(string Year, string EmpId, out int result, string DUID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_OverAllWeekWiseHiringViews";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.NVarChar))
                 .Value = Year;
                cmdObj.Parameters
               .Add(new SqlParameter("@DU", SqlDbType.VarChar))
               .Value = DUID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetWeekWiseHiringViews");
            }
            return ds;
        }

        public DataSet GetGenderDiversityOverAllHiringViews(string Year, int Gender, string EmpId, out int result, string DUID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GenderDiversityOverAllHiringViews";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.NVarChar))
                 .Value = Year;
                cmdObj.Parameters
                .Add(new SqlParameter("@Gender", SqlDbType.NVarChar))
                .Value = Gender;
                cmdObj.Parameters
               .Add(new SqlParameter("@DU", SqlDbType.VarChar))
               .Value = DUID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetGenderDiversityOverAllHiringViews");
            }
            return ds;
        }

        public DataSet GetOfferToJoiningHiringViews(string Year, string EmpId, out int result, string DUID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_OfferToJoiningCandidates";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.NVarChar))
                 .Value = Year;
                cmdObj.Parameters
              .Add(new SqlParameter("@DU", SqlDbType.VarChar))
              .Value = DUID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferToJoiningHiringViews");
            }
            return ds;
        }

        public DataSet GetLocationWiseHiringViews(string Year, string EmpId, out int result, string DUID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_LocationWiseOverAllHiringViews";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.NVarChar))
                 .Value = Year;
                cmdObj.Parameters
               .Add(new SqlParameter("@DU", SqlDbType.VarChar))
               .Value = DUID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "SumQuatorPer";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetLocationWiseHiringViews");
            }
            return ds;
        }

        public DataSet GetSourceWiseHiringViews(string Year, string EmpId, out int result,string DUID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_SourceWiseOverAllHiringViews";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Year", SqlDbType.NVarChar))
                 .Value = Year;
                cmdObj.Parameters
               .Add(new SqlParameter("@DU", SqlDbType.VarChar))
               .Value = DUID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "SumQuatorPer";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSourceWiseHiringViews");
            }
            return ds;
        }

        public DataSet getApproverListForRenuTeam(string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getApproverListForRenuTeam";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
               .Value = EmpID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                // ds.Tables[1].TableName = "SumQuatorPer";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getApproverListForRenuTeam");
            }
            return ds;
        }

        public DataSet GetApprovalCandidateListForRenuTeam(int page, int pageSize, string EmpId, out int result, string search = "")
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetApprovalCandidateListForRenuTeam";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                 .Value = search;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovalCandidateListForRenuTeam");
            }
            return ds;
        }

        public int ApproveProfileScreening(ApproveProfileScreening body, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ApproveProfileScreening";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@Id", SqlDbType.Int))
               .Value = body.id;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Char))
                .Value = body.status;
                cmdObj.Parameters
                .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
                .Value = body.remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApproveProfileScreening");
                result = -1;
            }
            return result;
        }

        public DataSet GetProfileApprovalStatus(string EmpId, int Id, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ProfileApprovalStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                 .Add(new SqlParameter("@Id", SqlDbType.Int))
                 .Value = Id;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProfileApprovalStatus");
            }
            return ds;
        }

        private DataTable ConvertToDataTable(List<CandidateProfile> list)
        {
            DataTable table = new DataTable();
            table.Columns.Add("firstName", typeof(string));
            table.Columns.Add("middleName", typeof(string));
            table.Columns.Add("lastName", typeof(string));
            table.Columns.Add("email", typeof(string));
            table.Columns.Add("countryCode", typeof(int));
            table.Columns.Add("phone", typeof(string));
            table.Columns.Add("totalExpYear", typeof(int));
            table.Columns.Add("totalExpMonth", typeof(int));
            table.Columns.Add("releventExpYear", typeof(int));
            table.Columns.Add("releventExpMonth", typeof(int));
            table.Columns.Add("skill", typeof(string));
            table.Columns.Add("additionalSkill", typeof(string));
            table.Columns.Add("dob", typeof(DateTime));
            table.Columns.Add("filename", typeof(string));
            table.Columns.Add("filePath", typeof(string));
            table.Columns.Add("selected", typeof(bool));
            table.Columns.Add("gender", typeof(int));
            table.Columns.Add("qualification", typeof(int));
            table.Columns.Add("currCompany", typeof(int));
            table.Columns.Add("joinDate", typeof(DateTime));
            table.Columns.Add("countryID", typeof(int));
            table.Columns.Add("cityID", typeof(int));
            table.Columns.Add("currencyType", typeof(int));
            table.Columns.Add("SalaryType", typeof(int));
            table.Columns.Add("currentSalary", typeof(string));
            table.Columns.Add("expectedSalary", typeof(string));
            table.Columns.Add("candidateType", typeof(int));

            foreach (var item in list)
            {
                table.Rows.Add(
                    item.FirstName, item.MiddleName, item.LastName, item.Email,
                    item.CountryCode, item.Phone, item.TotalExpYear, item.TotalExpMonth,
                    item.ReleventExpYear, item.ReleventExpMonth, item.Skill,
                    item.AdditionalSkill, item.Dob, item.filename, item.filePath, item.selected,
                    item.gender, item.qualification, item.currCompany, item.joinDate,
                    item.countryID, item.cityID, item.currencyType, item.SalaryType,
                    item.currentSalary, item.expectedSalary, item.candidateType
                );
            }

            return table;
        }


        public int AddMultipleProfiles(List<CandidateProfile> profiles, string CreatedBy, int StatusId, int ProfileId, int thid, int candidateId, out string message, out List<InsertedProfileResult> insertedProfiles)
        {
            int result = 0;
            message = string.Empty;
            insertedProfiles = new List<InsertedProfileResult>();

            try
            {
                OpeneConnection();

                DataTable candidateTable = ConvertToDataTable(profiles);

                SqlCommand cmdObj = new SqlCommand("addmultiprofiles", ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@candidateId", SqlDbType.Int))
              .Value = candidateId;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = CreatedBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusId", SqlDbType.VarChar))
              .Value = StatusId;
                cmdObj.Parameters
              .Add(new SqlParameter("@ProfileId", SqlDbType.VarChar))
              .Value = ProfileId;
                cmdObj.Parameters
              .Add(new SqlParameter("@thid", SqlDbType.VarChar))
              .Value = thid;
                SqlParameter tvpParam = cmdObj.Parameters.AddWithValue("@candidates", candidateTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "dbo.multiprofilesupdate";

                cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(new SqlParameter("@message", SqlDbType.NVarChar, -1)).Direction = ParameterDirection.Output;

                SqlDataAdapter da = new SqlDataAdapter(cmdObj);
                DataTable resultTable = new DataTable();
                da.Fill(resultTable);

                foreach (DataRow row in resultTable.Rows)
                {
                    insertedProfiles.Add(new InsertedProfileResult
                    {
                        Email = row["email"].ToString(),
                        filename = row["fileName"].ToString(),
                        ID = Convert.ToInt32(row["ID"])
                    });
                }

                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddMultipleProfiles");
                result = -1;
            }

            return result;
        }

        public int AddMultipleProfilesAfterAssesments(List<CandidateProfile> profiles, string CreatedBy, int StatusId, int ProfileId, int thid, out string message, out List<InsertedProfileResult> insertedProfiles)
        {
            int result = 0;
            message = string.Empty;
            insertedProfiles = new List<InsertedProfileResult>();

            try
            {
                OpeneConnection();

                DataTable candidateTable = ConvertToDataTable(profiles);

                SqlCommand cmdObj = new SqlCommand("addmultiprofilesAfterAssesments", ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = CreatedBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusId", SqlDbType.VarChar))
              .Value = StatusId;
                cmdObj.Parameters
              .Add(new SqlParameter("@ProfileId", SqlDbType.VarChar))
              .Value = ProfileId;
                cmdObj.Parameters
              .Add(new SqlParameter("@thid", SqlDbType.VarChar))
              .Value = thid;
                SqlParameter tvpParam = cmdObj.Parameters.AddWithValue("@candidates", candidateTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "dbo.multiprofilesupdate";

                cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(new SqlParameter("@message", SqlDbType.NVarChar, -1)).Direction = ParameterDirection.Output;

                SqlDataAdapter da = new SqlDataAdapter(cmdObj);
                DataTable resultTable = new DataTable();
                da.Fill(resultTable);

                foreach (DataRow row in resultTable.Rows)
                {
                    insertedProfiles.Add(new InsertedProfileResult
                    {
                        Email = row["email"].ToString(),
                        filename = row["fileName"].ToString(),
                        ID = Convert.ToInt32(row["ID"])
                    });
                }

                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddMultipleProfilesAfterAssesments");
                result = -1;
            }

            return result;
        }

        public DataSet getAssestProfileWiseCandidateList(int ProfileID, string thid, int page, int pageSize, string search, int? RatingMin = 0, int? RatingMax = 0)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getAssestProfileWiseCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_id", SqlDbType.Int))
                 .Value = ProfileID;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                .Value = thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                cmdObj.Parameters
                .Add(new SqlParameter("@RatingScoreMin", SqlDbType.Int))
                .Value = RatingMin;
                cmdObj.Parameters
               .Add(new SqlParameter("@RatingScoreMax", SqlDbType.Int))
               .Value = RatingMax;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAssestProfileWiseCandidateList");
            }
            return ds;
        }


        public DataSet GetAllProfilesListByThid(string EmpID, AllProfileFilterDash obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getAllProfilesListByThid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.Int))
                .Value = obj.thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@RatingScoreMin", SqlDbType.Int))
                .Value = obj.RatingMin;
                cmdObj.Parameters
                .Add(new SqlParameter("@RatingScoreMax", SqlDbType.Int))
                .Value = obj.RatingMax;
                cmdObj.Parameters
               .Add(new SqlParameter("@MinExp", SqlDbType.Int))
               .Value = obj.MinExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@MaxExp", SqlDbType.Int))
                .Value = obj.MaxExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@NoticePeriod", SqlDbType.Int))
                .Value = obj.NoticePeriod;
                cmdObj.Parameters
              .Add(new SqlParameter("@statusID", SqlDbType.NVarChar))
              .Value = obj.StatusID;
                cmdObj.Parameters
             .Add(new SqlParameter("@SourceID", SqlDbType.NVarChar))
             .Value = obj.SourceID;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
               .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.VarChar))
                .Value = obj.search;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllProfilesListByThid");
            }
            return ds;
        }

        public int UpdatescreenstatusbyId(UpdateScreenStatusModel obj, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updatescreenstatusbyId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = obj.id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@statusId", SqlDbType.Int))
               .Value = obj.statusId;
                cmdObj.Parameters
                .Add(new SqlParameter("@profileId", SqlDbType.Int))
               .Value = obj.profileId;
                cmdObj.Parameters
             .Add(new SqlParameter("@screenRejectReason", SqlDbType.Int))
             .Value = obj.screenRejectReasonId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatescreenstatusbyId");
                result = -1;
            }
            return result;
        }

        public DataSet getProfileDetailsById(int id, int? profileId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getProfileDetailsById";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                    .Add(new SqlParameter("@id", SqlDbType.Int))
                    .Value = id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@profileId", SqlDbType.Int))
                 .Value = profileId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfileDetailsById");
            }
            return ds;
        }


        public int UpdateProfileDetailsById(CandidateProfileModel profile, string createdBy,int thid, int candidateId, out string message)
        {
            int result = 0;
            message = string.Empty;

            try
            {
                OpeneConnection();

                using (SqlCommand cmdObj = new SqlCommand("sp_UpdateProfileDetailsById", ConCampus))
                {
                    cmdObj.CommandType = CommandType.StoredProcedure;

                    cmdObj.Parameters.AddWithValue("@id", candidateId);
                   // cmdObj.Parameters.AddWithValue("@name", profile.Name ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@FirstName", profile.FirstName ?? "");
                    cmdObj.Parameters.AddWithValue("@MiddleName", profile.MiddleName ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@LastName", profile.LastName ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@mobile_number", profile.Phone ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@primary_skill", profile.Skill ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@secondary_skill", profile.AdditionalSkill ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@total_experience", profile.TotalExpYear?.ToString() ?? "0");
                    cmdObj.Parameters.AddWithValue("@relevent_experience", profile.ReleventExpYear?.ToString() ?? "0");
                    cmdObj.Parameters.AddWithValue("@CountryCode", profile.CountryCode ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@added_by", createdBy);
                    cmdObj.Parameters.AddWithValue("@rel_exp_month", profile.ReleventExpMonth?.ToString() ?? "0");
                    cmdObj.Parameters.AddWithValue("@total_exp_month", profile.TotalExpMonth?.ToString() ?? "0");
                    cmdObj.Parameters.AddWithValue("@thid", thid);
                    cmdObj.Parameters.AddWithValue("@resume", profile.Filename ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@resumePath", ConfigurationManager.AppSettings["ResumesPath"].ToString());

                    cmdObj.Parameters.AddWithValue("@dob", profile.Dob?.ToString("yyyy-MM-dd") ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@contract_type", profile.CandidateType ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@currency_type", profile.CurrencyType ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@current_ctc", profile.CurrentSalary?.ToString() ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@expected_ctc", profile.ExpectedSalary?.ToString() ?? (object)DBNull.Value);
                  //  cmdObj.Parameters.AddWithValue("@notice_period", profile.NoticePeriod ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@eduQualification", profile.Qualification ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@currentCompany", profile.CurrCompany ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@countryId", profile.CountryID ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@cityId", profile.CityID ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@Gender", profile.Gender ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@SalaryType", profile.SalaryType);
                    //  cmdObj.Parameters.AddWithValue("@HiringLocationId", profile.HiringLocationId ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@TentativeJoiningDate", profile.JoinDate ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@ApproverId", profile.ApproverId ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@ApproverRemarks", profile.ApproverRemarks ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@ReferredBy", profile.ReferredBy ?? (object)DBNull.Value);
                    cmdObj.Parameters.AddWithValue("@Partner", profile.Partner);
                    cmdObj.Parameters.AddWithValue("@Link", profile.Link ?? (object)DBNull.Value);

                    cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int) { Direction = ParameterDirection.Output });
                    cmdObj.Parameters.Add(new SqlParameter("@message", SqlDbType.NVarChar, -1) { Direction = ParameterDirection.Output });

                    cmdObj.ExecuteNonQuery();

                    result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                    message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                }

                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateProfileDetailsById");
                result = -1;
            }

            return result;
        }



        public DataSet getResumePath(int? cid = null, int? id = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getResumePath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getResumePath");
            }
            return ds;
        }

        public DataSet getProfilePicturePath(int cid, int roundid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getProfilePicturePath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@roundid", SqlDbType.Int))
                .Value = roundid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfilePicturePath");
            }
            return ds;
        }
    }
}