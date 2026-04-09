using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CSkillFilterModel
    {

        public CSkillFilterModel()
        {
            
            thid = null;
             startDate = null;
            endDate = null;
            skillId = null;
            recruiterId = null;
            search = "";
            MinExp=null;
            MaxExp=null;
            accountId= null;
            location = null;
            country = "";
            orgName = "";
            RatingMin = 0;
            RatingMax = 0;


        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string thid { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string recruiterId { get; set; }
        public string sortColumn { get; set; }
        public string sortDir { get; set; }
        public int? screenReject { get; set; }
        public int? NPMax { get; set; }
        public string search { get; set; }
        public string skillId { get; set; }
        public string MinExp { get; set; }
        public string MaxExp { get; set; }
        public string accountId { get; set; }
        public string location { get; set; }
        public string country { get; set; }
        public string orgName { get; set; }
        public int RatingMin { get; set; }
        public int RatingMax { get; set; }









    }
}