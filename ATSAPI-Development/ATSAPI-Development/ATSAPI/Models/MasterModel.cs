using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CandidateType
    {
        public int typeId { get; set; }
        public string statusName { get; set; }
    }

    public class IdentityMaster
    {
        public int id { get; set; }
        public string identity_name { get; set; }
    }

    public class CurrencyMaster
    {
        public int id { get; set; }
        public string currency_name { get; set; }
        public string currency_code { get; set; }
    }

    public class InterviewStatus1
    {
        public int statusId { get; set; }
        public string statusName { get; set; }
        public string shortname { get; set; }
    }

    public class CompanyName
    {

        public string ComapanyName { get; set; }
        public string Tier { get; set; }

    }

}