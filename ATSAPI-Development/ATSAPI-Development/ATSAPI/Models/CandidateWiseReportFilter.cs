using DocumentFormat.OpenXml.Bibliography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CandidateWiseReportFilter
    {
        public CandidateWiseReportFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null;
            DUIDs = null;
            accountId = null;
            primarySkill = null;
            recruiterId = null;
            interviewStartDate = null;
            interviewEndDate = null;
            practiceId = null;
            practiceCommunityId = null;
            subPracticeId = null;
            SourceType = null;
            talentStatus = null;


        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string search { get; set; }
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string interviewStartDate { get; set; }
        public string interviewEndDate { get; set; }
        public string practiceId { get; set; }
        public string practiceCommunityId { get; set; }
        public string subPracticeId { get; set; }
        public string SourceType { get; set; }
        public string talentStatus { get; set; }


    }

}