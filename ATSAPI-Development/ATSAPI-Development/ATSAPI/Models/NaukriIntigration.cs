using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class NaukriIntigration
    {
        public class CreateJobModel
        {

            public int thid { get; set; }
            public string jobType { get; set; }
            public string Title { get; set; }
            public string description { get; set; }
            public int minSalary { get; set; }
            public int maxSalary { get; set; }
            public int salaryCurrency { get; set; }
            public int industry { get; set; }
            public int workModeId { get; set; }
            public int employmentTypeId { get; set; }
            public int orgId { get; set; }
            public int minWorkExperience { get; set; }
            public int maxWorkExperience { get; set; }
            public string CauseTypeId { get; set; }
            public string QaulificationId { get; set; }
            public string distributeTo { get; set; }
            public char showSalary { get; set; }
            public List<questions> questions { get; set; }
            public string JobId { get; set; }
            public string PostingLocationId { get; set; }

        }

        public class questions
        {
            public string questionText { get; set; }
        }



        public class JobPostRequest
        {
            public string title { get; set; }
            public string jobType { get; set; }
            public string description { get; set; }
            public int minSalary { get; set; }
            public int maxSalary { get; set; }
            public string salaryCurrency { get; set; }
            public string industry { get; set; }
            public string workMode { get; set; }
            public string employmentType { get; set; }
            public string orgName { get; set; }
            public string website { get; set; }
            public int minWorkExperience { get; set; }
            public int maxWorkExperience { get; set; }
            public string[] keySkills { get; set; }
            public List<PostingLocation> locations { get; set; }
            public List<EducationQualification> educationQualifications { get; set; }
            public string[] distributeTo { get; set; }
            public bool showSalary { get; set; }
            public List<Question> questions { get; set; }
            public string referenceCode { get; set; }
            public string jobId { get; set; }

        }

        public class PostingLocation
        {
            public string city { get; set; }
            public string country { get; set; }
        }

        public class EducationQualification
        {
            public string courseType { get; set; }
            public string qualification { get; set; }
        }

        public class Question
        {
            public int questionId { get; set; }
            public string questionText { get; set; }
            public string answerType { get; set; }
            public bool mandatory { get; set; }
           // public List<string> answerOptions { get; set; }

        }

        public class JobDetailsResponse
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string JobType { get; set; }
            public string Description { get; set; }
            public int MinSalary { get; set; }
            public int MaxSalary { get; set; }
            public string SalaryCurrency { get; set; }
            public string Industry { get; set; }
            public string WorkMode { get; set; }
            public string OrgName { get; set; }
            public int MinWorkExperience { get; set; }
            public int MaxWorkExperience { get; set; }
            public List<string> KeySkills { get; set; }
            public List<PostingLocation> Locations { get; set; }
            public List<string> DistributeTo { get; set; }
            public List<EducationQualification> EducationQualifications { get; set; }
            public bool ShowSalary { get; set; }
            public string Email { get; set; }
            public bool Strict { get; set; }
            public JobStatus JobStatus { get; set; }
            public List<Question> Questions { get; set; }
            public string ReferenceCode { get; set; }
            public string Source { get; set; }
            public DateTimeOffset CreatedDate { get; set; }
            public DateTimeOffset UpdatedDate { get; set; }
           
        }


        public class JobStatus
        {
            public NaukriStatus Naukri { get; set; }
        }

        public class NaukriStatus
        {
            public string Status { get; set; }
            public string JobId { get; set; }
            public string JobBoardId { get; set; }
            public string JobBoardJobId { get; set; }
            public string Url { get; set; }
            public string Message { get; set; }
            public DateTimeOffset? ExpiryDate { get; set; }
            public DateTimeOffset ProcessedDate { get; set; }
            public DateTimeOffset PostedDate { get; set; }
            public int RefreshedCount { get; set; }
            public DateTimeOffset RefreshedDate { get; set; }
        }
      

    }
}