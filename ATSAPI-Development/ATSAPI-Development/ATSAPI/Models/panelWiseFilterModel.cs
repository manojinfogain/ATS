using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class panelWiseFilterModel
    {
        //public panelWiseFilterModel()
        //{
        //    endDate =  null;
        //    DUIDs = "";
        //    accountId = "";
        //    skillId = "";
        //}

        public string EmpID { get; set; }
        public string PanelEmpID { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string skillId { get; set; }
        public string statusId { get; set; }
    }

    //Added by jivan
    public class panelWiseFilterModelNew
    {
        public panelWiseFilterModelNew()
        {
            StartDate = null;
            EndDate = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}