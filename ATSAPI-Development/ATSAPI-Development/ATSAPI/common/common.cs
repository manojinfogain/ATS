using Aspose.Pdf.Operators;
using ATSAPI.App_Data;
using ATSAPI.Controllers;
using ATSAPI.Models;
using ATSAPI.Repositry;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using MessageBird;
using Microsoft.Exchange.WebServices.Data;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Net.NetworkInformation;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.UI;
using TimeZoneConverter;
using TimeZoneNames;

namespace ATSAPI.common
{
    public class Common
    {
        InterviewRepository objRepo = new InterviewRepository();
        OnboardRepository OnboardRepo = new OnboardRepository();
        
        public string ConvertDMYtoYMD(string date)
        {
            string[] strDate = date.Split('/');
            return strDate[2] + "/" + strDate[0] + "/" + strDate[1];
        }

        public DateTime ConvertUTCToTZ(DateTime date, string timezone)
        {
            var tzm = TZConvert.IanaToWindows(timezone);
            TimeZoneInfo serverZone = TimeZoneInfo.FindSystemTimeZoneById(tzm);
            DateTime currentDateTime = TimeZoneInfo.ConvertTimeFromUtc(date, serverZone);
            return currentDateTime;
        }
        public void CreateTeamsMeeting(DateTime stime, DateTime etime, string sub, out string msteamlink, out string mid)
        {
            string token = GenerateToken();
            var p = new
            {
                startDateTime = stime.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:17:17.6491364Z",// stime,
                endDateTime = etime.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:20:17.6491364Z",//etime,
                subject = sub
            };

            string json = JsonConvert.SerializeObject(p);
            HttpResponseMessage servicerequest = null;
            string clientId = ConfigurationManager.AppSettings["clientId"];
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/users/"+ client_id +"/onlineMeetings");
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                var content = new StringContent(json.ToString(), System.Text.Encoding.UTF8, "application/json");
                servicerequest = httpClient.PostAsync("https://graph.microsoft.com/v1.0/users/"+ clientId + "/onlineMeetings", content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                CalendarAppointment jsonObj = JsonConvert.DeserializeObject<CalendarAppointment>(response);
                msteamlink = jsonObj.JoinWebUrl;
                mid = jsonObj.Id.ToString();
            }
        }
        public string GenerateToken()
        {
            string client_id = ConfigurationManager.AppSettings["clientId"];
            string client_secret = ConfigurationManager.AppSettings["clientSecret"];
            string TenantID = ConfigurationManager.AppSettings["TenantID"];
            string scope = "https://graph.microsoft.com/.default";
            var webClient = new WebClient();
            webClient.Headers[HttpRequestHeader.CacheControl] = "no-cache";
            webClient.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            string para = "grant_type=client_credentials&client_id=" + client_id + "&client_secret=" + client_secret + "&scope=" + scope + "";
            // upload the data using Post mehtod
            string response = webClient.UploadString("https://login.microsoftonline.com/"+TenantID+"/oauth2/v2.0/token", "POST", para);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(response);
            string token = jsonObj.access_token;
            return token;
        }
        public string deleteCalendar(string mid)
        {
            string token = GenerateToken();
            string response = "";
            HttpResponseMessage servicerequest = null;
            string clientId = ConfigurationManager.AppSettings["clientId"];
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/users/"+ clientId+"/onlineMeetings");
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                servicerequest = httpClient.DeleteAsync("https://graph.microsoft.com/v1.0/users/"+ clientId +"/onlineMeetings/" + mid).Result;
                response = servicerequest.Content.ReadAsStringAsync().Result;

                CalendarAppointment jsonObj = JsonConvert.DeserializeObject<CalendarAppointment>(response);
            }
            return response;
        }
        public string updateCalendar(DateTime stime, DateTime etime, string sub, string mid, out string msteamlink, out string newmid)
        {
            string token = GenerateToken();
            string response = "";
            var p = new
            {
                startDateTime = stime.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:17:17.6491364Z",// stime,
                endDateTime = etime.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:20:17.6491364Z",//etime,
                subject = sub
            };

            string json = JsonConvert.SerializeObject(p);
            string clientId = ConfigurationManager.AppSettings["clientId"];
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/users/"+ clientId +"/onlineMeetings");
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                var content = new StringContent(json.ToString(), System.Text.Encoding.UTF8, "application/json");
                Uri uri = new Uri("https://graph.microsoft.com/v1.0/users/"+ clientId +"/onlineMeetings/" + mid);

                httpClient.PatchAsync(uri, content, out msteamlink, out newmid);
                //response = servicerequest.Content.ReadAsStringAsync().Result;

                CalendarAppointment jsonObj = JsonConvert.DeserializeObject<CalendarAppointment>(response);
            }
            return response;
        }
        public async System.Threading.Tasks.Task<string> addToCalendar(int cid, string EmpId, int flag)
        {
            try
            {
                int result;
                RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId,out result);
                if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewType.Id == 1)
                {
                    return "";
                }
                await System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {
                        // Get credentials from web.config
                        string user = ConfigurationManager.AppSettings["ExchangeUser"];
                        string password = ConfigurationManager.AppSettings["ExchangePassword"];
                        ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2010);
                        service.Credentials = new WebCredentials(user, password);   // replace with proper username and password
                                                                                                       // service.UseDefaultCredentials = true;
                        service.Url = new Uri("https://smtp.office365.com/ews/exchange.asmx");   // Office 365 Exchange API URL (replace it with a local server URL if you are using a local Exchange installation)
                                                                                                 // service.AutodiscoverUrl("dharampal.singh@igglobal.com");
                        Appointment appointment_candidate = new Appointment(service);
                        //Appointment appointment_panel = new Appointment(service);
                        string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
                        string modeofinterview = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.mode).FirstOrDefault().ToString();
                        int modeofinterviewid = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.id).FirstOrDefault();
                        // string venuelabel = "Venue Details";
                        // DateTime interviewdate = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewDate).FirstOrDefault());
                        DateTime interviewdateUTC = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault());
                        //string interviewdateUTC = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault().ToString();
                        string tz = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewTimeZone).FirstOrDefault().ToString();
                        var abbreviations = TZNames.GetAbbreviationsForTimeZone(tz, "en-US");
                        DateTime interviewdate = ConvertUTCToTZ(interviewdateUTC, tz);
                        string interviewday = interviewdate.ToString("dddd");
                        //string dayanddate = interviewday + ", " + interviewdate.ToShortDateString();
                        string dayanddate = interviewday + ", " + interviewdate.ToString("dd MMM yyyy");

                        
                        string reportingtime = interviewdate.AddMinutes(-30).ToString("HH:mm tt") + " " + abbreviations.Standard;
                        string contactperson = char.ToUpper(round.recruiter.Name[0]) + round.recruiter.Name.Substring(1); ;
                        string venue = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.vanueOrLink).FirstOrDefault().ToString();
                        string designation = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x._designation.desigName).FirstOrDefault().ToString();
                        string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                        int interiviewtypeID = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Id).FirstOrDefault();
                        int candidateGradeId = round.CandidateGradeId;
                        string isRenuTeam = round.IsRenuTeam.ToString();


                        int ISTemplate2027 = 0;
                        if (modeofinterviewid != 2)
                        {
                            reportingtime = interviewdate.ToString("HH:mm tt") + " " + abbreviations.Standard;
                            contactperson = char.ToUpper(round.recruiter.Name[0]) + round.recruiter.Name.Substring(1);
                        }

                        EmailTemplate template = new EmailTemplate();
                        if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 2)
                        {
                            template = objRepo.getEmailTemplate(2027, EmpId);
                            ISTemplate2027 = 1;
                        }
                        else
                        {
                            template = objRepo.getEmailTemplate(2028, EmpId);
                        }
                        //if (flag == 1)
                        //{
                        //    template = objRepo.getEmailTemplate(4, EmpId);
                        //}
                        //else
                        //{
                        //    template = objRepo.getEmailTemplate(3, EmpId);
                        //}

                        // EmailTemplate panel_template = objRepo.getEmailTemplate(2, EmpId);

                        if (HiringLocationId == 3)
                        {
                            appointment_candidate.Subject = interiviewtype + " || Interview Scheduled at Infogain" + " || " + candidatename + " || " + dayanddate + " " + reportingtime;
                        }
                        else
                        {
                            appointment_candidate.Subject = interiviewtype + " || Interview Scheduled at Infogain";
                        }


                        appointment_candidate.Start = interviewdate;
                        appointment_candidate.End = appointment_candidate.Start.AddMinutes(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewDuration);
                        appointment_candidate.ReminderDueBy = appointment_candidate.Start.AddMinutes(-15);
                        Attendee at = new Attendee();
                        at.Address = round.Email;
                        at.Name = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        appointment_candidate.RequiredAttendees.Add(at);

                        appointment_candidate.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.email);
                        foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                        {
                            appointment_candidate.RequiredAttendees.Add(att.email);
                        }
                        string msteamlink = "";
                        string mid = "";
                        //CreateTeamsMeeting(appointment_candidate.Start, appointment_candidate.End, appointment_candidate.Subject, out msteamlink, out mid);
                        var p = new
                        {
                            startDateTime = appointment_candidate.Start.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:17:17.6491364Z",// stime,
                            endDateTime = appointment_candidate.End.ToString("yyyy-MM-ddTHH:mm:ssZ"),//"2021-09-06T16:20:17.6491364Z",//etime,
                            subject = appointment_candidate.Subject
                        };
                        string json = JsonConvert.SerializeObject(p);
                        HttpResponseMessage servicerequest = null;
                        string clientId = ConfigurationManager.AppSettings["clientId"];
                        using (HttpClient httpClient = new HttpClient())
                        {
                            string token = "";
                            if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 6)
                            {
                                token = GenerateToken();
                                httpClient.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/users/"+ clientId +"/onlineMeetings");
                                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");

                                var content = new StringContent(json.ToString(), System.Text.Encoding.UTF8, "application/json");
                                servicerequest = httpClient.PostAsync("https://graph.microsoft.com/v1.0/users/"+ clientId +"/onlineMeetings", content).Result;
                                string response = servicerequest.Content.ReadAsStringAsync().Result;

                                CalendarAppointment jsonObj = JsonConvert.DeserializeObject<CalendarAppointment>(response);
                                msteamlink = jsonObj.JoinWebUrl;
                                mid = jsonObj.Id;
                            }

                            var TempBody = template.Body
                            .Replace("[%s]", candidatename)
                            .Replace("[%d]", dayanddate)
                            .Replace("[%rt]", reportingtime)
                            .Replace("[%moi]", modeofinterview)
                            .Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : 
                            HiringLocationId != 3? round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewLocationAddress.ToString():round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())
                            .Replace("[%Interviewer]", round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name)
                            .Replace("[%cp]", contactperson);

                            if (interiviewtypeID == 1)
                            {
                                TempBody = TempBody.Replace("[%stmt]", "Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further. Attaching the job description for your reference.");

                            }
                            else
                            {
                                if (round.roundList.Where(x => x.interviewType.Id == 2).Count() > 1|| interiviewtypeID==3|| interiviewtypeID == 4 || interiviewtypeID == 5 || interiviewtypeID == 6 || interiviewtypeID == 7)
                                {
                                    //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                                    //firstround
                                    //secondround
                                    TempBody = TempBody.Replace("[%stmt]", "<p>Greetings from Infogain!</br>You have been shortlisted for the next round interview. Attaching the job description for your reference.</p>");

                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%stmt]", "<p>Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further.</br>Attaching the job description for your reference.</p>");

                                }
                            }

                            if (HiringLocationId == 3)
                            {
                                TempBody = TempBody.Replace("[%IDProof]", "");
                            }
                            else
                            {
                                if (ISTemplate2027 == 1)
                                {
                                    TempBody = TempBody.Replace("[%IDProof]", "<li>One government photo ID card to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%IDProof]", "<li>A government photo ID proof to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                }
                                if (isRenuTeam =="N")
                                {
                                    if (candidateGradeId == 202 || candidateGradeId == 203 || candidateGradeId == 204 || candidateGradeId == 205 || candidateGradeId == 206 || candidateGradeId == 207 || candidateGradeId == 219 || candidateGradeId == 220)
                                    {
                                        TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>four days</b> per month from our office.");
                                    }
                                    else
                                    {
                                        TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>eight days</b> per month from our office.");
                                    }
                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%WfhStmt]", " ");

                                }
                            }

                            appointment_candidate.Body = TempBody;
                            //appointment_panel.Subject = round.primarySkill.SkillName + " || " + interiviewtype + " || Interview Scheduled for " + candidatename + " at " + interviewdate.ToShortDateString() + "";
                            //appointment_panel.Body = panel_template.Body
                            //.Replace("[%panelName]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.Name).FirstOrDefault())
                            //.Replace("[%moi]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.Mode).FirstOrDefault().ToString())
                            //.Replace("[%s]", round.Name)
                            //.Replace("[%dt]", dayanddate)
                            //.Replace("[%jt]", candidatename)
                            //.Replace("[%TalentID]", round.THID.ToString())
                            //.Replace("@Venue", venuelabel)
                            //.Replace("@Time", reportingtime)
                            //.Replace("[%recName]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.recruiter.Name).FirstOrDefault())
                            //.Replace("[%id]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString());

                            //appointment_panel.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.email).FirstOrDefault());
                            //appointment_panel.Start = appointment_candidate.Start;
                            //appointment_panel.End = appointment_candidate.End;
                            //appointment_panel.ReminderDueBy = appointment_candidate.ReminderDueBy;

                            //appointment_candidate.Body = template.Body.Replace("[%s]", candidatename)
                            //    .Replace("[%e]", "Infogain")
                            //    .Replace("[%d]", dayanddate)
                            //    .Replace("[%rt]", reportingtime)
                            //    .Replace("[%moi]", modeofinterview)
                            //    .Replace("[%cp]", contactperson)
                            //    .Replace("@Venue", venuelabel)
                            //    .Replace("[%id]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString());
                            byte[] bb = null;
                            using (StringWriter sw = new StringWriter())
                            {
                                using (HtmlTextWriter hw = new HtmlTextWriter(sw))
                                {

                                    string sb = "<table width='100%' cellspacing='0' cellpadding='2'>";
                                    sb = sb + "<tr><td align='center' style='background-color: #18B5F0'><b>Job Description</b></td></tr>";
                                    sb = sb + "<tr><td  style='background-color: #18B5F0'>" + round.JobDescription + "</td></tr>";
                                    sb = sb + "</table>";

                                    StringReader sr = new StringReader(sb.ToString());

                                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
                                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                                    using (MemoryStream memoryStream = new MemoryStream())
                                    {
                                        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                                        pdfDoc.Open();
                                        htmlparser.Parse(sr);
                                        pdfDoc.Close();
                                        bb = memoryStream.ToArray();
                                        memoryStream.Close();

                                    }
                                }
                            }

                            if (bb != null)
                            {
                                //appointment_panel.Attachments.AddFileAttachment("Job Description.pdf", bb);
                                appointment_candidate.Attachments.AddFileAttachment("Job Description.pdf", bb);
                            }

                            appointment_candidate.Attachments.AddFileAttachment(@"\\ipagfileserver\Photos\ATS\ImpDocs\Infogain Mini Brochure.pdf");
                            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                            FileAttachment attachment = appointment_candidate.Attachments.AddFileAttachment(round.ResumePath);
                            attachment.IsInline = false;
                            try
                            {
                                appointment_candidate.Save(SendInvitationsMode.SendToNone);
                            }
                            catch (Exception ex)
                            {
                                appointment_candidate.Attachments.Remove(attachment);
                                ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_panel addToCalendar");
                            }

                            appointment_candidate.RequiredAttendees.Add(at);
                            appointment_candidate.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.email);
                            foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                            {
                                appointment_candidate.RequiredAttendees.Add(att.email);
                            }
                            appointment_candidate.OptionalAttendees.Add(round.recruiter.Email);
                            appointment_candidate.Update(ConflictResolutionMode.AutoResolve, SendInvitationsOrCancellationsMode.SendToAllAndSaveCopy);
                            objRepo.SaveCalenderId(cid, appointment_candidate.Id.UniqueId, msteamlink, EmpId, mid);
                        }
                    }
                    catch (Exception ex)
                    {
                        ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendar");
                    }
                });
                return "";
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendar");
                throw ex;
            }
        }

        public async System.Threading.Tasks.Task<string> sendEmailForMettlRound(int cid, string EmpId)
        {
            try
            {
                int result;
                RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                int interiviewtypeId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewType.Id;
                string interiviewBy = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x?.interviewBy).FirstOrDefault().ToString();
                if ((interiviewtypeId == 2 && interiviewBy == "M") || interiviewtypeId == 2 && interiviewBy == "C" || interiviewtypeId == 2 && interiviewBy == "G")
                {
                    await System.Threading.Tasks.Task.Run(() =>
                    {
                        try
                        {
                            string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                            string link = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.vanueOrLink).FirstOrDefault().ToString();
                            string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                            string recruiterEmail = round.recruiter.Email;
                            string contactperson = char.ToUpper(round.recruiter.Name[0]) + round.recruiter.Name.Substring(1);
                            int candidateGradeId = round.CandidateGradeId;
                            string isRenuTeam = round.IsRenuTeam.ToString();
                            string copyright = $"Copyright © {DateTime.Now.Year} Infogain Corporation. All rights reserved. All other trademarks are property of their respective owners.";
                            EmailTemplate template = new EmailTemplate();
                            if(interiviewBy == "C")
                            {
                                template = objRepo.getEmailTemplate(26048, EmpId);
                            }
                            else if (interiviewBy == "M")
                            {
                                template = objRepo.getEmailTemplate(3068, EmpId);
                            }
                            else if (interiviewBy == "G")
                            {
                                template = objRepo.getEmailTemplate(30127, EmpId);
                            }

                            var TempBody = template.Body
                            .Replace("[%s]", candidatename)
                            .Replace("[%link]", link)
                            .Replace("[%cp]", contactperson+' '+'-'+' ' + recruiterEmail)
                            .Replace("[%copyright]", copyright);
                            if (isRenuTeam == "N")
                            {
                                if (candidateGradeId == 202 || candidateGradeId == 203 || candidateGradeId == 204 || candidateGradeId == 205 || candidateGradeId == 206 || candidateGradeId == 207 || candidateGradeId == 219 || candidateGradeId == 220)
                                {
                                    TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>four days</b> per month from our office.");
                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>eight days</b> per month from our office.");
                                }
                            }
                            else
                            {
                                TempBody = TempBody.Replace("[%WfhStmt]", " ");

                            }
                            sendEmailBody emailBody = new sendEmailBody();
                            if(interiviewBy == "C" || interiviewBy == "M")
                            {
                                emailBody.message.subject = "Online Assessment || Interview Scheduled at Infogain";
                            }
                            else if (interiviewBy == "G")
                            {
                                emailBody.message.subject = "Online Assessment || Infogain";
                            }
                            bodyEmail emailContent = new bodyEmail();
                            emailContent.content = TempBody;
                            emailContent.contentType = "HTML";
                            emailBody.message.body = emailContent;
                            emailBody.saveToSentItems = true;
                            //emailBody.message.body.contentType = "Text";

                            MailAddress addressEmail = new MailAddress(recruiterEmail);
                            string hostEmail = addressEmail.Host;
                            int isInviteSendRecId = 1;
                            if (hostEmail.ToLower() != "infogain.com")
                            {
                                recruiterEmail = "ATS@igglobal.com";
                                isInviteSendRecId = 0;
                            }

                            Recipient candiidateEmailTo = new Recipient();
                            candiidateEmailTo.emailAddress.address = round.Email;
                            candiidateEmailTo.emailAddress.name = round.Name;
                            emailBody.message.toRecipients.Add(candiidateEmailTo);
                            var primaryInt = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer;
                            //Recipient candiidateEmailCC = new Recipient();
                            //candiidateEmailCC.emailAddress.address = primaryInt.email;
                            //candiidateEmailCC.emailAddress.name = primaryInt.Name;
                            //emailBody.message.ccRecipients.Add(candiidateEmailCC);
                            //if (isInviteSendRecId == 0)
                            //{
                            //    Recipient candiidateEmailCCRec = new Recipient();
                            //    candiidateEmailCCRec.emailAddress.address = round.recruiter.Email;
                            //    candiidateEmailCCRec.emailAddress.name = round.recruiter.Name;
                            //    emailBody.message.ccRecipients.Add(candiidateEmailCCRec);
                            //}

                            //foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                            //{
                            //    Recipient candiidateEmailCCAddional = new Recipient();
                            //    candiidateEmailCCAddional.emailAddress.address = att.email;
                            //    candiidateEmailCCAddional.emailAddress.name = att.Name;
                            //    emailBody.message.ccRecipients.Add(candiidateEmailCCAddional);
                            //}

                            // JD Attachment
                            var JdDesc = round.JobDescription.Replace("\r\n", "<br />");
                            var htmlJdDec = HtmlUnescape(JdDesc);
                            byte[] bb = null;
                            using (StringWriter sw = new StringWriter())
                            {
                                using (HtmlTextWriter hw = new HtmlTextWriter(sw))
                                {

                                    string sb = "<table width='100%' cellspacing='0' cellpadding='2'>";
                                    sb = sb + "<tr><td align='center' style='background-color: #18B5F0'><b>Job Description</b></td></tr>";
                                    sb = sb + "<tr><td  style='background-color: #18B5F0'>" + htmlJdDec + "</td></tr>";
                                    sb = sb + "</table>";

                                    StringReader sr = new StringReader(sb.ToString());

                                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
                                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                                    using (MemoryStream memoryStream = new MemoryStream())
                                    {
                                        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                                        pdfDoc.Open();
                                        htmlparser.Parse(sr);
                                        pdfDoc.Close();
                                        bb = memoryStream.ToArray();
                                        memoryStream.Close();

                                    }
                                }
                            }

                            if (bb != null)
                            {
                                EmailFileAttachment JD = new EmailFileAttachment();
                                JD.ODataType = "#microsoft.graph.fileAttachment";
                                JD.name = "Job Description.pdf";
                                JD.contentType = "text/plain";
                                JD.contentBytes = Convert.ToBase64String(bb);
                                emailBody.message.attachments.Add(JD);
                            }
                             string baseImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
                            string imagePath = System.IO.Path.Combine(baseImpDocPath, "Infogain Mini Brochure.pdf");
                          //  string brochurePath = new Uri(@"\\ipagfileserver\Photos\ATS\ImpDocs\Infogain- Explore Your Benefits.pdf").LocalPath;
                            byte[] brochureBytes = File.ReadAllBytes(imagePath);
                            EmailFileAttachment Mini = new EmailFileAttachment();
                            Mini.ODataType = "#microsoft.graph.fileAttachment";
                            Mini.name = "Infogain Mini Brochure.pdf";
                            Mini.contentType = "text/plain";
                            Mini.contentBytes = Convert.ToBase64String(brochureBytes);
                            emailBody.message.attachments.Add(Mini);

                            string token = GenerateToken();
                            string updateCal = SendEmailATS(emailBody, recruiterEmail, token);
                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraph");
                        }
                    });
                }
                else
                {
                    return "";
                }

                return "";

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraph");
                throw ex;
            }
        }

        public GetSharePointSiteId GetSiteIdSharedPoint(string token, string SiteName)
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                string _urlSession = "https://graph.microsoft.com/v1.0/sites?$search=" + SiteName;
                servicerequest = httpClient.GetAsync(_urlSession).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                GetSharePointSiteId jsonObj = JsonConvert.DeserializeObject<GetSharePointSiteId>(response);
                servicerequest.EnsureSuccessStatusCode();
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GetSiteIdSharedPoint");
                GetSharePointSiteId jsonObj = new GetSharePointSiteId();
                return jsonObj;
            }
        }
        public GetSharePointDriveId GetSharePointDriveId(string token, string SiteId)
        {

            GetSharePointDriveId jsonObj = new GetSharePointDriveId();
            HttpResponseMessage servicerequest = null;
            try
            {
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                string _urlSession = "https://graph.microsoft.com/v1.0/sites/" + SiteId + "/drives/";
                servicerequest = httpClient.GetAsync(_urlSession).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                jsonObj = JsonConvert.DeserializeObject<GetSharePointDriveId>(response);
                servicerequest.EnsureSuccessStatusCode();
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GetSharePointDriveId");
                return jsonObj;
            }
        }

        public GetSharePointSiteAndDriveId GetSharePointDriveIdAndSiteId(string token, string SiteName = "ATSWEB", string driveName = "Documents")
        {
            GetSharePointSiteAndDriveId jsonObj = new GetSharePointSiteAndDriveId();
            try
            {
                GetSharePointSiteId siteDetails = GetSiteIdSharedPoint(token, SiteName);
                SharePointSiteIdValue siteValues = new SharePointSiteIdValue();
                SharePointDriveIdValue driveValues = new SharePointDriveIdValue();
                if (siteDetails.value.Count != 0)
                {
                    siteValues = siteDetails.value.Where(x => x.displayName == SiteName).FirstOrDefault();
                    string SiteId = siteValues.id;
                    GetSharePointDriveId driveDetails = GetSharePointDriveId(token, SiteId);
                    driveValues = driveDetails.value.Where(x => x.name == driveName).FirstOrDefault();
                    jsonObj.siteId = SiteId;
                    jsonObj.driveId = driveValues.id;
                }
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GetSharePointDriveIdAndSiteId");

                return jsonObj;
            }
        }
        public string createSessionForUploadFileSharedPoint(string filePath, string token)
        {
            HttpResponseMessage servicerequestSession = null;
            try
            {
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                string _urlSession = "https://graph.microsoft.com/v1.0/drives/" + ConfigurationManager.AppSettings["SharePointDriveId"] + "/items/root:/" + filePath + ":/createUploadSession";
                servicerequestSession = httpClient.PostAsync(_urlSession, null).Result;
                string responseSession = servicerequestSession.Content.ReadAsStringAsync().Result;
                createUploadSession jsonObj = JsonConvert.DeserializeObject<createUploadSession>(responseSession);
                servicerequestSession.EnsureSuccessStatusCode();
                return jsonObj.uploadUrl;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "createSessionForUploadFileSharedPoint");
                return "";
            }
        }

        public UploadDetailsModel UploadFileToSharedPoint(uploadBodysharePoint uploadBodysharePoint, string token, string MethodName)
        {
            HttpResponseMessage servicerequestUpload = null;
            try
            {
                byte[] fileByte = Convert.FromBase64String(uploadBodysharePoint.file);
                string range = "bytes" + " 0-" + (uploadBodysharePoint.fileSize - 1) + "/" + uploadBodysharePoint.fileSize.ToString();
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                var contentUpload = new ByteArrayContent(fileByte);
                contentUpload.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                contentUpload.Headers.Add("Content-Range", range);
                contentUpload.Headers.Add("Content-Length", uploadBodysharePoint.fileSize.ToString());
                string _urlSend = uploadBodysharePoint.uploadUrl;
                servicerequestUpload = httpClient.PutAsync(_urlSend, contentUpload).Result;
                string responseUpload = servicerequestUpload.Content.ReadAsStringAsync().Result;
                UploadDetailsModel jsonObj = JsonConvert.DeserializeObject<UploadDetailsModel>(responseUpload);
                servicerequestUpload.EnsureSuccessStatusCode();
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", MethodName);
                UploadDetailsModel jsonObj = new UploadDetailsModel();
                return jsonObj;
            }
        }
        public UploadDetailsModel UploadFileToSharedPointFormData(uploadBodysharePoint uploadBodysharePoint, string token, string MethodName)
        {
            HttpResponseMessage servicerequestUpload = null;
            try
            {
              //  byte[] fileByte = Convert.FromBase64String(uploadBodysharePoint.file);
                string range = "bytes" + " 0-" + (uploadBodysharePoint.fileSize - 1) + "/" + uploadBodysharePoint.fileSize.ToString();
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                var contentUpload = new ByteArrayContent(uploadBodysharePoint.fileConv);
                contentUpload.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                contentUpload.Headers.Add("Content-Range", range);
                contentUpload.Headers.Add("Content-Length", uploadBodysharePoint.fileSize.ToString());
                string _urlSend = uploadBodysharePoint.uploadUrl;
                servicerequestUpload = httpClient.PutAsync(_urlSend, contentUpload).Result;
                string responseUpload = servicerequestUpload.Content.ReadAsStringAsync().Result;
                UploadDetailsModel jsonObj = JsonConvert.DeserializeObject<UploadDetailsModel>(responseUpload);
                servicerequestUpload.EnsureSuccessStatusCode();
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", MethodName);
                UploadDetailsModel jsonObj = new UploadDetailsModel();
                return jsonObj;
            }
        }
        public string SendEmailATS(object InviteSendBody, string recruiterEmail, string token)
        {
            HttpResponseMessage servicerequestSend = null;
            try
            {
                string jsonBodySend = JsonConvert.SerializeObject(InviteSendBody);
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                var contentSend = new StringContent(jsonBodySend);
                contentSend.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                string _urlSend = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/sendMail";
                servicerequestSend = httpClient.PostAsync(_urlSend, contentSend).Result;
                string responseSend = servicerequestSend.Content.ReadAsStringAsync().Result;
                servicerequestSend.EnsureSuccessStatusCode();
                return "";
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "SendEmailATS");
                return "";
            }
        }


        public async System.Threading.Tasks.Task<string> addToCalendarGraph(int cid, string EmpId, int flag,int isQuestionGen = 0)
        {
            try
            {
                int result;
                RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                // if (interiviewtypeId == 1 && HiringLocationId == 3 || interiviewBy == "M")
                int interiviewtypeId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewType.Id;
                string interiviewBy = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x?.interviewBy).FirstOrDefault().ToString();
                if (interiviewtypeId == 1 || interiviewBy == "M")
                {
                    return "";
                }
                await System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {

                     
                        int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
                        int EntityId = Convert.ToInt32(round.EntityId.ToString());
                        String FirstNameCandidate = round.FirstName.ToString();
                       
                        string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        // int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
                        string modeofinterview = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.mode).FirstOrDefault().ToString();
                        int modeofinterviewid = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.id).FirstOrDefault();
                        // string venuelabel = "Venue Details";
                        // DateTime interviewdate = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewDate).FirstOrDefault());
                        DateTime interviewdateUTC = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault());
                        //DateTime interviewdateUTC = Convert.ToDateTime("2024-08-22");

                        //string interviewdateUTC = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault().ToString();
                        string tz = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewTimeZone).FirstOrDefault().ToString();
                        var abbreviations = TZNames.GetAbbreviationsForTimeZone(tz, "en-US");
                        var winTz = TZConvert.IanaToWindows(tz);
                        DateTime interviewdate = ConvertUTCToTZ(interviewdateUTC, tz);
                        string interviewday = interviewdate.ToString("dddd");
                        string dayanddate = interviewday + ", " + interviewdate.ToString("dd MMM yyyy");
                        string reportingtime = interviewdate.AddMinutes(-30).ToString("HH:mm tt") + " " + abbreviations.Standard;
                        string contactperson = char.ToUpper(round.recruiter.Name[0]) + round.recruiter.Name.Substring(1);
                        string venue = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.vanueOrLink).FirstOrDefault().ToString();
                        string designation = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x._designation.desigName).FirstOrDefault().ToString();
                        string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                        int interiviewtypeID = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Id).FirstOrDefault();
                        string recruiterEmail = round.recruiter.Email;
                        string recruiterName = round.recruiter.Name;
                        string dayOfWeek = interviewdate.DayOfWeek.ToString();
                        string date = interviewdate.ToString("MMM dd"); 
                        string time = interviewdate.ToString("h:mm tt") + " ( " + abbreviations.Standard+" )" ;
                        string interviewerName = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name;
                        string SubjectLineEmail = "Interview Scheduled at Infogain";
                        string InterviewModeLine = "";
                        int candidateGradeId = round.CandidateGradeId;
                        string isRenuTeam = round.IsRenuTeam.ToString();
                        string copyright = $"Copyright © {DateTime.Now.Year} Infogain Corporation. All rights reserved. All other trademarks are property of their respective owners.";


                        if (modeofinterviewid != 2)
                        {
                            reportingtime = interviewdate.ToString("HH:mm tt") + " " + abbreviations.Standard;
                            contactperson = char.ToUpper(round.recruiter.Name[0]) + round.recruiter.Name.Substring(1);
                        }

                        EmailTemplate template = new EmailTemplate();
                        int ISTemplate2027 = 0;
                        //US
                        if (HiringLocationId == 3)
                        {
                            //face to Face
                            if(modeofinterviewid == 2)
                            {
                                InterviewModeLine = "This will be in person interview.";
                            }
                            //Telephonic
                            if (modeofinterviewid == 3)
                            {
                                InterviewModeLine = "This will be  telephonic interview.";
                            }
                            //Revel
                            if (EntityId == 22)
                            {
                                SubjectLineEmail = "Interview Scheduled at Revel + Infogain ";
                                /**
                                 * Face to face/Telephonic
                                 ***/
                                if (modeofinterviewid == 2 || modeofinterviewid == 3)
                                {
                                    template = objRepo.getEmailTemplate(30056, EmpId);
                                }
                                //Ms team
                                else
                                {
                                    template = objRepo.getEmailTemplate(30055, EmpId);
                                }

                            }
                            //Infogain
                            else
                            {

                                SubjectLineEmail = "Interview Scheduled at  Infogain";
                                /**
                                * Face to face/Telephonic
                                ***/
                                if (modeofinterviewid == 2 || modeofinterviewid == 3)
                                {
                                    template = objRepo.getEmailTemplate(30059, EmpId);
                                }
                                //Ms team
                                else
                                {
                                    template = objRepo.getEmailTemplate(30058, EmpId);
                                }
                            }


                        }
                        //India Location
                        else
                        {
                            SubjectLineEmail = "Interview Scheduled at Infogain ";
                            if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 2)
                            {
                                template = objRepo.getEmailTemplate(2027, EmpId);
                                ISTemplate2027 = 1;
                            }
                            else
                            {
                                template = objRepo.getEmailTemplate(2028, EmpId);
                            }
                        }


                        
                        

                        string msteamlink = "";
                        string mid = "";
                        string iCalUId = "";
                        var endDateRn = interviewdate.AddMinutes(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewDuration);

                        /***
                         *  create meeting event as draft
                         * ***/

                        string rescheduleText = flag == 2 ? "Reschedule : " : "";
                        MailAddress addressEmail = new MailAddress(recruiterEmail);
                        string hostEmail = addressEmail.Host;
                        int isInviteSendRecId = 1;
                        if (hostEmail.ToLower() != "infogain.com")
                        {
                            recruiterEmail = "ATS@igglobal.com";
                            isInviteSendRecId = 0;
                        }

                        var subject = "";
                        //Us
                        if (HiringLocationId == 3)
                        {
                            subject = rescheduleText + interiviewtype + " || "+ SubjectLineEmail + " || " + candidatename + " || " + dayanddate + " " + time;
                        }
                        else
                        {
                            subject = rescheduleText + interiviewtype + " || Interview Scheduled at Infogain";
                        }

                        var bodyDraft = new
                        {

                            start = new { dateTime = interviewdate, timeZone = winTz },
                            end = new { dateTime = endDateRn, timeZone = winTz },
                            subject = subject,
                            allowNewTimeProposals = true,
                            isOnlineMeeting = true,
                            importance = "high",
                            reminderMinutesBeforeStart = 15

                        };

                        string jsonBodyEvent = JsonConvert.SerializeObject(bodyDraft);
                        HttpResponseMessage servicerequest = null;
                        //   string json = JsonConvert.SerializeObject(data);
                        var content = new StringContent(jsonBodyEvent.ToString(), System.Text.Encoding.UTF8, "application/json");
                        string token = GenerateToken();
                        HttpClient httpClient = new HttpClient();
                        //  string fromDate = DateTime.Now.ToString("yyyy-mm-dd");
                        string _url = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/calendar/events";
                        httpClient.BaseAddress = new Uri(_url);
                        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                        servicerequest = httpClient.PostAsync(_url, content).Result;
                        string response = servicerequest.Content.ReadAsStringAsync().Result;
                        CalendarEventGraph jsonObj = JsonConvert.DeserializeObject<CalendarEventGraph>(response);
                        msteamlink = jsonObj.onlineMeeting.joinUrl;
                        mid = jsonObj.id;
                        iCalUId = jsonObj.iCalUId;

                        var TempBody = "";

                        if(HiringLocationId == 3)
                        {
                            TempBody = template.Body
                                 .Replace("[CandidateFirstName]", FirstNameCandidate)
                                 .Replace("[Dayoftheweek]", dayOfWeek)
                                 .Replace("[MonthDay]", date)
                                 .Replace("[Time]", time)
                                 .Replace("[InterviewerName]", interviewerName)
                                 .Replace("[Link]", msteamlink)
                                 .Replace("[RecruiterName]", recruiterName)
                                 .Replace("[InterviewModeLine]", InterviewModeLine);

                        }
                        
                        else
                        {
                            TempBody = template.Body
                      .Replace("[%s]", candidatename)
                      .Replace("[%d]", dayanddate)
                      .Replace("[%rt]", reportingtime)
                      .Replace("[%moi]", modeofinterview)
//.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())
.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" :
                            HiringLocationId != 3 ? round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewLocationAddress.ToString() : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())
                      .Replace("[%Interviewer]", round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name)
                      .Replace("[%cp]", contactperson)
                      .Replace("[%copyright]", copyright); 


                            if (interiviewtypeID == 1)
                            {
                                TempBody = TempBody.Replace("[%stmt]", "Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further. Attaching the job description for your reference.");
                            }
                            else
                            {
                                if (round.roundList.Where(x => x.interviewType.Id == 2).Count() > 1 || interiviewtypeID == 3 || interiviewtypeID == 4 || interiviewtypeID == 5 || interiviewtypeID == 6 || interiviewtypeID == 7)
                                {
                                    //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                                    //firstround
                                    //secondround
                                    TempBody = TempBody.Replace("[%stmt]", "<p>Greetings from Infogain!</br>You have been shortlisted for the next round interview. Attaching the job description for your reference.</p>");

                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%stmt]", "<p>Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further.</br>Attaching the job description for your reference.</p>");

                                }

                            }

                            if (HiringLocationId == 3)
                            {
                                TempBody = TempBody.Replace("[%IDProof]", "");
                            }
                            else
                            {
                                if (ISTemplate2027 == 1)
                                {
                                    TempBody = TempBody.Replace("[%IDProof]", "<li>One government photo ID card to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%IDProof]", "<li>A government photo ID proof to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                }
                                if (isRenuTeam == "N")
                                {
                                    if (candidateGradeId == 202 || candidateGradeId == 203 || candidateGradeId == 204 || candidateGradeId == 205 || candidateGradeId == 206 || candidateGradeId == 207 || candidateGradeId == 219 || candidateGradeId == 220)
                                    {
                                        TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>four days</b> per month from our office.");
                                    }
                                    else
                                    {
                                        TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>eight days</b> per month from our office.");
                                    }
                                }
                                else
                                {
                                    TempBody = TempBody.Replace("[%WfhStmt]", " ");

                                }
                            }

                        }
                        /***
                             * add attachements
                             ***/


                        // JD Attachment
                        var JdDesc = round.JobDescription.Replace("\r\n", "<br />");
                        var htmlJdDec = HtmlUnescape(JdDesc);
                        byte[] bb = null;

                        try
                        {
                            using (StringWriter sw = new StringWriter())
                            {
                                using (HtmlTextWriter hw = new HtmlTextWriter(sw))
                                {

                                    string sb = "<table width='100%' cellspacing='0' cellpadding='2'>";
                                    sb = sb + "<tr><td align='center' style='background-color: #18B5F0'><b>Job Description</b></td></tr>";
                                    sb = sb + "<tr><td  style='background-color: #18B5F0'>" + htmlJdDec + "</td></tr>";
                                    sb = sb + "</table>";

                                    StringReader sr = new StringReader(sb.ToString());

                                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
                                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                                    using (MemoryStream memoryStream = new MemoryStream())
                                    {
                                        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                                        pdfDoc.Open();
                                        htmlparser.Parse(sr);
                                        pdfDoc.Close();
                                        bb = memoryStream.ToArray();
                                        memoryStream.Close();

                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "JD HTML");
                        }
                        

                        int profileId = round.sourceProfile.Id;
                        // CV Attachment
                        byte[] resumeBytes = null;
                        try
                        {
                            string filePath = "";
                            //if Cskill profile
                            if (profileId == 3)
                            {
                                try
                                {
                                    byte[] fileBytesEnc;
                                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                    using (HttpClient client = new HttpClient())
                                    {
                                        client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                                        HttpResponseMessage responseResume = client.GetAsync(round.ResumePath).Result;
                                        responseResume.EnsureSuccessStatusCode();
                                        fileBytesEnc = responseResume.Content.ReadAsByteArrayAsync().Result;
                                    }

                                    if (fileBytesEnc != null || fileBytesEnc.Length != 0)
                                    {
                                        resumeBytes = DecryptFile(fileBytesEnc);
                                    }
                                    //HttpClient ResumeClient = new HttpClient();
                                    //HttpResponseMessage responseResume = ResumeClient.GetAsync(round.ResumePath).Result;
                                    //responseResume.EnsureSuccessStatusCode();
                                    //resumeBytes = responseResume.Content.ReadAsByteArrayAsync().Result;
                                }
                                catch (Exception ex)
                                {
                                    ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_resume_Cskill_parse");
                                }


                            }
                            //other profile
                            else
                            {
                                //filePath = new Uri(round.ResumePath).LocalPath;
                                //string fileName = Path.GetFileName(filePath);
                                //resumeBytes = File.ReadAllBytes(filePath);
                              //  filePath = new Uri(round.ResumePath).LocalPath;
                                string fileNameEnc = Path.GetFileName(round.ResumePath);
                                //   resumeBytes = File.ReadAllBytes(filePath);
                                string fileName = RemoveLastExtension(fileNameEnc);
                                byte[] encryptedBytes;

                                using (FileStream fs = new FileStream(round.ResumePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                                {
                                    encryptedBytes = new byte[fs.Length];
                                    fs.Read(encryptedBytes, 0, encryptedBytes.Length);
                                }

                                 resumeBytes = DecryptFile(encryptedBytes);
                            }



                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_ addToCalendar_resume_parse");
                        }

                        // JD Attachment uplaod API Method
                        try
                        {
                            string jDAttach = attachFileInMeeting(Convert.ToBase64String(bb), "Job Description.pdf", mid, recruiterEmail, token);
                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_attachment-JD");
                        }
                        // CV Attachment uplaod API Method
                        try
                        {
                            if (resumeBytes != null)
                            {
                                string CvAttach = attachFileInMeeting(Convert.ToBase64String(resumeBytes),  RemoveLastExtension(round.Resume), mid, recruiterEmail, token);
                            }

                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_attachment-resume");
                        }
                        // Brochure Attachment uplaod API Method
                        try
                        {
                            string baseImpDocPath = ConfigurationManager.AppSettings["ImpDocPath"];
                            string brochurePath = System.IO.Path.Combine(baseImpDocPath, "Infogain Mini Brochure.pdf");
                           // string brochurePath = new Uri(@"\\ipagfileserver\Photos\ATS\ImpDocs\Infogain- Explore Your Benefits.pdf").LocalPath;
                            byte[] brochureBytes = File.ReadAllBytes(brochurePath);
                            string BrochureAttach = attachFileInMeeting(Convert.ToBase64String(brochureBytes), "Infogain Mini Brochure.pdf", mid, recruiterEmail, token);
                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "appointment_attachment-Brochure");
                        }




                        /***
                         * sent to attendee
                         * **/


                        createEventBody InviteSendBody = new createEventBody();

                        InviteSendBody.body.content = TempBody;
                        InviteSendBody.body.contentType = "HTML";

                        // candidate
                        attendeesList attendeesCandidate = new attendeesList();
                        if (interiviewBy == "E")
                        {
                            attendeesCandidate.emailAddress.address = round.recruiter.Email;
                            attendeesCandidate.emailAddress.name = round.recruiter.Name;
                            attendeesCandidate.type = "optional";
                            InviteSendBody.attendees.Add(attendeesCandidate);
                        }
                        else
                        {
                            attendeesCandidate.emailAddress.address = round.Email;
                            attendeesCandidate.emailAddress.name = round.Name;
                            attendeesCandidate.type = "required";
                            InviteSendBody.attendees.Add(attendeesCandidate);
                        }



                        // if email send form ats email id then add recruiter add as optional
                        if (isInviteSendRecId == 0)
                        {
                            attendeesList attendeesRecruiter = new attendeesList();
                            attendeesRecruiter.emailAddress.address = round.recruiter.Email;
                            attendeesRecruiter.emailAddress.name = round.recruiter.Name;
                            attendeesRecruiter.type = "optional";
                            InviteSendBody.attendees.Add(attendeesRecruiter);
                        }
                        //primary interviwer
                        var primaryInt = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer;
                        attendeesList attendeesPrimaryInt = new attendeesList();
                        attendeesPrimaryInt.emailAddress.address = primaryInt.email;
                        attendeesPrimaryInt.emailAddress.name = primaryInt.Name;
                        attendeesPrimaryInt.type = "required";

                        InviteSendBody.attendees.Add(attendeesPrimaryInt);
                        //additional interviwer
                        foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                        {
                            attendeesList attendeesListAdditional = new attendeesList();
                            attendeesListAdditional.emailAddress.address = att.email;
                            attendeesListAdditional.emailAddress.name = att.Name;
                            attendeesListAdditional.type = "optional";
                            InviteSendBody.attendees.Add(attendeesListAdditional);
                        }

                        // testJ testJB = new List<object>();
                        //var dataSourceList = new List<object>();
                        //var vgbn = new
                        //{
                        //    emailAddress = new { address = "ayatullah.rahmani@infogain.com", name = "Ayat" },
                        //    type = "optional"
                        //};
                        ////  dataSourceList.Add(vgbn);
                        //createEventBodyOsg.attendees.Add(vgbn);


                        //string jsonBodySend = JsonConvert.SerializeObject(InviteSendBody);
                        //HttpResponseMessage servicerequestSend = null;
                        //var contentSend = new StringContent(jsonBodySend);
                        //contentSend.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                        //string _urlSend = "https://graph.microsoft.com/v1.0/users/"+ recruiterEmail + "/calendar/events/" + mid;
                        //servicerequestSend = httpClient.PatchAsyncAyat(_urlSend, contentSend).Result;
                        //string responseSend = servicerequestSend.Content.ReadAsStringAsync().Result;
                        string updateCal = updateCalenderEventGraph(InviteSendBody, mid, recruiterEmail, token);

                        objRepo.SaveCalenderId(cid, iCalUId, msteamlink, EmpId, mid);

                        if(isQuestionGen == 1)
                        {
                            System.Threading.Tasks.Task<string> autQuestionSave = UpdateAutoQuestionsForTechRound(cid, EmpId);
                        }

                    }
                    catch (Exception ex)
                    {
                        ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraph");
                    }
                });
                return "1";
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraph");
                throw ex;
            }
        }

        public string updateCalenderEventGraph(object InviteSendBody, string mid, string recruiterEmail, string token)
        {
            HttpResponseMessage servicerequestSend = null;
            try
            {
                // string token = GenerateToken();
                string jsonBodySend = JsonConvert.SerializeObject(InviteSendBody);
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                var contentSend = new StringContent(jsonBodySend);
                contentSend.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                string _urlSend = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/calendar/events/" + mid;
                servicerequestSend = httpClient.PatchAsyncAyat(_urlSend, contentSend).Result;
                string responseSend = servicerequestSend.Content.ReadAsStringAsync().Result;
                servicerequestSend.EnsureSuccessStatusCode();
                return "";
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "updateCalenderEventGraph");
                return "";
            }
        }

       

        public string cancelCalenderEventGraph(object InviteSendBody, string mid, string recruiterEmail, string token)
        {

            try
            {
                HttpResponseMessage servicerequestSend = null;
                // string token = GenerateToken();
                string jsonBodySend = JsonConvert.SerializeObject(InviteSendBody);
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                var contentSend = new StringContent(jsonBodySend);
                contentSend.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                string _urlSend = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/calendar/events/" + mid + "/cancel";
                servicerequestSend = httpClient.PostAsync(_urlSend, contentSend).Result;
                servicerequestSend.EnsureSuccessStatusCode();
                string responseSend = servicerequestSend.Content.ReadAsStringAsync().Result;
                return "";
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "cancelCalenderEventGraph");
                return "";
            }
        }

        public string deleteCalenderEventGraph(string mid, string recruiterEmail, string token)
        {

            try
            {
                HttpResponseMessage servicerequestSend = null;
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                string _urlSend = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/calendar/events/" + mid + "/cancel";
                servicerequestSend = httpClient.DeleteAsync(_urlSend).Result;
                servicerequestSend.EnsureSuccessStatusCode();
                string responseSend = servicerequestSend.Content.ReadAsStringAsync().Result;
                return "";
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "cancelCalenderEventGraph");
                return "";
            }
        }

        public string attachFileInMeeting(string contentBaseString, string name, string mid, string recruiterEmail, string token)
        {


            HttpResponseMessage servicerequest = null;
            try
            {
                FileAttachmentE FileAttachmentE = new FileAttachmentE();
                FileAttachmentE.ODataType = "#microsoft.graph.fileAttachment";
                FileAttachmentE.Name = name;
                FileAttachmentE.ContentBytes = contentBaseString;
                string json = JsonConvert.SerializeObject(FileAttachmentE);
                var content = new StringContent(json.ToString(), System.Text.Encoding.UTF8, "application/json");
                //  string token = GenerateToken();
                HttpClient httpClient = new HttpClient();
                //  string fromDate = DateTime.Now.ToString("yyyy-mm-dd");
                string _urlUploadDoc = "https://graph.microsoft.com/v1.0/users/" + recruiterEmail + "/calendar/events/" + mid + "/attachments";
                httpClient.BaseAddress = new Uri(_urlUploadDoc);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");


                //    var content = new StringContent(null,System.Text.Encoding.UTF8, "application/json");
                servicerequest = httpClient.PostAsync(_urlUploadDoc, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                servicerequest.EnsureSuccessStatusCode();
                return "";
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "attachFileInMeeting");
                return "";
            }


        }

        /***
         * Get access token bahalf of user
         * **/
        public string getAccessToen(string code)
        {

            HttpResponseMessage servicerequest = null;
            try
            {
                string clientId = ConfigurationManager.AppSettings["clientId"];
                string clientSecret = ConfigurationManager.AppSettings["clientSecret"];
                string redirectURI = ConfigurationManager.AppSettings["redirectURI"];
                var requestContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id",clientId),
              //  new KeyValuePair<string, string>("scope", "user.read%20mail.read"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectURI),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                // ...
            });
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpClient httpClient = new HttpClient();
                string _url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
                servicerequest = httpClient.PostAsync(_url, requestContent).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                servicerequest.EnsureSuccessStatusCode();
                getOffice365AccessToken jsonObj = JsonConvert.DeserializeObject<getOffice365AccessToken>(response);
                return jsonObj.access_token;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "getAccessToken");
                return "";
            }

        }

        public getUserDetailsOffice GetUserDetailsMS(string code)
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                string token = getAccessToen(code);
                //  string jsonBodySend = JsonConvert.SerializeObject(InviteSendBody);
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                //  var contentSend = new StringContent(jsonBodySend);
                //   contentSend.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                string _urlSend = "https://graph.microsoft.com/v1.0/me";
                servicerequest = httpClient.GetAsync(_urlSend).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                servicerequest.EnsureSuccessStatusCode();
                getUserDetailsOffice jsonObj = JsonConvert.DeserializeObject<getUserDetailsOffice>(response);
                return jsonObj;
            }
            catch (HttpRequestException ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GETMEOFFICE");
                //   getUserDetailsOffice jsonObj = JsonConvert.DeserializeObject<getUserDetailsOffice>(response);

                return null;
            }
        }
        public string getEmailBody(CandidateDetails cd)
        {
            EmailTemplate template = objRepo.getEmailTemplate(1, cd.createdBy);
            template.Body.Replace("[%s]", cd.username).Replace("[%e]", "Infogain");
            return "";
        }


        public async System.Threading.Tasks.Task<string> rescheduleCancelEventGraph(int cid, string EmpId, int statusId,int isQuestionGen =0)
        {
            try
            {
                
               // int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
             //   int EntityId = Convert.ToInt32(round.EntityId.ToString());
              //  string FirstNameCandidate = round.FirstName.ToString();
                await System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {
                        int result;
                        RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                        int EntityId = Convert.ToInt32(round.EntityId.ToString());
                        string FirstNameCandidate = round.FirstName.ToString();
                        string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
                        string modeofinterview = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.mode).FirstOrDefault().ToString();
                        int modeofinterviewid = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.id).FirstOrDefault();
                        DateTime interviewdateUTC = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault());
                        //string interviewdateUTC = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault().ToString();
                        string tz = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewTimeZone).FirstOrDefault().ToString();
                        var winTz = TZConvert.IanaToWindows(tz);
                        DateTime interviewdate = ConvertUTCToTZ(interviewdateUTC, tz);
                        var abbreviations = TZNames.GetAbbreviationsForTimeZone(tz, "en-US");
                        string interviewday = interviewdate.ToString("dddd");
                        string dayanddate = interviewday + ", " + interviewdate.ToString("dd MMM yyyy");
                        string reportingtime = interviewdate.AddMinutes(-30).ToString("HH:mm tt") + " " + abbreviations.Standard;
                        string contactperson = round.recruiter.Name;
                        string venue = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.vanueOrLink).FirstOrDefault().ToString();
                        string designation = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x._designation.desigName).FirstOrDefault().ToString();
                        string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                        int interiviewtypeID = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Id).FirstOrDefault();
                        string recruiterEmail = round.recruiter.Email;
                        int candidateGradeId = round.CandidateGradeId;
                        string isRenuTeam = round.IsRenuTeam.ToString();


                        // string recruiterEmail = "ayatullah.rahmani@infogain.com";
                        string recruiterName = round.recruiter.Name;
                        string dayOfWeek = interviewdate.DayOfWeek.ToString();
                        string date = interviewdate.ToString("MMM dd");
                        string time = interviewdate.ToString("h:mm tt") + " ( " + abbreviations.Standard + " )";
                        string interviewerName = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name;
                        string InterviewModeLine = "";
                        string SubjectLineEmail = "Interview Scheduled at Infogain";
                        /***
                       * Reschedule Interview
                       * **/
                        if (statusId == 3)
                        {
                            try
                            {
                                string mid = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().MSTeamMeetingId;
                                // if meeting id not available
                                if (mid == "" || mid == null)
                                {
                                    System.Threading.Tasks.Task<string> CalanderId = addToCalendarGraph(cid, EmpId, 2,isQuestionGen);
                                }
                                //if meeting id available
                                else
                                {
                                   // System.Threading.Tasks.Task<string> autQuestionSave = UpdateAutoQuestionsForTechRound(cid, EmpId);

                                    int ISTemplate2027 = 0;
                                    if (modeofinterviewid != 2)
                                    {
                                        //reporttimelabel = "Joining Time";
                                        //contactpersonlabel = "Interviewer";
                                        //venuelabel = "Link Details";
                                        // reportingtime = interviewdate.ToString("HH:mm tt")+" "+ abbreviations.Standard;
                                        reportingtime = interviewdate.ToString("HH:mm tt") + " " + abbreviations.Standard;
                                        contactperson = round.recruiter.Name;
                                    }


                                    EmailTemplate template = new EmailTemplate();
                                    //   int ISTemplate2027 = 0;
                                    //US
                                    if (HiringLocationId == 3)
                                    {
                                        //face to Face
                                        if (modeofinterviewid == 2)
                                        {
                                            InterviewModeLine = "This will be in person interview.";
                                        }
                                        //Telephonic
                                        if (modeofinterviewid == 3)
                                        {
                                            InterviewModeLine = "This will be  telephonic interview.";
                                        }

                                        if (EntityId == 22)
                                        {
                                            SubjectLineEmail = "Interview Scheduled at Revel + Infogain ";
                                            /**
                                             * Face to face/Telephonic
                                             ***/
                                            if (modeofinterviewid == 2 || modeofinterviewid == 3)
                                            {
                                                template = objRepo.getEmailTemplate(30056, EmpId);
                                            }
                                            //Ms team
                                            else
                                            {
                                                template = objRepo.getEmailTemplate(30055, EmpId);
                                            }

                                        }
                                        //Infogain
                                        else
                                        {

                                            SubjectLineEmail = "Interview Scheduled at  Infogain";
                                            /**
                                            * Face to face/Telephonic
                                            ***/
                                            if (modeofinterviewid == 2 || modeofinterviewid == 3)
                                            {
                                                template = objRepo.getEmailTemplate(30059, EmpId);
                                            }
                                            //Ms team
                                            else
                                            {
                                                template = objRepo.getEmailTemplate(30058, EmpId);
                                            }
                                        }

                                    }

                                    //India Location
                                    else
                                    {
                                        SubjectLineEmail = "Interview Scheduled at Infogain ";
                                        if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 2)
                                        {
                                            template = objRepo.getEmailTemplate(2027, EmpId);
                                            ISTemplate2027 = 1;
                                        }
                                        else
                                        {
                                            template = objRepo.getEmailTemplate(2028, EmpId);
                                        }
                                    }
                                    //if (EntityId == 22)
                                    //{
                                    //    /**
                                    //     * Face to face/Telephonic
                                    //     ***/
                                    //    if (modeofinterviewid == 2 || modeofinterviewid == 3)
                                    //    {
                                    //        template = objRepo.getEmailTemplate(30056, EmpId);
                                    //    }
                                    //    else
                                    //    {
                                    //        template = objRepo.getEmailTemplate(30055, EmpId);
                                    //    }

                                    //}
                                    //else
                                    //{
                                    //    if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 2)
                                    //    {
                                    //        template = objRepo.getEmailTemplate(2027, EmpId);
                                    //        ISTemplate2027 = 1;
                                    //    }
                                    //    else
                                    //    {
                                    //        template = objRepo.getEmailTemplate(2028, EmpId);
                                    //    }
                                    //}
                                    //template = objRepo.getEmailTemplate(8, EmpId);

                                    //EmailTemplate panel_template = objRepo.getEmailTemplate(2, EmpId);

                                    //appointment_candidate.Start = interviewdate;
                                    var endDateRn = interviewdate.AddMinutes(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewDuration);
                                    //appointment_candidate.ReminderDueBy = appointment_candidate.Start.AddMinutes(-15);

                                    string msteamlink = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().PanelCalendarID;
                                    //string newmid = "";
                                    //  updateCalendar(appointment_candidate.Start, appointment_candidate.End, appointment_candidate.Subject, mid, out msteamlink, out newmid);

                                    //appointment_candidate.Subject = "Reschedule : " + interiviewtype + " || Interview Scheduled at Infogain";


                                    var TempBody = "";

                                    var subject = "";
                                    string copyright = $"Copyright © {DateTime.Now.Year} Infogain Corporation. All rights reserved. All other trademarks are property of their respective owners.";
                                    if (HiringLocationId == 3)
                                    {
                                        TempBody = template.Body
                                             .Replace("[CandidateFirstName]", FirstNameCandidate)
                                             .Replace("[Dayoftheweek]", dayOfWeek)
                                             .Replace("[MonthDay]", date)
                                             .Replace("[Time]", time)
                                             .Replace("[InterviewerName]", interviewerName)
                                             .Replace("[Link]", msteamlink)
                                             .Replace("[RecruiterName]", recruiterName)
                                             .Replace("[InterviewModeLine]", InterviewModeLine);

                                        subject = "Reschedule : " + interiviewtype + " || "+ SubjectLineEmail + " || " + candidatename + " || " + dayanddate + " " + reportingtime;

                                    }
                                    else
                                    {
                                        TempBody = template.Body
                                                                                .Replace("[%s]", candidatename)
                                                                                .Replace("[%d]", dayanddate)
                                                                                .Replace("[%rt]", reportingtime)
                                                                                .Replace("[%moi]", modeofinterview)
.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" :
                            HiringLocationId != 3 ? round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewLocationAddress.ToString() : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())                                                                                //.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())

                                                                                .Replace("[%Interviewer]", round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name)
                                                                                .Replace("[%cp]", contactperson)
                                         .Replace("[%copyright]", copyright);

                                        if (interiviewtypeID == 1)
                                        {
                                            TempBody = TempBody.Replace("[%stmt]", "Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further. Attaching the job description for your reference. ");
                                        }
                                        else
                                        {
                                            //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                                            if (round.roundList.Where(x => x.interviewType.Id == 2).Count() > 1 || interiviewtypeID == 3 || interiviewtypeID == 4 || interiviewtypeID == 5 || interiviewtypeID == 6 || interiviewtypeID == 7)
                                            {
                                                //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                                                //firstround
                                                //secondround
                                                TempBody = TempBody.Replace("[%stmt]", "<p>Greetings from Infogain!</br>You have been shortlisted for the next round interview. Attaching the job description for your reference.</p>");

                                            }
                                            else
                                            {
                                                TempBody = TempBody.Replace("[%stmt]", "<p>Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further.</br>Attaching the job description for your reference.</p>");

                                            }
                                        }

                                        if (HiringLocationId == 3)
                                        {
                                            subject = "Reschedule : " + interiviewtype + " || Interview Scheduled at Infogain" + " || " + candidatename + " || " + dayanddate + " " + reportingtime;
                                            TempBody = TempBody.Replace("[%IDProof]", "");
                                        }
                                        else
                                        {
                                            if (ISTemplate2027 == 1)
                                            {
                                                TempBody = TempBody.Replace("[%IDProof]", "<li>One government photo ID card to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                            }
                                            else
                                            {
                                                TempBody = TempBody.Replace("[%IDProof]", "<li>A government photo ID proof to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                                            }

                                            if (isRenuTeam == "N")
                                            {
                                                if (candidateGradeId == 202 || candidateGradeId == 203 || candidateGradeId == 204 || candidateGradeId == 205 || candidateGradeId == 206 || candidateGradeId == 207 || candidateGradeId == 219 || candidateGradeId == 220)
                                                {
                                                    TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>four days</b> per month from our office.");
                                                }
                                                else
                                                {
                                                    TempBody = TempBody.Replace("[%WfhStmt]", "We have adopted a hybrid working model at Infogain. Employees will be required to work a minimum of <b>eight days</b> per month from our office.");
                                                }
                                            }
                                            else
                                            {
                                                TempBody = TempBody.Replace("[%WfhStmt]", " ");

                                            }
                                            subject = "Reschedule : " + interiviewtype + " || Interview Scheduled at Infogain";
                                        }

                                    }
                                 
                                    

                                   

                                    
                                    createEventBodyUpdate InviteSendBody = new createEventBodyUpdate();
                                    InviteSendBody.subject = subject;
                                    InviteSendBody.start.dateTime = interviewdate.ToString();
                                    InviteSendBody.start.timeZone = winTz;
                                    InviteSendBody.end.dateTime = endDateRn.ToString();
                                    InviteSendBody.end.timeZone = winTz;
                                    //  InviteSendBody.allowNewTimeProposals = true;
                                    // InviteSendBody.allowNewTimeProposals = true;
                                    InviteSendBody.body.content = TempBody;
                                    InviteSendBody.body.contentType = "HTML";

                                    // candidate
                                    attendeesList attendeesCandidate = new attendeesList();
                                    attendeesCandidate.emailAddress.address = round.Email;
                                    attendeesCandidate.emailAddress.name = round.Name;
                                    attendeesCandidate.type = "required";
                                    InviteSendBody.attendees.Add(attendeesCandidate);


                                    //primary interviwer
                                    var primaryInt = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer;
                                    attendeesList attendeesPrimaryInt = new attendeesList();
                                    attendeesPrimaryInt.emailAddress.address = primaryInt.email;
                                    attendeesPrimaryInt.emailAddress.name = primaryInt.Name;
                                    attendeesPrimaryInt.type = "required";

                                    InviteSendBody.attendees.Add(attendeesPrimaryInt);
                                    //additional interviwer
                                    foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                                    {
                                        attendeesList attendeesListAdditional = new attendeesList();
                                        attendeesListAdditional.emailAddress.address = att.email;
                                        attendeesListAdditional.emailAddress.name = att.Name;
                                        attendeesListAdditional.type = "optional";
                                        InviteSendBody.attendees.Add(attendeesListAdditional);
                                    }
                                    string token = GenerateToken();

                                    MailAddress addressEmail = new MailAddress(recruiterEmail);
                                    string hostEmail = addressEmail.Host;
                                    if (hostEmail.ToLower() != "infogain.com")
                                    {
                                        recruiterEmail = "ATS@igglobal.com";
                                        // if email send form ats email id then add recruiter add as optional
                                        attendeesList attendeesRecruiter = new attendeesList();
                                        attendeesRecruiter.emailAddress.address = round.recruiter.Email;
                                        attendeesRecruiter.emailAddress.name = round.recruiter.Name;
                                        attendeesRecruiter.type = "optional";
                                        InviteSendBody.attendees.Add(attendeesRecruiter);
                                    }

                                    // string mid = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().MSTeamMeetingId;
                                    string updateCal = this.updateCalenderEventGraph(InviteSendBody, mid, recruiterEmail, token);

                                    if (isQuestionGen == 1)
                                    {
                                        System.Threading.Tasks.Task<string> autQuestionSave = UpdateAutoQuestionsForTechRound(cid, EmpId);
                                    }
                                }

                            }
                            catch (AggregateException ec)
                            {
                                ExceptionLogging.SendExcepToDB(ec, "Common", "rescheduleEventGraphSchAggregate");
                            }
                            catch (Exception ec)
                            {
                                ExceptionLogging.SendExcepToDB(ec, "Common", "rescheduleEventGraphSch");
                            }
                        }

                        /***
                         * Cancel Interview
                         * **/

                        else if (statusId == 2)
                        {
                            try
                            {
                                EmailTemplate template = new EmailTemplate();
                                template = objRepo.getEmailTemplate(6, EmpId);
                                //DateTime interviewdate = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewDate).FirstOrDefault().ToString());

                              //  string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                                string interviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                                // string recruiterEmail = round.recruiter.Email;
                                // string recruiterEmail = "ayatullah.rahmani@infogain.com";
                                // string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                                //  string recruiterName = round.recruiter.Name;
                                var TempBody = "";
                                var SubjectCancel = "Interview Scheduled at Infogain";
                                //US
                                if (HiringLocationId == 3)
                                {
                                    template = objRepo.getEmailTemplate(30060, EmpId);
                                    TempBody = template.Body
                                 .Replace("[CandidateFirstName]", FirstNameCandidate)
                                  .Replace("[MonthDay]", date)
                                             .Replace("[Time]", time)
                                             .Replace("[RecruiterName]", recruiterName);
                                    //Revel
                                    if (EntityId == 22)
                                    {
                                        SubjectCancel = "Interview Scheduled at Revel + Infogain ";
                                    }
                                }
                                //India
                                else
                                {
                                    template = objRepo.getEmailTemplate(7, EmpId);
                                     TempBody = template.Body
                                  .Replace("[%s]", candidatename);
                                }

                                   
                              

                                var cancelBody = new
                                {
                                    Comment = TempBody
                                };


                                string token = GenerateToken();

                                string mid = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().MSTeamMeetingId;

                                var bodySub = new
                                {

                                    subject = interiviewtype + " || "+SubjectCancel

                                };

                                MailAddress addressEmail = new MailAddress(recruiterEmail);
                                string hostEmail = addressEmail.Host;
                                if (hostEmail.ToLower() != "infogain.com")
                                {
                                    recruiterEmail = "ATS@igglobal.com";
                                }

                                string updateCal = this.updateCalenderEventGraph(bodySub, mid, recruiterEmail, token);
                                string cancelCal = cancelCalenderEventGraph(cancelBody, mid, recruiterEmail, token);
                                //   string deleteCal = deleteCalenderEventGraph(mid, recruiterEmail, token);
                            }
                            catch (Exception ec)
                            {
                                ExceptionLogging.SendExcepToDB(ec, "Common", "CancelEventGraphCancel");
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        ExceptionLogging.SendExcepToDB(ex, "Common", "rescheduleCancelEventGraph");
                    }
                });
                return "";
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "rescheduleCancelEventGraph");
                throw ex;
            }
        }



        public string UpdateCalendarReschdule(int cid, string EmpId, int statusId)
        {
            try
            {
                int result;
                RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2010);
                // Get credentials from web.config
                string user = ConfigurationManager.AppSettings["ExchangeUser"];
                string password = ConfigurationManager.AppSettings["ExchangePassword"];
                service.Credentials = new WebCredentials(user, password);   // replace with proper username and password
                service.Url = new Uri("https://smtp.office365.com/ews/exchange.asmx");   // Office 365 Exchange API URL (replace it with a local server URL if you are using a local Exchange installation)
                string mid = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().MSTeamMeetingId;
                if (statusId == 3)
                {
                    try
                    {
                        string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        int HiringLocationId = Convert.ToInt32(round.HiringLocation.ToString());
                        Appointment appointment_candidate = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().CandidateCalendarID, new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End));
                        //Appointment appointment_panel = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().PanelCalendarID, new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End));
                        string modeofinterview = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.mode).FirstOrDefault().ToString();
                        int modeofinterviewid = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.id).FirstOrDefault();
                        //string reporttimelabel = "Reporting Time";
                        //string contactpersonlabel = "Concat Person";
                        //string venuelabel = "Venue Details";

                        // DateTime interviewdate = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewDate).FirstOrDefault());
                        DateTime interviewdateUTC = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault());
                        //string interviewdateUTC = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewDateUTC).FirstOrDefault().ToString();
                        string tz = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewTimeZone).FirstOrDefault().ToString();
                        DateTime interviewdate = ConvertUTCToTZ(interviewdateUTC, tz);
                        var abbreviations = TZNames.GetAbbreviationsForTimeZone(tz, "en-US");
                        string interviewday = interviewdate.ToString("dddd");
                        string dayanddate = interviewday + ", " + interviewdate.ToString("dd MMM yyyy");
                        string reportingtime = interviewdate.AddMinutes(-30).ToString("HH:mm tt") + " " + abbreviations.Standard;
                        string contactperson = round.recruiter.Name;
                        string venue = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.vanueOrLink).FirstOrDefault().ToString();
                        string designation = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x._designation.desigName).FirstOrDefault().ToString();
                        string interiviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                        int interiviewtypeID = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Id).FirstOrDefault();
                        int ISTemplate2027 = 0;

                        if (modeofinterviewid != 2)
                        {
                            //reporttimelabel = "Joining Time";
                            //contactpersonlabel = "Interviewer";
                            //venuelabel = "Link Details";
                            // reportingtime = interviewdate.ToString("HH:mm tt")+" "+ abbreviations.Standard;
                            reportingtime = interviewdate.ToString("HH:mm tt") + " " + abbreviations.Standard;
                            contactperson = round.recruiter.Name;
                        }

                        EmailTemplate template = new EmailTemplate();
                        if (round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewMode.id == 2)
                        {
                            template = objRepo.getEmailTemplate(2027, EmpId);
                            ISTemplate2027 = 1;
                        }
                        else
                        {
                            template = objRepo.getEmailTemplate(2028, EmpId);
                        }
                        //template = objRepo.getEmailTemplate(8, EmpId);

                        //EmailTemplate panel_template = objRepo.getEmailTemplate(2, EmpId);

                        appointment_candidate.Start = interviewdate;
                        appointment_candidate.End = appointment_candidate.Start.AddMinutes(round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewDuration);
                        appointment_candidate.ReminderDueBy = appointment_candidate.Start.AddMinutes(-15);

                        string msteamlink = "";
                        string newmid = "";
                        updateCalendar(appointment_candidate.Start, appointment_candidate.End, appointment_candidate.Subject, mid, out msteamlink, out newmid);

                        var TempBody = template.Body
                              .Replace("[%s]", candidatename)
                              .Replace("[%d]", dayanddate)
                              .Replace("[%rt]", reportingtime)
                              .Replace("[%moi]", modeofinterview)
.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" :
                            HiringLocationId != 3 ? round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterviewLocationAddress.ToString() : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())                              //.Replace("[%ild]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : modeofinterviewid == 3 ? "Telephonic" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString())

                              .Replace("[%Interviewer]", round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewer.Name)
                              .Replace("[%cp]", contactperson);

                        if (interiviewtypeID == 1)
                        {
                            TempBody = TempBody.Replace("[%stmt]", "Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further. Attaching the job description for your reference. ");
                        }
                        else
                        {
                            //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                            if (round.roundList.Where(x => x.interviewType.Id == 2).Count() > 1 || interiviewtypeID == 3 || interiviewtypeID == 4 || interiviewtypeID == 5 || interiviewtypeID == 6 || interiviewtypeID == 7)
                            {
                                //TempBody = TempBody.Replace("[%stmt]", "you have been short listed for the next round interview. Attaching the job description for your reference.");
                                //firstround
                                //secondround
                                TempBody = TempBody.Replace("[%stmt]", "<p>Greetings from Infogain!</br>You have been shortlisted for the next round interview. Attaching the job description for your reference.</p>");

                            }
                            else
                            {
                                TempBody = TempBody.Replace("[%stmt]", "<p>Thank you for your interest in the job opportunity. We would like to invite you for an interview to discuss the same further.</br>Attaching the job description for your reference.</p>");

                            }
                        }

                        if (HiringLocationId == 3)
                        {
                            TempBody = TempBody.Replace("[%IDProof]", "");
                            appointment_candidate.Subject = "Reschedule : " + interiviewtype + " || Interview Scheduled at Infogain" + " || " + candidatename + " || " + dayanddate + " " + reportingtime;
                        }
                        else
                        {
                            appointment_candidate.Subject = "Reschedule : " + interiviewtype + " || Interview Scheduled at Infogain";
                            if (ISTemplate2027 == 1)
                            {
                                TempBody = TempBody.Replace("[%IDProof]", "<li>One government photo ID card to be handy (Aadhar card/Pan card/passport/ voter ID card/Driving License)</li>");
                            }
                            else
                            {
                                TempBody = TempBody.Replace("[%IDProof]", "<li>A government photo ID proof to be handy (Aadhar Card / Pan Card / Passport / Voter ID Card / Driving License).</li>");
                            }
                        }

                        appointment_candidate.Body = TempBody;

                        Attendee at = new Attendee();
                        at.Address = round.Email;
                        at.Name = char.ToUpper(round.Name[0]) + round.Name.Substring(1); ;
                        appointment_candidate.RequiredAttendees.Add(at);
                        //appointment_panel.Subject = "Reschedule : " + interiviewtype + " || Interview scheduled for " + candidatename + " at " + interviewdate;
                        //appointment_panel.Body = panel_template.Body
                        //    .Replace("[%panelName]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.Name).FirstOrDefault())
                        //    .Replace("[%moi]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewMode.Mode).FirstOrDefault().ToString())
                        //    .Replace("[%s]", round.Name)
                        //    .Replace("[%dt]", dayanddate)
                        //    .Replace("[%TalentID]", round.THID.ToString())
                        //    .Replace("@Time", reportingtime)
                        //    .Replace("[%jt]", candidatename)
                        //    .Replace("[%id]", modeofinterviewid == 6 ? "<a href='" + msteamlink + "' target='_blank'>Click here to join</a>" : round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().vanueOrLink.ToString());

                        //appointment_panel.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.email).FirstOrDefault());
                        ////appointment_panel.RequiredAttendees.Add("sourabh.kumar@infogain.com");
                        //appointment_panel.Start = appointment_candidate.Start;
                        //appointment_panel.End = appointment_candidate.End;
                        //appointment_panel.ReminderDueBy = appointment_candidate.ReminderDueBy;
                        appointment_candidate.RequiredAttendees.Add(round.Email);
                        foreach (var att in round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().AdditionalInterviewer)
                        {
                            appointment_candidate.RequiredAttendees.Add(att.email);
                        }
                        appointment_candidate.OptionalAttendees.Add(round.recruiter.Email);
                        appointment_candidate.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.email).FirstOrDefault());
                        //appointment_panel.OptionalAttendees.Add(round.recruiter.Email);
                        // Save the appointment to your calendar.
                        SendInvitationsOrCancellationsMode mode = //appointment.IsMeeting ?
                            SendInvitationsOrCancellationsMode.SendToAllAndSaveCopy;// : SendInvitationsOrCancellationsMode.SendToNone;
                                                                                    // Send the update request to the Exchange server.
                        appointment_candidate.Update(ConflictResolutionMode.AlwaysOverwrite, mode);
                        //appointment_panel.Update(ConflictResolutionMode.AlwaysOverwrite, mode);

                    }
                    catch (Exception ec)
                    {
                        ExceptionLogging.SendExcepToDB(ec, "Common", "UpdateReschedule");
                    }
                }
                else if (statusId == 2)
                {
                    try
                    {
                        EmailTemplate template = new EmailTemplate();
                        template = objRepo.getEmailTemplate(6, EmpId);

                        //Appointment panel_appointment = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().PanelCalendarID, new PropertySet());
                        Appointment candidate_appointment = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().CandidateCalendarID, new PropertySet());
                        DateTime interviewdate = Convert.ToDateTime(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.InterviewDate).FirstOrDefault());
                        string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                        string interviewtype = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewType.Type).FirstOrDefault().ToString();
                        candidate_appointment.Subject = interviewtype + " || Interview Scheduled at Infogain";

                        //panel_appointment.Body = template.Body
                        //    .Replace("[%jt]", candidatename)
                        //    .Replace("[%panelName]", round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.Name).FirstOrDefault())
                        //    .Replace("[%TalentID]", round.THID.ToString());

                        //panel_appointment.Subject = interviewtype + " || Interview scheduled for " + candidatename + " at " + interviewdate;

                        template = objRepo.getEmailTemplate(7, EmpId);
                        candidate_appointment.Body = template.Body
                            .Replace("[%s]", candidatename);

                        candidate_appointment.RequiredAttendees.Add(round.Email);
                        candidate_appointment.OptionalAttendees.Add(round.recruiter.Email);
                        candidate_appointment.RequiredAttendees.Add(round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x.interviewer.email).FirstOrDefault());
                        //panel_appointment.OptionalAttendees.Add(round.recruiter.Email);
                        SendInvitationsOrCancellationsMode mode = SendInvitationsOrCancellationsMode.SendToAllAndSaveCopy;

                        //panel_appointment.Update(ConflictResolutionMode.AlwaysOverwrite, mode);
                        candidate_appointment.Update(ConflictResolutionMode.AlwaysOverwrite, mode);

                        //panel_appointment.CancelMeeting();
                        candidate_appointment.CancelMeeting();

                        deleteCalendar(mid);
                    }
                    catch (Exception ec)
                    {
                        ExceptionLogging.SendExcepToDB(ec, "Common", "UpdateResheduledCanceled");
                    }
                }
                return "";
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        public string GetMeetingDetails(int cid, string EmpId)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2010);
            // Get credentials from web.config
            string user = ConfigurationManager.AppSettings["ExchangeUser"];
            string password = ConfigurationManager.AppSettings["ExchangePassword"];
            service.Credentials = new WebCredentials(user, password);   // replace with proper username and password
            service.Url = new Uri("https://smtp.office365.com/ews/exchange.asmx");   // Office 365 Exchange API URL (replace it with a local server URL if you are using a local Exchange installation)
            int result;
            RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
            Appointment appointment_candidate = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().CandidateCalendarID, new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End));
            //Appointment appointment_panel = Appointment.Bind(service, round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().PanelCalendarID, new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End));
            appointment_candidate.OptionalAttendees.Add("dharampal.singh@infogain.com");
            SendInvitationsOrCancellationsMode mode = //appointment.IsMeeting ?
                       SendInvitationsOrCancellationsMode.SendToAllAndSaveCopy;// : SendInvitationsOrCancellationsMode.SendToNone;
                                                                               // Send the update request to the Exchange server.
            appointment_candidate.Update(ConflictResolutionMode.AlwaysOverwrite, mode);
            string bb = appointment_candidate.Body;
            return "";
        }
        public string Encrypt(string inputText, string encryptionkey)
        {
            //string encryptionkey = "SAUW193BX628TD57";
            byte[] keybytes = Encoding.ASCII.GetBytes(encryptionkey.Length.ToString());
            RijndaelManaged rijndaelCipher = new RijndaelManaged();
            byte[] plainText = Encoding.Unicode.GetBytes(inputText);
            PasswordDeriveBytes pwdbytes = new PasswordDeriveBytes(encryptionkey, keybytes);
            using (ICryptoTransform encryptrans = rijndaelCipher.CreateEncryptor(pwdbytes.GetBytes(32), pwdbytes.GetBytes(16)))
            {
                using (MemoryStream mstrm = new MemoryStream())
                {
                    using (CryptoStream cryptstm = new CryptoStream(mstrm, encryptrans, CryptoStreamMode.Write))
                    {
                        cryptstm.Write(plainText, 0, plainText.Length);
                        cryptstm.Close();
                        return Convert.ToBase64String(mstrm.ToArray());
                    }
                }
            }
        }

        private static String[] units = { "Zero", "One", "Two", "Three",
    "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
    "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen" };
        private static String[] tens = { "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };
        public String ConvertToWords(Int64 i)
        {
            if (i < 20)
            {
                return units[i];
            }
            if (i < 100)
            {
                return tens[i / 10] + ((i % 10 > 0) ? " " + ConvertToWords(i % 10) : "");
            }
            if (i < 1000)
            {
                return units[i / 100] + " Hundred"
                        + ((i % 100 > 0) ? " And " + ConvertToWords(i % 100) : "");
            }
            if (i < 100000)
            {
                return ConvertToWords(i / 1000) + " Thousand "
                + ((i % 1000 > 0) ? " " + ConvertToWords(i % 1000) : "");
            }
            if (i < 10000000)
            {
                return ConvertToWords(i / 100000) + " Lakh "
                        + ((i % 100000 > 0) ? " " + ConvertToWords(i % 100000) : "");
            }
            if (i < 1000000000)
            {
                return ConvertToWords(i / 10000000) + " Crore "
                        + ((i % 10000000 > 0) ? " " + ConvertToWords(i % 10000000) : "");
            }
            return ConvertToWords(i / 1000000000) + " Arab "
                    + ((i % 1000000000 > 0) ? " " + ConvertToWords(i % 1000000000) : "");
        }

        public async System.Threading.Tasks.Task<string> VideoImageCampareInterviewAsync(int cid, string EmpId,char? Type = 'A', int roundId = 0, int roundIdPrev = 0)
        {

            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    InterviewRoundDetailsVid RoundDetailsVid = new InterviewRoundDetailsVid();
                    if (Type == 'A')
                    {
                        RoundDetailsVid = objRepo.GetRoundByCid(cid, EmpId);
                    }
                    else
                    {
                        RoundDetailsVid = objRepo.GetRoundByCid(cid, EmpId,'Y',roundId, roundIdPrev);
                    }
                   
                    if(RoundDetailsVid.PrevSharePointIdVideo == "" || 
                       RoundDetailsVid.CurrentSharePointIdVideo == "" ||
                       RoundDetailsVid.CurrentSharePointIdVideo == null ||
                       RoundDetailsVid.PrevSharePointIdVideo == null )
                    {
                        return "";
                    }

                    VideoImageCampareInterview obj = new VideoImageCampareInterview();
                    obj.file1 = GetSharePointFileinBytes(RoundDetailsVid.CurrentSharePointIdVideo, RoundDetailsVid.FileNameVideoCurrent);
                    obj.FileNameVideoCurrent = RoundDetailsVid.FileNameVideoCurrent;
                    obj.file2 = GetSharePointFileinBytes(RoundDetailsVid.PrevSharePointIdVideo, RoundDetailsVid.FileNameVideoPrev);
                    obj.FileNameVideoPrev = RoundDetailsVid.FileNameVideoPrev;
                    ResponseVoiceImp jsonObj = VideoImageCampareInterviewApi(obj);

                    UpdateVideoMatchScoreByRoundId VideoMatchScoreByRoundId = new UpdateVideoMatchScoreByRoundId();
                    VideoMatchScoreByRoundId.RoundId = RoundDetailsVid.RoundIdCurrent;
                    VideoMatchScoreByRoundId.cid = cid;

                    if (jsonObj.status == "true")
                    {
                        VideoMatchScoreByRoundId.VideoMatch = "S";
                        VideoMatchScoreByRoundId.VideoMatchPercent = jsonObj.message;
                    }
                    else
                    {
                        VideoMatchScoreByRoundId.VideoMatch = "F";
                        VideoMatchScoreByRoundId.VideoMatchPercent = "0";
                        VideoMatchScoreByRoundId.ErrorMessage = jsonObj.message;

                    }
                    //update result
                    int update = objRepo.updateVideoMatchScoreByRoundId(VideoMatchScoreByRoundId, EmpId);
                   

                    return "";
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "Common", "VideoImageCampareInterview");
                    return "";
                }

            });
            return "";
        }

        public ResponseVoiceImp VideoImageCampareInterviewApi(VideoImageCampareInterview obj)
        {
            try
            {
                string VideoMatchApiUrl = ConfigurationManager.AppSettings["VideoMatchApiUrl"];
                string VideoMatchApiUserName = ConfigurationManager.AppSettings["VideoMatchApiUserName"];
                string VideoMatchApiUserPassword = ConfigurationManager.AppSettings["VideoMatchApiUserPassword"];

                GetInterviewsVideos GetInterviewsVideosPrev = new GetInterviewsVideos();
                GetInterviewsVideos GetInterviewsVideosCurrent = new GetInterviewsVideos();
                //obj.file2 = GetSharePointFileinBytes(RoundDetailsVid.PrevSharePointIdVideo, obj.FileNameVideoPrev);
                //obj.file1 = GetSharePointFileinBytes(RoundDetailsVid.CurrentSharePointIdVideo, obj.FileNameVideoCurrent);
                HttpResponseMessage servicerequest = null;
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromMinutes(30);
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(VideoMatchApiUserName), "userName");
                content.Add(new StringContent(VideoMatchApiUserPassword), "password");
                content.Add(new ByteArrayContent(obj.file1, 0, obj.file1.Length), "file1",obj.FileNameVideoCurrent);
                content.Add(new ByteArrayContent(obj.file2, 0, obj.file2.Length), "file2", obj.FileNameVideoPrev);
                string _url = VideoMatchApiUrl;
                servicerequest = httpClient.PostAsync(_url, content).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                ResponseVoiceImp jsonObj = JsonConvert.DeserializeObject<ResponseVoiceImp>(response);

                return jsonObj;
            }
            catch (Exception ex)
            {
                ResponseVoiceImp jsonObj = new ResponseVoiceImp();
                jsonObj.status = "N";
                return jsonObj;

            }

        }
        public async System.Threading.Tasks.Task<string> TranscriptProcessUpdate(int cid,int roundId, string EmpId)

        {

            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                InterviewRoundDetailsTrans RoundDetailsTrans = new InterviewRoundDetailsTrans();

                RoundDetailsTrans = objRepo.GetRoundTransDerailsByCid(cid, EmpId, roundId);

                    if (RoundDetailsTrans.InterviewTypeId != 2)
                    {
                        return "";
                    }

                    if (RoundDetailsTrans.InterviewTypeId == 2 && RoundDetailsTrans.FeedbackProvided == 'N')
                    {
                        return "";
                    }
                    if (RoundDetailsTrans.SharePointIdTrans == "" ||
                       RoundDetailsTrans.SharePointIdTrans == null)
                    {
                        return "";
                    }

                    uploadTranscript obj = new uploadTranscript();
                    obj.file1 = GetSharePointFileinBytes(RoundDetailsTrans.SharePointIdTrans, RoundDetailsTrans.FileNameTrans);
                    obj.FileNameTrans = RoundDetailsTrans.FileNameTrans;
                    obj.FilePathTrans = RoundDetailsTrans.FilePathTrans;

                obj.thid = RoundDetailsTrans.thid;
                    obj.cid = cid;
                    obj.RoundId = roundId;
                    ResponseTransScriptUpload jsonObj = UplodTransScriptApi(obj);
                    UpdateTransScriptScoreByRoundId updateTransScriptScoreByRoundId = new UpdateTransScriptScoreByRoundId();
                    if (jsonObj.status == "true")
                    {
                       
                        updateTransScriptScoreByRoundId.RoundId = RoundDetailsTrans.RoundId;
                        updateTransScriptScoreByRoundId.cid = cid;
                        updateTransScriptScoreByRoundId.Questions =jsonObj.Questions;
                        updateTransScriptScoreByRoundId.Recommendation = jsonObj.Recommendation;
                        updateTransScriptScoreByRoundId.SentimentOrientation = jsonObj.SentimentOrientation;
                        updateTransScriptScoreByRoundId.Area = jsonObj.Area;
                        updateTransScriptScoreByRoundId.ApiRespnseStatus = 1;
                        updateTransScriptScoreByRoundId.ApiRespnseStatusMessage = "Success";


                    }
                    else
                    {
                        updateTransScriptScoreByRoundId.RoundId = RoundDetailsTrans.RoundId;
                        updateTransScriptScoreByRoundId.cid = cid;
                        updateTransScriptScoreByRoundId.Questions = new List<Questions>();
                        updateTransScriptScoreByRoundId.Recommendation = "";
                        updateTransScriptScoreByRoundId.SentimentOrientation = "";
                        updateTransScriptScoreByRoundId.Area = new List<Area>();
                        updateTransScriptScoreByRoundId.ApiRespnseStatus = 0;
                        updateTransScriptScoreByRoundId.ApiRespnseStatusMessage = "Failed";
                    }



                    int update = objRepo.updateTransScriptScoreByRoundId(updateTransScriptScoreByRoundId, EmpId);


                    return "";
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "Common", "uploadTransSript");
                    return "";
                }

            });
            return "";
        }

        public ResponseTransScriptUpload UplodTransScriptApi(uploadTranscript obj)
        {
            try
            {
                string UploadTransSciptApiUrl = ConfigurationManager.AppSettings["parseTranscriptApiUrl"];

                string _url = UploadTransSciptApiUrl + obj.thid+ "&roundid="+ obj.RoundId + "&cid="+obj.cid;
                HttpResponseMessage servicerequest = null;
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromMinutes(30);
                var content = new MultipartFormDataContent();

                content.Add(new ByteArrayContent(obj.file1, 0, obj.file1.Length), "transcript", obj.FileNameTrans);

                servicerequest = httpClient.PostAsync(_url, content).Result;
                ResponseTransScriptUpload jsonObj = new ResponseTransScriptUpload();
                if (servicerequest.IsSuccessStatusCode)
                {
                    string response = servicerequest.Content.ReadAsStringAsync().Result;
                     jsonObj = JsonConvert.DeserializeObject<ResponseTransScriptUpload>(response);
                   // jsonObj.status = "true";
                }
                else
                {
                    jsonObj.status = "false";
                }
                  

                return jsonObj;
            }
            catch (Exception ex)
            {
                ResponseTransScriptUpload jsonObj = new ResponseTransScriptUpload();
                jsonObj.status = "False";
                return jsonObj;

            }

        }
        public Byte[] GetSharePointFileinBytes(string id, string fileName)
        {
            try
            {
                string token = GenerateToken();
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



        public async System.Threading.Tasks.Task<string> addToCalendarGraphInductionDay1(int LocationId, string InviteDate, string EmpId)
        {
            try
            {
                int result;
                Day1InductionInviteMeetingInfo InductionInviteDetail = OnboardRepo.GetDay1InductionInviteDetails(LocationId, InviteDate, EmpId, out result);
               
                await System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {

                        var InviteList = InductionInviteDetail.Day1InductionInviteMeetingList;

                        string SenderEmail = InductionInviteDetail.ModifiedByEmailId;
                        string SenderName = InductionInviteDetail.ModifiedByName;
                        if (InviteList.Count > 0)
                        {
                            foreach (var att in InductionInviteDetail.Day1InductionInviteMeetingList)
                            {

                                string tz = "Asia/Kolkata";
                                var abbreviations = TZNames.GetAbbreviationsForTimeZone(tz, "en-US");
                                var winTz = TZConvert.IanaToWindows(tz);
                               // DateTime interviewdateUTC = Convert.ToDateTime(att.InviteDateUTC);
                                DateTime inviteStartDate = ConvertUTCToTZ(Convert.ToDateTime(att.InviteDateUTC), tz);
                                DateTime inviteEndDate = ConvertUTCToTZ(Convert.ToDateTime(att.InviteEndDateUTC), tz);
                                string interviewday = inviteStartDate.ToString("dddd");
                                string dayanddate = interviewday + ", " + inviteStartDate.ToShortDateString();
                                string reportingtime = inviteStartDate.ToString("HH:mm tt") + " " + abbreviations.Standard;
                                string EventName = att.EventName;
                                EmailTemplate template = new EmailTemplate();
                                template = objRepo.getEmailTemplate(17048, EmpId);


                                string msteamlink = "";
                                string mid = "";
                                string iCalUId = "";
                                /***
                                 *  create meeting event as draft
                                 * ***/
                                 
                                MailAddress addressEmail = new MailAddress(SenderEmail);
                                string hostEmail = addressEmail.Host;
                                int isInviteSendRecId = 1;
                                if (hostEmail.ToLower() != "infogain.com")
                                {
                                    SenderEmail = "ATS@igglobal.com";
                                    isInviteSendRecId = 0;
                                }

                                var subject = att.EventName;


                                var bodyDraft = new
                                {

                                    start = new { dateTime = inviteStartDate, timeZone = winTz },
                                    end = new { dateTime = inviteEndDate, timeZone = winTz },
                                    subject = subject,
                                    allowNewTimeProposals = true,
                                    isOnlineMeeting = true,
                                    importance = "high",
                                    reminderMinutesBeforeStart = 15

                                };

                                string jsonBodyEvent = JsonConvert.SerializeObject(bodyDraft);
                                HttpResponseMessage servicerequest = null;
                                //   string json = JsonConvert.SerializeObject(data);
                                var content = new StringContent(jsonBodyEvent.ToString(), System.Text.Encoding.UTF8, "application/json");
                                string token = GenerateToken();
                                HttpClient httpClient = new HttpClient();
                                //  string fromDate = DateTime.Now.ToString("yyyy-mm-dd");
                                string _url = "https://graph.microsoft.com/v1.0/users/" + SenderEmail + "/calendar/events";
                                httpClient.BaseAddress = new Uri(_url);
                                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                                servicerequest = httpClient.PostAsync(_url, content).Result;
                                string response = servicerequest.Content.ReadAsStringAsync().Result;
                                CalendarEventGraph jsonObj = JsonConvert.DeserializeObject<CalendarEventGraph>(response);
                                msteamlink = jsonObj.onlineMeeting.joinUrl;
                                mid = jsonObj.id;
                                iCalUId = jsonObj.iCalUId;


                                /***
                        * sent to attendee
                        * **/

                                var TempBody = template.Body
                                              .Replace("[%d]", dayanddate)
                                              .Replace("[%time]", reportingtime)
                                              .Replace("[%sender]", SenderName)
                                              .Replace("[%session]", EventName)
                                              .Replace("[%Link]", "<a href='" + msteamlink + "' target='_blank' style='font - size: 12px; line - height: 26px; text - align: center; color:#3F51B5;'>Click here to join</a>");

                                createEventBody InviteSendBody = new createEventBody();

                                InviteSendBody.body.content = TempBody;
                                InviteSendBody.body.contentType = "HTML";

                                // candidate
                               /// attendeesList attendeesCandidate = new attendeesList();
                                if (att.Day1InductionInviteMeetingCandidateCommon.Count > 0)
                                {
                                    foreach (var cand in att.Day1InductionInviteMeetingCandidateCommon)
                                    {
                                        attendeesList attendeesListCandidate = new attendeesList();
                                        attendeesListCandidate.emailAddress.address = cand.EmailId;
                                        attendeesListCandidate.emailAddress.name = cand.Name;
                                        attendeesListCandidate.type = "required";
                                        InviteSendBody.attendees.Add(attendeesListCandidate);
                                    }

                                }
                                if (att.Day1InductionInviteMeetingCandidate.Count > 0)
                                {
                                    foreach (var cand in att.Day1InductionInviteMeetingCandidate)
                                    {
                                        attendeesList attendeesListCandidate = new attendeesList();
                                        attendeesListCandidate.emailAddress.address = cand.EmailId;
                                        attendeesListCandidate.emailAddress.name = cand.Name;
                                        attendeesListCandidate.type = "required";
                                        InviteSendBody.attendees.Add(attendeesListCandidate);
                                    }

                                }
                                if (att.Day1InductionInviteMeetingSpoc.Count > 0)
                                {
                                    foreach (var spoc in att.Day1InductionInviteMeetingSpoc)
                                    {
                                        attendeesList attendeesListSpoc = new attendeesList();
                                        attendeesListSpoc.emailAddress.address = spoc.EmailId;
                                        attendeesListSpoc.emailAddress.name = spoc.Name;
                                        attendeesListSpoc.type = "required";
                                        InviteSendBody.attendees.Add(attendeesListSpoc);
                                    }

                                }

                                string updateCal = updateCalenderEventGraph(InviteSendBody, mid, SenderEmail, token);
                                OnboardRepo.UpdateCalendarIDDay1InductionInvite(att.Id, iCalUId, msteamlink, mid, EmpId);
                            }
                        }



                    }
                    catch (Exception ex)
                    {
                        ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraphOnboardEvent");
                    }
                });
                return "1";
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "addToCalendarGraphOnboardEvent");
                throw ex;
            }
        }

        public string HtmlUnescape(string html)
        {
            var JD = html
                        .Replace("&amp", "&")
                        .Replace("&apos", "'")
                        .Replace("&quot", "\"")
                        .Replace("&gt", ">")
                        .Replace("&lt", "<")
                        .Replace("<hr>", "");
            return JD;
        }


        public string GetDocumentDisplayName(int cid, string docType)
        {
            string FileDispayName = string.Empty;
            DataSet ds = OnboardRepo.GetCandidateLocationDivision(cid);

            String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
            try
            {
                if (docType == "PA")
                {
                   

                    FileDispayName = "Position Approval" + "_" + CandidateName;

                }
                else if (docType == "OA")
                {
                    FileDispayName = "Offer Acceptance" + "_" + CandidateName;
                }
                else
                {
                    FileDispayName = "Interview Feedback" + "_" + CandidateName;
                }

                return FileDispayName;
            }
            catch (Exception ex)
            {
                return FileDispayName;
            }
        }


  
        public JdPasreQuestion GetJDQuestionsByThIdCommon(int thid, int roundNumber)
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                string GetJDQuestionsUrl = ConfigurationManager.AppSettings["GetJDQuestionsUrl"];

               // string _url = UploadTransSciptApiUrl + obj.thid + "&roundid=" + obj.RoundId + "&cid=" + obj.cid;
                HttpClient httpClient = new HttpClient();
                string _url = GetJDQuestionsUrl+ thid + "&round_number=" + roundNumber;
                //  string _url = "http://172.18.65.246:8002/getJDQuestions/?talentId=" + thid + "&round_number=" + roundNumber;
                //  string _url = "http://172.18.65.246:8001/getJDQuestions/?talentId=" + thid + "&round_number=" + roundNumber;
                httpClient.BaseAddress = new Uri(_url);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                // httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                servicerequest = httpClient.GetAsync(_url).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;
                List<dynamic> questionsArray = JsonConvert.DeserializeObject<List<dynamic>>(response);
                JdPasreQuestion JdPasreQuestion = new JdPasreQuestion();
                foreach (var item in questionsArray)
                {
                    QuestionAuto QuestList = new QuestionAuto();
                    QuestList.Question = item;
                    JdPasreQuestion.QuestionAuto.Add(QuestList);
                }

                return JdPasreQuestion;


            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "getJDQuestionsByThIdCommon");
                return new JdPasreQuestion();
            }
        }


        public int UpdateAutoQuestionsForTechRoundByCid(int cid, string EmpId)
        {
            try
            {
                int result;
                RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                int thid = round.talentId;
                char isEnableAuto = round.IsAIQuestionGenEnable;
                if (isEnableAuto == 'Y')
                {
                    int interiviewtypeId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewType.Id;
                    int interiviewStatusId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterViewStatus.Id;
                    string interiviewBy = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x?.interviewBy).FirstOrDefault().ToString();
                    if ((interiviewtypeId == 2 && interiviewBy == "I") && interiviewStatusId == 1 ||
              (interiviewtypeId == 2 && interiviewBy == "I") && interiviewStatusId == 3)
                    {
                        try
                        {
                            string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                            DataSet ds = objRepo.GetTehRoundCountByCid(cid, EmpId);
                            int roundCount = 0;
                            roundCount = Convert.ToInt32(ds.Tables[0].Rows[0]["RoundCount"]);
                            JdPasreQuestion JdPasreQuestion = GetJDQuestionsByThIdCommon(thid, roundCount);

                            updateQuestionAuto updateQuestionAuto = new updateQuestionAuto();
                            updateQuestionAuto.QuestionAuto = JdPasreQuestion.QuestionAuto;
                            updateQuestionAuto.cid = cid;
                            
                            if (JdPasreQuestion.QuestionAuto.Count > 0)
                            {
                                result = objRepo.AddUpdateQuestionList(updateQuestionAuto, EmpId);
                               
                            }
                        }
                        catch (Exception ex)
                        {
                            ExceptionLogging.SendExcepToDB(ex, "Common", "UpdateAutoQuestionsForTech");
                        }
                    }
                 
                }
                return 1;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "UpdateAutoQuestionsForTechRoundByCid");
            }
            return 1;
        }

        public async System.Threading.Tasks.Task<string> UpdateAutoQuestionsForTechRound(int cid,string EmpId)
        {
            try
            {
               
                await System.Threading.Tasks.Task.Run(() =>
                {
                    int result;
                    RoundDetails round = objRepo.getCurrentRoundDetailsByCid(cid, EmpId, out result);
                    int thid = round.talentId;
                    char isEnableAuto = round.IsAIQuestionGenEnable;
                    if (isEnableAuto == 'Y') {
                        int interiviewtypeId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().interviewType.Id;
                        int interiviewStatusId = round.roundList.Where(x => x.IsCurrentRound == 'Y').FirstOrDefault().InterViewStatus.Id;
                        string interiviewBy = round.roundList.Where(x => x.IsCurrentRound == 'Y').Select(x => x?.interviewBy).FirstOrDefault().ToString();
                        if ((interiviewtypeId == 2 && interiviewBy == "I") && interiviewStatusId == 1 ||
                  (interiviewtypeId == 2 && interiviewBy == "I") && interiviewStatusId == 3)
                        {
                            try
                            {
                                string candidatename = char.ToUpper(round.Name[0]) + round.Name.Substring(1);
                                DataSet ds = objRepo.GetTehRoundCountByCid(cid, EmpId);
                                int roundCount = 0;
                                roundCount = Convert.ToInt32(ds.Tables[0].Rows[0]["RoundCount"]);
                                JdPasreQuestion JdPasreQuestion = GetJDQuestionsByThIdCommon(thid, roundCount);

                                updateQuestionAuto updateQuestionAuto = new updateQuestionAuto();
                                updateQuestionAuto.QuestionAuto = JdPasreQuestion.QuestionAuto;
                                updateQuestionAuto.cid = cid;
                                
                                if (JdPasreQuestion.QuestionAuto.Count > 0)
                                {
                                    result = objRepo.AddUpdateQuestionList(updateQuestionAuto, EmpId);
                                }
                            }
                            catch (Exception ex)
                            {
                                ExceptionLogging.SendExcepToDB(ex, "Common", "UpdateAutoQuestionsForTechRound");
                            }
                        }
                        }

                });
                
               

                return "";

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "UpdateAutoQuestionsForTechRound");
                throw ex;
            }
        }


         public string GetPathMurcuryToUploadBackPaper(int cid, string EmpId)
        {
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            int result;
            DataSet ds = OnboardRepo.GetPathInfoForUploadAcceptanceOffer(cid, EmpId, out result);                      
            String CandidateName = ds.Tables[0].Rows[0]["FullName"].ToString();
            string EmpLocation = ds.Tables[0].Rows[0]["JoiningLocation"].ToString();
            int Division = Convert.ToInt32(ds.Tables[0].Rows[0]["divisionid"]);
            DateTime currentDate = DateTime.Now;
            //string currentYear = currentDate.ToString("yyyy");
            //string currentMonth = currentDate.ToString("MMMM");
            string currentYear = ds.Tables[0].Rows[0]["joiningYear"].ToString();
            string currentMonth = ds.Tables[0].Rows[0]["joiningMonth"].ToString();

            string TempPath = "";
            string path = "";

            if (EmpLocation == "Noida")
            {
                TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNoida"];
                path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
            }
            else if (EmpLocation == "Bangalore" && Division == 2)
            {
                TempPath = ConfigurationManager.AppSettings["OnboardFormDocumentsNNT_Bangalore"];
                path = TempPath + currentYear + "/" + currentMonth + "/" + CandidateName + "/BackPaper/";
            }
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

            return path;
        }

 

        public string GenerateSecureOTP(int length = 6, string characterSet = "0123456789")
            {
                if (length <= 0) throw new ArgumentException("Length must be greater than zero.");
                if (string.IsNullOrEmpty(characterSet)) throw new ArgumentException("Character set cannot be empty.");

                var otp = new char[length];
                using (var rng = RandomNumberGenerator.Create())
                {
                    byte[] buffer = new byte[4]; // Buffer for random numbers
                    for (int i = 0; i < length; i++)
                    {
                        rng.GetBytes(buffer);
                          int index = (int)(BitConverter.ToUInt32(buffer, 0) % characterSet.Length);
                        otp[i] = characterSet[index];
                    }
                }
                return new string(otp);
            }


        public int EncryptFile(byte[] fileBytes, string outputFile)
        {
            try
            {
             
                byte[] Key = Convert.FromBase64String(ConfigurationManager.AppSettings["EncryptionKey"]);
                byte[] IV = Convert.FromBase64String(ConfigurationManager.AppSettings["EncryptionIV"]);

                using (Aes aes = Aes.Create())
                {
                    aes.Key = Key;
                    aes.IV = IV;
                    aes.Padding = PaddingMode.PKCS7;



                    using (FileStream fileStream = new FileStream(outputFile, FileMode.Create))
                    using (CryptoStream cryptoStream = new CryptoStream(fileStream, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(fileBytes, 0, fileBytes.Length);
                        cryptoStream.FlushFinalBlock();
                    }
                }
                return 1; // Success
            }
            catch (Exception ex)
            {
                // ExceptionLogging.SendExcepToDB(ex, "YourClassName", "EncryptFile.");
                ExceptionLogging.SendExcepToDB(ex, "Common", "EncryptFile.");
                return -1; // Error
            }
        }


        public byte[] DecryptFile(byte[] encryptedFileBytes)
        {
            try
            {
                byte[] Key = Convert.FromBase64String(ConfigurationManager.AppSettings["EncryptionKey"]);
                byte[] IV = Convert.FromBase64String(ConfigurationManager.AppSettings["EncryptionIV"]);

                if (encryptedFileBytes == null || encryptedFileBytes.Length == 0)
                    throw new ArgumentException("Encrypted file bytes cannot be null or empty.");

                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Key;
                    aesAlg.IV = IV;
                    aesAlg.Padding = PaddingMode.PKCS7;

                    using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                    using (MemoryStream msDecrypt = new MemoryStream(encryptedFileBytes))
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    using (MemoryStream msOutput = new MemoryStream())
                    {
                        csDecrypt.CopyTo(msOutput);
                        return msOutput.ToArray();
                    }
                }
            }
            catch (Exception ex)
            {
                //Console.WriteLine("Decryption error: " + ex.Message);
                ExceptionLogging.SendExcepToDB(ex, "Common", "EncryptFile.");
                return null;
            }
        }

        public string GetFileWithAdditionalExtention( string file = "")
        {
            // string fullpath = path+ ".enc";
            string Ext = ConfigurationManager.AppSettings["FileEncExt"];
            string fileName = file + Ext;
            return fileName;
        }

        public  string RemoveLastExtension(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return fileName;

            string extension = Path.GetExtension(fileName);
            if (extension.Equals(".enc", StringComparison.OrdinalIgnoreCase) ||
                extension.Equals(".dat", StringComparison.OrdinalIgnoreCase))
            {
                return Path.GetFileNameWithoutExtension(fileName); // Removes only the last .enc or .dat
            }

            return fileName;
        }

        public  string GetMimeType(string filePath)
        {
            string mimeType = "application/octet-stream"; // Default to binary stream

            string fileExtension = Path.GetExtension(filePath)?.ToLower();

            if (fileExtension == ".jpg" || fileExtension == ".jpeg")
                mimeType = "image/jpeg";
            else if (fileExtension == ".png")
                mimeType = "image/png";
            else if (fileExtension == ".gif")
                mimeType = "image/gif";
            else if (fileExtension == ".pdf")
                mimeType = "application/pdf";
            else if (fileExtension == ".doc" || fileExtension == ".docx")
                mimeType = "application/msword";
            else if (fileExtension == ".xls" || fileExtension == ".xlsx")
                mimeType = "application/vnd.ms-excel";
            else if (fileExtension == ".zip")
                mimeType = "application/zip";
            else if (fileExtension == ".txt")
                mimeType = "text/plain";
            else if (fileExtension == ".csv")
                mimeType = "text/csv";
            // Add more cases as per your need.

            return mimeType;
        }


        public static string ConvertPdfToBase64(string filePath)
        {
            byte[] pdfBytes = File.ReadAllBytes(filePath);
            return Convert.ToBase64String(pdfBytes);
        }


    }
}