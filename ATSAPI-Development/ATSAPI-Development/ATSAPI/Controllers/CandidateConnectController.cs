using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding; 
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using ATSAPI.Models;
using ATSAPI.Repositry;
using Newtonsoft.Json;
using ATSAPI.App_Data;
using System.IO;
using ATSAPI.common;
using System.Net;
using System.Net.Http.Headers;
using System.Configuration;
using System.Text;
using System.Data;
using DocumentFormat.OpenXml.Drawing.Charts;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [System.Web.Http.RoutePrefix("api/CandidateConnect")]
    public class CandidateConnectController : ApiController
    {

        CandidateConnectRepository objRepo = new CandidateConnectRepository();
        Logger logger = new Logger();

        ReportController Rc = new ReportController();

        [Route("GetOfferedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetOfferedCandidatesList(CandidateConnectModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetOfferedCandidatesList", Request);
                int result;
                var data = objRepo.GetOfferedCandidatesList(claims[5].Value, obj, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetOfferedCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOfferedCandidatesList", ex);
                ExceptionLogging.SendExcepToDB(ex, "CandidatesList", "GetApprovedCandidatesList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addUpdateCandidateConnectHistory")]
        [HttpPost]
        public IHttpActionResult addUpdateCandidateConnectHistory(CandidateConnect candidateconnect)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("addUpdateCandidateConnectHistory", Request);
                string Message = string.Empty;
                int result = objRepo.addUpdateCandidateConnectHistory(candidateconnect, claims[5].Value, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("addUpdateCandidateConnectHistory", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("addUpdateCandidateConnectHistory", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("addUpdateCandidateConnectHistory", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("addUpdateCandidateConnectHistory", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addUpdateCandidateConnectHistory", ex);
                ExceptionLogging.SendExcepToDB(ex, "UpdateOffer", "UpdateOfferedStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateStatusMaster")]
        [HttpGet]
        public IHttpActionResult CandidateStatusMaster(int? cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("CandidateStatusMaster", Request);
                var data = objRepo.CandidateStatusMaster(cid);
                logger.LogResponseAsync("CandidateStatusMaster", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateStatusMaster", ex);
                ExceptionLogging.SendExcepToDB(ex, "Status", "CandidateStatusMaster");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllEmployeeList")]
        [HttpGet]
        public IHttpActionResult getAllEmployeeList(string EmpId = "", bool pagination = false, int limit = 0, string searchText = "")
        {
            try
            {
                logger.LogRequestAsync("getAllEmployeeList", Request);
                int result;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getAllEmployeeList(EmpId, pagination, limit, out result, searchText);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getAllEmployeeList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllEmployeeList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "getCandidateList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getCandidateConnectView")]
        [HttpGet]
        public IHttpActionResult getCandidateConnectView(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getCandidateConnectView", Request);
                int result;
                var data = objRepo.getCandidateConnectView(cid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getCandidateConnectView", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateConnectView", ex);
                ExceptionLogging.SendExcepToDB(ex, "CandidateView", "getCandidateConnectView");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetCandidateConnectTracker")]
        [HttpPost]
        public IHttpActionResult GetCandidateConnectTracker(CandidateTrackerModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetCandidateConnectTracker", Request);
                int result;
                var data = objRepo.GetCandidateConnectTracker(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetCandidateConnectTracker", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateConnectTracker", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "Get_CandidateConnectTracker");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateConnectReason")]
        [HttpGet]
        public IHttpActionResult CandidateConnectReason(string flag = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("CandidateConnectReason", Request);
                var data = objRepo.CandidateConnectReason(flag);
                logger.LogResponseAsync("CandidateConnectReason", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateConnectReason", ex);
                ExceptionLogging.SendExcepToDB(ex, "Status", "CandidateConnectReason");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelCandidateConnect")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelCandidateConnect(CandidateConnectModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("ExportToExcelCandidateConnect", Request);
                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Email Id</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Phone No</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offered Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Joining Date</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Offer status</font></b></td>");
                str.Append("</tr>");

                int result;
                DataSet ds = objRepo.GetOfferedCandidatesList(claims[5].Value, obj, out result);

                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["talent_id"].ToString() + "</font></td>");
                        if (dr["ProfileId"].ToString() == "")
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");
                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Rc.CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + "</font></td>");
                        }
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Name"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["email"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["phone"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryskill"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkill"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");

                        if (dr["DateOfOffer"].ToString() == "")
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>");
                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfOffer"]).ToString("dd MMM yyyy") + "</font></td>");
                        }

                        if (dr["CandidateJoiningDate"].ToString() == "")
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>");
                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["CandidateJoiningDate"]).ToString("dd MMM yyyy") + "</font></td>");
                        }

                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferStatusName"].ToString() + "</font></td>");
                        str.Append("</tr>");
                    }
                    str.Append("</table>");
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                    byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = "CandidateConnect.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    logger.LogResponseAsync("ExportToExcelCandidateConnect", "200 OK");
                    return response;
                }
                logger.LogResponseAsync("ExportToExcelCandidateConnect", "204 No Content");
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ExportToExcelCandidateConnect", ex);
                ExceptionLogging.SendExcepToDB(ex, "Export", "ExportToExcelCandidateConnect");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "There is some error! Try again later");
            }
        }

        [Route("ExportToExcelCandidateConnectHistory")]
        [HttpGet]
        public  HttpResponseMessage ExportToExcelCandidateConnectHistory(int cid)
        {
            StringBuilder str = new StringBuilder();
            logger.LogRequestAsync("ExportToExcelCandidateConnectHistory", Request);
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Connect Event</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Connected Person</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Connected Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reschedule Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Remark</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Created By</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Created On</font></b></td>");
            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds =  objRepo.getCandidateConnectView(cid, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateStatusName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["connectPersonName"].ToString() + "</font></td>");

                    if (dr["ConnectDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ConnectDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["RescheduleDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["RescheduleDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remark"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["connectStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["updatedByName"].ToString() + "</font></td>");

                    if (dr["updatedOn"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["updatedOn"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                logger.LogResponseAsync("ExportToExcelCandidateConnectHistory", "200 OK");
                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "CandidateConnectHistoryDetails" + ".xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }


        [Route("getCandidateConnectCallDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateConnectCallDetails(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidateConnectCallDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data =  objRepo.getCandidateConnectCallDetails(cid, claims[5].Value, out result);
                logger.LogResponseAsync("getCandidateConnectCallDetails", "200 OK");
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateConnectCallDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate call details", "getCandidateConnectCallDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

    }
}