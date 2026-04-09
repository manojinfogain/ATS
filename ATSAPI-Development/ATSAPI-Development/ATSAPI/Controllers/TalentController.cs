using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
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
using System.Web;
using System.Web.Http;
using TimeZoneConverter;


namespace ATSAPI.Controllers
{
    [UserWiseAuthorizeAttribute("I")]
    //[AuthorizeAttribute]
    [RoutePrefix("api/Talent")]
    public class TalentController : ApiController
    {
        TalentRepository objRepo = new TalentRepository();
        Common common = new Common();
        string SectionName = "Talent";
        CommonController CommonController = new CommonController();
        EmailSender EmailSender = new EmailSender();
        CommonController cm = new CommonController();
        Logger logger = new Logger();

        [Route("GetStates")]
        [HttpGet]
        public IHttpActionResult GetStates(int CountryID)
        {
            try
            {
                logger.LogRequestAsync("GetStates", Request);

                var states = objRepo.GetStates(CountryID);

                logger.LogResponseAsync("GetStates", "200 OK");
                return Ok(states);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetStates", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRequirementType")]
        [HttpGet]
        public IHttpActionResult GetRequirementType(int EmpUnit)
        {
            try
            {
                logger.LogRequestAsync("GetRequirementType", Request);

                var requirementType = objRepo.GetRequirementType(EmpUnit);

                logger.LogResponseAsync("GetRequirementType", "200 OK");
                return Ok(requirementType);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRequirementType", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getCities")]
        [HttpGet]
        public IHttpActionResult getCities(int CountryID, string StateName = "")
        {
            try
            {
                logger.LogRequestAsync("getCities", Request);

                var cities = objRepo.GetCities(CountryID, StateName);

                logger.LogResponseAsync("getCities", "200 OK");
                return Ok(cities);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getCities", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetAccountsList")]
        [HttpGet]
        public IHttpActionResult GetAccountsList(int ReqTypeID, int DUID, int Unit = 1)
        {
            try
            {
                logger.LogRequestAsync("GetAccountsList", Request);

                var accountsList = objRepo.GetAccountsList(ReqTypeID, DUID, Unit);

                logger.LogResponseAsync("GetAccountsList", "200 OK");
                return Ok(accountsList);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAccountsList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDeliveryUnit")]
        [HttpGet]
        public IHttpActionResult GetDeliveryUnit(int EmpUnitID = 1)
        {
            try
            {
                logger.LogRequestAsync("GetDeliveryUnit", Request);

                var deliveryUnit = objRepo.GetDeliveryUnit(EmpUnitID);

                logger.LogResponseAsync("GetDeliveryUnit", "200 OK");
                return Ok(deliveryUnit);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDeliveryUnit", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOpportunityDetails")]
        [HttpGet]
        public IHttpActionResult GetOpportunityDetails(int ReqTypeID, string AccountID)
        {
            try
            {
                logger.LogRequestAsync("GetOpportunityDetails", Request);

                var opportunityDetails = objRepo.GetOpportunityDetails(ReqTypeID, AccountID);

                logger.LogResponseAsync("GetOpportunityDetails", "200 OK");
                return Ok(opportunityDetails);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOpportunityDetails", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetOpportunityDetailsForMapping")]
        [HttpGet]
        public IHttpActionResult GetOpportunityDetailsForMapping(int ReqTypeID, string AccountID, int THID)
        {
            try
            {
                logger.LogRequestAsync("GetOpportunityDetailsForMapping", Request);

                var opportunityDetailsForMapping = objRepo.GetOpportunityDetailsForMapping(ReqTypeID, AccountID, THID);

                logger.LogResponseAsync("GetOpportunityDetailsForMapping", "200 OK");
                return Ok(opportunityDetailsForMapping);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOpportunityDetailsForMapping", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetProjectsList")]
        [HttpGet]
        public IHttpActionResult GetProjectsList(int AccountID)
        {
            try
            {
                logger.LogRequestAsync("GetProjectsList", Request);

                var projectsList = objRepo.GetProjectsList(AccountID);

                logger.LogResponseAsync("GetProjectsList", "200 OK");
                return Ok(projectsList);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetProjectsList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetSFDCClient")]
        [HttpGet]
        public IHttpActionResult GetSFDCClient(string AccountID)
        {
            try
            {
                logger.LogRequestAsync("GetSFDCClient", Request);

                var sfdcClient = objRepo.GetSFDCClient(AccountID);

                logger.LogResponseAsync("GetSFDCClient", "200 OK");
                return Ok(sfdcClient);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSFDCClient", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReplacementReason")]
        [HttpGet]
        public IHttpActionResult GetReplacementReason()
        {
            try
            {
                logger.LogRequestAsync("GetReplacementReason", Request);

                var replacementReason = objRepo.GetReplacementReason();

                logger.LogResponseAsync("GetReplacementReason", "200 OK");
                return Ok(replacementReason);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReplacementReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDatesChangeReason")]
        [HttpGet]
        public IHttpActionResult GetDatesChangeReason()
        {
            try
            {
                logger.LogRequestAsync("GetDatesChangeReason", Request);

                var datesChangeReason = objRepo.GetDatesChangeReason();

                logger.LogResponseAsync("GetDatesChangeReason", "200 OK");
                return Ok(datesChangeReason);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDatesChangeReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTeamDetailsFromPricing")]
        [HttpGet]
        public IHttpActionResult GetTeamDetailsFromPricing(string OppID)
        {
            try
            {
                logger.LogRequestAsync("GetTeamDetailsFromPricing", Request);

                var teamDetails = objRepo.GetTeamDetailsFromPricing(OppID);

                logger.LogResponseAsync("GetTeamDetailsFromPricing", "200 OK");
                return Ok(teamDetails);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTeamDetailsFromPricing", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDesignationCategories")]
        [HttpGet]
        public IHttpActionResult GetDesignationCategories()
        {
            try
            {
                logger.LogRequestAsync("GetDesignationCategories", Request);

                var designationCategories = objRepo.GetDesignationCategories();

                logger.LogResponseAsync("GetDesignationCategories", "200 OK");
                return Ok(designationCategories);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDesignationCategories", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetDesignations")]
        [HttpGet]
        public IHttpActionResult GetDesignations(int DesigCateID)
        {
            try
            {
                logger.LogRequestAsync("GetDesignations", Request);

                var designations = objRepo.GetDesignations(DesigCateID);

                logger.LogResponseAsync("GetDesignations", "200 OK");
                return Ok(designations);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDesignations", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetQualifications")]
        [HttpGet]
        public IHttpActionResult GetQualifications()
        {
            try
            {
                logger.LogRequestAsync("GetQualifications", Request);

                var qualifications = objRepo.GetQualifications();

                logger.LogResponseAsync("GetQualifications", "200 OK");
                return Ok(qualifications);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetQualifications", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPrimarySkills")]
        [HttpGet]
        public IHttpActionResult GetPrimarySkills()
        {
            try
            {
                logger.LogRequestAsync("GetPrimarySkills", Request);

                var primarySkills = objRepo.GetPrimarySkills();

                logger.LogResponseAsync("GetPrimarySkills", "200 OK");
                return Ok(primarySkills);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetPrimarySkills", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSubSkills")]
        [HttpGet]
        public IHttpActionResult GetSubSkills(int PriSkillID)
        {
            try
            {
                logger.LogRequestAsync("GetSubSkills", Request);

                var subSkills = objRepo.GetSubSkills(PriSkillID);

                logger.LogResponseAsync("GetSubSkills", "200 OK");
                return Ok(subSkills);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSubSkills", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSalaryDetails")]
        [HttpGet]
        public IHttpActionResult GetSalaryDetails(int ExpRangeID, int JobFamilyID)
        {
            try
            {
                logger.LogRequestAsync("GetSalaryDetails", Request);

                var salaryDetails = objRepo.GetSalaryDetails(ExpRangeID, JobFamilyID);

                logger.LogResponseAsync("GetSalaryDetails", "200 OK");
                return Ok(salaryDetails);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSalaryDetails", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetDivisions")]
        [HttpGet]
        public IHttpActionResult GetDivisions()
        {
            try
            {
                logger.LogRequestAsync("GetDivisions", Request);
                var response = objRepo.GetDivisions();
                logger.LogResponseAsync("GetDivisions", "200 OK");
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetDivisions", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetDivisions");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetEmployeeType")]
        [HttpGet]
        public IHttpActionResult GetEmployeeType()
        {
            try
            {
                logger.LogRequestAsync("GetEmployeeType", Request);
                var response = objRepo.GetEmployeeType();
                logger.LogResponseAsync("GetEmployeeType", "200 OK");
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmployeeType", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetEmployeeType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetBidType")]
        [HttpGet]
        public IHttpActionResult GetBidType()
        {
            try
            {
                logger.LogRequestAsync("GetBidType", Request);
                var response = objRepo.GetBidType();
                logger.LogResponseAsync("GetBidType", "200 OK");
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetBidType", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetBidType");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRaisedTHIDDetails")]
        [HttpPost]
        public IHttpActionResult GetRaisedTHIDDetails([FromBody] GetRaisedTHIDDetails obj)
        {
            try
            {
                logger.LogRequestAsync("GetRaisedTHIDDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = 0;
                var data = objRepo.GetRaisedTHIDDetails(claims[5].Value, obj, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetRaisedTHIDDetails", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetRaisedTHIDDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRaisedTHIDDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetRaisedTHIDDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTHIDDetailsByTHID")]
        [HttpGet]
        public IHttpActionResult GetTHIDDetailsByTHID(int THID)
        {
            try
            {
                logger.LogRequestAsync("GetTHIDDetailsByTHID", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string EmpID = claims[5].Value;
                int result = 0;
                var data = objRepo.GetTHIDDetailsByTHID(EmpID, THID, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetTHIDDetailsByTHID", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetTHIDDetailsByTHID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTHIDDetailsByTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetTHIDDetailsByTHID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateTalentIDDetails")]
        [HttpPost]
        public IHttpActionResult AddUpdateTalentIDDetails()
        {
            try
            {
                logger.LogRequestAsync("AddUpdateTalentIDDetails", Request);
                TalentIDMaster fb = new TalentIDMaster();
                var frm = HttpContext.Current.Request.Form;

                string FileNamewithExtention1 = string.Empty;
                string FileNamewithExtention2 = string.Empty;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files;

                    if (httpPostedFile["Attachment"] != null)
                    {
                        FileNamewithExtention1 = common.GetFileWithAdditionalExtention(httpPostedFile["Attachment"].FileName);
                        fb.Attachment = FileNamewithExtention1;
                        fb.AttachmentPath = ConfigurationManager.AppSettings["TalentAttachments"];
                    }

                    if (httpPostedFile["THIDApprovalAttachment"] != null)
                    {
                        FileNamewithExtention2 = common.GetFileWithAdditionalExtention(httpPostedFile["THIDApprovalAttachment"].FileName);
                        fb.THIDApprovalAttachment = FileNamewithExtention2;
                        fb.THIDApprovalAttachmentPath = ConfigurationManager.AppSettings["TalentApprovalAttachments"];
                    }
                }

                // (Omitted: Code that populates fb properties)


                fb.THID = Convert.ToInt32(frm["thid"] == null || frm["thid"].ToString() == "" ? "0" : frm["thid"]);
                fb.EmployeeUnitID = Convert.ToInt32(frm["EmployeeUnitID"]);
                fb.JoinLocID = Convert.ToInt32(frm["JoinLocID"]);
                //  fb.StateID = Convert.ToString(frm["StateID"] == null || frm["StateID"].ToString() == "" ? "" : frm["StateID"]);
                fb.StateID = Convert.ToInt32(frm["StateID"] == null || frm["StateID"].ToString() == "" ? "0" : frm["StateID"]);
                fb.CityID = Convert.ToInt32(frm["CityID"] == null || frm["CityID"].ToString() == "" ? "0" : frm["CityID"]);
                if (fb.EmployeeUnitID == 1)
                {
                    fb.ReqTypeID = Convert.ToInt32(frm["ReqTypeID"] == null || frm["ReqTypeID"].ToString() == "" ? "0" : frm["ReqTypeID"]);
                }
                else if (fb.EmployeeUnitID == 5)
                {
                    fb.ReqTypeID = Convert.ToInt32(frm["ReqTypeID"] == null || frm["ReqTypeID"].ToString() == "" ? "0" : frm["ReqTypeID"].ToString());
                }
                fb.InvestmentApproved = frm["InvestmentApproved"];
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                fb.IsInternalMovement = Convert.ToChar(frm["IsInternalMovement"] == null || frm["IsInternalMovement"] == "" ? 'N' : Convert.ToChar(frm["IsInternalMovement"]));
                fb.DUID = Convert.ToInt32(frm["DUID"] == null || frm["DUID"].ToString() == "" ? "0" : frm["DUID"]);
                fb.AccountID = frm["AccountID"] == null ? "" : frm["AccountID"].ToString();
                fb.ProjectID = Convert.ToInt32(frm["ProjectID"] == null || frm["ProjectID"] == "" ? "0" : frm["ProjectID"]);
                fb.BidType = frm["BidType"] == null || frm["BidType"] == "" ? "" : frm["BidType"].ToString();
                fb.SFDCClientID = frm["SFDCClientID"] == null ? "" : frm["SFDCClientID"].ToString();
                fb.OppID = frm["OppID"] == null ? "" : frm["OppID"].ToString();
                fb.OddsOfWinning = Convert.ToInt32(frm["OddsOfWinning"] == null || frm["OddsOfWinning"] == "" ? "0" : frm["OddsOfWinning"]);
                fb.OppType = frm["OppType"] == null ? "" : frm["OppType"];
                fb.ISFDCID = frm["ISFDCID"] == null ? "" : frm["ISFDCID"].ToString();
                // fb.BookingDGM = Convert.ToInt32(frm["BookingDGM"] == null || frm["BookingDGM"] == "" ? "0" : frm["BookingDGM"]);
                fb.BookingDGM = Convert.ToDecimal(frm["BookingDGM"] == null || frm["BookingDGM"] == "" ? "0" : frm["BookingDGM"]);
                fb.PricingRoleID = Convert.ToInt32(frm["PricingRoleID"] == null || frm["PricingRoleID"] == "" ? "0" : frm["PricingRoleID"]);
                fb.ExclusiveInfogain = Convert.ToChar(frm["ExclusiveInfogain"] == null || frm["ExclusiveInfogain"] == "" ? 'N' : Convert.ToChar(frm["ExclusiveInfogain"]));
                fb.JobSummary = frm["JobSummary"] == null ? "" : frm["JobSummary"].ToString();
                fb.JobDesc = frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString();
                // fb.JobDesc = System.Net.WebUtility.HtmlEncode(frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString());
                fb.DesignationID = Convert.ToInt32(frm["DesignationID"] == null || frm["DesignationID"].ToString() == "" ? "0" : frm["DesignationID"]);
                fb.ExpRangeID = Convert.ToInt32(frm["ExpRangeID"] == null || frm["ExpRangeID"].ToString() == "" ? "0" : frm["ExpRangeID"]);
                fb.TravelCost = Convert.ToDecimal(frm["TravelCost"] == null || frm["TravelCost"].ToString() == "" ? "0" : frm["TravelCost"]);
                fb.MaxHiringCost = Convert.ToDecimal(frm["MaxHiringCost"] == null || frm["MaxHiringCost"].ToString() == "" ? "0" : frm["MaxHiringCost"]);
                fb.ProjectEndDate = frm["ProjectEndDate"] == null || frm["ProjectEndDate"].ToString() == "" ? null : frm["ProjectEndDate"].ToString();
                fb.ClosedDate = frm["ClosedDate"] == null || frm["ClosedDate"].ToString() == "" ? null : frm["ClosedDate"].ToString();
                fb.QualificationID = Convert.ToInt32(frm["QualificationID"] == null || frm["QualificationID"].ToString() == "" ? "0" : frm["QualificationID"]);
                fb.SubSkillID = Convert.ToInt32(frm["SubSkillID"] == null || frm["SubSkillID"].ToString() == "" ? "0" : frm["SubSkillID"]);
                fb.AdditionalSkills = Convert.ToString(frm["AdditionalSkills"]);
                fb.EmploymentTypeID = Convert.ToInt32(frm["EmploymentTypeID"] == null || frm["EmploymentTypeID"].ToString() == "" ? "0" : frm["EmploymentTypeID"]);
                fb.Interviewer1 = frm["Interviewer1"] == null ? "" : frm["Interviewer1"].ToString();
                fb.Interviewer2 = frm["Interviewer2"] == null ? "" : frm["Interviewer2"].ToString();
                fb.IsBillable = Convert.ToChar(frm["IsBillable"] == null || frm["IsBillable"].ToString() == "" ? "N" : frm["IsBillable"]);
                fb.BookingMarginPer = Convert.ToDecimal(frm["BookingMarginPer"] == null || frm["BookingMarginPer"].ToString() == "" ? "0" : frm["BookingMarginPer"]);
                fb.ExpectedMarginPer = Convert.ToDecimal(frm["ExpectedMarginPer"] == null || frm["ExpectedMarginPer"].ToString() == "" ? "0" : frm["ExpectedMarginPer"]);
                fb.BillableRate = Convert.ToDecimal(frm["BillableRate"] == null || frm["BillableRate"].ToString() == "" ? "0" : frm["BillableRate"]);
                fb.pBillingStartDate = frm["pBillingStartDate"] == null || frm["pBillingStartDate"].ToString() == "" ? null : frm["pBillingStartDate"];
                fb.pOnboardDate = frm["pOnboardDate"] == null || frm["pOnboardDate"].ToString() == "" ? null : frm["pOnboardDate"];
                fb.IsClientIntReq = Convert.ToChar(frm["IsClientIntReq"] == null || frm["IsClientIntReq"].ToString() == "" ? "N" : frm["IsClientIntReq"]);
                fb.IsVisaReady = Convert.ToChar(frm["IsVisaReady"] == null || frm["IsVisaReady"].ToString() == "" ? "N" : frm["IsVisaReady"]);
                fb.SpecialRequest = frm["SpecialRequest"];
                fb.DeptID = Convert.ToInt32(frm["DeptID"] == null || frm["DeptID"].ToString() == "" ? "0" : frm["DeptID"]);
                fb.ReplacementFor = frm["ReplacementFor"];
                fb.ReplacementReasonID = Convert.ToInt32(frm["ReplacementReasonID"] == null || frm["ReplacementReasonID"] == "" ? "0" : frm["ReplacementReasonID"]);
                fb.ActionTaken = Convert.ToChar(frm["ActionTaken"] == null || frm["ActionTaken"] == "" ? 'S' : Convert.ToChar(frm["ActionTaken"]));
                fb.Remark = frm["Remark"];
                fb.subReasonCate = frm["SubCateID"];
                //fb.assignmentEndDate = frm["assignmentEndDate"] == null || frm["assignmentEndDate"].ToString() == "" ? null : frm["assignmentEndDate"].ToString();
                fb.TalentCubeId = Convert.ToInt32(frm["TalentCubeId"] == null || frm["TalentCubeId"].ToString() == "" ? "0" : frm["TalentCubeId"]);
                fb.TalentCubeRoleId = Convert.ToInt32(frm["TalentCubeRoleId"] == null || frm["TalentCubeRoleId"].ToString() == "" ? "0" : frm["TalentCubeRoleId"]);
                fb.TalentCubeGradeId = Convert.ToInt32(frm["TalentCubeGradeId"] == null || frm["TalentCubeGradeId"].ToString() == "" ? "0" : frm["TalentCubeGradeId"]);
                fb.TCSkill1 = frm["TCSkill1"] == null ? "" : frm["TCSkill1"].ToString();
                fb.TCSkill2 = frm["TCSkill2"] == null ? "" : frm["TCSkill2"].ToString();
                fb.TCSkill3 = frm["TCSkill3"] == null ? "" : frm["TCSkill3"].ToString();
                fb.TCSkill4 = frm["TCSkill4"] == null ? "" : frm["TCSkill4"].ToString();
                fb.BillableHours = frm["BillableHours"] == null ? "" : frm["BillableHours"].ToString();
                //fb.reasonToChangeOnboardDate = Convert.ToInt32(frm["reasonToChangeOnboardDate"] == null || frm["reasonToChangeOnboardDate"] == "" ? "0" : frm["reasonToChangeOnboardDate"]);
                //fb.reasonToChangeBillingSDate = Convert.ToInt32(frm["reasonToChangeBillingSDate"] == null || frm["reasonToChangeBillingSDate"] == "" ? "0" : frm["reasonToChangeBillingSDate"]);
                //fb.reasonToChangeAssignEndDate = Convert.ToInt32(frm["reasonToChangeAssignEndDate"] == null || frm["reasonToChangeAssignEndDate"] == "" ? "0" : frm["reasonToChangeAssignEndDate"]);

                fb.Tech1InterviewBy = Convert.ToInt32(frm["Tech1InterviewBy"] == null || frm["Tech1InterviewBy"].ToString() == "" ? "0" : frm["Tech1InterviewBy"]);
                fb.OnlineAssesmentBy = Convert.ToInt32(frm["OnlineAssesmentBy"] == null || frm["OnlineAssesmentBy"].ToString() == "" ? "0" : frm["OnlineAssesmentBy"]);
                fb.AssessmentLink = Convert.ToString(frm["assessmentLink"]);

                fb.coderBytePublicUrl = Convert.ToString(frm["coderBytePublicKey"]);
                fb.coderByteDisplayName = Convert.ToString(frm["coderByteDisplayName"]);
                fb.ReasonForNotOptOnlineAssessment = Convert.ToInt32(frm["ReasonForNotOptOnlineAssessment"] == null || frm["ReasonForNotOptOnlineAssessment"].ToString() == "" ? "0" : frm["ReasonForNotOptOnlineAssessment"]);
                fb.ReasonForOptExternal = Convert.ToInt32(frm["ReasonForOptExternal"] == null || frm["ReasonForOptExternal"].ToString() == "" ? "0" : frm["ReasonForOptExternal"]);
                fb.coderByteTestId = Convert.ToString(frm["codeByteTestId"]);
                fb.MandatorySkills = frm["MandatorySkills"] == null ? "" : frm["MandatorySkills"].ToString();

                fb.BillingType = Convert.ToInt32(frm["BillingType"] == null || frm["BillingType"].ToString() == "" ? "0" : frm["BillingType"]);
                fb.TCExperienceID = Convert.ToInt32(frm["TalentExperienceId"] == null || frm["TalentExperienceId"].ToString() == "" ? "0" : frm["TalentExperienceId"]);
                fb.C2HEmpEmail = frm["C2HEmpEmail"];
                //fb.C2HEmpRemarks = frm["C2HEmpRemarks"];
                //fb.C2HEmpContractEndDate = frm["C2HEmpContractEndDate"];

                //fb.GradeID = Convert.ToInt32(frm["GradeID"] == null || frm["GradeID"].ToString() == "" ? "0" : frm["GradeID"]);
                fb.GradeID = Convert.ToInt32(frm["GradeID"] == null || frm["GradeID"].ToString() == "" ? "0" : frm["GradeID"]);
                fb.goodToHaveSkill = frm["goodToHaveSkill"] == null ? "" : frm["goodToHaveSkill"].ToString();
                fb.CubePrimaySkillId = Convert.ToInt32(frm["CubePrimaySkillId"] == null || frm["CubePrimaySkillId"].ToString() == "" ? "0" : frm["CubePrimaySkillId"]);
                fb.ClientWorkRequirementId = Convert.ToInt32(frm["ClientWorkRequirementId"] == null || frm["ClientWorkRequirementId"].ToString() == "" ? null : frm["ClientWorkRequirementId"]);
                fb.SubWorkRequirementId = Convert.ToInt32(frm["SubWorkRequirementId"] == null || frm["SubWorkRequirementId"].ToString() == "" ? null : frm["SubWorkRequirementId"]);
                fb.pBillingStartDateUTC = frm["pBillingStartDateUTC"];
                fb.pOnboardDateUTC = frm["pOnboardDateUTC"];
                fb.TimeZoneIana = frm["TimeZoneIana"];
                var timeZoneIana = frm["TimeZoneIana"];

                if (!string.IsNullOrEmpty(timeZoneIana))
                {
                    //     fb.TimeZoneWin = TZConvert.IanaToWindows(timeZoneIana);
                }
                fb.TimeZoneWin = TZConvert.IanaToWindows(frm["TimeZoneIana"]);
                fb.SkillRatingType = frm["SkillRatingType"] == "" || frm["SkillRatingType"] == "undefined" || frm["SkillRatingType"] == null ? null : JsonConvert.DeserializeObject<List<SkillRatingType>>(frm["SkillRatingType"]);
                fb.IsCache = frm["IsCache"] == "" ? 'N' : Convert.ToChar(frm["IsCache"]);
                fb.RepGradeChangeReasonId = Convert.ToInt32(frm["repGradeChangeReason"] == null || frm["repGradeChangeReason"].ToString() == "" ? null : frm["repGradeChangeReason"]);
                if (fb.EmployeeUnitID == 1 && (fb.BidType == "undefined" || fb.BidType == "" || fb.BidType == null))
                {
                    return BadRequest("Bid Type not found.");
                }

                string THID = "0";
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddUpdateTalentIDDetails(fb, claims[5].Value, claims[12].Value, ref THID, ref Message);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddUpdateTalentIDDetails", claims[5].Value);
                    return authResult;
                }

                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {

                    string filedetails = "";
                    string tempPath = "";
                    THID = result.ToString();
                    var httpPostedFile = HttpContext.Current.Request.Files;

                    if (httpPostedFile["Attachment"] != null)
                    {

                        //filedetails = Path.GetFileNameWithoutExtension(httpPostedFile["Attachment"].FileName).ToString() + Path.GetExtension(httpPostedFile["Attachment"].FileName).ToString();
                        tempPath = fb.AttachmentPath + "/" + THID + "/";
                        string fileSavePath = Path.Combine(tempPath, FileNamewithExtention1);

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
                            httpPostedFile["Attachment"].InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }

                        //Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);

                        if (encryptionResult != 1)
                        {
                            return InternalServerError(new Exception("Error encrypting the file."));
                        }


                    }


                    string filedetails1 = "";
                    string tempPath1 = "";
                    var httpPostedFileApprovalAttachment = HttpContext.Current.Request.Files;

                    if (httpPostedFileApprovalAttachment["THIDApprovalAttachment"] != null)
                    {
                        //filedetails1 = Path.GetFileNameWithoutExtension(httpPostedFileApprovalAttachment["THIDApprovalAttachment"].FileName).ToString() + Path.GetExtension(httpPostedFileApprovalAttachment["THIDApprovalAttachment"].FileName).ToString();
                        tempPath1 = fb.THIDApprovalAttachmentPath + "/" + THID + "/";
                        string fileSavePath1 = Path.Combine(tempPath1, FileNamewithExtention2);


                        if (!(Directory.Exists(tempPath1)))
                        {
                            Directory.CreateDirectory(tempPath1);
                        }
                        if (File.Exists(fileSavePath1))
                        {
                            File.Delete(fileSavePath1);
                        }
                        byte[] fileBytes;
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            httpPostedFile["THIDApprovalAttachment"].InputStream.CopyTo(memoryStream);
                            fileBytes = memoryStream.ToArray();
                        }

                        //Encrypt the file before saving
                        int encryptionResult = common.EncryptFile(fileBytes, fileSavePath1);

                        if (encryptionResult != 1)
                        {
                            return InternalServerError(new Exception("Error encrypting the file."));
                        }
                    }
                }

                if (result >= 1)
                {
                    logger.LogResponseAsync("AddUpdateTalentIDDetails", "200 OK");
                    return Ok(Message);
                }
                else if (result == -5)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateTalentIDDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "AddUpdateTalentIDDetails");
                return BadRequest("There is some error! Try again later");
            }
        }


        //[Route("TalentIDClone")]
        //[HttpPost]
        //public IHttpActionResult TalentIDClone(int THID, int Frequency)
        //{
        //    try
        //    {
        //        string message = string.Empty;
        //        var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
        //        int result = objRepo.TalentIDClone(THID, Frequency, claims[12].Value /*DeptID*/, claims[5].Value/*EmpID*/, out message);

        //        if (result == 1)
        //        {
        //            return Ok(message);
        //        }
        //        else if (result == -2)
        //        {
        //            return BadRequest(message);
        //        }
        //        else
        //        {
        //            return BadRequest("There is some error! Try again later.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, SectionName, "UpdateGDLAction");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        [Route("TalentIDClone")]
        [HttpPost]
        public IHttpActionResult TalentIDClone()
        {
            logger.LogRequestAsync("TalentIDClone", Request);

            try
            {
                TalentIDMaster fb = new TalentIDMaster();
                var frm = HttpContext.Current.Request.Form;
                var count = HttpContext.Current.Request.Files.Count;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files;

                    if (httpPostedFile["Attachment"] != null)
                    {
                        fb.Attachment = httpPostedFile["Attachment"].FileName;
                        fb.AttachmentPath = ConfigurationManager.AppSettings["TalentAttachments"];
                    }

                    if (httpPostedFile["THIDApprovalAttachment"] != null)
                    {
                        fb.THIDApprovalAttachment = httpPostedFile["THIDApprovalAttachment"].FileName;
                        fb.THIDApprovalAttachmentPath = ConfigurationManager.AppSettings["TalentApprovalAttachments"];
                    }
                }

                fb.Frequency = Convert.ToInt32(frm["Frequency"] == null || frm["Frequency"].ToString() == "" ? "0" : frm["Frequency"]);
                fb.THID = Convert.ToInt32(frm["thid"] == null || frm["thid"].ToString() == "" ? "0" : frm["thid"]);
                fb.EmployeeUnitID = Convert.ToInt32(frm["EmployeeUnitID"]);
                fb.JoinLocID = Convert.ToInt32(frm["JoinLocID"]);
                fb.StateID = Convert.ToInt32(frm["StateID"] == null || frm["StateID"].ToString() == "" ? "0" : frm["StateID"]);
                fb.CityID = Convert.ToInt32(frm["CityID"] == null || frm["CityID"].ToString() == "" ? "0" : frm["CityID"]);

                if (fb.EmployeeUnitID == 1)
                {
                    fb.ReqTypeID = Convert.ToInt32(frm["ReqTypeID"] == null || frm["ReqTypeID"].ToString() == "" ? "0" : frm["ReqTypeID"]);
                }
                else if (fb.EmployeeUnitID == 5)
                {
                    fb.ReqTypeID = Convert.ToInt32(frm["ReqTypeID"] == null || frm["ReqTypeID"].ToString() == "" ? "0" : frm["ReqTypeID"].ToString());
                }
                fb.InvestmentApproved = frm["InvestmentApproved"];
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                fb.IsInternalMovement = Convert.ToChar(frm["IsInternalMovement"] == null || frm["IsInternalMovement"] == "" ? 'N' : Convert.ToChar(frm["IsInternalMovement"]));
                fb.DUID = Convert.ToInt32(frm["DUID"] == null || frm["DUID"].ToString() == "" ? "0" : frm["DUID"]);
                fb.AccountID = frm["AccountID"] == null ? "" : frm["AccountID"].ToString();
                fb.ProjectID = Convert.ToInt32(frm["ProjectID"] == null || frm["ProjectID"] == "" ? "0" : frm["ProjectID"]);
                fb.BidType = frm["BidType"] == null || frm["BidType"] == "" ? "" : frm["BidType"].ToString();
                fb.SFDCClientID = frm["SFDCClientID"] == null ? "" : frm["SFDCClientID"].ToString();
                fb.OppID = frm["OppID"] == null ? "" : frm["OppID"].ToString();
                fb.OddsOfWinning = Convert.ToInt32(frm["OddsOfWinning"] == null || frm["OddsOfWinning"] == "" ? "0" : frm["OddsOfWinning"]);
                fb.OppType = frm["OppType"] == null ? "" : frm["OppType"];
                fb.ISFDCID = frm["ISFDCID"] == null ? "" : frm["ISFDCID"].ToString();
                // fb.BookingDGM = Convert.ToInt32(frm["BookingDGM"] == null || frm["BookingDGM"] == "" ? "0" : frm["BookingDGM"]);
                fb.BookingDGM = Convert.ToDecimal(frm["BookingDGM"] == null || frm["BookingDGM"] == "" ? "0" : frm["BookingDGM"]);
                fb.PricingRoleID = Convert.ToInt32(frm["PricingRoleID"] == null || frm["PricingRoleID"] == "" ? "0" : frm["PricingRoleID"]);
                fb.ExclusiveInfogain = Convert.ToChar(frm["ExclusiveInfogain"] == null || frm["ExclusiveInfogain"] == "" ? 'N' : Convert.ToChar(frm["ExclusiveInfogain"]));
                fb.JobSummary = frm["JobSummary"] == null ? "" : frm["JobSummary"].ToString();
                fb.JobDesc = frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString();
                // fb.JobDesc = System.Net.WebUtility.HtmlEncode(frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString());
                fb.DesignationID = Convert.ToInt32(frm["DesignationID"] == null || frm["DesignationID"].ToString() == "" ? "0" : frm["DesignationID"]);
                fb.ExpRangeID = Convert.ToInt32(frm["ExpRangeID"] == null || frm["ExpRangeID"].ToString() == "" ? "0" : frm["ExpRangeID"]);
                fb.TravelCost = Convert.ToDecimal(frm["TravelCost"] == null || frm["TravelCost"].ToString() == "" ? "0" : frm["TravelCost"]);
                fb.MaxHiringCost = Convert.ToDecimal(frm["MaxHiringCost"] == null || frm["MaxHiringCost"].ToString() == "" ? "0" : frm["MaxHiringCost"]);
                fb.ProjectEndDate = frm["ProjectEndDate"] == null || frm["ProjectEndDate"].ToString() == "" ? null : frm["ProjectEndDate"].ToString();
                fb.ClosedDate = frm["ClosedDate"] == null || frm["ClosedDate"].ToString() == "" ? null : frm["ClosedDate"].ToString();
                fb.QualificationID = Convert.ToInt32(frm["QualificationID"] == null || frm["QualificationID"].ToString() == "" ? "0" : frm["QualificationID"]);
                fb.SubSkillID = Convert.ToInt32(frm["SubSkillID"] == null || frm["SubSkillID"].ToString() == "" ? "0" : frm["SubSkillID"]);
                fb.AdditionalSkills = Convert.ToString(frm["AdditionalSkills"]);
                fb.EmploymentTypeID = Convert.ToInt32(frm["EmploymentTypeID"] == null || frm["EmploymentTypeID"].ToString() == "" ? "0" : frm["EmploymentTypeID"]);
                fb.Interviewer1 = frm["Interviewer1"] == null ? "" : frm["Interviewer1"].ToString();
                fb.Interviewer2 = frm["Interviewer2"] == null ? "" : frm["Interviewer2"].ToString();
                fb.IsBillable = Convert.ToChar(frm["IsBillable"] == null || frm["IsBillable"].ToString() == "" ? "N" : frm["IsBillable"]);
                fb.BookingMarginPer = Convert.ToDecimal(frm["BookingMarginPer"] == null || frm["BookingMarginPer"].ToString() == "" ? "0" : frm["BookingMarginPer"]);
                fb.ExpectedMarginPer = Convert.ToDecimal(frm["ExpectedMarginPer"] == null || frm["ExpectedMarginPer"].ToString() == "" ? "0" : frm["ExpectedMarginPer"]);
                fb.BillableRate = Convert.ToDecimal(frm["BillableRate"] == null || frm["BillableRate"].ToString() == "" ? "0" : frm["BillableRate"]);
                fb.pBillingStartDate = frm["pBillingStartDate"] == null || frm["pBillingStartDate"].ToString() == "" ? null : frm["pBillingStartDate"];
                fb.pOnboardDate = frm["pOnboardDate"] == null || frm["pOnboardDate"].ToString() == "" ? null : frm["pOnboardDate"];
                fb.IsClientIntReq = Convert.ToChar(frm["IsClientIntReq"] == null || frm["IsClientIntReq"].ToString() == "" ? "N" : frm["IsClientIntReq"]);
                fb.IsVisaReady = Convert.ToChar(frm["IsVisaReady"] == null || frm["IsVisaReady"].ToString() == "" ? "N" : frm["IsVisaReady"]);
                fb.SpecialRequest = frm["SpecialRequest"];
                fb.DeptID = Convert.ToInt32(frm["DeptID"] == null || frm["DeptID"].ToString() == "" ? "0" : frm["DeptID"]);
                fb.ReplacementFor = frm["ReplacementFor"];
                fb.ReplacementReasonID = Convert.ToInt32(frm["ReplacementReasonID"] == null || frm["ReplacementReasonID"] == "" ? "0" : frm["ReplacementReasonID"]);
                fb.ActionTaken = Convert.ToChar(frm["ActionTaken"] == null || frm["ActionTaken"] == "" ? 'S' : Convert.ToChar(frm["ActionTaken"]));
                fb.Remark = frm["Remark"];
                fb.subReasonCate = frm["SubCateID"];
                //fb.assignmentEndDate = frm["assignmentEndDate"] == null || frm["assignmentEndDate"].ToString() == "" ? null : frm["assignmentEndDate"].ToString();
                fb.TalentCubeId = Convert.ToInt32(frm["TalentCubeId"] == null || frm["TalentCubeId"].ToString() == "" ? "0" : frm["TalentCubeId"]);
                fb.TalentCubeRoleId = Convert.ToInt32(frm["TalentCubeRoleId"] == null || frm["TalentCubeRoleId"].ToString() == "" ? "0" : frm["TalentCubeRoleId"]);
                fb.TalentCubeGradeId = Convert.ToInt32(frm["TalentCubeGradeId"] == null || frm["TalentCubeGradeId"].ToString() == "" ? "0" : frm["TalentCubeGradeId"]);
                fb.TCSkill1 = frm["TCSkill1"] == null ? "" : frm["TCSkill1"].ToString();
                fb.TCSkill2 = frm["TCSkill2"] == null ? "" : frm["TCSkill2"].ToString();
                fb.TCSkill3 = frm["TCSkill3"] == null ? "" : frm["TCSkill3"].ToString();
                fb.TCSkill4 = frm["TCSkill4"] == null ? "" : frm["TCSkill4"].ToString();
                fb.BillableHours = frm["BillableHours"] == null ? "" : frm["BillableHours"].ToString();
                //fb.reasonToChangeOnboardDate = Convert.ToInt32(frm["reasonToChangeOnboardDate"] == null || frm["reasonToChangeOnboardDate"] == "" ? "0" : frm["reasonToChangeOnboardDate"]);
                //fb.reasonToChangeBillingSDate = Convert.ToInt32(frm["reasonToChangeBillingSDate"] == null || frm["reasonToChangeBillingSDate"] == "" ? "0" : frm["reasonToChangeBillingSDate"]);
                //fb.reasonToChangeAssignEndDate = Convert.ToInt32(frm["reasonToChangeAssignEndDate"] == null || frm["reasonToChangeAssignEndDate"] == "" ? "0" : frm["reasonToChangeAssignEndDate"]);

                fb.Tech1InterviewBy = Convert.ToInt32(frm["Tech1InterviewBy"] == null || frm["Tech1InterviewBy"].ToString() == "" ? "0" : frm["Tech1InterviewBy"]);
                fb.OnlineAssesmentBy = Convert.ToInt32(frm["OnlineAssesmentBy"] == null || frm["OnlineAssesmentBy"].ToString() == "" ? "0" : frm["OnlineAssesmentBy"]);
                fb.AssessmentLink = Convert.ToString(frm["assessmentLink"]);

                fb.coderBytePublicUrl = Convert.ToString(frm["coderBytePublicKey"]);
                fb.coderByteDisplayName = Convert.ToString(frm["coderByteDisplayName"]);
                fb.ReasonForNotOptOnlineAssessment = Convert.ToInt32(frm["ReasonForNotOptOnlineAssessment"] == null || frm["ReasonForNotOptOnlineAssessment"].ToString() == "" ? "0" : frm["ReasonForNotOptOnlineAssessment"]);
                fb.ReasonForOptExternal = Convert.ToInt32(frm["ReasonForOptExternal"] == null || frm["ReasonForOptExternal"].ToString() == "" ? "0" : frm["ReasonForOptExternal"]);
                fb.coderByteTestId = Convert.ToString(frm["codeByteTestId"]);
                fb.MandatorySkills = frm["MandatorySkills"] == null ? "" : frm["MandatorySkills"].ToString();

                fb.BillingType = Convert.ToInt32(frm["BillingType"] == null || frm["BillingType"].ToString() == "" ? "0" : frm["BillingType"]);
                fb.TCExperienceID = Convert.ToInt32(frm["TalentExperienceId"] == null || frm["TalentExperienceId"].ToString() == "" ? "0" : frm["TalentExperienceId"]);
                fb.C2HEmpEmail = frm["C2HEmpEmail"];
                //fb.C2HEmpRemarks = frm["C2HEmpRemarks"];
                //fb.C2HEmpContractEndDate = frm["C2HEmpContractEndDate"];

                //fb.GradeID = Convert.ToInt32(frm["GradeID"] == null || frm["GradeID"].ToString() == "" ? "0" : frm["GradeID"]);
                fb.GradeID = Convert.ToInt32(frm["GradeID"] == null || frm["GradeID"].ToString() == "" ? "0" : frm["GradeID"]);
                fb.goodToHaveSkill = frm["goodToHaveSkill"] == null ? "" : frm["goodToHaveSkill"].ToString();
                fb.CubePrimaySkillId = Convert.ToInt32(frm["CubePrimaySkillId"] == null || frm["CubePrimaySkillId"].ToString() == "" ? "0" : frm["CubePrimaySkillId"]);
                fb.IsCache = frm["IsCache"] == "" ? 'N' : Convert.ToChar(frm["IsCache"]);
                fb.ClientWorkRequirementId = Convert.ToInt32(frm["ClientWorkRequirementId"] == null || frm["ClientWorkRequirementId"].ToString() == "" ? null : frm["ClientWorkRequirementId"]);
                fb.SubWorkRequirementId = Convert.ToInt32(frm["SubWorkRequirementId"] == null || frm["SubWorkRequirementId"].ToString() == "" ? null : frm["SubWorkRequirementId"]);
                fb.pBillingStartDateUTC = frm["pBillingStartDateUTC"];
                fb.pOnboardDateUTC = frm["pOnboardDateUTC"];
                fb.TimeZoneIana = frm["TimeZoneIana"];
                fb.TimeZoneWin = TZConvert.IanaToWindows(frm["TimeZoneIana"]);
                fb.SkillRatingType = frm["SkillRatingType"] == "" || frm["SkillRatingType"] == "undefined" || frm["SkillRatingType"] == null ? null : JsonConvert.DeserializeObject<List<SkillRatingType>>(frm["SkillRatingType"]);
                fb.RepGradeChangeReasonId = Convert.ToInt32(frm["repGradeChangeReason"] == null || frm["repGradeChangeReason"].ToString() == "" ? null : frm["repGradeChangeReason"]);
                if (fb.EmployeeUnitID == 1 && (fb.BidType == "undefined" || fb.BidType == "" || fb.BidType == null))
                {
                    return BadRequest("Bid Type not found.");
                }

                string THID = "0";
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.TalentIDClone(fb, claims[5].Value, Convert.ToInt32(claims[12].Value), ref THID, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);

                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "TalentIDClone", claims[5].Value);
                    return authResult;
                }
                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {

                    string filedetails = "";
                    string tempPath = "";
                    THID = result.ToString();
                    var httpPostedFile = HttpContext.Current.Request.Files;

                    if (httpPostedFile["Attachment"] != null)
                    {
                        filedetails = Path.GetFileNameWithoutExtension(httpPostedFile["Attachment"].FileName).ToString() + Path.GetExtension(httpPostedFile["Attachment"].FileName).ToString();
                        tempPath = fb.AttachmentPath + "/" + THID + "/";

                        if (!(Directory.Exists(tempPath)))
                        {
                            Directory.CreateDirectory(tempPath);
                        }
                        string fileSavePath = Path.Combine(tempPath, filedetails);
                        if (System.IO.File.Exists(fileSavePath))
                        {
                            File.Delete(fileSavePath);
                        }
                        httpPostedFile["Attachment"].SaveAs(fileSavePath);
                    }


                    string filedetails1 = "";
                    string tempPath1 = "";
                    var httpPostedFileApprovalAttachment = HttpContext.Current.Request.Files;

                    if (httpPostedFileApprovalAttachment["THIDApprovalAttachment"] != null)
                    {
                        filedetails1 = Path.GetFileNameWithoutExtension(httpPostedFileApprovalAttachment["THIDApprovalAttachment"].FileName).ToString() + Path.GetExtension(httpPostedFileApprovalAttachment["THIDApprovalAttachment"].FileName).ToString();
                        tempPath1 = fb.THIDApprovalAttachmentPath + "/" + THID + "/";

                        if (!(Directory.Exists(tempPath1)))
                        {
                            Directory.CreateDirectory(tempPath1);
                        }
                        string fileSavePath1 = Path.Combine(tempPath1, filedetails1);
                        if (System.IO.File.Exists(fileSavePath1))
                        {
                            File.Delete(fileSavePath1);
                        }
                        httpPostedFileApprovalAttachment["THIDApprovalAttachment"].SaveAs(fileSavePath1);
                    }
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("TalentIDClone", "200 OK");
                    return Ok(Message);
                }
                else if (result < 0)
                {
                    logger.LogResponseAsync("TalentIDClone", "400 Bad Request");
                    return BadRequest(Message);
                }
                else
                {
                    logger.LogResponseAsync("TalentIDClone", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("TalentIDClone", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateGDLAction")]
        [HttpPost]
        public IHttpActionResult UpdateGDLAction(int THID, char ActionTaken, int? SubCateID = null, string Remarks = "")
        {
            logger.LogRequestAsync("UpdateGDLAction", Request);

            try
            {
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateGDLAction(THID, ActionTaken, Remarks, claims[5].Value, out message, SubCateID);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateGDLAction", claims[5].Value);
                    return authResult;
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("UpdateGDLAction", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateGDLAction", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateGDLAction", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateTalentIdStatus")]
        [HttpPost]
        public IHttpActionResult UpdateTalentIdStatus(int THID, int StatusId, int? ReasonId = null, string EmpName = null, string subReason = null, string Comments = "", string Remark = null, string ProposedEmpId = null, string ExfulfiledEmpId = null, int? sourceId = null, DateTime? Dateofjoining = null, DateTime? offerdate = null, string ReferrerName = null, int? SubProfileId = null)
        {
            logger.LogRequestAsync("UpdateTalentIdStatus", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string message = string.Empty;
                int result = objRepo.UpdateTalentIdStatus(THID, StatusId, claims[5].Value, out message, ReasonId, EmpName, subReason, Comments, Remark, ProposedEmpId, ExfulfiledEmpId, sourceId, Dateofjoining, offerdate, ReferrerName, SubProfileId);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateTalentIdStatus", claims[5].Value);
                    return authResult;
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("UpdateTalentIdStatus", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateTalentIdStatus", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateTalentIdStatus", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateIJP")]
        [HttpPost]
        public IHttpActionResult AddUpdateIJP([FromBody] THIDIJP obj)
        {
            logger.LogRequestAsync("AddUpdateIJP", Request);

            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddUpdateIJP(obj, claims[5].Value);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "AddUpdateIJP", claims[5].Value);
                    return authResult;
                }

                if (result == 1)
                {
                    logger.LogResponseAsync("AddUpdateIJP", "200 OK");
                    return Ok("Status Updated Successfully");
                }
                else
                {
                    logger.LogResponseAsync("AddUpdateIJP", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateIJP", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetIJPTHIDDetails")]
        [HttpGet]
        public IHttpActionResult GetIJPTHIDDetails(int THID)
        {
            try
            {
                logger.LogRequestAsync("GetIJPTHIDDetails", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIJPTHIDDetails(THID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetIJPTHIDDetails", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPTHIDDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetIJPTHIDDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentStatus")]
        [HttpGet]
        public IHttpActionResult GetTalentStatus(string ActionTaken)
        {
            try
            {
                logger.LogRequestAsync("GetTalentStatus", Request);
                var response = objRepo.GetTalentStatus(ActionTaken);
                logger.LogResponseAsync("GetTalentStatus", "200 OK");
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentStatus", ex);
                ExceptionLogging.SendExcepToDB(ex, "Talent", "GetTalentStatus");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetEmployeeToReferTalentId")]
        [HttpPost]
        public IHttpActionResult GetEmployeeToReferTalentId(ProposedEmp obj)
        {
            try
            {
                logger.LogRequestAsync("GetEmployeeToReferTalentId", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetEmployeeToReferTalentId(obj, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetEmployeeToReferTalentId", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmployeeToReferTalentId", ex);
                ExceptionLogging.SendExcepToDB(ex, "Talent", "GetEmployeeToReferTalentId");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddProposedEmployeesAgainstTHID")]
        [HttpPost]
        public IHttpActionResult AddProposedEmployeesAgainstTHID(int THID, string EmpIds)
        {
            try
            {
                logger.LogRequestAsync("AddProposedEmployeesAgainstTHID", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.AddProposedEmployeesAgainstTHID(THID, EmpIds, claims[5].Value);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result == 1)
                {
                    logger.LogResponseAsync("AddProposedEmployeesAgainstTHID", "200 OK");
                    return Ok("Employee added successfully");
                }
                else
                {
                    logger.LogResponseAsync("AddProposedEmployeesAgainstTHID", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddProposedEmployeesAgainstTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Talent", "AddProposedEmployeesAgainstTHID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReferBackReason")]
        [HttpGet]
        public IHttpActionResult GetReferBackReason()
        {
            try
            {
                logger.LogRequestAsync("GetReferBackReason", Request);
                var result = objRepo.GetReferBackReason();
                logger.LogResponseAsync("GetReferBackReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReferBackReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetProposedEmployeesTHIDWise")]
        [HttpGet]
        public IHttpActionResult GetProposedEmployeesTHIDWise(int THID)
        {
            try
            {
                logger.LogRequestAsync("GetProposedEmployeesTHIDWise", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetProposedEmployeesTHIDWise(THID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetProposedEmployeesTHIDWise", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetProposedEmployeesTHIDWise", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetProposedEmployeesTHIDWise", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetIJPViewList")]
        [HttpPost]
        public IHttpActionResult GetIJPViewList([FromBody] GetIJPViewList obj)
        {
            try
            {
                logger.LogRequestAsync("GetIJPViewList", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIJPViewList(obj, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetIJPViewList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetIJPViewList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPViewList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetIJPApplicantList")]
        [HttpGet]
        public IHttpActionResult GetIJPApplicantList(int talentID)
        {
            try
            {
                logger.LogRequestAsync("GetIJPApplicantList", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIJPApplicantList(talentID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetIJPApplicantList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetIJPApplicantList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPApplicantList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ApplyForIJP")]
        [HttpPost]
        public IHttpActionResult ApplyForIJP(int IJPID, string TalentId)
        {
            try
            {
                logger.LogRequestAsync("ApplyForIJP", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.ApplyForIJP(IJPID, claims[5].Value, TalentId);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "ApplyForIJP", claims[5].Value);
                    return authResult;
                }
                else if (result == 1)
                {
                    logger.LogResponseAsync("ApplyForIJP", "200 OK");
                    return Ok("Applied successfully");
                }
                else
                {
                    logger.LogResponseAsync("ApplyForIJP", "400 Bad Request");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApplyForIJP", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetOfferedCandidateDetailsForTalent")]
        [HttpGet]
        public IHttpActionResult GetOfferedCandidateDetailsForTalent(int talentID)
        {
            try
            {
                logger.LogRequestAsync("GetOfferedCandidateDetailsForTalent", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetOfferedCandidateDetailsForTalent(talentID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetOfferedCandidateDetailsForTalent", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("GetOfferedCandidateDetailsForTalent", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetOfferedCandidateDetailsForTalent", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CancelTHID")]
        [HttpPost]
        public IHttpActionResult CancelTHID(int THID, int SubCateID, string Remarks = "")
        {
            try
            {
                logger.LogRequestAsync("CancelTHID", Request);
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.CancelTHID(THID, SubCateID, Remarks, claims[5].Value, claims[12].Value, out message);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "CancelTHID", claims[5].Value);
                    return authResult;
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("CancelTHID", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("CancelTHID", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CancelTHID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCancellationCategory")]
        [HttpGet]
        public IHttpActionResult GetCancellationCategory()
        {
            try
            {
                logger.LogRequestAsync("GetCancellationCategory", Request);
                var result = objRepo.GetCancellationCategory();
                logger.LogResponseAsync("GetCancellationCategory", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCancellationCategory", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetCancellationSubCategory")]
        [HttpGet]
        public IHttpActionResult GetCancellationSubCategory(int CateID)
        {
            try
            {
                logger.LogRequestAsync("GetCancellationSubCategory", Request);
                var result = objRepo.GetCancellationSubCategory(CateID);
                logger.LogResponseAsync("GetCancellationSubCategory", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCancellationSubCategory", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateFinanceAction")]
        [HttpPost]
        public IHttpActionResult UpdateFinanceAction(int THID, char ActionTaken, int? SubCateID = null, string Remarks = "")
        {
            try
            {
                logger.LogRequestAsync("UpdateFinanceAction", Request);
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateFinanceAction(THID, ActionTaken, SubCateID, Remarks, claims[5].Value, out message);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateFinanceAction", claims[5].Value);
                    return authResult;
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("UpdateFinanceAction", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateFinanceAction", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateFinanceAction", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateTHIDDetailsWMG")]
        [HttpPost]
        public IHttpActionResult UpdateTHIDDetailsWMG(int THID, string FulfilmentDate, string Remarks = "")
        {
            try
            {
                logger.LogRequestAsync("UpdateTHIDDetailsWMG", Request);
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateTHIDDetailsWMG(THID, FulfilmentDate, Remarks, claims[5].Value, out message);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "UpdateTHIDDetailsWMG", claims[5].Value);
                    return authResult;
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("UpdateTHIDDetailsWMG", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("UpdateTHIDDetailsWMG", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateTHIDDetailsWMG", ex);
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("GetSentBackToWMGReason")]
        [HttpGet]
        public IHttpActionResult GetSentBackToWMGReason()
        {
            try
            {
                logger.LogRequestAsync("GetSentBackToWMGReason", Request);
                var result = objRepo.GetSentBackToWMGReason();
                logger.LogResponseAsync("GetSentBackToWMGReason", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSentBackToWMGReason", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetStatusList")]
        [HttpGet]
        public IHttpActionResult GetStatusList()
        {
            try
            {
                logger.LogRequestAsync("GetStatusList", Request);
                var result = objRepo.GetStatusList();
                logger.LogResponseAsync("GetStatusList", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetStatusList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetReferBackReasonForWMG")]
        [HttpGet]
        public IHttpActionResult GetReferBackReasonForWMG()
        {
            try
            {
                logger.LogRequestAsync("GetReferBackReasonForWMG", Request);
                var result = objRepo.GetReferBackReasonForWMG();
                logger.LogResponseAsync("GetReferBackReasonForWMG", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetReferBackReasonForWMG", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getConverstionEmpList")]
        [HttpGet]
        public IHttpActionResult getConverstionEmpList(int? reqType = null)
        {
            try
            {
                logger.LogRequestAsync("getConverstionEmpList", Request);
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getConverstionEmpList(claims[5].Value, out result, reqType);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "getConverstionEmpList", claims[5].Value);
                    return authResult;
                }

                logger.LogResponseAsync("getConverstionEmpList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getConverstionEmpList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("MappingOppIDtoTHID")]
        [HttpPost]
        public IHttpActionResult MappingOppIDtoTHID([FromBody] Mapping obj)
        {
            try
            {
                logger.LogRequestAsync("MappingOppIDtoTHID", Request);
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.MappingOppIDtoTHID(obj.THID, obj.OppID, obj.ReqTypeID, obj.Remarks, claims[5].Value, out message, obj.IsBillable, obj.BillableRate, obj.BidType, obj.AccountID, obj.SFDCAccountID, obj.ProjectID, obj.BillingHour, obj.pBillingStartDate, obj.BillingType);

                if (result > 0)
                {
                    logger.LogResponseAsync("MappingOppIDtoTHID", "200 OK");
                    return Ok(message);
                }
                else
                {
                    logger.LogResponseAsync("MappingOppIDtoTHID", "400 Bad Request");
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("MappingOppIDtoTHID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("GetStatusHistoryForTalentID")]
        [HttpGet]
        public IHttpActionResult GetStatusHistoryForTalentID(int talentID)
        {
            try
            {
                logger.LogRequestAsync("GetStatusHistoryForTalentID", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetStatusHistoryForTalentID(talentID, claims[5].Value, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetStatusHistoryForTalentID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetStatusHistoryForTalentID", ex);
                ExceptionLogging.SendExcepToDB(ex, "Talent", "GetOfferedCandidateDetailsForTalent");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddOrRemoveFromWebsite")]
        [HttpPost]
        public IHttpActionResult AddOrRemoveFromWebsite(int talentID, char ActionTaken)
        {
            try
            {
                logger.LogRequestAsync("AddOrRemoveFromWebsite", Request);

                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                int result = objRepo.AddOrRemoveFromWebsite(talentID, ActionTaken, claims[5].Value);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("AddOrRemoveFromWebsite", "200 OK");
                    return Ok("Successfully Removed");
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddOrRemoveFromWebsite", ex);
                ExceptionLogging.SendExcepToDB(ex, "Talent", "AddOrRemoveFromWebsite");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ApprovedOrRejectThIdFromMail")]
        [HttpPost]
        public IHttpActionResult ApprovedOrRejectThIdFromMail(int THID, char ActionTaken, int? SubCateID = null, string Remarks = "")
        {
            try
            {
                logger.LogRequestAsync("ApprovedOrRejectThIdFromMail", Request);

                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.ApprovedOrRejectThIdFromMail(THID, ActionTaken, Remarks, claims[5].Value, out message, SubCateID);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("ApprovedOrRejectThIdFromMail", "200 OK");
                    return Ok(message);
                }
                else if (result < 0)
                {
                    return BadRequest(message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("ApprovedOrRejectThIdFromMail", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "ApprovedOrRejectThIdFromMail");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("UpdateTalentIDDetails")]
        [HttpPost]
        public IHttpActionResult UpdateTalentIDDetails()
        {
            try
            {
                logger.LogRequestAsync("UpdateTalentIDDetails", Request);

                TalentIDMaster fb = new TalentIDMaster();
                var frm = HttpContext.Current.Request.Form;
                string FileNamewithExtention = string.Empty;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    FileNamewithExtention = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                    fb.Attachment = FileNamewithExtention;
                    fb.AttachmentPath = ConfigurationManager.AppSettings["TalentAttachments"];
                }

                fb.THID = Convert.ToInt32(frm["thid"] ?? "0");
                fb.EmployeeUnitID = Convert.ToInt32(frm["EmployeeUnitID"]);
                if (fb.EmployeeUnitID == 1 || fb.EmployeeUnitID == 5)
                {
                    fb.ReqTypeID = Convert.ToInt32(frm["ReqTypeID"] ?? "0");
                }

                fb.JoinLocID = Convert.ToInt32(frm["JoinLocID"] ?? "0");
                fb.StateID = Convert.ToInt32(frm["StateID"] ?? "0");
                fb.CityID = Convert.ToInt32(frm["CityID"] ?? "0");
                fb.InvestmentApproved = frm["InvestmentApproved"];
                fb.DivisionID = Convert.ToInt32(frm["DivisionID"] == null || frm["DivisionID"].ToString() == "" ? "0" : frm["DivisionID"]);
                fb.IsInternalMovement = Convert.ToChar(frm["IsInternalMovement"] == null || frm["IsInternalMovement"] == "" ? 'N' : Convert.ToChar(frm["IsInternalMovement"]));
                fb.DUID = Convert.ToInt32(frm["DUID"] == null || frm["DUID"].ToString() == "" ? "0" : frm["DUID"]);
                fb.AccountID = frm["AccountID"] == null ? "" : frm["AccountID"].ToString();
                fb.ProjectID = Convert.ToInt32(frm["ProjectID"] == null || frm["ProjectID"] == "" ? "0" : frm["ProjectID"]);
                fb.BidType = frm["BidType"] == null || frm["BidType"] == "" ? "" : frm["BidType"].ToString();
                fb.SFDCClientID = frm["SFDCClientID"] == null ? "" : frm["SFDCClientID"].ToString();
                fb.OppID = frm["OppID"] == null ? "" : frm["OppID"].ToString();
                fb.OddsOfWinning = Convert.ToInt32(frm["OddsOfWinning"] == null || frm["OddsOfWinning"] == "" ? "0" : frm["OddsOfWinning"]);
                fb.OppType = frm["OppType"] == null ? "" : frm["OppType"];
                fb.ISFDCID = frm["ISFDCID"] == null ? "" : frm["ISFDCID"].ToString();
                fb.BookingDGM = Convert.ToInt32(frm["BookingDGM"] == null || frm["BookingDGM"] == "" ? "0" : frm["BookingDGM"]);
                fb.PricingRoleID = Convert.ToInt32(frm["PricingRoleID"] == null || frm["PricingRoleID"] == "" ? "0" : frm["PricingRoleID"]);
                fb.ExclusiveInfogain = Convert.ToChar(frm["ExclusiveInfogain"] == null || frm["ExclusiveInfogain"] == "" ? 'N' : Convert.ToChar(frm["ExclusiveInfogain"]));
                fb.JobSummary = frm["JobSummary"] == null ? "" : frm["JobSummary"].ToString();
                fb.JobDesc = frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString();
                // fb.JobDesc = System.Net.WebUtility.HtmlEncode(frm["JobDesc"] == null ? "" : frm["JobDesc"].ToString());
                fb.DesignationID = Convert.ToInt32(frm["DesignationID"] == null || frm["DesignationID"].ToString() == "" ? "0" : frm["DesignationID"]);
                fb.ExpRangeID = Convert.ToInt32(frm["ExpRangeID"] == null || frm["ExpRangeID"].ToString() == "" ? "0" : frm["ExpRangeID"]);
                fb.TravelCost = Convert.ToDecimal(frm["TravelCost"] == null || frm["TravelCost"].ToString() == "" ? "0" : frm["TravelCost"]);
                fb.MaxHiringCost = Convert.ToDecimal(frm["MaxHiringCost"] == null || frm["MaxHiringCost"].ToString() == "" ? "0" : frm["MaxHiringCost"]);
                fb.ProjectEndDate = frm["ProjectEndDate"] == null || frm["ProjectEndDate"].ToString() == "" ? null : frm["ProjectEndDate"].ToString();
                fb.ClosedDate = frm["ClosedDate"] == null || frm["ClosedDate"].ToString() == "" ? null : frm["ClosedDate"].ToString();
                fb.QualificationID = Convert.ToInt32(frm["QualificationID"] == null || frm["QualificationID"].ToString() == "" ? "0" : frm["QualificationID"]);
                fb.SubSkillID = Convert.ToInt32(frm["SubSkillID"] == null || frm["SubSkillID"].ToString() == "" ? "0" : frm["SubSkillID"]);
                fb.AdditionalSkills = Convert.ToString(frm["AdditionalSkills"]);
                fb.EmploymentTypeID = Convert.ToInt32(frm["EmploymentTypeID"] == null || frm["EmploymentTypeID"].ToString() == "" ? "0" : frm["EmploymentTypeID"]);
                fb.Interviewer1 = frm["Interviewer1"] == null ? "" : frm["Interviewer1"].ToString();
                fb.Interviewer2 = frm["Interviewer2"] == null ? "" : frm["Interviewer2"].ToString();
                fb.IsBillable = Convert.ToChar(frm["IsBillable"] == null || frm["IsBillable"].ToString() == "" ? "N" : frm["IsBillable"]);
                fb.BookingMarginPer = Convert.ToDecimal(frm["BookingMarginPer"] == null || frm["BookingMarginPer"].ToString() == "" ? "0" : frm["BookingMarginPer"]);
                fb.ExpectedMarginPer = Convert.ToDecimal(frm["ExpectedMarginPer"] == null || frm["ExpectedMarginPer"].ToString() == "" ? "0" : frm["ExpectedMarginPer"]);
                fb.BillableRate = Convert.ToDecimal(frm["BillableRate"] == null || frm["BillableRate"].ToString() == "" ? "0" : frm["BillableRate"]);
                fb.pBillingStartDate = frm["pBillingStartDate"] == null || frm["pBillingStartDate"].ToString() == "" ? null : frm["pBillingStartDate"];
                fb.pOnboardDate = frm["pOnboardDate"] == null || frm["pOnboardDate"].ToString() == "" ? null : frm["pOnboardDate"];
                fb.IsClientIntReq = Convert.ToChar(frm["IsClientIntReq"] == null || frm["IsClientIntReq"].ToString() == "" ? "N" : frm["IsClientIntReq"]);
                fb.IsVisaReady = Convert.ToChar(frm["IsVisaReady"] == null || frm["IsVisaReady"].ToString() == "" ? "N" : frm["IsVisaReady"]);
                fb.SpecialRequest = frm["SpecialRequest"];
                fb.ReplacementFor = frm["ReplacementFor"];
                fb.ReplacementReasonID = Convert.ToInt32(frm["ReplacementReasonID"] == null || frm["ReplacementReasonID"] == "" ? "0" : frm["ReplacementReasonID"]);
                fb.Remark = frm["Remark"];
                fb.subReasonCate = frm["SubCateID"];
                fb.TalentCubeId = Convert.ToInt32(frm["TalentCubeId"] == null || frm["TalentCubeId"].ToString() == "" ? "0" : frm["TalentCubeId"]);
                fb.TalentCubeRoleId = Convert.ToInt32(frm["TalentCubeRoleId"] == null || frm["TalentCubeRoleId"].ToString() == "" ? "0" : frm["TalentCubeRoleId"]);
                fb.TalentCubeGradeId = Convert.ToInt32(frm["TalentCubeGradeId"] == null || frm["TalentCubeGradeId"].ToString() == "" ? "0" : frm["TalentCubeGradeId"]);
                fb.TCSkill1 = frm["TCSkill1"] == null ? "" : frm["TCSkill1"].ToString();
                fb.TCSkill2 = frm["TCSkill2"] == null ? "" : frm["TCSkill2"].ToString();
                fb.TCSkill3 = frm["TCSkill3"] == null ? "" : frm["TCSkill3"].ToString();
                fb.TCSkill4 = frm["TCSkill4"] == null ? "" : frm["TCSkill4"].ToString();
                fb.MandatorySkills = frm["MandatorySkills"] == null ? "" : frm["MandatorySkills"].ToString();
                fb.C2HEmpEmail = frm["C2HEmpEmail"];
                fb.BillingType = Convert.ToInt32(frm["BillingType"] == null || frm["BillingType"].ToString() == "" ? "0" : frm["BillingType"]);
                fb.goodToHaveSkill = frm["goodToHaveSkill"] == null ? "" : frm["goodToHaveSkill"].ToString();
                fb.IsCache = frm["IsCache"] == "" ? 'N' : Convert.ToChar(frm["IsCache"]);
                fb.CubePrimaySkillId = Convert.ToInt32(frm["CubePrimaySkillId"] == null || frm["CubePrimaySkillId"].ToString() == "" ? "0" : frm["CubePrimaySkillId"]);
                if (fb.EmployeeUnitID == 1 && (fb.BidType == "undefined" || fb.BidType == "" || fb.BidType == null))
                {
                    return BadRequest("Bid Type not found.");
                }
                fb.ClientWorkRequirementId = Convert.ToInt32(frm["ClientWorkRequirementId"] == null || frm["ClientWorkRequirementId"].ToString() == "" ? null : frm["ClientWorkRequirementId"]);
                fb.SubWorkRequirementId = Convert.ToInt32(frm["SubWorkRequirementId"] == null || frm["SubWorkRequirementId"].ToString() == "" ? null : frm["SubWorkRequirementId"]);
                fb.pBillingStartDateUTC = frm["pBillingStartDateUTC"];
                fb.pOnboardDateUTC = frm["pOnboardDateUTC"];
                fb.TimeZoneIana = frm["TimeZoneIana"];
                fb.TimeZoneWin = TZConvert.IanaToWindows(frm["TimeZoneIana"]);
                fb.SkillRatingType = frm["SkillRatingType"] == "" || frm["SkillRatingType"] == "undefined" || frm["SkillRatingType"] == null ? null : JsonConvert.DeserializeObject<List<SkillRatingType>>(frm["SkillRatingType"]);
                fb.RepGradeChangeReasonId = Convert.ToInt32(frm["repGradeChangeReason"] == null || frm["repGradeChangeReason"].ToString() == "" ? null : frm["repGradeChangeReason"]);
                string THID = "0";
                string Message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateTalentIDDetails(fb, claims[5].Value, ref THID, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {
                    var httpPostedFile = HttpContext.Current.Request.Files[0];
                    string tempPath = fb.AttachmentPath + "/" + result.ToString() + "/";
                    string fileSavePath = Path.Combine(tempPath, FileNamewithExtention);

                    if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);
                    if (File.Exists(fileSavePath)) File.Delete(fileSavePath);

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

                if (result >= 1)
                {
                    logger.LogResponseAsync("UpdateTalentIDDetails", "200 OK");
                    return Ok(Message);
                }
                else if (result == -10)
                {
                    return BadRequest(Message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateTalentIDDetails", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "UpdateTalentIDDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllRaisedTHIDs")]
        [HttpPost]
        public IHttpActionResult GetAllRaisedTHIDs([FromBody] SearchTHID obj)
        {
            try
            {
                logger.LogRequestAsync("GetAllRaisedTHIDs", Request);

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetAllRaisedTHIDs(claims[5].Value, obj.StatusID, obj.AccountIDs, obj.Locations, obj.Page, obj.PageSize, obj.search, obj.PracticeId, out result);

                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetAllRaisedTHIDs", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllRaisedTHIDs", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetAllRaisedTHIDs");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CloseTHID")]
        [HttpPost]
        public IHttpActionResult CloseTHID(int OfferId, string EmpId, string dateOfJoing, string Remarks = "")
        {
            try
            {
                logger.LogRequestAsync("CloseTHID", Request);

                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.CloseTHID(OfferId, EmpId, dateOfJoing, claims[5].Value, Remarks, out message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("CloseTHID", "200 OK");
                    return Ok(message);
                }
                else if (result == -3)
                {
                    return BadRequest(message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CloseTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "CloseTHID");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateOfferDetailsByTHID")]
        [HttpPost]
        public IHttpActionResult AddUpdateOfferDetailsByTHID([FromBody] List<TalentIDOffer> Obj)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateOfferDetailsByTHID", Request);

                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddUpdateOfferDetailsByTHID(Obj, claims[5].Value, out message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("AddUpdateOfferDetailsByTHID", "200 OK");
                    return Ok(message);
                }
                else
                {
                    return BadRequest(message);
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateOfferDetailsByTHID", ex);
                ExceptionLogging.SendExcepToDB(ex, SectionName, "AddUpdateOfferDetailsByTHID");
                return BadRequest("There is some error! Try again later");
            }
        }



        [Route("GetSkillByTalentCube")]
        [HttpGet]
        public IHttpActionResult GetSkillByTalentCube(int TalentCubeCode)
        {
            logger.LogRequestAsync("GetSkillByTalentCube", Request);
            try
            {
                var result = objRepo.GetSkillByTalentCube(TalentCubeCode);
                logger.LogResponseAsync("GetSkillByTalentCube", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSkillByTalentCube", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentCubeBySkill")]
        [HttpGet]
        public IHttpActionResult GetTalentCubeBySkill(int? PrimarySkillId = null, string SkillIds = null)
        {
            logger.LogRequestAsync("GetTalentCubeBySkill", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.GetTalentCubeBySkill(claims[5].Value, PrimarySkillId, SkillIds);
                logger.LogResponseAsync("GetTalentCubeBySkill", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentCubeBySkill", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetJDByTCAndRole")]
        [HttpGet]
        public IHttpActionResult GetJDByTCAndRole(int TalentCubeCode, int TCRole)
        {
            logger.LogRequestAsync("GetJDByTCAndRole", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var result = objRepo.GetJDByTCAndRole(claims[5].Value, TalentCubeCode, TCRole);
                logger.LogResponseAsync("GetJDByTCAndRole", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJDByTCAndRole", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetExperienceByGradeID")]
        [HttpGet]
        public IHttpActionResult GetExperienceByGradeID(int GradeID)
        {
            logger.LogRequestAsync("GetExperienceByGradeID", Request);
            try
            {
                var result = objRepo.GetExperienceByGradeID(GradeID);
                logger.LogResponseAsync("GetExperienceByGradeID", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetExperienceByGradeID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRaisedTHIDDetailsCount")]
        [HttpGet]
        public IHttpActionResult GetRaisedTHIDDetailsCount()
        {
            logger.LogRequestAsync("GetRaisedTHIDDetailsCount", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetRaisedTHIDDetailsCount(claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetRaisedTHIDDetailsCount", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetRaisedTHIDDetailsCount", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSubSkillsByIds")]
        [HttpGet]
        public IHttpActionResult GetSubSkillsByIds(string skillIds)
        {
            logger.LogRequestAsync("GetSubSkillsByIds", Request);
            try
            {
                var result = objRepo.GetSubSkillsByIds(skillIds);
                logger.LogResponseAsync("GetSubSkillsByIds", "200 OK");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSubSkillsByIds", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updateRequisitionDetailsPriSecRecruiter")]
        [HttpPost]
        public IHttpActionResult updateRequisitionDetailsPriSecRecruiter(updateTalentId obj)
        {
            logger.LogRequestAsync("updateRequisitionDetailsPriSecRecruiter", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.updateRequisitionDetailsPriSecRecruiter(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("updateRequisitionDetailsPriSecRecruiter", "200 OK");
                return Ok(Message);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateRequisitionDetailsPriSecRecruiter", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("updateRequisitionFullfillmentDetails")]
        [HttpPost]
        public IHttpActionResult updateRequisitionFullfillmentDetails(updateTalentId obj)
        {
            logger.LogRequestAsync("updateRequisitionFullfillmentDetails", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.updateRequisitionFullfillmentDetails(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("updateRequisitionFullfillmentDetails", "200 OK");
                return Ok(Message);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("updateRequisitionFullfillmentDetails", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetTagCommitmentHistory")]
        [HttpGet]
        public IHttpActionResult GetTagCommitmentHistory(int thid)
        {
            logger.LogRequestAsync("GetTagCommitmentHistory", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetTagCommitmentHistory(claims[5].Value, thid, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetTagCommitmentHistory", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTagCommitmentHistory", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetAllDetailsOfContractualEmployee")]
        [HttpGet]
        public IHttpActionResult GetAllDetailsOfContractualEmployee(string EmpId)
        {
            logger.LogRequestAsync("GetAllDetailsOfContractualEmployee", Request);
            try
            {
                int result;
                var data = objRepo.GetAllDetailsOfContractualEmployee(EmpId, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetAllDetailsOfContractualEmployee", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetAllDetailsOfContractualEmployee", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getEmpListForReplacement")]
        [HttpGet]
        public IHttpActionResult getEmpListForReplacement(int? ReplacementType = null)
        {
            logger.LogRequestAsync("getEmpListForReplacement", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.getEmpListForReplacement(claims[5].Value, out result, ReplacementType);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("getEmpListForReplacement", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getEmpListForReplacement", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("CheckReplacementIdCreated")]
        [HttpGet]
        public IHttpActionResult CheckReplacementIdCreated(string ReplacementEmpId)
        {
            logger.LogRequestAsync("CheckReplacementIdCreated", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.CheckReplacementIdCreated(ReplacementEmpId, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("CheckReplacementIdCreated", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CheckReplacementIdCreated", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateTalentIdStatusByWmg")]
        [HttpPost]
        public IHttpActionResult UpdateTalentIdStatusByWmg()
        {
            logger.LogRequestAsync("UpdateTalentIdStatusByWmg", Request);
            try
            {
                UpdateTalentIdStatusWmg fb = new UpdateTalentIdStatusWmg();
                var frm = HttpContext.Current.Request.Form;

                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    fb.AttachmentName = common.GetFileWithAdditionalExtention(HttpContext.Current.Request.Files[0].FileName);
                    fb.AttachmentPath = ConfigurationManager.AppSettings["TalentWmgAttachments"] + frm["THID"] + '/';
                }
                fb.THID = Convert.ToInt32(frm["THID"]);
                fb.StatusId = Convert.ToInt32(frm["StatusId"]);
                fb.CategoryId = Convert.ToInt32(frm["CategoryId"] == null || frm["CategoryId"].ToString() == "" ? "0" : frm["CategoryId"]);
                fb.ApprovedBy = Convert.ToInt32(frm["ApprovedBy"] == null || frm["ApprovedBy"].ToString() == "" ? "0" : frm["ApprovedBy"]);
                fb.Remarks = frm["Remarks"];
                fb.ApprovedOver = Convert.ToInt32(frm["ApprovedOver"] == null || frm["ApprovedOver"].ToString() == "" ? "0" : frm["ApprovedOver"]);
                fb.ApprovedOn = frm["ApprovedOn"] == null || frm["ApprovedOn"].ToString() == "" ? null : frm["ApprovedOn"];

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string message = string.Empty;
                int result = objRepo.UpdateTalentIdStatusByWmg(fb, claims[5].Value, out message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
                {
                    string filedetails = Path.GetFileNameWithoutExtension(HttpContext.Current.Request.Files[0].FileName).ToString() + Path.GetExtension(HttpContext.Current.Request.Files[0].FileName).ToString();
                    string tempPath = fb.AttachmentPath;
                    
                    var httpPostedFile = HttpContext.Current.Request.Files[0];

                    filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();

                    tempPath = fb.AttachmentPath;

                    if (!(Directory.Exists(tempPath)))
                    {
                        Directory.CreateDirectory(tempPath);
                    }
                    string fileSavePath = Path.Combine(fb.AttachmentPath, common.GetFileWithAdditionalExtention(fb.AttachmentName));
                    if (System.IO.File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }

                    byte[] fileBytes;
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        HttpContext.Current.Request.Files[0].InputStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    int encryptionResult = common.EncryptFile(fileBytes, fileSavePath);
                    if (encryptionResult != 1)
                    {
                        return InternalServerError(new Exception("Error encrypting the file."));
                    }
                }

                if (result > 0)
                {
                    logger.LogResponseAsync("UpdateTalentIdStatusByWmg", "200 OK");
                    return Ok(message);
                }
                else if (result < 0)
                {
                    return BadRequest(message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UpdateTalentIdStatusByWmg", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetIJPApplyValidation")]
        [HttpGet]
        public IHttpActionResult GetIJPApplyValidation(int thid)
        {
            logger.LogRequestAsync("GetIJPApplyValidation", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result;
                var data = objRepo.GetIJPApplyValidation(thid, claims[5].Value, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetIJPApplyValidation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPApplyValidation", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetIJPCounts")]
        [HttpGet]
        public IHttpActionResult GetIJPCounts()
        {
            logger.LogRequestAsync("GetIJPCounts", Request);
            try
            {
                var data = objRepo.GetIJPCounts();
                logger.LogResponseAsync("GetIJPCounts", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetIJPCounts", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentCubeBySubSkill")]
        [HttpGet]
        public IHttpActionResult GetTalentCubeBySubSkill(string SkillIds = null, string SkillIds2 = null)
        {
            logger.LogRequestAsync("GetTalentCubeBySubSkill", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetTalentCubeBySubSkill(claims[5].Value, SkillIds, SkillIds2);
                logger.LogResponseAsync("GetTalentCubeBySubSkill", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentCubeBySubSkill", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DownloadIJPPolicy")]
        [HttpGet]
        public HttpResponseMessage DownloadIJPPolicy()
        {
            logger.LogRequestAsync("DownloadIJPPolicy", Request);
            try
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                string filePath = ConfigurationManager.AppSettings["IJPPolicyPath"].ToString();
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

                logger.LogResponseAsync("DownloadIJPPolicy", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("DownloadIJPPolicy", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("CancelTalentIDByTHID")]
        [HttpPost]
        public IHttpActionResult CancelTalentIDByTHID(int THID, char ActionTaken, int? SubCateID = null, string Remarks = "")
        {
            logger.LogRequestAsync("CancelTalentIDByTHID", Request);
            try
            {
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.CancelTalentIDByTHID(THID, ActionTaken, Remarks, claims[5].Value, out message, SubCateID);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("CancelTalentIDByTHID", "200 OK");
                    return Ok(message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("CancelTalentIDByTHID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetBillingTypeList")]
        [HttpGet]
        public IHttpActionResult GetBillingTypeList()
        {
            logger.LogRequestAsync("GetBillingTypeList", Request);
            try
            {
                var data = objRepo.GetBillingTypeList();
                logger.LogResponseAsync("GetBillingTypeList", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetBillingTypeList", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentUndormantReasons")]
        [HttpGet]
        public IHttpActionResult GetTalentUndormantReasons()
        {
            logger.LogRequestAsync("GetTalentUndormantReasons", Request);
            try
            {
                var data = objRepo.GetTalentUndormantReasons();
                logger.LogResponseAsync("GetTalentUndormantReasons", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetTalentUndormantReasons", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetJoinedCandidateDetailsByTHID")]
        [HttpGet]
        public IHttpActionResult GetJoinedCandidateDetailsByTHID(int THID)
        {
            logger.LogRequestAsync("GetJoinedCandidateDetailsByTHID", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string EmpID = claims[5].Value;
                int result;
                var data = objRepo.GetJoinedCandidateDetailsByTHID(THID, EmpID, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                logger.LogResponseAsync("GetJoinedCandidateDetailsByTHID", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetJoinedCandidateDetailsByTHID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ReopenTalentId")]
        [HttpPost]
        public IHttpActionResult ReopenTalentId(ReopenTalentDetails obj)
        {
            logger.LogRequestAsync("ReopenTalentId", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int ActionId = 0;
                int result = objRepo.ReopenTalentId(obj, claims[5].Value, ref Message, ref ActionId);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result == 1)
                {
                    var responseObj1 = new { ActionId = ActionId, Message = Message };
                    logger.LogResponseAsync("ReopenTalentId", "200 OK");
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
                logger.LogErrorAsync("ReopenTalentId", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("ReopenTransferTalentIdNonReinitiation")]
        [HttpPost]
        public IHttpActionResult ReopenTransferTalentIdNonReinitiation(ReOpenlentIdNonReinitiation obj)
        {
            logger.LogRequestAsync("ReopenTransferTalentIdNonReinitiation", Request);
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.ReopenTransferTalentIdNonReinitiation(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("ReopenTransferTalentIdNonReinitiation", "200 OK"); 
                    return Ok(Message);
                }
                else if (result == -1)
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
                logger.LogErrorAsync("ReopenTransferTalentIdNonReinitiation", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getProfileListByLocation")]
        [HttpGet]
        public IHttpActionResult getProfileListByLocation(int? thid = 0)
        {
            logger.LogRequestAsync("getProfileListByLocation", Request);
            try
            {
                var data = objRepo.getProfileListByLocation(thid);
                logger.LogResponseAsync("getProfileListByLocation", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("getProfileListByLocation", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("getSubProfileListById")]
        [HttpGet]
        public IHttpActionResult GetSubProfileListById(int id)
        {
            logger.LogRequestAsync("GetSubProfileListById", Request);
            try
            {
                var data = objRepo.GetSubProfileListById(id);
                logger.LogResponseAsync("GetSubProfileListById", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetSubProfileListById", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UndormantTalentIDByTHID")]
        [HttpPost]
        public IHttpActionResult UndormantTalentIDByTHID(int THID, string RevisedOnbDate, int UndormantReason, string RevisedBillingDate = null)
        {
            logger.LogRequestAsync("UndormantTalentIDByTHID", Request);
            try
            {
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UndormantTalentIDByTHID(THID, RevisedOnbDate, UndormantReason, claims[5].Value, out message, RevisedBillingDate);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null) return authResult;

                if (result > 0)
                {
                    logger.LogResponseAsync("UndormantTalentIDByTHID", "200 OK");
                    return Ok(message);
                }
                else
                {
                    return BadRequest("There is some error! Try again later.");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("UndormantTalentIDByTHID", ex);
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetNumberOfOffersOnTid")]
        [HttpGet]
        public IHttpActionResult GetNumberOfOffersOnTid(int THID)
        {
            logger.LogRequestAsync("GetNumberOfOffersOnTid", Request);
            try
            {
                var data = objRepo.GetNumberOfOffersOnTid(THID);
                logger.LogResponseAsync("GetNumberOfOffersOnTid", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetNumberOfOffersOnTid", ex);
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetPrimarySkillsByTalentCube")]
        [HttpGet]
        public IHttpActionResult GetPrimarySkillsByTalentCube(int TalentCubeCode)
        {
            try
            {
                return Ok(objRepo.GetPrimarySkillsByTalentCube(TalentCubeCode));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetPrimarySkillsByTalentCube");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetAllocationDetailsByTid")]
        [HttpGet]
        public IHttpActionResult GetAllocationDetailsByTid(int THID)
        {
            try
            {

                return Ok(objRepo.GetAllocationDetailsByTid(THID));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetAllocationDetailsByTid");
                return BadRequest("There is some error! Try again later");
            }
        }
        // generate the get API method for the GetClientWorkRequirements

        [Route("GetClientWorkRequirements")]
        [HttpGet]
        public IHttpActionResult GetClientWorkRequirements()
        {
            try
            {
                return Ok(objRepo.GetClientWorkRequirements());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetClientWorkRequirements");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetSubClientWorkRequirements")]
        [HttpGet]
        public IHttpActionResult GetSubClientWorkRequirements()
        {
            try
            {
                return Ok(objRepo.GetSubClientWorkRequirements());
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetSubClientWorkRequirements");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("AddUpdateTalentOfferDetails")]
        [HttpPost]
        public IHttpActionResult AddUpdateTalentOfferDetails([FromBody] List<TalentOfferDetails> Obj)
        {
            try
            {
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.AddUpdateTalentOfferDetails(Obj, claims[5].Value, out message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    return authResult;
                }
                else if (result > 0)
                    return Ok(message);
                else
                    return BadRequest("There is some error! Try again later");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "AddUpdateTalentOfferDetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetTalentIdOfferdetails")]
        [HttpGet]
        public IHttpActionResult GetTalentIdOfferdetails(int THID, int? OfferId = null)
        {
            int result = 0;
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetTalentIdOfferdetails(THID, claims[5].Value, out result, OfferId);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    return authResult;
                }
                return Ok(data);

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Talent", "GetTalentIdOfferdetails");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("DgmCalculaterForPoland")]
        [HttpPost]
        public IHttpActionResult DgmCalculaterForPoland(dgmCalcPoland obj)
        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();

                return Ok(objRepo.DgmCalculaterForPoland(obj, claims[5].Value));
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, "Offer", "DgmCalculaterForPoland");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("UpdateCandidateOfferStatusForPoland")]
        [HttpPost]
        public IHttpActionResult UpdateCandidateOfferStatusForPoland(OfferStatusDetails obj)
        {
            try
            {
                string message = string.Empty;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                int result = objRepo.UpdateCandidateOfferStatusForPoland(obj, claims[5].Value, out message);
                var authResult = CommonController.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    return authResult;
                }
                else if (result > 0)
                    return Ok(message);
                else
                    return BadRequest("There is some error! Try again later.");
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "UpdateCandidateOfferStatusForPoland");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("GetRaisedTHIDDetailsReport")]
        [HttpPost]
       public IHttpActionResult GetRaisedTHIDDetailsReport([FromBody] GetRaisedTHIDDetails obj)

        {
            try
            {
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                return Ok(objRepo.GetRaisedTHIDDetailsReport(claims[5].Value, obj));}
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, SectionName, "GetRaisedTHIDDetailsReport");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("downloadTalentDocument")]
        [HttpGet]
        public HttpResponseMessage downloadTalentDocument(int thid, char docType)
        {
            logger.LogRequestAsync("downloadTalentDocument", Request);
            try
            {
                // Fetch document name from the database
                DataSet ds = objRepo.getTalentDocument(thid, docType);

                if (ds.Tables.Count == 0 || ds.Tables["data"].Rows.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Document not found.");
                }

                string filename = ds.Tables["data"].Rows[0][0].ToString(); // Assuming first column contains the document name

                if (string.IsNullOrEmpty(filename))
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File name not found in the database.");
                }

                // Get base path from config based on docType
                string basePath = null;

                if (docType == 'T')
                {
                    basePath = ConfigurationManager.AppSettings["TalentAttachments"];
                }
                else if (docType == 'A')
                {
                    basePath = ConfigurationManager.AppSettings["TalentApprovalAttachments"];
                }
                else if (docType == 'W')
                {
                    basePath = ConfigurationManager.AppSettings["TalentWmgAttachments"];
                }

                if (string.IsNullOrEmpty(basePath))
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Base path not configured.");
                }

                // Construct full file path
                string filePath = Path.Combine(basePath, thid.ToString(), filename);

                if (!File.Exists(filePath))
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
                }

                string fileName = Path.GetFileName(filePath);
                string mimeType = MimeMapping.GetMimeMapping(fileName);
                byte[] fileBytes; 

                if (Path.GetExtension(fileName).Equals(".dat", StringComparison.OrdinalIgnoreCase) ||
                    Path.GetExtension(fileName).Equals(".enc", StringComparison.OrdinalIgnoreCase))
                {
                    // If file is .dat or .enc, decrypt it
                    string originalFileName = common.RemoveLastExtension(fileName);

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fileBytes = new byte[fs.Length];
                        fs.Read(fileBytes, 0, fileBytes.Length);
                    }

                    byte[] decryptedBytes = common.DecryptFile(fileBytes);
                    if (decryptedBytes == null || decryptedBytes.Length == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "File decryption failed.");
                    }

                    fileBytes = decryptedBytes;
                    fileName = originalFileName;
                    mimeType = MimeMapping.GetMimeMapping(originalFileName);
                }
                else
                {
                    // Regular file reading for non .dat files
                    fileBytes = File.ReadAllBytes(filePath);
                }

                // Prepare response
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(fileBytes)
                };

                response.Content.Headers.ContentLength = fileBytes.LongLength;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileName
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

                logger.LogResponseAsync("downloadTalentDocument", "200 OK");
                return response;
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("downloadTalentDocument", ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Error processing file.");
            }
        }

    }
}
