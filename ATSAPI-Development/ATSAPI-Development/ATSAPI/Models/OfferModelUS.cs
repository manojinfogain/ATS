using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class OfferPDFModelUS
    {
        public OfferPDFModelUS()
        {
            currentAddress = new Address();
        }
        public int cid { get; set; }
        public Address currentAddress { get; set; }
        public Decimal FinalBasePay { get; set; }
        public Decimal? FinalJoiningBonus { get; set; }
        public Decimal? FinalRelocationPay { get; set; }
        public Decimal? FinalRelocationAllowance { get; set; }
        public Decimal? FinalIncentiveBonus { get; set; }
        public Decimal ApprovedBasePay { get; set; }
        public int JoiningLocationID { get; set; }
        public Decimal? FinalPerformanceBonus { get; set; }
        public Decimal? FinalVisaCost { get; set; }
        public string offerNumber { get; set; }
        public int? OfferSeqNumber { get; set; }
        public int ? isShippingAddrConfirm { get; set; }
        public int? LaptopMachine { get; set; }
        public Decimal? FinalAnnualVariablePay { get; set; }
        public string DateOfOfferResponse { get; set; }
        public string startDate { get; set; }
        public string InternEndDate { get; set; }
        public char IsOfferGenExternal { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }
        public char? IsStartDateTentativeOrConfirmed { get; set; }



    }

    public class UploadSignedOfferModel
    {
        public int cid { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }

    }
}