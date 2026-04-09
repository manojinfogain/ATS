using ATSAPI.App_Data;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Collections;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using ATSAPI.common;
using System.Security.Claims;
using System.Data;

namespace ATSAPI.Controllers
{
    //  [AuthorizeAttribute]
    [RoutePrefix("api/master")]
    public class MastersController : ApiController
    {
        MastersRepository objRepo = new MastersRepository();
        Common common = new Common();
        CommonController commonController = new CommonController();
        Logger logger = new Logger();


        [Route("getInterviewTypes")]
        [HttpGet]
        public IHttpActionResult getInterviewTypes(string EmpId)
        {
            try
            {
                logger.LogRequestAsync("getInterviewTypes", Request);
                var result = objRepo.getInterviewTypes(EmpId);
                logger.LogResponseAsync("getInterviewTypes", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getInterviewTypes");
                logger.LogErrorAsync("getInterviewTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getTraits")]
        [HttpGet]
        public IHttpActionResult getTraits(string EmpId)
        {
            try
            {
                logger.LogRequestAsync("getTraits", Request);
                var result = objRepo.getTraits(EmpId);
                logger.LogResponseAsync("getTraits", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getTraits");
                logger.LogErrorAsync("getTraits", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getSkills")]
        [HttpGet]
        public IHttpActionResult getSkills()
        {
            try
            {
                logger.LogRequestAsync("getSkills", Request);
                var result = objRepo.getSkills();
                logger.LogResponseAsync("getSkills", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getSkills");
                logger.LogErrorAsync("getSkills", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAccountMaster")]
        [HttpGet]
        public IHttpActionResult getAccountMaster(string searchText)
        {
            try
            {
                logger.LogRequestAsync("getAccountMaster", Request);
                var result = objRepo.getAccountMaster(searchText);
                logger.LogResponseAsync("getAccountMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAccountMaster");
                logger.LogErrorAsync("getAccountMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getProjectMaster")]
        [HttpPost]
        public IHttpActionResult getProjectMaster([FromBody] projFilter obj)
        {
            try
            {
                logger.LogRequestAsync("getProjectMaster", Request);
                var result = objRepo.getProjectMaster(obj.AccountID, obj.searchText);
                logger.LogResponseAsync("getProjectMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getProjectMaster");
                logger.LogErrorAsync("getProjectMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getDesignation")]
        [HttpGet]
        public IHttpActionResult getDesignation()
        {
            try
            {
                logger.LogRequestAsync("getDesignation", Request);
                var result = objRepo.GetAllDesignations();
                logger.LogResponseAsync("getDesignation", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllDesignations");
                logger.LogErrorAsync("getDesignation", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getInterviewerList")]
        [HttpGet]
        public IHttpActionResult getInterviewerList(string EmpId = "", bool pagination = false, int limit = 0, string searchText = "")
        {
            try
            {
                logger.LogRequestAsync("getInterviewerList", Request);
                var result = objRepo.getInterviewerList(EmpId, pagination, limit, searchText);
                logger.LogResponseAsync("getInterviewerList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getInterviewerList");
                logger.LogErrorAsync("getInterviewerList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCountryList")]
        [HttpGet]
        public IHttpActionResult getCountryList(string EmpId = "", bool pagination = false, int limit = 0, string searchText = "")
        {
            try
            {
                logger.LogRequestAsync("getCountryList", Request);
                var result = objRepo.getCountryList(EmpId, pagination, limit, searchText);
                logger.LogResponseAsync("getCountryList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getCountryList");
                logger.LogErrorAsync("getCountryList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getStateList")]
        [HttpGet]
        public IHttpActionResult getStateList(int? CountryId = null)
        {
            try
            {
                logger.LogRequestAsync("getStateList", Request);
                var result = objRepo.getStateList(CountryId);
                logger.LogResponseAsync("getStateList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getStateList");
                logger.LogErrorAsync("getStateList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getCityList")]
        [HttpGet]
        public IHttpActionResult getCityList(string EmpId, int? CountryId = null, int? StateId = null)
        {
            try
            {
                logger.LogRequestAsync("getCityList", Request);
                var result = objRepo.getCityList(EmpId, CountryId, StateId);
                logger.LogResponseAsync("getCityList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getCityList");
                logger.LogErrorAsync("getCityList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getProfilesList")]
        [HttpGet]
        public IHttpActionResult getProfilesList(int? locId = 0)
        {
            try
            {
                logger.LogRequestAsync("getProfilesList", Request);
                var result = objRepo.getProfilesList(locId);
                logger.LogResponseAsync("getProfilesList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getProfilesList");
                logger.LogErrorAsync("getProfilesList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        /**
        * Developed By Ayat
        **/

        [Route("getRecruiterList")]
        [HttpGet]
        public IHttpActionResult getRecruiterList()
        {
            try
            {
                logger.LogRequestAsync("getRecruiterList", Request);
                var result = objRepo.getRecruiterList();
                logger.LogResponseAsync("getRecruiterList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getRecruiterList");
                logger.LogErrorAsync("getRecruiterList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllInterviewStatus")]
        [HttpGet]
        public IHttpActionResult GetAllInterviewStatus()
        {
            try
            {
                logger.LogRequestAsync("GetAllInterviewStatus", Request);
                var result = objRepo.GetAllInterviewStatus();
                logger.LogResponseAsync("GetAllInterviewStatus", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllInterviewStatus");
                logger.LogErrorAsync("GetAllInterviewStatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetHiringManager")]
        [HttpGet]
        public IHttpActionResult GetHiringManager()
        {
            try
            {
                logger.LogRequestAsync("GetHiringManager", Request);
                var result = objRepo.GetHiringManager();
                logger.LogResponseAsync("GetHiringManager", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetHiringManager");
                logger.LogErrorAsync("GetHiringManager", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getRequisitionTypes")]
        [HttpGet]
        public IHttpActionResult getRequisitionTypes()
        {
            try
            {
                logger.LogRequestAsync("getRequisitionTypes", Request);
                var result = objRepo.getRequisitionTypes();
                logger.LogResponseAsync("getRequisitionTypes", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getRequisitionTypes");
                logger.LogErrorAsync("getRequisitionTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDeliveryUnits")]
        [HttpGet]
        public IHttpActionResult GetDeliveryUnits()
        {
            try
            {
                logger.LogRequestAsync("GetDeliveryUnits", Request);
                var result = objRepo.GetDeliveryUnits();
                logger.LogResponseAsync("GetDeliveryUnits", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetDeliveryUnits");
                logger.LogErrorAsync("GetDeliveryUnits", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetContractTypes")]
        [HttpGet]
        public IHttpActionResult GetContractTypes(int LocationID = 0)
        {
            try
            {
                logger.LogRequestAsync("GetContractTypes", Request);
                var result = objRepo.GetContractTypes(LocationID);
                logger.LogResponseAsync("GetContractTypes", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetContractTypes");
                logger.LogErrorAsync("GetContractTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCompanyList")]
        [HttpGet]
        public IHttpActionResult GetCompanyList(int Page = 1, int PageSize = 10000, string name = null)
        {
            try
            {
                logger.LogRequestAsync("GetCompanyList", Request);
                var result = objRepo.GetCompanyList(Page, PageSize, name);
                logger.LogResponseAsync("GetCompanyList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetCompanyList");
                logger.LogErrorAsync("GetCompanyList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("getApproverList")]
        [HttpGet]
        public IHttpActionResult getApproverList(int cid, int reqType, string EmpId = "", int Division = 1, int type = 1)
        {
            try
            {
                logger.LogRequestAsync("getApproverList", Request);
                var result = objRepo.getApproverList(Division, EmpId, type, cid, reqType);
                logger.LogResponseAsync("getApproverList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getApproverList");
                logger.LogErrorAsync("getApproverList", ex);
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
                var result = objRepo.GetGradeMaster();
                logger.LogResponseAsync("GetGradeMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetGradeMaster");
                logger.LogErrorAsync("GetGradeMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getTagHeadApproverList")]
        [HttpGet]
        public IHttpActionResult getTagHeadApproverList(int? Division = null)
        {
            try
            {
                logger.LogRequestAsync("getTagHeadApproverList", Request);
                var result = objRepo.getTagHeadApproverList(Division);
                logger.LogResponseAsync("getTagHeadApproverList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getTagHeadApproverList");
                logger.LogErrorAsync("getTagHeadApproverList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getInfogainLocations")]
        [HttpGet]
        public IHttpActionResult getInfogainLocations(int? locationId = null)
        {
            try
            {
                logger.LogRequestAsync("getInfogainLocations", Request);
                var result = objRepo.getInfogainLocations(locationId);
                logger.LogResponseAsync("getInfogainLocations", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getInfogainLocations");
                logger.LogErrorAsync("getInfogainLocations", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCurrencyList")]
        [HttpGet]
        public IHttpActionResult GetCurrencyList()
        {
            try
            {
                logger.LogRequestAsync("GetCurrencyList", Request);
                var result = objRepo.GetCurrencyList();
                logger.LogResponseAsync("GetCurrencyList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetCurrencyList");
                logger.LogErrorAsync("GetCurrencyList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllOfferStatus")]
        [HttpGet]
        public IHttpActionResult getAllOfferStatus()
        {
            try
            {
                logger.LogRequestAsync("getAllOfferStatus", Request);
                var result = objRepo.getAllOfferStatus();
                logger.LogResponseAsync("getAllOfferStatus", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllOfferStatus");
                logger.LogErrorAsync("getAllOfferStatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllOnboardStatus")]
        [HttpGet]
        public IHttpActionResult getAllOnboardStatus()
        {
            try
            {
                logger.LogRequestAsync("getAllOnboardStatus", Request);
                var result = objRepo.getAllOnboardStatus();
                logger.LogResponseAsync("getAllOnboardStatus", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllOnboardStatus");
                logger.LogErrorAsync("getAllOnboardStatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getFullfillmentDelayReason")]
        [HttpGet]
        public IHttpActionResult getFullfillmentDelayReason(int Type)
        {
            try
            {
                logger.LogRequestAsync("getFullfillmentDelayReason", Request);
                var result = objRepo.getFullfillmentDelayReason(Type);
                logger.LogResponseAsync("getFullfillmentDelayReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getFullfillmentDelayReason");
                logger.LogErrorAsync("getFullfillmentDelayReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getAllCurrency")]
        [HttpGet]
        public IHttpActionResult getAllCurrency()
        {
            try
            {
                logger.LogRequestAsync("getAllCurrency", Request);
                var result = objRepo.getAllCurrency();
                logger.LogResponseAsync("getAllCurrency", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllCurrency");
                logger.LogErrorAsync("getAllCurrency", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllInterviewModeDetails")]
        [HttpGet]
        public IHttpActionResult getAllInterviewModeDetails()
        {
            try
            {
                logger.LogRequestAsync("getAllInterviewModeDetails", Request);
                var result = objRepo.getAllInterviewModeDetails();
                logger.LogResponseAsync("getAllInterviewModeDetails", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllInterviewModeDetails");
                logger.LogErrorAsync("getAllInterviewModeDetails", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllCandidateTypes")]
        [HttpGet]
        public IHttpActionResult getAllCandidateTypes()
        {
            try
            {
                logger.LogRequestAsync("getAllCandidateTypes", Request);
                var result = objRepo.getAllCandidateTypes();
                logger.LogResponseAsync("getAllCandidateTypes", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllCandidateTypes");
                logger.LogErrorAsync("getAllCandidateTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllIdentityTypes")]
        [HttpGet]
        public IHttpActionResult getAllIdentityTypes()
        {
            try
            {
                logger.LogRequestAsync("getAllIdentityTypes", Request);
                var result = objRepo.getAllIdentityTypes();
                logger.LogResponseAsync("getAllIdentityTypes", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllIdentityTypes");
                logger.LogErrorAsync("getAllIdentityTypes", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetJobFamilyList")]
        [HttpGet]
        public IHttpActionResult GetJobFamilyList(int PracticeID, int? division = 1)
        {
            try
            {
                logger.LogRequestAsync("GetJobFamilyList", Request);
                var result = objRepo.GetJobFamilyList(PracticeID, division);
                logger.LogResponseAsync("GetJobFamilyList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetJobFamilyList");
                logger.LogErrorAsync("GetJobFamilyList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetGradeBandList")]
        [HttpGet]
        public IHttpActionResult GetGradeBandList(int GradeID)
        {
            try
            {
                logger.LogRequestAsync("GetGradeBandList", Request);
                var result = objRepo.GetGradeBandList(GradeID);
                logger.LogResponseAsync("GetGradeBandList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetGradeBandList");
                logger.LogErrorAsync("GetGradeBandList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCurrentEmployerList")]
        [HttpGet]
        public IHttpActionResult GetCurrentEmployerList()
        {
            try
            {
                logger.LogRequestAsync("GetCurrentEmployerList", Request);
                var result = objRepo.GetCurrentEmployerList();
                logger.LogResponseAsync("GetCurrentEmployerList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "sp_getEmployerList");
                logger.LogErrorAsync("GetCurrentEmployerList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetEducationList")]
        [HttpGet]
        public IHttpActionResult GetEducationList()
        {
            try
            {
                logger.LogRequestAsync("GetEducationList", Request);
                var result = objRepo.GetEducationList();
                logger.LogResponseAsync("GetEducationList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "sp_getEducationList");
                logger.LogErrorAsync("GetEducationList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllHiringManager")]
        [HttpGet]
        public IHttpActionResult GetAllHiringManager(string HMType = null)
        {
            try
            {
                logger.LogRequestAsync("GetAllHiringManager", Request);
                var result = objRepo.GetAllHiringManager(HMType);
                logger.LogResponseAsync("GetAllHiringManager", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllHiringManager");
                logger.LogErrorAsync("GetAllHiringManager", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAccountOwner")]
        [HttpGet]
        public IHttpActionResult GetAccountOwner()
        {
            try
            {
                logger.LogRequestAsync("GetAccountOwner", Request);
                var result = objRepo.GetAccountOwner();
                logger.LogResponseAsync("GetAccountOwner", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAccountOwner");
                logger.LogErrorAsync("GetAccountOwner", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCandidateDropReasonList")]
        [HttpGet]
        public IHttpActionResult GetCandidateDropReasonList()
        {
            try
            {
                logger.LogRequestAsync("GetCandidateDropReasonList", Request);
                var result = objRepo.GetCandidateDropReasonList();
                logger.LogResponseAsync("GetCandidateDropReasonList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetCandidateDropReasonList");
                logger.LogErrorAsync("GetCandidateDropReasonList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOutlooksupportedTimeZones")]
        [HttpPost]
        public IHttpActionResult GetOutlooksupportedTimeZones()
        {
            HttpResponseMessage servicerequest = null;
            try
            {
                logger.LogRequestAsync("GetOutlooksupportedTimeZones", Request);
                string token = common.GenerateToken();
                HttpClient httpClient = new HttpClient();
                string _url = "https://graph.microsoft.com/v1.0/users/5b113828-0ae9-45db-97a5-c51b8bb8006e/outlook/supportedTimeZones(TimeZoneStandard=microsoft.graph.timeZoneStandard'Iana')";
                httpClient.BaseAddress = new Uri(_url);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + token + "");
                servicerequest = httpClient.GetAsync(_url).Result;
                string response = servicerequest.Content.ReadAsStringAsync().Result;

                logger.LogResponseAsync("GetOutlooksupportedTimeZones", "200 OK");
                return Ok(JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Interview", "GetOutlooksupportedTimeZones");
                logger.LogErrorAsync("GetOutlooksupportedTimeZones", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllTalentSubStatus")]
        [HttpGet]
        public IHttpActionResult GetAllTalentSubStatus()
        {
            try
            {
                logger.LogRequestAsync("GetAllTalentSubStatus", Request);
                var result = objRepo.GetAllTalentSubStatus();
                logger.LogResponseAsync("GetAllTalentSubStatus", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllTalentSubStatus");
                logger.LogErrorAsync("GetAllTalentSubStatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAccountDUWise")]
        [HttpPost]
        public IHttpActionResult GetAccountDUWise([FromBody] DUModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetAccountDUWise", Request);
                var result = objRepo.GetAccountDuwise(obj);
                logger.LogResponseAsync("GetAccountDUWise", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAccountDUWise");
                logger.LogErrorAsync("GetAccountDUWise", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllGender")]
        [HttpGet]
        public IHttpActionResult GetAllGender()
        {
            try
            {
                logger.LogRequestAsync("GetAllGender", Request);
                var result = objRepo.GetAllGender();
                logger.LogResponseAsync("GetAllGender", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllGender");
                logger.LogErrorAsync("GetAllGender", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CandidateOfferDropReasonSubset")]
        [HttpGet]
        public IHttpActionResult CandidateOfferDropReasonSubset(int? id = null)
        {
            try
            {
                logger.LogRequestAsync("CandidateOfferDropReasonSubset", Request);
                var result = objRepo.CandidateOfferDropReasonSubset(id);
                logger.LogResponseAsync("CandidateOfferDropReasonSubset", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "CandidateOfferDropReasonSubset");
                logger.LogErrorAsync("CandidateOfferDropReasonSubset", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getDelegatorList")]
        [HttpGet]
        public IHttpActionResult getDelegatorList()
        {
            try
            {
                logger.LogRequestAsync("getDelegatorList", Request);
                var result = objRepo.getDelegatorList();
                logger.LogResponseAsync("getDelegatorList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getDelegatorList");
                logger.LogErrorAsync("getDelegatorList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getExternalAgencyList")]
        [HttpGet]
        public IHttpActionResult getExternalAgencyList()
        {
            try
            {
                logger.LogRequestAsync("getExternalAgencyList", Request);
                var result = objRepo.getExternalAgencyList();
                logger.LogResponseAsync("getExternalAgencyList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getExternalAgencyList");
                logger.LogErrorAsync("getExternalAgencyList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDivisionMaster")]
        [HttpGet]
        public IHttpActionResult GetDivisionMaster()
        {
            try
            {
                logger.LogRequestAsync("GetDivisionMaster", Request);
                var result = objRepo.GetDivisionMaster();
                logger.LogResponseAsync("GetDivisionMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetDivisionMaster");
                logger.LogErrorAsync("GetDivisionMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getScreenRejectReason")]
        [HttpGet]
        public IHttpActionResult getScreenRejectReason(int? id = null)
        {
            try
            {
                logger.LogRequestAsync("getScreenRejectReason", Request);
                var result = objRepo.ScreenRejectReasons(id);
                logger.LogResponseAsync("getScreenRejectReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getScreenRejectReason");
                logger.LogErrorAsync("getScreenRejectReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getJoinedEmployeeList")]
        [HttpGet]
        public IHttpActionResult getJoinedEmployeeList()
        {
            try
            {
                logger.LogRequestAsync("getJoinedEmployeeList", Request);
                var result = objRepo.GetJoinedEmployeeList();
                logger.LogResponseAsync("getJoinedEmployeeList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getJoinedEmployeeList");
                logger.LogErrorAsync("getJoinedEmployeeList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getAllPractices")]
        [HttpGet]
        public IHttpActionResult getAllPractices()
        {
            try
            {
                logger.LogRequestAsync("getAllPractices", Request);
                var result = objRepo.GetAllPractices();
                logger.LogResponseAsync("getAllPractices", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getAllPractices");
                logger.LogErrorAsync("getAllPractices", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPracticeCommunities")]
        [HttpGet]
        public IHttpActionResult GetPracticeCommunities(string practice)
        {
            try
            {
                logger.LogRequestAsync("GetPracticeCommunities", Request);
                var result = objRepo.GetPracticeCommunities(practice);
                logger.LogResponseAsync("GetPracticeCommunities", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetPracticeCommunities");
                logger.LogErrorAsync("GetPracticeCommunities", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSubPractice")]
        [HttpGet]
        public IHttpActionResult GetSubPractice(string practice)
        {
            try
            {
                logger.LogRequestAsync("GetSubPractice", Request);
                var result = objRepo.GetSubPractice(practice);
                logger.LogResponseAsync("GetSubPractice", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetSubPractice");
                logger.LogErrorAsync("GetSubPractice", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetFinicialYear")]
        [HttpGet]
        public IHttpActionResult GetFinicialYear()
        {
            try
            {
                logger.LogRequestAsync("GetFinicialYear", Request);
                var result = objRepo.GetFinicialYear();
                logger.LogResponseAsync("GetFinicialYear", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetFinicialYear");
                logger.LogErrorAsync("GetFinicialYear", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetEmployeeUnit")]
        [HttpGet]
        public IHttpActionResult GetEmployeeUnit()
        {
            try
            {
                logger.LogRequestAsync("GetEmployeeUnit", Request);
                var result = objRepo.GetEmployeeUnit();
                logger.LogResponseAsync("GetEmployeeUnit", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetEmployeeUnit");
                logger.LogErrorAsync("GetEmployeeUnit", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOnboardingFormMaster")]
        [HttpGet]
        public IHttpActionResult GetOnboardingFormMaster()
        {
            try
            {
                logger.LogRequestAsync("GetOnboardingFormMaster", Request);
                var result = objRepo.GetOnboardingFormMaster();
                logger.LogResponseAsync("GetOnboardingFormMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetOnboardingFormMaster");
                logger.LogErrorAsync("GetOnboardingFormMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPrimarySkills")]
        [HttpGet]
        public IHttpActionResult getPrimarySkills()
        {
            try
            {
                logger.LogRequestAsync("getPrimarySkills", Request);
                var result = objRepo.getPrimarySkills();
                logger.LogResponseAsync("getPrimarySkills", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getPrimarySkills");
                logger.LogErrorAsync("getPrimarySkills", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDepartments")]
        [HttpGet]
        public IHttpActionResult GetDepartments()
        {
            try
            {
                logger.LogRequestAsync("GetDepartments", Request);
                var result = objRepo.GetDepartments();
                logger.LogResponseAsync("GetDepartments", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetDepartments");
                logger.LogErrorAsync("GetDepartments", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetUSEmpList")]
        [HttpGet]
        public IHttpActionResult GetUSEmpList()
        {
            try
            {
                logger.LogRequestAsync("GetUSEmpList", Request);
                var result = objRepo.GetUSEmpList();
                logger.LogResponseAsync("GetUSEmpList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetUSEmpList");
                logger.LogErrorAsync("GetUSEmpList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVender")]
        [HttpGet]
        public IHttpActionResult GetVender()
        {
            try
            {
                logger.LogRequestAsync("GetVender", Request);
                var result = objRepo.GetVender();
                logger.LogResponseAsync("GetVender", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetVender");
                logger.LogErrorAsync("GetVender", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllTalentCubeList")]
        [HttpGet]
        public IHttpActionResult GetAllTalentCubeList()
        {
            try
            {
                logger.LogRequestAsync("GetAllTalentCubeList", Request);
                var result = objRepo.GetAllTalentCubeList();
                logger.LogResponseAsync("GetAllTalentCubeList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAllTalentCubeList");
                logger.LogErrorAsync("GetAllTalentCubeList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRoleByTalentCube")]
        [HttpGet]
        public IHttpActionResult GetRoleByTalentCube(int? TalentCubeCode = null, int? GradeId = null)
        {
            try
            {
                logger.LogRequestAsync("GetRoleByTalentCube", Request);
                var result = objRepo.GetRoleByTalentCube(TalentCubeCode, GradeId);
                logger.LogResponseAsync("GetRoleByTalentCube", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetRoleByTalentCube");
                logger.LogErrorAsync("GetRoleByTalentCube", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("getTagHeadList")]
        [HttpGet]
        public IHttpActionResult getTagHeadList()
        {
            try
            {
                logger.LogRequestAsync("getTagHeadList", Request);
                var result = objRepo.getTagHeadList();
                logger.LogResponseAsync("getTagHeadList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getTagHeadList");
                logger.LogErrorAsync("getTagHeadList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getcSkillCountryList")]
        [HttpGet]
        public IHttpActionResult getcSkillCountryList()
        {
            try
            {
                logger.LogRequestAsync("getcSkillCountryList", Request);
                var result = objRepo.getcSkillCountryList();
                logger.LogResponseAsync("getcSkillCountryList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getcSkillCountryList");
                logger.LogErrorAsync("getcSkillCountryList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetVariablePayPercentageMaster")]
        [HttpGet]
        public IHttpActionResult GetVariablePayPercentageMaster(int cid, int gradeId, int cubeId)
        {
            try
            {
                logger.LogRequestAsync("GetVariablePayPercentageMaster", Request);
                var result = objRepo.GetVariablePayPercentageMaster(cid, gradeId, cubeId);
                logger.LogResponseAsync("GetVariablePayPercentageMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetVariablePayPercentageMaster");
                logger.LogErrorAsync("GetVariablePayPercentageMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateCompany")]
        [HttpPost]
        public IHttpActionResult AddUpdateCompany([FromBody] CompanyName obj)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateCompany", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.AddUpdateCompany(obj, claims[5].Value, ref Message);

                if (result == 1)
                {
                    logger.LogResponseAsync("AddUpdateCompany", "200 OK");
                    return Ok(Message);
                }
                else if (result == 2)
                {
                    logger.LogResponseAsync("AddUpdateCompany", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("AddUpdateCompany", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Master", "AddUpdateCompany");
                logger.LogErrorAsync("AddUpdateCompany", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCompanyName")]
        [HttpGet]
        public IHttpActionResult getCompanyName(int page, int pagesize, string name = null)
        {
            try
            {
                logger.LogRequestAsync("getCompanyName", Request);
                var result = objRepo.getCompanyName(page, pagesize, name);
                logger.LogResponseAsync("getCompanyName", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getCompanyName");
                logger.LogErrorAsync("getCompanyName", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AssessmentCompleted")]
        [HttpPost]
        public IHttpActionResult AssessmentCompleted([FromBody] AssessmentCompleted obj)
        {
            try
            {
                logger.LogRequestAsync("AssessmentCompleted", Request);
                var result = objRepo.AssessmentCompleted(obj);
                logger.LogResponseAsync("AssessmentCompleted", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "AssessmentCompleted");
                logger.LogErrorAsync("AssessmentCompleted", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTech1InterviewByMaster")]
        [HttpGet]
        public IHttpActionResult GetTech1InterviewByMaster()
        {
            try
            {
                logger.LogRequestAsync("GetTech1InterviewByMaster", Request);
                var result = objRepo.GetTech1InterviewByMaster();
                logger.LogResponseAsync("GetTech1InterviewByMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetTech1InterviewByMaster");
                logger.LogErrorAsync("GetTech1InterviewByMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOnlineAssesmentAgencyMaster")]
        [HttpGet]
        public IHttpActionResult GetOnlineAssesmentAgency()
        {
            try
            {
                logger.LogRequestAsync("GetOnlineAssesmentAgency", Request);
                var result = objRepo.GetOnlineAssesmentAgency();
                logger.LogResponseAsync("GetOnlineAssesmentAgency", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetOnlineAssesmentAgency");
                logger.LogErrorAsync("GetOnlineAssesmentAgency", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetReasonForNotOptOnlineExternalAssessment")]
        [HttpGet]
        public IHttpActionResult GetReasonForNotOptOnlineExternalAssessment()
        {
            try
            {
                logger.LogRequestAsync("GetReasonForNotOptOnlineExternalAssessment", Request);
                var result = objRepo.GetReasonForNotOptOnlineExternalAssessment();
                logger.LogResponseAsync("GetReasonForNotOptOnlineExternalAssessment", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetReasonForNotOptOnlineExternalAssessment");
                logger.LogErrorAsync("GetReasonForNotOptOnlineExternalAssessment", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAssessmentReasonMaster")]
        [HttpGet]
        public IHttpActionResult GetAssessmentReasonMaster()
        {
            try
            {
                logger.LogRequestAsync("GetAssessmentReasonMaster", Request);
                var result = objRepo.GetAssessmentReasonMaster();
                logger.LogResponseAsync("GetAssessmentReasonMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetAssessmentReasonMaster");
                logger.LogErrorAsync("GetAssessmentReasonMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCompRangeBucketMaster")]
        [HttpGet]
        public IHttpActionResult GetCompRangeBucketMaster()
        {
            try
            {
                logger.LogRequestAsync("GetCompRangeBucketMaster", Request);
                var result = objRepo.GetCompRangeBucketMaster();
                logger.LogResponseAsync("GetCompRangeBucketMaster", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetCompRangeBucketMaster");
                logger.LogErrorAsync("GetCompRangeBucketMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getPartnerstatus")]
        [HttpGet]
        public IHttpActionResult getPartnerstatus()
        {
            try
            {
                logger.LogRequestAsync("getPartnerstatus", Request);
                var result = objRepo.getPartnerstatus();
                logger.LogResponseAsync("getPartnerstatus", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getPartnerstatus");
                logger.LogErrorAsync("getPartnerstatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSendToTagReason")]
        [HttpGet]
        public IHttpActionResult GetSendToTagReason()
        {
            try
            {
                logger.LogRequestAsync("GetSendToTagReason", Request);
                var result = objRepo.GetSendToTagReason();
                logger.LogResponseAsync("GetSendToTagReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetSendToTagReason");
                logger.LogErrorAsync("GetSendToTagReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetApprovedOver")]
        [HttpGet]
        public IHttpActionResult GetApprovedOver()
        {
            try
            {
                logger.LogRequestAsync("GetApprovedOver", Request);
                var result = objRepo.GetApprovedOver();
                logger.LogResponseAsync("GetApprovedOver", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetApprovedOver");
                logger.LogErrorAsync("GetApprovedOver", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetApprovedBy")]
        [HttpGet]
        public IHttpActionResult GetApprovedBy()
        {
            try
            {
                logger.LogRequestAsync("GetApprovedBy", Request);
                var result = objRepo.GetApprovedBy();
                logger.LogResponseAsync("GetApprovedBy", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetApprovedBy");
                logger.LogErrorAsync("GetApprovedBy", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRescheduleCanelReason")]
        [HttpGet]
        public IHttpActionResult GetRescheduleCanelReason()
        {
            try
            {
                logger.LogRequestAsync("GetRescheduleCanelReason", Request);
                var result = objRepo.GetRescheduleCanelReason();
                logger.LogResponseAsync("GetRescheduleCanelReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetRescheduleCanelReason");
                logger.LogErrorAsync("GetRescheduleCanelReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getTalentDPApproverList")]
        [HttpGet]
        public IHttpActionResult getTalentDPApproverList(int thid, int reqType, string EmpId = "", int type = 1)
        {
            try
            {
                logger.LogRequestAsync("getTalentDPApproverList", Request);
                var result = objRepo.getTalentDPApproverList(thid, EmpId, type, reqType);
                logger.LogResponseAsync("getTalentDPApproverList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "getTalentDPApproverList");
                logger.LogErrorAsync("getTalentDPApproverList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentReopenningRemarks")]
        [HttpGet]
        public IHttpActionResult GetTalentReopenningRemarks()
        {
            try
            {
                logger.LogRequestAsync("GetTalentReopenningRemarks", Request);
                var result = objRepo.GetTalentReopenningRemarks();
                logger.LogResponseAsync("GetTalentReopenningRemarks", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetTalentReopenningRemarks");
                logger.LogErrorAsync("GetTalentReopenningRemarks", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetSkillProficiencyLevelMaster")]
        [HttpGet]
        public IHttpActionResult GetRatingLevelMaster()
        {
            try
            {
                logger.LogRequestAsync("GetRatingLevelMaster", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetSkillProficiencyLevelMaster(claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetRatingLevelMaster");
                logger.LogErrorAsync("GetRatingLevelMaster", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOpportunityList")]
        [HttpGet]
        public IHttpActionResult GetOpportunityList()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetOpportunityList(claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetOpportunityList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetBizOpsList")]
        [HttpGet]
        public IHttpActionResult GetBizOpsList()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetBizOpsList(claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetBizOpsList");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReplGradeChangeReason")]
        [HttpGet]
        public IHttpActionResult GetReplGradeChangeReason()
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetReplGradeChangeReason(claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Masters", "GetReplGradeChangeReason");
                return BadRequest("There is some error! Try again later");
            }
        }

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



    }
}

