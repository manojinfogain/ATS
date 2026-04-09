using Microsoft.Office.Interop.Outlook;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ATSAPI.Models
{
    public class TalentIDMaster
    {

        public TalentIDMaster()
        {
            SkillRatingType = new List<SkillRatingType>();
        }
        public int THID { get; set; }
        public int EmployeeUnitID { get; set; }
        public int JoinLocID { get; set; }
        public int StateID { get; set; }
        public int CityID { get; set; }
        public int ReqTypeID { get; set; }
        public string InvestmentApproved { get; set; }
        public int DivisionID { get; set; }
        public char IsInternalMovement { get; set; }
        public int DUID { get; set; }
        public string AccountID { get; set; }
        public int ProjectID { get; set; }
        public string BidType { get; set; }
        public string SFDCClientID { get; set; }
        public string OppID { get; set; }
        public int OddsOfWinning { get; set; }
        public string OppType { get; set; }
        public string ISFDCID { get; set; }
        public decimal BookingDGM { get; set; }
        public int PricingRoleID { get; set; }
        public char ExclusiveInfogain { get; set; }
        public string JobSummary { get; set; }
        //   [AllowHtml]
        public string JobDesc { get; set; }
        public int DesignationID { get; set; }
        public int ExpRangeID { get; set; }
        public decimal TravelCost { get; set; }
        public decimal MaxHiringCost { get; set; }
        public string ProjectEndDate { get; set; }
        public string ClosedDate { get; set; }
        public int QualificationID { get; set; }
        public int SubSkillID { get; set; }
        public string AdditionalSkills { get; set; }
        public int EmploymentTypeID { get; set; }
        public string Interviewer1 { get; set; }
        public string Interviewer2 { get; set; }
        public char IsBillable { get; set; }
        public decimal BookingMarginPer { get; set; }
        public decimal ExpectedMarginPer { get; set; }
        public decimal BillableRate { get; set; }
        public string pBillingStartDate { get; set; }
        public string pOnboardDate { get; set; }
        public char IsClientIntReq { get; set; }
        public char IsVisaReady { get; set; }
        public string SpecialRequest { get; set; }
        public int EmployeeCount { get; set; }
        public int DeptID { get; set; }
        public string ReplacementFor { get; set; }
        public int ReplacementReasonID { get; set; }
        public string Attachment { get; set; }
        public string AttachmentPath { get; set; }
        public Char ActionTaken { get; set; }
        public string Remark { get; set; }
        public string subReasonCate { get; set; }
        public string assignmentEndDate { get; set; }
        public char TalentIdCreatedBy { get; set; }
        public int TalentCubeId { get; set; }
        public int TalentCubeRoleId { get; set; }
        public int TalentCubeGradeId { get; set; }
        public string TCSkill1 { get; set; }
        public string TCSkill2 { get; set; }
        public string TCSkill3 { get; set; }
        public string TCSkill4 { get; set; }
        public int TCExperienceID { get; set; }
        //public int GradeID { get; set; }
        public int GradeID { get; set; }

        public int reasonToChangeOnboardDate { get; set; }
        public int reasonToChangeBillingSDate { get; set; }
        public int reasonToChangeAssignEndDate { get; set; }
        public string THIDApprovalAttachment { get; set; }
        public string THIDApprovalAttachmentPath { get; set; }
        public string BillableHours { get; set; }

        public string C2HEmpEmail { get; set; }

        public int Tech1InterviewBy { get; set; }
        public int OnlineAssesmentBy { get; set; }
        public string coderByteDisplayName { get; set; }
        public int ReasonForNotOptOnlineAssessment { get; set; }
        public int ReasonForOptExternal { get; set; }
        public string coderBytePublicUrl { get; set; }
        public string coderByteTestId { get; set; }
        public string AssessmentLink { get; set; }
        public string MandatorySkills { get; set; }
        public int BillingType { get; set; }
        public string goodToHaveSkill { get; set; }
        public int? Frequency { get; set; }
        public Char IsCache { get; set; }
        public int CubePrimaySkillId { get; set; }
        public int? ClientWorkRequirementId { get; set; }
        public int? SubWorkRequirementId { get; set; }
        public string pBillingStartDateUTC { get; set; }
        public string TimeZoneIana { get; set; }
        public string TimeZoneWin { get; set; }
        public string pOnboardDateUTC { get; set; }
        public List<SkillRatingType> SkillRatingType { get; set; }
        public int RepGradeChangeReasonId { get; set; }

    }

    public class SkillRatingType
    {
        public int? skillid { get; set; }
        public int? skillType { get; set; }
        public int? rating { get; set; }
    }

    public class ProposedEmp
    {
        public ProposedEmp()
        {

            Skill = null;
            Departments = null;
            MAXExperince = null;
            MINExperince = null;
            search = "";
        }
        public int page { get; set; }
        public int pagesize { get; set; }
        public int Type { get; set; }
        public string Skill { get; set; }
        public string Departments { get; set; }
        public string MAXExperince { get; set; }
        public string MINExperince { get; set; }
        public string search { get; set; }

    }

    public class SearchTHID
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string StatusID { get; set; }
        public string AccountIDs { get; set; }
        public string Locations { get; set; }
        public string search { get; set; }
        public string PracticeId { get; set; }
    }

    public class TalentIDOffer
    {
        public int THID { get; set; }
        public string offerDate { get; set; }
        public string tentativeJoiningDate { get; set; }
        public int sourceType { get; set; }
        public int SourceName { get; set; }
        public string CandidateName { get; set; }
        public string offeredCTC { get; set; }
        public string Comment { get; set; }
        public string ReferrerName { get; set; }
        public int SubProfileId { get; set; }
    }

    // Added by jivan 
    public class GetRaisedTHIDDetails
    {

        public GetRaisedTHIDDetails()
        {

            StatusID = "";
            AccountIDs = "";
            LocationIDs = "";
            StartDate = null;
            EndDate = null;
            recruiterId = "";
            search = "";
            oppId = "";
            bizOpsLead = "";

        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string StatusID { get; set; }
        public string AccountIDs { get; set; }
        public string LocationIDs { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string recruiterId { get; set; }
        public string search { get; set; }
        public string sortColumn { get; set; }
        public string sortDir { get; set; }
        public string oppId { get; set; }
        public string bizOpsLead { get; set; }

    }

    public class UpdateTalentIdStatusWmg
    {
        public int THID { get; set; }
        public int StatusId { get; set; }
        public int CategoryId { get; set; }
        public int ApprovedBy { get; set; }
        public string Remarks { get; set; }
        public int ApprovedOver { get; set; }
        public string ApprovedOn { get; set; }
        public string AttachmentName { get; set; }
        public string AttachmentPath { get; set; }
    }
    public class GetIJPViewList
    {
        public GetIJPViewList()
        {
            AccountIDs = "";
            LocationIDs = "";
            GradeIDs = "";
            SkillIDs = "";
            search = "";
            ijpStatusId = "";
            startDate = null;
            endDate = null;
            PracticeId = "";
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string AccountIDs { get; set; }
        public string LocationIDs { get; set; }
        public string GradeIDs { get; set; }
        public string SkillIDs { get; set; }
        public int? IsApplied { get; set; }
        public string search { get; set; }
        public string ijpStatusId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string PracticeId { get; set; }
    }

    public class InterviewToOnboardingVideoCompReport
    {
        public InterviewToOnboardingVideoCompReport()
        {
            startDate = null;
            endDate = null;
            search = "";
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string search { get; set; }
    }
    public class TalentOfferDetails
    {
        public string CandidateName { get; set; }
        public int THID { get; set; }
        public DateTime offerDate { get; set; }
        public string OfferDateUTC { get; set; }
        public DateTime tentativeJoiningDate { get; set; }
        public string TentativeJoiningDateUTC { get; set; }
        public int sourceType { get; set; }
        public string SourceName { get; set; }
        public string offeredCTC { get; set; }
        public string Comment { get; set; }
        public string ReferrerName { get; set; }
        public int? SubProfileId { get; set; }
        public int EmploymentTypeID { get; set; }
        public int DesignationId { get; set; }
        public int gradeId { get; set; }
        public string reportingManager { get; set; }
        public int PrimarySkillId { get; set; }
        public string SubSkillId { get; set; }
        public DateTime? DateOfDecline { get; set; }
        public string DateOfDeclineUtc { get; set; }
        public int? DeclineCategory { get; set; }
        public string DeclineRemarks { get; set; }
        public int ExpInYear { get; set; }
        public int ExpInMonth { get; set; }
        public decimal? JoiningBonus { get; set; }
        public decimal? RetentionBonus { get; set; }
        public decimal? RelocationExpense { get; set; }
        public decimal? TravelExpense { get; set; }
        public int BillingCurrencyId { get; set; }
        public int BillableHoursDay { get; set; }
        public int ProjectBufferInPercent { get; set; }
        public decimal BillingRateHrInUSD { get; set; }
        public decimal AnnualBillableHours { get; set; }
        public decimal AnnualRevenueUsd { get; set; }
        public decimal AnnualCTC { get; set; }
        public decimal AnnualSalaryCostUsd { get; set; }
        public decimal JoiningBonusUsd { get; set; }
        public decimal BenefitsUsd { get; set; }
        public decimal ProjectBufferUsd { get; set; }
        public decimal NonReimbursableTravelCostUsd { get; set; }
        public decimal ProjectSpecificCostUsd { get; set; }
        public decimal DgmCostUsd { get; set; }
        public decimal DgmPercentUsd { get; set; }
        public int LocationId { get; set; }
        public string ModifiedOnUtc { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int? ModifiedOnOffSet { get; set; }
        public DateTime? AddedOnUTC { get; set; }
        public string AddedOnTimeZone { get; set; }
        public int AddedOnOffSet { get; set; }
        public int LocalCurrencyId { get; set; }
        public decimal billingRateHrCurrency { get; set; }
        public int NoticePeriodInDays { get; set; }
        public string reHire { get; set; }

    }
    public class dgmCalcPoland
    {
        public int JoiningLocationId { get; set; }
        public int cadidateTypeId { get; set; }
        public decimal billingRate { get; set; }
        public decimal OfferedCTC { get; set; }
        public decimal billingCurrencyId { get; set; }
        public decimal joiningBonus { get; set; }
        public decimal NonReimbursableTravelCost { get; set; }
        public decimal projectSpecificCost { get; set; }
        public decimal projectBuffer { get; set; }
        public int billableHoursDay { get; set; }

    }
    public class OfferStatusDetails
    {
        public int OfferId { get; set; }
        public string EmpId { get; set; }
        public string dateOfJoing { get; set; }
        public string Remarks { get; set; }
        public int DeclineCategory { get; set; }
        public string DeclineRemarks { get; set; }
        public DateTime? DeclineDate { get; set; }
        public DateTime? DeclineDateUtc { get; set; }
        public int OfferStatus { get; set; }

    }
}