using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CandidateConnectModel
    {

        public CandidateConnectModel()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null;
            accountId = null;
            primarySkill = null;
            recruiterId = null;
            startDate2 = null;
            endDate2 = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string search { get; set; }
        public string accountId { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
    }

    public class CandidateTrackerModel
    {
        public CandidateTrackerModel()
        {

            search = "";
            startDate = null;
            endDate = null;
            startDate2 = null;
            endDate2 = null;
            RecruiterId = null;

        }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string RecruiterId { get; set; }
    }
}