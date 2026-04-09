using Aspose.Pdf.Devices;
using ATSAPI.App_Data;
using ATSAPI.Models;
using MessageBird.Objects.Voice;
using Microsoft.Office.Interop.Outlook;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http.Results;
using Exception = System.Exception;

namespace ATSAPI.Repositry
{
    public class PartnerRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "PartnerRepository";
        DataUtility du;

        public PartnerRepository()
        {
            du = new DataUtility();
        }

        public int AddUpdatePartnerDetails(PartnerModel obj, string Password, string Salt, string pwdTxt, string EmpId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "addUpdatePartnerDetails_multipleContract";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = obj.PartnerID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Name", SqlDbType.VarChar))
                 .Value = obj.Name;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Email", SqlDbType.VarChar))
                 .Value = obj.Email;
                cmdObj.Parameters
                .Add(new SqlParameter("@ContactNo", SqlDbType.VarChar))
                .Value = obj.ContactNo;
                cmdObj.Parameters
                .Add(new SqlParameter("@CountryID", SqlDbType.Int))
                .Value = obj.CountryID;
                cmdObj.Parameters
                .Add(new SqlParameter("@CityID", SqlDbType.Int))
                .Value = obj.CityID;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@ContractTypeID", SqlDbType.Int))
                //.Value = obj.ContractTypeID;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@ContractAvailability", SqlDbType.Char))
                //.Value = obj.ContractAvailability;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@StartDate", SqlDbType.VarChar))
                //.Value = obj.StartDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@EndDate", SqlDbType.VarChar))
                //.Value = obj.EndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@TagHeadApprover", SqlDbType.VarChar))
                .Value = obj.TagHeadApprover;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@MSAEffectiveDate", SqlDbType.VarChar))
                //.Value = obj.MSAEffectiveDate;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@NDAEffectiveDate", SqlDbType.VarChar))
                //.Value = obj.NDAEffectiveDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = obj.AddedBy;
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
                .Add(new SqlParameter("@Action", SqlDbType.VarChar))
                .Value = obj.Action;
                cmdObj.Parameters
               .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
               .Value = obj.HiringlocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine1", SqlDbType.NVarChar))
               .Value = obj.addressLine1;
                cmdObj.Parameters
               .Add(new SqlParameter("@AddressLine2", SqlDbType.NVarChar))
               .Value = obj.addressLine2;
                cmdObj.Parameters
             .Add(new SqlParameter("@cityName", SqlDbType.NVarChar))
             .Value = obj.city;
                cmdObj.Parameters
             .Add(new SqlParameter("@stateName", SqlDbType.NVarChar))
             .Value = obj.state;
                cmdObj.Parameters
             .Add(new SqlParameter("@postalCode", SqlDbType.Int))
             .Value = obj.postalCode;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ContractDetails", SqlDbType.Structured))
                 .Value = ToDataTable<ContractDetail>(obj.ContractDetails);
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdatePartnerDetails");
                result = -1;
            }
            return result;
        }
        public string getEmailByPartnerId(int PartnerID, string EmpId, out int result1)
        {
            string result = "";
            result1 = 0;
            try
            {
                OpeneConnection();
                string _sql = "getEmailByPartnerId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = PartnerID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.VarChar, 100))
                 .Direction = ParameterDirection.Output;
                SqlParameter outputParam = new SqlParameter("@result1", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                du.ExecuteSqlProcedure(cmdObj);
                result1 = Convert.ToInt32(outputParam.Value);
                result = Convert.ToString(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getEmailByPartnerId");
                result = "";
            }
            return result;

        }
        public int approveRejectPartnerDetails(int PartnerID, string empID, char ActionTaken,string remarks, string pwdTxt)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "approveRejectPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Action", SqlDbType.Char))
                .Value = ActionTaken;
                cmdObj.Parameters
               .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
               .Value = remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@TagHeadApprover", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@pwdTxt", SqlDbType.NVarChar))
                .Value = pwdTxt;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "approveRejectPartnerDetails");
                result = -1;
            }
            return result;

        }
        public int ChangePartnerStatus(int PartnerID, int status, string Remarks, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ChangePartnerStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Int))
                .Value = status;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePartnerStatus");
                result = -1;
            }
            return result;
        }
        public int CreatePartnerUser(PartnerUser obj, string Password, string Salt, string pwdTxt)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "CreatePartnerUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = obj.PartnerID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Email", SqlDbType.VarChar))
                 .Value = obj.Email;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = obj.AddedBy;
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
              .Add(new SqlParameter("@ContactNo ", SqlDbType.VarChar))
              .Value = obj.ContactNo;
                cmdObj.Parameters
              .Add(new SqlParameter("@Name", SqlDbType.VarChar))
              .Value = obj.Name;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
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
        public DataSet getPartnerFullDetails(string EmpID, out int result, int page, int pageSize, string search, int PartnerID, string statusId, string ContractTypeID = "")
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPartnerFullDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = PartnerID;
                cmdObj.Parameters
               .Add(new SqlParameter("@statusId", SqlDbType.NVarChar))
               .Value = statusId;
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
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = search;
                cmdObj.Parameters
               .Add(new SqlParameter("@ContractType", SqlDbType.VarChar))
               .Value = ContractTypeID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPartnerFullDetails");
            }
            return ds;
        }

        public DataSet getAllPartnerList(PartnerDetailFilter obj, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllPartnerList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                .Value = obj.PartnerID;
                cmdObj.Parameters
               .Add(new SqlParameter("@statusId", SqlDbType.NVarChar))
               .Value = obj.statusId;
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
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                cmdObj.Parameters
               .Add(new SqlParameter("@ContractType", SqlDbType.VarChar))
               .Value = obj.ContractTypeID;
                cmdObj.Parameters
               .Add(new SqlParameter("@pendingwithme", SqlDbType.Int))
               .Value = obj.pendingWithMe;
                cmdObj.Parameters
              .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
              .Value = obj.hiringLocationId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllPartnerList");
            }
            return ds;
        }
        public DataSet getPartnerUsersList(PartnerMultiselectFilter obj ,string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result=0;
            try
            {
                OpeneConnection();
                string _sql = "getPartnerUsersList";
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
                .Add(new SqlParameter("@search", SqlDbType.NVarChar))
                .Value = obj.search;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.NVarChar, 2000))
                .Value = obj.PartnerID;
                cmdObj.Parameters
               .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
               .Value = obj.hiringLocationId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPartnerFullDetails");
            }
            return ds;
        }

        public int ChangePartnerUserStatus(int UserID, int status, string Remarks, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ChangePartnerUserStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserID", SqlDbType.Int))
                .Value = UserID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Status", SqlDbType.Int))
                .Value = status;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@UpdatedBy", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePartnerUserStatus");
                result = -1;
            }
            return result;
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
                 .Add(new SqlParameter("@per_joiningDate", SqlDbType.VarChar))
                 .Value = cnd.joiningDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_Name", SqlDbType.NVarChar))
                 .Value = cnd.Name;
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
                 .Add(new SqlParameter("@CityId", SqlDbType.Int))
                 .Value = cnd.CityId;
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
                 .Add(new SqlParameter("@Gender", SqlDbType.Int))
                 .Value = cnd.Gender;
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


        public int AssignTalentIdToPartner(AssignTalentIdPartner obj, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_assignTalentIdToPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AssignID", SqlDbType.Int))
                .Value = obj.AssignID;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.VarChar))
                .Value = obj.PartnerIDs;
                cmdObj.Parameters
                .Add(new SqlParameter("@thId", SqlDbType.VarChar))
                .Value = obj.thid;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.VarChar))
                .Value = obj.Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@reasonid", SqlDbType.Int))
                .Value = obj.reasonid;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.NVarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@ContractTypeID", SqlDbType.NVarChar))
                .Value = obj.candidateType;
                cmdObj.Parameters
                .Add(new SqlParameter("@TAGLeadID", SqlDbType.NVarChar))
                .Value = obj.TAGLeadID;
                cmdObj.Parameters
                .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
                .Value = obj.SalaryType;
                cmdObj.Parameters
                .Add(new SqlParameter("@basePay", SqlDbType.Decimal))
                .Value = obj.basePay;
                cmdObj.Parameters
                .Add(new SqlParameter("@workingRemoteStatus", SqlDbType.Int))
                .Value = obj.workingRemoteStatus;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AssignTalentIdToPartner");
                result = -1;
            }
            return result;
        }

        public DataSet getListOfPartnerTalentID(PartnerTalentFilter obj,string empID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getPartnerTalentId";
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
                .Add(new SqlParameter("@partnerID", SqlDbType.VarChar))
              .Value = obj.partnerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@SortColumn", SqlDbType.VarChar))
              .Value = obj.sortColumn;
                cmdObj.Parameters
               .Add(new SqlParameter("@SortDir", SqlDbType.VarChar))
             .Value = obj.sortDir;
                cmdObj.Parameters
                 .Add(new SqlParameter("@statusID", SqlDbType.VarChar))
               .Value = obj.statusID;
                cmdObj.Parameters
                .Add(new SqlParameter("@empID", SqlDbType.VarChar))
               .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Account", SqlDbType.VarChar))
              .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Practice", SqlDbType.VarChar))
              .Value = obj.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@approverMe", SqlDbType.NVarChar, 200))
               .Value = obj.pendingWithMe;
                cmdObj.Parameters
              .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
            .Value = obj.hiringLocationId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getListOfPartnerTalentID");
            }
            return ds;
        }

        public int partnerTalentIdStatusUpdate(string partnerId, string thid, int status, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_partnerTalentIdStatusUpdate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.VarChar))
                .Value = partnerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = status;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@updated_by", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = thid;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "partnerTalentIdStatusUpdate");
                result = -1;
            }
            return result;
        }

        public int addupdateCandidateByPartner(parnerCandidateProfile cnd, ref string Message, string PartnerId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_addupdateCandidateByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
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
                 .Add(new SqlParameter("@per_secondary_skill", SqlDbType.NVarChar))
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
                //cmdObj.Parameters
                //.Add(new SqlParameter("@per_partnerID", SqlDbType.Int))
                //.Value = cnd.PartnerID;
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
                .Add(new SqlParameter("@per_contractTypeId", SqlDbType.Int))
                .Value = cnd.contractType;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_currencyTypeId", SqlDbType.Int))
                .Value = cnd.currencyTypeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_noticePeriod", SqlDbType.Int))
                .Value = cnd.noticePeriod;
                cmdObj.Parameters
                .Add(new SqlParameter("@per_expSalary", SqlDbType.NVarChar))
                .Value = cnd.expSalary;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_curSalary", SqlDbType.NVarChar))
                 .Value = cnd.curSalary;
                cmdObj.Parameters
               .Add(new SqlParameter("@currentCompany", SqlDbType.VarChar))
               .Value = cnd.currentOrg;
                cmdObj.Parameters
                 .Add(new SqlParameter("@eduQualification", SqlDbType.NVarChar))
                 .Value = cnd.eduQualification;
                cmdObj.Parameters
                .Add(new SqlParameter("@CountryId", SqlDbType.Int))
                .Value = cnd.countyId;
                cmdObj.Parameters
                .Add(new SqlParameter("@CityId", SqlDbType.Int))
                .Value = cnd.cityId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Gender", SqlDbType.Int))
                .Value = cnd.Gender;
                cmdObj.Parameters
                .Add(new SqlParameter("@dob", SqlDbType.VarChar))
                .Value = cnd.dob;
                cmdObj.Parameters
               .Add(new SqlParameter("@SalaryType", SqlDbType.Int))
               .Value = cnd.SalaryType;
                cmdObj.Parameters
               .Add(new SqlParameter("@stateid", SqlDbType.Int))
               .Value = cnd.StateId;
                cmdObj.Parameters
               .Add(new SqlParameter("@HiringLocationId", SqlDbType.Int))
               .Value = cnd.HiringLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@relocation", SqlDbType.Int))
               .Value = cnd.relocation;
                cmdObj.Parameters
               .Add(new SqlParameter("@workVisaStatus", SqlDbType.Int))
               .Value = cnd.workVisaStatus;
                cmdObj.Parameters
               .Add(new SqlParameter("@visaExpireDate", SqlDbType.VarChar))
               .Value = cnd.visaExpireDate;
                cmdObj.Parameters
              .Add(new SqlParameter("@link", SqlDbType.NVarChar))
              .Value = cnd.link;
                cmdObj.Parameters
               .Add(new SqlParameter("@partnerId", SqlDbType.VarChar))
               .Value = PartnerId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addupdateCandidateByPartner");
                result = -1;
            }
            return result;
        }

        public DataSet getTalentIDParterWise(int page, int pageSize, string search, string userID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getTalentIdPartnerWise";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                .Add(new SqlParameter("@UserID", SqlDbType.VarChar))
               .Value = userID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTalentIDParterWise");
            }
            return ds;
        }


        public DataSet getCandidateListByPartner(int page, int pageSize, string search, int? statusID, string startDate, string endDate, string sortColumn, string sortDir, string userID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateListByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                .Add(new SqlParameter("@userId", SqlDbType.VarChar))
               .Value = userID;
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
                 .Add(new SqlParameter("@statusID", SqlDbType.VarChar))
               .Value = statusID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateListByPartner");
            }
            return ds;
        }

        public int candidateStatusUpdateByPartner(string partnerId, string id, int status, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_candidateStatusUpdateByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.VarChar))
                .Value = partnerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = status;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "candidateStatusUpdateByPartner");
                result = -1;
            }
            return result;
        }

        public int CandidateWithrawnByPartner(string partnerId, string id, int status, char isCache, string Remarks, string empID,int? cid, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_candidateWithrawnByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.VarChar))
                .Value = partnerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = status;
                cmdObj.Parameters
              .Add(new SqlParameter("@cid", SqlDbType.Int))
              .Value = cid;
                cmdObj.Parameters
             .Add(new SqlParameter("@isCache", SqlDbType.Char))
             .Value = isCache;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateWithrawnByPartner");
                result = -1;
            }
            return result;
        }

        public DataSet checkEmailExistUploadProfByPartner(string email)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_checkEmailExistUploadProfByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                cmdObj.Parameters
                .Add(new SqlParameter("@Email", SqlDbType.NVarChar))
                .Value = email;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "checkEmailExistUploadProfByPartner");
            }
            return ds;
        }

        public DataSet getCandidateDetailsPartner(int id, string UserId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDetailsPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters.Add(new SqlParameter("@UserId", SqlDbType.NVarChar)).Value = UserId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetailsPartner");
            }
            return ds;
        }

        public DataSet getPartnerCandidateListByTalentId(int page, int pageSize, string search, int? statusID, string startDate, string endDate, string sortColumn, string sortDir, string userID, string thId, out int result, int? intStatus, int? screenReject)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getPartnerCandidateListByTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
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
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
               .Value = userID;
                cmdObj.Parameters
                .Add(new SqlParameter("@talentId", SqlDbType.VarChar))
                .Value = thId;
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
                 .Add(new SqlParameter("@statusID", SqlDbType.VarChar))
               .Value = statusID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@IntStatus", SqlDbType.Int))
                 .Value = intStatus;
                cmdObj.Parameters
                .Add(new SqlParameter("@screenRejected", SqlDbType.Int))
               .Value = screenReject;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPartnerCandidateListByTalentId");
            }
            return ds;
        }

        public DataSet getRequisitionTHIDByPartner(string thid, out int result, string userID = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getRequisitionTHIDByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_thid", SqlDbType.NVarChar))
                 .Value = thid;
                cmdObj.Parameters
                    .Add(new SqlParameter("@userID", SqlDbType.VarChar))
                    .Value = userID;
                SqlParameter outputParam = new SqlParameter("@result", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(outputParam);
                ds = du.GetDataSetWithProc(cmdObj);
                result = Convert.ToInt32(outputParam.Value);
                ds.Tables[0].TableName = "data";
                ds.Tables[1].TableName = "contractTypes";
                ds.Tables[2].TableName = "AssignDetails";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRequisitionByThid");
            }
            return ds;
        }

        public int partnerProfileScreenReject(string id, int screenRejected, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_partnerProfileScreenReject";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "partnerProfileScreenReject");
                result = -1;
            }
            return result;
        }

        public int addComapnyList(string name, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "addCompanyList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@comName", SqlDbType.VarChar))
                .Value = name;
                cmdObj.Parameters
                .Add(new SqlParameter("@added_by", SqlDbType.VarChar))
                .Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addComapnyList");
                result = -1;
            }
            return result;
        }


        public int resetPartnerUserPassword(int userId, string Password, string Salt, string pwdTxt, string EmpID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "resetPasswordPartnerUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserID", SqlDbType.Int))
                .Value = userId;
                cmdObj.Parameters
                .Add(new SqlParameter("@AddedBy", SqlDbType.VarChar))
                .Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "resetPartnerUserPassword");
                result = -1;
            }
            return result;
        }

        public DataSet getpartnerselectionreason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getpartnerselectionreason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getpartnerselectionreason");
            }
            return ds;
        }

        public int TransferCandidateByPartner(int id, int? cid, string toThId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "TransferCandidateByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
               .Add(new SqlParameter("@cid", SqlDbType.Int))
               .Value = cid;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.NVarChar))
              .Value = toThId;
                cmdObj.Parameters
           .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
           .Value = remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar, 500))
               .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "PartnerTalentTransferRequest");
                result = -1;
            }
            return result;

        }

        public int TransferUnattendedProfileByPartner(int id, string toThId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "TransferUnattendedProfileByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.NVarChar))
              .Value = toThId;
                cmdObj.Parameters
           .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
           .Value = remarks;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar, 500))
               .Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "PartnerTalentTransferRequest");
                result = -1;
            }
            return result;

        }


        //public DataSet getProfilesListSharedByPartner(int page, int pageSize, string search = null, int? partnerId = null, int? primarySkill = null, int? contractType = null, string SDate = null, string EDate = null)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        OpeneConnection();
        //        string _sql = "getProfilesListSharedByPartner";
        //        cmdObj = new SqlCommand(_sql, ConCampus);
        //        cmdObj.CommandType = CommandType.StoredProcedure;
        //        cmdObj.Parameters
        //       .Add(new SqlParameter("@page", SqlDbType.Int))
        //        .Value = page;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@pageSize", SqlDbType.Int))
        //         .Value = pageSize;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@search", SqlDbType.NVarChar, 500))
        //        .Value = search;
        //        cmdObj.Parameters
        //         .Add(new SqlParameter("@partnerId", SqlDbType.Int))
        //         .Value = partnerId;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@skillId", SqlDbType.Int))
        //       .Value = primarySkill;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@contractTypeId", SqlDbType.Int))
        //        .Value = contractType;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@SDate", SqlDbType.NVarChar, 500))
        //        .Value = SDate;
        //        cmdObj.Parameters
        //        .Add(new SqlParameter("@EDate", SqlDbType.NVarChar, 500))
        //        .Value = EDate;

        //        ds = du.GetDataSetWithProc(cmdObj);
        //        ds.Tables[0].TableName = "data";
        //        ds.Tables[1].TableName = "pagination";
        //        CloseConnection();
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfilesListSharedByPartner");
        //    }
        //    return ds;
        //}

        public DataSet getProfilesListSharedByPartner(PartnerProfileFilter obj, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result  = 0;
            try
            {
                OpeneConnection();
                string _sql = "getProfilesListSharedByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar, 500))
                .Value = obj.search;
                cmdObj.Parameters
                 .Add(new SqlParameter("@partnerId", SqlDbType.NVarChar, 2000))
                 .Value = obj.PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@skillId", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractTypeId", SqlDbType.NVarChar, 2000))
                .Value = obj.contractType;
                cmdObj.Parameters
                .Add(new SqlParameter("@SDate", SqlDbType.NVarChar, 500))
                .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EDate", SqlDbType.NVarChar, 500))
                .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@Account", SqlDbType.NVarChar, 2000))
                .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Practice", SqlDbType.NVarChar, 2000))
                .Value = obj.practiceId;
                cmdObj.Parameters
               .Add(new SqlParameter("@hiringLocationId", SqlDbType.NVarChar, 2000))
               .Value = obj.hiringLocationId;
                cmdObj.Parameters
               .Add(new SqlParameter("@recruiterId", SqlDbType.NVarChar, 2000))
               .Value = obj.recruiterId;
                cmdObj.Parameters.Add(new SqlParameter("@EmpId", SqlDbType.NVarChar)).Value = EmpId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfilesListSharedByPartner");
            }
            return ds;
        }


        public int CandidateTransferRequestByPartner(int cid, string toThId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_candidate_transfer_request_by_partner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = cid;
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


        public int ApprRejectCandidateTransferReqByPartner(int cid, string transferStatus, string remark, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_apprRejectCandidateTransferReqByPartner";
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

        public int UnattendedCandidateTransferRequestByPartner(int id, string toThId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_unattended_candidate_transfer_request_by_partner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UnattendedCandidateTransferRequestByPartner");
                result = -1;
            }
            return result;

        }


        public int UnattendedApprRejectCandidateTransferReqByPartner(int id, string transferStatus, string remark, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_apprRejectUntendedCandidateTransferReqByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@id", SqlDbType.Int))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UnattendedApprRejectCandidateTransferReqByPartner");
                result = -1;
            }
            return result;
        }
        public int UnattendedCandidateTransfer(int id, string toThId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_partnerprofileTransferByRecruiter";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UnattendedCandidateTransfer");
                result = -1;
            }
            return result;

        }

        public int UpdatePartnerTHIDAssignStatus(int AssignID, string Action, string empID, ref string Message, string Remarks = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "spUpdatePartnerTHIDAssignStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AssignID", SqlDbType.Int))
                .Value = AssignID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Action", SqlDbType.VarChar))
                .Value = Action;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePartnerTHIDAssignStatus");
                result = -1;
            }
            return result;
        }

        public int ChangeApprover(int AssignID, string TAGLeadID, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ChangeTalentIdPartnerApprover";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AssignID", SqlDbType.Int))
                .Value = AssignID;
                cmdObj.Parameters
                .Add(new SqlParameter("@TAGLeadID", SqlDbType.VarChar))
                .Value = TAGLeadID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatePartnerTHIDAssignStatus");
                result = -1;
            }
            return result;
        }

        public DataSet GetPartnerTalentContractType(string empId, string thid, string partnerId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetPartnerTalentContractType";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empId;
                cmdObj.Parameters
               .Add(new SqlParameter("@thid", SqlDbType.VarChar))
                .Value = thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@partnerID", SqlDbType.VarChar))
                .Value = partnerId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPartnerTalentContractType");
            }
            return ds;
        }

        public int ChangeCandidateProfileSource(int profileUniqid, int profileSourceId, string empID, ref string Message, string Remarks)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ChangeCandidateProfileSource";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@profileUniqid", SqlDbType.Int))
                .Value = profileUniqid;
                cmdObj.Parameters
                .Add(new SqlParameter("@profileSourceId", SqlDbType.VarChar))
                .Value = profileSourceId;               
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
                cmdObj.Parameters
                .Add(new SqlParameter("@remarks", SqlDbType.NVarChar))
                .Value = Remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangeCandidateProfileSource");
                result = -1;
            }
            return result;
        }

        public DataSet getProfilesListSharedByPartnerReport(PartnerProfileFilter obj, string empID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getProfilesListSharedByPartner_report";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = obj.page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = obj.pageSize;
                cmdObj.Parameters
                .Add(new SqlParameter("@search", SqlDbType.NVarChar, 500))
                .Value = obj.search;
                cmdObj.Parameters
                 .Add(new SqlParameter("@partnerId", SqlDbType.NVarChar, 2000))
                 .Value = obj.PartnerID;
                cmdObj.Parameters
                .Add(new SqlParameter("@skillId", SqlDbType.NVarChar, 2000))
               .Value = obj.primarySkill;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractTypeId", SqlDbType.NVarChar, 2000))
                .Value = obj.contractType;
                cmdObj.Parameters
                .Add(new SqlParameter("@SDate", SqlDbType.NVarChar, 500))
                .Value = obj.startDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@EDate", SqlDbType.NVarChar, 500))
                .Value = obj.endDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@Account", SqlDbType.NVarChar, 2000))
                .Value = obj.accountId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Practice", SqlDbType.NVarChar, 2000))
                .Value = obj.practiceId;
                cmdObj.Parameters
                .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
                .Value = obj.hiringLocationId;


                cmdObj.Parameters.Add(new SqlParameter("@empId", SqlDbType.VarChar, 100)).Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfilesListSharedByPartnerReport");
            }
            return ds;
        }

        public DataSet getPendingWithMePartnerTalentId(string empId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_getPendingWithMePartnerTalentId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@empId", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getPendingWithMePartnerTalentId");
            }
            return ds;
        }

        public int ApproveOrRejectPartnerTHID (string AssignID, string Action, string empID, ref string Message, string Remarks = null)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SP_ApproveOrRejectPartnerTHID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AssignIdList", SqlDbType.VarChar))
                .Value = AssignID;
                cmdObj.Parameters
                .Add(new SqlParameter("@Action", SqlDbType.VarChar))
                .Value = Action;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.NVarChar))
                .Value = Remarks;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                .Value = empID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApproveOrRejectPartnerTHID");
                result = -1;
            }
            return result;
        }

        public DataSet getActivePartnerList(string EmpID, ActivePartnerListFilter obj, out int result)
        {
            DataSet ds = new DataSet();
            result=0;
            try
            {
                OpeneConnection();
                string _sql = "getActivePartnerList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@statusId", SqlDbType.NVarChar))
               .Value = obj.statusId;
                cmdObj.Parameters
            .Add(new SqlParameter("@ContractType", SqlDbType.NVarChar))
            .Value = obj.ContractTypeID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
                 .Value = EmpID;
                cmdObj.Parameters
              .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
              .Value = obj.hiringLocationId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getActivePartnerList");
            }
            return ds;
        }

        public DataSet getPartnerDetailsById(string EmpID, int partnerId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPartnerDetailsById";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
               .Value = partnerId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpID", SqlDbType.VarChar))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPartnerDetailsById");
            }
            return ds;
        }

        public DataSet getAllOpenRequisitionForAssignToPartner(AssignToPartnerGetModel paramBody, string empid, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllOpenRequisitionForAssign";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empid;
                cmdObj.Parameters
                 .Add(new SqlParameter("@hiringLocationId", SqlDbType.Int))
                 .Value = paramBody.hiringLocationId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                 .Value = paramBody.searchText;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountId", SqlDbType.NVarChar))
                .Value = paramBody.AccountId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOpenRequisitionForAssignToPartner");
            }
            return ds;
        }

        public DataSet GetPartnerTagHeadApproverByLoc(string EmpId, out int result,int? locId = 0)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPartnerTagHeadApproverByLoc";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                 .Value = locId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPartnerTagHeadApproverByLoc");
            }
            return ds;
        }


        public DataSet GetPartnerTagLeadApproverByLoc(string EmpId, out int result, int? locId = 0)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getPartnerTagLeadApproverByLoc";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationId", SqlDbType.Int))
                 .Value = locId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPartnerTagLeadApproverByLoc");
            }
            return ds;
        }

        public DataSet GetPartnerDashboard(int partnerId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "GetPartnerDashboard";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PartnerId", SqlDbType.Int))
                 .Value = partnerId;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPartnerTagLeadApproverByLoc");
            }
            return ds;
        }

        public DataSet GetTaletentDeatil(int page, int pageSize,int partnerId, char Action, out int result, string search = null)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getTalentIdTalentofPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Page", SqlDbType.Int))
                 .Value = page;
                cmdObj.Parameters
                 .Add(new SqlParameter("@pageSize", SqlDbType.Int))
                 .Value = pageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PartnerId", SqlDbType.Int))
                 .Value = partnerId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Action", SqlDbType.Char))
                 .Value = Action;
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
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTaletentDeatil");
            }
            return ds;
        }

        public DataSet GetIsAccountSameForPartnerTransfer(int CID, int ToTHID, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_IsAccountSameForPartnerTransfer";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetIsAccountSameForPartnerTransfer");
            }
            return ds;
        }

        public DataSet GetRecruiterSameForPartnerTransfer(int CID, string EmpId, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_RecruiterSameForPartnerTransfer";
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
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRecruiterSameForPartnerTransfer");
            }
            return ds;
        }

        public int transferPratnerCandidateByTalentId(TransferProfile cnd, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_transferPratnerCandidateByTalentId";
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
                cmdObj.Parameters
             .Add(new SqlParameter("@Action", SqlDbType.Char))
             .Value = cnd.Action;
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

        public int ApprovePartnerProfileTransfer(int id, string transferStatus, string remark, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ApprovePartnerProfileTransfer";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ApprovePartnerProfileTransfer");
                result = -1;
            }
            return result;
        }

        public int UnattendedCandidateTransferPartnerProfile(int id, string toThId, string EmpId, string remarks, char Action, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_UnattendedPartnerProfileTransfer";
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
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@Message", SqlDbType.NVarChar, 1000))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
            .Add(new SqlParameter("@Action", SqlDbType.Char))
            .Value = Action;

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

        public int ApproveUnAttendentTransferPartnerProfile(int id, string transferStatus, string remark, string empId, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_ApproveUnAttendentTransferPartnerProfile";
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

        public int TransferAttendedProfileSourceforPartner(PartnerProfileSourceTransfer cnd, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_transferAttendedProfileforPartner";
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
                .Add(new SqlParameter("@IsTHIDPresent", SqlDbType.Char))
                .Value = cnd.IsTHIDPresent;
                cmdObj.Parameters
               .Add(new SqlParameter("@ProfileSorceId", SqlDbType.Int))
               .Value = cnd.ProfileSorceId;
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
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeId", SqlDbType.Int))
                .Value = cnd.gradeId;
                cmdObj.Parameters
                .Add(new SqlParameter("@gradeBand", SqlDbType.Char))
                .Value = cnd.gradeBand;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "TransferAttendedProfileSourceforPartner");
                result = -1;
            }
            return result;
        }

        public int UnattendedProfileSourceTransfer(int id, string toThId, char IsThidPresnet, int ProfileSourceId, string EmpId, string remarks, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "sp_UnattendedProfileSoucreTransfer";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsTHIDPresent", SqlDbType.Char))
                .Value = IsThidPresnet;
                cmdObj.Parameters
               .Add(new SqlParameter("@ProfileSorceId", SqlDbType.Int))
               .Value = ProfileSourceId;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.Int))
                .Value = id;
                cmdObj.Parameters
              .Add(new SqlParameter("@toThId", SqlDbType.VarChar, 100))
              .Value = toThId;
                cmdObj.Parameters
               .Add(new SqlParameter("@addedBy", SqlDbType.NVarChar, 100))
               .Value = EmpId;
                cmdObj.Parameters
              .Add(new SqlParameter("@remarks", SqlDbType.NVarChar, 500))
              .Value = remarks;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UnattendedProfileSourceTransfer");
                result = -1;
            }
            return result;

        }

        public int candidateStatusUpdateByRecuiter(string partnerId, string id, int status, string Remarks, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_candidateStatusUpdateByPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@PartnerID", SqlDbType.VarChar))
                .Value = partnerId;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = status;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "candidateStatusUpdateByPartner");
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

        public DataSet getAllContractbyPartner(int partnerId, int isForApproval, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllContractbyPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PartnerID", SqlDbType.Int))
                 .Value = partnerId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@isForApproval", SqlDbType.Int))
                 .Value = isForApproval;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllContractbyPartner");
            }
            return ds;
        }

        public int UpdatepartnerContractDetail(UpdateContractDetailModel obj, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "UpdatepartnerContractDetail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@contId", SqlDbType.Int))
                .Value = obj.ContId;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractTypeId", SqlDbType.Int))
                .Value = obj.ContractTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractStartDate", SqlDbType.VarChar))
                .Value = obj.StartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractEndDate", SqlDbType.VarChar))
                .Value = obj.EndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractAvailability", SqlDbType.Char))
                .Value = obj.ContractAvailability;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj); 
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);           
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "UpdatepartnerContractDetail");
                result = -1;
            }
            return result;
        }

        public int AddNewContractToPartner(AddnewContractDetailModel obj, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                using (var cmdObj = new SqlCommand("Sp_addNewContractToPartner", ConCampus))
                {
                    cmdObj.CommandType = CommandType.StoredProcedure;
                    cmdObj.Parameters.Add(new SqlParameter("@PartnerID", SqlDbType.Int)).Value = obj.Partnerid;
                    cmdObj.Parameters.Add(new SqlParameter("@contractType", SqlDbType.Int)).Value = obj.ContractTypeID;
                    cmdObj.Parameters.Add(new SqlParameter("@startDate", SqlDbType.VarChar)).Value = obj.StartDate;
                    cmdObj.Parameters.Add(new SqlParameter("@endDate", SqlDbType.VarChar)).Value = obj.EndDate;
                    cmdObj.Parameters.Add(new SqlParameter("@cotractAvailability", SqlDbType.Char)).Value = obj.ContractAvailability;
                    cmdObj.Parameters.Add(new SqlParameter("@empId", SqlDbType.NVarChar)).Value = empID;
                    cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;

                    // Execute the stored procedure
                    cmdObj.ExecuteNonQuery();

                    // Retrieve the output parameter value
                    result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                }
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Partner", "AddNewContractToPartner");
                result = -2; 
            }
            return result;
        }

        public int DeleteContractDetail(int ContractId, string DeletedBy)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_deleteContractDetail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ContractId", SqlDbType.Int))
                 .Value = ContractId;
                cmdObj.Parameters
                 .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                 .Value = DeletedBy;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Partner", "DeletePanelSlot");
                result = -1;
            }
            return result;
        }

        public DataSet getAllPartnerContractList(PartnerContratDetailFilter obj, string EmpID, out int result)
        {
            DataSet ds = new DataSet();
            result = 0;
            try
            {
                OpeneConnection();
                string _sql = "getAllPartnerContractList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@page", SqlDbType.Int)).Value = obj.page;
                cmdObj.Parameters.Add(new SqlParameter("@pageSize", SqlDbType.Int)).Value = obj.pageSize;
                cmdObj.Parameters.Add(new SqlParameter("@EmpID", SqlDbType.VarChar)).Value = EmpID;
                cmdObj.Parameters.Add(new SqlParameter("@search", SqlDbType.NVarChar)).Value = obj.search;
                cmdObj.Parameters.Add(new SqlParameter("@ContractType", SqlDbType.NVarChar)).Value = obj.ContractTypeID;
                cmdObj.Parameters.Add(new SqlParameter("@statusId", SqlDbType.NVarChar)).Value = obj.statusId;
                cmdObj.Parameters.Add(new SqlParameter("@hiringLocationId", SqlDbType.Int)).Value = obj.hiringLocationId;
                cmdObj.Parameters.Add(new SqlParameter("@startDate", SqlDbType.DateTime)).Value = obj.startDate;
                cmdObj.Parameters.Add(new SqlParameter("@endDate", SqlDbType.DateTime)).Value = obj.endDate;
                cmdObj.Parameters.Add(new SqlParameter("@pendingwithme", SqlDbType.Int)).Value = obj.pendingWithMe;
                cmdObj.Parameters.Add(new SqlParameter("@partnerId", SqlDbType.NVarChar, 2000)).Value = obj.PartnerID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllPartnerContractList");
            }
            return ds;
        }

        public int MultiApproveRejectContractDetail(string ids, string empid, char action, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "MultiApproveRejectContractDetail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters.Add(new SqlParameter("@IDs", SqlDbType.NVarChar, int.MaxValue)).Value = ids;
                cmdObj.Parameters.Add(new SqlParameter("@empid", SqlDbType.NVarChar, int.MaxValue)).Value = empid;
                cmdObj.Parameters.Add(new SqlParameter("@Action", SqlDbType.Char, 1)).Value = action;
                cmdObj.Parameters.Add(new SqlParameter("@result", SqlDbType.Int)).Direction = ParameterDirection.Output;
                cmdObj.Parameters.Add(new SqlParameter("@message", SqlDbType.VarChar, int.MaxValue)).Direction = ParameterDirection.Output;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "MultiApproveRejectContractDetail");
                result = -1;
            }
            return result;
        }

        public int ResendContractforApproval(ContractDetail obj, string empID)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ResendContractforApproval";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@contId", SqlDbType.Int))
                .Value = obj.ID;
                cmdObj.Parameters
               .Add(new SqlParameter("@contractType", SqlDbType.Int))
               .Value = obj.ContractTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@startDate", SqlDbType.VarChar))
                .Value = obj.StartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@endDate", SqlDbType.VarChar))
                .Value = obj.EndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@cotractAvailability", SqlDbType.Char))
                .Value = obj.ContractAvailability;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ResendContractforApproval");
                result = -1;
            }
            return result;
        }

        public int SingleApproveRejectContractofPartner(SingleApprovRejectContractDetailModel obj, string empID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "SingleApproveContractofPartner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@ID", SqlDbType.Int))
                .Value = obj.ContId;
                cmdObj.Parameters
                .Add(new SqlParameter("@contractType", SqlDbType.Int))
                .Value = obj.ContractTypeID;
                cmdObj.Parameters
                .Add(new SqlParameter("@startDate", SqlDbType.VarChar))
                .Value = obj.StartDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@endDate", SqlDbType.VarChar))
                .Value = obj.EndDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@cotractAvailability", SqlDbType.Char))
                .Value = obj.ContractAvailability;
                cmdObj.Parameters
                .Add(new SqlParameter("@Remarks", SqlDbType.Char))
                .Value = obj.Remarks;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empID;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Action", SqlDbType.Char))
                 .Value = obj.Action;
                cmdObj.Parameters
                 .Add(new SqlParameter("@result", SqlDbType.Int))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@message", SqlDbType.NVarChar, 1000))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message= Convert.ToString(cmdObj.Parameters["@message"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SingleApproveRejectContractofPartner");
                result = -1;
            }
            return result;
        }

    }
}