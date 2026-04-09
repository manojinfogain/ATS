using Aspose.Pdf;
using Aspose.Pdf.Text;
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
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
using iTextSharp.text;
using iTextSharp.text.html;
using iTextSharp.text.html.simpleparser;
using System.Collections.Immutable;
using ATSAPI.Areas.HelpPage;
using System.Threading.Tasks;
using ATSAPI.common;
using Page = Aspose.Pdf.Page;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/Offer")]
    public class OfferController : ApiController
    {
        OfferRepository objRepo = new OfferRepository();
        ReportController Rc = new ReportController();
        Common common = new Common();
        OnboardRepository objRepoOnb = new OnboardRepository();
        ATSMailers Mailers = new ATSMailers();
        OnboardController onboardcont = new OnboardController();
        CommonController cm = new CommonController();
        Logger logger = new Logger();


        [Route("GetSelectedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetSelectedCandidatesList(OfferGenerationFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetSelectedCandidatesList", Request);
                var result = objRepo.GetSelectedCandidatesList(claims[5].Value, obj);

                int outputResult = result.ExtendedProperties.Contains("result")
                    ? Convert.ToInt32(result.ExtendedProperties["result"])
                    : 0;

                var authResult = cm.HandleAuthorizationResult(outputResult);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetSelectedCandidatesList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSelectedCandidatesList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetSelectedCandidatesList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getSelectedCandidateDetails")]
        [HttpGet]
        public IHttpActionResult getSelectedCandidateDetails(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getSelectedCandidateDetails", Request);
                var result = objRepo.getSelectedCandidateDetails(cid, claims[5].Value);

                int outputResult = result.ExtendedProperties.Contains("result")
                    ? Convert.ToInt32(result.ExtendedProperties["result"])
                    : 0;

                var authResult = cm.HandleAuthorizationResult(outputResult);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getSelectedCandidateDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getSelectedCandidateDetails", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getSelectedCandidateDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "getSelectedCandidateDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addUpdateOfferApproval")]
        [HttpPost]
        public IHttpActionResult addUpdateOfferApproval(OfferApprovalModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                logger.LogRequestAsync("addUpdateOfferApproval", Request);
                int result = objRepo.addUpdateOfferApproval(obj, claims[5].Value, ref Message, ref ActionId);
                DataSet ds = objRepo.IsDateofJoiningChange(obj.cid);
                if (ds.Tables[0].Rows[0]["IsDateofJoiningChange"].ToString() == "1")
                {
                    System.Threading.Tasks.Task<int> Move = MoveFolder(obj.cid);
                }
                if (result > 0)
                {
                    var responseObj1 = new { ActionID = ActionId, Message = Message };
                    logger.LogResponseAsync("addUpdateOfferApproval", "200 OK");
                    return Ok(responseObj1);
                }
                else if (result < 0)
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
                logger.LogErrorAsync("addUpdateOfferApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "addUpdateOfferApproval");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("resendOfferForApproval")]
        [HttpPost]
        public IHttpActionResult resendOfferForApproval(OfferResendModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                logger.LogRequestAsync("resendOfferForApproval", Request);
                int result = objRepo.resendOfferForApproval(obj, claims[5].Value, ref Message);
                if (result > 0)
                {
                    var responseObj1 = new { Message = Message };
                    logger.LogResponseAsync("resendOfferForApproval", "200 OK");
                    return Ok(responseObj1);
                }
                if (result < 0)
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
                logger.LogErrorAsync("resendOfferForApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "resendOfferForApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("changeApproversOfOfferApproval")]
        [HttpPost]
        public IHttpActionResult changeApproversOfOfferApproval(OfferResendModel obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("changeApproversOfOfferApproval", Request);
                string Message = string.Empty;
                int result = objRepo.changeApproversOfOfferApproval(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getSelectedCandidateDetails", claims[5].Value);
                    return authResult;
                }
                if (result > 0)
                {
                    var responseObj1 = new { Message = Message };
                    logger.LogResponseAsync("changeApproversOfOfferApproval", "200 OK");
                    return Ok(responseObj1);
                }
                if (result < 0)
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
                logger.LogErrorAsync("changeApproversOfOfferApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "changeApproversOfOfferApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPendingApproversList")]
        [HttpGet]
        public IHttpActionResult getPendingApproversList(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getPendingApproversList", Request);
                int result;
                var data = objRepo.getPendingApproversList(cid, claims[5].Value, out result);

                if (result == -1)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getPendingApproversList", claims[5].Value);
                    return Unauthorized();
                }

                logger.LogResponseAsync("getPendingApproversList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getPendingApproversList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "getPendingApproversList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateOfferAprDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateOfferAprDetails(int cid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("getCandidateOfferAprDetails", Request);
                int result;
                var data = objRepo.getCandidateOfferAprDetails(cid, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getCandidateOfferAprDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getCandidateOfferAprDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateOfferAprDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "getCandidateOfferAprDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateListPendingForApproval")]
        [HttpGet]
        public IHttpActionResult GetCandidateListPendingForApproval(int page, int pageSize, string search = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetCandidateListPendingForApproval", Request);
                int result;
                var data = objRepo.GetCandidateListPendingForApproval(claims[5].Value, page, pageSize, search, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetCandidateListPendingForApproval", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetCandidateListPendingForApproval", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateListPendingForApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetCandidateListPendingForApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateOfferApprovalStatus")]
        [HttpPost]
        public IHttpActionResult UpdateOfferApprovalStatus(int cid, string ActionTaken, String Remark = null, char IsDelegator = 'N')
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("UpdateOfferApprovalStatus", Request);
                string Message = string.Empty;
                int result = objRepo.UpdateOfferApprovalStatus(cid, claims[5].Value, ActionTaken, IsDelegator, Remark, ref Message);

                var authResult = cm.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateOfferApprovalStatus", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatus", "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatus", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatus", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatus", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateOfferApprovalStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "UpdateOfferApprovalStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetNumberOfApprovers")]
        [HttpGet]
        public IHttpActionResult GetNumberOfApprovers(int CubeClusterID, int gradeID, decimal ctc, decimal joiningBonus, int ExpYear, int ExpMonth, char GradeBand = 'A', char JFCategory = 'P', int? CondidateTypeId = null, int? RequirementType = null, int? PracticeId = 0, int division = 1)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GetNumberOfApprovers", Request);
                var result = objRepo.GetNumberOfApprovers(CubeClusterID, JFCategory, gradeID, ctc, joiningBonus, ExpYear, ExpMonth, GradeBand, claims[5].Value, CondidateTypeId, RequirementType, PracticeId, division);
                logger.LogResponseAsync("GetNumberOfApprovers", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetNumberOfApprovers", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetNumberOfApprovers");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GenerateOffer")]
        [HttpPost]
        public IHttpActionResult GenerateOffer()
        {
            try
            {
                PdfModel model = new PdfModel();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                logger.LogRequestAsync("GenerateOffer", Request);
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        BGVAttachment att = new BGVAttachment();
                        att.FileName = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i].FileName);
                        model.BGVAttachments.Add(att);
                    }
                }

                model.cid = Convert.ToInt32(frm["cid"]);
                model.sendOfferAddressType = Convert.ToChar(frm["sendOfferAddressType"] == null ? "0" : frm["sendOfferAddressType"]);
                model.SudexoCoupen = Convert.ToInt32(frm["SudexoCoupen"] == null ? "0" : frm["SudexoCoupen"]);
                model.Nps = Convert.ToInt32(frm["Nps"] == null ? "0" : frm["Nps"]);
                model.currentAddress.addressLine1 = frm["crAddressLine1"];
                model.currentAddress.addressLine2 = frm["crAddressLine2"];
                model.currentAddress.addressLine3 = frm["crAddressLine3"];
                model.currentAddress.city = frm["crCity"];
                model.currentAddress.state = frm["crState"];
                model.currentAddress.postalCode = frm["crPostalCode"];
                model.currentAddress.country = frm["crCountry"];
                model.permanentAddress.addressLine1 = frm["prAddressLine1"];
                model.permanentAddress.addressLine2 = frm["prAddressLine2"];
                model.permanentAddress.addressLine3 = frm["prAddressLine3"];
                model.permanentAddress.city = frm["prCity"];
                model.permanentAddress.state = frm["prState"];
                model.permanentAddress.postalCode = frm["prPostalCode"];
                model.permanentAddress.country = frm["prCountry"];
                model.dateOfJoining = frm["dateOfJoining"];
                model.isShippingAddrConfirm = Convert.ToInt32(frm["isShippingAddrConfirm"] == null ? "0" : frm["isShippingAddrConfirm"]);
                model.FinalCTC = Convert.ToDecimal(frm["finalctc"]);
                model.FinalJoiningBonus = Convert.ToDecimal(frm["FinalJoiningBonus"]);
                model.FinalNoticeBuyout = Convert.ToDecimal(frm["FinalNoticeBuyout"]);
                model.FinalTravelExp = Convert.ToDecimal(frm["FinalTravelExp"]);
                model.FinalRelocationExp = Convert.ToDecimal(frm["FinalRelocationExp"]);
                model.FinalRetentionBonus = Convert.ToDecimal(frm["FinalRetentionBonus"]);
                model.CTC = Convert.ToDecimal(frm["ctc"]);
                model.JoiningLocationID = Convert.ToInt32(frm["joiningLocation"] == null ? "0" : frm["joiningLocation"]);

                if (!(model.FinalCTC <= model.CTC))
                {
                    logger.LogResponseAsync("GenerateOffer", "400 Bad Request");
                    return BadRequest("Final CTC Should be less than or equal to approved CTC");
                }

                DataSet ds = objRepo.GetCandidateInformationForPDF(model, claims[5].Value);
                DataSet result1 = objRepo.IsDateofJoiningChange(model.cid);

                if (result1.Tables[0].Rows[0]["IsDateofJoiningChange"].ToString() == "1")
                {
                    System.Threading.Tasks.Task<int> Move = MoveFolder(model.cid);
                }

                for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[i];
                    string filedetails = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);
                    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "/BGV/" + model.cid.ToString() + "/";
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
                        httpPostedFile.InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                }
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    int result = 0;
                    if (ds.Tables[0].Rows[0]["Division"].ToString() == "1" || ds.Tables[0].Rows[0]["Division"].ToString() == "2")
                    {
                        result = GeneratePDFInfogainNNT(ds, model.cid.ToString());
                    }
                    else if (ds.Tables[0].Rows[0]["Division"].ToString() == "7")
                    {
                        result = GeneratePDFADT(ds, model.cid.ToString());
                    }
                    else
                    {
                        logger.LogResponseAsync("GenerateOffer", "400 Bad Request");
                        return BadRequest("Division does not exists.");
                    }
                    if (result == 1)
                    {
                        logger.LogResponseAsync("GenerateOffer", "200 OK");
                        return Ok("Offer Generated");
                    }
                    else
                    {
                        logger.LogResponseAsync("GenerateOffer", "400 Bad Request");
                        return BadRequest("There is some error! Try again later");
                    }
                }

                logger.LogResponseAsync("GenerateOffer", "400 Bad Request");
                return BadRequest("Offer details does not exists");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GenerateOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GenerateOfferPDF");
                return BadRequest("There is some error! Try again later");
            }
        }


        [NonAction]
        public int GeneratePDFInfogainNNT(DataSet ds, string cid, char isOfferRegenerate = 'N')
        {
            string baseImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 50;
            objLoadOptions.PageInfo.Margin.Top = 80;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();
            string base64PdfSign = "";

            String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
            String OfferSignPath = ds.Tables[0].Rows[0]["OfferSignPath"].ToString();
            String Offer = ds.Tables[0].Rows[0]["Offer"].ToString();

            String offerTemp = ds.Tables[0].Rows[0]["OfferHtmlTemp"].ToString()
                .Replace("[MonthlySalaryWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["TotalMonthly"].ToString())))
                .Replace("[annualCTCWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["annualCTC"].ToString())))
                .Replace("[JoiningBonusWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString())))
                .Replace("[ReportingAddress]", ds.Tables[1].Rows[0]["ShortAddress"].ToString());

            if (!string.IsNullOrEmpty(OfferSignPath))
            {
                if (File.Exists(OfferSignPath))
                {
                    byte[] encryptedBytes;
                    string encryptedFileName = Path.GetFileName(OfferSignPath);
                    string originalFileName = common.RemoveLastExtension(OfferSignPath);

                    using (FileStream fs = new FileStream(OfferSignPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                    base64PdfSign = Convert.ToBase64String(decryptedBytes);
                    offerTemp = offerTemp.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                    Offer = Offer.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                }
                else
                {
                    offerTemp = offerTemp.Replace("[candidatesign]", "");
                    Offer = Offer.Replace("[candidatesign]", "");
                }
            }
            if (isOfferRegenerate == 'N')
            {
                SaveUpdateOfferTemplatesModel SaveUpdateOfferTemplatesBody = new SaveUpdateOfferTemplatesModel();
                SaveUpdateOfferTemplatesBody.cid = Convert.ToInt32(cid);
                SaveUpdateOfferTemplatesBody.offerTemplate = offerTemp;

                System.Threading.Tasks.Task<int> updateTemp = SaveUpdateOfferTemplatesAsync(SaveUpdateOfferTemplatesBody);
            }

           

            Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(Offer
                .Replace("[MonthlySalaryWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["TotalMonthly"].ToString())))
                .Replace("[annualCTCWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["annualCTC"].ToString())))
                .Replace("[JoiningBonusWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString())))
                .Replace("[ReportingAddress]", ds.Tables[1].Rows[0]["ShortAddress"].ToString()))), objLoadOptions);
            doc.SetTitle(ds.Tables[0].Rows[0]["CandidateName"].ToString());

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {
                TextStamp AddressLine1 = null, AddressLine2 = null, AddressLine3 = null, AddressLine4 = null, AddressLine5 = null,  textStampUSA = null, textStampUK = null, textStampPoland = null, textStampIndia = null, textStampSINGAPORE = null, textStampUAE = null, textStampLF = null, textStampUS = null, textStampRF = null, textStampURUGUAY = null, textStampCANADA = null;
                ImageStamp imageFooter = null;

                //ImageStamp imageStamp = new ImageStamp(@"\\ipagshareserver\Sharing\Dharampal Singh\atsapi\Content\infogain-icon.png");
                //imageStamp.TopMargin = 20;
                //imageStamp.LeftMargin = 20;
                //imageStamp.HorizontalAlignment = HorizontalAlignment.Left;
                //imageStamp.VerticalAlignment = VerticalAlignment.Top;
                //imageStamp.Height = 40;
                //imageStamp.Width = 150;

                AddressLine1 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine1"].ToString());
                AddressLine1.TopMargin = 20;
                AddressLine1.RightMargin = 40;
                AddressLine1.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine1.VerticalAlignment = VerticalAlignment.Top;
                AddressLine1.TextState.FontSize = 12.0F;
                AddressLine1.TextState.FontStyle = FontStyles.Bold;

                AddressLine2 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine2"].ToString());
                AddressLine2.TopMargin = 35;
                AddressLine2.RightMargin = 40;
                AddressLine2.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine2.VerticalAlignment = VerticalAlignment.Top;
                AddressLine2.TextState.FontSize = 9.0F;

                AddressLine3 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine3"].ToString());
                AddressLine3.TopMargin = 46;
                AddressLine3.RightMargin = 40;
                AddressLine3.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine3.VerticalAlignment = VerticalAlignment.Top;
                AddressLine3.TextState.FontSize = 9.0F;

                AddressLine4 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine4"].ToString());
                AddressLine4.TopMargin = 57;
                AddressLine4.RightMargin = 40;
                AddressLine4.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine4.VerticalAlignment = VerticalAlignment.Top;
                AddressLine4.TextState.FontSize = 9.0F;

                AddressLine5 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine5"].ToString());
                AddressLine5.TopMargin = 69;
                AddressLine5.RightMargin = 40;
                AddressLine5.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine5.VerticalAlignment = VerticalAlignment.Top;
                AddressLine5.TextState.FontSize = 9.0F;               

                if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
                {
                    textStampUS = new TextStamp("US");
                    textStampUS.BottomMargin = 55;
                    textStampUS.LeftMargin = 40;
                    textStampUS.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampUS.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUS.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White); ;

                    textStampUK = new TextStamp("UK");
                    textStampUK.BottomMargin = 55;
                    textStampUK.LeftMargin = 90;
                    textStampUK.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampUK.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUK.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampSINGAPORE = new TextStamp("SINGAPORE");
                    textStampSINGAPORE.BottomMargin = 55;
                    textStampSINGAPORE.LeftMargin = 150;
                    textStampSINGAPORE.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampSINGAPORE.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampSINGAPORE.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampUAE = new TextStamp("UAE");
                    textStampUAE.BottomMargin = 55;
                    textStampUAE.LeftMargin = 245;
                    textStampUAE.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampUAE.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUAE.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White); ;

                    textStampIndia = new TextStamp("INDIA");
                    textStampIndia.BottomMargin = 55;
                    textStampIndia.LeftMargin = 300;
                    textStampIndia.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampIndia.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampIndia.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampPoland = new TextStamp("POLAND");
                    textStampPoland.BottomMargin = 55;
                    textStampPoland.LeftMargin = 360;
                    textStampPoland.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampPoland.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampPoland.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampURUGUAY = new TextStamp("URUGUAY");
                    textStampURUGUAY.BottomMargin = 55;
                    textStampURUGUAY.LeftMargin = 430;
                    textStampURUGUAY.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampURUGUAY.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampURUGUAY.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampCANADA = new TextStamp("CANADA");
                    textStampCANADA.BottomMargin = 55;
                    textStampCANADA.LeftMargin = 520;
                    textStampCANADA.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampCANADA.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampCANADA.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampLF = new TextStamp(ds.Tables[1].Rows[0]["RegisteredOfficeAddress"].ToString());
                    textStampLF.BottomMargin = 30;
                    textStampLF.LeftMargin = 10;
                    textStampLF.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampLF.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampLF.TextState.FontSize = 6.0F;
                    textStampLF.TextState.FontStyle = FontStyles.Bold;

                    textStampRF = new TextStamp(ds.Tables[1].Rows[0]["CIN"].ToString());
                    textStampRF.BottomMargin = 30;
                    textStampRF.RightMargin = 10;
                    textStampRF.HorizontalAlignment = HorizontalAlignment.Right;
                    textStampRF.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampRF.TextState.FontSize = 6.0F;
                    textStampRF.TextState.Font = FontRepository.FindFont("Arial");
                    textStampRF.TextState.FontStyle = FontStyles.Bold;
                }
               
                string imagePath = System.IO.Path.Combine(baseImpDocPath, "Footer.jpg");
                // imageFooter = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\Footer.jpg");
                imageFooter = new ImageStamp(imagePath);
                imageFooter.BottomMargin = 50;
                imageFooter.HorizontalAlignment = HorizontalAlignment.Center;
                imageFooter.VerticalAlignment = VerticalAlignment.Bottom;
                imageFooter.Height = 20;

                //ImageStamp imageSignature = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\Signature.png");


                PageNumberStamp pageNumberStamp = null;
                foreach (Page page in doc.Pages)
                {
                    //page.AddStamp(imageStamp);
                    page.AddStamp(AddressLine1);
                    page.AddStamp(AddressLine2);
                    page.AddStamp(AddressLine3);
                    page.AddStamp(AddressLine4);
                    page.AddStamp(AddressLine5);

                    page.AddStamp(imageFooter);
                    if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
                    {
                        page.AddStamp(textStampUS);
                        page.AddStamp(textStampUK);
                        page.AddStamp(textStampSINGAPORE);
                        page.AddStamp(textStampUAE);
                        page.AddStamp(textStampIndia);
                        page.AddStamp(textStampPoland);
                        page.AddStamp(textStampURUGUAY);
                        page.AddStamp(textStampCANADA);
                        page.AddStamp(textStampLF);
                        page.AddStamp(textStampRF);
                    }
                    pageNumberStamp = new PageNumberStamp();
                    // Whether the stamp is background
                    pageNumberStamp.Background = false;
                    pageNumberStamp.Format = "Page # of " + doc.Pages.Count;
                    pageNumberStamp.BottomMargin = 5;
                    pageNumberStamp.HorizontalAlignment = HorizontalAlignment.Center;
                    pageNumberStamp.StartingNumber = 1;
                    // Set text properties
                    pageNumberStamp.TextState.Font = FontRepository.FindFont("Arial");
                    pageNumberStamp.TextState.FontSize = 9.0F;
                    pageNumberStamp.TextState.FontStyle = FontStyles.Bold;
                    pageNumberStamp.TextState.FontStyle = FontStyles.Italic;
                    pageNumberStamp.TextState.ForegroundColor = Color.Black;

                    // Add stamp to particular page
                    page.AddStamp(pageNumberStamp);
                }
                //if (ds.Tables[0].Rows[0]["OfferTemplateID"].ToString() == "1")
                //{
                //    imageSignature.TopMargin = 168;
                //    imageSignature.HorizontalAlignment = HorizontalAlignment.Left;
                //    imageSignature.VerticalAlignment = VerticalAlignment.Top;
                //    imageSignature.LeftMargin = 30;
                //    imageSignature.Height = 30;
                //    imageSignature.Width = 150;
                //    doc.Pages[3].AddStamp(imageSignature);
                //}
                //else if (ds.Tables[0].Rows[0]["OfferTemplateID"].ToString() == "2")
                //{
                //    //if (Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString()) > 0)
                //    //{
                //    imageSignature.TopMargin = 110;
                //    imageSignature.HorizontalAlignment = HorizontalAlignment.Left;
                //    imageSignature.VerticalAlignment = VerticalAlignment.Top;
                //    imageSignature.LeftMargin = 30;
                //    imageSignature.Height = 30;
                //    imageSignature.Width = 150;
                //    doc.Pages[2].AddStamp(imageSignature);
                //    //}
                //    //else
                //    //{
                //    //    imageSignature.BottomMargin = 80;
                //    //    imageSignature.HorizontalAlignment = HorizontalAlignment.Left;
                //    //    imageSignature.VerticalAlignment = VerticalAlignment.Bottom;
                //    //    imageSignature.LeftMargin = 30;
                //    //    imageSignature.Height = 30;
                //    //    imageSignature.Width = 150;
                //    //    doc.Pages[1].AddStamp(imageSignature);
                //    //}
                //}
                //else if (ds.Tables[0].Rows[0]["OfferTemplateID"].ToString() == "3")
                //{
                //    imageSignature.BottomMargin = 200;
                //    imageSignature.HorizontalAlignment = HorizontalAlignment.Left;
                //    imageSignature.VerticalAlignment = VerticalAlignment.Bottom;
                //    imageSignature.LeftMargin = 140;
                //    imageSignature.Height = 30;
                //    imageSignature.Width = 150;
                //    doc.Pages[2].AddStamp(imageSignature);
                //}
            }
            Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
            documentPrivilege.AllowScreenReaders = true;
            documentPrivilege.AllowPrint = false;
            documentPrivilege.AllowCopy = false;
            documentPrivilege.AllowModifyContents = false;

            string path = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + cid + "\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

          //  doc.Save(path + "InfogainOffer_Aspose" + CandidateName + ".PDF");

            byte[] finalPdfBytes = GeneratePdfWithWatermarkNNT(doc, ds, CandidateName, baseImpDocPath);
            string fileName = common.GetFileWithAdditionalExtention("InfogainOffer_" + CandidateName + ".PDF");
            int encryptionResult = common.EncryptFile(finalPdfBytes, path+ fileName);

            return 1;
        }

        public byte[] GeneratePdfWithWatermarkNNT(Aspose.Pdf.Document doc, DataSet ds, string CandidateName, string baseImpDocPath)
    {
        byte[] finalPdfBytes;

        // Save the PDF into a MemoryStream instead of a file
        using (MemoryStream inputPdfStream = new MemoryStream())
        {
            doc.Save(inputPdfStream);
            inputPdfStream.Position = 0; // Reset stream position

            // Create a MemoryStream for the output PDF
            using (MemoryStream outputPdfStream = new MemoryStream())
            {
                var reader = new PdfReader(inputPdfStream);
                int numberOfPages = reader.NumberOfPages;
                var stamper = new PdfStamper(reader, outputPdfStream);

                for (int i = 1; i <= numberOfPages; i++)
                {
                    var pdfContentByte = stamper.GetOverContent(i);

                    // Load the appropriate watermark image into memory
                    using (MemoryStream inputImageStream = new MemoryStream(File.ReadAllBytes(
                        ds.Tables[0].Rows[0]["Division"].ToString() == "1"
                            ? Path.Combine(baseImpDocPath, "infogainGPTW-icon.png")
                            : Path.Combine(baseImpDocPath, "NNT-icon.png"))))
                    {
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);
                        image.SetAbsolutePosition(0, 770);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);
                    }
                }

                stamper.Close();
                reader.Close();

                // Convert final PDF to byte array
                finalPdfBytes = outputPdfStream.ToArray();
            }
        }

        return finalPdfBytes;
    }


        [NonAction]
        public int GeneratePDFADT(DataSet ds, string cid, char isOfferRegenerate = 'N')
        {
            string ImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];

            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 50;
            objLoadOptions.PageInfo.Margin.Top = 110;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();
            string base64PdfSign = "";
            String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
            String OfferSignPath = ds.Tables[0].Rows[0]["OfferSignPath"].ToString();
            String Offer = ds.Tables[0].Rows[0]["Offer"].ToString();
            String offerTemp = ds.Tables[0].Rows[0]["OfferHtmlTemp"].ToString()
                .Replace("[MonthlySalaryWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["TotalMonthly"].ToString())))
                .Replace("[annualCTCWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["annualCTC"].ToString())))
                .Replace("[JoiningBonusWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString())))
                .Replace("[ReportingAddress]", ds.Tables[1].Rows[0]["ShortAddress"].ToString());

            if (!string.IsNullOrEmpty(OfferSignPath))
            {
                if (File.Exists(OfferSignPath))
                {
                    byte[] encryptedBytes;
                    string encryptedFileName = Path.GetFileName(OfferSignPath);
                    string originalFileName = common.RemoveLastExtension(OfferSignPath);

                    using (FileStream fs = new FileStream(OfferSignPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                    base64PdfSign = Convert.ToBase64String(decryptedBytes);
                    offerTemp = offerTemp.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                    Offer = Offer.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                }
                else
                {
                    offerTemp = offerTemp.Replace("[candidatesign]", "");
                    Offer = Offer.Replace("[candidatesign]", "");
                }
            }

            if (isOfferRegenerate == 'N')
            {
                SaveUpdateOfferTemplatesModel SaveUpdateOfferTemplatesBody = new SaveUpdateOfferTemplatesModel();
                SaveUpdateOfferTemplatesBody.cid = Convert.ToInt32(cid);
                SaveUpdateOfferTemplatesBody.offerTemplate = offerTemp;

                System.Threading.Tasks.Task<int> updateTemp = SaveUpdateOfferTemplatesAsync(SaveUpdateOfferTemplatesBody);
            }



            Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(Offer
                .Replace("[MonthlySalaryWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["TotalMonthly"].ToString())))
                .Replace("[annualCTCWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["annualCTC"].ToString())))
                .Replace("[JoiningBonusWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString())))
                .Replace("[ReportingAddress]", ds.Tables[1].Rows[0]["ShortAddress"].ToString())
                )), objLoadOptions);
            doc.SetTitle(ds.Tables[0].Rows[0]["CandidateName"].ToString());

            string NewAddressLine1 = null, NewAddressLine1Alias = null, NewAddressLine2 = null, NewAddressLine3 = null, NewAddressLine4 = null, NewAddressLine5 = null, NewAddressLine6 = null, textStampLF = null, textStampRF = null;

            string NewtextStampUSA = null, NewtextStampUK = null, NewtextStampPoland = null, NewtextStampIndia = null, NewtextStampSINGAPORE = null, NewtextStampUAE = null, NewtextStampUruguay = null, NewtextStampCanada = null;


            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {

                //NewAddressLine1 = ds.Tables[1].Rows[0]["AddressLine1"].ToString();
                NewAddressLine1 = ds.Tables[1].Rows[0]["AddressLine1"].ToString();
                NewAddressLine2 = ds.Tables[1].Rows[0]["AddressLine2"].ToString();
                NewAddressLine3 = ds.Tables[1].Rows[0]["AddressLine3"].ToString();
                NewAddressLine4 = ds.Tables[1].Rows[0]["AddressLine4"].ToString();
                NewAddressLine5 = ds.Tables[1].Rows[0]["AddressLine5"].ToString();
               // NewAddressLine6 = ds.Tables[1].Rows[0]["AddressLine6"].ToString();
                textStampLF = ds.Tables[1].Rows[0]["RegisteredOfficeAddress"].ToString();
                textStampRF = ds.Tables[1].Rows[0]["CIN"].ToString();

                NewtextStampUSA = "US";
                NewtextStampUK = "UK";
                NewtextStampSINGAPORE = "SINGAPORE";
                NewtextStampUAE = "UAE";
                NewtextStampIndia = "INDIA";
                NewtextStampPoland = "POLAND";
                NewtextStampUruguay = "URUGUAY";
                NewtextStampCanada = "CANADA";




                //TextStamp AddressLine1 = null, AddressLine2 = null, AddressLine3 = null, AddressLine4 = null, AddressLine5 = null, AddressLine6 = null,
                //     Address2Line1 = null, Address2Line2 = null, Address2Line3 = null, Address2Line4 = null, Address2Line5 = null
                //    , textStampUSA = null, textStampUK = null, textStampPoland = null, textStampIndia = null, textStampSINGAPORE = null, textStampUAE = null, textStampLF = null, textStampRF = null;
                //ImageStamp imageFooter = null;

                //AddressLine1 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine1"].ToString());
                //AddressLine1.BottomMargin = 124;
                //AddressLine1.LeftMargin = 40;
                //AddressLine1.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine1.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine1.TextState.FontSize = 8.0F;
                //AddressLine1.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //AddressLine2 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine2"].ToString());
                //AddressLine2.BottomMargin = 112;
                //AddressLine2.LeftMargin = 40;
                //AddressLine2.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine2.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine2.TextState.FontSize = 8.0F;
                //AddressLine2.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //AddressLine3 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine3"].ToString());
                //AddressLine3.BottomMargin = 100;
                //AddressLine3.LeftMargin = 40;
                //AddressLine3.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine3.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine3.TextState.FontSize = 8.0F;
                //AddressLine3.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //AddressLine4 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine4"].ToString());
                //AddressLine4.BottomMargin = 88;
                //AddressLine4.LeftMargin = 40;
                //AddressLine4.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine4.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine4.TextState.FontSize = 8.0F;
                //AddressLine4.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //AddressLine5 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine5"].ToString());
                //AddressLine5.BottomMargin = 76;
                //AddressLine5.LeftMargin = 40;
                //AddressLine5.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine5.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine5.TextState.FontSize = 8.0F;
                //AddressLine5.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //AddressLine6 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine6"].ToString());
                //AddressLine6.BottomMargin = 64;
                //AddressLine6.LeftMargin = 40;
                //AddressLine6.HorizontalAlignment = HorizontalAlignment.Left;
                //AddressLine6.VerticalAlignment = VerticalAlignment.Bottom;
                //AddressLine6.TextState.FontSize = 8.0F;
                //AddressLine6.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //imageFooter = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\ATDfooter.jpg");
                ////imageFooter.BottomMargin = 30;
                //imageFooter.HorizontalAlignment = HorizontalAlignment.Center;
                //imageFooter.VerticalAlignment = VerticalAlignment.Bottom;
                ////imageFooter.Height = 20;

                ////ImageStamp imageSignature = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\Signature.png");
                //doc.Pages[1].AddStamp(AddressLine1);
                //doc.Pages[1].AddStamp(AddressLine2);
                //doc.Pages[1].AddStamp(AddressLine3);
                //doc.Pages[1].AddStamp(AddressLine4);
                //doc.Pages[1].AddStamp(AddressLine5);
                //doc.Pages[1].AddStamp(AddressLine6);


                //Address2Line1 = new TextStamp(ds.Tables[1].Rows[0]["Address2Line1"].ToString());
                //Address2Line1.BottomMargin = 124;
                //Address2Line1.RightMargin = 40;
                //Address2Line1.HorizontalAlignment = HorizontalAlignment.Right;
                //Address2Line1.VerticalAlignment = VerticalAlignment.Bottom;
                //Address2Line1.TextState.FontSize = 8.0F;
                //Address2Line1.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //Address2Line2 = new TextStamp(ds.Tables[1].Rows[0]["Address2Line2"].ToString());
                //Address2Line2.BottomMargin = 112;
                //Address2Line2.RightMargin = 40;
                //Address2Line2.HorizontalAlignment = HorizontalAlignment.Right;
                //Address2Line2.VerticalAlignment = VerticalAlignment.Bottom;
                //Address2Line2.TextState.FontSize = 8.0F;
                //Address2Line2.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //Address2Line3 = new TextStamp(ds.Tables[1].Rows[0]["Address2Line3"].ToString());
                //Address2Line3.BottomMargin = 100;
                //Address2Line3.RightMargin = 40;
                //Address2Line3.HorizontalAlignment = HorizontalAlignment.Right;
                //Address2Line3.VerticalAlignment = VerticalAlignment.Bottom;
                //Address2Line3.TextState.FontSize = 8.0F;
                //Address2Line3.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //Address2Line4 = new TextStamp(ds.Tables[1].Rows[0]["Address2Line4"].ToString());
                //Address2Line4.BottomMargin = 88;
                //Address2Line4.RightMargin = 40;
                //Address2Line4.HorizontalAlignment = HorizontalAlignment.Right;
                //Address2Line4.VerticalAlignment = VerticalAlignment.Bottom;
                //Address2Line4.TextState.FontSize = 8.0F;
                //Address2Line4.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //Address2Line5 = new TextStamp(ds.Tables[1].Rows[0]["Address2Line5"].ToString());
                //Address2Line5.BottomMargin = 76;
                //Address2Line5.RightMargin = 40;
                //Address2Line5.HorizontalAlignment = HorizontalAlignment.Right;
                //Address2Line5.VerticalAlignment = VerticalAlignment.Bottom;
                //Address2Line5.TextState.FontSize = 8.0F;
                //Address2Line5.TextState.ForegroundColor = Aspose.Pdf.Color.FromRgb(System.Drawing.Color.Gray);

                //doc.Pages[1].AddStamp(Address2Line1);
                //doc.Pages[1].AddStamp(Address2Line2);
                //doc.Pages[1].AddStamp(Address2Line3);
                //doc.Pages[1].AddStamp(Address2Line4);
                //doc.Pages[1].AddStamp(Address2Line5);


                // PageNumberStamp pageNumberStamp = null;
                //foreach (Page page in doc.Pages)
                //{
                //    //page.AddStamp(imageStamp);


                //    page.AddStamp(imageFooter);
                //    if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
                //    {
                //        page.AddStamp(textStampUSA);
                //        page.AddStamp(textStampUK);
                //        page.AddStamp(textStampPoland);
                //        page.AddStamp(textStampIndia);
                //        page.AddStamp(textStampSINGAPORE);
                //        page.AddStamp(textStampUAE);
                //        page.AddStamp(textStampLF);
                //        page.AddStamp(textStampRF);
                //    }
                //    pageNumberStamp = new PageNumberStamp();
                //    // Whether the stamp is background
                //    pageNumberStamp.Background = false;
                //    pageNumberStamp.Format = "Page # of " + doc.Pages.Count;
                //    pageNumberStamp.BottomMargin = 30;
                //    pageNumberStamp.HorizontalAlignment = HorizontalAlignment.Center;
                //    pageNumberStamp.StartingNumber = 1;
                //    // Set text properties
                //    pageNumberStamp.TextState.Font = FontRepository.FindFont("Arial");
                //    pageNumberStamp.TextState.FontSize = 9.0F;
                //    pageNumberStamp.TextState.FontStyle = FontStyles.Bold;
                //    pageNumberStamp.TextState.FontStyle = FontStyles.Italic;
                //    pageNumberStamp.TextState.ForegroundColor = Color.Black;

                //    // Add stamp to particular page
                //    page.AddStamp(pageNumberStamp);
                //}

            }
            Aspose.Pdf.Facades.DocumentPrivilege documentPrivilege = Aspose.Pdf.Facades.DocumentPrivilege.ForbidAll;
            documentPrivilege.AllowScreenReaders = true;
            documentPrivilege.AllowPrint = false;
            documentPrivilege.AllowCopy = false;
            documentPrivilege.AllowModifyContents = false;

            string path = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + cid + "\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

        //    doc.Save(path + "InfogainOffer_Aspose" + CandidateName + ".PDF");

            byte[] finalPdfBytes;

            // Save the PDF into a MemoryStream instead of a file
            using (MemoryStream inputPdfStream = new MemoryStream())
            {
                doc.Save(inputPdfStream);
                inputPdfStream.Position = 0; // Reset stream position
               // Create a MemoryStream for the output PDF
                using (MemoryStream outputPdfStream = new MemoryStream())
                {
                    var reader = new PdfReader(inputPdfStream);
                    int numberOfPages = reader.NumberOfPages;
                    var stamper = new PdfStamper(reader, outputPdfStream);
                    for (int i = 1; i <= numberOfPages; i++)
                    {
                        var pageNumeber = "Page " + i + " of " + numberOfPages;

                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStream = null;
                        string imagePathF = System.IO.Path.Combine(ImpDocPath, "infogainGPTW-icon.png");
                        inputImageStream = new FileStream(imagePathF, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //  inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogainGPTW-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);

                        image.SetAbsolutePosition(0, 762);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);

                        Stream inputImageStream1 = null;
                        string imagePath = System.IO.Path.Combine(ImpDocPath, "Footer.jpg");
                        inputImageStream1 = new FileStream(imagePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //inputImageStream1 = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\Footer.jpg", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image1 = iTextSharp.text.Image.GetInstance(inputImageStream1);
                        image1.SetAbsolutePosition(0, 50);
                        image1.Alignment = Element.ALIGN_BOTTOM;
                        image1.ScalePercent(60f, 22f);
                        pdfContentByte.AddImage(image1);

                        BaseFont bf4 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf4, 9);
                        pdfContentByte.ShowTextAligned(4, pageNumeber, 280, 10, 0);


                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 13);
                        pdfContentByte.BeginText();
                        BaseFont bf9 = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, "", 357, 815, 0);
                        pdfContentByte.SetFontAndSize(bf9, 12);
                        pdfContentByte.EndText();
                        //pdfContentByte.BeginText();
                        //BaseFont bf2 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        //pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, NewAddressLine1, 311, 815, 0);
                        //pdfContentByte.SetFontAndSize(bf2, 8);
                        //pdfContentByte.EndText();
                        BaseFont bf2 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        BaseFont bf21Bold = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.BeginText();
                        pdfContentByte.SetFontAndSize(bf21Bold, 10); // 8pt regular font
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine1, 560, 815, 0); // right-aligned at X = 575
                        pdfContentByte.EndText();
                        // Reset to regular font for next content
                        pdfContentByte.BeginText();
                        pdfContentByte.SetFontAndSize(bf2, 8);
                        pdfContentByte.EndText();


                        //pdfContentByte.BeginText();
                        //pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, NewAddressLine1Alias, 298, 803, 0);
                        //BaseFont bf3 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        //pdfContentByte.SetFontAndSize(bf3, 9);
                        //pdfContentByte.EndText();


                        float rightEdgeX = 560;     // This is the RIGHT edge where all text should end
                        float startY = 803;         // Starting Y position (top line)
                        float lineSpacing = 12;     // Vertical spacing between lines

                        pdfContentByte.BeginText();

                        // All lines will end at X = 560 (right-aligned)
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine2, rightEdgeX, startY, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine3, rightEdgeX, startY - lineSpacing, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine4, rightEdgeX, startY - (2 * lineSpacing), 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine5, rightEdgeX, startY - (3 * lineSpacing), 0);

                        pdfContentByte.EndText();

                        BaseFont bf1 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9.5f);
                        pdfContentByte.SetColorFill(BaseColor.WHITE);
                        pdfContentByte.BeginText();
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUSA, 50, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUK, 100, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampPoland, 170, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampIndia, 230, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampSINGAPORE, 310, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUAE, 370, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUruguay, 450, 58, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampCanada, 540, 58, 0);
                        pdfContentByte.EndText();
                        //  BaseFont bfBold = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        //  pdfContentByte.BeginText();
                        //  pdfContentByte.SetFontAndSize(bfBold, 6.0f);
                        //  pdfContentByte.SetColorFill(BaseColor.BLACK);
                        //  pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, textStampLF, 10, 35, 0);
                        // // pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, NewAddressLine3, 10, 25, 0);
                        ////  pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, NewAddressLine4, 90, 25, 0);
                        //  pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, textStampRF, 575, 30, 0);
                        //  pdfContentByte.EndText();
                        BaseFont bfBold = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);

                        pdfContentByte.BeginText();
                        pdfContentByte.SetFontAndSize(bfBold, 6.0f);  // Use bold for both
                        pdfContentByte.SetColorFill(BaseColor.BLACK);

                        // SAME Y = 35 used for both left and right
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, textStampLF, 10, 35, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, textStampRF, 575, 35, 0);

                        pdfContentByte.EndText();

                        //Stream inputImageStreamBlank = null;

                        //inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\ADTLogoBlank.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        //iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);
                        //if (i == 1)
                        //{
                        //    image.SetAbsolutePosition(0, 770);
                        //    image.Alignment = Element.ALIGN_TOP;
                        //    image.ScalePercent(52f);
                        //}
                        //else
                        //{
                        //    imageBlank.SetAbsolutePosition(0, 770);
                        //    imageBlank.Alignment = Element.ALIGN_TOP;
                        //    imageBlank.ScalePercent(52f);

                        //    image.SetAbsolutePosition(450, 770);
                        //    image.Alignment = Element.ALIGN_TOP;
                        //    image.ScalePercent(52f);
                        //    pdfContentByte.AddImage(imageBlank);
                        //}


                        //pdfContentByte.AddImage(image);

                    }
                    stamper.Close();
                    reader.Close();
                    // Convert final PDF to byte array
                    finalPdfBytes = outputPdfStream.ToArray();
                }
                }

            string fileName = common.GetFileWithAdditionalExtention("InfogainOffer_" + CandidateName + ".PDF");
            int encryptionResult = common.EncryptFile(finalPdfBytes, path + fileName);

            //   Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose" + CandidateName + ".PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
            //   Stream outputPdfStream = new FileStream(path + "InfogainOffer_" + CandidateName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

            //if (File.Exists(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF")))
            //{
            //    File.Delete(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF"));
            //}

            //for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
            //{
            //    var httpPostedFile = HttpContext.Current.Request.Files[i];
            //    string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
            //    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "/BGV/" + model.cid.ToString() + "/";
            //    if (!(Directory.Exists(tempPath)))
            //    {
            //        Directory.CreateDirectory(tempPath);
            //    }
            //    string fileSavePath = Path.Combine(tempPath, filedetails);
            //    if (System.IO.File.Exists(fileSavePath))
            //    {
            //        File.Delete(fileSavePath);
            //    }
            //    httpPostedFile.SaveAs(fileSavePath);
            //}


            // doc.Encrypt("user", "owner", documentPrivilege, CryptoAlgorithm.AESx128, false);

            return 1;
        }


        [Route("UploadOffer")]
        [HttpPost]
        public IHttpActionResult UploadOffer()
        {
            string methodName = nameof(UploadOffer);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                PdfModel model = new PdfModel();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                model.cid = Convert.ToInt32(frm["cid"]);
                model.sendOfferAddressType = Convert.ToChar(frm["sendOfferAddressType"] == null ? "0" : frm["sendOfferAddressType"]);
                model.SudexoCoupen = Convert.ToInt32(frm["SudexoCoupen"] == null ? "0" : frm["SudexoCoupen"]);
                model.Nps = Convert.ToInt32(frm["Nps"] == null ? "0" : frm["Nps"]);
                model.currentAddress.addressLine1 = frm["crAddressLine1"];
                model.currentAddress.addressLine2 = frm["crAddressLine2"];
                model.currentAddress.addressLine3 = frm["crAddressLine3"];
                model.currentAddress.city = frm["crCity"];
                model.currentAddress.state = frm["crState"];
                model.currentAddress.postalCode = frm["crPostalCode"];
                model.currentAddress.country = frm["crCountry"];
                model.permanentAddress.addressLine1 = frm["prAddressLine1"];
                model.permanentAddress.addressLine2 = frm["prAddressLine2"];
                model.permanentAddress.addressLine3 = frm["prAddressLine3"];
                model.permanentAddress.city = frm["prCity"];
                model.permanentAddress.state = frm["prState"];
                model.permanentAddress.postalCode = frm["prPostalCode"];
                model.permanentAddress.country = frm["prCountry"];
                model.dateOfJoining = frm["dateOfJoining"];
                model.isShippingAddrConfirm = Convert.ToInt32(frm["isShippingAddrConfirm"] == null ? "0" : frm["isShippingAddrConfirm"]);
                model.FinalCTC = Convert.ToDecimal(frm["finalctc"]);
                model.CTC = Convert.ToDecimal(frm["ctc"]);
                model.JoiningLocationID = Convert.ToInt32(frm["joiningLocation"] == null ? "0" : frm["joiningLocation"]);
                model.OfferSeqNumber = Convert.ToInt32(frm["OfferSeqNumber"] == null ? "0" : frm["OfferSeqNumber"]);
                model.offerNumber = frm["offerNumber"];

                if (!(model.FinalCTC <= model.CTC))
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("Final CTC Should be less than or equal to approved CTC");
                }
                int result;
                DataSet ds = objRepo.GeDetailsForUploadOffer(model, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                String CandidateName = String.Empty;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
                }
                DataSet result1 = objRepo.IsDateofJoiningChange(model.cid);

                if (result1.Tables[0].Rows[0]["IsDateofJoiningChange"].ToString() == "1")
                {
                    System.Threading.Tasks.Task<int> Move = MoveFolder(model.cid);
                }

                if (HttpContext.Current.Request.Files.Count > 0 && CandidateName != "")
                {
                    var offerLetterFile = HttpContext.Current.Request.Files[0];
                    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + model.cid.ToString() + "\\";
                    string filedetails = "InfogainOffer_" + CandidateName + Path.GetExtension(offerLetterFile.FileName).ToString();
                    string FileNameWithExtention = common.GetFileWithAdditionalExtention(filedetails);
                    string fileSavePath = Path.Combine(tempPath, FileNameWithExtention);

                    if (!(Directory.Exists(tempPath)))
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
                        offerLetterFile.InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    // Encrypt the file before saving
                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        logger.LogResponseAsync(methodName, "500 Internal Server Error");
                        return InternalServerError(new Exception("File encryption failed."));
                    }
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return InternalServerError(ex);
            }
        }


        [Route("UploadBGVDocuments")]
        [HttpPost]
        public IHttpActionResult UploadBGVDocuments()
        {
            string methodName = nameof(UploadBGVDocuments);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                PdfModel model = new PdfModel();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        string FileNameWithExtention = string.Empty;
                        BGVAttachment att = new BGVAttachment();
                        FileNameWithExtention = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i].FileName);
                        att.FileName = FileNameWithExtention;
                        model.BGVAttachments.Add(att);
                    }
                }

                model.cid = Convert.ToInt32(frm["cid"]);
                for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[i];
                    string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
                    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "/BGV/" + model.cid.ToString() + "/";
                    string FileNameWithExtention = common.GetFileWithAdditionalExtention(filedetails);
                    string fileSavePath = Path.Combine(tempPath, FileNameWithExtention);
                    if (!(Directory.Exists(tempPath)))
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

                    // Encrypt the file before saving
                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        logger.LogResponseAsync(methodName, "500 Internal Server Error");
                        return InternalServerError(new Exception("Error encrypting the file."));
                    }
                }

                int result = objRepo.UploadBGVDocuments(model, claims[5].Value);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok("BGV document Saved successfully");
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadOffer")]
        [HttpGet]
        public HttpResponseMessage DownloadOffer(int cid, char? type = 'O')
        {
            string methodName = nameof(DownloadOffer);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetOfferDocumentDetail(cid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return (HttpResponseMessage)authResult;
                }
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = "";
                    if (type == 'O')
                    {
                        filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds.Tables[0].Rows[0]["OfferFileName"].ToString();
                    }
                    else
                    {
                        filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds.Tables[0].Rows[0]["EmployeeAgreenmetKey"].ToString();
                    }
                    string fileName = Path.GetFileName(filePath);
                    string originalFileName = common.RemoveLastExtension(fileName);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }
                    byte[] fileBytes;
                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fileBytes = new byte[fs.Length];
                        fs.Read(fileBytes, 0, fileBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(fileBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        logger.LogResponseAsync(methodName, "500 Internal Server Error");
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                    }
                    response.Content = new ByteArrayContent(decryptedBytes);
                    response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = originalFileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    logger.LogResponseAsync(methodName, "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "Offer not generated");
                logger.LogResponseAsync(methodName, "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("GetApprovedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetApprovedCandidatesList([FromBody] OfferGenerationFilter obj)
        {
            string methodName = nameof(GetApprovedCandidatesList);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetApprovedCandidatesList(claims[5].Value, obj, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateApprovalDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateApprovalDetails(int cid)
        {
            string methodName = nameof(getCandidateApprovalDetails);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;

                var data = objRepo.getCandidateApprovalDetails(cid, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DgmCalculaterForOffer")]
        [HttpPost]
        public IHttpActionResult DgmCalculaterForOffer(dgmCalcModel obj)
        {
            string methodName = nameof(DgmCalculaterForOffer);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.DgmCalculaterForOffer(obj, claims[5].Value);

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DgmCalculaterForOfferNNT")]
        [HttpPost]
        public IHttpActionResult GetDGMdetailsforOfferNNT(int cid)
        {
            string methodName = nameof(GetDGMdetailsforOfferNNT);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.GetDGMdetailsforOfferNNT(cid, claims[5].Value);

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getOfferDeclinedCategory")]
        [HttpGet]
        public IHttpActionResult getOfferDeclinedCategory()
        {
            string methodName = nameof(getOfferDeclinedCategory);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var result = objRepo.getOfferDeclineCategory();
                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateCandidateOfferDetailsStatus")]
        [HttpPost]
        public IHttpActionResult UpdateCandidateOfferDetailsStatus(int cid, string offerStatus, int? odid = null, string Remark = null, string DateOfJoining = null, string DeclineDate = null, int? JoinedEmpId = null)
        {
            string methodName = nameof(UpdateCandidateOfferDetailsStatus);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateCandidateOfferDeclineStatus(cid, claims[5].Value, offerStatus, odid, Remark, DateOfJoining, DeclineDate, JoinedEmpId, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    if (offerStatus == "140")
                    {
                        int mailSentResult = onboardcont.SendJoiningItineraryToCandidateMailer(cid);
                    }
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("sendOffer")]
        [HttpPost]
        public IHttpActionResult sendOffer(OfferSendModel obj)
        {
            string methodName = nameof(sendOffer);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.sendOffer(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    int res = Mailers.SendOfferLetterToCandidateMailerIndia(obj.cid, claims[5].Value);
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendOffer")]
        [HttpPost]
        public IHttpActionResult ResendOffer(int cid)
        {
            string methodName = nameof(ResendOffer);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int res = Mailers.SendOfferLetterToCandidateMailerIndia(cid, claims[5].Value);

                if (res == 1)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok("Offer sent successfully.");
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getCandidateStatusHistory")]
        [HttpGet]
        public IHttpActionResult getCandidateStatusHistory(int cid)
        {
            string methodName = nameof(getCandidateStatusHistory);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getCandidateStatusHistory(cid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("DownloadBGVFile")]
        [HttpGet]
        public HttpResponseMessage DownloadBGVFile(int id)
        {
            string methodName = nameof(DownloadBGVFile);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetBGVFileName(id, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + "BGV" + "\\" + ds.Tables[0].Rows[0]["cid"].ToString() + "\\" + ds.Tables[0].Rows[0]["FileName"].ToString();
                    string fileName = Path.GetFileName(filePath);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }

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
                    response.Content.Headers.ContentDisposition.FileName = fileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));

                    logger.LogResponseAsync(methodName, "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "File not found");
                logger.LogResponseAsync(methodName, "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("transferSelectedCandidateByTalentId")]
        [HttpPost]
        public IHttpActionResult TransferSelectedCandidateByTalentId(SelectedCandidateTransfer obj)
        {
            string methodName = nameof(TransferSelectedCandidateByTalentId);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.TransferSelectedCandidateByTalentId(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                else if (result > 0 && obj.cid > 0)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else if (result == -2)
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updateConfirmShippingAddress")]
        [HttpPost]
        public IHttpActionResult updateConfirmShippingAddress(updateConfirmAddress obj)
        {
            string methodName = nameof(updateConfirmShippingAddress);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.updateConfirmShippingAddress(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }
                else if (result > 0)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateAddresConfirmationStatus")]
        [HttpGet]
        public IHttpActionResult GetCandidateAddresConfirmationStatus(int page, int pageSize, string search = null)
        {
            string methodName = nameof(GetCandidateAddresConfirmationStatus);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateAddresConfirmationStatus(page, pageSize, claims[5].Value, out result, search);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOfferedCandidateList")]
        [HttpGet]
        public IHttpActionResult GetOfferedCandidateList(int page, int pageSize, string search = null, int? OfferStatus = null)
        {
            string methodName = nameof(GetOfferedCandidateList);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var result = objRepo.GetOfferedCandidateList(page, pageSize, search, OfferStatus);
                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddOfferApprovalAttachment")]
        [HttpPost]
        public IHttpActionResult AddOfferApprovalAttachment()
        {
            string methodName = nameof(AddOfferApprovalAttachment);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                int result = 0;
                OfferApprovalDoc model = new OfferApprovalDoc();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        ApprovalAttachment att = new ApprovalAttachment();
                        att.FileName = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i].FileName);
                        model.ApprovalAttachments.Add(att);
                    }
                    model.Cid = Convert.ToInt32(frm["cid"]);
                    model.ActionTakenBy = frm["ActionTakenBy"].ToString();
                    model.ActionId = Convert.ToInt32(frm["ActionId"]);
                    result = objRepo.AddOfferApprovalAttachment(model, claims[5].Value);
                    var authResult = cm.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                }
                if (result > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        var httpPostedFile = HttpContext.Current.Request.Files[i];
                        string filedetails = common.GetFileWithAdditionalExtention(httpPostedFile.FileName);
                        string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "ApprovalDoc" + "\\" + model.Cid.ToString() + "\\";
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
                            httpPostedFile.InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }

                        // Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                        if (encryptionResult != 1)
                        {
                            return BadRequest("Error encrypting the file.");
                        }
                    }
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok("Offer Saved successfully");
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadApprovalDocumet")]
        [HttpGet]
        public HttpResponseMessage DownloadApprovalDocumet(int Id)
        {
            string methodName = nameof(DownloadApprovalDocumet);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetApprovalFileName(Id, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + "ApprovalDoc" + "\\" + ds.Tables[0].Rows[0]["cid"].ToString() + "\\" + ds.Tables[0].Rows[0]["FileName"].ToString();
                    string fileName = Path.GetFileName(filePath);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }
                    string originalFileName = common.RemoveLastExtension(fileName);
                    byte[] fileBytes;
                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fileBytes = new byte[fs.Length];
                        fs.Read(fileBytes, 0, fileBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(fileBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "File decryption failed.");
                    }

                    response.Content = new ByteArrayContent(decryptedBytes);
                    response.Content.Headers.ContentLength = decryptedBytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = originalFileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(originalFileName));
                    logger.LogResponseAsync(methodName, "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "File not found");
                logger.LogResponseAsync(methodName, "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("GetOfferApprovalAttachaments")]
        [HttpGet]
        public IHttpActionResult GetOfferApprovalAttachaments(int cid, string ActionTakenBy, int? ActionId = null)
        {
            string methodName = nameof(GetOfferApprovalAttachaments);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                int result;
                var data = objRepo.GetOfferApprovalAttachaments(cid, ActionTakenBy, out result, ActionId);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("ExportToExcelSelectedCandidatesList")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelSelectedCandidatesList(OfferGenerationFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            //obj.startDate = "2021-01-01";

            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email ID</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Phone No.</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Skill</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Date</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Date</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Status</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reason for Drop</ font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Drop Remark</ font></b></td>");


            str.Append("</tr>");
            DataSet ds = objRepo.GetSelectedCandidatesList(claims[5].Value, obj);
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
                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Rc.CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Name"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["email"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["phone"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryrecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["secondaryrecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryskill"].ToString() + "</font></td>");

                    if (dr["DateOfOffer"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfOffer"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["DateOfJoining"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfJoining"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["OfferStatusID"].ToString() != "" && (Convert.ToInt32(dr["OfferStatusID"].ToString()) == 240 || Convert.ToInt32(dr["OfferStatusID"].ToString()) == 260))
                    {
                        if (dr["offerPrevStatus"].ToString() == null || dr["offerPrevStatus"].ToString() == "")
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferStatusName"].ToString() + "</font></td>");
                        }
                        else
                        {
                            str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["offerPrevStatus"].ToString() + "/" + dr["OfferStatusName"].ToString() + "</font></td>");
                        }
                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferStatusName"].ToString() + "</font></td>");
                    }

                    if (dr["OfferStatusID"].ToString() != "" && (dr["OfferStatusID"].Equals(240) || dr["OfferStatusID"].Equals(260)))
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dropReason"].ToString() + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");
                    }
                    if (dr["OfferStatusID"].ToString() != "" && (dr["OfferStatusID"].Equals(240) || dr["OfferStatusID"].Equals(260)))
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["dropRemarks"].ToString() + "</font></td>");

                    }
                    else
                    {
                        str.Append("<td><font face='Calibri' size=" + "12px" + ">" + "NA" + "</font></td>");
                    }

                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "Selected_Candidates_Report.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }


        [Route("ExportToExcelApprovedCandidateList")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelApprovedCandidateList([FromBody] OfferGenerationFilter obj)
        {
            obj.page = 1;
            obj.pageSize = 100000;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Talent ID</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Cid</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Candidate Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Gender</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Phone No</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Secondary Recruiter</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Interview Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Profile Source</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Date of offer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Revised Date of offer</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Status</font></b></td>");
            str.Append("</tr>");
            int result;
            DataSet ds = objRepo.GetApprovedCandidatesList(claims[5].Value, obj, out result);
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
                    //str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Rc.CIDPrefix(Convert.ToInt32(dr["ProfileId"])) + dr["cid"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Name"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Gender"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["primaryskill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["email"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["phone"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["recruiter"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["secondaryrecruiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["interviewType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ProfileSource"].ToString() + "</font></td>");

                    if (dr["DateOfOffer"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["DateOfOffer"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    if (dr["RevisedOfferDate"].ToString() == "") { str.Append("<td><font face='Calibri' size=" + "12px" + "></font></td>"); }
                    else { str.Append("<td><font face='Calibri' size=" + "12px" + ">" + Convert.ToDateTime(dr["RevisedOfferDate"]).ToString("dd MMM yyyy") + "</font></td>"); }

                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferStatusName"].ToString() + "</font></td>");
                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "ApprovedCandidateList.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [Route("updateDropReasonOfferedCandByCid")]
        [HttpPost]
        public IHttpActionResult updateDropReasonOfferedCandByCid(int Cid, int StatusId, int DropReasonId, string DropRemark = null)
        {
            string methodName = nameof(updateDropReasonOfferedCandByCid);
            logger.LogRequestAsync(methodName, Request);

            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

            try
            {
                string EmpID = claims[5].Value; // New Employee ID
                int result = objRepo.updateDropReasonOfferedCandByCid(Cid, StatusId, EmpID, DropReasonId, DropRemark);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                else if (result > 0 && Cid > 0)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok("Candidate Details Updated Successfully.");
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Interview", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getDelegationRightsList")]
        [HttpGet]
        public IHttpActionResult getDelegationRightsList(int page, int pageSize, string search = "")
        {
            string methodName = nameof(getDelegationRightsList);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getDelegationRightsList(claims[5].Value, page, pageSize, out result, search);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addDelegation")]
        [HttpPost]
        public IHttpActionResult addDelegation(string DelegateTo, string FromDate, string ToDate, string Approver, string Remarks = "")
        {
            string methodName = nameof(addDelegation);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string ApproverID = Approver == "null" || Approver == "" ? claims[5].Value : Approver;
                string Message = string.Empty;
                int result = objRepo.addDelegation(DelegateTo, FromDate, ToDate, claims[5].Value, out Message, Remarks, ApproverID);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                else if (result == 1)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("RevokeDelegation")]
        [HttpPost]
        public IHttpActionResult RevokeDelegation(int ID, string Remarks)
        {
            string methodName = nameof(RevokeDelegation);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.RevokeDelegation(ID, claims[5].Value, out Message, Remarks);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                else if (result == 1)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateListByTalentId")]
        [HttpGet]
        public IHttpActionResult GetCandidateListByTalentId(int thid)
        {
            string methodName = nameof(GetCandidateListByTalentId);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateListByTalentId(thid, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetFieldsList")]
        [HttpGet]
        public IHttpActionResult GetFieldsList()
        {
            string methodName = nameof(GetFieldsList);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetFieldsList(claims[5].Value);

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getTalentIdCurrentDetails")]
        [HttpGet]
        public IHttpActionResult getTalentIdCurrentDetails(int cid)
        {
            string methodName = nameof(getTalentIdCurrentDetails);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getTalentIdCurrentDetails(cid, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getTransferTalentIdDetails")]
        [HttpGet]
        public IHttpActionResult getTransferTalentIdDetails(int cid, int TransferTHID)
        {
            string methodName = nameof(getTransferTalentIdDetails);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getTransferTalentIdDetails(cid, TransferTHID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("TransferTalentIdwithTC")]
        [HttpPost]
        public IHttpActionResult TransferTalentIdwithTC(THIDTransferWithTC OBJ)
        {
            string methodName = nameof(TransferTalentIdwithTC);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.TransferTalentIdwithTC(OBJ, claims[5].Value, out Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                else if (result == 1)
                {
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetJustification_BucketList")]
        [HttpGet]
        public IHttpActionResult GetJustification_BucketList()
        {
            string methodName = nameof(GetJustification_BucketList);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                return Ok(objRepo.GetJustification_BucketList());
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("addUpdateOfferApprovalSupport")]
        [HttpPost]
        public IHttpActionResult addUpdateOfferApprovalSupport(OfferApprovalModel obj)
        {
            string methodName = nameof(addUpdateOfferApprovalSupport);
            logger.LogRequestAsync(methodName, Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                int result = objRepo.addUpdateOfferApprovalSupport(obj, claims[5].Value, ref Message, ref ActionId);
                DataSet ds = objRepo.IsDateofJoiningChange(obj.cid);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                if (ds.Tables[0].Rows[0]["IsDateofJoiningChange"].ToString() == "1")
                {
                    System.Threading.Tasks.Task<int> Move = MoveFolder(obj.cid);
                }
                if (result > 0)
                {
                    var responseObj1 = new { ActionID = ActionId, Message = Message };
                    logger.LogResponseAsync(methodName, "200 OK");
                    return Ok(responseObj1);
                }
                else if (result < 0)
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync(methodName, "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getFunctionHeadApproverList")]
        [HttpGet]
        public IHttpActionResult GetFunctionHeadApproverList()
        {
            string methodName = nameof(GetFunctionHeadApproverList);
            logger.LogRequestAsync(methodName, Request);

            try
            {

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;

                var data = objRepo.GetFunctionHeadApproverList(claims[5].Value, out result);


                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, methodName, claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync(methodName, "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync(methodName, ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", methodName);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getEmployeeAllotmentDetails")]
        [HttpGet]
        public IHttpActionResult getEmployeeAllotmentDetails(int thid)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getEmployeeAllotmentDetails(thid, claims[5].Value, out result);
                logger.LogRequestAsync("getEmployeeAllotmentDetails", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getEmployeeAllotmentDetails", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("getEmployeeAllotmentDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getEmployeeAllotmentDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "getEmployeeAllotmentDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("RegenrateOffer")]
        [HttpPost]
        public IHttpActionResult RegenrateOffer(int cid, char isCopyOnMurcury = 'N')
        {
            try
            {
                PdfModel model = new PdfModel();
                model.cid = cid;
                model.IsOfferGenExternal = 'Y';
                model.IsSaveOnMarcury = isCopyOnMurcury;
                DataSet ds = objRepo.GetCandidateInformationForPDF(model, cid.ToString());
                logger.LogRequestAsync("RegenrateOffer", Request);
                int result = 0;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows[0]["Division"].ToString() == "1" || ds.Tables[0].Rows[0]["Division"].ToString() == "2")
                    {
                        result = GeneratePDFInfogainNNT(ds, model.cid.ToString(), 'Y');
                    }
                    else if (ds.Tables[0].Rows[0]["Division"].ToString() == "7")
                    {
                        result = GeneratePDFADT(ds, model.cid.ToString(), 'Y');
                    }
                    if (result == 1)
                    {
                        if (isCopyOnMurcury == 'Y')
                        {
                            System.Threading.Tasks.Task<int> copyOffer = CopyOfferToMurcury(cid.ToString());
                        }
                        logger.LogResponseAsync("RegenrateOffer", "200 OK");
                        return Ok("Offer Generated");
                    }
                    else
                    {
                        logger.LogResponseAsync("RegenrateOffer", "400 Bad Request");
                        return BadRequest("There is some error! Try again later");
                    }
                }
                logger.LogResponseAsync("RegenrateOffer", "400 Bad Request");
                return BadRequest("Offer details does not exists");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("RegenrateOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "RegenrateOffer");
                return BadRequest("There is some error! Try again later");
            }
        }

        public async System.Threading.Tasks.Task<int> SaveUpdateOfferTemplatesAsync(SaveUpdateOfferTemplatesModel obj)
        {

            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                   
                    //update result
                    int update = objRepo.SaveUpdateOfferTemplates(obj);                    
                    if (update == 1)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }

                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "offer Async", "SaveUpdateOfferTemplates");
                    return 0;
                }

            });
            return 0;
        }

        [NonAction]
        public async Task<int> CopyOfferToMurcury(string cid, string Empid = "")
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    Common com = new Common();
                    //var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                    DataSet ds = objRepo.GetOfferDocumentDetailForCopyToMurcury(Convert.ToInt32(cid), Empid);

                    if (ds != null && ds.Tables.Count > 0)
                    {
                        //HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                        string filePath = "";

                        filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds.Tables[0].Rows[0]["OfferFileName"].ToString();

                        string fileName = Path.GetFileName(filePath);
                        string originalFileName = common.RemoveLastExtension(fileName);

                        if (!File.Exists(filePath))
                        {
                            //response.StatusCode = HttpStatusCode.NotFound;
                            //throw new HttpResponseException(response);
                        }

                        byte[] encryptedBytes;

                        using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                        {
                            encryptedBytes = new byte[fs.Length];
                            fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                        }

                        byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                        byte[] bytes = common.DecryptFile(encryptedBytes);
                       // byte[] bytes = File.ReadAllBytes(filePath);
                        //DataSet result = objRepo.GetCandidateLocationDivision(cid);


                        string TempPath = "";
                       // string path = "";
                        string path = com.GetPathMurcuryToUploadBackPaper(Convert.ToInt32(cid), Empid);
                       
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }

                        string newPath = Path.Combine(path, originalFileName);
                        File.WriteAllBytes(newPath, bytes);

                        int result = objRepo.UpdatePathCopyToMurcury(Empid, Convert.ToInt32(cid),"OfferLetter",path + "\\" + ds.Tables[0].Rows[0]["OfferFileName"].ToString());
                    }
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "offer ", "CopyOffer murcury");
                }
            });
            return 1;
        }


        [Route("FolderMove")]
        [HttpGet]
        public IHttpActionResult FolderMove(int cid)
        {
            try
            {
                System.Threading.Tasks.Task<int> Move = MoveFolder(cid);
                return Ok();
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Offer", "FolderMove");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public async System.Threading.Tasks.Task<int> MoveFolder(int cid)
        {
            return await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                    string currentFolderPath = GetCurrentFolderPath(cid);

                    if (!Directory.Exists(currentFolderPath))
                    {
                        Console.WriteLine($"Source folder not found: {currentFolderPath}");
                        return 0;
                    }

                    DataSet result = objRepoOnb.GetCandidateLocationDivision(cid);

                    string candidateName = result.Tables[0].Rows[0]["FullName"].ToString();
                    string empLocation = result.Tables[0].Rows[0]["JoiningLocation"].ToString();
                    int division = Convert.ToInt32(result.Tables[0].Rows[0]["divisionid"]);

                    DateTime currentDate = Convert.ToDateTime(result.Tables[0].Rows[0]["DateOfJoining"]);
                    string currentYear = currentDate.ToString("yyyy");
                    string currentMonth = currentDate.ToString("MMMM");

                    string newBasePath = GetBasePath(empLocation);
                    string newPath = Path.Combine(newBasePath, currentYear, currentMonth, candidateName);

                    if (!Directory.Exists(newPath))
                    {
                        Directory.CreateDirectory(newPath);
                    }

                    DirectoryCopy(currentFolderPath, newPath, true);

                    objRepo.AddupdateFolderPathOnboarding(cid, currentFolderPath, newPath, claims[5].Value);

                    objRepo.UpdatePdfPath(cid, newPath);

                    Directory.Delete(currentFolderPath, true);

                    return 1;
                }
                catch (Exception ex)
                {
                    // Log the exception (implement ExceptionLogging.SendExcepToDB as needed)
                    ExceptionLogging.SendExcepToDB(ex, "OnBoard", "MoveFolder");
                    return 0;
                }
            });
        }

        private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
        {
            // Get the subdirectories for the specified directory.
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);

            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: "
                    + sourceDirName);
            }

            DirectoryInfo[] dirs = dir.GetDirectories();
            // If the destination directory doesn't exist, create it.
            Directory.CreateDirectory(destDirName);

            // Get the files in the directory and copy them to the new location.
            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                string temppath = Path.Combine(destDirName, file.Name);
                file.CopyTo(temppath, false);
            }

            // If copying subdirectories, copy them and their contents to new location.
            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    string temppath = Path.Combine(destDirName, subdir.Name);
                    DirectoryCopy(subdir.FullName, temppath, copySubDirs);
                }
            }
        }

        private string GetCurrentFolderPath(int cid)
        {
            try
            {
                DataSet ds = objRepoOnb.GetCandidateLocationDivision(cid);
                string candidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
                string empLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();
                DateTime DOJ = Convert.ToDateTime(ds.Tables[0].Rows[0]["PrevDateOfJoining"]);

                string Year = DOJ.ToString("yyyy");
                string Month = DOJ.ToString("MMMM");

                string newBasePath = GetBasePath(empLocation);
                string path = Path.Combine(newBasePath, Year, Month, candidateName);

                //string path= ConfigurationManager.AppSettings["OnboardFormDocuments"];
                //path= path + empLocation + "\\" + Year + "\\" + Month + "\\" + candidateName;

                //Console.WriteLine(path);

                if (Directory.Exists(path))
                {
                    return path;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetCurrentFolderPath");
                return null;
            }
        }

        private string GetBasePath(string empLocation)
        {
            if (empLocation == "Noida")
            {
                return ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
            }
            else if (empLocation == "Bangalore")
            {
                return ConfigurationManager.AppSettings["OnboardFormDocumentsBangalore"];
            }
            else if (empLocation == "Mumbai")
            {
                return ConfigurationManager.AppSettings["OnboardFormDocumentsMumbai"];
            }
            else if (empLocation == "Pune")
            {
                return ConfigurationManager.AppSettings["OnboardFormDocumentsPune"];
            }
            else if (empLocation == "Gurugram")
            {
                return ConfigurationManager.AppSettings["OnboardFormDocumentsGurugram"];
            }
            else
            {
                return ConfigurationManager.AppSettings["OnboardFormDocuments"];
            }
        }


        [Route("AddTidReopenOfferApprovalAttachment")]
        [HttpPost]
        public IHttpActionResult AddTidReopenOfferApprovalAttachment()
        {
            try
            {
                int result = 0;
                OfferApprovalDoc model = new OfferApprovalDoc();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                logger.LogRequestAsync("AddTidReopenOfferApprovalAttachment", Request);
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        ApprovalAttachment att = new ApprovalAttachment();
                        att.FileName = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i].FileName);
                        model.ApprovalAttachments.Add(att);
                    }
                    model.Cid = Convert.ToInt32(frm["cid"]);
                    model.ActionTakenBy = frm["ActionTakenBy"].ToString();
                    model.ActionId = Convert.ToInt32(frm["ActionId"]);
                    result = objRepo.AddTidReopenOfferApprovalAttachment(model, claims[5].Value);
                    var authResult = cm.HandleAuthorizationResult(result);
                    if (authResult != null)
                    {
                        logger.LogUnauthorizedAccessAsync(Request, "AddTidReopenOfferApprovalAttachment", claims[5].Value);
                        return authResult;
                    }
                }
                if (result > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        var httpPostedFile = HttpContext.Current.Request.Files[i];
                        string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "ApprovalDoc" + "\\" + model.Cid.ToString() + "\\";
                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[i].FileName));
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
                            return InternalServerError(new Exception("Error encrypting the file."));
                        }
                    }
                    logger.LogResponseAsync("AddTidReopenOfferApprovalAttachment", "200 OK");
                    return Ok("Offer approval saved successfully");
                }
                else
                {
                    logger.LogResponseAsync("AddTidReopenOfferApprovalAttachment", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddTidReopenOfferApprovalAttachment", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "AddTidReopenOfferApprovalAttachment");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadTidReopenOffrApprovalDocumet")]
        [HttpGet]
        public HttpResponseMessage DownloadTidReopenOffrApprovalDocumet(int Id)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("DownloadTidReopenOffrApprovalDocumet", Request);
                DataSet ds = objRepo.GetTidReopenOfferApprovalFileName(Id, claims[5].Value, out result);
                if (ds != null && ds.Tables.Count > 0)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    string filePath = ConfigurationManager.AppSettings["OfferLetterPath"] + "ApprovalDoc" + "\\" + ds.Tables[0].Rows[0]["cid"].ToString() + "\\" + ds.Tables[0].Rows[0]["FileName"].ToString();
                    string fileName = Path.GetFileName(filePath);
                    if (!File.Exists(filePath))
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        throw new HttpResponseException(response);
                    }
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
                        logger.LogResponseAsync("DownloadTidReopenOffrApprovalDocumet", "400 Bad Request");
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "File decryption failed.");
                    }
                    byte[] bytes = File.ReadAllBytes(filePath);
                    response.Content = new ByteArrayContent(bytes);
                    response.Content.Headers.ContentLength = bytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));
                    logger.LogResponseAsync("DownloadTidReopenOffrApprovalDocumet", "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "File not found");
                logger.LogResponseAsync("DownloadTidReopenOffrApprovalDocumet", "400 Bad Request");
                return response1;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadTidReopenOffrApprovalDocumet", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("GetAllReopenedSelectedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetAllReopenedSelectedCandidatesList(OfferGenerationFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetAllReopenedSelectedCandidatesList", Request);
                var data = objRepo.GetAllReopenedSelectedCandidatesList(claims[5].Value, obj, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAllReopenedSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetAllReopenedSelectedCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllReopenedSelectedCandidatesList", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetAllReopenedSelectedCandidatesList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateDetailsForApproval")]
        [HttpGet]
        public IHttpActionResult GetCandidateDetailsForApproval(int cid)
        {
            logger.LogRequestAsync("GetCandidateDetailsForApproval", Request);

            try
            {
                int result;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetCandidateDetailsForApproval(cid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAllReopenedSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetAllReopenedSelectedCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateDetailsForApproval", ex);
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GetCandidateDetailsForApproval");
                return BadRequest("There is some error! Try again later");
            }

        }


    }


}
