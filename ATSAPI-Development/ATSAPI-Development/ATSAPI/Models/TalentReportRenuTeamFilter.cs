using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class TalentReportRenuTeamFilter
    {
        public TalentReportRenuTeamFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null;
            offerStatus = null;          
            primarySkill = null;
            recruiterId = null;
            requisitionType = null;
            accountId = null;
            talentStatus = null;



        }

        public int page { get; set; }
        public int pageSize { get; set; }

        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string location { get; set; }
        public string accountId { get; set; }
        public string requisitionType { get; set; }
        public string talentStatus { get; set; }






    }
}