using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class PanelModel
    {
      
    }

    public class PanelAddUpdate
    {

        public int Id { get; set; }
        public string PanelEmpId { get; set; }
        public int GradeId { get; set; }
        public string ActionDateUTC { get; set; }
        public string ActionTimeZone { get; set; }
        public string @AccountId { get; set; }
        public string Skills { get; set; }
        public string LocationId { get; set; }
    }

    public class PanelListFilter
    {
        public PanelListFilter()
        {
            search = "";

        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public int LocationId { get; set; }
        public string PrimarySkill { get; set; }
        public string AccountID { get; set; }
        public int MinExp { get; set; }
        public int MaxExp { get; set; }
    }


    public class PanelStatusUpdate
    {

        public int Id { get; set; }
        public string ActionDateUTC { get; set; }
        public string ActionTimeZone { get; set; }
        public string Remarks { get; set; }
        public int Status { get; set; }

    }

    public class JobPosting
    {
        public int Id { get; set; }
        public string thId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public int candidateCount { get; set; }
        public string ActionDateUTC { get; set; }
        public string ActionTimeZone { get; set; }
        public int LocationId { get; set; }
    }

    public class AddPanelJobSlotTime
    {

        public int ThId { get; set; }
        public string PanelEmpId { get; set; }
        public string SlotDateUTC { get; set; }
        public string ActionDateUTC { get; set; }
        public string Remarks { get; set; }
        public string TimeZone { get; set; }
        public string WinTimeZone { get; set; }
        public int OffSetDate { get; set; }

        public PanelSlotTimeDetails PanelSlotTimeDetails { get; set; }
    }

    public class PanelSlotTimeDetails
    {
        public string SlotStartTime { get; set; }
        public string SlotEndTime { get; set; }
        public string SlotStartDateUTC { get; set; }
        public string SlotEndDateUTC { get; set; }
    }

    public class PanelSlotByTh
    {
        public string SlotStartDate { get; set; }
        public string SlotEndDate { get; set; }
        public string SlotStartTime { get; set; }
        public string SlotEndTime { get; set; }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string thid { get; set; }
        public string PanelEmpId { get; set; }
    }
}