using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
namespace ATSAPI.Models
{
    public class TotalCount
    {
        public int Offshore { get; set; }
        public int Onshore { get; set; }
    }


    public class Total
    {
        public int Count { get; set; }
    }

    public class RequisitionDetails
    {
        public string created_by { get; set; }
        public string created_by_email { get; set; }
        public string created_on { get; set; }
        public string delivery_unit { get; set; }
        public string designation { get; set; }
        public string experience { get; set; }
        public string interviewer { get; set; }
        public string job_description { get; set; }
        public string joining_city { get; set; }
        public string joining_country { get; set; }
        public string joining_state { get; set; }
        public string location { get; set; }
        public string recruiter1 { get; set; }
        public string recruiter1email { get; set; }
        public string primary_skill { get; set; }
        public string recruiter2 { get; set; }
        public string recruiter2email { get; set; }
        public string skill_catg { get; set; }
        public string talent_id { get; set; }
        public string th_id { get; set; }
        public string th_pre { get; set; }
        public string title { get; set; }
        public string updated_on { get; set; }
        public string STATUS { get; set; }
        public string initial_fullfilment_date { get; set; }
    }

    public class CandidateDetails
    {

        public int id { get; set; }
        public int cid { get; set; }
        public int pre_cid { get; set; }
        public int ProfileID { get; set; }
        public int c_profileUniqId { get; set; }
        public int CSkill_ID { get; set; }
        public string dob { get; set; }
        public string martialstatus { get; set; }
        public int interviewType { get; set; }
        public int identityId { get; set; }
        public string identityNo { get; set; }
        public int statusId { get; set; }
        public int roleId { get; set; }
        public int currencyTypeId { get; set; }
        public int interviewMode { get; set; }
        public string interviewDate { get; set; }
        public Int32 interviewDuration { get; set; }
        public string joiningDate { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string totalExp { get; set; }
        public string totalExpMonth { get; set; }
        public string relevantExp { get; set; }
        public string relExpMonth { get; set; }
        public string primarySkill { get; set; }
        public string currentCompany { get; set; }
        public int CountryID { get; set; }
        public int StateID { get; set; }
        public int CityId { get; set; }
        public int HiringLocation { get; set; }
        public string currentOrg { get; set; }
        public string eduQualification { get; set; }
        public string thid { get; set; }
        public string talentId { get; set; }
        public string candidateTypeID { get; set; }
        public string recruiter { get; set; }
        public string panel { get; set; }
        public string Additionalpanel { get; set; }
        public string expSalary { get; set; }
        public string curSalary { get; set; }
        public string OtherOffer { get; set; }
        public string optional { get; set; }
        public string remarks { get; set; }
        public string username { get; set; }
        public string interviewDetails { get; set; }
        public string createdBy { get; set; }
        public string designationid { get; set; }
        public string Resume { get; set; }
        public string Path { get; set; }
        public string updateBy { get; set; }
        public int IsFileExist { get; set; }
        public int offsetDate { get; set; }
        public string interviewDateUTC { get; set; }
        public string interviewTimeZone { get; set; }
        public int Gender { get; set; }
        public int DivisionID { get; set; }
        public int JobFamilyID { get; set; }
        public int gradeId { get; set; }
        public string gradeBand { get; set; }
        public int SalaryType { get; set; }
        public char jobfamilycategory { get; set; }
        public int practiceId { get; set; }
        public int EmpUnitId { get; set; }
        public int InterviewDuration { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }
        public char IsRenuTeam { get; set; }
        public int EntityId { get; set; }
        public int CountryCode { get; set; }
        public char ? IsFromNaukriAPI { get; set; }
        public string ApplicantUid { get; set; }


    }

    public class candidateProfile
    {
        public int id { get; set; }
        public int ProfileId { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public string totalExp { get; set; }
        public string totalExpMonth { get; set; }
        public string releventExp { get; set; }
        public string relExpMonth { get; set; }
        public int StatusId { get; set; }
        public int CountryCode { get; set; }
        public string AddedBy { get; set; }
        public string thid { get; set; }
        public string Resume { get; set; }
        public string Path { get; set; }
        public string referralId { get; set; }
        public string Remarks { get; set; }
        public string dob { get; set; }
        public string ApproverId { get; set; }
        public string ReferredById { get; set; }
        public string PartnerId { get; set; }
        public string Link { get; set; }
        public char IsResend { get; set; }
        public char? IsFromNaukriAPI { get; set; }

    }

    public class updateTalentId
    {
        public string thId { get; set; }
        public string prRecEmpId { get; set; }
        public string srRecEmpId { get; set; }
        public int tagRemarkId { get; set; }
        public string fullfillmentDate { get; set; }
        public string fullfillmentRemark { get; set; }
        public int employmentType { get; set; }
        public int CompRange { get; set; }
        public char isEmpReferral { get; set; }
        public char isMandatorySourcing { get; set; }
        public int fullfillmentGrade { get; set; }
        public string fullfillmentCompBand { get; set; }
        public string fullfillmentCompBandFull { get; set; }
        public int ReasonforDelay { get; set; }

        public char IsFullFillmentDateChange { get; set; }
    }

    public class TotalAssignedLoCount
    {
        public int Offshore { get; set; }
        public int Onshore { get; set; }
        public int BillingLossOffshore { get; set; }
        public int BillingLossOnsite { get; set; }
    }

    public class UserInfo
    {
        public string UserName { get; set; }
        public int Age { get; set; }
        public string dateO { get; set; }
    }

    public class OpenPositionFilter
    {
        public OpenPositionFilter()
        {

            accountId = null;
            skillId = null;
            HMId = null;
            recruiterId = null;
            search = "";
            Filter = "";
            DUIDs = null;
            endDate = null;
            subStatusId = null;
            BUId = null;
            startDate = null;
            requisitionType = null;

        }
        public bool Offshore { get; set; }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string Filter { get; set; }
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string skillId { get; set; }
        public string HMId { get; set; }
        public string recruiterId { get; set; }
        public string accountHeadId { get; set; }
        public string location { get; set; }
        public string designationId { get; set; }

        public string startDate { get; set; }
        public string endDate { get; set; }
        public string subStatusId { get; set; }
        public string requisitionType { get; set; }
        public string BUId { get; set; }
    }

    public class canTransferRequest
    {
        //public canTransferRequest()
        //{
        //    gradeBand = '';
        //}
        public int cid { get; set; }
        public string toThId { get; set; }
        public string remarks { get; set; }
        public int DivisionId { get; set; }
        public int JobFamilyId { get; set; }
        public int gradeId { get; set; }
        public char gradeBand { get; set; }
        public char jobfamilycategory { get; set; }
        public int practiceId { get; set; }
        public int EmpUnitId { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }
    }

    public class ApproveProfileScreening
    {
        ApproveProfileScreening()
        {
            remarks = null;
        }
        public int id { get; set; }
        public string remarks { get; set; }
        public char status { get; set; }
    }


    public class CandidateProfile
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? CountryCode { get; set; }
        public string Phone { get; set; }
        public int? TotalExpYear { get; set; }
        public int? TotalExpMonth { get; set; }
        public int? ReleventExpYear { get; set; }
        public int? ReleventExpMonth { get; set; }
        public string Skill { get; set; }
        public string AdditionalSkill { get; set; }
        public DateTime? Dob { get; set; }
        // Resume related
        public string filename { get; set; }
        public string filePath { get; set; }
        public bool selected { get; set; }
        public int? gender { get; set; }
        public int? qualification { get; set; }
        public int? currCompany { get; set; }
        public DateTime? joinDate { get; set; }
        public int? countryID { get; set; }
        public int? cityID { get; set; }
        public int? currencyType { get; set; }
        public int? SalaryType { get; set; }
        public string currentSalary { get; set; }
        public string expectedSalary { get; set; }
        public int? candidateType { get; set; }
    }

    public class InsertedProfileResult
    {
        public string Email { get; set; }
        public int ID { get; set; }
        public string filename { get; set; }
    }


    public class CandidateProfileModel
    {
        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("middleName")]
        public string MiddleName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("countryCode")]
        public string CountryCode { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("totalExpYear")]
        public int? TotalExpYear { get; set; }

        [JsonProperty("totalExpMonth")]
        public int? TotalExpMonth { get; set; }

        [JsonProperty("releventExpYear")]
        public int? ReleventExpYear { get; set; }

        [JsonProperty("releventExpMonth")]
        public int? ReleventExpMonth { get; set; }

        [JsonProperty("skill")]
        public string Skill { get; set; }

        [JsonProperty("additionalSkill")]
        public string AdditionalSkill { get; set; }

        [JsonProperty("dob")]
        public DateTime? Dob { get; set; }

        [JsonProperty("gender")]
        public string Gender { get; set; }

        [JsonProperty("qualification")]
        public string Qualification { get; set; }

        [JsonProperty("currCompany")]
        public string CurrCompany { get; set; }

        [JsonProperty("joinDate")]
        public DateTime? JoinDate { get; set; }

        [JsonProperty("countryID")]
        public int? CountryID { get; set; }

        [JsonProperty("cityID")]
        public int? CityID { get; set; }

        [JsonProperty("currencyType")]
        public string CurrencyType { get; set; }

        [JsonProperty("salaryType")]
        public int SalaryType { get; set; }

        [JsonProperty("currentSalary")]
        public decimal? CurrentSalary { get; set; }

        [JsonProperty("expectedSalary")]
        public decimal? ExpectedSalary { get; set; }

        [JsonProperty("candidateType")]
        public string CandidateType { get; set; }


        [JsonProperty("filename")]
        public string Filename { get; set; }

        [JsonProperty("filePath")]
        public string FilePath { get; set; }

        [JsonProperty("ApproverId")]
        public string ApproverId { get; set; }

        [JsonProperty("ApproverRemarks")]
        public string ApproverRemarks { get; set; }

        [JsonProperty("ReferredBy")]
        public string ReferredBy { get; set; }

        [JsonProperty("Partner")]
        public int Partner { get; set; }

        [JsonProperty("Link")]
        public string Link { get; set; }
    }


}