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
    public class OfferG5AboveRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "OfferG5AboveRepository";
        DataUtility du;
        public OfferG5AboveRepository()
        {
            du = new DataUtility();
        }
        public DataSet GetG5AboveSelectedCandidatesList(string EmpId, OfferGenerationFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetAllG5AboveSelectedCandidatesList";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSelectedCandidatesList");
            }
            return ds;
        }

        public int addUpdateOfferApprovalG5Above(OfferApprovalModelG5Above obj, string empId, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addUpdateOfferApprovalG5Above";
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
                .Add(new SqlParameter("@CTC", SqlDbType.Decimal))
                .Value = obj.ctc;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningBonus", SqlDbType.Decimal))
               .Value = obj.joiningBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@NoticeBuyOut", SqlDbType.Decimal))
               .Value = obj.NoticeBuyOut;
                cmdObj.Parameters
               .Add(new SqlParameter("@TravelExp", SqlDbType.Decimal))
               .Value = obj.TravelExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RelocationExp", SqlDbType.Decimal))
               .Value = obj.RelocationExp;
                cmdObj.Parameters
               .Add(new SqlParameter("@RetentionBonus", SqlDbType.Decimal))
               .Value = obj.RetentionBonus;
                cmdObj.Parameters
               .Add(new SqlParameter("@salary", SqlDbType.Decimal))
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
                .Add(new SqlParameter("@FunctionHead", SqlDbType.VarChar))
                .Value = obj.FunctionHead;
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
              .Add(new SqlParameter("@variablePay", SqlDbType.Decimal))
              .Value = obj.variablePay;
                cmdObj.Parameters
              .Add(new SqlParameter("@variablePayDuration", SqlDbType.Int))
              .Value = obj.variablePayDuration;
                cmdObj.Parameters
              .Add(new SqlParameter("@SAR", SqlDbType.Decimal))
              .Value = obj.SAR;
                cmdObj.Parameters
             .Add(new SqlParameter("@variablePayPercent", SqlDbType.Decimal))
             .Value = obj.variablePayPercent;
                cmdObj.Parameters
              .Add(new SqlParameter("@MIP", SqlDbType.Decimal))
              .Value = obj.MIP;
                cmdObj.Parameters
              .Add(new SqlParameter("@CDO_Approver", SqlDbType.VarChar))
              .Value = obj.CDO_Approver;              
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionId", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
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

        public int UpdateEditOfferApprovalG5Above(OfferApprovalModelG5Above obj, string empId, ref string Message, ref int ActionId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateEditOfferApprovalG5Above";
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
              .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
              .Value = empId;
                cmdObj.Parameters
                .Add(new SqlParameter("@FunctionHead", SqlDbType.VarChar))
                .Value = obj.FunctionHead;
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
              .Add(new SqlParameter("@variablePay", SqlDbType.BigInt))
              .Value = obj.variablePay;
                cmdObj.Parameters
              .Add(new SqlParameter("@variablePayDuration", SqlDbType.Int))
              .Value = obj.variablePayDuration;
                cmdObj.Parameters
              .Add(new SqlParameter("@SAR", SqlDbType.Decimal))
              .Value = obj.SAR;
                cmdObj.Parameters
              .Add(new SqlParameter("@MIP", SqlDbType.BigInt))
              .Value = obj.MIP;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@ActionId", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                ActionId = Convert.ToInt32(cmdObj.Parameters["@ActionId"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdateEditOfferApprovalG5Above");
                result = -1;
            }
            return result;
        }

        public int UpdateOfferApprovalStatusG5Above(int cid, string empId, string ActionTaken, char IsDelegator, string Remark, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_UpdateOfferApprovalStatusG5Above";
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
                .Add(new SqlParameter("@Remark", SqlDbType.VarChar))
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

        public DataSet GetApprovedG5AboveCandidatesList(string EmpId, OfferGenerationFilter obj, out int result)

        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_GetApprovedG5AboveCandidateList";
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
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "pagination";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedG5AboveCandidatesList");
            }
            return ds;
        }

          public DataSet GetG5AboveApproverList(string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getG5AboveApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);              
                cmdObj.Parameters.Add(outputParam);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "TagHeadLevel";
                ds.Tables[1].TableName = "FuncHeadLevel";
                ds.Tables[2].TableName = "COOLevel";
                ds.Tables[3].TableName = "CDOLevel";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTagHeadG5AboveList");
            }
            return ds;
        }

         public DataSet GetGradeMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getGradeMasterG5Above";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetGradeMaster");
            }
            return ds;
        }

        public DataSet GetVariablePayPercentageMaster(int? gradeId, int? cid, int? cubeId, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getVariablePayPercentageMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
             .Add(new SqlParameter("@GradeId", SqlDbType.Int))
              .Value = gradeId;
                cmdObj.Parameters
            .Add(new SqlParameter("@Cid", SqlDbType.Int))
             .Value = cid;
                cmdObj.Parameters
            .Add(new SqlParameter("@CubeId", SqlDbType.Int))
             .Value = cubeId;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "type";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVariablePayPercentageMaster");
            }
            return ds;
        }

        public DataSet GetCandidateInformationForPDF(PdfModelG5Above model, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GetCandidateInformationForPDFInfogainG5Above";
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

        public DataSet GeDetailsForUploadOffer(PdfModelG5Above model, string Empid)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "GeDetailsForUploadOfferG5AndAbove";
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
                ds = du.GetDataSetWithProc(cmdObj);
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


    }
}