using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class OfferApprovalModel
    {
        public string DivisionID { get; set; }
        public int OfferID { get; set; }
        public int cid { get; set; }
        public int DesignationId { get; set; }
        public int PracticeId { get; set; }
        public int ctc { get; set; }
        public int joiningBonus { get; set; }
        public int NoticeBuyOut { get; set; }
        public int TravelExp { get; set; }
        public int RelocationExp { get; set; }
        public int RetentionBonus { get; set; }
        public int salary { get; set; }
        public string TAGLead_Approver { get; set; }
        public string DH_Approver { get; set; }
        public string FunctionHead { get; set; }
        public int gradeId { get; set; }
        public string Action { get; set; }
        public string offerGivenBy { get; set; }
        public string SVP_Approver { get; set; }
        public string COO_Approver { get; set; }
        public string CDO_Approver { get; set; }
        public DateTime DateOfJoining { get; set; }
        public DateTime ContractCompletionDate { get; set; }
        public int CandidateTypeID { get; set; }
        public int SalaryType { get; set; }
        public int PartnerID { get; set; }
        public int JoiningLocationID { get; set; }
        public int ServiceAndMarkup { get; set; }
        public char IsRevisedOffer { get; set; }
        public decimal billingRateHrCurrency { get; set; }
        public int billingCurrencyId { get; set; }
        public int NonReimbursableTravelCost { get; set; }
        public int projectSpecificCost { get; set; }
        public int projectBuffer { get; set; }
        public int billableHoursDay { get; set; }
        public decimal billingRateHrInUSD { get; set; }
        public decimal annualBillableHours { get; set; }
        public decimal annualRevenueUsd { get; set; }
        public decimal annualSalaryCostUsd { get; set; }
        public decimal joiningBonusUsd { get; set; }
        public decimal benefitsUsd { get; set; }
        public decimal ProjectBufferUsd { get; set; }
        public decimal dgmCostUsd { get; set; }
        public decimal dgmPercentUsd { get; set; }
        public int JobFamilyID { get; set; }
        public char JfCateg { get; set; }
        public char gradeBand { get; set; }
        public char reHire { get; set; }
        public string remarks { get; set; }
        public decimal ConversionRate { get; set; }
        public decimal BillingAmountInUSD { get; set; }
        public decimal ClientApprovedBilling { get; set; }
        public string DGMPer { get; set; }
        public string DGMAmount { get; set; }
        public string OtherCost { get; set; }
        public string Revenue { get; set; }
        public string FieldIDs { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }
        public string TAGHead_Approver { get; set; }
        public decimal variablePay { get; set; }
        public string ContractExtensionRemarks { get; set; }

        public char IsReinitiate { get; set; }
        public int JustificationBucketId { get; set; }
        public string OfferReleasedFor { get; set; }


    }


    public class OfferApprovalModelG5Above
    {
        public string DivisionID { get; set; }
        public int OfferID { get; set; }
        public int cid { get; set; }
        public int DesignationId { get; set; }
        public int PracticeId { get; set; }
        public int ctc { get; set; }
        public int joiningBonus { get; set; }
        public int NoticeBuyOut { get; set; }
        public int TravelExp { get; set; }
        public int RelocationExp { get; set; }
        public int RetentionBonus { get; set; }
        public int salary { get; set; }
        public string TAGLead_Approver { get; set; }
        public string FunctionHead { get; set; }
        public int gradeId { get; set; }
        public string Action { get; set; }
        public string offerGivenBy { get; set; }
        public string DH_Approver { get; set; }
        public string SVP_Approver { get; set; }
        public string COO_Approver { get; set; }
        public DateTime DateOfJoining { get; set; }
        public DateTime ContractCompletionDate { get; set; }
        public int CandidateTypeID { get; set; }
        public int SalaryType { get; set; }
        public int PartnerID { get; set; }
        public int JoiningLocationID { get; set; }
        public int ServiceAndMarkup { get; set; }
        public char IsRevisedOffer { get; set; }
        public decimal billingRateHrCurrency { get; set; }
        public int billingCurrencyId { get; set; }
        public int NonReimbursableTravelCost { get; set; }
        public int projectSpecificCost { get; set; }
        public int projectBuffer { get; set; }
        public int billableHoursDay { get; set; }
        public decimal billingRateHrInUSD { get; set; }
        public decimal annualBillableHours { get; set; }
        public decimal annualRevenueUsd { get; set; }
        public decimal annualSalaryCostUsd { get; set; }
        public decimal joiningBonusUsd { get; set; }
        public decimal benefitsUsd { get; set; }
        public decimal ProjectBufferUsd { get; set; }
        public decimal dgmCostUsd { get; set; }
        public decimal dgmPercentUsd { get; set; }
        public int JobFamilyID { get; set; }
        public char JfCateg { get; set; }
        public char gradeBand { get; set; }
        public char reHire { get; set; }
        public string remarks { get; set; }
        public decimal ConversionRate { get; set; }
        public decimal BillingAmountInUSD { get; set; }
        public decimal ClientApprovedBilling { get; set; }
        public string DGMPer { get; set; }
        public string DGMAmount { get; set; }
        public string OtherCost { get; set; }
        public string Revenue { get; set; }
        public string FieldIDs { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }
        public decimal variablePay { get; set; }
        public int variablePayDuration { get; set; }
        public decimal variablePayPercent{ get; set; }
        public decimal SAR { get; set; }
        public int MIP { get; set; }
        public string CDO_Approver { get; set; }

    }

    public class OfferResendModel
    {
       
        public int cid { get; set; }
        public string TAGLead_Approver { get; set; }
        public string DH_Approver { get; set; }
        public string SVP_Approver { get; set; }
        public string COO_Approver { get; set; }
        public string remarks { get; set; }
        public string TAGHead_Approver { get; set; }
        public string FunctionHead { get; set; }
        public string CDO_Approver { get; set; }

    }


    public class BGVAttachment
    {
        public string FileName { get; set; }
        //  public string Path { get; set; }
    }
    public class Address
    {
        public string addressLine1 { get; set; }    
        public string addressLine2 { get; set; }
        public string addressLine3 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postalCode { get; set; }
        public string country { get; set; }
    }

    public class PdfModel
    {
        public PdfModel()
        {
            currentAddress = new Address();
            permanentAddress = new Address();
            BGVAttachments = new List<BGVAttachment>();
        }
        public int cid { get; set; }
        public char sendOfferAddressType { get; set; }
        public int SudexoCoupen { get; set; }
        public int Nps { get; set; }
        public Address currentAddress { get; set; }
        public Address permanentAddress { get; set; }
        public List<BGVAttachment> BGVAttachments { get; set; }
        public string dateOfJoining { get; set; }
        public int isShippingAddrConfirm { get; set; }
        public Decimal FinalCTC { get; set; }
        public Decimal FinalJoiningBonus { get; set; }
        public Decimal FinalNoticeBuyout { get; set; }
        public Decimal FinalTravelExp { get; set; }
        public Decimal FinalRelocationExp { get; set; }
        public Decimal FinalRetentionBonus { get; set; }
        public Decimal CTC { get; set; }
        public int JoiningLocationID { get; set; }
        public string offerNumber { get; set; }
        public int OfferSeqNumber { get; set; }
        public char IsOfferGenExternal { get; set; }
        public char IsSaveOnMarcury { get; set; }

    }

    public class PdfModelG5Above
    {
        public PdfModelG5Above()
        {
            currentAddress = new Address();
            permanentAddress = new Address();
            BGVAttachments = new List<BGVAttachment>();
        }
        public int cid { get; set; }
        public char sendOfferAddressType { get; set; }
        public int SudexoCoupen { get; set; }
        public int Nps { get; set; }
        public Address currentAddress { get; set; }
        public Address permanentAddress { get; set; }
        public List<BGVAttachment> BGVAttachments { get; set; }
        public string dateOfJoining { get; set; }
        public int isShippingAddrConfirm { get; set; }
        public Decimal FinalCTC { get; set; }
        public Decimal FinalJoiningBonus { get; set; }
        public Decimal FinalNoticeBuyout { get; set; }
        public Decimal FinalTravelExp { get; set; }
        public Decimal FinalRelocationExp { get; set; }
        public Decimal FinalRetentionBonus { get; set; }
        public Decimal CTC { get; set; }
        public int JoiningLocationID { get; set; }
        public string offerNumber { get; set; }
        public int OfferSeqNumber { get; set; }
        public char IsOfferGenExternal { get; set; }
        public char IsSaveOnMarcury { get; set; }

    }


    public class dgmCalcModel
    {
        public int cid { get; set; }
        public int gradeId { get; set; }
        public int JoiningLocationId { get; set; }
        public int cadidateTypeId { get; set; }
        public decimal billingRate { get; set; }
        public decimal annualCTC { get; set; }
        public decimal billingCurrencyId { get; set; }
        public decimal joiningBonus { get; set; }
        public int localCurrencyId { get; set; }
        public decimal NonReimbursableTravelCost { get; set; }
        public decimal projectSpecificCost { get; set; }
        public decimal projectBuffer { get; set; }
        public int billableHoursDay { get; set; }
        public int CubeClusterID { get; set; }
      //  public char JfCategory { get; set; }
        public string GradeBand { get; set; }
        public int divisionID { get; set; }
       // public int PracticeId { get; set; }
    }

    public class dgmCalcModelUS
    {
        public int EmployeeTypeID { get; set; }
        public int SalaryType { get; set; }
        public decimal annualCTC { get; set; }
        public decimal PerformanceBonus { get; set; }
        public decimal joiningBonus { get; set; }
        public decimal RelocationBonus { get; set; }
        public decimal VisaCost { get; set; }
        public decimal ClientBillingRate { get; set; }
    }

    public class dgmCalcModelNNT
    {
        public int cid { get; set; }
        public long MonthtlyCTC { get; set; }
        public long Loading { get; set; }
        public int ConversionRate { get; set; }
        public long ConvertedValue { get; set; }
        public long BillingApproved { get; set; }
        public decimal DGM { get; set; }

    }

    public class OfferSendModel
    {
        public string link { get; set; }
        public int cid { get; set; }
    }
    public class CandidateConnect
    {

        public CandidateConnect()
        {
            RescheduleDate = null;
            ConnectDate = null;
            RescheduleReason = 0;
        }

        public int Cid { get; set; }
        public int CandidateStatus { get; set; }
        public string RescheduleDate { get; set; }
        public int RescheduleReason { get; set; }
        public string ConnectDate { get; set; }
        public string ConnectPerson { get; set; }
        public string StatusCondi { get; set; }
    }

    public class SelectedCandidateTransfer
    {
        public int cid { get; set; }
        public string thid { get; set; }
        public string remarks { get; set; }

    }

    public class updateConfirmAddress
    {
        public updateConfirmAddress()
        {
            currentAddress = new Address();
        }
        public int cid { get; set; }
        public Address currentAddress { get; set; }
        public int isShippingAddrConfirm { get; set; }
    }

    public class OfferApprovalDoc
    {
        public OfferApprovalDoc()
        {
            ApprovalAttachments = new List<ApprovalAttachment>();
        }
        public int Cid { get; set; }
        public string ActionTakenBy { get; set; }
        public List<ApprovalAttachment> ApprovalAttachments { get; set; }
        public int ActionId { get; set; }

    }
    public class ApprovalAttachment
    {
        public string FileName { get; set; }
        //  public string Path { get; set; }
    }


    public class CandidateOfferFilter
    {
        public CandidateOfferFilter()
        {

            search = "";
            location = null;
            offerStatus = null;
            startDate = null;
            endDate = null;
            startDate2 = null;
            endDate2 = null;
            DUIDs = null;
            accountId = null;
            recruiterId = null;
            requisitionType = null;
            contractType = null;
            source = null;
            dropReasonId = null;
            PracticeId  = null;


        }
        public int page { get; set; }
        public int pageSize { get; set; }
        public string search { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string startDate2 { get; set; }
        public string endDate2 { get; set; }
        public string offerStatus { get; set; }
        public string location { get; set; }
        public string DUIDs { get; set; }
        public string accountId { get; set; }
        public string recruiterId { get; set; }
        public string requisitionType { get; set; }
        public string contractType { get; set; }
        public string source { get; set; }
        public string dropReasonId { get; set; }
        public string PracticeId { get; set; }




    }

    public class THIDTransferWithTC
    {
        public int cid { get; set; }
        public string thid { get; set; }
        public int CubeId { get; set; }
        public int ClusterID { get; set; }
        public int RoleID { get; set; }
        public int GradeId { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MedSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public decimal VarianceMax { get; set; }
        public decimal VarianceMid { get; set; }
        public int IsReinitiationRequired { get; set; }
        public String remarks { get; set; }

        public decimal billingRateHrInUSD { get; set; }
        public decimal annualBillableHours { get; set; }
        public decimal annualRevenueUsd { get; set; }
        public decimal annualSalaryCostUsd { get; set; }
        public decimal joiningBonusUsd { get; set; }
        public decimal benefitsUsd { get; set; }
        public decimal ProjectBufferUsd { get; set; }
        public decimal dgmCostUsd { get; set; }
        public decimal dgmPercentUsd { get; set; }
        public int NonReimbursableTravelCost { get; set; }
        public int projectSpecificCost { get; set; }
        public decimal billingRateHrCurrency { get; set; }
        public int billingCurrencyId { get; set; }
        public int billableHoursDay { get; set; }






    }

    public class offeracceptsignatureSaveInd
    {
        public string param { get; set; }
        public byte[] offersignFileBase64 { get; set; }

        public string offersignFileName { get; set; }
        public string offersignFilePath { get; set; }
        public string JoiningDate { get; set; }
        public string AuthKey { get; set; }

    }
    public class SaveUpdateOfferTemplatesModel
    {
        public int cid { get; set; }

        public string offerTemplate { get; set; }

    }




}