using ATSAPI.App_Data;
using ATSAPI.Models;
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

namespace ATSAPI.Repositry
{
    public class TalentRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "TalentRepository";
        DataUtility du;
        public TalentRepository()
        {
            du = new DataUtility();
        }

        public DataSet GetStates(int CountryID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetStates";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryID", SqlDbType.Int))
               .Value = CountryID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetStates");
            }
            return ds;
        }

        public DataSet GetRequirementType(int EmpUnit)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRequisitionTypesForTalent";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRequirementType");
            }
            return ds;
        }

        public DataSet GetCities(int CountryID, string StateName)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCities";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@StateName", SqlDbType.VarChar))
               .Value = StateName;
                cmdObj.Parameters
              .Add(new SqlParameter("@CountryID", SqlDbType.Int))
              .Value = CountryID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCities");
            }
            return ds;
        }

        public DataSet GetDeliveryUnit(int empUnitID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDeliveryUnit";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpUnitID", SqlDbType.Int))
              .Value = empUnitID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDeliveryUnit");
            }
            return ds;
        }

        public DataSet GetAccountsList(int ReqTypeID, int DUID, int Unit = 1)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAccountForTalentCreation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                .Value = ReqTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@DUID", SqlDbType.Int))
                .Value = DUID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Unit", SqlDbType.Int))
                .Value = Unit;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAccountForTalentCreation");
            }
            return ds;
        }

        public DataSet GetProjectsList(int AccountID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetProjectForTalentCreation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.Int))
                .Value = AccountID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProjectForTalentCreation");
            }
            return ds;
        }

        public DataSet GetOpportunityDetails(int ReqTypeID, string AccountID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOpportunityDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = AccountID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                .Value = ReqTypeID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpportunityDetails");
            }
            return ds;
        }

        public DataSet GetOpportunityDetailsForMapping(int ReqTypeID, string AccountID, int THID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOpportunityDetailsForMapping";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = AccountID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                .Value = ReqTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = THID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpportunityDetailsForMapping");
            }
            return ds;
        }

        public DataSet GetReplacementReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetReplacementReasons";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReplacementReason");
            }
            return ds;
        }
        public DataSet GetDatesChangeReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDatesChangeReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDatesChangeReason");
            }
            return ds;
        }

        public DataSet GetSFDCClient(string AccountID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSFDCClientDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = AccountID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSFDCClientDetails");
            }
            return ds;
        }

        public DataSet GetTeamDetailsFromPricing(string OppID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "talent_GetTeamDetailsFromPricing";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@OppID", SqlDbType.VarChar))
                .Value = OppID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTeamDetailsFromPricing");
            }
            return ds;
        }

        public DataSet GetDesignationCategories()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDesignationCategories";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDesignationCategories");
            }
            return ds;
        }

        public DataSet GetDesignations(int DesigCateID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "TalentGetDesignations";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@DesigCateID", SqlDbType.Int))
               .Value = DesigCateID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDesignations");
            }
            return ds;
        }

        public DataSet GetQualifications()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetQualifications";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetQualifications");
            }
            return ds;
        }

        public DataSet GetPrimarySkills()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "TalentGetPrimarySkills";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPrimarySkills");
            }
            return ds;
        }

        public DataSet GetSubSkills(int PriSkillID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "TalentGetSubSkills";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@PriSkillID", SqlDbType.Int))
               .Value = PriSkillID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubSkills");
            }
            return ds;
        }

        public DataSet GetSalaryDetails(int ExpRangeID, int JobFamilyID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "TalentGetSalaryDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@ExpRangeID", SqlDbType.Int))
               .Value = ExpRangeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@JobFamilyID", SqlDbType.Int))
               .Value = JobFamilyID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalaryDetails");
            }
            return ds;
        }

        public DataSet GetDivisions()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_DivisionMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferModuleEnabled", SqlDbType.Char))
               .Value = "N";
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalaryDetails");
            }
            return ds;
        }

        public DataSet GetEmployeeType()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetEmployeeType";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmployeeType");
            }
            return ds;
        }
        public DataSet GetBidType()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetBidType";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetBidType");
            }
            return ds;
        }
        //public DataSet GetRaisedTHIDDetails(string EmpID, string StatusID, string AccountIDs, string LocationIDs, string StartDate, string EndDate, string recruiterId, int Page, int PageSize, string search)

        public DataSet GetRaisedTHIDDetails(string EmpID, GetRaisedTHIDDetails obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetRaisedTHIDDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
              .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusID", SqlDbType.VarChar))
              .Value = obj.StatusID;
                cmdObj.Parameters
              .Add(new SqlParameter("@Page", SqlDbType.Int))
              .Value = obj.page;
                cmdObj.Parameters
              .Add(new SqlParameter("@PageSize", SqlDbType.Int))
              .Value = obj.pageSize;
                cmdObj.Parameters
              .Add(new SqlParameter("@search", SqlDbType.NVarChar))
              .Value = obj.search;
                // Added by jivan
                cmdObj.Parameters
             .Add(new SqlParameter("@AccountIDs", SqlDbType.NVarChar))
             .Value = obj.AccountIDs;
                cmdObj.Parameters
             .Add(new SqlParameter("@LocationIDs", SqlDbType.NVarChar))
             .Value = obj.LocationIDs;
                cmdObj.Parameters
           .Add(new SqlParameter("@StartDate", SqlDbType.NVarChar))
           .Value = obj.StartDate;
                cmdObj.Parameters
           .Add(new SqlParameter("@EndDate", SqlDbType.NVarChar))
           .Value = obj.EndDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar))
            .Value = obj.recruiterId;
                cmdObj.Parameters
                   .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
                 .Value = obj.sortColumn;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             .Value = obj.sortDir;
                cmdObj.Parameters
                .Add(new SqlParameter("@OppIds", SqlDbType.NVarChar))
                 .Value = obj.oppId;
                cmdObj.Parameters
             .Add(new SqlParameter("@BizOps", SqlDbType.NVarChar))
              .Value = obj.bizOpsLead;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRaisedTHIDDetails");
            }
            return ds;
        }

        public DataSet GetTHIDDetailsByTHID(string EmpID, int THID, out int result)
        {
            DataSet ds = new DataSet();
            result= 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTHIDDetailsByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
              .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@THID", SqlDbType.Int))
              .Value = THID;
                cmdObj.Parameters
              .Add(new SqlParameter("@AttachmentPath", SqlDbType.NVarChar))
              .Value = ConfigurationManager.AppSettings["TalentAttachments"];
                ds = du.GetDataSetWithProc(cmdObj);
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "MandatorySkills";
                ds.Tables[2].TableName = "GoodToHaveSkills";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTHIDDetailsByTHID");
            }
            return ds;
        }


        public int AddUpdateTalentIDDetails(TalentIDMaster td, string AddedBy, string DeptID, ref string THID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateTalentIDDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = td.THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeUnitID", SqlDbType.Int))
                 .Value = td.EmployeeUnitID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JoinLocID", SqlDbType.Int))
                 .Value = td.JoinLocID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@StateID", SqlDbType.Int))
                 .Value = td.StateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CityID", SqlDbType.Int))
                 .Value = td.CityID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                 .Value = td.ReqTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
                 .Value = td.DivisionID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsInternalMovement", SqlDbType.Char))
                 .Value = td.IsInternalMovement;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DUID", SqlDbType.Int))
                 .Value = td.DUID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                 .Value = td.AccountID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectID", SqlDbType.Int))
                 .Value = td.ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BidType", SqlDbType.VarChar))
                 .Value = td.BidType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SFDCClientID", SqlDbType.VarChar))
                 .Value = td.SFDCClientID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppID", SqlDbType.VarChar))
                 .Value = td.OppID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OddsOfWinning", SqlDbType.Int))
                 .Value = td.OddsOfWinning;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppType", SqlDbType.VarChar))
                 .Value = td.OppType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ISFDCID", SqlDbType.VarChar))
                 .Value = td.ISFDCID;
                cmdObj.Parameters
                .Add(new SqlParameter("@BookingDGM", SqlDbType.Decimal))
                .Value = td.BookingDGM;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PricingRoleID", SqlDbType.Int))
                 .Value = td.PricingRoleID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExclusiveInfogain", SqlDbType.Char))
                 .Value = td.ExclusiveInfogain;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobSummary", SqlDbType.NVarChar))
                 .Value = td.JobSummary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobDesc", SqlDbType.NVarChar))
                 .Value = td.JobDesc;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DesignationID", SqlDbType.Int))
                 .Value = td.DesignationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpRangeID", SqlDbType.Int))
                 .Value = td.ExpRangeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TravelCost", SqlDbType.Decimal))
                 .Value = td.TravelCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@MaxHiringCost", SqlDbType.Decimal))
                 .Value = td.MaxHiringCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectEndDate", SqlDbType.NVarChar))
                 .Value = td.ProjectEndDate;
                cmdObj.Parameters
                    .Add(new SqlParameter("@ClosedDate", SqlDbType.NVarChar))
                    .Value = td.ClosedDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@QualificationID", SqlDbType.Int))
                 .Value = td.QualificationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubSkillID", SqlDbType.Int))
                 .Value = td.SubSkillID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AdditionalSkills", SqlDbType.VarChar))
                 .Value = td.AdditionalSkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmploymentTypeID", SqlDbType.Int))
                 .Value = td.EmploymentTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer1", SqlDbType.VarChar))
                 .Value = td.Interviewer1;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer2", SqlDbType.VarChar))
                 .Value = td.Interviewer2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsBillable", SqlDbType.Char))
                 .Value = td.IsBillable;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BookingMarginPer", SqlDbType.Decimal))
                 .Value = td.BookingMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpectedMarginPer", SqlDbType.Decimal))
                 .Value = td.ExpectedMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BillableRate", SqlDbType.Decimal))
                 .Value = td.BillableRate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pBillingStartDate", SqlDbType.VarChar))
                 .Value = td.pBillingStartDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pOnboardDate", SqlDbType.VarChar))
                 .Value = td.pOnboardDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsClientIntReq", SqlDbType.Char))
                 .Value = td.IsClientIntReq;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsVisaReady", SqlDbType.Char))
                 .Value = td.IsVisaReady;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SpecialRequest", SqlDbType.VarChar))
                 .Value = td.SpecialRequest;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeCount", SqlDbType.Int))
                 .Value = td.EmployeeCount;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DeptID", SqlDbType.Int))
                 .Value = DeptID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementFor", SqlDbType.VarChar))
                 .Value = td.ReplacementFor;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementReasonID", SqlDbType.Int))
                 .Value = td.ReplacementReasonID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InvestmentApproved", SqlDbType.VarChar))
                 .Value = td.InvestmentApproved;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Attachment", SqlDbType.NVarChar))
                 .Value = td.Attachment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                 .Value = AddedBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar))
                .Value = td.Remark;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
               .Value = td.ActionTaken;
                cmdObj.Parameters
               .Add(new SqlParameter("@SubCateID", SqlDbType.VarChar))
               .Value = td.subReasonCate;
                // cmdObj.Parameters
                //.Add(new SqlParameter("@assignmentEndDate", SqlDbType.VarChar))
                //.Value = td.assignmentEndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentCubeId", SqlDbType.Int))
                 .Value = td.TalentCubeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentCubeRoleId", SqlDbType.Int))
                 .Value = td.TalentCubeRoleId;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentCubeGradeId", SqlDbType.Int))
                .Value = td.TalentCubeGradeId;
                cmdObj.Parameters
                    .Add(new SqlParameter("@TCSkill1", SqlDbType.NVarChar))
                    .Value = td.TCSkill1;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill2", SqlDbType.NVarChar))
                   .Value = td.TCSkill2;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill3", SqlDbType.NVarChar))
                   .Value = td.TCSkill3;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TCSkill4", SqlDbType.NVarChar))
                  .Value = td.TCSkill4;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentExperienceId", SqlDbType.Int))
                 .Value = td.TCExperienceID;
                cmdObj.Parameters
               .Add(new SqlParameter("@THIDApprovalAttachment", SqlDbType.NVarChar))
               .Value = td.THIDApprovalAttachment;
                cmdObj.Parameters
               .Add(new SqlParameter("@THIDApprovalAttachmentPath", SqlDbType.NVarChar))
               .Value = td.THIDApprovalAttachmentPath;
                cmdObj.Parameters
                  .Add(new SqlParameter("@BillableHours", SqlDbType.NVarChar))
                  .Value = td.BillableHours;
                cmdObj.Parameters
                 .Add(new SqlParameter("@C2HEmpEmail", SqlDbType.NVarChar))
                 .Value = td.C2HEmpEmail;
                //cmdObj.Parameters
                //  .Add(new SqlParameter("@C2HEmpRemarks", SqlDbType.NVarChar))
                //  .Value = td.C2HEmpRemarks;
                //cmdObj.Parameters
                // .Add(new SqlParameter("@C2HEmpContractEndDate", SqlDbType.NVarChar))
                // .Value = td.C2HEmpContractEndDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@reasonToChangeOnboardDate", SqlDbType.Int))
                //.Value = td.reasonToChangeOnboardDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@reasonToChangeBillingSDate", SqlDbType.Int))
                //.Value = td.reasonToChangeBillingSDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@reasonToChangeAssignEndDate", SqlDbType.Int))
                //.Value = td.reasonToChangeAssignEndDate;

                cmdObj.Parameters
                 .Add(new SqlParameter("@Tech1InterviewBy", SqlDbType.Int))
                 .Value = td.Tech1InterviewBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OnlineAssessMentBy", SqlDbType.Int))
                 .Value = td.OnlineAssesmentBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CoderBytePublicKey", SqlDbType.NVarChar))
                 .Value = td.coderBytePublicUrl;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AssessmentLink", SqlDbType.NVarChar))
                 .Value = td.AssessmentLink;
                cmdObj.Parameters
                 .Add(new SqlParameter("@coderByteDisplayName", SqlDbType.NVarChar))
                 .Value = td.coderByteDisplayName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForNotOptOnlineAssessment", SqlDbType.Int))
                 .Value = td.ReasonForNotOptOnlineAssessment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForOptExternal", SqlDbType.Int))
                 .Value = td.ReasonForOptExternal;
                cmdObj.Parameters
                .Add(new SqlParameter("@CoderByteTestId", SqlDbType.NVarChar))
                .Value = td.coderByteTestId;
                cmdObj.Parameters
                .Add(new SqlParameter("@MandatorySkills", SqlDbType.NVarChar))
                .Value = td.MandatorySkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BillingType", SqlDbType.Int))
                 .Value = td.BillingType;
                cmdObj.Parameters
                   .Add(new SqlParameter("@goodToHaveSkill", SqlDbType.NVarChar))
                   .Value = td.goodToHaveSkill;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TalentCubePrimarySkillId", SqlDbType.Int))
                   .Value = td.CubePrimaySkillId;
                cmdObj.Parameters
                  .Add(new SqlParameter("@ClientWorkRequirementId", SqlDbType.Int))
                .Value = td.ClientWorkRequirementId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubWorkRequirementId", SqlDbType.Int))
                 .Value = td.SubWorkRequirementId;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pBillingStartDateUTC", SqlDbType.VarChar))
                  .Value = td.pBillingStartDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pOnboardDateUTC", SqlDbType.VarChar))
                  .Value = td.pOnboardDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TimezoneIana", SqlDbType.NVarChar))
                  .Value = td.TimeZoneIana;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TimezoneWin", SqlDbType.NVarChar))
                 .Value = td.TimeZoneWin;
                cmdObj.Parameters
               .Add(new SqlParameter("@SkillRatings", SqlDbType.Structured))
               .Value = ToDataTable<SkillRatingType>(td.SkillRatingType);
                cmdObj.Parameters
                .Add(new SqlParameter("@IsCache", SqlDbType.Char))
                .Value = td.IsCache;
                cmdObj.Parameters
                .Add(new SqlParameter("@RepGradeChangeReasonId", SqlDbType.Int))
                .Value = td.RepGradeChangeReasonId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateTalentIDDetails");
                result = -1;
            }
            return result;
        }


        public int UpdateGDLAction(int THID, char ActionTaken, string Remarks, string UpdatedBy, out string message, int? SubCateID = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateGDLAction";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
                 .Value = ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubCateID", SqlDbType.Int))
                .Value = SubCateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateGDLAction");
                result = -1;
            }
            return result;
        }

        public int TalentIDClone(TalentIDMaster td, string AddedBy, int DeptID, ref string THID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CloneMultiTalentID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = td.THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeUnitID", SqlDbType.Int))
                 .Value = td.EmployeeUnitID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JoinLocID", SqlDbType.Int))
                 .Value = td.JoinLocID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@StateID", SqlDbType.Int))
                 .Value = td.StateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CityID", SqlDbType.Int))
                 .Value = td.CityID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                 .Value = td.ReqTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
                 .Value = td.DivisionID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsInternalMovement", SqlDbType.Char))
                 .Value = td.IsInternalMovement;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DUID", SqlDbType.Int))
                 .Value = td.DUID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                 .Value = td.AccountID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectID", SqlDbType.Int))
                 .Value = td.ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BidType", SqlDbType.VarChar))
                 .Value = td.BidType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SFDCClientID", SqlDbType.VarChar))
                 .Value = td.SFDCClientID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppID", SqlDbType.VarChar))
                 .Value = td.OppID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OddsOfWinning", SqlDbType.Int))
                 .Value = td.OddsOfWinning;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppType", SqlDbType.VarChar))
                 .Value = td.OppType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ISFDCID", SqlDbType.VarChar))
                 .Value = td.ISFDCID;
                cmdObj.Parameters
                .Add(new SqlParameter("@BookingDGM", SqlDbType.Decimal))
                .Value = td.BookingDGM;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PricingRoleID", SqlDbType.Int))
                 .Value = td.PricingRoleID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExclusiveInfogain", SqlDbType.Char))
                 .Value = td.ExclusiveInfogain;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobSummary", SqlDbType.NVarChar))
                 .Value = td.JobSummary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobDesc", SqlDbType.NVarChar))
                 .Value = td.JobDesc;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DesignationID", SqlDbType.Int))
                 .Value = td.DesignationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpRangeID", SqlDbType.Int))
                 .Value = td.ExpRangeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TravelCost", SqlDbType.Decimal))
                 .Value = td.TravelCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@MaxHiringCost", SqlDbType.Decimal))
                 .Value = td.MaxHiringCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectEndDate", SqlDbType.NVarChar))
                 .Value = td.ProjectEndDate;
                cmdObj.Parameters
                    .Add(new SqlParameter("@ClosedDate", SqlDbType.NVarChar))
                    .Value = td.ClosedDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@QualificationID", SqlDbType.Int))
                 .Value = td.QualificationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubSkillID", SqlDbType.Int))
                 .Value = td.SubSkillID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AdditionalSkills", SqlDbType.VarChar))
                 .Value = td.AdditionalSkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmploymentTypeID", SqlDbType.Int))
                 .Value = td.EmploymentTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer1", SqlDbType.VarChar))
                 .Value = td.Interviewer1;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer2", SqlDbType.VarChar))
                 .Value = td.Interviewer2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsBillable", SqlDbType.Char))
                 .Value = td.IsBillable;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BookingMarginPer", SqlDbType.Decimal))
                 .Value = td.BookingMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpectedMarginPer", SqlDbType.Decimal))
                 .Value = td.ExpectedMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BillableRate", SqlDbType.Decimal))
                 .Value = td.BillableRate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pBillingStartDate", SqlDbType.VarChar))
                 .Value = td.pBillingStartDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pOnboardDate", SqlDbType.VarChar))
                 .Value = td.pOnboardDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsClientIntReq", SqlDbType.Char))
                 .Value = td.IsClientIntReq;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsVisaReady", SqlDbType.Char))
                 .Value = td.IsVisaReady;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SpecialRequest", SqlDbType.VarChar))
                 .Value = td.SpecialRequest;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeCount", SqlDbType.Int))
                 .Value = td.EmployeeCount;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DeptID", SqlDbType.Int))
                 .Value = DeptID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementFor", SqlDbType.VarChar))
                 .Value = td.ReplacementFor;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementReasonID", SqlDbType.Int))
                 .Value = td.ReplacementReasonID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InvestmentApproved", SqlDbType.VarChar))
                 .Value = td.InvestmentApproved;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Attachment", SqlDbType.NVarChar))
                 .Value = td.Attachment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                 .Value = AddedBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar))
                .Value = td.Remark;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
               .Value = td.ActionTaken;
                cmdObj.Parameters
               .Add(new SqlParameter("@SubCateID", SqlDbType.VarChar))
               .Value = td.subReasonCate;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentCubeId", SqlDbType.Int))
                 .Value = td.TalentCubeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentCubeRoleId", SqlDbType.Int))
                 .Value = td.TalentCubeRoleId;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentCubeGradeId", SqlDbType.Int))
                .Value = td.TalentCubeGradeId;
                cmdObj.Parameters
                    .Add(new SqlParameter("@TCSkill1", SqlDbType.NVarChar))
                    .Value = td.TCSkill1;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill2", SqlDbType.NVarChar))
                   .Value = td.TCSkill2;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill3", SqlDbType.NVarChar))
                   .Value = td.TCSkill3;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TCSkill4", SqlDbType.NVarChar))
                  .Value = td.TCSkill4;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentExperienceId", SqlDbType.Int))
                 .Value = td.TCExperienceID;
                cmdObj.Parameters
               .Add(new SqlParameter("@THIDApprovalAttachment", SqlDbType.NVarChar))
               .Value = td.THIDApprovalAttachment;
                cmdObj.Parameters
               .Add(new SqlParameter("@THIDApprovalAttachmentPath", SqlDbType.NVarChar))
               .Value = td.THIDApprovalAttachmentPath;
                cmdObj.Parameters
                  .Add(new SqlParameter("@BillableHours", SqlDbType.NVarChar))
                  .Value = td.BillableHours;
                cmdObj.Parameters
                 .Add(new SqlParameter("@C2HEmpEmail", SqlDbType.NVarChar))
                 .Value = td.C2HEmpEmail;

                cmdObj.Parameters
                 .Add(new SqlParameter("@Tech1InterviewBy", SqlDbType.Int))
                 .Value = td.Tech1InterviewBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OnlineAssessMentBy", SqlDbType.Int))
                 .Value = td.OnlineAssesmentBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CoderBytePublicKey", SqlDbType.NVarChar))
                 .Value = td.coderBytePublicUrl;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AssessmentLink", SqlDbType.NVarChar))
                 .Value = td.AssessmentLink;
                cmdObj.Parameters
                 .Add(new SqlParameter("@coderByteDisplayName", SqlDbType.NVarChar))
                 .Value = td.coderByteDisplayName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForNotOptOnlineAssessment", SqlDbType.Int))
                 .Value = td.ReasonForNotOptOnlineAssessment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReasonForOptExternal", SqlDbType.Int))
                 .Value = td.ReasonForOptExternal;
                cmdObj.Parameters
                .Add(new SqlParameter("@CoderByteTestId", SqlDbType.NVarChar))
                .Value = td.coderByteTestId;
                cmdObj.Parameters
                .Add(new SqlParameter("@MandatorySkills", SqlDbType.NVarChar))
                .Value = td.MandatorySkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BillingType", SqlDbType.Int))
                 .Value = td.BillingType;
                cmdObj.Parameters
                   .Add(new SqlParameter("@goodToHaveSkill", SqlDbType.NVarChar))
                   .Value = td.goodToHaveSkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Frequency", SqlDbType.Int))
                 .Value = td.Frequency;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsCache", SqlDbType.Char))
                .Value = td.IsCache;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TalentCubePrimarySkillId", SqlDbType.Int))
                   .Value = td.CubePrimaySkillId;
                cmdObj.Parameters
               .Add(new SqlParameter("@ClientWorkRequirementId", SqlDbType.Int))
              .Value = td.ClientWorkRequirementId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubWorkRequirementId", SqlDbType.Int))
                 .Value = td.SubWorkRequirementId;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pBillingStartDateUTC", SqlDbType.VarChar))
                  .Value = td.pBillingStartDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pOnboardDateUTC", SqlDbType.VarChar))
                  .Value = td.pOnboardDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TimezoneIana", SqlDbType.NVarChar))
                  .Value = td.TimeZoneIana;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TimezoneWin", SqlDbType.NVarChar))
                 .Value = td.TimeZoneWin;
                cmdObj.Parameters
               .Add(new SqlParameter("@SkillRatings", SqlDbType.Structured))
               .Value = ToDataTable<SkillRatingType>(td.SkillRatingType);
                cmdObj.Parameters
               .Add(new SqlParameter("@RepGradeChangeReasonId", SqlDbType.Int))
               .Value = td.RepGradeChangeReasonId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "TalentIDClone");
                result = -1;
            }
            return result;
        }


        //public int TalentIDClone(int THID, int Frequency, string DeptId, string AddedBy, out string message)
        //{
        //    int result = 0;
        //    try
        //    {
        //        OpeneConnection();
        //        string _sql = "CreateTalentIDClone";
        //        cmdObj = new SqlCommand(_sql, ConCampus);
        //        cmdObj.CommandType = CommandType.StoredProcedure;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
        //        cmdObj.Parameters
        //       .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@THID", SqlDbType.Int))
        //         .Value = THID;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@Frequency", SqlDbType.Int))
        //         .Value = Frequency;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@DeptId", SqlDbType.Int))
        //         .Value = DeptId;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
        //         .Value = AddedBy;
        //        du.ExecuteSqlProcedure(cmdObj);
        //        result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
        //        message = Convert.ToString(cmdObj.Parameters["@message"].Value);
        //        CloseConnection();
        //    }
        //    catch (Exception ex)
        //    {
        //        message = "There is some error! Try again later.";
        //        ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateGDLAction");
        //        result = -1;
        //    }
        //    return result;
        //}

        public int UpdateTalentIdStatus(int THID, int StatusId, string EmpId, out string message, int? ReasonId = null, string EmpName = null, string subReason = null, string Comments = "", string Remark = null, string ProposedEmpId = null, string ExfulfiledEmpId = null, int? SourceId = null, DateTime? Dateofjoining = null, DateTime? offerdate = null, string ReferrerName = null, int? SubProfileId = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateTalentIdStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = EmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReasonId", SqlDbType.Int))
                .Value = ReasonId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpName", SqlDbType.VarChar))
                .Value = EmpName;
                cmdObj.Parameters
                .Add(new SqlParameter("@subReason", SqlDbType.VarChar))
                .Value = subReason;
                cmdObj.Parameters
                .Add(new SqlParameter("@StatusId", SqlDbType.Int))
                .Value = StatusId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                .Value = Remark;
                cmdObj.Parameters
              .Add(new SqlParameter("@SourceId", SqlDbType.Int))
              .Value = SourceId;
                cmdObj.Parameters
              .Add(new SqlParameter("@Dateofjoining", SqlDbType.DateTime))
              .Value = Dateofjoining;
                cmdObj.Parameters
              .Add(new SqlParameter("@offeredDate", SqlDbType.DateTime))
              .Value = offerdate;
                cmdObj.Parameters
              .Add(new SqlParameter("@ProposedEmpId", SqlDbType.VarChar))
              .Value = ProposedEmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@ExfulfiledEmpId", SqlDbType.VarChar))
              .Value = ExfulfiledEmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@ReferrerName", SqlDbType.VarChar))
              .Value = ReferrerName;
                cmdObj.Parameters
              .Add(new SqlParameter("@SubProfileId", SqlDbType.Int))
              .Value = SubProfileId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateTalentIdStatus");
                result = -1;
            }
            return result;
        }

        public int AddUpdateIJP(THIDIJP obj, string EmpID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateIJP";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = obj.THID;
                cmdObj.Parameters
                .Add(new SqlParameter("@IJPName", SqlDbType.NVarChar))
                .Value = obj.IJPName;
                cmdObj.Parameters
                .Add(new SqlParameter("@IJPDesc", SqlDbType.NVarChar))
                .Value = obj.IJPJobDesc;
                cmdObj.Parameters
                .Add(new SqlParameter("@IJPStartDate", SqlDbType.VarChar))
                .Value = obj.IJPStartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@IJPEndDate", SqlDbType.VarChar))
                .Value = obj.IJPEndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = EmpID;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateIJP");
                result = -1;
            }
            return result;
        }

        public DataSet GetIJPTHIDDetails(int THID, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetIJPTHIDDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
               .Value = THID;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
              .Value = EmpID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPTHIDDetails");
            }
            return ds;
        }

        public DataSet GetTalentStatus(string ActionTaken)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_TalentStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionTaken", SqlDbType.VarChar))
                .Value = ActionTaken;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentStatus");
            }
            return ds;
        }
        public DataSet GetReferBackReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetReferBackReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReferBackReason");
            }
            return ds;
        }


        public DataSet GetEmployeeToReferTalentId(ProposedEmp obj, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getEmployeeToReferTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@pageSize", SqlDbType.Int))
               .Value = obj.pagesize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.VarChar))
                .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@type", SqlDbType.Int))
               .Value = obj.Type;
                cmdObj.Parameters
              .Add(new SqlParameter("@Skill", SqlDbType.VarChar))
              .Value = obj.Skill;
                cmdObj.Parameters
              .Add(new SqlParameter("@Departments", SqlDbType.VarChar))
              .Value = obj.Departments;
                cmdObj.Parameters
              .Add(new SqlParameter("@MAXExperince", SqlDbType.Int))
              .Value = obj.MAXExperince;
                cmdObj.Parameters
              .Add(new SqlParameter("@MINExperince", SqlDbType.Int))
              .Value = obj.MINExperince;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmployeeToReferTalentId");
            }
            return ds;
        }

        public int AddProposedEmployeesAgainstTHID(int THID, string EmpIds, string addedby)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddProposedEmployeesAgainstTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@addedby", SqlDbType.VarChar))
                 .Value = addedby;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpIds", SqlDbType.VarChar))
                .Value = EmpIds;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddProposedEmployeesAgainstTHID");
                result = -1;
            }
            return result;
        }

        public DataSet GetIJPViewList(GetIJPViewList obj, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_IJPViewList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = empId;
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
                    .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
                    .Value = obj.PracticeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPViewList");
            }
            return ds;
        }

        public DataSet GetIJPApplicantList(int talentID, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SP_IJPApplicatntList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@TALENTID", SqlDbType.Int))
                .Value = talentID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                result = Convert.ToInt32(outputParam.Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPApplicantList");
            }
            return ds;
        }

        public int ApplyForIJP(int IJPID, string EmpIds, string TalentId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ApplyForIJP";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@addedby", SqlDbType.VarChar))
                 .Value = EmpIds;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = IJPID;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentId", SqlDbType.VarChar))
                .Value = TalentId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApplyForIJP");
                result = -1;
            }
            return result;
        }
        public DataSet GetProposedEmployeesTHIDWise(int THID, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetProposedEmployeesTHIDWise";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = THID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetProposedEmployeesTHIDWise");
            }
            return ds;
        }

        public DataSet GetOfferedCandidateDetailsForTalent(int talentID, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetOfferedCandidateDetailsForTalent";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ThId", SqlDbType.Int))
                .Value = talentID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferedCandidateDetailsForTalent");
            }
            return ds;
        }

        public int CancelTHID(int THID, int SubCateID, string Remarks, string UpdatedBy, string DeptID, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CancelTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubCateID", SqlDbType.Int))
                .Value = SubCateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DeptID", SqlDbType.Int))
                 .Value = DeptID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CancelTHID");
                result = -1;
            }
            return result;
        }
        public DataSet GetCancellationCategory()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "spGetCancellationCategory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCancellationCategory");
            }
            return ds;
        }

        public DataSet GetCancellationSubCategory(int CateID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "spGetCancellationSubCategory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CateID", SqlDbType.Int))
                 .Value = CateID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "spGetCancellationSubCategory");
            }
            return ds;
        }


        public int UpdateFinanceAction(int THID, char ActionTaken, int? SubCateID, string Remarks, string UpdatedBy, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateFinanceAction";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
                 .Value = ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubCateID", SqlDbType.Int))
                .Value = SubCateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateFinanceAction");
                result = -1;
            }
            return result;
        }

        public int UpdateTHIDDetailsWMG(int THID, string fulfilmentDate, string Remarks, string UpdatedBy, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "spUpdateTHIDDetailsWMG";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@fulfilmentDate", SqlDbType.VarChar))
                 .Value = fulfilmentDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                //cmdObj.Parameters
                // .Add(new SqlParameter("@reasonToChangeCommitDateWMG", SqlDbType.Int))
                // .Value = reasonToChangeCommitDateWMG;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateTHIDDetailsWMG");
                result = -1;
            }
            return result;
        }

        public DataSet GetSentBackToWMGReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_SentToWMGReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSentBackToWMGReason");
            }
            return ds;
        }

        public DataSet GetStatusList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetStatusList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetStatusList");
            }
            return ds;
        }

        public DataSet GetReferBackReasonForWMG()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetReferBackReasonForWMG";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "Sp_GetReferBackReasonForWMG");
            }
            return ds;
        }

        public DataSet getConverstionEmpList(string empId, out int result,int? reqType = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getConverstionEmpList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@reqType", SqlDbType.Int))
                 .Value = reqType;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getConverstionEmpList");
            }
            return ds;
        }

        public int MappingOppIDtoTHID(int THID, string OppID, int ReqTypeID, string Remarks, string UpdatedBy, out string message, char IsBillable, decimal BillableRate, string BidType, int? AccountID = null, string SFDCAccountID = null, int? ProjectID = null, string BillingHour = null, string pBillingStartDate = null, int? BillingType = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "MappingOppIDtoTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;

                cmdObj.Parameters
                 .Add(new SqlParameter("@OppID", SqlDbType.VarChar))
                 .Value = OppID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                .Value = ReqTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@SFDCAccountID", SqlDbType.VarChar))
                .Value = SFDCAccountID;
                cmdObj.Parameters
              .Add(new SqlParameter("@AccountID", SqlDbType.Int))
              .Value = AccountID;
                cmdObj.Parameters
              .Add(new SqlParameter("@ProjectID", SqlDbType.Int))
              .Value = ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@Isbillable", SqlDbType.Char))
                .Value = IsBillable;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingRate", SqlDbType.Decimal))
                .Value = BillableRate;
                cmdObj.Parameters
                .Add(new SqlParameter("@BillingHours", SqlDbType.NVarChar))
                .Value = BillingHour;
                cmdObj.Parameters
                .Add(new SqlParameter("@BillingStartDate", SqlDbType.NVarChar))
                .Value = pBillingStartDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@BillingType", SqlDbType.Int))
              .Value = BillingType;
                cmdObj.Parameters
                .Add(new SqlParameter("@BidType", SqlDbType.VarChar))
                .Value = BidType;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "MappingOppIDtoTHID");
                result = -1;
            }
            return result;
        }


        public DataSet GetStatusHistoryForTalentID(int talentID, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTalentIDStatusHistory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ThId", SqlDbType.Int))
                .Value = talentID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetStatusHistoryForTalentID");
            }
            return ds;
        }


        public int AddOrRemoveFromWebsite(int talentID, char ActionTaken, string empId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddOrRemoveFromWebsite";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = talentID;
                cmdObj.Parameters
               .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
               .Value = empId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Action", SqlDbType.Char))
               .Value = ActionTaken;
                du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "MappingOppIDtoTHID");
                result = -1;
            }
            return result;
        }

        public int ApprovedOrRejectThIdFromMail(int THID, char ActionTaken, string Remarks, string UpdatedBy, out string message, int? SubCateID = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ApprovedOrRejectThIdFromMail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
                 .Value = ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubCateID", SqlDbType.Int))
                .Value = SubCateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApprovedOrRejectThIdFromMail");
                result = -1;
            }
            return result;
        }

        public int UpdateTalentIDDetails(TalentIDMaster td, string AddedBy, ref string THID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateTalentIDDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = td.THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeUnitID", SqlDbType.Int))
                 .Value = td.EmployeeUnitID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReqTypeID", SqlDbType.Int))
                 .Value = td.ReqTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DivisionID", SqlDbType.Int))
                 .Value = td.DivisionID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsInternalMovement", SqlDbType.Char))
                 .Value = td.IsInternalMovement;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DUID", SqlDbType.Int))
                 .Value = td.DUID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                 .Value = td.AccountID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectID", SqlDbType.Int))
                 .Value = td.ProjectID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BidType", SqlDbType.VarChar))
                 .Value = td.BidType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SFDCClientID", SqlDbType.VarChar))
                 .Value = td.SFDCClientID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppID", SqlDbType.VarChar))
                 .Value = td.OppID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OddsOfWinning", SqlDbType.Int))
                 .Value = td.OddsOfWinning;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OppType", SqlDbType.VarChar))
                 .Value = td.OppType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ISFDCID", SqlDbType.VarChar))
                 .Value = td.ISFDCID;
                cmdObj.Parameters
                .Add(new SqlParameter("@BookingDGM", SqlDbType.Int))
                .Value = td.BookingDGM;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PricingRoleID", SqlDbType.Int))
                 .Value = td.PricingRoleID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExclusiveInfogain", SqlDbType.Char))
                 .Value = td.ExclusiveInfogain;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobSummary", SqlDbType.NVarChar))
                 .Value = td.JobSummary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JobDesc", SqlDbType.NVarChar))
                 .Value = td.JobDesc;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DesignationID", SqlDbType.Int))
                 .Value = td.DesignationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpRangeID", SqlDbType.Int))
                 .Value = td.ExpRangeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TravelCost", SqlDbType.Decimal))
                 .Value = td.TravelCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@MaxHiringCost", SqlDbType.Decimal))
                 .Value = td.MaxHiringCost;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ProjectEndDate", SqlDbType.NVarChar))
                 .Value = td.ProjectEndDate;
                cmdObj.Parameters
                    .Add(new SqlParameter("@ClosedDate", SqlDbType.NVarChar))
                    .Value = td.ClosedDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@QualificationID", SqlDbType.Int))
                 .Value = td.QualificationID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubSkillID", SqlDbType.Int))
                 .Value = td.SubSkillID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AdditionalSkills", SqlDbType.VarChar))
                 .Value = td.AdditionalSkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmploymentTypeID", SqlDbType.Int))
                 .Value = td.EmploymentTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer1", SqlDbType.VarChar))
                 .Value = td.Interviewer1;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Interviewer2", SqlDbType.VarChar))
                 .Value = td.Interviewer2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsBillable", SqlDbType.Char))
                 .Value = td.IsBillable;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BookingMarginPer", SqlDbType.Decimal))
                 .Value = td.BookingMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ExpectedMarginPer", SqlDbType.Decimal))
                 .Value = td.ExpectedMarginPer;
                cmdObj.Parameters
                 .Add(new SqlParameter("@BillableRate", SqlDbType.Decimal))
                 .Value = td.BillableRate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pBillingStartDate", SqlDbType.VarChar))
                 .Value = td.pBillingStartDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pOnboardDate", SqlDbType.VarChar))
                 .Value = td.pOnboardDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsClientIntReq", SqlDbType.Char))
                 .Value = td.IsClientIntReq;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IsVisaReady", SqlDbType.Char))
                 .Value = td.IsVisaReady;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SpecialRequest", SqlDbType.VarChar))
                 .Value = td.SpecialRequest;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmployeeCount", SqlDbType.Int))
                 .Value = td.EmployeeCount;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementFor", SqlDbType.VarChar))
                 .Value = td.ReplacementFor;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ReplacementReasonID", SqlDbType.Int))
                 .Value = td.ReplacementReasonID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@InvestmentApproved", SqlDbType.VarChar))
                 .Value = td.InvestmentApproved;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Attachment", SqlDbType.NVarChar))
                 .Value = td.Attachment;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                 .Value = AddedBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar))
                .Value = td.Remark; cmdObj.Parameters
.Add(new SqlParameter("@SubCateID", SqlDbType.VarChar))
.Value = td.subReasonCate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentCubeId", SqlDbType.Int))
                 .Value = td.TalentCubeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TalentCubeRoleId", SqlDbType.Int))
                 .Value = td.TalentCubeRoleId;
                cmdObj.Parameters
            .Add(new SqlParameter("@TalentCubeGradeId", SqlDbType.Int))
            .Value = td.TalentCubeGradeId;
                cmdObj.Parameters
                    .Add(new SqlParameter("@TCSkill1", SqlDbType.NVarChar))
                    .Value = td.TCSkill1;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill2", SqlDbType.NVarChar))
                   .Value = td.TCSkill2;
                cmdObj.Parameters
                   .Add(new SqlParameter("@TCSkill3", SqlDbType.NVarChar))
                   .Value = td.TCSkill3;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TCSkill4", SqlDbType.NVarChar))
                 .Value = td.TCSkill4;
                cmdObj.Parameters
                .Add(new SqlParameter("@MandatorySkills", SqlDbType.NVarChar))
                .Value = td.MandatorySkills;
                cmdObj.Parameters
                 .Add(new SqlParameter("@goodToHaveSkill", SqlDbType.NVarChar))
                 .Value = td.goodToHaveSkill;
                cmdObj.Parameters
                 .Add(new SqlParameter("@C2HEmpEmail", SqlDbType.NVarChar))
                 .Value = td.C2HEmpEmail;
                cmdObj.Parameters
                .Add(new SqlParameter("@BillingType", SqlDbType.Int))
                .Value = td.BillingType;
                cmdObj.Parameters
                 .Add(new SqlParameter("@JoinLocID", SqlDbType.Int))
                 .Value = td.JoinLocID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@StateID", SqlDbType.Int))
                 .Value = td.StateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@CityID", SqlDbType.Int))
                 .Value = td.CityID;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsCache", SqlDbType.Char))
                .Value = td.IsCache;
                cmdObj.Parameters
                .Add(new SqlParameter("@TalentCubePrimarySkillId", SqlDbType.Int))
                .Value = td.CubePrimaySkillId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ClientWorkRequirementId", SqlDbType.Int))
               .Value = td.ClientWorkRequirementId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@SubWorkRequirementId", SqlDbType.Int))
                 .Value = td.SubWorkRequirementId;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pBillingStartDateUTC", SqlDbType.VarChar))
                  .Value = td.pBillingStartDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@pOnboardDateUTC", SqlDbType.VarChar))
                  .Value = td.pOnboardDateUTC;
                cmdObj.Parameters
                  .Add(new SqlParameter("@TimezoneIana", SqlDbType.NVarChar))
                  .Value = td.TimeZoneIana;
                cmdObj.Parameters
                 .Add(new SqlParameter("@TimezoneWin", SqlDbType.NVarChar))
                 .Value = td.TimeZoneWin;
                cmdObj.Parameters
            .Add(new SqlParameter("@SkillRatings", SqlDbType.Structured))
            .Value = ToDataTable<SkillRatingType>(td.SkillRatingType);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateTalentIDDetails");
                result = -1;
            }
            return result;
        }

        public DataSet GetAllRaisedTHIDs(string EmpID, string StatusID, string AccountIDs, string Locations, int Page, int PageSize, string search, string PracticeId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAllRaisedTHIDs";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
              .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusID", SqlDbType.VarChar))
              .Value = StatusID;
                cmdObj.Parameters
             .Add(new SqlParameter("@AccountIDs", SqlDbType.VarChar))
             .Value = AccountIDs;
                cmdObj.Parameters
             .Add(new SqlParameter("@LocationIDs", SqlDbType.VarChar))
             .Value = Locations;
                cmdObj.Parameters
              .Add(new SqlParameter("@Page", SqlDbType.Int))
              .Value = Page;
                cmdObj.Parameters
              .Add(new SqlParameter("@PageSize", SqlDbType.Int))
              .Value = PageSize;
                cmdObj.Parameters
              .Add(new SqlParameter("@search", SqlDbType.NVarChar))
              .Value = search;
                cmdObj.Parameters
              .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
              .Value = PracticeId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllRaisedTHIDs");
            }
            return ds;
        }

        public int CloseTHID(int OfferId, string EmpId, string dateOfJoining, string UpdatedBy, string Remarks, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SP_CloseTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferId", SqlDbType.Int))
                 .Value = OfferId;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.Int))
                .Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DOJ", SqlDbType.VarChar))
                 .Value = dateOfJoining;
                cmdObj.Parameters
                 .Add(new SqlParameter("@updatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CloseTHID");
                result = -1;
            }
            return result;
        }

        public int AddUpdateOfferDetailsByTHID(List<TalentIDOffer> td, string AddedBy, out string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateOfferDetailsByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferDetails", SqlDbType.Structured))
                 .Value = ToDataTable<TalentIDOffer>(td);
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.NVarChar))
                .Value = AddedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                Message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateOfferDetailsByTHID");
                result = -1;
            }
            return result;
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


        public DataSet GetSkillByTalentCube(int TalentCubeCode)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSkillByTalentCube";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@TalentCubeCode", SqlDbType.Int))
               .Value = TalentCubeCode;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSkillByTalentCube");
            }
            return ds;
        }

        public DataSet GetTalentCubeBySkill(string EmpId, int? PrimarySkillId = null, string SkillIds = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentCubeBySkill";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrimarySkillId", SqlDbType.Int))
               .Value = PrimarySkillId;
                cmdObj.Parameters
              .Add(new SqlParameter("@SkillIds", SqlDbType.NVarChar))
              .Value = SkillIds;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentCubeBySkill");
            }
            return ds;
        }

        public DataSet GetJDByTCAndRole(string EmpId, int TalentCubeCode, int TCRole)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetJDByTCAndRole";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@TalentCubeCode", SqlDbType.Int))
               .Value = TalentCubeCode;
                cmdObj.Parameters
              .Add(new SqlParameter("@TCRole", SqlDbType.NVarChar))
              .Value = TCRole;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJDByTCAndRole");
            }
            return ds;
        }

        public DataSet GetExperienceByGradeID(int GradeID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetExperienceByGradeID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@GradeID", SqlDbType.Int))
               .Value = GradeID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetExperienceByGradeID");
            }
            return ds;
        }

        public DataSet GetRaisedTHIDDetailsCount(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetRaisedTHIDDetailsCount";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
               .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "FilteredStatus";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRaisedTHIDDetailsCount");
            }
            return ds;
        }

        public DataSet GetSubSkillsByIds(string skillId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSubSkillsByIds";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@skillID", SqlDbType.NVarChar))
               .Value = skillId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubSkillsByIds");
            }
            return ds;
        }

        public int updateRequisitionDetailsPriSecRecruiter(updateTalentId obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateRequisitionDetailsPriSecRecriter";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateRequisitionDetailsPriSecRecruiter");
                result = -1;
            }
            return result;

        }
        public int updateRequisitionFullfillmentDetails(updateTalentId obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateRequisitionFullfillmentDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thId", SqlDbType.VarChar, 100))
                .Value = obj.thId;
                cmdObj.Parameters
               .Add(new SqlParameter("@fullfillmentDate", SqlDbType.VarChar, 200))
               .Value = obj.fullfillmentDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@tagRemarkId", SqlDbType.Int))
               .Value = obj.tagRemarkId;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.VarChar, 500))
              .Value = obj.fullfillmentRemark;
                cmdObj.Parameters
              .Add(new SqlParameter("@empTypeId", SqlDbType.Int))
              .Value = obj.employmentType;
                cmdObj.Parameters
              .Add(new SqlParameter("@compRange", SqlDbType.Int))
              .Value = obj.CompRange;
                cmdObj.Parameters
                .Add(new SqlParameter("@isEmpReferral", SqlDbType.Char))
                .Value = obj.isEmpReferral;
                cmdObj.Parameters
                .Add(new SqlParameter("@isMandatorySourcing", SqlDbType.Char))
                .Value = obj.isMandatorySourcing;
                cmdObj.Parameters
              .Add(new SqlParameter("@fullfillmentGrade", SqlDbType.Int))
              .Value = obj.fullfillmentGrade;
                cmdObj.Parameters
              .Add(new SqlParameter("@fullfillmentCompBand", SqlDbType.VarChar, 500))
              .Value = obj.fullfillmentCompBand;
                cmdObj.Parameters
            .Add(new SqlParameter("@fullfillmentCompBandFull", SqlDbType.VarChar, 500))
            .Value = obj.fullfillmentCompBandFull;
                cmdObj.Parameters
               .Add(new SqlParameter("@updatedBy", SqlDbType.VarChar, 100))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@reasonforDelay", SqlDbType.Int))
               .Value = obj.ReasonforDelay;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsFullFillmentDateChange", SqlDbType.Char))
                .Value = obj.IsFullFillmentDateChange;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateRequisitionFullfillmentDetails");
                result = -1;
            }
            return result;

        }

        public DataSet GetTagCommitmentHistory(string EmpId, int thid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTagCommitmentHistory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.Int))
               .Value = thid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTagCommitmentHistory");
            }
            return ds;
        }

        public DataSet GetAllDetailsOfContractualEmployee(string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetConversionDetailsByEmpID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "TalentCubeDetails";
                ds.Tables[1].TableName = "AccountDetails";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllDetailsOfContractualEmployee");
            }
            return ds;
        }

        public DataSet getEmpListForReplacement(string empId, out int result, int? ReplacementType = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getEmpListForReplacement";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@ReplacementType", SqlDbType.Int))
               .Value = ReplacementType;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getEmpListForReplacement");
            }
            return ds;
        }

        public DataSet CheckReplacementIdCreated(string ReplacementEmpId, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CheckReplacementIdCreated";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
               .Add(new SqlParameter("ReplacementEmpId", SqlDbType.VarChar))
               .Value = ReplacementEmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CheckReplacementIdCreated");
            }
            return ds;
        }

        public int UpdateTalentIdStatusByWmg(UpdateTalentIdStatusWmg fb, string EmpId, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateTalentIdStatusWmg";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
               .Value = fb.THID;
                cmdObj.Parameters
             .Add(new SqlParameter("@StatusId", SqlDbType.Int))
             .Value = fb.StatusId;
                cmdObj.Parameters
             .Add(new SqlParameter("@CategoryId", SqlDbType.Int))
             .Value = fb.CategoryId;
                cmdObj.Parameters
             .Add(new SqlParameter("@ApprovedBy", SqlDbType.Int))
             .Value = fb.ApprovedBy;
                cmdObj.Parameters
             .Add(new SqlParameter("@ApprovedOn", SqlDbType.VarChar))
             .Value = fb.ApprovedOn;

                cmdObj.Parameters
           .Add(new SqlParameter("@ApprovedOver", SqlDbType.Int))
           .Value = fb.ApprovedOver;
                cmdObj.Parameters
           .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
           .Value = fb.Remarks;
                cmdObj.Parameters
           .Add(new SqlParameter("@AttachmentName", SqlDbType.VarChar))
           .Value = fb.AttachmentName;
                cmdObj.Parameters
              .Add(new SqlParameter("@AttachmentPath", SqlDbType.VarChar))
              .Value = fb.AttachmentPath;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateTalentIdStatusByWmg");
                result = -1;
            }
            return result;
        }

        public DataSet GetIJPApplyValidation(int thid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_IJPApplyValidation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPApplyValidation");
            }
            return ds;
        }

        public DataSet GetIJPCounts()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetIJPCounts";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "TotalCount";
                ds.Tables[1].TableName = "TodayCount";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIJPCounts");
            }
            return ds;
        }

        public DataSet GetTalentCubeBySubSkill(string EmpId, string SkillIds = null, string SkillIds2 = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentCubeBySubSkill";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@SkillIds", SqlDbType.NVarChar))
              .Value = SkillIds;

                cmdObj.Parameters
            .Add(new SqlParameter("@SkillIds2", SqlDbType.NVarChar))
            .Value = SkillIds2;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentCubeBySkill");
            }
            return ds;
        }

        public int CancelTalentIDByTHID(int THID, char ActionTaken, string Remarks, string UpdatedBy, out string message, int? SubCateID = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CancelTalentIDByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionTaken", SqlDbType.Char))
                 .Value = ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@SubCateID", SqlDbType.Int))
                .Value = SubCateID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                 .Value = Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                 .Value = UpdatedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CancelTalentIDByTHID");
                result = -1;
            }
            return result;
        }

        public DataSet GetBillingTypeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetBillingTypeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetBillingTypeList");
            }
            return ds;
        }
        public DataSet GetTalentUndormantReasons()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentUndormantReasons";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentUndormantReasons");
            }
            return ds;
        }

        public int ReopenTalentId(ReopenTalentDetails OBJ, string EmpID, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ReopenTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.VarChar, 200)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = OBJ.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@thId", SqlDbType.NVarChar))
                .Value = OBJ.thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@CubeId", SqlDbType.VarChar))
                .Value = OBJ.CubeId;
                cmdObj.Parameters
               .Add(new SqlParameter("@ClusterID", SqlDbType.NVarChar))
               .Value = OBJ.ClusterID;
                cmdObj.Parameters
               .Add(new SqlParameter("@RoleID", SqlDbType.NVarChar))
               .Value = OBJ.RoleID;
                cmdObj.Parameters
               .Add(new SqlParameter("@GradeId", SqlDbType.NVarChar))
               .Value = OBJ.GradeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@VarianceMax", SqlDbType.NVarChar))
              .Value = OBJ.VarianceMax;
                cmdObj.Parameters
              .Add(new SqlParameter("@VarianceMid", SqlDbType.NVarChar))
              .Value = OBJ.VarianceMid;
                cmdObj.Parameters
              .Add(new SqlParameter("@added_by", SqlDbType.NVarChar))
              .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@IsReinitiationRequired", SqlDbType.NVarChar))
              .Value = OBJ.IsReinitiationRequired;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
              .Value = OBJ.remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingRateHrInUSD", SqlDbType.Decimal))
                .Value = OBJ.billingRateHrInUSD;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualBillableHours", SqlDbType.Int))
                .Value = OBJ.annualBillableHours;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualRevenueUsd", SqlDbType.Decimal))
                .Value = OBJ.annualRevenueUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualSalaryCostUsd", SqlDbType.Decimal))
                .Value = OBJ.annualSalaryCostUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@benefitsUsd", SqlDbType.Decimal))
                .Value = OBJ.benefitsUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBufferUsd", SqlDbType.Decimal))
                .Value = OBJ.ProjectBufferUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@nonReimbursableTravelCostUsd", SqlDbType.Decimal))
                .Value = OBJ.NonReimbursableTravelCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectSpecificCostUsd", SqlDbType.Decimal))
                .Value = OBJ.projectSpecificCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@dgmCostUsd", SqlDbType.Decimal))
                .Value = OBJ.dgmCostUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@dgmPercentUsd", SqlDbType.Decimal))
                .Value = OBJ.dgmPercentUsd;
                cmdObj.Parameters
             .Add(new SqlParameter("@billingRateHrCurrency", SqlDbType.Decimal))
             .Value = OBJ.billingRateHrCurrency;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingCurrencyId", SqlDbType.Int))
                .Value = OBJ.billingCurrencyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@billableHoursDay", SqlDbType.Int))
                .Value = OBJ.billableHoursDay;
                cmdObj.Parameters
                .Add(new SqlParameter("@DPApprover", SqlDbType.NVarChar))
                .Value = OBJ.DPApproverId;
                cmdObj.Parameters
               .Add(new SqlParameter("@ReaopenReason", SqlDbType.BigInt))
               .Value = OBJ.ReopeningReason;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionId", SqlDbType.Int)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                ActionId = Convert.ToInt32(cmdObj.Parameters["@ActionId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "TransferTalentIdwithTC");
                Message = "There is some error! Try again later.";
                result = -1;
            }
            return result;
        }

        public int ReopenTransferTalentIdNonReinitiation(ReOpenlentIdNonReinitiation obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_TransferReopenTalentIdNonReinitiation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@prevthId", SqlDbType.VarChar))
                .Value = obj.prevthid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@newthid", SqlDbType.VarChar))
                 .Value = obj.newthid;
                //cmdObj.Parameters
                // .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                // .Value = obj.remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@ReaopenReason", SqlDbType.Int))
               .Value = obj.ReopeningReason;
                cmdObj.Parameters
                 .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                 .Value = EmpId;

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

        public DataSet GetJoinedCandidateDetailsByTHID(int THID, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getJoinedCandidateDetailsByThid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@THID", SqlDbType.Int))
                .Value = THID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJoinedCandidateDetailsByTHID");
            }
            return ds;
        }


        public DataSet getProfileListByLocation(int? thid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getProfileListByLocation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.Int))
                .Value = thid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getInfogainLocationsByLoc");
            }
            return ds;
        }


        public DataSet GetSubProfileListById(int id)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getSubProfileListById";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getSubProfileListById");
            }
            return ds;
        }

        public int UndormantTalentIDByTHID(int THID, string RevisedOnbDate, int UndormantReason, string UpdatedBy, out string message, string RevisedBillingDate = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UndormantTid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
               .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THID", SqlDbType.Int))
                 .Value = THID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RevisedOnbDate", SqlDbType.NVarChar))
                 .Value = RevisedOnbDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@RevisedBillingDate", SqlDbType.NVarChar))
                .Value = RevisedBillingDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                .Value = UpdatedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@undormantReason", SqlDbType.Int))
                 .Value = UndormantReason;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UndormantTalentIDByTHID");
                result = -1;
            }
            return result;
        }


        public DataSet GetNumberOfOffersOnTid(int THID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GeNumberOfOfferOnTid";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
               .Value = THID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetNumberOfOffersOnTid");
            }
            return ds;
        }

        public DataSet getTalentDocument(int thid, char docType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getTalentDocument";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.Int))
                .Value = thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@docType", SqlDbType.Char))
                .Value = docType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTalentDocument");
            }
            return ds;
        }

        public DataSet GetAllocationDetailsByTid(int THID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllocationDetailsByTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
               .Value = THID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllocationDetailsByTid");
            }
            return ds;
        }

        public DataSet GetPrimarySkillsByTalentCube(int TalentCubeCode)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetPrimarySkillsByTalentCube";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@TalentCubeCode", SqlDbType.Int))
               .Value = TalentCubeCode;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSkillByTalentCube");
            }
            return ds;
        }
        public DataSet GetClientWorkRequirements()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetClientWorkRequirements";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetClientWorkRequirements");
            }
            finally
            {
                CloseConnection(); // Ensure connection is closed in finally block
            }
            return ds;
        }
        public DataSet GetSubClientWorkRequirements()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSubClientWorkRequirements";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubClientWorkRequirements");
            }
            finally
            {
                CloseConnection(); // Ensure connection is closed in finally block
            }
            return ds;
        }

        public int AddUpdateTalentOfferDetails(List<TalentOfferDetails> td, string AddedBy, out string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateOfferDetailsByTHIDForPoland";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 500))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@THIDOfferDetails", SqlDbType.Structured))
                 .Value = ToDataTable<TalentOfferDetails>(td);
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.NVarChar))
                .Value = AddedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                Message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateOfferDetailsByTHID");
                result = -1;
            }
            return result;
        }
        public DataSet GetTalentIdOfferdetails(int THID, string empId, out int result, int? OfferId = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTalentIdOfferdetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@THID", SqlDbType.Int))
               .Value = THID;
                cmdObj.Parameters
              .Add(new SqlParameter("@OfferId", SqlDbType.Int))
              .Value = OfferId;
                cmdObj.Parameters
            .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
            .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentIdOfferdetails");
            }
            return ds;
        }

        public DataSet DgmCalculaterForPoland(dgmCalcPoland obj, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "DgmCalculaterForPoland";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@locationId", SqlDbType.Int))
                .Value = obj.JoiningLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@cadidateTypeId", SqlDbType.Int))
               .Value = obj.cadidateTypeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingRate", SqlDbType.Decimal))
                .Value = obj.billingRate;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingCurrencyId", SqlDbType.Int))
                .Value = obj.billingCurrencyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferedCTC", SqlDbType.Decimal))
                .Value = obj.OfferedCTC;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningBonus", SqlDbType.Decimal))
                .Value = obj.joiningBonus;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBuffer", SqlDbType.Decimal))
                .Value = obj.projectBuffer;
                cmdObj.Parameters
                .Add(new SqlParameter("@NonReimbursableTravelCost", SqlDbType.Decimal))
                .Value = obj.NonReimbursableTravelCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectSpecificCost", SqlDbType.Decimal))
                .Value = obj.projectSpecificCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@billableHoursDay", SqlDbType.Int))
                .Value = obj.billableHoursDay;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DgmCalculaterForPoland");
                ds = null;
            }
            return ds;
        }

        public int UpdateCandidateOfferStatusForPoland(OfferStatusDetails obj, string UpdatedBy, out string message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdateCandidateOfferStatusForPoland";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferId", SqlDbType.Int))
                 .Value = obj.OfferId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferStatus", SqlDbType.Int))
                 .Value = obj.OfferStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmployeeId", SqlDbType.VarChar))
                .Value = obj.EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@DOJ", SqlDbType.NVarChar))
                 .Value = obj.dateOfJoing;
                cmdObj.Parameters
                 .Add(new SqlParameter("@updatedBy", SqlDbType.NVarChar))
                 .Value = UpdatedBy;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
                 .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfDecline", SqlDbType.DateTime))
                .Value = obj.DeclineDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfDeclineUtc", SqlDbType.DateTime))
                .Value = obj.DeclineDateUtc;
                cmdObj.Parameters
                .Add(new SqlParameter("@DeclineCategory", SqlDbType.Int))
                .Value = obj.DeclineCategory;
                cmdObj.Parameters
                .Add(new SqlParameter("@DeclineRemarks", SqlDbType.NVarChar))
                .Value = obj.DeclineRemarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@message", SqlDbType.VarChar, 500)).Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                message = "There is some error! Try again later.";
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateCandidateOfferStatusForPoland");
                result = -1;
            }
            return result;
        }

        public DataSet GetRaisedTHIDDetailsReport(string EmpID, GetRaisedTHIDDetails obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRaisedTHIDDetailsReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
              .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@StatusID", SqlDbType.VarChar))
              .Value = obj.StatusID;
                cmdObj.Parameters
              .Add(new SqlParameter("@Page", SqlDbType.Int))
              .Value = obj.page;
                cmdObj.Parameters
              .Add(new SqlParameter("@PageSize", SqlDbType.Int))
              .Value = obj.pageSize;
                cmdObj.Parameters
              .Add(new SqlParameter("@search", SqlDbType.NVarChar))
              .Value = obj.search;
                // Added by jivan
                cmdObj.Parameters
             .Add(new SqlParameter("@AccountIDs", SqlDbType.NVarChar))
             .Value = obj.AccountIDs;
                cmdObj.Parameters
             .Add(new SqlParameter("@LocationIDs", SqlDbType.NVarChar))
             .Value = obj.LocationIDs;
                cmdObj.Parameters
           .Add(new SqlParameter("@StartDate", SqlDbType.NVarChar))
           .Value = obj.StartDate;
                cmdObj.Parameters
           .Add(new SqlParameter("@EndDate", SqlDbType.NVarChar))
           .Value = obj.EndDate;
                cmdObj.Parameters
            .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar))
            .Value = obj.recruiterId;
             //   cmdObj.Parameters
             //      .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
             //    .Value = obj.sortColumn;
             //   cmdObj.Parameters
             //  .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             //.Value = obj.sortDir;
                cmdObj.Parameters
                .Add(new SqlParameter("@OppIds", SqlDbType.NVarChar))
                 .Value = obj.oppId;
                cmdObj.Parameters
             .Add(new SqlParameter("@BizOps", SqlDbType.NVarChar))
              .Value = obj.bizOpsLead;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRaisedTHIDDetailsReport");
            }
            return ds;
        }


    }
}