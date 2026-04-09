using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class OfferGenerationFilter
    {
        public OfferGenerationFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null; 
            offerStatus = null;
            dropResonId = null;
            primarySkill = null;
            recruiterId = null;
            pendingWithMe = null;
            startDate2 = null;
            endDate2 = null;
            PracticeId = null;

        }

        public int page { get; set; }
        public int pageSize { get; set; }

        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string dropResonId { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string pendingWithMe { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string PracticeId { get; set; }
    }
}