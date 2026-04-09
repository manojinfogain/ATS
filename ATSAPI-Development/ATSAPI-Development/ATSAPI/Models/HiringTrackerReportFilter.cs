using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class HiringTrackerReportFilter
    {
        public HiringTrackerReportFilter()
        {
            search = "";           
            startDate = null;
            endDate = null;
            offerStatus = null;
            primarySkill = null;
            recruiterId = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string offerStatus { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
    }
}