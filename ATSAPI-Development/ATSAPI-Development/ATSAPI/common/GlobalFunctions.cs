using Aspose.Pdf.Operators;
using ATSAPI.App_Data;
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
    public class GlobalFunctions
    {
        InterviewRepository objRepo = new InterviewRepository();
        OnboardRepository OnboardRepo = new OnboardRepository();

        public async System.Threading.Tasks.Task<string> ResumeCompatibilityRatingUpdate(int cid, string EmpId,int IsProfileInterview =0, char ProfileType = 'N')
       

        {

            await System.Threading.Tasks.Task.Run(() =>
            {
                try
                {
                    DataSet ds = objRepo.GetCanddidateResumeDetails(cid, EmpId, IsProfileInterview, ProfileType);
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        String resumeName = ds.Tables[0].Rows[0]["resumeName"].ToString();
                        string resumePath = ds.Tables[0].Rows[0]["resumePath"].ToString();
                        string thid = ds.Tables[0].Rows[0]["thid"].ToString();
                        char IsFileURL = Convert.ToChar(ds.Tables[0].Rows[0]["IsFileURL"].ToString());
                        int ProfileId = Convert.ToInt32(ds.Tables[0].Rows[0]["ProfileId"]);

                        byte[] fileBytes = new byte[0];
                        // Get file from URL as byte array
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                        // byte[] fileBytesFromUrl = GetFileFromPath(resumePath);
                        //  byte[] fileBytesFromUrl = GetFileFromUrl(resumePath);


                        if (IsFileURL == 'Y')
                        {
                            fileBytes = GetFileFromUrl(resumePath);
                        }
                        else
                        {
                            fileBytes = GetFileFromPath(resumePath);
                        }
                        ResumeRatingModel ResumeRatingModel = new ResumeRatingModel();
                        ResumeRatingModel.file = fileBytes;
                        Common common = new Common();
                        ResumeRatingModel.FileName = common.RemoveLastExtension(resumeName); ;
                        ResumeRatingModel.thid = thid;

                        RootResponseResumeModel jsonObj = getResumeRating(ResumeRatingModel);
                        AddUpdateAIResumeRating AddUpdateAIResumeRating = new AddUpdateAIResumeRating();
                        AddUpdateAIResumeRating.cid = cid;
                        if (jsonObj.status == "true")
                        {
                            AddUpdateAIResumeRating.OverallRating = jsonObj.Resumes[0].overallRating;
                            AddUpdateAIResumeRating.OverallPercentage = jsonObj.Resumes[0].overallPercentage;
                            AddUpdateAIResumeRating.Recommendation = jsonObj.Recommendation;
                            AddUpdateAIResumeRating.Ratings = jsonObj.Resumes[0].Ratings;
                            AddUpdateAIResumeRating.mandatoryRating = jsonObj.Resumes[0].mandatoryRating;
                            AddUpdateAIResumeRating.goodToHaveRating = jsonObj.Resumes[0].goodToHaveRating;
                            AddUpdateAIResumeRating.ApiRespnseStatus = 1;
                            AddUpdateAIResumeRating.ApiRespnseStatusMessage = "Success";
                            AddUpdateAIResumeRating.IsProfileInterview = IsProfileInterview;
                            AddUpdateAIResumeRating.ProfileId = ProfileId;
                        }
                        else
                        {
                            AddUpdateAIResumeRating.OverallRating = 0;
                            AddUpdateAIResumeRating.OverallPercentage = 0;
                            AddUpdateAIResumeRating.Recommendation = "";
                            AddUpdateAIResumeRating.Ratings = new List<Rating>();
                            AddUpdateAIResumeRating.ApiRespnseStatus = 0;
                            AddUpdateAIResumeRating.ApiRespnseStatusMessage = "Failed";
                            AddUpdateAIResumeRating.IsProfileInterview = IsProfileInterview;
                            AddUpdateAIResumeRating.ProfileId = ProfileId;

                        }
                        if(ProfileType == 'T')
                        {
                            AddUpdateAIResumeRating.ProfileType='T';
                        }
                        else
                        {
                            AddUpdateAIResumeRating.ProfileType = 'N';
                        }

                        int update = objRepo.UpdateAIResumeRatingByCid(AddUpdateAIResumeRating, EmpId);
                    }

                    return "";
                }
                catch (Exception ex)
                {
                    ExceptionLogging.SendExcepToDB(ex, "Common", "ResumeParse"+ cid);
                    return "";
                }

            });
            return "";
        }




        public byte[] GetFileFromPath(string filelocation)
        {
            try
            {
                if (string.IsNullOrEmpty(filelocation) || !File.Exists(filelocation))
                {
                    throw new FileNotFoundException("The file does not exist.", filelocation);
                }

                string filePath = filelocation;
                string fileName = Path.GetFileName(filePath);
                string mimeType = MimeMapping.GetMimeMapping(fileName);
                byte[] fileBytes;
                // If file is .dat, decrypt it
                Common common = new Common();
                string originalFileName = common.RemoveLastExtension(fileName);

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    fileBytes = new byte[fs.Length];
                    fs.Read(fileBytes, 0, fileBytes.Length);
                }

                byte[] decryptedBytes = common.DecryptFile(fileBytes);
                if (decryptedBytes == null || decryptedBytes.Length == 0)
                {
                    throw new FileNotFoundException("File decryption failed.", filelocation);
                }

                fileBytes = decryptedBytes;

                return fileBytes;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GetFileFromPath");
                byte[] fileBytes = new byte[0];
                return fileBytes;
            }
        }

        public byte[] GetFileFromUrl(string fileWebUrl)
        {
            try
            {
                byte[] fileBytes;
                using (HttpClient client = new HttpClient())
                {
                    // Spoof a browser request
                    //  client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                    //  client.DefaultRequestHeaders.Remove("User-Agent");
                    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");

                    HttpResponseMessage responseResume = client.GetAsync(fileWebUrl).Result;
                    responseResume.EnsureSuccessStatusCode();
                    fileBytes = responseResume.Content.ReadAsByteArrayAsync().Result;
                }
                Common common = new Common();
                byte[] decryptedBytes = common.DecryptFile(fileBytes);

                return decryptedBytes;
            }

            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "GetFileFromURL");
                byte[] fileBytes = new byte[0];
                return fileBytes;
            }
        }

        public RootResponseResumeModel getResumeRating(ResumeRatingModel obj)
        {
            try
            {
                string ResumeParseApiURLApiUrl = ConfigurationManager.AppSettings["ResumeParseApiURL"];

                string _url = ResumeParseApiURLApiUrl;
                HttpResponseMessage servicerequest = null;
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromMinutes(30);
                var content = new MultipartFormDataContent();

                content.Add(new ByteArrayContent(obj.file, 0, obj.file.Length), "resumes", obj.FileName);

                // Add additional fields
                content.Add(new StringContent(obj.thid), "th_id");
                content.Add(new StringContent(obj.FileName), "filenames");

                servicerequest = httpClient.PostAsync(_url, content).Result;
                RootResponseResumeModel jsonObj = new RootResponseResumeModel();
                if (servicerequest.IsSuccessStatusCode)
                {
                    string response = servicerequest.Content.ReadAsStringAsync().Result;

                    //jsonObj = JsonConvert.DeserializeObject<ResumeRatingApiResponse>(response);
                    // string responseBody = await response.Content.ReadAsStringAsync();

                    // Deserialize the JSON response into the model
                    jsonObj = JsonConvert.DeserializeObject<RootResponseResumeModel>(response);


                }
                else
                {
                    jsonObj.status = "False";
                }


                return jsonObj;
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Common", "resume_rating Parse API");
                RootResponseResumeModel jsonObj = new RootResponseResumeModel();
                jsonObj.status = "False";
                return jsonObj;

            }

        }
    }
}