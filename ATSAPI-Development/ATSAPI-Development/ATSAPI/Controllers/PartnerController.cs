using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Configuration;
using System.Text;
using System.Data;
using System.Net.Http.Headers;
using Org.BouncyCastle.Ocsp;
using DocumentFormat.OpenXml.Drawing.Charts;
using System.Reflection;

namespace ATSAPI.Controllers
{
    //[AuthorizeAttribute]
    [RoutePrefix("api/Partner")]
    public class PartnerController : ApiController
    {
        PartnerRepository objRepo = new PartnerRepository();
        Common common = new Common();
        ReportController Rc = new ReportController();
        Logger logger = new Logger();

        [UserWiseAuthorizeAttribute("I")]
        [Route("getPartnerDetails")]
        [HttpPost]
        public IHttpActionResult getPartnerDetails([FromBody] PartnerDetailFilter obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            try
            {
                logger.LogRequestAsync("getPartnerDetails", Request);
                var data = objRepo.getPartnerFullDetails(claims[5].Value, out result, obj.page, obj.pageSize, obj.search, obj.PartnerID, obj.statusId, obj.ContractTypeID);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPartnerDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getPartnerDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPartnerDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getAllPartnerList")]
        [HttpPost]
        public IHttpActionResult getAllPartnerList([FromBody] PartnerDetailFilter obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            try
            {
                logger.LogRequestAsync("getAllPartnerList", Request);
                var data = objRepo.getAllPartnerList(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllPartnerList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllPartnerList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllPartnerList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getAllPartnerList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getPartnerFullDetails")]
        [HttpGet]
        public IHttpActionResult getPartnerFullDetails(string EmpID, int page, int pageSize, string search = "", int PartnerID = 0, string ContractTypeID = "", string statusId = "", int pendingWithMe = 0)
        {
            try
            {
                logger.LogRequestAsync("getPartnerFullDetails", Request);
                int result;
                var data = objRepo.getPartnerFullDetails(EmpID, out result, page, pageSize, search, PartnerID, statusId, ContractTypeID);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPartnerFullDetails", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getPartnerFullDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPartnerFullDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPartnerFullDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("addUpdatePartnerDetails")]
        [HttpPost]
        public IHttpActionResult AddUpdatePartnerDetails(PartnerModel obj)
        {
            try
            {
                logger.LogRequestAsync("addUpdatePartnerDetails", Request);

                string Password = null;
                string Salt = null;
                string pwdTxt = null;
                if (obj.Action == "A")
                {
                    Guid g = Guid.NewGuid();
                    Salt = Convert.ToBase64String(g.ToByteArray()).Replace("=", "").Replace("+", "");
                    pwdTxt = obj.Email.Substring(0, 4) + "@" + (new Random()).Next(100, 1000).ToString();
                    Password = common.Encrypt(pwdTxt, Salt);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddUpdatePartnerDetails(obj, Password, Salt, pwdTxt, claims[5].Value);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addUpdatePartnerDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("addUpdatePartnerDetails", "200 OK");

                if (result == 2)
                    return BadRequest("Duplicate Contract Type is not Allowed");
                if (result > 0 && obj.PartnerID <= 0)
                    return Ok("Partner Details Added Successfully");
                else if (result > 0 && obj.PartnerID > 0)
                    return Ok("Partner Details Updated Successfully");
                else if (result == -1)
                    return BadRequest("Partner Details Already Exists");
                else
                    return BadRequest("There is some error! Try again later");

                
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addUpdatePartnerDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "AddUpdatePartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("approveRejectPartnerDetails")]
        [HttpPost]
        public IHttpActionResult approveRejectPartnerDetails(int PartnerId, char ActionTaken, string remarks)
        {
            try
            {
                logger.LogRequestAsync("approveRejectPartnerDetails", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result1;
                string Email = objRepo.getEmailByPartnerId(PartnerId, claims[5].Value, out result1);

                if (result1 == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "approveRejectPartnerDetails", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string pwdTxt = string.IsNullOrEmpty(Email) ? "" : Email.Substring(0, 4) + "@" + (new Random()).Next(100, 1000).ToString();
                int result = objRepo.approveRejectPartnerDetails(PartnerId, claims[5].Value, ActionTaken, remarks, pwdTxt);

                if (result == 1)
                    return Ok("Partner Details Approved Sucessfully");
                else if (result == 2)
                    return Ok("Partner Details Rejected Sucessfully");
                else if (result == -1)
                    return BadRequest("Partner does not exists");
                else
                    return BadRequest("There is some error! Try again later");

                logger.LogResponseAsync("approveRejectPartnerDetails", "200 OK");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("approveRejectPartnerDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "approveRejectPartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ChangePartnerStatus")]
        [HttpPost]
        public IHttpActionResult ChangePartnerStatus(int PartnerID, int status, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("ChangePartnerStatus", Request);

                string EmpID = claims[5].Value; // New Employee ID
                int result = objRepo.ChangePartnerStatus(PartnerID, status, Remarks, EmpID);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ChangePartnerStatus", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string responseMessage = result > 0 ? "Partner Status has been changed." : "There is some error! Try again later";

                logger.LogResponseAsync("ChangePartnerStatus", "200 OK");
                return Ok(responseMessage);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangePartnerStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ChangePartnerStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("CreatePartnerUser")]
        [HttpPost]
        public IHttpActionResult CreatePartnerUser(PartnerUser obj)
        {
            try
            {
                logger.LogRequestAsync("CreatePartnerUser", Request);

                Guid g = Guid.NewGuid();
                string Salt = Convert.ToBase64String(g.ToByteArray()).Replace("=", "").Replace("+", "");
                string pwdTxt = obj.Email.Substring(0, 4) + "@" + (new Random()).Next(100, 1000).ToString();
                string Password = common.Encrypt(pwdTxt, Salt);

                int result = objRepo.CreatePartnerUser(obj, Password, Salt, pwdTxt);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CreatePartnerUser", obj.Email);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result > 0)
                    return Ok("Partner User Created");
                else if (result == -1)
                    return BadRequest("Partner User Already Exists");
                else if (result == -3)
                    return BadRequest("Not allowed more than 5 user.");
                else
                    return BadRequest("There is some error! Try again later");

                logger.LogResponseAsync("CreatePartnerUser", "200 OK");

            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CreatePartnerUser", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "CreatePartnerUser");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("getPartnerUsersList")]
        [HttpPost]
        public IHttpActionResult getPartnerUsersList([FromBody] PartnerMultiselectFilter obj)
        {
            try
            {
                logger.LogRequestAsync("getPartnerUsersList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string EmpID = claims[5].Value; // New Employee ID
                int result;
                var data = objRepo.getPartnerUsersList(obj, EmpID, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPartnerUsersList", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getPartnerUsersList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPartnerUsersList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPartnerUsersList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ChangePartnerUserStatus")]
        [HttpPost]
        public IHttpActionResult ChangePartnerUserStatus(int UserID, int status, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("ChangePartnerUserStatus", Request);

                string EmpID = claims[5].Value; // New Employee ID
                int result = objRepo.ChangePartnerUserStatus(UserID, status, Remarks, EmpID);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ChangePartnerUserStatus", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string responseMessage = result > 0 ? "Partner User Status has been changed." : "There is some error! Try again later";

                logger.LogResponseAsync("ChangePartnerUserStatus", "200 OK");
                return Ok(responseMessage);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangePartnerUserStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ChangePartnerUserStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("AssignTalentIdToPartner")]
        [HttpPost]
        public IHttpActionResult AssignTalentIdToPartner([FromBody] AssignTalentIdPartner obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("AssignTalentIdToPartner", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.AssignTalentIdToPartner(obj, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AssignTalentIdToPartner", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string responseMessage = result > 0 ? Message : (result == -2 ? Message : "There is some error! Try again later");

                logger.LogResponseAsync("AssignTalentIdToPartner", "200 OK");
                return Ok(responseMessage);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AssignTalentIdToPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "AssignTalentIdToPartner");
                return BadRequest("There is some error! Try again later");
            }
        }


        /**
        * Develop By Ayat
        * **/
        //[Route("getListOfPartnerTalentID")]
        //[HttpGet]
        //public IHttpActionResult getListOfPartnerTalentID(int page, int pageSize, string thid = null, int? statusID = null, string startDate = null, string endDate = null, string partnerId = null, string sortColumn = null, string sortDir = null, string search = "",string accountId=null,string practiceId=null)
        //{
        //    try
        //    {
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        return Ok(objRepo.getListOfPartnerTalentID(thid, page, pageSize, search, statusID, startDate, endDate, partnerId, sortColumn, sortDir, claims[5].Value,accountId,practiceId));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Partner", "getListOfPartnerTalentID");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        [UserWiseAuthorizeAttribute("I")]
        [Route("getListOfPartnerTalentID")]
        [HttpPost]
        public IHttpActionResult getListOfPartnerTalentID([FromBody] PartnerTalentFilter obj)
        {
            try
            {
                logger.LogRequestAsync("getListOfPartnerTalentID", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getListOfPartnerTalentID(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getListOfPartnerTalentID", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getListOfPartnerTalentID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getListOfPartnerTalentID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getListOfPartnerTalentID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("partnerTalentIdStatusUpdate")]
        [HttpPost]
        public IHttpActionResult partnerTalentIdStatusUpdate(string partnerId, string thid, int status, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("partnerTalentIdStatusUpdate", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.partnerTalentIdStatusUpdate(partnerId, thid, status, Remarks, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "partnerTalentIdStatusUpdate", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("partnerTalentIdStatusUpdate", "200 OK");
                if (result > 0)
                    return Ok(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("partnerTalentIdStatusUpdate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "partnerTalentIdStatusUpdate");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("addupdateCandidateByPartner")]
        [HttpPost]
        public IHttpActionResult addupdateCandidateByPartner()
        {
            try
            {
                logger.LogRequestAsync("addupdateCandidateByPartner", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                parnerCandidateProfile fb = new parnerCandidateProfile();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.Resume = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                }

                fb.id = Convert.ToInt32(frm["id"]);
                fb.ProfileId = Convert.ToInt32(frm["ProfileId"]);
                fb.FirstName = string.IsNullOrEmpty(frm["firstName"]) ? null : frm["firstName"];
                fb.MiddleName = string.IsNullOrEmpty(frm["middleName"]) ? null : frm["middleName"];
                fb.LastName = string.IsNullOrEmpty(frm["lastName"]) ? null : frm["lastName"];
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
                fb.contractType = Convert.ToInt32(frm["contractTypeId"]);
                fb.currencyTypeId = Convert.ToInt32(frm["currencyTypeId"]);
                fb.noticePeriod = Convert.ToInt32(frm["noticePeriod"]);
                fb.expSalary = Convert.ToString(frm["expSalary"]);
                fb.curSalary = string.IsNullOrEmpty(frm["curSalary"]) ? null : frm["curSalary"];
                fb.currentOrg = string.IsNullOrEmpty(frm["currentOrg"]) ? null : frm["currentOrg"];
                fb.eduQualification = string.IsNullOrEmpty(frm["eduQualification"]) ? null : Convert.ToString(frm["eduQualification"]);
                fb.countyId = string.IsNullOrEmpty(frm["CountryId"]) ? 0 : Convert.ToInt32(frm["CountryId"]);
                fb.cityId = Convert.ToInt32(frm["CityId"]);
                fb.Path = ConfigurationManager.AppSettings["ResumesPath"].ToString();
                fb.Gender = Convert.ToInt32(frm["Gender"]);
                fb.dob = string.IsNullOrEmpty(frm["dob"]) ? null : frm["dob"];
                fb.SalaryType = Convert.ToInt32(frm["SalaryType"]);
                fb.StateId = string.IsNullOrEmpty(frm["StateId"]) ? 0 : Convert.ToInt32(frm["StateId"]);
                fb.HiringLocationId = Convert.ToInt32(frm["HiringLocationId"]);
                fb.relocation = string.IsNullOrEmpty(frm["relocation"]) ? 0 : Convert.ToInt32(frm["relocation"]);
                fb.workVisaStatus = string.IsNullOrEmpty(frm["workVisaStatus"]) ? 0 : Convert.ToInt32(frm["workVisaStatus"]);
                fb.visaExpireDate = string.IsNullOrEmpty(frm["visaExpireDate"]) ? null : frm["visaExpireDate"];
                fb.link = string.IsNullOrEmpty(frm["link"]) ? null : frm["link"];

                string Message = string.Empty;
                int result = objRepo.addupdateCandidateByPartner(fb, ref Message, claims[5].Value);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addupdateCandidateByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (HttpContext.Current.Request.Files.Count > 0 && result > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName) + Path.GetExtension(httpPostedFile.FileName);
                    string tempPath = Path.Combine(fb.Path, frm["thid"], result.ToString());

                    string fileSavePath = Path.Combine(tempPath, common.GetFileWithAdditionalExtention(filedetails));

                    if (!Directory.Exists(tempPath))
                    {
                        Directory.CreateDirectory(tempPath);
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
                        return BadRequest("Error encrypting the file.");
                    }
                }
                GlobalFunctions GlobalFunctions = new GlobalFunctions();
               

                logger.LogResponseAsync("addupdateCandidateByPartner", "200 OK");
                if (result > 0 && fb.id <= 0)
                {
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(result, fb.AddedBy, 0);
                    return Ok(Message);
                }
          
                else if (result > 0 && fb.id > 0)
                {
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(result, fb.AddedBy, 0);
                    return Ok(Message);
                }
                   
                else if (result == -2)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addupdateCandidateByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "addupdateCandidateByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }


        /**
      * Develop By Ayat
      * **/
        [UserWiseAuthorizeAttribute("E")]
        [Route("getTalentIDParterWise")]
        [HttpGet]
        public IHttpActionResult getTalentIDParterWise(int page, int pageSize, string search = "")
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getTalentIDParterWise(page, pageSize, search, claims[5].Value, out result);

                if (result == -9)
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getCandidateListByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }


        /**
     * Develop By Ayat
     * **/
        [UserWiseAuthorizeAttribute("E")]
        [Route("getCandidateListByPartner")]
        [HttpGet]
        public IHttpActionResult getCandidateListByPartner(int page, int pageSize, int? statusID = null, string startDate = null, string endDate = null, string sortColumn = null, string sortDir = null, string search = "")
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getCandidateListByPartner", Request);

                int result;
                var data = objRepo.getCandidateListByPartner(page, pageSize, search, statusID, startDate, endDate, sortColumn, sortDir, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateListByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCandidateListByPartner", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateListByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getCandidateListByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("candidateStatusUpdateByPartner")]
        [HttpPost]
        public IHttpActionResult candidateStatusUpdateByPartner(string partnerId, string id, int status, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("candidateStatusUpdateByPartner", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.candidateStatusUpdateByPartner(partnerId, id, status, Remarks, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "candidateStatusUpdateByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("candidateStatusUpdateByPartner", "200 OK");
                    return Ok(Message);
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
                logger.LogErrorAsync("candidateStatusUpdateByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "candidateStatusUpdateByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("candidateWithrawnByPartner")]
        [HttpPost]
        public IHttpActionResult CandidateWithrawnByPartner(string partnerId, string id, int status, char isCache, string Remarks = null, int? cid = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("CandidateWithrawnByPartner", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.CandidateWithrawnByPartner(partnerId, id, status, isCache, Remarks, EmpID, cid, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CandidateWithrawnByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("CandidateWithrawnByPartner", "200 OK");
                    return Ok(Message);
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
                logger.LogErrorAsync("CandidateWithrawnByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "CandidateWithrawnByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("checkEmailExistUploadProfByPartner")]
        [HttpGet]
        public IHttpActionResult checkEmailExistUploadProfByPartner(string email)
        {
            try
            {
                logger.LogRequestAsync("checkEmailExistUploadProfByPartner", Request);

                var result = objRepo.checkEmailExistUploadProfByPartner(email);

                logger.LogResponseAsync("checkEmailExistUploadProfByPartner", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("checkEmailExistUploadProfByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "checkEmailExistUploadProfByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        /**
        * Developed By Ayat
        **/
        [UserWiseAuthorizeAttribute("E")]
        [Route("getCandidateDetailsPartner")]
        [HttpGet]
        public IHttpActionResult getCandidateDetailsPartner(int id)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getCandidateDetailsPartner", Request);

                int result;
                var data = objRepo.getCandidateDetailsPartner(id, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateDetailsPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getCandidateDetailsPartner", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDetailsPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getCandidateDetailsPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        /**
        * Developed By Ayat
        **/
        [UserWiseAuthorizeAttribute("I")]
        [Route("getPartnerCandidateListByTalentId")]
        [HttpGet]
        public IHttpActionResult getPartnerCandidateListByTalentId(int page, int pageSize, string thId, int? intStatus = null, int? statusID = null, string startDate = null, string endDate = null, string sortColumn = null, string sortDir = null, int? screenReject = 0, string search = "")
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getPartnerCandidateListByTalentId", Request);

                int result;
                var data = objRepo.getPartnerCandidateListByTalentId(page, pageSize, search, statusID, startDate, endDate, sortColumn, sortDir, claims[5].Value, thId, out result, intStatus, screenReject);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPartnerCandidateListByTalentId", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getPartnerCandidateListByTalentId", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPartnerCandidateListByTalentId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPartnerCandidateListByTalentId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("getRequisitionTHIDByPartner")]
        [HttpGet]
        public IHttpActionResult getRequisitionTHIDByPartner(string THID)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string userID = claims[5].Value; // New Employee ID

                logger.LogRequestAsync("getRequisitionTHIDByPartner", Request);

                string Message = string.Empty;
                int result;
                var data = objRepo.getRequisitionTHIDByPartner(THID, out result, userID);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getRequisitionTHIDByPartner", userID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getRequisitionTHIDByPartner", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getRequisitionTHIDByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "getRequisitionTHIDByPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("partnerProfileScreenReject")]
        [HttpPost]
        public IHttpActionResult partnerProfileScreenReject(string id, int screenRejected, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; // New Employee ID

                logger.LogRequestAsync("partnerProfileScreenReject", Request);

                string Message = string.Empty;
                int result = objRepo.partnerProfileScreenReject(id, screenRejected, Remarks, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "partnerProfileScreenReject", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("partnerProfileScreenReject", "200 OK");
                    return Ok(Message);
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
                logger.LogErrorAsync("partnerProfileScreenReject", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "partnerProfileScreenReject");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("addComapnyList")]
        [HttpPost]
        public IHttpActionResult addComapnyList(string name)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; // New Employee ID

                logger.LogRequestAsync("addComapnyList", Request);

                string Message = string.Empty;
                int result = objRepo.addComapnyList(name, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addComapnyList", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result == 1 || result == -2)
                {
                    logger.LogResponseAsync("addComapnyList", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addComapnyList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "addComapnyList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("resetPartnerUserPassword")]
        [HttpPost]
        public IHttpActionResult resetPartnerUserPassword(int userId, string Email)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("resetPartnerUserPassword", Request);

                Guid g = Guid.NewGuid();
                string Salt = Convert.ToBase64String(g.ToByteArray()).Replace("=", "").Replace("+", "");
                string pwdTxt = Email.Substring(0, 4) + "@" + (new Random()).Next(100, 1000).ToString();
                string Password = common.Encrypt(pwdTxt, Salt);
                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;

                int result = objRepo.resetPartnerUserPassword(userId, Password, Salt, pwdTxt, EmpID, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "resetPartnerUserPassword", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("resetPartnerUserPassword", "200 OK");
                    return Ok(Message);
                }
                else if (result == -1)
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
                logger.LogErrorAsync("resetPartnerUserPassword", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "resetPartnerUserPassword");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getpartnerselectionreason")]
        [HttpGet]
        public IHttpActionResult getpartnerselectionreason()
        {
            try
            {
                logger.LogRequestAsync("getpartnerselectionreason", Request);

                var data = objRepo.getpartnerselectionreason();

                logger.LogResponseAsync("getpartnerselectionreason", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getpartnerselectionreason", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getpartnerselectionreason");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("TransferCandidateByPartner")]
        [HttpPost]
        public IHttpActionResult TransferCandidateByPartner(int id, string toThId, int? cid = null, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("TransferCandidateByPartner", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.TransferCandidateByPartner(id, cid, toThId, claims[5].Value, remarks, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "TransferCandidateByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                     GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    if (cid == null || cid == 0)
                    {
                        System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(Convert.ToInt32(cid), claims[5].Value, 0);
                    }
                    else
                    {
                        System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 1);
                    }

                    logger.LogResponseAsync("TransferCandidateByPartner", "200 OK");
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
                logger.LogErrorAsync("TransferCandidateByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "PartnerTalentTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("TransferUnattendedProfileByPartner")]
        [HttpPost]
        public IHttpActionResult TransferUnattendedProfileByPartner(int id, string toThId, string remarks = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("TransferUnattendedProfileByPartner", Request);

                int result = objRepo.TransferUnattendedProfileByPartner(id, toThId, claims[5].Value, remarks, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "TransferUnattendedProfileByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                else if (result == 1)
                {
                     GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 0);
                    logger.LogResponseAsync("TransferUnattendedProfileByPartner", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
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
                logger.LogErrorAsync("TransferUnattendedProfileByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "PartnerTalentTransferRequest");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [Route("getProfilesListSharedByPartner")]
        [HttpPost]
        public IHttpActionResult getProfilesListSharedByPartner([FromBody] PartnerProfileFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("getProfilesListSharedByPartner", Request);

                int result;
                var data = objRepo.getProfilesListSharedByPartner(obj, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getProfilesListSharedByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getProfilesListSharedByPartner", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getProfilesListSharedByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getProfilesListSharedByPartner");
                return BadRequest(AppConstants.CommonErrorMessage);
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("ExportToExcelProfilesSharedByPartner")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelProfilesSharedByPartner([FromBody] PartnerProfileFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employee Id</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contact Number</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date of Birth</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate - Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate - Secondary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Relevent Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Notice Period</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Education Qualification</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current Employer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Category</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent - Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent - Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Practice</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requirement Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Requirement Shared Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Profile Submittion Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Partner Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Rejection Round</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reject Reason</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Current CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Expected CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offered CTC</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Comp Band</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Median GRID as per TID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Max. GRID as per TID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>State Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Hiring Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>IS Relocation</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Visa Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Visa Expiry Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>link</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Action Taken By Partner User</font></b></td>");


            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.getProfilesListSharedByPartnerReport(obj, claims[5].Value, out result);
            
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["talent_id"].ToString() + "</font></td>");
                    if (dr["cid"].ToString() == "")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");

                    }
                    else if (dr["ProfileId"].ToString() == "")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cid"].ToString() + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Rc.CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + "</font></td>");
                    }
                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Rc.CIDPrefix(dr["Source"].ToString()) + dr["cid"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidateEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeID"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MobileNumber"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Dob"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryskillName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["subSkillName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExp"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["relevantExp"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NoticePeriod"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["eduQualification"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["cityName"].ToString() + "(" + dr["country_name"].ToString() + ")" + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["currentCompany"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Category"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["contractName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimarySkillTH"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SubSkillTH"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Practice"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeliveryUnit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiterEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RequirementType"].ToString() + "</font></td>");
                    if (dr["ReqOpenDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["ReqOpenDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    if (dr["addedOn"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["addedOn"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PartnerName"].ToString() + "</font></td>");
                    if (dr["interviewStatus"].ToString() == "" && dr["isScreenRejected"].ToString() == "0") { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidateStatusName"].ToString() + "</font></td>"); }
                    else if (dr["interviewStatus"].ToString() == "" && dr["isScreenRejected"].ToString() == "1") { str.Append("<td><font face='Calibri' size='12px'>Screen Rejected</font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["interviewStatusName"].ToString() + "</font></td>"); }
                    if (dr["isScreenRejected"].Equals(1))
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "Screen Rejected" + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "" + "</font></td>");
                    }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ScreenRejectReason"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CurrentCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ExpectedCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["offerCTC"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["offerStatus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CompBand"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MinGridLimit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["MaxGridLimit"].ToString() + "</font></td>");

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["stateName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["HiringLocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["relocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["VisaType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["visaExpireDate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["link"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PartnerUser"].ToString() + "</font></td>");


                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);   

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "ProfilesListSharedByPartner.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("CandidateTransferRequestByPartner")]
        [HttpPost]
        public IHttpActionResult CandidateTransferRequest(int cid, string toThId, string remarks = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("CandidateTransferRequestByPartner", Request);

                int result = objRepo.CandidateTransferRequestByPartner(cid, toThId, claims[5].Value, remarks, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CandidateTransferRequestByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("CandidateTransferRequestByPartner", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateTransferRequestByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "CandidateTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ApprRejectCandidateTransferReqByPartner")]
        [HttpPost]
        public IHttpActionResult ApprRejectCandidateTransferReqByPartner(int cid, string transferStatus, string remark = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("ApprRejectCandidateTransferReqByPartner", Request);

                int result = objRepo.ApprRejectCandidateTransferReqByPartner(cid, transferStatus, remark, claims[5].Value, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApprRejectCandidateTransferReqByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == 2)
                {
                     GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(cid, claims[5].Value, 1);
                    return Ok(Message);
                    logger.LogResponseAsync("ApprRejectCandidateTransferReqByPartner", "200 OK");
                    return Ok(Message);
                }
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApprRejectCandidateTransferReqByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "AddUpdatePartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("UnattendedCandidateTransferRequestByPartner")]
        [HttpPost]
        public IHttpActionResult UnattendedCandidateTransferRequest(int id, string toThId, string remarks = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("UnattendedCandidateTransferRequestByPartner", Request);

                int result = objRepo.UnattendedCandidateTransferRequestByPartner(id, toThId, claims[5].Value, remarks, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UnattendedCandidateTransferRequestByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("UnattendedCandidateTransferRequestByPartner", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedCandidateTransferRequestByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "CandidateTransferRequest");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("ApprRejectUnattendedCandidateTransferReqByPartner")]
        [HttpPost]
        public IHttpActionResult ApprRejectUnattendedCandidateTransferReqByPartner(int id, string transferStatus, string remark = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("ApprRejectUnattendedCandidateTransferReqByPartner", Request);

                int result = objRepo.UnattendedApprRejectCandidateTransferReqByPartner(id, transferStatus, remark, claims[5].Value, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApprRejectUnattendedCandidateTransferReqByPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == 2)
                {
                     GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 0);
                    return Ok(Message);
                    logger.LogResponseAsync("ApprRejectUnattendedCandidateTransferReqByPartner", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApprRejectUnattendedCandidateTransferReqByPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "AddUpdatePartnerDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("UnattendedCandidateTransfer")]
        [HttpPost]
        public IHttpActionResult UnattendedCandidateTransfer(int id, string toThId, string remarks = null)
        {
            try
            {
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("UnattendedCandidateTransfer", Request);

                int result = objRepo.UnattendedCandidateTransfer(id, toThId, claims[5].Value, remarks, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UnattendedCandidateTransfer", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == -2)
                {
                    logger.LogResponseAsync("UnattendedCandidateTransfer", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedCandidateTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "UnattendedCandidateTransfer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("UpdatePartnerTHIDAssignStatus")]
        [HttpPost]
        public IHttpActionResult UpdatePartnerTHIDAssignStatus(int AssignID, string Action, string Remarks = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; //New Employee ID
                string Message = string.Empty;

                logger.LogRequestAsync("UpdatePartnerTHIDAssignStatus", Request);

                int result = objRepo.UpdatePartnerTHIDAssignStatus(AssignID, Action, EmpID, ref Message, Remarks);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdatePartnerTHIDAssignStatus", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("UpdatePartnerTHIDAssignStatus", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdatePartnerTHIDAssignStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "UpdatePartnerTHIDAssignStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ChangeApprover")]
        [HttpPost]
        public IHttpActionResult ChangeApprover(int AssignID, string TAGLeadID, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; //New Employee ID
                string Message = string.Empty;

                logger.LogRequestAsync("ChangeApprover", Request);

                int result = objRepo.ChangeApprover(AssignID, TAGLeadID, Remarks, EmpID, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ChangeApprover", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("ChangeApprover", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangeApprover", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ChangeApprover");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("GetPartnerTalentContractType")]
        [HttpGet]
        public IHttpActionResult GetPartnerTalentContractType(string thid, string partnerId)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                logger.LogRequestAsync("GetPartnerTalentContractType", Request);

                var result = objRepo.GetPartnerTalentContractType(claims[5].Value, thid, partnerId);

                logger.LogResponseAsync("GetPartnerTalentContractType", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPartnerTalentContractType", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "GetPartnerTalentContractType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ChangeCandidateProfileSource")]
        [HttpPost]
        public IHttpActionResult ChangeCandidateProfileSource(int profileUniqid, int profileSourceId, string Remarks = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                string EmpID = claims[5].Value; //New Employee ID
                string Message = string.Empty;

                logger.LogRequestAsync("ChangeCandidateProfileSource", Request);

                int result = objRepo.ChangeCandidateProfileSource(profileUniqid, profileSourceId, EmpID, ref Message, Remarks);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ChangeCandidateProfileSource", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("ChangeCandidateProfileSource", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ChangeCandidateProfileSource", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ChangeCandidateProfileSource");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("ExportToExcelPartnerDetailsReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelPartnerDetailsReport([FromBody] PartnerDetailFilter obj)
        {
             obj.page = 1;
             obj.pageSize = 100000;
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Partner Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contact Number</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Location</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract Availability</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract Start Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract End Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Tag Head Approver</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Remarks</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</font></b></td>");

            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.getAllPartnerList(obj, claims[5].Value, out result);
            if (result == -9)
            {
                return null;
            }
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PartnerName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContactNo"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Email"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["City"].ToString()+"("+ dr["Country"].ToString()+ ")" + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractTypeMultiple"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractAvailabilityMultiple"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractStartDate"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractEndDate"].ToString() + "</font></td>");
                    //if (dr["ContractAvailability"].ToString() == "Y")
                    //{
                    //    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "Yes" + "</font></td>");
                    //}
                    //else if (dr["ContractAvailability"].ToString() == "N")
                    //{
                    //    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "No" + "</font></td>");
                    //}
                    //else
                    //{
                    //    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");
                    //}

                    //if (dr["StartDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    //else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["StartDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    //if (dr["EndDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    //else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["EndDate"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TagheadApproverName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remarks"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PartnerStatusName"].ToString() + "</font></td>");
                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "PartnerDetailsList.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ExportToExcelPartnerTalentReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelPartnerTalentReport([FromBody] PartnerTalentFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Partner Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Practice</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Global Delivery Lead</font></b></td>");
            //str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Assigned By</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Assigned On</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reason for Assign</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Contract Type(s)</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Remarks</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Status</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approval Status</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Approver</ font></b></td>");
            str.Append("</tr>");
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.getListOfPartnerTalentID(obj, claims[5].Value, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["talent_id"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PartnerName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Practice"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["DeliveryUnit"].ToString() + "</font></td>");
                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryrecruiterEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["SecondaryRecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["secondaryrecruiterEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["addedByName"].ToString() + "</font></td>");
                    if (dr["AssignedOn"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["AssignedOn"]).ToString("dd MMM yyyy") + "</font></td>"); }
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Reason"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ContractType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Remarks"].ToString() + "</font></td>");
                    if (dr["Status"].ToString() == "1")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "Assigned" + "</font></td>");
                    }
                    else if (dr["Status"].ToString() == "0")
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "Not Assigned" + "</font></td>");
                    }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ApprovalStatusLabel"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ApproverName"].ToString() + "</font></td>");


                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "ProfilesListSharedByPartner.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getPendingWithMePartnerTalentId")]
        [HttpGet]
        public IHttpActionResult getPendingWithMePartnerTalentId()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getPendingWithMePartnerTalentId", Request);

                int result;
                var data = objRepo.getPendingWithMePartnerTalentId(claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPendingWithMePartnerTalentId", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getPendingWithMePartnerTalentId", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPendingWithMePartnerTalentId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPendingWithMePartnerTalentId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ApproveOrRejectPartnerTHID")]
        [HttpPost]
        public IHttpActionResult ApproveOrRejectPartnerTHID(string AssignID, string Action, string Remarks = null)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            logger.LogRequestAsync("ApproveOrRejectPartnerTHID", Request);

            try
            {
                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.ApproveOrRejectPartnerTHID(AssignID, Action, EmpID, ref Message, Remarks);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveOrRejectPartnerTHID", EmpID);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("ApproveOrRejectPartnerTHID", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("ApproveOrRejectPartnerTHID", "400 BadRequest");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApproveOrRejectPartnerTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ApproveOrRejectPartnerTHID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getActivePartnerList")]
        [HttpPost]
        public IHttpActionResult getActivePartnerList([FromBody] ActivePartnerListFilter obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            logger.LogRequestAsync("getActivePartnerList", Request);

            int result;
            try
            {
                var data = objRepo.getActivePartnerList(claims[5].Value, obj, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getActivePartnerList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getActivePartnerList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getActivePartnerList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getActivePartnerList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        public IHttpActionResult getPartnerDetailsById(int partnerId)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            int result;
            try
            {
                var data = objRepo.getPartnerDetailsById(claims[5].Value, partnerId, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getActivePartnerList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                return Ok(data);
            }
            catch (Exception ex)
            {
                
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getPartnerDetailsById");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("getAllOpenRequisitionForAssignToPartner")]
        [HttpPost]
        public IHttpActionResult getAllOpenRequisitionForAssignToPartner([FromBody] AssignToPartnerGetModel paramBody)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getAllOpenRequisitionForAssignToPartner", Request);

                int result;
                var data = objRepo.getAllOpenRequisitionForAssignToPartner(paramBody, claims[5].Value, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllOpenRequisitionForAssignToPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllOpenRequisitionForAssignToPartner", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllOpenRequisitionForAssignToPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getAllOpenRequisitionForAssignToPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("GetPartnerTagHeadApproverByLoc")]
        [HttpGet]
        public IHttpActionResult GetPartnerTagHeadApproverByLoc(int locId = 0)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetPartnerTagHeadApproverByLoc", Request);

                int result;
                var data = objRepo.GetPartnerTagHeadApproverByLoc(claims[5].Value, out result, locId);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPartnerTagHeadApproverByLoc", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetPartnerTagHeadApproverByLoc", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPartnerTagHeadApproverByLoc", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetPartnerTagHeadApproverByLoc");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("GetPartnerTagLeadApproverByLoc")]
        [HttpGet]
        public IHttpActionResult GetPartnerTagLeadApproverByLoc(int locId = 0)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetPartnerTagLeadApproverByLoc", Request);

                int result;
                var data = objRepo.GetPartnerTagLeadApproverByLoc(claims[5].Value, out result, locId);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPartnerTagLeadApproverByLoc", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetPartnerTagLeadApproverByLoc", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPartnerTagLeadApproverByLoc", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetPartnerTagLeadApproverByLoc");
                return BadRequest("There is some error! Try again later");
            }
        }



        [UserWiseAuthorizeAttribute("E")]
        [Route("GetPartnerDashboard")]
        [HttpGet]
        public IHttpActionResult GetPartnerDashboard(int partnerId)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetPartnerDashboard", Request);

                int result;
                var data = objRepo.GetPartnerDashboard(partnerId, out result);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPartnerDashboard", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetPartnerDashboard", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPartnerDashboard", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetPartnerDashboard");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("E")]
        [Route("GetTaletentDeatil")]
        [HttpGet]
        public IHttpActionResult GetTaletentDeatil(int page, int pageSize, int partnerId, char Action, string search = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetTaletentDeatil", Request);

                int result;
                var data = objRepo.GetTaletentDeatil(page, pageSize, partnerId, Action, out result, search);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetTaletentDeatil", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetTaletentDeatil", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTaletentDeatil", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetTaletentDeatil");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("GetIsAccountSameForPartnerTransfer")]
        [HttpGet]
        public IHttpActionResult GetIsAccountSameForPartnerTransfer(int cid, int TransferTHID)
        {
            try
            {
                logger.LogRequestAsync("GetIsAccountSameForPartnerTransfer", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIsAccountSameForPartnerTransfer(cid, TransferTHID, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPartnerTagLeadApproverByLoc", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("GetIsAccountSameForPartnerTransfer", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIsAccountSameForPartnerTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetIsAccountSameForPartnerTransfer");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("GetRecruiterSameForPartnerTransfer")]
        [HttpGet]
        public IHttpActionResult GetRecruiterSameForPartnerTransfer(int cid)
        {
            try
            {
                logger.LogRequestAsync("GetRecruiterSameForPartnerTransfer", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetRecruiterSameForPartnerTransfer(cid, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPartnerTagLeadApproverByLoc", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                logger.LogResponseAsync("GetRecruiterSameForPartnerTransfer", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRecruiterSameForPartnerTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "GetRecruiterSameForPartnerTransfer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("transferPratnerCandidateByTalentId")]
        [HttpPost]
        public IHttpActionResult transferPratnerCandidateByTalentId()
        {
            try
            {
                logger.LogRequestAsync("transferPratnerCandidateByTalentId", Request);

                TransferProfile fb = new TransferProfile();
                var frm = HttpContext.Current.Request.Form;

                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.updateBy = frm["updateBy"];
                fb.remarks = frm["remarks"];
                fb.thid = frm["thid"];
                fb.Gender = Convert.ToInt32(frm["Gender"] == null || frm["Gender"].ToString() == "" ? "0" : frm["Gender"]);
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                fb.gradeId = Convert.ToInt32(frm["gradeId"] == null || frm["gradeId"].ToString() == "" ? "0" : frm["gradeId"]);
                fb.EmpUnitId = Convert.ToInt32(frm["EmpUnitId"] == null || frm["EmpUnitId"].ToString() == "" ? "0" : frm["EmpUnitId"]);
                fb.gradeBand = frm["gradeBand"];
                fb.CubeID = Convert.ToInt32(frm["CubeID"] == null || frm["CubeID"].ToString() == "" ? "0" : frm["CubeID"]);
                fb.CubeClusterID = Convert.ToInt32(frm["CubeClusterID"] == null || frm["CubeClusterID"].ToString() == "" ? "0" : frm["CubeClusterID"]);
                fb.CubeRoleID = Convert.ToInt32(frm["CubeRoleID"] == null || frm["CubeRoleID"].ToString() == "" ? "0" : frm["CubeRoleID"]);
                fb.Action = Convert.ToChar(frm["Action"]);

                string Message = string.Empty;
                int result = objRepo.transferPratnerCandidateByTalentId(fb, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "transferPratnerCandidateByTalentId", fb.updateBy);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0 && fb.cid > 0)
                {
                     GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(fb.cid, fb.updateBy, 1);
                    logger.LogResponseAsync("transferPratnerCandidateByTalentId", "200 OK");
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
                logger.LogErrorAsync("transferPratnerCandidateByTalentId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "transferPratnerCandidateByTalentId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ApprovePartnerProfileTransfer")]
        [HttpPost]
        public IHttpActionResult ApprovePartnerProfileTransfer(int id, string transferStatus, string remark = null)
        {
            try
            {
                logger.LogRequestAsync("ApprovePartnerProfileTransfer", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.ApprovePartnerProfileTransfer(id, transferStatus, remark, claims[5].Value, ref Message);

                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApprovePartnerProfileTransfer", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == 2)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 1);
                    logger.LogResponseAsync("ApprovePartnerProfileTransfer", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApprovePartnerProfileTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ApprovePartnerProfileTransfer");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("UnattendedCandidateTransferPartnerProfile")]
        [HttpPost]
        public IHttpActionResult UnattendedCandidateTransferPartnerProfile(int id, string toThId, char Action, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("UnattendedCandidateTransferPartnerProfile", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.UnattendedCandidateTransferPartnerProfile(id, toThId, claims[5].Value, remarks, Action, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UnattendedCandidateTransferPartnerProfile", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == -2)
                {
                      GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 0);
                   
                    logger.LogResponseAsync("UnattendedCandidateTransferPartnerProfile", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedCandidateTransferPartnerProfile", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "UnattendedCandidateTransferPartnerProfile");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("ApproveUnAttendentTransferPartnerProfile")]
        [HttpPost]
        public IHttpActionResult ApproveUnAttendentTransferPartnerProfile(int id, string transferStatus, string remark = null)
        {
            try
            {
                logger.LogRequestAsync("ApproveUnAttendentTransferPartnerProfile", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.ApproveUnAttendentTransferPartnerProfile(id, transferStatus, remark, claims[5].Value, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApproveUnAttendentTransferPartnerProfile", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == 2)
                {
                      GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value,0);
                    logger.LogResponseAsync("ApproveUnAttendentTransferPartnerProfile", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApproveUnAttendentTransferPartnerProfile", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "ApproveUnAttendentTransferPartnerProfile");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("TransferAttendedProfileSourceforPartner")]
        [HttpPost]
        public IHttpActionResult TransferAttendedProfileSourceforPartner()
        {
            try
            {
                logger.LogRequestAsync("TransferAttendedProfileSourceforPartner", Request);

                PartnerProfileSourceTransfer fb = new PartnerProfileSourceTransfer();
                var frm = HttpContext.Current.Request.Form;
                fb.ProfileSorceId = Convert.ToInt32(frm["ProfileSorceId"] == null || frm["ProfileSorceId"].ToString() == "" ? "0" : frm["ProfileSorceId"]);
                fb.IsTHIDPresent = Convert.ToChar(frm["IsTHIDPresent"]);
                fb.cid = Convert.ToInt32(frm["cid"]);
                fb.updateBy = frm["updateBy"];
                fb.remarks = frm["remarks"];

                if (fb.IsTHIDPresent == 'Y')
                {
                    fb.thid = frm["thid"];
                    fb.gradeId = Convert.ToInt32(frm["gradeId"] == null || frm["gradeId"].ToString() == "" ? "0" : frm["gradeId"]);
                    fb.EmpUnitId = Convert.ToInt32(frm["EmpUnitId"] == null || frm["EmpUnitId"].ToString() == "" ? "0" : frm["EmpUnitId"]);
                    fb.gradeBand = frm["gradeBand"];
                    fb.CubeID = Convert.ToInt32(frm["CubeID"] == null || frm["CubeID"].ToString() == "" ? "0" : frm["CubeID"]);
                    fb.CubeClusterID = Convert.ToInt32(frm["CubeClusterID"] == null || frm["CubeClusterID"].ToString() == "" ? "0" : frm["CubeClusterID"]);
                    fb.CubeRoleID = Convert.ToInt32(frm["CubeRoleID"] == null || frm["CubeRoleID"].ToString() == "" ? "0" : frm["CubeRoleID"]);
                    fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                }

                string Message = string.Empty;
                int result = objRepo.TransferAttendedProfileSourceforPartner(fb, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "TransferAttendedProfileSourceforPartner", fb.updateBy);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0 && fb.cid > 0)
                {
                        GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(fb.cid, fb.updateBy, 1);
                    logger.LogResponseAsync("TransferAttendedProfileSourceforPartner", "200 OK");
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
                logger.LogErrorAsync("TransferAttendedProfileSourceforPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "TransferAttendedProfileSourceforPartner");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("UnattendedProfileSourceTransfer")]
        [HttpPost]
        public IHttpActionResult UnattendedProfileSourceTransfer(int id, char IsThidPresnet, int ProfileSourceId, string toThId = null, string remarks = null)
        {
            try
            {
                logger.LogRequestAsync("UnattendedProfileSourceTransfer", Request);

                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.UnattendedProfileSourceTransfer(id, toThId, IsThidPresnet, ProfileSourceId, "115576", remarks, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UnattendedProfileSourceTransfer", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1 || result == -2)
                {
                    GlobalFunctions GlobalFunctions = new GlobalFunctions();
                    System.Threading.Tasks.Task<string> ResumeParse = GlobalFunctions.ResumeCompatibilityRatingUpdate(id, claims[5].Value, 0);
                    logger.LogResponseAsync("UnattendedProfileSourceTransfer", "200 OK");
                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnattendedProfileSourceTransfer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "UnattendedProfileSourceTransfer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("candidateStatusUpdateByRecuiter")]
        [HttpPost]
        public IHttpActionResult candidateStatusUpdateByRecuiter(string partnerId, string id, int status, string Remarks)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("candidateStatusUpdateByRecuiter", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.candidateStatusUpdateByRecuiter(partnerId, id, status, Remarks, EmpID, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "candidateStatusUpdateByRecuiter", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("candidateStatusUpdateByRecuiter", "200 OK");
                    return Ok(Message);
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
                logger.LogErrorAsync("candidateStatusUpdateByRecuiter", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "candidateStatusUpdateByRecuiter");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getAllContractbyPartner")]
        [HttpGet]
        public IHttpActionResult getAllContractbyPartner(int partnerId, int isForApproval = 0)
        {
            try
            {
                logger.LogRequestAsync("getAllContractbyPartner", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getAllContractbyPartner(partnerId, isForApproval, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllContractbyPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllContractbyPartner", "200 OK");
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
                logger.LogErrorAsync("getAllContractbyPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getAllContractbyPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdatepartnerContractDetail")]
        [HttpPost]
        public IHttpActionResult UpdatepartnerContractDetail(UpdateContractDetailModel obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("UpdatepartnerContractDetail", Request);

                string EmpID = "100037";
                string Message = string.Empty;
                int result = objRepo.UpdatepartnerContractDetail(obj, EmpID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdatepartnerContractDetail", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("UpdatepartnerContractDetail", "200 OK");
                    return Ok("Detail Updated");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdatepartnerContractDetail", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "UpdatepartnerContractDetail");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("AddNewContractToPartner")]
        [HttpPost]
        public IHttpActionResult AddNewContractToPartner(AddnewContractDetailModel obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("AddNewContractToPartner", Request);

                string EmpID = claims[5].Value;
                string Message = string.Empty;
                int result = objRepo.AddNewContractToPartner(obj, EmpID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddNewContractToPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("AddNewContractToPartner", "200 OK");
                    return Ok("Contract Added");
                }
                else if (result == -1)
                    return BadRequest("Contract type already exists");
                else if (result == -2)
                    return BadRequest("Database error! Please try again later");
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddNewContractToPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "AddNewContractToPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("DeleteContractDetail")]
        [HttpPost]
        public IHttpActionResult DeleteContractDetail(int ContractId)
        {
            try
            {
                logger.LogRequestAsync("DeleteContractDetail", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.DeleteContractDetail(ContractId, claims[5].Value);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "DeleteContractDetail", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("DeleteContractDetail", "200 OK");
                    return Ok("Contract Deleted Successfully");
                }
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DeleteContractDetail", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "DeletePanelSlot");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("getAllPartnerContractList")]
        [HttpPost]
        public IHttpActionResult getAllPartnerContractList([FromBody] PartnerContratDetailFilter obj)
        {
            try
            {
                logger.LogRequestAsync("getAllPartnerContractList", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getAllPartnerContractList(obj, claims[5].Value, out result);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getAllPartnerContractList", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                logger.LogResponseAsync("getAllPartnerContractList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getAllPartnerContractList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "getAllPartnerContractList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("MultiApproveRejectContractDetail")]
        [HttpPost]
        public IHttpActionResult MultiApproveRejectContractDetail(string ids, char Action)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("MultiApproveRejectContractDetail", Request);

                string EmpID = claims[5].Value; // New Employee ID
                string Message = string.Empty;
                int result = objRepo.MultiApproveRejectContractDetail(ids, EmpID, Action, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "MultiApproveRejectContractDetail", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("MultiApproveRejectContractDetail", "200 OK");
                    return Ok(Message);
                }
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("MultiApproveRejectContractDetail", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "updatePartnersStatus");
                return BadRequest("There is some error! Try again later");
            }
        }


        [UserWiseAuthorizeAttribute("I")]
        [Route("ResendContractforApproval")]
        [HttpPost]
        public IHttpActionResult ResendContractforApproval(ContractDetail obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("ResendContractforApproval", Request);

                string EmpID = claims[5].Value;
                string Message = string.Empty;
                int result = objRepo.ResendContractforApproval(obj, EmpID);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ResendContractforApproval", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result > 0)
                {
                    logger.LogResponseAsync("ResendContractforApproval", "200 OK");
                    return Ok("Detail Sent");
                }
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendContractforApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "ResendContractforApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [UserWiseAuthorizeAttribute("I")]
        [Route("SingleApproveRejectContractofPartner")]
        [HttpPost]
        public IHttpActionResult SingleApproveRejectContractofPartner(SingleApprovRejectContractDetailModel obj)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            try
            {
                logger.LogRequestAsync("SingleApproveRejectContractofPartner", Request);

                string EmpID = claims[5].Value;
                string Message = string.Empty;
                int result = objRepo.SingleApproveRejectContractofPartner(obj, EmpID, ref Message);
                if (result == -9)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "SingleApproveRejectContractofPartner", claims[5].Value);
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                if (result == 1)
                {
                    logger.LogResponseAsync("SingleApproveRejectContractofPartner", "200 OK");
                    return Ok(Message);
                }
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SingleApproveRejectContractofPartner", ex);
                ExceptionLogging.SendExcepToDB(ex, "Partner", "SingleApproveRejectContractofPartner");
                return BadRequest("There is some error! Try again later");
            }
        }

    }
}