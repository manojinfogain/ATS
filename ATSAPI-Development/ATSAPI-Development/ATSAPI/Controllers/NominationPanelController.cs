using ATSAPI.Repositry;
using System.IO;
using ATSAPI.App_Data;
using Microsoft.Exchange.WebServices.Data;
using System.Data;
using ATSAPI.common;
using System.Text;
using System.Configuration;
using System.Data.OleDb;
using LumenWorks.Framework.IO.Csv;
using MessageBird;
using MessageBird.Objects;
using System.Net.Http.Headers;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using iTextSharp.tool.xml.pipeline.html;
using iTextSharp.tool.xml.html;
using iTextSharp.tool.xml.parser;
using iTextSharp.tool.xml.pipeline.end;
using iTextSharp.tool.xml.pipeline.css;
using iTextSharp.tool.xml;
using System.Globalization;
using System.Security.Claims;
using System.Collections;
using TimeZoneConverter;
using System.Linq;
using System;
using System.Web.Http;
using ATSAPI.Models;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [System.Web.Http.RoutePrefix("api/NominationPanel")]
    public class NominationPanelController: System.Web.Http.ApiController
    {
        string sectionName = "NominationPanelController";
        NominationPanelRepository objRepo = new NominationPanelRepository();
        CommonController cm = new CommonController();
        Logger logger = new Logger();

        [System.Web.Http.Route("addUpdatePanelDetails")]
        [HttpPost]
        public IHttpActionResult AddUpdatePanelDetails(PanelAddUpdate bodyP)
        {
            try
            {
                int result = 0;
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("AddUpdatePanelDetails", Request);
                result = objRepo.AddUpdatePanelDetails(bodyP, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (result == 1)
                {
                    logger.LogResponseAsync("AddUpdatePanelDetails", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdatePanelDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddUpdatePanelDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetEmpListForPanelAddition")]
        [HttpGet]
        public IHttpActionResult GetEmpListForPanelAddition(int page, int pageSize, string search = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetEmpListForPanelAddition", Request);
                var data = objRepo.GetEmpListForPanelAddition(claims[5].Value, page, pageSize, out result, search);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetEmpListForPanelAddition", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpListForPanelAddition", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpListForPanelAddition");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetEmpDetails")]
        [HttpGet]
        public IHttpActionResult GetEmpDetails(string empId)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetEmpDetails", Request);
                var data = objRepo.GetEmpDetails(claims[5].Value, empId, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetEmpDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetEmpListForPanelAddition");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getPanelList")]
        [HttpPost]
        public IHttpActionResult GetPanelList([FromBody] PanelListFilter obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetPanelList", Request);
                var data = objRepo.GetPanelList(obj, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetPanelList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPanelList", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ChangePanelStatus")]
        [HttpPost]
        public IHttpActionResult ChangePanelStatus(PanelStatusUpdate bodyP)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; // New Employee ID
                logger.LogRequestAsync("ChangePanelStatus", Request);
                int result = objRepo.ChangePanelStatus(bodyP, EmpID);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (result > 0)
                {
                    logger.LogResponseAsync("ChangePanelStatus", "200 OK");
                    return Ok("Panel status has been changed.");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangePanelStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "ChangePanelStatus");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("postJob")]
        [HttpPost]
        public IHttpActionResult PostJob(JobPosting obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                logger.LogRequestAsync("PostJob", Request);
                int result = objRepo.PostJob(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (result == 1)
                {
                    logger.LogResponseAsync("PostJob", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("PostJob", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "PostJob");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPublishJobStatus")]
        [HttpGet]
        public IHttpActionResult GetPublishJobStatus(string thid)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetPublishJobStatus", Request);
                var data = objRepo.GetPublishJobStatus(thid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetPublishJobStatus", "200 OK");
                //return Ok(data);
                if (data.Tables.Count > 0)
                {
                    var table = data.Tables[0];
                    return Ok(new { data = table });
                }
                else
                {
                    return Ok(new { data = new object[0] }); // empty list if no data
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPublishJobStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishJobStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPublishedJobList")]
        [HttpPost]
        public IHttpActionResult GetPublishedJobList([FromBody] PanelListFilter obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetPublishedJobList", Request);
                var data = objRepo.GetPublishedJobList(obj, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetPublishedJobList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPublishedJobList", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishedJobList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("AddPanelJobSlotTime")]
        [HttpPost]
        public IHttpActionResult AddPanelJobSlotTime(AddPanelJobSlotTime bodyP)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value;
                string Message = string.Empty;
                AddPanelJobSlotTime parmaB = new AddPanelJobSlotTime();
                parmaB = bodyP;
                parmaB.WinTimeZone = TZConvert.IanaToWindows(bodyP.TimeZone);
                logger.LogRequestAsync("AddPanelJobSlotTime", Request);
                int result = objRepo.AddPanelJobSlotTime(parmaB, EmpID, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (result == 1)
                {
                    logger.LogResponseAsync("AddPanelJobSlotTime", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddPanelJobSlotTime", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "AddPanelJobSlotTime");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPanelSlotsByTHID")]
        [HttpPost]
        public IHttpActionResult getPanelSlotsByTHID(PanelSlotByTh obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("getPanelSlotsByTHID", Request);
                var data = objRepo.getPanelSlotsByTHID(obj, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("getPanelSlotsByTHID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPanelSlotsByTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishJobStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPanelSlotsCountByTHID")]
        [HttpGet]
        public IHttpActionResult getPanelSlotsByTHID(string thid)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("getPanelSlotsCountByTHID", Request);
                var data = objRepo.getPanelSlotsCountByTHID(thid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("getPanelSlotsCountByTHID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPanelSlotsCountByTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getPanelSlotsCountByTHID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPanelSlotDetails")]
        [HttpGet]
        public IHttpActionResult getPanelSlotDetails(string PanelEmpId, string thid, string date, int Page, int Pagesize)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("getPanelSlotDetails", Request);
                var data = objRepo.getPanelSlotDetails(PanelEmpId, claims[5].Value, thid, date, Page, Pagesize, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("getPanelSlotDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPanelSlotDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPublishJobStatus");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("DeletePanelSlot")]
        [HttpDelete]
        public IHttpActionResult DeletePanelSlot(int SlotId)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("DeletePanelSlot", Request);
                int result = objRepo.DeletePanelSlot(SlotId, claims[5].Value);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (result > 0)
                {
                    logger.LogResponseAsync("DeletePanelSlot", "200 OK");
                    return Ok("Slot Deleted Successfully");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DeletePanelSlot", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "DeletePanelSlot");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetPanelListBySlotThid")]
        [HttpGet]
        public IHttpActionResult GetPanelListBySlotThid(string thid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetPanelListBySlotThid", Request);
                var data = objRepo.GetPanelListBySlotThid(claims[5].Value, thid, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetPanelListBySlotThid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPanelListBySlotThid", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelListBySlotThidss");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPanelNominationNotificationlistBytid")]
        [HttpGet]
        public IHttpActionResult GetPanelNominationNotificationlistBytid(int thid)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                int result;
                logger.LogRequestAsync("GetPanelNominationNotificationlistBytid", Request);
                var data = objRepo.GetPanelNominationNotificationlistBytid(claims[5].Value, thid, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetPanelNominationNotificationlistBytid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPanelNominationNotificationlistBytid", ex);
                ExceptionLogging.SendExcepToDB(ex, sectionName, "GetPanelListBySlotThidss");
                return BadRequest("There is some error! Try again later");
            }
        }
    }
}