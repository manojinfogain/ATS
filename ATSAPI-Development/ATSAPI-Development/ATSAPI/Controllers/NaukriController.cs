using Aspose.Pdf.Operators;
using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using static ATSAPI.Models.NaukriIntigration;




namespace ATSAPI.Controllers
{
    [AuthorizeAttribute]
    [RoutePrefix("api/Naukri")]
    public class NaukriController : ApiController
    {
        NaukriRepository objRepo = new NaukriRepository();
        Common common = new Common();
        string SectionName = "Naukri";
        CommonController commonController = new CommonController();
        Logger logger = new Logger();
        CommonController cm = new CommonController();

        //Master APIS

        [Route("GetWorkModes")]
        [HttpGet]
        public IHttpActionResult GetWorkModes()
        {
            try
            {
                return Ok(objRepo.GetWorkModes());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "SectionName", "GetWorkModes");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSalaryCurrency")]
        [HttpGet]
        public IHttpActionResult GetSalaryCurrency()
        {
            try
            {
                return Ok(objRepo.GetSalaryCurrency());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "SectionName", "GetSalaryCurrency");
                return BadRequest("There is some error! Try again later");
            }

        }

        [Route("GetEmploymentType")]
        [HttpGet]
        public IHttpActionResult GetEmploymentType()
        {
            try
            {
                return Ok(objRepo.GetEmploymentType());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "SectionName", "GetEmploymentType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetQualificationsCourseType")]
        [HttpGet]
        public IHttpActionResult GetQualificationsCourseType()
        {
            try
            {
                return Ok(objRepo.GetQualificationsCourseType());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "SectionName", "GetQualificationsCourseType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetQualificationsByCauseType")]
        [HttpGet]
        public IHttpActionResult GetQualificationsByCauseType(int? CaureTypeId = null)
        {
            try
            {
                return Ok(objRepo.GetQualificationsByCauseType(CaureTypeId));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetQualificationsByCauseType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPostedLocationsForNaukri")]
        [HttpGet]
        public IHttpActionResult GetPostedLocationsForNaukri()
        {
            try
            {
                return Ok(objRepo.GetPostedLocationsForNaukri());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetPostedLocationsForNaukri");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetOrganizationForNaukri")]
        [HttpGet]
        public IHttpActionResult GetOrganizationForNaukri()
        {
            try
            {
                return Ok(objRepo.GetOrganizationForNaukri());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetOrganizationForNaukri");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetIndustries")]
        [HttpGet]
        public IHttpActionResult GetIndustries()
        {
            try
            {
                return Ok(objRepo.GetIndustries());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "SectionName", "GetIndustries");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateJobOnNaukri")]
        [HttpPost]
        public async Task<IHttpActionResult> AddUpdateJobOnNaukri(CreateJobModel obj)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateJobOnNaukri", Request); // 🔹 Log incoming request

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;

                obj.distributeTo = ConfigurationManager.AppSettings["NaukridistributeTo"].ToString();

                int result = objRepo.AddUpdateJobOnNaukri(obj, claims[5].Value, out Message);
                var authResult = commonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddUpdateJobOnNaukri", claims[5].Value); // 🔹 Log unauthorized access
                    return authResult;
                }
                else
                {
                    if (result > 1)
                    {
                        int response = await PostJob(result, obj.thid, obj.JobId);
                        if (response > 0)
                        {
                            logger.LogResponseAsync("AddUpdateJobOnNaukri", "200 OK"); // 🔹 Log success
                            return Ok(Message);
                        }
                        else
                        {
                            logger.LogErrorAsync("AddUpdateJobOnNaukri", new Exception("PostJob failed")); // 🔹 Log PostJob failure
                            return BadRequest("There is some error! Try again later.");
                        }
                    }
                    else if (result < 0)
                    {
                        logger.LogErrorAsync("AddUpdateJobOnNaukri", new Exception($"Result less than 0: {Message}")); // 🔹 Log custom error
                        return BadRequest(Message);
                    }
                    else
                    {
                        logger.LogErrorAsync("AddUpdateJobOnNaukri", new Exception("Result = 0")); // 🔹 Log unknown failure
                        return BadRequest("There is some error! Try again later");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateJobOnNaukri", ex); // 🔹 Log exception
                ExceptionLogging.SendExcepToDB(ex, SectionName, "CreateJobRequest");
                return BadRequest("There is some error! Try again later");
            }
        }

        [NonAction]
        public async Task<int> PostJob(int Id, int ThId, string job_Id = null)
        {
            try
            {
                // Enforce TLS 1.2 and 1.3 for secure communication
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                var handler = new HttpClientHandler
                {
                    AutomaticDecompression = System.Net.DecompressionMethods.GZip | System.Net.DecompressionMethods.Deflate
                };
                // Retrieve job details
                var jobDetails = objRepo.GetPostedJobDetails(Id);
                if (job_Id != null)
                {
                    jobDetails.referenceCode = null;
                    jobDetails.jobId = job_Id;

                }
                string apiUrl = "";
                // Prepare API request
                if (job_Id != null)
                {
                    apiUrl = $"https://api.zwayam.com/amplify/v2/jobs/{job_Id}";
                }
                else
                {
                    apiUrl = "https://api.zwayam.com/amplify/v2/jobs";
                }
                string apiKey = ConfigurationManager.AppSettings["NaukriAPIKey"];
                string jsonBody = JsonConvert.SerializeObject(jobDetails);

                using (var httpClient = new HttpClient(handler))
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.DefaultRequestHeaders.Add("api_key", apiKey);

                    var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                    // Send POST request
                    if (job_Id != null)
                    {
                        HttpResponseMessage response = await httpClient.PutAsync(apiUrl, content);
                        if (response.StatusCode == HttpStatusCode.NoContent) // 204 No Content
                        {

                            int isSaved = await SaveJobStatus(job_Id, 'N', 'Y', 'N', 'N');

                            if (isSaved > 0)
                            {
                                return 204; // Success
                            }
                            {
                                return 0;
                            }
                        }
                        else
                        {
                            // Handle failure and log the response
                            string errorResponse = await response.Content.ReadAsStringAsync();
                            dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);

                            // Log the error details in the database
                            ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "PostJobUpdate");
                            return 0;
                        }
                    }
                    else
                    {
                        HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);
                        if (response.IsSuccessStatusCode)
                        {
                            string responseContent = await response.Content.ReadAsStringAsync();
                            dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);

                            string jobId = jsonResponse.id;
                            if (!string.IsNullOrEmpty(jobId))
                            {

                                // Save job id to DB before saving job status
                                int saveJobIdResult = objRepo.SaveJobId(jobId, ThId);

                                if (saveJobIdResult > 0)
                                {
                                    int isSaved = await SaveJobStatus(jobId, 'Y', 'N', 'N', 'N');

                                    if (isSaved > 0)
                                    {
                                        return 1; // Success
                                    }
                                    {
                                        return 0;
                                    }
                                }
                                else
                                {
                                    return 0;
                                }

                            }
                            else
                            {
                                return 0;
                            }

                        }
                        else
                        {
                            // Handle failure and log the response
                            string errorResponse = await response.Content.ReadAsStringAsync();
                            dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);

                            // Log the error details in the database
                            ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "PostJobInsert");
                            return 0;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "PostJob");
                return 0;
            }
        }

        [Route("GetJobDetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetJobDetails(string jobId)
        {
            try
            {
                logger.LogRequestAsync("GetJobDetails", Request); // 🔹 Log incoming request

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.RoleBaseAuth(claims[5].Value);

                var authResult = commonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetJobDetails", claims[5].Value); // 🔹 Log unauthorized
                    return authResult;
                }

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                string apiUrl = $"https://api.zwayam.com/amplify/v2/jobs/{jobId}";
                string apiKey = ConfigurationManager.AppSettings["NaukriAPIKey"];

                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.DefaultRequestHeaders.Add("api_key", apiKey);

                    HttpResponseMessage response = await httpClient.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseContent = await response.Content.ReadAsStringAsync();
                        var jobDetails = JsonConvert.DeserializeObject<JobDetailsResponse>(responseContent);
                        logger.LogResponseAsync("GetJobDetails", "200 OK"); // 🔹 Log success
                        return Ok(jobDetails);
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);

                        ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "GetJobDetails");
                        logger.LogErrorAsync("GetJobDetails", new Exception("External API failure")); // 🔹 Log failure
                        return BadRequest("There is some error! Try again later.");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJobDetails", ex); // 🔹 Log error
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetJobDetails");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [Route("GetPostedJobDetailsbyId")]
        [HttpGet]
        public IHttpActionResult GetPostedJobDetailsbyId(string jobId)
        {
            try
            {
                logger.LogRequestAsync("GetPostedJobDetailsbyId", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.RoleBaseAuth(claims[5].Value);
                var authResult = commonController.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetPostedJobDetailsbyId", claims[5].Value);
                    return authResult;
                }

                var data = objRepo.GetPostedJobDetailsbyId(jobId);
                logger.LogResponseAsync("GetPostedJobDetailsbyId", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPostedJobDetailsbyId", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetPostedJobDetailsbyId");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("UnpublishJob")]
        [HttpPost]
        public async Task<IHttpActionResult> UnpublishJob(string jobId)
        {
            try
            {
                logger.LogRequestAsync("UnpublishJob", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.RoleBaseAuth(claims[5].Value);
                var authResult = commonController.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UnpublishJob", claims[5].Value);
                    return authResult;
                }

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                var handler = new HttpClientHandler
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
                };

                string apiUrl = $"https://api.zwayam.com/amplify/v2/jobs/{jobId}/unpublish";
                string apiKey = ConfigurationManager.AppSettings["NaukriAPIKey"];
                string NaukridistributeTo = ConfigurationManager.AppSettings["NaukridistributeTo"];

                var requestBody = new { jobBoards = new[] { NaukridistributeTo } };
                string jsonBody = JsonConvert.SerializeObject(requestBody);

                using (var httpClient = new HttpClient(handler))
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.DefaultRequestHeaders.Add("api_key", apiKey);

                    var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);

                    if (response.StatusCode == HttpStatusCode.NoContent)
                    {
                        int isSaved = await SaveJobStatus(jobId, 'N', 'N', 'N', 'Y');
                        if (isSaved > 0)
                        {
                            logger.LogResponseAsync("UnpublishJob", "200 OK");
                            return Ok("Job successfully unpublished.");
                        }
                        else
                        {
                            logger.LogErrorAsync("UnpublishJob", new Exception("SaveJobStatus failed"));
                            return BadRequest("There is some error! Try again later.");
                        }
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);

                        ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "UnpublishJob");
                        logger.LogErrorAsync("UnpublishJob", new Exception("External API error"));
                        return BadRequest("Failed to unpublish the job. Please try again later.");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UnpublishJob", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "UnpublishJob");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("RefreshJob")]
        [HttpPost]
        public async Task<IHttpActionResult> RefreshJob(string jobId)
        {
            try
            {
                logger.LogRequestAsync("RefreshJob", Request); // 🔹 Log incoming request

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.RoleBaseAuth(claims[5].Value);
                var authResult = commonController.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "RefreshJob", claims[5].Value); // 🔹 Log unauthorized access
                    return authResult;
                }

                // Enforce TLS 1.2 and 1.3 for secure communication
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                var handler = new HttpClientHandler
                {
                    AutomaticDecompression = System.Net.DecompressionMethods.GZip | System.Net.DecompressionMethods.Deflate
                };

                string apiUrl = $"https://api.zwayam.com/amplify/v2/jobs/{jobId}/refresh";
                string apiKey = ConfigurationManager.AppSettings["NaukriAPIKey"];
                string NaukridistributeTo = ConfigurationManager.AppSettings["NaukridistributeTo"];

                var requestBody = new
                {
                    jobBoards = new[] { NaukridistributeTo }
                };

                string jsonBody = JsonConvert.SerializeObject(requestBody);

                using (var httpClient = new HttpClient(handler))
                {
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    httpClient.DefaultRequestHeaders.Add("api_key", apiKey);

                    var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);

                    if (response.StatusCode == HttpStatusCode.NoContent) // 204 No Content
                    {
                        int isSaved = await SaveJobStatus(jobId, 'N', 'N', 'Y', 'N');

                        if (isSaved > 0)
                        {
                            logger.LogResponseAsync("RefreshJob", "200 OK"); // 🔹 Log success
                            return Ok("Job successfully Refreshed.");
                        }
                        else
                        {
                            logger.LogErrorAsync("RefreshJob", new Exception("SaveJobStatus failed")); // 🔹 Log DB save failure
                            return BadRequest("There is some error! Try again later.");
                        }
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);

                        ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "RefreshJob");
                        logger.LogErrorAsync("RefreshJob", new Exception("External API returned error")); // 🔹 Log external error
                        return BadRequest("Failed to Refresh the job. Please try again later.");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("RefreshJob", ex); // 🔹 Log exception
                ExceptionLogging.SendExcepToDB(ex, SectionName, "RefreshJob");
                return BadRequest("There is some error! Try again later.");
            }
        }


        [NonAction]
        public async Task<int> SaveJobStatus(string jobId, char? IsPosted = null, char? IsUpdated = null, char? IsRefresh = null, char? IsUnpublish = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var jobDetailsResponse = await GetJobDetails(jobId) as OkNegotiatedContentResult<JobDetailsResponse>;
                string Massage = string.Empty;

                if (jobDetailsResponse != null)
                {
                    var Details = jobDetailsResponse.Content;
                    // Save the job status in the database
                    int isSaved = objRepo.SaveJobStatus(Details, claims[5].Value, IsPosted, IsUpdated, IsRefresh, IsUnpublish);
                    return isSaved;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Interview", "SaveJobStatus");
                return 0;
            }

        }


        [NonAction]
        public async Task<IHttpActionResult> UpdateApplicationStage(string applyId, string stage = null)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int resultAuth = objRepo.RoleBaseAuth(claims[5].Value);
                var authResult = commonController.HandleAuthorizationResult(resultAuth);
                if (authResult != null)
                {
                    return authResult;
                }
                else
                {
                    // Enforce TLS 1.2 and 1.3 for secure communication
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
                    var handler = new HttpClientHandler
                    {
                        AutomaticDecompression = System.Net.DecompressionMethods.GZip | System.Net.DecompressionMethods.Deflate
                    };

                    string apiUrl = $"https://api.zwayam.com/amplify/v2/applies/{applyId}/stage";
                    string apiKey = ConfigurationManager.AppSettings["NaukriAPIKey"]; // Or use the provided key directly if needed

                    var requestBody = new
                    {
                        sourceType = "api",
                        stage = stage
                    };

                    string jsonBody = JsonConvert.SerializeObject(requestBody);

                    using (var httpClient = new HttpClient(handler))
                    {
                        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        httpClient.DefaultRequestHeaders.Add("api_key", apiKey);

                        var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                        HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);

                        if (response.StatusCode == HttpStatusCode.NoContent) // 204 No Content
                        {
                            int result = objRepo.SaveApplicantStages(applyId, stage);
                            if (result > 0)
                            {
                                return Ok("Stage updated successfully.");
                            }
                            else
                            {
                                return BadRequest("There is some error! Try again later.");
                            }
                        }
                        else
                        {
                            string errorResponse = await response.Content.ReadAsStringAsync();
                            dynamic errorDetails = JsonConvert.DeserializeObject(errorResponse);
                            ExceptionLogging.LogApiErrorToDatabase(errorDetails, SectionName, "UpdateApplicationStage");
                            return BadRequest("Failed to update stage. Please try again later.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "UpdateApplicationStage");
                return BadRequest("There is some error! Try again later.");
            }
        }

        [Route("GetApplicantDetailsById")]
        [HttpGet]
        public IHttpActionResult GetApplicantDetailsById(int Id)
        {
            try
            {
                logger.LogRequestAsync("GetApplicantDetailsById", Request); // 🔹 Log incoming request
                int result = 0;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetApplicantDetailsById(Id, claims[5].Value, out result);
                var authResult = commonController.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "RefreshJob", claims[5].Value); // 🔹 Log unauthorized access
                    return authResult;
                }
                logger.LogResponseAsync("GetApplicantDetailsById", "200 OK"); // 🔹 Log success
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetApplicantDetailsById", ex); // 🔹 Log exception
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetApplicantDetailsById");
                return BadRequest("There is some error! Try again later");
            }
        }

    }

}
