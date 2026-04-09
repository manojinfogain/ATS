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

namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/OfferG5Above")]
    public class OfferG5AboveController : ApiController
    {
        OfferG5AboveRepository objRepo = new OfferG5AboveRepository();
        OfferController IndOfferCont = new OfferController();
        OfferRepository objRepoInd = new OfferRepository();
        Common common = new Common();
        CommonController cm = new CommonController();
        Logger logger = new Logger();

        [Route("GetG5AboveSelectedCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetG5AboveSelectedCandidatesList(OfferGenerationFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetG5AboveSelectedCandidatesList(claims[5].Value, obj, out result);
                logger.LogRequestAsync("GetG5AboveSelectedCandidatesList", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetG5AboveSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetG5AboveSelectedCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetG5AboveSelectedCandidatesList", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "GetSelectedCandidatesList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("addUpdateOfferApprovalG5Above")]
        [HttpPost]
        public IHttpActionResult addUpdateOfferApprovalG5Above(OfferApprovalModelG5Above obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                int result = objRepo.addUpdateOfferApprovalG5Above(obj, claims[5].Value, ref Message, ref ActionId);
                logger.LogRequestAsync("addUpdateOfferApprovalG5Above", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "addUpdateOfferApprovalG5Above", claims[5].Value);
                    return authResult;
                }
                else if (result > 0)
                {
                    var responseObj1 = new { ActionID = ActionId, Message = Message };
                    logger.LogResponseAsync("addUpdateOfferApprovalG5Above", "200 OK");
                    return Ok(responseObj1);
                }
                else
                {
                    logger.LogResponseAsync("addUpdateOfferApprovalG5Above", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("addUpdateOfferApprovalG5Above", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "addUpdateOfferApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateEditOfferApprovalG5Above")]
        [HttpPost]
        public IHttpActionResult UpdateEditOfferApprovalG5Above(OfferApprovalModelG5Above obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                int result = objRepo.UpdateEditOfferApprovalG5Above(obj, claims[5].Value, ref Message, ref ActionId);
                logger.LogRequestAsync("UpdateEditOfferApprovalG5Above", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateEditOfferApprovalG5Above", claims[5].Value);
                    return authResult;
                }
                else if (result > 0)
                {
                    var responseObj1 = new { ActionID = ActionId, Message = Message };
                    logger.LogResponseAsync("UpdateEditOfferApprovalG5Above", "200 OK");
                    return Ok(responseObj1);
                }
                else
                {
                    logger.LogResponseAsync("UpdateEditOfferApprovalG5Above", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateEditOfferApprovalG5Above", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "addUpdateOfferApproval");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateOfferApprovalStatusG5Above")]
        [HttpPost]
        public IHttpActionResult UpdateOfferApprovalStatusG5Above(int cid, string ActionTaken, String Remark = null, char IsDelegator = 'N')
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.UpdateOfferApprovalStatusG5Above(cid, claims[5].Value, ActionTaken, IsDelegator, Remark, ref Message);
                logger.LogRequestAsync("UpdateOfferApprovalStatusG5Above", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateOfferApprovalStatusG5Above", claims[5].Value);
                    return authResult;
                }
                else if (result == 1 || result == -2)
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatusG5Above", "200 OK");
                    return Ok(Message);
                }
                else if (result == -3)
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatusG5Above", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateOfferApprovalStatusG5Above", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateOfferApprovalStatusG5Above", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "UpdateOfferApprovalStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetApprovedG5AboveCandidatesList")]
        [HttpPost]
        public IHttpActionResult GetApprovedG5AboveCandidatesList([FromBody] OfferGenerationFilter obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetApprovedG5AboveCandidatesList(claims[5].Value, obj, out result);
                logger.LogRequestAsync("GetApprovedG5AboveCandidatesList", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetApprovedG5AboveCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetApprovedG5AboveCandidatesList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetApprovedG5AboveCandidatesList", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "GetApprovedG5AboveCandidatesList");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getG5AboveApproverList")]
        [HttpGet]
        public IHttpActionResult GetG5AboveApproverList()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetG5AboveApproverList(claims[5].Value, out result);
                logger.LogRequestAsync("GetG5AboveApproverList", Request);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetG5AboveApproverList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetG5AboveApproverList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetG5AboveApproverList", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "GetTagHeadG5AboveList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetGradeMaster")]
        [HttpGet]
        public IHttpActionResult GetGradeMaster()
        {
            try
            {
                logger.LogRequestAsync("GetGradeMaster", Request);
                var data = objRepo.GetGradeMaster();
                logger.LogResponseAsync("GetGradeMaster", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetGradeMaster", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "GetGradeMaster");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVariablePayPercentageMaster")]
        [HttpGet]
        public IHttpActionResult GetVariablePayPercentageMaster(int? gradeId = null, int? cid = null, int? cubeId = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                logger.LogRequestAsync("GetVariablePayPercentageMaster", Request);
                var data = objRepo.GetVariablePayPercentageMaster(gradeId, cid, cubeId, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetVariablePayPercentageMaster", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetVariablePayPercentageMaster", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetVariablePayPercentageMaster", ex);
                ExceptionLogging.SendExcepToDB(ex, "OfferG5", "GetVariablePayPercentageMaster");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GenerateOffer")]
        [HttpPost]
        public IHttpActionResult GenerateOffer()
        {
            try
            {
                PdfModelG5Above model = new PdfModelG5Above();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                logger.LogRequestAsync("GenerateOffer", Request);
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

                    if (encryptionResult != 1)
                    {
                        logger.LogResponseAsync("GenerateOffer", "400 Bad Request");
                        return BadRequest("Error encrypting the file.");
                    }
                }
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    int result = 0;
                    result = GeneratePDFNew(ds, model.cid.ToString());
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
        public int GeneratePDFInfogain(DataSet ds, string cid)
        {

            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 50;
            objLoadOptions.PageInfo.Margin.Top = 80;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();

            String CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();

            Aspose.Pdf.Document doc = new Aspose.Pdf.Document(new MemoryStream(Encoding.UTF8.GetBytes(ds.Tables[0].Rows[0]["Offer"].ToString()
                .Replace("[MonthlySalaryWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["TotalMonthly"].ToString())))
                .Replace("[annualCTCWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["annualCTC"].ToString())))
                .Replace("[JoiningBonusWords]", com.ConvertToWords(Convert.ToInt64(ds.Tables[0].Rows[0]["JoiningBonus"].ToString())))
                .Replace("[ReportingAddress]", ds.Tables[1].Rows[0]["ShortAddress"].ToString())
                )), objLoadOptions);
            doc.SetTitle(ds.Tables[0].Rows[0]["CandidateName"].ToString());

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {
                TextStamp AddressLine1 = null, AddressLine2 = null, AddressLine3 = null, AddressLine4 = null, AddressLine5 = null, AddressLine6 = null, textStampUSA = null, textStampUK = null, textStampPoland = null, textStampIndia = null, textStampSINGAPORE = null, textStampUAE = null, textStampLF = null, textStampRF = null;
                ImageStamp imageFooter = null;

                //ImageStamp imageStamp = new ImageStamp(@"\\ipagshareserver\Sharing\Dharampal Singh\atsapi\Content\infogain-icon.png");
                //imageStamp.TopMargin = 20;
                //imageStamp.LeftMargin = 20;
                //imageStamp.HorizontalAlignment = HorizontalAlignment.Left;
                //imageStamp.VerticalAlignment = VerticalAlignment.Top;
                //imageStamp.Height = 40;
                //imageStamp.Width = 150;

                AddressLine1 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine1"].ToString());
                AddressLine1.TopMargin = 8;
                AddressLine1.RightMargin = 40;
                AddressLine1.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine1.VerticalAlignment = VerticalAlignment.Top;
                AddressLine1.TextState.FontSize = 9.0F;

                AddressLine2 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine2"].ToString());
                AddressLine2.TopMargin = 20;
                AddressLine2.RightMargin = 40;
                AddressLine2.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine2.VerticalAlignment = VerticalAlignment.Top;
                AddressLine2.TextState.FontSize = 9.0F;

                AddressLine3 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine3"].ToString());
                AddressLine3.TopMargin = 32;
                AddressLine3.RightMargin = 40;
                AddressLine3.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine3.VerticalAlignment = VerticalAlignment.Top;
                AddressLine3.TextState.FontSize = 9.0F;

                AddressLine4 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine4"].ToString());
                AddressLine4.TopMargin = 44;
                AddressLine4.RightMargin = 40;
                AddressLine4.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine4.VerticalAlignment = VerticalAlignment.Top;
                AddressLine4.TextState.FontSize = 9.0F;

                AddressLine5 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine5"].ToString());
                AddressLine5.TopMargin = 57;
                AddressLine5.RightMargin = 40;
                AddressLine5.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine5.VerticalAlignment = VerticalAlignment.Top;
                AddressLine5.TextState.FontSize = 9.0F;
                AddressLine6 = new TextStamp(ds.Tables[1].Rows[0]["AddressLine6"].ToString());
                AddressLine6.TopMargin = 70;
                AddressLine6.RightMargin = 40;
                AddressLine6.HorizontalAlignment = HorizontalAlignment.Right;
                AddressLine6.VerticalAlignment = VerticalAlignment.Top;
                AddressLine6.TextState.FontSize = 9.0F;
                if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
                {
                    textStampUSA = new TextStamp("USA");
                    textStampUSA.BottomMargin = 35;
                    textStampUSA.LeftMargin = 50;
                    textStampUSA.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampUSA.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUSA.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White); ;

                    textStampUK = new TextStamp("UK");
                    textStampUK.BottomMargin = 35;
                    textStampUK.LeftMargin = 125;
                    textStampUK.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampUK.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUK.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampPoland = new TextStamp("POLAND");
                    textStampPoland.BottomMargin = 35;
                    textStampPoland.LeftMargin = 200;
                    textStampPoland.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampPoland.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampPoland.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampIndia = new TextStamp("INDIA");
                    textStampIndia.BottomMargin = 35;
                    textStampIndia.RightMargin = 250;
                    textStampIndia.HorizontalAlignment = HorizontalAlignment.Right;
                    textStampIndia.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampIndia.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White); ;

                    textStampSINGAPORE = new TextStamp("SINGAPORE");
                    textStampSINGAPORE.BottomMargin = 35;
                    textStampSINGAPORE.RightMargin = 125;
                    textStampSINGAPORE.HorizontalAlignment = HorizontalAlignment.Right;
                    textStampSINGAPORE.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampSINGAPORE.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);

                    textStampUAE = new TextStamp("UAE");
                    textStampUAE.BottomMargin = 35;
                    textStampUAE.RightMargin = 50;
                    textStampUAE.HorizontalAlignment = HorizontalAlignment.Right;
                    textStampUAE.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampUAE.TextState.ForegroundColor = Color.FromRgb(System.Drawing.Color.White);


                    textStampLF = new TextStamp("Registered Office: A-16, Sector 60, Noida, UP 201301 IN");
                    textStampLF.BottomMargin = 10;
                    textStampLF.LeftMargin = 10;
                    textStampLF.HorizontalAlignment = HorizontalAlignment.Left;
                    textStampLF.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampLF.TextState.FontSize = 7.0F;

                    textStampRF = new TextStamp("Corporate Identification Number (CIN): U74899UP1991PTC182402");
                    textStampRF.BottomMargin = 10;
                    textStampRF.RightMargin = 10;
                    textStampRF.HorizontalAlignment = HorizontalAlignment.Right;
                    textStampRF.VerticalAlignment = VerticalAlignment.Bottom;
                    textStampRF.TextState.FontSize = 7.0F;
                }

                imageFooter = new ImageStamp(@"\\ipagfileserver\Photos\ATS\ImpDocs\Footer.jpg");
                imageFooter.BottomMargin = 30;
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
                    page.AddStamp(AddressLine6);

                    page.AddStamp(imageFooter);
                    if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
                    {
                        page.AddStamp(textStampUSA);
                        page.AddStamp(textStampUK);
                        page.AddStamp(textStampPoland);
                        page.AddStamp(textStampIndia);
                        page.AddStamp(textStampSINGAPORE);
                        page.AddStamp(textStampUAE);
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

            doc.Save(path + "InfogainOffer_Aspose" + CandidateName + ".PDF");

            Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose" + CandidateName + ".PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
            Stream outputPdfStream = null;

            if (ds.Tables[0].Rows[0]["Division"].ToString() == "1")
            {
                outputPdfStream = new FileStream(path + "InfogainOffer_" + CandidateName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);
            }
            else
            {
                outputPdfStream = new FileStream(path + "NNTOffer_" + CandidateName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);
            }


            var reader = new PdfReader(inputPdfStream);
            int numberOfPages = reader.NumberOfPages;
            var stamper = new PdfStamper(reader, outputPdfStream);
            for (int i = 1; i <= numberOfPages; i++)
            {

                var pdfContentByte = stamper.GetOverContent(i);
                Stream inputImageStream = null;
                if (ds.Tables[0].Rows[0]["division"].ToString() == "1")
                {
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogainGPTW-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                }
                else
                {
                    inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\NNT-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                }
                //Stream inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogainGPTW-icon-G5.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);
                image.SetAbsolutePosition(0, 770);
                image.Alignment = Element.ALIGN_TOP;
                image.ScalePercent(52f);
                pdfContentByte.AddImage(image);

            }
            stamper.Close();
            if (File.Exists(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF")))
            {
                File.Delete(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF"));
            }

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


        [NonAction]
        public int GeneratePDFNew(DataSet ds, string cid, char isOfferRegenerate = 'N')
        {
            string ImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
            HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
            objLoadOptions.PageInfo.Margin.Bottom = 50;
            objLoadOptions.PageInfo.Margin.Top = 110;
            objLoadOptions.PageInfo.Margin.Left = 30;
            objLoadOptions.PageInfo.Margin.Right = 30;
            Common com = new Common();
            string base64PdfSign = "";

            string CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();

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
                    Offer = Offer.Replace("[candidatesign]","");
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

            string NewAddressLine1 = null, NewAddressLine2 = null, NewAddressLine3 = null, NewAddressLine4 = null, NewAddressLine5 = null, NewAddressLine6 = null;

            string NewtextStampUS = null, NewtextStampUK = null, NewtextStampPoland = null, NewtextStampIndia = null, NewtextStampSINGAPORE = null, NewtextStampUAE = null, NewtextStampURUGUAY = null, NewtextStampCANADA = null;
            string LocationId = ds.Tables[1].Rows[0]["locationid"].ToString();

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {

                NewAddressLine1 = ds.Tables[1].Rows[0]["AddressLine1"].ToString();
                NewAddressLine2 = ds.Tables[1].Rows[0]["AddressLine2"].ToString();
                NewAddressLine3 = ds.Tables[1].Rows[0]["AddressLine3"].ToString();
                NewAddressLine4 = ds.Tables[1].Rows[0]["AddressLine4"].ToString();
                NewAddressLine5 = ds.Tables[1].Rows[0]["AddressLine5"].ToString();
                NewAddressLine6 = ds.Tables[1].Rows[0]["AddressLine6"].ToString();

                NewtextStampUK = "UK";
                NewtextStampUS = "US";
                NewtextStampPoland = "POLAND";
                NewtextStampIndia = "INDIA";
                NewtextStampSINGAPORE = "SINGAPORE";
                NewtextStampUAE = "UAE";
                NewtextStampURUGUAY = "URUGUAY";
                NewtextStampCANADA = "CANADA";

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

            // doc.Save(path + "InfogainOffer_Aspose" + CandidateName + ".PDF");
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
                        string imagePath = System.IO.Path.Combine(ImpDocPath, "infogainGPTW-icon.png");
                        inputImageStream = new FileStream(imagePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //inputImageStream = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\infogainGPTW-icon.png", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(inputImageStream);



                        //new Added by RD

                        image.SetAbsolutePosition(0, 762);
                        image.Alignment = Element.ALIGN_TOP;
                        image.ScalePercent(52f);
                        pdfContentByte.AddImage(image);

                        Stream inputImageStream1 = null;
                        string imagePathF = System.IO.Path.Combine(ImpDocPath, "Footer.jpg");
                        inputImageStream1 = new FileStream(imagePathF, FileMode.Open, FileAccess.Read, FileShare.Read);
                        //inputImageStream1 = new FileStream(@"\\ipagfileserver\Photos\ATS\ImpDocs\Footer.jpg", FileMode.Open, FileAccess.Read, FileShare.Read);
                        iTextSharp.text.Image image1 = iTextSharp.text.Image.GetInstance(inputImageStream1);
                        image1.SetAbsolutePosition(0, 30);
                        image1.Alignment = Element.ALIGN_BOTTOM;
                        image1.ScalePercent(60f, 22f);
                        pdfContentByte.AddImage(image1);
                        pdfContentByte.BeginText();

                        BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 12);

                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine1, 550, 815, 0);


                        pdfContentByte.EndText();

                        pdfContentByte.BeginText();
                        BaseFont bf2 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf2, 9);
                        pdfContentByte.ShowTextAligned(4, pageNumeber, 280, 10, 0);
                        //Address added

                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine2, 550, 803, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine3, 550, 791, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine4, 550, 779, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine5, 550, 767, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewAddressLine6, 550, 755, 0);


                        pdfContentByte.EndText();

                        //Footer added
                        BaseFont bf1 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf, 9.5f);
                        pdfContentByte.SetColorFill(BaseColor.WHITE);
                        pdfContentByte.BeginText();
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUS, 40, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUK, 90, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampSINGAPORE, 190, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampUAE, 250, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampIndia, 320, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampPoland, 410, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampURUGUAY, 490, 38, 0);
                        pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, NewtextStampCANADA, 560, 38, 0);
                        pdfContentByte.EndText();
                        //end

                        // Footer office & CIN added

                        BaseFont bf3 = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                        pdfContentByte.SetFontAndSize(bf3, 7.0f);
                        pdfContentByte.SetColorFill(BaseColor.BLACK);
                        pdfContentByte.BeginText();
                        if (LocationId != "16")
                        {
                            pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, "Registered Office: A-16, Sector 60, Noida, UP 201301 IN", 10, 18, 0);
                            pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, "Corporate Identification Number (CIN): U74899UP1991PTC182402", 580, 18, 0);

                        }
                        else
                        {
                            pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, "Registered Office: DLF Cyber City SEZ, Building #14, 4th Floor, Tower B,", 10, 18, 0);
                            pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, "DLF Cyber City, Phase-3, Gurgaon 122002, Haryana, India.", 10, 10, 0);

                            pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, "Corporate Identification Number (CIN): U72300HR2009PTC040852", 580, 18, 0);

                        }

                        pdfContentByte.EndText();


                    }
                    stamper.Close();
                    reader.Close();
                    // Convert final PDF to byte array
                    finalPdfBytes = outputPdfStream.ToArray();
                }
                }

            string fileName = common.GetFileWithAdditionalExtention("InfogainOffer_" + CandidateName + ".PDF");
            int encryptionResult = common.EncryptFile(finalPdfBytes, path + fileName);
            if (encryptionResult != 1)
            {
                //  return BadRequest("Error encrypting the file.");
                return -1;
            }

            // Stream inputPdfStream = new FileStream(path + "InfogainOffer_Aspose" + CandidateName + ".PDF", FileMode.Open, FileAccess.Read, FileShare.Read);
            // Stream outputPdfStream = new FileStream(path + "InfogainOffer_" + CandidateName + ".PDF", FileMode.Create, FileAccess.Write, FileShare.None);

            //if (File.Exists(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF")))
            //{
            //    File.Delete(Path.Combine(path, "InfogainOffer_Aspose" + CandidateName + ".PDF"));
            //}

            return 1;
        }


        [Route("UploadOffer")]
        [HttpPost]
        public IHttpActionResult UploadOffer()
        {
            try
            {
                PdfModelG5Above model = new PdfModelG5Above();
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var frm = HttpContext.Current.Request.Form;
                logger.LogRequestAsync("UploadOffer", Request);

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
                    logger.LogResponseAsync("UploadOffer", "400 Bad Request");
                    return BadRequest("Final CTC Should be less than or equal to approved CTC");
                }

                DataSet ds = objRepo.GeDetailsForUploadOffer(model, claims[5].Value);
                String CandidateName = String.Empty;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    CandidateName = ds.Tables[0].Rows[0]["CandidateName"].ToString();
                }

                if (HttpContext.Current.Request.Files.Count > 0 && CandidateName != "")
                {
                    var offerLetterFile = HttpContext.Current.Request.Files[0];
                    string tempPath = ConfigurationManager.AppSettings["OfferLetterPath"] + "\\" + model.cid.ToString() + "\\";
                    string filedetails = "InfogainOffer_" + CandidateName + Path.GetExtension(offerLetterFile.FileName).ToString();
                    string FileNameWithExtention = common.GetFileWithAdditionalExtention(filedetails);
                    if (!(Directory.Exists(tempPath)))
                    {
                        Directory.CreateDirectory(tempPath);
                    }
                    string fileSavePath = Path.Combine(tempPath, FileNameWithExtention);

                    if (System.IO.File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    // offerLetterFile.SaveAs(fileSavePath);
                    byte[] fileBytes;
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        offerLetterFile.InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    //Encrypt the file before saving
                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                    if (encryptionResult != 1)
                    {
                        logger.LogResponseAsync("UploadOffer", "500 Internal Server Error");
                        return InternalServerError(new Exception("Error encrypting the file."));
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
                ExceptionLogging.SendExcepToDB(ex, "Offer", "GenerateOfferPDF");
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
                    int update = objRepoInd.SaveUpdateOfferTemplates(obj);
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
                    ExceptionLogging.SendExcepToDB(ex, "offer Async", "SaveUpdateOfferTemplatesG5Above");
                    return 0;
                }

            });
            return 0;
        }


        [Route("RegenrateOffer")]
        [HttpPost]
        public IHttpActionResult RegenrateOffer(int cid, char isCopyOnMurcury = 'N')
        {
            try
            {
                PdfModelG5Above model = new PdfModelG5Above();
                model.cid = cid;
                model.IsOfferGenExternal = 'Y';
                model.IsSaveOnMarcury = isCopyOnMurcury;
                logger.LogRequestAsync("RegenrateOffer", Request);
                DataSet ds = objRepo.GetCandidateInformationForPDF(model, cid.ToString());
                int result = 0;
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    result = GeneratePDFNew(ds, model.cid.ToString(), 'Y');
                    if (result == 1)
                    {
                        if (isCopyOnMurcury == 'Y')
                        {
                            System.Threading.Tasks.Task<int> copyOffer = IndOfferCont.CopyOfferToMurcury(cid.ToString());
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
                ExceptionLogging.SendExcepToDB(ex, "Offer", "RegenrateOffer G5 Above");
                return BadRequest("There is some error! Try again later");
            }
        }


    }
}