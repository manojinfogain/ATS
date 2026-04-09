using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class BuddyModel
    {
        public BuddyModel()
        {

            page = 1;
            pageSize = 10;
            search = "";
            AccountId = null;
            locationId = null;
            StartDate = null;
            EndDate = null;
            PendingCases = 0;
        }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string AccountId { get; set; }
        public string locationId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int PendingCases { get; set; }
    }

    public class BuddyAssign
    {
        public int cid { get; set; }
        public string BuddyEmpId { get; set; }       
    }
}