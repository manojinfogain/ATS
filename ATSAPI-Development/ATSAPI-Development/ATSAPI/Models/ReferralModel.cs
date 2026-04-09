using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class ReferralModel
    {

        public ReferralModel()
        {
            search = "";
            startDate = null;
            endDate = null;
            DUIDs = null;
            accountId = null;
            primarySkill = null;
            recruiterId = null;
            PracticeId = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }      
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string PracticeId { get; set; }
    }
}