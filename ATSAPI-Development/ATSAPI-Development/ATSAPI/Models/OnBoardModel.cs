using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class OnBoardModel
    {

        OnBoardModel()
        {
            search = "";
            Location = null;
            Division = null;
            DateOfjoiningStart = null;
            DateOfjoiningEnd = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string Location { get; set; }
        public string Division { get; set; }
        public string DateOfjoiningStart { get; set; }
        public string DateOfjoiningEnd { get; set; }



    }

    public class PipelineJoineeListFilters
    {
        PipelineJoineeListFilters()
        {
            search = "";
            thid = null;
            Location = 0;
            startDate = null;
            endDate = null;
            startDateFirstUTC = null;
            endDateFirstUTC = null;
            offerStatusId = 0;
            location = null;
        }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public string search { get; set; }
        public string thid { get; set; }
        public int Location { get; set; }
        public int offerStatusId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string startDateFirstUTC { get; set; }
        public string endDateFirstUTC { get; set; }
        public string location { get; set; }
    }

    public class UpdateJoineeCandidateStatus
    {
        public string joineeStatus { get; set; }
        public int cid { get; set; }
        public int declineCategId { get; set; }
        public string confirmJoinDate { get; set; }
        public string billingStartDate { get; set; }
        public string remark { get; set; }
        public string reportingManager { get; set; }
        public char OnboardMode { get; set; }
    }


    public class JoineeCandidateDetails
    {
        public string emailId { get; set; }
        public int cid { get; set; }
        public string domainId { get; set; }
        public int count { get; set; }
    }

    public class CandidateUser
    {
        public int cid { get; set; }
        public int JoiningLocationId { get; set; }
        public int DivisionId { get; set; }
    }


    public class verificationOnboardingByRecHr
    {
        public char ActionBy { get; set; }
        public int cid { get; set; }
        public string type { get; set; }
        public int status { get; set; }
        public string remarks { get; set; }
    }

    public class VerificationOnboardingCandidateDetails
    {
        public char @ActionBy { get; set; }
        public int cid { get; set; }
        public int status { get; set; }
        public string mailBody { get; set; }
        public string mailSubject { get; set; }
        public char OnBordingMode { get; set; }       // Added by jivan
    }
    public class sendOnboardForm
    {
        public int cid { get; set; }
        public char formType { get; set; }
        public char isEmailSend { get; set; }
        public string formId { get; set; }
        public char OnBoardingMode { get; set; }       // Added by jivan
    }

    public class OnboardFormEnableDisable
    {
        public int cid { get; set; }
        public int formId { get; set; }
        public int status { get; set; }
    }


    public class uploadDocOnBoards
    {
        public int cid { get; set; }
        public char IsConsent { get; set; }
        public byte[] fileVideo { get; set; }
        public string FileNameVideo { get; set; }
        public string FilePathVideo { get; set; }
        public byte[] fileProfilePic { get; set; }
        public string FileNameProfilePic { get; set; }
        public string FilePathProfilePic { get; set; }
        public string remarks { get; set; }
    }


    public class CandidateIdentificationByHR
    {
        public int cid { get; set; }
        public char IsConsent { get; set; }
        public string fileVideo { get; set; }
        public string FileNameVideo { get; set; }
        public string FilePathVideo { get; set; }
        public int FileSizeVideo { get; set; }
        public string remarks { get; set; }
        public string sharePointIdVideo { get; set; }
        public decimal videoMatchPercent { get; set; }
        public char videoMatch { get; set; }
        public int OnboardingMode { get; set; }
        public string type { get; set; }

    }



    public class OnboardingFormVerificationByFormId
    {
        public int cid { get; set; }
        public int formId { get; set; }
        public char status { get; set; }
        public string remarks { get; set; }
    }

    public class OfferApprovedCandidateFilter
    {
        public OfferApprovedCandidateFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null;
            offerStatus = null;
            location = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string location { get; set; }

    }

    public class CheckVoiceImprint
    {
        public int cid { get; set; }
        public byte[] file1 { get; set; }
        public byte[] file2 { get; set; }
        public string techvidId { get; set; }
        public string techvidName { get; set; }

    }


    public class VerificationOnboardingForm
    {
        public char Consent { get; set; }
        public int cid { get; set; }
        public string mailBody { get; set; }
        public string mailSubject { get; set; }
    }

    public class AppoimentLetterAttachment
    {
        public int cid { get; set; }
        public string FileName { get; set; }
    }
    public class ResponseVoiceImp
    {
        public string message { get; set; }
        public string status { get; set; }
    }

    public class EmployeeCreationModel
    {
        public EmployeeCreationModel()
        {
            EMP_DOB = null;
            EMP_DATEOFJOINING = null;
            EMP_EFFECTIVEFROM = null;
            EMP_CONFIRMATIONDUEDATE = null;
            EmpTeamPracticeDate = null;
            EMP_SUB_LOCATION_ID = null;
            EMP_INDEXP_YRS = 0;
            EMP_INDEXP_MTH = 0;
            EMP_DESCRIPTION = null;
            JOBTITLE_EFFECTIVEDATE = null;
            EMP_TRAINEEENDDATE = null;
            EMP_CONTRACTENDDATE = null;
            EMP_DOJ_BSIL = null;
            EMP_MIDDLENAME = null;
            EMP_EFFECTIVEFROM = null;
            EMP_REEMPLOYEE = null;
            IsBootCamp = null;
            EMP_IsPepApplicable = null;
            TraineeType = null;
            ContractorPayType = null;
            EMP_SUB_LOCATION_ID_New = null;
            EmrContactPersonRelation = null;
            EMP_VendorID = null;
            JOBTITLE_EFFECTIVEDATE = null;
        }

        public char Action_Type { get; set; }
        public char EMP_TYPE { get; set; }
        public string EMP_DOMAINID { get; set; }
        public char EMP_ISACTIVE { get; set; }
        public string EMP_FIRSTNAME { get; set; }
        public string EMP_LASTNAME { get; set; }
        public string EMP_MIDDLENAME { get; set; }
        public DateTime? EMP_DOB { get; set; }
        public string EMP_GENDER { get; set; }
        public DateTime? EMP_DATEOFJOINING { get; set; }
        public DateTime? EMP_EFFECTIVEFROM { get; set; }
        public Char EMP_STATUS { get; set; }
        public DateTime? EMP_CONFIRMATIONDUEDATE { get; set; }
        public Char? EMP_REEMPLOYEE { get; set; }
        public int EMP_LOCATION_ID { get; set; }
        public int? EMP_SUB_LOCATION_ID { get; set; }
        public int EMP_DESIGNATION_CODE { get; set; }
        public int EMP_GRADEID { get; set; }
        public int EMP_INDEXP_YRS { get; set; }
        public int EMP_INDEXP_MTH { get; set; }
        public string EMP_MAILID { get; set; }
        public int EMP_NOTICEPERIODDAYS { get; set; }
        public int EMP_LEAVE_POLICY { get; set; }
        public string EMP_DESCRIPTION { get; set; }
        public DateTime? JOBTITLE_EFFECTIVEDATE { get; set; }
        public int DesignationId { get; set; }
        public char? IsBootCamp { get; set; }
        public string TraineeType { get; set; }

        public string ContractorPayType { get; set; }
        public DateTime? EMP_TRAINEEENDDATE { get; set; }
        public DateTime? EMP_CONTRACTENDDATE { get; set; }
        public int Emp_LegalEntity { get; set; }
        public int EMP_Horizontal { get; set; }
        public int? EMP_VendorID { get; set; }
        public DateTime? EMP_DOJ_BSIL { get; set; }
        public int Emp_DeliveryStatus { get; set; }
        public string EmpRM { get; set; }
        public string EmrContactNo { get; set; }
        public string EmrContactPersonName { get; set; }
        public int? EmrContactPersonRelation { get; set; }
        public int Emp_EmployerId { get; set; }
        public char? EMP_IsPepApplicable { get; set; }
        public int EMP_COUNTRY { get; set; }

        public int EmpTeamPracticeID { get; set; }
        public DateTime? EmpTeamPracticeDate { get; set; }
        public int baseEmployer { get; set; }
        public string Division { get; set; }
        public string UploadProfilePic { get; set; }
        public byte[] fileProfilePic { get; set; }

        public int EMP_LOCATION_ID_New { get; set; }
        public int? EMP_SUB_LOCATION_ID_New { get; set; }

        public int CID { get; set; }

    }

    public class signatureSave
    {
        public int cid { get; set; }
        public byte[] signFileBase64 { get; set; }
        public string signFileName { get; set; }
        public string signFilePath { get; set; }
    }

    public class responseSignatureSave
    {
        public int cid { get; set; }
        public string signFileName { get; set; }
        public string signFilePath { get; set; }
        public string message { get; set; }
    }

    public class HrSignatureOnForms
    {
        public int cid { get; set; }
        public int FormId { get; set; }
        public string signFileName { get; set; }
        public string signFilePath { get; set; }
    }

    public class UploadOnboardFormDocs
    {
        public int formId { get; set; }
        public int joiningLocation { get; set; }
        public int divisionId { get; set; }
        public int candidateType { get; set; }
        public string documentName { get; set; }
        public string documentPath { get; set; }
        public char onboardingMode { get; set; }
    }

    public class UploadMandateHRDocuments
    {
        public int CId { get; set; }
        public string documentName { get; set; }
        public string documentPath { get; set; }
        public string documentType { get; set; }
    }


    public class GetOnboardVideos
    {
        public int cid { get; set; }
        public string sharePointIdVideo { get; set; }
        public string FileNameVideo { get; set; }

    }

    public class VerifyPendingDocument
    {
        public int cid { get; set; }
        public int id { get; set; }
        public char status { get; set; }
        public string remarks { get; set; }
    }

    public class OnboardListFilter
    {


        public int page { get; set; }
        public int pageSize { get; set; }

        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string location { get; set; }
        public string onboardstatus { get; set; }
        public string onboardsubstatus { get; set; }
        public string day1SubStatus { get; set; }
    }


    public class Day1InductionInviteDetails
    {
        Day1InductionInviteDetails()
        {
            Day1InductionInvites = new List<Day1InductionInvites>();
            Day1InductionInviteSpoc = new List<Day1InductionInviteSpoc>();
            InductionInviteCandidate = new List<Day1InductionInviteSpoc>();
        }

        public string CandidateEmpIds { get; set; }
        public string JoiningDate { get; set; }
        public string InviteDate { get; set; }
        public int locationId { get; set; }
        public List<Day1InductionInvites> Day1InductionInvites { get; set; }
        public List<Day1InductionInviteSpoc> Day1InductionInviteSpoc { get; set; }
        public List<Day1InductionInviteSpoc> InductionInviteCandidate { get; set; }
    }

    public class Day1InductionInvites
    {
        public int Id { get; set; }
        public string InviteDate { get; set; }
        public string InviteDateUTC { get; set; }
        public string InviteEndDate { get; set; }
        public string InviteEndDateUTC { get; set; }
        public int InviteDateDuration { get; set; }
    }
    public class Day1InductionInviteSpoc
    {
        public int Id { get; set; }
        public string EmpId { get; set; }
    }


    public class Day1InductionInviteMeetingInfo
    {
        public Day1InductionInviteMeetingInfo()
        {
            Day1InductionInviteMeetingList = new List<Day1InductionInviteMeetingList>();
        }

        public int InvId { get; set; }
        public string JoiningDate { get; set; }
        public string InviteDate { get; set; }
        public int locationId { get; set; }
        public string ModifiedByEmpId { get; set; }
        public string ModifiedByEmailId { get; set; }
        public string ModifiedByName { get; set; }
        public List<Day1InductionInviteMeetingList> Day1InductionInviteMeetingList { get; set; }
    }

    public class Day1InductionInviteMeetingList
    {
        public Day1InductionInviteMeetingList()
        {
            Day1InductionInviteMeetingSpoc = new List<Day1InductionInviteMeetingSpoc>();
            Day1InductionInviteMeetingCandidate = new List<Day1InductionInviteMeetingCandidate>();
            Day1InductionInviteMeetingCandidateCommon = new List<Day1InductionInviteMeetingCandidate>();
        }
        public int Id { get; set; }
        public int MId { get; set; }
        public string InviteDate { get; set; }
        public string InviteDateUTC { get; set; }
        public string InviteEndDate { get; set; }
        public string InviteEndDateUTC { get; set; }
        public int InviteDateDuration { get; set; }
        public string EventName { get; set; }
        public List<Day1InductionInviteMeetingSpoc> Day1InductionInviteMeetingSpoc { get; set; }
        public List<Day1InductionInviteMeetingCandidate> Day1InductionInviteMeetingCandidateCommon { get; set; }
        public List<Day1InductionInviteMeetingCandidate> Day1InductionInviteMeetingCandidate { get; set; }
    }

    public class Day1InductionInviteMeetingSpoc
    {
        public int MId { get; set; }
        public int InvId { get; set; }
        public string EmpId { get; set; }
        public string EmailId { get; set; }
        public string Name { get; set; }
    }
    public class Day1InductionInviteMeetingCandidate
    {
        public int MId { get; set; }
        public int InvId { get; set; }
        public string EmpId { get; set; }
        public string EmailId { get; set; }
        public string Name { get; set; }
    }

    public class JoiningItineraryList
    {
        public JoiningItineraryList()
        {
            JoiningItineraryListEvent = new List<JoiningItineraryListEvent>();
        }
        public string Name { get; set; }

        public List<JoiningItineraryListEvent> JoiningItineraryListEvent { get; set; }
    }

    public class JoiningItineraryListEvent
    {
        public JoiningItineraryListEvent()
        {
            JoiningItineraryListMeetingSpoc = new List<JoiningItineraryListMeetingSpoc>();
        }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int Duration { get; set; }
        public string EventName { get; set; }
        public int EventId { get; set; }
        public List<JoiningItineraryListMeetingSpoc> JoiningItineraryListMeetingSpoc { get; set; }
    }

    public class JoiningItineraryListMeetingSpoc
    {
        public int EventId { get; set; }
        public string EmpId { get; set; }
        public string EmailId { get; set; }
        public string Name { get; set; }
    }

    public class RMHRReportFilters
    {
        RMHRReportFilters()
        {
            search = "";
            startDate = null;
            endDate = null;
        }
        public int page { get; set; }
        public int PageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }

    public class OnBoardModelPending
    {

        OnBoardModelPending()
        {
            search = "";
            Location = null;
            DateOfjoiningStart = null;
            DateOfjoiningEnd = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string Location { get; set; }
        public string DateOfjoiningStart { get; set; }
        public string DateOfjoiningEnd { get; set; }

    }


    public class Mailersendforcandidatestatus
    {
        public int locationId { get; set; }
        public string dateOfJoining { get; set; }
    }

    public class UpdateCandidsateJoiningStatus
    {
        public int cid{ get; set; }
        public int Status { get; set; }
    }


}