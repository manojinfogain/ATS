using Aspose.Pdf.Operators;
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Exchange.WebServices.Data;
//using ClosedXML.Excel;
//using OfficeOpenXml;
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
    [RoutePrefix("api/Report")]

    public class ReportController : ApiController
    {

        ReportRepository objRepo = new ReportRepository();
        Logger logger = new Logger();

        [Route("getTime")]
        [HttpGet]
        public IHttpActionResult getTime(string sas)
        {
            string ss = TZConvert.IanaToWindows(sas);
            return Ok(ss);
        }
        [Route("GetReferralCandidateReport")]
        [HttpGet]
        public IHttpActionResult GetReferralCandidateReport(int PageNo, int PageSize, string search = null, string Location = null)
        {
            try
            {
                logger.LogRequestAsync("GetReferralCandidateReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetReferralCandidateReport(PageNo, PageSize, search, Location, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetReferralCandidateReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetReferralCandidateReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReferralCandidateReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetReferralCandidateReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOpenPositionReports")]
        [HttpPost]
        public IHttpActionResult GetOpenPositionReports([FromBody] OpenPositionFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetOpenPositionReports", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOpenPositionReports(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOpenPositionReports", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetOpenPositionReports", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOpenPositionReports", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetOpenPositionReports");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOpenPositionCandidateDetails")]
        [HttpGet]
        public IHttpActionResult GetOpenPositionCandidateDetails(string Thid, string Flag, int Round, int page, int PageSize, string search = null)
        {
            try
            {
                logger.LogRequestAsync("GetOpenPositionCandidateDetails", Request);

                if (Thid == null)
                {
                    logger.LogResponseAsync("GetOpenPositionCandidateDetails", "400 Bad Request - Talent Id is Required");
                    return BadRequest("Talent Id is Required");
                }
                else if (Flag == null)
                {
                    logger.LogResponseAsync("GetOpenPositionCandidateDetails", "400 Bad Request - Flag is Required");
                    return BadRequest("Flag is Required");
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOpenPositionCandidateDetails(Thid, Flag, Round, page, PageSize, search, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOpenPositionCandidateDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetOpenPositionCandidateDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOpenPositionCandidateDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetOpenPositionCandidateDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRecruiterProductivityReport")]
        [HttpGet]
        public IHttpActionResult GetRecruiterProductivityReport(string Month, string Year)
        {
            try
            {
                logger.LogRequestAsync("GetRecruiterProductivityReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                if (Month == null)
                {
                    logger.LogResponseAsync("GetRecruiterProductivityReport", "400 Bad Request - Month is Required");
                    return BadRequest("Month is Required");
                }
                else if (Year == null)
                {
                    logger.LogResponseAsync("GetRecruiterProductivityReport", "400 Bad Request - Year is Required");
                    return BadRequest("Year is Required");
                }

                int result;
                var data = objRepo.GetRecruiterProductivityReport(Month, Year, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetRecruiterProductivityReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetRecruiterProductivityReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRecruiterProductivityReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetRecruiterProductivityReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSalaryDeviationReport")]
        [HttpPost]
        public IHttpActionResult GetSalaryDeviationReport([FromBody] SalaryDevFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetSalaryDeviationReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetSalaryDeviationReport(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetSalaryDeviationReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetSalaryDeviationReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSalaryDeviationReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetSalaryDeviationReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateOfferReport")]
        [HttpPost]
        public IHttpActionResult GetCandidateOfferReport([FromBody] CandidateOfferFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetCandidateOfferReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateOfferReport(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetCandidateOfferReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetCandidateOfferReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateOfferReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetCandidateOfferReport");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("ExportToExcelCandidateOfferReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelCandidateOfferReport(CandidateOfferFilter obj)
        {

            try
            {
                obj.page = 1;
                obj.pageSize = 100000;
                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offshore / Onsite</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Contact Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Drop Reason</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Drop Remark</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Position Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Transfer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date of Requisition</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Initial Mark to Hiring(TAG) date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>External Marked TAG Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Initial Planned Onboarding date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Planned Onboarding date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Final Selection Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Final Approval Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date Of Offer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Revised Date Of Offer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date Of Joining</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date Of Decline</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Decline Category</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Reason for Decline</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>THID Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>THID Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Education</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Category</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current CTC</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Expected CTC</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>CTC Approved</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>CTC Offered</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining Bonus</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Retention Bonus</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Relocation Expense</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Travel Expense</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Notice Period</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Job Family</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Cube </font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cluster</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Role</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>DGM Cost (USD)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>DGM Percent (USD)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Billing rate/ Hr (USD)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Comp. Band</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception % from Median P-50</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Exception % from (Max P-75)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Grid Bucketing</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Justification (Above Median)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Released By</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Re-hire</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Studio/Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Practice Community</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Skill Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Remark</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Contract Extension Remarks</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Updated Column Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Released For</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Is Talent Id Reopened</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Previous Talent Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Previous Talent Id Account</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Is Reopen Reason</font></b></td>");


                str.Append("</tr>");
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetCandidateOfferReport(obj, claims[5].Value, out result);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OnShoreOffShore"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferNumber"].ToString() + "</font></td>");

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
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContactNumber"].ToString() + "</font></td>");
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
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkills"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkills"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkillTH"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkillTH"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Designation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProjectName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeliveryUnit"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExpInYear"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningLocation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Education"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentEmployer"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Category"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateCurrentLocation"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentCTC"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedCTC"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CTCOffered"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FinalCTC"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JoiningBonus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RetentionBonus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RelocationExpense"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TravelExpense"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NoticePeriod"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JobFamilyName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentClusterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentRoleName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dgmCostUsd"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dgmPerUsd"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["billingRateHrInUSD"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MidVariance"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MaxVariance"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptionalBucketing"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JustificationBucket"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterTHID"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferCreatedBy"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Rehire"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Practice"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeCommunity"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubPractice"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SkillType"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remark"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractExtensionRemarks"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["UpdatedColumns"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferReleasedFor"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["IsTidReopened"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrevThid"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrevAccountName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentReopenReason"].ToString() + "</font></td>");



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
                ExceptionLogging.SendExcepToDB(ex, "Report", "ExportToExcelCandidateOfferReport");
            }

            return null;
        }


        [Route("GetInterviewProcesssReport")]
        [HttpPost]
        public IHttpActionResult GetInterviewProcesssReport([FromBody] InterviewProcessFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetInterviewProcesssReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetInterviewProcesssReportList(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetInterviewProcesssReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetInterviewProcesssReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetInterviewProcesssReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetInterviewProcesssReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetInterviewProcessReportDetailsByCid")]
        [HttpPost]
        public IHttpActionResult GetInterviewProcessReportDetailsByCid(int cid)
        {
            try
            {
                logger.LogRequestAsync("GetInterviewProcessReportDetailsByCid", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetInterviewProcessReportDetailsByCid(cid, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetInterviewProcessReportDetailsByCid", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetInterviewProcessReportDetailsByCid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetInterviewProcessReportDetailsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetInterviewProcessReportDetailsByCid");
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
                str.Append("<td><b><font face='Calibri' size='3'>MU</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Expected Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Salary Type</font></b></td>");
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
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Assessment Shared Date Technical 1</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Assessment Shared Date Technical 2</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Assessment Shared Date Technical 3</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Assessment Shared Date Technical 4</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion Status</font></b></td>");
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
                str.Append("<td><b><font face='Calibri' size='3'>Studio/Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Practice Community</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Practice</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Last Interview (Date) </font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Last Modified On</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Reason for drop</font></b></td>");
                str.Append("</tr>");
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetInterviewProcesssReport(obj, claims[5].Value, out result);
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
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SalaryType"].ToString() + "</font></td>");


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

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1PanelName"].ToString() + "</font></td>");
                        if (dr["AssessmentSharedDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["AssessmentSharedDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["TechanicalRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2PanelName"].ToString() + "</font></td>");

                        if (dr["AssessmentSharedDateTech2"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["AssessmentSharedDateTech2"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["TechanicalRound3Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound3Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3PanelName"].ToString() + "</font></td>");
                        if (dr["AssessmentSharedDateTech3"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["AssessmentSharedDateTech3"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["TechanicalRound4Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound4Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4PanelName"].ToString() + "</font></td>");
                        if (dr["AssessmentSharedDateTech4"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["AssessmentSharedDateTech4"]).ToString("dd MMM yyyy") + "</font></td>"); }
                        if (dr["CustomerRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1PanelName"].ToString() + "</font></td>");
                        if (dr["CustomerRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2Status"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2PanelName"].ToString() + "</font></td>");
                        if (dr["ManagialRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagialRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundStatus"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundPanelName"].ToString() + "</font></td>");
                        if (dr["ManagementRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagementRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundStatus"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundPanelName"].ToString() + "</font></td>");
                        if (dr["HRRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["HRRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundStatus"].ToString() + "</font></td>");
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
                        if (dr["LastModifiedDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["LastModifiedDate"]).ToString("dd MMM yyyy") + "</font></td>"); }


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
            str.Append("<td><b><font face='Calibri' size='3'>Offer Number</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
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
            str.Append("<td><b><font face='Calibri' size='3'>MU</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Project Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offshore / Onsite</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Education</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Category</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Expected CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>CTC Approved</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>CTC Offered</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>% Of Hike Offered (on curr. CTC)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Job Family</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent Cube </font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cluster</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Comp. Band</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Role</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Min)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Median P-50)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/No (From Median P-50)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception % from Median P-50</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Limit (Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception Yes/No (From Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Exception % from (Max P-75)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grid Bucketing</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Justification (Above Median)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Bonus</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Retention Bonus</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Relocation Expense</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Travel Expense</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Notice Period</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Released By</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Source Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Re-hire</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Billing Rate ($)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>DGM Percent ($)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Studio/Practice</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Practice Community</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Skill type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract Extension Remarks</font></b></td>");

            //str.Append("<td><b><font face='Calibri' size='3'>Updated Column Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Released For</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Remark</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Is Talent Id Reopened</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Previous Talent Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Previous Talent Id Account</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent Is Reopen Reason</font></b></td>");




            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetSalaryDeviationReport(obj, claims[5].Value, out result);
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
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeID"].ToString() + "</font></td>");
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
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Category"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateCurrentLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CTCOffered"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FinalCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PerOfHikeOffered"].ToString() + (dr["PerOfHikeOffered"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JobFamilyName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentClusterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentRoleName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MinGridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50GridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50MediumSalaryException"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P50ExceptionPer"].ToString() + (dr["P50ExceptionPer"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75GridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75UpperSalaryException"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["P75ExceptionPer"].ToString() + (dr["P75ExceptionPer"].ToString() == "" ? "" : "%") + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptionalBucketing"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["JustificationBucket"].ToString() + "</font></td>");
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
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Rehire"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BillingRateInUSD"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DGMPercentUsd"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PracticeCommunity"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SkillType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractExtensionRemarks"].ToString() + "</font></td>");
                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["UpdatedColumns"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferReleasedFor"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remark"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["IsTidReopened"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrevThid"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrevAccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentReopenReason"].ToString() + "</font></td>");



                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "Salary_Deviation_Report.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [Route("GetReferralReport")]
        [HttpPost]
        public IHttpActionResult GetReferralReport([FromBody] ReferralModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetReferralReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetReferralReport(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetReferralReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetReferralReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReferralReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetReferralReport");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelReferralReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelReferralReport(ReferralModel obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            //obj.startDate = "2021-01-01";

            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Referral Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referral Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requisition Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Phone</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referred On</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer EmpId</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer GDL</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer Account</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer Base Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Referrer Grade</font></b></td>");

            str.Append("<td><b><font face='Calibri' size='3'>Screening Round (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Managerial Round (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>HR Discussion (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Approval sent (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Received TAG (Date)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date DP/PDL/SDP</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date GDL</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Received Date COO</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer generation</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Acceptance Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Screen Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reject Reason</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Response Timelines Adherence</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>SLA Compliance</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Rejection status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Rejection Remark</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Modified By</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Modified On</font></b></td>");
            str.Append("</tr>");

            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetReferralReport(obj, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferralId"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferralLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateLocation"].ToString() + "</font></td>");


                    if (dr["cid"].ToString() == "")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "E" + dr["cid"].ToString() + "</font></td>");

                    }

                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + ConfigurationManager.AppSettings["CIDPrefix"].ToString() + dr["cid"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidatePhone"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeID"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateExperience"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentStatus"].ToString() + "</font></td>");

                    if (dr["ReferredOn"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ReferredOn"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RectruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerNAme"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerEmpId"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerDU"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerAccount"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerGrade"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReferrerBAseLocation"].ToString() + "</font></td>");

                    if (dr["ScreeningDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ScreeningDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["TechanicalRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["TechanicalRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["TechanicalRound3Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound3Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["CustomerRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["CustomerRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["ManagialRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagialRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["HRRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["HRRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["OfferApprovalSentDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferApprovalSentDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["ApprovalReceivedTAGDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedTAGDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["ApprovalReceivedDHDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedDHDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["ApprovalReceivedSVPDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedSVPDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["ApprovalReceivedCOODate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedCOODate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["OfferGenerationDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferGenerationDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["OfferAcceptanceDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferAcceptanceDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateStatus"].ToString() + "</font></td>");

                    if (dr["isScreenRejected"].Equals(1))
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "Screen Rejected" + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "" + "</font></td>");
                    }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenRejectReason"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ResponseTimelineAdhereness"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SLACompliance"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RejectStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RejectRemark"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ModifiedBy"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ModifiedOn"].ToString() + "</font></td>");
                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "Referral_Report.xls";
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

        [Route("GetWeekWiseRecruiterProductivityReport")]
        [HttpGet]
        public IHttpActionResult GetWeekWiseRecruiterProductivityReport(string Month, string Year)
        {
            try
            {
                logger.LogRequestAsync("GetWeekWiseRecruiterProductivityReport", Request);

                if (Month == null)
                {
                    return BadRequest("Month is Required");
                }
                else if (Year == null)
                {
                    return BadRequest("Year is Required");
                }
                else
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result;
                    var data = objRepo.GetWeekWiseRecruiterProductivityReport(Month, Year, claims[5].Value, out result);
                    if (result == -9)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetWeekWiseRecruiterProductivityReport", claims[5].Value);
                        return BadRequest(AppConstants.UnauthorizedMessage);
                    }

                    logger.LogResponseAsync("GetWeekWiseRecruiterProductivityReport", "200 OK");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetWeekWiseRecruiterProductivityReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetWeekWiseRecruiterProductivityReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        // Added by Jivan
        [Route("GetPanelWiseReportNew")]
        [HttpPost]
        public IHttpActionResult GetPanelWiseReportNew([FromBody] panelWiseFilterModelNew obj)
        {
            try
            {
                logger.LogRequestAsync("GetPanelWiseReportNew", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                if (string.IsNullOrEmpty(obj.StartDate))
                {
                    return BadRequest("Start Date is Required");
                }
                else
                {
                    int result;
                    var data = objRepo.GetPanelWiseReportNew(obj, claims[5].Value, out result);
                    if (result == -9)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetPanelWiseReportNew", claims[5].Value);
                        return BadRequest(AppConstants.UnauthorizedMessage);
                    }

                    logger.LogResponseAsync("GetPanelWiseReportNew", "200 OK");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPanelWiseReportNew", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetPanelWiseReportNew");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelPanelWiseReportNew")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelPanelWiseReportNew([FromBody] panelWiseFilterModelNew obj)
        {


            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Panel ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Panel Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Panel</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade Panel</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Round Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade Candidate</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill TID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>SubSkill TID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account TID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interview Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interview Round</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interview Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Skill Panel</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Panel Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Recruiter EmpId</font></b></td>");

            str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Panel Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Is Transfer</font></b></td>");


            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetPanelWiseReportNew(obj, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PanelID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PanelName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade_Panel"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ROUNDID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade_Candidate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Talent_ID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkill_TID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkill_TID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Account_TID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewDate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewRound"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Skill_Panel"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Tech1Status"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RecruiterId"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["IsActivePanel"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ISTransfer"].ToString() + "</font></td>");

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "PanelWiseList.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }


        [Route("GetOnboardReport")]
        [HttpPost]
        public IHttpActionResult GetOnboardReport([FromBody] OnBoardModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetOnboardReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOnboardReport(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOnboardReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetOnboardReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOnboardReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetOnboardReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentIdReportRenuTeam")]
        [HttpPost]
        public IHttpActionResult GetTalentIdReportRenuTeam([FromBody] TalentReportRenuTeamFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetTalentIdReportRenuTeam", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetTalentIdReportRenuTeam(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetTalentIdReportRenuTeam", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetTalentIdReportRenuTeam", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentIdReportRenuTeam", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetTalentIdReportRenuTeam");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelTalentIdReportRenuTeam")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelTalentIdReportRenuTeam([FromBody] TalentReportRenuTeamFilter obj)
        {


            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Role</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requirement Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Studio/Practice</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>TagAge Start Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Tag Age</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Hiring Requestor</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Total Profiles Presented</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>No of Active Profiles</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Screen Reject</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Screen Pending</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Withdrawal by Candidate</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidates at 1st Level Interview</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interview Reject</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidates at 2nd  Level Interview</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidates at 3rd  Level Interview</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Final Level</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidates Shortlisted for Offer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidates Offered</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Declined</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joined</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>YTJ</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Decline</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interviewers</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Profile Source</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date Of Joining</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date Of Offered </font></b></td>");




            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetTalentIdReportRenuTeam(obj, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RoleName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RequirementType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Experience"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Practice"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Location"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TagStartDate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TagAgeing"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HiringRequestor"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalProfilesPresented"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalActiveProfiles"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenReject"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenPending"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["WithdrawalbyCandidate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Candidatesat1stLevelInterview"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewReject"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Candidatesat2ndLevelInterview"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Candidatesat3rdLevelInterview"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FinalLevel"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SelectedCandidates"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferedCandidates"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferDeclined"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Joined"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["YTJ"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ApprovalDeclined"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Interviewers"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Cid"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DateOfOffer"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DateOfJoining"].ToString() + "</font></td>");

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "PanelWiseList.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }


        [Route("GetCandidateWiseReport")]
        [HttpPost]
        public IHttpActionResult GetCandidateWiseReport([FromBody] CandidateWiseReportFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetCandidateWiseReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateWiseReport(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetCandidateWiseReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetCandidateWiseReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateWiseReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetCandidateWiseReport");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelCandidateWiseReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelCandidateWiseReport(CandidateWiseReportFilter obj)
        {
            try
            {
                obj.page = 1;
                obj.pageSize = 100000;
                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>TalentId</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Created on date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Final Approved Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Mobile Number</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Date of birth</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Experience</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>department Unit</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>MU</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Designation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Current Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Expected Salary</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Pending with Leadership hiring Start Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>JD Clarification (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Panel Available (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offshore / Onshore</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Cube (Candidate)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Cube (THID)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Grade</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Grade</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sourcing (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round Status </font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Profile Approved By</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Screening Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 1 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 3 Panel Name</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 (Date)</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Technical Round 4 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 1 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Customer Round 2 Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Managerial Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Management Round Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>Management Round Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Discussion Status</font></b></td>");
                //str.Append("<td><b><font face='Calibri' size='3'>HR Discussion Panel Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer Approval Initiation (Date)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>TAG Lead Approval Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>First Approval Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>First Approval Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Second Approval Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Second Approval Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Third Approval Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>third Approval date</ font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer generation</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter's RM</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>DOJ</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>TalentId Status</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Reason for drop</font></b></td>");
                str.Append("</tr>");

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetCandidateWiseReport(obj, claims[5].Value , out result);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CreatedOndate"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["talentIdApproveddate"].ToString() + "</font></td>");

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
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentSalary"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExceptedSalary"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PendingWithTagStartDate"].ToString() + " </font></td>");

                        if (dr["JDClarificationDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["JDClarificationDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["PanelAvailableDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["PanelAvailableDate"]).ToString("dd MMM yyyy") + "</font></td>"); }


                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OffshoreOnshore"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmploymentType"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeCandidateName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeTalentName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentGrade"].ToString() + "</font></td>");

                        if (dr["SourcingDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["SourcingDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ScreeningDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ScreeningDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreeningRoundStatus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProfileApprovedbyName"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreeningRoundPanelName"].ToString() + "</font></td>");

                        if (dr["TechanicalRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1Status"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound1PanelName"].ToString() + "</font></td>");


                        if (dr["TechanicalRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound2PanelName"].ToString() + "</font></td>");
                        if (dr["TechanicalRound3Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound3Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound3PanelName"].ToString() + "</font></td>");
                        //if (dr["TechanicalRound4Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        //else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["TechanicalRound4Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TechanicalRound4PanelName"].ToString() + "</font></td>");
                        if (dr["CustomerRound1Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound1Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound1PanelName"].ToString() + "</font></td>");
                        if (dr["CustomerRound2Date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CustomerRound2Date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2Status"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CustomerRound2PanelName"].ToString() + "</font></td>");
                        if (dr["ManagialRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagialRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundStatus"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagialRoundPanelName"].ToString() + "</font></td>");
                        if (dr["ManagementRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ManagementRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundStatus"].ToString() + "</font></td>");

                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ManagementRoundPanelName"].ToString() + "</font></td>");
                        if (dr["HRRoundDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["HRRoundDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundStatus"].ToString() + "</font></td>");
                        //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRRoundPanelName"].ToString() + "</font></td>");

                        if (dr["OfferApprovalSentDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferApprovalSentDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["ApprovalReceivedTAGDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ApprovalReceivedTAGDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FirstApproverName"].ToString() + "</font></td>");

                        if (dr["FirstApproverDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["FirstApproverDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondApproverName"].ToString() + "</font></td>");

                        if (dr["SecondApproverDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["SecondApproverDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ThirdApproverName"].ToString() + "</font></td>");

                        if (dr["ThirdApproverDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ThirdApproverDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        if (dr["OfferGenerationDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["OfferGenerationDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiter"].ToString() + "</font></td>");


                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RectruiterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RectruiterRMName"].ToString() + "</font></td>");

                        if (dr["DateOfJoining"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                        else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfJoining"]).ToString("dd MMM yyyy") + "</font></td>"); }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Source"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandiadteStatus"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentStatus"].ToString() + "</font></td>");
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
                    response.Content.Headers.ContentDisposition.FileName = "Candidate_Wise_report.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    return response;
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "ExportToExcelCandidateWiseReport");
            }

            return null;
        }

        [Route("GetIJPTalentReport")]
        [HttpPost]
        public IHttpActionResult GetIJPTalentReport(GetIJPViewList obj)
        {
            try
            {
                logger.LogRequestAsync("GetIJPTalentReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIJPTalentReport(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetIJPTalentReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetIJPTalentReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPTalentReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetIJPTalentReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateInterviewToOnboardingVideoCompReport")]
        [HttpPost]
        public IHttpActionResult CandidateInterviewToOnboardingVideoCompReport(InterviewToOnboardingVideoCompReport obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                return Ok(objRepo.CandidateInterviewToOnboardingVideoCompReport(obj, claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "CandidateInterviewToOnboardingVideoCompReport");
                return BadRequest("There is some error! Try again later");
            }
        }

    }
}
