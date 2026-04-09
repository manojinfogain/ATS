using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CoderByteAssessments
    {
        public string status { get; set; }
        public AssessmentData data { get; set; }

    }
    public class Assessment
    {
        public string display_name { get; set; }
        public string test_id { get; set; }
        public bool closed { get; set; }
        public string created_date { get; set; }
        public OverviewStats overview_stats { get; set; }
        public string public_url { get; set; }
    }

    public class AssessmentData
    {
        public List<Assessment> assessments { get; set; }
    }

    public class OverviewStats
    {
        public int total { get; set; }
        public int assessed { get; set; }
        public int qualified { get; set; }
        public int challenge_count { get; set; }
        public int open_ended_count { get; set; }
        public int multiple_choice_count { get; set; }
        public int project_count { get; set; }
        public int candidates_cheated_count { get; set; }
        public string created_by_email { get; set; }
        public Ratings ratings { get; set; }
        public int qualifying_score { get; set; }
        public string email_template_id { get; set; }
        public string welcome_template_id { get; set; }
    }

    public class Ratings
    {
        public int up { get; set; }
        public int down { get; set; }
    }

    public class AssessmentModel
    {   
        public string test_id { get; set; }
        public string display_name { get; set; }
        public string public_url { get; set; }
        public bool closed { get; set; }
        public string created_date { get; set; }
        public string created_by_email { get; set; }
        public int qualifying_score { get; set; }
        public string addedon { get; set; }


    }

}