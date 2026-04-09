using Microsoft.Office.Interop.Outlook;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{


    public class USOfferApprovalModel
    {
        public string DivisionID { get; set; }  
        public int OfferID { get; set; }
        public int cid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferedName { get; set; }
        public int VisaId { get; set; }
        public int I9RepresentativeId { get; set; }
        public int LegalEntityId { get; set; }
        public int Division { get; set; }
        public int OfferTypeId { get; set; }
        public int EmploymentTypeId { get; set; }
        public int DepartmentId { get; set; }
        public int EmpUnit { get; set; }
        public int ResourceId { get; set; }
        public int TitleId { get; set; }
        public int GradeId { get; set; }
        public int TalentCubecode { get; set; }
        public int NewHireOrRehireId { get; set; }
        public int RemoteStatusId { get; set; }
        public int Relocation { get; set; }        
        public int SalaryType { get; set; }
        public Decimal BasePay { get; set; }
        public Decimal PerfomanceBonous { get; set; }
        public Decimal RelocationPay { get; set; }
        public Decimal VisaPay { get; set; }
        public Decimal IncentiveBonus { get; set; }
        public int? MedicalBenifits { get; set; }
        public int FLSACId { get; set; }
        public char PreviousV { get; set; }
        public int PracticeId { get; set; }
        public int ReportingManager { get; set; }
        public DateTime StartDate { get; set; }
        public Decimal billingRate { get; set; }
        public Decimal LoadingCostinUSD { get; set; }
        public Decimal GrossSalaryinUSD { get; set; }
        public Decimal PerHourCostRateinUSD { get; set; }
        public Decimal GrossMargin { get; set; }
        public String  OfferGivenBy { get; set; }
        public String TAGLead_Approver { get; set; }
        public String DH_Approver { get; set; }
        public String SVP_Approver { get; set; }
        public String COO_Approver { get; set; }
        public String ActionTaken { get; set; }
        public string Remark { get; set; }
        public int VenderId { get; set; }
        public DateTime? VisaExpiryDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? LocationStateId { get; set; }
        public int? IsBillable { get; set; }
        public int? CityID { get; set; }
        public int? JoiningStateId { get; set; }
        public int? JoinigCityID { get; set; }
        public decimal ? joiningBonuspay { get; set; }
        public Char? IsRevised { get; set; }
        public Decimal? AnnualVariablePay { get; set; }
        public DateTime? InternEndDate { get; set; }
        public String I9RepresentativeEmp { get; set; }
        public string AddedOnDateUTC { get; set; }
        public string AddedOnTimeZone { get; set; }
        public int AddedOffsetDate { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }
        public string OfferedOnUTC { get; set; }
        public string OfferedOnTimeZone { get; set; }
        public int OfferedOnOffsetDate { get; set; }
        public string RevisedOfferDateUTC { get; set; }
        public string RevisedOfferDateTimeZone { get; set; }
        public int RevisedOfferDateOffsetDate { get; set; }
        public String CDO_Approver { get; set; }
        public String TAGHead_Approver { get; set; }

    }

    public class OfferApprovalDocForUS
    {

        public OfferApprovalDocForUS()
        {
            AttachmentforUS = new List<AttachmentforUS>();
        }
        public int Cid { get; set; }
        public string ActionTakenBy { get; set; }
        public List<AttachmentforUS> AttachmentforUS { get; set; }
        public int ActionId { get; set; }

    }

    public class AttachmentforUS
    {
        public string FileName { get; set; }
    }

    public class OfferGenerationFilterforUS
    {
        public OfferGenerationFilterforUS()
        {
            search = "";
            startDate = null;
            endDate = null;
            thid = null;
            offerStatus = null;
            dropResonId = null;
            primarySkill = null;
            recruiterId = null;
            pendingWithMe = null;
            startDate2 = null;
            endDate2 = null;

        }

        public int page { get; set; }
        public int pageSize { get; set; }

        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string thid { get; set; }
        public string offerStatus { get; set; }
        public string dropResonId { get; set; }
        public string primarySkill { get; set; }
        public string recruiterId { get; set; }
        public string pendingWithMe { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
    }
    public class OfferSendModelforUS
    {
        public string link { get; set; }
        public int cid { get; set; }
        public string OfferedOnUTC { get; set; }
        public string OfferedOnTimeZone { get; set; }
        public int OfferedOnOffsetDate { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }
    }


    public class offeracceptsignatureSave
    {
        public string param { get; set; }
        public byte[] offersignFileBase64 { get; set; }

        public string offersignFileName { get; set; }
        public string offersignFilePath { get; set; }
        public byte[] AgreementsignFileBase64{ get; set; }

        public string AgreementsignFileName { get; set; }
        public string AgreementsignFilePath { get; set; }
        public string JoiningDate { get; set; }
        public string AuthKey { get; set; }
        public string PriorCompanyDate { get; set; }
        public string PriorCompany { get; set; }
        public string PriorCompanyOther { get; set; }
        public string OfferAcceptDateUTC { get; set; }
        public string OfferAcceptTimeZone { get; set; }
        public int OfferAcceptOffsetDate { get; set; }
        public string PriorCompDateAgreementUTC { get; set; }
        public string PriorCompDateAgreementTimeZone { get; set; }
        public int PriorCompDateAgreementOffSetDate { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }




    }

    public class responseofferacceptsignatureSave
    {
        public string offersignFileName { get; set; }
        public string offersignFilePath { get; set; }
        public string AgreementsignFileName { get; set; }
        public string AgreementsignFilePath { get; set; }
        public string message { get; set; }
    }


    public class UpdateOfferApprovalStatusForUS
    {

        public UpdateOfferApprovalStatusForUS()
        {
            Remark = null;
            IsDelegator = 'N';

        }

        public int cid { get; set; }
        public string ActionTaken { get; set; }
        public string Remark { get; set; }
        public char IsDelegator { get; set; }
        public string ModifiedOnUTC { get; set; }
        public string ModifiedOnTimeZone { get; set; }
        public int ModifiedOnOffsetDate { get; set; }

    }
    public class HRUpdateOfferApprovalStatusForUS
    {

        public HRUpdateOfferApprovalStatusForUS()
        {
            Remark = null;

        }

        public int cid { get; set; }
        public string HRApprovalId { get; set; }
        public string Remark { get; set; }
        public string ActionDateUTC { get; set; }
        public string ActionOnTimeZone { get; set; }
        public int ActionOnOffsetDate { get; set; }

    }

    
}