using ATSAPI.App_Data;
using ATSAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ATSAPI.Repositry
{
    public class CandidateRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "CandidateRepository";
        DataUtility du;
        public CandidateRepository()
        {
            du = new DataUtility();
        }
        public int SendOTPtoCandidate(int cid, string otp)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sendOTPtoCandidate";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.NVarChar, 2000))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendOTPtoCandidate");
                result = -1;
            }
            return result;
        }

        public int CandidateSubmitOtp(int cid, string otp, int status, string joiningDate, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "CandidateSubmitOtp";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Cid", SqlDbType.Int))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.VarChar, 100))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@status", SqlDbType.Int))
                .Value = status;
                cmdObj.Parameters
               .Add(new SqlParameter("@joiningDate", SqlDbType.VarChar))
               .Value = joiningDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateSubmitOtp");
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
                string _sql = "sp_getCandidateInfo";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetails");
            }
            return ds;
        }

        public DataSet GetOfferTemplates(string cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOfferTemplates";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = cid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOfferTemplates");
            }
            return ds;
        }

        public DataSet getCandidateDetailsByParam(string cid)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDetailsByParam";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = cid;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCandidateDetails");
            }
            return ds;
        }

        public int SendOTPtoCandidate(string cid, string otp, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "sendOTPtoCandidateForUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.NVarChar))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.VarChar, 20))
                .Value = otp;
                cmdObj.Parameters
               .Add(new SqlParameter("@Message", SqlDbType.VarChar, 2000))
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendOTPtoCandidate");
                result = -1;
            }
            return result;
        }

        public int CandidateSubmitOtpUS(string cid, string otp, ref string Message, ref string AuthKey)
        {
            int result;

            try
            {
                OpeneConnection();
                string _sql = "CandidateSubmitOtpUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.VarChar, 100))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.VarChar, 2000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AuthKey", SqlDbType.VarChar, 2000))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                AuthKey = Convert.ToString(cmdObj.Parameters["@AuthKey"].Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateSubmitOtpUS");
                result = -1;
            }
            return result;

        }

        public int CandidateSubmitOtpIndia(string cid, string otp, ref string Message, ref string AuthKey)
        {
            int result;

            try
            {
                OpeneConnection();
                string _sql = "CandidateSubmitOtpIndia";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = cid;
                cmdObj.Parameters
                .Add(new SqlParameter("@otp", SqlDbType.VarChar, 100))
                .Value = otp;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@Message", SqlDbType.VarChar, 2000))
                 .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                 .Add(new SqlParameter("@AuthKey", SqlDbType.VarChar, 2000))
                 .Direction = ParameterDirection.Output;
                du.ExecuteSqlProcedure(cmdObj);
                result = Convert.ToInt32(cmdObj.Parameters["@result"].Value);
                Message = Convert.ToString(cmdObj.Parameters["@Message"].Value);
                AuthKey = Convert.ToString(cmdObj.Parameters["@AuthKey"].Value);

                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateSubmitOtpIndia");
                result = -1;
            }
            return result;

        }

        public int CandidateFinalSubmitUS(offeracceptsignatureSave model, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "CandidateFinalSubmitUS";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = model.param;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferSignatureFileName", SqlDbType.VarChar, 1000))
                .Value = model.offersignFileName;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferSignatureFilePath", SqlDbType.VarChar, 1000))
                .Value = model.offersignFilePath;
                cmdObj.Parameters
                .Add(new SqlParameter("@AgreementSignatureFileName", SqlDbType.VarChar, 1000))
                .Value = model.AgreementsignFileName;
                cmdObj.Parameters
                .Add(new SqlParameter("@AgreementSignatureFilePath", SqlDbType.VarChar, 1000))
                .Value = model.AgreementsignFilePath;
                cmdObj.Parameters
                .Add(new SqlParameter("@JoiningDate", SqlDbType.VarChar))
                .Value = model.JoiningDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@AuthKey", SqlDbType.VarChar, 1000))
                .Value = model.AuthKey;
                cmdObj.Parameters
                .Add(new SqlParameter("@PriorCompDateAgr", SqlDbType.VarChar))
                .Value = model.PriorCompanyDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@PriorCompanyAgr", SqlDbType.VarChar, 1000))
                .Value = model.PriorCompany;
                cmdObj.Parameters
                .Add(new SqlParameter("@PriorCompanyOtherAgr", SqlDbType.VarChar, 1000))
                .Value = model.PriorCompanyOther;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferAcceptDateUTC", SqlDbType.VarChar))
                 .Value = model.OfferAcceptDateUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferAcceptTimeZone", SqlDbType.VarChar))
                 .Value = model.OfferAcceptTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@OfferAcceptOffsetDate", SqlDbType.Int))
                 .Value = model.OfferAcceptOffsetDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PriorCompDateAgreementUTC", SqlDbType.VarChar))
                 .Value = model.PriorCompDateAgreementUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PriorCompDateAgreementTimeZone", SqlDbType.VarChar))
                 .Value = model.PriorCompDateAgreementTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@PriorCompDateAgreementOffSetDate", SqlDbType.Int))
                 .Value = model.PriorCompDateAgreementOffSetDate;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnDateUTC", SqlDbType.VarChar))
                 .Value = model.ModifiedOnUTC;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnTimeZone", SqlDbType.VarChar))
                 .Value = model.ModifiedOnTimeZone;
                cmdObj.Parameters
                 .Add(new SqlParameter("@ModifiedOnOffsetDate", SqlDbType.Int))
                 .Value = model.ModifiedOnOffsetDate;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateFinalSubmitUS");
                result = -1;
            }
            return result;

        }

        public int CandidateFinalSubmitIndia(offeracceptsignatureSaveInd model, ref string Message)
        {
            int result;
            try
            {
                OpeneConnection();
                string _sql = "CandidateFinalSubmitIndia";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@param", SqlDbType.VarChar))
                .Value = model.param;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferSignatureFileName", SqlDbType.VarChar, 1000))
                .Value = model.offersignFileName;
                cmdObj.Parameters
                .Add(new SqlParameter("@OfferSignatureFilePath", SqlDbType.VarChar, 1000))
                .Value = model.offersignFilePath;
                //cmdObj.Parameters
                //.Add(new SqlParameter("@JoiningDate", SqlDbType.VarChar))
                //.Value = model.JoiningDate;
                cmdObj.Parameters
                .Add(new SqlParameter("@AuthKey", SqlDbType.VarChar, 1000))
                .Value = model.AuthKey;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateFinalSubmitUS");
                result = -1;
            }
            return result;

        }

        public int SendofferToCandidate(int cid)
        {
           
            try
            {
                OpeneConnection();
                string _sql = "SendOfferLetterAndEmpAgreeMentAfterOfferAcceptance";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendofferToCandidate");
            }
            return 1;
        }


        public int SendofferAcceptanceMailerToCandidate(int cid)
        {

            try
            {
                OpeneConnection();
                string _sql = "SendOfferLetterAndEmpAgreeMentAfterOfferAcceptance";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@cid", SqlDbType.Int))
                .Value = cid;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "SendofferToCandidate");
            }
            return 1;
        }

    }
}