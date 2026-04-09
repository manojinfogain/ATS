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
using Microsoft.Office.Interop.Excel;
using Atatus.Api;
using System.Reflection;
using Org.BouncyCastle.Ocsp;


namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : ApiController
    {
        DashboardRepository objRepo = new DashboardRepository();
        Common common = new Common();
        EmailSender EmailSender = new EmailSender();
        CommonController CommonController = new CommonController();
        Logger logger = new Logger();
        public DashboardController()
        {
        }

        [Route("getCountOfAllOpenRequisition")]
        [HttpGet]
        public IHttpActionResult getCountOfAllOpenRequisition()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfAllOpenRequisition";
            try
            {
                logger.LogRequestAsync(methodName, Request);

                var data = objRepo.getCountOfAllOpenRequisition(claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync(methodName, "200");
                return Ok(data);

            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getCountOfAllUnmapCandidate")]
        [HttpGet]
        public IHttpActionResult getCountOfAllUnmapCandidate()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfAllUnmapCandidate";
            try
            {
                // Log the incoming request
                logger.LogRequestAsync(methodName, Request);

                // Call the repository method to get the count of all unmap candidates
                var data = objRepo.getCountOfAllUnmapCandidate(claims[5].Value, out result);

                // Check if the result indicates unauthorized access
                if (result == -9)
                {
                    // Log unauthorized access attempt
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                // Log the successful response
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Log the exception
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getCountOfAllUnmapCandidatebyProfile")]
        [HttpGet]
        public IHttpActionResult getCountOfAllUnmapCandidatebyProfile()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfAllUnmapCandidatebyProfile";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getCountOfAllUnmapCandidatebyProfile(claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getProfileWiseUnmapCandidateCountByProfileId")]
        [HttpGet]
        public IHttpActionResult getProfileWiseUnmapCandidateCountByProfileId()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getProfileWiseUnmapCandidateCountByProfileId";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getProfileWiseUnmapCandidateCountByProfileId(claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getUnMapProfileWiseCandidateListByProfileId")]
        [HttpGet]
        public IHttpActionResult getUnMapProfileWiseCandidateListByProfileId(int ProfileID, int page, int pageSize, string startDate = null, string endDate = null, string sortColumn = null, string sortDir = null, int? screenReject = 0, string search = "")
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getUnMapProfileWiseCandidateListByProfileId";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getUnMapProfileWiseCandidateListByProfileId(ProfileID, page, pageSize, search, startDate, endDate, sortColumn, sortDir, claims[5].Value, out result, screenReject);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("updateUnMapCandidateProfileDetails")]
        [HttpPost]
        public IHttpActionResult updateUnMapCandidateProfileDetails()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "updateUnMapCandidateProfileDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                candidateProfile fb = new candidateProfile();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.Resume = HttpContext.Current.Request.Files[0].FileName;
                }

                fb.id = Convert.ToInt32(frm["id"]);
                fb.ProfileId = Convert.ToInt32(frm["ProfileId"]);
                fb.AddedBy = frm["AddedBy"];
                fb.Remarks = frm["Remarks"];
                fb.thid = frm["thid"];
                result = objRepo.updateUnMapCandidateProfileDetails(fb);

                if (result > 0 && fb.id > 0)
                {
                    logger.LogResponseAsync("updateUnMapCandidateProfileDetails", "200");
                    return Ok("Candidate profile update successfully.");
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else
                {
                    return BadRequest(AppConstants.CommonErrorMessage);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAllOpenRequisition")]
        [HttpGet]
        public IHttpActionResult getAllOpenRequisition(bool pagination, string empid = "", int limit = 0, string searchText = "")
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getAllOpenRequisition";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getAllOpenRequisition(pagination, empid, limit, searchText, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getCountOfRequisitionForRecruiters")]
        [HttpGet]
        public IHttpActionResult getCountOfRequisitionForRecruiters(string emailid)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfRequisitionForRecruiters";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getCountOfRequisitionForRecruiters(emailid, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getRequisitionForRecruiters")]
        [HttpGet]
        public IHttpActionResult getRequisitionForRecruiters(string emailid, bool offShore, int page, int pageSize, string search = "", int? primarySkill = null, int? accountId = null)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getRequisitionForRecruiters";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getRequisitionForRecruiters(emailid, offShore, page, pageSize, search, primarySkill, accountId, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getCountOfProfilesBasedOnTalentID")]
        [HttpGet]
        public IHttpActionResult getCountOfProfilesBasedOnTalentID(string thid)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfProfilesBasedOnTalentID";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getCountOfProfilesBasedOnTalentID(thid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getCountOfTalentIDFulfillmentAvailable")]
        [HttpGet]
        public IHttpActionResult getCountOfTalentIDFulfillmentAvailable(string emailid)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfTalentIDFulfillmentAvailable";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getCountOfTalentIDFulfillmentAvailable(emailid, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getFulfillmentDateBasedOnTalentID")]
        [HttpGet]
        public IHttpActionResult GetFulfillmentDateBasedOnTalentID(string thid)
        {
            try
            {
                string methodName = "getFulfillmentDateBasedOnTalentID";
                // Validate input
                if (string.IsNullOrWhiteSpace(thid))
                {
                    return BadRequest("Talent ID cannot be null or empty.");
                }

                // Get claims
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();


                // Log the request
                logger.LogRequestAsync("GetFulfillmentDateBasedOnTalentID", Request);

                // Fetch fulfillment data
                int result;
                var data = objRepo.getFulfillmentDateBasedOnTalentID(thid, claims[5].Value, out result);

                // Check result status
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                //return Ok(data);
                if (data.Tables.Count > 0)
                    return Ok(data.Tables[0]);
                else
                    return Ok(new object[0]);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetFulfillmentDateBasedOnTalentID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetFulfillmentDateBasedOnTalentID");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("getResumeOfProfilesBasedOnTalentID")]
        [HttpGet]
        public IHttpActionResult getResumeOfProfilesBasedOnTalentID(string thid, int page, int pageSize, string search = "")
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getResumeOfProfilesBasedOnTalentID";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getResumeOfProfilesBasedOnTalentID(thid, page, pageSize, claims[5].Value, out result, search);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getProfileWiseCandidateCount")]
        [HttpGet]
        public IHttpActionResult getProfileWiseCandidateCount(string thid)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getProfileWiseCandidateCount";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getProfileWiseCandidateCount(thid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getProfileWiseUnmapCandidateCount")]
        [HttpGet]
        public IHttpActionResult getProfileWiseUnmapCandidateCount()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getProfileWiseUnmapCandidateCount";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getProfileWiseUnmapCandidateCount(claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("addupdateCandidateDetailsFile")]
        [HttpPost]
        public IHttpActionResult addupdateCandidateDetailsFile()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "addupdateCandidateDetailsFile";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                candidateProfile fb = new candidateProfile();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.Resume = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                }

                fb.id = Convert.ToInt32(frm["id"]);
                fb.ProfileId = Convert.ToInt32(frm["ProfileId"]);
                fb.FirstName = frm["firstName"].ToString();
                fb.MiddleName = frm["middleName"].ToString();
                fb.LastName = frm["lastName"].ToString();
                fb.Email = frm["Email"];
                fb.MobileNumber = frm["MobileNumber"];
                fb.PrimarySkill = frm["PrimarySkill"];
                fb.SecondarySkill = frm["SecondarySkill"];
                fb.totalExp = frm["totalExp"];
                fb.totalExpMonth = frm["totalExpMonth"];
                fb.releventExp = frm["releventExp"];
                fb.relExpMonth = frm["relExpMonth"];
                fb.totalExp = frm["totalExp"];
                fb.StatusId = Convert.ToInt32(frm["StatusId"]);
                fb.CountryCode = Convert.ToInt32(frm["CountryCode"]);
                fb.AddedBy = frm["AddedBy"];
                fb.thid = frm["thid"];
                fb.dob = frm["dob"];
                fb.Path = ConfigurationManager.AppSettings["ResumesPath"].ToString();
                fb.ApproverId = frm["ApproverId"];
                fb.Remarks = frm["Remarks"];
                fb.ReferredById = frm["ReferredById"];
                fb.PartnerId = frm["PartnerId"];
                fb.Link = frm["Link"];
                fb.IsResend = frm["IsResend"] == null ? 'N' : Convert.ToChar(frm["IsResend"]);

                result = objRepo.addupdateCandidateDetailsFile(fb, claims[5].Value);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addupdateCandidateDetailsFile", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];

                    string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                    string tempPath = fb.Path + "/" + frm["thid"] + "/" + result.ToString() + "/";
                    if (!(Directory.Exists(tempPath)))
                    {
                        Directory.CreateDirectory(tempPath);
                    }
                    string fileSavePath = Path.Combine(tempPath, fb.Resume);
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

                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        return BadRequest("Error encrypting the file.");
                    }
                }

                if (result > 0 && fb.id <= 0)
                {
                    int mail = SendProfileForApprovalMailer(result, fb.AddedBy);
                    logger.LogResponseAsync("addupdateCandidateDetailsFile", "Candidate Details Uploaded Successfully");
                    return Ok("Candidate Details Uploaded Successfully");
                }
                else if (result > 0 && fb.id > 0)
                {
                    int mail = SendProfileForApprovalMailer(result, fb.AddedBy);
                    logger.LogResponseAsync("addupdateCandidateDetailsFile", "Candidate Details Updated Successfully");
                    return Ok("Candidate Details Updated Successfully");
                }
                else if (result == -1)
                    return BadRequest("Candidate Details Already Exists");
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("ResendMailProfile")]
        [HttpPost]
        public IHttpActionResult ResendMailProfile(int id)
        {
            string methodName = "ResendMailProfile";
            try
            {

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int res = SendProfileForApprovalMailer(id, claims[5].Value);
                logger.LogRequestAsync(methodName, Request);
                if (res == 1)
                {
                    logger.LogResponseAsync("ResendMailProfile", "Success");
                    return Ok("Email sent successfully.");
                }
                else
                {
                    logger.LogResponseAsync("ResendMailProfile", "Failed");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendMailProfile", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        private int SendProfileForApprovalMailer(int id, string empId)
        {
            try
            {
                int result;
                DataSet ds = objRepo.SendProfileForApprovalMailer(id, empId, out result);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                }

                string encryptedFilePath = ds.Tables[0].Rows[0]["Attachment"].ToString();
                string encryptedFileName = Path.GetFileName(encryptedFilePath);
                string originalFileName = common.RemoveLastExtension(encryptedFileName);
                MailerConfig MailerConfig = new MailerConfig();
                MailerConfig.IsEmailSend = Convert.ToInt32(ds.Tables[0].Rows[0]["IsEmailSend"].ToString());
                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();
                /***
                 * mail should not trigger
                 * **/
                if (MailerConfig.IsEmailSend == 0)
                {
                    return 2;
                }

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
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "ResendMailProfile");
                return 0;
            }
        }

        [Route("getProfileWiseCandidateList")]
        [HttpGet]
        public IHttpActionResult getProfileWiseCandidateList(int ProfileID, string thid, int page, int pageSize, string search)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getProfileWiseCandidateList";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getProfileWiseCandidateList(ProfileID, thid, page, pageSize, search, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("DeleteCandidateDetails")]
        [HttpDelete]
        public IHttpActionResult DeleteCandidateDetails(int CandidateId, string DeletedBy)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "DeleteCandidateDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                result = objRepo.DeleteCandidateDetails(CandidateId, DeletedBy);
                if (result > 0)
                {
                    logger.LogResponseAsync("DeleteCandidateDetails", "Success");
                    return Ok("Candidate Deleted Successfully");
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "DeleteCandidateDetails", DeletedBy);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else
                {
                    logger.LogResponseAsync("DeleteCandidateDetails", "Failed");
                    return BadRequest(AppConstants.CommonErrorMessage);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getRequisitionTHID")]
        [HttpGet]
        public IHttpActionResult getRequisitionByThid(string thid)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getRequisitionByThid";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getRequisitionByThid(thid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                //return Ok(data);
                if (data.Tables.Count > 0)
                    return Ok(data.Tables[0]);
                else
                    return Ok(new object[0]); // return empty array
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("downloadFile")]
        [HttpGet]
        public HttpResponseMessage DownloadFile(string filelocation)
        {
            string methodName = "DownloadFile";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var filePath = HttpContext.Current.Server.MapPath(filelocation);
                if (!File.Exists(filePath))
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                var response = new HttpResponseMessage(HttpStatusCode.OK);
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                response.Content = new StreamContent(fileStream);
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = Path.GetFileName(filePath)
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentLength = fileStream.Length;

                logger.LogResponseAsync(methodName, "200");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAllOpenRequisitionDetails")]
        [HttpPost]
        public IHttpActionResult getAllOpenRequisitionDetails([FromBody] OpenPositionFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getAllOpenRequisitionDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getAllOpenRequisitionDetails(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }
        /**
         * Develop By Ayat
         * **/
        [Route("getCountOfAllUnusedCskillProfile")]
        [HttpGet]
        public IHttpActionResult getCountOfAllUnusedCskillProfile(string thid = null, int? uniq = 0)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getCountOfAllUnusedCskillProfile";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getCountOfAllUnusedCskillProfile(thid, claims[5].Value, out result, uniq);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        /**
        * Develop By Ayat
        * **/
        //[Route("getListOfAllUnusedCskillProfile")]
        //[HttpGet]
        //public IHttpActionResult getListOfAllUnusedCskillProfile(int page, int pageSize, string thid = null, string startDate = null, string endDate = null, string recruiterId = null, string sortColumn = null, string sortDir = null, int? screenReject = 0, int? NPMax = 0, string search = "")
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        return Ok(objRepo.getListOfAllUnusedCskillProfile(thid, page, pageSize, search, startDate, endDate, recruiterId, sortColumn, sortDir, claims[5].Value, screenReject, NPMax));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getListOfAllUnusedCskillProfile");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        [Route("getListOfAllUnusedCskillProfile")]
        [HttpPost]
        public IHttpActionResult getListOfAllUnusedCskillProfile([FromBody] CSkillFilterModel obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getListOfAllUnusedCskillProfile";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getListOfAllUnusedCskillProfile(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("transferCskillUnusedCandidateRecord")]
        [HttpPost]
        public IHttpActionResult transferCskillUnusedCandidateRecord()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "transferCskillUnusedCandidateRecord";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                candidateProfile fb = new candidateProfile();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.Resume = HttpContext.Current.Request.Files[0].FileName;
                }

                fb.id = Convert.ToInt32(frm["id"]);
                fb.AddedBy = frm["AddedBy"];
                fb.Remarks = frm["Remarks"];
                fb.thid = frm["thid"];
                result = objRepo.transferCskillUnusedCandidateRecord(fb);
                if (result > 0 && fb.id > 0)
                {
                    logger.LogResponseAsync(methodName, "200");
                    return Ok("Candidate successfully transfer to " + frm["thid"] + " Talent ID.");
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else
                    return BadRequest(AppConstants.CommonErrorMessage);

            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAllOpenRequisitionForTransfer")]
        [HttpGet]
        public IHttpActionResult getAllOpenRequisitionForTransfer(bool pagination, string empid = "", int limit = 0, string searchText = "")
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getAllOpenRequisitionForTransfer";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getAllOpenRequisitionForTransfer(pagination, empid, limit, searchText, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("CskillProfileScreenReject")]
        [HttpPost]
        public IHttpActionResult CskillProfileScreenReject(string id, int screenRejected, string Remarks)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "CskillProfileScreenReject";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                string EmpID = claims[5].Value;//New Employee ID
                string Message = string.Empty;
                result = objRepo.CskillProfileScreenReject(id, screenRejected, Remarks, EmpID, ref Message);
                if (result > 0)
                {
                    logger.LogResponseAsync(methodName, "200");
                    return Ok(Message);
                }
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest(AppConstants.CommonErrorMessage);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("unmapEmpRefProfileScreenReject")]
        [HttpPost]
        public IHttpActionResult unmapEmpRefProfileScreenReject(string id, int screenRejected, string Remarks)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "unmapEmpRefProfileScreenReject";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                string EmpID = claims[5].Value;//New Employee ID
                string Message = string.Empty;
                result = objRepo.unmapEmpRefProfileScreenReject(id, screenRejected, Remarks, EmpID, ref Message);
                if (result > 0)
                {
                    logger.LogResponseAsync(methodName, "200");
                    return Ok(Message);
                }
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest(AppConstants.CommonErrorMessage);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getDeliveryWiseReport")]
        [HttpPost]
        public IHttpActionResult getDeliveryWiseReport()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getDeliveryWiseReport";
            DashboardFilter obj = new DashboardFilter();
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getDeliveryWiseReport(obj, out result, claims[5].Value);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        /**
        * Develop By Ayat
        * **/
        [Route("getAllProfileCountByClosedTalentId")]
        [HttpGet]
        public IHttpActionResult getAllProfileCountByClosedTalentId()
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getAllProfileCountByClosedTalentId";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getAllProfileCountByClosedTalentId(claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        /**
      * Develop By Ayat
      * **/
        [Route("getAllProfileByClosedTalentId")]
        [HttpGet]
        public IHttpActionResult getAllProfileByClosedTalentId(int page, int pageSize, string thid = null, string startDate = null, string endDate = null, string recruiterId = null, string sortColumn = null, string sortDir = null, string search = "")
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getAllProfileByClosedTalentId";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getAllProfileByClosedTalentId(thid, page, pageSize, startDate, endDate, recruiterId, sortColumn, sortDir, search, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("updateRequisitionDetails")]
        [HttpPost]
        public IHttpActionResult updateRequisitionDetails(updateTalentId obj)
        {
            int result;
            string message = string.Empty; // Initialize message
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "updateRequisitionDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                string Message = string.Empty;
                result = objRepo.updateRequisitionDetails(obj, claims[5].Value, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync(methodName, "200");
                    return Ok(Message);
                }
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");

            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getDeliveryHeadWiseDetails")]
        [HttpPost]
        public IHttpActionResult getDeliveryHeadWiseDetails(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getDeliveryHeadWiseDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getDeliveryWiseReport(obj, out result, claims[5].Value);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getDeliveryWiseCandidateDetails")]
        [HttpPost]
        public IHttpActionResult getDeliveryWiseReportDetails(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getDeliveryWiseReportDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getDeliveryWiseReportDetails(claims[5].Value, obj, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getDUTHIDWiseCount")]
        [HttpPost]
        public IHttpActionResult getDUTHIDWiseCount(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getDUTHIDWiseCount";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getDeliveryWiseReportDetails(claims[5].Value, obj, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getBUHeadWiseDetails")]
        [HttpPost]
        public IHttpActionResult getBUHeadWiseDetails(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getBUHeadWiseDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getBUHeadWiseDetails(obj, out result, claims[5].Value);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getBUHeadWiseCandidateDetails")]
        [HttpPost]
        public IHttpActionResult getBUHeadWiseCandidateDetails(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getBUHeadWiseCandidateDetails";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getBUHeadWiseCandidateDetails(claims[5].Value, obj, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getBUTHIDWiseCount")]
        [HttpPost]
        public IHttpActionResult getBUTHIDWiseCount(DashboardFilter obj)
        {
            int result;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            string methodName = "getBUTHIDWiseCount";
            try
            {
                logger.LogRequestAsync(methodName, Request);
                var data = objRepo.getBUTHIDWiseCount(claims[5].Value, obj, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync(methodName, "200");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAccountOwnerWiseDetails")]
        [HttpPost]
        public IHttpActionResult getAccountOwnerWiseDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getAccountOwnerWiseDetails(obj, out result, claims[5].Value);
                logger.LogRequestAsync("getAccountOwnerWiseDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAccountOwnerWiseDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getAccountOwnerWiseDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAccountOwnerWiseDetails", ex);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAccountOwnerWiseCandidateDetails")]
        [HttpPost]
        public IHttpActionResult getAccountOwnerWiseCandidateDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getAccountOwnerWiseCandidateDetails(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getAccountOwnerWiseCandidateDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAccountOwnerWiseCandidateDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getAccountOwnerWiseCandidateDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAccountOwnerWiseCandidateDetails", ex);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getAccountTHIDWiseCount")]
        [HttpPost]
        public IHttpActionResult getAccountTHIDWiseCount(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getAccountTHIDWiseCount(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getAccountTHIDWiseCount", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAccountTHIDWiseCount", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getAccountTHIDWiseCount", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAccountTHIDWiseCount", ex);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getPMWiseDetails")]
        [HttpPost]
        public IHttpActionResult getPMWiseDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getPMWiseDetails(obj, out result, claims[5].Value);
                logger.LogRequestAsync("getPMWiseDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPMWiseDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getPMWiseDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPMWiseDetails", ex);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getPMWiseCandidateDetails")]
        [HttpPost]
        public IHttpActionResult getPMWiseCandidateDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getPMWiseCandidateDetails(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getPMWiseCandidateDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPMWiseCandidateDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getPMWiseCandidateDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPMWiseCandidateDetails", ex);
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("getPMTHIDWiseCount")]
        [HttpPost]
        public IHttpActionResult getPMTHIDWiseCount(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getPMTHIDWiseCount(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getPMTHIDWiseCount", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPMTHIDWiseCount", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getPMTHIDWiseCount", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPMTHIDWiseCount", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getPMTHIDWiseCount");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("getHiringManagerWiseTHIDsDetails")]
        [HttpPost]
        public IHttpActionResult getHiringManagerWiseTHIDsDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getHiringManagerWiseTHIDsDetails(obj, out result, claims[5].Value);
                logger.LogRequestAsync("getHiringManagerWiseTHIDsDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getHiringManagerWiseTHIDsDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getHiringManagerWiseTHIDsDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getHiringManagerWiseTHIDsDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getHiringManagerWiseTHIDsDetails");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getHMTHIDWiseCount")]
        [HttpPost]
        public IHttpActionResult getHMTHIDWiseCount(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getHMTHIDWiseCount(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getHMTHIDWiseCount", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getHMTHIDWiseCount", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getHMTHIDWiseCount", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getHMTHIDWiseCount", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getHMTHIDWiseCount");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getHiringManagerWiseCandidateDetails")]
        [HttpPost]
        public IHttpActionResult getHiringManagerWiseCandidateDetails(DashboardFilter obj)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getHiringManagerWiseCandidateDetails(claims[5].Value, obj, out result);
                logger.LogRequestAsync("getHiringManagerWiseCandidateDetails", Request);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getHiringManagerWiseCandidateDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getHiringManagerWiseCandidateDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getHiringManagerWiseCandidateDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getHiringManagerWiseCandidateDetails");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("getExportToExcelForAllOpenRequisitionDetails")]
        [HttpPost]
        public HttpResponseMessage getExportToExcelForAllOpenRequisitionDetails([FromBody] OpenPositionFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            logger.LogRequestAsync("getExportToExcelForAllOpenRequisitionDetails", Request);

            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>TalentId</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Initial Fullfilment Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requirement Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Created On</font></b></td>");
            str.Append("</tr>");

            int result;
            DataSet ds = objRepo.getAllOpenRequisitionDetails(obj, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["talent_id"].ToString() + "</font></td>");

                    if (dr["initial_fullfilment_date"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["initial_fullfilment_date"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["REQUIREMENT_TYPE"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primarySkillName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["account_name"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["delivery_unit"].ToString() + "</font></td>");

                    if (dr["createdOn"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["createdOn"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "Total Open Position Report Dashboard.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                logger.LogResponseAsync("getExportToExcelForAllOpenRequisitionDetails", "200 OK");
                return response;
            }
            return null;
        }

        [Route("getAllSelectedRequisition")]
        [HttpGet]
        public IHttpActionResult getAllSelectedRequisition(bool pagination, string empid = "", int limit = 0, string searchText = "")
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getAllSelectedRequisition", Request);
                var data = objRepo.getAllselectedRequisition(pagination, empid, limit, searchText, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllSelectedRequisition", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getAllSelectedRequisition", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllSelectedRequisition", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getAllSelectedRequisition");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("CandidateScreenReject")]
        [HttpPost]
        public async Task<IHttpActionResult> CandidateScreenReject(string id, int profileTypeId, int screenRejectReasonId, char? IsFromNaukriAPI = null, string ApplicantUid = null, string Remarks = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("CandidateScreenReject", Request);
                string EmpID = claims[5].Value; // New Employee ID

                string Message = string.Empty;
                int result = objRepo.CandidateScreenReject(id, EmpID, ref Message, profileTypeId, screenRejectReasonId, IsFromNaukriAPI, Remarks);
                if (result > 0)
                {
                    logger.LogResponseAsync("CandidateScreenReject", "200 OK");
                    return Ok(Message);
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CandidateScreenReject", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == -3)
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
                logger.LogErrorAsync("CandidateScreenReject", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "CandidateScreenReject");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("ActivateCandidate")]
        [HttpPost]
        public IHttpActionResult ActivateCandidate(string id, int profileTypeId, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("ActivateCandidate", Request);
                string EmpID = claims[5].Value; // New Employee ID

                string Message = string.Empty;
                int result = objRepo.ActivateCandidate(id, EmpID, ref Message, profileTypeId, Remarks);
                if (result > 0)
                {
                    logger.LogResponseAsync("ActivateCandidate", "200 OK");
                    return Ok(Message);
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ActivateCandidate", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == -3)
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
                logger.LogErrorAsync("ActivateCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "ActivateCandidate");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }



        [Route("GetWeekWiseHiringViews")]
        [HttpGet]
        public IHttpActionResult GetWeekWiseHiringViews(string Year, string DUID = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetWeekWiseHiringViews", Request);
                var data = objRepo.GetWeekWiseHiringViews(Year, claims[5].Value, out result, DUID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetWeekWiseHiringViews", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetWeekWiseHiringViews", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetWeekWiseHiringViews", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetWeekWiseHiringViews");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetGenderDiversityOverAllHiringViews")]
        [HttpGet]
        public IHttpActionResult GetGenderDiversityOverAllHiringViews(string Year, int gender, string DUID = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetGenderDiversityOverAllHiringViews", Request);
                var data = objRepo.GetGenderDiversityOverAllHiringViews(Year, gender, claims[5].Value, out result, DUID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetGenderDiversityOverAllHiringViews", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetGenderDiversityOverAllHiringViews", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetGenderDiversityOverAllHiringViews", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetGenderDiversityOverAllHiringViews");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetOfferToJoiningHiringViews")]
        [HttpGet]
        public IHttpActionResult GetOfferToJoiningHiringViews(string Year, string DUID = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetOfferToJoiningHiringViews", Request);
                var data = objRepo.GetOfferToJoiningHiringViews(Year, claims[5].Value, out result, DUID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOfferToJoiningHiringViews", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetOfferToJoiningHiringViews", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOfferToJoiningHiringViews", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetOfferToJoiningHiringViews");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetLocationWiseHiringViews")]
        [HttpGet]
        public IHttpActionResult GetLocationWiseHiringViews(string Year, string DUID = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetLocationWiseHiringViews", Request);
                var data = objRepo.GetLocationWiseHiringViews(Year, claims[5].Value, out result, DUID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetLocationWiseHiringViews", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetLocationWiseHiringViews", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetLocationWiseHiringViews", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetLocationWiseHiringViews");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSourceWiseHiringViews")]
        [HttpGet]
        public IHttpActionResult GetSourceWiseHiringViews(string Year, string DUID = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetSourceWiseHiringViews", Request);
                var data = objRepo.GetSourceWiseHiringViews(Year, claims[5].Value, out result, DUID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetSourceWiseHiringViews", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetSourceWiseHiringViews", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSourceWiseHiringViews", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetSourceWiseHiringViews");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getApproverListForRenuTeam")]
        [HttpGet]
        public IHttpActionResult getApproverListForRenuTeam()
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getApproverListForRenuTeam", Request);
                var data = objRepo.getApproverListForRenuTeam(claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getApproverListForRenuTeam", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("getApproverListForRenuTeam", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getApproverListForRenuTeam", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getApproverListForRenuTeam");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("GetApprovalCandidateListForRenuTeam")]
        [HttpGet]
        public IHttpActionResult GetApprovalCandidateListForRenuTeam(int page, int pageSize, string search = "")
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetApprovalCandidateListForRenuTeam", Request);
                var data = objRepo.GetApprovalCandidateListForRenuTeam(page, pageSize, claims[5].Value, out result, search);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetApprovalCandidateListForRenuTeam", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetApprovalCandidateListForRenuTeam", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetApprovalCandidateListForRenuTeam", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetApprovalCandidateListForRenuTeam");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("ApproveProfileScreening")]
        [HttpPost]
        public IHttpActionResult ApproveProfileScreening(ApproveProfileScreening body)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("ApproveProfileScreening", Request);
                int result = objRepo.ApproveProfileScreening(body, claims[5].Value, ref Message);
                if (result == 1)
                {
                    logger.LogResponseAsync("ApproveProfileScreening", "200 OK");
                    return Ok(Message);
                }
                else if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveProfileScreening", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == 2)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest(AppConstants.CommonErrorMessage);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApproveProfileScreening", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "ApproveProfileScreening");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("GetProfileApprovalStatus")]
        [HttpGet]
        public IHttpActionResult GetProfileApprovalStatus(int Id)
        {
            int result;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetProfileApprovalStatus", Request);
                var data = objRepo.GetProfileApprovalStatus(claims[5].Value, Id, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetProfileApprovalStatus", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetProfileApprovalStatus", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetProfileApprovalStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetProfileApprovalStatus");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }

        [Route("downloadResume")]
        [HttpGet]
        public HttpResponseMessage downloadResume(int? cid = null, int? id = null)
        {
            try
            {
                logger.LogRequestAsync("downloadResume", Request);
                // Fetch resume path from database
                DataSet ds = objRepo.getResumePath(cid, id);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Resume not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString(); // Assuming first column contains path

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

                logger.LogResponseAsync("downloadResume", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadResume", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }


        [Route("downloadProfilePic")]
        [HttpGet]
        public HttpResponseMessage downloadProfilePic(int cid, int roundid)
        {
            try
            {
                logger.LogRequestAsync("downloadProfilePic", Request);
                // Fetch resume path from database
                DataSet ds = objRepo.getProfilePicturePath(cid, roundid);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Resume not found.");
                }

                string filelocation = ds.Tables["data"].Rows[0][0].ToString(); // Assuming first column contains path

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

                logger.LogResponseAsync("downloadProfilePic", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadProfilePic", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

        [Route("GetAllProfilesListByThid")]
        [HttpPost]
        public IHttpActionResult GetAllProfilesListByThid(AllProfileFilterDash obj)
        {
            try
            {
                logger.LogRequestAsync("GetAllProfilesListByThid", Request); // Request logging
                int result;
                var userId = ClaimsPrincipal.Current.Identities
                        .First().Claims
                        .FirstOrDefault(c => c.Type == "EmpNewId")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    logger.LogResponseAsync("GetAllProfilesListByThid", "BadRequest: User Id not found.");
                    return BadRequest("User Id not found.");
                }


                var data = objRepo.GetAllProfilesListByThid(userId, obj, out result);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetAllProfilesListByThid", authResult.ToString());
                    return authResult;
                }
                logger.LogResponseAsync("GetAllProfilesListByThid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllProfilesListByThid", ex); // Error logging
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "GetAllProfilesListByThid");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updatescreenstatusbyId")]
        [HttpPost]
        public IHttpActionResult UpdatescreenstatusbyId(UpdateScreenStatusModel obj)
        {
            try
            {
                logger.LogRequestAsync("UpdatescreenstatusbyId", Request); // Request logging

                var userId = ClaimsPrincipal.Current.Identities
                       .First().Claims
                       .FirstOrDefault(c => c.Type == "EmpNewId")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    logger.LogResponseAsync("UpdatescreenstatusbyId", "BadRequest: User Id not found.");
                    return BadRequest("User Id not found.");
                }

                string Message = string.Empty;
                int result = objRepo.UpdatescreenstatusbyId(obj, userId, ref Message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("UpdatescreenstatusbyId", authResult.ToString());
                    return authResult;
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("UpdatescreenstatusbyId", "200 OK: " + Message);
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("UpdatescreenstatusbyId", "BadRequest: " + Message);
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdatescreenstatusbyId", "BadRequest: Unknown error");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdatescreenstatusbyId", ex); // Error logging
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "UpdatescreenstatusbyId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddMultipleProfiles")]
        [HttpPost]
        public IHttpActionResult AddMultipleProfiles()
        {
            try
            {
                var uploadedFiles1 = System.Web.HttpContext.Current.Request.Files;
                var request = System.Web.HttpContext.Current.Request;
                string message = string.Empty;
                List<InsertedProfileResult> insertedProfiles;
                // Check content type
                if (!request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Invalid content type");
                // Get profiles JSON from form data
                string profilesJson = request.Form["profiles"];
                int StatusId = Convert.ToInt32(request.Form["StatusId"]);
                int ProfileId = Convert.ToInt32(request.Form["ProfileId"]);
                int thid = Convert.ToInt32(request.Form["thid"]);
                // int candidateId = 0;
                int candidateId = Convert.ToInt32(
                       request.Form["candidateId"] == null ||
                       request.Form["candidateId"] == "undefined" ||
                      request.Form["candidateId"].ToString() == ""
                       ? "0"
                 : request.Form["candidateId"]
);
                if (string.IsNullOrEmpty(profilesJson))
                    return BadRequest("Profiles JSON is required");

                var profiles = Newtonsoft.Json.JsonConvert.DeserializeObject<List<CandidateProfile>>(profilesJson);
                // Add additional extension to filename
                foreach (var profile in profiles)
                {
                    profile.filename = common.GetFileWithAdditionalExtention(profile.filename);
                    profile.filePath = ConfigurationManager.AppSettings["ResumesPath"].ToString();
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddMultipleProfiles(profiles, claims[5].Value, StatusId, ProfileId, thid, candidateId, out message, out insertedProfiles);

                if (result == 1)
                {
                    // Save  resumes physically only for inserted profiles
                    //foreach (var inserted in insertedProfiles)
                    //{
                    //    // Find matching profile by Email
                    //    var files = files.FirstOrDefault(p => p.fileName == inserted.fileName);

                    //}
                    var uploadedFiles = System.Web.HttpContext.Current.Request.Files;
                    foreach (var inserted in insertedProfiles)
                    {

                        // Try to find uploaded file matching inserted profile's filename
                        HttpPostedFile fileToSave = null;
                        //if fresh prfofile
                        if (candidateId == 0)
                        {
                            for (int i = 0; i < uploadedFiles.Count; i++)
                            {
                                var postedFile = uploadedFiles[i];
                                if (string.Equals(postedFile.FileName, common.RemoveLastExtension(inserted.filename), StringComparison.OrdinalIgnoreCase))
                                {
                                    fileToSave = postedFile;
                                    break;
                                }
                            }

                            if (fileToSave != null)
                            {
                                string tempPath = ConfigurationManager.AppSettings["ResumesPath"] + "/" + thid + "/" + inserted.ID.ToString() + "/";
                                if (!(Directory.Exists(tempPath)))
                                {
                                    Directory.CreateDirectory(tempPath);
                                }
                                string savePath = Path.Combine(tempPath, inserted.filename);
                                byte[] fileBytes;
                                using (MemoryStream memoryStream = new MemoryStream())
                                {
                                    fileToSave.InputStream.CopyTo(memoryStream);
                                    fileBytes = memoryStream.ToArray();
                                }
                                int encryptionResult = common.EncryptFile(fileBytes, savePath);

                                if (encryptionResult == 1)
                                {
                                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(inserted.ID, claims[5].Value, 0);

                                }
                                else
                                {
                                    return BadRequest("Error encrypting the file." + common.RemoveLastExtension(inserted.filename));
                                }


                                // fileToSave.SaveAs(savePath);
                            }
                            else
                            {
                                // Handle file not found scenario if necessary
                                // e.g., log warning that no uploaded file matched this profile
                            }

                        }
                        //if profile Exist
                        else
                        {
                            GlobalFunctions GlobalFunctions = new GlobalFunctions();
                            System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(inserted.ID, claims[5].Value, 0);
                        }



                    }

                    return Ok(new { Message = message, Data = insertedProfiles });
                }
                else
                {
                    return BadRequest(message);
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "AddMultipleProfiles");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddMultipleProfilesAfterAssesments")]
        [HttpPost]
        public IHttpActionResult AddMultipleProfilesAfterAssesments()
        {
            try
            {
                var uploadedFiles1 = System.Web.HttpContext.Current.Request.Files;
                var request = System.Web.HttpContext.Current.Request;
                string message = string.Empty;
                List<InsertedProfileResult> insertedProfiles;
                // Check content type
                if (!request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Invalid content type");
                // Get profiles JSON from form data
                string profilesJson = request.Form["profiles"];
                int StatusId = Convert.ToInt32(request.Form["StatusId"]);
                int ProfileId = Convert.ToInt32(request.Form["ProfileId"]);
                int thid = Convert.ToInt32(request.Form["thid"]);
                if (string.IsNullOrEmpty(profilesJson))
                    return BadRequest("Profiles JSON is required");

                var profiles = Newtonsoft.Json.JsonConvert.DeserializeObject<List<CandidateProfile>>(profilesJson);
                // Add additional extension to filename
                foreach (var profile in profiles)
                {
                    profile.filename = common.GetFileWithAdditionalExtention(profile.filename);
                    profile.filePath = ConfigurationManager.AppSettings["AssessedResumesPath"].ToString();
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddMultipleProfilesAfterAssesments(profiles, claims[5].Value, StatusId, ProfileId, thid, out message, out insertedProfiles);

                if (result == 1)
                {
                    // Save  resumes physically only for inserted profiles
                    //foreach (var inserted in insertedProfiles)
                    //{
                    //    // Find matching profile by Email
                    //    var files = files.FirstOrDefault(p => p.fileName == inserted.fileName);

                    //}
                    var uploadedFiles = System.Web.HttpContext.Current.Request.Files;
                    foreach (var inserted in insertedProfiles)
                    {

                        // Try to find uploaded file matching inserted profile's filename
                        HttpPostedFile fileToSave = null;
                        for (int i = 0; i < uploadedFiles.Count; i++)
                        {
                            var postedFile = uploadedFiles[i];
                            if (string.Equals(postedFile.FileName, common.RemoveLastExtension(inserted.filename), StringComparison.OrdinalIgnoreCase))
                            {
                                fileToSave = postedFile;
                                break;
                            }
                        }

                        if (fileToSave != null)
                        {
                            string tempPath = ConfigurationManager.AppSettings["AssessedResumesPath"] + "/" + thid + "/" + inserted.ID.ToString() + "/";
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string savePath = Path.Combine(tempPath, inserted.filename);
                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                fileToSave.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }
                            int encryptionResult = common.EncryptFile(fileBytes, savePath);

                            if (encryptionResult == 1)
                            {
                                GlobalFunctions GlobalFunctions = new GlobalFunctions();
                                System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(inserted.ID, claims[5].Value, 0, 'T');

                            }
                            else
                            {
                                return BadRequest("Error encrypting the file." + common.RemoveLastExtension(inserted.filename));
                            }


                            // fileToSave.SaveAs(savePath);
                        }
                        else
                        {
                            // Handle file not found scenario if necessary
                            // e.g., log warning that no uploaded file matched this profile
                        }
                    }

                    return Ok(new { Message = message, Data = insertedProfiles });
                }
                else
                {
                    return BadRequest(message);
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "AddMultipleProfiles");
                return BadRequest("There is some error! Try again later");
            }
        }


        private void SaveBase64ResumeToFile(string base64String, string originalFileName, int profileId, string email)
        {
            try
            {
                // Convert base64 string to bytes
                byte[] fileBytes = Convert.FromBase64String(base64String);

                // Create a safe filename: ProfileID_Email_OriginalFileName.ext
                string safeEmail = email.Replace("@", "_at_").Replace(".", "_dot_");
                string fileName = $"Resume_{profileId}_{safeEmail}_{originalFileName}";

                // Get folder path
                string folderPath = HttpContext.Current.Server.MapPath("~/UploadedResumes/");

                // Create folder if not exists
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                // Combine full path
                string filePath = Path.Combine(folderPath, fileName);

                // Save file bytes
                File.WriteAllBytes(filePath, fileBytes);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "SaveBase64ResumeToFile");
            }
        }

        [Route("UpdateProfileDetailsById")]
        [HttpPost]
        public IHttpActionResult UpdateProfileDetailsById()
        {
            try
            {
                var uploadedFiles = System.Web.HttpContext.Current.Request.Files;

                var request = System.Web.HttpContext.Current.Request;
                string message = string.Empty;
                // Check content type
                if (!request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Invalid content type");
                // Get profiles JSON from form data
                string profilesJson = request.Form["profiles"];
                int thid = Convert.ToInt32(request.Form["thid"]);
                // int candidateId = 0;
                int candidateId = Convert.ToInt32(
                       request.Form["candidateId"] == null ||
                       request.Form["candidateId"] == "undefined" ||
                      request.Form["candidateId"].ToString() == ""
                       ? "0"
                 : request.Form["candidateId"]
);
                if (string.IsNullOrEmpty(profilesJson))
                    return BadRequest("Profiles JSON is required");

                var profile = Newtonsoft.Json.JsonConvert.DeserializeObject<CandidateProfileModel>(profilesJson);
                if (uploadedFiles != null && uploadedFiles.Count > 0)
                {

                    var file = uploadedFiles[0];
                    if (file != null && file.ContentLength > 0)
                    {
                        profile.Filename = common.GetFileWithAdditionalExtention(file.FileName);
                        profile.FilePath = ConfigurationManager.AppSettings["ResumesPath"].ToString();

                    }
                }



                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateProfileDetailsById(profile, claims[5].Value, thid, candidateId, out message);

                if (result == 1)
                {
                    if (uploadedFiles != null && uploadedFiles.Count > 0)
                    {

                        string resumesFolderPath = ConfigurationManager.AppSettings["ResumesPath"].ToString();
                        string tempPath = resumesFolderPath + "/" + thid + "/" + candidateId + "/";
                        var file = uploadedFiles[0];
                        if (file != null && file.ContentLength > 0)
                        {
                            string originalFileName = Path.GetFileName(file.FileName);
                            string uniqueFileName = common.GetFileWithAdditionalExtention(originalFileName);
                            if (!(Directory.Exists(tempPath)))
                            {
                                Directory.CreateDirectory(tempPath);
                            }
                            string fileSavePath = Path.Combine(tempPath, profile.Filename);
                            if (System.IO.File.Exists(fileSavePath))
                            {
                                File.Delete(fileSavePath);
                            }
                            byte[] fileBytes;
                            using (MemoryStream memoryStream = new MemoryStream())
                            {
                                file.InputStream.CopyTo(memoryStream);
                                fileBytes = memoryStream.ToArray();
                            }
                            // Encrypt the file before saving
                            int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                            if (encryptionResult != 1)
                            {
                                return BadRequest("Error encrypting the file.");
                            }
                            return Ok(message);

                        }
                    }
                    //if file not exist
                    return Ok(message);
                }
                else
                {
                    return BadRequest(message);
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "UpdateProfileDetailsById");
                return BadRequest("There is some error! Try again later");

            }
        }




    }
}