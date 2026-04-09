using ATSAPI.App_Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Mail;

namespace ATSAPI
{
    public class EmailSender
    {

        // Create a list of attachments using .Add() method
        //List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();
        //attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));
        //        attachments.Add(EmailSender.CreateAttachmentFromByteArray(decryptedBytes, originalFileName));

        //        string subject = "Profile Picture Downloaded";
        //string body = "Profile Picture Downloaded by " + claims[5].Value;
        //string to = "subhash.yadav@infogain.com;ravi.kushwaha@infogain.com";
        //string cc = "subhash.yadav@infogain.com;ravi.kushwaha@infogain.com;anaytullah.rahmani@infogain.com";
        //string bcc = "ayatullah.rahmani@infogain.com";

        //EmailSender.SendEmailATS(subject, body, to, cc, bcc, attachments);
        public void SendEmailATS(string subject, string body, string to, string cc, string bcc, List<Attachment> attachments = null)
        {
            try
            {

                string IsEmailOnProd = ConfigurationManager.AppSettings["isEmailProd"];
                if(IsEmailOnProd == "0")
                {
                    body = $"{body}<br/><br/>" +
                   $"<b>To:</b> {to}<br/>" +
                   $"<b>CC:</b> {cc}<br/>" +
                   $"<b>BCC:</b> {bcc}<br/>";

                    to = "subhash.yadav@infogain.com;Prabhat.Gupta@infogain.com";
                    cc = "ravi.kushwaha@infogain.com;anaytullah.rahmani@infogain.com;";
                    bcc = "ayatullah.rahmani@infogain.com";

                }



                // Create the email message
                MailMessage mailMessage = new MailMessage();
                // Set the subject and body
                mailMessage.Subject = subject;
                mailMessage.Body = body;
                mailMessage.IsBodyHtml = true;
                mailMessage.Priority = MailPriority.High;

                // Add To, CC, and BCC recipients
                AddRecipients(mailMessage, to, cc, bcc);

                // Add attachments if provided (can be null or empty)
                if (attachments != null && attachments.Count > 0)
                {
                    foreach (var attachment in attachments)
                    {
                        mailMessage.Attachments.Add(attachment);
                    }
                }
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                // Choose which email account to use for sending, if provided
                string ProfileName = "ATS";
                // Set the "From" email address
                mailMessage.From = new MailAddress(GetFromEmailId(ProfileName));
                SmtpClient smtpClient = GetSmtpClientForSender(ProfileName);

                // Send the email
                smtpClient.Send(mailMessage);

                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"Failed to send email: {ex.Message}");
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "EamilSender");
            }
        }


        public void SendEmailATSOnboard(string subject, string body, string to, string cc, string bcc, List<Attachment> attachments = null)
        {
            try
            {

                string IsEmailOnProd = ConfigurationManager.AppSettings["isEmailProd"];
                if (IsEmailOnProd == "0")
                {
                    body = $"{body}<br/><br/>" +
                   $"<b>To:</b> {to}<br/>" +
                   $"<b>CC:</b> {cc}<br/>" +
                   $"<b>BCC:</b> {bcc}<br/>";

                    to = "subhash.yadav@infogain.com;Prabhat.Gupta@infogain.com";
                    cc = "ravi.kushwaha@infogain.com;anaytullah.rahmani@infogain.com;";
                    bcc = "ayatullah.rahmani@infogain.com";

                }



                // Create the email message
                MailMessage mailMessage = new MailMessage();
                // Set the subject and body
                mailMessage.Subject = subject;
                mailMessage.Body = body;
                mailMessage.IsBodyHtml = true;
                mailMessage.Priority = MailPriority.High;

                // Add To, CC, and BCC recipients
                AddRecipients(mailMessage, to, cc, bcc);

                // Add attachments if provided (can be null or empty)
                if (attachments != null && attachments.Count > 0)
                {
                    foreach (var attachment in attachments)
                    {
                        mailMessage.Attachments.Add(attachment);
                    }
                }
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                // Choose which email account to use for sending, if provided
                string ProfileName = "Onboard";
                // Set the "From" email address
                mailMessage.From = new MailAddress(GetFromEmailId(ProfileName));
                SmtpClient smtpClient = GetSmtpClientForSender(ProfileName);

                // Send the email
                smtpClient.Send(mailMessage);

                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"Failed to send email: {ex.Message}");
                ExceptionLogging.SendExcepToDB(ex, "Dashboard", "EamilSender");
            }
        }

        private void AddRecipients(MailMessage mailMessage, string to, string cc, string bcc)
        {
            // Add TO recipients
            if (!string.IsNullOrEmpty(to))
            {
                foreach (var recipient in to.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    mailMessage.To.Add(recipient.Trim());
                }


            }

            // Add CC recipients
            if (!string.IsNullOrEmpty(cc))
            {
                foreach (var recipient in cc.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    mailMessage.CC.Add(recipient.Trim());
                }
            }

            // Add BCC recipients
            if (!string.IsNullOrEmpty(bcc))
            {
                foreach (var recipient in bcc.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    mailMessage.Bcc.Add(recipient.Trim());
                }
            }
        }


        private SmtpClient GetSmtpClientForSender(string ProfileName)
        {
            // Determine which email account to use for sending the email
            SmtpClient smtpClient;

            if (ProfileName == "ATS")
            {
                smtpClient = new SmtpClient("smtp.office365.com")  // Server for sender1
                {
                    Port = 587,
                    Credentials = new NetworkCredential("ATS@igglobal.com", "yrykpqrkzvdbrfsl"),
                   EnableSsl = true
                };
            }
            else if (ProfileName == "Onboard")
            {
                smtpClient = new SmtpClient("smtp.office365.com")  // Server for sender1
                {
                    Port = 587,
                    Credentials = new NetworkCredential("ionboard@igglobal.com", "ddrhlmvtxddbszwk"),
                    EnableSsl = true
                };
            }

            else if (ProfileName == "Aspire")
            {
                smtpClient = new SmtpClient("smtp.office365.com")  // Server for sender1
                {
                    Port = 587,
                    Credentials = new NetworkCredential("Aspire@igglobal.com", "tlrymvzxtvhhyjdb"),
                    EnableSsl = true
                };
            }
            else
            {
                throw new ArgumentException("Unsupported sender email.");
            }

            return smtpClient;
        }



        private string GetFromEmailId(string ProfileName)

        {
            string emailId= "";
            if (ProfileName == "ATS")
            {
                emailId = "ATS@infogain.com";
            }
            else if (ProfileName == "Onboard")
            {
                emailId = "ionboard@infogain.com";
            }

            else if (ProfileName == "Aspire")
            {
                emailId = "Aspire@Infogain.com";
            }

            else
            {
                return emailId;
            }
            return emailId; 
        }

        public Attachment CreateAttachmentFromByteArray(byte[] fileData, string fileName)
        {
            return new Attachment(new MemoryStream(fileData), fileName);
        }

    }
}