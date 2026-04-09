using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class PartnerModel
    {
        public int PartnerID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public int CountryID { get; set; }
        public int CityID { get; set; }
        public int ContractTypeID { get; set; }
        public char ContractAvailability { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        //public string MSAEffectiveDate { get; set; }
        //public string NDAEffectiveDate { get; set; }
        public string Remarks { get; set; }
        public string AddedBy { get; set; }
        public string TagHeadApprover { get; set; }
        public string Action { get; set; }
        public int HiringlocationId { get; set; }
        public string addressLine1 { get;set; }
        public string addressLine2 { get;set;}
        public string city { get;set; }
        public string state { get;set; }
        public int postalCode { get;set; }
        public List<ContractDetail> ContractDetails { get; set; }
    }

    public class Attachment
    {
        public string FileName { get; set; }
    }

    public class PartnerUser
    {
        public int PartnerID { get; set; }
        public string Email { get; set; }
        public string Remarks { get; set; }
        public string AddedBy { get; set; }
        public string Name { get; set;}
        public string ContactNo { get; set; }
    }

    public class AssignTalentIdPartner
    {
        public int AssignID { get; set; }
        public string PartnerIDs { get; set; }
        public int reasonid { get; set; }
        public string thid { get; set; }
        public string Remarks { get; set; }
        public string TAGLeadID { get; set; }
        public string candidateType { get; set; }
        public int SalaryType { get; set; }
        public decimal basePay { get; set; }
        public int workingRemoteStatus { get; set; }

    }

    public class parnerCandidateProfile
    {
        public int id { get; set; }
        public int ProfileId { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public string totalExp { get; set; }
        public string totalExpMonth { get; set; }
        public string releventExp { get; set; }
        public string relExpMonth { get; set; }
        public int StatusId { get; set; }
        public int CountryCode { get; set; }
        public string AddedBy { get; set; }
        public string thid { get; set; }
        public string Resume { get; set; }
        public string Path { get; set; }
        public string referralId { get; set; }
        public string Remarks { get; set; }
        public string expSalary { get; set; }
        public string curSalary { get; set; }
        public string currentOrg { get; set; }
        public string eduQualification { get; set; }
        public int currencyTypeId { get; set; }
        public int noticePeriod { get; set; }
        public int contractType { get; set; }
        public int PartnerID { get; set; }
        public int countyId { get; set; }
        public int cityId { get; set; }
        public int Gender { get; set; }
        public string dob { get; set; }
        public int SalaryType { get; set; }
        public int StateId { get; set; }
        public int HiringLocationId { get; set; }
        public int relocation { get; set; }
        public int workVisaStatus { get; set; }
        public string visaExpireDate { get; set; }
        public string link { get; set; }

    }

    public class PartnerProfileFilter
    {

        public PartnerProfileFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            PartnerID = null;
            primarySkill = null;
            contractType = null;
            accountId = null;
            practiceId = null;


        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string search { get; set; }
        public string PartnerID { get; set; }
        public string contractType { get; set; }
        public string primarySkill { get; set; }
        public string accountId { get; set; }
        public string practiceId { get; set; }
        public int hiringLocationId { get; set; }
        public string recruiterId { get; set; }

    }

    public class PartnerDetailFilter
    {
        public PartnerDetailFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            ContractTypeID = null;
            statusId = "";
            pendingWithMe = 0;

        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string search { get; set; }
        public int PartnerID { get; set; }
        public string ContractTypeID { get; set; }
        public string statusId { get; set; }
        public int pendingWithMe { get; set; }
        public int hiringLocationId { get; set; }
    }

    public class PartnerTalentFilter
    {
        public PartnerTalentFilter()
        {
            thid = null;
            startDate = null;
            endDate = null;
            partnerId = null;
            accountId = null;
            practiceId = null;
            sortColumn = null;
            sortDir = null;
            search = "";
            pendingWithMe = null;
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string thid { get; set; }
        public Nullable<int> statusID { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string search { get; set; }
        public string partnerId { get; set; }
        public string sortColumn { get; set; }
        public string sortDir { get; set; }
        public string accountId { get; set; }
        public string practiceId { get; set; }
        public string pendingWithMe { get; set; }

        public int hiringLocationId { get; set; }

    }

    //Adde by jivan
    public class PartnerMultiselectFilter
    {

        public PartnerMultiselectFilter()
        {
            search = "";

            PartnerID = null;
            
        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string PartnerID { get; set; }
       
        public string search { get; set; }
        public int hiringLocationId { get; set;}
        

    }

    public class ActivePartnerListFilter
    {
        public ActivePartnerListFilter()
        {
            statusId = "";
            ContractTypeID = "";


        }

        public string statusId { get; set; }
        public string ContractTypeID { get; set; }
        public int hiringLocationId { get; set; }
    }

    public class AssignToPartnerGetModel
    {
        public AssignToPartnerGetModel()
        {
            searchText = "";
            AccountId = "";


        }

        public string searchText { get; set; }
        public string AccountId { get; set; }
        public int hiringLocationId { get; set; }
    }

    public class TransferProfile
    {

        public int cid { get; set; }       
        public string thid { get; set; }        
        public string remarks { get; set; }       
        public string updateBy { get; set; }        
        public int Gender { get; set; }
        public int DivisionID { get; set; }
        public int gradeId { get; set; }
        public string gradeBand { get; set; }        
        public int EmpUnitId { get; set; }        
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }       
        public int EntityId { get; set; }
        public char Action { get; set; }

    }

    public class PartnerProfileSourceTransfer
    {
        public int cid { get; set; }
        public string thid { get; set; }
        public string updateBy { get; set; }
        public int DivisionID { get; set; }
        public int gradeId { get; set; }
        public string gradeBand { get; set; }
        public int EmpUnitId { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public int CubeRoleID { get; set; }
        public Char IsTHIDPresent { get; set; }
        public int ProfileSorceId { get; set; }
        public string remarks { get; set; }
    }

     public class ContractDetail
    {
        public int ID { get; set; }
        public int ContractTypeID { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public char ContractAvailability { get; set; }
    }

    public class UpdateContractDetailModel
    {
        public int ContId { get; set; }
        public int ContractTypeID { get; set; }
        public char ContractAvailability { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

    }

    public class AddnewContractDetailModel
    {
        public int Partnerid { get; set; }
        public int ContractTypeID { get; set; }
        public char ContractAvailability { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }       

    }

    public class SingleApprovRejectContractDetailModel
    {
        public int ContId { get; set; }
        public int ContractTypeID { get; set; }
        public char ContractAvailability { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Char Action { get; set; }
        public string Remarks { get; set; }

    }

    public class PartnerContratDetailFilter
    {
        public PartnerContratDetailFilter()
        {
            search = "";
            startDate = null;
            endDate = null;
            ContractTypeID = null;
            statusId = null;
            pendingWithMe = 0;
            PartnerID = null;

        }

        public int page { get; set; }
        public int pageSize { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string search { get; set; }
        public string ContractTypeID { get; set; }
        public string statusId { get; set; }
        public int pendingWithMe { get; set; }
        public int hiringLocationId { get; set; }
        public string PartnerID { get; set; }
    }
}