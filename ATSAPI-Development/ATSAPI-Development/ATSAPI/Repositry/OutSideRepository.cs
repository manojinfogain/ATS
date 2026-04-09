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
    public class OutSideRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "OutSideRepository";
        DataUtility du;
        public OutSideRepository()
        {
            du = new DataUtility();
        }

        public DataSet CheckDuplicateEmailforProfile(string EmailId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "CheckDuplicateEmailforProfile";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Emailid", SqlDbType.VarChar))
                 .Value = EmailId;
                ds = du.GetDataSetWithProc(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CheckDuplicateEmailforProfile");
            }
            return ds;
        }
        public int addupdateCandidateDetailsOptionalTHID(candidateProfile cnd)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_add_update_profile_wise_candidate_detail_optional_thid";
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
                 .Add(new SqlParameter("@per_Firstname", SqlDbType.NVarChar))
                 .Value = cnd.FirstName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_Middlename", SqlDbType.NVarChar))
                 .Value = cnd.MiddleName;
                cmdObj.Parameters
                 .Add(new SqlParameter("@per_Lastname", SqlDbType.NVarChar))
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
                 .Add(new SqlParameter("@per_relevent_experience", SqlDbType.VarChar))
                 .Value = cnd.releventExp;
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
                 .Add(new SqlParameter("@per_referralId", SqlDbType.VarChar))
                 .Value = cnd.referralId;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addupdateCandidateDetailsOptionalTHID");
                result = -1;
            }
            return result;
        }

        public DataSet getRequisitionBySkillId(string empid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getRequisitionBySkillId";
                cmdObj = new SqlCommand(_sql, ConCampus);

                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@empId", SqlDbType.VarChar))
                 .Value = empid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRequisitionBySkillId");
            }
            return ds;
        }

        public DataSet getCountryList(string EmpId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCountryList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@pagination", SqlDbType.Bit))
               .Value = false;
                cmdObj.Parameters
               .Add(new SqlParameter("@limit", SqlDbType.Int))
               .Value = 0;
                cmdObj.Parameters
               .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
               .Value = "";
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountryList");
            }
            return ds;
        }

        public DataSet getCountryCodeByCountryID(string EmpId, int CountryId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCountryCodeByCountryID";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.Int))
               .Value = CountryId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountryList");
            }
            return ds;
        }

        public DataSet GetCountryList(string EmpId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCountryList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@pagination", SqlDbType.Int))
               .Value = 0;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCountryList");
            }
            return ds;
        }

        public DataSet GetCityListByCountryId(string EmpId,int CountryId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCityListByCountryId";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.Int))
               .Value = CountryId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCityListByCountryId");
            }
            return ds;
        }
    }
}