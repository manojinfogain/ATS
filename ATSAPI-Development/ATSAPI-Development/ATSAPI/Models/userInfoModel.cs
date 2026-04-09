using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class candidateDetailsInfo
    {
        public candidateDetailsInfo()
        {
            primarySkill = new valueByGroup();
            currency = new valueByGroup();
            country = new valueByGroup();
            state = new valueByGroup();
            city = new valueByGroup();
            Identity = new valueByGroup();
            candidateType = new valueByGroup();
            salaryDetails = new salaryDetails();
            totalExperience = new experience();
            releventExperience = new experience();
            resume = new resume();
            primaryRec = new valueByGroup();
            secondaryRec = new valueByGroup();
            HiringLocation = new valueByGroup();
            eduQualification = new valueByGroup();
            CurrentOrg = new valueByGroup();
            Gender = new valueByGroup();
            Division = new valueByGroup();
            JobFamilyI = new valueByGroup();
            Grade = new valueByGroup();
            Practice = new valueByGroup();
            EmpUnit = new valueByGroup();
        }
        public int cid { get; set; }
        public string Name { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string middleName { get; set; }
        public string Email { get; set; }
        public string phone { get; set; }
        public int CubeID { get; set; }
        public int CubeClusterID { get; set; }
        public string CubeName { get; set; }
        public string CubeRoleName { get; set; }
        public string CubeClusterName { get; set; }
        public int CubeRoleID { get; set; }
        public valueByGroup eduQualification { get; set; }
        public valueByGroup CurrentOrg { get; set; }
        public valueByGroup primarySkill { get; set; }
        public string joiningDate { get; set; }
        public valueByGroup Identity { get; set; }
        public string IdentityNo { get; set; }
        public valueByGroup currency { get; set; }
        public valueByGroup country { get; set; }
        public valueByGroup state { get; set; }
        public valueByGroup city { get; set; }
        public valueByGroup primaryRec { get; set; }
        public valueByGroup secondaryRec { get; set; }
        public valueByGroup HiringLocation { get; set; }
        public valueByGroup candidateType { get; set; }
        public salaryDetails salaryDetails { get; set; }
        public experience totalExperience { get; set; }
        public experience releventExperience { get; set; }
        public valueByGroup Gender { get; set; }
        public valueByGroup Division { get; set; }
        public valueByGroup JobFamilyI { get; set; }
        public valueByGroup Grade { get; set; }
        public resume resume { get; set; }
        public string dob { get; set; }
        public string GradeBand { get; set; }
        public string jobfamilycategory  { get; set; }
        public valueByGroup Practice { get; set; }
        public valueByGroup EmpUnit { get; set; }
        public int countryCode { get; set; }



    }

    public class valueByGroup
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class salaryDetails
    {
        public string current { get; set; }
        public string expected { get; set; }
        public int SalaryType { get; set; }
    }
    public class experience
    {
        public string month { get; set; }
        public string year { get; set; }
    }
    public class resume
    {
        public string name { get; set; }
        public string path { get; set; }
    }

}