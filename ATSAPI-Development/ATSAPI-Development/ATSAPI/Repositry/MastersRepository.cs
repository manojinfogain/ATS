using ASTAPI.Mapper;
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
    public class MastersRepository : Connection
    {
        SqlCommand cmdObj;
        string sectionName = "MasterRepository";
        DataUtility du;
        public MastersRepository()
        {
            du = new DataUtility();
        }

        public DataSet getInterviewTypes(string EmpId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getInterviewTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getInterviewTypes");
            }
            return ds;
        }

        public DataSet getTraits(string EmpId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getTraits";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
                .Value = EmpId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTraits");
            }
            return ds;
        }

        public DataSet getSkills()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAllSkills";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getSkills");
            }
            return ds;
        }


        public DataSet getAccountMaster(string searchText)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_AccountMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                .Value = searchText;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAccountMasterData");
            }
            return ds;
        }

        public DataSet getProjectMaster(string AccountID, string searchText)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_ProjectMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@AccountID", SqlDbType.VarChar))
                .Value = AccountID;
                cmdObj.Parameters
                .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
                .Value = searchText;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProjectMaster");
            }
            return ds;
        }
        public DataSet GetAllDesignations()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAllDesignations";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllDesignations");
            }
            return ds;
        }

        public DataSet getInterviewerList(string EmpId, bool Pagination, int limit, string searchText)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getInterviewerList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@pagination", SqlDbType.Bit))
               .Value = Pagination;
                cmdObj.Parameters
               .Add(new SqlParameter("@limit", SqlDbType.Int))
               .Value = limit;
                cmdObj.Parameters
               .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
               .Value = searchText;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getInterviewerList");
            }
            return ds;
        }

        public DataSet getCountryList(string EmpId, bool Pagination, int limit, string searchText)
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
               .Value = Pagination;
                cmdObj.Parameters
               .Add(new SqlParameter("@limit", SqlDbType.Int))
               .Value = limit;
                cmdObj.Parameters
               .Add(new SqlParameter("@searchText", SqlDbType.NVarChar))
               .Value = searchText;
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

        public DataSet getStateList(int? CountryId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getStateList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.Int))
               .Value = CountryId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getStateList");
            }
            return ds;
        }

        public DataSet getCityList(string EmpId, int? CountryId, int? StateId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCityList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@CountryId", SqlDbType.Int))
               .Value = CountryId;
                cmdObj.Parameters
              .Add(new SqlParameter("@StateId", SqlDbType.Int))
              .Value = StateId;
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

        public DataSet getProfilesList(int? locId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getProfileList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@locId", SqlDbType.Int))
                 .Value = locId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getProfileList");
            }
            return ds;
        }

        /**
        * Develop By Ayat
        * **/
        public DataSet getRecruiterList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getAllRecruiterList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRecruiterList");
            }
            return ds;
        }

        public List<InterviewStatus1> GetAllInterviewStatus()
        {
            List<InterviewStatus1> ud = new List<InterviewStatus1>();
            try
            {
                OpeneConnection();
                string _sql = "getAllInterviewStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (List<InterviewStatus1>)RepositryMapper.getMap<List<InterviewStatus1>>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllInterviewStatus");
            }
            return ud;
        }

        public DataSet GetHiringManager()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetHiringManager";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetHiringManager");
            }
            return ds;
        }
        public DataSet getRequisitionTypes()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRequisitionTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getRequisitionTypes");
            }
            return ds;
        }

        public DataSet GetDeliveryUnits()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDeliveryUnits";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDeliveryUnits");
            }
            return ds;
        }

        public DataSet GetContractTypes(int LocationID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetContractTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                 .Add(new SqlParameter("@LocationID", SqlDbType.Int))
                 .Value = LocationID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetContractTypes");
            }
            return ds;
        }

        public DataSet GetCompanyList(int Page, int PageSize, string name)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCompanyList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@Page", SqlDbType.Int))
                .Value = Page;
                cmdObj.Parameters
                .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                .Value = PageSize;
                cmdObj.Parameters
                 .Add(new SqlParameter("@comName", SqlDbType.NVarChar))
                 .Value = name;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCompanyList");
            }
            return ds;
        }


        public DataSet getApproverList(int Division, string EmpId, int type, int cid, int ReqType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@type", SqlDbType.Int))
               .Value = type;
                cmdObj.Parameters
               .Add(new SqlParameter("@Division", SqlDbType.Int))
               .Value = Division;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getApproverList");
            }
            return ds;
        }

        public DataSet GetGradeMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getGradeMaster";
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

        public DataSet getTagHeadApproverList(int? Division)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getTagHeadApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@Division", SqlDbType.Int))
               .Value = Division;
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

        public DataSet getInfogainLocations(int? locationId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getInfogainLocations";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@locationId", SqlDbType.Int))
                .Value = locationId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getInfogainLocations");
            }
            return ds;
        }
        public DataSet GetCurrencyList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCurrencyList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                //cmdObj.Parameters
                //.Add(new SqlParameter("@LocationID", SqlDbType.Int))
                //.Value = LocationID;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCurrencyList");
            }
            return ds;
        }

        public DataSet getAllOfferStatus()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllOfferStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOfferStatus");
            }
            return ds;
        }

        public DataSet getAllOnboardStatus()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllOnboardStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllOnboardStatus");
            }
            return ds;
        }

        public DataSet getFullfillmentDelayReason(int Type)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getFullfillmentDelayReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@type", SqlDbType.Int))
                .Value = Type;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getFullfillmentDelayReason");
            }
            return ds;
        }

        public List<CurrencyMaster> getAllCurrency()
        {
            List<CurrencyMaster> ud = new List<CurrencyMaster>();
            try
            {
                OpeneConnection();
                string _sql = "getAllCurrency";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (List<CurrencyMaster>)RepositryMapper.getMap<List<CurrencyMaster>>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllCurrency");
            }
            return ud;
        }

        public List<InterviewMode> getAllInterviewModeDetails()
        {
            List<InterviewMode> ud = new List<InterviewMode>();
            try
            {
                OpeneConnection();
                string _sql = "getAllInterviewModeDetails";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (List<InterviewMode>)RepositryMapper.getMap<List<InterviewMode>>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllInterviewModeDetails");
            }
            return ud;
        }
        public List<CandidateType> getAllCandidateTypes()
        {
            List<CandidateType> ud = new List<CandidateType>();
            try
            {
                OpeneConnection();
                string _sql = "getAllCandidateTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (List<CandidateType>)RepositryMapper.getMap<List<CandidateType>>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllCandidateTypes");
            }
            return ud;
        }
        public List<IdentityMaster> getAllIdentityTypes()
        {
            List<IdentityMaster> ud = new List<IdentityMaster>();
            try
            {
                OpeneConnection();
                string _sql = "getAllIdentityTypes";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                DataSet ds = du.GetDataSetWithProc(cmdObj);
                ud = (List<IdentityMaster>)RepositryMapper.getMap<List<IdentityMaster>>(ds);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getAllIdentityTypes");
            }
            return ud;
        }

        public DataSet GetJobFamilyList(int PracticeID, int? division)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetJobFamilyList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@division", SqlDbType.Int))
                .Value = division;
                cmdObj.Parameters
               .Add(new SqlParameter("@PracticeID", SqlDbType.Int))
               .Value = PracticeID;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJobFamilyList");
            }
            return ds;
        }

        public DataSet GetGradeBandList(int GradeID)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetGradeBandList";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetGradeBandList");
            }
            return ds;
        }

        public DataSet GetCurrentEmployerList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getEmployerList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getEmployerList");
            }
            return ds;
        }

        public DataSet GetEducationList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getEducationList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getEducationList");
            }
            return ds;
        }

        public DataSet GetAllHiringManager(string HMType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAllHiringManager";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@HMType", SqlDbType.Char));
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "sp_getEducationList");
            }
            return ds;
        }

        public DataSet GetAccountOwner()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetAccountOwner";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAccountOwner");
            }
            return ds;
        }


        public DataSet GetCandidateDropReasonList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateDropReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCandidateDropReasonList");
            }
            return ds;
        }

        public DataSet GetAllTalentSubStatus()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllTalentSubStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllTalentSubStatus");
            }
            return ds;
        }

        public DataSet GetAccountDuwise(DUModel obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_AccountsWrtDU";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@DU", SqlDbType.NVarChar, 2000))
                .Value = obj.DUIds;
                cmdObj.Parameters
                .Add(new SqlParameter("@flag", SqlDbType.VarChar))
                .Value = obj.flag;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAccountDuwise");
            }
            return ds;
        }

        public DataSet GetAllGender()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllGender";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllGender");
            }
            return ds;
        }


        public DataSet CandidateOfferDropReasonSubset(int? id = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getCandidateOfferReasonSubset";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                cmdObj.Parameters
                .Add(new SqlParameter("@id", SqlDbType.Int))
                .Value = id;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "CandidateOfferDropReasonSubset");
            }
            return ds;
        }

        public DataSet getDelegatorList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getDelegatorList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getDelegatorList");
            }
            return ds;
        }

        public DataSet getExternalAgencyList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getExternalAgencyList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;

                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getExternalAgencyList");
            }
            return ds;
        }

        public DataSet GetDivisionMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_DivisionMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDivisionMaster");
            }
            return ds;
        }

        public DataSet ScreenRejectReasons(int? id = null)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getScreenRejectReason";
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getScreenRejectReasons");
            }
            return ds;
        }
        public DataSet GetJoinedEmployeeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getEmployeeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetJoinedEmployeeLsit");
            }
            return ds;
        }

        public DataSet GetAllPractices()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllIPractices";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllPractices");
            }
            return ds;
        }


        public DataSet GetPracticeCommunities(string practice)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getPracticeCommunities";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@practiceId", SqlDbType.NVarChar, 2000))
                .Value = practice;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPracticeCommunities");
            }
            return ds;
        }


        public DataSet GetSubPractice(string practice)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getsubPractice";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@practiceId", SqlDbType.NVarChar, 2000))
                .Value = practice;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSubPractice");
            }
            return ds;
        }

        public DataSet GetFinicialYear()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Sp_GetFinicialYear";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetFinicialYear");
            }
            return ds;
        }

        public DataSet GetEmployeeUnit()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetEmployeeUnit";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmployeeUnit");
            }
            return ds;
        }
        public DataSet GetOnboardingFormMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_GetOnboardingFormMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOnboardingFormMaster");
            }
            return ds;
        }
        public DataSet getPrimarySkills()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetPrimaryAllSkills";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPrimarySkills");
            }
            return ds;
        }

        public DataSet GetDepartments()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetDepartments";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetDepartments");
            }
            return ds;
        }
        public DataSet GetUSEmpList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetUSEmpList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetUSEmpList");
            }
            return ds;
        }

        public DataSet GetVender()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "Get_VenderMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVender");
            }
            return ds;
        }

        public DataSet GetAllTalentCubeList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAllTalentCubeList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAllTalentCubeList");
            }
            return ds;
        }

        public DataSet GetRoleByTalentCube(int? TalentCubeCode, int? GradeId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetRoleByTalentCube";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
               .Add(new SqlParameter("@TalentCubeCode", SqlDbType.Int))
               .Value = TalentCubeCode;
                cmdObj.Parameters
               .Add(new SqlParameter("@GradeId", SqlDbType.Int))
               .Value = GradeId;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRoleByTalentCube");
            }
            return ds;
        }

        public DataSet getTagHeadList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getTagHeadList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getTagHeadList");
            }
            return ds;
        }

        public DataSet GetVariablePayPercentageMaster(int cid, int gradeId, int cubeId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getVariablePayPercentageMasterByCid";
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
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetVariablePayPercentageMaster");
            }
            return ds;
        }

        public DataSet getcSkillCountryList()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCountryListMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getcSkillCountryList");
            }
            return ds;
        }

        public int AddUpdateCompany(CompanyName obj, string EmpID, ref string Message)
        {
            int result = 0;
            try
            {
                OpeneConnection();
                string _sql = "AddUpdateCompany";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@result", SqlDbType.Int))
                .Direction = ParameterDirection.Output;
                cmdObj.Parameters
                .Add(new SqlParameter("@CompanyName", SqlDbType.NVarChar))
                .Value = obj.ComapanyName;
                cmdObj.Parameters
                .Add(new SqlParameter("@Tier", SqlDbType.NVarChar))
                .Value = obj.Tier;
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpID", SqlDbType.NVarChar))
                .Value = EmpID;
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
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdateCompany");
                result = -1;
            }
            return result;
        }

        public DataSet getCompanyName(int page, int pagesize, string name)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetCompanyName";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@comName", SqlDbType.NVarChar))
                .Value = name;
                cmdObj.Parameters
                .Add(new SqlParameter("@page", SqlDbType.Int))
                .Value = page;
                cmdObj.Parameters
                .Add(new SqlParameter("@PageSize", SqlDbType.Int))
                .Value = pagesize;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getCompanyName");
            }
            return ds;
        }

        public int AssessmentCompleted(AssessmentCompleted obj)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_AssessmentCompleted";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
                .Add(new SqlParameter("@operation", SqlDbType.VarChar))
                .Value = obj.operation;
                cmdObj.Parameters
                .Add(new SqlParameter("@time_expired", SqlDbType.Bit))
                .Value = obj.time_expired;
                cmdObj.Parameters
                .Add(new SqlParameter("@challenges_being_graded", SqlDbType.Bit))
                .Value = obj.challenges_being_graded;
                cmdObj.Parameters
                .Add(new SqlParameter("@organization_id", SqlDbType.VarChar))
                .Value = obj.organization_id;
                cmdObj.Parameters
                .Add(new SqlParameter("@email", SqlDbType.VarChar))
                .Value = obj.email;
                cmdObj.Parameters
                .Add(new SqlParameter("@report_url", SqlDbType.VarChar))
                .Value = obj.report_url;
                cmdObj.Parameters
                .Add(new SqlParameter("@assessment_id", SqlDbType.VarChar))
                .Value = obj.assessment_id;
                du.ExecuteSqlProcedure(cmdObj);
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AssessmentCompleted");
            }
            return 1;
        }

        public DataSet GetTech1InterviewByMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getInterviewByMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTech1InterviewByMaster");
            }
            return ds;
        }
        public DataSet GetOnlineAssesmentAgency()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getOnlineAssessmentAgency";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOnlineAssesmentAgencyMaster");
            }
            return ds;
        }

        public DataSet GetReasonForNotOptOnlineExternalAssessment()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getReasonForNotOptOnlineExternalAssessment";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReasonForNotOptOnlineExternalAssessmentMaster");
            }
            return ds;
        }

        public DataSet GetAssessmentReasonMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getAssessmentReasonMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetAssessmenrReasonMaster");
            }
            return ds;
        }

        public DataSet GetCompRangeBucketMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getCompRangeBucketMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetCompRangeBucketMaster");
            }
            return ds;
        }

        public DataSet getPartnerstatus()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "sp_getPartnerStatus";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPartnerstatus");
            }
            return ds;
        }

        public DataSet GetSendToTagReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSendToTagReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetSendToTagReason");
            }
            return ds;
        }

        public DataSet GetApprovedOver()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetApprovedOver";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedOver");
            }
            return ds;
        }

        public DataSet GetApprovedBy()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetApprovedBy";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetApprovedBy");
            }
            return ds;
        }


        public DataSet GetRescheduleCanelReason()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getRescheduleCancelReason";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRescheduleCanelReason");
            }
            return ds;
        }

        public DataSet getTalentDPApproverList(int thid, string EmpId, int type, int ReqType)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "getDPApproverList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                cmdObj.Parameters
              .Add(new SqlParameter("@thid", SqlDbType.Int))
              .Value = thid;
                cmdObj.Parameters
               .Add(new SqlParameter("@EmpId", SqlDbType.NVarChar))
               .Value = EmpId;
                cmdObj.Parameters
               .Add(new SqlParameter("@type", SqlDbType.Int))
               .Value = type;
                cmdObj.Parameters
               .Add(new SqlParameter("@reqType", SqlDbType.Int))
               .Value = ReqType;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getDPApproverList");
            }
            return ds;
        }

        public DataSet GetTalentReopenningRemarks()
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetTalentReopenningRemarks";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetTalentReopenningRemarks");
            }
            return ds;
        }


        public DataSet GetSkillProficiencyLevelMaster(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetSkillProficiencyLevelMaster";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetRatingLevelMaster");
            }
            return ds;
        }

        public DataSet GetOpportunityList(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetOpportunityList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetOpportunityList");
            }
            return ds;
        }

        public DataSet GetBizOpsList(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetBizOpsList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetBizOpsList");
            }
            return ds;
        }

        public DataSet GetReplGradeChangeReason(string empId)
        {
            DataSet ds = new DataSet();
            try
            {
                OpeneConnection();
                string _sql = "GetReplGradeChangeReasonList";
                cmdObj = new SqlCommand(_sql, ConCampus);
                cmdObj.CommandType = CommandType.StoredProcedure;
                ds = du.GetDataSetWithProc(cmdObj);
                cmdObj.Parameters
                .Add(new SqlParameter("@EmpId", SqlDbType.VarChar))
                .Value = empId;
                ds.Tables[0].TableName = "data";
                CloseConnection();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetReplGradeChangeReason");
            }
            return ds;
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

    }
}