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
using ATSAPI.common;
using Org.BouncyCastle.Ocsp;

namespace ATSAPI.Repositry
{
    public class InterviewRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "InterviewRepository";
        DataUtility du;
        public InterviewRepository()
        {
            du = new DataUtility();
        }


        public int InterviewFeedback(FeedbackModel fb)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "addUpdateInterviewStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = fb.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@statusId", SqlDbType.Int))
                .Value = fb.StatusId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@roundId", SqlDbType.Int))
                 .Value = fb.roundId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewTypeId", SqlDbType.Int))
                 .Value = fb.interviewTypeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDate", SqlDbType.DateTime))
                 .Value = fb.interviewDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@AssessmentDate", SqlDbType.DateTime))
                .Value = fb.AssessmentDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDateUTC", SqlDbType.VarChar))
                 .Value = fb.interviewDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewTimeZone", SqlDbType.VarChar))
                 .Value = fb.interviewTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offsetDate", SqlDbType.Int))
                 .Value = fb.offsetDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDuration", SqlDbType.Int))
                 .Value = fb.interviewDuration;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewModeId", SqlDbType.Int))
                 .Value = fb.interviewModeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@venueOrLink", SqlDbType.VarChar))
                 .Value = fb.vanueOrLink;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewerEmpId", SqlDbType.VarChar))
                 .Value = fb.interviewerEmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Additionalinterviewer", SqlDbType.VarChar))
               .Value = fb.AdditionalInterviewer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                 .Value = fb.remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@strengths", SqlDbType.VarChar))
                 .Value = fb.strengths;
                cmdObj.Parameters
                 .Add(new SqlParameter("@limitations", SqlDbType.VarChar))
                 .Value = fb.limitations;
                cmdObj.Parameters
                 .Add(new SqlParameter("@technical", SqlDbType.VarChar))
                 .Value = fb.technical;
                cmdObj.Parameters
                 .Add(new SqlParameter("@nonTechnical", SqlDbType.VarChar))
                 .Value = fb.nonTechnical;
                cmdObj.Parameters
                 .Add(new SqlParameter("@evaluation", SqlDbType.VarChar))
                 .Value = fb.evaluation;
                cmdObj.Parameters
                 .Add(new SqlParameter("@techRemarks", SqlDbType.VarChar))
                 .Value = fb.techRemarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ForGroomable", SqlDbType.Bit))
                 .Value = fb.ForGroomable;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsCache", SqlDbType.Char))
                .Value = fb.IsCache;
                cmdObj.Parameters
                 .Add(new SqlParameter("@GroomableArea1", SqlDbType.VarChar))
                 .Value = fb.GroomableArea1;
                cmdObj.Parameters
                 .Add(new SqlParameter("@GroomableArea2", SqlDbType.VarChar))
                 .Value = fb.GroomableArea2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@GroomableArea3", SqlDbType.VarChar))
                 .Value = fb.GroomableArea3;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DesignationId", SqlDbType.Int))
                 .Value = fb.DesignationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CTC", SqlDbType.Decimal))
                 .Value = fb.CTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@joiningBonus", SqlDbType.Decimal))
                 .Value = fb.joiningBonus;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NoticeBuyOut", SqlDbType.Decimal))
                 .Value = fb.NoticeBuyOut;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TravelExp", SqlDbType.Decimal))
                 .Value = fb.TravelExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RelocationExp", SqlDbType.Decimal))
                 .Value = fb.RelocationExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RetentionBonus", SqlDbType.Decimal))
                 .Value = fb.RetentionBonus;
                cmdObj.Parameters
                 .Add(new SqlParameter("@salary", SqlDbType.Decimal))
                 .Value = fb.salary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@primarySkillId", SqlDbType.Int))
                 .Value = fb.primarySkillId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredBy", SqlDbType.VarChar))
                 .Value = fb.offeredBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredOn", SqlDbType.VarChar))
                 .Value = fb.offeredOn;
                cmdObj.Parameters
                 .Add(new SqlParameter("@recruiterId", SqlDbType.VarChar))
                 .Value = fb.recruiterId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@hrFinal_Remarks", SqlDbType.VarChar))
                 .Value = fb.hrFinal_Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@finalDecision", SqlDbType.Char))
                 .Value = fb.finalDecision;
                cmdObj.Parameters
                 .Add(new SqlParameter("@score", SqlDbType.VarChar))
                 .Value = fb.score;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TestAttachment", SqlDbType.VarChar))
                 .Value = fb.TestAttachment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IdentityId", SqlDbType.Int))
                 .Value = fb.IdentityId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IdentityNo", SqlDbType.VarChar))
                 .Value = fb.IdentityNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@areas", SqlDbType.Structured))
                 .Value = ToDataTable<TechnicalAreas>(fb.areas);
                cmdObj.Parameters
                .Add(new SqlParameter("@autoQuestionFeedback", SqlDbType.Structured))
                .Value = ToDataTable<autoQuestionFeedback>(fb.autoQuestionFeedback);
                cmdObj.Parameters
                 .Add(new SqlParameter("@traits", SqlDbType.Structured))
                 .Value = ToDataTable<HRTraits>(fb.traits);
                cmdObj.Parameters
                 .Add(new SqlParameter("@screenRoundAdditionalSkills", SqlDbType.Structured))
                 .Value = ToDataTable<ScreenRoundAdditionalSkills>(fb.screenRoundAdditionalSkills);
                cmdObj.Parameters
                 .Add(new SqlParameter("@flag", SqlDbType.Int))
                 .Value = fb.flag;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsStatusUpdate", SqlDbType.Int))
                 .Value = fb.IsStatusUpdate;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = fb.AddedBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@interviewBy", SqlDbType.VarChar))
              .Value = fb.interviewBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@FinalAttachment", SqlDbType.VarChar))
              .Value = fb.FinalAttachment;
                cmdObj.Parameters
              .Add(new SqlParameter("@FinalAttachment1", SqlDbType.VarChar))
              .Value = fb.FinalAttachment1;
                cmdObj.Parameters
              .Add(new SqlParameter("@FinalAttachment2", SqlDbType.VarChar))
              .Value = fb.FinalAttachment2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferLetterAtt", SqlDbType.VarChar))
                 .Value = fb.OfferLetterAtt;
                cmdObj.Parameters
                     .Add(new SqlParameter("@IsInHandOffer", SqlDbType.Char))
                     .Value = fb.IsInHandOffer;
                cmdObj.Parameters
                  .Add(new SqlParameter("@HRConcent", SqlDbType.Char))
                  .Value = fb.HRConcent;
                //cmdObj.Parameters
                //  .Add(new SqlParameter("@PanelConcent", SqlDbType.Char))
                //  .Value = fb.PanelConcent;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferInHandAmount", SqlDbType.Decimal))
                 .Value = fb.OfferInHandAmount;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferCompanyId", SqlDbType.Int))
                 .Value = fb.CompanyID;
                cmdObj.Parameters
             .Add(new SqlParameter("@ExternalAgency", SqlDbType.VarChar))
             .Value = fb.ExternalAgency;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ScreenRejectReason", SqlDbType.Int))
                 .Value = fb.ScreenRejectReason;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PanelConcent", SqlDbType.Char))
                 .Value = fb.PanelConcent;
                 cmdObj.Parameters
                .Add(new SqlParameter("@remarkNextLevel", SqlDbType.NVarChar))
                .Value = fb.remarkNextLevel;
                  cmdObj.Parameters
                 .Add(new SqlParameter("@AnnualVariablePay", SqlDbType.Int))
                 .Value = fb.AnnualVariablePay;
                cmdObj.Parameters
                .Add(new SqlParameter("@CoderByteTestId", SqlDbType.NVarChar))
                .Value = fb.codebyteTestId;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderBytePublicUrl", SqlDbType.NVarChar))
                .Value = fb.coderBytePublicUrl;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderBytePrivateUrl", SqlDbType.NVarChar))
                .Value = fb.coderBytePrivateUrl;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderByteDisplayName", SqlDbType.NVarChar))
                .Value = fb.coderByteDisplayName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForNotOptOnlineAssessment", SqlDbType.Int))
                 .Value = fb.ReasonForNotOptOnlineAssessment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForOptExternal", SqlDbType.Int))
                 .Value = fb.ReasonForOptExternal;
                cmdObj.Parameters
                 .Add(new SqlParameter("@coderByteReportUrl", SqlDbType.NVarChar))
                 .Value = fb.coderByteReportUrl;
                cmdObj.Parameters
                .Add(new SqlParameter("@DefaultAssessmentByChangeReason", SqlDbType.Int))
                .Value = fb.DefaultAssessmentByChangeReason;
                cmdObj.Parameters
                  .Add(new SqlParameter("@isFeedbackSaveOrDraft", SqlDbType.Char))
                  .Value = fb.IsFeedbackSaveOrDraft;
                 cmdObj.Parameters
               .Add(new SqlParameter("@EntityId", SqlDbType.Int))
               .Value = fb.EntityId;
                cmdObj.Parameters
               .Add(new SqlParameter("@InterviewLocationId", SqlDbType.VarChar))
               .Value = fb.InterviewLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsQuestionareEnable", SqlDbType.Char))
               .Value = fb.IsQuestionareEnable;
                cmdObj.Parameters
                .Add(new SqlParameter("@assessRoleKnowledge", SqlDbType.VarChar, 1000))
                .Value = fb.TechnicalQuestionnaire?.fundamentalKnowledgForm?.assessRoleKnowledg;
                cmdObj.Parameters
                .Add(new SqlParameter("@candidateApprochComplexPrblm", SqlDbType.VarChar, 1000))
                .Value = fb.TechnicalQuestionnaire?.prblmSolvingSkillForm?.candidateApprochComplexPrblm;
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidatePrblmSolvingApproch", SqlDbType.VarChar, 1000))
                .Value = fb.TechnicalQuestionnaire?.prblmSolvingSkillForm?.candidatePrblmSolvingApproch;
               
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidateFitForInfogain", SqlDbType.VarChar, 1000))
                 .Value = fb.TechnicalQuestionnaire?.CulturatFitAdaptabilityForm?.candidateFitForInfogain;
                cmdObj.Parameters
                .Add(new SqlParameter("@candidateAbilityToAdoptChangeWork", SqlDbType.VarChar, 1000))
                .Value = fb.TechnicalQuestionnaire?.CulturatFitAdaptabilityForm?.candidateAbilityToAdoptChangeWork;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "InterviewFeedback");
                result = -1;
            }
            return result;
        }

        public void SaveCalenderId(int cid, string CandidateCalendarID, string PanelCalendarID, string Empid, string mid)
        {
            try
            {
                OpeneConnection();
                string _sql = "UpdateCalendarID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CandidateCalendarId", SqlDbType.NVarChar))
                 .Value = CandidateCalendarID;
                cmdObj.Parameters
                .Add(new SqlParameter("@PanelCalendarId", SqlDbType.NVarChar))
                .Value = PanelCalendarID;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
               .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@MSTeamMeetingId", SqlDbType.NVarChar))
               .Value = mid;

                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveCalenderId");
            }
        }

        public RoundDetails getCurrentRoundDetailsByCid(int cid, string EmpId, out int result)
        {
            RoundDetails rd = new RoundDetails();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCurrentRoundDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCurrentRoundDetailsByCid");
            }
            return rd;
        }

        public DataSet getCandidateDetailByTHID(int thid, string EmpId, int page, int pageSize, string search, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateDetailByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
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
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetailByTHID");
            }
            return ds;
        }
        //(int? hiringLocationId, int? thid, string EmpId, int page, int pageSize, string search, int? intStatus, int? IntType, string startDate, string endDate, int? ReasoForDropId = null, int? primarySkill = null, string IntBy = null)
        public DataSet getCandidateListByID(InterviewMultiselectFilter obj,string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllCandidateListByID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = obj.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@hiringLocationId", SqlDbType.VarChar))
                 .Value = obj.hiringLocationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IntStatus", SqlDbType.NVarChar, 2000))
                 .Value = obj.intStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@IntType", SqlDbType.NVarChar, 2000))
                .Value = obj.IntType;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewBy", SqlDbType.NVarChar, 2000))
                .Value = obj.IntBy;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
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
                .Add(new SqlParameter("@ReasoForDropId", SqlDbType.VarChar))
                .Value = obj.ReasoForDropId;
                cmdObj.Parameters
                .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
                .Value = obj.PracticeId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateListByID");
            }
            return ds;
        }


        public DataSet getCandidateListByIDReport(InterviewMultiselectFilter obj, string EmpId, out int result)
            //int? hiringLocationId, int? thid, string EmpId, int page, int pageSize, string search, int? intStatus, int? IntType, string startDate, string endDate, int? ReasoForDropId = null, int? primarySkill = null, string IntBy = null)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateListByIDReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = obj.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@hiringLocationId", SqlDbType.VarChar))
                 .Value = obj.hiringLocationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IntStatus", SqlDbType.NVarChar, 2000))
                 .Value = obj.intStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@IntType", SqlDbType.NVarChar, 2000))
                .Value = obj.IntType;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewBy", SqlDbType.NVarChar, 2000))
                .Value = obj.IntBy;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
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
                .Add(new SqlParameter("@ReasoForDropId", SqlDbType.VarChar))
                .Value = obj.ReasoForDropId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateListByID");
            }
            return ds;
        }

        public DataSet getAllCandidateProfileList(int? hiringLocationId, int? thid, string EmpId, int page, int pageSize, string search, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllCandidateProfileList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
                 .Value = hiringLocationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
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
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateListByID");
            }
            return ds;
        }

        public DataSet getAllCandidateDetailsByCID(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllCandidateDetailsByCID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.NVarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateListByID");
            }
            return ds;
        }

        public DataSet getAllCandidateTransferListByID(InterviewMultiselectFilter obj, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllCandidateTransferListByID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = obj.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IntStatus", SqlDbType.NVarChar, 2000))
                 .Value = obj.intStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@primarySkill", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@IntType", SqlDbType.NVarChar, 2000))
                .Value = obj.IntType;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@hiringLocationId", SqlDbType.VarChar))
                .Value = obj.hiringLocationId;
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
                 .Add(new SqlParameter("PracticeId", SqlDbType.NVarChar))
                 .Value = obj.PracticeId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllCandidateTransferListByID");
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

        public EmailTemplate getEmailTemplate(int id, string EmpId)
        {
            EmailTemplate email = new EmailTemplate();

            try
            {
                OpeneConnection();
                string _sql = "GetEmailTemplate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@id", SqlDbType.Int))
                 .Value = id;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                email = (EmailTemplate)RepositryMapper.getMap<EmailTemplate>(ds);
                CloseConnection();
                return email;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getEmailTemplate");
            }
            return email;
        }

        public int addupdateCandidateDetails(CandidateDetails cnd, ref int RoundId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdatecandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.VarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RoundId", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_id", SqlDbType.Int))
                 .Value = cnd.id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProfileID", SqlDbType.Int))
                 .Value = cnd.ProfileID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CSkill_ID", SqlDbType.Int))
                 .Value = cnd.CSkill_ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@c_profileUniqId", SqlDbType.Int))
                .Value = cnd.c_profileUniqId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewType", SqlDbType.Int))
                 .Value = cnd.interviewType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_identityId", SqlDbType.Int))
                 .Value = cnd.identityId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_identityNo", SqlDbType.NVarChar))
                 .Value = cnd.identityNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_statusId", SqlDbType.Int))
                 .Value = cnd.statusId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_roleId", SqlDbType.Int))
                 .Value = cnd.roleId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_currencyTypeId", SqlDbType.Int))
                 .Value = cnd.currencyTypeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_interviewMode", SqlDbType.Int))
                 .Value = cnd.interviewMode;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_interviewDate", SqlDbType.VarChar))
                 .Value = cnd.interviewDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@interviewDateUTC", SqlDbType.VarChar))
                .Value = cnd.interviewDateUTC;
                cmdObj.Parameters
               .Add(new SqlParameter("@interviewTimeZone", SqlDbType.VarChar))
               .Value = cnd.interviewTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_joiningDate", SqlDbType.VarChar))
                 .Value = cnd.joiningDate;
                //cmdObj.Parameters
                // .Add(new SqlParameter("@per_Name", SqlDbType.NVarChar))
                // .Value = cnd.Name;
                cmdObj.Parameters
                   .Add(new SqlParameter("@FirstName", SqlDbType.VarChar))
                   .Value = cnd.FirstName;
                cmdObj.Parameters
               .Add(new SqlParameter("@MiddleName", SqlDbType.VarChar))
               .Value = cnd.MiddleName;
                cmdObj.Parameters
               .Add(new SqlParameter("@LastName", SqlDbType.VarChar))
               .Value = cnd.LastName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_email", SqlDbType.NVarChar))
                 .Value = cnd.email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_phone", SqlDbType.NVarChar))
                 .Value = cnd.phone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@totalExp", SqlDbType.VarChar))
                 .Value = cnd.totalExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@totalExpMonth", SqlDbType.VarChar))
                 .Value = cnd.totalExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@relevantExp", SqlDbType.VarChar))
                 .Value = cnd.relevantExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@relevantExpMonth", SqlDbType.VarChar))
                 .Value = cnd.relExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
                 .Value = cnd.primarySkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@currentCompany", SqlDbType.VarChar))
                 .Value = cnd.currentCompany;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CountryId", SqlDbType.Int))
                 .Value = cnd.CountryID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@StateId", SqlDbType.Int))
                 .Value = cnd.StateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CityId", SqlDbType.Int))
                 .Value = cnd.CityId;
                cmdObj.Parameters
                .Add(new SqlParameter("@HiringLocation", SqlDbType.Int))
                .Value = cnd.HiringLocation;
                cmdObj.Parameters
                 .Add(new SqlParameter("@currentOrg", SqlDbType.VarChar))
                 .Value = cnd.currentOrg;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eduQualification", SqlDbType.NVarChar))
                 .Value = cnd.eduQualification;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_talentId", SqlDbType.NVarChar))
                 .Value = cnd.talentId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_candidateTypeID", SqlDbType.NVarChar))
                 .Value = cnd.candidateTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_recruiter", SqlDbType.NVarChar))
                 .Value = cnd.recruiter;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_panel", SqlDbType.NVarChar))
                 .Value = cnd.panel;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_additionalPanel", SqlDbType.NVarChar))
                 .Value = cnd.Additionalpanel;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_expSalary", SqlDbType.NVarChar))
                 .Value = cnd.expSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_curSalary", SqlDbType.NVarChar))
                 .Value = cnd.curSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_OtherOffer", SqlDbType.NVarChar))
                 .Value = cnd.OtherOffer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_optional", SqlDbType.NVarChar))
                 .Value = cnd.optional;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_remarks", SqlDbType.NVarChar))
                 .Value = cnd.remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_username", SqlDbType.NVarChar))
                 .Value = cnd.username;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_interviewDetails", SqlDbType.NVarChar))
                 .Value = cnd.interviewDetails;
                cmdObj.Parameters
                 .Add(new SqlParameter("@resume", SqlDbType.NVarChar))
                 .Value = cnd.Resume;
                cmdObj.Parameters
                 .Add(new SqlParameter("@path", SqlDbType.NVarChar))
                 .Value = cnd.Path;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_createdBy", SqlDbType.NVarChar))
                 .Value = cnd.createdBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offsetDate", SqlDbType.Int))
                 .Value = cnd.offsetDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@gender", SqlDbType.Int))
                 .Value = cnd.Gender;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dob", SqlDbType.NVarChar))
                 .Value = cnd.dob;
                cmdObj.Parameters
                .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
                .Value = cnd.DivisionID;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@JobFamilyID", SqlDbType.Int))
                //.Value = cnd.JobFamilyID;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeID", SqlDbType.Int))
              .Value = cnd.CubeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
               .Value = cnd.CubeClusterID;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeRoleID", SqlDbType.Int))
              .Value = cnd.CubeRoleID;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = cnd.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.Char))
                .Value = cnd.gradeBand;
                cmdObj.Parameters
               .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
               .Value = cnd.SalaryType;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@jobfamilycategory", SqlDbType.Char))
                //.Value = cnd.jobfamilycategory;
                //   cmdObj.Parameters
                //.Add(new SqlParameter("@practiceId", SqlDbType.Int))
                //.Value = cnd.practiceId;
                cmdObj.Parameters
             .Add(new SqlParameter("@EmpUnitId", SqlDbType.Int))
             .Value = cnd.EmpUnitId;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewDuration", SqlDbType.Int))
               .Value = cnd.interviewDuration;
                cmdObj.Parameters
             .Add(new SqlParameter("@EntityId", SqlDbType.Int))
             .Value = cnd.EntityId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CountryCode", SqlDbType.Int))
                 .Value = cnd.CountryCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
               .Value = cnd.IsFromNaukriAPI;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                RoundId = Convert.ToInt32(cmdObj.Parameters["@RoundId"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addupdateCandidateDetails");
                result = -1;
            }
            return result;
        }
        public int updateInterview(InterviewFeedbackStatus cnd)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateInterviewStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@roundId", SqlDbType.Int))
                 .Value = cnd.RoundId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewDate", SqlDbType.VarChar))
                 .Value = cnd.InterviewDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDateUTC", SqlDbType.DateTimeOffset))
                 .Value = cnd.interviewDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewTimeZone", SqlDbType.VarChar))
                 .Value = cnd.interviewTimeZone;
                cmdObj.Parameters
                .Add(new SqlParameter("@offsetDate", SqlDbType.Int))
                .Value = cnd.offsetDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewDuration", SqlDbType.Int))
                .Value = cnd.InterviewDuration;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewStatus", SqlDbType.Int))
                 .Value = cnd.InterviewStatus;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JoiningDate", SqlDbType.NVarChar))
                 .Value = cnd.JoiningDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewMode", SqlDbType.Int))
                 .Value = cnd.InterviewMode;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer", SqlDbType.VarChar))
                 .Value = cnd.Interviewer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AdditionalInterviewer", SqlDbType.VarChar))
                 .Value = cnd.AdditionalInterviewer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                 .Value = cnd.Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewDetails", SqlDbType.NVarChar))
                 .Value = cnd.InterviewDetails;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = cnd.UpdatedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ResCanReasonId", SqlDbType.Int))
                 .Value = cnd.rescheduleCancelReason;
                  cmdObj.Parameters
                .Add(new SqlParameter("@EntityId", SqlDbType.Int))
                .Value = cnd.EntityId;
                cmdObj.Parameters
               .Add(new SqlParameter("@InterviewLocationId", SqlDbType.Int))
               .Value = cnd.InterviewLocationId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateInterview");
                result = -1;
            }
            return result;
        }

        public DataSet GetRecipientsAndDetailForSMS(int RoundID, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetRecipientsAndDetailForSMS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RoundId", SqlDbType.Int))
                 .Value = RoundID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRecipientsAndDetailForSMS");
            }
            return ds;
        }


        public int addupdateCandidateDetailsBulk(CandidateDetailsBulk cnd, ref int RoundId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdatecandidateDetailsBulk";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RoundId", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@profileSource", SqlDbType.VarChar))
                 .Value = cnd.profileSource;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewType", SqlDbType.VarChar))
                 .Value = cnd.interviewType;
                cmdObj.Parameters
                   .Add(new SqlParameter("@currency", SqlDbType.VarChar))
                   .Value = cnd.currency;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewMode", SqlDbType.VarChar))
                 .Value = cnd.interviewMode;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDate", SqlDbType.VarChar))
                 .Value = cnd.interviewDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@joiningDate", SqlDbType.VarChar))
                 .Value = cnd.joiningDate;
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
                 .Add(new SqlParameter("@email", SqlDbType.NVarChar))
                 .Value = cnd.email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@phone", SqlDbType.NVarChar))
                 .Value = cnd.phone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@totalExp", SqlDbType.VarChar))
                 .Value = cnd.totalExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@totalExpMonth", SqlDbType.VarChar))
                .Value = cnd.totalExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@relevantExp", SqlDbType.VarChar))
                 .Value = cnd.relevantExp;
                cmdObj.Parameters
                .Add(new SqlParameter("@relevantExpMonth", SqlDbType.VarChar))
                .Value = cnd.relevantExpMonth;
                cmdObj.Parameters
                 .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
                 .Value = cnd.primarySkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@currentCompany", SqlDbType.VarChar))
                 .Value = cnd.currentCompany;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Country", SqlDbType.VarChar))
                 .Value = cnd.Country;
                cmdObj.Parameters
                 .Add(new SqlParameter("@City", SqlDbType.VarChar))
                 .Value = cnd.City;
                cmdObj.Parameters
                 .Add(new SqlParameter("@currentOrg", SqlDbType.VarChar))
                 .Value = cnd.currentOrg;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eduQualification", SqlDbType.NVarChar))
                 .Value = cnd.eduQualification;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.NVarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidateType", SqlDbType.NVarChar))
                 .Value = cnd.candidateType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@recruiter", SqlDbType.NVarChar))
                 .Value = cnd.recruiter;
                cmdObj.Parameters
                 .Add(new SqlParameter("@panel", SqlDbType.NVarChar))
                 .Value = cnd.panel;
                cmdObj.Parameters
                 .Add(new SqlParameter("@expSalary", SqlDbType.NVarChar))
                 .Value = cnd.expSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@curSalary", SqlDbType.NVarChar))
                 .Value = cnd.curSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OtherOffer", SqlDbType.NVarChar))
                 .Value = cnd.OtherOffer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
                 .Value = cnd.remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDetails", SqlDbType.NVarChar))
                 .Value = cnd.interviewDetails;
                cmdObj.Parameters
                 .Add(new SqlParameter("@resume", SqlDbType.NVarChar))
                 .Value = cnd.Resume;
                cmdObj.Parameters
                 .Add(new SqlParameter("@path", SqlDbType.NVarChar))
                 .Value = cnd.Path;
                cmdObj.Parameters
                 .Add(new SqlParameter("@createdBy", SqlDbType.NVarChar))
                 .Value = cnd.createdBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@HiringLocation", SqlDbType.NVarChar))
                 .Value = cnd.HiringLocation;
                cmdObj.Parameters
                 .Add(new SqlParameter("@gender", SqlDbType.VarChar))
                 .Value = cnd.Gender;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dob", SqlDbType.NVarChar))
                 .Value = cnd.dob;
                cmdObj.Parameters
                .Add(new SqlParameter("@Division", SqlDbType.NVarChar))
                .Value = cnd.Division;
                cmdObj.Parameters
                .Add(new SqlParameter("@CubeName", SqlDbType.NVarChar))
                .Value = cnd.CubeName;
                // cmdObj.Parameters
                // .Add(new SqlParameter("@JobFamily", SqlDbType.NVarChar))
                // .Value = cnd.JobFamily;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@JobFamilyCategory", SqlDbType.VarChar))
                //.Value = cnd.JobFamilyCategory;
                cmdObj.Parameters
                .Add(new SqlParameter("@grade", SqlDbType.NVarChar))
                .Value = cnd.grade;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.NVarChar))
                .Value = cnd.gradeBand;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@Practice", SqlDbType.NVarChar))
                //.Value = cnd.Practice;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmployeeUnit", SqlDbType.NVarChar))
                .Value = cnd.EmployeeUnit;
                cmdObj.Parameters
              .Add(new SqlParameter("@SalaryType", SqlDbType.NVarChar))
              .Value = cnd.SalaryType;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                RoundId = Convert.ToInt32(cmdObj.Parameters["@RoundId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addupdateCandidateDetailsBulk");
                result = -1;
                throw ex;
            }
            return result;
        }

        public int updateCandidateDetailsByCid(CandidateDetails cnd)
        {
            int result = 0;
            string OldFilePath = string.Empty;
            string NewFilePath = string.Empty;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateCandidateDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@OldFilePath", SqlDbType.NVarChar, 1000)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@NewFilePath", SqlDbType.NVarChar, 1000)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cnd.cid;
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
                .Add(new SqlParameter("@email", SqlDbType.NVarChar))
                .Value = cnd.email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@mobile_number", SqlDbType.NVarChar))
                 .Value = cnd.phone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@primary_skill", SqlDbType.NVarChar))
                 .Value = cnd.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@total_experience", SqlDbType.NVarChar))
                .Value = cnd.totalExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@total_exp_Month", SqlDbType.NVarChar))
               .Value = cnd.totalExpMonth;
                cmdObj.Parameters
                .Add(new SqlParameter("@relevent_experience", SqlDbType.NVarChar))
                .Value = cnd.relevantExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@relevent_exp_month", SqlDbType.NVarChar))
               .Value = cnd.relExpMonth;
                cmdObj.Parameters
                .Add(new SqlParameter("@identityid", SqlDbType.Int))
                .Value = cnd.identityId;
                cmdObj.Parameters
                .Add(new SqlParameter("@countryid", SqlDbType.Int))
                .Value = cnd.CountryID;
                cmdObj.Parameters
                .Add(new SqlParameter("@stateid", SqlDbType.Int))
                .Value = cnd.StateID;
                cmdObj.Parameters
               .Add(new SqlParameter("@cityid", SqlDbType.Int))
                .Value = cnd.CityId;
                cmdObj.Parameters
               .Add(new SqlParameter("@currentorg", SqlDbType.NVarChar))
                .Value = cnd.currentOrg;
                cmdObj.Parameters
              .Add(new SqlParameter("@eduqualification", SqlDbType.NVarChar))
               .Value = cnd.eduQualification;
                cmdObj.Parameters
                .Add(new SqlParameter("@identityno", SqlDbType.NVarChar))
                .Value = cnd.identityNo;
                cmdObj.Parameters
               .Add(new SqlParameter("@expsalary", SqlDbType.NVarChar))
               .Value = cnd.expSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cursalary", SqlDbType.NVarChar))
                 .Value = cnd.curSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = cnd.updateBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidateTypeID", SqlDbType.NVarChar))
                 .Value = cnd.candidateTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@currencyTypeId", SqlDbType.Int))
                 .Value = cnd.currencyTypeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@joiningDate", SqlDbType.VarChar))
                 .Value = cnd.joiningDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@Resume", SqlDbType.VarChar))
               .Value = cnd.Resume;
                cmdObj.Parameters
               .Add(new SqlParameter("@path", SqlDbType.VarChar))
               .Value = cnd.Path;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsFileExist", SqlDbType.Int))
               .Value = cnd.IsFileExist;
                cmdObj.Parameters
               .Add(new SqlParameter("@gender", SqlDbType.Int))
               .Value = cnd.Gender;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dob", SqlDbType.NVarChar))
                 .Value = cnd.dob;
                cmdObj.Parameters
                .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
                .Value = cnd.DivisionID;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@JobFamilyID", SqlDbType.Int))
                //.Value = cnd.JobFamilyID;
                cmdObj.Parameters
                .Add(new SqlParameter("@CubeID", SqlDbType.Int))
                .Value = cnd.CubeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
               .Value = cnd.CubeClusterID;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeRoleID", SqlDbType.Int))
              .Value = cnd.CubeRoleID;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = cnd.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.Char))
                .Value = cnd.gradeBand;
                cmdObj.Parameters
                .Add(new SqlParameter("@SalaryType", SqlDbType.NVarChar))
                .Value = cnd.SalaryType;
                //     cmdObj.Parameters
                //     .Add(new SqlParameter("@jobfamilycategory", SqlDbType.Char))
                //     .Value = cnd.jobfamilycategory;
                //     cmdObj.Parameters
                //.Add(new SqlParameter("@practiceId", SqlDbType.Int))
                //.Value = cnd.practiceId;
                cmdObj.Parameters
             .Add(new SqlParameter("@EmpUnitId", SqlDbType.Int))
             .Value = cnd.EmpUnitId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CountryCode", SqlDbType.Int))
                .Value = cnd.CountryCode;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                OldFilePath = Convert.ToString(cmdObj.Parameters["@OldFilePath"].Value);
                NewFilePath = Convert.ToString(cmdObj.Parameters["@NewFilePath"].Value);

                if (result != -2)
                {
                    if (cnd.IsFileExist == 1)
                    {
                        //delete old resume file 
                        if ((OldFilePath != null || OldFilePath != "") && File.Exists(OldFilePath))
                        {
                            File.Delete(OldFilePath);
                        }
                        //create new directory 
                        if ((NewFilePath != null || NewFilePath != "") && !(Directory.Exists(NewFilePath)))
                        {
                            Directory.CreateDirectory(NewFilePath);
                        }

                        Common common = new Common();
                        var httpPostedFile = HttpContext.Current.Request.Files[0];
                        // string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string filedetails = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);
                        string fileSavePath = Path.Combine(NewFilePath, filedetails);
                        // httpPostedFile.SaveAs(fileSavePath);
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }

                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                    }
                }
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateCandidateDetailsByCid");
                result = -1;
            }
            return result;
        }


        public candidateDetailsInfo getCandidateDetailsByCid(int cid, string EmpId, out int result)
        {
            candidateDetailsInfo rd = new candidateDetailsInfo();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                    .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                    .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                rd = (candidateDetailsInfo)RepositryMapper.getMap<candidateDetailsInfo>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetailsByCid");
            }
            return rd;
        }

        public DataSet getLinkedTalentIdByCid(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getLinkedTalentIdByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                   .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getLinkedTalentIdByCid");
            }
            return ds;
        }

        /***
         *  Transfer Scheduled Candidate to other talent ID
         * 
         * **/

        public int transferCandidateByTalentId(CandidateDetails cnd, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_transferCandidateByTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cnd.cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                 .Value = cnd.updateBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                 .Value = cnd.remarks;
                cmdObj.Parameters
              .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
              .Value = cnd.DivisionID;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@JobFamilyID", SqlDbType.Int))
                //.Value = cnd.JobFamilyID;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = cnd.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.Char))
                .Value = cnd.gradeBand;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@jobfamilycategory", SqlDbType.Char))
                //.Value = cnd.jobfamilycategory;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@practiceId", SqlDbType.Int))
                //.Value = cnd.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpUnitId", SqlDbType.Int))
               .Value = cnd.EmpUnitId;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeID", SqlDbType.Int))
              .Value = cnd.CubeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
               .Value = cnd.CubeClusterID;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeRoleID", SqlDbType.Int))
              .Value = cnd.CubeRoleID;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "transferCandidateByTalentId");
                result = -1;
            }
            return result;
        }

        public DataSet SearchCandidate(SearchCandidateModel model, string EmpId, int PageNo, int PageSize, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_searchCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Name", SqlDbType.VarChar))
                 .Value = model.Name;
                cmdObj.Parameters
                   .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                   .Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Email", SqlDbType.VarChar))
                 .Value = model.Email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SkillID", SqlDbType.VarChar))
                 .Value = model.SkillId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SourceId", SqlDbType.VarChar))
                 .Value = model.SourceId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewStatusID", SqlDbType.VarChar))
                 .Value = model.InterviewStatusID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDropReasonId", SqlDbType.VarChar))
                 .Value = model.interviewDropReasonId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpMin", SqlDbType.Int))
                 .Value = model.ExpMin;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpMax", SqlDbType.Int))
                 .Value = model.ExpMax;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentId", SqlDbType.NVarChar))
                 .Value = model.TalentId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NPMax", SqlDbType.Int))
                 .Value = model.NPMax;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NoOfPastDays", SqlDbType.Int))
                 .Value = model.NoOfPastDays;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RecruiterEmpID", SqlDbType.VarChar))
                 .Value = model.RecruiterEmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountId", SqlDbType.VarChar))
                 .Value = model.AccountId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectID", SqlDbType.VarChar))
                 .Value = model.ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@HiringManager", SqlDbType.VarChar))
                 .Value = model.HiringManager;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RequisitionType", SqlDbType.VarChar))
                 .Value = model.RequisitionType;
                cmdObj.Parameters
                .Add(new SqlParameter("@Partner", SqlDbType.VarChar))
                .Value = model.partner;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = PageNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                 .Value = PageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offerstatus", SqlDbType.VarChar))
                 .Value = model.offerStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerDropReasonId", SqlDbType.VarChar))
                .Value = model.offerDropReasonId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProfileAdditionStartDate", SqlDbType.VarChar))
                .Value = model.ProfileAdditionStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProfileAdditionEnddate", SqlDbType.VarChar))
                .Value = model.ProfileAdditionEnddate;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewType", SqlDbType.VarChar))
                .Value = model.InterviewType;
                cmdObj.Parameters
                .Add(new SqlParameter("@TrLocationId", SqlDbType.VarChar))
                .Value = model.TrLocationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OrgName", SqlDbType.VarChar))
                 .Value = model.OrgName;
                cmdObj.Parameters
                .Add(new SqlParameter("@RatingScoreMin", SqlDbType.Int))
                .Value = model.RatingScoreMin;
                cmdObj.Parameters
               .Add(new SqlParameter("@RatingScoreMax", SqlDbType.Int))
               .Value = model.RatingScoreMax;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SearchCandidate");
            }
            return ds;
        }

        public DataSet GetPanelWiseReport(string EmpID, string DUIDs, string AccountIDs, string SkillIDs, string sDate, string eDate, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetPanelWiseReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DUIDs", SqlDbType.VarChar))
                 .Value = DUIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountIDs", SqlDbType.VarChar))
                 .Value = AccountIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SkillIDs", SqlDbType.VarChar))
                 .Value = SkillIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@sDate", SqlDbType.VarChar))
                 .Value = sDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eDate", SqlDbType.VarChar))
                 .Value = eDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelWiseReport");
            }
            return ds;
        }

        public DataSet GetReportDetailByPanel(string panelID, string DUIDs, string AccountIDs, string SkillIDs, string sDate, string eDate, string statusId, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetReportDetailByPanelID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PanelID", SqlDbType.VarChar))
                 .Value = panelID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DUIDs", SqlDbType.VarChar))
                 .Value = DUIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountIDs", SqlDbType.VarChar))
                 .Value = AccountIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SkillIDs", SqlDbType.VarChar))
                 .Value = SkillIDs;
                cmdObj.Parameters
                 .Add(new SqlParameter("@sDate", SqlDbType.VarChar))
                 .Value = sDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eDate", SqlDbType.VarChar))
                 .Value = eDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewStatusID", SqlDbType.VarChar))
                 .Value = statusId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReportDetailByPanel");
            }
            return ds;
        }

        public DataSet GetRecruiterWiseReport(string sDate, string eDate, string search, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetRecruiter_WiseReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@sDate", SqlDbType.VarChar))
                 .Value = sDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eDate", SqlDbType.VarChar))
                 .Value = eDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@search", SqlDbType.VarChar))
                 .Value = search;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRecruiter_WiseReport");
            }
            return ds;
        }

        public DataSet GetReportDetailsByRecruiterId(string RecruiterEmpID, string Flag, string sDate, string eDate, int Page, int pagesize, string Status, string Profile, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetRecruiterReportByRecruiterId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RecruiterEmpID", SqlDbType.VarChar))
                 .Value = RecruiterEmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Flag", SqlDbType.VarChar))
                .Value = Flag;
                cmdObj.Parameters
                 .Add(new SqlParameter("@sDate", SqlDbType.VarChar))
                 .Value = sDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eDate", SqlDbType.VarChar))
                 .Value = eDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@Status", SqlDbType.VarChar))
               .Value = Status;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Profile", SqlDbType.VarChar))
                 .Value = Profile;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = Page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pagesize", SqlDbType.Int))
                .Value = pagesize;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRecruiterReportByRecruiterId");
            }
            return ds;
        }

        public DataSet GetAdditionalInterviewers(string EmpId, int RoundID, out int result)
        {

            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAdditionalInterviewers";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@RoundID", SqlDbType.Int))
               .Value = RoundID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAdditionalInterviewers");
            }
            return ds;
        }

        public int UpdatePrimaryInterviewer(string EmpID, int RoundId, string InterviewerID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdatePrimaryInterviewer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RoundID", SqlDbType.Int))
                 .Value = RoundId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewerID", SqlDbType.VarChar))
                 .Value = InterviewerID;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePrimaryInterviewer");
                result = -1;
            }
            return result;
        }


        public DataSet getAllUpcomingInterview(string EmpId, int page, int pageSize, string search, out int result, int? hiringLocationId)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllUpcomingInterview";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.NVarChar))
                .Value = EmpId;
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
                    .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
                    .Value = hiringLocationId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                // rd = (RoundDetails)RepositryMapper.getMap<RoundDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllUpcomingInterview");
            }
            return ds;
        }

        public int UpdateCandidateTransferDetails(int cid, string transferStatus, string remark, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateTransferCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@transferStatus", SqlDbType.VarChar))
                .Value = transferStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@remark", SqlDbType.VarChar))
               .Value = remark;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_addUpdateOfferApproval");
                result = -1;
            }
            return result;
        }


        public int ApproveUnAttendentTransferProfile(int id, string transferStatus, string remark, string empId, ref string Message,char? IsFromNaukriAPI =null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ApproveUnAttendentTransferProfile";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@Id", SqlDbType.Int))
               .Value = id;
                cmdObj.Parameters
                .Add(new SqlParameter("@transferStatus", SqlDbType.VarChar))
                .Value = transferStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@remark", SqlDbType.VarChar))
               .Value = remark;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
                .Value = IsFromNaukriAPI;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_addUpdateOfferApproval");
                result = -1;
            }
            return result;
        }

        public int CandidateTransferRequest(canTransferRequest obj, string EmpId, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_add_update_candidate_transfer_request";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.VarChar, 100))
              .Value = obj.toThId;
                cmdObj.Parameters
               .Add(new SqlParameter("@addedBy", SqlDbType.VarChar, 100))
               .Value = EmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.VarChar, 500))
              .Value = obj.remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
               .Value = obj.DivisionId;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@JobFamilyID", SqlDbType.Int))
                //.Value = obj.JobFamilyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = obj.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.Char))
                .Value = obj.gradeBand;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@jobfamilycategory", SqlDbType.Char))
                // .Value = obj.jobfamilycategory;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@practiceId", SqlDbType.Int))
                //.Value = obj.practiceId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CubeID", SqlDbType.Int))
                .Value = obj.CubeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
               .Value = obj.CubeClusterID;
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeRoleID", SqlDbType.Int))
              .Value = obj.CubeRoleID;
                cmdObj.Parameters
             .Add(new SqlParameter("@EmpUnitId", SqlDbType.Int))
             .Value = obj.EmpUnitId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateTransferRequest");
                result = -1;
            }
            return result;

        }
        public int UnattendedCandidateTransferRequest(int id, string toThId, string EmpId, string remarks, ref string Message,  char? IsFromNaukriAPI = null)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_unattended_candidate_transfer_request";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.VarChar, 100))
              .Value = toThId;
                cmdObj.Parameters
               .Add(new SqlParameter("@addedBy", SqlDbType.VarChar, 100))
               .Value = EmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.VarChar, 500))
              .Value = remarks;
                cmdObj.Parameters
              .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
              .Value = IsFromNaukriAPI;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateTransferRequest");
                result = -1;
            }
            return result;

        }

        public int UnattendedProfileTransfer(int id, string toThId, string EmpId, string remarks, ref string Message, char? IsFromNaukriAPI = null)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_UnattendedProfileTransfer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.VarChar, 100))
              .Value = toThId;
                cmdObj.Parameters
               .Add(new SqlParameter("@addedBy", SqlDbType.VarChar, 100))
               .Value = EmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.VarChar, 500))
              .Value = remarks;
                cmdObj.Parameters
            .Add(new SqlParameter("@IsFromNaukriAPI", SqlDbType.Char))
            .Value = IsFromNaukriAPI;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateTransferRequest");
                result = -1;
            }
            return result;

        }

        public DataSet CheckTalentIdStatus(string thId, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_CheckTalentIdStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = thId;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "talent";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetGradeBandList");
            }
            return ds;
        }

        public int addJD_PanelClarificationHistory(int Thid, string JDFlag, string PanelFlag, string EmpID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addJDPanelClarificationHistory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ThId", SqlDbType.Int))
                .Value = Thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@JDFlag", SqlDbType.VarChar))
                .Value = JDFlag;
                cmdObj.Parameters
                .Add(new SqlParameter("@PanelFlag", SqlDbType.VarChar))
                .Value = PanelFlag;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addCandidateClarificationHistory");
                result = -1;
            }
            return result;
        }

        public int updateCandidateInterviewDetailsByCid(int Cid, int StatusId, string empId, int DropReasonId, string DropRemark)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateInterviewDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = Cid;
                cmdObj.Parameters
                   .Add(new SqlParameter("@StatusId", SqlDbType.Int))
                   .Value = StatusId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ModifiedBy", SqlDbType.Int))
                .Value = empId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DropReasonID", SqlDbType.Int))
                 .Value = DropReasonId;
                cmdObj.Parameters
                .Add(new SqlParameter("@DropRemark", SqlDbType.NVarChar))
                .Value = DropRemark;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateCandidateInterviewDetailsByCid");
                result = -1;
            }
            return result;
        }

        public DataSet GetJDPanelAvailableDetails(int thid, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getJDPanelAvailableDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ThId", SqlDbType.Int))
                .Value = thid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJDPanelAvailableDetails");
            }
            return ds;
        }


        public int AddProfilePicture(ProfilePictureModel model, string Empid, int IsFilePresent, string FileName = null, string FilePath = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddprofilePicture";
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
                .Value = model.Cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsSignOff", SqlDbType.Int))
                .Value = model.IsSignOff;
                cmdObj.Parameters
                .Add(new SqlParameter("@FileName", SqlDbType.VarChar))
                .Value = FileName;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePath", SqlDbType.VarChar))
               .Value = FilePath;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsFilePresent", SqlDbType.Int))
               .Value = IsFilePresent;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddProfilePicture");
                result = -1;
            }
            return result;
        }

        public DataSet GetProfilePicture(int RoundId, string EmpId, out int result, int? cid = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetProfilePicture";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@RoundId ", SqlDbType.Int))
                .Value = RoundId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProfilePicture");
            }
            return ds;
        }

        public DataSet CheckInterviewStatus(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_CheckInterviewStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CheckInterviewStatus");
            }
            return ds;
        }

        public DataSet getCandidateProfileDetails(string EmpId, out int result,int? cid, int? id, int? profileId)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateProfileDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                    .Add(new SqlParameter("@id", SqlDbType.Int))
                    .Value = id;
                cmdObj.Parameters
                 .Add(new SqlParameter("@profileId", SqlDbType.Int))
                 .Value = profileId;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetailsByCid");
            }
            return ds;
        }

        public int uploadDocVid(uploadDocInt model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddUpdateCandidateVideoIdentityProof";
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
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsConsent", SqlDbType.Int))
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
              .Add(new SqlParameter("@FileNameID", SqlDbType.VarChar))
              .Value = model.FileNameID;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePathID", SqlDbType.NVarChar))
               .Value = model.FilePathID;
                cmdObj.Parameters
              .Add(new SqlParameter("@IDType", SqlDbType.Int))
              .Value = model.IdType;
                cmdObj.Parameters
              .Add(new SqlParameter("@IdNumber", SqlDbType.NVarChar))
              .Value = model.IdNumber;
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

        public int uplaodVideoToSharePoint(uploadVideoInterview model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UploadCandidateVideoIdentityProof";
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
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsConsent", SqlDbType.Int))
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

        public int uplaodTransScriptToSharePoint(uploadTranscript model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UploadCandidateTransScript";
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
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;              
                cmdObj.Parameters
                .Add(new SqlParameter("@FileNameTransScript", SqlDbType.VarChar))
                .Value = model.FileNameTrans;
                cmdObj.Parameters
               .Add(new SqlParameter("@FilePathTransScript", SqlDbType.NVarChar))
               .Value = model.FilePathTrans;
                cmdObj.Parameters
               .Add(new SqlParameter("@sharePointIdTransScript", SqlDbType.NVarChar))
               .Value = model.sharePointIdTrans;
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

        public DataSet GetCandidateVideoIdentityProfilePic(string EmpId, out int result, int? RoundId = null, int? cid = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidateVideoIdentityProfilePic";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@RoundId ", SqlDbType.Int))
                .Value = RoundId;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "profilePic";
                ds.Tables[1].TableName = "profileVid";
                ds.Tables[2].TableName = "profileId";
                ds.Tables[3].TableName = "profileRecentVideo";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateVideoIdentityProfilePic");
            }
            return ds;
        }

        public DataSet GetCandidateFeebackEnableStatusByCid(int cid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateFeebackEnableStatusByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "VideoInt";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateFeebackEnableStatusByCid");
            }
            return ds;
        }

        public VideoImageCampareInterview GetUploadedVideoDetails(int cid, string EmpId)
        {
            VideoImageCampareInterview rd = new VideoImageCampareInterview();
            try
            {
                OpeneConnection();
                string _sql = "getCurrentRoundDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                rd = (VideoImageCampareInterview)RepositryMapper.getMap<VideoImageCampareInterview>(ds);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCurrentRoundDetailsByCid");
            }
            return rd;
        }

        public InterviewRoundDetailsVid GetRoundByCid(int cid, string empId, char isRound = 'N', int roundId = 0, int roundIdPrev = 0)
        {
            DataSet ds = new DataSet();
            InterviewRoundDetailsVid rd = new InterviewRoundDetailsVid();

            try
            {
                OpeneConnection();
                string _sql = "GetRoundByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@roundId", SqlDbType.Int))
              .Value = roundId;
                cmdObj.Parameters
              .Add(new SqlParameter("@roundIdrPrev", SqlDbType.Int))
              .Value = roundIdPrev;
                cmdObj.Parameters
             .Add(new SqlParameter("@isRound", SqlDbType.Char))
             .Value = isRound;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                //  ds = du.GetDataSetWithProc(cmdObj);
                //   ds.Tables[0].TableName = "data";
                ds = du.GetDataSetWithProc(cmdObj);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    rd = (InterviewRoundDetailsVid)RepositryMapper.getMap<InterviewRoundDetailsVid>(ds);
                }
                    
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRoundByCid");
            }
            return rd;
        }

        public InterviewRoundDetailsTrans GetRoundTransDerailsByCid(int cid, string empId, int roundId)
        {
            DataSet ds = new DataSet();
            InterviewRoundDetailsTrans rd = new InterviewRoundDetailsTrans();

            try
            {
                OpeneConnection();
                string _sql = "GetTransscriptDetailsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@roundId", SqlDbType.Int))
              .Value = roundId;
               cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                //  ds = du.GetDataSetWithProc(cmdObj);
                //   ds.Tables[0].TableName = "data";
                ds = du.GetDataSetWithProc(cmdObj);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    rd = (InterviewRoundDetailsTrans)RepositryMapper.getMap<InterviewRoundDetailsTrans>(ds);
                }

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRoundByCid");
            }
            return rd;
        }

        public int updateVideoMatchScoreByRoundId(UpdateVideoMatchScoreByRoundId model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "updateVideoMatchScoreByRoundId";
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
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@VideoMatch", SqlDbType.VarChar))
                .Value = model.VideoMatch;
                cmdObj.Parameters
                .Add(new SqlParameter("@VideoMatchPercent", SqlDbType.VarChar))
                .Value = model.VideoMatchPercent;
                cmdObj.Parameters
                .Add(new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 1000))
                .Value = model.ErrorMessage;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                //.Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateVideoMatchScoreByRoundId");
                result = -1;
            }
            return result;
        }

        public int updateTransScriptScoreByRoundId(UpdateTransScriptScoreByRoundId model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "updateTransScriptScoreByRoundId";
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
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = model.RoundId;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@Questions", SqlDbType.Int))
                //.Value = model.Questions;
                cmdObj.Parameters
                .Add(new SqlParameter("@SentimentOrientation", SqlDbType.NVarChar))
                .Value = model.SentimentOrientation;
                cmdObj.Parameters
               .Add(new SqlParameter("@Recommendation", SqlDbType.NVarChar))
               .Value = model.Recommendation;
                cmdObj.Parameters
                .Add(new SqlParameter("@ApiRespnseStatus", SqlDbType.Int))
                    .Value = model.ApiRespnseStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@ApiRespnseStatusMessage", SqlDbType.VarChar))
                .Value = model.ApiRespnseStatusMessage;
                cmdObj.Parameters
                  .Add(new SqlParameter("@AIInterviewAssesmentArea", SqlDbType.Structured))
                  .Value = ToDataTable<Area>(model.Area);
                cmdObj.Parameters
               .Add(new SqlParameter("@Questions", SqlDbType.Structured))
               .Value = ToDataTable<Questions>(model.Questions);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateVideoMatchScoreByRoundId");
                result = -1;
            }
            return result;
        }


        public DataSet GetVideoComparisonInfoByRoundId(int cid, int roundId, string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetVideoComparisonInfoByRoundId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@roundId", SqlDbType.Int))
                .Value = roundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateFeebackEnableStatusByCid");
            }
            return ds;
        }

        public int SubmitTechnicalQuestionnnaire(TechnicalQuestionnaire obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ADDUpdateTechnicalQuestionnaire";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@RoundId", SqlDbType.Int))
               .Value = obj.roundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@techLanguageFamiliarity", SqlDbType.VarChar, 1000))
                .Value = obj.technicalPracticeSkillForm.familiarProgramTechnolog;
                cmdObj.Parameters
                .Add(new SqlParameter("@techSkillEvaluated", SqlDbType.VarChar, 1000))
                .Value = obj.technicalPracticeSkillForm.technicalSkillsEvaluat;
                cmdObj.Parameters
                .Add(new SqlParameter("@candidateCodingChallenge", SqlDbType.Char, 2))
                .Value = obj.technicalPracticeSkillForm.candidateCodingChallenge;
                cmdObj.Parameters
               .Add(new SqlParameter("@techFileName", SqlDbType.VarChar, 1000))
               .Value = obj.technicalPracticeSkillForm.techFileName;
                cmdObj.Parameters
                .Add(new SqlParameter("@techFilePath", SqlDbType.VarChar, 1000))
                .Value = obj.technicalPracticeSkillForm.techFilePath;
                cmdObj.Parameters
                .Add(new SqlParameter("@assessRoleKnowledge", SqlDbType.VarChar, 1000))
                .Value = obj.fundamentalKnowledgForm.assessRoleKnowledg;
                cmdObj.Parameters
                .Add(new SqlParameter("@candidateApprochComplexPrblm", SqlDbType.VarChar, 1000))
                .Value = obj.prblmSolvingSkillForm.candidateApprochComplexPrblm;
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidatePrblmSolvingApproch", SqlDbType.VarChar, 1000))
                .Value = obj.prblmSolvingSkillForm.candidatePrblmSolvingApproch;
                cmdObj.Parameters
                  .Add(new SqlParameter("@candidatePossesIndustryDomExp", SqlDbType.VarChar, 1000))
                  .Value = obj.industryDomainKnowledgForm.candidatePossesIndustryDomExp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@candidateFitForInfogain", SqlDbType.VarChar, 1000))
                 .Value = obj.CulturatFitAdaptabilityForm.candidateFitForInfogain;
                cmdObj.Parameters
                .Add(new SqlParameter("@candidateAbilityToAdoptChangeWork", SqlDbType.VarChar, 1000))
                .Value = obj.CulturatFitAdaptabilityForm.candidateAbilityToAdoptChangeWork;
                cmdObj.Parameters
                .Add(new SqlParameter("@saveOrDraft", SqlDbType.Char, 1))
                .Value = obj.isSaveOrDraft;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar, 100))
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

        public DataSet GetTechnicalQuestionnnaire(int cid, int roundId, string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTechnicalQuestionnaire";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@roundId", SqlDbType.Int))
                .Value = roundId;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTechnicalQuestionnnaire");
            }
            return ds;
        }

         public DataSet GetTalentTCAdditionalSkillByThId(int thid, string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentTCAdditionalSkillByThId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "AllSkills";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentTCAdditionalSkillByThId");
            }
            return ds;
         }

        public DataSet GetSearchCandidateReport(SearchCandidateModel model, int PageNo, int PageSize,string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_searchCandidateReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Name", SqlDbType.VarChar))
                 .Value = model.Name;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Email", SqlDbType.VarChar))
                 .Value = model.Email;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SkillID", SqlDbType.VarChar))
                 .Value = model.SkillId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SourceId", SqlDbType.VarChar))
                 .Value = model.SourceId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InterviewStatusID", SqlDbType.VarChar))
                 .Value = model.InterviewStatusID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@interviewDropReasonId", SqlDbType.VarChar))
                 .Value = model.interviewDropReasonId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpMin", SqlDbType.Int))
                 .Value = model.ExpMin;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpMax", SqlDbType.Int))
                 .Value = model.ExpMax;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentId", SqlDbType.NVarChar))
                 .Value = model.TalentId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NPMax", SqlDbType.Int))
                 .Value = model.NPMax;
                cmdObj.Parameters
                 .Add(new SqlParameter("@NoOfPastDays", SqlDbType.Int))
                 .Value = model.NoOfPastDays;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RecruiterEmpID", SqlDbType.VarChar))
                 .Value = model.RecruiterEmpID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountId", SqlDbType.VarChar))
                 .Value = model.AccountId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectID", SqlDbType.VarChar))
                 .Value = model.ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@HiringManager", SqlDbType.VarChar))
                 .Value = model.HiringManager;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RequisitionType", SqlDbType.VarChar))
                 .Value = model.RequisitionType;
                cmdObj.Parameters
                .Add(new SqlParameter("@Partner", SqlDbType.VarChar))
                .Value = model.partner;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = PageNo;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                 .Value = PageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offerstatus", SqlDbType.VarChar))
                 .Value = model.offerStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerDropReasonId", SqlDbType.VarChar))
                .Value = model.offerDropReasonId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProfileAdditionStartDate", SqlDbType.VarChar))
                .Value = model.ProfileAdditionStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@ProfileAdditionEnddate", SqlDbType.VarChar))
                .Value = model.ProfileAdditionEnddate;
                cmdObj.Parameters
                .Add(new SqlParameter("@InterviewType", SqlDbType.VarChar))
                .Value = model.InterviewType;
                cmdObj.Parameters
                .Add(new SqlParameter("@TrLocationId", SqlDbType.VarChar))
                .Value = model.TrLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@OrgName", SqlDbType.VarChar))
               .Value = model.OrgName;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SearchCandidate");
            }
            return ds;
        }

        public DataSet GetOpenRequisitionListByDateLapse(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getOpenRequisitionListByDateLapse";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId ", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "auth";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpenRequisitionListByDateLapse");
            }
            return ds;
        }

        public int ScheduleCoderByteInterviewByPanel(FeedbackModel fb ,string empId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ScedulePanelCoderByteInterview";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = fb.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@ModifiedBy", SqlDbType.NVarChar))
                .Value = empId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@codebyteTestId", SqlDbType.NVarChar))
                 .Value = fb.codebyteTestId;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderBytePrivateUrl", SqlDbType.NVarChar))
                .Value = fb.coderBytePrivateUrl;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderBytePublicUrl", SqlDbType.NVarChar))
                .Value = fb.coderBytePublicUrl;
                cmdObj.Parameters
                .Add(new SqlParameter("@coderByteDisplayName", SqlDbType.NVarChar))
                .Value = fb.coderByteDisplayName;
                cmdObj.Parameters
                .Add(new SqlParameter("@OnlineAssessmentBy", SqlDbType.Int))
                .Value = fb.OnlineAssessmentBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ScheduleCoderByteInterviewByPanel");
                result = -1;
            }
            return result;
        }

           public void SendC2HInterviewScheduleNotification(int cid,int roundId, string EmpID)
        {
            try
            {
                OpeneConnection();
                string _sql = "SendC2HInterviewScheduleMailer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                 cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@Roundid", SqlDbType.Int))
                .Value = roundId;           
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendC2HInterviewScheduleNotification");
               
            }
            
        }


        public DataSet GetTehRoundCountByCid(int cid, string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetTehRoundCountByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_GetTehRoundCountByCid");
            }
            return ds;
        }


        public int AddUpdateQuestionList(updateQuestionAuto model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddUpdateQuestionList";
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
                  .Add(new SqlParameter("@autoQuestionList", SqlDbType.Structured))
                  .Value = ToDataTable<QuestionAuto>(model.QuestionAuto);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateQuestionList");
                result = -1;
            }
            return result;
        }


        public DataSet GetQuestionsByCid(int cid, string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetQuestionsByCid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getQuestionsByCid");
            }
            return ds;
        }

         public int AddUpdateQuestionListByPanel(updateQuestionAuto model, string Empid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddUpdateQuestionListByPanel";
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
                  .Add(new SqlParameter("@autoQuestionList", SqlDbType.Structured))
                  .Value = ToDataTable<QuestionAuto>(model.QuestionAuto);
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateQuestionListByPanel");
                result = -1;
            }
            return result;
        }


        public DataSet GetCanddidateResumeDetails(int cid, string empId, int IsProfileInterview = 0,char ProfileType ='N')
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCanddidateResumeDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
              .Add(new SqlParameter("@IsProfileInterview", SqlDbType.Int))
              .Value = IsProfileInterview;
                cmdObj.Parameters
            .Add(new SqlParameter("@ProfileType", SqlDbType.Char))
            .Value = ProfileType;
                ds = du.GetDataSetWithProc(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCanddidateResumeDetails");
            }
            return ds;
        }


        public int UpdateAIResumeRatingByCid(AddUpdateAIResumeRating model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_AddUpdateAIResumeRatingByCid";
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
                  .Add(new SqlParameter("@OverallRating", SqlDbType.Decimal))
                  .Value = model.OverallRating;
                cmdObj.Parameters
                  .Add(new SqlParameter("@Recommendation", SqlDbType.NVarChar))
                  .Value = model.Recommendation;
                cmdObj.Parameters
              .Add(new SqlParameter("@ApiRespnseStatus", SqlDbType.Int))
               .Value = model.ApiRespnseStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@ApiRespnseStatusMessage", SqlDbType.NVarChar))
                .Value = model.ApiRespnseStatusMessage;
                cmdObj.Parameters
                    .Add(new SqlParameter("@RatingsSkills", SqlDbType.Structured))
                    .Value = ToDataTable<Rating>(model.Ratings);

                cmdObj.Parameters
             .Add(new SqlParameter("@ProfileId", SqlDbType.Int))
              .Value = model.ProfileId;

                cmdObj.Parameters
             .Add(new SqlParameter("@IsProfileInterview", SqlDbType.Int))
              .Value = model.IsProfileInterview;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OverallPercentage", SqlDbType.Decimal))
                 .Value = model.OverallPercentage;
                cmdObj.Parameters
                .Add(new SqlParameter("@mandatoryRating", SqlDbType.Decimal))
                .Value = model.mandatoryRating;
                cmdObj.Parameters
                .Add(new SqlParameter("@goodToHaveRating", SqlDbType.Decimal))
                .Value = model.goodToHaveRating;
                cmdObj.Parameters
           .Add(new SqlParameter("@ProfileTypeAS", SqlDbType.Char))
            .Value = model.ProfileType;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_AddUpdateAIResumeRatingByCid");
                result = -1;
            }
            return result;
        }

        public DataSet getInterviewDocumentPath(int cid, int roundid, string docType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getInterviewDocumentPath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@roundid", SqlDbType.Int))
                .Value = roundid;
                cmdObj.Parameters
                .Add(new SqlParameter("@docType", SqlDbType.Char))
                .Value = docType;
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

        public DataSet getGovtIdDocPath(int cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getGovtIdDocPath";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getGovtIdDocPath");
            }
            return ds;
        }

         public int updateConsetnByRecForVideoCompare(int cid, string EmpId, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "updateConsetnByRecForVideoCompare";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateConsetnByRecForVideoCompare");
                result = -1;
            }
            return result;

        }


        public DataSet GetAIResumeRatingByCid(int id, int IsProfileInterview, string empId,char? profileSource ='N',  int? profileId=0)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection(); // Consider fixing the typo: should probably be OpenConnection()

                string _sql = "sp_GetAIResumeRatingByCid";
                using (SqlCommand cmdObj = new SqlCommand(_sql, ConCampus))
                {
                    cmdObj.CommandType = CommandType.StoredProcedure;

                    // Adding parameters in a cleaner way
                    cmdObj.Parameters.Add("@cid", SqlDbType.Int).Value = id;
                    cmdObj.Parameters.Add("@IsProfileInterview", SqlDbType.Int).Value = IsProfileInterview;
                    cmdObj.Parameters.Add("@empId", SqlDbType.VarChar, 50).Value = empId ?? string.Empty;
                    cmdObj.Parameters.Add("@ProfileId", SqlDbType.Int).Value = profileId;
                    cmdObj.Parameters.Add("@profileSource", SqlDbType.Char).Value = profileSource;

                    // Assuming 'du' is a helper class for data operations
                    ds = du.GetDataSetWithProc(cmdObj);

                    if (ds.Tables.Count > 0)
                    {
                        ds.Tables[0].TableName = "data";
                        ds.Tables[1].TableName = "Skills";
                    }
                }

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAIResumeRatingByCid");
            }

            return ds;
        }










    }
}