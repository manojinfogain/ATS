using ATSAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
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
using Org.BouncyCastle.Ocsp;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using Microsoft.Diagnostics.Tracing.Session;
using System.ComponentModel;
using DocumentFormat.OpenXml.Drawing.Charts;
using DataTable = System.Data.DataTable;

namespace ATSAPI.Controllers
{
    //[AuthorizeAttribute]
    [UserWiseAuthorizeAttribute("I")]
    [RoutePrefix("api/Interview")]
    public class InterviewController : ApiController
    {
        InterviewRepository objRepo = new InterviewRepository();
        Common common = new Common();
        EmailSender EmailSender = new EmailSender();
        CommonController CommonController = new CommonController();
        Logger logger = new Logger();


        [Route("InterviewFeedback")]
        [HttpPost]
        public IHttpActionResult InterviewFeedback()
        {
            try
            {
                FeedbackModel fb = new FeedbackModel();
                var frm = HttpContext.Current.Request.Form;
                var count = HttpContext.Current.Request.Files.Count;
                if (count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files;
                    if (frm["StatusId"] == "7" && (frm["interviewTypeId"] == "1" || frm["interviewTypeId"] == "2" || frm["interviewTypeId"] == "3" || frm["interviewTypeId"] == "5" || frm["interviewTypeId"] == "6"))
                    {
                        //  fb.TestAttachment = httpPostedFile[0].FileName;
                        fb.TestAttachment = common.GetFileWithAdditionalExtention(httpPostedFile[0].FileName);
                    }
                    else if (frm["StatusId"] == "4" && (frm["interviewTypeId"] == "4"))
                    {
                        // fb.TestAttachment = httpPostedFile[0].FileName;
                        fb.TestAttachment = common.GetFileWithAdditionalExtention(httpPostedFile[0].FileName);
                    }
                    else if (frm["StatusId"] == "5" && (frm["interviewTypeId"] == "2"))
                    {
                      //  fb.TestAttachment = httpPostedFile[0].FileName;
                        fb.TestAttachment = common.GetFileWithAdditionalExtention(httpPostedFile[0].FileName);
                    }
                    else if ((frm["StatusId"] == "1") && frm["interviewTypeId"] == "2" && (frm["interviewBy"] == "I" || frm["interviewBy"] == "E"))
                    {
                        //fb.TestAttachment = httpPostedFile[0].FileName;
                        fb.TestAttachment = common.GetFileWithAdditionalExtention(httpPostedFile[0].FileName);
                    }
                    if ((frm["StatusId"] == "1" || frm["StatusId"] == "3") && (frm["interviewTypeId"] == "4"))
                    {
                      //  fb.FinalAttachment = httpPostedFile[0].FileName;
                        fb.FinalAttachment = common.GetFileWithAdditionalExtention(httpPostedFile[0].FileName);
                        if (count > 1)
                           // fb.FinalAttachment1 = httpPostedFile[1].FileName;
                            fb.FinalAttachment1 = common.GetFileWithAdditionalExtention(httpPostedFile[1].FileName);
                        if (count > 2)
                           // fb.FinalAttachment2 = httpPostedFile[2].FileName;
                        fb.FinalAttachment2 = common.GetFileWithAdditionalExtention(httpPostedFile[2].FileName);
                        if (httpPostedFile["OfferLetterAtt"] != null)
                         //   fb.OfferLetterAtt = httpPostedFile["OfferLetterAtt"].FileName;
                        fb.OfferLetterAtt = common.GetFileWithAdditionalExtention(httpPostedFile["OfferLetterAtt"].FileName);
                    }
                }

                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.IsCache = frm["IsCache"] == "" ? 'N' : Convert.ToChar(frm["IsCache"]);
                fb.StatusId = Convert.ToInt16(frm["StatusId"]);
                fb.interviewTypeId = Convert.ToInt16(frm["interviewTypeId"]);
                if (frm["StatusId"] == "1" && frm["interviewBy"] == "I" || frm["StatusId"] == "1" && frm["interviewBy"] == "E")
                {
                    fb.interviewBy = frm["interviewBy"];
                    fb.EntityId = frm["EntityId"] == "" ? 0 : Convert.ToInt32(frm["EntityId"]);
                    fb.interviewDuration = Convert.ToInt16(frm["interviewDuration"]);
                    fb.ExternalAgency = frm["ExternalAgency"] == "" ? 0 : Convert.ToInt32(frm["ExternalAgency"]);
                    fb.interviewDate = frm["interviewDate"] == "" ? "" : frm["interviewDate"];
                    fb.interviewDateUTC = frm["interviewDateUTC"] == "" ? "" : frm["interviewDateUTC"];
                    fb.interviewTimeZone = frm["interviewTimeZone"] == "" ? "" : frm["interviewTimeZone"];
                    fb.interviewModeId = Convert.ToInt16(frm["interviewModeId"]);
                    fb.offsetDate = frm["offsetDate"] == "" ? 0 : Convert.ToInt32(frm["offsetDate"]);
                    fb.interviewModeId = Convert.ToInt16(frm["interviewModeId"]);
                    fb.vanueOrLink = Convert.ToString(frm["vanueOrLink"]);
                    fb.interviewerEmpId = frm["interviewerEmpId"];
                    fb.AdditionalInterviewer = frm["AdditionalInterviewer"];
                    fb.remarks = frm["remarks"];
                    fb.ReasonForNotOptOnlineAssessment = Convert.ToInt16(frm["ReasonForNotOptOnlineAssessment"]);
                    fb.ReasonForOptExternal = Convert.ToInt16(frm["ReasonForOptExternal"]);
                    fb.InterviewLocationId = frm["InterviewLocationId"];


                    if (frm["interviewTypeId"] == "4")
                    {
                        fb.HRConcent = frm["HRConcent"] == null ? 'N' : Convert.ToChar(frm["HRConcent"]);
                        fb.IsInHandOffer = frm["IsInHandOffer"] == null ? 'N' : Convert.ToChar(frm["IsInHandOffer"]);
                        fb.OfferInHandAmount = frm["OfferInHandAmount"] == null ? 0 : Convert.ToDecimal(frm["OfferInHandAmount"]);
                        fb.CompanyID = frm["CompanyID"] == null ? 0 : Convert.ToInt32(frm["CompanyID"]);
                    }
                }
                else if ((frm["StatusId"] == "1" && frm["interviewBy"] == "M") || (frm["StatusId"] == "1" && frm["interviewBy"] == "C") || (frm["StatusId"] == "1" && frm["interviewBy"] == "G"))
                {
                    fb.interviewBy = frm["interviewBy"];
                    fb.offsetDate = frm["offsetDate"] == "" ? 0 : Convert.ToInt32(frm["offsetDate"]);
                    fb.vanueOrLink = Convert.ToString(frm["vanueOrLink"]);
                    fb.interviewerEmpId = frm["interviewerEmpId"];
                    fb.interviewerEmpId = frm["interviewerEmpId"];
                    fb.AdditionalInterviewer = frm["AdditionalInterviewer"];
                    fb.remarks = frm["remarks"];
                    fb.DefaultAssessmentByChangeReason = Convert.ToInt16(frm["DefaultAssessmentByChangeReason"]);

                    if (frm["interviewBy"] == "C")
                    {
                        CodeByteInterviewSchedule coderByteObj = new CodeByteInterviewSchedule();
                        //var frm = HttpContext.Current.Request.Form;

                        coderByteObj.candidates.Add(frm["candidateEmail"]);
                        coderByteObj.assessment_url = frm["assessment_url"];



                        CodeByteInterviewScheduleResponse jsonObj = new CodeByteInterviewScheduleResponse();
                        jsonObj = CommonController.InterviewScheduleCoderByte(coderByteObj);

                        fb.codebyteTestId = jsonObj.data.test_id;
                        fb.coderBytePrivateUrl = jsonObj.data.candidates[0].url;
                        fb.coderBytePublicUrl = frm["assessment_url"];
                        fb.coderByteDisplayName = frm["coderByteDisplayName"];
                    }
                }
                else
                {
                    fb.roundId = Convert.ToInt32(frm["roundId"]);
                    if (frm["IsStatusUpdate"] == "1")
                    {
                        fb.IsStatusUpdate = Convert.ToInt32(frm["IsStatusUpdate"]);
                    }
                    else
                    {
                        if (frm["interviewTypeId"] == "1")
                        {
                            fb.score = frm["score"];
                            fb.screenRoundAdditionalSkills = frm["screenRoundAdditionalSkills"] == "" || frm["screenRoundAdditionalSkills"] == "undefined" || frm["screenRoundAdditionalSkills"] == null ? null : JsonConvert.DeserializeObject<List<ScreenRoundAdditionalSkills>>(frm["screenRoundAdditionalSkills"]);
                            fb.traits = frm["hrTraits"] == "" ? null : JsonConvert.DeserializeObject<List<HRTraits>>(frm["hrTraits"]);
                            fb.ScreenRejectReason = frm["ScreenRejectReason"] == "" ? 0 : Convert.ToInt32(frm["ScreenRejectReason"]);
                            fb.remarks = frm["remarks"];
                        }
                        else if (frm["interviewTypeId"] == "2" || frm["interviewTypeId"] == "3" || frm["interviewTypeId"] == "5" || frm["interviewTypeId"] == "6")
                        {
                            fb.strengths = frm["strengths"];
                            fb.remarkNextLevel = frm["remarkNextLevel"];
                            fb.limitations = frm["limitations"];
                            fb.technical = frm["technical"];
                            fb.nonTechnical = frm["nonTechnical"];
                            fb.evaluation = frm["evaluation"];
                            fb.techRemarks = frm["techRemarks"];
                            fb.ForGroomable = frm["ForGroomable"] == "" ? false : Convert.ToBoolean(frm["ForGroomable"]);
                            fb.GroomableArea1 = frm["GroomableArea1"];
                            fb.GroomableArea2 = frm["GroomableArea2"];
                            fb.GroomableArea3 = frm["GroomableArea3"];
                            if (frm["interviewBy"] == "M" || frm["interviewBy"] == "C" || frm["interviewBy"] == "G")
                            {
                                fb.score = frm["score"];
                                fb.AssessmentDate = frm["AssessmentDate"] == "" ? "" : frm["AssessmentDate"];
                                fb.coderByteReportUrl = frm["coderByteReportUrl"];

                            }
                            else if((frm["interviewTypeId"] != "3" && frm["interviewBy"] != "E"))
                            {

                                fb.areas = frm["techAreas"] == "" ? null : JsonConvert.DeserializeObject<List<TechnicalAreas>>(frm["techAreas"]);
                            }


                            if ((frm["interviewTypeId"] == "2" && frm["interviewBy"] == "I"))
                            {
                                fb.IsQuestionareEnable = String.IsNullOrEmpty(frm["IsQuestionareEnable"]) ? 'N' : Convert.ToChar(frm["IsQuestionareEnable"]);
                                fb.autoQuestionFeedback = frm["autoQuestionFeedback"] == "" || frm["autoQuestionFeedback"] == "undefined" || frm["autoQuestionFeedback"] == null ? null : JsonConvert.DeserializeObject<List<autoQuestionFeedback>>(frm["autoQuestionFeedback"]);
                                fb.TechnicalQuestionnaire = frm["TechnicalQuestionnaire"] == "" || frm["TechnicalQuestionnaire"] == "undefined" || frm["TechnicalQuestionnaire"] == null ? null : JsonConvert.DeserializeObject<TechnicalQuestionnaireFeedback>(frm["TechnicalQuestionnaire"]);
                            }
                        }
                        else if (frm["interviewTypeId"] == "4" || frm["interviewTypeId"] == "7")
                        {
                            fb.DesignationId = frm["DesignationId"] == "" ? 0 : Convert.ToInt32(frm["DesignationId"]);
                            fb.CTC = frm["CTC"] == "" ? 0 : Convert.ToDecimal(frm["CTC"]);
                            fb.joiningBonus = frm["joiningBonus"] == "" ? 0 : Convert.ToDecimal(frm["joiningBonus"]);
                            fb.NoticeBuyOut = frm["NoticeBuyOut"] == "" ? 0 : Convert.ToDecimal(frm["NoticeBuyOut"]);
                            fb.TravelExp = frm["TravelExp"] == "" ? 0 : Convert.ToDecimal(frm["TravelExp"]);
                            fb.RelocationExp = frm["RelocationExp"] == "" ? 0 : Convert.ToDecimal(frm["RelocationExp"]);
                            fb.RetentionBonus = frm["RetentionBonus"] == "" ? 0 : Convert.ToDecimal(frm["RetentionBonus"]);
                            fb.salary = frm["salary"] == "" ? 0 : Convert.ToDecimal(frm["salary"]);
                            fb.primarySkillId = frm["primarySkillId"] == "" ? 0 : Convert.ToInt32(frm["primarySkillId"]);
                            fb.offeredBy = frm["offeredBy"];
                            fb.offeredOn = frm["offeredOn"];
                            fb.recruiterId = frm["recruiter"];
                            fb.hrFinal_Remarks = frm["hrFinal_Remarks"];
                            fb.finalDecision = String.IsNullOrEmpty(frm["finalDecision"]) ? ' ' : Convert.ToChar(frm["finalDecision"]);
                            fb.traits = String.IsNullOrEmpty(frm["hrTraits"]) ? null : JsonConvert.DeserializeObject<List<HRTraits>>(frm["hrTraits"]);
                            fb.flag = String.IsNullOrEmpty(frm["flag"]) ? 0 : Convert.ToInt32(frm["flag"]);
                            //fb.HRConcent = frm["HRConcent"] == null ? 'N' : Convert.ToChar(frm["HRConcent"]);
                            //fb.IsInHandOffer = frm["IsInHandOffer"] == null ? 'N' : Convert.ToChar(frm["IsInHandOffer"]);
                            //fb.OfferInHandAmount = frm["OfferInHandAmount"] == null ? 0 : Convert.ToDecimal(frm["OfferInHandAmount"]);
                            //fb.CompanyID = frm["CompanyID"] == null ? 0 : Convert.ToInt32(frm["CompanyID"]);
                            fb.AnnualVariablePay = frm["AnnualVariablePay"] == "" ? 0 : Convert.ToInt32(frm["AnnualVariablePay"]);
                        }
                    }
                    fb.PanelConcent = frm["PanelConcent"] != null ? Convert.ToChar(frm["PanelConcent"]) : ' ';
                    if ((frm["interviewTypeId"] == "1" || frm["interviewTypeId"] == "2" || frm["interviewTypeId"] == "3" || frm["interviewTypeId"] == "5" || frm["interviewTypeId"] == "6" || frm["interviewTypeId"] == "4" || frm["interviewTypeId"] == "7"))
                    {
                        fb.IsFeedbackSaveOrDraft = Convert.ToChar(frm["IsFeedbackSaveOrDraft"]);
                    }
                }

                if ((frm["StatusId"] == "5" || frm["StatusId"] == "4") && frm["interviewTypeId"] == "4" && frm["IsStatusUpdate"] == "1")
                {
                    fb.hrFinal_Remarks = frm["hrFinal_Remarks"];
                }
                


                fb.AddedBy = frm["AddedBy"];
                if (!string.IsNullOrEmpty(frm["IdentityId"]))
                {
                    fb.IdentityId = Convert.ToInt32(frm["IdentityId"]);
                    fb.IdentityNo = frm["IdentityNo"];
                }

                int result = objRepo.InterviewFeedback(fb);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (HttpContext.Current.Request.Files.Count > 0 && result > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    var fileNameEnc = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);
                    if (frm["StatusId"] == "7" && (frm["interviewTypeId"] == "1" || frm["interviewTypeId"] == "2" || frm["interviewTypeId"] == "3" || frm["interviewTypeId"] == "5" || frm["interviewTypeId"] == "6"))
                    {
                        string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, fileNameEnc);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }


                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                        //  httpPostedFile.SaveAs(fileSavePath);
                    }
                    else if (frm["StatusId"] == "4" && frm["interviewTypeId"] == "4")
                    {
                        string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, fileNameEnc);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        // httpPostedFile.SaveAs(fileSavePath);
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }


                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                    }
                    else if ((frm["StatusId"] == "1") && frm["interviewTypeId"] == "2" && (frm["interviewBy"] == "I" || frm["interviewBy"] == "E"))
                    {
                        string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, fileNameEnc);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        // httpPostedFile.SaveAs(fileSavePath);
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }


                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                    }
                    else if (frm["StatusId"] == "5" && (frm["interviewTypeId"] == "2"))
                    {
                        string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, fileNameEnc);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        //httpPostedFile.SaveAs(fileSavePath);
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }


                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                    }
                    if ((frm["StatusId"] == "1" || frm["StatusId"] == "3") && (frm["interviewTypeId"] == "4"))
                    {
                        string filedetails = "";
                        string tempPath = "";
                        if (count > 0)
                        {
                            httpPostedFile = HttpContext.Current.Request.Files[0];
                            filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                            tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string fileSavePath = Path.Combine(tempPath, fileNameEnc);
                            if (System.IO.File.Exists(fileSavePath))
                            {
                                File.Delete(fileSavePath);
                            }
                            //httpPostedFile.SaveAs(fileSavePath);

                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                httpPostedFile.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }


                            // Encrypt the file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                        }
                        if (count > 1)
                        {
                            httpPostedFile = HttpContext.Current.Request.Files[1];
                            filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                            tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string fileSavePath = Path.Combine(tempPath, common.GetFileWithAdditionalExtention(httpPostedFile.FileName));
                            if (System.IO.File.Exists(fileSavePath))
                            {
                                File.Delete(fileSavePath);
                            }
                           // httpPostedFile.SaveAs(fileSavePath);

                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                httpPostedFile.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }


                            // Encrypt the file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                        }
                        if (count > 2)
                        {
                            httpPostedFile = HttpContext.Current.Request.Files[2];
                            filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                            tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string fileSavePath = Path.Combine(tempPath, common.GetFileWithAdditionalExtention(httpPostedFile.FileName));
                            if (System.IO.File.Exists(fileSavePath))
                            {
                                File.Delete(fileSavePath);
                            }
                            //   httpPostedFile.SaveAs(fileSavePath);
                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                httpPostedFile.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }


                            // Encrypt the file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                        }
                        httpPostedFile = HttpContext.Current.Request.Files["OfferLetterAtt"];
                        if (httpPostedFile != null)
                        {
                            filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                            tempPath = System.Configuration.ConfigurationManager.AppSettings["MettlTestResults"].ToString() + "/" + frm["cid"] + "/" + frm["roundId"] + "/";
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string fileSavePath = Path.Combine(tempPath, common.GetFileWithAdditionalExtention(httpPostedFile.FileName));
                            if (System.IO.File.Exists(fileSavePath))
                            {
                                File.Delete(fileSavePath);
                            }
                            // httpPostedFile.SaveAs(fileSavePath);

                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                httpPostedFile.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }


                            // Encrypt the file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                        }
                    }
                }


                if (result > 0 && fb.StatusId == 1)
                {
                    if (fb.interviewTypeId != 1)
                    {

                        if (frm["interviewBy"] == "M" || frm["interviewBy"] == "C" || frm["interviewBy"] == "G")
                        {
                            SendEmailATS(fb.cid, fb.AddedBy, "M");
                        }
                        else
                        {
                            SendScheduleNotification(result, fb.cid, fb.AddedBy, 1);
                            /***Save auto Question for Tech Round **/
                            //if (fb.interviewTypeId == 2)
                            //{
                            //    System.Threading.Tasks.Task<string> autQuestionSave = common.UpdateAutoQuestionsForTechRound(fb.cid, fb.AddedBy);
                            //}

                        }
                    }
                    return Ok("Interview Scheduled Successfully");
                }
                else if (result > 0 && fb.IsStatusUpdate == 1)
                {
                     System.Threading.Tasks.Task<string> UploadTransSciptInt = common.TranscriptProcessUpdate(fb.cid,fb.roundId, fb.AddedBy);
                 return Ok("Feedback Provided");
                }
                else if (result == -2)
                    return BadRequest("Same status already updated.");
                else if (result == -3)
                    return BadRequest("Please upload Government photo ID proof.");
                else if (result == -4)
                    return BadRequest("Please wait till recruiter uploads candidate video.");
                else if (result == -5)
                    return BadRequest("Please fill the required detailed feedback.");
                else if (result == -10)
                    return BadRequest("Please clear your browser cache and try again.");
                else if (result > 0)
                {
                    System.Threading.Tasks.Task<string> UploadTransSciptInt = common.TranscriptProcessUpdate(fb.cid, fb.roundId, fb.AddedBy);
                    return Ok("Record Updated Successfully");
                }
                   
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Interview", "InterviewFeedback");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCurrentRoundDetailsByCid")]
        [HttpGet]
        public IHttpActionResult getCurrentRoundDetailsByCid(int cid, string EmpId)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);

                logger.LogRequestAsync("getCurrentRoundDetailsByCid", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCurrentRoundDetailsByCid", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCurrentRoundDetailsByCid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCurrentRoundDetailsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCurrentRoundDetailsByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        private byte[] createPDF(int cid, RoundDetails rlist, roundIdList rListFeedback)

        {
            byte[] pdfBytes;

            StringBuilder sb = new StringBuilder();

            sb.Append("<div style='text-align: center; font-family:Arial; font-weight:bold; font-size:25px;color: #1f6a9f;'><h4>Interview Feedback</h4></div>");
            sb.Append("<br><br>");
            sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-cname'><b>Name:</b><span> " + (string.IsNullOrWhiteSpace(rlist.Name) ? "none" : rlist.Name) + "</span></td><td class='grid-item-cname'><b>Email:</b><span> " + (string.IsNullOrWhiteSpace(rlist.Email) ? "none" : rlist.Email) + "</span></td><td class='grid-item-cname'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(rlist.THID) ? "none" : rlist.THID) + "</span></td></tr></table>");
            //Round cars = rlist.roundList.Where(o => o.IsCurrentRound == "test");
            var currentRoundThId = rlist.roundList.Where(o => o.IsCurrentRound.ToString() == "Y").FirstOrDefault().thId;
            var filterRoundlist = (dynamic)null;
            if (rListFeedback == null)
            {
                filterRoundlist = rlist.roundList.Where(o => o.thId.ToString() == currentRoundThId);
            }
            else
            {
                filterRoundlist = rlist.roundList.Where(o => rListFeedback.roundListId.Any(s => o.RoundId.ToString().Contains(s))).ToList();
            }
            foreach (var item in filterRoundlist)
            {
                Round rd1 = new Round();
                int interviewTypeId = item.interviewType.Id;
                int interviewStatusId = item.InterViewStatus.Id;
                int IsConversionEmployee = rlist.IsConversionEmployee;
                char isNewFeedback =item.isNewFeedback;


                if (interviewTypeId == 1 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2 && IsConversionEmployee !=1)
                {
                    CultureInfo culture = new CultureInfo("en-US");
                    DateTime InterviewDateTime = Convert.ToDateTime(item.InterviewDate, culture);
                    //string InterviewDate = InterviewDateTime.ToString("dd MMM yyyy hh mm tt");
                    var day = (InterviewDateTime.Day % 10 == 1 && InterviewDateTime.Day % 100 != 11) ? "st"
                    : (InterviewDateTime.Day % 10 == 2 && InterviewDateTime.Day % 100 != 12) ? "nd"
                    : (InterviewDateTime.Day % 10 == 3 && InterviewDateTime.Day % 100 != 13) ? "rd"
                    : "th";
                    string InterviewDate = string.Format(InterviewDateTime.ToString("dd{0} MMM yyyy HH mm tt"), day);
                    sb.Append("<div class='itext_round_title'><h5><b>" + item.interviewType.Type + "</b></h5></div>");
                    sb.Append("<br>");
                    sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(InterviewDate) ? "none" : InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td> </tr></table>");
                    sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(item.talentId) ? "none" : item.talentId) + "</span></td><td class='grid-item-namedate'><b>Recruiter:</b><span> " + (string.IsNullOrWhiteSpace(item.recruiter.Name) ? "none" : item.recruiter.Name) + "</span></td></tr></table>");


                    sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr></table>");



                    sb.Append("<table class='itext_Table'><tr><th class='itext_header' style=' width: 40%;'>Traits</th><th class='itext_header' style=' width: 50%;'>Comments</th><th class='itext_header' style=' width: 10%;'>Rating</th></tr>");


                    foreach (var element in item.hrTraits)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.TraitName) ? "none" : element.TraitName) + "</td>");
                        sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.Comments) ? "none" : element.Comments) + "</td>");
                        sb.Append("<td>" + element.hrRating + "</td></tr>");

                    }
                    sb.Append("</table>");
                    sb.Append("<br><br>");

                    sb.Append("<table class='itext_Table'><tr><th class='itext_header' style=' width: 40%;'>Skills</th><th class='itext_header' style=' width: 30%;'>Candidate Self Rating</th><th class='itext_header' style=' width: 30%;'>Relevant Experience</th></tr>");

                    foreach (var element in item.screenRoundAdditionalSkills)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.skill) ? "none" : element.skill) + "</td>");
                        sb.Append("<td>" + element.rating + "</td>");
                        //sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.rating) ? "none" : element.rating) + "</td>");
                        sb.Append("<td>" + element.expYear + " Year(s) " + element.expMonth + " Month(s)" + "</td></tr>");
                        //sb.Append("<td>" +  element.expYear + "</td></tr>");


                    }

                    sb.Append("</table>");
                    sb.Append("<br><br>");
                }
                else if (interviewTypeId == 2 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2 || interviewTypeId == 6 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2)
                {
                    CultureInfo culture = new CultureInfo("en-US");

                    if (item.interviewBy == "M")
                    {
                        DateTime Assessmentdatetime = Convert.ToDateTime(item.AssessmentDate, culture);
                        var day = (Assessmentdatetime.Day % 10 == 1 && Assessmentdatetime.Day % 100 != 11) ? "st"
                          : (Assessmentdatetime.Day % 10 == 2 && Assessmentdatetime.Day % 100 != 12) ? "nd"
                          : (Assessmentdatetime.Day % 10 == 3 && Assessmentdatetime.Day % 100 != 13) ? "rd"
                          : "th";
                        string Assessmentdate = string.Format(Assessmentdatetime.ToString("dd{0} MMM yyyy HH mm tt"), day);
                    }
                    else if (item.interviewBy == "C")
                    {
                        DateTime Assessmentdatetime = Convert.ToDateTime(item.AssessmentDate, culture);
                        var day = (Assessmentdatetime.Day % 10 == 1 && Assessmentdatetime.Day % 100 != 11) ? "st"
                          : (Assessmentdatetime.Day % 10 == 2 && Assessmentdatetime.Day % 100 != 12) ? "nd"
                          : (Assessmentdatetime.Day % 10 == 3 && Assessmentdatetime.Day % 100 != 13) ? "rd"
                          : "th";
                        string Assessmentdate = string.Format(Assessmentdatetime.ToString("dd{0} MMM yyyy HH mm tt"), day);

                    }
                    else
                    {
                        DateTime InterviewDateTime = Convert.ToDateTime(item.InterviewDate, culture);
                        var day = (InterviewDateTime.Day % 10 == 1 && InterviewDateTime.Day % 100 != 11) ? "st"
                          : (InterviewDateTime.Day % 10 == 2 && InterviewDateTime.Day % 100 != 12) ? "nd"
                          : (InterviewDateTime.Day % 10 == 3 && InterviewDateTime.Day % 100 != 13) ? "rd"
                          : "th";
                        string InterviewDate = string.Format(InterviewDateTime.ToString("dd{0} MMM yyyy HH mm tt"), day);
                    }

                    sb.Append("<div class='itext_round_title'><h5><b>" + item.interviewType.Type + "</b></h5></div>");
                    // sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(item.InterviewDate) ? "none" : item.InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(item.talentId) ? "none" : item.talentId) + "</span></td><td class='grid-item-namedate'><b>Recruiter:</b><span> " + (string.IsNullOrWhiteSpace(item.recruiter.Name) ? "none" : item.recruiter.Name) + "</span></td></tr></table>");


                    if (item.interviewBy == "I")
                    {
                        sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(item.InterviewDate) ? "none" : item.InterviewDate + "</span></td><td class='grid-item-namedate'><b>Interview By:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewBy) ? "none" : "Internal") + "</span></td></tr>"));
                        sb.Append("<tr>< td class='grid-item'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    }
                    else if (item.interviewBy == "E")
                    {
                        sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(item.InterviewDate) ? "none" : item.InterviewDate + "</span></td><td class='grid-item-namedate'><b>Interview By:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewBy) ? "none" : "External") + " (" + (string.IsNullOrWhiteSpace(item.ExternalAgency.name) ? "none" : item.ExternalAgency.name) + ")" + "</span></td></tr>"));
                        sb.Append("<tr>< td class='grid-item'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    }
                    else if (item.interviewBy == "M")
                    {
                        sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Assessment Date:</b><span> " + (string.IsNullOrWhiteSpace(item.AssessmentDate) ? "none" : item.AssessmentDate + "</span></td><td class='grid-item-namedate'><b>Assessment On:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewBy) ? "none" : "Mettl") + "</span></td></tr>"));
                        sb.Append("<tr>< td class='grid-item'><b>Mettle Score:</b><span> " + (string.IsNullOrWhiteSpace(item.testScore) ? "none" : item.testScore) + "</span></td></tr></table>");
                    }
                    else
                    {
                        sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(item.InterviewDate) ? "none" : item.InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interview By: N/A</b></td></tr>");
                        sb.Append("<tr><td class='grid-item'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    }

                    if (item.interviewBy != "E")
                    {
                        sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.technical) ? "none" : item.technical) + "</span></td></tr>");
                        sb.Append("<tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr>");
                        sb.Append("<tr>< td class='grid-item'><b>Limitation:</b><span> " + (string.IsNullOrWhiteSpace(item.limitations) ? "none" : item.limitations) + "</span></td></tr>");
                        sb.Append("<tr>< td class='grid-item'><b>Non Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.nonTechnical) ? "none" : item.nonTechnical) + "</span></td></tr>");
                        //sb.Append("<tr>< td class='grid-item'><b>Tech Remark:</b><span> " + (string.IsNullOrWhiteSpace(item.techRemarks) ? "none" : item.techRemarks) + "</span></td></tr>");
                    }
                     if (!string.IsNullOrWhiteSpace(item.techRemarks) || item.interviewBy == "E")
                    {
                        sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Tech Remark:</b><span> " + (string.IsNullOrWhiteSpace(item.techRemarks) ? "none" : item.techRemarks) + "</span></td></tr></table>");

                    }
                    else
                    {
                        //var newfeedback = rlist.roundList.Where(o => o.isNewFeedback.ToString() == "Y").FirstOrDefault().thId;
                        if (isNewFeedback == 'F')
                        {

                        }

                          else  if (isNewFeedback == 'Y')                        {
                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'><b>Detailed Technical Feedback</b></th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");

                            //sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Technical Skills Proficiencies & Practical Skills</th></tr>");
                            //sb.Append("<tr>");
                            //sb.Append("<td>");
                            //sb.Append("<div>");
                            //sb.Append("<p><b>Is the candidate familiar with specific tools,programming languages, or technologies necessary for the job?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.familiarProgramTechnolog) ? "NA" : item.familiarProgramTechnolog) + "</p>");
                            //sb.Append("<p><b>Which technical skills did you evaluate during the technical discussion & how?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.technicalSkillsEvaluat) ? "NA" : item.technicalSkillsEvaluat) + "</p>");
                            //sb.Append("<p><b>Did the candidate take the coding challenges?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateCodingChallenge) ? "NA" : (string.Equals(item.candidateCodingChallenge, "Y") ? "Yes" : "No")) + "</p>");
                            //sb.Append("</div>");
                            //sb.Append("</td>");
                            //sb.Append("</tr>");
                            //sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Fundamental Knowledge</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Did you assess the candidate's knowledge of the principles underlying the role? (For example: Algorithm, Design pattern, Programming skills).</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.assessRoleKnowledg) ? "NA" : item.assessRoleKnowledg) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Problem Solving/ coding and Logical Thinking</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Did you provide complex problems or case scenarios to evaluate the candidate's approach towards problem-solving? How does the candidate approach complex problems?</b></p>");
                            sb.Append("<p>" + "Answer: " +
                                (string.IsNullOrWhiteSpace(item.candidatePrblmSolvingApproch) ? "NA" : item.candidatePrblmSolvingApproch) +
                                " " +
                                (string.IsNullOrWhiteSpace(item.candidateApprochComplexPrblm) ? " " : item.candidateApprochComplexPrblm) +
                                "</p>");
                            //sb.Append("<p><b>Did you provide complex problems or case scenarios to evaluate the candidate's approach towards problem-solving?How does the candidate approach complex problems?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidatePrblmSolvingApproch) ? "NA" : item.candidatePrblmSolvingApproch) + "</p>");
                            //sb.Append("<p><b>How does the candidate approach complex problems?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateApprochComplexPrblm) ? "NA" : item.candidateApprochComplexPrblm) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            //sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Industry/ Domain Knowledge</th></tr>");
                            //sb.Append("<tr>");
                            //sb.Append("<td>");
                            //sb.Append("<div>");
                            //sb.Append("<p><b>Does the candidate possess experience/ knowledge related to specific industry or Domain?</b></p>");
                            //sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidatePossesIndustryDomExp) ? "NA" : item.candidatePossesIndustryDomExp) + "</p>");
                            //sb.Append("</div>");
                            //sb.Append("</td>");
                            //sb.Append("</tr>");
                            //sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Cultural Fit & Adaptability</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Do you think the candidate is will be aligned with infogain culture and the core values? Did the candidate demonstrate the ability to adapt to change at work?</b></p>");
                            sb.Append("<p>" + "Answer: " +
                                (string.IsNullOrWhiteSpace(item.candidateFitForInfogain) ? "NA" : item.candidateFitForInfogain) + "</p>");                            
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");
                        }
                        else
                        {
                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'><b>Detailed Technical Feedback</b></th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Technical Skills Proficiencies & Practical Skills</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Is the candidate familiar with specific tools,programming languages, or technologies necessary for the job?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.familiarProgramTechnolog) ? "NA" : item.familiarProgramTechnolog) + "</p>");
                            sb.Append("<p><b>Which technical skills did you evaluate during the technical discussion & how?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.technicalSkillsEvaluat) ? "NA" : item.technicalSkillsEvaluat) + "</p>");
                            sb.Append("<p><b>Did the candidate take the coding challenges?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateCodingChallenge) ? "NA" : (string.Equals(item.candidateCodingChallenge, "Y") ? "Yes" : "No")) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Fundamental Knowledge</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Did you assess the candidate's knowledge of the principles underlying the role? (For example: Algorithm, Design pattern, Programming skills).</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.assessRoleKnowledg) ? "NA" : item.assessRoleKnowledg) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Problem Solving/ coding and Logical Thinking</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Did you provide complex problems or case scenarios to evaluate the candidate's approach towards problem-solving?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidatePrblmSolvingApproch) ? "NA" : item.candidatePrblmSolvingApproch) + "</p>");
                            sb.Append("<p><b>How does the candidate approach complex problems?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateApprochComplexPrblm) ? "NA" : item.candidateApprochComplexPrblm) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Industry/ Domain Knowledge</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Does the candidate possess experience/ knowledge related to specific industry or Domain?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidatePossesIndustryDomExp) ? "NA" : item.candidatePossesIndustryDomExp) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");

                            sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Cultural Fit & Adaptability</th></tr>");
                            sb.Append("<tr>");
                            sb.Append("<td>");
                            sb.Append("<div>");
                            sb.Append("<p><b>Do you think the candidate is/ will be aligned with infogain culture and the core values? Please site specific examples.</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateFitForInfogain) ? "NA" : item.candidateFitForInfogain) + "</p>");
                            sb.Append("<p><b>Did the candidate demonstrate the ability to adapt to change at work?</b></p>");
                            sb.Append("<p>" + "Answer: " + (string.IsNullOrWhiteSpace(item.candidateAbilityToAdoptChangeWork) ? "NA" : item.candidateAbilityToAdoptChangeWork) + "</p>");
                            sb.Append("</div>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");
                            sb.Append("</td>");
                            sb.Append("</tr>");
                            sb.Append("</table>");
                        }
                        
                    }
                    if (item.interviewBy != "E")
                    {
                        sb.Append("<tr>< td class='grid-item'><b>Groomable:</b><p><span>1. " + (string.IsNullOrWhiteSpace(item.GroomableArea1) ? "none" : item.GroomableArea1) + "</span></p><p><span>2. " + (string.IsNullOrWhiteSpace(item.GroomableArea2) ? "none" : item.GroomableArea2) + "</span></p><p><span>3. " + (string.IsNullOrWhiteSpace(item.GroomableArea3) ? "none" : item.GroomableArea3) + "</span></p></td></tr></table>");

                        sb.Append("<h3 style=\"text-align: left; color: #1f6a9f; margin-bottom: 20px;\">Technical Assessment</h3>");

                        sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Project specific skills</th><th class='itext_header'>Rating</th></tr>");

                        foreach (var ele in item.areas)
                        {
                            sb.Append("<tr>");
                            sb.Append("<td>" + (string.IsNullOrWhiteSpace(ele.Area) ? "none" : ele.Area) + "</td>");
                            sb.Append("<td>" + ele.rating + "</td></tr>");

                        }
                        sb.Append("</table>");

                        if (item.autoQuestionFeedback != null && item.autoQuestionFeedback.Count > 0)
                        {
                            sb.Append("<table class='itext_Table'><tr><th class='itext_header' style='width: 60%;'><i>Gen AI Questions Asked</i></th><th class='itext_header' style='width: 20%;'>Panel's feedback on candidate's response</th><th class='itext_header' style='width: 10%;'>Rating</th></tr>");

                            foreach (var element in item.autoQuestionFeedback)
                            {
                                sb.Append("<tr>");
                                sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.QuestionAuto) ? "NA" : element.QuestionAuto) + "</td>");
                                sb.Append("<td>" + (string.IsNullOrWhiteSpace(element.AutoQAns) ? "NA" : element.AutoQAns) + "</td>");
                                sb.Append("<td>" + element.rating + "</td></tr>");
                            }

                            sb.Append("</table>");
                        }
                    }

                }

                //Client round

                else if (interviewTypeId == 3 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2)
                {
                    CultureInfo culture = new CultureInfo("en-US");
                    DateTime InterviewDateTime = Convert.ToDateTime(item.InterviewDate, culture);
                    var day = (InterviewDateTime.Day % 10 == 1 && InterviewDateTime.Day % 100 != 11) ? "st"
                      : (InterviewDateTime.Day % 10 == 2 && InterviewDateTime.Day % 100 != 12) ? "nd"
                      : (InterviewDateTime.Day % 10 == 3 && InterviewDateTime.Day % 100 != 13) ? "rd"
                      : "th";
                    string InterviewDate = string.Format(InterviewDateTime.ToString("dd{0} MMM yyyy HH mm tt"), day);

                    sb.Append("<div class='itext_round_title'><h5><b>" + item.interviewType.Type + "</b></h5></div>");
                    sb.Append("<br><br>");
                    sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(InterviewDate) ? "none" : InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(item.talentId) ? "none" : item.talentId) + "</span></td><td class='grid-item-namedate'><b>Recruiter:</b><span> " + (string.IsNullOrWhiteSpace(item.recruiter.Name) ? "none" : item.recruiter.Name) + "</span></td></tr></table>");
                    //sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr></table>");

                    //sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(InterviewDate) ? "none" : InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    //sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr></table>");
                    //sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.technical) ? "none" : item.technical) + "</span></td></tr>");
                    //sb.Append("<tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr>");
                    //sb.Append("<tr>< td class='grid-item'><b>Limitation:</b><span> " + (string.IsNullOrWhiteSpace(item.limitations) ? "none" : item.limitations) + "</span></td></tr>");
                    //sb.Append("<tr>< td class='grid-item'><b>Non Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.nonTechnical) ? "none" : item.nonTechnical) + "</span></td></tr>");
                    
                    sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.techRemarks) ? "none" : item.techRemarks) + "</span></td></tr></table>");
                    // sb.Append("<tr>< td class='grid-item'><b>Groomable:</b><p><span>1. " + (string.IsNullOrWhiteSpace(item.GroomableArea1) ? "none" : item.GroomableArea1) + "</span></p><p><span>2. " + (string.IsNullOrWhiteSpace(item.GroomableArea2) ? "none" : item.GroomableArea2) + "</span></p><p><span>3. " + (string.IsNullOrWhiteSpace(item.GroomableArea3) ? "none" : item.GroomableArea3) + "</span></p></td></tr></table>");

                    //sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Areas</th><th class='itext_header'>Rating</th></tr>");

                    //foreach (var ele in item.areas)
                    //{
                    //    sb.Append("<tr>");
                    //    sb.Append("<td>" + (string.IsNullOrWhiteSpace(ele.Area) ? "none" : ele.Area) + "</td>");
                    //    sb.Append("<td>" + ele.rating + "</td></tr>");

                    //}
                    //sb.Append("</table>");
                }
                //Management Round
                else if (interviewTypeId == 5 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2)
                {
                    CultureInfo culture = new CultureInfo("en-US");
                    DateTime InterviewDateTime = Convert.ToDateTime(item.InterviewDate, culture);
                    var day = (InterviewDateTime.Day % 10 == 1 && InterviewDateTime.Day % 100 != 11) ? "st"
                      : (InterviewDateTime.Day % 10 == 2 && InterviewDateTime.Day % 100 != 12) ? "nd"
                      : (InterviewDateTime.Day % 10 == 3 && InterviewDateTime.Day % 100 != 13) ? "rd"
                      : "th";
                    string InterviewDate = string.Format(InterviewDateTime.ToString("dd{0} MMM yyyy HH mm tt"), day);

                    sb.Append("<div class='itext_round_title'><h5><b>" + item.interviewType.Type + "</b></h5></div>");
                    sb.Append("<br><br>");
                    sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(InterviewDate) ? "none" : InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                    sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(item.talentId) ? "none" : item.talentId) + "</span></td><td class='grid-item-namedate'><b>Recruiter:</b><span> " + (string.IsNullOrWhiteSpace(item.recruiter.Name) ? "none" : item.recruiter.Name) + "</span></td></tr></table>");
                    sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr></table>");
                    sb.Append("<table class='grid-container1 grid-container-align'><tr>< td class='grid-item'><b>Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.technical) ? "none" : item.technical) + "</span></td></tr>");
                    sb.Append("<tr>< td class='grid-item'><b>Remarks:</b><span> " + (string.IsNullOrWhiteSpace(item.remarks) ? "none" : item.remarks) + "</span></td></tr>");
                    sb.Append("<tr>< td class='grid-item'><b>Limitation:</b><span> " + (string.IsNullOrWhiteSpace(item.limitations) ? "none" : item.limitations) + "</span></td></tr>");
                    sb.Append("<tr>< td class='grid-item'><b>Non Technical:</b><span> " + (string.IsNullOrWhiteSpace(item.nonTechnical) ? "none" : item.nonTechnical) + "</span></td></tr>");
                    sb.Append("<tr>< td class='grid-item'><b>Tech Remark:</b><span> " + (string.IsNullOrWhiteSpace(item.techRemarks) ? "none" : item.techRemarks) + "</span></td></tr></table>");


                    sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Areas</th><th class='itext_header'>Rating</th></tr>");

                    foreach (var ele in item.areas)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + (string.IsNullOrWhiteSpace(ele.Area) ? "none" : ele.Area) + "</td>");
                        sb.Append("<td>" + ele.rating + "</td></tr>");

                    }
                    sb.Append("</table>");
                }

                //HR Final round

                //else if (interviewTypeId == 4 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2 || interviewTypeId == 6 && interviewStatusId != 1 && interviewStatusId != 3 && interviewStatusId != 2)
                //{
                //    var curren_type = getCurrencySymbol(rlist.currency.Name);
                //    CultureInfo culture = new CultureInfo("en-US");
                //    DateTime InterviewDateTime = Convert.ToDateTime(item.InterviewDate, culture);
                //    var day = (InterviewDateTime.Day % 10 == 1 && InterviewDateTime.Day % 100 != 11) ? "st"
                //      : (InterviewDateTime.Day % 10 == 2 && InterviewDateTime.Day % 100 != 12) ? "nd"
                //      : (InterviewDateTime.Day % 10 == 3 && InterviewDateTime.Day % 100 != 13) ? "rd"
                //      : "th";
                //    string InterviewDate = string.Format(InterviewDateTime.ToString("dd{0} MMM yyyy HH mm tt"), day);

                //    sb.Append("<div class='itext_round_title'><h5><b>" + item.interviewType.Type + "</b></h5></div>");
                //    sb.Append("<table class='grid-container grid-container-align'><tr><td class='grid-item-namedate'><b>Interview Date:</b><span> " + (string.IsNullOrWhiteSpace(InterviewDate) ? "none" : InterviewDate) + "</span></td><td class='grid-item-namedate'><b>Interviewer Name:</b><span> " + (string.IsNullOrWhiteSpace(item.interviewer.Name) ? "none" : item.interviewer.Name) + "</span></td></tr></table>");
                //    sb.Append("<table class='grid-container grid-container-align'><tr> <td class='grid-item-namedate'><b>Talent ID:</b><span> " + (string.IsNullOrWhiteSpace(item.talentId) ? "none" : item.talentId) + "</span></td><td class='grid-item-namedate'><b>Recruiter:</b><span> " + (string.IsNullOrWhiteSpace(item.recruiter.Name) ? "none" : item.recruiter.Name) + "</span></td></tr></table>");

                //    sb.Append("<table class='itext_Table'><tr><th class='itext_header'>Details</th><th class='itext_header'></th></tr>");

                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Final Decision: </b><span>" + item.finalDecision + " </span></td>");
                //    sb.Append("<td><b>Remarks: </b><span>" + item.remarks + "</span></td>");
                //    sb.Append("</tr>");

                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Designation: </b><span>" + item._designation.desigName + " </span></td>");
                //    sb.Append("<td><b>Final CTC Offered: </b><span>" + curren_type + item.CTC + "</span></td>");
                //    sb.Append("</tr>");


                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Joining Bonus: </b><span>" + curren_type + item.joiningBonus + "</span></td>");
                //    sb.Append("<td><b>Notice Buy Out: </b><span>" + curren_type + item.NoticeBuyOut + "</span></td>");
                //    sb.Append("</tr>");

                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Travel Expense: </b><span>" + curren_type + item.TravelExp + "</span></td>");
                //    sb.Append("<td><b>Relocation Expense: </b><span>" + curren_type + item.RelocationExp + "</span></td>");
                //    sb.Append("</tr>");

                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Retention Bonus: </b><span>" + curren_type + item.RetentionBonus + "</span></td>");
                //    sb.Append("<td><b>Skill: </b><span>" + item.primarySkill.SkillName + "</span></td>");
                //    sb.Append("</tr>");


                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Offer given by: </b><span>" + item.offeredby.Name + "</span></td>");
                //    sb.Append("<td><b>Offer given on: </b><span>" + item.offeredOn + "</span></td>");
                //    sb.Append("</tr>");

                //    sb.Append("<tr>");
                //    sb.Append("<td><b>Remarks(If any): </b><span>" + item.hrFinal_Remarks + "</span></td>");
                //    sb.Append("<td></td>");

                //    sb.Append("</tr>");
                //    sb.Append("</table>");

                //}


            }
            //sb.Append("<footer style='text-align:center;padding-top:20px;'><h5>Infogain Confidential</h5></footer>");
            ////sb.Append("<footer style='text-align:right;padding-top:20px;'> Page <span> &p;</span > of < span> &P;</ span> pages</footer>");
            List<string> cssFiles = new List<string>();
            cssFiles.Add(@"/Content/bootstrap.css");
            cssFiles.Add(@"/Content/Site.css");

            //StringReader sr = new StringReader(sb.ToString());
            Document doc = new Document(PageSize.A4, 20, 20, 30, 30);
            HTMLWorker htmlparser = new HTMLWorker(doc);
            MemoryStream memoryStream = new MemoryStream();

            PdfWriter writer = PdfWriter.GetInstance(doc, memoryStream);
            writer.CloseStream = false;

            HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
            htmlContext.SetTagFactory(Tags.GetHtmlTagProcessorFactory());
            PdfWriterPipeline pdf = new PdfWriterPipeline(doc, writer);
            doc.Open();
            HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
            ICSSResolver cssResolver = XMLWorkerHelper.GetInstance().GetDefaultCssResolver(false);
            cssFiles.ForEach(i => cssResolver.AddCssFile(System.Web.HttpContext.Current.Server.MapPath(i), true));

            //Create and attach pipline, without pipline parser will not work on css
            IPipeline pipeline = new CssResolverPipeline(cssResolver, new HtmlPipeline(htmlContext, new PdfWriterPipeline(doc, writer)));

            //Create XMLWorker and attach a parser to it
            XMLWorker worker = new XMLWorker(pipeline, true);
            XMLParser xmlParser = new XMLParser(true, worker, Encoding.Unicode);




            using (var stringReader = new StringReader(sb.ToString()))
            {
                xmlParser.Parse(stringReader);
            }

            doc.Close();
            pdfBytes = memoryStream.ToArray();
            //memoryStream.Close();


            // pdfBytes = memoryStream.ToArray();
            string newFile = "newFile.pdf";

            PdfReader reader = new PdfReader(pdfBytes);
            Rectangle size = reader.GetPageSizeWithRotation(1);
            Document doc1 = new Document(size);
            // MemoryStream ms = new MemoryStream();
            // open the writer
            //FileStream fs = new FileStream(newFile, FileMode.Create, FileAccess.Write);
            PdfWriter writer1 = PdfWriter.GetInstance(doc1, memoryStream);

            doc1.Open();
            PdfTemplate footerTemplate;
            int n = reader.NumberOfPages;
            // the pdf content
            PdfContentByte cb = writer1.DirectContent;
            footerTemplate = cb.CreateTemplate(50, 50);
            int p = 0;
            String text = "Page " + writer1.PageNumber + " of ";
            //Console.WriteLine("There are " + n + " pages in the document.");
            for (int page = 1; page <= reader.NumberOfPages; page++)
            {
                doc.NewPage();
                p++;

                PdfImportedPage importedPage = writer.GetImportedPage(reader, page);
                cb.AddTemplate(importedPage, 0, 0);

                BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);



                cb.BeginText();
                cb.SetFontAndSize(bf, 12);
                cb.SetTextMatrix(doc1.PageSize.GetRight(180), doc.PageSize.GetBottom(30));
                cb.ShowText(text);
                cb.EndText();
                float len = bf.GetWidthPoint(text, 12);
                cb.AddTemplate(footerTemplate, doc1.PageSize.GetRight(180) + len, doc1.PageSize.GetBottom(30));
            }

            doc1.Close();
            memoryStream.Close();
            writer.Close();
            reader.Close();


            return pdfBytes;
        }

        [Route("downloadPdfFeedBackByRoundId")]
        [HttpPost]
        public HttpResponseMessage downloadPdfFeedBackByRoundId([FromBody] roundIdList roundIdBody)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string empid = "";
                int result;

                candidateDetailsInfo cinfo = objRepo.getCandidateDetailsByCid(roundIdBody.cid, empid, out result);
                RoundDetails rlist = objRepo.getCurrentRoundDetailsByCid(roundIdBody.cid, empid, out result);

                logger.LogRequestAsync("downloadPdfFeedBackByRoundId", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "downloadPdfFeedBackByRoundId", claims[5].Value);
                    response = Request.CreateErrorResponse(HttpStatusCode.Unauthorized, AppConstants.UnauthorizedMessage);
                    return response;
                }

                byte[] buffer = createPDF(roundIdBody.cid, rlist, roundIdBody);

                response.StatusCode = HttpStatusCode.OK;
                response.Content = new StreamContent(new MemoryStream(buffer));
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                response.Content.Headers.ContentLength = buffer.Length;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "InterviewFeedback.pdf"
                };

                logger.LogResponseAsync("downloadPdfFeedBackByRoundId", "200 OK");
            }
            catch (Exception e)
            {
                logger.LogErrorAsync("downloadPdfFeedBackByRoundId", e);
                ExceptionLogging.SendExcepToDB(e, "Interview", "downloadPdfFeedBackByRoundId");
                response = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message);
            }

            return response;
        }

        [Route("InterviewFeedbackpdf")]
        [HttpGet]
        public HttpResponseMessage GetInterviewFeedbackpdf(int cid)
        {

            //string empid = "109130";
            string empid = "";
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                int result;
                candidateDetailsInfo cinfo = objRepo.getCandidateDetailsByCid(cid, empid,out result);
                RoundDetails rlist = objRepo.getCurrentRoundDetailsByCid(cid, empid,out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;

                byte[] buffer = createPDF(cid, rlist, null);


                response.StatusCode = HttpStatusCode.OK;
                response.Content = new StreamContent(new MemoryStream(buffer));

                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                response.Content.Headers.ContentLength = buffer.Length;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "InterviewFeedback.pdf"
                };

            }
            catch (Exception e)
            {
                response = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message);
            }

            return response;
        }

        [Route("getCandidateDetailByTHID")]
        [HttpGet]
        public IHttpActionResult getCandidateDetailByTHID(int thid, string EmpId, int page, int pageSize, string search)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateDetailByTHID(thid, EmpId, page, pageSize, search, out result);

                logger.LogRequestAsync("getCandidateDetailByTHID", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateDetailByTHID", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCandidateDetailByTHID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDetailByTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateDetailByTHID");
                return BadRequest("There is some error! Try again later");
            }
        }
        // Added by jivan
        [Route("getCandidateListByID")]
        [HttpPost]
        public IHttpActionResult getCandidateListByID([FromBody] InterviewMultiselectFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateListByID(obj, claims[5].Value, out result);

                logger.LogRequestAsync("getCandidateListByID", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateListByID", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCandidateListByID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateListByID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateListByID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllCandidateProfileList")]
        [HttpGet]
        public IHttpActionResult getAllCandidateProfileList(string EmpId, int page, int pageSize, string search, int? thid = null, int? hiringLocationId = null)
        {
            try
            {
                int result;
                var data = objRepo.getAllCandidateProfileList(hiringLocationId, thid, EmpId, page, pageSize, search, out result);

                logger.LogRequestAsync("getAllCandidateProfileList", Request);

                if (result == -1 || result == -9)
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    logger.LogUnauthorizedAccessAsync(Request, "getAllCandidateProfileList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllCandidateProfileList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllCandidateProfileList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getAllCandidateProfileList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateListByIDReport")]
        [HttpPost]
        public IHttpActionResult getCandidateListByIDReport([FromBody] InterviewMultiselectFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateListByIDReport(obj, claims[5].Value, out result);

                logger.LogRequestAsync("getCandidateListByIDReport", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateListByIDReport", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCandidateListByIDReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateListByIDReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateListByIDReport");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("getAllCandidateDetailsByCID")]
        [HttpGet]
        public IHttpActionResult getAllCandidateDetailsByCID(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getAllCandidateDetailsByCID(cid, claims[5].Value, out result);

                logger.LogRequestAsync("getAllCandidateDetailsByCID", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllCandidateDetailsByCID", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllCandidateDetailsByCID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllCandidateDetailsByCID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getAllCandidateDetailsByCID");
                return BadRequest("There is some error! Try again later");
            }
        }

        //Added by jivan
        [Route("getAllCandidateTransferListByID")]
        [HttpPost]
        public IHttpActionResult getAllCandidateTransferListByID([FromBody] InterviewMultiselectFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getAllCandidateTransferListByID(obj, claims[5].Value, out result);

                logger.LogRequestAsync("getAllCandidateTransferListByID", Request);

                if (result == -1 || result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllCandidateTransferListByID", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllCandidateTransferListByID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllCandidateTransferListByID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateListByID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addupdateCandidateDetails")]
        [HttpPost]
        public async Task<IHttpActionResult> addupdateCandidateDetails()
        {
            try
            {
                CandidateDetails fb = new CandidateDetails();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    //fb.Resume = HttpContext.Current.Request.Files[0].FileName;
                    fb.Resume = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                    fb.Path = ConfigurationManager.AppSettings["ResumesPath"] + "/" + frm["thid"];
                }
                fb.id = Convert.ToInt32(frm["id"]);
                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.pre_cid = Convert.ToInt32(frm["pre_cid"]);
                fb.ProfileID = Convert.ToInt32(frm["profileId"] == null || frm["profileId"].ToString() == "" ? "0" : frm["profileId"]);
                fb.CSkill_ID = Convert.ToInt32(frm["appliedid"] == null || frm["appliedid"].ToString() == "" ? "0" : frm["appliedid"]);
                fb.c_profileUniqId = Convert.ToInt32(frm["c_profileUniqId"] == null || frm["c_profileUniqId"] == "undefined" || frm["c_profileUniqId"].ToString() == "" ? "0" : frm["c_profileUniqId"]);
                fb.dob = Convert.ToString(frm["dob"]);
                fb.martialstatus = Convert.ToString(frm["martialstatus"]);
                fb.interviewType = Convert.ToInt32(frm["interviewType"]);
                //if (!string.IsNullOrEmpty(frm["identityId"]))
                //{
                fb.identityId = Convert.ToInt32(frm["identityId"]);
                fb.identityNo = Convert.ToString(frm["identityNo"]);
                //}
                fb.statusId = Convert.ToInt32(frm["statusId"]);
                fb.roleId = Convert.ToInt32(frm["roleId"]);
                fb.currencyTypeId = Convert.ToInt32(frm["currencyTypeId"]);
                fb.interviewMode = Convert.ToInt32(frm["interviewMode"]);
                fb.interviewDate = Convert.ToString(Convert.ToDateTime(frm["interviewDate"]));
                fb.interviewDateUTC = frm["interviewDateUTC"] == "" ? "" : frm["interviewDateUTC"];
                fb.interviewTimeZone = frm["interviewTimeZone"] == "" ? "" : frm["interviewTimeZone"];
                fb.joiningDate = Convert.ToString(frm["joiningDate"]);
                fb.FirstName = Convert.ToString(frm["firstName"]);
                fb.MiddleName = Convert.ToString(frm["middleName"]);
                fb.LastName = Convert.ToString(frm["lastName"]);
                fb.email = Convert.ToString(frm["email"]);
                fb.phone = Convert.ToString(frm["phone"]);
                fb.totalExp = Convert.ToString(frm["totalExp"]);
                fb.totalExpMonth = frm["totalExpMonth"];
                fb.totalExp = Convert.ToString(frm["totalExp"]);
                fb.relExpMonth = frm["relExpMonth"].Trim();
                fb.relevantExp = Convert.ToString(frm["relevantExp"]);
                fb.primarySkill = Convert.ToString(frm["primarySkill"]);
                fb.currentCompany = Convert.ToString(frm["currentCompany"]);
                // fb.CountryID = Convert.ToInt32(frm["CountryID"]);
                fb.CountryID = Convert.ToInt32(frm["CountryID"] == null || frm["CountryID"].ToString() == "" ? "0" : frm["CountryID"]);
                fb.StateID = Convert.ToInt32(frm["StateID"] == null || frm["StateID"].ToString() == "" ? "0" : frm["StateID"]);
                fb.CityId = Convert.ToInt32(frm["CityId"]);
                fb.HiringLocation = Convert.ToInt32(frm["HiringLocation"]);
                fb.currentOrg = Convert.ToString(frm["currentOrg"]);
                fb.eduQualification = Convert.ToString(frm["eduQualification"]);
                fb.thid = Convert.ToString(frm["thid"]);
                fb.talentId = Convert.ToString(frm["talentId"]);
                fb.candidateTypeID = Convert.ToString(frm["candidateTypeID"]);
                fb.recruiter = Convert.ToString(frm["recruiter"]);
                fb.panel = Convert.ToString(frm["panel"]);
                fb.Additionalpanel = Convert.ToString(frm["Additionalpanel"]);
                fb.expSalary = Convert.ToString(frm["expSalary"]);
                fb.curSalary = Convert.ToString(frm["curSalary"]);
                fb.SalaryType = Convert.ToInt32(frm["SalaryType"]);
                fb.OtherOffer = Convert.ToString(frm["OtherOffer"]);
                fb.optional = Convert.ToString(frm["optional"]);
                fb.remarks = Convert.ToString(frm["remarks"]);
                fb.username = Convert.ToString(frm["username"]);
                fb.interviewDetails = Convert.ToString(frm["interviewDetails"]);
                fb.createdBy = Convert.ToString(frm["createdBy"]);
                fb.designationid = Convert.ToString(frm["designationid"]);
                fb.offsetDate = Convert.ToInt32(frm["offsetDate"] == null || frm["offsetDate"].ToString() == "" ? "0" : frm["offsetDate"]);
                // fb.Gender = Convert.ToInt32(frm["Gender"]);
                fb.Gender = Convert.ToInt32(frm["Gender"] == null || frm["Gender"].ToString() == "" ? "0" : frm["Gender"]);
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                // fb.JobFamilyID = Convert.ToInt32(frm["JobFamilyID"] == null || frm["JobFamilyID"].ToString() == "" ? "0" : frm["JobFamilyID"]);
                // fb.jobfamilycategory = Convert.ToChar(frm["jobfamilycategory"] == null || frm["jobfamilycategory"].ToString() == "" ? "P" : frm["jobfamilycategory"]);
                fb.CubeID = Convert.ToInt32(frm["CubeID"] == null || frm["CubeID"].ToString() == "" ? "0" : frm["CubeID"]);
                fb.CubeClusterID = Convert.ToInt32(frm["CubeClusterID"] == null || frm["CubeClusterID"].ToString() == "" ? "0" : frm["CubeClusterID"]);
                fb.CubeRoleID = Convert.ToInt32(frm["CubeRoleID"] == null || frm["CubeRoleID"].ToString() == "" ? "0" : frm["CubeRoleID"]);
                fb.gradeId = Convert.ToInt32(frm["gradeId"] == null || frm["gradeId"].ToString() == "" ? "0" : frm["gradeId"]);
                fb.practiceId = Convert.ToInt32(frm["practiceId"] == null || frm["practiceId"].ToString() == "" ? "0" : frm["practiceId"]);
                fb.EmpUnitId = Convert.ToInt32(frm["EmpUnitId"] == null || frm["EmpUnitId"].ToString() == "" ? "0" : frm["EmpUnitId"]);
                fb.gradeBand = frm["gradeBand"];
                fb.interviewDuration = Convert.ToInt32(frm["interviewDuration"] == null || frm["interviewDuration"].ToString() == "" ? "0" : frm["interviewDuration"]);
                fb.EntityId = frm["EntityId"] == "" ? 0 : Convert.ToInt32(frm["EntityId"]);
                fb.CountryCode = Convert.ToInt32(frm["CountryCode"] == null || frm["CountryCode"].ToString() == "" ? "0" : frm["CountryCode"]);
                //fb.IsRenuTeam = Convert.ToChar(frm["isRenuTeam"] == null || frm["isRenuTeam"].ToString() == "" ? "N" : frm["isRenuTeam"]);
                fb.IsFromNaukriAPI = Convert.ToChar(frm["IsFromNaukriAPI"] == null || frm["IsFromNaukriAPI"].ToString() == "" ? "N" : frm["IsFromNaukriAPI"].ToString());
                fb.ApplicantUid = frm["ApplicantUid"] == null ? "" : frm["ApplicantUid"].ToString();
                int RoundId = 0;
                string Message = string.Empty;
                int result = objRepo.addupdateCandidateDetails(fb, ref RoundId, ref Message);
                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                    string tempPath = fb.Path + "/" + result.ToString() + "/";
                    if (!(Directory.Exists(tempPath)))
                    {
                        Directory.CreateDirectory(tempPath);
                    }
                    string fileSavePath = Path.Combine(tempPath, fb.Resume);
                    if (System.IO.File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    //  httpPostedFile.SaveAs(fileSavePath);

                    byte[] fileBytes;
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        httpPostedFile.InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }


                    // Encrypt the file before saving
                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        return BadRequest("Encryption failed due to an unexpected error.");
                    }
                }
                if (result >= 1)
                {

                    NaukriController naukri = new NaukriController();
                    string Stage = ConfigurationManager.AppSettings["NaukriStageShortlist"];

                    if (fb.IsFromNaukriAPI == 'Y' && fb.ApplicantUid != null)
                    {
                        await naukri.UpdateApplicationStage(fb.ApplicantUid, Stage);
                    }

                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    //get Ai Assesment based of resume 
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(result, fb.createdBy, 1);
                    // System.Threading.Tasks.Task<string> ResumeParse = common.ResumeParse(result, fb.createdBy);
                    if (fb.interviewType != 1)
                    {
                        if (fb.HiringLocation != 3)
                        {
                            SendScheduleNotification(RoundId, result, fb.createdBy, 0);
                        }
                    }
                    if (fb.HiringLocation == 3)
                    {
                        return Ok("Interview scheduled for " + fb.Name + " ( " + fb.email + " ) ");
                    }
                    else
                    {
                        return Ok("Interview scheduled for " + fb.email);
                    }

                }
                else if (result == -2)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "addupdateCandidateDetailsFile");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("updateInterview")]
        [HttpPost]
        public IHttpActionResult updateInterview([FromBody] InterviewFeedbackStatus intStatus)
        {
            try
            {
                logger.LogRequestAsync("updateInterview", Request);

                int result = objRepo.updateInterview(intStatus);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "updateInterview", ClaimsPrincipal.Current.Identities.First().Claims.ToList()[5].Value);
                    return authResult;
                }
                else if (result >= 1)
                {
                    string notificationEnb = ConfigurationManager.AppSettings["NotificationEnable"];
                    if (notificationEnb == "1")
                    {
                        System.Threading.Tasks.Task<string> CalanderId = common.rescheduleCancelEventGraph(intStatus.cid, intStatus.UpdatedBy, intStatus.InterviewStatus, 1);
                    }
                    if (intStatus.InterviewStatus == 2)
                    {
                        logger.LogResponseAsync("updateInterview", "200 OK - Interview Cancelled");
                        return Ok("Interview Cancelled");
                    }
                    else if (intStatus.InterviewStatus == 3)
                    {
                        logger.LogResponseAsync("updateInterview", "200 OK - Interview Rescheduled");
                        return Ok("Interview Rescheduled");
                    }
                    else
                    {
                        logger.LogResponseAsync("updateInterview", "200 OK - Interview Updated");
                        return Ok("Interview Updated");
                    }
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("updateInterview", "400 Bad Request - No interview scheduled");
                    return BadRequest("There is no interview scheduled");
                }
                else
                {
                    logger.LogResponseAsync("updateInterview", "400 Bad Request - Error");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateInterview", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "updateInterview");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public void SendScheduleNotification(int RoundId, int cid, string AddedBy, int flag)
        {
            int result;
            DataSet ds = objRepo.GetRecipientsAndDetailForSMS(RoundId, AddedBy, out result);
            var authResult = CommonController.HandleAuthorizationResult(result);
            
            try
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    // Get credentials from web.config
                    string user = ConfigurationManager.AppSettings["smscountryUser"];
                    string password = ConfigurationManager.AppSettings["smscountryPassword"];
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    DataRow dr = ds.Tables[0].Rows[0];
                    string strUrl = "http://api.smscountry.com/SMSCwebservice_bulk.aspx?User="+ user + "desk&passwd="+ password + "&mobilenumber=" + dr["mobileNo"] + "&message=Hi " + dr["name"] + ",%0aYour interview has been scheduled as follows:";
                    strUrl = strUrl + "%0aDate: " + ds.Tables[0].Rows[0]["Date"].ToString();
                    strUrl = strUrl + "%0aTime: " + ds.Tables[0].Rows[0]["Time"].ToString();
                    strUrl = strUrl + "%0aMode of interview:" + ds.Tables[0].Rows[0]["mode"].ToString();

                    strUrl = strUrl + "%0aPlease visit Infogain website: www.infogain.com&sid=GDCITS&mtype=N&DR=Y";
                    // Create a request object  
                    WebRequest request = HttpWebRequest.Create(strUrl.ToString());
                    // Get the response back  
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    Stream s = (Stream)response.GetResponseStream();
                    StreamReader readStream = new StreamReader(s);
                    string dataString = readStream.ReadToEnd();
                    response.Close();
                    s.Close();
                    readStream.Close();

                    WhatsappMessage obj = new WhatsappMessage();

                    obj.SendWhatsappNotification(dr["mobileNo"].ToString(), dr["name"].ToString(), dr["Date"].ToString(), dr["Time"].ToString(), dr["mode"].ToString());
                }
            }
            catch (Exception ex) { ExceptionLogging.SendExcepToDB(ex, "InterviewSMS", "InterviewFeedback"); }
            try
            {
                //  System.Threading.Tasks.Task<string> CalanderId = common.addToCalendar(cid, AddedBy, flag);
             //   System.Threading.Tasks.Task<string> autQuestionSave = common.UpdateAutoQuestionsForTechRound(cid, AddedBy);
                string notificationEnb = ConfigurationManager.AppSettings["NotificationEnable"];
                if (notificationEnb == "1" && Convert.ToInt32(ds.Tables[0].Rows[0]["IsConversionEmployee"]) !=1 || Convert.ToInt32(ds.Tables[0].Rows[0]["IsConversionEmployee"]) == 1&& Convert.ToInt32(ds.Tables[0].Rows[0]["InterviewTypeId"])==4)
                {
                    System.Threading.Tasks.Task<string> CalanderId = common.addToCalendarGraph(cid, AddedBy, flag,1);
                    //System.Threading.Tasks.Task<string> autQuestionSave = common.UpdateAutoQuestionsForTechRound(cid, AddedBy);
                }

                if (Convert.ToInt32(ds.Tables[0].Rows[0]["IsConversionEmployee"]) == 1 && Convert.ToInt32(ds.Tables[0].Rows[0]["InterviewTypeId"]) != 4)
                {
                   objRepo.SendC2HInterviewScheduleNotification(cid, RoundId, AddedBy);
                }

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "addToCalendar", "InterviewFeedback");
            }
        }

        public void SendEmailATS(int cid, string AddedBy, string flag)
        {

            try
            {
                string notificationEnb = ConfigurationManager.AppSettings["NotificationEnable"];
                if (notificationEnb == "1")
                {
                    if (flag == "M")
                    {
                        System.Threading.Tasks.Task<string> sendEmail = common.sendEmailForMettlRound(cid, AddedBy);
                    }

                }

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "sendEmail", "InterviewFeedback");
            }
        }

        [Route("ScheduleBulkInterviews")]
        [HttpPost]
        public IHttpActionResult ScheduleBulkInterviews()
        {
            Common cmn = new Common();
            try
            {
                DateTime thisDay = DateTime.Today;

                DataTable dtStatus = CreateResponseTable();
                if (HttpContext.Current.Request.Files.Count <= 0)
                {
                    return BadRequest("No file attached");
                }

                CandidateDetailsBulk fb = new CandidateDetailsBulk();
                var frm = HttpContext.Current.Request.Form;
                string path = HttpContext.Current.Server.MapPath("~/TempFIles/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                var _file = HttpContext.Current.Request.Files[0];
                _file.SaveAs(path + "/" + _file.FileName);
                DataTable dt = ConvertExcelToDataTable(path + "/" + _file.FileName);
                int i = 0;
                int p = 0;
                DataView dv = new DataView(dt);
                dv.RowFilter = "[Candidate First Name] <> ''";


                foreach (DataRow dr in dv.ToTable().Rows)
                {
                    try
                    {
                        if (HttpContext.Current.Request.Files[p + 1] != null)
                        {

                            fb.interviewDate = Convert.ToString(Convert.ToDateTime(cmn.ConvertDMYtoYMD(Convert.ToDateTime(dr["Interview Date"]).ToShortDateString()) + " " + Convert.ToDateTime(dr["Time"]).ToShortTimeString()));
                            fb.joiningDate = Convert.ToString(Convert.ToDateTime(cmn.ConvertDMYtoYMD(Convert.ToDateTime(dr["Tentative joining Date"]).ToShortDateString()) + " " + Convert.ToDateTime(dr["Time"]).ToShortTimeString()));
                            DateTime dt1 = DateTime.Now.Date;

                            DateTime x = Convert.ToDateTime(fb.interviewDate.ToString()).Date;
                            DateTime y = Convert.ToDateTime(thisDay.ToString()).Date;
                            if (Convert.ToDateTime(fb.interviewDate.ToString()).Date < Convert.ToDateTime(thisDay.ToString()).Date)
                            {
                                return BadRequest("Select correct interview date");
                            }
                            if (Convert.ToDateTime(fb.joiningDate.ToString()).Date < Convert.ToDateTime(thisDay.ToString()).Date)
                            {
                                return BadRequest("Select correct Joining date");
                            }

                        }
                    }
                    catch (Exception ex)
                    {
                        dtStatus = AddRowToDatatable(dtStatus, fb.FirstName, fb.email, ex.Message, "error");
                    }
                    finally
                    {
                        p = p + 1;
                    }

                }


                foreach (DataRow dr in dv.ToTable().Rows)
                {
                    try
                    {
                        if (HttpContext.Current.Request.Files[i + 1] != null)
                        {
                            fb.Resume = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i + 1].FileName);
                            fb.Path = ConfigurationManager.AppSettings["ResumesPath"] + "/" + dr["talent id"];
                            fb.interviewType = "Screening Round";
                            fb.currency = Convert.ToString(dr["Currency"]);
                            fb.interviewMode = Convert.ToString(dr["Interview Mode"]);
                            fb.interviewDate = Convert.ToString(Convert.ToDateTime(cmn.ConvertDMYtoYMD(Convert.ToDateTime(dr["Interview Date"]).ToShortDateString()) + " " + Convert.ToDateTime(dr["Time"]).ToShortTimeString()));
                            fb.joiningDate = Convert.ToString(cmn.ConvertDMYtoYMD(dr["Tentative joining Date"].ToString()));
                            fb.profileSource = Convert.ToString(dr["Profile Source"]);
                            fb.FirstName = Convert.ToString(dr["Candidate First Name"]);
                            fb.MiddleName = Convert.ToString(dr["Candidate Middle Name"]);
                            fb.LastName = Convert.ToString(dr["Candidate Last Name"]);
                            fb.email = Convert.ToString(dr["Candidate Email Id"]);
                            fb.phone = Convert.ToString(dr["Phone Number"]);
                            fb.totalExp = Convert.ToString(dr["Total Exp(In year only)"]);
                            fb.totalExpMonth = Convert.ToString(dr["Total Exp(In month only)"]);
                            fb.relevantExp = Convert.ToString(dr["Relevant Exp(In year only)"]);
                            fb.relevantExpMonth = Convert.ToString(dr["Relevant Exp(In month only)"]);
                            fb.primarySkill = Convert.ToString(dr["Skill"]);
                            fb.currentCompany = Convert.ToString(dr["Current Company"]);
                            fb.Country = Convert.ToString(dr["Country"]);
                            fb.City = Convert.ToString(dr["City"]);
                            fb.currentOrg = Convert.ToString(dr["Current Organization"]);
                            fb.eduQualification = Convert.ToString(dr["Education Qualification"]);
                            fb.thid = Convert.ToString(dr["talent id"]);
                            fb.candidateType = Convert.ToString(dr["Candidate Type"]);
                            fb.recruiter = Convert.ToString(frm["recruiter"]);
                            fb.panel = Convert.ToString(dr["Interviewer Emp id"]);
                            fb.expSalary = Convert.ToString(dr["Expected Salary"]);
                            fb.curSalary = Convert.ToString(dr["Current Salary"]);
                            fb.OtherOffer = Convert.ToString(dr["Other Offer Available"]);
                            fb.remarks = Convert.ToString(dr["remarks"]);
                            fb.interviewDetails = Convert.ToString(dr["Interview Details(Link/Venue)"]);
                            fb.createdBy = Convert.ToString(frm["createdBy"]);
                            fb.HiringLocation = Convert.ToString(frm["HiringLocation"]);
                            fb.Gender = Convert.ToString(dr["Gender"]);
                            fb.Division = Convert.ToString(dr["Division"]);
                            fb.CubeName = Convert.ToString(dr["Talent Cube"]);
                            //fb.JobFamily = Convert.ToString(dr["Job Family"]);
                            fb.grade = Convert.ToString(dr["Grade"]);
                            string UnformattedDob = Convert.ToString(Convert.ToDateTime(cmn.ConvertDMYtoYMD(Convert.ToDateTime(dr["DOB"]).ToShortDateString())));
                            DateTime date = Convert.ToDateTime(UnformattedDob);
                            string formattedDob = date.ToString("yyyy-MM-dd");
                            fb.dob = formattedDob;
                            fb.gradeBand = Convert.ToString(dr["Comp  Band"]);
                            //fb.JobFamilyCategory = Convert.ToString(dr["Job Family Category"]);
                            //fb.Practice = Convert.ToString(dr["Practice"]);
                            //fb.JobFamilyCategory = Convert.ToString(dr["Job Family Category"]);
                            //fb.Practice= Convert.ToString(dr["Practice"]);
                            fb.EmployeeUnit = Convert.ToString(dr["Employee Unit"]);
                            fb.SalaryType = Convert.ToString(dr["Salary Type"]);
                            int RoundId = 0;
                            int result = objRepo.addupdateCandidateDetailsBulk(fb, ref RoundId);
                            var authResult = CommonController.HandleAuthorizationResult(result);
                            if (authResult != null) return authResult;
                            if (HttpContext.Current.Request.Files.Count > 0 && result > 0)
                            {
                                var httpPostedFile = HttpContext.Current.Request.Files[i + 1];

                                string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                                string tempPath = fb.Path + "/" + result.ToString() + "/";
                                if (!(Directory.Exists(tempPath)))
                                {
                                    Directory.CreateDirectory(tempPath);
                                }
                                string fileSavePath = Path.Combine(tempPath, fb.Resume);
                                if (System.IO.File.Exists(fileSavePath))
                                {
                                    File.Delete(fileSavePath);
                                }
                                //httpPostedFile.SaveAs(fileSavePath);
                                byte[] fileBytes;
                                using (MemoryStream memoryStream = new MemoryStream())
                                {
                                    httpPostedFile.InputStream.CopyTo(memoryStream);
                                    fileBytes = memoryStream.ToArray();
                                }


                                // Encrypt the file before saving
                                int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                            }
                            if (result >= 1)
                            {
                                //SendScheduleNotification(RoundId, result, fb.createdBy, 0);
                                dtStatus = AddRowToDatatable(dtStatus, fb.FirstName, fb.email, "Interview scheduled", "success");
                                //get Ai Assesment based of resume 
                              //  System.Threading.Tasks.Task<string> ResumeParse = common.ResumeParse(result, fb.createdBy);
                            }
                            else if (result == -2)
                                dtStatus = AddRowToDatatable(dtStatus, fb.FirstName, fb.email, "Interview already scheduled", "error");
                            else
                                dtStatus = AddRowToDatatable(dtStatus, fb.FirstName, fb.email, "There is some error! Try again later", "error");
                        }
                    }
                    catch (Exception ex)
                    {
                        dtStatus = AddRowToDatatable(dtStatus, fb.FirstName, fb.email, ex.Message, "error");
                    }
                    finally
                    {
                        i = i + 1;
                    }
                }
                return Ok(dtStatus);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "addupdateCandidateDetailsFile");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updateCandidateDetailsByCid")]
        [HttpPost]
        public IHttpActionResult updateCandidateDetailsByCid()
        {
            try
            {
                logger.LogRequestAsync("updateCandidateDetailsByCid", Request);

                CandidateDetails fb = new CandidateDetails();
                var frm = HttpContext.Current.Request.Form;
                fb.IsFileExist = 0;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.Resume = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                    fb.Path = ConfigurationManager.AppSettings["ResumesPath"];
                    fb.IsFileExist = 1;
                }

                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.FirstName = frm["firstName"].ToString();
                fb.MiddleName = frm["middleName"].ToString();
                fb.LastName = frm["lastName"].ToString();
                fb.email = frm["email"].ToString();
                fb.phone = frm["mobileNumber"];
                fb.primarySkill = frm["primarySkill"];
                fb.totalExp = frm["totalExp"];
                fb.totalExpMonth = frm["totalExpMonth"];
                fb.relevantExp = frm["releventExp"];
                fb.relExpMonth = frm["relExpMonth"];
                fb.updateBy = frm["addedby"];
                fb.CountryID = Convert.ToInt32(frm["countryID"] == null || frm["countryID"].ToString() == "" ? "0" : frm["countryID"]);
                fb.StateID = Convert.ToInt32(frm["stateID"] == null || frm["stateID"].ToString() == "" ? "0" : frm["stateID"]);
                fb.CityId = Convert.ToInt32(frm["cityId"]);
                fb.candidateTypeID = Convert.ToString(frm["candidateTypeID"]);
                fb.identityId = Convert.ToInt32(frm["identityId"]);
                fb.identityNo = frm["identityNo"];
                fb.currentOrg = frm["currentOrg"];
                fb.eduQualification = frm["eduQualification"];
                fb.expSalary = Convert.ToString(frm["expSalary"]);
                fb.curSalary = Convert.ToString(frm["curSalary"]);
                fb.SalaryType = Convert.ToInt32(frm["SalaryType"]);
                fb.currencyTypeId = Convert.ToInt32(frm["currencyTypeId"]);
                fb.joiningDate = Convert.ToString(frm["joiningDate"]);
                fb.Gender = Convert.ToInt32(frm["Gender"] == null || frm["Gender"].ToString() == "" ? "0" : frm["Gender"]);
                fb.dob = frm["dob"].ToString();
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                fb.CubeID = Convert.ToInt32(frm["CubeID"] == null || frm["CubeID"].ToString() == "" ? "0" : frm["CubeID"]);
                fb.CubeClusterID = Convert.ToInt32(frm["CubeClusterID"] == null || frm["CubeClusterID"].ToString() == "" ? "0" : frm["CubeClusterID"]);
                fb.CubeRoleID = Convert.ToInt32(frm["CubeRoleID"] == null || frm["CubeRoleID"].ToString() == "" ? "0" : frm["CubeRoleID"]);
                fb.gradeId = Convert.ToInt32(frm["gradeId"] == null || frm["gradeId"].ToString() == "" ? "0" : frm["gradeId"]);
                fb.gradeBand = frm["gradeBand"];
                fb.EmpUnitId = Convert.ToInt32(frm["EmpUnitId"] == null || frm["EmpUnitId"].ToString() == "" ? "0" : frm["EmpUnitId"]);
                fb.CountryCode = Convert.ToInt32(frm["CountryCode"] == null || frm["CountryCode"].ToString() == "" ? "0" : frm["CountryCode"]);
                int result = objRepo.updateCandidateDetailsByCid(fb);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "updateCandidateDetailsByCid", ClaimsPrincipal.Current.Identities.First().Claims.ToList()[5].Value);
                    return authResult;
                }
                else if (result > 0 && fb.cid > 0)
                {
                    if (fb.IsFileExist == 1)
                    {
                        //get Ai Assesment based of resume 
                        //System.Threading.Tasks.Task<string> ResumeParse = common.ResumeParse(Convert.ToInt32(fb.cid), fb.updateBy);
                    }
                    logger.LogResponseAsync("updateCandidateDetailsByCid", "200 OK - Candidate Details Updated Successfully");
                    return Ok("Candidate Details Updated Successfully");
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("updateCandidateDetailsByCid", "400 Bad Request - Candidate Details Already Exists");
                    return BadRequest("Candidate Details Already Exists.");
                }
                else
                {
                    logger.LogResponseAsync("updateCandidateDetailsByCid", "400 Bad Request - Error");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateCandidateDetailsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "updateCandidateDetailsByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateDetailsByCid")]
        [HttpGet]
        public IHttpActionResult getCandidateDetailsByCid(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidateDetailsByCid", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateDetailsByCid(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateDetailsByCid", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getCandidateDetailsByCid", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDetailsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateDetailsByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getLinkedTalentIdByCid")]
        [HttpGet]
        public IHttpActionResult getLinkedTalentIdByCid(int cid)
        {
            try
            {
                logger.LogRequestAsync("getLinkedTalentIdByCid", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getLinkedTalentIdByCid(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getLinkedTalentIdByCid", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getLinkedTalentIdByCid", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getLinkedTalentIdByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getLinkedTalentIdByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("transferCandidateByTalentId")]
        [HttpPost]
        public IHttpActionResult transferCandidateByTalentId()
        {
            try
            {
                CandidateDetails fb = new CandidateDetails();
                var frm = HttpContext.Current.Request.Form;

                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.updateBy = frm["updateBy"];
                fb.remarks = frm["remarks"];
                fb.thid = frm["thid"];
                fb.Gender = Convert.ToInt32(frm["Gender"] == null || frm["Gender"].ToString() == "" ? "0" : frm["Gender"]);
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                //  fb.JobFamilyID = Convert.ToInt32(frm["JobFamilyID"] == null || frm["JobFamilyID"].ToString() == "" ? "0" : frm["JobFamilyID"]);
                fb.gradeId = Convert.ToInt32(frm["gradeId"] == null || frm["gradeId"].ToString() == "" ? "0" : frm["gradeId"]);
                // fb.practiceId = Convert.ToInt32(frm["practiceId"] == null || frm["practiceId"].ToString() == "" ? "0" : frm["practiceId"]);
                fb.EmpUnitId = Convert.ToInt32(frm["EmpUnitId"] == null || frm["EmpUnitId"].ToString() == "" ? "0" : frm["EmpUnitId"]);
                fb.gradeBand = frm["gradeBand"];
                // fb.jobfamilycategory = Convert.ToChar(frm["jobfamilycategory"] == null || frm["jobfamilycategory"].ToString() == "" ? "P" : frm["jobfamilycategory"]);
                fb.CubeID = Convert.ToInt32(frm["CubeID"] == null || frm["CubeID"].ToString() == "" ? "0" : frm["CubeID"]);
                fb.CubeClusterID = Convert.ToInt32(frm["CubeClusterID"] == null || frm["CubeClusterID"].ToString() == "" ? "0" : frm["CubeClusterID"]);
                fb.CubeRoleID = Convert.ToInt32(frm["CubeRoleID"] == null || frm["CubeRoleID"].ToString() == "" ? "0" : frm["CubeRoleID"]);

                string Message = string.Empty;
                int result = objRepo.transferCandidateByTalentId(fb, ref Message);

                if (result > 0 && fb.cid > 0)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(fb.cid, fb.updateBy, 1);
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
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "transferCandidateByTalentId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public DataTable ConvertExcelToDataTable(string FileName)
        {
            try
            {
                OleDbConnection oledbConn = null;
                OleDbCommand cmd = null;
                OleDbDataAdapter oleda = null;
                DataSet data = new DataSet();
                string connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + FileName + ";Extended Properties=Excel 12.0;";
                oledbConn = new OleDbConnection(connString);
                oledbConn.Open();
                string strQuery = "SELECT * FROM [Screening Round Bulk uploads$]";
                cmd = new OleDbCommand(strQuery, oledbConn);
                oleda = new OleDbDataAdapter();
                oleda.SelectCommand = cmd;
                oleda.Fill(data);
                oledbConn.Close();
                return data.Tables[0];
                //var csvTable = new DataTable();
                //using (var csvReader = new CsvReader(new StreamReader(System.IO.File.OpenRead(FileName)), true))
                //{
                //    csvTable.Load(csvReader);
                //}
                //return csvTable;
            }
            catch (Exception ex)
            {
                // MessageBox.Show(ex.Message);
                return null;
            }
        }

        [NonAction]
        public DataTable CreateResponseTable()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Name");
            dt.Columns.Add("email");
            dt.Columns.Add("status");
            dt.Columns.Add("statusID");
            return dt;
        }

        [NonAction]
        public DataTable AddRowToDatatable(DataTable dt, string name, string email, string status, string sID)
        {
            DataRow dr = dt.NewRow();
            dr["Name"] = name;
            dr["email"] = email;
            dr["status"] = status;
            dr["statusID"] = sID;
            dt.Rows.Add(dr);
            return dt;
        }



        [Route("SearchCandidate")]
        [HttpPost]
        public IHttpActionResult SearchCandidate(SearchCandidateModel model)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("SearchCandidate", Request);

                int result;
                var data = objRepo.SearchCandidate(model, claims[5].Value, model.PageNo, model.PageSize, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "SearchCandidate", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("SearchCandidate", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SearchCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "SearchCandidate");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPanelWiseReport")]
        [HttpPost]
        public IHttpActionResult GetPanelWiseReport([FromBody] panelWiseFilterModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetPanelWiseReport", Request);

                if (obj.EmpID == null)
                {
                    logger.LogResponseAsync("GetPanelWiseReport", "400 Bad Request - EMP ID is Required");
                    return BadRequest("EMP ID is Required");
                }
                else if (obj.startDate == null)
                {
                    logger.LogResponseAsync("GetPanelWiseReport", "400 Bad Request - From Date is Required");
                    return BadRequest("From Date is Required");
                }
                else
                {
                    int result;
                    var data = objRepo.GetPanelWiseReport(obj.EmpID, obj.DUIDs, obj.accountId, obj.skillId, obj.startDate, obj.endDate, out result);

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetPanelWiseReport", ClaimsPrincipal.Current.Identities.First().Claims.ToList()[5].Value);
                        return authResult;
                    }

                    logger.LogResponseAsync("GetPanelWiseReport", "200 OK - Data Retrieved Successfully");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPanelWiseReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetPanelWiseReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReportDetailByPanel")]
        [HttpPost]
        public IHttpActionResult GetReportDetailByPanel([FromBody] panelWiseFilterModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetReportDetailByPanel", Request);

                if (obj.PanelEmpID == null)
                {
                    logger.LogResponseAsync("GetReportDetailByPanel", "400 Bad Request - Panel Employee ID is Required");
                    return BadRequest("Panel Employee ID is Required");
                }
                else if (obj.startDate == null)
                {
                    logger.LogResponseAsync("GetReportDetailByPanel", "400 Bad Request - From Date is Required");
                    return BadRequest("From Date is Required");
                }
                else
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result;
                    var data = objRepo.GetReportDetailByPanel(obj.PanelEmpID, obj.DUIDs, obj.accountId, obj.skillId, obj.startDate, obj.endDate, obj.statusId, claims[5].Value, out result);

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetReportDetailByPanel", claims[5].Value);
                        return authResult;
                    }

                    logger.LogResponseAsync("GetReportDetailByPanel", "200 OK - Data Retrieved Successfully");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReportDetailByPanel", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetReportDetailByPanel");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRecruiterWiseReport")]
        [HttpPost]
        public IHttpActionResult GetRecruiterWiseReport(string startDate, string endDate = null, string search = null)
        {
            try
            {
                logger.LogRequestAsync("GetRecruiterWiseReport", Request);

                if (startDate == null)
                {
                    logger.LogResponseAsync("GetRecruiterWiseReport", "400 Bad Request - From Date is Required");
                    return BadRequest("From Date is Required");
                }
                else
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result;
                    var data = objRepo.GetRecruiterWiseReport(startDate, endDate, search, claims[5].Value, out result);

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetRecruiterWiseReport", claims[5].Value);
                        return authResult;
                    }

                    logger.LogResponseAsync("GetRecruiterWiseReport", "200 OK - Data Retrieved Successfully");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRecruiterWiseReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetRecruiterWiseReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReportDetailsByRecruiterId")]
        [HttpGet]
        public IHttpActionResult GetReportDetailsByRecruiterId(string RecruiterEmpID, string Flag, string startdate, int Page, int pagesize, string endDate = null, string Status = null, string Profile = null)
        {
            try
            {
                logger.LogRequestAsync("GetReportDetailsByRecruiterId", Request);

                if (RecruiterEmpID == null)
                {
                    logger.LogResponseAsync("GetReportDetailsByRecruiterId", "400 Bad Request - Recruiter Employee ID is Required");
                    return BadRequest("Recruiter Employee ID is Required");
                }
                else if (startdate == null)
                {
                    logger.LogResponseAsync("GetReportDetailsByRecruiterId", "400 Bad Request - From Date is Required");
                    return BadRequest("From Date is Required");
                }
                else if (Flag == null)
                {
                    logger.LogResponseAsync("GetReportDetailsByRecruiterId", "400 Bad Request - Flag is Required");
                    return BadRequest("Flag is Required");
                }
                else
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result;
                    var data = objRepo.GetReportDetailsByRecruiterId(RecruiterEmpID, Flag, startdate, endDate, Page, pagesize, Status, Profile, claims[5].Value, out result);

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "GetReportDetailsByRecruiterId", claims[5].Value);
                        return authResult;
                    }

                    logger.LogResponseAsync("GetReportDetailsByRecruiterId", "200 OK - Data Retrieved Successfully");
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReportDetailsByRecruiterId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetReportDetailsByRecruiterId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAdditionalInterviewers")]
        [HttpGet]
        public IHttpActionResult GetAdditionalInterviewers(int RoundID)
        {
            try
            {
                logger.LogRequestAsync("GetAdditionalInterviewers", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetAdditionalInterviewers(claims[5].Value, RoundID, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAdditionalInterviewers", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetAdditionalInterviewers", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAdditionalInterviewers", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetAdditionalInterviewers");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdatePrimaryInterviewer")]
        [HttpGet]
        public IHttpActionResult UpdatePrimaryInterviewer(int RoundID, string InterviewerID)
        {
            try
            {
                logger.LogRequestAsync("UpdatePrimaryInterviewer", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.UpdatePrimaryInterviewer(claims[5].Value, RoundID, InterviewerID, ref Message);

                logger.LogResponseAsync("UpdatePrimaryInterviewer", "200 OK - " + Message);
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdatePrimaryInterviewer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "UpdatePrimaryInterviewer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllUpcomingInterview")]
        [HttpGet]
        public IHttpActionResult getAllUpcomingInterview(int page, int pageSize, string search = null, int? hiringLocationId = null)
        {
            try
            {
                logger.LogRequestAsync("getAllUpcomingInterview", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getAllUpcomingInterview(claims[5].Value, page, pageSize, search, out result, hiringLocationId);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllUpcomingInterview", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getAllUpcomingInterview", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllUpcomingInterview", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getAllUpcomingInterview");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("sc")]
        [HttpPost]
        public IHttpActionResult sc(int cid, string empid, string type)
        {
            try
            {
                logger.LogRequestAsync("sc", Request);

                Common co = new Common();
                string notificationEnb = ConfigurationManager.AppSettings["NotificationEnable"];
                if (notificationEnb == "1")
                {
                    if (type == "M")
                    {
                        System.Threading.Tasks.Task<string> SendMailMettl = common.sendEmailForMettlRound(cid, empid);
                    }
                    else
                    {
                        System.Threading.Tasks.Task<string> CalanderId = common.addToCalendarGraph(cid, empid, 1);
                    }
                }

                logger.LogResponseAsync("sc", "200 OK - Notification Sent Successfully");
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("sc", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "sc");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendInvite")]
        [HttpPost]
        public IHttpActionResult ResendInvite(int cid, string empid, string type)
        {
            try
            {
                logger.LogRequestAsync("ResendInvite", Request);

                Common co = new Common();
                string notificationEnb = ConfigurationManager.AppSettings["NotificationEnable"];
                if (notificationEnb == "1")
                {
                    if (type == "M")
                    {
                        System.Threading.Tasks.Task<string> SendMailMettl = common.sendEmailForMettlRound(cid, empid);
                    }
                    else
                    {
                        System.Threading.Tasks.Task<string> CalanderId = common.addToCalendarGraph(cid, empid, 1);
                    }
                }

                logger.LogResponseAsync("ResendInvite", "200 OK - Notification Resent Successfully");
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendInvite", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "ResendInvite");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public string getCurrencySymbol(string CurrencyCode)
        {
            string symbol = string.Empty;
            CultureInfo[] cultures = CultureInfo.GetCultures(CultureTypes.SpecificCultures);
            IList Result = new ArrayList();
            foreach (CultureInfo ci in cultures)
            {
                RegionInfo ri = new RegionInfo(ci.LCID);
                if (ri.ISOCurrencySymbol == CurrencyCode)
                {
                    symbol = ri.CurrencySymbol;
                    return symbol;
                }
            }
            return symbol;

        }

        [Route("UpdateCandidateTransferDetails")]
        [HttpPost]
        public IHttpActionResult UpdateCandidateTransferDetails(int cid, string transferStatus, string remark = null)
        {
            try
            {
                logger.LogRequestAsync("UpdateCandidateTransferDetails", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateCandidateTransferDetails(cid, transferStatus, remark, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(cid, claims[5].Value, 1);
                    return Ok(Message);
                }
                else if (result == 2)
                {
                    logger.LogResponseAsync("UpdateCandidateTransferDetails", "200 OK - " + Message);
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateCandidateTransferDetails", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateCandidateTransferDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "AddUpdatePartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ApproveUnAttendentTransferProfile")]
        [HttpPost]
        public IHttpActionResult ApproveUnAttendentTransferProfile(int id, string transferStatus,char? IsFromNaukriAPI = null, string remark = null)
        {
            try
            {
                logger.LogRequestAsync("ApproveUnAttendentTransferProfile", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.ApproveUnAttendentTransferProfile(id, transferStatus, remark, claims[5].Value, ref Message, IsFromNaukriAPI);
                if (result == 1)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 0);
                    return Ok(Message);
                }
                else if (result == 2)
                {
                    logger.LogResponseAsync("ApproveUnAttendentTransferProfile", "200 OK - " + Message);
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("ApproveUnAttendentTransferProfile", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApproveUnAttendentTransferProfile", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "AddUpdatePartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateTransferRequest")]
        [HttpPost]
        public IHttpActionResult CandidateTransferRequest([FromBody] canTransferRequest obj)
        {
            try
            {
                logger.LogRequestAsync("CandidateTransferRequest", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.CandidateTransferRequest(obj, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CandidateTransferRequest", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("CandidateTransferRequest", "200 OK - " + Message);
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("CandidateTransferRequest", "200 OK - " + Message);
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateTransferRequest", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateTransferRequest", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "CandidateTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UnattendedCandidateTransferRequest")]
        [HttpPost]
        public IHttpActionResult UnattendedCandidateTransferRequest(int id, string toThId,char? IsFromNaukriAPI = null, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("UnattendedCandidateTransferRequest", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.UnattendedCandidateTransferRequest(id, toThId, claims[5].Value, remarks, ref Message, IsFromNaukriAPI);
                if (result == 1) { 
                    return Ok(Message);
                }
                else if (result == -2)
                    return BadRequest(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                {
                    logger.LogResponseAsync("UnattendedCandidateTransferRequest", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedCandidateTransferRequest", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "CandidateTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UnattendedProfileTransfer")]
        [HttpPost]
        public IHttpActionResult UnattendedProfileTransfer(int id, string toThId, string remarks = null, char? IsFromNaukriAPI  = null)
        {
            try
            {
                logger.LogRequestAsync("UnattendedProfileTransfer", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.UnattendedProfileTransfer(id, toThId, claims[5].Value, remarks, ref Message, IsFromNaukriAPI);
                if (result == 1)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id,claims[5].Value,0);
                    return Ok(Message);
                }
                
                else if (result == -2)
                    return BadRequest(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                {
                    logger.LogResponseAsync("UnattendedProfileTransfer", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedProfileTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "CandidateTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CheckTalentIdStatus")]
        [HttpGet]
        public IHttpActionResult CheckTalentIdStatus(string thId)
        {
            try
            {
                logger.LogRequestAsync("CheckTalentIdStatus", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.CheckTalentIdStatus(thId, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CheckTalentIdStatus", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("CheckTalentIdStatus", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CheckTalentIdStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "CheckTalentIdStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addJD_PanelClarificationHistory")]
        [HttpPost]
        public IHttpActionResult addJD_PanelClarificationHistory(int Thid, string JDFlag, string PanelFlag)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("addJD_PanelClarificationHistory", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.addJD_PanelClarificationHistory(Thid, JDFlag, PanelFlag, EmpID, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addJD_PanelClarificationHistory", EmpID);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("addJD_PanelClarificationHistory", "200 OK - " + Message);
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("addJD_PanelClarificationHistory", "200 OK - " + Message);
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("addJD_PanelClarificationHistory", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addJD_PanelClarificationHistory", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "addJD_PanelClarificationHistory");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updateCandidateInterviewDetailsByCid")]
        [HttpPost]
        public IHttpActionResult updateCandidateInterviewDetailsByCid(int Cid, int StatusId, int DropReasonId, string DropRemark = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("updateCandidateInterviewDetailsByCid", Request);

                string EmpID = claims[5].Value; // New Employee ID
                int result = objRepo.updateCandidateInterviewDetailsByCid(Cid, StatusId, EmpID, DropReasonId, DropRemark);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "updateCandidateInterviewDetailsByCid", EmpID);
                    return authResult;
                }
                else if (result > 0 && Cid > 0)
                {
                    logger.LogResponseAsync("updateCandidateInterviewDetailsByCid", "200 OK - Candidate Interview Details Updated Successfully");
                    return Ok("Candidate Interview Details Updated Successfully");
                }
                else
                {
                    logger.LogResponseAsync("updateCandidateInterviewDetailsByCid", "400 Bad Request - There is some error! Try again later");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateCandidateInterviewDetailsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "updateCandidateDetailsByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetJDPanelAvailableDetails")]
        [HttpGet]
        public IHttpActionResult GetJDPanelAvailableDetails(int ThId)
        {
            try
            {
                logger.LogRequestAsync("GetJDPanelAvailableDetails", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetJDPanelAvailableDetails(ThId, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetJDPanelAvailableDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetJDPanelAvailableDetails", "200 OK - Data Retrieved Successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJDPanelAvailableDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "GetAdditionalInterviewers");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCalender")]
        [HttpGet]
        public IHttpActionResult GetCalender(string fromDate, string toDate, int top, string emailId)
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                logger.LogRequestAsync("GetCalender", Request);

                string token = common.GenerateToken();
                HttpClient httpClient = new HttpClient();
                string _url = "https://graph.microsoft.com/v1.0/users/" + emailId + "/calendar/events?$count=true&$top=" + top + "&$filter=start/dateTime ge '" + fromDate + "' and end/dateTime lt '" + toDate + "'";
                httpClient.BaseAddress = new Uri(_url);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                servicerequest = httpClient.GetAsync(_url).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                logger.LogResponseAsync("GetCalender", "200 OK - Data Retrieved Successfully");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCalender", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "GetAdditionalInterviewers");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetScheduleCalender")]
        [HttpPost]
        public IHttpActionResult GetScheduleCalender(getScheduleCalender data)
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                logger.LogRequestAsync("GetScheduleCalender", Request);

                var p = new
                {
                    schedules = new string[] { "ayatullah.rahmani@infogain.com", "dharampal.singh@infogain.com", "akanksha.singh@infogain.com" },
                    startTime = new { dateTime = "2022-05-26T09:00:00", timeZone = "India Standard Time" },
                    endTime = new { dateTime = "2022-05-26T23:00:00", timeZone = "India Standard Time" },
                    availabilityViewInterval = 60
                };

                data.endTime.timeZone = TZConvert.IanaToWindows(data.endTime.timeZone);
                data.startTime.timeZone = TZConvert.IanaToWindows(data.startTime.timeZone);
                string json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json.ToString(), System.Text.Encoding.UTF8, "application/json");
                string token = common.GenerateToken();
                HttpClient httpClient = new HttpClient();
                string _url = "https://graph.microsoft.com/v1.0/users/5b113828-0ae9-45db-97a5-c51b8bb8006e/calendar/getSchedule";
                httpClient.BaseAddress = new Uri(_url);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                servicerequest = httpClient.PostAsync(_url, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                logger.LogResponseAsync("GetScheduleCalender", "200 OK - Data Retrieved Successfully");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetScheduleCalender", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "GetScheduleCalender");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddProfilePicture")]
        [HttpPost]
        public IHttpActionResult AddProfilePicture()
        {
            try
            {
                logger.LogRequestAsync("AddProfilePicture", Request);

                ProfilePictureModel model = new ProfilePictureModel();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var form = HttpContext.Current.Request.Form;

                model.Cid = Convert.ToInt32(form["cid"]);
                model.RoundId = Convert.ToInt32(form["RoundId"]);
                model.IsSignOff = Convert.ToInt32(form["IsSignOff"]);

                if (HttpContext.Current.Request.Files.Count == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                var httpPostedFile = HttpContext.Current.Request.Files[0];
                if (httpPostedFile == null || httpPostedFile.ContentLength == 0)
                {
                    return BadRequest("Uploaded file is empty.");
                }

                model.ProfilePicName = httpPostedFile.FileName;
                string directoryPath = Path.Combine(ConfigurationManager.AppSettings["ProfilePicturePath"], model.Cid.ToString(), model.RoundId.ToString());
                string fileSavePath = Path.Combine(directoryPath, common.GetFileWithAdditionalExtention(model.ProfilePicName));

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                if (File.Exists(fileSavePath))
                {
                    File.Delete(fileSavePath);
                }

                byte[] fileBytes;
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    httpPostedFile.InputStream.CopyTo(memoryStream);
                    fileBytes = memoryStream.ToArray();
                }

                int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                if (encryptionResult != 1)
                {
                    return InternalServerError(new Exception("Error encrypting the file."));
                }

                int dbResult = objRepo.AddProfilePicture(model, claims[5].Value, 1, model.ProfilePicName, fileSavePath);
                var authResult = CommonController.HandleAuthorizationResult(dbResult);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddProfilePicture", claims[5].Value);
                    return authResult;
                }
                else if (dbResult > 0)
                {
                    logger.LogResponseAsync("AddProfilePicture", "200 OK - Profile Picture saved successfully");
                    return Ok("Profile Picture saved successfully");
                }
                else
                {
                    logger.LogResponseAsync("AddProfilePicture", "400 Bad Request - Error saving record in the database.");
                    return BadRequest("Error saving record in the database.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddProfilePicture", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "AddProfilePicture");
                return BadRequest("There was an error. Please try again later.");
            }
        }

        [Route("GetProfilePicture")]
        [HttpGet]
        public IHttpActionResult GetProfilePicture(int RoundId, int? cid = null)
        {
            try
            {
                logger.LogRequestAsync("GetProfilePicture", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetProfilePicture(RoundId, claims[5].Value, out result, cid);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetProfilePicture", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetProfilePicture", "200 OK - Profile Picture retrieved successfully");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetProfilePicture", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetProfilePicture");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadProfilePicture")]
        [HttpGet]
        public HttpResponseMessage DownloadProfilePicture(int RoundId, int? cid = null)
        {
            try
            {
                logger.LogRequestAsync("DownloadProfilePicture", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetProfilePicture(RoundId, claims[5].Value, out result, cid);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    logger.LogResponseAsync("DownloadProfilePicture", "400 Bad Request - No profile picture found.");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "No profile picture found.");
                }

                string encryptedFilePath = ds.Tables[0].Rows[0]["FilePath"].ToString();
                string encryptedFileName = Path.GetFileName(encryptedFilePath);

                if (!File.Exists(encryptedFilePath))
                {
                    logger.LogResponseAsync("DownloadProfilePicture", "404 Not Found - File not found.");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                // Remove only the last extension
                string originalFileName = common.RemoveLastExtension(encryptedFileName);

                byte[] encryptedBytes;

                using (FileStream fs = new FileStream(encryptedFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    encryptedBytes = new byte[fs.Length];
                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(encryptedBytes);

                if (decryptedBytes == null || decryptedBytes.Length == 0)
                {
                    logger.LogResponseAsync("DownloadProfilePicture", "500 Internal Server Error - File decryption failed.");
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                }

                // Create response with decrypted file
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(decryptedBytes);
                response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = originalFileName // Assuming the original file was an image
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

                logger.LogResponseAsync("DownloadProfilePicture", "200 OK - Profile picture downloaded successfully.");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadProfilePicture", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "DownloadProfilePicture");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "An error occurred while downloading the profile picture.");
            }
        }


       
        [Route("ExportToExcelPanelWiseReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelPanelWiseReport([FromBody] panelWiseFilterModel obj)
        {
            try
            {
                logger.LogRequestAsync("ExportToExcelPanelWiseReport", Request);

                StringBuilder str = new StringBuilder();
                str.Append("<table border=\"1px\">");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>PanelEmpID</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Panel Name(Technical)</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Hiring For Skill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>GDL</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Account</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Number of Interview Taken</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Number of Interview Scheduled</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Number of Interview Cancelled</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Number of Candidates Rejected</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Number of Candidates Shortlisted</font></b></td>");
                str.Append("</tr>");

                int result;
                DataSet ds = objRepo.GetPanelWiseReport(obj.EmpID, obj.DUIDs, obj.accountId, obj.skillId, obj.startDate, obj.endDate, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("ExportToExcelPanelWiseReport", "401 Unauthorized");
                    return (HttpResponseMessage)authResult;
                }

                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["interviewerEmpId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["Name"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["Skills"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["DU"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["Account"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["interviewTaken"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["shceduled"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["cancelled"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["rejected"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size='12px'>" + dr["shortList"].ToString() + "</font></td>");
                        str.Append("</tr>");
                    }
                    str.Append("</table>");

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    byte[] temp = Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = "PanelWiseList.xls"
                    };
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");

                    logger.LogResponseAsync("ExportToExcelPanelWiseReport", "200 OK - Report generated successfully.");
                    return response;
                }

                logger.LogResponseAsync("ExportToExcelPanelWiseReport", "204 No Content - No data found.");
                return Request.CreateResponse(HttpStatusCode.NoContent, "No data found.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ExportToExcelPanelWiseReport", ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while generating the report.");
            }
        }


        [Route("ExportToExcelRecruiterWiseReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelRecruiterWiseReport(string startDate, string endDate = null, string search = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("ExportToExcelRecruiterWiseReport", Request);

                StringBuilder str = new StringBuilder();
                str.Append("<table border=`" + "1px" + "`b>");
                str.Append("<tr>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter EmpID</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Recruiter Location</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>ATS Last Login Date/Time</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Talent id's Assigned</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>THID Assigned Before 30 Days Count</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Candidates Added against talent Id's assigned</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Scheduling Interview Count</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Rescheduling Interview Count</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Cancelled Interviews</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screening Round Feedback</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>HR Final Round Feedback</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screen Reject Count-Cskill</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Screen Reject Count Referral</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Profile Add Count - Naukri</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Profile Add Count - Linkedin</font></b></td>");
                str.Append("<td><b><font face='Calibri' size='3'>Profile Add Count - Social Media Source</font></b></td>");
                str.Append("</tr>");
                int result;
                DataSet ds = objRepo.GetRecruiterWiseReport(startDate, endDate, search, claims[5].Value, out result);
                if (ds != null && ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RecruiterEmpId"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RecruiterName"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Location"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["LastLoginDate"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["THIDAssignedCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["THIDAssignedBefore30daysCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CandidateAssignedToThidCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScheduledInterviewCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RescheduleInterviewCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CancleInterviewCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreeningRoundFeedbackCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HRFinalRoundFeedback"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenRejectCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["referralRejectCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NaukariProfileCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["LinkedinProfileCount"].ToString() + "</font></td>");
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SocialMediaProfileCount"].ToString() + "</font></td>");
                        str.Append("</tr>");
                    }
                    str.Append("</table>");
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                    byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = "RecruiterWiseReport.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");

                    logger.LogResponseAsync("ExportToExcelRecruiterWiseReport", "200 OK");
                    return response;
                }
                return null;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ExportToExcelRecruiterWiseReport", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, AppConstants.CommonErrorMessage);
            }
        }

        [Route("CheckInterviewStatus")]
        [HttpGet]
        public IHttpActionResult CheckInterviewStatus(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("CheckInterviewStatus", Request);

                int result;
                var data = objRepo.CheckInterviewStatus(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("CheckInterviewStatus", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CheckInterviewStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "CheckInterviewStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateProfileDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateProfileDetails(int? cid = null, int? id = null, int? profileId = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getCandidateProfileDetails", Request);

                int result;
                var data = objRepo.getCandidateProfileDetails(claims[5].Value, out result, cid, id, profileId);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("getCandidateProfileDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateProfileDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "getCandidateProfileDetails");
                return BadRequest("There is some error! Try again later");
            }
        }


        [NonAction]
        public int uploadfileCommon(string path, string fullPath, byte[] file)
        {

            try
            {
                if (!(Directory.Exists(path)))
                {
                    Directory.CreateDirectory(path);
                }
                File.WriteAllBytes(fullPath, file);
                return 1;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "upload Candidate Documents");
                return 0;
            }


        }

        [Route("uplaodVideoToSharePointIntF")]
        [HttpPost]
        public IHttpActionResult uplaodVideoToSharePointIntF()
        {
            try
            {
                logger.LogRequestAsync("uplaodVideoToSharePointIntF", Request);
                int result = 0;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    byte[] fileBytesArray;
                    using (var stream = new MemoryStream())
                    {
                        httpPostedFile.InputStream.CopyTo(stream);
                        fileBytesArray = stream.ToArray();
                    }
                    uploadVideoInterview model = new uploadVideoInterview();
                    model.FileNameVideo = frm["FileNameVideo"];
                    // model.fileVideo = fileBytesArray;
                    model.FileSizeVideo = Convert.ToInt32(frm["FileSizeVideo"]);
                    model.RoundId = Convert.ToInt32(frm["RoundId"]);
                    model.IsConsent = Convert.ToInt32(frm["IsConsent"]);
                    model.isVideoCompare = Convert.ToChar(frm["isVideoCompare"] == null || frm["isVideoCompare"].ToString() == "" ? "N" : frm["isVideoCompare"]);
                    model.cid = Convert.ToInt32(frm["cid"]);
                    string Message = string.Empty;
                    string token = common.GenerateToken();
                    uploadBodysharePoint uploadBodysharePoint = new uploadBodysharePoint();
                    uploadBodysharePoint.fileConv = fileBytesArray;
                    uploadBodysharePoint.fileSize = model.FileSizeVideo;
                    string uploadPath = ConfigurationManager.AppSettings["SharePointVideoPathInterview"] + model.cid.ToString() + "/" + model.RoundId.ToString() + "/" + model.FileNameVideo;
                    string uploadUrl = common.createSessionForUploadFileSharedPoint(uploadPath, token);
                    uploadBodysharePoint.uploadUrl = uploadUrl;
                    UploadDetailsModel uploadFile = common.UploadFileToSharedPointFormData(uploadBodysharePoint, token, "uploadVideoToSharePointInterview");
                    if (uploadFile.id != null)
                    {
                        model.sharePointIdVideo = uploadFile.id;
                        model.FilePathVideo = uploadFile.webUrl;
                        result = objRepo.uplaodVideoToSharePoint(model, claims[5].Value, ref Message);
                    }
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        if (model.isVideoCompare == 'Y')
                        {
                            System.Threading.Tasks.Task<string> VideoImageCampareInt = common.VideoImageCampareInterviewAsync(model.cid, claims[5].Value);
                        }
                        logger.LogResponseAsync("uplaodVideoToSharePointIntF", "200 OK");
                        return Ok(Message);
                    }
                    else if (result == -2)
                    {
                        logger.LogResponseAsync("uplaodVideoToSharePointIntF", "400 Bad Request");
                        return BadRequest(Message);
                    }
                    else
                    {
                        logger.LogResponseAsync("uplaodVideoToSharePointIntF", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                    }

                }
                else
                {
                    logger.LogResponseAsync("uplaodVideoToSharePointIntF", "200 OK");
                    return Ok("Video not found.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uplaodVideoToSharePointIntF", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "AddProfilePicture");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("uplaodTranscriptToSharePointIntF")]
        [HttpPost]
        public IHttpActionResult uplaodTranscriptToSharePointIntF()
        {
            try
            {
                logger.LogRequestAsync("uplaodTranscriptToSharePointIntF", Request);
                int result = 0;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    byte[] fileBytesArray;
                    using (var stream = new MemoryStream())
                    {
                        httpPostedFile.InputStream.CopyTo(stream);
                        fileBytesArray = stream.ToArray();
                    }
                    uploadTranscript model = new uploadTranscript();
                    model.FileNameTrans = frm["FileNameTrans"];
                    model.RoundId = Convert.ToInt32(frm["RoundId"]);
                    model.cid = Convert.ToInt32(frm["cid"]);
                    model.thid = Convert.ToInt32(frm["Talent_id"]);
                    model.FileSizeTrans = Convert.ToInt32(frm["FileSizeTrans"]);

                    string Message = string.Empty;
                    string token = common.GenerateToken();
                    uploadBodysharePoint uploadBodysharePoint = new uploadBodysharePoint();
                    uploadBodysharePoint.fileConv = fileBytesArray;
                    uploadBodysharePoint.fileSize = model.FileSizeTrans;
                    string uploadPath = ConfigurationManager.AppSettings["SharePointTransScriptPath"] + model.cid.ToString() + "/" + model.RoundId.ToString() + "/" + model.FileNameTrans;
                    string uploadUrl = common.createSessionForUploadFileSharedPoint(uploadPath, token);
                    uploadBodysharePoint.uploadUrl = uploadUrl;
                    UploadDetailsModel uploadFile = common.UploadFileToSharedPointFormData(uploadBodysharePoint, token, "uploadTransScriptToSharePointInterview");
                    if (uploadFile.id != null)
                    {
                        model.sharePointIdTrans = uploadFile.id;
                        model.FilePathTrans = uploadFile.webUrl;
                        result = objRepo.uplaodTransScriptToSharePoint(model, claims[5].Value, ref Message);
                    }
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        // System.Threading.Tasks.Task<string> UploadTransSciptInt = common.TranscriptProcessUpdate(model.cid, model.thid, model.RoundId, claims[5].Value);
                        //  string UploadTransSciptInt = common.uploadTransSript(model.cid, model.thid, model.RoundId, claims[5].Value);
                        logger.LogResponseAsync("uplaodTranscriptToSharePointIntF", "200 OK");
                        return Ok(Message);
                    }
                    else if (result == -2)
                    {
                        logger.LogResponseAsync("uplaodTranscriptToSharePointIntF", "400 Bad Request");
                        return BadRequest(Message);
                    }
                    else
                    {
                        logger.LogResponseAsync("uplaodTranscriptToSharePointIntF", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                    }

                }
                else
                {
                    logger.LogResponseAsync("uplaodTranscriptToSharePointIntF", "200 OK");
                    return Ok("Transcript not found.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uplaodTranscriptToSharePointIntF", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "uplaodTranscriptToSharePointIntF");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("uplaodVideoToSharePointInt")]
        [HttpPost]
        public IHttpActionResult uplaodVideoToSharePoint(uploadVideoInterview model)
        {
            try
            {
                logger.LogRequestAsync("uplaodVideoToSharePointInt", Request);
                int result = 0;
                string Message = string.Empty;
                string token = common.GenerateToken();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                uploadBodysharePoint uploadBodysharePoint = new uploadBodysharePoint();
                uploadBodysharePoint.file = model.fileVideo;
                uploadBodysharePoint.fileSize = model.FileSizeVideo;
                string uploadPath = ConfigurationManager.AppSettings["SharePointVideoPathInterview"] + model.cid.ToString() + "/" + model.RoundId.ToString() + "/" + model.FileNameVideo;
                string uploadUrl = common.createSessionForUploadFileSharedPoint(uploadPath, token);
                uploadBodysharePoint.uploadUrl = uploadUrl;
                UploadDetailsModel uploadFile = common.UploadFileToSharedPoint(uploadBodysharePoint, token, "uploadVideoToSharePointInterview");
                if (uploadFile.id != null)
                {
                    model.sharePointIdVideo = uploadFile.id;
                    model.FilePathVideo = uploadFile.webUrl;
                    result = objRepo.uplaodVideoToSharePoint(model, claims[5].Value, ref Message);
                }
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                else if (result == 1)
                {
                    if (model.isVideoCompare == 'Y')
                    {
                        System.Threading.Tasks.Task<string> VideoImageCampareInt = common.VideoImageCampareInterviewAsync(model.cid, claims[5].Value);
                    }
                    logger.LogResponseAsync("uplaodVideoToSharePointInt", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("uplaodVideoToSharePointInt", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("uplaodVideoToSharePointInt", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uplaodVideoToSharePointInt", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetProfilePicture");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("uploadDocVid")]
        [HttpPost]
        public IHttpActionResult uploadDocVid(uploadDocInt model)
        {
            Logger logger = new Logger();
            logger.LogRequestAsync("uploadDocVid", Request);

            try
            {
                int result = 0;
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogResponseAsync("uploadDocVid", "Claims retrieved successfully.");

                if (model.fileVideo != null && model.fileProfilePic != null && model.fileID != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    string FilePathId = ConfigurationManager.AppSettings["ProfileIdPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.FileNameProfilePic;
                    model.FilePathID = FilePathId + "\\" + model.FileNameID;
                    logger.LogResponseAsync("uploadDocVid", "File paths set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                        uploadfileCommon(FilePathId, FilePathId + "\\" + model.FileNameID, model.fileID);
                        logger.LogResponseAsync("uploadDocVid", "Files uploaded successfully.");
                    }
                }
                else if (model.fileVideo != null && model.fileProfilePic != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.FileNameProfilePic;
                    logger.LogResponseAsync("uploadDocVid", "File paths set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                        logger.LogResponseAsync("uploadDocVid", "Files uploaded successfully.");
                    }
                }
                else if (model.fileVideo != null && model.fileID != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    string FilePathId = ConfigurationManager.AppSettings["ProfileIdPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;
                    model.FilePathID = FilePathId + "\\" + model.FileNameID;
                    logger.LogResponseAsync("uploadDocVid", "File paths set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                        uploadfileCommon(FilePathId, FilePathId + "\\" + model.FileNameID, model.fileID);
                        logger.LogResponseAsync("uploadDocVid", "Files uploaded successfully.");
                    }
                }
                else if (model.fileProfilePic != null && model.fileID != null)
                {
                    string FilePathId = ConfigurationManager.AppSettings["ProfileIdPath"] + model.cid.ToString();
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.FileNameProfilePic;
                    model.FilePathID = FilePathId + "\\" + model.FileNameID;
                    logger.LogResponseAsync("uploadDocVid", "File paths set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                        uploadfileCommon(FilePathId, FilePathId + "\\" + model.FileNameID, model.fileID);
                        logger.LogResponseAsync("uploadDocVid", "Files uploaded successfully.");
                    }
                }
                else if (model.fileVideo != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;
                    logger.LogResponseAsync("uploadDocVid", "File path set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                        logger.LogResponseAsync("uploadDocVid", "File uploaded successfully.");
                    }
                }
                else if (model.fileID != null)
                {
                    string FilePathId = ConfigurationManager.AppSettings["ProfileIdPath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                   // model.FileNameID = common.GetFileWithAdditionalExtention(model.FileNameID);
                    model.FilePathID = FilePathId + "\\" + model.FileNameID;
                    logger.LogResponseAsync("uploadDocVid", "File path set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        string fileSavePath = System.IO.Path.Combine(FilePathId, model.FileNameID);
                        if (!(Directory.Exists(FilePathId)))
                        {
                            Directory.CreateDirectory(FilePathId);
                        }
                        if (File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        int encryptionResult = common.EncryptFile(model.fileID, fileSavePath);
                        if (encryptionResult != 1)
                        {
                            logger.LogErrorAsync("uploadDocVid", new Exception("Error encrypting the file."));
                            return BadRequest("Error encrypting the file.");
                        }
                        logger.LogResponseAsync("uploadDocVid", "File encrypted and saved successfully.");
                    }
                }
                else if (model.fileProfilePic != null)
                {
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + model.cid.ToString() + "\\" + model.RoundId.ToString();
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.FileNameProfilePic;
                    logger.LogResponseAsync("uploadDocVid", "File path set successfully.");

                    result = objRepo.uploadDocVid(model, claims[5].Value, ref Message);
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid repository method returned result: {result}");

                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                    else if (result == 1)
                    {
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                        logger.LogResponseAsync("uploadDocVid", "File uploaded successfully.");
                    }
                }
                else
                {
                    logger.LogResponseAsync("uploadDocVid", "Attachment not found.");
                    return BadRequest("Attachment not found.");
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("uploadDocVid", "uploadDocVid method completed successfully.");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("uploadDocVid", $"uploadDocVid method returned warning: {Message}");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogErrorAsync("uploadDocVid", new Exception("There is some error! Try again later."));
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uploadDocVid", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "upload Candidate Documents");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVideoIdentityProfilePic")]
        [HttpGet]
        public IHttpActionResult GetCandidateVideoIdentityProfilePic(int? RoundId = null, int? cid = null)
        {
            Logger logger = new Logger();
            logger.LogRequestAsync("GetCandidateVideoIdentityProfilePic", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateVideoIdentityProfilePic(claims[5].Value, out result, RoundId, cid);
                logger.LogResponseAsync("GetCandidateVideoIdentityProfilePic", "Data retrieved successfully.");

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetCandidateVideoIdentityProfilePic", "Unauthorized access.");
                    return authResult;
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateVideoIdentityProfilePic", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetProfilePicture");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetCandidateFeebackEnableStatusByCid")]
        [HttpGet]
        public IHttpActionResult GetCandidateFeebackEnableStatusByCid(int cid)
        {
            Logger logger = new Logger();
            logger.LogRequestAsync("GetCandidateFeebackEnableStatusByCid", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateFeebackEnableStatusByCid(cid, claims[5].Value, out result);
                logger.LogResponseAsync("GetCandidateFeebackEnableStatusByCid", "Data retrieved successfully.");

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetCandidateFeebackEnableStatusByCid", "Unauthorized access.");
                    return authResult;
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateFeebackEnableStatusByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetCandidateFeebackEnableStatusByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("VideoImageCampareInterview")]
        [HttpPost]
        public IHttpActionResult VideoImageCampareInterview([FromBody] VideoImageCampareInterview obj)
        {

            logger.LogRequestAsync("VideoImageCampareInterview", Request);

            try
            {
                string VideoMatchApiUrl = ConfigurationManager.AppSettings["VideoMatchApiUrl"];
                string VideoMatchApiUserName = ConfigurationManager.AppSettings["VideoMatchApiUserName"];
                string VideoMatchApiUserPassword = ConfigurationManager.AppSettings["VideoMatchApiUserPassword"];

                GetInterviewsVideos GetInterviewsVideosPrev = new GetInterviewsVideos();
                GetInterviewsVideos GetInterviewsVideosCurrent = new GetInterviewsVideos();
                obj.file2 = CommonController.GetSharePointFileinBytes(obj.sharePointIdVidPrev, obj.FileNameVideoPrev);
                obj.file1 = CommonController.GetSharePointFileinBytes(obj.sharePointIdVidCurrent, obj.FileNameVideoCurrent);
                HttpResponseMessage servicerequest = null;
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromMinutes(30);
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(VideoMatchApiUserName), "userName");
                content.Add(new StringContent(VideoMatchApiUserPassword), "password");
                content.Add(new ByteArrayContent(obj.file1, 0, obj.file1.Length), "file1", "int1.mp4");
                content.Add(new ByteArrayContent(obj.file2, 0, obj.file2.Length), "file2", "int2.mp4");
                string _url = VideoMatchApiUrl;
                servicerequest = httpClient.PostAsync(_url, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                ResponseVoiceImp jsonObj = JsonConvert.DeserializeObject<ResponseVoiceImp>(response);

                logger.LogResponseAsync("VideoImageCampareInterview", "Data retrieved successfully.");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("VideoImageCampareInterview", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "VideoImageCampareInterview");
                return BadRequest(ex.Message);
            }
        }

        [Route("GetRoundByCid")]
        [HttpGet]
        public IHttpActionResult GetRoundByCid(int cid)
        {
            Logger logger = new Logger();
            logger.LogRequestAsync("GetRoundByCid", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetRoundByCid(cid, claims[5].Value);
                logger.LogResponseAsync("GetRoundByCid", "Data retrieved successfully.");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRoundByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetRoundByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("VideoCompareByRoundId")]
        [HttpGet]
        public IHttpActionResult VideoCompareByRoundId(int cid, char Type, int roundId = 0, int roundIdPrev = 0, string empId = "")
        {
            logger.LogRequestAsync("VideoCompareByRoundId", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                if (string.IsNullOrEmpty(empId))
                {
                    empId = claims[5].Value;
                }
                System.Threading.Tasks.Task<string> VideoImageCampareIntAsync = common.VideoImageCampareInterviewAsync(cid, empId, Type, roundId, roundIdPrev);
                logger.LogResponseAsync("VideoCompareByRoundId", "Data retrieved successfully.");
                return Ok("Suc");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("VideoCompareByRoundId", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "VideoCompareByRoundId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVideoComparisonInfoByRoundId")]
        [HttpGet]
        public IHttpActionResult GetVideoComparisonInfoByRoundId(int cid, int roundId)
        {
            logger.LogRequestAsync("GetVideoComparisonInfoByRoundId", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetVideoComparisonInfoByRoundId(cid, roundId, claims[5].Value);
                logger.LogResponseAsync("GetVideoComparisonInfoByRoundId", "Data retrieved successfully.");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVideoComparisonInfoByRoundId", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetVideoComparisonInfoByRoundId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentTCAdditionalSkillByThId")]
        [HttpGet]
        public IHttpActionResult GetTalentTCAdditionalSkillByThId(int thid)
        {
            logger.LogRequestAsync("GetTalentTCAdditionalSkillByThId", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetTalentTCAdditionalSkillByThId(thid, claims[5].Value);
                logger.LogResponseAsync("GetTalentTCAdditionalSkillByThId", "Data retrieved successfully.");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentTCAdditionalSkillByThId", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetTalentTCAdditionalSkillByThId");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("SaveTechnicalQuestionnnaires")]
        [HttpPost]
        public IHttpActionResult SubmiTechnicalQuestionnnairet(TechnicalQuestionnaire techquest)
        {
            logger.LogRequestAsync("SubmiTechnicalQuestionnnairet", Request);

            try
            {
                int result = 0;
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                string questionnairePath = ConfigurationManager.AppSettings["TechnicalQuestionnairePath"] + techquest.cid;
                techquest.technicalPracticeSkillForm.techFilePath = questionnairePath + "\\" + techquest.technicalPracticeSkillForm.techFileName;

                result = objRepo.SubmitTechnicalQuestionnnaire(techquest, claims[5].Value, ref Message);

                if (result == 1 && techquest.technicalPracticeSkillForm.techFileBase64 != null)
                {
                    int techquestPath = uploadfileCommon(questionnairePath, questionnairePath + "\\" + techquest.technicalPracticeSkillForm.techFileName, techquest.technicalPracticeSkillForm.techFileBase64);
                }

                logger.LogResponseAsync("SubmiTechnicalQuestionnnairet", "Data submitted successfully.");
                return Ok(Message);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SubmiTechnicalQuestionnnairet", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "SubmiTechnicalQuestionnnairet");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetTechnicalQuestionnnaire")]
        [HttpGet]
        public IHttpActionResult GetTechnicalQuestionnnaire(int cid, int roundId)
        {
            logger.LogRequestAsync("GetTechnicalQuestionnnaire", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetTechnicalQuestionnnaire(cid, roundId, claims[5].Value);
                logger.LogResponseAsync("GetTechnicalQuestionnnaire", "Data retrieved successfully.");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTechnicalQuestionnnaire", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetTechnicalQuestionnnaire");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ExportToExcelSearchCandidate")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelSearchCandidate(SearchCandidateModel model)
        {
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>TalentID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent Cube</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Project</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Hiring Manager</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requisition Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Phone Number</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill THID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Sub Skill THID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Experience in Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Company</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Tier Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Notice Period(Days)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Profile Source</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Source Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Profile Submission Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Is Screen Rejected</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Screen Reject Reason</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Last Interview Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Last Interview Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Drop Reason</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter<font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Active Recruiter<font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Company Name<font></b></td>");
            str.Append("</tr>");
             var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetSearchCandidateReport(model, model.PageNo, model.PageSize, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentCubeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProjectName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HiringManager"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RequisitionType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TrLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Name"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Email"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["mobileNumber"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidateLocationName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkillName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentID_PSkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondarySkillName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TalentID_SSkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExperience"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExpPrimarySkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentComapnayName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TierofCompany"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NoticePeriod"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SourceTypeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProfileAddition"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["isScreenReject"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenrejectReasonName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewTypeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["interviewDate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewStatusName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["InterviewDropReasonName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryrecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["secondaryrecruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Activerecuiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OrgName"].ToString() + "</font></td>");
                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "SearchCandidate.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [Route("GetOpenRequisitionListByDateLapse")]
        [HttpGet]
        public IHttpActionResult GetOpenRequisitionListByDateLapse()
        {
            string methodName = "GetOpenRequisitionListByDateLapse";
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.GetOpenRequisitionListByDateLapse(claims[5].Value);
                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", methodName);
                logger.LogErrorAsync(methodName, ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ScheduleCoderByteInterviewByPanel")]
        [HttpPost]
        public IHttpActionResult ScheduleCoderByteInterviewByPanel()
        {
            FeedbackModel fb = new FeedbackModel();
            var frm = HttpContext.Current.Request.Form;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();         

            try
            {
                int result = 0;
                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.OnlineAssessmentBy = Convert.ToInt32(frm["OnlineAssessmentBy"]);

                CodeByteInterviewSchedule coderByteObj = new CodeByteInterviewSchedule();
                coderByteObj.candidates.Add(frm["candidateEmail"]);
                coderByteObj.assessment_url = frm["assessment_url"];

                CodeByteInterviewScheduleResponse jsonObj = new CodeByteInterviewScheduleResponse();
                jsonObj = CommonController.InterviewScheduleCoderByte(coderByteObj);

                fb.codebyteTestId = jsonObj.data.test_id;
                fb.coderBytePrivateUrl = jsonObj.data.candidates[0].url;
                fb.coderBytePublicUrl = frm["assessment_url"];
                fb.coderByteDisplayName = frm["coderByteDisplayName"];

                string EmpID = claims[5].Value; // New Employee ID
                result = objRepo.ScheduleCoderByteInterviewByPanel(fb, EmpID);

                logger.LogRequestAsync("ScheduleCoderByteInterviewByPanel", Request); // Log request

                if (result > 0)
                {
                    logger.LogResponseAsync("ScheduleCoderByteInterviewByPanel", "Success"); // Log response
                    return Ok("Interview Scheduled Successfully");
                }
                else if (result == -1)
                {
                    logger.LogResponseAsync("ScheduleCoderByteInterviewByPanel", "Time expired"); // Log response
                    return BadRequest("You can't send assessment as time expired");
                }
                else
                {
                    logger.LogResponseAsync("ScheduleCoderByteInterviewByPanel", "Error"); // Log response
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Interview", "ScheduleCoderByteInterviewByPanel");
                logger.LogErrorAsync("ScheduleCoderByteInterviewByPanel", ex); // Log error
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getQuestionsByCid")]
        [HttpGet]
        public IHttpActionResult GetQuestionsByCid(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetQuestionsByCid", Request);
                return Ok(objRepo.GetQuestionsByCid(cid, claims[5].Value));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetQuestionsByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "getQuestionsByCid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GenerateQuestionByCid")]
        [HttpGet]
        public IHttpActionResult GenerateQuestionByCid(int cid, string empId)
        {
            try
            {
                logger.LogRequestAsync("GenerateQuestionByCid", Request);
                System.Threading.Tasks.Task<string> autQuestionSave = common.UpdateAutoQuestionsForTechRound(cid, empId);
                return Ok("Question Generated.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GenerateQuestionByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "Question Generated.");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateQuestionList")]
        [HttpPost]
        public IHttpActionResult AddUpdateQuestionListByPanel(updateQuestionAuto model)
        {
            try
            {
                int result = 0;
                string Message = string.Empty;

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                result = objRepo.AddUpdateQuestionListByPanel(model, claims[5].Value, ref Message);
                logger.LogRequestAsync("AddUpdateQuestionListByPanel", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("AddUpdateQuestionListByPanel", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddUpdateQuestionListByPanel", claims[5].Value);
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateQuestionListByPanel", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "AddUpdateQuestionListByPanel");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetTehRoundCountByCid")]
        [HttpGet]
        public IHttpActionResult GetTehRoundCountByCid(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetTehRoundCountByCid(cid, claims[5].Value);
                logger.LogRequestAsync("GetTehRoundCountByCid", Request);
                logger.LogResponseAsync("GetTehRoundCountByCid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTehRoundCountByCid", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetTehRoundCountByCid.");
                return BadRequest("There is some error! Try again later");
            }
        }

         [Route("ResumeParseAndUpdateByCid")]
        [HttpGet]
        public IHttpActionResult ResumeParseAndUpdateByCid(int cid, int ProfileId = 0, int IsProfileInterview = 0)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                GlobalFunctions GlobalFunctions = new GlobalFunctions();
                System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(cid, claims[5].Value,IsProfileInterview);
                return Ok("Updated succesfully");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "ResumeCompatibilityRatingUpdate API.");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("TranscriptUpdate")]
        [HttpGet]
        public IHttpActionResult TranscriptUpdate(int cid, int roundId)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                if (claims == null || claims.Count < 6)
                {
                    return BadRequest("Invalid user claims.");
                }

                System.Threading.Tasks.Task<string> UploadTransSciptInt =  common.TranscriptProcessUpdate(cid, roundId, claims[5].Value);

                return Ok("Updated succesfully");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("TranscriptUpdate", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "update Transcript.");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendEmailCoderByte")]
        [HttpGet]
        public IHttpActionResult sendEmailATS(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("sendEmailATS", Request);
                SendEmailATS(cid, claims[5].Value, "M");
                logger.LogResponseAsync("sendEmailATS", "200 OK");
                return Ok("Updated successfully");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("sendEmailATS", ex);
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "ResendEmailCoderByte.");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("downloadInterviewDocument")]
        [HttpGet]
        public HttpResponseMessage downloadInterviewDocument(int cid, int roundid, string docType)
        {
            try
            {
                if (cid == null || docType == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid parameters.");
                }
                logger.LogRequestAsync("downloadInterviewDocument", Request);

                // Fetch document path from database
                DataSet ds = objRepo.getInterviewDocumentPath(cid, roundid, docType);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString(); // Assuming the first column contains the path

                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                string filePath = filelocation;
                string fileName = Path.GetFileName(filePath);
                string mimeType = MimeMapping.GetMimeMapping(fileName);
                byte[] fileBytes;

                if (Path.GetExtension(fileName).Equals(".dat", StringComparison.OrdinalIgnoreCase) ||
                    Path.GetExtension(fileName).Equals(".enc", StringComparison.OrdinalIgnoreCase))
                {
                    // If file is .dat, decrypt it
                    string originalFileName = common.RemoveLastExtension(fileName);

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fileBytes = new byte[fs.Length];
                        fs.Read(fileBytes, 0, fileBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(fileBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                    }

                    fileBytes = decryptedBytes;
                    fileName = originalFileName;
                    mimeType = MimeMapping.GetMimeMapping(originalFileName);
                }
                else
                {
                    // Regular file reading for non .dat files
                    fileBytes = File.ReadAllBytes(filePath);
                }

                // Prepare response
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };

                response.Content.Headers.ContentLength = fileBytes.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileName
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

                logger.LogResponseAsync("downloadInterviewDocument", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadInterviewDocument", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

        [Route("downloadGovtIdDocument")]
        [HttpGet]
        public HttpResponseMessage downloadGovtIdDocument(int cid)
        {
            try
            {
                if (cid == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid parameters.");
                }
                logger.LogRequestAsync("downloadGovtIdDocument", Request);

                // Fetch document path from database
                DataSet ds = objRepo.getGovtIdDocPath(cid);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString(); // Assuming the first column contains the path

                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                string filePath = filelocation;
                string fileName = Path.GetFileName(filePath);
                string mimeType = MimeMapping.GetMimeMapping(fileName);
                byte[] fileBytes;

                if (Path.GetExtension(fileName).Equals(".dat", StringComparison.OrdinalIgnoreCase) ||
                    Path.GetExtension(fileName).Equals(".enc", StringComparison.OrdinalIgnoreCase))
                {
                    // If file is .dat, decrypt it
                    string originalFileName = common.RemoveLastExtension(fileName);

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fileBytes = new byte[fs.Length];
                        fs.Read(fileBytes, 0, fileBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(fileBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                    }

                    fileBytes = decryptedBytes;
                    fileName = originalFileName;
                    mimeType = MimeMapping.GetMimeMapping(originalFileName);
                }
                else
                {
                    // Regular file reading for non .dat files
                    fileBytes = File.ReadAllBytes(filePath);
                }

                // Prepare response
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };

                response.Content.Headers.ContentLength = fileBytes.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileName
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

                logger.LogResponseAsync("downloadGovtIdDocument", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadGovtIdDocument", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

        [Route("updateConsetnByRecForVideoCompare")]
        [HttpPost]
        public IHttpActionResult updateConsetnByRecForVideoCompare(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("updateConsetnByRecForVideoCompare", Request);
                string Message = string.Empty;
                int result = objRepo.updateConsetnByRecForVideoCompare(cid, claims[5].Value, ref Message);
                if (result == 1)
                {
                    logger.LogResponseAsync("updateConsetnByRecForVideoCompare", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    return BadRequest(Message);
                }
                else if (result == -4)
                {
                    return BadRequest("Record not found");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateConsetnByRecForVideoCompare", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "updateConsetnByRecForVideoCompare");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetAIResumeRatingByCid")]
        [HttpGet]
        public IHttpActionResult GetAIResumeRatingByCid(int id, int IsProfileInterview,char profileSource='N',int? profileId=0)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetAIResumeRatingByCid(id, IsProfileInterview, claims[5].Value, profileSource, profileId));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "InterviewFeedback", "GetAIResumeRatingByCid");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("UploadMultipleResumesToParse")]
        [HttpPost]
        public async Task<IHttpActionResult> UploadMultipleResumesToParse()
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                    return BadRequest("Unsupported media type.");

                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);

                string thId = null;
                string filenames = null;
                var filesContent = new List<ByteArrayContent>();

                foreach (var content in provider.Contents)
                {
                    var contentDisposition = content.Headers.ContentDisposition;
                    var name = contentDisposition.Name?.Trim('"');

                    if (name == "th_id")
                    {
                        thId = await content.ReadAsStringAsync();
                    }
                    else if (name == "filenames")
                    {
                        filenames = await content.ReadAsStringAsync();
                    }
                    else if (name == "resumes")
                    {
                        var fileBytes = await content.ReadAsByteArrayAsync();
                        var fileName = contentDisposition.FileName?.Trim('"') ?? "resume";
                        var fileContent = new ByteArrayContent(fileBytes);
                        fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                        {
                            Name = "resumes",
                            FileName = fileName
                        };
                        fileContent.Headers.ContentType = content.Headers.ContentType ?? new MediaTypeHeaderValue("application/octet-stream");
                        filesContent.Add(fileContent);
                    }
                }

                if (string.IsNullOrEmpty(thId) || string.IsNullOrEmpty(filenames) || filesContent.Count == 0)
                    return BadRequest("Missing required fields or files.");

                // Forward to external API
                using (var client = new HttpClient())
                using (var form = new MultipartFormDataContent())
                {
                    foreach (var fileContent in filesContent)
                        form.Add(fileContent);

                    form.Add(new StringContent(thId), "th_id");
                    form.Add(new StringContent(filenames), "filenames");
                    string ResumeParseApiURLApiUrl = ConfigurationManager.AppSettings["ResumeParseApiURL"];
                    var apiUrl = ResumeParseApiURLApiUrl; // Replace with your actual API URL
                    var response = await client.PostAsync(apiUrl, form);
                    var responseString = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                        return Ok(JsonConvert.DeserializeObject(responseString));
                    else
                        return BadRequest("Error from parsing API: " + responseString);
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "ResumeUpload", "UploadMultipleResumesToParse");
                return BadRequest("Something went wrong while uploading resumes.");
            }
        }


    }
}
