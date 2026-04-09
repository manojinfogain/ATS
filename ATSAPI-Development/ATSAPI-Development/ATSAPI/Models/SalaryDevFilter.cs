using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class SalaryDevFilter
    {
        public SalaryDevFilter()
        {

            search = "";
            location = null;
            offerStatus = null;
            startDate = null;
            endDate = null;
            startDate2 = null;
            endDate2 = null;
            DUIDs = null;
            accountId = null;
            recruiterId = null;
            requisitionType = null;
            contractType = null;
            source = null;
            IsReportSalaryMask = 'N';


        }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string offerStatus { get; set; }
        public string location { get; set; }
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string recruiterId { get; set; }
        public string requisitionType { get; set; }
        public string contractType { get; set; }
        public string source { get; set; }
        public string PracticeId { get; set; }
        public char IsReportSalaryMask { get; set; }


    }
}