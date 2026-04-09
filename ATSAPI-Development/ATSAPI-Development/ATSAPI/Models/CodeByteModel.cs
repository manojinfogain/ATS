using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class CodeByteModel
    {
        public string display_name { get; set; }
        public string test_id { get; set; }
        public bool closed { get; set; }
        public string created_date { get; set; }
        public overview_stats overviewstats { get; set; }
        public string public_url { get; set; }



    }

    public class overview_stats
    {
        public int total { get; set; }
        public bool assessed { get; set; }
        public int qualified { get; set; }
        public int challenge_count { get; set; }
        public int open_ended_count { get; set; }
        public int multiple_choice_count { get; set; }
        public int project_count { get; set; }
        public int candidates_cheated_count { get; set; }
        public string created_by_email { get; set; }
        public string qualifying_score { get; set; }
        public string email_template_id { get; set; }
        public string welcome_template_id { get; set; }


    }

    public class CodeByteInterviewSchedule
    {
        public CodeByteInterviewSchedule()
        {
            candidates = new List<string>();
        }
        public List<string> candidates { get; set; }

        public string assessment_url { get; set; }
        public bool skip_send { get; set; }

    }



    public class CodeByteInterviewScheduleResponse
    {
        public string status { get; set; }
        public Candidatedata data { get; set; }
        public string skip_send { get; set; }
    }


    public class Candidatedata
    {
        public List<candidatesDetails> candidates { get; set; }
        public string test_id { get; set; }

    }

    public class candidatesDetails
    {
        public string email { get; set; }

        public string url
        {
            get; set;

        }
    }

    public class coderByteAssessmentResponse
    {
        public string operation { get; set; }
        public string time_expired { get; set; }
        public string challenges_being_graded { get; set; }
        public string organization_id { get; set; }
        public string email { get; set; }
        public string report_url { get; set; }
        public string assessment_id { get; set; }
    }


    public class coderByteAssessmentReportData
    {
        public string status { get; set; }
        public Candidatedata data { get; set; }
    }


    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class AdminNotes
    {
        public string content { get; set; }
        public string admin { get; set; }
        public string date { get; set; }
    }

    public class ChallengeDetail
    {
        public string title { get; set; }
        public string date { get; set; }
        public string language { get; set; }
        public int score { get; set; }
        public int time_taken { get; set; }
        public Meta meta { get; set; }
    }

    public class CheatingDetails
    {
        public int tab_leaving { get; set; }
        public string plagiarism { get; set; }
        public string pasted_code { get; set; }
    }

    public class Data
    {
        public List<Report> reports { get; set; }
    }

    public class McDetail
    {
        public string id { get; set; }
        public string question { get; set; }
        public bool correct { get; set; }
    }

    public class Meta
    {
        public string difficulty { get; set; }
        public List<string> tags { get; set; }
    }

    public class Report
    {
        public string username { get; set; }
        public string email { get; set; }
        public string date_joined { get; set; }
        public string test_id { get; set; }
        public string display_name { get; set; }
        public string report_link { get; set; }
        public string status { get; set; }
        public int total_challenges { get; set; }
        public List<ChallengeDetail> challenge_details { get; set; }
        public List<McDetail> mc_details { get; set; }
        public List<object> oe_details { get; set; }
        public Scorecard scorecard { get; set; }
        public AdminNotes admin_notes { get; set; }
        public string vote_decision { get; set; }
        public int time_taken { get; set; }
        public string invited_by_admin { get; set; }
        public string internal_id { get; set; }
        public string cheating_flag { get; set; }
        public CheatingDetails cheating_details { get; set; }
        public int mc_score { get; set; }
        public bool qualified { get; set; }
        public int qualifying_score { get; set; }
        public int code_score { get; set; }
        public int final_score { get; set; }
    }

    public class Root1
    {
        public string status { get; set; }
        public Data data { get; set; }
    }

    public class Scorecard
    {
        public int codequality { get; set; }
        public int JavaScript { get; set; }
        public int HTML { get; set; }
    }








}