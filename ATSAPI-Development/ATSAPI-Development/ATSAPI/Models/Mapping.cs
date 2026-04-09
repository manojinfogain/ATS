using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class Mapping
    {
        public int THID { get; set; }
        public string OppID { get; set; }
        public int ReqTypeID { get; set; }
        public string SFDCAccountID { get; set; }
        public int? AccountID { get; set; }
        public int? ProjectID { get; set; }
        public string Remarks { get; set; }
        public char IsBillable { get; set; }
        public decimal BillableRate { get; set; }
        public string pBillingStartDate { get; set; }
        public string BillingHour { get; set; }
        public int? BillingType { get; set; }
        public string BidType { get; set; }

    }
}