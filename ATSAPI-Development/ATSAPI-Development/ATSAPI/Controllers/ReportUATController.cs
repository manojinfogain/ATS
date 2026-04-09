using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http;
using TimeZoneConverter;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/UAT")]

    public class ReportUATController : ApiController
    {
        ReportUATRepository objRepo = new ReportUATRepository();

        [Route("getTime")]
        [HttpGet]
        public IHttpActionResult getTime(string sas)
        {
            string ss = TZConvert.IanaToWindows(sas);
            return Ok(ss);
        }

        [Route("GetCandidateOfferReport_UAT")]
        [HttpPost]
        public IHttpActionResult GetCandidateOfferReport_UAT([FromBody] CandidateOfferFilter obj)
        {
            try
            {

                return Ok(objRepo.GetCandidateOfferReport_UAT(obj));

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetCandidateOfferReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ExportToExcelCandidateOfferReportint_UAT")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelCandidateOfferReportint_UAT(CandidateOfferFilter obj)
        {

            try
            {
                obj.page = 1;
                obj.pageSize = 100000;
                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Onsite/Offshore</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Contact Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Education</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Position Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Drop Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Drop Remark</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>DU</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date of Requisition</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Marked for External Hiring(TAG) date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Initial Mark to Hiring(TAG) date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Planned Onboarding date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Final Selection Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Final Approval Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date Of Offer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Revised Offer Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date Of Decline</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Decline Category</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Reason for Decline</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Job Family</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Comp Band</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Variance from Max (%)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Variance from Median (%)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current CTC</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Expected CTC</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>CTC Offered</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining Bonus</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Retention Bonus</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Relocation Expense</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Travel Expense</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Notice Period</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Transfer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Re-hire</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Created By</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Remark</font></b></td>");
                str.Append("</tr>");
                DataSet ds = objRepo.GetCandidateOfferReport_UAT(obj);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OnShoreOffShore"].ToString() + "</font></td>");
                        if (dr["ProfileId"].ToString() == "")
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");

                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + "</font></td>");
                        }
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmailId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContactNumber"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Education"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExpInYear"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqirementType"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningLocation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidatestatus"].ToString() + "</font></td>");

                        if (dr["statusid"].Equals(240) || dr["statusid"].Equals(260))
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dropReason"].ToString() + "</font></td>");

                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");
                        }
                        if (dr["statusid"].Equals(240) || dr["statusid"].Equals(260))
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dropRemarks"].ToString() + "</font></td>");

                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");
                        }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmploymentType"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkills"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkills"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Designation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProjectName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeliveryUnit"].ToString() + "</font></td>");
                        if (dr["DateOfRequisition"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfRequisition"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ExternalMarkedTAGDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ExternalMarkedTAGDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["InitialMarktoHiring"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["InitialMarktoHiring"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["plannedonboardingdate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["plannedonboardingdate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["FinalSelectionDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["FinalSelectionDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["FinalApprovalDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["FinalApprovalDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["DateOfOffer"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfOffer"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["RevisedOfferDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["RevisedOfferDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["DateOfJoining"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfJoining"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["DateOfDecline"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfDecline"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeclineCategory"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReasonforDecline"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JobFamilyName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MaxVariance"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MidVariance"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferNumber"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentEmployer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateCurrentLocation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentCTC"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedCTC"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CTCOffered"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningBonus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RetentionBonus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RelocationExpense"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TravelExpense"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NoticePeriod"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterTHID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["IsTransfer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Rehire"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferCreatedBy"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remark"].ToString() + "</font></td>");


                        str.Append("</tr>");
                    }
                    str.Append("</table>");
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                    byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = "Candidate_Offer_Report.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    return response;
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "ExportToExcelCandidateOfferReportint_UAT");
            }

            return null;
        }

        [Route("GetOpenPositionReports_UAT")]
        [HttpPost]
        public IHttpActionResult GetOpenPositionReports_UAT([FromBody] OpenPositionFilter obj)
        {
            try
            {
                return Ok(objRepo.GetOpenPositionReports_UAT(obj));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetOpenPositionReports");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSalaryDeviationReport_UAT")]
        [HttpPost]
        public IHttpActionResult GetSalaryDeviationReport_UAT([FromBody] SalaryDevFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetSalaryDeviationReport_UAT(obj, claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetSalaryDeviationReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ExportToExcelInterviewProcesssReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelInterviewProcesssReport(InterviewProcessFilter obj)
        {
            try
            {
                obj.page = 1;
                obj.pageSize = 100000;
                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>TalentId</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Mobile Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date of birth</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Category</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Experience</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>BU</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Expected Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Mark To External Hiring (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>JD Clarification (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Panel Available (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offshore / Onshore</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Transfer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Job Family</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Comp Band</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Cube (Candidate)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cluster</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Cube (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Min)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Median P-50)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/ No(From Median P - 50)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception % from Median P-50</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Max P-75)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/No (From Max P-75)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception % from (Max P-75)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grid Bucketing</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sourcing (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round Status </font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Interview By</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>External Agency</font></b></td>");


                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Panel Name</font></b></td>");

                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Panel Name</font></b></td>");

                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>Management Round Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Management Round Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Management Round Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Management Round Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round Panel Name</font></b></td>");

                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion Status</font></b></td>");

                //str.Append("<td><b><font face='Calibri' size='3'>HR Round Rescheduled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>HR Round Reschedule Reason</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>HR Round Cancelled Count</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>HR Round Cancel Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Approval sent (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Received TAG (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Rejection TAG (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date  DP/PDL/SDP</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Rejection Date DP/PDL/SDP</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date GDL</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Rejection Date GDL</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date COO</ font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Approval Rejection Date COO</ font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer generation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter's RM</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>DOJ</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Acceptance Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Practice Community</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Last Interview (Date) </font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Reason for drop</font></b></td>");

                str.Append("</tr>");
                DataSet ds = objRepo.GetInterviewProcesssReport_UAT(obj);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");

                        if (dr["ProfileId"].ToString() == "" || dr["ProfileId"].ToString() == null)
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");

                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + "</font></td>");
                        }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Email"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Mobile"].ToString() + "</font></td>");

                        if (dr["DateofBirth"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateofBirth"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentEmployer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Category"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateCurrentLocation"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExperince"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkill"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkill"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkillTHID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkillTHID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DU"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BUName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Designation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProjectName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentSalary"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedSalary"].ToString() + "</font></td>");


                        if (dr["MarkToExternalHiringDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["MarkToExternalHiringDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["JDClarificationDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["JDClarificationDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["PanelAvailableDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["PanelAvailableDate"]).ToString("dd MMM yyyy") + "</font></td>"); }


                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OffshoreOnshore"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmploymentType"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ISTransfer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JobFamily"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeCandidate"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ClusterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCube"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MinGridLimit"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50GridLimit"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50MediumSalaryException"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50ExceptionPer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75GridLimit"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75UpperSalaryException"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75ExceptionPer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptionalBucketing"].ToString() + "</font></td>");

                        if (dr["SourcingDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["SourcingDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ScreeningDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ScreeningDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreeningRoundStatus"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreeningRoundPanelName"].ToString() + "</font></td>");

                        if (dr["TechanicalRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewBy"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExternalAgency"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1PanelName"].ToString() + "</font></td>");


                        if (dr["TechanicalRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2PanelName"].ToString() + "</font></td>");



                        if (dr["TechanicalRound3Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound3Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3PanelName"].ToString() + "</font></td>");

                        if (dr["TechanicalRound4Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound4Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4PanelName"].ToString() + "</font></td>");




                        if (dr["CustomerRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1PanelName"].ToString() + "</font></td>");


                        if (dr["CustomerRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2RescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2RescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2CancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2CancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2PanelName"].ToString() + "</font></td>");


                        if (dr["ManagialRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagialRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundStatus"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagerialRoundRescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagerialRoundRescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagerialRoundCancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagerialRoundCancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundPanelName"].ToString() + "</font></td>");


                        if (dr["ManagementRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagementRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundStatus"].ToString() + "</font></td>");


                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundRescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundRescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundCancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundCancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundPanelName"].ToString() + "</font></td>");

                        if (dr["HRRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["HRRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundStatus"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundRescheduleCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundRescheduleReason"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundCancelCount"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundCancelReason"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundPanelName"].ToString() + "</font></td>");


                        if (dr["OfferApprovalSentDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferApprovalSentDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalReceivedTAGDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedTAGDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalRejectionByTAG"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalRejectionByTAG"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalReceivedDHDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedDHDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalRejectionByDH"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalRejectionByDH"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalReceivedSVPDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedSVPDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalRejectionBySVP"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalRejectionBySVP"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalReceivedCOODate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedCOODate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalRejectionByCOO"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalRejectionByCOO"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["OfferGenerationDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferGenerationDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");


                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RectruiterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RectruiterRMName"].ToString() + "</font></td>");

                        if (dr["DateOfJoining"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfJoining"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");

                        if (dr["OfferAcceptanceDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferAcceptanceDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeCommunity"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubPracticeName"].ToString() + "</font></td>");

                        if (dr["LastInterviewDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["LastInterviewDate"]).ToString("dd MMM yyyy") + "</font></td>"); }


                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandiadteStatus"].ToString() + "</font></td>");

                        if (Convert.ToInt32(dr["status"].ToString()) == 240 || Convert.ToInt32(dr["status"].ToString()) == 260)
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ResonforDrop"].ToString() + "</font></td>");
                        }
                        str.Append("</tr>");
                    }
                    str.Append("</table>");
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                    byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = "Interview_Process_Report.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    return response;
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "ExportToExcelInterviewProcesssReport");
            }

            return null;
        }


        [Route("ExportToExcelSalaryDeviationReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelSalaryDeviationReport(SalaryDevFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer No</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contact Number</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Position Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Transfer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date of Requisition</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Initial Mark to Hiring(TAG) date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>External Marked TAG Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Initial Planned Onboarding date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Planned Onboarding date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>L1 Interview Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Final Selection Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Final Approval Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date Of Offer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Revised Date Of Offer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date Of Joining</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date Of Decline</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Decline Category</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reason for Decline</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Req To Offer Days</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Req To Offer Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>External Mkd To Offer Days</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>External Mkd To Offer Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>L1 Interview Date To Offer Days</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>L1 Interview Date To Offer Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer To Joining Days</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer To Joining Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Req To Joining</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Req To Joining Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>External Mkd To Joining Days</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>External Mkd To Joining Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>THID Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>THID Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exp Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>BU</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>OffShore / Onsite</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Education</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Expected CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>CTC Approved</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>CTC Offered</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>% Of Hike Offered (on curr. CTC)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Job Family</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Comp. Band</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Min)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Median P-50)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/No (From Median P-50)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception % from Median P-50</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/No (From Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception % from (Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Bonus</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Retention Bonus</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Relocation Expense </font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Travel Expense</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Notice Period</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Released By</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Source Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Billing Rate ($)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>DGM Percent ($)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Practice</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Practice Community</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Skill type</font></b></td>");


            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            DataSet ds = objRepo.GetSalaryDeviationReport_UAT(obj, claims[5].Value);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferNumber"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Status"].ToString() + "</font></td>");
                    if (dr["ProfileId"].ToString() == "")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + "</font></td>");
                    }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Emailid"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MobileNumber"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqirementType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmploymentType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["IsTransfer"].ToString() + "</font></td>");
                    if (dr["DateOfRequisition"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfRequisition"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["InitialMarktoHiring"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["InitialMarktoHiring"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["ExternalMarkedTAGDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ExternalMarkedTAGDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["Initialonboardingdate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["Initialonboardingdate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["plannedonboardingdate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["plannedonboardingdate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["L1InterviewDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["L1InterviewDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["FinalSelectionDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["FinalSelectionDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["FinalApprovalDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["FinalApprovalDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["DateOfOffer"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfOffer"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["RevisedOfferDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["RevisedOfferDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["DateOfJoining"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfJoining"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["DateOfDecline"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfDecline"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeclineCategory"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReasonforDecline"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqToOfferDays"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqToOfferAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExternalMarkedTAGToOfferDays"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExternalMkdToOfferAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["L1InterviewToOfferDays"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["L1InterviewToOfferAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferToJoiningDays"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferToJoiningAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqToJoining"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReqToJoiningAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExternalMkdToJoiningDays"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExternalMkdToJoiningAgening"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkills"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkillTH"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkillTH"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Experince"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExpBucketing"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BU"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeliveryUnit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProjectName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Designation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OnShoreOffShore"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Education"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentEmployer"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateCurrentLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CTCOffered"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FinalCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PerOfHikeOffered"].ToString() + (dr["PerOfHikeOffered"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JobFamilyName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MinGridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50GridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50MediumSalaryException"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50ExceptionPer"].ToString() + (dr["P50ExceptionPer"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75GridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75UpperSalaryException"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75ExceptionPer"].ToString() + (dr["P75ExceptionPer"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptionalBucketing"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningBonus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RetentionBonus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RelocationExpense"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TravelExpense"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NoticePeriod"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferReleased"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BillingRateInUSD"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DGMPercentUsd"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeCommunity"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SkillType"].ToString() + "</font></td>");

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "Salary_Deviation_Report.xlsx";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }
        public string CIDPrefix(int ProfileSource)
        {
            if (ProfileSource == 3)
            {
                return "C";
            }
            else if (ProfileSource == 4)
            {
                return "E";
            }
            else if (ProfileSource == 5)
            {
                return "P";
            }
            else
            {
                return "R";
            }
        }
    }
}
