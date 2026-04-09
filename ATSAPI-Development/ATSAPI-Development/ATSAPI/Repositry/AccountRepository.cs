using ASTAPI.Mapper;
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using Microsoft.Exchange.WebServices.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web;

namespace ATSAPI.Repositry
{
    public class AccountRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "AccountRepository";
        DataUtility du;

        public AccountRepository()
        {
            du = new DataUtility();
        }
        //  [AuthorizeAttribute]
        public UserMaster GetUserDetails(string DomainID, char UserType)
        {
            UserMaster ud = new UserMaster();
            try
            {
                OpeneConnection();
                string _sql = "GetUserDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@DomainID", SqlDbType.NVarChar))
                .Value = DomainID;
                cmdObj.Parameters
               .Add(new SqlParameter("@UserType", SqlDbType.Char))
               .Value = UserType;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (UserMaster)RepositryMapper.getMap<UserMaster>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetUserDetails");
            }
            return ud;
        }

        public EmpUserDetails GetUserDetailsByEmail(string Email)
        {
            EmpUserDetails ud = new EmpUserDetails();
            try
            {
                OpeneConnection();
                string _sql = "GetUserDetailsByEmail";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmailID", SqlDbType.VarChar))
               .Value = Email;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (EmpUserDetails)RepositryMapper.getMap<EmpUserDetails>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetUserDetails");
            }
            return ud;
        }

        public bool AuthenticateUser(string domain, string username, string password, char UserType)
        {

            if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentNullException("Username & Password must be passed");
            }
            bool authenticated = false;
            int IsAuthorized = 0;
            if (UserType == 'I')
            {
                using (var context = new PrincipalContext(ContextType.Domain, domain, domain + "\\" + username, password))
                {
                    authenticated = context.ValidateCredentials(username, password);
                }
            }
            else
            {
                authenticated = ValidateExternalUser(username, password);
            }

            IsAuthorized = authenticated == true ? 1 : 0;
            // AddEmpLoginDetails(username, UserType, IsAuthorized);
            return authenticated;
        }
        private bool ValidateExternalUser(string UserName, string Password)
        {
            Common common = new Common();
            DataSet salt = GetSalt(UserName);
            if (salt != null && salt.Tables.Count == 1 && salt.Tables[0].Rows.Count > 0)
            {
                string encPass = common.Encrypt(Password, salt.Tables[0].Rows[0]["salt"].ToString());
                if (salt.Tables[0].Rows[0]["Password"].ToString() == encPass)
                {
                    return true;
                }
                return false;
            }
            else { return false; }
        }

        public int ChangePassword(string UserId, string NewPassword, string salt, string pwdTxt)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ChangePassword";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserId", SqlDbType.VarChar))
                .Value = UserId;
                cmdObj.Parameters
                .Add(new SqlParameter("@NewPassword", SqlDbType.NVarChar))
                .Value = NewPassword;
                cmdObj.Parameters
                .Add(new SqlParameter("@pwdTxt", SqlDbType.NVarChar))
                .Value = pwdTxt;
                cmdObj.Parameters
                .Add(new SqlParameter("@salt", SqlDbType.Char))
                .Value = salt;
                cmdObj.Parameters
                .Add(new SqlParameter("@ChangedBy", SqlDbType.VarChar))
                .Value = UserId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePassword");
            }
            return result;
        }

        private DataSet GetSalt(string UserName)
        {
            DataSet ds = null;
            try
            {
                OpeneConnection();
                string _sql = "getSaltForExternalUser";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@UserName", SqlDbType.NVarChar))
                 .Value = UserName;
                ds = du.GetDataSetWithProc(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSalt");
            }
            return ds;
        }

        public int AddEmpLoginDetails(string UserName, char UserType, int IsAuthorized)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "addempLoginDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserName", SqlDbType.VarChar))
                .Value = UserName;
                cmdObj.Parameters
                .Add(new SqlParameter("@Usertype", SqlDbType.Char))
                .Value = UserType;
                cmdObj.Parameters
                .Add(new SqlParameter("@IsAuthorized", SqlDbType.Int))
                .Value = IsAuthorized;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "addempLoginDetails");
                result = -1;
            }
            return result;
        }

        public int SaveAndSendOtp(string email, string otp, char flag)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "MFASaveAndSendOTP";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.NVarChar))
                .Value = email;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.NVarChar))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@flag", SqlDbType.Char))
                .Value = flag;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;

                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendOTPtoCandidate");
                result = -1;
            }
            return result;
        }

        /***
         * ChangePassword Method
         * ***/
        public int ValidateMFAOTP(string UserId, string otp)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "ValidateMFAOTP";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Id", SqlDbType.VarChar))
                .Value = UserId;
                cmdObj.Parameters
               .Add(new SqlParameter("@otp", SqlDbType.VarChar))
               .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePassword");
            }
            return result;
        }

        // Method to store the token
        public int StoreToken(UserToken UserToken)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_StoreToken";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserId", SqlDbType.VarChar))
                .Value = UserToken.UserId;
                cmdObj.Parameters
               .Add(new SqlParameter("@Token", SqlDbType.NVarChar))
               .Value = UserToken.Token;
                cmdObj.Parameters
              .Add(new SqlParameter("@Expiration", SqlDbType.DateTime))
              .Value = UserToken.Expiration;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "StoreToken");
            }
            return result;

        }

        // Method to  invalid stored  token
        public int InvalidatePreviousTokens(string UserId)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sp_InvalidatePreviousTokens";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@UserId", SqlDbType.VarChar))
                .Value = UserId;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "InvalidatePreviousTokens");
            }
            return result;

        }

        // Method to Validate Token
        public bool ValidateToken(string Token)
        {
            bool result = false;
            try
            {
                OpeneConnection();

                string _sql = "sp_ValidateToken";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                // Input Parameter
                cmdObj.Parameters.Add(new SqlParameter("@Token", SqlDbType.VarChar)).Value = Token;

                // Output Parameter
                var isValidParam = new SqlParameter("@IsValid", SqlDbType.Bit)
                {
                    Direction = ParameterDirection.Output
                };
                cmdObj.Parameters.Add(isValidParam); //  Add output parameter to command

                // Execute Stored Procedure
                du.ExecuteSqlProcedure(cmdObj);

                // ✅ Retrieve the Output Parameter Safely
                if (isValidParam.Value != DBNull.Value)
                {
                    result = Convert.ToBoolean(isValidParam.Value);
                }

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "InvalidatePreviousTokens");
            }
            return result;
        }



    }
}