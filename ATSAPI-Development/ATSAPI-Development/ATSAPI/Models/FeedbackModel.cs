using DocumentFormat.OpenXml.Drawing;
using Microsoft.Exchange.WebServices.Data;
using Microsoft.Office.Interop.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class FeedbackModel
    {
        public int cid { get; set; }

        public int roundId { get; set; }
        public int StatusId { get; set; }
        public int interviewTypeId { get; set; }
        public string interviewDate { get; set; }
        public string interviewDateUTC { get; set; }
        public string interviewTimeZone { get; set; }
        public int offsetDate { get; set; }
        public int interviewDuration { get; set; }
        public int interviewModeId { get; set; }
        public string vanueOrLink { get; set; }
        public int IdentityId { get; set; }
        public string IdentityNo { get; set; }
        public string interviewerEmpId { get; set; }
        public string AdditionalInterviewer { get; set; }
        public string remarks { get; set; }
        public string strengths { get; set; }
        public string limitations { get; set; }
        public string technical { get; set; }
        public string nonTechnical { get; set; }
        public string evaluation { get; set; }
        public string techRemarks { get; set; }
        public string remarkNextLevel { get; set; }
        public Boolean ForGroomable { get; set; }
        public Char IsCache { get; set; }
        public string GroomableArea1 { get; set; }
        public string GroomableArea2 { get; set; }
        public string GroomableArea3 { get; set; }
        public List<TechnicalAreas> areas { get; set; }
        public List<autoQuestionFeedback> autoQuestionFeedback { get; set; }
        public int DesignationId { get; set; }
        public decimal CTC { get; set; }
        public decimal joiningBonus { get; set; }
        public decimal salary { get; set; }
        public int primarySkillId { get; set; }
        public string offeredBy { get; set; }
        public string offeredOn { get; set; }
        public string recruiterId { get; set; }
        public string hrFinal_Remarks { get; set; }
        public char finalDecision { get; set; }
        public List<ScreenRoundAdditionalSkills> screenRoundAdditionalSkills { get; set; }
        public List<HRTraits> traits { get; set; }
        public string score { get; set; }
        public string TestAttachment { get; set; }
        public string FinalAttachment { get; set; }
        public string FinalAttachment1 { get; set; }
        public string FinalAttachment2 { get; set; }
        public string AddedBy { get; set; }
        public int flag { get; set; }
        public int IsStatusUpdate { get; set; }
        public decimal NoticeBuyOut { get; set; }
        public decimal TravelExp { get; set; }
        public decimal RelocationExp { get; set; }
        public decimal RetentionBonus { get; set; }
        public string interviewBy { get; set; }
        public int ExternalAgency { get; set; }
        public string AssessmentDate { get; set; }
        public int ScreenRejectReason { get; set; }
        public char PanelConcent { get; set; }
        public char HRConcent { get; set; }
        public char IsInHandOffer { get; set; }
        public decimal? OfferInHandAmount { get; set; }
        public int CompanyID { get; set; }
        public string OfferLetterAtt { get; set; }
        public int AnnualVariablePay { get; set; }
        public string candidateEmail { get; set; }
        public string codebyteTestId { get; set; }
        public string coderBytePublicUrl { get; set; }
        public string coderBytePrivateUrl { get; set; }
        public string coderByteDisplayName { get; set; }
        public int ReasonForNotOptOnlineAssessment { get; set; }
        public int ReasonForOptExternal { get; set; }
        public string coderByteReportUrl { get; set; }
        public int DefaultAssessmentByChangeReason { get; set; }
        public int OnlineAssessmentBy { get; set; }
        public char IsFeedbackSaveOrDraft { get; set; }
         public int EntityId { get; set; }
        public string InterviewLocationId { get; set; }
        public Char IsQuestionareEnable { get; set; }
        public TechnicalQuestionnaireFeedback TechnicalQuestionnaire { get; set; }



    }

    public class TechnicalQuestionnaireFeedback
    {
        public TechnicalQuestionnaireFeedback()
        {
            fundamentalKnowledgForm = new FundamentalKnowleadge();
            prblmSolvingSkillForm = new ProblmSolving();
            CulturatFitAdaptabilityForm = new CulturalFitAdaptability();
        }
        
        public TechPracticeSkill technicalPracticeSkillForm { get; set; }
        public FundamentalKnowleadge fundamentalKnowledgForm { get; set; }
        public ProblmSolving prblmSolvingSkillForm { get; set; }
        public CulturalFitAdaptability CulturatFitAdaptabilityForm { get; set; }
    }

    public class TechnicalAreas
    {
        public string Area { get; set; }
        public Decimal rating { get; set; }
        public int actionvisible { get; set; }
    }

    public class autoQuestionFeedback
    {

        public string QuestionAuto { get; set; }
        public string AutoQAns { get; set; }
        public int rating { get; set; }
        public int Type { get; set; }
    }

    public class AIAssesmentModel
    {

        public decimal TransLeadership { get; set; }
        public decimal TransRoleFitment { get; set; }
        public decimal TransTeamCollaboration { get; set; }
        public decimal TransTechnicalProficiency { get; set; }
        public decimal TransClientInterface { get; set; }
        public string TransSentimentOrientation { get; set; }
        public decimal Communication { get; set; }
        public decimal Confidence { get; set; }
    }
    public class HRTraits
    {
        public int Traits { get; set; }
        public string Comments { get; set; }
        public int hrRating { get; set; }
    }

    public class HRTraitsDisplay
    {
        public int Traits { get; set; }
        public string TraitName { get; set; }
        public string Desc { get; set; }
        public string Comments { get; set; }
        public int hrRating { get; set; }
    }

    public class ScreenRoundAdditionalSkills
    {
        public int Skill { get; set; }
        public int? expYear { get; set; }
        public int? expMonth { get; set; }
        public int? rating { get; set; }
    }

    public class ScreenRoundAdditionalSkillsDisplay
    {
       
        public int skillid { get; set; }
        public string skill { get; set; }
        public int? expYear { get; set; }
        public int? expMonth { get; set; }
        public int? rating { get; set; }

    }

    public class RoundDetails
    {
        public RoundDetails()
        {
            roundList = new List<Round>();
            primarySkill = new SKill();
            recruiter = new Recruiter();
            currency = new Currency();
            _country = new Country();
            _state = new State();
            _city = new City();
            Identity = new Identity();
            gender = new gender();
            sourceProfile = new pofileSource();
        }
        public int cid { get; set; }
        public int RCount { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string Qualification { get; set; }
        public string CurrentOrg { get; set; }
        public string TotalExp { get; set; }
        public string TotalExpMonth { get; set; }
        public string releventExp { get; set; }
        public string releventExpMonth { get; set; }
        public string THID { get; set; }
        public int talentId { get; set; }
        public SKill primarySkill { get; set; }
        public string SalaryExp { get; set; }
        public string CurrentSalary { get; set; }
        public string Resume { get; set; }
        public string ResumePath { get; set; }
        public string joiningDate { get; set; }
        public string JobDescription { get; set; }
        public Identity Identity { get; set; }
        public string IdentityNo { get; set; }
        public Recruiter recruiter { get; set; }
        public Currency currency { get; set; }
        public List<Round> roundList { get; set; }
        public Country _country { get; set; }
        public State _state { get; set; }
        public City _city { get; set; }
        public gender gender { get; set; }
        public pofileSource sourceProfile { get; set; }
        public int HiringLocation { get; set; }
        public int EmploymentTypeId { get; set; }
        public int requirementTypeId { get; set; }
        public string requirementTypeName { get; set; }
        public int IsConversionEmployee { get; set; }
        public char IsDetailedFeedbackDisableForAccount { get; set; }
         public char IsAIQuestionFeedbackEnable { get; set; }
        public char IsAIQuestionGenEnable { get; set; }
        public int EntityId { get; set; }
        public int CandidateGradeId { get; set; }
        public char IsRenuTeam { get; set; }
        public char isNewFeedback { get; set; }



    }

    public class Round
    {
        public Round()
        {
            InterViewStatus = new InterviewStatus();
            interviewType = new InterviewType();
            InterviewMode = new InterviewMode();
            _designation = new Designation();
            primarySkill = new SKill();
            screenRoundAdditionalSkills = new List<ScreenRoundAdditionalSkillsDisplay>();
            areas = new List<TechnicalAreas>();
            hrTraits = new List<HRTraitsDisplay>();
            offeredby = new OfferedBy();
            recruiter = new Recruiter();
            interviewer = new Interviewer();
            AdditionalInterviewer = new List<Interviewer>();
            PrevStatus = new PrevStatus();
            ExternalAgency = new externalAgency();
            autoQuestionFeedback = new List<autoQuestionFeedback>();
            AIAreaRating = new List<Area>();
            AIQuestRating = new List<Questions>();
        }
        public string thId { get; set; }
        public int AnnualVariablePay { get; set; }
        public string talentId { get; set; }
        public int sequenceId { get; set; }
        public int RoundId { get; set; }
        public InterviewType interviewType { get; set; }
        public char IsCurrentRound { get; set; }
        public string InterviewDate { get; set; }
        public string interviewDateUTC { get; set; }
        public string AssessmentDate { get; set; }
        public string interviewTimeZone { get; set; }
        public int offsetDate { get; set; }
        public int InterviewDuration { get; set; }
        public InterviewMode InterviewMode { get; set; }
        public string vanueOrLink { get; set; }
        public Interviewer interviewer { get; set; }
        public List<Interviewer> AdditionalInterviewer { get; set; }
        public InterviewStatus InterViewStatus { get; set; }
        public PrevStatus PrevStatus { get; set; }
        public externalAgency ExternalAgency { get; set; }
        public string interviewBy { get; set; }
        public string testScore { get; set; }
        public string testAttachment { get; set; }
        public string Path { get; set; }

        public string FinalAttachment { get; set; }
        public string FinalAttachmentPath { get; set; }
        public  string FinalAttachmentPathKey { get; set; }
        public string FinalAttachment1 { get; set; }
        public string FinalAttachment1Path { get; set; }
        public string FinalAttachment1PathKey { get; set; }
        public string FinalAttachment2 { get; set; }
        public string FinalAttachment2Path { get; set; }
        public string FinalAttachment2PathKey { get; set; }
        public string remarks { get; set; }
        public Designation _designation { get; set; }
        public string CTC { get; set; }
        public string joiningBonus { get; set; }
        public string NoticeBuyOut { get; set; }
        public string TravelExp { get; set; }
        public string RelocationExp { get; set; }
        public string RetentionBonus { get; set; }
        public string salary { get; set; }
        public SKill primarySkill { get; set; }
        public OfferedBy offeredby { get; set; }
        public string offeredOn { get; set; }
        public Recruiter recruiter { get; set; }
        public string hrFinal_Remarks { get; set; }
        public string finalDecision { get; set; }
        public string strengths { get; set; }
        public string limitations { get; set; }
        public string technical { get; set; }
        public string nonTechnical { get; set; }
        public string evaluation { get; set; }
        public string techRemarks { get; set; }
        public string ForGroomable { get; set; }
        public string GroomableArea1 { get; set; }
        public string GroomableArea2 { get; set; }
        public string GroomableArea3 { get; set; }
        public List<ScreenRoundAdditionalSkillsDisplay> screenRoundAdditionalSkills { get; set; }
        public List<TechnicalAreas> areas { get; set; }
        public List<HRTraitsDisplay> hrTraits { get; set; }
        public string PanelCalendarID { get; set; }
        public string CandidateCalendarID { get; set; }
        public string MSTeamMeetingId { get; set; }
        public string IsPicturePresent { get; set; }
        public string VideoMatchPercent { get; set; }
        public string VideoMatch { get; set; }
        public string PanelConcent { get; set; }
        public string OfferCompanyName { get; set; }
        public string HRConcent { get; set; }
        public string IsInHandOffer { get; set; }
        public string OfferInHandAmount { get; set; }
        public string OfferLetterAtt { get; set; }
        public string OfferLetterAttPath { get; set; }
        public string remarkNextLevel { get; set; }
        public string familiarProgramTechnolog { get; set; }
        public string technicalSkillsEvaluat { get; set; }
        public string candidateCodingChallenge { get; set; }
        public string assessRoleKnowledg { get; set; }
        public string candidateApprochComplexPrblm { get; set; }
        public string candidatePrblmSolvingApproch { get; set; }
        public string candidatePossesIndustryDomExp { get; set; }
        public string candidateFitForInfogain { get; set; }
        public string candidateAbilityToAdoptChangeWork { get; set; }
        public string isDetailedFeedbackSaveOrDraft { get; set; }
        public string coderByteTestId { get; set; }
        public string coderBytePublicUrl { get; set; }
        public string coderBytePrivateUrl { get; set; }
        public int ReasonNotOptId { get; set; }
        public string ReasonNotOptName { get; set; }
        public int ReasonforOptId { get; set; }
        public string ReasonforOptName { get; set; }
        public string coderByteDisplayName { get; set; }
        public int Final_Score { get; set; }
        public string coderByteReportUrl { get; set; }
        public int DefaultAssessmentByChangeReason { get; set; }
        public int Qualifying_Score { get; set; }
        public string cheating_flag { get; set; }
        public string AssessmentStatus { get; set; }
        public List<autoQuestionFeedback> autoQuestionFeedback { get; set; }
        public char IsFeedbackSaveOrDraft { get; set; }
        public int TempStatusId { get; set; }
        public char IsAIQuestionFeedbackEnable { get; set; }
        public string InterviewLocationId { get; set; }
        public string InterviewLocationName { get; set; }
        public string InterviewLocationAddress { get; set; }
        public char isPanelSaveQuestion { get; set; }
        public char isNewFeedback { get; set; }
        public List<Area> AIAreaRating { get; set; }
        public List<Questions> AIQuestRating { get; set; }
        public string Recommendation { get; set; }
        public string SentimentOrientation { get; set; }
        public string OfferLetterAttNameKey { get; set; }
        public string testAttachmentKey { get; set; }

    }

    public class InterviewStatus
    {
        public int Id { get; set; }
        public string Status { get; set; }
    }

    public class InterviewType
    {
        public int Id { get; set; }
        public string Type { get; set; }
    }

    public class InterviewMode
    {
        public int id { get; set; }
        public string mode { get; set; }
    }
    public class SKill
    {
        public int Id { get; set; }
        public string SkillName { get; set; }
    }
    public class Designation
    {
        public int Id { get; set; }
        public string desigName { get; set; }
    }
    public class Recruiter
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
    public class Currency
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class gender
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class pofileSource
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class EmailTemplate
    {
        public int Id { get; set; }
        public string TemplateName { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
    public class OfferedBy
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
    public class Interviewer
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string email { get; set; }
    }


    public class InterviewFeedbackStatus
    {
        public int RoundId { get; set; }
        public int cid { get; set; }
        public string InterviewDate { get; set; }
        public string interviewDateUTC { get; set; }
        public string interviewTimeZone { get; set; }
        public int offsetDate { get; set; }
        public int InterviewDuration { get; set; }
        public int InterviewStatus { get; set; }
        public string JoiningDate { get; set; }
        public int InterviewMode { get; set; }
        public string Interviewer { get; set; }
        public string AdditionalInterviewer { get; set; }
        public string Remarks { get; set; }
        public string InterviewDetails { get; set; }
        public string UpdatedBy { get; set; }
        public int rescheduleCancelReason { get; set; }
        public int EntityId {  get; set; }
        public string InterviewLocationId { get; set; }


    }

    public class roundIdList
    {
        public int cid { get; set; }
        public List<string> roundListId { get; set; }
    }


    public class Country
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class State
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class Identity
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
    public class City
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class getScheduleCalender
    {
        public getScheduleCalender()
        {
            startTime = new timeDate();
            endTime = new timeDate();
        }
        public int availabilityViewInterval { get; set; }
        public timeDate startTime { get; set; }
        public timeDate endTime { get; set; }
        public List<string> schedules { get; set; }
    }

    public class timeDate
    {
        public string dateTime { get; set; }
        public string timeZone { get; set; }
    }
    public class ProfilePictureModel
    {
        public int Cid { get; set; }
        public int RoundId { get; set; }
        public int IsSignOff { get; set; }
        public string ProfilePicName { get; set; }
    }

    public class PrevStatus
    {
        public int Id { get; set; }
        public string Status { get; set; }
    }
    public class externalAgency
    {
        public int Id { get; set; }
        public string name { get; set; }
    }

    public class uploadDocInt
    {
        public int cid { get; set; }
        public int RoundId { get; set; }
        public int IsConsent { get; set; }
        public byte[] fileVideo { get; set; }
        public string FileNameVideo { get; set; }
        public string FilePathVideo { get; set; }
        public byte[] fileProfilePic { get; set; }
        public string FileNameProfilePic { get; set; }
        public string FilePathProfilePic { get; set; }
        public byte[] fileID { get; set; }
        public string FileNameID { get; set; }
        public string FilePathID { get; set; }
        public int IdType { get; set; }
        public string IdNumber { get; set; }
    }

    public class uploadVideoInterview
    {
        public int cid { get; set; }
        public int RoundId { get; set; }
        public int IsConsent { get; set; }
        public string fileVideo { get; set; }
        public string FileNameVideo { get; set; }
        public string FilePathVideo { get; set; }
        public int FileSizeVideo { get; set; }
        public string sharePointIdVideo { get; set; }
        public char isVideoCompare { get; set; }
    }

    public class uploadTranscript
    {
        public int cid { get; set; }
        public int RoundId { get; set; }
        public int thid { get; set; }

        public string FileNameTrans { get; set; }
        public string FilePathTrans { get; set; }
        public int FileSizeTrans { get; set; }
        public string sharePointIdTrans { get; set; }
        public byte[] file1 { get; set; }

    }


    public class GetInterviewsVideos
    {
        public int cid { get; set; }
        public string sharePointIdVideo { get; set; }
        public string FileNameVideo { get; set; }

    }

    public class VideoImageCampareInterview
    {
        public int cid { get; set; }
        public string sharePointIdVidPrev { get; set; }
        public string sharePointIdVidCurrent { get; set; }
        public string FileNameVideoPrev { get; set; }
        public string FileNameVideoCurrent { get; set; }
        public byte[] file1 { get; set; }
        public byte[] file2 { get; set; }

    }
   

    public class InterviewRoundDetailsVid
    {

        public int cid { get; set; }
        public int RoundIdPrev { get; set; }
        public int RoundIdCurrent { get; set; }
        public string InterviewDatePrev { get; set; }
        public string InterviewDateCurrent { get; set; }
        public string PrevSharePointIdVideo { get; set; }
        public string FileNameVideoPrev { get; set; }
        public string CurrentSharePointIdVideo { get; set; }
        public string FileNameVideoCurrent { get; set; }
        public char IsRoundExist { get; set; }
        public string SharePointIdTrans { get; set; }
        public string FileNameTrans { get; set; }

    }
    public class InterviewRoundDetailsTrans
    {

        public int cid { get; set; }
        public int thid { get; set; }
        public int RoundId { get; set; }
        public string SharePointIdTrans { get; set; }
        public string FileNameTrans { get; set; }
        public string FilePathTrans { get; set; }
        public int StatusId { get; set; }
        public int InterviewTypeId { get; set; }
        public char FeedbackProvided { get; set; }


    }

    public class UpdateVideoMatchScoreByRoundId
    {

        public int cid { get; set; }
        public int RoundId { get; set; }
        public string VideoMatchPercent { get; set; }
        public string VideoMatch { get; set; }
        public string ErrorMessage { get; set; }

    }

    public class UpdateTransScriptScoreByRoundId
    {

        public UpdateTransScriptScoreByRoundId()
        {

            Area = new List<Area>();
            Questions = new List<Questions>();
        }

        public int cid { get; set; }
        public int RoundId { get; set; }
        public List<Area> Area { get; set; }
        public string Recommendation { get; set; }
        public string SentimentOrientation { get; set; }
        public List<Questions> Questions { get; set; }
        public int ApiRespnseStatus { get; set; }
        public string ApiRespnseStatusMessage { get; set; }


    }

    public class AreaRating
    {
        public string area { get; set; }
        public decimal rating { get; set; }
    }
    public class ResponseTransScriptUpload
    {
        //public decimal Leadership { get; set; }
        //public decimal RoleFitment { get; set; }
        //public decimal TeamCollaboration { get; set; }
        //public decimal TechnicalProficiency { get; set; }
        //public decimal ClientInterface { get; set; }
        //public decimal Communication { get; set; }
        //public decimal Confidence { get; set; }
        //public string message { get; set; }
        //public string status { get; set; }
        //public string SentimentOrientation { get; set; }

        public List<Area> Area { get; set; }
        public List<Questions> Questions { get; set; }
        public string Recommendation { get; set; }
        public string SentimentOrientation { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }

    public class Area
    {
        public string name { get; set; }
        public decimal rating { get; set; }
    }

    public class Questions
    {
        public string name { get; set; }
        public decimal rating { get; set; }
    }


    public class JdPasreQuestion
    {
        public JdPasreQuestion()
        {
            QuestionAuto = new List<QuestionAuto>(); 
        }
        public List<QuestionAuto> QuestionAuto { get; set; }
    }

    public class QuestionAuto
    {
        public string Question { get; set; }
    }

    public class updateQuestionAuto
    {
        public int cid { get; set; }
        public List<QuestionAuto> QuestionAuto { get; set; }
    }

  


}