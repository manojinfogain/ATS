using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class UserMaster
    {
        public UserMaster()
        {
            otherRoles = new OtherRoles();
        }
        public string DomainId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string EmpOldID { get; set; }
        public string EmpNewId { get; set; }
        public string MailID { get; set; }
        public int LocationID { get; set; }
        public string LocationName { get; set; }
        public int RoleId { get; set; }
        public string Role { get; set; }
        public char UserType { get; set; }
        public char IsPasswordChanged { get; set; }
        public OtherRoles otherRoles { get; set; }
        public string Photo { get; set; }
        public int DeptID { get; set; }
        public int TalentDateLapseCount { get; set; }
        public char isLoginTalentDate { get; set; }
        public int partnerId { get; set; }
        
    }

    public class OtherRoles
    {
        public char IsDH { get; set; }
        public char IsAO { get; set; }
        public char IsApprover { get; set; }
        public char IsBUHead { get; set; }
        public char IsPM { get; set; }
        public char IsHiringManager { get; set; }
        public char IsDelegationAdmin { get; set; }
        public char IsInterviewer { get; set; }
        public char IsTagLeadApprover { get; set; }
        public char IsWMG { get; set; }
        public char IsTAG { get; set; }
        public char IsGDL { get; set; }
        public char IsFinance { get; set; }
        public char IsIJP { get; set; }
        public char IsRenuTeam { get; set; }
        public char IsRenuTeamAdmin { get; set; }
        public char IsTalentAutoApproval { get; set; }
        public char IsRM { get; set; }
         
        public char IsUSHrRole { get; set; }
        public char IsJDEditableRight { get; set; }
        public char IsIssAssestDelivery { get; set; }
        public char IsIssEmailUpdate { get; set; }
        public char IsProfileApprover { get; set; }
        public char IsPartnerApprover { get; set; }
        public char IsReportSalaryMask { get; set; }
        public char IsPanelAccess { get; set; }

        public char IsAdminProfileTransfer { get; set; }
        public char IsBuddyAssign { get; set; }
        public char IsHRBP { get; set; }
        public char IsVideoComparisonReport { get; set; }

    }
    public class projFilter
    {
        public string AccountID { get; set; }
        public string searchText { get; set; }
    }

    public class Employee
    {
        public string UserId { get; set; }
        public string Domain { get; set; }
        public string EMP_TYPE { get; set; }
        public string ProfileImageName { get; set; }

    }

    public class AssessmentCompleted
    {
        public string operation { get; set; }
        public bool time_expired { get; set; }
        public bool challenges_being_graded { get; set; }
        public string organization_id { get; set; }
        public string email { get; set; }
        public string report_url { get; set; }
        public string assessment_id { get; set; }
    }


}