using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class ReopenTalentDetails
    {
        public int cid { get; set; }
        public string thid { get; set; }
        public int CubeId { get; set; }
        public int ClusterID { get; set; }
        public int RoleID { get; set; }
        public int GradeId { get; set; }
        public decimal VarianceMax { get; set; }
        public decimal VarianceMid { get; set; }
        public int IsReinitiationRequired { get; set; }
        public String remarks { get; set; }
        public decimal billingRateHrInUSD { get; set; }
        public decimal annualBillableHours { get; set; }
        public decimal annualRevenueUsd { get; set; }
        public decimal annualSalaryCostUsd { get; set; }
        public decimal benefitsUsd { get; set; }
        public decimal ProjectBufferUsd { get; set; }
        public decimal dgmCostUsd { get; set; }
        public decimal dgmPercentUsd { get; set; }
        public decimal NonReimbursableTravelCost { get; set; }
        public decimal projectSpecificCost { get; set; }
        public decimal billingRateHrCurrency { get; set; }
        public int billingCurrencyId { get; set; }
        public int billableHoursDay { get; set; }
        public string DPApproverId { get; set; }
        public int ReopeningReason { get; set; }

    }

    public class ReOpenlentIdNonReinitiation
    {
        public string newthid { get; set; }
        public string prevthid { get; set; }
        //public string remarks { get; set; }
        public int ReopeningReason { get; set; }


    }


}