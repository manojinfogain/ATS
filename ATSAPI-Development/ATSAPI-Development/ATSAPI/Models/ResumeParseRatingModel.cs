using DocumentFormat.OpenXml.Drawing;
using Microsoft.Exchange.WebServices.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class ResumeParseRatingModel
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public int FileSize { get; set; }
        public byte[] file { get; set; }
    }



    public class ResumeRatingModel
    {

        public string FileName { get; set; }
        public string FilePath { get; set; }
        public int FileSize { get; set; }
        public byte[] file { get; set; }
        public string thid { get; set; }


    }

    public class ResumeRatingApiResponse
    {
        public string status { get; set; }
        public string message { get; set; }
        public CandidateData candidatedata { get; set; }
        public string recommendation { get; set; }
    }
    public class Skillset
    {
        public string coreskillset { get; set; }
        public string additionalskillset { get; set; }
    }

    public class OrganizationalFitness
    {
        public decimal Leadership { get; set; }
        public decimal RoleFitment { get; set; }
        public decimal TeamCollaboration { get; set; }
        public decimal TechnicalProficiency { get; set; }
        public decimal ClientInterface { get; set; }
        public decimal Communication { get; set; }
        public decimal Confidence { get; set; }
    }

    public class organizationalfitnessstatus
    {
        public string Leadership { get; set; }
        public string RoleFitment { get; set; }
        public string TeamCollaboration { get; set; }
        public string TechnicalProficiency { get; set; }
        public string ClientInterface { get; set; }
        public string Communication { get; set; }
        public string Confidence { get; set; }
    }

    public class RatingsT
    {
        public decimal coreskills { get; set; }
        public decimal additionalskills { get; set; }
        public OrganizationalFitness organizationalfitness { get; set; }
        public organizationalfitnessstatus organizationalfitnessstatus { get; set; }
    }

    public class CandidateData
    {
        public string filename { get; set; }
        public string matchedskillset { get; set; }
        // public Skillset skillset { get; set; }
        public RatingsT ratings { get; set; }
        public decimal overallrating { get; set; }
    }

    public class ApiResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public CandidateData CandidateData { get; set; }
        public string Recommendation { get; set; }
    }

    public class AddUpdateAIResumeRating
    {

        public decimal OverallRating { get; set; }
        public decimal mandatoryRating { get; set; }
        public decimal goodToHaveRating { get; set; }
        public decimal OverallPercentage { get; set; }
        public string Recommendation { get; set; }
        public int cid { get; set; }
        public int ApiRespnseStatus { get; set; }
        public string ApiRespnseStatusMessage { get; set; }
        public List<Rating> Ratings { get; set; }
        public int ProfileId { get; set; }
        public int IsProfileInterview { get; set; }
        public char ProfileType { get; set; }
    }

    public class RatingDetail
    {
        public string name { get; set; }
        public decimal rating { get; set; }
    }



    public class RootResponseResumeModel
    {
        public string status { get; set; }
        public string message { get; set; }
        public List<Resume> Resumes { get; set; }
        public string Recommendation { get; set; }
    }

    public class Resume
    {
        public string name { get; set; }
        public List<Rating> Ratings { get; set; }
        public decimal overallRating { get; set; }
        public decimal mandatoryRating { get; set; }
        public decimal goodToHaveRating { get; set; }
        public decimal overallPercentage { get; set; }


    }

    public class Rating
    {
        public string name { get; set; }
        public decimal rating { get; set; }
        public int id  { get; set; }
        public string type { get; set; }
        public string skillLabel { get; set; }
        public string skillProficiencyLevel { get; set; }
    }









}