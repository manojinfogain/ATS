using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using ATSAPI.Models;
using ATSAPI.common;
using System.IO;
using ATSAPI.App_Data;
using System.Runtime.Remoting;
using System.Configuration;
namespace ATSAPI
{
    public class ATSMailers
    {
        Common common = new Common();
        EmailSender EmailSender = new EmailSender();
        USOfferRepository USRepo = new USOfferRepository();
        OfferRepository IndRepo = new OfferRepository();
        OnboardRepository OnbRepo = new OnboardRepository();
        public int SendOfferLetterToCandidateMailerUS(int cid,string email)
        {
            try
            {
                //  var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = USRepo.GetTempOfferLetterToCandidateForUSEnc(cid, email, out result);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                    //return Request.CreateResponse(HttpStatusCode.NotFound, "No data found");
                }

                List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();
                DataSet ds1 = IndRepo.GetOfferDocumentDetail(cid, email, out result);
                if (ds1 != null && ds1.Tables.Count > 0)
                {
                   string  filePathOffer = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds1.Tables[0].Rows[0]["OfferFileName"].ToString();
                    string filePathAgr = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds1.Tables[0].Rows[0]["EmployeeAgreenmetKey"].ToString();
                    if (File.Exists(filePathOffer))
                    {
                        byte[] encryptedBytes;
                        string encryptedFileName = Path.GetFileName(filePathOffer);
                        string originalFileName = common.RemoveLastExtension(encryptedFileName);

                        using (FileStream fs = new FileStream(filePathOffer, FileMode.Open, FileAccess.Read, FileShare.Read))
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

                    if (File.Exists(filePathAgr))
                    {
                        byte[] encryptedBytes;
                        string encryptedFileName = Path.GetFileName(filePathAgr);
                        string originalFileName = common.RemoveLastExtension(encryptedFileName);

                        using (FileStream fs = new FileStream(filePathAgr, FileMode.Open, FileAccess.Read, FileShare.Read))
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

                }

                    string AttachmentsPath = ds.Tables[0].Rows[0]["Attachment"].ToString();
                //string encryptedFileName = Path.GetFileName(encryptedFilePath);
                //string originalFileName = common.RemoveLastExtension(encryptedFileName);
                MailerConfig MailerConfig = new MailerConfig();

                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();



                if (!string.IsNullOrEmpty(AttachmentsPath))
                {
                    var att = AttachmentsPath.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var path in att)
                    {
                        if (File.Exists(path))
                        {
                            byte[] decryptedBytes;
                            //string originalFileName = common.RemoveLastExtension(path);
                            string originalFileName = Path.GetFileName(path);

                            using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                decryptedBytes = new byte[fs.Length];
                                fs.Read(decryptedBytes, 0, decryptedBytes.Length);
                            }

                            // Fix: Corrected null check
                            if (decryptedBytes != null && decryptedBytes.Length != 0)
                            {
                                attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));
                            }
                        }
                    }
                }





                EmailSender.SendEmailATS(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);
                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Mailers", "SendOfferLetterToCandidateMailerUS");
                return 0;
            }
        }


        public int SendOfferLetterToCandidateMailerIndia(int cid, string email)
        {
            try
            {
                //  var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                DataSet ds = IndRepo.GetTempOfferLetterToCandidateForInd(cid, email, out result);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                    //return Request.CreateResponse(HttpStatusCode.NotFound, "No data found");
                }

                List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();
                DataSet ds1 = IndRepo.GetOfferDocumentDetail(cid, email, out result);
                if (ds1 != null && ds1.Tables.Count > 0)
                {
                    string filePathOffer = ConfigurationManager.AppSettings["OfferLetterPath"] + cid.ToString() + "\\" + ds1.Tables[0].Rows[0]["OfferFileName"].ToString();
                    if (File.Exists(filePathOffer))
                    {
                        byte[] encryptedBytes;
                        string encryptedFileName = Path.GetFileName(filePathOffer);
                        string originalFileName = common.RemoveLastExtension(encryptedFileName);

                        using (FileStream fs = new FileStream(filePathOffer, FileMode.Open, FileAccess.Read, FileShare.Read))
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

                

                }

                string AttachmentsPath = ds.Tables[0].Rows[0]["Attachment"].ToString();
                //string encryptedFileName = Path.GetFileName(encryptedFilePath);
                //string originalFileName = common.RemoveLastExtension(encryptedFileName);
                MailerConfig MailerConfig = new MailerConfig();

                MailerConfig.TOEmail = ds.Tables[0].Rows[0]["TOEmail"].ToString();
                MailerConfig.CCEmail = ds.Tables[0].Rows[0]["CCEmail"].ToString();
                MailerConfig.BCCEmail = ds.Tables[0].Rows[0]["BCCEmail"].ToString();
                MailerConfig.Subject = ds.Tables[0].Rows[0]["Subject"].ToString();
                MailerConfig.Body = ds.Tables[0].Rows[0]["Body"].ToString();



                if (!string.IsNullOrEmpty(AttachmentsPath))
                {
                    var att = AttachmentsPath.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var path in att)
                    {
                        if (File.Exists(path))
                        {
                            byte[] decryptedBytes;
                            //string originalFileName = common.RemoveLastExtension(path);
                            string originalFileName = Path.GetFileName(path);

                            using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                decryptedBytes = new byte[fs.Length];
                                fs.Read(decryptedBytes, 0, decryptedBytes.Length);
                            }

                            // Fix: Corrected null check
                            if (decryptedBytes != null && decryptedBytes.Length != 0)
                            {
                                attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));
                            }
                        }
                    }
                }





                EmailSender.SendEmailATS(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);
                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Mailers", "SendOfferLetterToCandidateMailerUS");
                return 0;
            }
        }


        public int SendEnableDisableOnboardingFormMailer(int cid, string formid=null,string empid=null)
        {
            try
            {
               // var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                DataSet ds = OnbRepo.GetEnableDisableOnboardingFormMailer(cid, empid, formid);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return 2;
                }

                string ItineraryAttachmentsPath = ds.Tables[0].Rows[0]["JoiningItineraryattachment"].ToString();
                string AttachmentsPath = ds.Tables[0].Rows[0]["Attachment"].ToString();


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


                EmailSender.SendEmailATSOnboard(MailerConfig.Subject, MailerConfig.Body, MailerConfig.TOEmail, MailerConfig.CCEmail, MailerConfig.BCCEmail, attachments);
                return 1;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Onboard", "SendAppoinmentLetterToCandidateMailerMethod");
                return 0;
            }
        }
    }
}