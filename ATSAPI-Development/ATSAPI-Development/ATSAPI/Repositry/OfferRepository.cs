using ATSAPI.App_Data;
using ATSAPI.Models;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ATSAPI.Repositry
{
    public class OfferRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "OfferRepository";
        DataUtility du;
        public OfferRepository()
        {
            du = new DataUtility();
        }

        public DataSet GetSelectedCandidatesList(string EmpId, OfferGenerationFilter obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAllSelectedCandidatesList";
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
                cmdObj.Parameters
                 .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
                  .Value = obj.PracticeId;               
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(outputParam);
                SqlDataAdapter da = new SqlDataAdapter(cmdObj);
                da.Fill(ds);
                int resultValue = (outputParam.Value != DBNull.Value) ? Convert.ToInt32(outputParam.Value) : 0;
                ds.ExtendedProperties["result"] = resultValue;
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSelectedCandidatesList");
            }
            return ds;
        }

        public DataSet getSelectedCandidateDetails(int cid, string EmpId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getSelectedCandidateDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                 .Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                SqlDataAdapter da = new SqlDataAdapter(cmdObj);
                da.Fill(ds);
                int resultValue = (outputParam.Value != DBNull.Value) ? Convert.ToInt32(outputParam.Value) : 0;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getSelectedCandidateDetails");
            }
            return ds;
        }


        public int addUpdateOfferApproval(OfferApprovalModel obj, string empId, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdateOfferApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferID", SqlDbType.Int))
               .Value = obj.OfferID;
                cmdObj.Parameters
             .Add(new SqlParameter("@Division", SqlDbType.Int))
             .Value = obj.DivisionID;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@DesignationId", SqlDbType.Int))
               .Value = obj.DesignationId;
              //  cmdObj.Parameters
              //.Add(new SqlParameter("@PracticeId", SqlDbType.Int))
              //.Value = obj.PracticeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CTC", SqlDbType.BigInt))
                .Value = obj.ctc;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningBonus", SqlDbType.BigInt))
               .Value = obj.joiningBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@NoticeBuyOut", SqlDbType.BigInt))
               .Value = obj.NoticeBuyOut;
                cmdObj.Parameters
               .Add(new SqlParameter("@TravelExp", SqlDbType.BigInt))
               .Value = obj.TravelExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RelocationExp", SqlDbType.BigInt))
               .Value = obj.RelocationExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RetentionBonus", SqlDbType.BigInt))
               .Value = obj.RetentionBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@salary", SqlDbType.BigInt))
               .Value = obj.salary;
                cmdObj.Parameters
              .Add(new SqlParameter("@offeredBy", SqlDbType.VarChar))
              .Value = obj.offerGivenBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
              .Value = empId;
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
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = obj.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfJoining", SqlDbType.Date))
                .Value = obj.DateOfJoining;
                cmdObj.Parameters
                .Add(new SqlParameter("@ContractCompletionDate", SqlDbType.Date))
                .Value = obj.ContractCompletionDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@CandidateTypeID", SqlDbType.Int))
                .Value = obj.CandidateTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
                .Value = obj.SalaryType;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = obj.PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningLocationID", SqlDbType.Int))
                .Value = obj.JoiningLocationID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ServiceAndMarkup", SqlDbType.Int))
                .Value = obj.ServiceAndMarkup;
                cmdObj.Parameters
                .Add(new SqlParameter("@Action", SqlDbType.VarChar))
                .Value = obj.Action;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsRevised", SqlDbType.Char))
                .Value = obj.IsRevisedOffer;

                cmdObj.Parameters
                .Add(new SqlParameter("@billingRateHrCurrency", SqlDbType.Decimal))
                .Value = obj.billingRateHrCurrency;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingCurrencyId", SqlDbType.Int))
                .Value = obj.billingCurrencyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@billableHoursDay", SqlDbType.Int))
                .Value = obj.billableHoursDay;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBufferInPercent", SqlDbType.Int))
                .Value = obj.projectBuffer;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingRateHrInUSD", SqlDbType.Decimal))
                .Value = obj.billingRateHrInUSD;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualBillableHours", SqlDbType.Decimal))
                .Value = obj.annualBillableHours;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualRevenueUsd", SqlDbType.Decimal))
                .Value = obj.annualRevenueUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualSalaryCostUsd", SqlDbType.Decimal))
                .Value = obj.annualSalaryCostUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningBonusUsd", SqlDbType.Decimal))
                .Value = obj.joiningBonusUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@benefitsUsd", SqlDbType.Decimal))
                .Value = obj.benefitsUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBufferUsd", SqlDbType.Decimal))
                .Value = obj.ProjectBufferUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@nonReimbursableTravelCostUsd", SqlDbType.BigInt))
                .Value = obj.NonReimbursableTravelCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectSpecificCostUsd", SqlDbType.BigInt))
                .Value = obj.projectSpecificCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@dgmCostUsd", SqlDbType.Decimal))
                .Value = obj.dgmCostUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@dgmPercentUsd", SqlDbType.Decimal))
                .Value = obj.dgmPercentUsd;
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
                .Add(new SqlParameter("@reHire", SqlDbType.Char))
                .Value = obj.reHire;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar, 2000))
                .Value = obj.remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@GradeBand", SqlDbType.Char))
                .Value = obj.gradeBand;
                cmdObj.Parameters
                .Add(new SqlParameter("@ConversionRate", SqlDbType.Decimal))
                .Value = obj.ConversionRate;
                cmdObj.Parameters
                .Add(new SqlParameter("@BillingAmountInUSD", SqlDbType.Decimal))
                .Value = obj.BillingAmountInUSD;
                cmdObj.Parameters
                .Add(new SqlParameter("@ClientApprovedBilling", SqlDbType.Decimal))
                .Value = obj.ClientApprovedBilling;
                cmdObj.Parameters
               .Add(new SqlParameter("@DGMPer", SqlDbType.Decimal))
               .Value = obj.DGMPer;
                cmdObj.Parameters
                .Add(new SqlParameter("@DGMAmount", SqlDbType.Decimal))
                .Value = obj.DGMAmount;
                cmdObj.Parameters
                .Add(new SqlParameter("@OtherCost", SqlDbType.Decimal))
                .Value = obj.OtherCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@Revenue", SqlDbType.Decimal))
                .Value = obj.Revenue;
                cmdObj.Parameters
                .Add(new SqlParameter("@FieldIDs", SqlDbType.VarChar))
                .Value = obj.FieldIDs;
                cmdObj.Parameters
               .Add(new SqlParameter("@TAGHead_Approver", SqlDbType.VarChar))
               .Value = obj.TAGHead_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsReinitiate", SqlDbType.Char))
               .Value = obj.IsReinitiate;
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
             .Add(new SqlParameter("@variablePay", SqlDbType.Decimal))
             .Value = obj.variablePay;
                cmdObj.Parameters
             .Add(new SqlParameter("@JustificationBucketId", SqlDbType.Int))
             .Value = obj.JustificationBucketId; 
              cmdObj.Parameters
                .Add(new SqlParameter("@ContractExtensionRemarks", SqlDbType.NVarChar, 2000))
                .Value = obj.ContractExtensionRemarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferReleasedFor", SqlDbType.NVarChar, 500))
               .Value = obj.OfferReleasedFor;
                cmdObj.Parameters
              .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
              .Value = obj.CDO_Approver;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                ActionId = Convert.ToInt32(cmdObj.Parameters["@ActionId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_addUpdateOfferApproval");
                result = -1;
            }
            return result;
        }

        public int changeApproversOfOfferApproval(OfferResendModel obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "changeApproversOfOfferApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
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
             .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
             .Value = obj.CDO_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@FunctionHead", SqlDbType.VarChar))
               .Value = obj.FunctionHead;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar, 2000))
                .Value = obj.remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@ModifiedBy", SqlDbType.NVarChar, 2000))
               .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                 cmdObj.Parameters
                .Add(new SqlParameter("@TAGHead_Approver", SqlDbType.VarChar))
                .Value = obj.TAGHead_Approver;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "changeApproversOfOfferApproval");
                result = -1;
            }
            return result;
        }
        public int resendOfferForApproval(OfferResendModel obj, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_resendOfferForApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
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
               .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
               .Value = obj.CDO_Approver;
                cmdObj.Parameters
             .Add(new SqlParameter("@FunctionHead", SqlDbType.VarChar))
             .Value = obj.FunctionHead;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar, 2000))
                .Value = obj.remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@ModifiedBy", SqlDbType.NVarChar, 2000))
               .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                 cmdObj.Parameters
                .Add(new SqlParameter("@TAGHead_Approver", SqlDbType.VarChar))
                .Value = obj.TAGHead_Approver;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_resendOfferForApproval");
                result = -1;
            }
            return result;
        }
        public DataSet getPendingApproversList(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPendingApproversList";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPendingApproversList");
            }
            return ds;
        }
        public DataSet getCandidateOfferAprDetails(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateOfferDetails";
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
                ds.Tables[1].TableName = "BGVAtt";
                ds.Tables[2].TableName = "approvaldoc";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateOfferAprDetails");
            }
            return ds;
        }

        public DataSet GetCandidateListPendingForApproval(string EmpId, int page, int pageSize, string search, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateListPendingForApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empid", SqlDbType.VarChar))
                .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@search", SqlDbType.VarChar))
               .Value = search;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                .Value = pageSize;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListPendingForApproval");
            }
            return ds;
        }

        public int UpdateOfferApprovalStatus(int cid, string empId, string ActionTaken, char IsDelegator, string Remark, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateOfferApprovalStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionTaken", SqlDbType.VarChar))
                .Value = ActionTaken;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsDelegator", SqlDbType.Char))
                .Value = IsDelegator;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar, 2000))
                .Value = Remark;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateOfferApprovalStatus");
                result = -1;
            }
            return result;
        }

        public DataSet GetNumberOfApprovers(int CubeClusterID, char JFCategory, int gradeID, decimal ctc, decimal joiningBonus, int ExpYear, int ExpMonth, char GradeBand, string Empid, int? CondidateTypeId = null, int? RequirementType = null, int? PracticeId = 0, int division = 1)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetNumberOfApproversRequired";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
                .Value = CubeClusterID;
                cmdObj.Parameters
                .Add(new SqlParameter("@JFCategory", SqlDbType.Char))
                .Value = JFCategory;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeID", SqlDbType.Int))
                .Value = gradeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@RequirementType", SqlDbType.Int))
                .Value = RequirementType;
                cmdObj.Parameters
                .Add(new SqlParameter("@PracticeId", SqlDbType.Int))
                .Value = PracticeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@ctc", SqlDbType.Decimal))
                .Value = ctc;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningBonus", SqlDbType.Decimal))
                .Value = joiningBonus;
                cmdObj.Parameters
                .Add(new SqlParameter("@ExpYear", SqlDbType.Int))
                .Value = ExpYear;
                cmdObj.Parameters
                .Add(new SqlParameter("@ExpMonth", SqlDbType.Int))
                .Value = ExpMonth;
                cmdObj.Parameters
                .Add(new SqlParameter("@GradeBand", SqlDbType.Char))
                .Value = GradeBand;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@division", SqlDbType.Int))
                .Value = division;
                cmdObj.Parameters
               .Add(new SqlParameter("@CondidateTypeId", SqlDbType.Int))
               .Value = CondidateTypeId;
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

        public DataSet GetCandidateInformationForPDF(PdfModel model, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateInformationForPDF";
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
               .Add(new SqlParameter("@AddressLine3", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine3;
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
               .Add(new SqlParameter("@PrAddressLine1", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine1;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrAddressLine2", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine2;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrAddressLine3", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine3;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrCity", SqlDbType.NVarChar))
               .Value = model.permanentAddress.city;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrState", SqlDbType.NVarChar))
               .Value = model.permanentAddress.state;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrPostalCode", SqlDbType.NVarChar))
               .Value = model.permanentAddress.postalCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrCountryId", SqlDbType.NVarChar))
               .Value = model.permanentAddress.country;
                cmdObj.Parameters
               .Add(new SqlParameter("@SudexoCoupen", SqlDbType.Int))
               .Value = model.SudexoCoupen;
                cmdObj.Parameters
               .Add(new SqlParameter("@NPSPercantage", SqlDbType.Int))
               .Value = model.Nps;
                cmdObj.Parameters
               .Add(new SqlParameter("@sendOfferAddressType", SqlDbType.Char))
               .Value = model.sendOfferAddressType;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@Attachments", SqlDbType.Structured))
               .Value = ToDataTable<BGVAttachment>(model.BGVAttachments);
                cmdObj.Parameters
              .Add(new SqlParameter("@DateOfJoiningOffer ", SqlDbType.VarChar))
              .Value = model.dateOfJoining;
                cmdObj.Parameters
              .Add(new SqlParameter("@isShippingAddrConfirm ", SqlDbType.Int))
              .Value = model.isShippingAddrConfirm;
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalCTC", SqlDbType.Decimal))
               .Value = Convert.ToDecimal(model.FinalCTC);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalJoiningBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalJoiningBonus);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalNoticeBuyout", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalNoticeBuyout);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalTravelExp", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalTravelExp);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalRelocationExp", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalRelocationExp);
                cmdObj.Parameters
               .Add(new SqlParameter("@FinalRetentionBonus", SqlDbType.Decimal))
              .Value = Convert.ToDecimal(model.FinalRetentionBonus);
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningLocationId", SqlDbType.Int))
               .Value = model.JoiningLocationID;
                cmdObj.Parameters
              .Add(new SqlParameter("@isOfferGenExt", SqlDbType.Char))
             .Value = model.IsOfferGenExternal;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateInformationForPDF");
                ds = null;
            }
            return ds;
        }


        public DataSet GeDetailsForUploadOffer(PdfModel model, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GeDetailsForUploadOffer";
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
               .Add(new SqlParameter("@AddressLine3", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine3;
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
               .Add(new SqlParameter("@PrAddressLine1", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine1;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrAddressLine2", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine2;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrAddressLine3", SqlDbType.NVarChar))
               .Value = model.permanentAddress.addressLine3;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrCity", SqlDbType.NVarChar))
               .Value = model.permanentAddress.city;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrState", SqlDbType.NVarChar))
               .Value = model.permanentAddress.state;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrPostalCode", SqlDbType.NVarChar))
               .Value = model.permanentAddress.postalCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@PrCountryId", SqlDbType.NVarChar))
               .Value = model.permanentAddress.country;
                cmdObj.Parameters
               .Add(new SqlParameter("@SudexoCoupen", SqlDbType.Int))
               .Value = model.SudexoCoupen;
                cmdObj.Parameters
               .Add(new SqlParameter("@NPSPercantage", SqlDbType.Int))
               .Value = model.Nps;
                cmdObj.Parameters
               .Add(new SqlParameter("@sendOfferAddressType", SqlDbType.Char))
               .Value = model.sendOfferAddressType;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfJoiningOffer ", SqlDbType.VarChar))
                .Value = model.dateOfJoining;
                cmdObj.Parameters
                .Add(new SqlParameter("@isShippingAddrConfirm ", SqlDbType.Int))
                .Value = model.isShippingAddrConfirm;
                cmdObj.Parameters
                .Add(new SqlParameter("@FinalCTC", SqlDbType.Decimal))
                 .Value = Convert.ToDecimal(model.FinalCTC);
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningLocationId", SqlDbType.Int))
                 .Value = model.JoiningLocationID;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferNumber", SqlDbType.VarChar))
                 .Value = model.offerNumber;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferSeqID", SqlDbType.Int))
                  .Value = model.OfferSeqNumber;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GeDetailsForUploadOffer");
                ds = null;
            }
            return ds;
        }

        public int UploadBGVDocuments(PdfModel model, string Empid)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "UploadBGVDocuments";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = model.cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = Empid;
                cmdObj.Parameters
               .Add(new SqlParameter("@Attachments", SqlDbType.Structured))
               .Value = ToDataTable<BGVAttachment>(model.BGVAttachments);
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UploadBGVDocuments");
                result = -1;
            }
            return result;
        }
        public DataSet GetOfferDocumentDetail(int cid, string Empid, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetOfferDocumentDetail";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferDocumentDetail");
                ds = null;
            }
            return ds;
        }



        public DataSet GetApprovedCandidatesList(string EmpId, OfferGenerationFilter obj, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetApprovedCandidateList";
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
                 .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
                  .Value = obj.PracticeId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedCandidatesList");
            }
            return ds;
        }

        public DataSet getCandidateApprovalDetails(int cid,string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getCandidateApprovalDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@cid", SqlDbType.Int))
                 .Value = cid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateApprovalDetails");
            }
            return ds;
        }

        public DataSet DgmCalculaterForOffer(dgmCalcModel obj, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "DgmCalculaterForOffer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@gradeID", SqlDbType.Int))
               .Value = obj.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@locationId", SqlDbType.Int))
                .Value = obj.JoiningLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@cadidateTypeId", SqlDbType.Int))
               .Value = obj.cadidateTypeId;
                cmdObj.Parameters
               .Add(new SqlParameter("@division", SqlDbType.Int))
               .Value = obj.divisionID;
               // cmdObj.Parameters
               //.Add(new SqlParameter("@PracticeId", SqlDbType.Int))
               //.Value = obj.PracticeId;
                cmdObj.Parameters
                .Add(new SqlParameter("billingRate", SqlDbType.Decimal))
                .Value = obj.billingRate;
                cmdObj.Parameters
                .Add(new SqlParameter("@billingCurrencyId", SqlDbType.Int))
                .Value = obj.billingCurrencyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualCTC", SqlDbType.Decimal))
                .Value = obj.annualCTC;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningBonus", SqlDbType.Decimal))
                .Value = obj.joiningBonus;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBuffer", SqlDbType.Decimal))
                .Value = obj.projectBuffer;
                cmdObj.Parameters
                .Add(new SqlParameter("@localCurrencyId", SqlDbType.Int))
                .Value = obj.localCurrencyId;
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
                cmdObj.Parameters
              .Add(new SqlParameter("@CubeClusterID", SqlDbType.Int))
              .Value = obj.CubeClusterID;
              //  cmdObj.Parameters
              //.Add(new SqlParameter("@JfCategory", SqlDbType.VarChar))
              //.Value = obj.JfCategory;
                cmdObj.Parameters
              .Add(new SqlParameter("@GradeBand", SqlDbType.VarChar))
              .Value = obj.GradeBand;
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
        public DataSet GetDGMdetailsforOfferNNT(int cid, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetDGMdetailsforOfferNNT";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDGMdetailsforOfferNNT");
                ds = null;
            }
            return ds;
        }

        public DataSet getOfferDeclineCategory()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getOfferDeclineCategory";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getOfferDeclineCategory");
            }
            return ds;
        }

        public int UpdateCandidateOfferDeclineStatus(int cid, string added_by, string offerStatus, int? odid, string Remark, string DateOfJoining, string DeclineDate, int? JoinedEmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateCandidateDetailsByDeclineCategoryID";
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
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateCandidateOfferDeclineStatus");
                result = -1;
            }
            return result;
        }

        public int sendOffer(OfferSendModel obj, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SendOfferLetterToCandidate";
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

        public DataSet GetTempOfferLetterToCandidateForInd(int cid, string empId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetTempOfferLetterToCandidateForInd";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTempOfferLetterToCandidateForInd");
                ds = null;
            }
            return ds;
        }

        public DataSet getCandidateStatusHistory(int cid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Get_CandidateStatusHistory";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateStatusHistory");
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

        public DataSet GetBGVFileName(int id, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetBGVFileName";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetBGVFileName");
                ds = null;
            }
            return ds;
        }

        /***
        *  Transfer Scheduled Candidate to other talent ID
        * 
        * **/

        public int TransferSelectedCandidateByTalentId(SelectedCandidateTransfer cnd, string EmpId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_TransferSelectedCandidateByTalentId";
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
                 .Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                 .Value = cnd.thid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@remarks", SqlDbType.VarChar))
                 .Value = cnd.remarks;
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

        public int updateConfirmShippingAddress(updateConfirmAddress model, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_updateConfirmShippingAddress";
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
               .Add(new SqlParameter("@AddressLine3", SqlDbType.NVarChar))
               .Value = model.currentAddress.addressLine3;
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
               .Add(new SqlParameter("@CountryId", SqlDbType.VarChar))
               .Value = model.currentAddress.country;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                cmdObj.Parameters
              .Add(new SqlParameter("@isShippingAddrConfirm ", SqlDbType.Int))
              .Value = model.isShippingAddrConfirm;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_updateConfirmShippingAddress");
                result = -1;
            }
            return result;
        }

        public DataSet GetCandidateAddresConfirmationStatus(int page, int pageSize, string empID, out int result, string search = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateAddresConfirmationStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Page ", SqlDbType.Int))
                .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize ", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search ", SqlDbType.VarChar))
                .Value = search;
                cmdObj.Parameters
               .Add(new SqlParameter("@empID ", SqlDbType.VarChar))
               .Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateAddresConfirmationStatus");
            }
            return ds;
        }

        public DataSet GetOfferedCandidateList(int page, int pageSize, string search = null, int? offerStatus = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOfferedCandidateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Page ", SqlDbType.Int))
                .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@pageSize ", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search ", SqlDbType.VarChar))
                .Value = search;
                cmdObj.Parameters
                .Add(new SqlParameter("@offerStatus ", SqlDbType.Int))
                .Value = offerStatus;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferedCandidateList");
            }
            return ds;
        }

        public int AddOfferApprovalAttachment(OfferApprovalDoc model, string Empid)
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
               .Value = ToDataTable<ApprovalAttachment>(model.ApprovalAttachments);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddOfferApprovalAttachment");
                result = -1;
            }
            return result;
        }

        public DataSet GetApprovalFileName(int id, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetApprovalFileName";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovalFileName");
                ds = null;
            }
            return ds;
        }

        public DataSet GetOfferApprovalAttachaments(int cid, string ActionTakenBy, out int result,int? ActionId = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOfferApprovalAttachaments";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid ", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionTakenBy ", SqlDbType.VarChar))
                .Value = ActionTakenBy;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionId ", SqlDbType.Int))
                .Value = ActionId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferApprovalAttachaments");
            }
            return ds;



        }

        public int updateDropReasonOfferedCandByCid(int Cid, int StatusId, string empId, int DropReasonId, string DropRemark)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "updateDropReasonOfferedCandByCid";
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
                .Add(new SqlParameter("@empId", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "updateDropReasonOfferedCandByCid");
                result = -1;
            }
            return result;
        }

        public DataSet getDelegationRightsList(string EmpID, int page, int pageSize, out int result, string search = "" )
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "spGetDeligationRightsList";
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
                 .Add(new SqlParameter("@search", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getDeligationRightsList");
            }
            return ds;
        }

        public int addDelegation(string DelegateTo, string FromDate, string ToDate, string AddedBy, out string Message, string Remarks = "", string EmpID = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addDelegation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.VarChar, 200)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Approver", SqlDbType.VarChar))
                .Value = EmpID;
                cmdObj.Parameters
                .Add(new SqlParameter("@DelegateTo", SqlDbType.VarChar))
                .Value = DelegateTo;
                cmdObj.Parameters
                .Add(new SqlParameter("@FromDate", SqlDbType.VarChar))
                .Value = FromDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@ToDate", SqlDbType.VarChar))
                .Value = ToDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = AddedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_addDelegation");
                Message = "There is some error! Try again later.";
                result = -1;
            }
            return result;
        }

        public int RevokeDelegation(int ID, string EmpID, out string Message, string Remarks = "")
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_RevokeDelegation";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.VarChar, 200)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@DelegationID", SqlDbType.Int))
                .Value = ID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = EmpID;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_RevokeDelegation");
                Message = "There is some error! Try again later.";
                result = -1;
            }
            return result;
        }

        public DataSet GetCandidateListByTalentId(int thid, string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetCandidateListByTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
                 .Value = thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateListByTalentId");
            }
            return ds;
        }

        public DataSet GetFieldsList(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetFieldsList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.Int))
                .Value = empId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetFieldsList");
            }
            return ds;
        }

        public DataSet getTalentIdCurrentDetails(int CID, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getTalentIdCurrentDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = CID;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);

                ds.Tables[0].TableName = "OfferedDetails";
                ds.Tables[1].TableName = "THIDDetails";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTalentIdCurrentDetails");
            }
            return ds;
        }
        public DataSet getTransferTalentIdDetails(int CID, int ToTHID, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getTalentIdTransferDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = CID;
                cmdObj.Parameters
               .Add(new SqlParameter("@ToTHID", SqlDbType.Int))
               .Value = ToTHID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTransferTalentIdDetails");
            }
            return ds;
        }

        public int TransferTalentIdwithTC(THIDTransferWithTC OBJ, string EmpID, out string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_TransferTalentIdwithTC";
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
               .Add(new SqlParameter("@MinSalary", SqlDbType.NVarChar))
               .Value = OBJ.MinSalary;
                cmdObj.Parameters
               .Add(new SqlParameter("@MedSalary", SqlDbType.NVarChar))
               .Value = OBJ.MedSalary;
                cmdObj.Parameters
              .Add(new SqlParameter("@MaxSalary", SqlDbType.NVarChar))
              .Value = OBJ.MaxSalary;
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
                .Add(new SqlParameter("@annualBillableHours", SqlDbType.Decimal))
                .Value = OBJ.annualBillableHours;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualRevenueUsd", SqlDbType.Decimal))
                .Value = OBJ.annualRevenueUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@annualSalaryCostUsd", SqlDbType.Decimal))
                .Value = OBJ.annualSalaryCostUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@joiningBonusUsd", SqlDbType.Decimal))
                .Value = OBJ.joiningBonusUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@benefitsUsd", SqlDbType.Decimal))
                .Value = OBJ.benefitsUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectBufferUsd", SqlDbType.Decimal))
                .Value = OBJ.ProjectBufferUsd;
                cmdObj.Parameters
                .Add(new SqlParameter("@nonReimbursableTravelCostUsd", SqlDbType.BigInt))
                .Value = OBJ.NonReimbursableTravelCost;
                cmdObj.Parameters
                .Add(new SqlParameter("@projectSpecificCostUsd", SqlDbType.BigInt))
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
                .Add(new SqlParameter("@billingCurrencyId", SqlDbType.BigInt))
                .Value = OBJ.billingCurrencyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@billableHoursDay", SqlDbType.BigInt))
                .Value = OBJ.billableHoursDay;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
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
         // Addedd by Jivan
        public DataSet GetJustification_BucketList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetJustification_Bucket";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();

            }
            catch (Exception Ex)
            {

                ExceptionLogging.SendExcepToDB(Ex, sectionName, "GetJustification_BucketList");
            }
            return ds;
        }

        public int addUpdateOfferApprovalSupport(OfferApprovalModel obj, string empId, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdateOfferApprovalSupport";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@OfferID", SqlDbType.Int))
               .Value = obj.OfferID;
                cmdObj.Parameters
             .Add(new SqlParameter("@Division", SqlDbType.Int))
             .Value = obj.DivisionID;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = obj.cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@DesignationId", SqlDbType.Int))
               .Value = obj.DesignationId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CTC", SqlDbType.BigInt))
                .Value = obj.ctc;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningBonus", SqlDbType.BigInt))
               .Value = obj.joiningBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@NoticeBuyOut", SqlDbType.BigInt))
               .Value = obj.NoticeBuyOut;
                cmdObj.Parameters
               .Add(new SqlParameter("@TravelExp", SqlDbType.BigInt))
               .Value = obj.TravelExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RelocationExp", SqlDbType.BigInt))
               .Value = obj.RelocationExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RetentionBonus", SqlDbType.BigInt))
               .Value = obj.RetentionBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@salary", SqlDbType.BigInt))
               .Value = obj.salary;
                cmdObj.Parameters
              .Add(new SqlParameter("@offeredBy", SqlDbType.VarChar))
              .Value = obj.offerGivenBy;
                cmdObj.Parameters
              .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
              .Value = empId;
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
               .Add(new SqlParameter("@FunctionHead", SqlDbType.VarChar))
               .Value = obj.FunctionHead;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = obj.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@DateOfJoining", SqlDbType.Date))
                .Value = obj.DateOfJoining;
                cmdObj.Parameters
                .Add(new SqlParameter("@ContractCompletionDate", SqlDbType.Date))
                .Value = obj.ContractCompletionDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@CandidateTypeID", SqlDbType.Int))
                .Value = obj.CandidateTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
                .Value = obj.SalaryType;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = obj.PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningLocationID", SqlDbType.Int))
                .Value = obj.JoiningLocationID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ServiceAndMarkup", SqlDbType.Int))
                .Value = obj.ServiceAndMarkup;
                cmdObj.Parameters
                .Add(new SqlParameter("@Action", SqlDbType.VarChar))
                .Value = obj.Action;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsRevised", SqlDbType.Char))
                .Value = obj.IsRevisedOffer;

               
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
                .Add(new SqlParameter("@reHire", SqlDbType.Char))
                .Value = obj.reHire;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remark", SqlDbType.NVarChar, 2000))
                .Value = obj.remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@GradeBand", SqlDbType.Char))
                .Value = obj.gradeBand;
                cmdObj.Parameters
               .Add(new SqlParameter("@TAGHead_Approver", SqlDbType.VarChar))
               .Value = obj.TAGHead_Approver;
                cmdObj.Parameters
               .Add(new SqlParameter("@IsReinitiate", SqlDbType.Char))
               .Value = obj.IsReinitiate;
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
             .Add(new SqlParameter("@variablePay", SqlDbType.Decimal))
             .Value = obj.variablePay;
                cmdObj.Parameters
             .Add(new SqlParameter("@JustificationBucketId", SqlDbType.Int))
             .Value = obj.JustificationBucketId;
                cmdObj.Parameters
                  .Add(new SqlParameter("@ContractExtensionRemarks", SqlDbType.NVarChar, 2000))
                  .Value = obj.ContractExtensionRemarks;
                cmdObj.Parameters
   .Add(new SqlParameter("@OfferReleasedFor", SqlDbType.NVarChar, 500))
   .Value = obj.OfferReleasedFor;
                cmdObj.Parameters
               .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
               .Value = obj.CDO_Approver;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                ActionId = Convert.ToInt32(cmdObj.Parameters["@ActionId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addUpdateOfferApprovalSupport");
                result = -1;
            }
            return result;
        }

        public DataSet GetFunctionHeadApproverList(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetFunctionHeadApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "FuncHeadLevel";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetFunctionHeadApproverList");
            }
            return ds;
        }


         public DataSet getEmployeeAllotmentDetails(int thid, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getEmployeeAllocatedDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@thid", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getEmployeeAllotmentDetails");
            }
            return ds;
        }

        public int SaveUpdateOfferTemplates(SaveUpdateOfferTemplatesModel obj)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SaveUpdateOfferTemplates";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = obj.cid;
                cmdObj.Parameters
             .Add(new SqlParameter("@offerTemplate", SqlDbType.NVarChar, -1))
             .Value = obj.offerTemplate;
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SaveUpdateOfferTemplates Rep");
                result = -1;
            }
            return result;
        }

        public DataSet GetOfferDocumentDetailForCopyToMurcury(int cid, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetOfferDocumentDetailForCopyToMurcury";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferDocumentDetailForCopyToMurcury");
                ds = null;
            }
            return ds;
        }

        public int UpdatePathCopyToMurcury(string Empid,int cid, string docType, string path)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdatePathCopyToMurcury";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.Parameters
               .Add(new SqlParameter("@result", SqlDbType.Int))
               .Direction = ParameterDirection.Output;
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
             .Add(new SqlParameter("@cid", SqlDbType.Int))
             .Value = cid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@docType", SqlDbType.VarChar))
                 .Value = docType;
                cmdObj.Parameters
               .Add(new SqlParameter("@path", SqlDbType.NVarChar, 1000))
               .Value = path;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                .Value = Empid;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePathCopyToMurcury");
                result = -1;
            }
            return result;
        }


        public DataSet AddupdateFolderPathOnboarding(int cid, string previousPath, string newPath, string addedby)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "AddupdateFolderPath_Onboarding";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@PreviousPath", SqlDbType.NVarChar))
               .Value = previousPath;
                cmdObj.Parameters
               .Add(new SqlParameter("@NewPath", SqlDbType.NVarChar))
               .Value = newPath;
                cmdObj.Parameters
               .Add(new SqlParameter("@addedBy", SqlDbType.VarChar))
               .Value = addedby;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddupdateFolderPathOnboarding");
            }
            return ds;
        }

        public DataSet UpdatePdfPath(int cid, string newPath)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "UpdatePdfPath";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
               .Add(new SqlParameter("@NewPath", SqlDbType.NVarChar))
               .Value = newPath;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePdfPath");
            }
            return ds;
        }

        public DataSet IsDateofJoiningChange(int cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_IsDateofJoiningChange";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetResumePathForCandidate");
            }
            return ds;
        }


        public DataSet GetTidReopenOfferApprovalFileName(int id, string EmpId, out int result)
        {
            DataSet ds = null;
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetTidReopenOfferApprovalFileName";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTidReopenOfferApprovalFileName");
                ds = null;
            }
            return ds;
        }

        public DataSet GetAllReopenedSelectedCandidatesList(string EmpId, OfferGenerationFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAllReopenedSelectedCandidatesList";
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
                //   cmdObj.Parameters
                //.Add(new SqlParameter("@dropResonId", SqlDbType.NVarChar, 2000))
                //.Value = obj.dropResonId;
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
                cmdObj.Parameters
                 .Add(new SqlParameter("@PracticeId", SqlDbType.NVarChar))
                  .Value = obj.PracticeId;
                //cmdObj.Parameters
                // .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                // .Value = search;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllReopenedSelectedCandidatesList");
            }
            return ds;
        }

          public int AddTidReopenOfferApprovalAttachment(OfferApprovalDoc model, string Empid)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "Sp_AddReopenTidOfferApprovalAttachment";
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
               .Value = ToDataTable<ApprovalAttachment>(model.ApprovalAttachments);
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddTidReopenOfferApprovalAttachment");
                result = -1;
            }
            return result;
        }

        public DataSet GetCandidateDetailsForApproval(int cid,string EmpId, out int result)
        {
            DataSet ds = new DataSet();

            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateDetailsForApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateDetailsForApproval");
            }
            return ds;
        }

        //generate get api method like above 

    }


}