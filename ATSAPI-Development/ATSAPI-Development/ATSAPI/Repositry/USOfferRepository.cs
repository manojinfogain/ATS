using ATSAPI.App_Data;
using ATSAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ATSAPI.Repositry
{
    public class USOfferRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "USOfferRepository";
        DataUtility du;
        public USOfferRepository()
        {
            du = new DataUtility();
        }

        public DataSet GetVisaTypes()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetVisaTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVisaTypes");
            }
            return ds;
        }

        public DataSet GetI9RepresentativeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetI9RepresentativeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetI9RepresentativeList");
            }
            return ds;
        }

        public DataSet GetLegalEntity()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetLegalEntity";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetLegalEntity");
            }
            return ds;
        }

        public DataSet GetUSOfferTypeMasterList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetUSOfferTypeMasterList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetUSOfferTypeMasterList");
            }
            return ds;
        }

        public DataSet GetDepartmentList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDepartmentList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDepartmentList");
            }
            return ds;
        }

        public DataSet GetHireVsRehireList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetHireVsRehireList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetHireVsRehireList");
            }
            return ds;
        }

        public DataSet GetRemoteStatusList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRemoteStatusList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRemoteStatusList");
            }
            return ds;
        }


        public DataSet GetFLSAClassificationList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetFLSAClassificationList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetFLSAClassificationList");
            }
            return ds;
        }

        public DataSet GetTalentCubeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentCubeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentCubeList");
            }
            return ds;
        }

        public DataSet GetNumberOfApprovers(int TCID, int gradeID, decimal ctc, decimal joiningBonus, int CityID, string Empid, int? CondidateTypeId = null)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetNumberOfApproversRequiredUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@TCID", SqlDbType.Int))
                .Value = TCID;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeID", SqlDbType.Int))
                .Value = gradeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ctc", SqlDbType.Decimal))
                .Value = ctc;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningBonus", SqlDbType.Decimal))
                .Value = joiningBonus;
                cmdObj.Parameters
                .Add(new SqlParameter("@CityID", SqlDbType.Int))
                .Value = CityID;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@CondidateTypeId", SqlDbType.Int))
               .Value = CondidateTypeId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetNumberOfRecruiters");
                ds = null;
            }
            return ds;
        }


        public DataSet DgmCalculater(dgmCalcModelUS obj, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "DgmCalculaterUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmployeeTypeID", SqlDbType.Int))
                .Value = obj.EmployeeTypeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
               .Value = obj.SalaryType;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualCTC", SqlDbType.Decimal))
                .Value = obj.annualCTC;
                cmdObj.Parameters
               .Add(new SqlParameter("@PerformanceBonus", SqlDbType.Decimal))
               .Value = obj.PerformanceBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningBonus", SqlDbType.Decimal))
               .Value = obj.joiningBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@RelocationBonus", SqlDbType.Decimal))
               .Value = obj.RelocationBonus;
                cmdObj.Parameters
                .Add(new SqlParameter("VisaCost", SqlDbType.Decimal))
                .Value = obj.VisaCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@ClientBillingRate", SqlDbType.Decimal))
                .Value = obj.ClientBillingRate;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DgmCalculater");
                ds = null;
            }
            return ds;
        }

        public DataSet getTagHeadApproverList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getTagHeadApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@LocationID", SqlDbType.Int))
               .Value = 3;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTagHeadApproverList");
            }
            return ds;
        }

        public DataSet getApproverList(string EmpId, int type, int cid, int ReqType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getApproverListUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@type", SqlDbType.Int))
               .Value = type;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@reqType", SqlDbType.Int))
               .Value = ReqType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getApproverListUS");
            }
            return ds;
        }

        public DataSet GetSelectedCandidatesList(string EmpId, OfferGenerationFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAllSelectedCandidatesList_US";
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
               .Add(new SqlParameter("@approverMe", SqlDbType.NVarChar, 200))
               .Value = obj.pendingWithMe;

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
                //cmdObj.Parameters
                // .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                // .Value = search;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSelectedCandidatesList");
            }
            return ds;
        }

        public int addUpdateOfferApprovalForUS(USOfferApprovalModel obj, string empId, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdateOfferApprovalforUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferID", SqlDbType.Int))
               .Value = obj.OfferID;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@FirstName", SqlDbType.VarChar))
               .Value = obj.FirstName;
                cmdObj.Parameters
               .Add(new SqlParameter("@LastName", SqlDbType.VarChar))
               .Value = obj.LastName;
                cmdObj.Parameters
               .Add(new SqlParameter("@PreferedName", SqlDbType.VarChar))
               .Value = obj.PreferedName;
                cmdObj.Parameters
               .Add(new SqlParameter("@Division", SqlDbType.Int))
               .Value = obj.Division;
                cmdObj.Parameters
              .Add(new SqlParameter("@VisaId", SqlDbType.Int))
              .Value = obj.VisaId;
                cmdObj.Parameters
              .Add(new SqlParameter("@I9RepresentativeId", SqlDbType.Int))
              .Value = obj.I9RepresentativeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@LegalEntityId", SqlDbType.Int))
              .Value = obj.LegalEntityId;
                cmdObj.Parameters
              .Add(new SqlParameter("@OfferTypeId", SqlDbType.Int))
              .Value = obj.OfferTypeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmploymentTypeId", SqlDbType.Int))
              .Value = obj.EmploymentTypeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@DepartmentId", SqlDbType.Int))
              .Value = obj.DepartmentId;
                cmdObj.Parameters
              .Add(new SqlParameter("@EmpUnit", SqlDbType.Int))
              .Value = obj.EmpUnit;
                cmdObj.Parameters
              .Add(new SqlParameter("@Resource", SqlDbType.Int))
              .Value = obj.ResourceId;
                cmdObj.Parameters
              .Add(new SqlParameter("@Title", SqlDbType.Int))
              .Value = obj.TitleId;
                cmdObj.Parameters
              .Add(new SqlParameter("@GradeId", SqlDbType.Int))
              .Value = obj.GradeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@TalentCubecode", SqlDbType.Int))
              .Value = obj.TalentCubecode;
                cmdObj.Parameters
              .Add(new SqlParameter("@NewHireOrRehireId", SqlDbType.Int))
              .Value = obj.NewHireOrRehireId;
                cmdObj.Parameters
              .Add(new SqlParameter("@RemoteStatusId", SqlDbType.Int))
              .Value = obj.RemoteStatusId;
                cmdObj.Parameters
             .Add(new SqlParameter("@Relocation", SqlDbType.Int))
              .Value = obj.Relocation;
                cmdObj.Parameters
                .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
                 .Value = obj.SalaryType;
                cmdObj.Parameters
              .Add(new SqlParameter("@BasePay", SqlDbType.Decimal))
              .Value = obj.BasePay;
                cmdObj.Parameters
              .Add(new SqlParameter("@PerfomanceBonous", SqlDbType.Decimal))
              .Value = obj.PerfomanceBonous;
                cmdObj.Parameters
               .Add(new SqlParameter("@RelocationPay", SqlDbType.Decimal))
               .Value = obj.RelocationPay;
                cmdObj.Parameters
              .Add(new SqlParameter("@VisaPay", SqlDbType.Decimal))
              .Value = obj.VisaPay;
                cmdObj.Parameters
             .Add(new SqlParameter("@IncentiveBonus", SqlDbType.Decimal))
             .Value = obj.IncentiveBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@MedicalBenifits", SqlDbType.Int))
               .Value = obj.MedicalBenifits;
                cmdObj.Parameters
               .Add(new SqlParameter("@FLSACId", SqlDbType.Int))
               .Value = obj.FLSACId;
                cmdObj.Parameters
               .Add(new SqlParameter("@PreviousV", SqlDbType.Char))
               .Value = obj.PreviousV;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeId", SqlDbType.Int))
               .Value = obj.PracticeId;
                cmdObj.Parameters
              .Add(new SqlParameter("@ReportingManager", SqlDbType.VarChar))
              .Value = obj.ReportingManager;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.DateTime))
               .Value = obj.StartDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@billingRate", SqlDbType.Decimal))
               .Value = obj.billingRate;
                cmdObj.Parameters
               .Add(new SqlParameter("@LoadingCostinUSD", SqlDbType.Decimal))
               .Value = obj.LoadingCostinUSD;
                cmdObj.Parameters
               .Add(new SqlParameter("@GrossSalaryinUSD", SqlDbType.Decimal))
              .Value = obj.GrossSalaryinUSD;
                cmdObj.Parameters
                 .Add(new SqlParameter("@GrossMargin", SqlDbType.Decimal))
                 .Value = obj.GrossMargin;
                cmdObj.Parameters
               .Add(new SqlParameter("@PerHourCostRateinUSD", SqlDbType.Decimal))
               .Value = obj.PerHourCostRateinUSD;
                cmdObj.Parameters
               .Add(new SqlParameter("@TAGLead_Approver", SqlDbType.VarChar))
               .Value = obj.TAGLead_Approver;
                cmdObj.Parameters
              .Add(new SqlParameter("@DH_Approver", SqlDbType.VarChar))
              .Value = obj.DH_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@SVP_Approver", SqlDbType.VarChar))
               .Value = obj.SVP_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@COO_Approver", SqlDbType.VarChar))
               .Value = obj.COO_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionTaken", SqlDbType.VarChar))
               .Value = obj.ActionTaken;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferedBy", SqlDbType.VarChar))
               .Value = obj.OfferGivenBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
              .Value = empId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Remark", SqlDbType.VarChar))
               .Value = obj.Remark;
                cmdObj.Parameters
             .Add(new SqlParameter("@VenderId", SqlDbType.Int))
             .Value = obj.VenderId;
                cmdObj.Parameters
             .Add(new SqlParameter("@VisaExpiryDate", SqlDbType.DateTime))
             .Value = obj.VisaExpiryDate;
                cmdObj.Parameters
             .Add(new SqlParameter("@ClinetStateId", SqlDbType.Int))
             .Value = obj.LocationStateId;
                cmdObj.Parameters
             .Add(new SqlParameter("@ClientCityID", SqlDbType.Int))
             .Value = obj.CityID;
                cmdObj.Parameters
             .Add(new SqlParameter("@EndDate", SqlDbType.DateTime))
             .Value = obj.EndDate;
                cmdObj.Parameters
             .Add(new SqlParameter("@IsBillable", SqlDbType.Int))
             .Value = obj.IsBillable;
                cmdObj.Parameters
               .Add(new SqlParameter("@JoiningStateId", SqlDbType.Int))
             .Value = obj.JoiningStateId;
                cmdObj.Parameters
             .Add(new SqlParameter("@JoiningCityID", SqlDbType.Int))
             .Value = obj.JoinigCityID;
                cmdObj.Parameters
             .Add(new SqlParameter("@joiningBonuspay", SqlDbType.Decimal))
             .Value = obj.joiningBonuspay;
                cmdObj.Parameters
             .Add(new SqlParameter("@IsRevised", SqlDbType.Char))
              .Value = obj.IsRevised;
                cmdObj.Parameters
               .Add(new SqlParameter("@AnnualVariablePay", SqlDbType.Decimal))
               .Value = obj.AnnualVariablePay;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionId", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
            .Add(new SqlParameter("@InternEndDate", SqlDbType.DateTime))
            .Value = obj.InternEndDate;
                cmdObj.Parameters
           .Add(new SqlParameter("@I9RepresentativeEmp", SqlDbType.VarChar))
           .Value = obj.I9RepresentativeEmp;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedOnDateUTC", SqlDbType.VarChar))
                 .Value = obj.AddedOnDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.AddedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AddedOffsetDate", SqlDbType.Int))
                 .Value = obj.AddedOffsetDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = obj.ModifiedOnOffsetDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@offeredOnUTC", SqlDbType.VarChar))
                .Value = obj.OfferedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.OfferedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredOnOffsetDate", SqlDbType.Int))
                 .Value = obj.OfferedOnOffsetDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@RevisedOfferDateUTC", SqlDbType.VarChar))
                .Value = obj.RevisedOfferDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RevisedOfferDateTimeZone", SqlDbType.VarChar))
                 .Value = obj.RevisedOfferDateTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@RevisedOfferDateOffsetDate", SqlDbType.Int))
                 .Value = obj.RevisedOfferDateOffsetDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
              .Value = obj.CDO_Approver;
                cmdObj.Parameters
              .Add(new SqlParameter("@TAGHead_Approver", SqlDbType.VarChar))
              .Value = obj.TAGHead_Approver;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                ActionId = Convert.ToInt32(cmdObj.Parameters["@ActionId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addUpdateOfferApprovalForUS");
                result = -1;
            }
            return result;
        }

       public int UpdateOfferApprovalStatusForUS(UpdateOfferApprovalStatusForUS obj, string empId, ref string Message)
        //public int UpdateOfferApprovalStatusForUS(int cid, string empId, string ActionTaken, char IsDelegator, string Remark, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateOfferApprovalStatusFor_US";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionTaken", SqlDbType.VarChar))
                .Value = obj.ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsDelegator", SqlDbType.Char))
                .Value = obj.IsDelegator;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.VarChar))
                .Value = obj.Remark;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = obj.ModifiedOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateOfferApprovalStatusForUS");
                result = -1;
            }
            return result;
        }

        public int AddOfferApprovalAttachmentForUS(OfferApprovalDocForUS model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_AddOfferApprovalAttachment";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.Cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionTakenBy", SqlDbType.VarChar))
               .Value = model.ActionTakenBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@ActionId", SqlDbType.Int))
               .Value = model.ActionId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Attachments", SqlDbType.Structured))
               .Value = OfferRepository.ToDataTable<AttachmentforUS>(model.AttachmentforUS);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddOfferApprovalAttachmentForUS");
                result = -1;
            }
            return result;
        }

        public DataSet GetCandidateInformationForPDF(OfferPDFModelUS model, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateInformationForOfferPDFUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine1", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine1;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine2", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine2;
                cmdObj.Parameters
               .Add(new SqlParameter("@City", SqlDbType.NVarChar))
               .Value = model.currentAddress.city;
                cmdObj.Parameters
               .Add(new SqlParameter("@State", SqlDbType.NVarChar))
               .Value = model.currentAddress.state;
                cmdObj.Parameters
               .Add(new SqlParameter("@PostalCode", SqlDbType.NVarChar))
               .Value = model.currentAddress.postalCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.NVarChar))
               .Value = model.currentAddress.country;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@isShippingAddrConfirm ", SqlDbType.Int))
                .Value = model.isShippingAddrConfirm;
                cmdObj.Parameters
                .Add(new SqlParameter("@LaptopMachineId ", SqlDbType.Int))
                .Value = model.LaptopMachine;
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalBasePay", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalBasePay);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalJoiningBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalJoiningBonus);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalRelocationPay", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalRelocationPay);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalIncentiveBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalIncentiveBonus);
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalPerformanceBonus", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalPerformanceBonus);
                cmdObj.Parameters
              .Add(new SqlParameter("@FinalVisaCost", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalVisaCost);
                cmdObj.Parameters
              .Add(new SqlParameter("@JoiningLocationId", SqlDbType.Int))
               .Value = model.JoiningLocationID;
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalAnnualVariablePay", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalAnnualVariablePay);
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfOfferResponse", SqlDbType.VarChar))
               .Value = model.DateOfOfferResponse;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
              .Value = model.startDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@InternEndDate", SqlDbType.VarChar))
              .Value = model.InternEndDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@isOfferGenExt", SqlDbType.Char))
              .Value = model.IsOfferGenExternal;
                cmdObj.Parameters
              .Add(new SqlParameter("@OfferGenerateDateUTC", SqlDbType.VarChar))
             .Value = model.ModifiedOnUTC;
                cmdObj.Parameters
             .Add(new SqlParameter("@OfferGenerateDateTimeZone", SqlDbType.VarChar))
            .Value = model.ModifiedOnTimeZone;
                cmdObj.Parameters
            .Add(new SqlParameter("@OfferGenerateDateOffsetDate", SqlDbType.Int))
           .Value = model.ModifiedOnOffsetDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@isStartDateTentativeOrConfirmed", SqlDbType.Char))
                .Value = model.IsStartDateTentativeOrConfirmed;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateInformationForPDF");
                ds = null;
            }
            return ds;
        }

        public DataSet GetApprovedCandidatesListForUS(string EmpId, OfferGenerationFilter obj, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetApprovedCandidateList_US";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = obj.thid;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
              .Value = obj.primarySkill;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
              .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@recruiterId", SqlDbType.Int))
               .Value = obj.recruiterId;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
               .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedCandidatesListForUS");
            }
            return ds;
        }

        public DataSet GetUSHRList(out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getUSHRList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getUSHRList");
            }
            return ds;
        }

        public int AddUpdateHRApproval(HRUpdateOfferApprovalStatusForUS obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateHRApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@HRApprovalId", SqlDbType.VarChar))
                .Value = obj.HRApprovalId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.VarChar))
                .Value = obj.Remark;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionDateUTC", SqlDbType.VarChar))
                 .Value = obj.ActionDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.ActionOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ActionOnOffsetDate", SqlDbType.Int))
                 .Value = obj.ActionOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateHRApproval");
                result = -1;
            }
            return result;
        }

        public int ApprovedOrReferrbackByHR(UpdateOfferApprovalStatusForUS obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ApprovedOrRejectByHR";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionTaken", SqlDbType.VarChar))
                .Value = obj.ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.VarChar))
                .Value = obj.Remark;
                cmdObj.Parameters
                .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                .Value = obj.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = obj.ModifiedOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApprovedOrReferrbackByHR");
                result = -1;
            }
            return result;
        }

        public DataSet GetCandidateListForHR(string EmpId, OfferGenerationFilterforUS obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetCandidateListForHR";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@empid", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = obj.thid;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
              .Value = obj.primarySkill;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
              .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
               .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListForHR");
            }
            return ds;
        }

        public DataSet GetOfferDocumentDetailforUS(int cid, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetOfferDocumentDetailForUS";
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
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferDocumentDetailforUS");
                ds = null;
            }
            return ds;
        }

        public int UpdateCandidateOfferDetailsStatusForUS(int cid, string added_by, string offerStatus, int? odid, string Remark, string DateOfJoining, string DeclineDate, int? JoinedEmpId, ref string Message, string ModifiedOnUTC, string ModifiedOnTimeZone , int? ModifiedOnOffsetDate, string offereddate, string offerAcceptanceDate, string OfferGenerateDate)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateCandidateOfferDetailsStatusForUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = added_by;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
                .Value = @offerStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@odid", SqlDbType.Int))
                .Value = odid;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar))
                .Value = Remark;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfJoining", SqlDbType.VarChar))
                .Value = DateOfJoining;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@DeclineDate", SqlDbType.VarChar))
                .Value = DeclineDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = JoinedEmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                 .Value = ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = ModifiedOnOffsetDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@offeredDate", SqlDbType.VarChar))
               .Value = offereddate;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerAcceptanceDate", SqlDbType.VarChar))
              .Value = offerAcceptanceDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferGenerateDate", SqlDbType.VarChar))
               .Value = OfferGenerateDate;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateCandidateOfferDetailsStatusForUS");
                result = -1;
            }
            return result;
        }

        public int sendOffer(OfferSendModelforUS obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendOfferLetterToCandidateForUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@link", SqlDbType.NVarChar, -1))
                .Value = obj.link;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpID", SqlDbType.VarChar, 100))
               .Value = EmpId;
               
                cmdObj.Parameters
                .Add(new SqlParameter("@offeredOnUTC", SqlDbType.VarChar))
                .Value = obj.OfferedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.OfferedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@offeredOnOffsetDate", SqlDbType.Int))
                 .Value = obj.OfferedOnOffsetDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                .Value = obj.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = obj.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = obj.ModifiedOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sendOffer");
                result = -1;
            }
            return result;

        }
        public DataSet GetTempOfferLetterToCandidateForUSEnc(int cid, string empId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTempOfferLetterToCandidateForUSEnc";
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
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTempOfferLetterToCandidateForUSEnc");
                ds = null;
            }
            return ds;
        }

        public DataSet getCandidateHRApprovalDetails(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateHRApprovalDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateHRApprovalDetails");
            }
            return ds;
        }

        public DataSet GeDetailsForUploadOfferforUs(OfferPDFModelUS model, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GeDetailsForUploadOfferforUs";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine1", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine1;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine2", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine2;
                cmdObj.Parameters
               .Add(new SqlParameter("@City", SqlDbType.NVarChar))
               .Value = model.currentAddress.city;
                cmdObj.Parameters
               .Add(new SqlParameter("@State", SqlDbType.NVarChar))
               .Value = model.currentAddress.state;
                cmdObj.Parameters
               .Add(new SqlParameter("@PostalCode", SqlDbType.NVarChar))
               .Value = model.currentAddress.postalCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.NVarChar))
               .Value = model.currentAddress.country;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalBasePay", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalBasePay);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalJoiningBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalJoiningBonus);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalRelocationPay", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalRelocationPay);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalIncentiveBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalIncentiveBonus);
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalPerformanceBonus", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalPerformanceBonus);
                cmdObj.Parameters
              .Add(new SqlParameter("@FinalVisaCost", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalVisaCost);
                cmdObj.Parameters
              .Add(new SqlParameter("@JoiningLocationId", SqlDbType.Int))
               .Value = model.JoiningLocationID;
                cmdObj.Parameters
              .Add(new SqlParameter("@OfferSeqID", SqlDbType.Int))
               .Value = model.OfferSeqNumber;
                cmdObj.Parameters
              .Add(new SqlParameter("@OfferNumber", SqlDbType.NVarChar))
               .Value = model.offerNumber;
                cmdObj.Parameters
               .Add(new SqlParameter("@isShippingAddrConfirm ", SqlDbType.Int))
               .Value = model.isShippingAddrConfirm;
                cmdObj.Parameters
                .Add(new SqlParameter("@LaptopMachineId ", SqlDbType.Int))
                .Value = model.LaptopMachine;
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalAnnualVariablePay", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalAnnualVariablePay);
                cmdObj.Parameters
               .Add(new SqlParameter("@DateOfOfferResponse", SqlDbType.VarChar))
              .Value = model.DateOfOfferResponse;
                cmdObj.Parameters
               .Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
              .Value = model.startDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@InternEndDate", SqlDbType.VarChar))
              .Value = model.InternEndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@isStartDateTentativeOrConfirmed", SqlDbType.Char))
                .Value = model.IsStartDateTentativeOrConfirmed;
                // cmdObj.Parameters
                // .Add(new SqlParameter("@DateOfOfferResponse", SqlDbType.VarChar))
                //.Value = model.DateOfOfferResponse;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GeDetailsForUploadOfferforUs");
                ds = null;
            }
            return ds;
        }

        public DataSet GetShippingLaptopList(out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getShippingLaptopList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetShippingLaptopList");
            }
            return ds;
        }

        public DataSet GetApprovedCandidatesListReport(string EmpId, OfferGenerationReportFilter obj, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetApprovedCandidateListReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = obj.thid;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
              .Value = obj.primarySkill;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
              .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
               .Add(new SqlParameter("@recruiterId", SqlDbType.Int))
               .Value = obj.recruiterId;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
               .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedCandidatesListReport");
            }
            return ds;
        }

        public DataSet GetCandidateListForHRReport(string EmpId, OfferGenerationFilterforUS obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetCandidateListForHRReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@empid", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
               .Value = obj.thid;
                cmdObj.Parameters
              .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
              .Add(new SqlParameter("@primarySkill", SqlDbType.VarChar))
              .Value = obj.primarySkill;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferStartDate", SqlDbType.VarChar))
              .Value = obj.startDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@dateOfOfferEndDate", SqlDbType.VarChar))
              .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
               .Value = obj.startDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate2;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListForHR");
            }
            return ds;
        }

        public DataSet GetHiringTrackerReport(string EmpId, HiringTrackerReportFilter obj, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetHiringTrackerReport";
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
              .Add(new SqlParameter("@offerStatus", SqlDbType.VarChar))
              .Value = obj.offerStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@recruiterId", SqlDbType.Int))
               .Value = obj.recruiterId;
                cmdObj.Parameters
               .Add(new SqlParameter("@dateOfJoiningStartDate", SqlDbType.VarChar))
               .Value = obj.startDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@dateOfJoiningEndDate", SqlDbType.VarChar))
                  .Value = obj.endDate;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetHiringTrackerReport");
            }
            return ds;
        }

        public DataSet GeDetailsForUploadUSOfferByRecruiter(UploadSignedOfferModel model, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GeDetailsForUploadUSOfferByRecruiter";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                 .Value = model.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = model.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = model.ModifiedOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GeDetailsForUploadUSOfferByRecruiter");
                ds = null;
            }
            return ds;
        }

        public DataSet GetCandidateWiseHiringTrackerReport(string EmpId, int cid, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidateWiseHiringTrackerReport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
               
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "Paging";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateWiseHiringTrackerReport");
            }
            return ds;
        }

    }

}