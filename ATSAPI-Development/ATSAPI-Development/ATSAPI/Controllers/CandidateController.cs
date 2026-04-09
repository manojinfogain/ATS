
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Security.Claims;
using System.Linq;
using System.IO;
using System.Text;
using System.Data;
using Org.BouncyCastle.Ocsp;
using System.Net.Http.Headers;
using TimeZoneConverter;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("P")]
    //[ExternalAuthorize]
    [RoutePrefix("api/Candidate")]
    public class CandidateController : ApiController
    {
        CandidateRepository objRepo = new CandidateRepository();
        USOfferRepository objRepoUs = new USOfferRepository();
        USOfferController USOfferCont = new USOfferController();
        OfferRepository objRepoInd = new OfferRepository();
        OfferController IndOfferCont = new OfferController();
        OfferG5AboveController IndOfferContG5 = new OfferG5AboveController();
        OfferG5AboveRepository objRepoG5 = new OfferG5AboveRepository();
        CommonRepository objRepoCommon = new CommonRepository();
        OnboardController onboardcont= new OnboardController();
        CommonController cm = new CommonController();
        Common common = new Common();
        Logger logger = new Logger();

        public string GenerateOTP()
        {
            //var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

        [Route("SendOTPtoCandidate")]
        [HttpPost]
        public IHttpActionResult SendOTPtoCandidate(int cid)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                var claimsIdentity = (ClaimsIdentity)User.Identity;
                var claims = claimsIdentity.Claims.ToList();
                string otp = GenerateOTP().ToString();
                string Message = string.Empty;
                int result = objRepo.SendOTPtoCandidate(cid, otp);

                logger.LogRequestAsync("SendOTPtoCandidate", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("SendOTPtoCandidate", "200 OK");
                    return Ok("OTP has been shared successfully");
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("SendOTPtoCandidate", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("SendOTPtoCandidate", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendOTPtoCandidate", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendOTPtoCandidate", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "SendOTPtoCandidate");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateSubmitOtp")]
        [HttpPost]
        public IHttpActionResult CandidateSubmitOtp(int cid, string otp, int status, string joiningDate)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.CandidateSubmitOtp(cid, otp, status, joiningDate, ref Message);

                logger.LogRequestAsync("CandidateSubmitOtp", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("CandidateSubmitOtp", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CandidateSubmitOtp", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateSubmitOtp", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateSubmitOtp", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "CandidateSubmitOtp");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateDetails(int cid)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getCandidateDetails(cid);

                logger.LogRequestAsync("getCandidateDetails", Request);
                logger.LogResponseAsync("getCandidateDetails", "200 OK");

                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "getCandidateDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOfferTemplates")]
        [HttpGet]
        public IHttpActionResult GetOfferTemplates(string param)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetOfferTemplates(param);

                logger.LogRequestAsync("GetOfferTemplates", Request);
                logger.LogResponseAsync("GetOfferTemplates", "200 OK");

                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOfferTemplates", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "GetOfferTemplates");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateDetailsByParam")]
        [HttpGet]
        public IHttpActionResult getCandidateDetailsByParam(string param)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var originHeader = HttpContext.Current.Request.Headers["Origin"];
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string encodedValue1 = System.Net.WebUtility.UrlDecode(param);
                string encodedValue = System.Net.WebUtility.UrlEncode(param);
                string candidateId = DecodeBase64(param);
                var data = objRepo.getCandidateDetailsByParam(param);

                logger.LogRequestAsync("getCandidateDetailsByParam", Request);
                logger.LogResponseAsync("getCandidateDetailsByParam", "200 OK");

                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateDetailsByParam", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "getCandidateDetailsByParam");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("SendOTPtoCandidateUS")]
        [HttpPost]
        public IHttpActionResult SendOTPtoCandidateUS(string param)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string otp = GenerateOTP().ToString();
                string Message = string.Empty;
                int result = objRepo.SendOTPtoCandidate(param, otp, ref Message);

                logger.LogRequestAsync("SendOTPtoCandidateUS", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("SendOTPtoCandidateUS", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("SendOTPtoCandidateUS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("SendOTPtoCandidateUS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("SendOTPtoCandidateUS", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "SendOTPtoCandidateUS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateSubmitOtpUS")]
        [HttpPost]
        public IHttpActionResult CandidateSubmitOtpUs(string param, string otp)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                string AuthKey = string.Empty;
                int result = objRepo.CandidateSubmitOtpUS(param, otp, ref Message, ref AuthKey);

                logger.LogRequestAsync("CandidateSubmitOtpUs", Request);

                if (result == 1)
                {
                    var responseObj1 = new { AuthKey = AuthKey, Message = Message };
                    logger.LogResponseAsync("CandidateSubmitOtpUs", "200 OK");
                    return Ok(responseObj1);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CandidateSubmitOtpUs", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateSubmitOtpUs", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateSubmitOtpUs", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "CandidateSubmitOtpUs");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateSubmitOtpIndia")]
        [HttpPost]
        public IHttpActionResult CandidateSubmitOtpIndia(string param, string otp)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }

                string Message = string.Empty;
                string AuthKey = string.Empty;
                int result = objRepo.CandidateSubmitOtpIndia(param, otp, ref Message, ref AuthKey);

                logger.LogRequestAsync("CandidateSubmitOtpIndia", Request);

                if (result == 1)
                {
                    var responseObj1 = new { AuthKey = AuthKey, Message = Message };
                    logger.LogResponseAsync("CandidateSubmitOtpIndia", "200 OK");
                    return Ok(responseObj1);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CandidateSubmitOtpIndia", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateSubmitOtpIndia", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateSubmitOtpIndia", ex);
                ExceptionLogging.SendExcepToDB(ex, "candidate", "CandidateSubmitOtpIndia");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateSubmitOfferAcceptUS")]
        [HttpPost]
        public IHttpActionResult CandidateSubmitOfferAcceptUS(offeracceptsignatureSave model)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                int result = 0;
                string Message = string.Empty;
                responseofferacceptsignatureSave responseSignatureCandidate = new responseofferacceptsignatureSave();
                if (model.offersignFileBase64 != null && model.AgreementsignFileBase64 != null)
                {
                    string candidateId = DecodeBase64(model.param);
                    string OfferSignaturePath = ConfigurationManager.AppSettings["OfferSignaturePath"] + candidateId;

                    model.offersignFilePath = OfferSignaturePath + "\\" + common.GetFileWithAdditionalExtention(model.offersignFileName);
                    model.offersignFileName = common.GetFileWithAdditionalExtention(model.offersignFileName);

                    string AgreementSignaturePath = ConfigurationManager.AppSettings["AgreementSignaturePath"] + candidateId;
                    model.AgreementsignFilePath = AgreementSignaturePath + "\\" + common.GetFileWithAdditionalExtention(model.AgreementsignFileName);
                    model.AgreementsignFileName = common.GetFileWithAdditionalExtention(model.AgreementsignFileName);
                    model.OfferAcceptTimeZone = TZConvert.IanaToWindows(model.OfferAcceptTimeZone);
                    model.PriorCompDateAgreementTimeZone = TZConvert.IanaToWindows(model.PriorCompDateAgreementTimeZone);
                    model.ModifiedOnTimeZone = TZConvert.IanaToWindows(model.ModifiedOnTimeZone);
                    result = objRepo.CandidateFinalSubmitUS(model, ref Message);

                    if (result == 1)
                    {
                        string fileSavePath = System.IO.Path.Combine(OfferSignaturePath, model.offersignFileName);
                        if (!(Directory.Exists(OfferSignaturePath)))
                        {
                            Directory.CreateDirectory(OfferSignaturePath);
                        }
                        if (File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        int encryptionResult = common.EncryptFile(model.offersignFileBase64, fileSavePath);

                        if (encryptionResult != 1)
                        {
                            return BadRequest("Error encrypting the file.");
                        }

                        string fileSavePath1 = System.IO.Path.Combine(AgreementSignaturePath, model.AgreementsignFileName);
                        if (!(Directory.Exists(AgreementSignaturePath)))
                        {
                            Directory.CreateDirectory(AgreementSignaturePath);
                        }
                        if (File.Exists(fileSavePath1))
                        {
                            File.Delete(fileSavePath1);
                        }
                        int encryptionResult1 = common.EncryptFile(model.AgreementsignFileBase64, fileSavePath1);

                        if (encryptionResult != 1)
                        {
                            return BadRequest("Error encrypting the file.");
                        }

                        responseSignatureCandidate.offersignFilePath = model.offersignFilePath;
                        responseSignatureCandidate.offersignFileName = model.offersignFileName;
                        responseSignatureCandidate.AgreementsignFilePath = model.AgreementsignFilePath;
                        responseSignatureCandidate.AgreementsignFileName = model.AgreementsignFileName;
                        responseSignatureCandidate.message = Message;

                        System.Threading.Tasks.Task<string> offerGen = GenrateOfferAgr(DecodeBase64(model.param));
                    }
                }
                else
                {
                    return BadRequest("Attachment(s) not found.");
                }

                logger.LogRequestAsync("CandidateSubmitOfferAcceptUS", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptUS", "200 OK");
                    return Ok(responseSignatureCandidate);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptUS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptUS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateSubmitOfferAcceptUS", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "CandidateSubmitOfferAcceptUS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateSubmitOfferAcceptIndia")]
        [HttpPost]
        public IHttpActionResult CandidateSubmitOfferAcceptIndia(offeracceptsignatureSaveInd model)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                int result = 0;
                string Message = string.Empty;
                responseofferacceptsignatureSave responseSignatureCandidate = new responseofferacceptsignatureSave();
                if (model.offersignFileBase64 != null)
                {
                    string candidateId = DecodeBase64(model.param);
                    string OfferSignaturePath = ConfigurationManager.AppSettings["OfferSignaturePath"] + candidateId;
                    model.offersignFileName = common.GetFileWithAdditionalExtention(model.offersignFileName);

                    model.offersignFilePath = OfferSignaturePath + "\\" + model.offersignFileName;

                    string AgreementSignaturePath = ConfigurationManager.AppSettings["AgreementSignaturePath"] + candidateId;
                    result = objRepo.CandidateFinalSubmitIndia(model, ref Message);

                    if (result == 1)
                    {
                        string offersignFileName = model.offersignFileName;
                        string fileSavePath = System.IO.Path.Combine(OfferSignaturePath, offersignFileName);
                        if (!(Directory.Exists(OfferSignaturePath)))
                        {
                            Directory.CreateDirectory(OfferSignaturePath);
                        }

                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(model.offersignFileBase64, fileSavePath);

                        if (encryptionResult != 1)
                        {
                            return BadRequest("Error encrypting the file.");
                        }

                        responseSignatureCandidate.offersignFilePath = model.offersignFilePath;
                        responseSignatureCandidate.offersignFileName = model.offersignFileName;
                        responseSignatureCandidate.message = Message;

                        System.Threading.Tasks.Task<string> offerGen = GenrateOfferIndiaLoc(DecodeBase64(model.param));
                        int mailSentResult = onboardcont.SendJoiningItineraryToCandidateMailer(Convert.ToInt32(candidateId));
                    }
                }
                else
                {
                    return BadRequest("Attachment(s) not found.");
                }

                logger.LogRequestAsync("CandidateSubmitOfferAcceptIndia", Request);

                if (result == 1)
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptIndia", "200 OK");
                    return Ok(responseSignatureCandidate);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptIndia", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("CandidateSubmitOfferAcceptIndia", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CandidateSubmitOfferAcceptIndia", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate Offer", "CandidateSubmitOfferAcceptIndia");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("OfferAcceptCandidateManualIndia")]
        [HttpPost]
        public IHttpActionResult OfferAcceptCandidateManualIndia()
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return BadRequest(AppConstants.UnauthorizedMessage);
                }
                int result = 0;
                string Message = string.Empty;
                offeracceptsignatureSaveInd model = new offeracceptsignatureSaveInd();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                string candidateId = DecodeBase64(frm["param"]);

                model.param = frm["param"];
                model.JoiningDate = frm["JoiningDate"];
                model.AuthKey = frm["AuthKey"];

                result = objRepo.CandidateFinalSubmitIndia(model, ref Message);
                DataSet ds = objRepoCommon.GetOfferedCandidateBasicDetails(Convert.ToInt32(candidateId), candidateId);
                String CandidateName = String.Empty;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
                }

                if (HttpContext.Current.Request.Files.Count > 0 && CandidateName != "")
                {
                    var offerLetterFile = HttpContext.Current.Request.Files[0];
                    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + candidateId + "\\";
                    string filedetails = "InfogainOffer_" + common.GetFileWithAdditionalExtention(CandidateName + Path.GetExtension(offerLetterFile.FileName).ToString());
                    if (!(Directory.Exists(tempPath)))
                    {
                        Directory.CreateDirectory(tempPath);
                    }
                    string fileSavePath = Path.Combine(tempPath, filedetails);

                    if (System.IO.File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    byte[] fileBytes;
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        offerLetterFile.InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    // Encrypt the file before saving
                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        return BadRequest("Error encrypting the file.");
                    }

                    logger.LogRequestAsync("OfferAcceptCandidateManualIndia", Request);
                    logger.LogResponseAsync("OfferAcceptCandidateManualIndia", "200 OK");

                    return Ok(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("OfferAcceptCandidateManualIndia", ex);
                ExceptionLogging.SendExcepToDB(ex, "Candidate", "CandidateSubmitOfferAcceptIndiaManual");
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
        [NonAction]
        public string DecodeBase64(string value)
        {
            var valueBytes = System.Convert.FromBase64String(value);
            return Encoding.UTF8.GetString(valueBytes);
        }

        [NonAction]
        public async System.Threading.Tasks.Task<string> GenrateOfferAgr(string cid)
        {
            try
            {

                OfferPDFModelUS model = new OfferPDFModelUS();
              //  string decodedString = Encoding.UTF8.GetString(Convert.FromBase64String(param));
                model.cid = Convert.ToInt32(cid);
                model.IsOfferGenExternal = 'Y';
                int result1;
                DataSet ds = objRepoUs.GetCandidateInformationForPDF(model, cid.ToString(), out result1);
                var authResult = cm.HandleAuthorizationResult(result1);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    int result = USOfferCont.GeneratePDFUS(ds, model.cid.ToString());
                    if (result == 1)
                    {
                        USOfferCont.GenerateEmployeeAgreeMent(ds, model.cid.ToString());
                        //Send mailer to candidate
                        objRepo.SendofferToCandidate(model.cid);
                    }
                    else
                    {
                    }
                }

                return "";

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GenrateOfferAgrCandidate");
                throw ex;
            }
        }

        [NonAction]
        public async System.Threading.Tasks.Task<string> GenrateOfferIndiaLoc(string cid)
        {
            try
            {

                int result = 0;
                DataSet ds1 = objRepoCommon.GetOfferedCandidateBasicDetails(Convert.ToInt32(cid), cid);

                if(ds1.Tables[0].Rows[0]["IsRenuTeam"].ToString() == "Y")
                {

                    PdfModelG5Above model = new PdfModelG5Above();
                    //  string decodedString = Encoding.UTF8.GetString(Convert.FromBase64String(param));
                    model.cid = Convert.ToInt32(cid);
                    model.IsOfferGenExternal = 'Y';
                    DataSet ds = objRepoG5.GetCandidateInformationForPDF(model, cid.ToString());
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        IndOfferContG5.GeneratePDFNew(ds, model.cid.ToString(), 'Y');
                        if (result == 1)
                        {
                            System.Threading.Tasks.Task<int> copyOffer = IndOfferCont.CopyOfferToMurcury(model.cid.ToString(), cid);
                        }
                        else
                        {
                        }
                    }
                }
                else
                {

                    PdfModel model = new PdfModel();
                    //  string decodedString = Encoding.UTF8.GetString(Convert.FromBase64String(param));
                    model.cid = Convert.ToInt32(cid);
                    model.IsOfferGenExternal = 'Y';
                    DataSet ds = objRepoInd.GetCandidateInformationForPDF(model, cid.ToString());
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0]["Division"].ToString() == "1" || ds.Tables[0].Rows[0]["Division"].ToString() == "2")
                        {
                            result = IndOfferCont.GeneratePDFInfogainNNT(ds, model.cid.ToString(), 'Y');
                        }
                        else if (ds.Tables[0].Rows[0]["Division"].ToString() == "7")
                        {
                            result = IndOfferCont.GeneratePDFADT(ds, model.cid.ToString(), 'Y');
                        }
                        //  int result = IndOfferCont.GeneratePDFUS(ds, model.cid.ToString());
                        if (result == 1)
                        {
                            System.Threading.Tasks.Task<int> copyOffer = IndOfferCont.CopyOfferToMurcury(model.cid.ToString(),cid);
                        }
                        else
                        {
                        }
                    }
                }
               

                return "";

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GenrateOfferAgrCandidate");
                throw ex;
            }
        }

        [Route("DownloadOfferInd")]
        [HttpGet]
        public HttpResponseMessage DownloadOfferInd(string param, string authKey = null)
        {
            try
            {
                // check if it's not an external user
                if (!ClaimsHelper.IsExternalUserAuthorized(User))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, AppConstants.UnauthorizedMessage);
                }

                int cid = Convert.ToInt32(DecodeBase64(param));
                int result;
                DataSet ds = objRepoInd.GetOfferDocumentDetail(cid, cid.ToString(), out result);
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds.Tables[0].Rows[0]["OfferFileName"].ToString();
                    string fileName = Path.GetFileName(filePath);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }

                    // Remove only the last extension
                    string originalFileName = common.RemoveLastExtension(fileName);

                    byte[] encryptedBytes;
                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                    }

                    response.Content = new ByteArrayContent(decryptedBytes);
                    response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = originalFileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                    logger.LogRequestAsync("DownloadOfferInd", Request);
                    logger.LogResponseAsync("DownloadOfferInd", "200 OK");

                    return response;
                }

                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "Offer not generated");
                logger.LogResponseAsync("DownloadOfferInd", "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadOfferInd", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

    }
}