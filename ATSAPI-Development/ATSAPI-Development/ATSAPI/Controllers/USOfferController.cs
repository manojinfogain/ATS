using ATSAPI.App_Data;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Security.Claims;
using ATSAPI.Models;
using System.Configuration;
using System.Data;
using System.IO;
using System.Web;
using Aspose.Pdf;
using ATSAPI.common;
using System.Text;
using Aspose.Pdf.Text;
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.Net.Http.Headers;
using TimeZoneConverter;

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/USOffer")]
    public class USOfferController : ApiController
    {
        USOfferRepository objRepo = new USOfferRepository();
        Common common = new Common();
        ATSMailers Mailers = new ATSMailers();
        CommonController cm = new CommonController();
        Logger logger = new Logger();

        [Route("GetVisaTypes")]
        [HttpGet]
        public IHttpActionResult GetVisaTypes()
        {
            logger.LogRequestAsync("GetVisaTypes", Request);
            try
            {
                var data = objRepo.GetVisaTypes();
                logger.LogResponseAsync("GetVisaTypes", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetVisaTypes");
                logger.LogErrorAsync("GetVisaTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetI9RepresentativeList")]
        [HttpGet]
        public IHttpActionResult GetI9RepresentativeList()
        {
            logger.LogRequestAsync("GetI9RepresentativeList", Request);
            try
            {
                var data = objRepo.GetI9RepresentativeList();
                logger.LogResponseAsync("GetI9RepresentativeList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetI9RepresentativeList");
                logger.LogErrorAsync("GetI9RepresentativeList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetLegalEntity")]
        [HttpGet]
        public IHttpActionResult GetLegalEntity()
        {
            logger.LogRequestAsync("GetLegalEntity", Request);
            try
            {
                var data = objRepo.GetLegalEntity();
                logger.LogResponseAsync("GetLegalEntity", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetLegalEntity");
                logger.LogErrorAsync("GetLegalEntity", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetUSOfferTypeMasterList")]
        [HttpGet]
        public IHttpActionResult GetUSOfferTypeMasterList()
        {
            logger.LogRequestAsync("GetUSOfferTypeMasterList", Request);
            try
            {
                var data = objRepo.GetUSOfferTypeMasterList();
                logger.LogResponseAsync("GetUSOfferTypeMasterList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetUSOfferTypeMasterList");
                logger.LogErrorAsync("GetUSOfferTypeMasterList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDepartmentList")]
        [HttpGet]
        public IHttpActionResult GetDepartmentList()
        {
            logger.LogRequestAsync("GetDepartmentList", Request);
            try
            {
                var data = objRepo.GetDepartmentList();
                logger.LogResponseAsync("GetDepartmentList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetDepartmentList");
                logger.LogErrorAsync("GetDepartmentList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetHireVsRehireList")]
        [HttpGet]
        public IHttpActionResult GetHireVsRehireList()
        {
            logger.LogRequestAsync("GetHireVsRehireList", Request);
            try
            {
                var data = objRepo.GetHireVsRehireList();
                logger.LogResponseAsync("GetHireVsRehireList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetHireVsRehireList");
                logger.LogErrorAsync("GetHireVsRehireList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRemoteStatusList")]
        [HttpGet]
        public IHttpActionResult GetRemoteStatusList()
        {
            logger.LogRequestAsync("GetRemoteStatusList", Request);
            try
            {
                var data = objRepo.GetRemoteStatusList();
                logger.LogResponseAsync("GetRemoteStatusList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetRemoteStatusList");
                logger.LogErrorAsync("GetRemoteStatusList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetFLSAClassificationList")]
        [HttpGet]
        public IHttpActionResult GetFLSAClassificationList()
        {
            logger.LogRequestAsync("GetFLSAClassificationList", Request);
            try
            {
                var data = objRepo.GetFLSAClassificationList();
                logger.LogResponseAsync("GetFLSAClassificationList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetFLSAClassificationList");
                logger.LogErrorAsync("GetFLSAClassificationList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentCubeList")]
        [HttpGet]
        public IHttpActionResult GetTalentCubeList()
        {
            logger.LogRequestAsync("GetTalentCubeList", Request);
            try
            {
                var data = objRepo.GetTalentCubeList();
                logger.LogResponseAsync("GetTalentCubeList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetTalentCubeList");
                logger.LogErrorAsync("GetTalentCubeList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetNumberOfApprovers")]
        [HttpGet]
        public IHttpActionResult GetNumberOfApprovers(int TCID, int gradeID, decimal ctc, decimal joiningBonus, int CityID, int CondidateTypeId)
        {
            logger.LogRequestAsync("GetNumberOfApprovers", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetNumberOfApprovers(TCID, gradeID, ctc, joiningBonus, CityID, claims[5].Value, CondidateTypeId);
                //var authResult = cm.HandleAuthorizationResult(result);
                //if (authResult != null) return authResult;
                logger.LogResponseAsync("GetNumberOfApprovers", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetNumberOfApprovers");
                logger.LogErrorAsync("GetNumberOfApprovers", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DgmCalculater")]
        [HttpPost]
        public IHttpActionResult DgmCalculater(dgmCalcModelUS obj)
        {
            logger.LogRequestAsync("DgmCalculater", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                //var data = objRepo.DgmCalculater(obj, claims[5].Value);
                //logger.LogResponseAsync("DgmCalculater", "200 OK");
                //return Ok(data);

                int result;
                var data = objRepo.DgmCalculater(obj, claims[5].Value);
                //var authResult = cm.HandleAuthorizationResult(result);
                //if (authResult != null) return authResult;
                logger.LogResponseAsync("DgmCalculater", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "DgmCalculater");
                logger.LogErrorAsync("DgmCalculater", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSelectedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetSelectedCandidatesList(OfferGenerationFilter obj)
        {
            logger.LogRequestAsync("GetSelectedCandidatesList", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetSelectedCandidatesList(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetSelectedCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetSelectedCandidatesList");
                logger.LogErrorAsync("GetSelectedCandidatesList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getTagHeadApproverList")]
        [HttpGet]
        public IHttpActionResult getTagHeadApproverList()
        {
            logger.LogRequestAsync("getTagHeadApproverList", Request);
            try
            {
                var data = objRepo.getTagHeadApproverList();
                logger.LogResponseAsync("getTagHeadApproverList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "getTagHeadApproverList");
                logger.LogErrorAsync("getTagHeadApproverList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getApproverList")]
        [HttpGet]
        public IHttpActionResult getApproverList(int cid, int reqType, int type = 1)
        {
            logger.LogRequestAsync("getApproverList", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getApproverList(claims[5].Value, type, cid, reqType);
                logger.LogResponseAsync("getApproverList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "getApproverList");
                logger.LogErrorAsync("getApproverList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("addUpdateOfferApprovalForUS")]
        [HttpPost]
        public IHttpActionResult addUpdateOfferApprovalForUS(USOfferApprovalModel obj)
        {
            logger.LogRequestAsync("addUpdateOfferApprovalForUS", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                obj.OfferedOnTimeZone = TZConvert.IanaToWindows(obj.OfferedOnTimeZone);
                obj.AddedOnTimeZone = TZConvert.IanaToWindows(obj.AddedOnTimeZone);
                obj.ModifiedOnTimeZone = TZConvert.IanaToWindows(obj.ModifiedOnTimeZone);
                obj.RevisedOfferDateTimeZone = TZConvert.IanaToWindows(obj.RevisedOfferDateTimeZone);

                int result = objRepo.addUpdateOfferApprovalForUS(obj, claims[5].Value, ref Message, ref ActionId);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    var responseObj1 = new { ActionID = ActionId, Message = Message };
                    logger.LogResponseAsync("addUpdateOfferApprovalForUS", "200 OK");
                    return Ok(responseObj1);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "addUpdateOfferApprovalForUS");
                logger.LogErrorAsync("addUpdateOfferApprovalForUS", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateOfferApprovalStatusForUS")]
        [HttpPost]
        public IHttpActionResult UpdateOfferApprovalStatusForUS(UpdateOfferApprovalStatusForUS obj)
        {
            logger.LogRequestAsync("UpdateOfferApprovalStatusForUS", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                obj.ModifiedOnTimeZone = TZConvert.IanaToWindows(obj.ModifiedOnTimeZone);
                int result = objRepo.UpdateOfferApprovalStatusForUS(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("UpdateOfferApprovalStatusForUS", "200 OK");
                if (result == 1)
                    return Ok(Message);
                else if (result == -2)
                    return Ok(Message);
                else if (result == -3)
                    return BadRequest(Message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "UpdateOfferApprovalStatusForUS");
                logger.LogErrorAsync("UpdateOfferApprovalStatusForUS", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddOfferApprovalAttachmentForUS")]
        [HttpPost]
        public IHttpActionResult AddOfferApprovalAttachmentForUS()
        {
            logger.LogRequestAsync("AddOfferApprovalAttachmentForUS", Request);
            try
            {
                int result = 0;
                OfferApprovalDocForUS model = new OfferApprovalDocForUS();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        AttachmentforUS att = new AttachmentforUS
                        {
                            FileName = HttpContext.Current.Request.Files[i].FileName
                        };
                        model.AttachmentforUS.Add(att);
                    }
                    model.Cid = Convert.ToInt32(frm["cid"]);
                    model.ActionTakenBy = frm["ActionTakenBy"].ToString();
                    model.ActionId = Convert.ToInt32(frm["ActionId"]);
                    result = objRepo.AddOfferApprovalAttachmentForUS(model, claims[5].Value);
                    var authResult = cm.HandleAuthorizationResult(result);
                    if (authResult != null) return authResult;
                }

                if (result > 0)
                {
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        var httpPostedFile = HttpContext.Current.Request.Files[i];
                        string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName) + Path.GetExtension(httpPostedFile.FileName);
                        string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "ApprovalDoc\\" + model.Cid + "\\";
                        if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);
                        string fileSavePath = Path.Combine(tempPath, filedetails);
                        if (System.IO.File.Exists(fileSavePath)) File.Delete(fileSavePath);
                        httpPostedFile.SaveAs(fileSavePath);
                    }
                    logger.LogResponseAsync("AddOfferApprovalAttachmentForUS", "200 OK");
                    return Ok("Offer Saved successfully");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "AddOfferApprovalAttachmentForUS");
                logger.LogErrorAsync("AddOfferApprovalAttachmentForUS", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GenerateOffer")]
        [HttpPost]
        public IHttpActionResult GenerateOffer()
        {
            logger.LogRequestAsync("GenerateOffer", Request);
            try
            {
                OfferPDFModelUS model = new OfferPDFModelUS();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                model.cid = Convert.ToInt32(frm["cid"]);
                model.currentAddress.addressLine1 = frm["addressLine1"];
                model.currentAddress.addressLine2 = frm["addressLine2"];
                model.currentAddress.city = frm["city"];
                model.currentAddress.state = frm["state"];
                model.currentAddress.postalCode = frm["postalCode"];
                model.currentAddress.country = frm["country"];
                model.FinalBasePay = Convert.ToDecimal(frm["finalBasePay"]);
                model.FinalJoiningBonus = Convert.ToDecimal(frm["FinalJoiningBonus"]);
                model.FinalRelocationPay = Convert.ToDecimal(frm["FinalRelocationPay"]);
                model.FinalIncentiveBonus = Convert.ToDecimal(frm["FinalIncentiveBonus"]);
                model.ApprovedBasePay = Convert.ToDecimal(frm["ApprovedBasePay"]);
                model.JoiningLocationID = Convert.ToInt32(frm["joiningLocation"] ?? "0");
                model.FinalPerformanceBonus = Convert.ToDecimal(frm["FinalPerformanceBonus"]);
                model.FinalVisaCost = Convert.ToDecimal(frm["FinalVisaCost"]);
                model.isShippingAddrConfirm = Convert.ToInt32(frm["isShippingAddrConfirm"] ?? "0");
                model.LaptopMachine = Convert.ToInt32(frm["LaptopMachine"] ?? "0");
                model.FinalAnnualVariablePay = Convert.ToDecimal(frm["FinalAnnualVariablePay"]);
                model.DateOfOfferResponse = frm["DateOfOfferResponse"];
                model.startDate = frm["startDate"];
                model.InternEndDate = frm["InternEndDate"];
                model.IsOfferGenExternal = 'N';
                model.ModifiedOnUTC = frm["ModifiedOnUTC"];
                model.ModifiedOnTimeZone = TZConvert.IanaToWindows(frm["ModifiedOnTimeZone"]);
                model.ModifiedOnOffsetDate = Convert.ToInt32(frm["ModifiedOnOffsetDate"]);
                model.IsStartDateTentativeOrConfirmed = Convert.ToChar(frm["isStartDateTentativeOrConfirmed"] ?? "0");

                if (model.FinalBasePay > model.ApprovedBasePay)
                {
                    return BadRequest("Final Base pay Should be less than or equal to Approved Base pay");
                }

                int result1;
                DataSet ds = objRepo.GetCandidateInformationForPDF(model, claims[5].Value, out result1);
                var authResult = cm.HandleAuthorizationResult(result1);
                if (authResult != null) return authResult;

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    int result = GeneratePDFUS(ds, model.cid.ToString());
                    if (result == 1)
                    {
                        GenerateEmployeeAgreeMent(ds, model.cid.ToString());
                        logger.LogResponseAsync("GenerateOffer", "200 OK");
                        return Ok("Offer Generated");
                    }
                    else
                    {
                        return BadRequest("There is some error! Try again later");
                    }
                }
                return BadRequest("Offer details do not exist");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GenerateOffer");
                logger.LogErrorAsync("GenerateOffer", ex);
                return BadRequest("There is some error! Try again later");
            }
        }




        [NonAction]
        public int GeneratePDFUS(DataSet ds, string cid)
        {
            string ImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 0;
            objLoadOptions.PageInfo.Margin.Top = 80;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();

            String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
            String OfferLetterName = ds.Tables[0].Rows[0]["OfferLetterName"].ToString();
            String OfferSignPath = ds.Tables[0].Rows[0]["OfferSignPath"].ToString();
            String offerTemp = ds.Tables[0].Rows[0]["Offer"].ToString();
            string base64PdfSign = "";
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
                //    offerTemp= offerTemp.Replace("[candidatesign]", base64PdfSign.ToString());
                    offerTemp = offerTemp.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                }
                else
                {
                    offerTemp = offerTemp.Replace("[candidatesign]", "");
                }
            }
            // String offerTemp = ds.Tables[0].Rows[0]["Offer"].ToString()
            
            Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(offerTemp.ToString())), objLoadOptions);
            doc.SetTitle(ds.Tables[0].Rows[0]["CandidateName"].ToString());

            foreach (Page page in doc.Pages)
            {
                TextStamp textStamp = null;

                textStamp = new TextStamp(ds.Tables[0].Rows[0]["Line1Footer"].ToString());
                textStamp.BottomMargin = 50;
                textStamp.TextState.FontSize = 10.0F;
                textStamp.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.Gray);
                textStamp.HorizontalAlignment = HorizontalAlignment.Center;
                textStamp.VerticalAlignment = VerticalAlignment.Bottom;
                page.AddStamp(textStamp);

                textStamp = new TextStamp(ds.Tables[0].Rows[0]["Line2Footer"].ToString());
                textStamp.BottomMargin = 30;
                textStamp.TextState.FontSize = 7.0F;
                textStamp.TextState.FontStyle = FontStyles.Bold;
                textStamp.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.Gray);
                textStamp.HorizontalAlignment = HorizontalAlignment.Center;
                textStamp.VerticalAlignment = VerticalAlignment.Bottom;

                page.AddStamp(textStamp);
                textStamp = new TextStamp(ds.Tables[0].Rows[0]["Line3Footer"].ToString());
                textStamp.BottomMargin = 20;
                textStamp.TextState.FontSize = 7.0F;
                textStamp.TextState.FontStyle = FontStyles.Bold;
                textStamp.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.Gray);
                textStamp.HorizontalAlignment = HorizontalAlignment.Center;
                textStamp.VerticalAlignment = VerticalAlignment.Bottom;

                page.AddStamp(textStamp);
                textStamp = new TextStamp(ds.Tables[0].Rows[0]["Line4Footer"].ToString());
                textStamp.BottomMargin = 10;
                textStamp.TextState.FontSize = 6.0F;
                textStamp.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.Gray);
                textStamp.HorizontalAlignment = HorizontalAlignment.Center;
                textStamp.VerticalAlignment = VerticalAlignment.Bottom;

                page.AddStamp(textStamp);

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

            //    doc.Save(path + "InfogainOffer_Aspose" + OfferLetterName + ".PDF");

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

                        string imagePath = System.IO.Path.Combine(ImpDocPath, "infogain-iconUS.png");
                        var pdfContentByte = stamper.GetOverContent(i);
                        Stream inputImageStreamBlank = null;
                        inputImageStreamBlank = new FileStream(imagePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-iconUS.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);
                        imageBlank.SetAbsolutePosition(0, 770);
                        imageBlank.Alignment = Element.ALIGN_TOP;
                        imageBlank.ScalePercent(52f);
                        pdfContentByte.AddImage(imageBlank);
                        string imagePath1 = System.IO.Path.Combine(ImpDocPath, "FooterStrip.png");
                        Stream FooterStrip = new FileStream(imagePath1, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //Stream FooterStrip = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\FooterStrip.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image FooterStripI = iTextSharp.text.Image.GetInstance(FooterStrip);
                        FooterStripI.SetAbsolutePosition(0, 65);
                        FooterStripI.Alignment = Element.ALIGN_BOTTOM;
                        pdfContentByte.AddImage(FooterStripI);
                    }
                    stamper.Close();
                    reader.Close();
                    // Convert final PDF to byte array
                    finalPdfBytes = outputPdfStream.ToArray();
                }
            }

            string fileName = common.GetFileWithAdditionalExtention(OfferLetterName + ".PDF");
            string fileSavePath = Path.Combine(path, fileName);
            int encryptionResult = common.EncryptFile(finalPdfBytes, fileSavePath);
            if (encryptionResult != 1)
            {
                //  return BadRequest("Error encrypting the file.");
                return -1;
            }

            //  Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose" + OfferLetterName + ".PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
            //   Stream outputPdfStream = new FileStream(path + OfferLetterName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

            //if (File.Exists(Path.Combine(path, "InfogainOffer_Aspose" + OfferLetterName + ".PDF")))
            //{
            //    File.Delete(Path.Combine(path, "InfogainOffer_Aspose" + OfferLetterName + ".PDF"));
            //}
            return 1;
        }

        [Route("GetApprovedCandidatesListForUS")]
        [HttpPost]
        public IHttpActionResult GetApprovedCandidatesListForUS([FromBody] OfferGenerationFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetApprovedCandidatesListForUS", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetApprovedCandidatesListForUS(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetApprovedCandidatesListForUS", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetApprovedCandidatesListForUS");
                logger.LogErrorAsync("GetApprovedCandidatesListForUS", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetUSHRList")]
        [HttpGet]
        public IHttpActionResult GetUSHRList()
        {
            try
            {
                logger.LogRequestAsync("GetUSHRList", Request);
                int result;
                var data = objRepo.GetUSHRList(out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("GetUSHRList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetUSHRList");
                logger.LogErrorAsync("GetUSHRList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateHRApproval")]
        [HttpPost]
        public IHttpActionResult AddUpdateHRApproval(HRUpdateOfferApprovalStatusForUS obj)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateHRApproval", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                obj.ActionOnTimeZone = TZConvert.IanaToWindows(obj.ActionOnTimeZone);

                int result = objRepo.AddUpdateHRApproval(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("AddUpdateHRApproval", "200 OK");
                return Ok(Message);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "AddUpdateHRApproval");
                logger.LogErrorAsync("AddUpdateHRApproval", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ApprovedOrReferrbackByHR")]
        [HttpPost]
        public IHttpActionResult ApprovedOrReferrbackByHR(UpdateOfferApprovalStatusForUS obj)
        {
            try
            {
                logger.LogRequestAsync("ApprovedOrReferrbackByHR", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;

                obj.ModifiedOnTimeZone = TZConvert.IanaToWindows(obj.ModifiedOnTimeZone);

                int result = objRepo.ApprovedOrReferrbackByHR(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("ApprovedOrReferrbackByHR", "200 OK");
                return Ok(Message);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "ApprovedOrReferrbackByHR");
                logger.LogErrorAsync("ApprovedOrReferrbackByHR", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateListForHR")]
        [HttpPost]
        public IHttpActionResult GetCandidateListForHR([FromBody] OfferGenerationFilterforUS obj)
        {
            try
            {
                logger.LogRequestAsync("GetCandidateListForHR", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateListForHR(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetCandidateListForHR", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetCandidateListForHR");
                logger.LogErrorAsync("GetCandidateListForHR", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadUSOffer")]
        [HttpGet]
        public HttpResponseMessage DownloadUSOffer(int cid)
        {
            try
            {
                logger.LogRequestAsync("DownloadUSOffer", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = objRepo.GetOfferDocumentDetailforUS(cid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;

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
                    byte[] bytes = File.ReadAllBytes(filePath);
                    response.Content = new ByteArrayContent(bytes);
                    response.Content.Headers.ContentLength = bytes.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileName;
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    logger.LogResponseAsync("DownloadUSOffer", "200 OK");
                    return response;
                }
                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.BadRequest, "Offer not generated");
                return response1;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "DownloadUSOffer");
                logger.LogErrorAsync("DownloadUSOffer", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }



        [Route("UpdateCandidateOfferDetailsStatusForUS")]
        [HttpPost]
        public IHttpActionResult UpdateCandidateOfferDetailsStatusForUS(int cid, string offerStatus, int? odid = null, string Remark = null, string DateOfJoining = null, string DeclineDate = null, int? JoinedEmpId = null, string ModifiedOnUTC = null, string ModifiedOnTimeZone = null, int? ModifiedOnOffsetDate = null, string offereddate = null, string offerAcceptanceDate = null, string OfferGenerateDate = null)
        {
            try
            {
                logger.LogRequestAsync("UpdateCandidateOfferDetailsStatusForUS", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateCandidateOfferDetailsStatusForUS(cid, claims[5].Value, offerStatus, odid, Remark, DateOfJoining, DeclineDate, JoinedEmpId, ref Message, ModifiedOnUTC, ModifiedOnTimeZone, ModifiedOnOffsetDate, offereddate, offerAcceptanceDate, OfferGenerateDate);

                if (result == 1 || result == -2)
                {
                    logger.LogResponseAsync("UpdateCandidateOfferDetailsStatusForUS", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("UpdateCandidateOfferDetailsStatusForUS", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateCandidateOfferDetailsStatusForUS", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateCandidateOfferDetailsStatusForUS", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "UpdateCandidateOfferDetailsStatusForUS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("sendOffer")]
        [HttpPost]
        public IHttpActionResult sendOffer(OfferSendModelforUS obj)
        {
            try
            {
                logger.LogRequestAsync("sendOffer", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                obj.OfferedOnTimeZone = TZConvert.IanaToWindows(obj.OfferedOnTimeZone);
                obj.ModifiedOnTimeZone = TZConvert.IanaToWindows(obj.ModifiedOnTimeZone);

                int result = objRepo.sendOffer(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result == 1)
                {
                    int res = Mailers.SendOfferLetterToCandidateMailerUS(obj.cid, claims[5].Value);
                    logger.LogResponseAsync("sendOffer", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("sendOffer", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("sendOffer", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("sendOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "sendOffer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ResendOffer")]
        [HttpPost]
        public IHttpActionResult ResendOffer(int cid)
        {
            try
            {
                logger.LogRequestAsync("ResendOffer", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int res = Mailers.SendOfferLetterToCandidateMailerUS(cid, claims[5].Value);

                if (res == 1)
                {
                    logger.LogResponseAsync("ResendOffer", "200 OK");
                    return Ok("Offer sent successfully.");
                }
                else
                {
                    logger.LogResponseAsync("ResendOffer", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ResendOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "ResendOffer");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCandidateHRApprovalDetails")]
        [HttpGet]
        public IHttpActionResult getCandidateHRApprovalDetails(int cid)
        {
            try
            {
                logger.LogRequestAsync("getCandidateHRApprovalDetails", Request);
                int result;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.getCandidateHRApprovalDetails(cid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;
                logger.LogResponseAsync("getCandidateHRApprovalDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCandidateHRApprovalDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "getCandidateHRApprovalDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UploadOffer")]
        [HttpPost]
        public IHttpActionResult UploadOffer()
        {
            try
            {
                logger.LogRequestAsync("UploadOffer", Request);
                OfferPDFModelUS model = new OfferPDFModelUS();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                // Parsing form data
                model.cid = Convert.ToInt32(frm["cid"]);
                model.FinalBasePay = Convert.ToDecimal(frm["finalBasePay"]);
                model.ApprovedBasePay = Convert.ToDecimal(frm["ApprovedBasePay"]);

                if (model.FinalBasePay > model.ApprovedBasePay)
                {
                    logger.LogResponseAsync("UploadOffer", "400 Bad Request");
                    return BadRequest("Final Base pay Should be less than or equal to approved Approved Base pay");
                }

                int result;
                DataSet ds = objRepo.GeDetailsForUploadOfferforUs(model, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();

                if (HttpContext.Current.Request.Files.Count > 0 && !string.IsNullOrEmpty(CandidateName))
                {
                    var httpPostedFile = HttpContext.Current.Request.Files["OfferLetter"];
                    if (httpPostedFile != null)
                    {
                        string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + model.cid.ToString() + "\\";
                        string filedetails = "InfogainOffer_" + CandidateName + Path.GetExtension(httpPostedFile.FileName).ToString();
                        string FileNameEnc = common.GetFileWithAdditionalExtention(filedetails);

                        if (!Directory.Exists(tempPath))
                        {
                            Directory.CreateDirectory(tempPath);
                        }

                        string fileSavePath = Path.Combine(tempPath, FileNameEnc);
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
                            logger.LogResponseAsync("UploadOffer", "400 Bad Request");
                            return BadRequest("Error encrypting the file.");
                        }
                    }

                    logger.LogResponseAsync("UploadOffer", "200 OK");
                    return Ok("Offer Uploaded Successfully.");
                }
                else
                {
                    logger.LogResponseAsync("UploadOffer", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UploadOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "UploadOffer");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetShippingLaptopList")]
        [HttpGet]
        public IHttpActionResult GetShippingLaptopList()
        {
            logger.LogRequestAsync("GetShippingLaptopList", Request);
            try
            {
                int result;
                var data = objRepo.GetShippingLaptopList(out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetShippingLaptopList", "401 Unauthorized");
                    return authResult;
                }
                logger.LogResponseAsync("GetShippingLaptopList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetShippingLaptopList", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "GetShippingLaptopList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public int GenerateEmployeeAgreeMent(DataSet ds, string cid)
        {
            string ImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];

            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 30;
            objLoadOptions.PageInfo.Margin.Top = 80;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();

            String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
            String AgreementSignPath = ds.Tables[0].Rows[0]["AgreementSignPath"].ToString();
            String EmployeeAgreement = ds.Tables[0].Rows[0]["EmployeeAgreement"].ToString();
            string base64PdfSign = "";
            if (!string.IsNullOrEmpty(AgreementSignPath))
            {
                if (File.Exists(AgreementSignPath))
                {
                    byte[] encryptedBytes;
                    string encryptedFileName = Path.GetFileName(AgreementSignPath);
                    string originalFileName = common.RemoveLastExtension(AgreementSignPath);

                    using (FileStream fs = new FileStream(AgreementSignPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        encryptedBytes = new byte[fs.Length];
                        fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(encryptedBytes);
                    base64PdfSign = Convert.ToBase64String(decryptedBytes);
                    EmployeeAgreement = EmployeeAgreement.Replace("[candidatesign]", $"data:image/png;base64,{base64PdfSign}");
                }
                else
                {
                    EmployeeAgreement = EmployeeAgreement.Replace("[candidatesign]", "");
                }
            }

            Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(EmployeeAgreement)), objLoadOptions);
            doc.SetTitle(ds.Tables[0].Rows[0]["CandidateName"].ToString());

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {

                ImageStamp imageFooter = null;

                string imagePath = System.IO.Path.Combine(ImpDocPath, "ATDfooter.jpg");
                imageFooter = new ImageStamp(imagePath);
                //imageFooter = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\ATDfooter.jpg");
                imageFooter.HorizontalAlignment = HorizontalAlignment.Center;
                imageFooter.VerticalAlignment = VerticalAlignment.Bottom;


                PageNumberStamp pageNumberStamp = null;
                foreach (Page page in doc.Pages)
                {
                    page.AddStamp(imageFooter);

                    pageNumberStamp = new PageNumberStamp();
                    // Whether the stamp is background
                    pageNumberStamp.Background = false;
                    pageNumberStamp.Format = "Page # of " + doc.Pages.Count;
                    pageNumberStamp.BottomMargin = 30;
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

            // doc.Save(path + "InfogainEmployeeAgreement_Aspose" + CandidateName + ".PDF");
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

                        Stream inputImageStreamBlank = null;
                        string imagePath1 = System.IO.Path.Combine(ImpDocPath, "infogain-icon.png");
                        inputImageStreamBlank = new FileStream(imagePath1, FileMode.Open, FileAccess.Read, FileShare.Read);
                        ////inputImageStreamBlank = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogain-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image imageBlank = iTextSharp.text.Image.GetInstance(inputImageStreamBlank);

                        imageBlank.SetAbsolutePosition(0, 770);
                        imageBlank.Alignment = Element.ALIGN_TOP;
                        imageBlank.ScalePercent(52f);
                        pdfContentByte.AddImage(imageBlank);

                    }
                    stamper.Close();
                    reader.Close();
                    // Convert final PDF to byte array
                    finalPdfBytes = outputPdfStream.ToArray();
                }
            }

            string fileName = common.GetFileWithAdditionalExtention("InfogainEmployeeAgreement_" + CandidateName + ".PDF");
            string fileSavePath = Path.Combine(path, fileName);
            int encryptionResult = common.EncryptFile(finalPdfBytes, fileSavePath);
            if (encryptionResult != 1)
            {
                //  return BadRequest("Error encrypting the file.");
                return -1;
            }

            //     Stream inputPdfStream = new FileStream(path + "InfogainEmployeeAgreement_Aspose" + CandidateName + ".PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
            //   Stream outputPdfStream = new FileStream(path + "InfogainEmployeeAgreement_" + CandidateName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

            //if (File.Exists(Path.Combine(path, "InfogainEmployeeAgreement_Aspose" + CandidateName + ".PDF")))
            //{
            //    File.Delete(Path.Combine(path, "InfogainEmployeeAgreement_Aspose" + CandidateName + ".PDF"));
            //}
            return 1;
        }

        [Route("RegenrateOffer")]
        [HttpPost]
        public IHttpActionResult RegenrateOffer(int cid)
        {
            logger.LogRequestAsync("RegenrateOffer", Request);
            try
            {
                OfferPDFModelUS model = new OfferPDFModelUS();
                model.cid = cid;
                model.IsOfferGenExternal = 'Y';
                int result1;
                DataSet ds = objRepo.GetCandidateInformationForPDF(model, cid.ToString(), out result1);
                var authResult = cm.HandleAuthorizationResult(result1);
                if (authResult != null)
                {
                    logger.LogResponseAsync("RegenrateOffer", "401 Unauthorized");
                    return authResult;
                }
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    int result = GeneratePDFUS(ds, model.cid.ToString());
                    if (result == 1)
                    {
                        GenerateEmployeeAgreeMent(ds, model.cid.ToString());
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
                return BadRequest("Offer details does not exist");
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("RegenrateOffer", ex);
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "SendOTPtoCandidateUS");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetApprovedCandidatesListReport")]
        [HttpPost]
        public IHttpActionResult GetApprovedCandidatesListReport([FromBody] OfferGenerationReportFilter obj)
        {
            logger.LogRequestAsync("GetApprovedCandidatesListReport", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetApprovedCandidatesListReport(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogResponseAsync("GetApprovedCandidatesListReport", "401 Unauthorized");
                    return authResult;
                }
                logger.LogResponseAsync("GetApprovedCandidatesListReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetApprovedCandidatesListReport", ex);
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetApprovedCandidatesListReport");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetHRApprovedCandidatesListReport")]
        [HttpPost]
        public IHttpActionResult GetHRApprovedCandidatesListReport([FromBody] OfferGenerationFilterforUS obj)
        {
            try
            {
                logger.LogRequestAsync("GetHRApprovedCandidatesListReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetCandidateListForHRReport(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetHRApprovedCandidatesListReport", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetHRApprovedCandidatesListReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetApprovedCandidatesListReport");
                logger.LogErrorAsync("GetHRApprovedCandidatesListReport", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ExportToExcelGetHiringTrackerReport")]
        [HttpPost]
        public HttpResponseMessage ExportToExcelGetHiringTrackerReport([FromBody] HiringTrackerReportFilter obj)
        {
            StringBuilder str = new StringBuilder();
            str.Append("<table border=`" + "1px" + "`b>");
            str.Append("<tr>");
            str.Append("<td><b><font face='Calibri' size='3'>Legal First Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Legal Last Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Preferred Name(if different)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Phone</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Address</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Email</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Work/Visa Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>I9 Representative</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>I9 Representative Employee Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Legal Entity</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Division</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employment Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Type</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Department Code</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Employee Unit</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Resource Find</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Title(internal)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Grade</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>New Hire v. Rehire</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Working Remote Status</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Relocation</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Total Experience</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Primary Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Sub Skill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Years of experience in Primaryskill</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Base Pay</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Annual Variable Pay</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Joining Bonus Pay</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Relocation Pay</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Medical Benefit Eligible</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>FLSA job Classification</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Account Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Previous V-?</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Studios</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Recruiter Name</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Reporting Manager</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Start Date</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Bill Rate (If Billable)</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Per Hour Cost Rate</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Margin</font></b></td>");
            str.Append("<td><b><font face='Calibri' size='3'>Offer Status</font></b></td>");
            str.Append("</tr>");


            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = objRepo.GetHiringTrackerReport(claims[5].Value, obj, out result);
            if (ds != null && ds.Tables.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    str.Append("<tr>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FirstName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["LastName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PreferredName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CPhone"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CAddress"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["CEmail"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Visa"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["I9RepresentativeName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["I9RepresentativeEMPName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["LegalEntity"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Division"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployementType"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OffertypeName"].ToString() + "</font></td>");                    
                    str.Append("<td><font face='Calibri' size='12px'>" + dr["DepartmentCode"].ToString() + " (" + dr["DepartmentId"].ToString() + ")" + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["EmployeeUnit"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ResourceFind"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TitleInternal"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Grade"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["NewHire"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["WorkingRemote"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Relocation"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["TotalExperience"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["candidatePrimarySkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["subSkill"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RelevantExperience"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BasePay"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AnnualVariablePay"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["joiningBonus"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["RelocationPay"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Medical"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["FLSA"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["AccountName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PreviousV"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Practice"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["PrimaryRecuiterName"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["ReportingManager"].ToString() + "</font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Dateofjoining"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["BillRate"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["billableHoursperDay"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["Margin"].ToString() + " </font></td>");
                    str.Append("<td><font face='Calibri' size=" + "12px" + ">" + dr["OfferStatus"].ToString() + " </font></td>");
                    str.Append("</tr>");
                }
                str.Append("</table>");
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                response.Content = new ByteArrayContent(temp);
                response.Content.Headers.ContentLength = temp.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "HiringTracker.xls";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return response;
            }
            return null;
        }

        [Route("UploadSignOffer")]
        [HttpPost]
        public IHttpActionResult UploadSignedOfferByRecruiter()
        {
            try
            {
                logger.LogRequestAsync("UploadSignedOfferByRecruiter", Request);

                UploadSignedOfferModel model = new UploadSignedOfferModel();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;

                model.cid = Convert.ToInt32(frm["cid"]);
                model.ModifiedOnTimeZone = TZConvert.IanaToWindows(frm["ModifiedOnTimeZone"]);
                model.ModifiedOnUTC = Convert.ToString(frm["ModifiedOnUTC"]);
                model.ModifiedOnOffsetDate = Convert.ToInt32(frm["ModifiedOnOffsetDate"]);

                int result;
                DataSet ds = objRepo.GeDetailsForUploadUSOfferByRecruiter(model, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UploadSignedOfferByRecruiter", claims[5].Value);
                    return authResult;
                }

                String CandidateName = String.Empty;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
                }

                if (HttpContext.Current.Request.Files.Count > 0 && CandidateName != "")
                {
                    var httpPostedFile = HttpContext.Current.Request.Files;

                    if (httpPostedFile["OfferLetter"] != null)
                    {
                        string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + model.cid.ToString() + "\\";
                        string filedetails = "InfogainOffer_" + CandidateName + Path.GetExtension(Path.GetFileNameWithoutExtension(httpPostedFile["OfferLetter"].FileName)).ToString() + Path.GetExtension(httpPostedFile["OfferLetter"].FileName).ToString();
                        string FileNameEnc = common.GetFileWithAdditionalExtention(filedetails);

                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }

                        string fileSavePath = Path.Combine(tempPath, FileNameEnc);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }

                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile["OfferLetter"].InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }

                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                        if (encryptionResult != 1)
                        {
                            return BadRequest("Error encrypting the file.");
                        }
                    }

                    return Ok("Offer Uploaded Successfully.");
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "USOffer", "UploadSignedOffer");
                logger.LogErrorAsync("UploadSignedOfferByRecruiter", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetHiringTrackerReport")]
        [HttpPost]
        public IHttpActionResult GetHiringTrackerReport([FromBody] HiringTrackerReportFilter obj)
        {
            try
            {
                logger.LogRequestAsync("GetHiringTrackerReport", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetHiringTrackerReport(claims[5].Value, obj, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetHiringTrackerReport", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetHiringTrackerReport", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "GetHiringTrackerReport");
                logger.LogErrorAsync("GetHiringTrackerReport", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        private void AppendRow(StringBuilder str, string header, string value)
        {
            str.Append("<tr>");
            str.Append("<td style='text-align:left; background-color:#E0FFFF;'><b><font face='Calibri' size='3'>" + header + "</font></b></td>");
            str.Append("<td style='text-align:left;'><font face='Calibri' size='3'>" + value + "</font></td>");
            str.Append("</tr>");
        }

        [Route("ExportToExcelGetCandidateWiseHiringTrackerReport")]
        [HttpGet]
        public HttpResponseMessage ExportToExcelGetCandidateWiseHiringTrackerReport(int cid)
        {

            try
            {
                StringBuilder str = new StringBuilder();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;

                DataSet ds = objRepo.GetCandidateWiseHiringTrackerReport(claims[5].Value, cid, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return (HttpResponseMessage)authResult;

                if (ds != null && ds.Tables.Count > 0)
                {

                    str.Append("<table border='1' style='border-collapse:collapse;'>");
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        str.Append("<tr>");
                        str.Append("<th colspan='2' style='text-align:left; background-color:#A52A2A; color:#FFFFFF;'><b><font face='Calibri' size='3'>Candidate Detail</font></b></th>");
                        str.Append("</tr>");
                        AppendRow(str, "Legal First Name", dr["FirstName"].ToString());
                        AppendRow(str, "Legal Last Name", dr["LastName"].ToString());
                        AppendRow(str, "Preferred Name(if different)", dr["PreferredName"].ToString());
                        AppendRow(str, "Phone", dr["CPhone"].ToString());
                        AppendRow(str, "Address", dr["CAddress"].ToString());
                        AppendRow(str, "Email", dr["CEmail"].ToString());
                        AppendRow(str, "Work/Visa Status", dr["Visa"].ToString());
                        AppendRow(str, "I9 Representative", dr["I9RepresentativeName"].ToString());
                        AppendRow(str, "I9 Representative Employee Name", dr["I9RepresentativeEMPName"].ToString());
                        AppendRow(str, "Legal Entity", dr["LegalEntity"].ToString());
                        AppendRow(str, "Division", dr["Division"].ToString());
                        AppendRow(str, "Employment Type", dr["EmployementType"].ToString());
                        AppendRow(str, "Offer Type", dr["OffertypeName"].ToString());
                        AppendRow(str, "Department Code", $"{dr["DepartmentCode"]} ({dr["DepartmentId"]})");
                        AppendRow(str, "Employee Unit", dr["EmployeeUnit"].ToString());
                        AppendRow(str, "Resource Find", dr["Resourcefind"].ToString());
                        AppendRow(str, "Title (Internal)", dr["TitleInternal"].ToString());
                        AppendRow(str, "Grade", dr["Grade"].ToString());
                        AppendRow(str, "New Hire v. Rehire", dr["Newhire"].ToString());
                        AppendRow(str, "Working Remote Status", dr["WorkingRemote"].ToString());
                        AppendRow(str, "Relocation", dr["Relocation"].ToString());
                        AppendRow(str, "Total Experience", dr["TotalExperience"].ToString());
                        AppendRow(str, "Primary Skill", dr["candidatePrimarySkill"].ToString());
                        AppendRow(str, "Sub Skill", dr["subSkill"].ToString());
                        AppendRow(str, "Years of experience in Primary skill", dr["RelevantExperience"].ToString());
                        AppendRow(str, "Base Pay", dr["BasePay"].ToString());
                        AppendRow(str, "Annual Variable Pay", dr["AnnualVariablePay"].ToString());
                        AppendRow(str, "Joining Bonus Pay", dr["joiningBonus"].ToString());
                        AppendRow(str, "Relocation Pay", dr["RelocationPay"].ToString());
                        AppendRow(str, "Medical Benefit Eligible", dr["Medical"].ToString());
                        AppendRow(str, "FLSA job Classification", dr["FLSA"].ToString());
                        AppendRow(str, "Account Name", dr["AccountName"].ToString());
                        AppendRow(str, "Previous V-?", dr["PreviousV"].ToString());
                        AppendRow(str, "Studios", dr["Practice"].ToString());
                        AppendRow(str, "Recruiter Name", dr["PrimaryRecuiterName"].ToString());
                        AppendRow(str, "Reporting Manager", dr["ReportingManager"].ToString());
                        AppendRow(str, "Start Date", dr["Dateofjoining"].ToString());
                        AppendRow(str, "Bill Rate (If Billable)", dr["BillRate"].ToString());
                        AppendRow(str, "Per Hour Cost Rate", dr["billableHoursperDay"].ToString());
                        AppendRow(str, "Margin", dr["Margin"].ToString());
                        AppendRow(str, "Offer Status", dr["OfferStatus"].ToString());
                        str.Append("<tr>");
                        str.Append("<th colspan='2' style='text-align:left; background-color:#A52A2A; color:#FFFFFF;'><b><font face='Calibri' size='3'>To Be Completed By HR Only!</font></b></th>");
                        str.Append("</tr>");
                        AppendRow(str, "Aspire ID/Employee #", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Working State (from i9)", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Date of Birth", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Race/Ethnicity", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Gender", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Infogain Email", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Work TAG Location", ""); // Placeholder as this data is not in the current dataset
                        AppendRow(str, "Nationality", ""); // Placeholder as this data is not in the current dataset
                    }
                    str.Append("</table>");

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    byte[] temp = System.Text.Encoding.UTF8.GetBytes(str.ToString());
                    response.Content = new ByteArrayContent(temp);
                    response.Content.Headers.ContentLength = temp.LongLength;
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = "CandidateWiseHiringTracker.xls";
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    return response;
                }
                
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Report", "CandidateWiseHiringTracker");

            }
            return null;
        }
    }
}
