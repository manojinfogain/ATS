using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class OfferGenerationReportFilter
    {
        public OfferGenerationReportFilter()
        {
            search = "";
            thid = null;
            startDate = null;
            endDate = null;
            offerStatus = null;
            primarySkill = null;
            recruiterId = null;
            startDate2 = null;
            endDate2 = null;
        }


        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
    }
}