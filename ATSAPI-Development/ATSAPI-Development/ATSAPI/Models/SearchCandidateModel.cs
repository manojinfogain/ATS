using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class SearchCandidateModel
    {
        public SearchCandidateModel()
        {
            Name = "";
            Email = "";
            SkillId = "";
            SourceId = "";
            InterviewStatusID = "";
            ExpMin = 0;
            ExpMax = 0;
            NPMax = 0;
            TalentId = "";
            NoOfPastDays = 0;
            RecruiterEmpID = "";
            AccountId = "";
            ProjectID = "";
            HiringManager = "";
            RequisitionType = "";
            partner = "";
            offerStatus = "";
            interviewDropReasonId = "";
            offerDropReasonId = "";
            ProfileAdditionStartDate = null;
            ProfileAdditionEnddate = null;
            InterviewType = "";
            TrLocationId = "";
            OrgName = "";
            RatingScoreMin = 0;
            RatingScoreMax = 0;
        }
        public string Name { get; set; }
        public string Email { get; set; }
        public string SkillId { get; set; }
        public string SourceId { get; set; }
        public string InterviewStatusID { get; set; }
        public int ExpMin { get; set; }
        public int ExpMax { get; set; }
        public string TalentId { get; set; }
        public int NPMax { get; set; }
        public int NoOfPastDays { get; set; }
        public string RecruiterEmpID { get; set; }
        public string AccountId { get; set; }
        public string ProjectID { get; set; }
        public string HiringManager { get; set; }
        public string RequisitionType { get; set; }
        public string partner { get; set; }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public string offerStatus { get; set; }
        public string interviewDropReasonId { get; set; }
        public string offerDropReasonId { get; set; }
        public string ProfileAdditionStartDate { get; set; }
        public string ProfileAdditionEnddate { get; set; }
        public string InterviewType { get; set; }
        public string TrLocationId { get; set; }

        public string OrgName { get; set; }
        public int RatingScoreMin { get; set; }
        public int RatingScoreMax { get; set; }
    }
}
