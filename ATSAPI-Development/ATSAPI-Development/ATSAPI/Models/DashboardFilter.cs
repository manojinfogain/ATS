using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class DashboardFilter
    {
        public DashboardFilter()
        {

           
            startDate = null;
            endDate = null;
            startDate2 = null;
            endDate2 = null;
            ColumnType = null;
            accountId = null;
        }

        public string startDate { get; set; }
        public string endDate { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string ColumnType { get; set; }
        public string ID { get; set; }
        public string accountId { get; set; }
    }

    public class AllProfileFilterDash
    {
        public AllProfileFilterDash()
        {


           
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public int thid { get; set; }
        public int RatingMin { get; set; }
        public int RatingMax { get; set; }
        public string search { get; set; }
        public string skillId { get; set; }
        public int NoticePeriod { get; set; }
        public string StatusID { get; set; }
        public string SourceID { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public int MinExp { get; set; }
        public int MaxExp { get; set; }
    }

    public class UpdateScreenStatusModel
    {
        public UpdateScreenStatusModel()
        {



        }

        public int id { get; set; }
        public int profileId { get; set; }
        public int statusId { get; set; }
        public int screenRejectReasonId { get; set; }
        public string Remarks { get; set; }
    }
}