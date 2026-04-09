using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using ClosedXML;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.ExtendedProperties;
using MessageBird;
using MessageBird.Objects.Voice;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Ocsp;
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
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Header;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace ATSAPI.Controllers
{
    //[AuthorizeAttribute]
   // [UserWiseAuthorizeAttribute("I")]
    [RoutePrefix("api/Common")]
    public class CommonController: ApiController
    {
        CommonRepository objRepo = new CommonRepository();
        Common common = new Common();
        Logger logger = new Logger();

        public object UtilMethods { get; private set; }

       // [UserWiseAuthorizeAttribute("I")]
        [UserWiseAuthorizeAttribute("I")]
        [Route("GetSiteIdSharedPoint")]
        [HttpGet]
        public IHttpActionResult GetSiteIdSharedPoint(string SiteName = "ATSWEB")
        {
            try
            {
                logger.LogRequestAsync("GetSiteIdSharedPoint", Request);

                string token = common.GenerateToken();
                SharePointSiteIdValue values = new SharePointSiteIdValue();

                logger.LogResponseAsync("GetSiteIdSharedPoint", "200 OK");
                return Ok(values);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSiteIdSharedPoint", ex);
                ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetSiteIdSharedPoint");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("GetDriveIdSharedPoint")]
        [HttpGet]
        public IHttpActionResult GetDriveIdSharedPoint(string SiteName = "ATSWEB", string driveName = "Documents")
        {
            try
            {
                logger.LogRequestAsync("GetDriveIdSharedPoint", Request);

                string token = common.GenerateToken();
                GetSharePointSiteAndDriveId GetSharePointDriveIdAndSiteId = new GetSharePointSiteAndDriveId();

                logger.LogResponseAsync("GetDriveIdSharedPoint", "200 OK");
                return Ok(GetSharePointDriveIdAndSiteId);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDriveIdSharedPoint", ex);
                ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetDriveIdSharedPoint");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("downloadSharePointFile")]
        [HttpGet]
        public HttpResponseMessage downloadSharePointFile(string id, string fileName)
        {
            try
            {
                logger.LogRequestAsync("downloadSharePointFile", Request);

                string token = common.GenerateToken();
                HttpResponseMessage servicerequestDownload = null;
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token);

                string _urlDownload = "https://graph.microsoft.com/v1.0//drives/" + ConfigurationManager.AppSettings["SharePointDriveId"] + "/items/" + id + "/content";
                servicerequestDownload = httpClient.GetAsync(_urlDownload).Result;
                Byte[] bytes = servicerequestDownload.Content.ReadAsByteArrayAsync().Result;
                servicerequestDownload.Content = new ByteArrayContent(bytes);
                servicerequestDownload.Content.Headers.ContentLength = bytes.LongLength;
                servicerequestDownload.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                servicerequestDownload.Content.Headers.ContentDisposition.FileName = fileName;
                servicerequestDownload.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));

                logger.LogResponseAsync("downloadSharePointFile", "200 OK");
                return servicerequestDownload;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadSharePointFile", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }


        [NonAction]
        public Byte[] GetSharePointFileinBytes(string id, string fileName)
        {
            try
            {
                string token = common.GenerateToken();
                HttpResponseMessage servicerequestDownload = null;
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                string _urlDownload = "https://graph.microsoft.com/v1.0//drives/" + ConfigurationManager.AppSettings["SharePointDriveId"] + "/items/" + id + "/content";
                servicerequestDownload = httpClient.GetAsync(_urlDownload).Result;
                Byte[] bytes = servicerequestDownload.Content.ReadAsByteArrayAsync().Result;
                return bytes;
            }
            catch (Exception ex)
            {
                return new byte[0];
            }
        }
        //[AuthorizeAttribute]
        //[Route("getUnreadNotificationCount")]
        //[HttpGet]
        //public IHttpActionResult GetUnreadNotificationCount(char? type = null)
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        return Ok(objRepo.GetUnreadNotificationCount(type, claims[5].Value));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetUnreadNotificationCount");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}
        //[AuthorizeAttribute]
        //[Route("getAllNotificationList")]
        //[HttpGet]
        //public IHttpActionResult GetAllNotificationList(int page,int pageSize, char? type = null)
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        return Ok(objRepo.GetAllNotificationList(page, pageSize,type, claims[5].Value));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetAllNotificationList");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}
        //[AuthorizeAttribute]
        //[Route("readNotification")]
        //[HttpPost]
        //public IHttpActionResult ReadNotification(int id)
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        //  return Ok(objRepo.ReadNotification(id, claims[5].Value));
        //        string Message = string.Empty;
        //        int result = objRepo.ReadNotification(id, claims[5].Value, ref Message);
        //        if (result == 1)
        //            return Ok(Message);
        //        else if (result == -3)
        //            return BadRequest(Message);
        //        else
        //            return BadRequest("There is some error! Try again later");
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "CommonController", "ReadNotification");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}
        //[AuthorizeAttribute]
        //[Route("readAllNotification")]
        //[HttpPost]
        //public IHttpActionResult ReadAllNotification()
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        //  return Ok(objRepo.ReadNotification(id, claims[5].Value));
        //        string Message = string.Empty;
        //        int result = objRepo.ReadAllNotification(claims[5].Value, ref Message);
        //        if (result == 1)
        //            return Ok(Message);
        //        else if (result == -3)
        //            return BadRequest(Message);
        //        else
        //            return BadRequest("There is some error! Try again later");
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "CommonController", "ReadNotification");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}
        [UserWiseAuthorizeAttribute("P")]
        [Route("GetVideoMatchUserAccess")]
        [HttpGet]
        public IHttpActionResult GetVideoMatchAccess(string param)
        {
            try
            {
                logger.LogRequestAsync("GetVideoMatchAccess", Request);

                // Check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetVideoMatchAccess", "ExternalUser");
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                int roundId = Convert.ToInt32(DecodeBase64(param));
                var result = objRepo.GetVideoMatchAccess(roundId);

                logger.LogResponseAsync("GetVideoMatchAccess", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVideoMatchAccess", ex);
                ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetVideoMatchAccess");
                return BadRequest("There is some error! Try again later");
            }
        }


        [NonAction]
        public string DecodeBase64(string value)
        {
            var valueBytes = System.Convert.FromBase64String(value);
            return Encoding.UTF8.GetString(valueBytes);
        }

        //[ExternalAuthorize]
        [UserWiseAuthorizeAttribute("P")]
        [Route("GetVideoMatchDetails")]
        [HttpGet]
        public IHttpActionResult GetVideoMatchDetails(string param)
        {
            try
            {
                logger.LogRequestAsync("GetVideoMatchDetails", Request);

                // Check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetVideoMatchDetails", "ExternalUser");
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                int roundId = Convert.ToInt32(DecodeBase64(param));
                var result = objRepo.GetVideoMatchDetails(roundId);

                logger.LogResponseAsync("GetVideoMatchDetails", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVideoMatchDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "CommonController", "GetVideoMatchDetails");
                return BadRequest("There is some error! Try again later");
            }
        }


        [NonAction]
        public string GenerateOTP()
        {
            var characters = "0123456789";

            var Charsarr = new char[6];
            var random = new Random();

            for (int i = 0; i < Charsarr.Length; i++)
            {
                Charsarr[i] = characters[random.Next(characters.Length)];
            }

            var resultString = new String(Charsarr);
            return resultString;
        }

        //[ExternalAuthorize]
        [UserWiseAuthorizeAttribute("P")]
        [Route("SendOTPtoVideoMatcher")]
        [HttpPost]
        public IHttpActionResult SendOTPtoVideoMatcher(string param, string EmpId)
        {
            try
            {
                logger.LogRequestAsync("SendOTPtoVideoMatcher", Request);

                // Check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "SendOTPtoVideoMatcher", "ExternalUser");
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string otp = GenerateOTP().ToString();
                int roundId = Convert.ToInt32(DecodeBase64(param));
                string Message = string.Empty;
                int result = objRepo.SendOTPtoVideoMatcher(roundId, EmpId, otp, ref Message);

                if (result == 1 || result == -2)
                {
                    logger.LogResponseAsync("SendOTPtoVideoMatcher", "200 OK");
                    return Ok(Message);
                }

                return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendOTPtoVideoMatcher", ex);
                ExceptionLogging.SendExcepToDB(ex, "CommonController", "SendOTPtoVideoMatcher");
                return BadRequest("There is some error! Try again later");
            }
        }



        //[ExternalAuthorize]
        [UserWiseAuthorizeAttribute("P")]
        [Route("SubmitOtpVideoMatching")]
        [HttpPost]
        public IHttpActionResult SubmitOtpVideoMatching(string param, string EmpId, string otp, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("SubmitOtpVideoMatching", Request);

                // Check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "SubmitOtpVideoMatching", "ExternalUser");
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string Message = string.Empty;
                int roundId = Convert.ToInt32(DecodeBase64(param));
                int result = objRepo.SubmitOtpVideoMatching(roundId, EmpId, otp, remarks, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("SubmitOtpVideoMatching", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    return BadRequest(Message);
                }

                return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SubmitOtpVideoMatching", ex);
                ExceptionLogging.SendExcepToDB(ex, "Common", "SubmitOtpVideoMatching");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getCoderByteAssessments")]
        [HttpGet]
        public IHttpActionResult getCoderByteAssessments()
        {
            logger.LogRequestAsync("getCoderByteAssessments", Request);

            var allowedRoles = new List<int> { 10, 5, 2 };
            var allowedOtherPermissions = new List<string> { "IsInterviewer", "IsPanelAccess" };

            if (!ClaimsHelper.IsUserAuthorized(User, allowedRoles, allowedOtherPermissions))
            {
                logger.LogUnauthorizedAccessAsync(Request, "getCoderByteAssessments", "UnauthorizedRole");
                return BadRequest(AppConstants.UnauthorizedMessage);
            }

            List<AssessmentModel> model = new List<AssessmentModel>();

            try
            {
                string token = ConfigurationManager.AppSettings["CoderByteToken"];
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                string _urlDownload = "https://coderbyte.com/api/organization/assessments";
                HttpResponseMessage servicerequest = httpClient.GetAsync(_urlDownload).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                CoderByteAssessments jsonObj = JsonConvert.DeserializeObject<CoderByteAssessments>(response);

                foreach (var assessment in jsonObj.data.assessments)
                {
                    model.Add(new AssessmentModel
                    {
                        created_date = assessment.created_date,
                        display_name = assessment.display_name,
                        test_id = assessment.test_id,
                        created_by_email = assessment.overview_stats.created_by_email,
                        closed = assessment.closed,
                        public_url = assessment.public_url,
                        qualifying_score = assessment.overview_stats.qualifying_score,
                        addedon = DateTime.Now.ToString("dd-MM-yyyy")
                    });
                }

                int result = objRepo.InsertCoderByteAssessments(model);
                if (result > 0)
                {
                    logger.LogResponseAsync("getCoderByteAssessments", "200 OK");
                    return Ok("Assessments added successfully");
                }

                return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCoderByteAssessments", ex);
                ExceptionLogging.SendExcepToDB(ex, "Common", "InsertCoderByteAssessments");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("InterviewScheduleCoderByte")]
        [HttpPost]
        public CodeByteInterviewScheduleResponse InterviewScheduleCoderByte(CodeByteInterviewSchedule fb)
        {
            try
            {
                logger.LogRequestAsync("InterviewScheduleCoderByte", Request);

                var allowedRoles = new List<int> { 10, 5, 2 };
                var allowedOtherPermissions = new List<string>();

                if (!ClaimsHelper.IsUserAuthorized(User, allowedRoles, allowedOtherPermissions))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "InterviewScheduleCoderByte", "UnauthorizedRole");
                    throw new UnauthorizedAccessException(AppConstants.UnauthorizedMessage);
                }

                fb.skip_send = true;
                string token = ConfigurationManager.AppSettings["CoderByteToken"];
                string jsonBody = JsonConvert.SerializeObject(fb);
                var content = new StringContent(jsonBody);
                content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                string _url = "https://coderbyte.com/api/organization/candidates/invite";
                HttpResponseMessage servicerequest = httpClient.PostAsync(_url, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                CodeByteInterviewScheduleResponse jsonObj = JsonConvert.DeserializeObject<CodeByteInterviewScheduleResponse>(response);

                logger.LogResponseAsync("InterviewScheduleCoderByte", "200 OK");
                return jsonObj;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("InterviewScheduleCoderByte", ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", "CoderByteInterviewSchedule");
                throw;
            }
        }

        [Route("AssessmentCompleted")]
        [HttpPost]
        public IHttpActionResult AssessmentCompleted([FromBody] AssessmentCompleted obj)
        {
            try
            {
                logger.LogRequestAsync("AssessmentCompleted", Request);

                int result = objRepo.AssessmentCompleted(obj);

                try
                {
                    // Execute the CoderByteReport asynchronously, but don't wait for the response
                    System.Threading.Tasks.Task<int> CoderByteReport = GetCoderByteReport(obj.email, obj.assessment_id);
                }
                catch (Exception ex)
                {
                    logger.LogErrorAsync("AssessmentCompleted - CoderByteReport", ex);
                    ExceptionLogging.SendExcepToDB(ex, "Masters", "AssessmentCompleted");
                    return BadRequest("There is some error! Try again later");
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("AssessmentCompleted", "200 OK");
                    return Ok("Report saved.");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AssessmentCompleted", ex);
                ExceptionLogging.SendExcepToDB(ex, "Masters", "AssessmentCompleted");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> GetCoderByteReport(string email, string assessmentId)

        {
            try
            {

                await System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {
                        string token = ConfigurationManager.AppSettings["CoderByteToken"];
                        HttpResponseMessage servicerequest = null;

                        HttpClient httpClient = new HttpClient();
                        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                        string _url = "https://coderbyte.com/api/organization/candidates/" + email + "/" + assessmentId;
                        servicerequest = httpClient.GetAsync(_url).Result;
                        string response = servicerequest.Content.ReadAsStringAsync().Result;
                        Root1 jsonObj = JsonConvert.DeserializeObject<Root1>(response);

                        Report report = jsonObj.data.reports.LastOrDefault<Report>();

                        int result = objRepo.UpdateCoderByteSore(report);



                    }
                    catch (Exception ex)
                    {
                        ExceptionLogging.SendExcepToDB(ex, "Common", "CoderByteReport");
                    }
                });

            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "CoderByteReport");
                throw ex;
            }
            return 1;
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getCoderByteInterviewDetails")]
        [HttpGet]
        public IHttpActionResult getCoderByteInterviewDetails(int cid)
        {
            int result = 0;
            try
            {
                logger.LogRequestAsync("getCoderByteInterviewDetails", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getCoderByteInterviewDetails(cid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCoderByteInterviewDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCoderByteInterviewDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCoderByteInterviewDetails", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getCoderByteAssessmentList")]
        [HttpGet]
        public IHttpActionResult getCoderByteAssessmentList()
        {
            int result = 0;

            try
            {
                logger.LogRequestAsync("getCoderByteAssessmentList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getCoderByteAssessmentList(claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCoderByteAssessmentList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCoderByteAssessmentList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCoderByteAssessmentList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getJDQuestionsByThId")]
        [HttpGet]
        public IHttpActionResult GetJDQuestionsByThId(int thid, int roundNumber)
        {
            try
            {
                logger.LogRequestAsync("GetJDQuestionsByThId", Request);

                var allowedRoles = new List<int> { 10, 5, 2 };
                var allowedOtherPermissions = new List<string> { "IsInterviewer", "IsPanelAccess" };

                if (ClaimsHelper.IsUserAuthorized(User, allowedRoles, allowedOtherPermissions))
                {
                    var jdQuestions = common.GetJDQuestionsByThIdCommon(thid, roundNumber);

                    logger.LogResponseAsync("GetJDQuestionsByThId", "200 OK");
                    return Ok(jdQuestions);
                }
                else
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetJDQuestionsByThId", User.Identity.Name);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJDQuestionsByThId", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("downloadCskillFile")]
        [HttpGet]
        public HttpResponseMessage DownloadCskillFile(string fileWebUrl)
        {
            try
            {
                logger.LogRequestAsync("DownloadCskillFile", Request);

                var allowedRoles = new List<int> { 10, 5, 2, 1 };
                var allowedOtherPermissions = new List<string> { "IsInterviewer", "IsPanelAccess" };

                if (!ClaimsHelper.IsUserAuthorized(User, allowedRoles, allowedOtherPermissions))
                {
                    logger.LogUnauthorizedAccessAsync(Request, "DownloadCskillFile", User.Identity.Name);
                    return Request.CreateResponse(HttpStatusCode.BadRequest, AppConstants.UnauthorizedMessage);
                }

                if (string.IsNullOrEmpty(fileWebUrl))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid file URL.");
                }

                byte[] fileBytes;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");
                    HttpResponseMessage responseResume = client.GetAsync(fileWebUrl).Result;
                    responseResume.EnsureSuccessStatusCode();
                    fileBytes = responseResume.Content.ReadAsByteArrayAsync().Result;
                }

                if (fileBytes == null || fileBytes.Length == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Failed to download file.");
                }

                string fileName = WebUtility.UrlDecode(System.IO.Path.GetFileName(new Uri(fileWebUrl).LocalPath)); 
                string mimeType = MimeMapping.GetMimeMapping(fileName);
                byte[] decryptedBytes = common.DecryptFile(fileBytes);

                if (decryptedBytes == null || decryptedBytes.Length == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                }

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

                logger.LogResponseAsync("DownloadCskillFile", "200 OK");
                return response;
            }
            catch (AggregateException aggEx)
            {
                string errorMessage = "AggregateException: ";
                foreach (var ex in aggEx.InnerExceptions)
                {
                    errorMessage += (ex.InnerException?.Message ?? ex.Message) + " | ";
                }
                logger.LogErrorAsync("DownloadCskillFile", new Exception(errorMessage));
                return Request.CreateResponse(HttpStatusCode.InternalServerError, errorMessage);
            }
            catch (HttpRequestException httpEx)
            {
                logger.LogErrorAsync("DownloadCskillFile", httpEx);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, $"HttpRequestException: {httpEx.InnerException?.Message ?? httpEx.Message}");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadCskillFile", ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, $"General Exception: {ex.InnerException?.Message ?? ex.Message}\n{ex.StackTrace}");
            }
        }


        public IHttpActionResult HandleAuthorizationResult(int result)
        {
            // Ensure controller context is available
            if (Request == null)
                Request = new HttpRequestMessage();

            if (Configuration == null)
                Configuration = new HttpConfiguration();

            if (result == -21 || result == -9)
            {
                  return BadRequest("You are not authorized to access this resource.");
                // Role check failed
                //return Content(HttpStatusCode.Forbidden, "You are not authorized to access this resource.");
            }

            return null; // No error, continue execution
        }


    }
}