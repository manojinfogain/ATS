using Aspose.Pdf;
using Aspose.Pdf.Facades;
using Aspose.Pdf.Forms;
using Aspose.Pdf.Text;
using ATSAPI.App_Data;
using ATSAPI.Areas.HelpPage;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Wordprocessing;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using iTextSharp.tool.xml;
using Microsoft.Exchange.WebServices.Data;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using PdfSharp.Pdf;
using PdfSharp.Pdf.Advanced;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Windows.Controls;
using Page = Aspose.Pdf.Page;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/OnBoard")]
    public class OnboardController : ApiController
    {
        OnboardRepository objRepo = new OnboardRepository();
        OnboardRepository obj = new OnboardRepository();
        Common common = new Common();
        CommonController CommonController = new CommonController();
        EmailSender EmailSender = new EmailSender();
        ATSMailers Mailers = new ATSMailers();
        Logger logger = new Logger();

        [Route("GetPipelineJoineeCandidateList")]
        [HttpPost]
        public IHttpActionResult getPipelineJoineeCandidateList([FromBody] PipelineJoineeListFilters obj)
        {
            try
            {
                logger.LogRequestAsync("GetPipelineJoineeCandidateList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;

                // Fetch data from the repository
                var data = objRepo.getPipelineJoineeCandidateList(obj, claims[5].Value, out result);

                // Handle authorization result
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetPipelineJoineeCandidateList", authResult.ToString());
                    return authResult;
                }

                // Check if data is available
                if (data?.Tables.Count > 0 && data.Tables[0].Rows.Count > 0)
                {
                    var table = data.Tables[0];

                    // Pagination details
                    int Total = Convert.ToInt32(data.Tables[1].Rows[0]["Total"]); // Assuming the second table contains total count
                    int page = obj.PageNo;
                    int pageSize = obj.PageSize;

                    logger.LogResponseAsync("GetPipelineJoineeCandidateList", "200 OK");
                    return Ok(new
                    {
                        data = table,
                        Paging = new[]
                        {
                               new
                               {
                                 Total,
                                 page,
                                 pageSize
                               }
                        }
                    });

                }

                // Return empty data if no records are found
                logger.LogResponseAsync("GetPipelineJoineeCandidateList", "200 OK - No Data");
                return Ok(new
                {
                    data = new object[0],
                    Paging = new
                    {
                        Total = 0,
                        page = obj.PageNo,
                        pageSize = obj.PageSize,
                    }
                });
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPipelineJoineeCandidateList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "getPipelineJoineeCandidateList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("updateJoineeCandidateStatus")]
        [HttpPost]
        public IHttpActionResult UpdateJoineeCandidateStatus([FromBody] UpdateJoineeCandidateStatus obj)
        {
            try
            {
                logger.LogRequestAsync("UpdateJoineeCandidateStatus", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateJoineeCandidateStatus(obj, claims[5].Value, ref Message);
                if (result == 3 || result == 4)
                {
                    // Send mail with appropriate change type
                    int mailerResult = SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange(obj.cid, result);
                }
                if (result >= 1) { 
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateStatus", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateStatus", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateJoineeCandidateStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "UpdateJoineeCandidateStatus");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("ResendEmailModeOrDOJChange")]
        [HttpPost]
        public IHttpActionResult ResendEmailModeOrDOJChange(int cid,int chnageType)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int mailerResult = SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange(cid, chnageType);
              
                if (mailerResult == 1)
                    return Ok("Email Sent.");
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "UpdateJoineeCandidateStatus");
                return BadRequest("There is some error! Try again later");
            }

        }

        public int SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange(int cid, int changeType)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                DataSet ds = objRepo.SendJoiningItineraryToCandidateMaileronDOJorOnboardingModeChange(cid, claims[5].Value, changeType);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                }

                string ItineraryAttachmentsPath = ds.Tables[0].Rows[0]["JoiningItineraryattachment"].ToString();
                //string AttachmentsPath = ds.Tables[0].Rows[0]["Attachment"].ToString();


                string encryptedFilePath = ds.Tables[0].Rows[0]["JoiningItineraryattachment"].ToString();
                MailerConfig MailerConfig = new MailerConfig();

                List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();

                if (!string.IsNullOrEmpty(ItineraryAttachmentsPath))
                {

                    byte[] encryptedBytes;
                    string encryptedFileName = Path.GetFileName(encryptedFilePath);
                    string originalFileName = common.RemoveLastExtension(encryptedFileName);

                    using (FileStream fs = new FileStream(encryptedFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);

                    if (decryptedBytes != null || decryptedBytes.Length != 0)
                    {
                        attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));
                    }

                }


                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();


                if (Convert.ToInt32(ds.Tables[0].Rows[0]["IsOnboardFormShared"]) == 1)
                {
                    EmailSender.SendEmailATS(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);

                }

                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendJoiningItineraryToCandidateMailer");
                return 0;
            }
        }

        [Route("addJoineeCandidateDetailsByISS")]
        [HttpPost]
        public IHttpActionResult AddJoineeCandidateDetailsByISS([FromBody] JoineeCandidateDetails obj)
        {
            try
            {
                logger.LogRequestAsync("AddJoineeCandidateDetailsByISS", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.AddJoineeCandidateDetailsByISS(obj, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("AddJoineeCandidateDetailsByISS", authResult.ToString());
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("AddJoineeCandidateDetailsByISS", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("AddJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("AddJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddJoineeCandidateDetailsByISS", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "AddJoineeCandidateDetailsByISS");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("updateJoineeCandidateDetailsByISS")]
        [HttpPost]
        public IHttpActionResult UpdateJoineeCandidateDetailsByISS([FromBody] JoineeCandidateDetails obj)
        {
            try
            {
                logger.LogRequestAsync("UpdateJoineeCandidateDetailsByISS", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateJoineeCandidateDetailsByISS(obj, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateDetailsByISS", authResult.ToString());
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateDetailsByISS", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateJoineeCandidateDetailsByISS", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "UpdateJoineeCandidateDetailsByISS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DeleteJoineeCandidateDetailsByISS")]
        [HttpDelete]
        public IHttpActionResult DeleteJoineeCandidateDetailsByISS(int cid)
        {
            try
            {
                logger.LogRequestAsync("DeleteJoineeCandidateDetailsByISS", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.DeleteJoineeCandidateDetailsByISS(cid, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("DeleteJoineeCandidateDetailsByISS", authResult.ToString());
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("DeleteJoineeCandidateDetailsByISS", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("DeleteJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("DeleteJoineeCandidateDetailsByISS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DeleteJoineeCandidateDetailsByISS", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "DeleteJoineeCandidateDetailsByISS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CreateCandidateUser")]
        [HttpPost]
        public IHttpActionResult CreateCandidateUser(CandidateUser obj)
        {
            try
            {
                logger.LogRequestAsync("CreateCandidateUser", Request);
                DataSet rlist = objRepo.getCandidateDetails(obj.cid);
                string Email = rlist.Tables[0].Rows[0]["email"].ToString();
                Guid g = Guid.NewGuid();
                string Salt = Convert.ToBase64String(g.ToByteArray());
                Salt = Salt.Replace("=", "");
                Salt = Salt.Replace("+", "");
                string pwdTxt = Email.Substring(0, 4) + "@" + (new Random()).Next(100, 1000).ToString();
                string Password = common.Encrypt(pwdTxt, Salt);
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.CreateCandidateUser(obj, Password, Salt, pwdTxt, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("CreateCandidateUser", authResult.ToString());
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("CreateCandidateUser", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("CreateCandidateUser", "400 Bad Request");
                    return BadRequest(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CreateCandidateUser", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CreateCandidateUser", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CreateCandidateUser", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "CreatePartnerUser");
                return BadRequest("There is some error! Try again later");
            }
        }
        [Route("getAllOnboardCandidateList")]
        [HttpPost]
        public IHttpActionResult GetAllOnboardCandidateList(OnboardListFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetAllOnboardCandidateList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;

                // Fetch data from the repository
                var data = objRepo.GetAllOnboardCandidateList(claims[5].Value, obj, out result);

                // Handle authorization result
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetAllOnboardCandidateList", authResult.ToString());
                    return authResult;
                }

                // Check if data is available
                if (data?.Tables.Count > 0 && data.Tables[0].Rows.Count > 0)
                {
                    var table = data.Tables[0];

                    // Pagination details
                    int Total = Convert.ToInt32(data.Tables[1].Rows[0]["Total"]); // Assuming the second table contains total count
                    int page = obj.page;
                    int pageSize = obj.pageSize;

                    logger.LogResponseAsync("GetAllOnboardCandidateList", "200 OK");
                    return Ok(new
                    {
                        data = table,
                        pagination = new[]
                        {
                               new
                               {
                                 Total,
                                 page,
                                 pageSize
                               }
                        }
                    });
                    
                }

                // Return empty data if no records are found
                logger.LogResponseAsync("GetAllOnboardCandidateList", "200 OK - No Data");
                return Ok(new
                {
                    data = new object[0],
                    pagination = new
                    {
                        Total = 0,
                        page = obj.page,
                        pageSize = obj.pageSize,
                    }
                });
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllOnboardCandidateList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "getAllOnboardCandidateList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getCandidatePersonalDetails")]
        [HttpGet]
        public IHttpActionResult getCandidatePersonalDetails(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidatePersonalDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidatePersonalDetails(cid, claims[5].Value, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("getCandidatePersonalDetails", authResult.ToString());
                    return authResult;
                }
                if (data?.Tables.Count > 0 && data.Tables[0].Rows.Count > 0)
                {
                    var table = data.Tables[0];
                    logger.LogResponseAsync("getCandidatePersonalDetails", "200 OK");
                    return Ok(new { data = table });
                }

                // Return empty data if no records are found
                logger.LogResponseAsync("getCandidatePersonalDetails", "200 OK - No Data");
                return Ok(new { data = new object[0] });
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidatePersonalDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "getCandidatePersonalDetails");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getCandidateAllDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateAllDetails(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidateAllDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateAllDetails(cid, claims[5].Value, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("getCandidateAllDetails", authResult.ToString());
                    return authResult;
                }

                if (data?.Tables.Count > 0)
                {
                    var response = new
                    {
                        familyData = data.Tables["familyData"],
                        educationData = data.Tables["educationData"],
                        employmentData = data.Tables["employmentData"],
                        trainingData = data.Tables["trainingData"],
                        salaryData = data.Tables["salaryData"],
                        questionireData = data.Tables["questionireData"],
                        refrenceData = data.Tables["refrenceData"],
                        MandateJoiningDocUpload = data.Tables["MandateJoiningDocUpload"]
                    };

                    logger.LogResponseAsync("getCandidateAllDetails", "200 OK");
                    return Ok(response);
                }

                // Return empty data if no records are found
                logger.LogResponseAsync("getCandidateAllDetails", "200 OK - No Data");
                return Ok(new
                {
                    familyData = new object[0],
                    educationData = new object[0],
                    employmentData = new object[0],
                    trainingData = new object[0],
                    salaryData = new object[0],
                    questionireData = new object[0],
                    refrenceData = new object[0],
                    MandateJoiningDocUpload = new object[0]
                });
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateAllDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "getCandidatePersonalDetails");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("getCandidateDocumentList")]
        [HttpGet]
        public IHttpActionResult getCandidateDocumentList(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidateDocumentList", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateDocumentList(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("getCandidateDocumentList", authResult.ToString());
                    return authResult;
                }

                if (data?.Tables.Count > 0 && data.Tables[0].Rows.Count > 0)
                {
                    var table = data.Tables[0];
                    logger.LogResponseAsync("getCandidateDocumentList", "200 OK");
                    return Ok(new { data = table });
                }

                // Return empty data if no records are found
                logger.LogResponseAsync("getCandidateDocumentList", "200 OK - No Data");
                return Ok(new { data = new object[0] });
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDocumentList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "getCandidatePersonalDetails");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("DownloadDocument")]
        [HttpGet]
        public HttpResponseMessage DownloadDocument(int docId, string cid)
        {
            try
            {
                logger.LogRequestAsync("DownloadDocument", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetCandidateDocumentByid(docId, cid, claims[5].Value, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = ds.Tables[0].Rows[0]["documentPath"].ToString() + "\\" + ds.Tables[0].Rows[0]["documentName"].ToString();
                    string fileName = Path.GetFileName(filePath);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }
                    byte[] bytes = File.ReadAllBytes(filePath);
                    response.Content = new ByteArrayContent(bytes);
                    response.Content.Headers.ContentLength = bytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));
                    logger.LogResponseAsync("DownloadDocument", "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "not found");
                logger.LogResponseAsync("DownloadDocument", "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadDocument", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("verificationOnboardingByRecHr")]
        [HttpPost]
        public IHttpActionResult verificationOnboardingByRecHr([FromBody] verificationOnboardingByRecHr obj)
        {
            try
            {
                logger.LogRequestAsync("verificationOnboardingByRecHr", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.verificationOnboardingByRecHr(obj, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);                    
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("verificationOnboardingByRecHr", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("verificationOnboardingByRecHr", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("verificationOnboardingByRecHr", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("verificationOnboardingByRecHr", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "UpdateJoineeCandidateStatus");
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
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "uploadfileCommon");
                return 0;
            }


        }

        [Route("uploadPicVideoOnboard")]
        [HttpPost]
        public IHttpActionResult uploadPicVideoOnboard(uploadDocOnBoards model)
        {
            try
            {
                logger.LogRequestAsync("uploadPicVideoOnboard", Request);

                int result = 0;
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                if (model.fileVideo != null && model.fileProfilePic != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + "\\onboard\\" + model.cid.ToString();
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + "\\onboard\\" + model.cid.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.fileProfilePic;

                    result = objRepo.uploadPicVideoOnboard(model, claims[5].Value, ref Message);
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "uploadPicVideoOnboard", claims[5].Value);
                        return authResult;
                    }

                    if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                    }
                }
                else if (model.fileVideo != null)
                {
                    string FilePathVid = ConfigurationManager.AppSettings["ProfileVideoPath"] + "\\onboard\\" + model.cid.ToString();
                    model.FilePathVideo = FilePathVid + "\\" + model.FileNameVideo;

                    result = objRepo.uploadPicVideoOnboard(model, claims[5].Value, ref Message);
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "uploadPicVideoOnboard", claims[5].Value);
                        return authResult;
                    }

                    if (result == 1)
                    {
                        uploadfileCommon(FilePathVid, FilePathVid + "\\" + model.FileNameVideo, model.fileVideo);
                    }
                }
                else if (model.fileProfilePic != null)
                {
                    string FilePathProfilePic = ConfigurationManager.AppSettings["ProfilePicturePath"] + "\\onboard\\" + model.cid.ToString();
                    model.FilePathProfilePic = FilePathProfilePic + "\\" + model.FileNameProfilePic;

                    result = objRepo.uploadPicVideoOnboard(model, claims[5].Value, ref Message);
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "uploadPicVideoOnboard", claims[5].Value);
                        return authResult;
                    }

                    if (result == 1)
                    {
                        uploadfileCommon(FilePathProfilePic, FilePathProfilePic + "\\" + model.FileNameProfilePic, model.fileProfilePic);
                    }
                }
                else
                {
                    logger.LogResponseAsync("uploadPicVideoOnboard", "400 Bad Request");
                    return BadRequest("Attachment not found.");
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("uploadPicVideoOnboard", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("uploadPicVideoOnboard", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("uploadPicVideoOnboard", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uploadPicVideoOnboard", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "upload Candidate Documents");
                return BadRequest("There is some error! Try again later.");
            }
        }
        [Route("checkVoiceImprint")]
        [HttpPost]
        public IHttpActionResult CheckVoiceImprint([FromBody] CheckVoiceImprint obj)
        {
            try
            {
                logger.LogRequestAsync("checkVoiceImprint", Request);

                string VideoMatchApiUrl = ConfigurationManager.AppSettings["VideoMatchApiUrl"];
                string VideoMatchApiUserName = ConfigurationManager.AppSettings["VideoMatchApiUserName"];
                string VideoMatchApiUserPassword = ConfigurationManager.AppSettings["VideoMatchApiUserPassword"];

                obj.file2 = CommonController.GetSharePointFileinBytes(obj.techvidId, obj.techvidName);
                HttpResponseMessage servicerequest = null;
                HttpClient httpClient = new HttpClient { Timeout = TimeSpan.FromMinutes(30) };
                var content = new MultipartFormDataContent
        {
            { new StringContent(VideoMatchApiUserName), "userName" },
            { new StringContent(VideoMatchApiUserPassword), "password" },
            { new ByteArrayContent(obj.file1, 0, obj.file1.Length), "file1", "int1.mp4" },
            { new ByteArrayContent(obj.file2, 0, obj.file2.Length), "file2", "int2.mp4" }
        };

                servicerequest = httpClient.PostAsync(VideoMatchApiUrl, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                logger.LogResponseAsync("checkVoiceImprint", "200 OK");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("checkVoiceImprint", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "checkVoiceImprint");
                return BadRequest(ex.Message);
            }
        }



        [Route("checkVoiceImprintTest")]
        [HttpPost]
        public IHttpActionResult checkVoiceImprintTest([FromBody] CheckVoiceImprint obj)
        {
            try
            {
                logger.LogRequestAsync("checkVoiceImprintTest", Request);

                string VideoMatchApiUrl = ConfigurationManager.AppSettings["VideoMatchApiUrl"];
                string VideoMatchApiUserName = ConfigurationManager.AppSettings["VideoMatchApiUserName"];
                string VideoMatchApiUserPassword = ConfigurationManager.AppSettings["VideoMatchApiUserPassword"];

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result, result1;
                DataSet ds = objRepo.GetVideoProfilePicOnboard(obj.cid, claims[5].Value, out result);
                DataSet ds1 = objRepo.GetVideoTechHR(obj.cid, claims[5].Value, out result1);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "checkVoiceImprintTest", claims[5].Value);
                    return authResult;
                }
                var authResult1 = CommonController.HandleAuthorizationResult(result1);
                if (authResult1 != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "checkVoiceImprintTest", claims[5].Value);
                    return authResult1;
                }

                obj.file2 = CommonController.GetSharePointFileinBytes(ds.Tables[0].Rows[0]["sharePointIdVideo"].ToString(), ds.Tables[0].Rows[0]["FileNameVideo"].ToString());
                obj.file1 = CommonController.GetSharePointFileinBytes(ds1.Tables[0].Rows[0]["sharePointIdVideo"].ToString(), ds1.Tables[0].Rows[0]["FileNameVideo"].ToString());

                HttpResponseMessage servicerequest = new HttpClient { Timeout = TimeSpan.FromMinutes(30) }
                    .PostAsync(VideoMatchApiUrl, new MultipartFormDataContent
                    {
                { new StringContent(VideoMatchApiUserName), "userName" },
                { new StringContent(VideoMatchApiUserPassword), "password" },
                { new ByteArrayContent(obj.file1, 0, obj.file1.Length), "file1", "int1.mp4" },
                { new ByteArrayContent(obj.file2, 0, obj.file2.Length), "file2", "int2.mp4" }
                    }).Result;

                string response = servicerequest.Content.ReadAsStringAsync().Result;

                logger.LogResponseAsync("checkVoiceImprintTest", "200 OK");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("checkVoiceImprintTest", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "checkVoiceImprintTest");
                return BadRequest(ex.Message);
            }
        }




        [Route("CandidateIdentificationByHR")]
        [HttpPost]
        public IHttpActionResult CandidateIdentificationByHR(CandidateIdentificationByHR model)
        {
            try
            {
                logger.LogRequestAsync("CandidateIdentificationByHR", Request);
                int result = 0;
                string Message = string.Empty;
                string token = common.GenerateToken();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                if (model.OnboardingMode == 1)
                {
                    model.fileVideo = null;
                    model.FileNameVideo = null;
                    model.FilePathVideo = null;
                    model.sharePointIdVideo = null;
                    model.videoMatchPercent = 0;
                    result = objRepo.CandidateIdentificationByHR(model, claims[5].Value, ref Message);
                }
                else
                {
                    uploadBodysharePoint uploadBodysharePoint = new uploadBodysharePoint();
                    uploadBodysharePoint.file = model.fileVideo;
                    uploadBodysharePoint.fileSize = model.FileSizeVideo;
                    string uploadPath = ConfigurationManager.AppSettings["SharePointVideoPathOnboard"] + model.cid.ToString() + "/" + model.FileNameVideo;
                    string uploadUrl = common.createSessionForUploadFileSharedPoint(uploadPath, token);
                    uploadBodysharePoint.uploadUrl = uploadUrl;
                    UploadDetailsModel uploadFile = common.UploadFileToSharedPoint(uploadBodysharePoint, token, "uploadVideoToSharePointOnboard");
                    if (uploadFile.id != null)
                    {
                        model.sharePointIdVideo = uploadFile.id;
                        model.FilePathVideo = uploadFile.webUrl;
                        result = objRepo.CandidateIdentificationByHR(model, claims[5].Value, ref Message);
                    }
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("CandidateIdentificationByHR", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("CandidateIdentificationByHR", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateIdentificationByHR", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateIdentificationByHR", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "CandidateIdentificationByHR");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("SendEmailtoITTeamOnboardVideoResult")]
        [HttpPost]
        public IHttpActionResult SendEmailtoITTeamOnboardVideoResult(CandidateIdentificationByHR model)
        {
            try
            {
                logger.LogRequestAsync("SendEmailtoITTeamOnboardVideoResult", Request);
                int result = 0;
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                result = objRepo.SendEmailtoITTeamOnboardVideoResult(model, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("SendEmailtoITTeamOnboardVideoResult", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("SendEmailtoITTeamOnboardVideoResult", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendEmailtoITTeamOnboardVideoResult", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendEmailtoITTeamOnboardVideoResult", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "SendEmailtoITTeamOnboardVideoResult");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVideoProfilePicOnboard")]
        [HttpGet]
        public IHttpActionResult GetVideoProfilePicOnboard(int cid)
        {
            try
            {
                logger.LogRequestAsync("GetVideoProfilePicOnboard", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetVideoProfilePicOnboard(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetVideoProfilePicOnboard", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetVideoProfilePicOnboard", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVideoProfilePicOnboard", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "GetProfilePicture");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetAllCandidatesForHRValidation")]
        [HttpPost]
        public IHttpActionResult GetAllCandidatesForHRValidation(OfferApprovedCandidateFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetAllCandidatesForHRValidation", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetAllCandidatesForHRValidation(claims[5].Value, obj, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetAllCandidatesForHRValidation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllCandidatesForHRValidation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetAllCandidatesForHRValidation");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("VerificationOnboardingCandidateDetails")]
        [HttpPost]
        public IHttpActionResult FinalVerificationOnboardingByRecHr([FromBody] VerificationOnboardingCandidateDetails obj)
        {
            try
            {
                logger.LogRequestAsync("FinalVerificationOnboardingByRecHr", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.FinalVerificationOnboardingByRecHr(obj, claims[5].Value, ref Message);

                if (result == 1)
                {
                    if (obj.ActionBy == 'H')
                    {
                        System.Threading.Tasks.Task<int> ResumePath = CreatePDFforEAF(obj.cid, 1);
                    }

                    logger.LogResponseAsync("FinalVerificationOnboardingByRecHr", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("FinalVerificationOnboardingByRecHr", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("FinalVerificationOnboardingByRecHr", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("FinalVerificationOnboardingByRecHr", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "FinalVerificationOnboardingByRecHr");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("refferedbackToCandidateByRecruiter")]
        [HttpPost]
        public IHttpActionResult RefferedbackToCandidateByRecruiter([FromBody] VerificationOnboardingCandidateDetails obj)
        {
            try
            {
                logger.LogRequestAsync("RefferedbackToCandidateByRecruiter", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.RefferedbackToCandidateByRecruiter(obj, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("RefferedbackToCandidateByRecruiter", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("RefferedbackToCandidateByRecruiter", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("RefferedbackToCandidateByRecruiter", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("RefferedbackToCandidateByRecruiter", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "RefferedbackToCandidateByRecruiter");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("sendOnboardDocToCandidate")]
        [HttpPost]
        public IHttpActionResult sendOnboardDocToCandidate([FromBody] sendOnboardForm obj)
        {
            try
            {
                logger.LogRequestAsync("sendOnboardDocToCandidate", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.sendOnboardDocToCandidate(obj, claims[5].Value, ref Message);
                string EmpId = claims[5].Value;

                if (result == 1)
                {
                    if (obj.formType == 'O')
                    {
                        int mailSentResult = Mailers.SendEnableDisableOnboardingFormMailer(obj.cid, obj.formId, EmpId);
                    }

                    logger.LogResponseAsync("sendOnboardDocToCandidate", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("sendOnboardDocToCandidate", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("sendOnboardDocToCandidate", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("sendOnboardDocToCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "sendOnboardDocToCandidate");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendEnableDisableOnboardingFormMailer")]
        [HttpGet]
        public IHttpActionResult ReSendEnableDisableOnboardingFormMailer(int cid,string formId=null)
        {
            try
            {
                logger.LogRequestAsync("ReSendEnableDisableOnboardingFormMailer", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int mailSentResult = Mailers.SendEnableDisableOnboardingFormMailer(cid, formId, claims[5].Value);

                if (mailSentResult == 1)
                {
                    logger.LogResponseAsync("ReSendEnableDisableOnboardingFormMailer", "200 OK");
                    return Ok(new { message = "Email Sent Successfully" });
                }
                else
                {
                    logger.LogResponseAsync("ReSendEnableDisableOnboardingFormMailer", "400 Bad Request");
                    return BadRequest("Failed to send email. Please try again.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ReSendEnableDisableOnboardingFormMailer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "ReSendEnableDisableOnboardingFormMailer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("OnboardFormEnableDisable")]
        [HttpPost]
        public IHttpActionResult OnboardFormEnableDisable([FromBody] OnboardFormEnableDisable obj)
        {
            try
            {
                logger.LogRequestAsync("OnboardFormEnableDisable", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.OnboardFormEnableDisable(obj, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("OnboardFormEnableDisable", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("OnboardFormEnableDisable", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("OnboardFormEnableDisable", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("OnboardFormEnableDisable", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "OnboardFormEnableDisable");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOnboardingFormList")]
        [HttpGet]
        public IHttpActionResult GetOnboardingFormList(int cid, int formType)
        {
            try
            {
                logger.LogRequestAsync("GetOnboardingFormList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOnboardingFormList(cid, claims[5].Value, formType, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOnboardingFormList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetOnboardingFormList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOnboardingFormList", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "GetOnboardingFormList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getOnboardingFormDetails")]
        [HttpGet]
        public IHttpActionResult GetOnboardingFormDetails(int cid, int formType, int? formId = null)
        {
            try
            {
                logger.LogRequestAsync("GetOnboardingFormDetails", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType, out result, formId);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOnboardingFormDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetOnboardingFormDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOnboardingFormDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "onboard", "GetOnboardingFormDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("OnboardingFormVerificationByFormId")]
        [HttpPost]
        public IHttpActionResult OnboardingFormVerificationByFormId([FromBody] OnboardingFormVerificationByFormId obj)
        {
            try
            {
                logger.LogRequestAsync("OnboardingFormVerificationByFormId", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.OnboardingFormVerificationByFormId(obj, claims[5].Value, ref Message);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "OnboardingFormVerificationByFormId", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("OnboardingFormVerificationByFormId", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("OnboardingFormVerificationByFormId", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("OnboardingFormVerificationByFormId", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("OnboardingFormVerificationByFormId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "OnboardingFormVerificationByFormId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("FinalVerificationOnboardingForm")]
        [HttpPost]
        public IHttpActionResult FinalVerificationOnboardingForm([FromBody] VerificationOnboardingForm obj)
        {
            try
            {
                logger.LogRequestAsync("FinalVerificationOnboardingForm", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.FinalVerificationOnboardingForm(obj, claims[5].Value, ref Message);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "FinalVerificationOnboardingForm", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("FinalVerificationOnboardingForm", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("FinalVerificationOnboardingForm", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("FinalVerificationOnboardingForm", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("FinalVerificationOnboardingForm", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "FinalVerificationOnboardingForm");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("FinalVerificationDay1Form")]
        [HttpPost]
        public IHttpActionResult FinalVerificationDay1Form([FromBody] VerificationOnboardingForm obj)
        {
            try
            {
                logger.LogRequestAsync("FinalVerificationDay1Form", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.FinalVerificationDay1Form(obj, claims[5].Value, ref Message);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "FinalVerificationDay1Form", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("FinalVerificationDay1Form", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("FinalVerificationDay1Form", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("FinalVerificationDay1Form", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("FinalVerificationDay1Form", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "FinalVerificationDay1Form");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("SaveAppoimentLetter")]
        [HttpPost]
        public IHttpActionResult SaveAppoimentLetter()
        {
            try
            {
                logger.LogRequestAsync("SaveAppoimentLetter", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count == 0)
                {
                    return BadRequest("Please select a file.");
                }

                AppoimentLetterAttachment model = new AppoimentLetterAttachment
                {
                    cid = Convert.ToInt32(frm["cid"])
                };

                var httpPostedFile = HttpContext.Current.Request.Files[0];
                model.FileName = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);
                string tempPath = Path.Combine(ConfigurationManager.AppSettings["AppoinmentLetterPath"], model.cid.ToString());

                if (!Directory.Exists(tempPath))
                {
                    Directory.CreateDirectory(tempPath);
                }

                string fileSavePath = Path.Combine(tempPath, model.FileName);
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

                // Encrypt the file before saving
                int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                if (encryptionResult != 1)
                {
                    return BadRequest("Error encrypting the file.");
                }

                string Message = string.Empty;
                int result = objRepo.SaveAppoimentLetter(model.cid, model.FileName, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result == 1)
                {
                    logger.LogResponseAsync("SaveAppoimentLetter", "200 OK");
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
                logger.LogErrorAsync("SaveAppoimentLetter", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "SaveAppoimentLetter");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("SendAppoimentLetter")]
        [HttpPost]
        public IHttpActionResult SendAppoimentLetter(int cid)
        {
            try
            {
                logger.LogRequestAsync("SendAppoimentLetter", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.SendAppoimentLetter(cid, claims[5].Value, ref Message);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result == 1)
                {
                    int mailSentResult = SendAppoinmentLetterToCandidateMailer(cid);
                    switch (mailSentResult)
                    {
                        case 1: return Ok(Message);
                        case 2: return BadRequest("No profile picture found.");
                        case 3: return BadRequest("File not found.");
                        case 4: return BadRequest("File decryption failed.");
                        default: return BadRequest("Unknown error occurred.");
                    }
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
                logger.LogErrorAsync("SendAppoimentLetter", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "SendAppoimentLetter");
                return BadRequest("There is some error! Try again later");
            }
        }

        private int SendAppoinmentLetterToCandidateMailer(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetAppoinmentLetterToCandidateMailer(cid, claims[5].Value, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return 0;
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                }

                string encryptedFilePath = ds.Tables[0].Rows[0]["Attachment"].ToString();
                string encryptedFileName = Path.GetFileName(encryptedFilePath);
                string originalFileName = common.RemoveLastExtension(encryptedFileName);
                MailerConfig MailerConfig = new MailerConfig();

                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();

                byte[] encryptedBytes;

                using (FileStream fs = new FileStream(encryptedFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    encryptedBytes = new byte[fs.Length];
                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                // Create list of attachments


                if (decryptedBytes == null || decryptedBytes.Length == 0)
                {
                    return 4;
                }

                List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();
                attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));


                EmailSender.SendEmailATS(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);
                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendAppoinmentLetterToCandidateMailerMethod");
                return 0;
            }
        }

        [Route("DownloadAppoinmentLetter")]
        [HttpGet]
        public HttpResponseMessage DownloadAppoinmentLetter(int cid)
        {
            try
            {
                logger.LogRequestAsync("DownloadAppoinmentLetter", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetAppoinmentLetterDetail(cid, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;

                if (ds != null && ds.Tables.Count > 0)
                {
                    string filePath = Path.Combine(ConfigurationManager.AppSettings["AppoinmentLetterPath"], cid.ToString(), ds.Tables[0].Rows[0]["FileName"].ToString());
                    if (!File.Exists(filePath))
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                    }

                    string originalFileName = common.RemoveLastExtension(Path.GetFileName(filePath));

                    byte[] encryptedBytes = File.ReadAllBytes(filePath);
                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);

                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "File decryption failed.");
                    }

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    response.Content = new ByteArrayContent(decryptedBytes);
                    response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = originalFileName
                    };
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                    logger.LogResponseAsync("DownloadAppoinmentLetter", "200 OK");
                    return response;
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadAppoinmentLetter", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "DownloadAppoinmentLetter");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "There is some error! Try again later.");
            }
        }

        [Route("GetEmpCreationDivision")]
        [HttpGet]
        public IHttpActionResult GetEmpCreationDivision()
        {
            try
            {
                logger.LogRequestAsync("GetEmpCreationDivision", Request);

                var data = objRepo.GetEmpCreationDivision();
                

                logger.LogResponseAsync("GetEmpCreationDivision", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpCreationDivision", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetEmpCreationDivision");
                return InternalServerError();
            }
        }

        [Route("GetEmpCategoryDetails")]
        [HttpGet]
        public IHttpActionResult GetEmpCategoryDetails()
        {
            try
            {
                logger.LogRequestAsync("GetEmpCategoryDetails", Request);

                var data = objRepo.GetEmpCategoryDetails();
                

                logger.LogResponseAsync("GetEmpCategoryDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpCategoryDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetEmpCategoryDetails");
                return InternalServerError();
            }
        }

        [Route("GetEmpCreationLocation")]
        [HttpGet]
        public IHttpActionResult GetEmpCreationLocation()
        {
            try
            {
                logger.LogRequestAsync("GetEmpCreationLocation", Request);

                var data = objRepo.GetEmpCreationLocation();
                

                logger.LogResponseAsync("GetEmpCreationLocation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpCreationLocation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetEmpCreationLocation");
                return InternalServerError();
            }
        }

        [Route("GetSubLocationNames")]
        [HttpGet]
        public IHttpActionResult GetSubLocationNames(int LocationId)
        {
            try
            {
                logger.LogRequestAsync("GetSubLocationNames", Request);

                if (LocationId <= 0)
                {
                    return BadRequest("Invalid LocationId.");
                }

                var data = objRepo.GetSubLocationNames(LocationId);
                

                logger.LogResponseAsync("GetSubLocationNames", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSubLocationNames", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetSubLocationNames");
                return InternalServerError();
            }
        }

        [Route("GetNationalityNames")]
        [HttpGet]
        public IHttpActionResult GetNationalityNames()
        {
            try
            {
                logger.LogRequestAsync("GetNationalityNames", Request);

                var data = objRepo.GetNationalityNames();
                

                logger.LogResponseAsync("GetNationalityNames", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetNationalityNames", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetNationalityNames");
                return InternalServerError();
            }
        }

        [Route("GetLegalEntityByLocation")]
        [HttpGet]
        public IHttpActionResult GetLegalEntityByLocation(int LocationId)
        {
            try
            {
                logger.LogRequestAsync("GetLegalEntityByLocation", Request);

                if (LocationId <= 0)
                {
                    return BadRequest("Invalid LocationId.");
                }

                var data = objRepo.GetLegalEntityByLocation(LocationId);
                

                logger.LogResponseAsync("GetLegalEntityByLocation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetLegalEntityByLocation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetLegalEntityByLocation");
                return InternalServerError();
            }
        }

        [Route("GetEmployeeUnitforEmpCreation")]
        [HttpGet]
        public IHttpActionResult GetEmployeeUnitforEmpCreation(int IsCreated)
        {
            try
            {
                logger.LogRequestAsync("GetEmployeeUnitforEmpCreation", Request);

                if (IsCreated < 0)
                {
                    return BadRequest("Invalid IsCreated value.");
                }

                var data = objRepo.GetEmployeeUnitforEmpCreation(IsCreated);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmployeeUnitforEmpCreation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetEmployeeUnitforEmpCreation");
                return InternalServerError();
            }
        }

        [Route("GetTeamPracticeList")]
        [HttpGet]
        public IHttpActionResult GetTeamPracticeList()
        {
            try
            {
                logger.LogRequestAsync("GetTeamPracticeList", Request);

                var data = objRepo.GetTeamPracticeList();
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTeamPracticeList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetTeamPracticeList");
                return InternalServerError();
            }
        }

        [Route("GetRelationShipNames")]
        [HttpGet]
        public IHttpActionResult GetRelationShipNames()
        {
            try
            {
                logger.LogRequestAsync("GetRelationShipNames", Request);

                var data = objRepo.GetRelationShipNames();
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRelationShipNames", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetRelationShipNames");
                return InternalServerError();
            }
        }

        [Route("GetPIMSEmpStatus")]
        [HttpGet]
        public IHttpActionResult GetPIMSEmpStatus(char CreateType)
        {
            try
            {
                logger.LogRequestAsync("GetPIMSEmpStatus", Request);

                if (!char.IsLetter(CreateType))
                {
                    return BadRequest("Invalid CreateType value.");
                }

                var data = objRepo.GetPIMSEmpStatus(CreateType);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPIMSEmpStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetPIMSEmpStatus");
                return InternalServerError();
            }
        }

        [Route("GetPIMSDesignation")]
        [HttpGet]
        public IHttpActionResult GetPIMSDesignation()
        {
            try
            {
                logger.LogRequestAsync("GetPIMSDesignation", Request);

                var data = objRepo.GetPIMSDesignation();
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPIMSDesignation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetPIMSDesignation");
                return InternalServerError();
            }
        }

        [Route("GetGradeByDesignation")]
        [HttpGet]
        public IHttpActionResult GetGradeByDesignation(int DesignationId)
        {
            try
            {
                logger.LogRequestAsync("GetGradeByDesignation", Request);

                if (DesignationId <= 0)
                {
                    return BadRequest("Invalid DesignationId.");
                }

                var data = objRepo.GetGradeByDesignation(DesignationId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetGradeByDesignation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetGradeByDesignation");
                return InternalServerError();
            }
        }



        [Route("GetPIMSDesignationNames")]
        [HttpGet]
        public IHttpActionResult GetPIMSDesignationNames()
        {
            try
            {
                logger.LogRequestAsync("GetPIMSDesignationNames", Request);
                var data = objRepo.GetPIMSDesignationNames();
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPIMSDesignationNames", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetPIMSDesignationNames");
                return InternalServerError();
            }
        }

        [Route("GetAllPIMSEmployer")]
        [HttpGet]
        public IHttpActionResult GetAllPIMSEmployer(int flag)
        {
            try
            {
                if (flag < 0)
                    return BadRequest("Invalid flag value.");

                logger.LogRequestAsync("GetAllPIMSEmployer", Request);
                var data = objRepo.GetAllPIMSEmployer(flag);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllPIMSEmployer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetAllPIMSEmployer");
                return InternalServerError();
            }
        }

      

        [Route("CreateEmployeeId")]
        [HttpPost]
        public IHttpActionResult CreateEmployeeId([FromBody] EmployeeCreationModel obj)
        {
            try
            {
                if (obj == null)
                    return BadRequest("Invalid request data.");

                logger.LogRequestAsync("CreateEmployeeId", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string message = string.Empty;

                // 🔹 Set Base Employer using Traditional Switch-Case
                switch (obj.Division)
                {
                    case "I":
                        obj.baseEmployer = 1;
                        break;
                    case "A":
                        obj.baseEmployer = 7;
                        break;
                    default:
                        obj.baseEmployer = 8;
                        break;
                }

                obj.UploadProfilePic = common.GetFileWithAdditionalExtention(obj.UploadProfilePic);

                if (string.IsNullOrEmpty(obj.UploadProfilePic) && obj.fileProfilePic == null)
                    return BadRequest("Attachment not found.");

                // 🔹 Check if Candidate Already Joined
                int alreadyJoinedCount = objRepo.GetNumberOfJoinedCandidates(obj.CID);
                if (alreadyJoinedCount >= 1)
                    return BadRequest("Candidate already joined on this talent ID.");

                // 🔹 Create Employee
                int result = objRepo.CreateEmployeeId(obj, claims[5].Value, ref message);
                if (result <= 0)
                    return BadRequest(string.IsNullOrEmpty(message) ? "There is some error! Try again later." : message);

                // 🔹 Save Access User & Roles
                int userId = objRepo.Save_RptAccessUsers(obj.EMP_DOMAINID);
                if (userId > 0)
                    objRepo.Save_EmployeeAccessRoles(userId);

                // 🔹 Get App Configurations
                string TNIAdminId = ConfigurationManager.AppSettings["TNIAdmin"];
                int TNIAppId = int.Parse(ConfigurationManager.AppSettings["TNIAppId"]);
                int LMSAppId = int.Parse(ConfigurationManager.AppSettings["LMSAppId"]);
                int ITSAppId = int.Parse(ConfigurationManager.AppSettings["ITSAppId"]);

                // 🔹 Handle Leave Details (Older Switch-Case)
                switch (obj.Division)
                {
                    case "I":
                    case "A":
                    case "N":
                        objRepo.AddNewEmployeeDetails_leave(result.ToString(), "T", claims[5].Value, TNIAdminId, TNIAppId, LMSAppId, ITSAppId);
                        break;
                }

                // 🔹 Handle Profile Picture Upload
                if (!string.IsNullOrEmpty(obj.UploadProfilePic) && obj.fileProfilePic != null)
                {
                    string filePathProfilePic = ConfigurationManager.AppSettings["staticpathPhoto"];
                    string fileExtension = Path.GetExtension(obj.UploadProfilePic);
                    string uploadPhoto = $"{result}{fileExtension}";
                    string fileSavePath = Path.Combine(filePathProfilePic, uploadPhoto);

                    if (File.Exists(fileSavePath))
                        File.Delete(fileSavePath);

                    // 🔹 Encrypt & Save File
                    int encryptionResult = common.EncryptFile(obj.fileProfilePic, fileSavePath);
                    switch (encryptionResult)
                    {
                        case 1:
                            objRepo.UploadImageOnEmployeeCreation(result.ToString(), uploadPhoto);
                            break;
                        default:
                            return InternalServerError(new Exception("Error encrypting the file."));
                    }
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CreateEmployeeId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "CreateEmployeeId");
                return InternalServerError();
            }
        }


        [Route("GetHorizontalDepartment")]
        [HttpGet]
        public IHttpActionResult GetHorizontalDepartment(int EmpUnit)
        {
            try
            {
                if (EmpUnit <= 0)
                    return BadRequest("Invalid Employee Unit.");

                logger.LogRequestAsync("GetHorizontalDepartment", Request);
                var data = objRepo.GetHorizontalDepartment(EmpUnit);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetHorizontalDepartment", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetHorizontalDepartment");
                return InternalServerError();
            }
        }



        [Route("GetReportingManagerBYGrade")]
        [HttpGet]
        public IHttpActionResult GetReportingManagerBYGrade(int GradeId)
        {
            try
            {
                if (GradeId <= 0)
                    return BadRequest("Invalid GradeId.");

                logger.LogRequestAsync("GetReportingManagerBYGrade", Request);
                var data = objRepo.GetReportingManagerBYGrade(GradeId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReportingManagerBYGrade", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetReportingManagerBYGrade");
                return InternalServerError();
            }
        }

        [Route("SaveSignatureInternalUser")]
        [HttpPost]
        public IHttpActionResult SaveSignatureInternalUser(signatureSave model)
        {
            try
            {               

                logger.LogRequestAsync("SaveSignatureInternalUser", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string userId = claims[5].Value;
                string signaturePath = Path.Combine(ConfigurationManager.AppSettings["SignaturePath"], userId);
                string fileName = common.GetFileWithAdditionalExtention(model.signFileName);
                string filePath = Path.Combine(signaturePath, fileName);

                model.signFileName = fileName;
                model.signFilePath = filePath;

                if (!Directory.Exists(signaturePath))
                    Directory.CreateDirectory(signaturePath);

                if (File.Exists(filePath))
                    File.Delete(filePath);

                // Encrypt and save the file (Using traditional switch for better readability)
                int encryptionResult = common.EncryptFile(model.signFileBase64, filePath);
                switch (encryptionResult)
                {
                    case 1:
                        break; // Success
                    default:
                        return InternalServerError(new Exception("Error encrypting the file."));
                }

                string message = string.Empty;
                int result = objRepo.SaveSignatureInternalUser(model, userId, ref message);

                if (result == 1)
                {
                    return Ok(new responseSignatureSave
                    {
                        cid = model.cid,
                        signFilePath = model.signFilePath,
                        signFileName = model.signFileName,
                        message = message
                    });
                }

                return result == -2 ? BadRequest(message) : BadRequest("There is some error! Try again later.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SaveSignatureInternalUser", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SaveSignatureInternalUser");
                return InternalServerError();
            }
        }


        [Route("GetSignatureInternalUser")]
        [HttpGet]
        public IHttpActionResult GetSignatureInternalUser()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string userId = claims[5].Value;

                logger.LogRequestAsync("GetSignatureInternalUser", Request);

                int result;
                var data = objRepo.GetSignatureInternalUser(userId, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                return authResult ?? Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSignatureInternalUser", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetSignatureInternalUser");
                return InternalServerError();
            }
        }

        [Route("HrSignatureOnForms")]
        [HttpPost]
        public IHttpActionResult HrSignatureOnForms(HrSignatureOnForms model)
        {
            try
            {
                if (model == null || model.FormId <= 0)
                    return BadRequest("Invalid Form Data.");

                logger.LogRequestAsync("HrSignatureOnForms", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string userId = claims[5].Value;

                model.signFileName = common.GetFileWithAdditionalExtention(model.signFileName);
                model.signFilePath = common.GetFileWithAdditionalExtention(model.signFilePath);

                string message = string.Empty;
                int result = objRepo.HrSignatureOnForms(model, userId, ref message);

                if (result == 1)
                {
                    DataSet pdfData = objRepo.GenerateOnboardPdf(model.FormId, model.cid, userId, out result);
                    var authResult = CommonController.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;

                    // Traditional switch-case for PDF Generation
                    switch (model.FormId)
                    {
                        case 3:
                            GenerateJoiningReportPdf(pdfData, model.cid, model.FormId);
                            break;
                        case 4:
                            GenerateUndertakingAddressPdf(pdfData, model.cid, model.FormId);
                            break;
                        case 5:
                            GenerateUndertakingDocumentPdf(pdfData, model.cid, model.FormId);
                            break;
                        default:
                            break; // No action for other FormIds
                    }

                    return Ok(message);
                }

                return result == -3 ? BadRequest(message) : BadRequest("There is some error! Try again later.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("HrSignatureOnForms", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "HrSignatureOnForms");
                return InternalServerError();
            }
        }



        [Route("uploadOnboardFormDocuments")]
        [HttpPost]
        public IHttpActionResult UploadOnboardFormDocuments()
        {
            try
            {
                logger.LogRequestAsync("uploadOnboardFormDocuments", Request);

                int result = 0;
                var frm = HttpContext.Current.Request.Form;
                UploadOnboardFormDocs model = new UploadOnboardFormDocs();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                model.formId = Convert.ToInt32(frm["formId"]);
                model.joiningLocation = Convert.ToInt32(frm["joiningLocation"]);
                model.candidateType = Convert.ToInt32(frm["candidateType"]);
                model.divisionId = Convert.ToInt32(frm["divisionId"]);
                model.onboardingMode = Convert.ToChar(frm["onboardingMode"]);

                string Message = string.Empty;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];

                    if (httpPostedFile.FileName != "")
                    {
                        model.documentPath = ConfigurationManager.AppSettings["OnboardFormDocuments"] + model.formId + "\\" + model.divisionId + "\\" + model.joiningLocation + "\\" + model.onboardingMode;
                        model.documentName = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);

                        result = objRepo.uploadDocuments(model, claims[5].Value, ref Message);

                        if (result == 1)
                        {
                            var documentFile = HttpContext.Current.Request.Files[0];
                            string tempPath = model.documentPath + "\\";

                            if (!Directory.Exists(tempPath))
                                Directory.CreateDirectory(tempPath);

                            string fileSavePath = Path.Combine(tempPath, model.documentName);

                            if (File.Exists(fileSavePath))
                                File.Delete(fileSavePath);

                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                httpPostedFile.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }

                            // Encrypt file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                            if (encryptionResult != 1)
                                return InternalServerError(new Exception("Error encrypting the file."));
                        }
                    }
                }
                else
                {
                    return BadRequest("Please select File.");
                }

                if (result == 1)
                    return Ok(Message);
                else if (result == -2)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("uploadOnboardFormDocuments", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "upload Candidate Documents");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UploadJoiningMandateHRDocs")]
        [HttpPost]
        public IHttpActionResult UploadJoiningMandateHRDocs()
        {
            try
            {
                logger.LogRequestAsync("UploadJoiningMandateHRDocs", Request);

                int result = 0;
                var frm = HttpContext.Current.Request.Form;
                UploadMandateHRDocuments model = new UploadMandateHRDocuments();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                model.CId = Convert.ToInt32(frm["CId"]);
                model.documentType = frm["documentType"].ToString();

                string Message = string.Empty;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];

                    if (!string.IsNullOrEmpty(httpPostedFile.FileName))
                    {
                        DataSet ds = objRepo.GetCandidateLocationDivision(model.CId);
                        string CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                        string fileExt = Path.GetExtension(httpPostedFile.FileName);
                        string candidateFileName = common.GetDocumentDisplayName(model.CId, model.documentType);
                        model.documentName = candidateFileName + fileExt;

                        string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();
                        DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                        string currentYear = currentDate.ToString("yyyy");
                        string currentMonth = currentDate.ToString("MMMM");

                        string path;
                        switch (EmpLocation)
                        {
                            case "Noida":
                                path = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                                break;
                            case "Bangalore":
                                path = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                                break;
                            case "Mumbai":
                                path = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                                break;
                            case "Pune":
                                path = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                                break;
                            case "Gurugram":
                                path = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                                break;
                            default:
                                path = ConfigurationManager.AppSettings["OnboardFormDocuments"];
                                break;
                        }

                        model.documentPath = $"{path}{currentYear}/{currentMonth}/{CandidateName}/BackPaper/";

                        // Upload document in DB
                        result = objRepo.UploadHRDocuments(model, claims[5].Value, ref Message);

                        if (result == 1)
                        {
                            if (!Directory.Exists(model.documentPath))
                                Directory.CreateDirectory(model.documentPath);

                            string fileSavePath = Path.Combine(model.documentPath, model.documentName);
                            httpPostedFile.SaveAs(fileSavePath);
                        }
                    }
                }
                else
                {
                    return BadRequest("Please select a file.");
                }

                if (result == 1)
                    return Ok(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UploadJoiningMandateHRDocs", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "UploadJoiningMandateHRDocs");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("DownloadHRMandateDoc")]
        [HttpGet]
        public HttpResponseMessage DownloadHRMandateDoc(int Cid, string documentType)
        {
            try
            {
                logger.LogRequestAsync("DownloadHRMandateDoc", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetJoiningMandateHRDocsByCidandDocType(Cid, documentType, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;

                if (ds != null && ds.Tables.Count > 0)
                {
                    string filePath = ds.Tables[0].Rows[0]["FilePath"].ToString() + "\\" + ds.Tables[0].Rows[0]["FileName"].ToString();
                    string fileName = Path.GetFileName(filePath);

                    if (!File.Exists(filePath))
                        return new HttpResponseMessage(HttpStatusCode.NotFound);

                    byte[] bytes = File.ReadAllBytes(filePath);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    response.Content = new ByteArrayContent(bytes);
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));
                    return response;
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Not found");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadHRMandateDoc", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }



        [Route("GetOnboardFormDocuments")]
        [HttpGet]
        public IHttpActionResult GetOnboardFormDocuments(int formId, int joiningLocation, int divisionId, char onboardingMode)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = 0;
                var data = objRepo.GetOnboardFormDocuments(formId, joiningLocation, divisionId, onboardingMode, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

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
                ExceptionLogging.SendExcepToDB(ex, "onboard", "GetOnboardFormDocuments");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("SendOfferLetterMailer")]
        [HttpPost]
        public IHttpActionResult SendOfferLetterMailer(int cid)
        {
            try
            {
                // Log API request
                logger.LogRequestAsync("SendOfferLetterMailer", Request);

                int result = 0;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;

                // Call repository function
                result = objRepo.SendOfferLetterMailer(cid, claims[5].Value, ref Message);

                // Handle authorization
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "SendOfferLetterMailer", claims[5].Value);
                    return authResult;
                }

                // Log response based on result
                if (result == 1)
                {
                    logger.LogResponseAsync("SendOfferLetterMailer", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("SendOfferLetterMailer", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendOfferLetterMailer", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                // Log error
                logger.LogErrorAsync("SendOfferLetterMailer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendOfferLetterMailer");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("GetNewLocation")]
        [HttpGet]
        public IHttpActionResult GetNewLocation(int LocationId)
        {
            try
            {
                // Log API request
                logger.LogRequestAsync("GetNewLocation", Request);

                var data = objRepo.GetNewLocation(LocationId);

                // Log response
                logger.LogResponseAsync("GetNewLocation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Log error
                logger.LogErrorAsync("GetNewLocation", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetNewLocation");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetSubLocationNew")]
        [HttpGet]
        public IHttpActionResult GetSubLocationNew(int LocationId)
        {
            try
            {
                // Log API request
                logger.LogRequestAsync("GetSubLocationNew", Request);

                var data = objRepo.GetSubLocationNew(LocationId);

                // Log response
                logger.LogResponseAsync("GetSubLocationNew", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Log error
                logger.LogErrorAsync("GetSubLocationNew", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetSubLocationNew");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetVendor")]
        [HttpGet]
        public IHttpActionResult GetVendor()
        {
            try
            {
                logger.LogRequestAsync("GetVendor", Request);
                var data = objRepo.GetVendor();
                logger.LogResponseAsync("GetVendor", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVendor", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetVendor");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("GetEmpCreationDefaultDetails")]
        [HttpGet]
        public IHttpActionResult GetEmpCreationDefaultDetails(int CID)
        {
            try
            {
                logger.LogRequestAsync("GetEmpCreationDefaultDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetEmpCreationDefaultDetails(CID, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetEmpCreationDefaultDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetEmpCreationDefaultDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmpCreationDefaultDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetEmpCreationDefaultDetails");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("SendIdCardDetailsToAdmin")]
        [HttpPost]
        public IHttpActionResult SendIdCardDetailsToAdmin(int cid)
        {
            try
            {
                logger.LogRequestAsync("SendIdCardDetailsToAdmin", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.SendIdCardDetailsToAdmin(cid, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("SendIdCardDetailsToAdmin", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("SendIdCardDetailsToAdmin", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendIdCardDetailsToAdmin", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendIdCardDetailsToAdmin", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendIdCardDetailsToAdmin");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("SendAccountDetailsLinkToCandidate")]
        [HttpPost]
        public IHttpActionResult SendAccountDetailsLinkToCandidate(int cid)
        {
            try
            {
                logger.LogRequestAsync("SendAccountDetailsLinkToCandidate", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.SendAccountDetailsLinkToCandidate(cid, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("SendAccountDetailsLinkToCandidate", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("SendAccountDetailsLinkToCandidate", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendAccountDetailsLinkToCandidate", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendAccountDetailsLinkToCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendAccountDetailsLinkToCandidate");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("verifyPendingDocument")]
        [HttpPost]
        public IHttpActionResult VerifyPendingDocument([FromBody] VerifyPendingDocument obj)
        {
            try
            {
                logger.LogRequestAsync("verifyPendingDocument", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.VerifyPendingDocument(obj, claims[5].Value, ref Message);

                switch (result)
                {
                    case 1:
                        logger.LogResponseAsync("verifyPendingDocument", "200 OK");
                        return Ok(Message);

                    case -3:
                        logger.LogResponseAsync("verifyPendingDocument", "400 Bad Request");
                        return BadRequest(Message);

                    default:
                        logger.LogResponseAsync("verifyPendingDocument", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("verifyPendingDocument", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "verifyPendingDocument");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("GetJoiningItineraryList")]
        [HttpGet]
        public IHttpActionResult GetJoiningItineraryList(int LocationId)
        {
            try
            {
                logger.LogRequestAsync("GetJoiningItineraryList", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetJoiningItineraryList(LocationId, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetJoiningItineraryList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetJoiningItineraryList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJoiningItineraryList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetJoiningItineraryList");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("GetCandidateListByJoiningDate")]
        [HttpGet]
        public IHttpActionResult GetCandidateListByJoiningDate(int LocationId, string InviteDate)
        {
            try
            {
                logger.LogRequestAsync("GetCandidateListByJoiningDate", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateListByJoiningDate(LocationId, InviteDate, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetCandidateListByJoiningDate", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetCandidateListByJoiningDate", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateListByJoiningDate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetCandidateListByJoiningDate");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("AddUpdateDay1InductionInviteDetails")]
        [HttpPost]
        public IHttpActionResult AddUpdateDay1InductionInviteDetails(Day1InductionInviteDetails Model)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateDay1InductionInviteDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.AddUpdateDay1InductionInviteDetails(Model, claims[5].Value, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddUpdateDay1InductionInviteDetails", claims[5].Value);
                    return authResult;
                }

                switch (result)
                {
                    case 1:
                        if (ConfigurationManager.AppSettings["NotificationEnable"] == "1")
                        {
                            System.Threading.Tasks.Task.Run(() =>
                                common.addToCalendarGraphInductionDay1(Model.locationId, Model.InviteDate, claims[5].Value));
                        }
                        logger.LogResponseAsync("AddUpdateDay1InductionInviteDetails", "200 OK");
                        return Ok(Message);

                    case -3:
                        logger.LogResponseAsync("AddUpdateDay1InductionInviteDetails", "400 Bad Request");
                        return BadRequest(Message);

                    default:
                        logger.LogResponseAsync("AddUpdateDay1InductionInviteDetails", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateDay1InductionInviteDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "AddUpdateDay1InductionInviteDetails");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("GetDay1InductionInviteDetails")]
        [HttpGet]
        public IHttpActionResult GetDay1InductionInviteDetails(int LocationId, string InviteDate)
        {
            try
            {
                logger.LogRequestAsync("GetDay1InductionInviteDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetDay1InductionInviteDetails(LocationId, InviteDate, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetDay1InductionInviteDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetDay1InductionInviteDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDay1InductionInviteDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetDay1InductionInviteDetails");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("ResendInvite")]
        [HttpGet]
        public IHttpActionResult InviteOnb(int LocationId, string InviteDate)
        {
            try
            {
                logger.LogRequestAsync("InviteOnb", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                System.Threading.Tasks.Task.Run(() =>
                    common.addToCalendarGraphInductionDay1(LocationId, InviteDate, claims[5].Value));

                logger.LogResponseAsync("InviteOnb", "200 OK");
                return Ok("Resend.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("InviteOnb", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "InviteOnb");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("AddEmployeeVideoMatchDetails")]
        [HttpPost]
        public IHttpActionResult AddEmployeeVideoMatchDetails(CandidateIdentificationByHR model)
        {
            try
            {
                logger.LogRequestAsync("AddEmployeeVideoMatchDetails", Request);
                string Message = string.Empty;
                string token = common.GenerateToken();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = 0;

                if (model.OnboardingMode == 1)
                {
                    model.fileVideo = null;
                    model.FileNameVideo = null;
                    model.FilePathVideo = null;
                    model.sharePointIdVideo = null;
                    model.videoMatchPercent = 0;
                    result = objRepo.AddEmployeeVideoMatchDetails(model, claims[5].Value, ref Message);
                }
                else
                {
                    string uploadPath = $"{ConfigurationManager.AppSettings["SharePointVideoPathOnboard"]}{model.cid}/{model.FileNameVideo}";
                    string uploadUrl = common.createSessionForUploadFileSharedPoint(uploadPath, token);

                    uploadBodysharePoint uploadBody = new uploadBodysharePoint
                    {
                        file = model.fileVideo,
                        fileSize = model.FileSizeVideo,
                        uploadUrl = uploadUrl
                    };

                    UploadDetailsModel uploadFile = common.UploadFileToSharedPoint(uploadBody, token, "uploadVideoToSharePointOnboard");

                    if (!string.IsNullOrEmpty(uploadFile.id))
                    {
                        model.sharePointIdVideo = uploadFile.id;
                        model.FilePathVideo = uploadFile.webUrl;
                        result = objRepo.AddEmployeeVideoMatchDetails(model, claims[5].Value, ref Message);
                    }
                }

                switch (result)
                {
                    case 1:
                        logger.LogResponseAsync("AddEmployeeVideoMatchDetails", "200 OK");
                        return Ok(Message);

                    case -2:
                        logger.LogResponseAsync("AddEmployeeVideoMatchDetails", "400 Bad Request");
                        return BadRequest(Message);

                    default:
                        logger.LogResponseAsync("AddEmployeeVideoMatchDetails", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddEmployeeVideoMatchDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "AddEmployeeVideoMatchDetails");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("GenerateOnboardPdf")]
        [HttpGet]
        public IHttpActionResult GenerateOnboardPdf(int FormId, int cid)
        {
            try
            {
                logger.LogRequestAsync("GenerateOnboardPdf", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int resultCode;
                DataSet result = objRepo.GenerateOnboardPdf(FormId, cid, claims[5].Value, out resultCode);

                var authResult = CommonController.HandleAuthorizationResult(resultCode);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GenerateOnboardPdf", claims[5].Value);
                    return authResult;
                }

                System.Threading.Tasks.Task.Run(() =>
                {
                    switch (FormId)
                    {
                        case 1: GeneratePersonalInformationPdf(result, cid, FormId); break;
                        case 2: GenerateAccessCardPdf(result, cid, FormId); break;
                        case 3: GenerateJoiningReportPdf(result, cid, FormId); break;
                        case 4: GenerateUndertakingAddressPdf(result, cid, FormId); break;
                        case 5: GenerateUndertakingDocumentPdf(result, cid, FormId); break;
                        case 6: GenerateSodexoBenefitPdf(result, cid, FormId); break;
                        case 13: GeneratePdfAcceptableUseIfAssetsPolicy(result, cid, FormId); break;
                        case 14: GenerateAntiCorruptionPDF(result, cid, FormId); break;
                        case 15: GeneratePdfCodeofConductandBusinessEthicsPolicy(result, cid, FormId); break;
                        case 16: GeneratePdfConflictOfInterestPolicy(result, cid, FormId); break;
                        case 17: GeneratePdfNDALAteralNNT(result, cid, FormId); break;
                        case 18: GeneratePdfNDALAteral(result, cid, FormId); break;
                        case 19: GeneratePdfNetAppNDA(result, cid, FormId); break;
                        case 20: GeneratePdfPOSHDocument_Bangalore(result, cid, FormId); break;
                        case 21: GeneratePdfPOSHDocument_Mumbai(result, cid, FormId); break;
                        case 22: GeneratePdfPOSHDocument_Pune(result, cid, FormId); break;
                        case 23: GeneratePdfPOSHDocument_Noida(result, cid, FormId); break;
                        case 24: GeneratePdfTraineesDirectContractualNNT(result, cid, FormId); break;
                        case 25: GeneratePdfTraineesDirectContractualInfogain(result, cid, FormId); break;
                        default:
                            
                            break;
                    }
                });

                logger.LogResponseAsync("GenerateOnboardPdf", "200 OK");
                return Ok("PDF generation in progress.");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GenerateOnboardPdf", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GenerateOnboardPdf");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("SendEmailtoITTeamEmployeeVideoFail")]
        [HttpPost]
        public IHttpActionResult SendEmailtoITTeamEmployeeVideoFail(CandidateIdentificationByHR model)
        {
            try
            {
                logger.LogRequestAsync("SendEmailtoITTeamEmployeeVideoFail", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;

                int result = objRepo.SendEmailtoITTeamEmployeeVideoFail(model, claims[5].Value, ref Message);

                switch (result)
                {
                    case 1:
                        logger.LogResponseAsync("SendEmailtoITTeamEmployeeVideoFail", "200 OK");
                        return Ok(Message);
                    case -2:
                        logger.LogResponseAsync("SendEmailtoITTeamEmployeeVideoFail", "400 Bad Request");
                        return BadRequest(Message);
                    default:
                        logger.LogResponseAsync("SendEmailtoITTeamEmployeeVideoFail", "400 Bad Request");
                        return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendEmailtoITTeamEmployeeVideoFail", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendEmailtoITTeamEmployeeVideoFail");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePersonalInformationPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();

                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[Email]", ds.Tables[0].Rows[0]["email"].ToString())
                        .Replace("[FatherName]", ds.Tables[0].Rows[0]["FatherName"].ToString())
                        .Replace("[DOB]", ds.Tables[0].Rows[0]["dob"].ToString())
                        .Replace("[Number]", ds.Tables[0].Rows[0]["phone"].ToString())
                        .Replace("[EmergencyNumber]", ds.Tables[0].Rows[0]["EmergencyContactNumber"].ToString())
                        .Replace("[ContactName]", ds.Tables[0].Rows[0]["Contactname"].ToString())
                        .Replace("[PAddress]", ds.Tables[0].Rows[0]["PermanentAddress"].ToString())
                        .Replace("[TAddress]", ds.Tables[0].Rows[0]["TemporaryAddress"].ToString())
                        .Replace("[RelationName]", ds.Tables[0].Rows[0]["RealtionName"].ToString())
                        )), objLoadOptions);

                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePersonalInformationPdf");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateAccessCardPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    string signatureFilePath = ds.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[EmergencyNumber]", ds.Tables[0].Rows[0]["EmergencyContactNumber"].ToString())
                        .Replace("[BloodGroup]", ds.Tables[0].Rows[0]["BloodGroup"].ToString())
                        .Replace("[RH]", (ds.Tables[0].Rows[0]["BloodGroupRh"].ToString() == "P") ? "+" : "-")
                        )), objLoadOptions);

                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }

                catch (Exception ex)
                {

                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GenerateAccessCardPdf");

                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateJoiningReportPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    string baseImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];

                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();    // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");


                    String CandidateSignature = ds.Tables[0].Rows[0]["SignatureFilePath"].ToString();
                    String hRSignatureFilePath = ds.Tables[0].Rows[0]["HRSignatureFilePath"].ToString();

                    string base64PdfCandidateSign = "";
                    if (!string.IsNullOrEmpty(CandidateSignature))
                    {
                        if (File.Exists(CandidateSignature))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(CandidateSignature);
                            string originalFileName = common.RemoveLastExtension(CandidateSignature);

                            using (FileStream fs = new FileStream(CandidateSignature, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfCandidateSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }
                    string base64PdfHRSign = "";
                    if (!string.IsNullOrEmpty(hRSignatureFilePath))
                    {
                        if (File.Exists(hRSignatureFilePath))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(hRSignatureFilePath);
                            string originalFileName = common.RemoveLastExtension(hRSignatureFilePath);

                            using (FileStream fs = new FileStream(hRSignatureFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfHRSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }


                    string imageHtmlFragment = $"<img src='data:image/png;base64,{base64PdfCandidateSign}' width='200' height='50' style='margin-bottom: -30px;' />";
                    string image2HtmlFragment = $"<img src='data:image/png;base64,{base64PdfHRSign}'' width='200' height='50' style='margin-bottom: -30px;' />";
                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[OfferLetterNumber]", ds.Tables[0].Rows[0]["OfferNumberFull"].ToString())
                        .Replace("[Location]", ds.Tables[0].Rows[0]["JoiningLocation"].ToString())
                        .Replace("[Designation]", ds.Tables[0].Rows[0]["Designation"].ToString())
                        .Replace("[FatherName]", ds.Tables[0].Rows[0]["FatherName"].ToString())
                         .Replace("[HR]", image2HtmlFragment)
                        .Replace("[Date]", ds.Tables[0].Rows[0]["OfferedDate"].ToString())
                        .Replace("[Date1]", ds.Tables[0].Rows[0]["DateOfJoining"].ToString())
                        .Replace("[SDate]", ds.Tables[0].Rows[0]["submissiondate"].ToString())
                        .Replace("[CompanyName]", ds.Tables[0].Rows[0]["CompanyName"].ToString())
                        .Replace("[Signature]", imageHtmlFragment)
                        )), objLoadOptions);

                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {

                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GenerateJoiningReportPdf");

                }
            });
            return 1;
        }


        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateUndertakingAddressPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();

                    String CandidateSignature = ds.Tables[0].Rows[0]["SignatureFilePath"].ToString();
                    String hRSignatureFilePath = ds.Tables[0].Rows[0]["HRSignatureFilePath"].ToString();

                    string base64PdfCandidateSign = "";
                    if (!string.IsNullOrEmpty(CandidateSignature))
                    {
                        if (File.Exists(CandidateSignature))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(CandidateSignature);
                            string originalFileName = common.RemoveLastExtension(CandidateSignature);

                            using (FileStream fs = new FileStream(CandidateSignature, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfCandidateSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }
                    string base64PdfHRSign = "";
                    if (!string.IsNullOrEmpty(hRSignatureFilePath))
                    {
                        if (File.Exists(hRSignatureFilePath))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(hRSignatureFilePath);
                            string originalFileName = common.RemoveLastExtension(hRSignatureFilePath);

                            using (FileStream fs = new FileStream(hRSignatureFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfHRSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }


                    string imageHtmlFragment = $"<img src='data:image/png;base64,{base64PdfCandidateSign}' width='200' height='50' style='margin-bottom: -30px;' />";
                    string image2HtmlFragment = $"<img src='data:image/png;base64,{base64PdfHRSign}'' width='200' height='50' style='margin-bottom: -30px;' />";

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[TemporaryAddress]", ds.Tables[0].Rows[0]["TemporaryAddress"].ToString())
                        .Replace("[Date]", ds.Tables[0].Rows[0]["JoiningReportFillDate"].ToString())
                        .Replace("[Signature]", imageHtmlFragment)
                        .Replace("[HRSignature]", image2HtmlFragment)

                        )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {

                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GenerateUndertakingAddressPdf");

                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateUndertakingDocumentPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();

                    String CandidateSignature = ds.Tables[0].Rows[0]["SignatureFilePath"].ToString();
                    String hRSignatureFilePath = ds.Tables[0].Rows[0]["HRSignatureFilePath"].ToString();

                    string base64PdfCandidateSign = "";
                    if (!string.IsNullOrEmpty(CandidateSignature))
                    {
                        if (File.Exists(CandidateSignature))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(CandidateSignature);
                            string originalFileName = common.RemoveLastExtension(CandidateSignature);

                            using (FileStream fs = new FileStream(CandidateSignature, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfCandidateSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }
                    string base64PdfHRSign = "";
                    if (!string.IsNullOrEmpty(hRSignatureFilePath))
                    {
                        if (File.Exists(hRSignatureFilePath))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(hRSignatureFilePath);
                            string originalFileName = common.RemoveLastExtension(hRSignatureFilePath);

                            using (FileStream fs = new FileStream(hRSignatureFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfHRSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }


                    string imageHtmlFragment = $"<img src='data:image/png;base64,{base64PdfCandidateSign}' width='200' height='50' style='margin-bottom: -30px;' />";
                    string image2HtmlFragment = $"<img src='data:image/png;base64,{base64PdfHRSign}'' width='200' height='50' style='margin-bottom: -30px;' />";

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                 // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[Remarks]", ds.Tables[0].Rows[0]["Remarks"].ToString())
                        .Replace("[Date]", ds.Tables[0].Rows[0]["JoiningReportFillDate"].ToString())
                        .Replace("[Signature]", imageHtmlFragment)
                        .Replace("[HRSignature]", image2HtmlFragment)
                        .Replace("[TableBody]", ds.Tables[3].Rows[0]["TableBody"].ToString())
                        )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {

                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GenerateUndertakingDocumentPdf");

                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateSodexoBenefitPdf(DataSet result, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet ds = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);

                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 50;
                    objLoadOptions.PageInfo.Margin.Top = 80;
                    objLoadOptions.PageInfo.Margin.Left = 30;
                    objLoadOptions.PageInfo.Margin.Right = 30;
                    Common com = new Common();


                    String CandidateSignature = ds.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    string base64PdfCandidateSign = "";
                    if (!string.IsNullOrEmpty(CandidateSignature))
                    {
                        if (File.Exists(CandidateSignature))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(CandidateSignature);
                            string originalFileName = common.RemoveLastExtension(CandidateSignature);

                            using (FileStream fs = new FileStream(CandidateSignature, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfCandidateSign = Convert.ToBase64String(decryptedBytes);
                            
                        }


                    }

                    string imageHtmlFragment = $"<img src='data:image/png;base64,{base64PdfCandidateSign}' width='200' height='50' style='margin-bottom: -30px;' />";

                    String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(result.Tables[0].Rows[0]["Body"].ToString()
                        .Replace("[Name]", ds.Tables[0].Rows[0]["FullName"].ToString())
                        .Replace("[Yes/No]", (ds.Tables[0].Rows[0]["SudexoBenefit"].ToString() == "Y") ? "Yes" : "No")
                        .Replace("[option1]", (ds.Tables[0].Rows[0]["SudexoAmount"].ToString() == "1500") ? "Yes" : "No")
                        .Replace("[option2]", (ds.Tables[0].Rows[0]["SudexoAmount"].ToString() == "2500") ? "Yes" : "No")
                        .Replace("[option3]", (ds.Tables[0].Rows[0]["SudexoAmount"].ToString() == "3000") ? "Yes" : "No")
                        .Replace("[Date]", ds.Tables[0].Rows[0]["submissiondate"].ToString())
                        .Replace("[Signature]", imageHtmlFragment)
                        .Replace("[Paytm]", (ds.Tables[0].Rows[0]["divisionid"].ToString() == "7") ? ds.Tables[4].Rows[0]["Paytm"].ToString() : " ")
                        .Replace("[PaytmNumber]", (ds.Tables[0].Rows[0]["divisionid"].ToString() == "7") ? ds.Tables[0].Rows[0]["PaytmMobileNumber"].ToString() : " ")
                        .Replace("[Place]", ds.Tables[0].Rows[0]["JoiningLocation"].ToString())
                        .Replace("[CompanyName]", ds.Tables[0].Rows[0]["CompanyName"].ToString())
                        .Replace("[CompanyAddress]", ds.Tables[0].Rows[0]["CompanyAddress"].ToString())
                        )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {

                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";

                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/Joining Documents/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputImageStream = null;
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                    iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);


                    Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
                    documentPrivilege.AllowScreenReaders = true;
                    documentPrivilege.AllowPrint = false;
                    documentPrivilege.AllowCopy = false;
                    documentPrivilege.AllowModifyContents = false;



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pdfContentByte = stamper.GetOverContent(i);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }

                    string PdfName = result.Tables[0].Rows[0].ItemArray[1] + "_" + ds.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + ds.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";


                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, result.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {

                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GenerateSodexoBenefitPdf");

                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfAcceptableUseIfAssetsPolicy(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {

                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    string base64PdfCandidateSign = "";
                    if (!string.IsNullOrEmpty(CandidateSignature))
                    {
                        if (File.Exists(CandidateSignature))
                        {
                            byte[] encryptedBytes;
                            string encryptedFileName = Path.GetFileName(CandidateSignature);
                            string originalFileName = common.RemoveLastExtension(CandidateSignature);

                            using (FileStream fs = new FileStream(CandidateSignature, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                encryptedBytes = new byte[fs.Length];
                                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                            }

                            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                            base64PdfCandidateSign = Convert.ToBase64String(decryptedBytes);

                        }


                    }

                    string imageHtmlFragment = $"<img src='data:image/png;base64,{base64PdfCandidateSign}' width='200' height='50' style='margin-bottom: -30px;' />";



                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", imageHtmlFragment)
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                              )), objLoadOptions);




                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(480, 20);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 40);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfAcceptableUseIfAssetsPolicy");
                }
            });

            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GenerateAntiCorruptionPDF(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();




                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                               .Replace("[CompanyName]", result.Tables[0].Rows[0]["CompanyName"].ToString())

                              )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }
                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else if (i == 2 || i == 3)
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 500, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfConflictOfInterestPolicy(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                                    .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                                    .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                                    .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                                    //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                                    .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                    )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else if (i == 2 || i == 3)
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfCodeofConductandBusinessEthicsPolicy(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                                     .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                                     .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                                     .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                                     //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                                     .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                     )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }


                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }

            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfPOSHDocument_Bangalore(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                                      .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                                      .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                                      .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                                      //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                                      .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                      )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }

            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfPOSHDocument_Mumbai(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                                     .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                                     .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                                     .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                                     //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                                     .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                     )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }


                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfPOSHDocument_Pune(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);           // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                                     .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                                     .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                                     .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                                     //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                                     .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                     )), objLoadOptions);




                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfPOSHDocument_Noida(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                              .Replace("[BriefDesc]", result.Tables[0].Rows[0]["BriefDesc"].ToString())
                              .Replace("[RemarksDocs]", result.Tables[0].Rows[0]["RemarksFormDoc"].ToString())
                              )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }
                    //string path = @"D:\SubhashDocs\OnboardingPdf";

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {

                        var pageNumeber = "Page " + i + " of " + numberOfPages;
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            //imageSignature.SetAbsolutePosition(500, 30);
                            //imageSignature.Alignment = Element.ALIGN_BOTTOM;
                            //imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        //pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfTraineesDirectContractualNNT(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);         // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                             .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                             .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                             .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                             //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                             .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                             .Replace("[BriefDesc]", result.Tables[0].Rows[0]["BriefDesc"].ToString())
                                  .Replace("[RemarksDocs]", result.Tables[0].Rows[0]["RemarksFormDoc"].ToString())
                             )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }                    //string path = @"D:\SubhashDocs\OnboardingPdf";

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    //Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    //Stream outputPdfStream = new FileStream(path + "InfogainOffer.PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);


                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);


                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 20);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 15);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);
                        }
                        pdfContentByte.AddImage(image);
                        pdfContentByte.AddImage(imageSignature);
                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);


                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfTraineesDirectContractualInfogain(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);           // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                              .Replace("[BriefDesc]", result.Tables[0].Rows[0]["BriefDesc"].ToString())
                                   .Replace("[RemarksDocs]", result.Tables[0].Rows[0]["RemarksFormDoc"].ToString())
                              )), objLoadOptions);



                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }
                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    //Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    //Stream outputPdfStream = new FileStream(path + "InfogainOffer.PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);

                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 20);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 20);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);


                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);
                        }
                        pdfContentByte.AddImage(image);
                        pdfContentByte.AddImage(imageSignature);
                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfNDALAteral(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);                    // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                              .Replace("[BriefDesc]", result.Tables[0].Rows[0]["BriefDesc"].ToString())
                                   .Replace("[RemarksDocs]", result.Tables[0].Rows[0]["RemarksFormDoc"].ToString())
                              )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");


                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);
                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });

            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfNDALAteralNNT(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);         // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                             .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                              .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                             .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              //.Replace("[HRVerificationDate]", result.Tables[0].Rows[0]["HRFinalVerifiedOn"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                                .Replace("[BriefDesc]", result.Tables[0].Rows[0]["BriefDesc"].ToString())
                                  .Replace("[RemarksDocs]", result.Tables[0].Rows[0]["RemarksFormDoc"].ToString())
                             )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }

                    //string path = @"D:\SubhashDocs\OnboardingPdf";


                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    //Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    //Stream outputPdfStream = new FileStream(path + "InfogainOffer.PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);


                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }
                        pdfContentByte.AddImage(image);
                        pdfContentByte.AddImage(imageSignature);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 20, 0);

                        pdfContentByte.EndText();
                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GeneratePdfNetAppNDA(DataSet ds, int cid, int formId)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    int formType = 0;
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    int result1;
                    DataSet result = objRepo.GetOnboardingFormDetails(cid, claims[5].Value, formType,  out result1,formId);


                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
                    objLoadOptions.PageInfo.Margin.Bottom = 10;
                    objLoadOptions.PageInfo.Margin.Top = 10;
                    objLoadOptions.PageInfo.Margin.Left = 10;
                    objLoadOptions.PageInfo.Margin.Right = 10;


                    String CandidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();  // Added by jivan
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);             // Added by jivan
                    DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");
                    String CandidateSignature = result.Tables[0].Rows[0]["SignatureFilePath"].ToString();

                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
                              .Replace("[CandidateName]", result.Tables[0].Rows[0]["FullName"].ToString())
                               .Replace("[CandidateSignature]", "<img src='" + CandidateSignature + "' />")
                              .Replace("[EmployeeCode]", result.Tables[0].Rows[0]["EmployeeId"].ToString())
                              .Replace("[TodayDate]", result.Tables[0].Rows[0]["SubmittedOn"].ToString())
                              .Replace("[SupplierName]", result.Tables[0].Rows[0]["CompanyName"].ToString())
                              )), objLoadOptions);


                    // Added by jivan for location wise path 
                    string TempPath = "";
                    string path = "";
                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 8) //  Division -MNT                 
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }

                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];       // Current path commende by jivan
                    }                    //string path = @"D:\SubhashDocs\OnboardingPdf";

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }


                    doc.Save(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF");

                    //Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    //Stream outputPdfStream = new FileStream(path + "InfogainOffer.PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream inputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
                    Stream outputPdfStream = new FileStream(path + ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);



                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        Stream inputImageStreamBlank = null;

                        inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        Stream inputImageStreamSignature = null;

                        inputImageStreamSignature = new FileStream(result.Tables[0].Rows[0]["SignatureFilePath"].ToString(), FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageSignature = iTextSharp.text.Image.GetInstance(inputImageStreamSignature);
                        if (i == 1)
                        {
                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);
                        }
                        else
                        {
                            imageBlank.SetAbsolutePosition(0, 770);
                            imageBlank.Alignment = Element.ALIGN_TOP;
                            imageBlank.ScalePercent(52f);

                            image.SetAbsolutePosition(0, 770);
                            image.Alignment = Element.ALIGN_TOP;
                            image.ScalePercent(52f);

                            imageSignature.SetAbsolutePosition(250, 30);
                            imageSignature.Alignment = Element.ALIGN_BOTTOM | Element.ALIGN_CENTER;
                            imageSignature.ScalePercent(52f);

                            pdfContentByte.AddImage(imageBlank);
                            pdfContentByte.AddImage(imageSignature);

                        }

                        pdfContentByte.AddImage(image);
                        pdfContentByte.AddImage(imageSignature);
                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 300, 10, 0);

                        pdfContentByte.EndText();

                    }

                    string PdfName = ds.Tables[0].Rows[0].ItemArray[1] + "_" + result.Tables[0].Rows[0]["EmployeeId"].ToString() + "_" + result.Tables[0].Rows[0]["FullName"].ToString() + ".PDF";

                    objRepo.UpdatePdfNamePathOnboard(cid, formId, PdfName, path);

                    stamper.Close();
                    if (File.Exists(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF")))
                    {
                        File.Delete(Path.Combine(path, ds.Tables[0].Rows[0].ItemArray[1] + "_Aspose.PDF"));
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GeneratePdfPOSHDocument_Bangalore");
                }
            });
            return 1;
        }

        [Route("DownloadSodexoForm")]
        [HttpGet]
        public HttpResponseMessage DownloadSodexoForm(int cid)
        {
            try
            {
                logger.LogRequestAsync("DownloadSodexoForm", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                DataSet ds = objRepo.GetCandidateDetailsbyCid(cid);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    logger.LogResponseAsync("DownloadSodexoForm", "400 Bad Request - Sodexo Form not Available");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Sodexo Form not Available");
                }

                string path = ds.Tables[0].Rows[0]["PDFPath"].ToString();
                string name = ds.Tables[0].Rows[0]["PDFName"].ToString();
                string filePath = Path.Combine(path, name);

                if (!File.Exists(filePath))
                {
                    logger.LogResponseAsync("DownloadSodexoForm", "404 Not Found - File does not exist");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                byte[] fileBytes = File.ReadAllBytes(filePath);
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };

                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = name
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                logger.LogResponseAsync("DownloadSodexoForm", "200 OK - File download initiated");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadSodexoForm", ex);
                ExceptionLogging.SendExcepToDB(ex, "OnBoard", "DownloadSodexoForm");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred. Please try again later.");
            }
        }


        [Route("getPIMSGender")]
        [HttpGet]
        public IHttpActionResult getPIMSGender()
        {
            try
            {
                logger.LogRequestAsync("getPIMSGender", Request);
                var result = objRepo.getPIMSGender();
                logger.LogResponseAsync("getPIMSGender", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPIMSGender", ex);
                ExceptionLogging.SendExcepToDB(ex, "OnBoard", "getPIMSGender");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetOnboardCandidateVerificationReport")]
        [HttpPost]
        public IHttpActionResult GetOnboardCandidateVerificationReport([FromBody] RMHRReportFilters obj)
        {
            try
            {
                logger.LogRequestAsync("GetOnboardCandidateVerificationReport", Request);
                var result = objRepo.GetOnboardCandidateVerificationReport(obj);

                if (result == null)
                {
                    logger.LogResponseAsync("GetOnboardCandidateVerificationReport", "400 Bad Request - No data found");
                    return BadRequest("No data available for the provided filters.");
                }

                logger.LogResponseAsync("GetOnboardCandidateVerificationReport", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOnboardCandidateVerificationReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "OnBoard", "GetOnboardCandidateVerificationReport");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("updateCandidateOnboardingMode")]
        [HttpPost]
        public IHttpActionResult updateCandidateOnboardingMode(int cid, char onboardingMode, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("updateCandidateOnboardingMode", Request);

                var claims = ClaimsPrincipal.Current?.Identities?.FirstOrDefault()?.Claims?.ToList();
                if (claims == null || claims.Count < 6)
                {
                    logger.LogResponseAsync("updateCandidateOnboardingMode", "400 Bad Request - Invalid user claims");
                    return BadRequest("Invalid user claims.");
                }

                string message = string.Empty;
                int result = objRepo.updateCandidateOnboardingMode(cid, onboardingMode, claims[5].Value, ref message, remarks);

                if (result == 1)
                {
                    logger.LogResponseAsync("updateCandidateOnboardingMode", $"200 OK - {message}");
                    return Ok(message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("updateCandidateOnboardingMode", $"400 Bad Request - {message}");
                    return BadRequest(message);
                }
                else
                {
                    logger.LogResponseAsync("updateCandidateOnboardingMode", "400 Bad Request - Unexpected error");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateCandidateOnboardingMode", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "updateCandidateOnboardingMode");
                return BadRequest("An unexpected error occurred. Please try again later.");
            }
        }



        [Route("downloadUploadedDocById")]
        [HttpGet]
        public HttpResponseMessage DownloadUploadedDocById(int Id, char Type)
        {
            try
            {
                logger.LogRequestAsync("DownloadUploadedDocById", Request);

                var claims = ClaimsPrincipal.Current?.Identities?.FirstOrDefault()?.Claims?.ToList();
                if (claims == null || claims.Count < 6)
                {
                    logger.LogResponseAsync("DownloadUploadedDocById", "400 Bad Request - Invalid user claims");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid user claims.");
                }

                DataSet ds = objRepo.GetUploadedDocById(Id, claims[5].Value, Type);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    logger.LogResponseAsync("DownloadUploadedDocById", "404 Not Found - No document found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filePath = ds.Tables[0].Rows[0]["fullPathForm"].ToString();
                string fileName = Path.GetFileName(filePath);

                if (!File.Exists(filePath))
                {
                    logger.LogResponseAsync("DownloadUploadedDocById", "404 Not Found - File does not exist");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                byte[] fileBytes = File.ReadAllBytes(filePath);
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };

                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileName
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));

                logger.LogResponseAsync("DownloadUploadedDocById", "200 OK - File download initiated");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadUploadedDocById", ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.");
            }
        }


        // Adde by jivan for resume for murcurry
        public async System.Threading.Tasks.Task<int> GetResumePath(int cid)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                   // HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    DataSet ResumePath = objRepo.GetResumePathForCandidate(cid);
                   
                    string enryptedResumePath= ResumePath.Tables[0].Rows[0]["resume_path"].ToString();
                    string enryptedResumeName = ResumePath.Tables[0].Rows[0]["c_resume"].ToString();

                   // string ResumeExistingPath = "D:\\OnboardFormDocuments\\offer_letter_Raj Kundra_TH210124_90669_2024-01-18.PDF";  // Only for testing
                                                                                                                                    // "D:\OnboardFormDocuments\offer_letter_Raj Kundra_TH210124_90669_2024-01-18.PDF"
                    string fileName = Path.GetFileName(enryptedResumeName);
                           fileName = common.RemoveLastExtension(fileName);


                    byte[] encryptedBytes;

                using (FileStream fs = new FileStream(enryptedResumePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    encryptedBytes = new byte[fs.Length];
                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                // Create list of attachments

                //byte[] bytes =  File.ReadAllBytes(ResumeExistingPath);

                        DataSet result =  objRepo.GetCandidateLocationDivision(cid);

                    String CandidateName = ResumePath.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();
                    int Division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);
                    DateTime currentDate = Convert.ToDateTime(result.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    string TempPath = "";
                    string path = "";

                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2)
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];
                    }
                    //path = "//ipagdevvm/Jivan";
                    string newPath = Path.Combine(path, fileName);

                    //if (!Directory.Exists(newPath))
                    //{
                    //    Directory.CreateDirectory(newPath);
                    //}

                    Directory.CreateDirectory(Path.GetDirectoryName(newPath));
                    File.WriteAllBytes(newPath, decryptedBytes);


                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "resumeCopy");
                }
            });
            return 1;
        }



        [Route("CopyResumePathName")]
        [HttpGet]
        public IHttpActionResult CopyResumePathName(int cid)
        {
            try
            {
                System.Threading.Tasks.Task<int> ResumePath = GetResumePath(cid);
                //string ResumePath = GetResumePath(cid);

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "OnBoard", "CopyResumePathName");
                return BadRequest("There is some error! Try again later");
            }
            return Ok();
        }

       // new changes for EAF pdf async method

        private async Task<int> CreatePDFforEAF(int cid, int isResumeCopy)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                // Implementation of the createPDFforEAF method
                try
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                    //DataSet ds = objRepo.GetPDFforEAF_Form();

                    // New format for EAF pdf

                    DataSet ds = objRepo.GetPDFforEAF_Form_NewRequirement();
                    int result1, result2;
                    DataSet CandidatePersonalDetails = objRepo.getCandidatePersonalDetails(cid, claims[5].Value, out result1);  
                    DataSet result = objRepo.getCandidateAllDetails(cid, claims[5].Value, out result2);
                    DataSet EducationalDetails = objRepo.getCandidateEducationalDetails(cid, claims[5].Value, out result1);
                    //Personal Details Total It Experience
                    string TotlExp = CandidatePersonalDetails.Tables[0].Rows[0]["totalExp"].ToString()
                                    + " Year " + CandidatePersonalDetails.Tables[0].Rows[0]["totalExpMonth"].ToString()
                                    + " Month ";

                    //Personal Details Total Experience 
                    string TotlITExp = CandidatePersonalDetails.Tables[0].Rows[0]["ITExpYear"].ToString()
                                    + " Year " + CandidatePersonalDetails.Tables[0].Rows[0]["ITExpMonth"].ToString()
                                    + " Month ";

                    //Personal Details relevent Experience
                    string ReleventExp = CandidatePersonalDetails.Tables[0].Rows[0]["releventExp"].ToString()
                                         + " Year " + CandidatePersonalDetails.Tables[0].Rows[0]["releventExpMonth"].ToString()
                                         + " Month ";

                    //Blood Grp
                    string BloodPositiveNegative = CandidatePersonalDetails.Tables[0].Rows[0]["BloodGroupRh"].ToString();
                    if (BloodPositiveNegative == "P")
                    {
                        BloodPositiveNegative = "Positive";
                    }
                    else if (BloodPositiveNegative == "N")
                    {
                        BloodPositiveNegative = "Negative";
                    }

                    string BloodGrp = CandidatePersonalDetails.Tables[0].Rows[0]["BloodGroup"].ToString() + " " + BloodPositiveNegative;

                    // Visa valis up to

                    string ValidVisa = CandidatePersonalDetails.Tables[0].Rows[0]["ValidVisa"].ToString();
                    if (ValidVisa == "Y")
                    {
                        ValidVisa = "Yes";
                    }
                    else if (ValidVisa == "N")
                    {
                        ValidVisa = "No";
                    }
                    else
                    {
                        ValidVisa = "NA";
                    }


                    // Present address
                    string PresentAddress = CandidatePersonalDetails.Tables[0].Rows[0]["AddressLine1"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["AddressLine2"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["AddressLine3"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["cr_city"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["cr_state"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["cr_postalCode"].ToString() + ", " +
                                            CandidatePersonalDetails.Tables[0].Rows[0]["cr_countryName"].ToString();
                    //Permanent Address
                    string PermanentAddress = CandidatePersonalDetails.Tables[0].Rows[0]["pr_addressLine1"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_addressLine2"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_addressLine3"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_city"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_state"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_postalCode"].ToString() + ", " +
                                              CandidatePersonalDetails.Tables[0].Rows[0]["pr_countryName"].ToString();
                    //Contact Address Emergency
                    string ContactAddressEmergency = CandidatePersonalDetails.Tables[0].Rows[0]["em_addressLine1"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_addressLine2"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_addressLine3"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_city"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_state"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_postalCode"].ToString() + ", " +
                                                     CandidatePersonalDetails.Tables[0].Rows[0]["em_countryName"].ToString();


                    //// Father Age
                    //string FatherDobString = result.Tables[0].Rows[0]["dob"].ToString();
                    //DateTime Fatherdob = DateTime.Parse(FatherDobString);
                    //DateTime currentDate = DateTime.Now;
                    //int Fatherage = currentDate.Year - Fatherdob.Year;
                    //string FatherageString = Fatherage.ToString() + " Years";

                    // Mother Age
                    //string MotherDobString = result.Tables[0].Rows[1]["dob"].ToString();
                    //DateTime Motherdob = DateTime.Parse(MotherDobString);
                    //int MotherAge = currentDate.Year - Motherdob.Year;
                    //string MotherAgeString = MotherAge.ToString() + " Years";
                    //Minor
                   
                    //string FatherMinor = result.Tables[0].Rows[0]["minor"].ToString();
                    //if (FatherMinor == "N")
                    //{
                    //    FatherMinor = "No";
                    //}
                    //else if (FatherMinor == "Y")
                    //{
                    //    FatherMinor = "Yes";
                    //}
                    //else
                    //{
                    //    FatherMinor = "NA";
                    //}
                    //string MotherMinor = result.Tables[0].Rows[1]["minor"].ToString();
                    //if (MotherMinor == "N")
                    //{
                    //    MotherMinor = "No";
                    //}
                    //else if (MotherMinor == "Y")
                    //{
                    //    MotherMinor = "Yes";
                    //}
                    //else
                    //{
                    //    MotherMinor = "NA";
                    //}



                    //Joining date
                    string JoiningDate = result.Tables[4].Rows[0]["expJoiningDate"].ToString();
                    DateTime date = DateTime.Parse(JoiningDate);
                    string formattedJoiningDate = $"{date:MMMM d, yyyy}";


                    // Salary type

                    string SalaryType = result.Tables[4].Rows[0]["currentSalaryType"].ToString();

                    if (SalaryType == "F")
                    {
                        SalaryType = "Fixed";
                    }
                    else if (SalaryType == "V")
                    {
                        SalaryType = "variable";
                    }
                    else
                    {
                        SalaryType = "NA";
                    }

                    string variableType = result.Tables[4].Rows[0]["variableType"].ToString();
                    string salary_amount_pay_A = "";
                    string salary_amount_pay_B = "";
                    string salary_amount_pay_M = "";
                    string salary_amount_pay_Q = "";
                    if (variableType == "A")
                    {
                        salary_amount_pay_A = result.Tables[4].Rows[0]["salary_amount_pay"].ToString();
                    }
                    else if (variableType == "B")
                    {
                        salary_amount_pay_B = result.Tables[4].Rows[0]["salary_amount_pay"].ToString();
                    }
                    else if (variableType == "Q")
                    {
                        salary_amount_pay_Q = result.Tables[4].Rows[0]["salary_amount_pay"].ToString();

                    }
                    else if (variableType == "M")
                    {
                        salary_amount_pay_M = result.Tables[4].Rows[0]["salary_amount_pay"].ToString();
                    }
                    else
                    {
                        salary_amount_pay_A = "";
                        salary_amount_pay_B = "";
                        salary_amount_pay_M = "";
                        salary_amount_pay_Q = "";
                    }
                    // string path = "\\ipagshareserver\\Resumes\\Onboard\\OnboardFormDocuments\\";

                    //string path = "\\ipagdevvm\\Jivan\\EAF\\PDF\\";

                    // Location wise path
                    DataSet candidateLoction = objRepo.GetCandidateLocationDivision(cid);
                    String CandidateName = candidateLoction.Tables[0].Rows[0]["FullName"].ToString();
                    string EmpLocation = candidateLoction.Tables[0].Rows[0]["JoiningLocation"].ToString();
                    int Division = Convert.ToInt32(candidateLoction.Tables[0].Rows[0]["divisionid"]);
                    DateTime currentDate = Convert.ToDateTime(candidateLoction.Tables[0].Rows[0]["DateOfJoining"]);
                    // DateTime currentDate = DateTime.Now;
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    string TempPath = "";
                    string path = "";

                    if (EmpLocation == "Noida")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    //else if (EmpLocation == "Bangalore" && Division == 2)
                    //{
                    //    TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                    //    path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    //}
                    else if (EmpLocation == "Bangalore")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Mumbai")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Pune")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else if (EmpLocation == "Gurugram")
                    {
                        TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
                        path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
                    }
                    else
                    {
                        path = ConfigurationManager.AppSettings["OnboardFormDocuments"];
                    }
                    // string path = "D:\\OnboardFormDocuments\\";
                    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();


                    //Personal Details
                    Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Body"].ToString()
              .Replace("[FullName]", CandidatePersonalDetails.Tables[0].Rows[0]["FullName"].ToString())
              .Replace("[Gender]", CandidatePersonalDetails.Tables[0].Rows[0]["Gender"].ToString())
              .Replace("[LastName]", CandidatePersonalDetails.Tables[0].Rows[0]["LastName"].ToString())
              .Replace("[LastName]", CandidatePersonalDetails.Tables[0].Rows[0]["LastName"].ToString())
              .Replace("[FathersName]", CandidatePersonalDetails.Tables[0].Rows[0]["FatherName"].ToString())
              .Replace("[email]", CandidatePersonalDetails.Tables[0].Rows[0]["Email"].ToString())
              .Replace("[MblNo]", CandidatePersonalDetails.Tables[0].Rows[0]["phone"].ToString())
              .Replace("[AlternateMblNo]", CandidatePersonalDetails.Tables[0].Rows[0]["LandlineNumber"].ToString())
              .Replace("[DOB]", CandidatePersonalDetails.Tables[0].Rows[0]["dob"].ToString())
              .Replace("[MaritalStatus]", CandidatePersonalDetails.Tables[0].Rows[0]["maritalStatusName"].ToString())
              .Replace("[Nationality]", CandidatePersonalDetails.Tables[0].Rows[0]["NationalityName"].ToString())

              .Replace("[TotalExep]", TotlExp)

              .Replace("[ReleventExep]", ReleventExp)
              .Replace("[ITExperience]", TotlITExp)
              .Replace("[CoreSkill]", CandidatePersonalDetails.Tables[0].Rows[0]["skillName"].ToString())
              .Replace("[SecondarySkills]", CandidatePersonalDetails.Tables[0].Rows[0]["AddtionalSkillName"].ToString())
              .Replace("[BloodGroup]", BloodGrp)
              .Replace("[PassportNo]", CandidatePersonalDetails.Tables[0].Rows[0]["PassportNo"].ToString())
              .Replace("[ValidPassport]", CandidatePersonalDetails.Tables[0].Rows[0]["validPassport"].ToString())
              .Replace("[TelephoneNos]", CandidatePersonalDetails.Tables[0].Rows[0]["telephone_no"].ToString())

              .Replace("[ValidVisa]", ValidVisa)
              .Replace("[VisaValidUpto]", CandidatePersonalDetails.Tables[0].Rows[0]["VisaValidUpto"].ToString())
              .Replace("[OnsiteExperience]", CandidatePersonalDetails.Tables[0].Rows[0]["OverseasExp"].ToString())
              .Replace("[PresentAddress]", PresentAddress)
              .Replace("[PermanentAddress]", PermanentAddress)
              .Replace("[ContactAddressEmergency]", ContactAddressEmergency)

              .Replace("[locationPreferenceName]", CandidatePersonalDetails.Tables[0].Rows[0]["locationPreferenceName"].ToString())
              .Replace("[strengthsImprovementArea]", CandidatePersonalDetails.Tables[0].Rows[0]["strengthsImprovementArea"].ToString())
              .Replace("[techAreaImprove]", CandidatePersonalDetails.Tables[0].Rows[0]["techAreaImprove"].ToString())


              //Educational Background.
              .Replace("[EDUCATIONTableBody]", EducationalDetails.Tables[0].Rows[0]["EDUCATIONTableBody"].ToString())

               // Training Courses Attended
               .Replace("[TrainingTableBody]", EducationalDetails.Tables[1].Rows[0]["TrainingTableBody"].ToString())

              // Employment Details
              .Replace("[EmploymentTableBody]", EducationalDetails.Tables[2].Rows[0]["EmploymentTableBody"].ToString())

              //family member details
              .Replace("[FamilyMembrTableBody]", EducationalDetails.Tables[3].Rows[0]["FamilyMembrTableBody"].ToString())

              //Salary Details
              .Replace("[CurrencyType]", result.Tables[4].Rows[0]["Currency"].ToString())
              .Replace("[CurrentCTCAnnual]", result.Tables[4].Rows[0]["CurrentCtc"].ToString())
              .Replace("[CurrentSalaryType]", SalaryType)
              .Replace("[Amount]", result.Tables[4].Rows[0]["salaryAmount"].ToString())
              .Replace("[PerfomanceBonus]", result.Tables[4].Rows[0]["bonus"].ToString())
              .Replace("[MonthlyInHand]", result.Tables[4].Rows[0]["salaryMonthlyInhand"].ToString())
              .Replace("[salaryExpected]", result.Tables[4].Rows[0]["salaryExpected"].ToString())
              .Replace("[expJoiningDate]", formattedJoiningDate)
              .Replace("[noticePeriod]", result.Tables[4].Rows[0]["noticePeriod"].ToString())
             .Replace("[variable_monthly]", result.Tables[4].Rows[0]["variable_monthly"].ToString())

             .Replace("[variable_yearly]", result.Tables[4].Rows[0]["variable_yearly"].ToString())
             .Replace("[salaryMonthlyInhand]", result.Tables[4].Rows[0]["salaryMonthlyInhand"].ToString())
             .Replace("[achievement]", result.Tables[4].Rows[0]["achievement"].ToString())

             .Replace("[salary_amount_pay_A]", salary_amount_pay_A)
             .Replace("[salary_amount_pay_B]", salary_amount_pay_B)
             .Replace("[salary_amount_pay_M]", salary_amount_pay_M)
             .Replace("[salary_amount_pay_Q]", salary_amount_pay_Q)

             .Replace("[salary_fixed_month]", result.Tables[4].Rows[0]["salary_fixed_month"].ToString())
             .Replace("[salary_fixed_year]", result.Tables[4].Rows[0]["salary_fixed_year"].ToString())
             .Replace("[variable_monthly]", result.Tables[4].Rows[0]["variable_monthly"].ToString())
             .Replace("[variable_yearly]", result.Tables[4].Rows[0]["variable_yearly"].ToString())

               //Current Job Responsibilities 
               .Replace("[projectName]", EducationalDetails.Tables[4].Rows[0]["projectName"].ToString())
               .Replace("[CoreSkills]", EducationalDetails.Tables[4].Rows[0]["skilName"].ToString())
               .Replace("[skilName]", EducationalDetails.Tables[4].Rows[0]["skilName"].ToString())
              .Replace("[roleResponsiblity]", EducationalDetails.Tables[4].Rows[0]["roleResponsiblity"].ToString())

              //Questionire DETAILS

              .Replace("[Questionire_dataTableBody]", EducationalDetails.Tables[5].Rows[0]["Questionire_dataTableBody"].ToString())

              //PROFESSIONAL REFERENCES:
              .Replace("[Reference_dataTableBody]", EducationalDetails.Tables[6].Rows[0]["Reference_dataTableBody"].ToString())

              )), objLoadOptions);

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    string pathForTempFile = ConfigurationManager.AppSettings["TempFilePath"] + cid.ToString() + "EAF_Aspose.PDF";
                    //doc.Save(path + cid + "_EAF.PDF");
                    doc.Save(pathForTempFile);



                    Stream inputPdfStream = new FileStream(pathForTempFile, FileMode.Open, FileAccess.Read, FileShare.Read);
                    // Stream outputPdfStream = new FileStream(path + cid + "_EAF.PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    Stream outputPdfStream = new FileStream(path + cid + "_" + CandidatePersonalDetails.Tables[0].Rows[0]["FullName"].ToString() + "_EAF" + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);

                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;

                        objLoadOptions.PageInfo.Margin.Bottom = 10;
                        objLoadOptions.PageInfo.Margin.Top = 10;
                        objLoadOptions.PageInfo.Margin.Left = 10;
                        objLoadOptions.PageInfo.Margin.Right = 10;

                        // add image to pdf
                        //inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        string baseImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
                        string imgPath = System.IO.Path.Combine(baseImpDocPath, "infogain-icon.png");
                        inputImageStream = new FileStream(imgPath, FileMode.Open, FileAccess.Read, FileShare.Read);

                        

                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 12);
                        pdfContentByte.BeginText();

                        pdfContentByte.ShowTextAligned(4, pageNumeber, 375, 10, 0);

                        pdfContentByte.EndText();

                    }
                    stamper.Close();
                    if (File.Exists(Path.Combine(pathForTempFile)))
                    {
                        File.Delete(Path.Combine(pathForTempFile));
                    }

                    if (isResumeCopy == 1)
                    {
                        System.Threading.Tasks.Task<int> ResumePath1 = GetResumePath(cid);
                    }

                }
                catch (Exception Ex)
                {
                    ExceptionLogging.SendExcepToDB(Ex, "OnBoard", "CreatePDFforEAF");
                }
            });
            return 1;
        }

        //

        // For EAF Common Method
        [Route("CommonMethodForEAF_PDF")]
        [HttpGet]
        public IHttpActionResult CommonMethodForEAF_PDF(int cid)
        {
            try
            {
                System.Threading.Tasks.Task<int> ResumePath = CreatePDFforEAF(cid,0);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "OnBoard", "CommonMethodForEAF_PDF");
                return BadRequest("There is some error! Try again later");
            }
            return Ok();
        }



        [Route("GetPendingDocReport")]
        [HttpPost]
        public IHttpActionResult GetPendingDocReport([FromBody] OnBoardModelPending obj)
        {
            try
            {
                logger.LogRequestAsync("GetPendingDocReport", Request);

                var result = objRepo.GetPendingDocReport(obj);

                logger.LogResponseAsync("GetPendingDocReport", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPendingDocReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "GetPendingDocReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendDay1DocToCandidate")]
        [HttpPost]
        public IHttpActionResult ResendDay1DocToCandidate(int cid)
        {
            try
            {
                logger.LogRequestAsync("ResendDay1DocToCandidate", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.ResendDay1DocToCandidate(cid, claims[5].Value, ref Message);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request,"ResendDay1DocToCandidate", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("ResendDay1DocToCandidate", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("ResendDay1DocToCandidate", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("ResendDay1DocToCandidate", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendDay1DocToCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "ResendDay1DocToCandidate");
                return BadRequest("There is some error! Try again later");
            }
        }


        public int SendJoiningItineraryToCandidateMailer(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                DataSet ds = objRepo.GetJoiningItineraryToCandidateMailer(cid, claims[5].Value);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                }

                string ItineraryAttachmentsPath = ds.Tables[0].Rows[0]["JoiningItineraryattachment"].ToString();
                string AttachmentsPath = ds.Tables[0].Rows[0]["Attachment"].ToString();


                string encryptedFilePath = ds.Tables[0].Rows[0]["JoiningItineraryattachment"].ToString();
                //string encryptedFileName = Path.GetFileName(encryptedFilePath);
                //string originalFileName = common.RemoveLastExtension(encryptedFileName);
                MailerConfig MailerConfig = new MailerConfig();

                List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();

                if (!string.IsNullOrEmpty(ItineraryAttachmentsPath))
                {

                    byte[] encryptedBytes;
                    string encryptedFileName = Path.GetFileName(encryptedFilePath);
                    string originalFileName = common.RemoveLastExtension(encryptedFileName);

                    using (FileStream fs = new FileStream(encryptedFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);

                    if (decryptedBytes != null || decryptedBytes.Length != 0)
                    {
                        attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));
                    }

                }

                if (!string.IsNullOrEmpty(AttachmentsPath))
                {
                    var att = AttachmentsPath.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var path in att)
                    {
                        if (File.Exists(path))
                        {
                            byte[] decryptedBytes;
                            //string originalFileName = common.RemoveLastExtension(path);
                            string originalFileName1 = Path.GetFileName(path);

                            using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                decryptedBytes = new byte[fs.Length];
                                fs.Read(decryptedBytes, 0, decryptedBytes.Length);
                            }

                            // Fix: Corrected null check
                            if (decryptedBytes != null && decryptedBytes.Length != 0)
                            {
                                attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName1));
                            }
                        }
                    }
                }


                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();

                if(Convert.ToInt32(ds.Tables[0].Rows[0]["IsOnboardFormShared"]) ==1)
                {
                    EmailSender.SendEmailATS(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);

                }
                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendJoiningItineraryToCandidateMailer");
                return 0;
            }
        }

        [Route("ResendSendJoiningItineraryToCandidate")]
        [HttpGet]
        public int ResendSendJoiningItineraryToCandidateMailer(int cid)
        {
            try
            {
                logger.LogRequestAsync("ResendSendJoiningItineraryToCandidateMailer", Request);

                int mailSentResult = SendJoiningItineraryToCandidateMailer(cid);

                logger.LogResponseAsync("ResendSendJoiningItineraryToCandidateMailer", mailSentResult == 1 ? "200 OK" : "400 Bad Request");
                return mailSentResult;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendSendJoiningItineraryToCandidateMailer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "ResendSendJoiningItineraryToCandidateMailer");
                return -1;
            }
        }
        [Route("ResendOnboardingFormMailer")]
        [HttpPost]
        public IHttpActionResult ResendOnboardingFormMailer(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.ResendOnboardingFormMailer(cid, claims[5].Value, ref Message);
                if (result == 1)
                    return Ok(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "ResendOnboardingFormMailer");
                return BadRequest("There is some error! Try again later");
            }

        }

        
        [Route("MailersendDay1CandidateStatus")]
        [HttpPost]
        public IHttpActionResult Mailersendforcandidatestatus(Mailersendforcandidatestatus obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.Mailersendforcandidatestatus(obj, ref Message);
                if (result == 1)
                    return Ok(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "Mailersendforcandidatestatus");
                return BadRequest("There is some error! Try again later");
            }

        }

        [Route("UpdateCandidateJoiningStatus")]
        [HttpPost]
        public IHttpActionResult UpdateCandidsateJoiningStatus(UpdateCandidsateJoiningStatus obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateCandidateJoiningStatus(obj, ref Message);
                if (result == 1)
                    return Ok(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "UpdateCandidateJoiningStatus");
                return BadRequest("There is some error! Try again later");
            }

        }

        [Route("downloadSignature")]
        [HttpGet]
        public HttpResponseMessage downloadSignature(int id, char signType)
        {
            try
            {
                logger.LogRequestAsync("downloadSignature", Request);

                DataSet ds = objRepo.getOnboadingSignaturePath(id, signType);
                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    logger.LogResponseAsync("downloadSignature", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString();
                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    logger.LogResponseAsync("downloadSignature", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                string base64PdfCandidateSign = GetBase64SignatureAsync(filelocation);
                if (string.IsNullOrEmpty(base64PdfCandidateSign))
                {
                    logger.LogResponseAsync("downloadSignature", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Unable to decode signature.");
                }

                byte[] fileBytes = Convert.FromBase64String(base64PdfCandidateSign);
                string fileName = Path.GetFileName(filelocation);
                string mimeType = MimeMapping.GetMimeMapping(fileName);

                logger.LogResponseAsync("downloadSignature", "200 OK");
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadSignature", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }


        [Route("downloadPendingDocument")]
        [HttpGet]
        public HttpResponseMessage downloadPendingDocument(int cid, int docID)
        {
            try
            {
                logger.LogRequestAsync("downloadPendingDocument", Request);

                if (cid == 0)
                {
                    logger.LogResponseAsync("downloadPendingDocument", "400 Bad Request");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid parameters.");
                }

                DataSet ds = objRepo.getPendingDocPath(cid, docID);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    logger.LogResponseAsync("downloadPendingDocument", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString();

                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    logger.LogResponseAsync("downloadPendingDocument", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                byte[] fileBytes = File.ReadAllBytes(filelocation);
                string fileName = Path.GetFileName(filelocation);
                string mimeType = MimeMapping.GetMimeMapping(fileName);

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

                logger.LogResponseAsync("downloadPendingDocument", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadPendingDocument", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

        [Route("downloadItineraryFile")]
        [HttpGet]
        public HttpResponseMessage downloadItineraryFile(int formId, int joiningLocation, int divisionId, char onboardingMode)
        {
            try
            {
                logger.LogRequestAsync("downloadItineraryFile", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetOnboardFormDocuments(formId, joiningLocation, divisionId, onboardingMode, claims[5].Value, out result);

                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "downloadItineraryFile", claims[5].Value);
                    return (HttpResponseMessage)authResult;
                }

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    logger.LogResponseAsync("downloadItineraryFile", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0]["fullpath"].ToString();

                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    logger.LogResponseAsync("downloadItineraryFile", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                // 🔹 Read and decrypt file
                byte[] encryptedBytes;
                using (FileStream fs = new FileStream(filelocation, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    encryptedBytes = new byte[fs.Length];
                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(encryptedBytes); // Decrypt

                string fileName = Path.GetFileName(filelocation);
                string mimeType = MimeMapping.GetMimeMapping(fileName);

                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(decryptedBytes)
                };

                response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileName
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

                logger.LogResponseAsync("downloadItineraryFile", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadItineraryFile", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

        [Route("downloadCommonpdfPath")]
        [HttpGet]
        public HttpResponseMessage downloadCommonpdfPath(int cid, int pdfid)
        {
            try
            {
                logger.LogRequestAsync("downloadCommonpdfPath", Request);

                DataSet ds = objRepo.getOnboadingCommonpdfPath(cid, pdfid);
                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    logger.LogResponseAsync("downloadCommonpdfPath", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString();
                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    logger.LogResponseAsync("downloadCommonpdfPath", "404 Not Found");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                // 🔹 Read and decrypt file
                byte[] encryptedBytes;
                using (FileStream fs = new FileStream(filelocation, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    encryptedBytes = new byte[fs.Length];
                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(encryptedBytes); // direct decrypt

                string fileName = Path.GetFileName(filelocation);
                string mimeType = MimeMapping.GetMimeMapping(fileName);

                logger.LogResponseAsync("downloadCommonpdfPath", "200 OK");
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(decryptedBytes) // return decrypted content
                };
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadCommonpdfPath", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }


        private string GetBase64SignatureAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
                return "";

            byte[] encryptedBytes;
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                encryptedBytes = new byte[fs.Length];
                fs.Read(encryptedBytes, 0, encryptedBytes.Length);
            }

            byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
            return Convert.ToBase64String(decryptedBytes);
        }
    }
}